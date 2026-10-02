import React, { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Navbar, ActiveTab } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
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
  const [isContactMenuOpen, setIsContactMenuOpen] = useState(false);

  // Scroll to top instantly whenever tab changes so the user is always at the top of the new view
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  // Close contact menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isContactMenuOpen && !target.closest('#fab-contact-container')) {
        setIsContactMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isContactMenuOpen]);

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
      <main className={activeTab === 'client-alerts' ? 'flex-1 w-full pt-16' : activeTab === 'home' ? 'flex-1 w-full' : activeTab === 'assistant' ? 'flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-6' : 'flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12'}>
        {/* VIEW 1: HOME (Centro Digital del Cliente) */}
        {activeTab === 'home' && (
          <HeroSection
            onSelectStage={handleSelectStage}
            onSearchSubmit={handleSearchSubmit}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW 2: MI PROCESO (Línea de tiempo de 7 etapas) */}
        {activeTab === 'process' && (
          <ProcessTimeline
            selectedStageId={selectedStageId}
            onSelectArticle={handleNavigateToArticle}
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

        {/* VIEW 11: BOT DE CONSULTA AUTOSOL */}
        {activeTab === 'assistant' && (
          <div className="w-full max-w-2xl mx-auto py-1 sm:py-2 animate-in fade-in duration-300">
            <VirtualAssistant
              initialQuery={assistantInitialQuery}
              onNavigateToArticle={handleNavigateToArticle}
              onNavigateToStage={handleSelectStage}
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

      {/* 
        OPCIÓN 1: BOTÓN FLOTANTE ÚNICO DESPLEGABLE (SPEED DIAL)
        Solo 1 botón visible en pantalla. Al tocarlo se despliega un panel prolijo con Bot, WhatsApp, Teléfono y Ubicación.
      */}
      {activeTab !== 'assistant' && activeTab !== 'client-alerts' && (
        <div id="fab-contact-container" className="fixed bottom-5 right-5 z-50">
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
              />
            </div>
          ) : (
            <div className="relative flex flex-col items-end">
              {/* Menú Desplegable con opciones de contacto limpias */}
              {isContactMenuOpen && (
                <div className="mb-3 w-72 sm:w-80 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-[0_16px_40px_rgba(0,30,80,0.18)] animate-in slide-in-from-bottom-3 fade-in duration-200 text-left">
                  <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-black">
                      Atención y Consultas Autosol
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      En línea
                    </span>
                  </div>

                  <div className="space-y-1">
                    {/* Opción 1: Bot de Consulta Autosol */}
                    <button
                      onClick={() => {
                        setIsContactMenuOpen(false);
                        setIsFloatingAssistantOpen(true);
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl transition-all hover:bg-slate-50 text-left group cursor-pointer border border-transparent hover:border-slate-200"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#001e50] text-white transition-transform group-hover:scale-105">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-black group-hover:text-[#0040c4] flex items-center justify-between">
                          <span>Bot de consulta</span>
                          <span className="text-[9px] bg-[#ece5db] text-[#001e50] font-bold px-1.5 py-0.5 rounded">24/7</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          Orientación sobre etapas, plazos y 0km
                        </p>
                      </div>
                    </button>

                    {/* Opción 2: WhatsApp Oficial */}
                    <a
                      href={`https://wa.me/5493884399187?text=${encodeURIComponent(getText('whatsapp_message', 'Hola Autosol, tengo una consulta sobre mi operación.'))}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setIsContactMenuOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl transition-all hover:bg-emerald-50/60 text-left group cursor-pointer border border-transparent hover:border-emerald-200"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white transition-transform group-hover:scale-105 shadow-xs">
                        <MessageCircle className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-black group-hover:text-emerald-700">
                          WhatsApp Oficial
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          Chateá con un asesor en Jujuy
                        </p>
                      </div>
                    </a>

                    {/* Opción 3: Llamar por Teléfono */}
                    <a
                      href="tel:+5493884399187"
                      onClick={() => setIsContactMenuOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl transition-all hover:bg-slate-50 text-left group cursor-pointer border border-transparent hover:border-slate-200"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ece5db] text-[#001e50] transition-transform group-hover:scale-105">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-black group-hover:text-[#0040c4]">
                          Llamar a Autosol
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          +54 9 388 439-9187
                        </p>
                      </div>
                    </a>

                    {/* Opción 4: Ubicación Concesionario */}
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Autosol+Jujuy,+Argentina"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setIsContactMenuOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl transition-all hover:bg-slate-50 text-left group cursor-pointer border border-transparent hover:border-slate-200"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ece5db] text-[#001e50] transition-transform group-hover:scale-105">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-black group-hover:text-[#0040c4]">
                          Concesionario Jujuy
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          Colectora Acceso Sur, Ruta 9
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              )}

              {/* Único Botón Flotante en Pantalla */}
              <button
                id="fab-contact-toggle"
                onClick={() => setIsContactMenuOpen(!isContactMenuOpen)}
                className={`group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/70 shadow-[0_12px_28px_rgba(0,30,80,0.25)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
                  isContactMenuOpen
                    ? 'bg-black text-white hover:bg-slate-800'
                    : 'bg-[#001e50] text-white hover:bg-[#0040c4]'
                }`}
                aria-label={isContactMenuOpen ? 'Cerrar opciones de contacto' : 'Abrir opciones de contacto'}
                aria-expanded={isContactMenuOpen}
              >
                {isContactMenuOpen ? (
                  <X className="h-6 w-6 transition-transform rotate-90 duration-200" />
                ) : (
                  <>
                    <MessageCircle className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                    <span className="absolute right-1 top-1 h-3 w-3 rounded-full border-2 border-[#001e50] bg-emerald-400" />
                    <span className="pointer-events-none absolute right-[calc(100%+12px)] top-1/2 hidden w-max -translate-y-1/2 rounded-md bg-[#001e50] px-3 py-1.5 text-xs font-bold text-white shadow-lg sm:group-hover:block">
                      Contacto y Ayuda
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Platform Footer with VW | Autosol Branding (Expanded Full-Width Container) */}
      <footer className="bg-[#001e50] text-white">
        <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-8 lg:px-12 xl:px-16 py-12 sm:py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:items-start">
            <div className="sm:col-span-2 lg:col-span-1">
              <AutosolLogo size="lg" variant="white" showSubtitle={false} />
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-blue-100">
                Información clara para acompañarte en cada decisión de compra y durante todo el proceso de entrega.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold tracking-[0.14em] text-white uppercase">Autosol</h4>
              <div className="mt-4 flex flex-col items-start gap-2.5 text-sm text-blue-100">
                <button onClick={() => handleNavigate('process')} className="transition-colors hover:text-white">Mi proceso de compra</button>
                <button onClick={() => handleNavigate('financing')} className="transition-colors hover:text-white">Financiación</button>
                <button onClick={() => handleNavigate('delivery')} className="transition-colors hover:text-white">Preparación y entrega</button>
                <button onClick={() => handleNavigate('faq')} className="transition-colors hover:text-white">Preguntas frecuentes</button>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold tracking-[0.14em] text-white uppercase">Información</h4>
              <div className="mt-4 flex flex-col items-start gap-2.5 text-sm text-blue-100">
                <button onClick={() => handleNavigate('documents')} className="transition-colors hover:text-white">Documentación y gestoría</button>
                <button onClick={() => handleNavigate('times')} className="transition-colors hover:text-white">Tiempos orientativos</button>
                <button onClick={() => handleNavigate('dictionary')} className="transition-colors hover:text-white">Diccionario del comprador</button>
                <button onClick={() => handleNavigate('assistant')} className="transition-colors hover:text-white">Bot de consulta</button>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold tracking-[0.14em] text-white uppercase">Contacto</h4>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-blue-100">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#008cff]" />
                  <span>Colectora Acceso Sur, Ruta 9, Las Lomas, Jujuy</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-[#008cff]" />
                  <span>+54 9 388 439-9187</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-[#008cff]" />
                  <span>recepcion.ventas@autosol-vw.com.ar</span>
                </div>
                <a
                  href="https://autosol.com.ar/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-white transition-colors hover:text-[#008cff]"
                >
                  Sitio oficial Autosol <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-3 rounded-xl border border-white/10 bg-white/[0.045] p-4 sm:grid-cols-[auto_1fr] sm:items-start">
            <ShieldCheck className="h-5 w-5 text-[#008cff]" />
            <p className="text-xs leading-relaxed text-blue-100">
              La información publicada tiene carácter orientativo y no constituye una oferta contractual. Precios, disponibilidad, plazos, versiones, requisitos y condiciones pueden modificarse sin previo aviso. Verificá la información vigente con un asesor de Autosol antes de tomar una decisión.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-white/15 pt-6 text-[11px] text-blue-200 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Autosol S.A. Todos los derechos reservados.</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <a href="https://autosol.com.ar/legales/cookies" target="_blank" rel="noreferrer" className="hover:text-white">Política de cookies</a>
              <a href="https://www.volkswagen.com.ar/es/informaciones-legales/terminos-y-condiciones.html" target="_blank" rel="noreferrer" className="hover:text-white">Términos y condiciones</a>
            </div>
          </div>
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
