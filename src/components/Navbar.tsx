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
  | 'admin-panel'
  | 'client-alerts';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenTrackerModal: () => void;
  onOpenCaseDashboard: () => void;
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
  { id: 'infographic', label: 'Mapa del modelo' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenTrackerModal,
  onOpenCaseDashboard,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
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
    if (
      import.meta.env.DEV &&
      adminPassword === 'demo' &&
      ['admin', 'administrativo'].includes(adminUsername.trim().toLowerCase())
    ) {
      const isCollaborator = adminUsername.trim().toLowerCase() === 'administrativo';
      setAdminAuthenticated(true);
      setSessionRole(isCollaborator ? 'collaborator' : 'admin');
      setAdminUsername('');
      setAdminPassword('');
      if (isCollaborator) {
        setMenuOpen(false);
        onOpenCaseDashboard();
      }
      return;
    }
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
      if (result.role === 'collaborator') {
        setMenuOpen(false);
        onOpenCaseDashboard();
      }
    } catch (error) {
      setAdminError(error instanceof Error ? error.message : 'No se pudo iniciar sesión.');
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  return (
    <>
      {/* Top Header Bar: Solid black, left-aligned logo & menu matching autosol.com.ar */}
      <header className="sticky top-0 z-40 w-full bg-black text-white shadow-md border-b border-white/10">
        <div className="mx-auto flex h-14 sm:h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left Group: [VW Logo] [= Menú] [Autosol] */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Official Volkswagen SVG round emblem */}
            <button
              onClick={() => navigate('home')}
              className="flex items-center transition-opacity hover:opacity-85 cursor-pointer"
              aria-label="Ir al inicio de Autosol"
            >
              <svg
                className="h-7 w-7 sm:h-8 sm:w-8 text-white fill-current shrink-0"
                viewBox="0 0 1024 1024"
                aria-hidden="true"
              >
                <path d="M512 0c-283.307 0-512 228.693-512 512s228.693 512 512 512 512-228.693 512-512-228.693-512-512-512zM512 60.16c51.2 0 100.693 9.387 146.347 25.173l-140.8 304.213c-1.707 1.707-1.707 5.547-5.547 5.547s-3.84-3.84-5.547-5.547l-140.8-304.213c45.653-15.787 95.147-24.747 146.347-24.747zM294.4 116.907l162.987 351.147c3.413 7.253 7.253 9.387 11.947 9.387h85.333c5.12 0 8.533-2.133 12.373-9.387l160.853-351.147c67.413 38.4 125.44 93.44 166.4 159.147l-228.693 442.453c-1.707 3.84-4.267 5.547-5.547 5.547-3.413 0-3.413-3.413-5.547-5.547l-87.467-193.707c-3.84-7.253-7.253-8.96-12.373-8.96h-85.333c-4.693 0-8.533 1.707-12.373 8.96l-87.467 193.707c-2.133 2.133-1.707 5.547-5.547 5.547s-3.84-3.413-5.547-5.547l-230.4-442.453c40.107-65.707 98.987-120.747 166.4-159.147zM87.893 363.947l263.253 512c3.413 7.253 7.253 12.8 16.64 12.8 8.96 0 12.373-5.547 16.213-12.8l122.453-272.64c1.707-3.413 3.84-5.973 5.547-5.973 3.84 0 3.84 4.267 5.547 5.973l124.16 272.64c3.84 7.253 7.253 12.8 16.64 12.8 8.96 0 12.8-5.547 16.213-12.8l264.107-512c15.787 45.653 25.173 95.147 25.173 148.053-2.133 247.04-204.8 451.84-451.84 451.84s-449.707-204.8-449.707-451.84c0-51.2 8.96-100.267 25.6-148.053z" />
              </svg>
            </button>

            {/* Hamburger trigger with 2 lines + "Menú" (exact match to autosol.com.ar) */}
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

            {/* Autosol Dealer Wordmark & Transparente Badge */}
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-2 cursor-pointer text-left"
            >
              <span className="text-xl sm:text-2xl font-black tracking-[-0.03em] text-white">
                Autosol
              </span>
              <span className="hidden sm:inline-flex items-center rounded-md bg-[#0040c4] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                Transparente
              </span>
            </button>
          </div>

          {/* Right Group: Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onOpenTrackerModal}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-white hover:text-black cursor-pointer"
            >
              <UserCheck className="h-3.5 w-3.5 text-[#008cff]" />
              <span className="hidden sm:inline">Seguir mi 0km</span>
              <span className="sm:hidden">Seguimiento</span>
            </button>

            <a
              href="https://autosol.com.ar/"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white transition-colors"
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
            className="fixed inset-y-0 left-0 z-50 flex w-full max-w-[360px] sm:max-w-[420px] flex-col justify-between overflow-y-auto bg-[#f8f7f4] p-6 sm:p-8 text-[#001e50] shadow-2xl transition-transform duration-300 ease-out"
            aria-label="Menú principal de Autosol Transparente"
          >
            <div>
              {/* Top Row: Circular Close Button */}
              <div className="flex items-center justify-between pb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-[#001e50]">Autosol</span>
                  <span className="rounded bg-[#001e50] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                    Transparente
                  </span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition-colors hover:border-[#001e50] hover:text-[#001e50] cursor-pointer"
                  aria-label="Cerrar menú"
                >
                  <X className="h-5 w-5 stroke-[1.5]" />
                </button>
              </div>

              {/* Navigation Links list (Large bold links in black/deep navy) */}
              <nav className="flex flex-col space-y-4 pt-2">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`text-left text-lg sm:text-xl font-semibold tracking-[-0.02em] transition-colors cursor-pointer flex items-center justify-between group ${
                      activeTab === item.id
                        ? 'text-[#0040c4] font-bold'
                        : 'text-[#001e50] hover:text-[#0040c4]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#0040c4]" />
                  </button>
                ))}
              </nav>

              {/* Divider */}
              <hr className="my-6 border-slate-300" />

              {/* Action Buttons: 2 dark navy pill buttons like autosol.com.ar */}
              <div className="flex gap-2.5">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenTrackerModal();
                  }}
                  className="flex-1 rounded-full bg-[#001e50] py-2.5 px-3 text-center text-xs font-bold text-white transition-all hover:bg-[#0040c4] cursor-pointer"
                >
                  Seguir mi 0km
                </button>
                <button
                  onClick={() => navigate('assistant')}
                  className="flex-1 rounded-full bg-[#001e50] py-2.5 px-3 text-center text-xs font-bold text-white transition-all hover:bg-[#0040c4] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <MessageCircleQuestion className="h-3.5 w-3.5" />
                  <span>Asistente IA</span>
                </button>
              </div>
            </div>

            {/* Bottom section: External Link & Internal Access */}
            <div className="pt-6 border-t border-slate-200 mt-6 space-y-3">
              <a
                href="https://autosol.com.ar/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-[#001e50] transition-colors"
              >
                <span>Ir al sitio comercial Autosol</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              {/* Admin / Collaborator Session or Login */}
              <div className="pt-2">
                {!adminOpen && !adminAuthenticated && (
                  <button
                    onClick={() => setAdminOpen(true)}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-[#001e50] transition-colors cursor-pointer"
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
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#001e50]">
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
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#0040c4]"
                    />
                    <input
                      type="password"
                      autoComplete="current-password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Contraseña"
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-[#0040c4]"
                    />
                    {adminError && <p className="text-[11px] text-rose-600">{adminError}</p>}
                    <button
                      disabled={isSubmittingAdmin}
                      className="w-full rounded-lg bg-[#001e50] py-2 text-xs font-bold text-white hover:bg-[#0040c4] transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
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
                        onOpenCaseDashboard();
                      }}
                      className="flex w-full items-center justify-between rounded-lg bg-[#001e50] px-3 py-2 text-xs font-bold text-white hover:bg-[#0040c4]"
                    >
                      <span className="flex items-center gap-1.5">
                        <UserCheck className="h-3.5 w-3.5" /> Casos a contactar
                      </span>
                      {sessionRole === 'collaborator' && (
                        <span className="text-[10px] text-blue-200">Colaborador</span>
                      )}
                    </button>

                    {sessionRole === 'admin' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate('quality-dashboard')}
                          className="flex-1 rounded-lg border border-slate-300 bg-white py-1.5 px-2 text-[11px] font-semibold text-slate-700 hover:border-[#001e50] flex items-center justify-center gap-1"
                        >
                          <BarChart3 className="h-3 w-3 text-[#0040c4]" /> Indicadores
                        </button>
                        <button
                          onClick={() => navigate('admin-panel')}
                          className="flex-1 rounded-lg border border-slate-300 bg-white py-1.5 px-2 text-[11px] font-semibold text-slate-700 hover:border-[#001e50] flex items-center justify-center gap-1"
                        >
                          <FilePenLine className="h-3 w-3 text-[#0040c4]" /> Editar datos
                        </button>
                      </div>
                    )}
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
