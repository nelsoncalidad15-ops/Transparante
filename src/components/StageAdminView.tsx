import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Save, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { ProcessStage } from '../types';

const newStage = (stepNumber: number): ProcessStage => ({
  id: `etapa-${Date.now()}`, stepNumber, name: 'Nueva etapa', shortDesc: 'Resumen breve de la etapa.', definition: 'Explicación para el cliente.', whatHappens: ['Acción principal de esta etapa.'], estimatedTime: 'A definir', timeDisclaimer: '', timeFactors: [], nextStep: 'Siguiente etapa.', iconName: 'Car', category: 'Proceso de compra', active: true,
});

export const StageAdminView: React.FC = () => {
  const { stages, updateStages } = useData();
  const [draft, setDraft] = useState<ProcessStage[]>(stages);
  const [openId, setOpenId] = useState<string | null>(stages[0]?.id || null);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => setDraft(stages), [stages]);

  const update = (id: string, change: Partial<ProcessStage>) => setDraft((items) => items.map((item) => item.id === id ? { ...item, ...change } : item));
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction; if (target < 0 || target >= draft.length) return;
    const copy = [...draft]; [copy[index], copy[target]] = [copy[target], copy[index]]; setDraft(copy.map((item, position) => ({ ...item, stepNumber: position + 1 })));
  };
  const save = async () => {
    const ordered = draft.map((item, index) => ({ ...item, stepNumber: index + 1 })); updateStages(ordered); setSaving(true); setStatus('');
    try {
      const response = await fetch('/api/admin/stages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stages: ordered }) });
      if (!response.ok) throw new Error(); setStatus('Etapas guardadas en Google Sheets y publicadas.');
    } catch { setStatus(import.meta.env.DEV ? 'Guardado localmente. Al conectar Apps Script se guardará también en la hoja Etapas.' : 'Se actualizó la vista local, pero no se pudo guardar en Google Sheets.'); }
    finally { setSaving(false); }
  };

  return <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><h2 className="text-lg font-black text-slate-900">Etapas que ve el cliente</h2><p className="mt-1 text-xs text-slate-500">Editá las definiciones, los plazos y el orden. El sitio mostrará solo las etapas activas.</p></div><button onClick={() => { const item = newStage(draft.length + 1); setDraft((items) => [...items, item]); setOpenId(item.id); }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-800"><Plus className="h-4 w-4" /> Agregar etapa</button></div>
    <div className="space-y-2">{draft.map((stage, index) => <div key={stage.id} className="overflow-hidden rounded-2xl border border-slate-200"><div className="flex items-center gap-3 bg-slate-50 px-3 py-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#002244] text-xs font-black text-white">{index + 1}</span><button onClick={() => setOpenId(openId === stage.id ? null : stage.id)} className="min-w-0 flex-1 text-left"><p className="truncate text-sm font-black text-slate-900">{stage.name}</p><p className="truncate text-xs text-slate-500">{stage.estimatedTime}</p></button><div className="flex items-center gap-1"><button onClick={() => move(index, -1)} disabled={index === 0} className="rounded p-1.5 text-slate-500 hover:bg-white disabled:opacity-25" title="Subir"><ChevronUp className="h-4 w-4" /></button><button onClick={() => move(index, 1)} disabled={index === draft.length - 1} className="rounded p-1.5 text-slate-500 hover:bg-white disabled:opacity-25" title="Bajar"><ChevronDown className="h-4 w-4" /></button><button onClick={() => setDraft((items) => items.filter((item) => item.id !== stage.id))} className="rounded p-1.5 text-rose-600 hover:bg-rose-50" title="Eliminar"><Trash2 className="h-4 w-4" /></button></div></div>{openId === stage.id && <div className="grid gap-3 border-t border-slate-200 p-4 md:grid-cols-2"><label className="text-xs font-bold text-slate-700">Nombre<input value={stage.name} onChange={(event) => update(stage.id, { name: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" /></label><label className="text-xs font-bold text-slate-700">Plazo orientativo<input value={stage.estimatedTime} onChange={(event) => update(stage.id, { estimatedTime: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" /></label><label className="text-xs font-bold text-slate-700 md:col-span-2">Resumen<textarea rows={2} value={stage.shortDesc} onChange={(event) => update(stage.id, { shortDesc: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" /></label><label className="text-xs font-bold text-slate-700 md:col-span-2">Definición que verá el cliente<textarea rows={3} value={stage.definition} onChange={(event) => update(stage.id, { definition: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" /></label><label className="text-xs font-bold text-slate-700">Qué sucede (una línea por punto)<textarea rows={3} value={stage.whatHappens.join('\n')} onChange={(event) => update(stage.id, { whatHappens: event.target.value.split('\n').filter(Boolean) })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" /></label><label className="text-xs font-bold text-slate-700">Qué sigue<textarea rows={3} value={stage.nextStep} onChange={(event) => update(stage.id, { nextStep: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" /></label><label className="flex items-center gap-2 text-xs font-bold text-slate-700 md:col-span-2"><input type="checkbox" checked={stage.active !== false} onChange={(event) => update(stage.id, { active: event.target.checked })} /> Visible para clientes</label></div>}</div>)}</div>
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">{status && <p className="text-xs font-semibold text-emerald-700">{status}</p>}<button onClick={save} disabled={saving || !draft.length} className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#002244] px-4 py-2.5 text-sm font-black text-white disabled:opacity-60"><Save className="h-4 w-4" /> {saving ? 'Guardando…' : 'Guardar etapas'}</button></div>
  </div>;
};
