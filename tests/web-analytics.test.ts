import assert from 'node:assert/strict';
import { test } from 'node:test';
import crypto from 'node:crypto';
import handler from '../netlify/functions/api';
import { searchCategory, track, flush } from '../src/utils/webAnalytics';
import { buildWebMetrics, filterWebRows, type WebRow } from '../src/components/webAnalyticsMetrics';

test('los filtros de fecha, sección y evento usan los registros reales', () => {
  const rows: WebRow[] = [
    { date: '2026-10-20T12:00:00', type: 'search', section: 'search', category: 'Entrega', detail: '' },
    { date: '2026-10-10T12:00:00', type: 'contact_click', section: 'process', category: 'WhatsApp', detail: '' },
  ];
  assert.equal(filterWebRows(rows, { period: '7', from: '', to: '', type: '', section: '' }, new Date('2026-10-21T12:00:00')).length, 1);
  assert.equal(filterWebRows(rows, { period: 'custom', from: '2026-10-01', to: '2026-10-31', type: 'contact_click', section: 'process' }).length, 1);
  assert.equal(filterWebRows(rows, { period: 'custom', from: '2026-10-31', to: '2026-10-01', type: '', section: '' }).length, 0);
});

test('el tablero separa aperturas de contenido, búsquedas y visitas', () => {
  const date = new Date().toISOString();
  const rows: WebRow[] = [
    { date, type: 'page_open', section: 'home', category: '', detail: '' },
    { date, type: 'section_view', section: 'process', category: '', detail: '' },
    { date, type: 'stage_open', section: 'process', category: '', detail: 'patentamiento' },
    { date, type: 'search_empty', section: 'search', category: 'Patentamiento', detail: '' },
    { date, type: 'contact_click', section: 'process', category: 'WhatsApp', detail: '' },
  ];
  const metrics = buildWebMetrics(rows, { articles: [], faqs: [], stages: [] });
  assert.equal(metrics.visits.length, 1);
  assert.equal(metrics.contentOpens.length, 1);
  assert.equal(metrics.interests.find(item => item.label === 'Patentamiento')?.count, 1);
  assert.equal(metrics.searches.length, 1);
  assert.equal(metrics.missed.length, 1);
  assert.equal(metrics.contacts.length, 1);
  assert.equal(metrics.contactSections[0].label, 'Mi proceso de compra');
  assert.equal(metrics.insights.length, 0);
});

test('las búsquedas se convierten en categorías sin transmitir texto libre', async () => {
  const originalFetch = globalThis.fetch;
  let sent: any;
  globalThis.fetch = async (_url, init) => {
    sent = JSON.parse(String(init?.body));
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  };
  try {
    assert.equal(searchCategory('¿Cuándo me entregan el auto?'), 'Entrega');
    track({ type: 'search', section: 'search', category: searchCategory('Mi DNI 12345678 y entrega') });
    await flush();
    assert.deepEqual(sent.events, [{ type: 'search', section: 'search', category: 'Entrega' }]);
  } finally { globalThis.fetch = originalFetch; }
});

test('el endpoint privado exige una sesión admin válida', async () => {
  process.env.SESSION_SECRET = 'local-test-secret';
  const url = 'https://example.test/.netlify/functions/api/admin/web-analytics';
  assert.equal((await handler(new Request(url))).status, 401);
  const expires = Math.floor(Date.now() / 1000) + 60;
  const value = `${expires}.admin.localnonce`;
  const signature = crypto.createHmac('sha256', process.env.SESSION_SECRET).update(value).digest('base64url');
  process.env.APPS_SCRIPT_URL = 'https://example.test/script';
  process.env.APPS_SCRIPT_SHARED_SECRET = 'test-shared-secret';
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ ok: true, data: { events: [] } }));
  try {
    const response = await handler(new Request(url, { headers: { cookie: `autosol_admin_session=${value}.${signature}` } }));
    assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).data.events, []);
  } finally { globalThis.fetch = originalFetch; }
});
