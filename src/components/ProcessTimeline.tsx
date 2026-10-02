import React from 'react';
import {
  FileSignature,
  ReceiptText,
  FolderCheck,
  ShieldCheck,
  Wrench,
  CalendarCheck,
  Car,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { ProcessStageId } from '../types';

interface ProcessTimelineProps {
  selectedStageId?: ProcessStageId;
  onSelectStage?: (id: ProcessStageId) => void;
  onNavigateToArticle?: (slug: string) => void;
  onSelectArticle?: (slug: string) => void;
  onOpenAssistant?: (initialQuery?: string) => void;
  onOpenTracker?: () => void;
}

export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({
  selectedStageId,
  onSelectStage,
  onNavigateToArticle,
  onSelectArticle,
  onOpenAssistant,
  onOpenTracker,
}) => {
  const { stages } = useData();
  const [internalStageId, setInternalStageId] = React.useState<ProcessStageId>(
    selectedStageId || stages[0]?.id || 'cierre'
  );

  React.useEffect(() => {
    if (selectedStageId) {
      setInternalStageId(selectedStageId);
    }
  }, [selectedStageId]);

  const handleStageSelect = (id: ProcessStageId) => {
    setInternalStageId(id);
    if (onSelectStage) {
      onSelectStage(id);
    }
  };

  const currentStage = stages.find((s) => s.id === internalStageId) || stages[0] || {
    id: 'cierre',
    stepNumber: 1,
    name: 'Operación confirmada',
    shortDesc: 'Confirmación de condiciones comerciales y documentación disponible.',
    definition: 'Es el inicio formal de la operación; no implica por sí sola que la unidad esté facturada o lista para entregar.',
    whatHappens: ['Firma de reserva', 'Definición de modalidad de pago'],
    estimatedTime: 'Según validaciones comerciales',
    timeDisclaimer: 'Sujeto a confirmación bancaria y firmas.',
    timeFactors: ['Acreditación bancaria', 'Aprobaciones crediticias'],
    nextStep: 'Facturación de la unidad.',
    iconName: 'FileSignature',
    category: 'Proceso de compra',
  };

  const getStageIcon = (iconName: string, active: boolean) => {
    const props = { className: `w-5 h-5 ${active ? 'text-white' : 'text-[#0040c4]'}` };
    switch (iconName) {
      case 'FileSignature':
        return <FileSignature {...props} strokeWidth={1.6} />;
      case 'ReceiptText':
        return <ReceiptText {...props} strokeWidth={1.6} />;
      case 'FolderCheck':
        return <FolderCheck {...props} strokeWidth={1.6} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} strokeWidth={1.6} />;
      case 'Wrench':
        return <Wrench {...props} strokeWidth={1.6} />;
      case 'CalendarCheck':
        return <CalendarCheck {...props} strokeWidth={1.6} />;
      case 'Car':
      default:
        return <Car {...props} strokeWidth={1.6} />;
    }
  };

  const currentIndex = Math.max(0, stages.findIndex((s) => s.id === currentStage.id));
  const nextStage = currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;
  const prevStage = currentIndex > 0 ? stages[currentIndex - 1] : null;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Editorial Volkswagen */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-[0_5px_20px_rgba(7,30,58,0.05)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[36px] border-[#e6e6e6]/60" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.16em] text-[#0040c4] uppercase">
              Recorrido Oficial en 7 Pasos
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.05em] text-[#001e50]">
              Mi Proceso de Compra
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              Cada etapa explicada con total claridad: qué significa, qué documentación se tramita y los plazos estimados para acompañar tu 0km.
            </p>
          </div>

          {onOpenTracker && (
            <button
              onClick={onOpenTracker}
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#001e50] px-6 py-3.5 text-xs sm:text-sm font-bold text-white transition-all hover:scale-[1.02] hover:bg-[#0040c4] shadow-sm cursor-pointer self-start md:self-auto shrink-0"
            >
              <UserCheck className="h-4 w-4" />
              <span>Consultar mi estado actual</span>
            </button>
          )}
        </div>
      </div>

      {/* Stepper Horizontal (Minimalista, amplio, sin textos cortados) */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-[0_5px_20px_rgba(7,30,58,0.04)]">
        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="relative flex items-start justify-between">
            {/* Base line */}
            <div className="absolute top-6 left-8 right-8 h-0.5 bg-[#e6e6e6] -z-0" />
            {/* Active progress line */}
            <div
              className="absolute top-6 left-8 h-0.5 bg-[#0040c4] -z-0 transition-all duration-300"
              style={{
                width: `${(currentIndex / Math.max(1, stages.length - 1)) * 100}%`,
                maxWidth: 'calc(100% - 4rem)',
              }}
            />

            {stages.map((stage, idx) => {
              const isSelected = stage.id === currentStage.id;
              const isPast = idx < currentIndex;

              return (
                <button
                  key={stage.id}
                  id={`btn-stage-stepper-${stage.id}`}
                  onClick={() => handleStageSelect(stage.id)}
                  className="group relative z-10 flex flex-col items-center cursor-pointer text-center w-32 focus:outline-none"
                  aria-label={`Paso ${stage.stepNumber}: ${stage.name}`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#001e50] text-white ring-4 ring-[#e6e6e6] scale-110 shadow-md'
                        : isPast
                        ? 'bg-[#e6e6e6] text-[#0040c4] border border-[#d0d1d5] group-hover:bg-[#0040c4] group-hover:text-white'
                        : 'bg-white text-slate-400 border border-slate-200 group-hover:border-[#a0a3aa] group-hover:text-[#0040c4]'
                    }`}
                  >
                    {getStageIcon(stage.iconName, isSelected)}
                  </div>

                  <span className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Paso 0{stage.stepNumber}
                  </span>

                  <span
                    className={`mt-1 text-xs font-semibold leading-snug transition-colors line-clamp-2 px-1 ${
                      isSelected
                        ? 'text-[#001e50] font-bold'
                        : isPast
                        ? 'text-[#001e50]'
                        : 'text-slate-600 group-hover:text-[#0040c4]'
                    }`}
                  >
                    {stage.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tablet / Mobile Scrollable Track */}
        <div className="lg:hidden flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {stages.map((stage, idx) => {
            const isSelected = stage.id === currentStage.id;
            const isPast = idx < currentIndex;

            return (
              <button
                key={stage.id}
                onClick={() => handleStageSelect(stage.id)}
                className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold shrink-0 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#001e50] text-white border-[#001e50] shadow-sm'
                    : isPast
                    ? 'bg-[#e6e6e6] text-[#001e50] border-[#d0d1d5]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#a0a3aa]'
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    isSelected
                      ? 'bg-white text-[#001e50]'
                      : isPast
                      ? 'bg-[#0040c4] text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {stage.stepNumber}
                </span>
                <span className="whitespace-nowrap">{stage.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inspector de Etapa (Diseño Editorial a 2 Columnas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Índice de las 7 Etapas */}
        <div className="hidden lg:block lg:col-span-4 rounded-3xl bg-white border border-slate-200/80 p-4 shadow-[0_5px_20px_rgba(7,30,58,0.04)] space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Todas las etapas del recorrido
          </div>
          {stages.map((stage) => {
            const isSelected = stage.id === currentStage.id;
            return (
              <button
                key={stage.id}
                onClick={() => handleStageSelect(stage.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#ece5db] text-[#001e50] border border-[#a0a3aa]/80 font-bold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                      isSelected ? 'bg-[#0040c4] text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    0{stage.stepNumber}
                  </span>
                  <div>
                    <div className="text-xs font-semibold leading-tight text-[#001e50]">{stage.name}</div>
                    <div className="text-[11px] text-slate-500 font-normal mt-0.5">{stage.estimatedTime}</div>
                  </div>
                </div>
                <ChevronRight className={`h-4 w-4 ${isSelected ? 'text-[#0040c4]' : 'text-slate-300'}`} />
              </button>
            );
          })}
        </div>

        {/* Columna Derecha: Detalle Profundo de la Etapa Seleccionada */}
        <div className="lg:col-span-8 rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-[0_5px_20px_rgba(7,30,58,0.04)] space-y-6">
          {/* Fila Superior: Badges e Identificación */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6e6e6] text-[#0040c4] border border-[#e6e6e6]">
                {getStageIcon(currentStage.iconName, false)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#e6e6e6] px-3 py-1 text-[11px] font-semibold text-[#0040c4]">
                    Etapa 0{currentStage.stepNumber} de 07
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
                    ⏱️ {currentStage.estimatedTime}
                  </span>
                </div>
                <h2 className="mt-1.5 text-xl sm:text-2xl font-semibold tracking-[-0.04em] text-[#001e50]">
                  {currentStage.name}
                </h2>
              </div>
            </div>
          </div>

          {/* Resumen explicativo principal */}
          <div className="rounded-2xl bg-[#ece5db] border border-[#e6e6e6] p-4 sm:p-5 text-sm leading-relaxed text-[#001e50]">
            {currentStage.definition || currentStage.shortDesc}
          </div>

          {/* Bloques de Información Clave */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bloque 1: Qué sucede */}
            <div className="rounded-2xl border border-slate-200/80 p-4 sm:p-5 bg-white shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#001e50]">
                <CheckCircle2 className="h-4 w-4 text-[#0040c4]" />
                <span>¿Qué sucede en esta etapa?</span>
              </div>
              <ul className="space-y-2 text-xs leading-relaxed text-slate-600">
                {(currentStage.whatHappens || []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#0040c4] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bloque 2: Qué viene después y observaciones */}
            <div className="rounded-2xl border border-slate-200/80 p-4 sm:p-5 bg-white shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#001e50]">
                  <ArrowRight className="h-4 w-4 text-[#0040c4]" />
                  <span>¿Qué viene después?</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-600">
                  {currentStage.nextStep}
                </p>
              </div>

              {currentStage.timeDisclaimer && (
                <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
                  <Clock className="h-3.5 w-3.5 text-[#0040c4] shrink-0 mt-0.5" />
                  <span>{currentStage.timeDisclaimer}</span>
                </div>
              )}
            </div>
          </div>

          {/* Navegación entre etapas */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            {prevStage ? (
              <button
                onClick={() => handleStageSelect(prevStage.id)}
                className="group flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:border-[#001e50] hover:text-[#001e50] cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                <span>Paso 0{prevStage.stepNumber}: {prevStage.name}</span>
              </button>
            ) : <div />}

            {nextStage && (
              <button
                onClick={() => handleStageSelect(nextStage.id)}
                className="group flex items-center gap-2 rounded-full bg-[#001e50] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#0040c4] cursor-pointer"
              >
                <span>Paso 0{nextStage.stepNumber}: {nextStage.name}</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
