import crypto from 'node:crypto';

const cookie = 'autosol_admin_session';
const maxAge = 8 * 60 * 60;
const json = (value: unknown, status = 200, headers: Record<string, string> = {}) => new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers } });
const sign = (value: string) => crypto.createHmac('sha256', process.env.SESSION_SECRET || '').update(value).digest('base64url');
const session = (request: Request) => {
  if (!process.env.SESSION_SECRET) return null;
  const token = request.headers.get('cookie')?.split(';').map(x => x.trim()).find(x => x.startsWith(cookie + '='))?.slice(cookie.length + 1);
  const parts = token?.split('.') || [];
  if (parts.length !== 4) return null;
  const [expires, role, nonce, signature] = parts;
  if (!/^\d+$/.test(expires) || Number(expires) <= Date.now() / 1000 || !['admin', 'collaborator'].includes(role) || !nonce || !signature) return null;
  const expected = sign(`${expires}.${role}.${nonce}`);
  if (expected.length !== signature.length) return null;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature)) ? role : null;
};
const body = async (request: Request) => {
  if (Number(request.headers.get('content-length') || 0) > 12000) throw new Error('Solicitud demasiado grande.');
  const raw = await request.text();
  if (raw.length > 12000) throw new Error('Solicitud demasiado grande.');
  return raw ? JSON.parse(raw) : {};
};
const script = async (action: string, payload: unknown = {}) => {
  const endpoint = process.env.APPS_SCRIPT_URL;
  const secret = process.env.APPS_SCRIPT_SHARED_SECRET;
  if (!endpoint || !secret) throw new Error('Apps Script no está configurado.');
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action, payload, secret }) });
  if (!response.ok) throw new Error('Apps Script no está disponible.');
  const result = await response.json();
  if (!result.ok) throw new Error(result.error || 'Apps Script rechazó la solicitud.');
  return result;
};
const verify = async (password: string, stored: string) => {
  const [algorithm, salt, expected] = stored.split('$');
  if (algorithm !== 'scrypt' || !salt || !expected || !password) return false;
  const actual = await new Promise<Buffer>((resolve, reject) => crypto.scrypt(password, salt, 64, (error, key) => error ? reject(error) : resolve(key as Buffer)));
  const expectedBuffer = Buffer.from(expected, 'hex');
  return actual.length === expectedBuffer.length && crypto.timingSafeEqual(actual, expectedBuffer);
};
const routes: Record<string, Record<string, [string, 'public' | 'session' | 'admin']>> = {
  'content': { GET: ['getPublicContent', 'public'] },
  'cases': { GET: ['getClientCases', 'session'] },
  'cases/timings': { GET: ['getCaseTimings', 'session'], POST: ['updateCaseTimings', 'admin'] },
  'admin/indicators': { GET: ['getIndicators', 'admin'] },
  'admin/web-analytics': { GET: ['getWebEvents', 'admin'] },
  'admin/content': { GET: ['getAdminContent', 'admin'], POST: ['updateContent', 'admin'] },
  'admin/stages': { GET: ['getStages', 'admin'], POST: ['updateStages', 'admin'] },
  'admin/faqs': { GET: ['getFaqs', 'admin'], POST: ['updateFaqs', 'admin'] },
  'admin/texts': { GET: ['getSiteTexts', 'admin'], POST: ['updateSiteTexts', 'admin'] },
  'admin/review': { GET: ['getReview', 'admin'], POST: ['updateReview', 'admin'], PUT: ['publishReview', 'admin'] },
};
export default async function handler(request: Request) {
  const path = new URL(request.url).pathname.replace(/^\/(?:\.netlify\/functions\/api|api)\/?/, '');
  const role = session(request);
  if (path === 'auth/session' && request.method === 'GET') return json({ authenticated: !!role, role });
  if (path === 'auth/logout' && request.method === 'POST') return json({ authenticated: false }, 200, { 'Set-Cookie': `${cookie}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0` });
  if (request.method !== 'GET' && request.headers.get('origin') && request.headers.get('origin') !== new URL(request.url).origin) return json({ error: 'Origen no permitido.' }, 403);
  try {
    if (path === 'auth/login' && request.method === 'POST') {
      const { username, password } = await body(request);
      if (typeof username !== 'string' || typeof password !== 'string') return json({ error: 'Credenciales inválidas.' }, 401);
      const user = username.trim().toLowerCase();
      const nextRole = user === (process.env.ADMIN_USERNAME || 'admin').toLowerCase() && await verify(password, process.env.ADMIN_PASSWORD_HASH || '') ? 'admin' : user === (process.env.COLLABORATOR_USERNAME || 'administrativo').toLowerCase() && await verify(password, process.env.COLLABORATOR_PASSWORD_HASH || '') ? 'collaborator' : null;
      if (!nextRole || !process.env.SESSION_SECRET) return json({ error: 'Credenciales inválidas.' }, 401);
      const value = `${Math.floor(Date.now() / 1000) + maxAge}.${nextRole}.${crypto.randomBytes(16).toString('base64url')}`;
      return json({ authenticated: true, role: nextRole }, 200, { 'Set-Cookie': `${cookie}=${value}.${sign(value)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}` });
    }
    if (path === 'web-events' && request.method === 'POST') {
      const payload = await body(request);
      const events = payload.events;
      if (!Array.isArray(events) || events.length < 1 || events.length > 10) return json({ error: 'Lote inválido.' }, 400);
      return json(await script('recordWebEvents', { events }));
    }
    const route = routes[path];
    if (!route) return json({ error: 'Ruta no encontrada.' }, 404);
    const entry = route[request.method];
    if (!entry) return json({ error: 'Método no permitido.' }, 405);
    const [action, access] = entry;
    if (access === 'admin' && role !== 'admin' || access === 'session' && !role) return json({ error: 'Se requiere una sesión autorizada.' }, 401);
    const payload = request.method === 'GET' ? {} : await body(request);
    return json(await script(action, payload));
  } catch (error) { return json({ error: error instanceof Error ? error.message : 'Servicio no disponible.' }, 503); }
}
