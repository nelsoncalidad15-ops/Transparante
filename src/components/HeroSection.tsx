import React, { useRef, useState } from 'react';
import { ArrowDown, ArrowRight, CalendarCheck, CarFront, CircleHelp, Clock, CreditCard, FileCheck2, FileSignature, FileText, KeyRound, ReceiptText, Search, ShieldCheck, Wrench } from 'lucide-react';
import { ActiveTab } from './Navbar';
import { ProcessStageId } from '../types';

interface HeroSectionProps {
  onSelectStage: (stageId: ProcessStageId) => void;
  onSearchSubmit: (query: string) => void;
  onOpenTrackerModal: () => void;
  onNavigate: (tab: ActiveTab, category?: string, stageId?: ProcessStageId) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectStage, onSearchSubmit, onOpenTrackerModal, onNavigate }) => {
  const servicesRef = useRef<HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollToServices = () => servicesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const cards = [
    { title: 'Mi proceso de compra', text: 'Conocé cada etapa de tu operación paso a paso.', icon: CarFront, action: () => onNavigate('process') },
    { title: 'Documentación y trámites', text: 'Todo lo necesario, explicado con claridad.', icon: FileText, action: () => onNavigate('documents') },
    { title: 'Tiempos orientativos', text: 'Estimaciones y factores de cada etapa.', icon: Clock, action: () => onNavigate('times') },
    { title: 'Entrega del vehículo', text: 'Qué sucede antes y el día de la entrega.', icon: KeyRound, action: () => onNavigate('delivery') },
    { title: 'Financiación y pagos', text: 'Opciones, requisitos y formas de pago.', icon: CreditCard, action: () => onNavigate('financing') },
    { title: 'Preguntas frecuentes', text: 'Respuestas simples a las dudas más comunes.', icon: CircleHelp, action: () => onNavigate('faq') },
  ];
  const stages = [
    { id: 'cierre' as ProcessStageId, label: 'Cierre de operación', icon: FileSignature },
    { id: 'facturacion' as ProcessStageId, label: 'Facturación', icon: ReceiptText },
    { id: 'gestoria' as ProcessStageId, label: 'Gestoría', icon: FileCheck2 },
    { id: 'patentamiento' as ProcessStageId, label: 'Patentamiento', icon: CarFront },
    { id: 'preparacion' as ProcessStageId, label: 'Preparación', icon: Wrench },
    { id: 'turno' as ProcessStageId, label: 'Turno', icon: CalendarCheck },
    { id: 'entrega' as ProcessStageId, label: 'Entrega', icon: KeyRound },
  ];

  return (
    <div className="bg-white">
      <section className="relative flex min-h-[650px] items-end overflow-hidden bg-[#081a2d] sm:min-h-[700px]">
        <img src={`${import.meta.env.BASE_URL}images/autosol-hero-suv.png`} alt="SUV en una concesionaria Autosol" className="absolute inset-0 h-full w-full object-cover object-[62%_center]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,15,31,0.83)_0%,rgba(3,15,31,0.53)_42%,rgba(3,15,31,0.08)_74%),linear-gradient(0deg,rgba(3,15,31,0.6)_0%,transparent_48%)]" />
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-12 pt-32 sm:px-8 sm:pb-16 lg:px-12">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold tracking-[0.16em] text-[#7cdbf6] uppercase">Autosol Jujuy</p>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-white sm:text-7xl lg:text-8xl">Tu próximo camino empieza acá.</h1>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">Información clara sobre definiciones, trámites y cada etapa para acompañarte durante la compra de tu próximo 0km.</p>
          </div>
          <button onClick={scrollToServices} className="mt-12 flex items-center gap-3 text-sm text-white/75 transition-colors hover:text-white" aria-label="Bajar a servicios"><span className="h-px w-10 bg-white/60" /> Descubrí más <ArrowDown className="h-4 w-4 animate-bounce" /></button>
        </div>
      </section>

      <section ref={servicesRef} className="relative flex min-h-screen scroll-mt-0 items-center overflow-hidden bg-[#f4f8fb] py-14 sm:py-16">
        <div className="pointer-events-none absolute -right-24 -top-44 h-[540px] w-[540px] rounded-full border-[58px] border-[#dceef6] opacity-70" />
        <div className="pointer-events-none absolute right-10 top-12 h-72 w-72 rounded-full border border-[#b7dbe9] opacity-80" />
        <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(480px,0.9fr)] lg:gap-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.14em] text-[#0069b4] uppercase">Información clara, en un solo lugar</p>
            <h2 className="mt-3 text-4xl font-semibold leading-[1.04] tracking-[-0.05em] text-[#071e3a] sm:text-5xl">Entender tu proceso también genera <span className="text-[#0069b4]">confianza.</span></h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">Acompañamos cada etapa de tu compra con información simple, clara y actualizada.</p>
            <form onSubmit={(event) => { event.preventDefault(); if (searchQuery.trim()) onSearchSubmit(searchQuery.trim()); }} className="mt-7 flex max-w-xl overflow-hidden rounded-lg border border-[#8bc9e2] bg-white p-1.5 shadow-[0_8px_24px_rgba(14,71,104,0.1)]">
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Buscá una duda, un término o una etapa..." className="min-w-0 flex-1 bg-transparent px-3 text-sm text-[#071e3a] outline-none placeholder:text-slate-400" aria-label="Buscar información" />
              <button type="submit" className="flex h-10 w-11 items-center justify-center rounded-md bg-[#0069b4] text-white transition-colors hover:bg-[#005995]" aria-label="Buscar"><Search className="h-5 w-5" /></button>
            </form>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500"><span>Ejemplos:</span>{['patentamiento', 'gestoría', 'fecha de entrega', 'documentación'].map((term) => <button type="button" onClick={() => onSearchSubmit(term)} key={term} className="rounded bg-white px-2 py-1 text-[#356081] transition-colors hover:bg-[#dceef6]">{term}</button>)}</div>
          </div>
          <div className="relative mt-2 block min-h-[230px] overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_60%_40%,#ffffff_0%,#e4f4fa_50%,#d1e9f4_100%)] shadow-[0_25px_60px_rgba(13,74,110,0.14)] sm:min-h-[300px] lg:mt-0 lg:min-h-[390px] lg:rounded-[2rem]">
            <img src={`${import.meta.env.BASE_URL}images/vw-taos-panel.png`} alt="SUV Volkswagen azul" className="absolute inset-0 h-full w-full object-cover object-center mix-blend-multiply" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#d7edf6]/65 to-transparent" />
            <div className="absolute left-7 top-7 rounded-full border border-white/80 bg-white/75 px-4 py-2 text-xs font-semibold text-[#0069b4] backdrop-blur">Volkswagen · Gama SUV</div>
          </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {cards.map((card) => { const Icon = card.icon; return (
              <button key={card.title} onClick={card.action} className="group min-h-32 rounded-lg border border-slate-200/80 bg-white p-4 text-left shadow-[0_5px_18px_rgba(23,59,87,0.07)] transition-all hover:-translate-y-1 hover:border-[#8bc9e2] hover:shadow-[0_12px_28px_rgba(23,97,137,0.13)] sm:p-5">
                <Icon className="h-6 w-6 text-[#1576bd]" strokeWidth={1.6} /><h3 className="mt-3 text-sm font-bold leading-tight text-[#071e3a]">{card.title}</h3><p className="mt-1.5 text-xs leading-relaxed text-slate-600">{card.text}</p><ArrowRight className="mt-3 h-4 w-4 text-[#0069b4] transition-transform group-hover:translate-x-1" />
              </button>
            ); })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm font-semibold tracking-[0.12em] text-[#0069b4] uppercase">Seguimiento transparente</p><h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#071e3a] sm:text-5xl">¿En qué etapa estás?</h2><p className="mt-3 text-base text-slate-600">Elegí una etapa para conocer qué sucede y qué viene después.</p></div><button onClick={() => onNavigate('process')} className="inline-flex items-center gap-2 rounded-full bg-[#071e3a] px-6 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]">Ver mi proceso completo <ArrowRight className="h-4 w-4" /></button></div>
          <div className="mt-14 overflow-x-auto pb-4">
            <div className="flex min-w-[900px] items-start justify-between px-2">
              {stages.map((stage, index) => { const Icon = stage.icon; return (
                <React.Fragment key={stage.id}>
                  <button onClick={() => onSelectStage(stage.id)} className="group flex w-28 shrink-0 flex-col items-center text-center" aria-label={`Ver etapa ${stage.label}`}>
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e0eff5] text-[#176ca7] shadow-sm transition-all group-hover:scale-110 group-hover:bg-[#0069b4] group-hover:text-white group-focus-visible:ring-4 group-focus-visible:ring-[#9fd7ed]"><Icon className="h-7 w-7" strokeWidth={1.5} /></span>
                    <span className="mt-4 text-sm font-bold leading-tight text-[#173d5a] group-hover:text-[#0069b4]">{stage.label}</span>
                  </button>
                  {index < stages.length - 1 && <span className="mt-8 flex h-px min-w-7 flex-1 items-center justify-center bg-[#bed9e5]"><ArrowRight className="h-5 w-5 translate-x-1/2 text-[#5e9bbb]" /></span>}
                </React.Fragment>
              ); })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#e9f7fc]"><div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1fr_auto] md:items-center lg:px-12"><div><div className="flex items-center gap-2 text-sm font-semibold text-[#0069b4]"><ShieldCheck className="h-5 w-5" /> Acompañamiento transparente</div><h2 className="mt-3 text-3xl font-light tracking-[-0.04em] text-[#071e3a] sm:text-4xl">¿Ya comenzaste tu operación?</h2><p className="mt-3 max-w-xl text-slate-600">Consultá el estado de tu compra, documentación y próximos pasos desde un solo lugar.</p></div><button onClick={onOpenTrackerModal} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#071e3a] px-6 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"><FileCheck2 className="h-4 w-4" /> Ver mi operación</button></div></section>
      <section className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:px-12"><button onClick={() => onNavigate('faq')} className="group flex w-full items-center justify-between border-y border-slate-200 py-7 text-left"><span className="flex items-center gap-3 text-xl font-light tracking-[-0.03em] text-[#071e3a]"><CircleHelp className="h-6 w-6 text-[#0069b4]" /> ¿Tenés alguna pregunta?</span><span className="inline-flex items-center gap-2 text-sm font-bold text-[#0069b4]">Ver respuestas <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></button></section>
    </div>
  );
};
