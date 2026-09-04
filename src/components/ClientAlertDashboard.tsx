import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeft, CheckCircle2, Clock3, MessageCircle, RefreshCw, Save, Settings2, X } from 'lucide-react';
import type { CaseStatus, DeliveryCase, StageTiming } from '../types';

type EnrichedCase = DeliveryCase & { status: CaseStatus; days: number; timing?: StageTiming; baseDate: string; reason: string };
interface Props { onExit: () => void; }

const defaultTimings: StageTiming[] = [
  { key: 'facturado', label: 'Facturado → Patentado', description: 'Desde Fecha Facturación', warningDays: 10, limitDays: 15, message: 'Hola {cliente}, te escribimos de Autosol por tu {modelo}. Estamos avanzando con la gestión de patentamiento y queremos mantenerte informado. Ante cualquier consulta, estamos a disposición.' },
  { key: 'patentado', label: 'Patentado → Turno', description: 'Desde Fecha Últ Modificación', warningDays: 4, limitDays: 7, message: 'Hola {cliente}, tu {modelo} ya se encuentra patentado. Estamos coordinando los próximos pasos para tu entrega y te mantendremos informado/a.' },
  { key: 'preturno', label: 'Preturno → Turno', description: 'Desde Fecha Últ Modificación', warningDays: 3, limitDays: 5, message: 'Hola {cliente}, estamos en la etapa final de preparación de tu {modelo}. En breve vamos a contactarte para coordinar el turno de entrega.' },
  { key: 'turno', label: 'Turno → Entrega', description: 'Desde Fecha Gestión Turno', warningDays: 2, limitDays: 3, message: 'Hola {cliente}, queremos confirmar el avance de la entrega de tu {modelo}. Estamos revisando el turno y te informaremos la próxima novedad a la brevedad.' },
];

const demoCases = (): DeliveryCase[] => {
  const dateAgo = (days: number) => { const date = new Date(); date.setDate(date.getDate() - days); return date.toISOString().slice(0, 10); };
  return [
    { id: 'demo-1', clientName: 'Olga Quiroga', phone: 'M:0387-154570503', vehicleModel: 'Tera 1.6 MSI Trendline MY 26', currentStatus: 'Facturado', invoiceDate: dateAgo(22), appointmentDate: '', lastModifiedDate: dateAgo(22), operationNumber: '66760', advisor: 'Equipo Autosol' },
    { id: 'demo-2', clientName: 'Celina Casimiro', phone: 'M:0387-155498975', vehicleModel: 'Nivus Sense 170 TSI MT MY 27', currentStatus: 'Patentado', invoiceDate: dateAgo(12), appointmentDate: '', lastModifiedDate: dateAgo(5), operationNumber: '66774', advisor: 'Equipo Autosol' },
    { id: 'demo-3', clientName: 'José Reinhold', phone: 'M:03888-15630122', vehicleModel: 'Tera 1.0 TSI AT Comfortline MY 26', currentStatus: 'Preturno', invoiceDate: dateAgo(10), appointmentDate: '', lastModifiedDate: dateAgo(1), operationNumber: '66776', advisor: 'Equipo Autosol' },
  ];
};

const parseDate = (value: string) => {
  const match = String(value || '').trim().match(/^(\d{1,4})[/-](\d{1,2})[/-](\d{1,4})/);
  if (!match) return null;
  const [a, b, c] = match.slice(1).map(Number); const year = a > 1900 ? a : c; const day = a > 1900 ? c : a;
  const result = new Date(year, b - 1, day); return Number.isNaN(result.getTime()) ? null : result;
};
const businessDays = (date: string) => {
  const start = parseDate(date); if (!start) return 0;
  const today = new Date(); start.setHours(0, 0, 0, 0); today.setHours(0, 0, 0, 0); if (start > today) return 0;
  let days = 0; const cursor = new Date(start);
  while (cursor < today) { cursor.setDate(cursor.getDate() + 1); if (cursor.getDay() !== 0 && cursor.getDay() !== 6) days++; }
  return days;
};
const statusKey = (raw: string) => {
  const value = raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (value.includes('factur')) return 'facturado'; if (value.includes('patent')) return 'patentado'; if (value.includes('preturn')) return 'preturno'; if (value.includes('turno')) return 'turno'; return '';
};
const phoneForWhatsapp = (raw: string) => {
  const mobile = raw.match(/m\s*:\s*([^p]+)/i)?.[1] || raw; let digits = mobile.replace(/\D/g, '').replace(/^0/, '').replace(/^54/, '');
  const marker = digits.indexOf('15'); if (marker > 1) digits = `549${digits.slice(0, marker)}${digits.slice(marker + 2)}`; else if (!digits.startsWith('54')) digits = `54${digits}`;
  return digits;
};
const dateLabel = (value: string) => { const date = parseDate(value); return date ? date.toLocaleDateString('es-AR') : 'Sin fecha'; };
const labels: Record<CaseStatus, string> = { rojo: 'Contener ahora', amarillo: 'Reforzar', verde: 'En plazo' };

export const ClientAlertDashboard: React.FC<Props> = ({ onExit }) => {
  const [cases, setCases] = useState<DeliveryCase[]>([]); const [timings, setTimings] = useState<StageTiming[]>(defaultTimings);
  const [role, setRole] = useState<'admin' | 'collaborator' | null>(null); const [filter, setFilter] = useState<'todos' | CaseStatus>('todos');
  const [selected, setSelected] = useState<EnrichedCase | null>(null); const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [saving, setSaving] = useState(false); const [showSettings, setShowSettings] = useState(false);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [sessionRes, casesRes, timingRes] = await Promise.all([fetch('/api/auth/session'), fetch('/api/cases'), fetch('/api/cases/timings')]);
      const session = await sessionRes.json(); if (!session.authenticated || !casesRes.ok) throw new Error('Ingresá con tu clave para acceder al tablero operativo.');
      const casesResult = await casesRes.json(); const timingResult = timingRes.ok ? await timingRes.json() : null;
      setRole(session.role); setCases((casesResult.data || casesResult).cases || []); const loaded = (timingResult?.data || timingResult)?.timings;
      if (Array.isArray(loaded) && loaded.length) setTimings(loaded);
    } catch (err) { if (import.meta.env.DEV) { setRole('admin'); setCases(demoCases()); setTimings(defaultTimings); return; } setError(err instanceof Error ? err.message : 'No se pudo cargar el tablero.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const enriched = useMemo<EnrichedCase[]>(() => cases.map((item) => {
    const key = statusKey(item.currentStatus); const timing = timings.find((candidate) => candidate.key === key); const baseDate = key === 'facturado' ? item.invoiceDate : key === 'turno' ? item.appointmentDate : item.lastModifiedDate; const days = businessDays(baseDate);
    const status: CaseStatus = !timing || !parseDate(baseDate) ? 'amarillo' : days >= Number(timing.limitDays) ? 'rojo' : days >= Number(timing.warningDays) ? 'amarillo' : 'verde';
    return { ...item, status, days, timing, baseDate, reason: timing ? timing.description : 'Revisar estado o fecha de referencia' };
  }).sort((a, b) => {
    const priority: Record<CaseStatus, number> = { rojo: 0, amarillo: 1, verde: 2 };
    return priority[a.status] - priority[b.status] || b.days - a.days;
  }), [cases, timings]);
  const visible = enriched.filter((item) => filter === 'todos' || item.status === filter);
  const counts = { rojo: enriched.filter((item) => item.status === 'rojo').length, amarillo: enriched.filter((item) => item.status === 'amarillo').length, verde: enriched.filter((item) => item.status === 'verde').length };
  const openEditor = (item: EnrichedCase) => { setSelected(item); setMessage((item.timing?.message || defaultTimings[0].message).replaceAll('{cliente}', item.clientName).replaceAll('{modelo}', item.vehicleModel)); };
  const sendWhatsapp = () => { if (selected) window.open(`https://wa.me/${phoneForWhatsapp(selected.phone)}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer'); };
  const saveTimings = async () => { setSaving(true); try { const response = await fetch('/api/cases/timings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ timings }) }); if (!response.ok) throw new Error(); setShowSettings(false); } catch { setError('No se pudieron guardar los tiempos. Verificá tu sesión de administración.'); } finally { setSaving(false); } };

  if (loading) return <div className="flex min-h-screen items-center justify-center gap-3 bg-slate-50 text-slate-500"><RefreshCw className="h-5 w-5 animate-spin" /> Cargando casos…</div>;
  if (error) return <div className="flex min-h-screen items-center justify-center bg-slate-50 p-5"><div className="max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-950"><AlertTriangle className="mx-auto mb-3 h-7 w-7" /><p className="font-bold">{error}</p><button onClick={load} className="mt-4 rounded-lg bg-amber-900 px-4 py-2 text-sm font-bold text-white">Reintentar</button></div></div>;

  return <div className="min-h-screen bg-slate-50 text-[#071e3a]">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8"><div><p className="text-[10px] font-black uppercase tracking-[.16em] text-[#0069b4]">Autosol · uso interno</p><h1 className="mt-1 text-xl font-black tracking-tight">Centro de contención</h1></div><div className="flex items-center gap-2"><button onClick={load} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50" title="Actualizar"><RefreshCw className="h-4 w-4" /></button>{role === 'admin' && <button onClick={() => setShowSettings(true)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold hover:bg-slate-50"><Settings2 className="h-4 w-4" /> <span className="hidden sm:inline">Tiempos</span></button>}<button onClick={onExit} className="inline-flex items-center gap-2 rounded-lg bg-[#061d38] px-3 py-2 text-sm font-bold text-white"><ArrowLeft className="h-4 w-4" /> Salir</button></div></div></header>
    <main className="mx-auto max-w-[1440px] px-3 py-6 sm:px-8"><div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="text-2xl font-black tracking-tight">Operaciones a seguir</h2><p className="mt-1 text-sm text-slate-500">Elegí WhatsApp, revisá el mensaje y enviá la contención antes del reclamo.</p></div><div className="flex gap-2"><button onClick={() => setFilter('todos')} className={`rounded-lg px-3 py-2 text-xs font-bold ${filter === 'todos' ? 'bg-slate-800 text-white' : 'border border-slate-200 bg-white'}`}>Todos {enriched.length}</button><button onClick={() => setFilter('rojo')} className={`rounded-lg px-3 py-2 text-xs font-bold ${filter === 'rojo' ? 'bg-rose-600 text-white' : 'border border-rose-200 bg-rose-50 text-rose-700'}`}>Rojo {counts.rojo}</button><button onClick={() => setFilter('amarillo')} className={`rounded-lg px-3 py-2 text-xs font-bold ${filter === 'amarillo' ? 'bg-amber-400 text-slate-950' : 'border border-amber-200 bg-amber-50 text-amber-800'}`}>Amarillo {counts.amarillo}</button><button onClick={() => setFilter('verde')} className={`rounded-lg px-3 py-2 text-xs font-bold ${filter === 'verde' ? 'bg-emerald-600 text-white' : 'border border-emerald-200 bg-emerald-50 text-emerald-700'}`}>Verde {counts.verde}</button></div></div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[880px] text-left"><thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-[.08em] text-[#42648b]"><tr><th className="px-5 py-4">Cliente</th><th className="px-4 py-4">Modelo</th><th className="px-4 py-4">Último estado</th><th className="px-4 py-4">Plazo</th><th className="px-4 py-4">Semáforo</th><th className="px-5 py-4 text-right">Acción</th></tr></thead><tbody className="divide-y divide-slate-100">{visible.map((item) => <tr key={item.id} className="transition-colors hover:bg-slate-50"><td className="px-5 py-4"><p className="font-black text-slate-900">{item.clientName}</p><p className="mt-0.5 text-xs text-slate-500">Op. {item.operationNumber || '—'} · {item.phone || 'sin teléfono'}</p></td><td className="max-w-[235px] px-4 py-4 text-sm font-medium text-slate-700">{item.vehicleModel}</td><td className="px-4 py-4"><span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">{item.currentStatus}</span><p className="mt-1.5 text-[11px] text-slate-500">{item.reason}</p></td><td className="px-4 py-4"><p className="font-black text-slate-800">{item.days} días hábiles</p><p className="mt-0.5 text-xs text-slate-500">desde {dateLabel(item.baseDate)}</p></td><td className="px-4 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${item.status === 'rojo' ? 'bg-rose-100 text-rose-700' : item.status === 'amarillo' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'}`}><span className={`h-2 w-2 rounded-full ${item.status === 'rojo' ? 'bg-rose-500' : item.status === 'amarillo' ? 'bg-amber-400' : 'bg-emerald-500'}`} />{labels[item.status]}</span></td><td className="px-5 py-4 text-right"><button disabled={!item.phone} onClick={() => openEditor(item)} className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-3 py-2 text-sm font-black text-white hover:bg-[#1fb858] disabled:bg-slate-200 disabled:text-slate-400"><MessageCircle className="h-4 w-4" /> WhatsApp</button></td></tr>)}{visible.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500"><CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-emerald-500" />No hay casos en este estado.</td></tr>}</tbody></table></div></div></main>
    {selected && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#061d38]/55 p-4"><div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"><div className="flex items-start justify-between border-b border-slate-200 p-5"><div><p className="text-[10px] font-black uppercase tracking-[.12em] text-[#0069b4]">Contención preventiva</p><h3 className="mt-1 text-lg font-black">Mensaje para {selected.clientName}</h3><p className="mt-1 text-sm text-slate-500">{selected.vehicleModel} · {selected.currentStatus}</p></div><button onClick={() => setSelected(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><div className="p-5"><label className="text-xs font-black uppercase tracking-wide text-slate-500">Mensaje editable</label><textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={7} className="mt-2 w-full resize-none rounded-xl border border-slate-300 p-3 text-sm leading-relaxed outline-none focus:border-[#0069b4] focus:ring-2 focus:ring-blue-100" /><p className="mt-2 text-xs text-slate-500">Se abrirá WhatsApp con este texto. Podés modificarlo antes de enviarlo.</p></div><div className="flex justify-end gap-2 border-t border-slate-200 p-4"><button onClick={() => setSelected(null)} className="rounded-lg px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100">Cancelar</button><button onClick={sendWhatsapp} className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-black text-white hover:bg-[#1fb858]"><MessageCircle className="h-4 w-4" /> Enviar por WhatsApp</button></div></div></div>}
    {showSettings && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#061d38]/55 p-4"><div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-slate-200 p-5"><div><h3 className="font-black">Reglas del semáforo</h3><p className="text-xs text-slate-500">Los días son hábiles.</p></div><button onClick={() => setShowSettings(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><div className="grid gap-3 p-5 sm:grid-cols-2">{timings.map((item, index) => <div key={item.key} className="rounded-xl bg-slate-50 p-3"><p className="text-sm font-black">{item.label}</p><p className="mb-3 text-xs text-slate-500">{item.description}</p><div className="grid grid-cols-2 gap-2"><label className="text-xs font-bold">Amarillo<input type="number" min="0" value={item.warningDays} onChange={(event) => setTimings((items) => items.map((timing, i) => i === index ? { ...timing, warningDays: Number(event.target.value) } : timing))} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5" /></label><label className="text-xs font-bold">Rojo<input type="number" min="1" value={item.limitDays} onChange={(event) => setTimings((items) => items.map((timing, i) => i === index ? { ...timing, limitDays: Number(event.target.value) } : timing))} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5" /></label></div></div>)}</div><div className="flex justify-end gap-2 border-t border-slate-200 p-4"><button onClick={() => setShowSettings(false)} className="rounded-lg px-4 py-2.5 text-sm font-bold text-slate-600">Cancelar</button><button disabled={saving} onClick={saveTimings} className="inline-flex items-center gap-2 rounded-lg bg-[#0069b4] px-4 py-2.5 text-sm font-black text-white"><Save className="h-4 w-4" /> {saving ? 'Guardando…' : 'Guardar'}</button></div></div></div>}
  </div>;
};
