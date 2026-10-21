import React, { useEffect, useState } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';

type Count = { count: number; section?: string; type?: string; date?: string };
type Summary = { totalEvents: number; bySection: Count[]; byType: Count[]; daily: Count[]; updatedAt: string };

export function WebAnalyticsView() {
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function load() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/analytics', { credentials: 'same-origin' });
      const json = await response.json();
      if (!response.ok || !json.ok) throw new Error(json.error || 'No se pudieron leer los eventos.');
      setData(json.data);
    } catch (e) { setError(e instanceof Error ? e.message : 'Error de conexión'); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);
  const max = Math.max(1, ...(data?.bySection || []).map(item => item.count));
  return <section className="space-y-5">
    <header className="rounded-3xl bg-[#002244] p-6 text-white sm:p-8">
      <div className="flex items-center gap-2 text-sky-200 text-xs uppercase font-bold"><BarChart3 size={16} /> Datos reales · navegación</div>
      <h1 className="mt-2 text-2xl font-black">Uso del Centro Digital</h1>
      <p className="mt-2 text-sm text-blue-100">Interacciones registradas, sin datos personales. Los clics no representan necesariamente clientes únicos.</p>
      <button onClick={() => void load()} disabled={loading} className="mt-4 flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm"><RefreshCw size={15} /> Actualizar</button>
    </header>
    {error && <p role="alert" className="rounded-xl bg-amber-50 p-4 text-amber-900">{error}</p>}
    {data && <>
      <div className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Interacciones totales</p><p className="mt-2 text-4xl font-black text-[#002244]">{data.totalEvents.toLocaleString('es-AR')}</p></div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="font-bold text-[#002244]">Secciones más consultadas</h2>
        <div className="mt-4 space-y-4">{data.bySection.map(item => <div key={item.section}><div className="mb-1 flex justify-between text-sm"><span>{item.section}</span><b>{item.count}</b></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-[#002244]" style={{ width: `${100 * item.count / max}%` }} /></div></div>)}</div></div>
        <div className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="font-bold text-[#002244]">Tipo de interacción</h2><div className="mt-4 space-y-3">{data.byType.map(item => <div key={item.type} className="flex justify-between border-b border-slate-100 pb-2 text-sm"><span>{item.type}</span><b>{item.count}</b></div>)}</div></div>
      </div>
      <p className="text-xs text-slate-500">Registros desde la activación del sistema. Sin estimaciones. Una consulta repetida cuenta como otra interacción.</p>
    </>}
  </section>;
}
