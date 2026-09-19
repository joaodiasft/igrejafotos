import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Camera, 
  Video, 
  Calendar, 
  Users, 
  Info, 
  Phone, 
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Logo } from './Logo';

export type NavTab = 'home' | 'galerias' | 'videos' | 'agenda' | 'ministerios' | 'sobre' | 'contato' | 'admin' | 'galeria-detalhes';

interface HeaderProps {
  currentTab: NavTab;
  onNavigate: (tab: NavTab, params?: { galleryId?: string; ministrySlug?: string }) => void;
  isAdminLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentTab, 
  onNavigate,
  isAdminLoggedIn
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home' as NavTab, label: 'Início', icon: Sparkles },
    { id: 'galerias' as NavTab, label: 'Galerias', icon: Camera },
    { id: 'videos' as NavTab, label: 'Vídeos', icon: Video },
    { id: 'agenda' as NavTab, label: 'Agenda', icon: Calendar },
    { id: 'ministerios' as NavTab, label: 'Ministérios', icon: Users },
    { id: 'sobre' as NavTab, label: 'Sobre', icon: Info },
    { id: 'contato' as NavTab, label: 'Contato', icon: Phone },
  ];

  const handleNavClick = (tab: NavTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      id="main-header"
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 py-2.5' 
          : 'bg-white border-b border-slate-100/80 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            id="nav-logo-btn"
            onClick={() => handleNavClick('home')} 
            className="text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1 -ml-1"
          >
            <Logo size="md" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5" aria-label="Navegação Principal">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id || (item.id === 'galerias' && currentTab === 'galeria-detalhes');
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}

            {/* Admin link */}
            <div className="h-5 w-px bg-slate-200 mx-2" />
            <button
              id="nav-admin-desktop-btn"
              onClick={() => handleNavClick('admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentTab === 'admin'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {isAdminLoggedIn ? 'Painel Admin' : 'Acesso Admin'}
            </button>
          </nav>

          {/* Mobile hamburger button (min 44px touch area) */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-800" /> : <Menu className="w-6 h-6 text-slate-800" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          id="mobile-drawer-backdrop"
          className="fixed inset-0 top-[60px] bg-slate-950/60 z-50 md:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            id="mobile-drawer-content"
            className="bg-white w-full max-h-[calc(100vh-60px)] overflow-y-auto border-b border-slate-200 shadow-2xl p-4 sm:p-6 animate-in slide-in-from-top-2 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                Navegação
              </span>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id || (item.id === 'galerias' && currentTab === 'galeria-detalhes');
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium text-base flex items-center justify-between transition-colors min-h-[48px] ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-300'}`} />
                  </button>
                );
              })}

              <div className="my-2 border-t border-slate-100 pt-3">
                <button
                  id="mobile-nav-admin"
                  onClick={() => handleNavClick('admin')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-between min-h-[48px] ${
                    currentTab === 'admin'
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    <span>{isAdminLoggedIn ? 'Painel Administrativo' : 'Área do Administrador'}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
