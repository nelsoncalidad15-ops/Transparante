import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Search,
  CheckCircle2,
  AlertTriangle,
  ThumbsUp,
  Eye,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  FileEdit,
  Compass,
  MessageCircleQuestion,
  PhoneCall,
  Send,
  Download,
  Flame,
  Zap,
  Layers,
  Users,
  CarFront,
  Filter,
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
    exportDataAsJSON,
  } = useData();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [activeTab, setActiveTab] = useState<'uncertainty' | 'unassisted' | 'topArticles'>('uncertainty');
  const [selectedBuyerType, setSelectedBuyerType] = useState<'all' | 'plan' | 'direct'>('all');

  // "¿Qué es lo que más pregunta el cliente?" - Top preguntas con volumen y variación
  const topQueries = [
    {
      topic: 'Patentamiento, aranceles y formularios 08/01',
      category: 'Gestoría y Registro',
      count: 1860,
      pct: 34,
      trend: '+14%',
      friction: 'Alta',
      color: 'bg-blue-600',
    },
    {
      topic: 'Plazos reales de transporte y arribo desde fábrica',
      category: 'Tiempos y Logística',
      count: 1420,
      pct: 26,
      trend: '+9%',
      friction: 'Alta',
      color: 'bg-indigo-600',
    },
    {
      topic: 'Firma de Prenda y Requisitos crediticios',
      category: 'Financiación',
      count: 875,
      pct: 16,
      trend: '-2%',
      friction: 'Media',
      color: 'bg-sky-500',
    },
    {
      topic: 'Confirmación de pago de saldo y transferencias oficiales',
      category: 'Cobranzas',
      count: 602,
      pct: 11,
      trend: '+5%',
      friction: 'Media',
      color: 'bg-emerald-600',
    },
    {
      topic: 'Turno de entrega y documentación requerida para retiro',
      category: 'Entrega 0km',
      count: 438,
      pct: 8,
      trend: '+18%',
      friction: 'Media',
      color: 'bg-amber-500',
    },
    {
      topic: 'Póliza de seguro contra todo riesgo y 1er service',
      category: 'Posventa',
      count: 285,
      pct: 5,
      trend: '+3%',
      friction: 'Baja',
      color: 'bg-violet-600',
    },
  ];

  // "¿A dónde quiere ir el cliente?" - Destinos de navegación y secciones de mayor interés
  const navigationDestinations = [
    {
      destination: 'Documentación y Trámites de Gestoría',
      views: 2410,
      pct: 38,
      intent: 'Saber qué papeles llevar y cuánto cuesta el patentamiento',
      barColor: 'bg-blue-600',
    },
    {
      destination: 'Tiempos Orientativos por Etapa',
      views: 1720,
      pct: 27,
      intent: 'Calcular cuándo llega el camión cigüeña a Jujuy',
      barColor: 'bg-sky-600',
    },
    {
      destination: 'Línea de Tiempo del Proceso (7 Etapas)',
      views: 1330,
      pct: 21,
      intent: 'Ver en qué estado general está una operación 0km',
      barColor: 'bg-indigo-600',
    },
    {
      destination: 'Bot de Consulta Rápida (Asistente)',
      views: 570,
      pct: 9,
      intent: 'Hacer una pregunta directa sobre su caso',
      barColor: 'bg-emerald-600',
    },
    {
      destination: 'Financiación, Pagos y Cuentas Oficiales',
      views: 310,
      pct: 5,
      intent: 'Evitar fraudes y consultar datos bancarios seguros',
      barColor: 'bg-amber-500',
    },
  ];

  // Acciones y canales de resolución elegidos por el usuario
  const exitChannels = [
    { channel: 'Autoservicio resuelto en web', count: 3945, pct: 72, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { channel: 'Contacto por WhatsApp a Asesor', count: 1040, pct: 19, icon: Send, color: 'text-green-600 bg-green-50 border-green-200' },
    { channel: 'Llamada telefónica a Sucursal Jujuy', count: 328, pct: 6, icon: PhoneCall, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { channel: 'Descarga de Instructivo / Check-list', count: 167, pct: 3, icon: Download, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  ];

  // Semáforo de Fricción por Etapa (1 al 7)
  const stageFriction = [
    { stage: '1. Reserva', pct: 5, label: 'Baja', color: 'bg-emerald-500', reason: 'Dudas sobre seña y documentación personal' },
    { stage: '2. Pedido', pct: 11, label: 'Media', color: 'bg-sky-500', reason: 'Ansiedad por confirmación de cupo en fábrica' },
    { stage: '3. Asignación', pct: 18, label: 'Media-Alta', color: 'bg-blue-600', reason: 'Número de chasis y tiempo de transporte' },
    { stage: '4. Pago Total', pct: 14, label: 'Media', color: 'bg-indigo-600', reason: 'Medios de pago, facturación y recibos' },
    { stage: '5. Patentamiento', pct: 36, label: 'CRÍTICA ⚠️', color: 'bg-rose-500', reason: 'Aranceles del Registro, firma 08 y gestoría' },
    { stage: '6. Alistamiento', pct: 7, label: 'Baja', color: 'bg-emerald-500', reason: 'Revisión técnica de taller y lavado' },
    { stage: '7. Entrega', pct: 9, label: 'Media', color: 'bg-amber-500', reason: 'Coordinación de horario y seguro activo' },
  ];

  const handleActionChange = (
    id: string,
    action: UncertaintyTopic['suggestedAction'],
    status: UncertaintyTopic['actionStatus']
  ) => {
    updateUncertaintyAction(id, action, status);
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(exportDataAsJSON());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `autosol-indicadores-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header Banner - Executive styling */}
      <div className="bg-[#001e50] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-sky-300 bg-blue-950/80 border border-sky-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Panel de Inteligencia y Calidad Autosol</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Dashboard de Consultas y Comportamiento del Cliente
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/80 max-w-3xl font-normal leading-relaxed">
            Métricas consolidadas sobre qué temas generan más dudas, hacia dónde navegan los clientes,
            los puntos de fricción en el proceso de entrega y la efectividad del autoservicio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Time range selector */}
          <div className="inline-flex rounded-xl bg-blue-950/60 p-1 border border-white/10 text-xs font-semibold">
            {(['7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === r
                    ? 'bg-white text-[#001e50] shadow-sm font-bold'
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                {r === '7d' ? '7 días' : r === '30d' ? '30 días' : 'Trimestre'}
              </button>
            ))}
          </div>

          <button
            onClick={handleExport}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all border border-white/15 flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar</span>
          </button>

          <button
            onClick={onOpenAdminPanel}
            className="bg-[#0040c4] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center space-x-2 active:scale-95 cursor-pointer"
          >
            <FileEdit className="w-4 h-4" />
            <span>Editar contenidos</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row (6 Key Health Indicators) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Consultas Totales</span>
            <Search className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            5.480
          </div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +18.4% este mes
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Auto-resolución</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {kpis.resolvedSearchesPercentage}%
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Sin llamar a la sucursal</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Dudas Críticas</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">
            14
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Focos de fricción</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Feedback Útil</span>
            <ThumbsUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-900">
            {kpis.helpfulFeedbackPercentage}%
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +2.1%
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Tiempo Medio</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-900">
            3m 42s
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Lectura informada</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Casos Gestor</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-900">
            18
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Derivados a asesor</span>
        </div>
      </div>

      {/* SECCIÓN 1: ¿QUÉ ES LO QUE MÁS PREGUNTA EL CLIENTE? (Gráficos de barras principales) */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>Demanda de Información</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              ¿Qué es lo que más pregunta el cliente?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Ranking de temas con mayor volumen de consultas y nivel de incertidumbre reportado.
            </p>
          </div>

          {/* Buyer type selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setSelectedBuyerType('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedBuyerType === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedBuyerType('plan')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedBuyerType === 'plan' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Autoahorro (Plan)
            </button>
            <button
              onClick={() => setSelectedBuyerType('direct')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedBuyerType === 'direct' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Venta Directa
            </button>
          </div>
        </div>

        {/* Visual Horizontal Bar Charts */}
        <div className="space-y-5">
          {topQueries.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-semibold gap-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-700">
                    {idx + 1}
                  </span>
                  <span className="text-slate-900 font-bold text-sm">{item.topic}</span>
                  <span className="hidden sm:inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                    {item.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-slate-800 font-bold text-sm">
                    {item.count.toLocaleString('es-AR')} consultas ({item.pct}%)
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      item.trend.startsWith('+')
                        ? 'text-rose-700 bg-rose-50 border border-rose-200'
                        : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                    }`}
                  >
                    {item.trend}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      item.friction === 'Alta'
                        ? 'text-rose-700 bg-rose-100'
                        : item.friction === 'Media'
                        ? 'text-amber-700 bg-amber-100'
                        : 'text-emerald-700 bg-emerald-100'
                    }`}
                  >
                    Fricción {item.friction}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-700`}
                  style={{ width: `${item.pct * 2.8}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Modalidad de Compra Insights Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900">Autoahorro VW (58% del volumen)</span>
              <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">3.178 consultas</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Las principales dudas se concentran en <strong>Adjudicación y Cuotas Puras (Etapa 3)</strong> y los <strong>Gastos de Entrega y Retiro (Etapa 5)</strong>. Reclaman saber de antemano el monto exacto de la integración de cuotas.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">Venta Convencional (42% del volumen)</span>
              <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md">2.302 consultas</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              La mayor consulta radica en <strong>Arribo del Camión Cigüeña (Etapa 3)</strong> y los <strong>Tiempos de Patentamiento (Etapa 5)</strong>. El cliente busca agendar su viaje al concesionario apenas se emite la factura.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: ¿A DÓNDE QUIERE IR EL CLIENTE? (Destinos e Intenciones) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Destinations */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
                <Compass className="w-3.5 h-3.5" />
                <span>Rutas de Navegación</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">¿A dónde quiere ir el cliente?</h3>
              <p className="text-xs text-slate-500">Secciones y trámites de mayor destino en el sitio</p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
              Total 6,340 vistas
            </span>
          </div>

          <div className="space-y-4">
            {navigationDestinations.map((dest, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-900 font-bold">{dest.destination}</span>
                  <span className="text-slate-700 font-bold">{dest.views.toLocaleString('es-AR')} vistas ({dest.pct}%)</span>
                </div>
                <p className="text-[11px] text-slate-500 italic">Intención: {dest.intent}</p>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${dest.barColor} rounded-full transition-all duration-700`}
                    style={{ width: `${dest.pct * 2.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exit Channels & Actions */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Canales de Salida</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">¿Qué acción toma el cliente?</h3>
                <p className="text-xs text-slate-500">Comportamiento posterior a informarse</p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              {exitChannels.map((ch, i) => {
                const IconComponent = ch.icon;
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-2xl border ${ch.color}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className="h-4 w-4 shrink-0" />
                      <div>
                        <p className="text-xs font-bold">{ch.channel}</p>
                        <p className="text-[10px] opacity-80">{ch.count.toLocaleString('es-AR')} operaciones</p>
                      </div>
                    </div>
                    <span className="text-sm font-black">{ch.pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-xs text-blue-900 space-y-1">
            <span className="font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
              Alta efectividad de Autoservicio
            </span>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              El 72% de los compradores encuentra respuesta inmediata sin saturar el conmutador ni requerir asistencia manual de los asesores.
            </p>
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: MAPA DE CALOR Y FRICCIÓN POR ETAPA (1 A 7) */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center space-x-1.5 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Fricción en el Camino del 0km</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Nivel de dudas y consultas a lo largo de las 7 etapas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Identifica con exactitud en qué punto del trámite el comprador experimenta mayor incertidumbre.
          </p>
        </div>

        {/* 7 Columns Visual Graph */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {stageFriction.map((stage, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-3.5 flex flex-col justify-between space-y-3 transition-all ${
                stage.label.includes('CRÍTICA')
                  ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/30'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <span className="text-[11px] font-bold text-slate-900 block truncate">
                  {stage.stage}
                </span>
                <span
                  className={`inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    stage.label.includes('CRÍTICA')
                      ? 'bg-rose-600 text-white'
                      : stage.label === 'Media-Alta'
                      ? 'bg-blue-600 text-white'
                      : stage.label === 'Media'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-emerald-100 text-emerald-900'
                  }`}
                >
                  {stage.label}
                </span>
              </div>

              {/* Bar height */}
              <div className="w-full bg-slate-200 h-24 rounded-xl flex items-end overflow-hidden p-1">
                <div
                  className={`w-full rounded-lg ${stage.color} transition-all duration-700 flex items-center justify-center`}
                  style={{ height: `${stage.pct * 2.6}%` }}
                >
                  <span className="text-[10px] font-black text-white">{stage.pct}%</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 leading-tight">
                {stage.reason}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-0.5">
            <span className="font-bold">Acción Recomendada para Calidad:</span>
            <p className="leading-relaxed">
              La <strong>Etapa 5 (Gestoría y Patentamiento)</strong> concentra el 36% de todas las quejas e incertidumbres. Recomendamos enviar un WhatsApp automatizado con el instructivo de aranceles antes de que el cliente deba firmar el Formulario 08.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN 4: TABLA DETALLADA DE ACCIONES Y RESOLUCIÓN */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Detección Proactiva de Incertidumbre</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Temas de Incertidumbre y Estado de Corrección
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Permite al equipo de Calidad priorizar mejoras de contenido y redactar nuevos FAQs.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('uncertainty')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'uncertainty' ? 'bg-[#001e50] text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Temas clave ({uncertaintyTopics.length})
            </button>
            <button
              onClick={() => setActiveTab('unassisted')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'unassisted' ? 'bg-[#001e50] text-white' : 'bg-slate-100 text-slate-600'
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
                        className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
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
                    className="bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs cursor-pointer"
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
