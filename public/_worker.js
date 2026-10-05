// Cloudflare Pages: static site plus the small authenticated Apps Script proxy.
const COOKIE = 'autosol_admin_session';
const SESSION_SECONDS = 8 * 60 * 60;

const json = (value, status = 200, headers = {}) => new Response(JSON.stringify(value), {
  status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
});
const hex = (bytes) => [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
const equal = (left, right) => {
  if (typeof left !== 'string' || typeof right !== 'string' || left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index++) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
};
const sha256 = async (value) => hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
const sign = async (value, secret) => {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)));
};
const readBody = async (request) => {
  if (Number(request.headers.get('content-length') || 0) > 1024 * 1024) throw new Error('Solicitud demasiado grande.');
  return request.json();
};
const cookieValue = (request) => (request.headers.get('cookie') || '').split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
const getSession = async (request, env) => {
  if (!env.SESSION_SECRET) return null;
  const token = cookieValue(request);
  if (!token) return null;
  const [expires, role, nonce, signature, extra] = token.split('.');
  if (extra || !expires || !nonce || !signature || !['admin', 'collaborator'].includes(role) || Number(expires) <= Date.now() / 1000) return null;
  const expected = await sign(`${expires}.${role}.${nonce}`, env.SESSION_SECRET);
  return equal(expected, signature) ? { role } : null;
};
const sessionCookie = async (role, env) => {
  if (!env.SESSION_SECRET) throw new Error('Falta SESSION_SECRET.');
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const nonce = hex(crypto.getRandomValues(new Uint8Array(16)));
  const value = `${expires}.${role}.${nonce}`;
  return `${COOKIE}=${value}.${await sign(value, env.SESSION_SECRET)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`;
};
const callScript = async (action, payload, env) => {
  if (!env.APPS_SCRIPT_URL || !env.APPS_SCRIPT_SHARED_SECRET) throw new Error('Apps Script no está configurado.');
  const response = await fetch(env.APPS_SCRIPT_URL, {
    method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, payload, secret: env.APPS_SCRIPT_SHARED_SECRET }),
  });
  if (!response.ok) throw new Error(`Apps Script respondió ${response.status}.`);
  const result = await response.json();
  if (!result.ok) throw new Error(result.error || 'Apps Script rechazó la solicitud.');
  return result;
};

const routes = {
  '/api/content': { GET: ['getPublicContent', 'public'] },
  '/api/cases': { GET: ['getClientCases', 'session'] },
  '/api/cases/timings': { GET: ['getCaseTimings', 'session'], POST: ['updateCaseTimings', 'admin'] },
  '/api/admin/indicators': { GET: ['getIndicators', 'admin'] },
  '/api/admin/content': { GET: ['getAdminContent', 'admin'], POST: ['updateContent', 'admin'] },
  '/api/admin/stages': { GET: ['getStages', 'admin'], POST: ['updateStages', 'admin'] },
  '/api/admin/faqs': { GET: ['getFaqs', 'admin'], POST: ['updateFaqs', 'admin'] },
  '/api/admin/texts': { GET: ['getSiteTexts', 'admin'], POST: ['updateSiteTexts', 'admin'] },
  '/api/admin/review': { GET: ['getReview', 'admin'], POST: ['updateReview', 'admin'], PUT: ['publishReview', 'admin'] },
};

const handleApi = async (request, env, path) => {
  if (path === '/api/auth/session' && request.method === 'GET') {
    const session = await getSession(request, env);
    return json({ authenticated: !!session, role: session?.role || null });
  }
  if (path === '/api/auth/logout' && request.method === 'POST') {
    return json({ authenticated: false }, 200, { 'Set-Cookie': `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0` });
  }
  if (path === '/api/auth/login' && request.method === 'POST') {
    const { username, password } = await readBody(request);
    const user = String(username || '').trim().toLowerCase();
    const digest = typeof password === 'string' && password ? await sha256(password) : '';
    const admin = user === String(env.ADMIN_USERNAME || 'admin').trim().toLowerCase() && equal(digest, env.ADMIN_PASSWORD_SHA256);
    const collaborator = user === String(env.COLLABORATOR_USERNAME || 'administrativo').trim().toLowerCase() && equal(digest, env.COLLABORATOR_PASSWORD_SHA256);
    const role = admin ? 'admin' : collaborator ? 'collaborator' : null;
    if (!role) return json({ error: 'Credenciales inválidas.' }, 401);
    return json({ authenticated: true, role }, 200, { 'Set-Cookie': await sessionCookie(role, env) });
  }
  const route = routes[path];
  if (!route) return json({ error: 'Ruta no encontrada.' }, 404);
  const [action, access] = route[request.method] || [];
  if (!action) return json({ error: 'Método no permitido.' }, 405, { Allow: Object.keys(route).join(', ') });
  const origin = request.headers.get('origin');
  if (request.method !== 'GET' && origin && origin !== new URL(request.url).origin) return json({ error: 'Origen no permitido.' }, 403);
  const session = access === 'public' ? null : await getSession(request, env);
  if (access === 'session' && !session || access === 'admin' && session?.role !== 'admin') return json({ error: 'Se requiere una sesión autorizada.' }, 401);
  const payload = request.method === 'GET' ? {} : await readBody(request);
  if (path === '/api/admin/review' && request.method !== 'GET' && (!Array.isArray(payload.stages) || !Array.isArray(payload.faqs) || !Array.isArray(payload.validations))) return json({ error: 'Revisión incompleta.' }, 400);
  const result = await callScript(action, payload, env);
  return json(result, 200, path === '/api/content' ? { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } : {});
};

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (!path.startsWith('/api/')) return env.ASSETS.fetch(request);
    try { return await handleApi(request, env, path); }
    catch (error) { return json({ error: error instanceof Error ? error.message : 'Servicio no disponible.' }, 503); }
  },
};
