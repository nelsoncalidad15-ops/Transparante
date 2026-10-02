import React, { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight, ExternalLink, UserCheck, UserRound, LockKeyhole, BarChart3, FilePenLine, LoaderCircle } from 'lucide-react';
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
  | 'admin-panel'
  | 'client-alerts';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenTrackerModal: () => void;
  onOpenCaseDashboard: () => void;
}

const navigation = [
  { id: 'home' as ActiveTab, label: 'Inicio', detail: 'Volvé a la portada' },
  { id: 'process' as ActiveTab, label: 'Mi compra', detail: 'Seguí cada etapa' },
  { id: 'financing' as ActiveTab, label: 'Financiación', detail: 'Opciones y pagos' },
  { id: 'documents' as ActiveTab, label: 'Documentación', detail: 'Todo lo que necesitás' },
  { id: 'delivery' as ActiveTab, label: 'Entrega', detail: 'Preparación y retiro' },
];

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenTrackerModal, onOpenCaseDashboard }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [sessionRole, setSessionRole] = useState<'admin' | 'collaborator' | null>(null);
  const [adminError, setAdminError] = useState('');
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);
  const isHome = activeTab === 'home';

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((response) => response.ok ? response.json() : null)
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
    if (import.meta.env.DEV && adminPassword === 'demo' && ['admin', 'administrativo'].includes(adminUsername.trim().toLowerCase())) {
      const isCollaborator = adminUsername.trim().toLowerCase() === 'administrativo';
      setAdminAuthenticated(true);
      setSessionRole(isCollaborator ? 'collaborator' : 'admin');
      setAdminUsername('');
      setAdminPassword('');
      if (isCollaborator) { setMenuOpen(false); onOpenCaseDashboard(); }
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
      if (result.role === 'collaborator') { setMenuOpen(false); onOpenCaseDashboard(); }
    } catch (error) {
      setAdminError(error instanceof Error ? error.message : 'No se pudo iniciar sesión.');
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  return (
    <>
      <header className={`z-40 w-full ${isHome ? 'absolute top-0 left-0 text-white' : 'sticky top-0 bg-white text-[#001e50] border-b border-slate-200 shadow-sm'}`}>
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <button onClick={() => navigate('home')} className="group cursor-pointer" aria-label="Ir al inicio">
            <AutosolLogo size="md" variant={isHome ? 'white' : 'dark'} showSubtitle={false} />
          </button>

          <div className="flex items-center gap-3 sm:gap-5">
            <a href="https://autosol.com.ar/" target="_blank" rel="noreferrer" className={`hidden items-center gap-1.5 text-sm font-semibold transition-colors lg:flex ${isHome ? 'text-white/90 hover:text-white' : 'text-[#001e50] hover:text-[#0040c4]'}`}>
              Sitio oficial <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button onClick={onOpenTrackerModal} className={`hidden items-center gap-2 text-sm font-semibold transition-colors sm:flex ${isHome ? 'text-white/90 hover:text-white' : 'text-[#001e50] hover:text-[#0040c4]'}`}>
              <UserCheck className="h-4 w-4" /> Seguir mi 0km
            </button>
            <button onClick={() => setMenuOpen(true)} className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all ${isHome ? 'border-white/60 bg-white/10 text-white hover:bg-white hover:text-[#001e50]' : 'border-slate-300 bg-white text-[#001e50] hover:border-[#001e50]'}`} aria-label="Abrir menú">
              <Menu className="h-5 w-5" /> <span className="hidden sm:inline">Menú</span>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#001e50] text-white">
          <div className="mx-auto min-h-screen max-w-[1240px] px-5 py-4 sm:px-8 sm:py-5 lg:px-10">
            <div className="flex items-center justify-between">
              <AutosolLogo size="sm" variant="white" showSubtitle={false} />
              <button onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-full border border-white/35 px-3 py-2 text-xs font-semibold hover:bg-white hover:text-[#001e50]">
                <X className="h-5 w-5" /> Cerrar
              </button>
            </div>

            <div className="mt-6 grid gap-6 border-t border-white/20 pt-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,.62fr)] lg:gap-8">
              <nav aria-label="Navegación principal">
                <p className="mb-3 text-[10px] font-bold tracking-[0.16em] text-[#008cff] uppercase">Navegación</p>
                {navigation.map((item, index) => (
                  <button key={item.id} onClick={() => navigate(item.id)} className="group grid w-full grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 border-t border-white/15 py-3 text-left transition-colors first:border-t-0 hover:bg-white/[0.035] sm:py-3.5">
                    <span className="text-[11px] font-medium tabular-nums text-[#008cff]/75">0{index + 1}</span>
                    <span><span className="block text-2xl font-light tracking-[-0.045em] text-white sm:text-[1.75rem]">{item.label}</span><span className="mt-0.5 block text-xs text-blue-200/75">{item.detail}</span></span>
                    <ArrowUpRight className="h-4 w-4 text-[#008cff] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </button>
                ))}
              </nav>

              <aside className="self-start rounded-xl border border-white/15 bg-white/[0.055] p-4">
                <a href="https://autosol.com.ar/" target="_blank" rel="noreferrer" className="mb-4 flex items-center justify-between rounded-lg border border-white/15 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#001e50]">
                  Ir al sitio oficial Autosol <ExternalLink className="h-4 w-4" />
                </a>
                <div>
                  {!adminOpen && !adminAuthenticated && <button onClick={() => setAdminOpen(true)} className="flex items-center gap-2 text-sm font-semibold text-blue-100 transition-colors hover:text-[#008cff]"><LockKeyhole className="h-4 w-4" /> Acceso interno</button>}
                  {adminOpen && !adminAuthenticated && (
                    <form onSubmit={handleAdminLogin} className="space-y-3 rounded-xl border border-white/15 bg-[#002244] p-4 shadow-inner">
                      <div className="flex items-start justify-between gap-3"><div><span className="text-[10px] font-bold tracking-[0.14em] text-[#008cff] uppercase">Acceso interno</span><p className="mt-1 text-xs leading-relaxed text-blue-100/75">Ingresá con tu usuario para continuar.</p></div><button type="button" onClick={() => { setAdminOpen(false); setAdminError(''); }} className="text-xs font-semibold text-blue-200 hover:text-white">Cancelar</button></div>
                      <label className="block text-xs font-semibold text-blue-100">Usuario<div className="relative mt-1.5"><UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#008cff]" /><input autoComplete="username" value={adminUsername} onChange={(event) => setAdminUsername(event.target.value)} placeholder="Ej: administrativo" className="w-full rounded-lg border border-white/20 bg-[#11192e] py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-blue-200/45 focus:border-[#008cff]" /></div></label>
                      <label className="block text-xs font-semibold text-blue-100">Contraseña<div className="relative mt-1.5"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#008cff]" /><input type="password" autoComplete="current-password" value={adminPassword} onChange={(event) => setAdminPassword(event.target.value)} placeholder="Tu contraseña" className="w-full rounded-lg border border-white/20 bg-[#11192e] py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-blue-200/45 focus:border-[#008cff]" /></div></label>
                      {adminError && <p className="text-xs text-rose-300">{adminError}</p>}
                      <button disabled={isSubmittingAdmin} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#008cff] px-3.5 py-2.5 text-sm font-bold text-[#001e50] transition-colors hover:bg-white disabled:opacity-60">{isSubmittingAdmin ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />} Ingresar</button>
                    </form>
                  )}
                  {adminAuthenticated && <button onClick={() => { setMenuOpen(false); onOpenCaseDashboard(); }} className="mb-3 flex w-full items-center gap-2 rounded-lg bg-[#008cff] px-3 py-2.5 text-left text-sm font-bold text-[#001e50] hover:bg-white"><UserCheck className="h-4 w-4" /> Casos a contactar{sessionRole === 'collaborator' && <span className="ml-auto text-xs font-medium">Colaborador</span>}</button>}
                  {adminAuthenticated && sessionRole === 'admin' && (
                    <div className="space-y-3"><div className="flex items-center gap-2 text-sm font-semibold text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Sesión de administrador</div><div className="grid gap-2"><button onClick={() => navigate('quality-dashboard')} className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2.5 text-left text-sm text-blue-100 hover:bg-white/10"><BarChart3 className="h-4 w-4 text-[#008cff]" /> Ver indicadores</button><button onClick={() => navigate('admin-panel')} className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2.5 text-left text-sm text-blue-100 hover:bg-white/10"><FilePenLine className="h-4 w-4 text-[#008cff]" /> Editar información</button></div></div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
