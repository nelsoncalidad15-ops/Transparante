import React, { useEffect, useState } from 'react';
import { HelpCircle, Plus, Save, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { FAQItem, ContentCategory } from '../types';

const newFaq = (idNum: number): FAQItem => ({
  id: `faq-${Date.now()}`,
  question: 'Nueva pregunta frecuente',
  answer: 'Respuesta oficial y clara para el comprador.',
  category: 'Tiempos y plazos',
});

const FAQ_CATEGORIES: ContentCategory[] = [
  'Tiempos y plazos',
  'Facturación',
  'Gestoría',
  'Patentamiento',
  'Entrega',
  'Documentación',
  'Financiación',
  'Proceso de compra',
];

export const FaqAdminView: React.FC = () => {
  const { faqs, updateFaqs } = useData();
  const [draft, setDraft] = useState<FAQItem[]>(faqs);
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => setDraft(faqs), [faqs]);

  const update = (id: string, change: Partial<FAQItem>) => {
    setDraft((items) =>
      items.map((item) => (item.id === id ? { ...item, ...change } : item))
    );
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= draft.length) return;
    const copy = [...draft];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setDraft(copy);
  };

  const save = async () => {
    updateFaqs(draft);
    setSaving(true);
    setStatus('');
    try {
      const response = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faqs: draft }),
      });
      if (!response.ok) throw new Error();
      setStatus('Preguntas frecuentes guardadas y sincronizadas.');
    } catch {
      setStatus('Guardado en memoria y navegador. Se actualizará en la web de inmediato.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#0040c4]" />
            <h2 className="text-lg font-black text-slate-900">
              Preguntas Frecuentes y Respuestas del Bot ({draft.length})
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Editá las respuestas oficiales que alimentan tanto la sección de FAQ como el Bot de consulta.
          </p>
        </div>

        <button
          onClick={() => {
            const item = newFaq(draft.length + 1);
            setDraft((items) => [item, ...items]);
            setOpenId(item.id);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-800 hover:bg-blue-100 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Agregar pregunta
        </button>
      </div>

      <div className="space-y-2">
        {draft.map((faq, index) => (
          <div key={faq.id} className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3 bg-slate-50 px-3 py-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#001e50] text-[11px] font-bold text-white">
                {index + 1}
              </span>
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="min-w-0 flex-1 text-left cursor-pointer"
              >
                <p className="truncate text-sm font-bold text-slate-900">{faq.question}</p>
                <p className="truncate text-xs text-slate-500">{faq.category}</p>
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="rounded p-1.5 text-slate-500 hover:bg-white disabled:opacity-25 cursor-pointer"
                  title="Subir"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === draft.length - 1}
                  className="rounded p-1.5 text-slate-500 hover:bg-white disabled:opacity-25 cursor-pointer"
                  title="Bajar"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDraft((items) => items.filter((item) => item.id !== faq.id))}
                  className="rounded p-1.5 text-rose-600 hover:bg-rose-50 cursor-pointer"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {openId === faq.id && (
              <div className="grid gap-3 border-t border-slate-200 p-4 md:grid-cols-2 bg-white">
                <label className="text-xs font-bold text-slate-700 md:col-span-2">
                  Pregunta que formula el cliente
                  <input
                    value={faq.question}
                    onChange={(e) => update(faq.id, { question: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-xs text-slate-900 outline-none focus:border-[#0040c4]"
                  />
                </label>

                <label className="text-xs font-bold text-slate-700 md:col-span-2">
                  Respuesta oficial Autosol
                  <textarea
                    rows={4}
                    value={faq.answer}
                    onChange={(e) => update(faq.id, { answer: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal text-xs leading-relaxed text-slate-900 outline-none focus:border-[#0040c4]"
                  />
                </label>

                <label className="text-xs font-bold text-slate-700">
                  Categoría
                  <select
                    value={faq.category}
                    onChange={(e) => update(faq.id, { category: e.target.value as ContentCategory })}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-xs text-slate-900 outline-none focus:border-[#0040c4]"
                  >
                    {FAQ_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        {status && <p className="text-xs font-semibold text-emerald-700">{status}</p>}
        <button
          onClick={save}
          disabled={saving || !draft.length}
          className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#0040c4] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#001e50] transition-colors disabled:opacity-60 cursor-pointer"
        >
          <Save className="h-4 w-4" /> {saving ? 'Guardando…' : 'Guardar preguntas'}
        </button>
      </div>
    </div>
  );
};
