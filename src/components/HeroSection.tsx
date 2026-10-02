import React, { useRef, useState } from 'react';
import { ArrowDown, ArrowRight, CalendarCheck, CarFront, CircleHelp, Clock, CreditCard, ExternalLink, FileCheck2, FileSignature, FileText, KeyRound, ReceiptText, Search, ShieldCheck, Wrench } from 'lucide-react';
import { ActiveTab } from './Navbar';
import { ProcessStageId } from '../types';
import { useData } from '../context/DataContext';

interface HeroSectionProps {
  onSelectStage: (stageId: ProcessStageId) => void;
  onSearchSubmit: (query: string) => void;
  onOpenTrackerModal: () => void;
  onNavigate: (tab: ActiveTab, category?: string, stageId?: ProcessStageId) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectStage, onSearchSubmit, onOpenTrackerModal, onNavigate }) => {
  const { stages, getText } = useData();
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
  const stageIcons: Record<string, React.ElementType> = { FileSignature, ReceiptText, FileCheck2, FolderCheck: FileCheck2, ShieldCheck, Wrench, CalendarCheck, Car: CarFront, CarFront, KeyRound };

  return (
    <div className="bg-white">
      <section className="relative flex min-h-[650px] items-end overflow-hidden bg-[#001e50] sm:min-h-[700px]">
        <img src={`${import.meta.env.BASE_URL}images/autosol-official-hero.webp`} alt="Volkswagen Tiguan en un entorno cotidiano" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,30,80,0.92)_0%,rgba(0,30,80,0.72)_38%,rgba(0,30,80,0.1)_76%),linear-gradient(0deg,rgba(0,30,80,0.62)_0%,transparent_52%)]" />
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-12 pt-32 sm:px-8 sm:pb-16 lg:px-12">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold tracking-[0.16em] text-[#008cff] uppercase">{getText('hero_eyebrow', 'Autosol Jujuy')}</p>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-white sm:text-7xl lg:text-8xl">{getText('hero_title', 'Tu próximo camino empieza acá.')}</h1>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">{getText('hero_description', 'Información clara sobre definiciones, trámites y cada etapa para acompañarte durante la compra de tu próximo 0km.')}</p>
          </div>
          <button onClick={scrollToServices} className="mt-12 flex items-center gap-3 text-sm text-white/75 transition-colors hover:text-white" aria-label="Bajar a servicios"><span className="h-px w-10 bg-white/60" /> {getText('hero_scroll', 'Descubrí más')} <ArrowDown className="h-4 w-4 animate-bounce" /></button>
        </div>
      </section>

      <section ref={servicesRef} className="relative flex min-h-screen scroll-mt-0 items-center overflow-hidden bg-[#ece5db] py-8 sm:py-10">
        <div className="pointer-events-none absolute -right-24 -top-44 h-[540px] w-[540px] rounded-full border-[58px] border-[#e6e6e6] opacity-70" />
        <div className="pointer-events-none absolute right-10 top-12 h-72 w-72 rounded-full border border-[#d0d1d5] opacity-80" />
        <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid items-center gap-7 lg:grid-cols-[minmax(0,0.92fr)_minmax(480px,0.9fr)] lg:gap-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.14em] text-[#0040c4] uppercase">{getText('information_eyebrow', 'Información clara, en un solo lugar')}</p>
            <h2 className="mt-3 text-4xl font-semibold leading-[1.04] tracking-[-0.05em] text-[#001e50] sm:text-5xl">{getText('information_title', 'Entender tu proceso también genera confianza.')}</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">{getText('information_description', 'Acompañamos cada etapa de tu compra con información simple, clara y actualizada.')}</p>
            <form onSubmit={(event) => { event.preventDefault(); if (searchQuery.trim()) onSearchSubmit(searchQuery.trim()); }} className="mt-7 flex max-w-xl overflow-hidden rounded-lg border border-[#a0a3aa] bg-white p-1.5 shadow-[0_8px_24px_rgba(14,71,104,0.1)]">
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={getText('search_placeholder', 'Buscá una duda, un término o una etapa...')} className="min-w-0 flex-1 bg-transparent px-3 text-sm text-[#001e50] outline-none placeholder:text-slate-400" aria-label="Buscar información" />
              <button type="submit" className="flex h-10 w-11 items-center justify-center rounded-md bg-[#0040c4] text-white transition-colors hover:bg-[#001e50]" aria-label="Buscar"><Search className="h-5 w-5" /></button>
            </form>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500"><span>Ejemplos:</span>{['patentamiento', 'gestoría', 'fecha de entrega', 'documentación'].map((term) => <button type="button" onClick={() => onSearchSubmit(term)} key={term} className="rounded bg-white px-2 py-1 text-[#404759] transition-colors hover:bg-[#e6e6e6]">{term}</button>)}</div>
          </div>
          <div className="relative mt-2 block min-h-[210px] overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_60%_40%,#ffffff_0%,#ece5db_50%,#e6e6e6_100%)] shadow-[0_25px_60px_rgba(13,74,110,0.14)] sm:min-h-[270px] lg:mt-0 lg:min-h-[330px] lg:rounded-[2rem]">
            <img src={`${import.meta.env.BASE_URL}images/vw-taos-official.webp`} alt="Volkswagen Taos en camino" className="absolute inset-0 h-full w-full object-cover object-center" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#e6e6e6]/65 to-transparent" />
            <div className="absolute left-7 top-7 rounded-full border border-white/80 bg-white/75 px-4 py-2 text-xs font-semibold text-[#0040c4] backdrop-blur">Volkswagen · Gama SUV</div>
          </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {cards.map((card) => { const Icon = card.icon; return (
              <button key={card.title} onClick={card.action} className="group min-h-28 rounded-lg border border-slate-200/80 bg-white p-4 text-left shadow-[0_5px_18px_rgba(23,59,87,0.07)] transition-all hover:-translate-y-1 hover:border-[#a0a3aa] hover:shadow-[0_12px_28px_rgba(23,97,137,0.13)]">
                <Icon className="h-5 w-5 text-[#0040c4]" strokeWidth={1.6} /><h3 className="mt-2.5 text-sm font-bold leading-tight text-[#001e50]">{card.title}</h3><p className="mt-1 text-xs leading-relaxed text-slate-600">{card.text}</p><ArrowRight className="mt-2.5 h-4 w-4 text-[#0040c4] transition-transform group-hover:translate-x-1" />
              </button>
            ); })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm font-semibold tracking-[0.12em] text-[#0040c4] uppercase">{getText('process_eyebrow', 'Seguimiento transparente')}</p><h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#001e50] sm:text-5xl">{getText('process_title', '¿En qué etapa estás?')}</h2><p className="mt-3 text-base text-slate-600">{getText('process_description', 'Elegí una etapa para conocer qué sucede y qué viene después.')}</p></div><button onClick={() => onNavigate('process')} className="inline-flex items-center gap-2 rounded-full bg-[#001e50] px-6 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]">Ver mi proceso completo <ArrowRight className="h-4 w-4" /></button></div>
          <div className="mt-14 overflow-x-auto pb-4">
            <div className="flex min-w-[900px] items-start justify-between px-2">
              {stages.map((stage, index) => { const Icon = stageIcons[stage.iconName] || CarFront; return (
                <React.Fragment key={stage.id}>
                  <button onClick={() => onSelectStage(stage.id)} className="group flex w-28 shrink-0 flex-col items-center text-center" aria-label={`Ver etapa ${stage.name}`}>
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e6e6e6] text-[#0040c4] shadow-sm transition-all group-hover:scale-110 group-hover:bg-[#0040c4] group-hover:text-white group-focus-visible:ring-4 group-focus-visible:ring-[#008cff]"><Icon className="h-7 w-7" strokeWidth={1.5} /></span>
                    <span className="mt-4 text-sm font-bold leading-tight text-[#001e50] group-hover:text-[#0040c4]">{stage.name}</span>
                  </button>
                  {index < stages.length - 1 && <span className="mt-8 flex h-px min-w-7 flex-1 items-center justify-center bg-[#d0d1d5]"><ArrowRight className="h-5 w-5 translate-x-1/2 text-[#6f7581]" /></span>}
                </React.Fragment>
              ); })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#ece5db]"><div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1fr_auto] md:items-center lg:px-12"><div><div className="flex items-center gap-2 text-sm font-semibold text-[#0040c4]"><ShieldCheck className="h-5 w-5" /> Acompañamiento transparente</div><h2 className="mt-3 text-3xl font-light tracking-[-0.04em] text-[#001e50] sm:text-4xl">¿Ya comenzaste tu operación?</h2><p className="mt-3 max-w-xl text-slate-600">Consultá el estado de tu compra, documentación y próximos pasos desde un solo lugar.</p></div><button onClick={onOpenTrackerModal} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#001e50] px-6 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"><FileCheck2 className="h-4 w-4" /> Ver mi operación</button></div></section>
      <section className="bg-[#001e50] text-white">
        <div className="mx-auto grid max-w-[1280px] gap-7 px-5 py-14 sm:px-8 md:grid-cols-[1fr_auto] md:items-center lg:px-12">
          <div>
            <p className="text-sm font-semibold text-[#008cff]">Universo Autosol</p>
            <h2 className="mt-2 max-w-2xl text-3xl font-normal leading-tight sm:text-4xl">Descubrí modelos, postventa y propuestas comerciales.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">Esta plataforma te acompaña durante tu operación. Para conocer la gama Volkswagen y todos los servicios de la concesionaria, visitá el sitio institucional de Autosol.</p>
          </div>
          <a href="https://autosol.com.ar/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-bold text-[#001e50] transition-colors hover:bg-[#008cff] hover:text-white">Ir a autosol.com.ar <ExternalLink className="h-4 w-4" /></a>
        </div>
      </section>
      <section className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:px-12"><button onClick={() => onNavigate('faq')} className="group flex w-full items-center justify-between border-y border-slate-200 py-7 text-left"><span className="flex items-center gap-3 text-xl font-light tracking-[-0.03em] text-[#001e50]"><CircleHelp className="h-6 w-6 text-[#0040c4]" /> ¿Tenés alguna pregunta?</span><span className="inline-flex items-center gap-2 text-sm font-bold text-[#0040c4]">Ver respuestas <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></button></section>
    </div>
  );
};
