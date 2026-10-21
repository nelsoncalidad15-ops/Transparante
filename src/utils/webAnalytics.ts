export type WebEvent = {
  type: 'page_open' | 'section_view' | 'article_view' | 'stage_open' | 'faq_open' | 'search' | 'search_empty' | 'contact_menu' | 'contact_click';
  section: string;
  category?: string;
  detail?: string;
};

const allowedSections = new Set(['home', 'process', 'documents', 'times', 'financing', 'delivery', 'dictionary', 'library', 'faq', 'search', 'article-detail']);
const queue: WebEvent[] = [];
let timer: ReturnType<typeof setTimeout> | undefined;

export function searchCategory(query: string): string {
  const value = query.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const groups: [string, RegExp][] = [
    ['Entrega', /entrega|retiro|turno|unidad/], ['Patentamiento', /patent|chapa|dominio|registro/],
    ['Gestoría', /gestor|tramite|transferencia/], ['Facturación', /factur|comprobant/],
    ['Financiación', /financ|credito|cuota|pago/], ['Documentación', /document|papel|requisito/],
    ['Plazos', /tiempo|plazo|demora|cuando|fecha/], ['Seguro', /seguro|poliza/],
  ];
  return groups.find(([, pattern]) => pattern.test(value))?.[0] || 'Otros';
}

export function track(event: WebEvent) {
  if (!allowedSections.has(event.section)) return;
  queue.push(event);
  if (queue.length >= 10) void flush();
  else if (!timer) timer = setTimeout(() => void flush(), 8000);
}

export async function flush() {
  if (timer) clearTimeout(timer);
  timer = undefined;
  if (!queue.length) return;
  const batch = queue.splice(0, 10);
  try {
    const response = await fetch('/api/web-events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ events: batch }), keepalive: true });
    if (!response.ok || !response.headers.get('content-type')?.includes('application/json') || !(await response.json()).ok) throw new Error('No disponible');
  } catch { /* La analítica nunca interrumpe la navegación. */ }
  if (queue.length) timer = setTimeout(() => void flush(), 1000);
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => { void flush(); });
}
