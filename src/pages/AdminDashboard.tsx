import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Camera, 
  Calendar, 
  Video as VideoIcon, 
  Tag, 
  Settings, 
  LogOut, 
  ArrowLeft, 
  ExternalLink,
  Download,
  Users,
  Sparkles,
  TrendingUp,
  FolderOpen
} from 'lucide-react';
import { Gallery, Category, Ministry, ChurchEvent, VideoItem, SiteSettings } from '../types';
import { AdminGalleriesTab } from '../components/admin/AdminGalleriesTab';
import { AdminEventsTab } from '../components/admin/AdminEventsTab';
import { AdminVideosTab } from '../components/admin/AdminVideosTab';
import { AdminCategoriesTab } from '../components/admin/AdminCategoriesTab';
import { AdminSettingsTab } from '../components/admin/AdminSettingsTab';
import { Logo } from '../components/Logo';

type AdminTab = 'overview' | 'galleries' | 'events' | 'videos' | 'categories' | 'settings';

interface AdminDashboardProps {
  galleries: Gallery[];
  categories: Category[];
  ministries: Ministry[];
  events: ChurchEvent[];
  videos: VideoItem[];
  settings: SiteSettings;
  onRefresh: () => void;
  onLogout: () => void;
  onBackToSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  galleries,
  categories,
  ministries,
  events,
  videos,
  settings,
  onRefresh,
  onLogout,
  onBackToSite
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Stats calculation
  const totalPhotos = galleries.reduce((acc, g) => acc + g.photoCount, 0);

  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'galleries', label: 'Galerias & Fotos', icon: Camera, count: galleries.length },
    { id: 'events', label: 'Agenda de Cultos', icon: Calendar, count: events.length },
    { id: 'videos', label: 'Vídeos / YouTube', icon: VideoIcon, count: videos.length },
    { id: 'categories', label: 'Categorias', icon: Tag, count: categories.length },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Logo variant="dark" />
            <span className="hidden sm:inline px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              Painel Administrativo
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBackToSite}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              title="Abrir o site público"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Site Público</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-colors flex items-center gap-1.5"
              title="Sair do painel"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Layout Container with Sidebar and Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar Nav */}
        <aside className="lg:col-span-3 space-y-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono ${
                      isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white space-y-2 shadow-xs hidden lg:block">
            <div className="flex items-center gap-1.5 text-blue-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dica Ministerial</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ao subir novas fotos de cultos de domingo até segunda-feira de manhã, o engajamento dos membros aumenta em mais de 70%.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-900 font-heading">{totalPhotos}</span>
                  <p className="text-xs font-semibold text-slate-500">Fotos no Portal</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                    <FolderOpen className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-900 font-heading">{galleries.length}</span>
                  <p className="text-xs font-semibold text-slate-500">Galerias / Cultos</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-900 font-heading">{events.length}</span>
                  <p className="text-xs font-semibold text-slate-500">Eventos na Agenda</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-900 font-heading">1.8k+</span>
                  <p className="text-xs font-semibold text-slate-500">Downloads Feitos</p>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  Ações Rápidas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setActiveTab('galleries')}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left space-y-1"
                  >
                    <span className="text-sm font-bold text-slate-800 block">Cadastrar Nova Galeria</span>
                    <span className="text-xs text-slate-500">Subir fotos do último culto realizado</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('events')}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left space-y-1"
                  >
                    <span className="text-sm font-bold text-slate-800 block">Novo Evento na Agenda</span>
                    <span className="text-xs text-slate-500">Avisar a igreja sobre a próxima reunião</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left space-y-1"
                  >
                    <span className="text-sm font-bold text-slate-800 block">Configurar Marca D'água</span>
                    <span className="text-xs text-slate-500">Ajustar texto de exibição das fotos</span>
                  </button>
                </div>
              </div>

              {/* Recent Galleries List */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    Últimas Galerias Criadas
                  </h3>
                  <button
                    onClick={() => setActiveTab('galleries')}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Ver todas as {galleries.length}
                  </button>
                </div>

                <div className="space-y-2">
                  {galleries.slice(0, 4).map((gal) => (
                    <div
                      key={gal.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={gal.coverPhoto}
                          alt={gal.title}
                          className="w-12 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                        />
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">{gal.title}</h4>
                          <span className="text-[11px] text-slate-500">{gal.date} • {gal.categoryName}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-600">{gal.photoCount} fotos</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: GALLERIES */}
          {activeTab === 'galleries' && (
            <AdminGalleriesTab
              galleries={galleries}
              categories={categories}
              ministries={ministries}
              onRefresh={onRefresh}
            />
          )}

          {/* TAB 3: EVENTS */}
          {activeTab === 'events' && (
            <AdminEventsTab
              events={events}
              onRefresh={onRefresh}
            />
          )}

          {/* TAB 4: VIDEOS */}
          {activeTab === 'videos' && (
            <AdminVideosTab
              videos={videos}
              onRefresh={onRefresh}
            />
          )}

          {/* TAB 5: CATEGORIES */}
          {activeTab === 'categories' && (
            <AdminCategoriesTab
              categories={categories}
              onRefresh={onRefresh}
            />
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <AdminSettingsTab
              settings={settings}
              onRefresh={onRefresh}
            />
          )}

        </main>

      </div>

    </div>
  );
};
