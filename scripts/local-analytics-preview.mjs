import crypto from 'node:crypto';
import http from 'node:http';
import dotenv from 'dotenv';
import { createServer } from 'vite';

dotenv.config({ path: '.env.local', quiet: true });
const realMode = process.argv.includes('--real');
if (realMode && (!process.env.APPS_SCRIPT_URL || !process.env.APPS_SCRIPT_SHARED_SECRET)) {
  console.error('Faltan APPS_SCRIPT_URL y APPS_SCRIPT_SHARED_SECRET en .env.local o en el entorno local.');
  process.exit(1);
}

const host = '127.0.0.1';
const port = 3000;
const password = crypto.randomBytes(12).toString('base64url');
const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.scryptSync(password, salt, 64).toString('hex');
const events = [];
const allowedTypes = new Set(['page_open', 'section_view', 'article_view', 'stage_open', 'faq_open', 'search', 'search_empty', 'contact_menu', 'contact_click']);
const allowedSections = new Set(['home', 'process', 'documents', 'times', 'financing', 'delivery', 'dictionary', 'library', 'faq', 'search', 'article-detail']);
const allowedCategories = new Set(['', 'Entrega', 'Patentamiento', 'Gestoría', 'Facturación', 'Financiación', 'Documentación', 'Plazos', 'Seguro', 'Otros', 'WhatsApp', 'Teléfono', 'Ubicación']);

process.env.SESSION_SECRET = crypto.randomBytes(32).toString('hex');
process.env.ADMIN_USERNAME = 'admin';
process.env.ADMIN_PASSWORD_HASH = `scrypt$${salt}$${hash}`;
if (!realMode) {
  process.env.APPS_SCRIPT_URL = 'https://script.google.com/macros/s/LOCAL_PREVIEW/exec';
  process.env.APPS_SCRIPT_SHARED_SECRET = crypto.randomBytes(32).toString('hex');
  process.env.VITE_AUTOSOL_LOCAL_DEMO = '1';
} else {
  process.env.VITE_AUTOSOL_LOCAL_REAL = '1';
  let scriptUrl;
  try { scriptUrl = new URL(process.env.APPS_SCRIPT_URL); }
  catch { console.error('APPS_SCRIPT_URL debe ser la URL HTTPS /exec de la aplicación web de Apps Script.'); process.exit(1); }
  if (scriptUrl.protocol !== 'https:' || scriptUrl.hostname !== 'script.google.com' || !/^\/macros\/s\/[^/]+\/exec\/?$/.test(scriptUrl.pathname)) {
    console.error('APPS_SCRIPT_URL debe ser la URL HTTPS /exec de la aplicación web de Apps Script.');
    process.exit(1);
  }
  const response = await fetch(process.env.APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: 'getWebEvents', payload: {}, secret: process.env.APPS_SCRIPT_SHARED_SECRET }),
    signal: AbortSignal.timeout(15000),
  });
  const result = await response.json();
  if (!response.ok || !result.ok || !Array.isArray(result.data?.events)) {
    console.error('Apps Script no devolvió EventosWeb. Revisá la URL, el secreto y la versión desplegada del script.');
    process.exit(1);
  }
  console.log(`Apps Script verificado: ${result.data.events.length} eventos disponibles.`);
}

const realFetch = globalThis.fetch;
if (!realMode) globalThis.fetch = async (input, init) => {
  if (String(input) !== process.env.APPS_SCRIPT_URL) return realFetch(input, init);
  const request = JSON.parse(String(init?.body || '{}'));
  if (request.secret !== process.env.APPS_SCRIPT_SHARED_SECRET) return Response.json({ ok: false, error: 'No autorizado.' });
  if (request.action === 'recordWebEvents') {
    const batch = request.payload?.events;
    if (!Array.isArray(batch) || !batch.length || batch.length > 10 || batch.some(event =>
      !event || !allowedTypes.has(event.type) || !allowedSections.has(event.section) || !allowedCategories.has(event.category || '') ||
      typeof (event.detail || '') !== 'string' || !/^[a-zA-Z0-9_-]{0,80}$/.test(event.detail || '')
    )) return Response.json({ ok: false, error: 'Evento inválido.' });
    for (const event of batch) events.push({ date: new Date().toISOString(), type: event.type, section: event.section, category: event.category || '', detail: event.detail || '' });
    return Response.json({ ok: true, data: { saved: batch.length } });
  }
  if (request.action === 'getWebEvents') return Response.json({ ok: true, data: { events, updatedAt: new Date().toISOString() } });
  if (request.action === 'getIndicators') return Response.json({ ok: true, data: { indicators: [], updatedAt: new Date().toISOString() } });
  if (request.action === 'getPublicContent') return Response.json({ ok: true, data: {} });
  return Response.json({ ok: false, error: 'Esta acción requiere Apps Script real.' });
};

const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'spa' });
const { default: api } = await vite.ssrLoadModule('/netlify/functions/api.ts');
const server = http.createServer(async (req, res) => {
  if (!req.url?.startsWith('/api/')) return vite.middlewares(req, res);
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const payload = Buffer.concat(chunks);
    const request = new Request(`http://${host}:${port}${req.url}`, {
      method: req.method,
      headers: req.headers,
      body: payload.length ? payload : undefined,
    });
    const response = await api(request);
    const headers = Object.fromEntries(response.headers);
    if (headers['set-cookie']) headers['set-cookie'] = headers['set-cookie'].replace('; Secure', '');
    res.writeHead(response.status, headers);
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Error local.' }));
  }
});
server.listen(port, host, () => {
  console.log(`Vista local: http://${host}:${port}/`);
  console.log(`Acceso interno: http://${host}:${port}/#acceso-interno`);
  console.log(`Usuario: admin`);
  console.log(`Contraseña temporal: ${password}`);
  console.log(realMode ? 'Origen de datos: Google Sheets mediante Apps Script.' : 'Los eventos se guardan solo en memoria y se borran al cerrar este proceso.');
});
