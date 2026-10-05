import React, { useEffect, useState } from 'react';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  CircleHelp,
  FileCheck2,
  ExternalLink,
  CarFront,
  FileText,
  Clock,
  KeyRound,
  CreditCard,
  FileSignature,
  ReceiptText,
  Wrench,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface HeroSectionProps {
  onSelectStage: (stageId: string) => void;
  onSearchSubmit: (query: string) => void;
  onNavigate: (tab: any) => void;
  onOpenTrackerModal?: () => void;
}

const BANNERS = [
  {
    id: 'tera',
    image: `${import.meta.env.BASE_URL}images/banners/1-WEB.jpg`,
    imageXs: `${import.meta.env.BASE_URL}images/banners/1-WEB_xs.jpg`,
    alt: 'Nuevo Volkswagen Tera - El nuevo ícono de Volkswagen',
  },
  {
    id: 'nivus',
    image: `${import.meta.env.BASE_URL}images/banners/2-WEB.jpg`,
    imageXs: `${import.meta.env.BASE_URL}images/banners/2-WEB_xs.jpg`,
    alt: 'Nuevo Volkswagen Nivus - Nuevas emociones',
  },
  {
    id: 'amarok',
    image: `${import.meta.env.BASE_URL}images/banners/3-WEB.jpg`,
    imageXs: `${import.meta.env.BASE_URL}images/banners/3-WEB_xs.jpg`,
    alt: 'Nueva Volkswagen Amarok - Fuerza que nació para el campo',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectStage,
  onSearchSubmit,
  onNavigate,
}) => {

  const { stages, getText } = useData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-advance carousel every 5.5 seconds unless paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  };

  const cards = [
    {
      title: 'Mi proceso de compra',
      text: 'Conocé cada etapa de tu operación paso a paso.',
      icon: CarFront,
      action: () => onNavigate('process'),
    },
    {
      title: 'Documentación y trámites',
      text: 'Todo lo necesario, explicado con claridad.',
      icon: FileText,
      action: () => onNavigate('documents'),
    },
    {
      title: 'Tiempos orientativos',
      text: 'Estimaciones y factores de cada etapa.',
      icon: Clock,
      action: () => onNavigate('times'),
    },
    {
      title: 'Entrega del vehículo',
      text: 'Qué sucede antes y el día del retiro de tu 0km.',
      icon: KeyRound,
      action: () => onNavigate('delivery'),
    },
    {
      title: 'Financiación y pagos',
      text: 'Opciones, requisitos y transferencias oficiales.',
      icon: CreditCard,
      action: () => onNavigate('financing'),
    },
    {
      title: 'Preguntas frecuentes',
      text: 'Respuestas simples a las dudas más comunes.',
      icon: CircleHelp,
      action: () => onNavigate('faq'),
    },
  ];

  const stageIcons: Record<string, React.ElementType> = {
    FileSignature,
    ReceiptText,
    FileCheck2,
    FolderCheck: FileCheck2,
    ShieldCheck,
    Wrench,
    CalendarCheck,
    Car: CarFront,
    CarFront,
    KeyRound,
  };

  return (
    <div className="bg-white text-slate-900">
      {/* 1. HERO CAROUSEL: Official autosol.com.ar banners with exact aspect ratios */}
      <section
        className="relative w-full overflow-hidden bg-black select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-label="Carrusel de modelos Volkswagen Autosol"
      >
        {/* Sliding images strip */}
        <div
          className="flex transition-transform duration-700 ease-in-out w-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {BANNERS.map((banner, index) => (
            <div
              key={banner.id}
              className="relative w-full shrink-0 aspect-[601/680] md:aspect-[25/7] overflow-hidden bg-black"
            >
              <picture className="block w-full h-full">
                <source media="(max-width: 767px)" srcSet={banner.imageXs} />
                <img
                  src={banner.image}
                  alt={banner.alt}
                  className="w-full h-full object-cover object-center"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </picture>
            </div>
          ))}
        </div>

        {/* Navigation Arrow Left (<) - Elegant edge zone matching autosol.com.ar */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-0 bottom-0 z-20 flex w-12 sm:w-16 items-center justify-center text-white/75 hover:text-white hover:bg-black/15 transition-all cursor-pointer group"
          aria-label="Banner anterior"
        >
          <ChevronLeft className="h-8 w-8 sm:h-10 sm:w-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-transform group-hover:-translate-x-1" strokeWidth={2} />
        </button>

        {/* Navigation Arrow Right (>) - Elegant edge zone matching autosol.com.ar */}
        <button
          onClick={nextSlide}
          className="absolute right-0 top-0 bottom-0 z-20 flex w-12 sm:w-16 items-center justify-center text-white/75 hover:text-white hover:bg-black/15 transition-all cursor-pointer group"
          aria-label="Siguiente banner"
        >
          <ChevronRight className="h-8 w-8 sm:h-10 sm:w-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-transform group-hover:translate-x-1" strokeWidth={2} />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] ${
                currentSlide === idx
                  ? 'w-6 bg-white'
                  : 'w-1.5 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Ir al banner ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. INFORMATION & SEARCH SECTION (Expansive wide container, dark VW typography) */}
      <section id="informacion" className="relative overflow-hidden bg-[#ece5db] py-14 sm:py-20 border-b border-slate-200">
        <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-8 lg:px-12 xl:px-16">
          {/* Section Header with Black / Deep Navy Typography */}
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-xs sm:text-sm font-bold tracking-[0.16em] text-black uppercase">
              {getText('information_eyebrow', 'Información clara, en un solo lugar')}
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.04em] text-black">
              {getText('information_title', 'Entender tu proceso también genera confianza.')}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed max-w-2xl mx-auto font-normal">
              {getText(
                'information_description',
                'Acompañamos cada etapa de tu compra con información simple, clara y actualizada.'
              )}
            </p>

            {/* Central Search Bar */}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (searchQuery.trim()) onSearchSubmit(searchQuery.trim());
              }}
              className="mt-8 flex overflow-hidden rounded-xl border border-[#a0a3aa] bg-white p-1.5 shadow-[0_8px_24px_rgba(0,30,80,0.06)] max-w-3xl mx-auto"
            >
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={getText(
                  'search_placeholder',
                  'Buscá una duda, un término o una etapa (ej: patentamiento, gestoría, tiempos)...'
                )}
                className="min-w-0 flex-1 bg-transparent px-4 text-sm sm:text-base text-black outline-none placeholder:text-slate-400 font-medium"
                aria-label="Buscar información"
              />
              <button
                type="submit"
                className="flex h-11 px-5 items-center justify-center gap-2 rounded-lg bg-[#002244] text-white transition-colors hover:bg-[#002244] hover:brightness-125 cursor-pointer"
                aria-label="Buscar"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline text-xs font-bold">Buscar</span>
              </button>
            </form>

            {/* Search Suggestions */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
              <span className="font-bold text-black">Temas frecuentes:</span>
              {['patentamiento', 'gestoría', 'fecha de entrega', 'documentación', 'chasis'].map(
                (term) => (
                  <button
                    type="button"
                    onClick={() => onSearchSubmit(term)}
                    key={term}
                    className="rounded-full bg-white border border-slate-300 px-3.5 py-1 text-xs text-black font-medium hover:border-black hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>

          {/* 6 Key Service Cards: Wide full-width layout */}
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.title}
                  onClick={card.action}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-[0_4px_16px_rgba(0,30,80,0.04)] transition-all hover:-translate-y-1.5 hover:border-black hover:shadow-[0_14px_32px_rgba(0,30,80,0.09)] cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ece5db] text-[#002244] transition-colors group-hover:bg-[#002244] hover:brightness-125 group-hover:text-white">
                      <Icon className="h-6 w-6" strokeWidth={1.8} />
                    </div>
                    <h2 className="mt-4 text-base font-bold leading-snug text-black group-hover:text-[#002244] transition-colors">
                      {card.title}
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                      {card.text}
                    </p>
                  </div>
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center text-xs font-bold text-black group-hover:text-[#002244] transition-colors">
                    <span>Consultar guía</span>
                    <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE PROCESS TIMELINE: 7 STEPS (Wide full-screen container) */}
      <section className="bg-white py-16 sm:py-24 border-b border-slate-200">
        <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs sm:text-sm font-bold tracking-[0.14em] text-black uppercase">
                {getText('process_eyebrow', 'Etapas del proceso')}
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-black">
                {getText('process_title', '¿En qué etapa de tu compra estás?')}
              </h2>
              <p className="mt-2 text-sm text-slate-700 max-w-2xl">
                {getText(
                  'process_description',
                  'Elegí una etapa para conocer qué sucede, qué documentación interviene y qué viene después.'
                )}
              </p>
            </div>
            <button
              onClick={() => onNavigate('process')}
              className="inline-flex items-center gap-2 rounded-full bg-[#002244] px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-[#002244] hover:brightness-125 hover:scale-[1.02] cursor-pointer"
            >
              <span>Ver mi proceso completo</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Stepper spanning the full wide screen */}
          <div className="mt-12 overflow-x-auto pb-4 scrollbar-thin">
            <div className="flex min-w-[960px] items-start justify-between px-2">
              {stages.map((stage, index) => {
                const Icon = stageIcons[stage.iconName] || CarFront;
                return (
                  <React.Fragment key={stage.id}>
                    <button
                      onClick={() => onSelectStage(stage.id)}
                      className="group flex w-32 shrink-0 flex-col items-center text-center cursor-pointer"
                      aria-label={`Ver etapa ${stage.name}`}
                    >
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ece5db] text-black shadow-sm transition-all group-hover:scale-110 group-hover:bg-[#002244] hover:brightness-125 group-hover:text-white">
                        <Icon className="h-7 w-7" strokeWidth={1.6} />
                      </span>
                      <span className="mt-3 text-xs font-bold leading-tight text-black group-hover:text-[#002244]">
                        {stage.name}
                      </span>
                      <span className="mt-1 text-[10px] text-slate-500 font-medium">
                        Paso 0{stage.stepNumber || index + 1}
                      </span>
                    </button>
                    {index < stages.length - 1 && (
                      <span className="mt-8 flex h-px min-w-8 flex-1 items-center justify-center bg-[#d0d1d5]">
                        <ArrowRight className="h-4 w-4 translate-x-1/2 text-[#a0a3aa]" />
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. UNIFIED CONCLUDING CARDS (Replaces all stacked horizontal stripes) */}
      <section className="bg-[#e6e6e6] py-14 sm:py-20">
        <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Card 1: Preguntas Frecuentes */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-wider">
                  <CircleHelp className="h-4 w-4 text-[#002244]" />
                  <span>Centro de ayuda</span>
                </div>
                <h3 className="mt-3 text-2xl font-bold text-black">
                  ¿Tenés dudas sobre tu trámite?
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Consultá nuestras preguntas frecuentes para encontrar respuestas inmediatas sobre patentamiento, requisitos de gestoría, plazos estimados y documentación obligatoria.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigate('faq')}
                  className="inline-flex items-center gap-2 rounded-full bg-[#002244] px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition-all hover:bg-[#002244] hover:brightness-125 cursor-pointer"
                >
                  <span>Ver preguntas frecuentes</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Card 2: Portal comercial oficial Autosol */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-wider">
                  <CarFront className="h-4 w-4 text-[#002244]" />
                  <span>Otro tipo de consulta</span>
                </div>
                <h3 className="mt-3 text-2xl font-bold text-black">
                  ¿Buscás modelos, precios o un test drive?
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Esta página explica las etapas de compra y entrega. Para información comercial, consultá el sitio principal de Autosol.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <a
                  href="https://autosol.com.ar/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#002244] px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition-all hover:bg-[#002244] hover:brightness-125 cursor-pointer"
                >
                  <span>Visitar autosol.com.ar</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <span className="text-xs text-slate-500 font-medium">Jujuy y Salta</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
