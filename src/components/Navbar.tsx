import React, { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight, MapPin, UserCheck } from 'lucide-react';
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

const navigation = [
  { id: 'home' as ActiveTab, label: 'Inicio', detail: 'Volvé a la portada' },
  { id: 'process' as ActiveTab, label: 'Mi compra', detail: 'Seguí cada etapa' },
  { id: 'financing' as ActiveTab, label: 'Financiación', detail: 'Opciones y pagos' },
  { id: 'documents' as ActiveTab, label: 'Documentación', detail: 'Todo lo que necesitás' },
  { id: 'delivery' as ActiveTab, label: 'Postventa', detail: 'Entrega y cuidado' },
];

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenTrackerModal }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = activeTab === 'home';

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navigate = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  return (
    <>
      <header className={`z-40 w-full ${isHome ? 'absolute top-0 left-0 text-white' : 'sticky top-0 bg-white text-[#071e3a] border-b border-slate-200 shadow-sm'}`}>
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <button onClick={() => navigate('home')} className="group cursor-pointer" aria-label="Ir al inicio">
            <AutosolLogo size="md" variant={isHome ? 'white' : 'dark'} showSubtitle={false} />
          </button>

          <div className="flex items-center gap-3 sm:gap-5">
            <button onClick={onOpenTrackerModal} className={`hidden items-center gap-2 text-sm font-semibold transition-colors sm:flex ${isHome ? 'text-white/90 hover:text-white' : 'text-[#071e3a] hover:text-[#0069b4]'}`}>
              <UserCheck className="h-4 w-4" /> Seguir mi 0km
            </button>
            <button onClick={() => setMenuOpen(true)} className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all ${isHome ? 'border-white/60 bg-white/10 text-white hover:bg-white hover:text-[#071e3a]' : 'border-slate-300 bg-white text-[#071e3a] hover:border-[#071e3a]'}`} aria-label="Abrir menú">
              <Menu className="h-5 w-5" /> <span className="hidden sm:inline">Menú</span>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#061d38] text-white">
          <div className="mx-auto min-h-screen max-w-[1440px] px-5 py-6 sm:px-8 lg:px-12">
            <div className="flex items-center justify-between">
              <AutosolLogo size="md" variant="white" showSubtitle={false} />
              <button onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-full border border-white/35 px-4 py-2.5 text-sm hover:bg-white hover:text-[#061d38]">
                <X className="h-5 w-5" /> Cerrar
              </button>
            </div>

            <div className="mt-14 grid gap-12 border-t border-white/30 pt-10 lg:grid-cols-[1.45fr_0.8fr] lg:gap-24">
              <nav className="space-y-1" aria-label="Navegación principal">
                {navigation.map((item) => (
                  <button key={item.id} onClick={() => navigate(item.id)} className="group flex w-full items-baseline justify-between border-b border-white/15 py-4 text-left transition-colors hover:border-[#45bce5]">
                    <span className="text-3xl font-light tracking-[-0.04em] sm:text-5xl">{item.label}</span>
                    <span className="hidden text-sm text-blue-200 sm:block">{item.detail}</span>
                    <ArrowUpRight className="h-5 w-5 text-[#45bce5] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </button>
                ))}
              </nav>

              <aside className="border-l border-white/30 pl-0 lg:pl-10">
                <p className="text-sm font-semibold text-[#45bce5]">Atención Autosol</p>
                <p className="mt-3 max-w-xs text-xl font-light leading-snug text-white/90">Todo lo que necesitás para elegir, comprar y disfrutar tu próximo vehículo.</p>
                <button onClick={() => { setMenuOpen(false); onOpenTrackerModal(); }} className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#061d38] transition-transform hover:scale-[1.02]">
                  <UserCheck className="h-4 w-4" /> Seguir mi operación
                </button>
                <div className="mt-10 flex items-center gap-2 text-sm text-white/70"><MapPin className="h-4 w-4 text-[#45bce5]" /> Jujuy · Argentina</div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
