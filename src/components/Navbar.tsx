import React, { useState, useRef, useEffect } from 'react';
import {
  Car,
  Compass,
  FileText,
  Clock,
  BookOpen,
  HelpCircle,
  Bot,
  Menu,
  X,
  UserCheck,
  CreditCard,
  KeyRound,
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  BarChart3,
  Settings,
  Layers,
} from 'lucide-react';
import { AutosolLogo } from './AutosolLogo';

export type ActiveTab =
  | 'home'
  | 'infographic'
  | 'process'
  | 'documents'
  | 'times'
  | 'financing'
  | 'delivery'
  | 'dictionary'
  | 'library'
  | 'faq'
  | 'assistant'
  | 'search'
  | 'article-detail'
  | 'quality-dashboard'
  | 'admin-panel';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenTrackerModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenTrackerModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [guidesDropdownOpen, setGuidesDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const adminRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setGuidesDropdownOpen(false);
      }
      if (adminRef.current && !adminRef.current.contains(event.target as Node)) {
        setAdminDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const guideItems = [
    {
      id: 'documents' as ActiveTab,
      label: 'Documentación y Papeles',
      desc: 'Requisitos para personas físicas y jurídicas',
      icon: FileText,
      pastelBg: 'bg-indigo-50 text-indigo-700',
    },
    {
      id: 'times' as ActiveTab,
      label: 'Tiempos por Etapa',
      desc: 'Plazos y factores de cada instancia',
      icon: Clock,
      pastelBg: 'bg-sky-50 text-sky-700',
    },
    {
      id: 'financing' as ActiveTab,
      label: 'Financiación & Pagos',
      desc: 'Crédito prendario, autoahorro y cuentas oficiales',
      icon: CreditCard,
      pastelBg: 'bg-amber-50 text-amber-700',
    },
    {
      id: 'delivery' as ActiveTab,
      label: 'Entrega & Control PDI',
      desc: 'Checklist para el retiro y prueba técnica',
      icon: KeyRound,
      pastelBg: 'bg-teal-50 text-teal-700',
    },
    {
      id: 'dictionary' as ActiveTab,
      label: 'Glosario Automotor',
      desc: 'Términos explicados en lenguaje sencillo',
      icon: BookOpen,
      pastelBg: 'bg-purple-50 text-purple-700',
    },
  ];

  const isGuideActive = [
    'documents',
    'times',
    'financing',
    'delivery',
    'dictionary',
  ].includes(activeTab);

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/70 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Official Brand Logo */}
          <div
            className="cursor-pointer select-none group flex items-center transition-transform hover:scale-[1.01]"
            onClick={() => {
              setActiveTab('home');
              setMobileMenuOpen(false);
            }}
          >
            <AutosolLogo size="md" variant="dark" />
          </div>

          {/* Clean, Modern Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 shadow-inner">
            
            {/* 1. Inicio */}
            <button
              id="nav-link-home"
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-white text-[#0B2265] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Compass className={`w-4 h-4 ${activeTab === 'home' ? 'text-blue-700' : 'text-slate-400'}`} />
              <span>Inicio</span>
            </button>

            {/* 2. Mi Proceso (7 Pasos) */}
            <button
              id="nav-link-process"
              onClick={() => setActiveTab('process')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'process'
                  ? 'bg-white text-[#0B2265] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Car className={`w-4 h-4 ${activeTab === 'process' ? 'text-blue-700' : 'text-slate-400'}`} />
              <span>Mi Proceso (7 Pasos)</span>
            </button>

            {/* 3. Guías & Trámites (Clean Pastel Dropdown) */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="nav-link-guides-dropdown"
                onClick={() => setGuidesDropdownOpen(!guidesDropdownOpen)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  isGuideActive
                    ? 'bg-white text-[#0B2265] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <FileText className={`w-4 h-4 ${isGuideActive ? 'text-blue-700' : 'text-slate-400'}`} />
                <span>Guías & Trámites</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${guidesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {guidesDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/80 p-2.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Información & Requisitos
                  </div>
                  <div className="space-y-1">
                    {guideItems.map((item) => {
                      const Icon = item.icon;
                      const isItemActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setGuidesDropdownOpen(false);
                          }}
                          className={`w-full flex items-start space-x-3 p-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                            isItemActive
                              ? 'bg-blue-50 text-blue-950 border border-blue-200/80'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.pastelBg}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{item.label}</div>
                            <div className="text-[11px] text-slate-500 line-clamp-1">{item.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Preguntas Frecuentes */}
            <button
              id="nav-link-faq"
              onClick={() => setActiveTab('faq')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'faq'
                  ? 'bg-white text-[#0B2265] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <HelpCircle className={`w-4 h-4 ${activeTab === 'faq' ? 'text-blue-700' : 'text-slate-400'}`} />
              <span>Preguntas</span>
            </button>

            {/* 5. Asistente IA */}
            <button
              id="nav-link-assistant"
              onClick={() => setActiveTab('assistant')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'assistant'
                  ? 'bg-white text-sky-900 shadow-xs'
                  : 'text-sky-700 hover:text-sky-900 hover:bg-sky-50/70'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Asistente IA</span>
            </button>
          </nav>

          {/* Right Action: Clean Status Tracker Pill & Subtle Settings */}
          <div className="flex items-center space-x-2.5">
            <button
              id="btn-open-tracker-modal-nav"
              onClick={onOpenTrackerModal}
              className="bg-gradient-to-r from-[#0B2265] to-blue-800 hover:from-blue-900 hover:to-blue-700 text-white text-xs font-bold px-4 sm:px-5 py-2.5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
            >
              <UserCheck className="w-4 h-4 text-sky-300" />
              <span className="hidden sm:inline">Rastrear mi 0km</span>
              <span className="sm:hidden">Mi Estado</span>
            </button>

            {/* Subtle Admin dropdown icon for internal tools */}
            <div className="relative hidden lg:block" ref={adminRef}>
              <button
                onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Herramientas internas"
                aria-label="Herramientas internas"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>

              {adminDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200 p-2 z-50 animate-in fade-in">
                  <div className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Área Interna Autosol
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('quality-dashboard');
                      setAdminDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center space-x-2 cursor-pointer"
                  >
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span>Panel de Calidad</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('admin-panel');
                      setAdminDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center space-x-2 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-blue-600" />
                    <span>Editor de Contenidos</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('infographic');
                      setAdminDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center space-x-2 cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>Mapa del Modelo (5 Columnas)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/80"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-2xl border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          
          <button
            onClick={() => {
              setActiveTab('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-left transition-colors ${
              activeTab === 'home' ? 'bg-blue-50 text-blue-950 border border-blue-200' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Compass className="w-4 h-4 text-blue-700" />
            <span>Inicio</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('process');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-left transition-colors ${
              activeTab === 'process' ? 'bg-blue-50 text-blue-950 border border-blue-200' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Car className="w-4 h-4 text-blue-700" />
            <span>Mi Proceso (7 Pasos)</span>
          </button>

          <div className="pt-2 pb-1 px-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Guías & Trámites
          </div>

          {guideItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-2xl text-xs font-bold text-left transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-950 border border-blue-200' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${item.pastelBg}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setActiveTab('faq');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>Preguntas Frecuentes</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('assistant');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 bg-sky-50 text-sky-950 border border-sky-200 text-xs font-bold py-2.5 rounded-2xl"
            >
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Consultar Asistente IA</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
