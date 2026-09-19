import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header, NavTab } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';

// Public Pages
import { HomePage } from './pages/HomePage';
import { GaleriasPage } from './pages/GaleriasPage';
import { GaleriaDetalhesPage } from './pages/GaleriaDetalhesPage';
import { AgendaPage } from './pages/AgendaPage';
import { VideosPage } from './pages/VideosPage';
import { MinisteriosPage } from './pages/MinisteriosPage';
import { SobrePage } from './pages/SobrePage';
import { ContatoPage } from './pages/ContatoPage';

// Admin
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

// Database Service
import { DatabaseService } from './services/db';
import { Gallery, Category, Ministry, ChurchEvent, VideoItem, SiteSettings } from './types';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [activeGalleryId, setActiveGalleryId] = useState<string | null>(null);
  const [selectedMinistrySlug, setSelectedMinistrySlug] = useState<string | undefined>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('ad_barravento_admin_auth') === 'true';
  });

  // Privacy Policy Modal State
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Data Refresh Trigger
  const [dataVersion, setDataVersion] = useState(0);
  const refreshData = useCallback(() => setDataVersion(v => v + 1), []);

  // Loaded Data from DatabaseService
  const settings: SiteSettings = useMemo(() => DatabaseService.getSettings(), [dataVersion]);
  const galleries: Gallery[] = useMemo(() => DatabaseService.getGalleries(), [dataVersion]);
  const categories: Category[] = useMemo(() => DatabaseService.getCategories(), [dataVersion]);
  const ministries: Ministry[] = useMemo(() => DatabaseService.getMinistries(), [dataVersion]);
  const events: ChurchEvent[] = useMemo(() => DatabaseService.getEvents(), [dataVersion]);
  const videos: VideoItem[] = useMemo(() => DatabaseService.getVideos(), [dataVersion]);

  // Latest featured gallery
  const latestGallery = galleries.find(g => g.featured) || galleries[0];

  // Selected Gallery Object for Details View
  const selectedGallery = useMemo(() => {
    if (!activeGalleryId) return null;
    return galleries.find(g => g.id === activeGalleryId) || null;
  }, [activeGalleryId, galleries]);

  const selectedGalleryPhotos = useMemo(() => {
    if (!activeGalleryId) return [];
    return DatabaseService.getPhotosByGallery(activeGalleryId);
  }, [activeGalleryId, dataVersion]);

  // Handle URL hash changes for easy sharing or back buttons
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('galeria/')) {
        const id = hash.replace('galeria/', '');
        setActiveGalleryId(id);
        setCurrentTab('galerias');
      } else if (hash === 'admin') {
        setCurrentTab('admin');
      } else if (['home', 'galerias', 'agenda', 'videos', 'ministerios', 'sobre', 'contato'].includes(hash)) {
        setCurrentTab(hash as NavTab);
        setActiveGalleryId(null);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Scroll to top on navigation
  const navigateTo = (tab: NavTab, params?: { galleryId?: string; ministrySlug?: string; categoryId?: string }) => {
    setCurrentTab(tab);
    if (params?.galleryId) {
      setActiveGalleryId(params.galleryId);
      window.location.hash = `galeria/${params.galleryId}`;
    } else {
      setActiveGalleryId(null);
      window.location.hash = tab === 'home' ? '' : tab;
    }

    if (params?.ministrySlug) setSelectedMinistrySlug(params.ministrySlug);
    if (params?.categoryId) setSelectedCategoryId(params.categoryId);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenGallery = (galleryId: string) => {
    setActiveGalleryId(galleryId);
    setCurrentTab('galerias');
    window.location.hash = `galeria/${galleryId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromGallery = () => {
    setActiveGalleryId(null);
    window.location.hash = 'galerias';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('ad_barravento_admin_auth', 'true');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('ad_barravento_admin_auth');
    navigateTo('home');
  };

  // If in Admin Mode:
  if (currentTab === 'admin') {
    if (!isAdminLoggedIn) {
      return (
        <AdminLogin
          onLogin={handleAdminLogin}
          onBackToSite={() => navigateTo('home')}
        />
      );
    }
    return (
      <AdminDashboard
        galleries={galleries}
        categories={categories}
        ministries={ministries}
        events={events}
        videos={videos}
        settings={settings}
        onRefresh={refreshData}
        onLogout={handleAdminLogout}
        onBackToSite={() => navigateTo('home')}
      />
    );
  }

  // PUBLIC SITE
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Responsive Header Navigation */}
      <Header
        currentTab={currentTab}
        onNavigate={(tab, params) => navigateTo(tab, params)}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        
        {/* INÍCIO (HOME) */}
        {currentTab === 'home' && (
          <HomePage
            settings={settings}
            latestGallery={latestGallery}
            recentGalleries={galleries}
            categories={categories}
            ministries={ministries}
            events={events}
            featuredVideo={videos[0]}
            onNavigate={navigateTo}
            onOpenGallery={handleOpenGallery}
          />
        )}

        {/* GALERIAS (LIST OR DETAILS) */}
        {currentTab === 'galerias' && (
          selectedGallery ? (
            <GaleriaDetalhesPage
              gallery={selectedGallery}
              photos={selectedGalleryPhotos}
              churchName={settings.churchName}
              onBack={handleBackFromGallery}
            />
          ) : (
            <GaleriasPage
              galleries={galleries}
              categories={categories}
              ministries={ministries}
              initialCategoryId={selectedCategoryId || 'cat-todos'}
              onOpenGallery={handleOpenGallery}
            />
          )
        )}

        {/* AGENDA */}
        {currentTab === 'agenda' && (
          <AgendaPage
            events={events}
            churchName={settings.churchName}
          />
        )}

        {/* VÍDEOS */}
        {currentTab === 'videos' && (
          <VideosPage
            videos={videos}
          />
        )}

        {/* MINISTÉRIOS */}
        {currentTab === 'ministerios' && (
          <MinisteriosPage
            ministries={ministries}
            galleries={galleries}
            selectedMinistrySlug={selectedMinistrySlug}
            onOpenGallery={handleOpenGallery}
            onFilterMinistryGalleries={() => {
              navigateTo('galerias');
            }}
          />
        )}

        {/* SOBRE NÓS */}
        {currentTab === 'sobre' && (
          <SobrePage
            settings={settings}
          />
        )}

        {/* CONTATO */}
        {currentTab === 'contato' && (
          <ContatoPage
            settings={settings}
          />
        )}

      </main>

      {/* Responsive Dense Footer */}
      <Footer
        settings={settings}
        onNavigate={(tab) => navigateTo(tab)}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
      />

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp
        whatsappNumber={settings.whatsapp}
      />

      {/* Privacy Policy & Photo Removal Request Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        settings={settings}
      />

    </div>
  );
}
