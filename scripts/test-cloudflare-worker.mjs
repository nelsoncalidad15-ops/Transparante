import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import worker from '../public/_worker.js';

const password = 'clave-de-prueba-larga-y-aleatoria';
const env = {
  ADMIN_USERNAME: 'admin',
  ADMIN_PASSWORD_SHA256: createHash('sha256').update(password).digest('hex'),
  SESSION_SECRET: 'session-secret-de-prueba-de-mas-de-32-caracteres',
  APPS_SCRIPT_URL: 'https://example.test/exec',
  APPS_SCRIPT_SHARED_SECRET: 'secreto-de-prueba',
  ASSETS: { fetch: async () => new Response('sitio') },
};
const originalFetch = globalThis.fetch;
globalThis.fetch = async (_url, options) => {
  const body = JSON.parse(options.body);
  assert.equal(body.secret, env.APPS_SCRIPT_SHARED_SECRET);
  return new Response(JSON.stringify({ ok: true, data: body.action === 'getReview' ? { validations: [] } : { articles: [] } }), { headers: { 'Content-Type': 'application/json' } });
};
const call = (path, init = {}) => worker.fetch(new Request(`https://autosol.test${path}`, init), env);

try {
  assert.equal((await call('/')).status, 200);
  assert.equal((await call('/api/content')).status, 200);
  assert.equal((await call('/api/admin/review')).status, 401);
  const login = await call('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://autosol.test' }, body: JSON.stringify({ username: 'admin', password }) });
  assert.equal(login.status, 200);
  const plainPasswordConfig = { ...env, ADMIN_PASSWORD_SHA256: undefined, ADMIN_PASSWORD: password, SESSION_SECRET: undefined };
  const plainLogin = await worker.fetch(new Request('https://autosol.test/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'admin', password }) }), plainPasswordConfig);
  assert.equal(plainLogin.status, 200);
  const plainCookie = plainLogin.headers.get('set-cookie').split(';')[0];
  const plainSession = await worker.fetch(new Request('https://autosol.test/api/auth/session', { headers: { Cookie: plainCookie } }), plainPasswordConfig);
  assert.equal((await plainSession.json()).authenticated, true);
  const shortPasswordConfig = { ...plainPasswordConfig, ADMIN_PASSWORD: 'clave-corta' };
  const rejected = await worker.fetch(new Request('https://autosol.test/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'admin', password: 'clave-corta' }) }), shortPasswordConfig);
  assert.equal(rejected.status, 401);
  const noScriptSecret = await worker.fetch(new Request('https://autosol.test/api/content'), { ...env, APPS_SCRIPT_SHARED_SECRET: undefined });
  assert.equal(noScriptSecret.status, 503);
  const cookie = login.headers.get('set-cookie').split(';')[0];
  assert.equal((await call('/api/auth/session', { headers: { Cookie: cookie } })).status, 200);
  assert.equal((await call('/api/admin/review', { headers: { Cookie: cookie } })).status, 200);
  assert.equal((await call('/api/admin/review', { method: 'POST', headers: { Cookie: cookie, Origin: 'https://otro.test', 'Content-Type': 'application/json' }, body: JSON.stringify({ stages: [], faqs: [], validations: [] }) })).status, 403);
  assert.equal((await call('/api/admin/review', { method: 'POST', headers: { Cookie: cookie, Origin: 'https://autosol.test', 'Content-Type': 'application/json' }, body: JSON.stringify({ stages: [], faqs: [], validations: [] }) })).status, 200);
  console.log('Cloudflare API: rutas públicas, sesión, permisos y revisión correctos.');
} finally {
  globalThis.fetch = originalFetch;
}
