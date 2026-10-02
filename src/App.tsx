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
import { QualityDashboardView } from './components/QualityDashboardView';

import { AdminContentView } from './components/AdminContentView';
import { ClientAlertDashboard } from './components/ClientAlertDashboard';
import { AutosolLogo } from './components/AutosolLogo';
import { ProcessStageId, ContentCategory } from './types';
import {
  Car,
  Bot,
  ShieldCheck,
  Phone,
  Mail,
  MessageCircle,
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
  const { getText } = useData();
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedStageId, setSelectedStageId] = useState<ProcessStageId | undefined>(undefined);
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string>('que-es-patentamiento');
  const [searchQuery, setSearchQuery] = useState<string>('gestoría');
  const [libraryInitialCategory, setLibraryInitialCategory] = useState<string | undefined>(undefined);
  const [assistantInitialQuery, setAssistantInitialQuery] = useState<string | undefined>(undefined);
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
    <div className="min-h-screen bg-[#ece5db] flex flex-col text-slate-800 selection:bg-[#0040c4] selection:text-white">
      {/* Main Top Navigation with official VW | Autosol Branding */}
      {activeTab !== 'client-alerts' && <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'library') setLibraryInitialCategory(undefined);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCaseDashboard={() => setActiveTab('client-alerts')}
      />}

      {/* Main Container */}
      <main className={activeTab === 'client-alerts' ? 'flex-1 w-full pt-16' : activeTab === 'home' ? 'flex-1 w-full' : 'flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12'}>
        {/* VIEW 1: HOME (Centro Digital del Cliente) */}
        {activeTab === 'home' && (
          <HeroSection
            onSelectStage={handleSelectStage}
            onSearchSubmit={handleSearchSubmit}
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

        {activeTab === 'client-alerts' && <ClientAlertDashboard onExit={() => setActiveTab('home')} />}
      </main>

      {/* Floating Action Button for Quick Assistant (Modern VW Official Style) */}
      {activeTab !== 'client-alerts' && <div className="fixed bottom-24 right-5 z-40 hidden flex-col gap-2.5 sm:flex">
        <a href="https://www.google.com/maps/search/?api=1&query=Autosol+Jujuy,+Argentina" target="_blank" rel="noreferrer" className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white text-[#0040c4] shadow-[0_8px_20px_rgba(7,30,58,0.16)] transition-all hover:-translate-y-0.5 hover:bg-[#0040c4] hover:text-white" aria-label="Ver ubicación de Autosol Jujuy"><MapPin className="h-4 w-4" /><span className="pointer-events-none absolute right-[calc(100%+10px)] top-1/2 hidden w-max -translate-y-1/2 rounded-md bg-[#001e50] px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block">Autosol Jujuy · Argentina</span></a>
        <a href="tel:+5493884399187" className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white text-[#0040c4] shadow-[0_8px_20px_rgba(7,30,58,0.16)] transition-all hover:-translate-y-0.5 hover:bg-[#0040c4] hover:text-white" aria-label="Contactar a Autosol Jujuy"><Phone className="h-4 w-4" /><span className="pointer-events-none absolute right-[calc(100%+10px)] top-1/2 hidden w-max -translate-y-1/2 rounded-md bg-[#001e50] px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block">Autosol Jujuy</span></a>
        <a href={`https://wa.me/5493884399187?text=${encodeURIComponent(getText('whatsapp_message', 'Hola Autosol, tengo una consulta sobre mi operación.'))}`} target="_blank" rel="noreferrer" className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-[#25D366] text-white shadow-[0_8px_20px_rgba(7,30,58,0.16)] transition-all hover:-translate-y-0.5 hover:bg-[#1fb858]" aria-label="Consultar por WhatsApp"><MessageCircle className="h-4 w-4" /><span className="pointer-events-none absolute right-[calc(100%+10px)] top-1/2 hidden w-max -translate-y-1/2 rounded-md bg-[#001e50] px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block">¿Tenés una duda? Consultanos</span></a>
      </div>}
      {activeTab !== 'assistant' && activeTab !== 'client-alerts' && (
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
              className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-[#0040c4] text-white shadow-[0_12px_28px_rgba(4,38,81,0.3)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#001e50] active:scale-95"
              aria-label="Abrir Asistente Virtual Autosol"
            >
              <Bot className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />
              <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-[#0040c4] bg-emerald-400" />
              <span className="pointer-events-none absolute right-[calc(100%+12px)] top-1/2 hidden w-max -translate-y-1/2 rounded-md bg-[#001e50] px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block">Asistente Autosol</span>
              <div className="hidden">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-sky-300 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                {/* Live pulse indicator */}
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#001e50]"></span>
                </span>
              </div>
              <div className="hidden">
                <div className="text-xs font-black tracking-tight leading-none text-white flex items-center space-x-1.5">
                  <span>Asistente Autosol</span>
                  <Sparkles className="w-3 h-3 text-sky-300 inline" />
                </div>
                <div className="text-[10px] text-sky-200 font-medium leading-tight mt-0.5">
                  Consultas 24/7 • Asistente oficial
                </div>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Platform Footer with VW | Autosol Branding */}
      <footer className="bg-[#001e50] text-white">
        <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_1.25fr_.9fr] lg:items-start">
            <div>
              <AutosolLogo size="lg" variant="white" showSubtitle={false} />
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-blue-100">Información clara para acompañarte en cada decisión de compra y durante todo el proceso de entrega.</p>
            </div>


            <div className="grid grid-cols-2 gap-8 border-t border-white/15 pt-7 lg:border-t-0 lg:pt-1">
              <div>
                <h4 className="text-xs font-bold tracking-[0.14em] text-[#008cff] uppercase">Autosol</h4>
                <div className="mt-4 flex flex-col items-start gap-2.5 text-sm text-blue-100">
                  <button onClick={() => handleNavigate('process')} className="transition-colors hover:text-white">Mi proceso de compra</button>
                  <button onClick={() => handleNavigate('financing')} className="transition-colors hover:text-white">Financiación</button>
                  <button onClick={() => handleNavigate('delivery')} className="transition-colors hover:text-white">Preparación y entrega</button>
                  <button onClick={() => handleNavigate('infographic')} className="transition-colors hover:text-white">Mapa del modelo</button>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-[0.14em] text-[#008cff] uppercase">Información</h4>
                <div className="mt-4 flex flex-col items-start gap-2.5 text-sm text-blue-100">
                  <button onClick={() => handleNavigate('documents')} className="transition-colors hover:text-white">Documentación</button>
                  <button onClick={() => handleNavigate('times')} className="transition-colors hover:text-white">Tiempos orientativos</button>
                  <button onClick={() => handleNavigate('dictionary')} className="transition-colors hover:text-white">Diccionario del comprador</button>
                  <button onClick={() => handleNavigate('faq')} className="transition-colors hover:text-white">Preguntas frecuentes</button>
                </div>
              </div>
            </div>

            <div className="border-t border-white/15 pt-7 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-1">
              <h4 className="text-xs font-bold tracking-[0.14em] text-[#008cff] uppercase">Contacto</h4>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-blue-100">
                <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#008cff]" /><span>Colectora Acceso Sur, Ruta 9, Las Lomas, Jujuy</span></div>
                <div className="flex items-center gap-3"><Phone className="h-4 w-4 shrink-0 text-[#008cff]" /><span>+54 9 388 439-9187</span></div>
                <div className="flex items-center gap-3"><Mail className="h-4 w-4 shrink-0 text-[#008cff]" /><span>recepcion.ventas@autosol-vw.com.ar</span></div>
                <a href="https://autosol.com.ar/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold text-white transition-colors hover:text-[#008cff]">Sitio oficial Autosol <ArrowRight className="h-4 w-4" /></a>
              </div>
            </div>
          </div>

          <div className="mt-9 grid gap-3 rounded-xl border border-white/10 bg-white/[0.045] p-4 sm:grid-cols-[auto_1fr] sm:items-start">
            <ShieldCheck className="h-5 w-5 text-[#008cff]" />
            <p className="text-xs leading-relaxed text-blue-100">La información publicada tiene carácter orientativo y no constituye una oferta contractual. Precios, disponibilidad, plazos, versiones, requisitos y condiciones pueden modificarse sin previo aviso. Verificá la información vigente con un asesor de Autosol antes de tomar una decisión.</p>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/15 pt-5 text-[11px] text-blue-200 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Autosol S.A. Todos los derechos reservados.</p><div className="flex flex-wrap gap-x-5 gap-y-2"><a href="https://autosol.com.ar/legales/cookies" target="_blank" rel="noreferrer" className="hover:text-white">Política de cookies</a><a href="https://www.volkswagen.com.ar/es/informaciones-legales/terminos-y-condiciones.html" target="_blank" rel="noreferrer" className="hover:text-white">Términos y condiciones</a><button onClick={() => setActiveTab('quality-dashboard')} className="hover:text-white">Calidad</button><button onClick={() => setActiveTab('admin-panel')} className="hover:text-white">Administración</button></div></div>
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
