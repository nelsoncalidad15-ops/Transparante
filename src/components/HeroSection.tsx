import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Car,
  FileText,
  Clock,
  KeyRound,
  CreditCard,
  ChevronRight,
  CheckCircle2,
  FileSignature,
  ReceiptText,
  FolderCheck,
  Wrench,
  CalendarCheck,
  UserCheck,
  Info,
  BookOpen,
  Sparkles,
  Building,
  Landmark,
  BadgePercent,
  Check,
  Eye,
  Award,
} from 'lucide-react';
import { ActiveTab } from './Navbar';
import { useData } from '../context/DataContext';
import { ProcessStageId } from '../types';

interface HeroSectionProps {
  onNavigate: (tab: ActiveTab, filterCategory?: string, stageId?: ProcessStageId) => void;
  onSearchSubmit: (query: string) => void;
  onOpenTrackerModal: () => void;
  onSelectStage: (stageId: ProcessStageId) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onSearchSubmit,
  onOpenTrackerModal,
  onSelectStage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStageIndex, setSelectedStageIndex] = useState(0);
  const [docProfile, setDocProfile] = useState<'fisica' | 'juridica'>('fisica');
  const [activeFinanceTab, setActiveFinanceTab] = useState<'prendario' | 'plan' | 'contado'>('prendario');
  const [checkedDeliveryItems, setCheckedDeliveryItems] = useState<{ [key: string]: boolean }>({
    dni: true,
    seguro: true,
  });

  const { stages } = useData();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
    }
  };

  const quickSearchTags = [
    { label: 'Facturación & Chasis', query: 'facturacion' },
    { label: 'Gestoría Administrativa', query: 'gestoria' },
    { label: 'Patentamiento DNRPA', query: 'patentamiento' },
    { label: 'Control PDI Taller', query: 'preparacion' },
    { label: 'Crédito Prendario', query: 'prenda' },
  ];

  const currentStage = stages[selectedStageIndex] || stages[0];

  const getStageIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileSignature':
        return FileSignature;
      case 'ReceiptText':
        return ReceiptText;
      case 'FolderCheck':
        return FolderCheck;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Wrench':
        return Wrench;
      case 'CalendarCheck':
        return CalendarCheck;
      case 'Car':
      default:
        return Car;
    }
  };

  const CurrentStageIcon = getStageIcon(currentStage?.iconName || 'Car');

  const toggleDeliveryItem = (id: string) => {
    setCheckedDeliveryItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">
      
      {/* 1. HERO PRINCIPAL ESTRUCTURADO (FONDO AZUL MARINO DE GRADIENTE CON BUSCADOR INTEGRADO Y DETALLE VISUAL) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B2265] via-[#0D2A7A] to-[#081B4E] text-white p-6 sm:p-10 md:p-12 shadow-xl border border-blue-900/40">
        
        {/* Glow ambient background effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          {/* Top Pill */}
          <div className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-blue-100 border border-white/15 shadow-inner transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>Portal Oficial de Orientación al Cliente • Autosol Salta & Jujuy</span>
          </div>

          {/* Title and Subtitle */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Tu 0km en camino con total claridad.
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-blue-100 font-light max-w-2xl mx-auto leading-relaxed">
              Conocé cada etapa del proceso, plazos estimados de fábrica, documentación obligatoria y el estado de tu trámite.
            </p>
          </div>

          {/* Integrated Search Box */}
          <div className="pt-2 max-w-2xl mx-auto">
            <form onSubmit={handleSearch}>
              <div className="flex items-center bg-white rounded-2xl p-1.5 shadow-2xl border border-white/20 focus-within:ring-4 focus-within:ring-sky-400/30 transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  id="hero-main-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscá cualquier trámite, requisito o plazo (ej: gestoría, patentamiento, entrega)..."
                  className="w-full px-3 py-2.5 text-slate-900 placeholder-slate-400 text-xs sm:text-sm bg-transparent border-none focus:outline-none font-medium"
                />
                <button
                  type="submit"
                  id="btn-hero-search-submit"
                  className="bg-[#0B2265] hover:bg-blue-900 text-white font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer shadow-md active:scale-95"
                >
                  <span>Buscar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick search tags */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3.5 text-xs">
                <span className="text-blue-200/80 text-[11px] font-medium mr-1">Consultas frecuentes:</span>
                {quickSearchTags.map((tag) => (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => {
                      setSearchQuery(tag.query);
                      onSearchSubmit(tag.query);
                    }}
                    className="bg-white/10 hover:bg-white/20 text-blue-100 hover:text-white px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all backdrop-blur-xs border border-white/10 cursor-pointer active:scale-95"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* Direct CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenTrackerModal}
              className="bg-white hover:bg-blue-50 text-[#0B2265] font-bold px-6 py-3 rounded-full text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl flex items-center space-x-2 cursor-pointer active:scale-95"
            >
              <UserCheck className="w-4 h-4 text-blue-700" />
              <span>Rastrear mi 0km (Consulta de Boleto)</span>
            </button>

            <button
              onClick={() => onNavigate('process')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3 rounded-full text-xs sm:text-sm transition-all flex items-center space-x-1.5 backdrop-blur-md border border-white/20 cursor-pointer"
            >
              <Car className="w-4 h-4 text-sky-300" />
              <span>Explorar las 7 Etapas</span>
            </button>
          </div>

        </div>
      </section>

      {/* 2. EL RECORRIDO OFICIAL EN 7 ETAPAS (STEPPER INTERACTIVO INTEGRADO) */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-8 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-blue-700 text-xs font-black uppercase tracking-wider">
              <Car className="w-4 h-4 text-blue-700" />
              <span>Proceso Integral Autosol</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              El Camino hacia tu Volkswagen 0km
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hacé clic en cualquier etapa para conocer qué sucede, sus plazos y requisitos.
            </p>
          </div>

          <button
            onClick={() => onNavigate('process')}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors cursor-pointer self-start sm:self-center"
          >
            <span>Ver mapa de proceso completo</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        {/* Desktop Stepper */}
        <div className="hidden md:flex items-center justify-between relative px-4 py-2">
          {/* Connecting Track Line */}
          <div className="absolute top-7 left-10 right-10 h-1 bg-slate-100 -z-0" />
          <div
            className="absolute top-7 left-10 h-1 bg-blue-600 -z-0 transition-all duration-300"
            style={{
              width: `${(selectedStageIndex / Math.max(1, stages.length - 1)) * 100}%`,
              maxWidth: 'calc(100% - 5rem)',
            }}
          />

          {stages.map((st, idx) => {
            const isSelected = selectedStageIndex === idx;
            const isPast = idx < selectedStageIndex;
            const Icon = getStageIcon(st.iconName);

            return (
              <button
                key={st.id}
                onClick={() => setSelectedStageIndex(idx)}
                className="relative z-10 flex flex-col items-center group cursor-pointer text-center max-w-[110px]"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                    isSelected
                      ? 'bg-blue-700 text-white shadow-md ring-4 ring-blue-100 scale-110'
                      : isPast
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {isPast ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-5 h-5" />}
                </div>

                <span
                  className={`mt-2.5 text-[11px] font-bold transition-colors line-clamp-1 ${
                    isSelected
                      ? 'text-blue-950 font-black'
                      : isPast
                      ? 'text-emerald-800'
                      : 'text-slate-600 group-hover:text-slate-900'
                  }`}
                >
                  {st.name}
                </span>

                <span className="text-[10px] text-slate-400 font-medium">
                  Paso {st.stepNumber} de 7
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile Stage Selector */}
        <div className="flex md:hidden overflow-x-auto pb-2 gap-1.5 scrollbar-thin">
          {stages.map((st, idx) => {
            const isSelected = selectedStageIndex === idx;
            return (
              <button
                key={st.id}
                onClick={() => setSelectedStageIndex(idx)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  {st.stepNumber}
                </span>
                <span>{st.name}</span>
              </button>
            );
          })}
        </div>

        {/* Detail Panel of Current Active Stage */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200/80 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center shadow-2xs">
                <CurrentStageIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-950 px-2.5 py-0.5 rounded-md">
                    Paso {currentStage.stepNumber} de 7
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md border bg-sky-50 text-sky-800 border-sky-200">
                    ⏱️ Plazo estimado: {currentStage.estimatedTime}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                  {currentStage.name}
                </h3>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectStage(currentStage.id);
                onNavigate('process', undefined, currentStage.id);
              }}
              className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-100 text-blue-900 text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer self-start sm:self-center"
            >
              <span>Ver ficha detallada</span>
              <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed">
            {currentStage.definition || currentStage.shortDesc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/70 space-y-2">
              <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>¿Qué ocurre en esta instancia?</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {(currentStage.whatHappens || []).map((point, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/70 space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                  <span>Siguiente paso del proceso:</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentStage.nextStep}
                </p>
              </div>

              {currentStage.timeDisclaimer && (
                <div className="pt-2 border-t border-slate-100 flex items-start space-x-1.5 text-[11px] text-slate-500">
                  <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{currentStage.timeDisclaimer}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. LAS 4 TARJETAS BENTO DE DESCUBRIMIENTO ESTRUCTURADO (CON SELECTORES Y CONTENIDO DIRECTO) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Guías Rápidas y Requisitos Clave
            </h2>
            <p className="text-xs text-slate-500">
              Acceso directo a la información más consultada por nuestros clientes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Bento Card 1: Requisitos & Documentación */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      Requisitos y Papeles
                    </h3>
                    <p className="text-[11px] text-slate-500">Documentación exigida por DNRPA y Autosol</p>
                  </div>
                </div>

                {/* Profile Toggle */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                  <button
                    onClick={() => setDocProfile('fisica')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      docProfile === 'fisica'
                        ? 'bg-white text-indigo-950 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Física
                  </button>
                  <button
                    onClick={() => setDocProfile('juridica')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      docProfile === 'juridica'
                        ? 'bg-white text-indigo-950 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Jurídica (Empresa)
                  </button>
                </div>
              </div>

              {/* Requirement Preview List */}
              <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 border border-slate-200/60 text-xs">
                {docProfile === 'fisica' ? (
                  <>
                    <div className="flex items-start space-x-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>DNI vigente:</strong> Frente y dorso legible del titular y cotitular.</span>
                    </div>
                    <div className="flex items-start space-x-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Constancia CUIT / CUIL:</strong> Emitida por AFIP / ANSES.</span>
                    </div>
                    <div className="flex items-start space-x-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Constancia de Domicilio:</strong> Servicio o certificado policial si no coincide.</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start space-x-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Contrato Social / Estatuto:</strong> Inscrito en Registro Público de Comercio.</span>
                    </div>
                    <div className="flex items-start space-x-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Poder o Acta de Designación:</strong> Con facultades para adquisición vehicular.</span>
                    </div>
                    <div className="flex items-start space-x-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Formularios UIF & PEP:</strong> Declaración jurada de persona jurídica.</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => onNavigate('documents')}
              className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <span>Ver todos los requisitos y descargar modelos</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bento Card 2: Financiación & Cuentas Oficiales */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      Financiación & Pagos Seguros
                    </h3>
                    <p className="text-[11px] text-slate-500">Autoahorro, prendas y bancarización oficial</p>
                  </div>
                </div>

                {/* Finance Mode Toggle */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                  <button
                    onClick={() => setActiveFinanceTab('prendario')}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      activeFinanceTab === 'prendario'
                        ? 'bg-white text-amber-950 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Prenda
                  </button>
                  <button
                    onClick={() => setActiveFinanceTab('plan')}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      activeFinanceTab === 'plan'
                        ? 'bg-white text-amber-950 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Autoahorro
                  </button>
                  <button
                    onClick={() => setActiveFinanceTab('contado')}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      activeFinanceTab === 'contado'
                        ? 'bg-white text-amber-950 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Contado
                  </button>
                </div>
              </div>

              {/* Finance content snippet */}
              <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 border border-slate-200/60 text-xs">
                {activeFinanceTab === 'prendario' && (
                  <>
                    <div className="text-slate-800 font-bold flex items-center space-x-1.5">
                      <Landmark className="w-4 h-4 text-amber-600" />
                      <span>Créditos Volkswagen Financial Services</span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Financiación de saldo a tasa fija o UVA. Requiere scoring crediticio previo y seguro vehicular endosado a favor del acreedor.
                    </p>
                  </>
                )}
                {activeFinanceTab === 'plan' && (
                  <>
                    <div className="text-slate-800 font-bold flex items-center space-x-1.5">
                      <BadgePercent className="w-4 h-4 text-amber-600" />
                      <span>Plan de Ahorro Volkswagen Oficial</span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Adjudicación por sorteo o licitación. Los gastos de retiro, alícuota y cambio de modelo se abonan únicamente a cuentas oficiales.
                    </p>
                  </>
                )}
                {activeFinanceTab === 'contado' && (
                  <>
                    <div className="text-slate-800 font-bold flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Seguridad Bancaria Autosol</span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Transferencias directas a cuenta bancaria con CBU/Alias oficial a nombre de Autosol S.A. Jamás a cuentas particulares.
                    </p>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => onNavigate('financing')}
              className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <span>Ver cuentas bancarias y calculador de cuotas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bento Card 3: Checklist Interactivo de Entrega */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      Checklist de Entrega & Salón
                    </h3>
                    <p className="text-[11px] text-slate-500">¿Qué traer el día de la entrega de llaves?</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold bg-teal-50 text-teal-800 px-2.5 py-1 rounded-full border border-teal-200">
                  Salón Oficial
                </span>
              </div>

              {/* Interactive checkboxes */}
              <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 border border-slate-200/60 text-xs">
                <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={!!checkedDeliveryItems.dni}
                    onChange={() => toggleDeliveryItem('dni')}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <span className={checkedDeliveryItems.dni ? 'line-through text-slate-400' : 'text-slate-700'}>
                    DNI original del titular / apoderado
                  </span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={!!checkedDeliveryItems.seguro}
                    onChange={() => toggleDeliveryItem('seguro')}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <span className={checkedDeliveryItems.seguro ? 'line-through text-slate-400' : 'text-slate-700'}>
                    Constancia de cobertura de seguro vigente
                  </span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={!!checkedDeliveryItems.saldo}
                    onChange={() => toggleDeliveryItem('saldo')}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <span className={checkedDeliveryItems.saldo ? 'line-through text-slate-400' : 'text-slate-700'}>
                    Comprobante de cancelación de saldo total
                  </span>
                </label>
              </div>
            </div>

            <button
              onClick={() => onNavigate('delivery')}
              className="w-full bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <span>Ver protocolo de 45 puntos y entrega</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bento Card 4: Glosario en Lenguaje Sencillo */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      Glosario Automotor Sencillo
                    </h3>
                    <p className="text-[11px] text-slate-500">Términos técnicos explicados sin vueltas</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold bg-purple-50 text-purple-800 px-2.5 py-1 rounded-full border border-purple-200">
                  +30 Términos
                </span>
              </div>

              {/* Direct Term Chips */}
              <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 border border-slate-200/60">
                <div className="text-[11px] text-slate-500 font-medium">Conceptos frecuentes:</div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { term: 'DNRPA', desc: 'Registro Nacional Automotor' },
                    { term: 'Formulario 08', desc: 'Transferencia e inscripción' },
                    { term: 'PDI', desc: 'Inspección de pre-entrega' },
                    { term: 'Chasis (VIN)', desc: 'Identificador del auto' },
                    { term: 'Prenda', desc: 'Garantía del crédito' },
                  ].map((t) => (
                    <button
                      key={t.term}
                      onClick={() => onNavigate('dictionary')}
                      className="bg-white hover:bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 hover:text-purple-900 transition-colors shadow-2xs cursor-pointer"
                    >
                      {t.term}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('dictionary')}
              className="w-full bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <span>Explorar diccionario completo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 4. GALERÍA DE TECNOLOGÍA Y CONTROL (FOTOGRAFÍAS REALES CON ACABADO ESTILO VOLKSWAGEN) */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Tecnología y control a la altura de un nuevo ícono
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Confort, seguridad y certificación en cada paso de tu Volkswagen 0km.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
          
          {/* Photo Card 1: Habitáculo */}
          <div
            onClick={() => onNavigate('delivery')}
            className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col"
          >
            <div className="h-44 sm:h-48 overflow-hidden bg-slate-900 relative">
              <img
                src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80"
                alt="Volkswagen SUV en camino"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#0B2265] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                Gama 0km
              </span>
            </div>
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-blue-900 transition-colors">
                  Llegada y Asignación de Unidad
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Seguimiento de la unidad desde su despacho de fábrica hasta su ingreso al centro de logística Autosol.
                </p>
              </div>
              <div className="pt-1 flex items-center text-xs font-bold text-blue-700">
                <span>Ver etapa de traslado</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Photo Card 2: Taller y PDI */}
          <div
            onClick={() => onNavigate('process', undefined, 'etapa-5')}
            className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col"
          >
            <div className="h-44 sm:h-48 overflow-hidden bg-slate-900 relative">
              <img
                src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80"
                alt="Inspección PDI en taller oficial"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-emerald-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                Taller Oficial
              </span>
            </div>
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-blue-900 transition-colors">
                  Inspección Técnica PDI (45 Puntos)
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Diagnóstico computarizado, control de fluidos y chequeo de seguridad antes de la entrega al cliente.
                </p>
              </div>
              <div className="pt-1 flex items-center text-xs font-bold text-emerald-700">
                <span>Conocer los 45 puntos</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Photo Card 3: Cockpit y Entrega */}
          <div
            onClick={() => onNavigate('delivery')}
            className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col"
          >
            <div className="h-44 sm:h-48 overflow-hidden bg-slate-900 relative">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
                alt="Interior y tecnología de a bordo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-purple-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                Entrega & Confort
              </span>
            </div>
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-blue-900 transition-colors">
                  Explicación de Tablero & Llaves
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Vincular tu teléfono con la pantalla táctil, configuración de usuario y entrega formal de documentación.
                </p>
              </div>
              <div className="pt-1 flex items-center text-xs font-bold text-purple-700">
                <span>Ver protocolo de entrega</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. BANNER FINAL DE ATENCIÓN Y SEGURIDAD AUTOSOL */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Transparencia & Seguridad Bancarizada</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              ¿Tenés dudas sobre tu número de chasis o trámite de patentamiento?
            </h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Consultá con nuestro Asistente Inteligente 24/7 o rastreá el número de boleto de compra directamente en el portal.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={onOpenTrackerModal}
              className="bg-white hover:bg-slate-100 text-slate-950 font-bold px-5 py-2.5 rounded-full text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Consultar mi Boleto
            </button>
            <button
              onClick={() => onNavigate('faq')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-4 py-2.5 rounded-full text-xs transition-all border border-slate-700 cursor-pointer"
            >
              Preguntas Frecuentes
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
