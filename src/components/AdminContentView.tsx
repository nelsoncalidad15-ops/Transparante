import React, { useState } from 'react';
import {
  FileEdit,
  Plus,
  Trash2,
  CheckCircle,
  Eye,
  RefreshCw,
  Download,
  Upload,
  Settings,
  ShieldCheck,
  FileSpreadsheet,
  Copy,
  Check,
  X,
  Sparkles,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { LibraryArticle, ContentCategory, ContentType } from '../types';
import { INITIAL_SHEET_TEMPLATE_INFO } from '../data/defaultData';

export const AdminContentView: React.FC = () => {
  const {
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
    toggleArticleStatus,
    sheetConfig,
    updateSheetConfig,
    syncWithGoogleSheets,
    exportDataAsJSON,
    importDataFromJSON,
    resetToDefaults,
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState<'table' | 'sheets' | 'export'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('Todo');
  const [editingArticle, setEditingArticle] = useState<LibraryArticle | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Gestoría' as ContentCategory,
    type: 'Artículo' as ContentType,
    shortDesc: '',
    definition: '',
    estimatedTime: '7 a 15 días hábiles',
    timeFactorsText: 'Tiempos del Registro Seccional\nCarga administrativa',
    whatNext: 'Pase a la siguiente etapa de preparación.',
    relatedTopicsText: 'Gestoría, Patentamiento, Documentación',
    readTimeMinutes: 3,
    status: 'Publicado' as LibraryArticle['status'],
    responsible: 'Área Calidad y Procesos',
    version: '1.0',
  });

  const categories: ContentCategory[] = [
    'Proceso de compra',
    'Documentación',
    'Gestoría',
    'Patentamiento',
    'Facturación',
    'Entrega',
    'Financiación',
    'Tiempos y plazos',
    'Conceptos frecuentes',
  ];

  const handleOpenCreateModal = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Gestoría',
      type: 'Artículo',
      shortDesc: '',
      definition: '',
      estimatedTime: '7 a 15 días hábiles',
      timeFactorsText: 'Demoras en organismos públicos\nDocumentación complementaria',
      whatNext: 'Coordinación con el equipo de entregas.',
      relatedTopicsText: 'Gestoría, Patentamiento, Documentación',
      readTimeMinutes: 3,
      status: 'Publicado',
      responsible: 'Área Calidad y Procesos',
      version: '1.0',
    });
    setIsNewModalOpen(true);
  };

  const handleOpenEditModal = (art: LibraryArticle) => {
    setEditingArticle(art);
    setFormData({
      title: art.title,
      slug: art.slug,
      category: art.category,
      type: art.type,
      shortDesc: art.shortDesc,
      definition: art.definition,
      estimatedTime: art.estimatedTime || '',
      timeFactorsText: (art.timeFactors || []).join('\n'),
      whatNext: art.whatNext || '',
      relatedTopicsText: (art.relatedTopics || []).join(', '),
      readTimeMinutes: art.readTimeMinutes,
      status: art.status,
      responsible: art.responsible,
      version: art.version,
    });
    setIsNewModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const timeFactors = formData.timeFactorsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const relatedTopics = formData.relatedTopicsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingArticle) {
      updateArticle(editingArticle.id, {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: formData.category,
        type: formData.type,
        shortDesc: formData.shortDesc,
        definition: formData.definition,
        estimatedTime: formData.estimatedTime,
        timeFactors,
        whatNext: formData.whatNext,
        relatedTopics,
        readTimeMinutes: Number(formData.readTimeMinutes),
        status: formData.status,
        responsible: formData.responsible,
        version: formData.version,
      });
    } else {
      addArticle({
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: formData.category,
        type: formData.type,
        shortDesc: formData.shortDesc,
        definition: formData.definition,
        estimatedTime: formData.estimatedTime,
        timeFactors,
        whatNext: formData.whatNext,
        relatedTopics,
        readTimeMinutes: Number(formData.readTimeMinutes),
        status: formData.status,
        responsible: formData.responsible,
        version: formData.version,
        lastReview: new Date().toISOString().split('T')[0],
      });
    }

    setIsNewModalOpen(false);
  };

  const handleSyncSheets = async () => {
    setIsSyncing(true);
    setSyncStatusMsg(null);
    try {
      const res = await syncWithGoogleSheets();
      if (res.success) {
        setSyncStatusMsg({ type: 'success', text: res.message });
      } else {
        setSyncStatusMsg({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setSyncStatusMsg({ type: 'error', text: 'Error de conexión con el endpoint.' });
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredArticles = articles.filter((art) => {
    const matchCat = filterCategory === 'Todo' || art.category === filterCategory;
    const matchSearch =
      !searchQuery.trim() ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.responsible.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCopyAppsScript = () => {
    navigator.clipboard?.writeText(INITIAL_SHEET_TEMPLATE_INFO.sampleAppsScript);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadJSON = () => {
    const jsonStr = exportDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autosol-transparente-contenidos-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-blue-400 bg-blue-950/80 border border-blue-800/60 px-3 py-1 rounded-full">
            <Settings className="w-3.5 h-3.5" />
            <span>Control Documental y Contenidos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Panel Administrador de Contenidos
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal leading-relaxed">
            Mantenimiento y publicación de guías, definiciones, tiempos orientativos y sincronización
            con Google Sheets / Apps Script.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-2xl transition-all shadow-md flex items-center space-x-2 shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Contenido</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('table')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 ${
            activeSubTab === 'table'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileEdit className="w-4 h-4" />
          <span>Gestión de Contenidos ({articles.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sheets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 ${
            activeSubTab === 'sheets'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
          <span>Google Sheets & Apps Script Sync</span>
        </button>

        <button
          onClick={() => setActiveSubTab('export')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 ${
            activeSubTab === 'export'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Exportar / Importar Datos</span>
        </button>
      </div>

      {/* TAB 1: Content Table */}
      {activeSubTab === 'table' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título o responsable..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-xs font-semibold text-slate-400">Categoría:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none"
              >
                <option value="Todo">Todas las categorías</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">ID / Slug</th>
                  <th className="py-3 px-3">Título</th>
                  <th className="py-3 px-3">Categoría</th>
                  <th className="py-3 px-3">Tipo</th>
                  <th className="py-3 px-3">Tiempo</th>
                  <th className="py-3 px-3 text-center">Estado</th>
                  <th className="py-3 px-3">Revisión</th>
                  <th className="py-3 px-3">Responsable</th>
                  <th className="py-3 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">{art.id}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 max-w-[200px] truncate">
                      {art.title}
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md text-[11px] font-semibold">
                        {art.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{art.type}</td>
                    <td className="py-3 px-3 text-slate-700 font-semibold">{art.estimatedTime || '—'}</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          art.status === 'Publicado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : art.status === 'En revisión'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {art.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{art.lastReview}</td>
                    <td className="py-3 px-3 text-slate-600 text-[11px] truncate max-w-[120px]">
                      {art.responsible}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => handleOpenEditModal(art)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Editar"
                        >
                          <FileEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            toggleArticleStatus(
                              art.id,
                              art.status === 'Publicado' ? 'Desactivado' : 'Publicado'
                            )
                          }
                          className={`p-1.5 rounded-lg ${
                            art.status === 'Publicado'
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={art.status === 'Publicado' ? 'Desactivar' : 'Publicar'}
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar "${art.title}"?`)) {
                              deleteArticle(art.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Google Sheets & Apps Script Integration */}
      {activeSubTab === 'sheets' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Conexión Dinámica y Segura con Google Sheets</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Sincronización de Contenidos desde tu Google Sheet
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Podés mantener toda la información de la biblioteca en una planilla de Google Sheets y
              publicar cambios instantáneamente en Autosol Transparente sin tocar código.
            </p>
          </div>

          {/* Connection Status Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-400 font-medium">Estado de conexión:</span>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      sheetConfig.isConnected ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                  />
                  <strong className="text-sm text-slate-900">
                    {sheetConfig.isConnected ? 'Conectado y Validado' : 'Modo Local (Listo para conectar)'}
                  </strong>
                </div>
                {sheetConfig.lastSyncTimestamp && (
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Última sincronización: {sheetConfig.lastSyncTimestamp}
                  </span>
                )}
              </div>

              <button
                onClick={handleSyncSheets}
                disabled={isSyncing}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center space-x-2 self-start"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Ahora'}</span>
              </button>
            </div>

            {syncStatusMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
                  syncStatusMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{syncStatusMsg.text}</span>
              </div>
            )}

            {/* Apps Script Endpoint URL input */}
            <div className="space-y-2 pt-2 border-t border-slate-200/60">
              <label className="text-xs font-bold text-slate-700 block">
                URL del Webhook / Aplicación Web de Google Apps Script (Opcional):
              </label>
              <input
                type="url"
                value={sheetConfig.appsScriptEndpoint}
                onChange={(e) => updateSheetConfig({ appsScriptEndpoint: e.target.value })}
                placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-400 block">
                Si no ingresás una URL, el botón realizará una simulación de sincronización con la
                estructura oficial.
              </span>
            </div>
          </div>

          {/* Guide / How to connect */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-900">
              Guía paso a paso: ¿Cómo conectar tu Google Sheet?
            </h3>
            <ol className="space-y-2.5 text-xs text-slate-600 list-decimal list-inside leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <li>
                Creá una hoja de cálculo en <strong>Google Drive</strong> con el nombre{' '}
                <code className="bg-white px-1.5 py-0.5 rounded border text-slate-800">
                  Autosol Transparente Contenidos
                </code>
                .
              </li>
              <li>
                Nombrá la pestaña principal como{' '}
                <code className="bg-white px-1.5 py-0.5 rounded border text-slate-800">
                  Contenidos
                </code>{' '}
                y colocá las siguientes columnas en la fila 1:
                <div className="bg-white p-2 rounded-lg border border-slate-200 font-mono text-[10px] text-blue-900 my-1 overflow-x-auto">
                  {INITIAL_SHEET_TEMPLATE_INFO.sheetColumns.join(' | ')}
                </div>
              </li>
              <li>
                En tu Google Sheet, hacé clic en el menú <strong>Extensiones &gt; Apps Script</strong>.
              </li>
              <li>Pegá el código que se muestra abajo y guardá el proyecto.</li>
              <li>
                Hacé clic en <strong>Implementar &gt; Nueva Implementación &gt; Tipo: Aplicación Web</strong>{' '}
                (Acceso: <em>Cualquier usuario</em>).
              </li>
              <li>
                Copiá la URL generada y pegala en el campo de arriba para sincronizar en tiempo real.
              </li>
            </ol>

            {/* Code Snippet Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Código de Apps Script para copiar:
                </span>
                <button
                  onClick={handleCopyAppsScript}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? '¡Copiado!' : 'Copiar código'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 text-slate-200 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-48 border border-slate-800">
                {INITIAL_SHEET_TEMPLATE_INFO.sampleAppsScript}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Export / Import */}
      {activeSubTab === 'export' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">Exportar e Importar Copias de Respaldo</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Descargá el contenido en formato JSON para transferirlo o recuperá el estado inicial de
              la plataforma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Download className="w-4 h-4 text-blue-600" />
                <span>Exportar contenido a JSON</span>
              </h3>
              <p className="text-xs text-slate-500">
                Descarga un archivo con todos los artículos, etapas y FAQs para resguardo o migración.
              </p>
              <button
                onClick={handleDownloadJSON}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-2xs flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar archivo JSON</span>
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 text-amber-600" />
                <span>Restablecer contenidos originales</span>
              </h3>
              <p className="text-xs text-slate-500">
                Vuelve a cargar todos los datos oficiales iniciales cargados en Autosol Transparente.
              </p>
              <button
                onClick={() => {
                  if (confirm('¿Restablecer todos los artículos a los contenidos de ejemplo por defecto?')) {
                    resetToDefaults();
                    alert('Datos restablecidos con éxito.');
                  }
                }}
                className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-300 transition-all"
              >
                Restablecer por defecto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal Form */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div
            className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h3 className="text-base font-bold">
                {editingArticle ? 'Editar Contenido' : 'Crear Nuevo Contenido'}
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ContentCategory })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tipo de Contenido</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ContentType })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium"
                  >
                    <option value="Artículo">Artículo explicativo</option>
                    <option value="Etapa del proceso">Etapa del proceso</option>
                    <option value="Pregunta frecuente">Pregunta frecuente</option>
                    <option value="Documentación">Documentación</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Título / Pregunta Principal</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: ¿Qué es el patentamiento?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Descripción Corta</label>
                <input
                  type="text"
                  required
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  placeholder="Resumen en una frase clara para tarjetas de biblioteca..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Definición y Alcance Completo</label>
                <textarea
                  rows={3}
                  required
                  value={formData.definition}
                  onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
                  placeholder="Explicación clara y sin tecnicismos..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tiempo Orientativo</label>
                  <input
                    type="text"
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                    placeholder="Ej: 7 a 15 días hábiles"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tiempo de lectura (minutos)</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={formData.readTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, readTimeMinutes: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Factores que pueden afectar el tiempo (1 por línea)
                </label>
                <textarea
                  rows={2}
                  value={formData.timeFactorsText}
                  onChange={(e) => setFormData({ ...formData, timeFactorsText: e.target.value })}
                  placeholder="Tiempos del Registro Seccional..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">¿Qué sigue después?</label>
                <input
                  type="text"
                  value={formData.whatNext}
                  onChange={(e) => setFormData({ ...formData, whatNext: e.target.value })}
                  placeholder="Próxima etapa o paso a seguir..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Temas relacionados (separados por coma)
                </label>
                <input
                  type="text"
                  value={formData.relatedTopicsText}
                  onChange={(e) => setFormData({ ...formData, relatedTopicsText: e.target.value })}
                  placeholder="Facturación, Gestoría, Entrega"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Estado de Publicación</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as LibraryArticle['status'] })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold"
                  >
                    <option value="Publicado">Publicado (Visible)</option>
                    <option value="En revisión">En revisión</option>
                    <option value="Borrador">Borrador</option>
                    <option value="Desactivado">Desactivado</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Responsable / Área</label>
                  <input
                    type="text"
                    value={formData.responsible}
                    onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs"
                >
                  {editingArticle ? 'Guardar Cambios' : 'Publicar Contenido'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
