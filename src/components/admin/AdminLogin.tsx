import React, { useState } from 'react';
import { Lock, KeyRound, AlertCircle, ArrowLeft, Church } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBackToSite }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onLogin(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-ink flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative px-4">
      <div className="absolute top-6 left-6">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 text-sm font-semibold text-cream/70 hover:text-cream bg-white/5 border border-white/10 px-4 py-2 rounded-xl min-h-11"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao portal
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gold text-ink mx-auto flex items-center justify-center">
          <Church className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-heading text-cream">Painel Fotosculto</h2>
        <p className="text-sm text-cream/60">Acesso exclusivo da equipe de mídia da AD Barravento.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/5 py-8 px-6 sm:px-10 rounded-3xl border border-white/10 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-400/30 text-rose-200 text-sm flex items-center gap-2" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="admin-user-input" className="text-xs font-bold text-cream/80">E-mail</label>
              <input
                id="admin-user-input"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/30 text-cream text-sm focus:outline-none focus:ring-2 focus:ring-gold min-h-11"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="admin-pass-input" className="text-xs font-bold text-cream/80">Senha</label>
              <div className="relative">
                <input
                  id="admin-pass-input"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/30 text-cream text-sm focus:outline-none focus:ring-2 focus:ring-gold min-h-11"
                />
                <KeyRound className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40 pointer-events-none" />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gold hover:bg-gold-bright text-ink font-bold text-sm min-h-12 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {submitting ? 'Entrando...' : 'Entrar no painel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
