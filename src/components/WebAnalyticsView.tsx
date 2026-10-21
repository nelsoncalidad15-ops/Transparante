import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, BarChart3, BookOpen, HelpCircle, MousePointerClick, RefreshCw, Search, TrendingUp } from 'lucide-react';
import { useData } from '../context/DataContext';
import { buildWebMetrics, filterWebRows, rank, sectionNames, type RankedItem, type WebRow } from './webAnalyticsMetrics';

const card = 'rounded-2xl border border-slate-200 bg-white shadow-sm';
const eventNames: Record<string, string> = {
  page_open: 'Aperturas', section_view: 'Secciones visitadas', article_view: 'Artículos abiertos',
  stage_open: 'Etapas abiertas', faq_open: 'Preguntas abiertas', search: 'Búsquedas con resultado',
  search_empty: 'Búsquedas sin resultado', contact_menu: 'Menús de contacto', contact_click: 'Clics de contacto',
};

function Bars({ items, empty, limit = 8 }: { items: RankedItem[]; empty: string; limit?: number }) {
  const visible = items.slice(0, limit);
  const max = Math.max(1, ...visible.map(item => item.count));
  if (!visible.length) return <p className="py-8 text-sm text-slate-500">{empty}</p>;
  return <div className="space-y-4">{visible.map(item => <div key={item.label}>
    <div className="flex items-start justify-between gap-3 text-sm"><span className="min-w-0 break-words font-medium text-slate-700">{item.label}</span><span className="shrink-0 tabular-nums text-[#002244]"><strong>{item.count}</strong><span className="ml-2 text-xs text-slate-500">{item.percent} %</span></span></div>
    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#008cff]" style={{ width: `${Math.max(3, 100 * item.count / max)}%` }} /></div>
  </div>)}</div>;
}

export function WebAnalyticsView() {
  const { articles, faqs, stages } = useData();
  const [rows, setRows] = useState<WebRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [period, setPeriod] = useState('30');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [type, setType] = useState('');
  const [section, setSection] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/web-analytics', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok || !Array.isArray(result.data?.events)) throw new Error(result.error || 'La API no devolvió eventos válidos.');
      setRows(result.data.events);
      setUpdatedAt(result.data.updatedAt || '');
    } catch (cause) {
      setRows([]);
      setError(cause instanceof Error ? cause.message : 'No se pudieron leer los eventos.');
    } finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  const invalidRange = period === 'custom' && !!from && !!to && from > to;
  const filtered = useMemo(() => filterWebRows(rows, { period, from, to, type, section }), [rows, period, from, to, type, section]);
  const metrics = useMemo(() => buildWebMetrics(filtered, { articles, faqs, stages }), [filtered, articles, faqs, stages]);
  const activeInterests = metrics.interests.filter(item => item.count > 0);
  const topInterest = activeInterests[0];
  const lowInterest = activeInterests.length > 1 ? [...activeInterests].sort((a, b) => a.count - b.count || a.label.localeCompare(b.label, 'es'))[0] : undefined;
  const mainCards = [
    { label: 'Visitas registradas', value: String(metrics.visits.length), note: 'Aperturas de página', icon: ArrowUpRight },
    { label: 'Tema más consultado', value: topInterest?.label || 'Sin datos', note: topInterest ? `${topInterest.count} aperturas de contenido` : 'Faltan aperturas', icon: TrendingUp },
    { label: 'Tema menos consultado', value: lowInterest?.label || 'Sin comparación', note: lowInterest ? `${lowInterest.count} aperturas entre temas consultados` : 'Se requieren dos temas', icon: BookOpen },
    { label: 'Búsquedas realizadas', value: String(metrics.searches.length), note: 'Sin guardar frases originales', icon: Search },
    { label: 'Clics de contacto', value: String(metrics.contacts.length), note: 'No equivale a consultas atendidas', icon: MousePointerClick },
  ];
  const daily = rank(metrics.visits.map(row => new Date(row.date).toLocaleDateString('en-CA'))).sort((a, b) => a.label.localeCompare(b.label));

  return <section className="space-y-6 pb-10">
    <header className="rounded-3xl bg-[#002244] p-6 text-white sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-sky-200"><BarChart3 className="h-4 w-4" /> Calidad · navegación</p><h1 className="mt-3 text-2xl font-bold sm:text-3xl">Analítica Web | Autosol Transparente</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">Un vistazo a lo que consultan los clientes y a los contenidos que conviene revisar.</p></div>
        <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-4 py-2 text-sm font-semibold hover:bg-white/10 disabled:opacity-60"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Actualizar</button></div>
    </header>
    {import.meta.env.VITE_AUTOSOL_LOCAL_DEMO === '1' && <p className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950">Vista de prueba local: los datos se guardan en memoria y no se consulta la conexión existente de Google Sheets.</p>}
    {import.meta.env.VITE_AUTOSOL_LOCAL_REAL === '1' && <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">Vista local conectada a Google Sheets mediante Apps Script. Las nuevas interacciones también se guardarán allí.</p>}
    <div className={`${card} flex flex-wrap items-center gap-3 p-4`}>
      <span className="mr-1 text-xs font-bold uppercase tracking-wider text-slate-500">Período</span>
      <select aria-label="Período" value={period} onChange={event => setPeriod(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"><option value="7">Últimos 7 días</option><option value="30">Últimos 30 días</option><option value="90">Últimos 90 días</option><option value="custom">Rango personalizado</option></select>
      {period === 'custom' && <><input aria-label="Desde" type="date" value={from} onChange={event => setFrom(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" /><input aria-label="Hasta" type="date" value={to} onChange={event => setTo(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" /></>}
      <select aria-label="Tipo de evento" value={type} onChange={event => setType(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"><option value="">Todos los eventos</option>{[...new Set<string>(rows.map(row => row.type))].map(value => <option key={value} value={value}>{eventNames[value] || value}</option>)}</select>
      <select aria-label="Sección" value={section} onChange={event => setSection(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"><option value="">Todas las secciones</option>{[...new Set<string>(rows.map(row => row.section))].map(value => <option key={value} value={value}>{sectionNames[value] || value}</option>)}</select>
    </div>
    {invalidRange && <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">La fecha inicial debe ser anterior a la fecha final.</p>}
    {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">No se pudieron leer datos reales: {error}</p>}
    {loading ? <p className={`${card} p-6 text-sm text-slate-600`}>Cargando indicadores…</p> : !error && !invalidRange && <>
      {!filtered.length && <p className={`${card} p-6 text-sm text-slate-700`}>Todavía no hay eventos para este período y estos filtros. Los indicadores aparecerán cuando haya registros.</p>}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{mainCards.map(({ label, value, note, icon: Icon }) => <article key={label} className={`${card} p-5`}><div className="flex items-start justify-between gap-2"><p className="text-sm font-medium text-slate-600">{label}</p><Icon className="h-4 w-4 shrink-0 text-[#008cff]" /></div><strong className="mt-3 block break-words text-xl leading-snug text-[#002244] sm:text-2xl">{value}</strong><p className="mt-2 text-xs text-slate-500">{note}</p></article>)}</div>
      <p className="text-xs text-slate-600">Una visita registrada es una apertura. No representa usuarios únicos ni sesiones. Las búsquedas y los clics se cuentan por separado.</p>
      <article className={`${card} p-5 sm:p-7`}><div className="mb-6"><p className="text-xs font-bold uppercase tracking-wider text-[#008cff]">Interés por contenido</p><h2 className="mt-1 text-xl font-bold text-[#002244]">¿Qué información buscan más nuestros clientes?</h2><p className="mt-2 text-sm text-slate-600">Aperturas de artículos, etapas y preguntas frecuentes agrupadas por tema. Cada apertura se cuenta una sola vez; las búsquedas se muestran aparte.</p></div><Bars items={metrics.interests} empty="Todavía no hay aperturas de contenido para comparar temas." /></article>
      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]"><article className={`${card} p-5 sm:p-7`}><h2 className="text-xl font-bold text-[#002244]">¿Dónde interactúan más?</h2><p className="mt-2 mb-6 text-sm text-slate-600">Aperturas de contenido y uso de contacto por sección; las visitas a una sección no se cuentan como clics.</p><Bars items={metrics.sectionInteractions} empty="Aún no hay interacciones por sección." /></article><article className={`${card} p-5 sm:p-7`}><h2 className="text-xl font-bold text-[#002244]">Elementos más utilizados</h2><p className="mt-2 mb-6 text-sm text-slate-600">Artículos, etapas, preguntas y botones de contacto con eventos registrados.</p><Bars items={metrics.elements} empty="Todavía no hay elementos abiertos o pulsados." limit={6} /></article></div>
      <div className="grid gap-5 xl:grid-cols-2"><article className={`${card} p-5 sm:p-7`}><h2 className="text-xl font-bold text-[#002244]">¿Qué necesitan saber nuestros clientes?</h2><p className="mt-2 text-sm text-slate-600">Categorías de búsqueda, sin guardar el texto ingresado.</p><div className="mt-6"><Bars items={metrics.searchTopics} empty="Todavía no hay búsquedas." /></div><div className="mt-7 border-t border-slate-100 pt-5"><p className="mb-4 flex items-center gap-2 text-sm font-bold text-[#002244]"><HelpCircle className="h-4 w-4" /> Búsquedas sin resultado: {metrics.missed.length}</p><Bars items={metrics.missedTopics} empty="No se registraron búsquedas sin resultado." limit={5} /></div></article>
        <article className={`${card} p-5 sm:p-7`}><h2 className="text-xl font-bold text-[#002244]">¿Cuándo recurren a un asesor?</h2><p className="mt-2 text-sm text-slate-600">Clics hacia los canales. Un clic no confirma que una consulta haya sido atendida.</p><div className="mt-6"><Bars items={metrics.contactChannels} empty="Todavía no hay clics de contacto." /></div><div className="mt-7 border-t border-slate-100 pt-5"><p className="mb-4 text-sm font-bold text-[#002244]">Desde qué secciones</p><Bars items={metrics.contactSections} empty="Sin secciones de origen registradas." /></div></article></div>
      <article className={`${card} p-5 sm:p-7`}><p className="text-xs font-bold uppercase tracking-wider text-[#008cff]">Calidad y mejora continua</p><h2 className="mt-1 text-xl font-bold text-[#002244]">¿Dónde deberíamos reforzar la información?</h2>{metrics.insights.length ? <div className="mt-6 grid gap-4 md:grid-cols-2">{metrics.insights.map(item => <div key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-5"><h3 className="font-bold text-[#002244]">{item.title}</h3><p className="mt-2 text-sm text-slate-700"><strong>Dato:</strong> {item.evidence}</p><p className="mt-2 text-sm text-slate-700"><strong>Acción sugerida:</strong> {item.action}</p></div>)}</div> : <p className="mt-4 text-sm text-slate-600">Todavía no hay información suficiente para identificar tendencias confiables. Muchas visitas, por sí solas, no indican insatisfacción.</p>}</article>
      <details className={`${card} p-5`}><summary className="cursor-pointer font-semibold text-[#002244]">Ver detalle de contenidos y evolución diaria</summary><div className="mt-5 grid gap-5 lg:grid-cols-2"><div><h3 className="mb-4 font-bold text-[#002244]">Preguntas abiertas</h3><Bars items={metrics.faqRank} empty="Sin preguntas abiertas." /></div><div><h3 className="mb-4 font-bold text-[#002244]">Aperturas por día</h3><Bars items={daily} empty="Sin aperturas registradas." /></div></div></details>
      {updatedAt && <p className="text-xs text-slate-500">Última lectura: {new Date(updatedAt).toLocaleString('es-AR')}</p>}
    </>}
  </section>;
}
