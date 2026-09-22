import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Camera,
  Calendar,
  Users,
  Info,
  Phone,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

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
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home' as NavTab, label: 'Início', icon: Sparkles },
    { id: 'galerias' as NavTab, label: 'Galerias', icon: Camera },
    { id: 'agenda' as NavTab, label: 'Agenda', icon: Calendar },
    { id: 'ministerios' as NavTab, label: 'Departamentos', icon: Users },
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
          ? 'glass border-b border-line shadow-soft py-2.5'
          : 'bg-canvas/60 border-b border-transparent py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            id="nav-logo-btn"
            onClick={() => handleNavClick('home')}
            className="text-left rounded-xl p-1 -ml-1 transition-transform duration-200 hover:scale-[1.02] active:scale-95"
          >
            <Logo size="md" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navegação Principal">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id || (item.id === 'galerias' && currentTab === 'galeria-detalhes');
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-terracotta dark:text-gold bg-brand/10'
                      : 'text-muted hover:text-fg hover:bg-elevate'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-terracotta dark:text-gold' : 'text-subtle'}`} />
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-gradient-flame" />
                  )}
                </button>
              );
            })}

            <div className="h-5 w-px bg-line mx-2" />

            <ThemeToggle />

            <button
              id="nav-admin-desktop-btn"
              onClick={() => handleNavClick('admin')}
              className={`ml-1 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                currentTab === 'admin'
                  ? 'bg-gradient-flame text-white shadow-glow'
                  : 'text-muted hover:text-fg hover:bg-elevate border border-line'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {isAdminLoggedIn ? 'Painel' : 'Admin'}
            </button>
          </nav>

          {/* Mobile actions */}
          <div className="flex items-center gap-1.5 md:hidden">
            <ThemeToggle />
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-fg hover:bg-elevate min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer-backdrop"
          className="fixed inset-0 top-[60px] bg-ink/60 z-50 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            id="mobile-drawer-content"
            className="bg-surface w-full max-h-[calc(100vh-60px)] overflow-y-auto border-b border-line shadow-warm p-4 sm:p-6 animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-subtle uppercase tracking-wider px-3 mb-1">
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
                        ? 'bg-brand/10 text-terracotta dark:text-gold font-semibold'
                        : 'text-fg hover:bg-elevate'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-gradient-flame text-white' : 'bg-elevate text-muted'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-terracotta dark:text-gold' : 'text-subtle'}`} />
                  </button>
                );
              })}

              <div className="my-2 border-t border-line pt-3">
                <button
                  id="mobile-nav-admin"
                  onClick={() => handleNavClick('admin')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-between min-h-[48px] ${
                    currentTab === 'admin'
                      ? 'bg-gradient-flame text-white font-semibold'
                      : 'bg-elevate text-muted hover:text-fg'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-flame" />
                    <span>{isAdminLoggedIn ? 'Painel Administrativo' : 'Área do Administrador'}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-subtle" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
