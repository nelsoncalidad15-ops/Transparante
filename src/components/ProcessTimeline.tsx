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
    name: 'Cierre de operación',
    shortDesc: 'Formalización del boleto de reserva, seña y validación comercial.',
    definition: 'Es el punto de partida formal donde se acuerdan las condiciones comerciales.',
    whatHappens: ['Firma de reserva', 'Definición de modalidad de pago'],
    estimatedTime: '1 a 3 días hábiles',
    timeDisclaimer: 'Sujeto a confirmación bancaria y firmas.',
    timeFactors: ['Acreditación bancaria', 'Aprobaciones crediticias'],
    nextStep: 'Facturación de la unidad.',
    iconName: 'FileSignature',
    category: 'Proceso de compra',
  };

  const getStageIcon = (iconName: string, active: boolean) => {
    const props = { className: `w-4 h-4 ${active ? 'text-white' : 'text-slate-600'}` };
    switch (iconName) {
      case 'FileSignature':
        return <FileSignature {...props} />;
      case 'ReceiptText':
        return <ReceiptText {...props} />;
      case 'FolderCheck':
        return <FolderCheck {...props} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      case 'Wrench':
        return <Wrench {...props} />;
      case 'CalendarCheck':
        return <CalendarCheck {...props} />;
      case 'Car':
      default:
        return <Car {...props} />;
    }
  };

  const currentIndex = Math.max(0, stages.findIndex((s) => s.id === currentStage.id));
  const nextStage = currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;
  const prevStage = currentIndex > 0 ? stages[currentIndex - 1] : null;

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-200">
      {/* Executive Header (Frosted Glass) */}
      <div className="bg-gradient-to-r from-[#0B2265]/95 via-blue-950/95 to-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 text-sky-200 px-3 py-1 rounded-full text-xs font-semibold border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>Recorrido Oficial en 7 Pasos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Mi Proceso de Compra
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 font-normal">
            Cada etapa explicada con total claridad: qué significa, qué documentación se tramita y los plazos estimados.
          </p>
        </div>

        {onOpenTracker && (
          <button
            onClick={onOpenTracker}
            className="bg-white hover:bg-blue-50 text-[#0B2265] text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center space-x-2 shrink-0 self-start md:self-center cursor-pointer active:scale-95"
          >
            <UserCheck className="w-4 h-4 text-blue-700" />
            <span>Consultar mi estado actual</span>
          </button>
        )}
      </div>

      {/* Stepper Bar (Horizontal with Pastel Active States) */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-xs">
        <div className="hidden md:flex items-center justify-between relative px-2">
          {/* Connecting line */}
          <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200/80 -z-0" />
          <div
            className="absolute top-5 left-8 h-1 bg-blue-700 -z-0 transition-all duration-300"
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
                className="relative z-10 flex flex-col items-center group cursor-pointer text-center max-w-[95px]"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 ${
                    isSelected
                      ? 'bg-blue-700 text-white shadow-md ring-4 ring-blue-100 scale-105'
                      : isPast
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {isPast ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    getStageIcon(stage.iconName, isSelected)
                  )}
                </div>

                <span
                  className={`mt-2 text-[11px] font-bold transition-colors line-clamp-1 ${
                    isSelected
                      ? 'text-blue-950 font-black'
                      : isPast
                      ? 'text-emerald-800'
                      : 'text-slate-600 group-hover:text-slate-900'
                  }`}
                >
                  {stage.name}
                </span>

                <span className="text-[9px] text-slate-400 font-semibold">Paso {stage.stepNumber}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Horizontal Pill Scroll */}
        <div className="flex md:hidden overflow-x-auto pb-1 gap-1.5 scrollbar-thin">
          {stages.map((stage) => {
            const isSelected = stage.id === currentStage.id;
            return (
              <button
                key={stage.id}
                onClick={() => handleStageSelect(stage.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    isSelected ? 'bg-white text-blue-700' : 'bg-slate-300 text-slate-800'
                  }`}
                >
                  {stage.stepNumber}
                </span>
                <span className="truncate">{stage.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Synergic Stage Inspector Card (Concise, High Impact) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Stage Selector List */}
        <div className="hidden lg:block lg:col-span-4 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-3.5 shadow-xs space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Todas las Etapas
          </div>
          {stages.map((stage) => {
            const isSelected = stage.id === currentStage.id;
            return (
              <button
                key={stage.id}
                onClick={() => handleStageSelect(stage.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-50 text-sky-950 border border-sky-200 font-bold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`w-6 h-6 rounded-lg text-[11px] font-bold flex items-center justify-center ${
                      isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {stage.stepNumber}
                  </span>
                  <div>
                    <div className="text-xs font-bold truncate">{stage.name}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{stage.estimatedTime}</div>
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-700' : 'text-slate-300'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Column: Active Stage Details Card */}
        <div className="lg:col-span-8 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200/60 flex items-center justify-center">
                {getStageIcon(currentStage.iconName, false)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md">
                    Etapa {currentStage.stepNumber} de 7
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    ⏱️ {currentStage.estimatedTime}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  {currentStage.name}
                </h2>
              </div>
            </div>
          </div>

          {/* Quick Summary Pill */}
          <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-3.5 text-xs text-sky-950 font-medium leading-relaxed">
            {currentStage.definition || currentStage.shortDesc}
          </div>

          {/* 3 Concise Key Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70 space-y-2">
              <div className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>¿Qué sucede en esta etapa?</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {(currentStage.whatHappens || []).map((req, i) => (
                  <li key={i} className="flex items-start space-x-1.5 text-[11px]">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                  <span>¿Qué viene después?</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed text-[11px]">
                  {currentStage.nextStep}
                </p>
              </div>

              {currentStage.timeDisclaimer && (
                <div className="pt-2 border-t border-slate-200/60 flex items-start space-x-1.5 text-[10px] text-slate-500">
                  <Clock className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                  <span>{currentStage.timeDisclaimer}</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {prevStage ? (
              <button
                onClick={() => handleStageSelect(prevStage.id)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1 p-2 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Paso {prevStage.stepNumber}: {prevStage.name}</span>
              </button>
            ) : <div />}

            {nextStage && (
              <button
                onClick={() => handleStageSelect(nextStage.id)}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center space-x-1 p-2 rounded-xl hover:bg-blue-50 cursor-pointer"
              >
                <span>Paso {nextStage.stepNumber}: {nextStage.name}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
