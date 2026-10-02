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
  onOpenTrackerModal: () => void;
}

const BANNERS = [
  {
    id: 'tera',
    image: `${import.meta.env.BASE_URL}images/banners/5-WEB.jpg`,
    alt: 'Nuevo Volkswagen Tera',
  },
  {
    id: 'taos',
    image: `${import.meta.env.BASE_URL}images/banners/2-WEB.jpg`,
    alt: 'Volkswagen Taos',
  },
  {
    id: 'tcross',
    image: `${import.meta.env.BASE_URL}images/banners/3-WEB.jpg`,
    alt: 'Volkswagen T-Cross',
  },
  {
    id: 'amarok',
    image: `${import.meta.env.BASE_URL}images/banners/1-WEB.jpg`,
    alt: 'Volkswagen Amarok V6',
  },
  {
    id: 'polo',
    image: `${import.meta.env.BASE_URL}images/banners/4-WEB.jpg`,
    alt: 'Volkswagen Polo Track',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectStage,
  onSearchSubmit,
  onNavigate,
  onOpenTrackerModal,
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
      {/* 1. HERO CAROUSEL: Official autosol.com.ar banners sliding sideways */}
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
              className="relative w-full shrink-0 aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/9] min-h-[260px] sm:min-h-[400px] max-h-[580px] overflow-hidden bg-black"
            >
              <img
                src={banner.image}
                alt={banner.alt}
                className="w-full h-full object-cover object-center"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {/* Small, discreet floating badge on top-left (keeps image clean without covering cars) */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-8 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-3.5 py-1 text-xs font-semibold text-white shadow-md">
            <span className="h-2 w-2 rounded-full bg-[#008cff] animate-pulse" />
            Autosol Transparente · Centro oficial de orientación
          </span>
        </div>

        {/* Navigation Arrow Left (<) */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-xs transition-all hover:bg-black/75 hover:scale-105 cursor-pointer"
          aria-label="Banner anterior"
        >
          <ChevronLeft className="h-5 w-5 sm:h-7 sm:w-7 stroke-[2]" />
        </button>

        {/* Navigation Arrow Right (>) */}
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-xs transition-all hover:bg-black/75 hover:scale-105 cursor-pointer"
          aria-label="Siguiente banner"
        >
          <ChevronRight className="h-5 w-5 sm:h-7 sm:w-7 stroke-[2]" />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === idx
                  ? 'w-7 bg-white'
                  : 'w-2 bg-white/40 hover:bg-white/75'
              }`}
              aria-label={`Ir al banner ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. INFORMATION & SEARCH SECTION (Dark typography on warm light background) */}
      <section className="relative overflow-hidden bg-[#f7f5f0] py-12 sm:py-16 border-b border-slate-200">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          {/* Section Header with Black / Deep Navy Typography */}
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs sm:text-sm font-bold tracking-[0.16em] text-[#0040c4] uppercase">
              {getText('information_eyebrow', 'Información clara, en un solo lugar')}
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.04em] text-[#001e50]">
              {getText('information_title', 'Entender tu proceso también genera confianza.')}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
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
              className="mt-6 flex overflow-hidden rounded-xl border border-[#a0a3aa] bg-white p-1.5 shadow-[0_8px_24px_rgba(14,71,104,0.08)] max-w-2xl mx-auto"
            >
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={getText(
                  'search_placeholder',
                  'Buscá una duda, un término o una etapa (ej: patentamiento, gestoría)...'
                )}
                className="min-w-0 flex-1 bg-transparent px-3 text-xs sm:text-sm text-[#001e50] outline-none placeholder:text-slate-400 font-medium"
                aria-label="Buscar información"
              />
              <button
                type="submit"
                className="flex h-10 w-11 sm:w-24 items-center justify-center gap-1.5 rounded-lg bg-[#001e50] text-white transition-colors hover:bg-[#0040c4] cursor-pointer"
                aria-label="Buscar"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline text-xs font-bold">Buscar</span>
              </button>
            </form>

            {/* Search Suggestions */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-400">Temas frecuentes:</span>
              {['patentamiento', 'gestoría', 'fecha de entrega', 'documentación', 'chasis'].map(
                (term) => (
                  <button
                    type="button"
                    onClick={() => onSearchSubmit(term)}
                    key={term}
                    className="rounded-full bg-white border border-slate-200 px-3 py-0.5 text-xs text-slate-700 hover:border-[#001e50] hover:text-[#001e50] transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>

          {/* 6 Key Service Cards */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.title}
                  onClick={card.action}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_4px_16px_rgba(0,30,80,0.04)] transition-all hover:-translate-y-1 hover:border-[#0040c4] hover:shadow-[0_12px_28px_rgba(0,30,80,0.08)] cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ece5db] text-[#0040c4] transition-colors group-hover:bg-[#001e50] group-hover:text-white">
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <h2 className="mt-3 text-sm font-bold leading-snug text-[#001e50] group-hover:text-[#0040c4] transition-colors">
                      {card.title}
                    </h2>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                      {card.text}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-[#0040c4]">
                    <span>Consultar</span>
                    <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE PROCESS TIMELINE: 7 STEPS */}
      <section className="bg-white py-16 sm:py-24 border-b border-slate-200">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs sm:text-sm font-bold tracking-[0.14em] text-[#0040c4] uppercase">
                {getText('process_eyebrow', 'Seguimiento transparente')}
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-[#001e50]">
                {getText('process_title', '¿En qué etapa estás?')}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {getText(
                  'process_description',
                  'Elegí una etapa para conocer qué sucede y qué viene después.'
                )}
              </p>
            </div>
            <button
              onClick={() => onNavigate('process')}
              className="inline-flex items-center gap-2 rounded-full bg-[#001e50] px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-[#0040c4] hover:scale-[1.02] cursor-pointer"
            >
              <span>Ver mi proceso completo</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Horizontal Stage Stepper */}
          <div className="mt-12 overflow-x-auto pb-4 scrollbar-thin">
            <div className="flex min-w-[880px] items-start justify-between px-2">
              {stages.map((stage, index) => {
                const Icon = stageIcons[stage.iconName] || CarFront;
                return (
                  <React.Fragment key={stage.id}>
                    <button
                      onClick={() => onSelectStage(stage.id)}
                      className="group flex w-28 shrink-0 flex-col items-center text-center cursor-pointer"
                      aria-label={`Ver etapa ${stage.name}`}
                    >
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ece5db] text-[#001e50] shadow-sm transition-all group-hover:scale-110 group-hover:bg-[#001e50] group-hover:text-white">
                        <Icon className="h-7 w-7" strokeWidth={1.6} />
                      </span>
                      <span className="mt-3 text-xs font-bold leading-tight text-[#001e50] group-hover:text-[#0040c4]">
                        {stage.name}
                      </span>
                      <span className="mt-1 text-[10px] text-slate-400 font-medium">
                        Paso 0{stage.stepNumber || index + 1}
                      </span>
                    </button>
                    {index < stages.length - 1 && (
                      <span className="mt-8 flex h-px min-w-6 flex-1 items-center justify-center bg-[#d0d1d5]">
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

      {/* 4. TRACKER CTA BANNER */}
      <section className="bg-[#ece5db] py-14 sm:py-16">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-5 sm:px-8 md:grid-cols-[1fr_auto] md:items-center lg:px-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#0040c4] uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-[#0040c4]" />
              <span>Acompañamiento transparente</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#001e50]">
              ¿Ya comenzaste tu operación?
            </h2>
            <p className="mt-2 max-w-xl text-xs sm:text-sm text-slate-600 leading-relaxed">
              Consultá el estado de tu compra, documentación y próximos pasos ingresando tu número de operación o DNI.
            </p>
          </div>
          <button
            onClick={onOpenTrackerModal}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#001e50] px-6 py-3.5 text-xs sm:text-sm font-bold text-white transition-all hover:bg-[#0040c4] hover:scale-[1.02] cursor-pointer"
          >
            <FileCheck2 className="h-4 w-4" />
            <span>Ver mi operación</span>
          </button>
        </div>
      </section>

      {/* 5. UNIVERSO AUTOSOL SECTION (Deep navy card linking to commercial site) */}
      <section className="bg-[#001e50] text-white py-14 sm:py-16">
        <div className="mx-auto grid max-w-[1280px] gap-6 px-5 sm:px-8 md:grid-cols-[1fr_auto] md:items-center lg:px-12">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-[#008cff] uppercase tracking-wider">
              Universo Autosol
            </p>
            <h2 className="mt-2 max-w-2xl text-2xl sm:text-3xl font-semibold leading-tight text-white">
              Descubrí modelos, postventa y promociones vigentes.
            </h2>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-blue-100/80">
              Esta plataforma digital te acompaña durante tu operación. Para conocer toda la gama de 0km Volkswagen, repuestos y servicios del concesionario, visitá el portal oficial de Autosol.
            </p>
          </div>
          <a
            href="https://autosol.com.ar/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs sm:text-sm font-bold text-[#001e50] transition-colors hover:bg-[#008cff] hover:text-white cursor-pointer"
          >
            <span>Ir a autosol.com.ar</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* 6. FAQ BAR SHORTCUT */}
      <section className="mx-auto max-w-[1280px] px-5 py-12 sm:px-8 lg:px-12">
        <button
          onClick={() => onNavigate('faq')}
          className="group flex w-full items-center justify-between border-y border-slate-200 py-6 text-left cursor-pointer"
        >
          <span className="flex items-center gap-3 text-lg sm:text-xl font-semibold text-[#001e50]">
            <CircleHelp className="h-5 w-5 text-[#0040c4]" />
            <span>¿Tenés alguna pregunta sobre tu trámite?</span>
          </span>
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0040c4] group-hover:underline">
            <span>Ver respuestas</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </button>
      </section>
    </div>
  );
};
