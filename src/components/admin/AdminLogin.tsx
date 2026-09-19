import React, { useState } from 'react';
import { Lock, KeyRound, AlertCircle, ArrowLeft, Church } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBackToSite }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default credentials for administration
    if ((username === 'admin' || username === 'pastor') && (password === 'adbarravento' || password === 'admin' || password === '123456')) {
      setError(false);
      onLogin(true);
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative px-4">
      
      {/* Back button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Portal Público</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white mx-auto flex items-center justify-center shadow-xl shadow-blue-600/30">
          <Church className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
          Painel Administrativo
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Acesso restrito para líderes e equipe de mídia da AD Barravento.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-800 space-y-6">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>Usuário ou senha incorretos. Use a senha <strong>adbarravento</strong> ou <strong>admin</strong>.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Usuário / E-mail
              </label>
              <input
                id="admin-user-input"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  id="admin-pass-input"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <KeyRound className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <button
              id="admin-submit-login-btn"
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Lock className="w-4 h-4" />
              <span>ENTRAR NO PAINEL</span>
            </button>
          </form>

          {/* Quick Demo Credentials Info for easy testing */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-slate-400 text-xs space-y-1">
            <span className="font-bold text-slate-200">Credenciais para Teste do Painel:</span>
            <p className="font-mono text-blue-400">Usuário: admin | Senha: adbarravento</p>
          </div>

        </div>
      </div>

    </div>
  );
};
