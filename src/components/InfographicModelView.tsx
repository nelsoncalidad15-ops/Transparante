import React from 'react';
import {
  AlertTriangle,
  Laptop,
  Search,
  ShoppingCart,
  FileText,
  Clock,
  CreditCard,
  Car,
  BookOpen,
  HelpCircle,
  BarChart2,
  PieChart,
  Eye,
  TrendingUp,
  RefreshCw,
  FileCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users,
  MessageSquare,
  Target,
  FileSpreadsheet,
  Layers,
  Award,
  ChevronRight,
  ThumbsUp,
  HeartHandshake,
  Lightbulb,
  Compass,
} from 'lucide-react';
import { AutosolLogo } from './AutosolLogo';
import { ActiveTab } from './Navbar';
import { ProcessStageId } from '../types';

interface InfographicModelViewProps {
  onNavigate: (tab: ActiveTab, category?: string, stageId?: ProcessStageId) => void;
  onOpenAssistant: (query?: string) => void;
  onOpenTracker: () => void;
}

export const InfographicModelView: React.FC<InfographicModelViewProps> = ({
  onNavigate,
  onOpenAssistant,
  onOpenTracker,
}) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Top Controls / Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-blue-950 tracking-tight">
              Estructura Integral del Modelo Autosol Transparente
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Diagrama interactivo de arquitectura, experiencia del cliente e indicadores de mejora
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('home')}
            className="text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 px-3.5 py-2 rounded-xl border border-blue-200 transition-colors flex items-center space-x-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Volver a la vista cliente</span>
          </button>
        </div>
      </div>

      {/* Main Infographic Frame matching the uploaded image */}
      <div className="bg-slate-100/80 p-3 sm:p-6 md:p-8 rounded-3xl border-2 border-slate-300/80 shadow-lg space-y-6">
        
        {/* INFOGRAPHIC HEADER */}
        <div className="text-center space-y-3">
          {/* Decorative Dot Grid */}
          <div className="flex justify-between items-center px-4 opacity-40">
            <div className="grid grid-cols-4 gap-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-900" />
              ))}
            </div>
            <div className="flex justify-center">
              <AutosolLogo size="lg" showSubtitle={false} />
            </div>
            <div className="grid grid-cols-4 gap-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-900" />
              ))}
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#0B2265] tracking-tight uppercase">
            AUTOSOL TRANSPARENTE
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-700 max-w-3xl mx-auto">
            Centro digital de orientación para acompañar al cliente durante su operación
          </p>

          {/* QUOTE BANNER */}
          <div className="max-w-4xl mx-auto mt-4 bg-[#0B2265] text-white px-5 sm:px-8 py-3.5 rounded-2xl sm:rounded-full shadow-md flex items-center justify-center space-x-3 text-center border-2 border-blue-900">
            <span className="text-emerald-400 font-serif font-black text-2xl leading-none">“</span>
            <p className="text-xs sm:text-sm md:text-base font-semibold text-blue-50">
              Informar no es solo decir en qué estado está una operación; también es ayudar al cliente a comprender qué significa.
            </p>
            <span className="text-emerald-400 font-serif font-black text-2xl leading-none">”</span>
          </div>
        </div>

        {/* 5 COLUMNS ARCHITECTURE (1 to 5) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
          
          {/* COLUMN 1: Problema detectado */}
          <div className="bg-white rounded-2xl border-2 border-slate-300 p-4 flex flex-col justify-between shadow-xs hover:border-blue-400 transition-all">
            <div className="space-y-4">
              {/* Header Badge */}
              <div className="bg-[#0B2265] text-white rounded-xl p-2.5 flex items-center space-x-2">
                <span className="w-7 h-7 rounded-full bg-white text-[#0B2265] font-black text-sm flex items-center justify-center shrink-0">
                  1
                </span>
                <span className="font-bold text-xs sm:text-sm leading-tight">
                  Problema detectado
                </span>
              </div>

              {/* Big Icon */}
              <div className="flex justify-center py-2">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-900 border-2 border-blue-200 flex items-center justify-center">
                  <AlertTriangle className="w-9 h-9 stroke-[2.2]" />
                </div>
              </div>

              {/* Points */}
              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start space-x-2 p-1.5 rounded-lg bg-slate-50">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0" />
                  <span className="font-medium">Información dispersa</span>
                </div>
                <div className="flex items-start space-x-2 p-1.5 rounded-lg bg-slate-50">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0" />
                  <span className="font-medium">Conceptos poco claros</span>
                </div>
                <div className="flex items-start space-x-2 p-1.5 rounded-lg bg-slate-50">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0" />
                  <span className="font-medium">Tiempos y etapas que generan dudas</span>
                </div>
                <div className="flex items-start space-x-2 p-1.5 rounded-lg bg-slate-50">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0" />
                  <span className="font-medium">Incertidumbre y consultas reiteradas</span>
                </div>
              </div>
            </div>

            {/* Bottom Callout */}
            <div className="mt-4 pt-3 border-t-2 border-blue-100 bg-blue-50/70 p-3 rounded-xl text-center">
              <p className="text-[11px] font-bold text-blue-950 leading-snug">
                La falta de comprensión del proceso puede afectar la confianza del cliente.
              </p>
            </div>
          </div>

          {/* COLUMN 2: Solución propuesta */}
          <div className="bg-white rounded-2xl border-2 border-slate-300 p-4 flex flex-col justify-between shadow-xs hover:border-blue-400 transition-all">
            <div className="space-y-4">
              {/* Header Badge */}
              <div className="bg-[#0B2265] text-white rounded-xl p-2.5 flex items-center space-x-2">
                <span className="w-7 h-7 rounded-full bg-white text-[#0B2265] font-black text-sm flex items-center justify-center shrink-0">
                  2
                </span>
                <span className="font-bold text-xs sm:text-sm leading-tight">
                  Solución propuesta
                </span>
              </div>

              {/* Big Icon */}
              <div className="flex justify-center py-2">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-900 border-2 border-blue-200 flex items-center justify-center">
                  <Laptop className="w-9 h-9 stroke-[2.2]" />
                </div>
              </div>

              {/* Interactive buttons */}
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => onNavigate('library')}
                  className="w-full flex items-center space-x-2 p-2 rounded-xl bg-blue-900 text-white hover:bg-blue-800 transition-all text-left font-medium group"
                >
                  <BookOpen className="w-4 h-4 text-blue-200 shrink-0" />
                  <span className="flex-1">Biblioteca digital</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5" />
                </button>

                <button
                  onClick={() => onOpenAssistant()}
                  className="w-full flex items-center space-x-2 p-2 rounded-xl bg-blue-900 text-white hover:bg-blue-800 transition-all text-left font-medium group"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="flex-1">Asistente virtual guiado</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5" />
                </button>

                <button
                  onClick={() => onNavigate('process')}
                  className="w-full flex items-center space-x-2 p-2 rounded-xl bg-blue-900 text-white hover:bg-blue-800 transition-all text-left font-medium group"
                >
                  <Car className="w-4 h-4 text-blue-200 shrink-0" />
                  <span className="flex-1">Recorrido del proceso</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5" />
                </button>

                <button
                  onClick={() => onNavigate('faq')}
                  className="w-full flex items-center space-x-2 p-2 rounded-xl bg-blue-900 text-white hover:bg-blue-800 transition-all text-left font-medium group"
                >
                  <HelpCircle className="w-4 h-4 text-blue-200 shrink-0" />
                  <span className="flex-1">Preguntas frecuentes y glosario</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* Bottom Callout */}
            <div className="mt-4 pt-3 border-t-2 border-blue-100 bg-blue-50/70 p-3 rounded-xl text-center">
              <p className="text-[11px] font-bold text-blue-950 leading-snug">
                Una sola plataforma para entender cada etapa de la operación.
              </p>
            </div>
          </div>

          {/* COLUMN 3: ¿Qué encuentra el cliente? */}
          <div className="bg-white rounded-2xl border-2 border-blue-300 p-4 flex flex-col justify-between shadow-md hover:border-blue-500 transition-all lg:col-span-1">
            <div className="space-y-3">
              {/* Header Badge */}
              <div className="bg-blue-700 text-white rounded-xl p-2.5 flex items-center space-x-2">
                <span className="w-7 h-7 rounded-full bg-white text-blue-700 font-black text-sm flex items-center justify-center shrink-0">
                  3
                </span>
                <span className="font-bold text-xs sm:text-sm leading-tight">
                  ¿Qué encuentra el cliente?
                </span>
              </div>

              {/* Search bar simulation */}
              <div
                onClick={() => onNavigate('home')}
                className="bg-slate-50 border border-slate-300 hover:border-blue-400 rounded-xl p-2 flex items-center space-x-2 text-slate-500 text-xs cursor-pointer shadow-2xs"
              >
                <Search className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="text-[11px] truncate">Buscá una duda, término o etapa...</span>
              </div>

              {/* 6 Grid items */}
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <button
                  onClick={() => onNavigate('process')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 flex flex-col items-center justify-center transition-all cursor-pointer group"
                >
                  <ShoppingCart className="w-4 h-4 text-blue-700 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-slate-800 leading-tight mt-1">
                    Mi proceso de compra
                  </span>
                </button>

                <button
                  onClick={() => onNavigate('documents')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 flex flex-col items-center justify-center transition-all cursor-pointer group"
                >
                  <FileText className="w-4 h-4 text-blue-700 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-slate-800 leading-tight mt-1">
                    Documentación y trámites
                  </span>
                </button>

                <button
                  onClick={() => onNavigate('times')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 flex flex-col items-center justify-center transition-all cursor-pointer group"
                >
                  <Clock className="w-4 h-4 text-blue-700 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-slate-800 leading-tight mt-1">
                    Tiempos orientativos
                  </span>
                </button>

                <button
                  onClick={() => onNavigate('financing')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 flex flex-col items-center justify-center transition-all cursor-pointer group"
                >
                  <CreditCard className="w-4 h-4 text-blue-700 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-slate-800 leading-tight mt-1">
                    Financiación y pagos
                  </span>
                </button>

                <button
                  onClick={() => onNavigate('delivery')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 flex flex-col items-center justify-center transition-all cursor-pointer group"
                >
                  <Car className="w-4 h-4 text-blue-700 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-slate-800 leading-tight mt-1">
                    Entrega del vehículo
                  </span>
                </button>

                <button
                  onClick={() => onNavigate('dictionary')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 flex flex-col items-center justify-center transition-all cursor-pointer group"
                >
                  <BookOpen className="w-4 h-4 text-blue-700 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-slate-800 leading-tight mt-1">
                    Diccionario de términos
                  </span>
                </button>
              </div>

              {/* FAQ Button */}
              <button
                onClick={() => onNavigate('faq')}
                className="w-full py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-100 text-blue-900 border border-slate-300 font-bold text-[11px] flex items-center justify-center space-x-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Preguntas frecuentes</span>
              </button>

              {/* Chips */}
              <div className="pt-1">
                <div className="text-[10px] text-slate-500 font-bold text-center mb-1">
                  Ejemplos de términos:
                </div>
                <div className="flex flex-wrap justify-center gap-1">
                  {['Facturación', 'Gestoría', 'Patentamiento'].map((term) => (
                    <button
                      key={term}
                      onClick={() => onNavigate('dictionary')}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 4: Cómo funciona */}
          <div className="bg-white rounded-2xl border-2 border-slate-300 p-4 flex flex-col justify-between shadow-xs hover:border-blue-400 transition-all">
            <div className="space-y-3">
              {/* Header Badge */}
              <div className="bg-[#0B2265] text-white rounded-xl p-2.5 flex items-center space-x-2">
                <span className="w-7 h-7 rounded-full bg-white text-[#0B2265] font-black text-sm flex items-center justify-center shrink-0">
                  4
                </span>
                <span className="font-bold text-xs sm:text-sm leading-tight">
                  Cómo funciona
                </span>
              </div>

              {/* 4 Steps List */}
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center space-x-2 p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-blue-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span className="text-slate-700 font-medium">El cliente ingresa a la web</span>
                </div>

                <div className="flex items-center space-x-2 p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-blue-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span className="text-slate-700 font-medium">Busca una etapa o una duda</span>
                </div>

                <div className="flex items-center space-x-2 p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-blue-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span className="text-slate-700 font-medium">Recibe información clara y validada</span>
                </div>

                <div className="flex items-center space-x-2 p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    4
                  </span>
                  <span>Comprende el proceso y reduce su incertidumbre</span>
                </div>
              </div>

              {/* Timeline diagram mini */}
              <div className="pt-1">
                <div className="text-[10px] font-bold text-[#0B2265] text-center mb-1">
                  Línea de tiempo del proceso
                </div>
                <div className="grid grid-cols-7 gap-0.5 text-center">
                  {[
                    { name: 'Cierre', icon: FileCheck },
                    { name: 'Fact.', icon: FileText },
                    { name: 'Gestoría', icon: ShieldCheck },
                    { name: 'Patent.', icon: Car },
                    { name: 'Prep.', icon: Sparkles },
                    { name: 'Turno', icon: Clock },
                    { name: 'Entrega', icon: Award },
                  ].map((st, idx) => {
                    const Icon = st.icon;
                    return (
                      <button
                        key={st.name}
                        onClick={() => onNavigate('process')}
                        className="p-1 rounded bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[8px] font-bold text-blue-900 flex flex-col items-center cursor-pointer"
                        title={st.name}
                      >
                        <Icon className="w-2.5 h-2.5 text-blue-600 mb-0.5" />
                        <span className="truncate w-full">{st.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Callout */}
            <div className="mt-3 pt-2 border-t-2 border-blue-100 bg-blue-50/70 p-2.5 rounded-xl text-center">
              <p className="text-[10px] font-semibold text-blue-950">
                ℹ️ Cada etapa explica qué significa, cuánto puede tardar y qué sigue después.
              </p>
            </div>
          </div>

          {/* COLUMN 5: Gestión y mejora continua */}
          <div className="bg-white rounded-2xl border-2 border-slate-300 p-4 flex flex-col justify-between shadow-xs hover:border-blue-400 transition-all">
            <div className="space-y-3">
              {/* Header Badge */}
              <div className="bg-[#0B2265] text-white rounded-xl p-2.5 flex items-center space-x-2">
                <span className="w-7 h-7 rounded-full bg-white text-[#0B2265] font-black text-sm flex items-center justify-center shrink-0">
                  5
                </span>
                <span className="font-bold text-xs sm:text-sm leading-tight">
                  Gestión y mejora continua
                </span>
              </div>

              {/* Big Icon */}
              <div className="flex justify-center py-1">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 border-2 border-emerald-200 flex items-center justify-center">
                  <BarChart2 className="w-8 h-8 stroke-[2.2]" />
                </div>
              </div>

              {/* Points */}
              <div className="space-y-1.5 text-[11px] text-slate-700">
                <div className="flex items-center space-x-1.5 p-1 rounded bg-slate-50">
                  <BarChart2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Consultas más frecuentes</span>
                </div>
                <div className="flex items-center space-x-1.5 p-1 rounded bg-slate-50">
                  <Search className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Búsquedas sin respuesta</span>
                </div>
                <div className="flex items-center space-x-1.5 p-1 rounded bg-slate-50">
                  <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Contenidos más vistos</span>
                </div>
                <div className="flex items-center space-x-1.5 p-1 rounded bg-slate-50">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Temas con mayor incertidumbre</span>
                </div>
                <div className="flex items-center space-x-1.5 p-1 rounded bg-slate-50">
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Actualización dinámica</span>
                </div>
                <div className="flex items-center space-x-1.5 p-1 rounded bg-slate-50">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Control documental y versión</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('quality-dashboard')}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1 shadow-sm"
              >
                <span>Ver Panel de Calidad</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bottom Callout */}
            <div className="mt-3 pt-2 border-t-2 border-emerald-100 bg-emerald-50/70 p-2.5 rounded-xl text-center">
              <p className="text-[10px] font-bold text-emerald-950">
                ⭐ La plataforma no solo informa: también ayuda a mejorar el proceso.
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTIONS: INDICADORES & RESULTADOS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* INDICADORES SUGERIDOS */}
          <div className="bg-[#0B2265] text-white rounded-2xl p-4 sm:p-5 border-2 border-blue-900 shadow-md">
            <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-blue-800">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              <span className="font-extrabold text-xs uppercase tracking-wider text-blue-100">
                INDICADORES SUGERIDOS
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-center">
              <div className="bg-blue-900/80 p-2.5 rounded-xl border border-blue-700/60">
                <Users className="w-5 h-5 text-blue-300 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-white leading-tight">
                  N° de visitas a la plataforma
                </div>
                <div className="text-base font-black text-emerald-400 mt-1">1,248</div>
              </div>

              <div className="bg-blue-900/80 p-2.5 rounded-xl border border-blue-700/60">
                <MessageSquare className="w-5 h-5 text-blue-300 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-white leading-tight">
                  Consultas más frecuentes
                </div>
                <div className="text-base font-black text-blue-200 mt-1">456</div>
              </div>

              <div className="bg-blue-900/80 p-2.5 rounded-xl border border-blue-700/60">
                <Target className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-white leading-tight">
                  % búsquedas con resultado
                </div>
                <div className="text-base font-black text-emerald-400 mt-1">91.6%</div>
              </div>

              <div className="bg-blue-900/80 p-2.5 rounded-xl border border-blue-700/60">
                <Search className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-white leading-tight">
                  Búsquedas sin respuesta
                </div>
                <div className="text-base font-black text-amber-300 mt-1">18</div>
              </div>

              <div className="bg-blue-900/80 p-2.5 rounded-xl border border-blue-700/60">
                <Eye className="w-5 h-5 text-blue-300 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-white leading-tight">
                  Contenidos más consultados
                </div>
                <div className="text-base font-black text-blue-200 mt-1">3,890</div>
              </div>

              <div className="bg-blue-900/80 p-2.5 rounded-xl border border-blue-700/60">
                <AlertTriangle className="w-5 h-5 text-rose-400 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-white leading-tight">
                  Reclamos por falta de info
                </div>
                <div className="text-base font-black text-emerald-400 mt-1">-34%</div>
              </div>
            </div>
          </div>

          {/* RESULTADOS / IMPACTO */}
          <div className="bg-emerald-800 text-white rounded-2xl p-4 sm:p-5 border-2 border-emerald-700 shadow-md">
            <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-emerald-700">
              <Award className="w-4 h-4 text-emerald-200" />
              <span className="font-extrabold text-xs uppercase tracking-wider text-emerald-100">
                RESULTADOS / IMPACTO
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-center">
              <div className="bg-emerald-900/80 p-2.5 rounded-xl border border-emerald-600/60 flex flex-col items-center justify-center">
                <Lightbulb className="w-5 h-5 text-emerald-300 mb-1" />
                <div className="text-xs font-bold text-white">Más claridad</div>
                <div className="text-[10px] text-emerald-200 mt-0.5">Información sin tecnicismos</div>
              </div>

              <div className="bg-emerald-900/80 p-2.5 rounded-xl border border-emerald-600/60 flex flex-col items-center justify-center">
                <Compass className="w-5 h-5 text-emerald-300 mb-1" />
                <div className="text-xs font-bold text-white">Menos incertidumbre</div>
                <div className="text-[10px] text-emerald-200 mt-0.5">Plazos y etapas claras</div>
              </div>

              <div className="bg-emerald-900/80 p-2.5 rounded-xl border border-emerald-600/60 flex flex-col items-center justify-center">
                <MessageSquare className="w-5 h-5 text-emerald-300 mb-1" />
                <div className="text-xs font-bold text-white">Menos consultas</div>
                <div className="text-[10px] text-emerald-200 mt-0.5">Respuestas inmediatas</div>
              </div>

              <div className="bg-emerald-900/80 p-2.5 rounded-xl border border-emerald-600/60 flex flex-col items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-emerald-300 mb-1" />
                <div className="text-xs font-bold text-white">Más confianza</div>
                <div className="text-[10px] text-emerald-200 mt-0.5">Transparencia activa</div>
              </div>

              <div className="bg-emerald-900/80 p-2.5 rounded-xl border border-emerald-600/60 flex flex-col items-center justify-center sm:col-span-2">
                <Award className="w-5 h-5 text-emerald-300 mb-1" />
                <div className="text-xs font-bold text-white">Mejor experiencia y fidelización</div>
                <div className="text-[10px] text-emerald-200 mt-0.5">Satisfacción en la entrega del 0km</div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM VALUE CHAIN RIBBON */}
        <div className="bg-[#0B2265] text-white p-4 rounded-2xl flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-base font-extrabold shadow-md border-2 border-blue-900 text-center">
          <div className="flex items-center space-x-2 text-white">
            <span className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-emerald-400">
              ⭐
            </span>
            <span>Información clara</span>
          </div>
          <ArrowRight className="w-5 h-5 text-emerald-400 hidden sm:block" />
          <div className="flex items-center space-x-2 text-white">
            <span>Transparencia</span>
          </div>
          <ArrowRight className="w-5 h-5 text-emerald-400 hidden sm:block" />
          <div className="flex items-center space-x-2 text-white">
            <span>Confianza</span>
          </div>
          <ArrowRight className="w-5 h-5 text-emerald-400 hidden sm:block" />
          <div className="flex items-center space-x-2 text-emerald-400">
            <span>Fidelización</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
