import React, { useEffect, useState } from 'react';
import { AdminContentView } from './AdminContentView';
import { RealIndicatorsView } from './RealIndicatorsView';

export function InternalAccess() {
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState<'admin' | 'collaborator' | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'indicators' | 'editor'>('indicators');

  useEffect(() => {
    fetch('/api/auth/session').then(r => r.ok ? r.json() : null)
      .then(data => { setAuthenticated(Boolean(data?.authenticated)); setRole(data?.role === 'admin' ? 'admin' : 'collaborator'); })
      .catch(() => setAuthenticated(false));
  }, []);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error('Usuario o contraseña incorrectos.');
      const session = await response.json();
      setRole(session.role === 'admin' ? 'admin' : 'collaborator');
      setPassword('');
      setAuthenticated(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  }

  if (authenticated) return <div>
    <nav className="mb-6 flex flex-wrap gap-2" aria-label="Secciones internas">
      {role === 'admin' && ([['indicators', 'Indicadores'], ['editor', 'Editar datos']] as const).map(([id, label]) =>
        <button key={id} onClick={() => setView(id)} aria-current={view === id ? 'page' : undefined} className={`rounded-lg px-4 py-2 text-sm font-bold ${view === id ? 'bg-[#002244] text-white' : 'bg-white text-[#002244]'}`}>{label}</button>
      )}
    </nav>
    {role === 'admin' && view === 'indicators' && <RealIndicatorsView />}
    {role === 'admin' && view === 'editor' && <AdminContentView onExit={() => setView('indicators')} />}
    {role !== 'admin' && <div className="rounded-2xl bg-white p-6 text-sm text-slate-700 shadow-sm">Este acceso no tiene permisos para el panel de administración.</div>}
  </div>;

  return <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm">
    <h1 className="text-2xl font-bold text-[#002244]">Acceso interno</h1>
    <form onSubmit={login} className="mt-6 space-y-4">
      <label className="block text-sm font-semibold">Usuario
        <input autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} required className="mt-1 w-full rounded-lg border border-slate-300 p-3" />
      </label>
      <label className="block text-sm font-semibold">Contraseña
        <input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 w-full rounded-lg border border-slate-300 p-3" />
      </label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button disabled={loading} className="w-full rounded-lg bg-[#002244] p-3 font-bold text-white disabled:opacity-50">{loading ? 'Ingresando…' : 'Ingresar'}</button>
    </form>
  </div>;
}
