import React, { useEffect, useState } from 'react';
import {
  X,
  ExternalLink,
  UserCheck,
  UserRound,
  LockKeyhole,
  BarChart3,
  FilePenLine,
  LoaderCircle,
  MessageCircleQuestion,
  ChevronRight,
} from 'lucide-react';

export type ActiveTab =
  | 'home'
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
  onOpenTrackerModal?: () => void;
}

const navigation: { id: ActiveTab; label: string }[] = [
  { id: 'home', label: 'Inicio' },
  { id: 'process', label: 'Mi proceso de compra' },
  { id: 'documents', label: 'Documentación y trámites' },
  { id: 'times', label: 'Tiempos orientativos' },
  { id: 'delivery', label: 'Entrega del vehículo' },
  { id: 'financing', label: 'Financiación y pagos' },
  { id: 'dictionary', label: 'Diccionario del comprador' },
  { id: 'faq', label: 'Preguntas frecuentes' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');

  const [adminPassword, setAdminPassword] = useState('');
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [sessionRole, setSessionRole] = useState<'admin' | 'collaborator' | null>(null);
  const [adminError, setAdminError] = useState('');
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((response) => (response.ok ? response.json() : null))
      .then((session) => {
        if (session?.authenticated) {
          setAdminAuthenticated(true);
          setSessionRole(session.role === 'admin' ? 'admin' : 'collaborator');
        }
      })
      .catch(() => undefined);
  }, []);

  const navigate = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  const handleAdminLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!adminUsername.trim() || !adminPassword.trim()) return;

    setIsSubmittingAdmin(true);
    setAdminError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminUsername, password: adminPassword }),
      });
      if (!response.ok) throw new Error('Credenciales inválidas o backend no configurado.');
      const result = await response.json();
      setAdminAuthenticated(true);
      setSessionRole(result.role === 'admin' ? 'admin' : 'collaborator');
      setAdminUsername('');
      setAdminPassword('');
      setMenuOpen(false);
      navigate('admin-panel');
    } catch (error) {
      setAdminError(error instanceof Error ? error.message : 'No se pudo iniciar sesión.');
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Header Bar: 100% transparent over hero with no bottom line or contour, solid on scroll */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ${
          isScrolled || activeTab !== 'home'
            ? 'bg-[#002244] shadow-lg border-b border-white/10 py-0'
            : 'bg-transparent border-none shadow-none py-1'
        }`}
        style={!isScrolled && activeTab === 'home' ? { borderBottom: 'none', boxShadow: 'none' } : undefined}
      >
        <div className="mx-auto flex h-14 sm:h-16 w-full max-w-[1720px] items-center justify-between px-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 sm:gap-6">
            <button onClick={() => navigate('home')} className="flex shrink-0 items-center" aria-label="Ir al inicio de Autosol Jujuy">
              <img src={`${import.meta.env.BASE_URL}images/autosol-logo-official.png`} alt="Volkswagen Autosol" className="h-8 w-auto max-w-[145px] brightness-0 invert sm:h-10 sm:max-w-[210px]" />
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors cursor-pointer py-1.5 px-1"
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
            >
              <div className="flex flex-col justify-center gap-1.5 w-5">
                <span className="block h-[2px] w-5 bg-white rounded-full transition-transform" />
                <span className="block h-[2px] w-5 bg-white rounded-full transition-transform" />
              </div>
              <span className="font-semibold text-sm tracking-tight">Menú</span>
            </button>

          </div>

          {/* Right Group: Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate('assistant')}
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-white hover:text-black cursor-pointer"
            >
              <MessageCircleQuestion className="h-3.5 w-3.5 text-white" />
              <span>Bot de consulta</span>
            </button>

            <a
              href="https://autosol.com.ar/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-white/85 hover:text-white transition-colors"
            >
              <span>Sitio oficial Autosol</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </header>

      {/* LEFT DRAWER MENU (Matching Screenshot 2 exactly!) */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop on the right */}
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            aria-hidden="true"
          />

          {/* Drawer container from LEFT */}
          <aside
            className="fixed inset-y-0 left-0 z-50 flex w-full max-w-[360px] sm:max-w-[420px] flex-col justify-between overflow-y-auto bg-[#e6e6e6] p-6 sm:p-8 text-[#002244] shadow-2xl transition-transform duration-300 ease-out"
            aria-label="Menú principal de Autosol"
          >
            <div>
              {/* Top Row: Official Autosol Logo & Clean Close Button (No black borders) */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-200">
                <button
                  onClick={() => navigate('home')}
                  className="flex items-center cursor-pointer"
                  aria-label="Ir a inicio de Autosol"
                >
                  <img
                    src={`${import.meta.env.BASE_URL}images/autosol-logo-official.png`}
                    alt="Volkswagen Autosol"
                    className="h-8 sm:h-9 w-auto object-contain"
                  />
                </button>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-black/5 hover:text-black cursor-pointer"
                  aria-label="Cerrar menú"
                >
                  <X className="h-6 w-6 stroke-[1.5]" />
                </button>
              </div>

              {/* Navigation Links list (Large bold links in black/deep navy) */}
              <nav className="flex flex-col space-y-4 pt-6">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`text-left text-lg sm:text-xl font-semibold tracking-[-0.02em] transition-colors cursor-pointer flex items-center justify-between group ${
                      activeTab === item.id
                        ? 'text-black font-bold'
                        : 'text-slate-800 hover:text-black'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-black" />
                  </button>
                ))}
              </nav>

              {/* Divider */}
              <hr className="my-6 border-slate-200" />

              {/* Action Button: Bot de consulta */}
              <div>
                <button
                  onClick={() => navigate('assistant')}
                  className="w-full rounded-full bg-[#002244] py-3.5 px-4 text-center text-xs font-bold text-white transition-all hover:bg-[#002244] hover:brightness-125 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircleQuestion className="h-4 w-4 text-white" />
                  <span>Bot de consulta</span>
                </button>
              </div>
            </div>


            {/* Bottom section: External Link & Internal Access */}
            <div className="pt-6 border-t border-slate-200 mt-6 space-y-3">
              <a
                href="https://autosol.com.ar/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-[#002244] transition-colors"
              >
                <span>Ir al sitio comercial Autosol</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              {/* Admin / Collaborator Session or Login */}
              <div className="pt-2">
                {!adminOpen && !adminAuthenticated && (
                  <button
                    onClick={() => setAdminOpen(true)}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-[#002244] transition-colors cursor-pointer"
                  >
                    <LockKeyhole className="h-3.5 w-3.5" />
                    <span>Acceso interno</span>
                  </button>
                )}

                {adminOpen && !adminAuthenticated && (
                  <form
                    onSubmit={handleAdminLogin}
                    className="space-y-2.5 rounded-xl border border-slate-300 bg-white p-3.5 shadow-sm text-slate-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#002244]">
                        Acceso interno
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setAdminOpen(false);
                          setAdminError('');
                        }}
                        className="text-[11px] text-slate-400 hover:text-slate-700"
                      >
                        Cancelar
                      </button>
                    </div>
                    <input
                      autoComplete="username"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="Usuario (ej: admin)"
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#002244]"
                    />
                    <input
                      type="password"
                      autoComplete="current-password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Contraseña"
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#002244]"
                    />
                    {adminError && <p className="text-[11px] text-rose-600">{adminError}</p>}
                    <button
                      disabled={isSubmittingAdmin}
                      className="w-full rounded-lg bg-[#002244] py-2 text-xs font-bold text-white hover:bg-[#002244] hover:brightness-125 transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isSubmittingAdmin ? (
                        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <LockKeyhole className="h-3.5 w-3.5" />
                      )}
                      <span>Ingresar</span>
                    </button>
                  </form>
                )}

                {adminAuthenticated && (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate('admin-panel');
                      }}
                      className="flex w-full items-center justify-between rounded-lg bg-[#002244] px-3.5 py-2.5 text-xs font-bold text-white hover:brightness-125 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <FilePenLine className="h-4 w-4 text-sky-400" />
                        <span>Ficha de revisión y validación</span>
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
