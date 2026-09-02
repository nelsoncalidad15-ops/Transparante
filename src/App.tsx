import React, { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Navbar, ActiveTab } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { InfographicModelView } from './components/InfographicModelView';
import { ProcessTimeline } from './components/ProcessTimeline';
import { DocumentsView } from './components/DocumentsView';
import { TimesSection } from './components/TimesSection';
import { FinancingView } from './components/FinancingView';
import { DeliveryView } from './components/DeliveryView';
import { DictionaryView } from './components/DictionaryView';
import { LibraryView } from './components/LibraryView';
import { ArticleDetail } from './components/ArticleDetail';
import { VirtualAssistant } from './components/VirtualAssistant';
import { SearchResultsView } from './components/SearchResultsView';
import { FAQSection } from './components/FAQSection';
import { PersonalizedTrackerModal } from './components/PersonalizedTrackerModal';
import { QualityDashboardView } from './components/QualityDashboardView';
import { AdminContentView } from './components/AdminContentView';
import { AutosolLogo } from './components/AutosolLogo';
import { ProcessStageId, ContentCategory } from './types';
import {
  Car,
  Bot,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  UserCheck,
  CheckCircle2,
  X,
  Layers,
} from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedStageId, setSelectedStageId] = useState<ProcessStageId | undefined>(undefined);
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string>('que-es-patentamiento');
  const [searchQuery, setSearchQuery] = useState<string>('gestoría');
  const [libraryInitialCategory, setLibraryInitialCategory] = useState<string | undefined>(undefined);
  const [assistantInitialQuery, setAssistantInitialQuery] = useState<string | undefined>(undefined);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [isFloatingAssistantOpen, setIsFloatingAssistantOpen] = useState(false);

  // Navigation Helpers
  const handleSelectStage = (stageId: ProcessStageId) => {
    setSelectedStageId(stageId);
    setActiveTab('process');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToArticle = (slug: string) => {
    setSelectedArticleSlug(slug);
    setActiveTab('article-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setActiveTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAssistant = (query?: string) => {
    if (query) {
      setAssistantInitialQuery(query);
    }
    setActiveTab('assistant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (tab: ActiveTab, category?: string, stageId?: ProcessStageId) => {
    if (stageId) setSelectedStageId(stageId);
    if (category) setLibraryInitialCategory(category);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-blue-600 selection:text-white">
      {/* Main Top Navigation with official VW | Autosol Branding */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'library') setLibraryInitialCategory(undefined);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTrackerModal={() => setIsTrackerModalOpen(true)}
      />

      {/* Main Container */}
      <main className={activeTab === 'home' ? 'flex-1' : 'flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'}>
        {/* VIEW 1: HOME (Centro Digital del Cliente) */}
        {activeTab === 'home' && (
          <HeroSection
            onSelectStage={handleSelectStage}
            onSearchSubmit={handleSearchSubmit}
            onOpenTrackerModal={() => setIsTrackerModalOpen(true)}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW 2: MAPA DEL MODELO (Diagrama oficial de 5 columnas del modelo) */}
        {activeTab === 'infographic' && (
          <InfographicModelView
            onNavigate={handleNavigate}
            onOpenAssistant={handleOpenAssistant}
            onOpenTracker={() => setIsTrackerModalOpen(true)}
          />
        )}

        {/* VIEW 3: MI PROCESO (Línea de tiempo de 7 etapas) */}
        {activeTab === 'process' && (
          <ProcessTimeline
            selectedStageId={selectedStageId}
            onSelectArticle={handleNavigateToArticle}
            onOpenTracker={() => setIsTrackerModalOpen(true)}
          />
        )}

        {/* VIEW 4: DOCUMENTACIÓN Y TRÁMITES (Checklist interactivo de papeles) */}
        {activeTab === 'documents' && (
          <DocumentsView
            onNavigateToArticle={handleNavigateToArticle}
            onOpenAssistant={handleOpenAssistant}
          />
        )}

        {/* VIEW 5: TIEMPOS ORIENTATIVOS */}
        {activeTab === 'times' && (
          <TimesSection
            onSelectStage={handleSelectStage}
            onNavigateToArticle={handleNavigateToArticle}
          />
        )}

        {/* VIEW 6: FINANCIACIÓN Y PAGOS */}
        {activeTab === 'financing' && (
          <FinancingView
            onNavigateToArticle={handleNavigateToArticle}
            onOpenAssistant={handleOpenAssistant}
          />
        )}

        {/* VIEW 7: ENTREGA DEL VEHÍCULO */}
        {activeTab === 'delivery' && (
          <DeliveryView
            onNavigateToArticle={handleNavigateToArticle}
            onOpenAssistant={handleOpenAssistant}
          />
        )}

        {/* VIEW 8: DICCIONARIO DE TÉRMINOS */}
        {activeTab === 'dictionary' && (
          <DictionaryView
            onNavigateToArticle={handleNavigateToArticle}
            onOpenAssistant={handleOpenAssistant}
          />
        )}

        {/* VIEW 9: BIBLIOTECA GENERAL */}
        {activeTab === 'library' && (
          <LibraryView
            initialCategory={libraryInitialCategory}
            onSelectArticle={handleNavigateToArticle}
          />
        )}

        {/* VIEW 10: PREGUNTAS FRECUENTES (FAQ) */}
        {activeTab === 'faq' && (
          <FAQSection
            onNavigateToArticle={handleNavigateToArticle}
            onOpenAssistant={handleOpenAssistant}
          />
        )}

        {/* VIEW 11: ASISTENTE VIRTUAL AUTOSOL */}
        {activeTab === 'assistant' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center space-x-2 text-blue-700 bg-blue-50 px-3.5 py-1 rounded-full text-xs font-bold border border-blue-200">
                <Bot className="w-3.5 h-3.5 text-blue-600" />
                <span>Asistente de Orientación Oficial</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Asistente Virtual Autosol
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Escribí tu consulta sobre trámites, plazos o documentación para recibir una
                explicación directa y enlaces a las guías oficiales.
              </p>
            </div>

            <VirtualAssistant
              initialQuery={assistantInitialQuery}
              onNavigateToArticle={handleNavigateToArticle}
              onNavigateToStage={handleSelectStage}
              onOpenTracker={() => setIsTrackerModalOpen(true)}
            />
          </div>
        )}

        {/* VIEW 12: SEARCH RESULTS */}
        {activeTab === 'search' && (
          <SearchResultsView
            initialQuery={searchQuery}
            onNavigateToArticle={handleNavigateToArticle}
            onNavigateToStage={handleSelectStage}
            onNewSearch={handleSearchSubmit}
          />
        )}

        {/* VIEW 13: ARTICLE DETAIL */}
        {activeTab === 'article-detail' && (
          <ArticleDetail
            slug={selectedArticleSlug}
            onBack={() => setActiveTab('home')}
            onSelectRelated={(topicOrSlug) => {
              handleSearchSubmit(topicOrSlug);
            }}
            onOpenAssistant={handleOpenAssistant}
          />
        )}

        {/* VIEW 14: QUALITY DASHBOARD (Internal) */}
        {activeTab === 'quality-dashboard' && (
          <QualityDashboardView
            onOpenAdminPanel={() => setActiveTab('admin-panel')}
            onNavigateToArticle={handleNavigateToArticle}
          />
        )}

        {/* VIEW 15: ADMIN CONTENT PANEL (Internal / Sheets) */}
        {activeTab === 'admin-panel' && <AdminContentView />}
      </main>

      {/* Floating Action Button for Quick Assistant (Modern VW Official Style) */}
      <div className="fixed bottom-24 right-5 z-40 hidden flex-col gap-2.5 sm:flex">
        <a href="https://www.google.com/maps/search/?api=1&query=Av.+Excombatientes+de+Malvinas+3850,+Salta" target="_blank" rel="noreferrer" className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white text-[#0069b4] shadow-[0_8px_20px_rgba(7,30,58,0.16)] transition-all hover:-translate-y-0.5 hover:bg-[#0069b4] hover:text-white" aria-label="Ver ubicación de Autosol"><MapPin className="h-4 w-4" /><span className="pointer-events-none absolute right-[calc(100%+10px)] top-1/2 hidden w-max -translate-y-1/2 rounded-md bg-[#061d38] px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block">Ver ubicación</span></a>
        <a href="tel:+543874248000" className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white text-[#0069b4] shadow-[0_8px_20px_rgba(7,30,58,0.16)] transition-all hover:-translate-y-0.5 hover:bg-[#0069b4] hover:text-white" aria-label="Contactar a Autosol"><Phone className="h-4 w-4" /><span className="pointer-events-none absolute right-[calc(100%+10px)] top-1/2 hidden w-max -translate-y-1/2 rounded-md bg-[#061d38] px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block">Contactar Autosol</span></a>
        <a href="mailto:transparencia@autosol.com.ar" className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white text-[#0069b4] shadow-[0_8px_20px_rgba(7,30,58,0.16)] transition-all hover:-translate-y-0.5 hover:bg-[#0069b4] hover:text-white" aria-label="Enviar correo a Autosol"><Mail className="h-4 w-4" /><span className="pointer-events-none absolute right-[calc(100%+10px)] top-1/2 hidden w-max -translate-y-1/2 rounded-md bg-[#061d38] px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block">Escribir a Autosol</span></a>
      </div>
      {activeTab !== 'assistant' && (
        <div className="fixed bottom-5 right-5 z-50">
          {isFloatingAssistantOpen ? (
            <div className="animate-in slide-in-from-bottom-5 fade-in duration-200">
              <VirtualAssistant
                isFloatingModal={true}
                onCloseModal={() => setIsFloatingAssistantOpen(false)}
                onNavigateToArticle={(slug) => {
                  setIsFloatingAssistantOpen(false);
                  handleNavigateToArticle(slug);
                }}
                onNavigateToStage={(stageId) => {
                  setIsFloatingAssistantOpen(false);
                  handleSelectStage(stageId as ProcessStageId);
                }}
                onOpenTracker={() => {
                  setIsFloatingAssistantOpen(false);
                  setIsTrackerModalOpen(true);
                }}
              />
            </div>
          ) : (
            <button
              id="fab-open-assistant"
              onClick={() => setIsFloatingAssistantOpen(true)}
              className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-[#0069b4] text-white shadow-[0_12px_28px_rgba(4,38,81,0.3)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#00558f] active:scale-95"
              aria-label="Abrir Asistente Virtual Autosol"
            >
              <Bot className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />
              <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-[#0069b4] bg-emerald-400" />
              <span className="pointer-events-none absolute right-[calc(100%+12px)] top-1/2 hidden w-max -translate-y-1/2 rounded-md bg-[#061d38] px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block">Asistente Autosol</span>
              <div className="hidden">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-sky-300 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                {/* Live pulse indicator */}
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#0B2265]"></span>
                </span>
              </div>
              <div className="hidden">
                <div className="text-xs font-black tracking-tight leading-none text-white flex items-center space-x-1.5">
                  <span>Asistente Autosol</span>
                  <Sparkles className="w-3 h-3 text-sky-300 inline" />
                </div>
                <div className="text-[10px] text-sky-200 font-medium leading-tight mt-0.5">
                  Consultas 24/7 • Rastrear 0km
                </div>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Personalized Unit Tracker Modal */}
      <PersonalizedTrackerModal
        isOpen={isTrackerModalOpen}
        onClose={() => setIsTrackerModalOpen(false)}
        onNavigateToStage={handleSelectStage}
        onOpenAssistant={handleOpenAssistant}
      />

      {/* Platform Footer with VW | Autosol Branding */}
      <footer className="hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand & Motto */}
            <div className="space-y-3 md:col-span-1">
              <AutosolLogo size="md" variant="white" showSubtitle={false} />
              <p className="text-xs text-blue-200 leading-relaxed pt-1">
                Centro digital oficial para orientar a clientes de Autosol y comprender cada etapa de su operación con máxima transparencia.
              </p>
              <div className="inline-flex items-center space-x-1.5 text-[11px] text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-1 rounded-lg font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Información oficial certificada</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Vistas Rápidas
              </h4>
              <ul className="space-y-1.5 text-xs text-blue-100">
                <li>
                  <button
                    onClick={() => handleNavigate('infographic')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    📊 Mapa del Modelo
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('process')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    🛒 Mi proceso paso a paso
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('documents')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    📄 Documentación y trámites
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('times')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    ⏱️ Tiempos orientativos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('financing')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    💳 Financiación y pagos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('delivery')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    🚗 Entrega del vehículo
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('dictionary')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    📖 Diccionario de términos
                  </button>
                </li>
              </ul>
            </div>

            {/* Conceptos Clave */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Términos Frecuentes
              </h4>
              <ul className="space-y-1.5 text-xs text-blue-100">
                <li>
                  <button
                    onClick={() => handleNavigateToArticle('que-es-gestoria-y-para-que-sirve')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    ¿Qué hace el área de Gestoría?
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigateToArticle('que-es-patentamiento')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    ¿Cómo es el patentamiento en DNRPA?
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigateToArticle('que-es-facturacion-y-chasis')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Facturación y número de chasis
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigateToArticle('preparacion-pdi-taller')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Inspección técnica PDI en taller
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigateToArticle('que-esperar-dia-de-entrega')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    ¿Qué esperar el día de entrega?
                  </button>
                </li>
              </ul>
            </div>

            {/* Sucursales y Atención */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Contacto Oficial
              </h4>
              <div className="space-y-2 text-xs text-blue-200">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span>Av. Excombatientes de Malvinas 3850, Salta Capital</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>(0387) 424-8000 / 0810-777-AUTOSOL</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>transparencia@autosol.com.ar</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Lun a Vie 8:30 a 19:30 hs • Sáb 9:00 a 13:00 hs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="pt-8 border-t border-blue-900/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-blue-300 gap-4">
            <p>
              © {new Date().getFullYear()} Autosol S.A. Concesionario Oficial Volkswagen. Los plazos expresados son estimaciones referenciales en días hábiles.
            </p>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('quality-dashboard')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Panel de Calidad
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveTab('admin-panel')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Admin Contenidos
              </button>
            </div>
          </div>
        </div>
      </footer>
      <footer className="hidden">
        <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 lg:px-12 lg:py-11">
          <div className="grid gap-8 border-b border-white/15 pb-8 md:grid-cols-2 lg:grid-cols-[1.2fr_.75fr_.9fr_1.05fr]">
            <div>
              <AutosolLogo size="lg" variant="white" showSubtitle={false} />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-blue-100">Una experiencia de compra clara, cercana y confiable para acompañarte desde la elección hasta la entrega.</p>
              <p className="mt-4 max-w-sm border-l-2 border-[#36a9d1] pl-3 text-[11px] leading-relaxed text-blue-200/85">La información de este sitio es orientativa. Precios, disponibilidad, plazos, versiones, requisitos y condiciones pueden modificarse sin previo aviso. Verificá siempre la información vigente con un asesor de Autosol antes de tomar una decisión.</p>
              <button onClick={() => setIsTrackerModalOpen(true)} className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#64c9ea]/60 px-4 py-2 text-sm font-semibold text-[#92ddf5] transition-colors hover:bg-white hover:text-[#061d38]"><UserCheck className="h-4 w-4" /> Seguir mi operación</button>
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-[0.14em] text-[#74d5f4] uppercase">Conocé Autosol</h4>
              <div className="mt-4 flex flex-col items-start gap-2.5 text-sm text-blue-100">
                <button onClick={() => handleNavigate('process')} className="transition-colors hover:text-white">Mi proceso de compra</button>
                <button onClick={() => handleNavigate('financing')} className="transition-colors hover:text-white">Financiación</button>
                <button onClick={() => handleNavigate('delivery')} className="transition-colors hover:text-white">Preparación y entrega</button>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-[0.14em] text-[#74d5f4] uppercase">Ayuda</h4>
              <div className="mt-4 flex flex-col items-start gap-2.5 text-sm text-blue-100">
                <button onClick={() => handleNavigate('documents')} className="transition-colors hover:text-white">Documentación</button>
                <button onClick={() => handleNavigate('times')} className="transition-colors hover:text-white">Tiempos orientativos</button>
                <button onClick={() => handleNavigate('faq')} className="transition-colors hover:text-white">Preguntas frecuentes</button>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-[0.14em] text-[#74d5f4] uppercase">Contacto</h4>
              <div className="mt-4 space-y-2.5 text-sm leading-relaxed text-blue-100">
                <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#74d5f4]" /><span>Av. Excombatientes de Malvinas 3850, Salta Capital</span></div>
                <div className="flex items-center gap-3"><Phone className="h-4 w-4 shrink-0 text-[#74d5f4]" /><span>(0387) 424-8000</span></div>
                <div className="flex items-center gap-3"><Mail className="h-4 w-4 shrink-0 text-[#74d5f4]" /><span>transparencia@autosol.com.ar</span></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-4 text-[11px] text-blue-200 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Autosol S.A. Todos los derechos reservados.</p><div className="flex gap-5"><button onClick={() => setActiveTab('quality-dashboard')} className="hover:text-white">Calidad</button><button onClick={() => setActiveTab('admin-panel')} className="hover:text-white">Administración</button></div></div>
        </div>
      </footer>
      <footer className="bg-[#061d38] text-white">
        <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_1.25fr_.9fr] lg:items-start">
            <div>
              <AutosolLogo size="lg" variant="white" showSubtitle={false} />
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-blue-100">Información clara para acompañarte en cada decisión de compra y durante todo el proceso de entrega.</p>
              <button onClick={() => setIsTrackerModalOpen(true)} className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#64c9ea]/60 px-4 py-2 text-sm font-semibold text-[#92ddf5] transition-colors hover:bg-white hover:text-[#061d38]"><UserCheck className="h-4 w-4" /> Seguir mi operación</button>
            </div>

            <div className="grid grid-cols-2 gap-8 border-t border-white/15 pt-7 lg:border-t-0 lg:pt-1">
              <div>
                <h4 className="text-xs font-bold tracking-[0.14em] text-[#74d5f4] uppercase">Autosol</h4>
                <div className="mt-4 flex flex-col items-start gap-2.5 text-sm text-blue-100">
                  <button onClick={() => handleNavigate('process')} className="transition-colors hover:text-white">Mi proceso de compra</button>
                  <button onClick={() => handleNavigate('financing')} className="transition-colors hover:text-white">Financiación</button>
                  <button onClick={() => handleNavigate('delivery')} className="transition-colors hover:text-white">Preparación y entrega</button>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-[0.14em] text-[#74d5f4] uppercase">Información</h4>
                <div className="mt-4 flex flex-col items-start gap-2.5 text-sm text-blue-100">
                  <button onClick={() => handleNavigate('documents')} className="transition-colors hover:text-white">Documentación</button>
                  <button onClick={() => handleNavigate('times')} className="transition-colors hover:text-white">Tiempos orientativos</button>
                  <button onClick={() => handleNavigate('faq')} className="transition-colors hover:text-white">Preguntas frecuentes</button>
                </div>
              </div>
            </div>

            <div className="border-t border-white/15 pt-7 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-1">
              <h4 className="text-xs font-bold tracking-[0.14em] text-[#74d5f4] uppercase">Contacto</h4>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-blue-100">
                <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#74d5f4]" /><span>Av. Excombatientes de Malvinas 3850, Salta Capital</span></div>
                <div className="flex items-center gap-3"><Phone className="h-4 w-4 shrink-0 text-[#74d5f4]" /><span>(0387) 424-8000</span></div>
                <div className="flex items-center gap-3"><Mail className="h-4 w-4 shrink-0 text-[#74d5f4]" /><span>transparencia@autosol.com.ar</span></div>
              </div>
            </div>
          </div>

          <div className="mt-9 grid gap-3 rounded-xl border border-white/10 bg-white/[0.045] p-4 sm:grid-cols-[auto_1fr] sm:items-start">
            <ShieldCheck className="h-5 w-5 text-[#74d5f4]" />
            <p className="text-xs leading-relaxed text-blue-100">La información publicada tiene carácter orientativo y no constituye una oferta contractual. Precios, disponibilidad, plazos, versiones, requisitos y condiciones pueden modificarse sin previo aviso. Verificá la información vigente con un asesor de Autosol antes de tomar una decisión.</p>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/15 pt-5 text-[11px] text-blue-200 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Autosol S.A. Todos los derechos reservados.</p><div className="flex gap-5"><button onClick={() => setActiveTab('quality-dashboard')} className="hover:text-white">Calidad</button><button onClick={() => setActiveTab('admin-panel')} className="hover:text-white">Administración</button></div></div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}
