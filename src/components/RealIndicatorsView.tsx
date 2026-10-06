import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, BarChart3, Database, RefreshCw } from 'lucide-react';

type IndicatorRow = Record<string, unknown>;

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  return String(value);
}

export function RealIndicatorsView() {
  const [rows, setRows] = useState<IndicatorRow[]>([]);
  const [updatedAt, setUpdatedAt] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/indicators', { headers: { Accept: 'application/json' } });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'No se pudieron leer los indicadores.');
      const data = result.data || result;
      setRows(Array.isArray(data.indicators) ? data.indicators : []);
      setUpdatedAt(typeof data.updatedAt === 'string' ? data.updatedAt : '');
    } catch (cause) {
      setRows([]);
      setError(cause instanceof Error ? cause.message : 'No se pudieron leer los indicadores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const columns = useMemo(() => [...new Set(rows.flatMap((row) => Object.keys(row)))], [rows]);

  return <section className="space-y-6">
    <header className="flex flex-col justify-between gap-4 rounded-3xl bg-[#002244] p-6 text-white sm:flex-row sm:items-center sm:p-8">
      <div>
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-200"><BarChart3 className="h-4 w-4" /> Indicadores reales</p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">Indicadores de Autosol</h1>
        <p className="mt-2 max-w-2xl text-sm text-blue-100">Datos leídos directamente desde la hoja <strong>Indicadores</strong>. No se muestran estimaciones ni valores simulados.</p>
      </div>
      <button onClick={() => void load()} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold hover:bg-white/20 disabled:opacity-60">
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Actualizar
      </button>
    </header>

    {error ? <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /><div><strong>No hay datos disponibles para mostrar.</strong><p className="mt-1">{error} Revisá que las variables de runtime `APPS_SCRIPT_URL` y `APPS_SCRIPT_SHARED_SECRET` estén configuradas en Cloudflare.</p></div></div>
      : loading ? <div className="rounded-2xl bg-white p-8 text-sm text-slate-500 shadow-sm">Leyendo indicadores…</div>
      : rows.length === 0 ? <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm"><Database className="mt-0.5 h-5 w-5 text-[#002244]" /><div><strong>La hoja “Indicadores” todavía no tiene registros.</strong><p className="mt-1">Cuando Administración cargue datos reales en esa hoja, aparecerán aquí automáticamente.</p></div></div>
      : <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-600"><tr>{columns.map((column) => <th key={column} className="whitespace-nowrap px-4 py-3">{column}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row, index) => <tr key={index} className="hover:bg-slate-50">{columns.map((column) => <td key={column} className="whitespace-nowrap px-4 py-3 text-slate-800">{formatValue(row[column])}</td>)}</tr>)}</tbody></table></div>}

    {updatedAt && <p className="text-xs text-slate-500">Última lectura: {new Date(updatedAt).toLocaleString('es-AR')}.</p>}
  </section>;
}
