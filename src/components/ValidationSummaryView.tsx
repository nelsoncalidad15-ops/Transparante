import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, Copy, Download, Printer, QrCode, Save, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { FAQItem, ProcessStage } from '../types';

type ReviewEntry = { id: string; status: 'pendiente' | 'validado'; note: string; reviewedAt: string };
type ReviewDraft = { stages: ProcessStage[]; faqs: FAQItem[]; validations: ReviewEntry[] };
const DRAFT_KEY = 'autosol_revision_operativa_borrador_v1';
const TOPICS = [
  { id: 'documentacion', title: 'Documentación según el titular', detail: 'Confirmar DNI, CUIT/CUIL, sociedades, condominio y cuándo corresponde cada formulario o trámite digital.' },
  { id: 'pagos', title: 'Precio, gastos y medios de pago', detail: 'Confirmar qué incluye la cotización, quién paga patentamiento, sellos, gestoría, seguro y accesorios.' },
  { id: 'plazo-total', title: 'Plazo total e inicio del cómputo', detail: 'Confirmar si existe un plazo general de entrega, desde qué hito se cuenta y qué se informa por escrito.' },
  { id: 'pdi', title: 'Preparación de la unidad', detail: 'Confirmar el procedimiento real de PDI, cantidad de controles si se publica y tiempo operativo en Jujuy.' },
  { id: 'entrega', title: 'Seguro, retiro por terceros y documentación', detail: 'Confirmar seguro, retiro por terceros, documentación entregada y responsable del turno.' },
];

const readDraft = (): ReviewDraft | null => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    const value = raw ? JSON.parse(raw) as ReviewDraft : null;
    return value && Array.isArray(value.stages) && Array.isArray(value.faqs) && Array.isArray(value.validations) ? value : null;
  } catch { return null; }
};

const ReviewControl = ({ item, onChange }: { item: ReviewEntry; onChange: (patch: Partial<ReviewEntry>) => void }) => <div className="mt-3 flex flex-col gap-2 border-t border-slate-200 pt-3 sm:flex-row sm:items-center">
  <label className="flex shrink-0 items-center gap-2 text-xs font-bold text-[#002244]"><input type="checkbox" checked={item.status === 'validado'} onChange={(event) => onChange({ status: event.target.checked ? 'validado' : 'pendiente' })} />{item.status === 'validado' ? 'Validado' : 'Marcar como validado'}</label>
  <input aria-label="Nota o corrección del administrativo" value={item.note} onChange={(event) => onChange({ note: event.target.value })} placeholder="Nota o dato pendiente" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs" />
</div>;

export const ValidationSummaryView: React.FC<{ onExit?: () => void }> = ({ onExit }) => {
  const { stages, faqs, updateStages, updateFaqs } = useData();
  const [draftStages, setDraftStages] = useState(stages);
  const [draftFaqs, setDraftFaqs] = useState(faqs);
  const [validations, setValidations] = useState<ReviewEntry[]>([]);
  const [connection, setConnection] = useState<'checking' | 'connected' | 'local'>('checking');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  useEffect(() => {
    const local = readDraft();
    if (local) { setDraftStages(local.stages); setDraftFaqs(local.faqs); setValidations(local.validations); setMessage('Se recuperó el borrador de este navegador.'); }
    let cancelled = false;
    fetch('/api/admin/review').then(async (response) => {
      if (!response.ok) throw new Error('Backend no disponible');
      return response.json();
    }).then((result) => {
      if (cancelled) return;
      setConnection('connected');
      if (local) return;
      const data = result.data || result;
      if (Array.isArray(data.stages) && data.stages.length) setDraftStages(data.stages);
      if (Array.isArray(data.faqs) && data.faqs.length) setDraftFaqs(data.faqs);
      if (Array.isArray(data.validations)) setValidations(data.validations.map((item: ReviewEntry) => ({ ...item, status: item.status === 'validado' ? 'validado' : 'pendiente' })));
    }).catch(() => { if (!cancelled) setConnection('local'); });
    return () => { cancelled = true; };
  }, []);

  const byId = useMemo(() => new Map(validations.map((item) => [item.id, item])), [validations]);
  const getReview = (id: string): ReviewEntry => byId.get(id) || { id, status: 'pendiente', note: '', reviewedAt: '' };
  const ids = [...draftStages.map((item) => `stage:${item.id}`), ...draftFaqs.map((item) => `faq:${item.id}`), ...TOPICS.map((item) => `topic:${item.id}`)];
  const approved = ids.filter((id) => getReview(id).status === 'validado').length;
  const remember = (next: ReviewDraft) => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(next)); } catch { /* almacenamiento no disponible */ } };
  const changeReview = (id: string, patch: Partial<ReviewEntry>) => {
    const current = getReview(id);
    const next = [...validations.filter((item) => item.id !== id), { ...current, ...patch, reviewedAt: patch.status === 'validado' ? new Date().toISOString() : patch.status === 'pendiente' ? '' : current.reviewedAt }];
    setValidations(next); remember({ stages: draftStages, faqs: draftFaqs, validations: next }); setMessage('Borrador guardado en este navegador.');
  };
  const changeStage = (id: string, patch: Partial<ProcessStage>) => {
    const next = draftStages.map((item) => item.id === id ? { ...item, ...patch } : item);
    const reviews = validations.map((item) => item.id === `stage:${id}` ? { ...item, status: 'pendiente' as const, reviewedAt: '' } : item);
    setDraftStages(next); setValidations(reviews); remember({ stages: next, faqs: draftFaqs, validations: reviews }); setMessage('Texto corregido. Revisalo y volvé a validarlo.');
  };
  const changeFaq = (id: string, patch: Partial<FAQItem>) => {
    const next = draftFaqs.map((item) => item.id === id ? { ...item, ...patch } : item);
    const reviews = validations.map((item) => item.id === `faq:${id}` ? { ...item, status: 'pendiente' as const, reviewedAt: '' } : item);
    setDraftFaqs(next); setValidations(reviews); remember({ stages: draftStages, faqs: next, validations: reviews }); setMessage('Respuesta corregida. Revisala y volvé a validarla.');
  };
  const save = async () => {
    setSaving(true); setMessage('');
    const payload = { stages: draftStages, faqs: draftFaqs, validations };
    remember(payload);
    try {
      const response = await fetch('/api/admin/review', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok === false) throw new Error();
      localStorage.removeItem(DRAFT_KEY);
      setConnection('connected'); setMessage('Borrador guardado en Google Sheets. La web pública todavía no cambió.');
    } catch { setConnection('local'); setMessage('No se guardó para todos. El borrador sigue en este navegador; falta conectar el backend.'); }
    finally { setSaving(false); }
  };
  const publish = async () => {
    if (approved !== ids.length || connection !== 'connected') return;
    setSaving(true); setMessage('');
    const payload = { stages: draftStages, faqs: draftFaqs, validations };
    remember(payload);
    try {
      const response = await fetch('/api/admin/review', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok === false) throw new Error(result.error || 'No se pudo publicar.');
      updateStages(draftStages); updateFaqs(draftFaqs); localStorage.removeItem(DRAFT_KEY);
      setMessage('Información validada y publicada en Google Sheets. Los visitantes la verán al recargar.');
    } catch { setMessage('No se pudo publicar. El borrador quedó guardado en este navegador.'); }
    finally { setSaving(false); }
  };
  const copy = async () => {
    const lines = ['REVISIÓN OPERATIVA · AUTOSOL JUJUY', `Validados: ${approved} de ${ids.length}`, 'ETAPAS', ...draftStages.map((item) => `${item.stepNumber}. ${item.name} [${getReview(`stage:${item.id}`).status}]\n${item.definition}\nPlazo: ${item.estimatedTime}\nNota: ${getReview(`stage:${item.id}`).note}`), 'PREGUNTAS', ...draftFaqs.map((item) => `${item.question} [${getReview(`faq:${item.id}`).status}]\n${item.answer}\nNota: ${getReview(`faq:${item.id}`).note}`), 'TEMAS A CONFIRMAR', ...TOPICS.map((item) => `${item.title} [${getReview(`topic:${item.id}`).status}]\n${item.detail}\nNota: ${getReview(`topic:${item.id}`).note}`)];
    await navigator.clipboard.writeText(lines.join('\n\n')); setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return <div className="space-y-6 pb-12">
    <div className="rounded-3xl bg-[#002244] p-6 text-white sm:p-8">
      {onExit && (
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Volver a la web pública</span>
        </button>
      )}
      <p className="text-xs font-bold uppercase tracking-widest text-white/75">Autosol Confianza · Ficha de validación interna</p>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Revisión y validación de contenidos</h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/85">Leé cada texto con Administración. Si está bien, marcá «Validado». Si hay que corregirlo, editá el campo y luego validalo. Al terminar, pulsá «Guardar revisión».</p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white/15 px-3 py-2 text-xs font-bold">{approved} de {ids.length} validados</span>
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#002244] disabled:opacity-50 cursor-pointer"><Save className="h-4 w-4" />{saving ? 'Guardando…' : 'Guardar revisión'}</button>
        {connection === 'connected' && (
          <button onClick={publish} disabled={saving || approved !== ids.length} className="inline-flex items-center gap-2 rounded-full bg-[#008cff] px-4 py-2 text-xs font-bold text-[#002244] disabled:opacity-50 cursor-pointer">Publicar todo validado</button>
        )}
        <button onClick={copy} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-xs font-bold cursor-pointer"><Copy className="h-4 w-4" />{copied ? 'Copiado' : 'Copiar resumen'}</button>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-xs font-bold cursor-pointer"><Printer className="h-4 w-4" />Imprimir</button>
        <button type="button" onClick={() => setIsQrModalOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-xs font-bold cursor-pointer hover:bg-white/10"><QrCode className="h-4 w-4" />Código QR</button>
      </div>
    </div>
    <div role="status" className={`rounded-2xl border p-4 text-xs sm:text-sm ${connection === 'connected' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-blue-200 bg-blue-50 text-blue-900'}`}>
      <div className="flex items-center gap-2 font-bold">
        <span>{connection === 'connected' ? '✓ Backend conectado con Google Sheets' : connection === 'checking' ? 'Comprobando conexión…' : 'ℹ️ Modo Local de Validación Activo'}</span>
      </div>
      <p className="mt-1 text-slate-700">
        {connection === 'connected'
          ? 'Guardar revisión conserva el borrador en Google Sheets. Publicar todo validado actualiza la web pública.'
          : 'El borrador se guarda automáticamente en este navegador. Podés revisar cada etapa, modificar plazos o notas, y usar «Guardar revisión», «Copiar resumen» o «Imprimir».'}
      </p>
      {message && <span className="block font-semibold mt-2 text-[#002244]">{message}</span>}
    </div>
    <section className="space-y-3"><h2 className="text-xl font-bold text-[#002244]">1. Etapas y plazos</h2>
      {draftStages.map((stage) => <details key={stage.id} className="rounded-2xl border border-slate-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-bold text-[#002244]">{stage.stepNumber}. {stage.name} · {stage.estimatedTime} {getReview(`stage:${stage.id}`).status === 'validado' ? '✓' : ''}</summary>
        <div className="mt-4 grid gap-3">
          <label className="text-xs font-bold">Explicación al cliente<textarea rows={3} value={stage.definition} onChange={(event) => changeStage(stage.id, { definition: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 p-3 font-normal" /></label>
          <label className="text-xs font-bold">Plazo publicado<input value={stage.estimatedTime} onChange={(event) => changeStage(stage.id, { estimatedTime: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 p-3 font-normal" /></label>
          <label className="text-xs font-bold">Qué sucede (una línea por punto)<textarea rows={3} value={stage.whatHappens.join('\n')} onChange={(event) => changeStage(stage.id, { whatHappens: event.target.value.split('\n').map((line) => line.trim()).filter(Boolean) })} className="mt-1 w-full rounded-lg border border-slate-300 p-3 font-normal" /></label>
        </div>
        <ReviewControl item={getReview(`stage:${stage.id}`)} onChange={(patch) => changeReview(`stage:${stage.id}`, patch)} />
      </details>)}
    </section>
    <section className="space-y-3"><h2 className="text-xl font-bold text-[#002244]">2. Preguntas y respuestas</h2>
      {draftFaqs.map((faq) => <details key={faq.id} className="rounded-2xl border border-slate-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-bold text-[#002244]">{faq.question} {getReview(`faq:${faq.id}`).status === 'validado' ? '✓' : ''}</summary>
        <label className="mt-4 block text-xs font-bold">Respuesta al cliente<textarea rows={3} value={faq.answer} onChange={(event) => changeFaq(faq.id, { answer: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 p-3 font-normal" /></label>
        <ReviewControl item={getReview(`faq:${faq.id}`)} onChange={(patch) => changeReview(`faq:${faq.id}`, patch)} />
      </details>)}
    </section>
    <section className="space-y-3"><h2 className="text-xl font-bold text-[#002244]">3. Datos de Autosol a confirmar</h2>
      {TOPICS.map((topic) => <div key={topic.id} className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-bold text-[#002244]">{topic.title}</h3><p className="mt-1 text-xs leading-relaxed text-slate-600">{topic.detail}</p>
        <ReviewControl item={getReview(`topic:${topic.id}`)} onChange={(patch) => changeReview(`topic:${topic.id}`, patch)} />
      </div>)}
    </section>
    <div className="pt-2">
      <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-[#002244] px-6 py-3 text-sm font-bold text-white disabled:opacity-50 cursor-pointer shadow-md hover:brightness-110"><Check className="h-4 w-4" />{saving ? 'Guardando…' : 'Guardar revisión'}</button>
    </div>

    {isQrModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
        <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <button
            onClick={() => setIsQrModalOpen(false)}
            className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#002244]">
            Autosol Confianza · Salón Comercial
          </span>
          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Código QR del Centro Digital
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            Para colocar en cartelería o displays de los escritorios de venta, o adjuntar en la carpeta de reserva del cliente.
          </p>

          <div className="my-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https%3A%2F%2Ftransparante.nelson-calidad15.workers.dev%2F&color=002244"
              alt="Código QR Autosol Confianza"
              className="h-48 w-48 rounded-xl shadow-xs"
            />
            <span className="mt-3 text-[11px] font-mono font-semibold text-slate-500">
              transparante.nelson-calidad15.workers.dev
            </span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                window.open('https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=https%3A%2F%2Ftransparante.nelson-calidad15.workers.dev%2F&color=002244', '_blank');
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Descargar HD</span>
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText('https://transparante.nelson-calidad15.workers.dev/');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#002244] py-2.5 text-xs font-bold text-white hover:brightness-110 cursor-pointer"
            >
              <Copy className="h-4 w-4" />
              <span>{copied ? '¡Copiado!' : 'Copiar Enlace'}</span>
            </button>
          </div>
        </div>
      </div>
    )}
  </div>;
};
