import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Search,
  CheckCircle2,
  AlertTriangle,
  ThumbsUp,
  Eye,
  Plus,
  RefreshCw,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  FileEdit,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { UncertaintyTopic } from '../types';

interface QualityDashboardViewProps {
  onOpenAdminPanel: () => void;
  onNavigateToArticle: (slug: string) => void;
}

export const QualityDashboardView: React.FC<QualityDashboardViewProps> = ({
  onOpenAdminPanel,
  onNavigateToArticle,
}) => {
  const {
    kpis,
    uncertaintyTopics,
    unassistedSearches,
    articles,
    updateUncertaintyAction,
  } = useData();

  const [filterCategory, setFilterCategory] = useState<string>('Todo');
  const [activeTab, setActiveTab] = useState<'uncertainty' | 'unassisted' | 'topArticles'>('uncertainty');

  const topQueries = [
    { label: '1. Patentamiento y Registro', count: 1492, pct: 31, trend: '+12%' },
    { label: '2. Gestoría y honorarios', count: 1106, pct: 23, trend: '-5%' },
    { label: '3. Fecha de entrega estimada', count: 987, pct: 20, trend: '+8%' },
    { label: '4. Documentación requerida', count: 742, pct: 15, trend: '+15%' },
    { label: '5. Tiempos orientativos generales', count: 612, pct: 12, trend: '+4%' },
  ];

  const categoryDistribution = [
    { name: 'Patentamiento', count: 1840, pct: 28, color: 'bg-blue-600' },
    { name: 'Gestoría', count: 1420, pct: 22, color: 'bg-indigo-600' },
    { name: 'Tiempos y plazos', count: 1310, pct: 20, color: 'bg-sky-500' },
    { name: 'Entrega', count: 980, pct: 15, color: 'bg-emerald-500' },
    { name: 'Documentación', count: 620, pct: 9, color: 'bg-amber-500' },
    { name: 'Financiación', count: 390, pct: 6, color: 'bg-violet-500' },
  ];

  const handleActionChange = (
    id: string,
    action: UncertaintyTopic['suggestedAction'],
    status: UncertaintyTopic['actionStatus']
  ) => {
    updateUncertaintyAction(id, action, status);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-blue-400 bg-blue-950/80 border border-blue-800/60 px-3 py-1 rounded-full">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Módulo Interno de Gestión de Calidad</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Indicadores de Autosol Transparente
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
            Monitoreo continuo de dudas frecuentes, temas que generan incertidumbre y oportunidades
            de mejora en la comunicación hacia el cliente.
          </p>
        </div>

        <div className="flex gap-2.5 shrink-0">
          <button
            onClick={onOpenAdminPanel}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center space-x-2 active:scale-95"
          >
            <FileEdit className="w-4 h-4" />
            <span>Administrar Contenidos</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Visitas totales</span>
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {kpis.totalVisits.toLocaleString('es-AR')}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +18.4% este mes
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Búsquedas</span>
            <Search className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {kpis.totalSearches.toLocaleString('es-AR')}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Buscador y chat</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Resueltas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">
            {kpis.resolvedSearchesPercentage}%
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Respuestas directas</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Sin respuesta</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-600">
            {kpis.unassistedSearchesCount}
          </div>
          <span className="text-[10px] text-amber-700 font-medium">A crear en biblioteca</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Valoración Útil</span>
            <ThumbsUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-blue-900">
            {kpis.helpfulFeedbackPercentage}%
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +2.1%
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tiempo medio</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-indigo-900">
            {Math.floor(kpis.avgReadTimeSeconds / 60)}m {kpis.avgReadTimeSeconds % 60}s
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Lectura informada</span>
        </div>
      </div>

      {/* Analytics Visual Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top 5 Queries Bar Chart */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Top 5 consultas más frecuentes</h3>
              <p className="text-xs text-slate-500">Últimos 30 días en toda la plataforma</p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
              Total 4,890
            </span>
          </div>

          <div className="space-y-3.5">
            {topQueries.map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800">{item.label}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500">{item.count.toLocaleString('es-AR')}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        item.trend.startsWith('+')
                          ? 'text-emerald-700 bg-emerald-50'
                          : 'text-slate-600 bg-slate-100'
                      }`}
                    >
                      {item.trend}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${item.pct * 2.8}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown & Impact */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Consultas por categoría</h3>
              <p className="text-xs text-slate-500">Distribución porcentual de interés</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex h-4 w-full rounded-full overflow-hidden">
              {categoryDistribution.map((cat, idx) => (
                <div
                  key={idx}
                  className={`${cat.color} transition-all`}
                  style={{ width: `${cat.pct}%` }}
                  title={`${cat.name}: ${cat.pct}%`}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {categoryDistribution.map((cat, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
                    <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                    <span className="line-clamp-1">{cat.name}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-900">{cat.pct}%</span>
                    <span className="text-[10px] text-slate-400">{cat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Table: "Temas con mayor incertidumbre" */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Detección Proactiva de Incertidumbre</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Temas con mayor incertidumbre y consultas reiteradas
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Permite al equipo de Calidad priorizar mejoras de contenido y redactar nuevos FAQs.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('uncertainty')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'uncertainty' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Temas clave
            </button>
            <button
              onClick={() => setActiveTab('unassisted')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'unassisted' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Búsquedas sin resultado ({unassistedSearches.length})
            </button>
          </div>
        </div>

        {activeTab === 'uncertainty' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Tema / Concepto</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4 text-center">Consultas</th>
                  <th className="py-3 px-4 text-center">% del total</th>
                  <th className="py-3 px-4 text-center">Variación</th>
                  <th className="py-3 px-4">Acción sugerida</th>
                  <th className="py-3 px-4 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {uncertaintyTopics.map((topic) => (
                  <tr key={topic.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {topic.topic}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px]">
                        {topic.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                      {topic.queriesCount}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-600">
                      {topic.percentageTotal}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center text-[11px] font-bold ${
                          topic.monthlyVariation.startsWith('+')
                            ? 'text-rose-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {topic.monthlyVariation}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          topic.suggestedAction === 'Revisar contenido'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : topic.suggestedAction === 'Crear nuevo FAQ'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}
                      >
                        {topic.suggestedAction}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={topic.actionStatus}
                        onChange={(e) =>
                          handleActionChange(
                            topic.id,
                            topic.suggestedAction,
                            e.target.value as UncertaintyTopic['actionStatus']
                          )
                        }
                        className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Pendiente">⏳ Pendiente</option>
                        <option value="En curso">🔄 En curso</option>
                        <option value="Resuelto">✅ Resuelto</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'unassisted' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              Términos que los usuarios buscaron pero no devolvieron resultados en la biblioteca.
              Ideal para crear nuevos artículos o sinónimos.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {unassistedSearches.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      “{item.query}”
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Buscado {item.occurrences} veces • Último registro: {item.date}
                    </span>
                  </div>

                  <button
                    onClick={onOpenAdminPanel}
                    className="bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
                  >
                    + Crear contenido
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
