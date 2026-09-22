import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header, NavTab } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ChurchAssistant } from './components/ChurchAssistant';
import { ScrollFx } from './components/ScrollFx';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { WhatsAppComingSoonModal } from './components/WhatsAppComingSoonModal';
import { HomePage } from './pages/HomePage';
import { GaleriasPage } from './pages/GaleriasPage';
import { GaleriaDetalhesPage } from './pages/GaleriaDetalhesPage';
import { AgendaPage } from './pages/AgendaPage';
import { MinisteriosPage } from './pages/MinisteriosPage';
import { SobrePage } from './pages/SobrePage';
import { ContatoPage } from './pages/ContatoPage';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { DatabaseService } from './services/db';
import { supabase } from './lib/supabase';
import { Gallery, Category, Ministry, ChurchEvent, SiteSettings, Photo } from './types';

const emptySettings: SiteSettings = {
  churchName: 'AD BARRAVENTO',
  subtitle: 'Carregando o portal...',
  phone: '',
  whatsapp: '',
  instagram: '',
  youtube: '',
  email: '',
  address: '',
  neighborhood: '',
  city: '',
  cultSchedule: [],
  defaultWatermarkText: 'AD BARRAVENTO',
  enableWatermarkDefault: true,
  heroImageUrl: '',
  historyText: '',
  missionText: '',
  visionText: '',
  valuesText: '',
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [activeGalleryId, setActiveGalleryId] = useState<string | null>(null);
  const [selectedMinistrySlug, setSelectedMinistrySlug] = useState<string | undefined>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [settings, setSettings] = useState<SiteSettings>(emptySettings);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [selectedGalleryPhotos, setSelectedGalleryPhotos] = useState<Photo[]>([]);

  const refreshData = useCallback(() => setDataVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadError(null);
        const [nextSettings, nextGalleries, nextCategories, nextMinistries, nextEvents, staff] = await Promise.all([
          DatabaseService.getSettings(),
          DatabaseService.getGalleries(),
          DatabaseService.getCategories(),
          DatabaseService.getMinistries(),
          DatabaseService.getEvents(),
          DatabaseService.getSessionStaff(),
        ]);
        if (cancelled) return;
        setSettings(nextSettings);
        setGalleries(nextGalleries);
        setCategories(nextCategories);
        setMinistries(nextMinistries);
        setEvents(nextEvents);
        setIsAdminLoggedIn(Boolean(staff));
      } catch (error) {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : 'Falha ao carregar o portal.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dataVersion]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setIsAdminLoggedIn(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!activeGalleryId) {
      setSelectedGalleryPhotos([]);
      return;
    }
    DatabaseService.getPhotosByGallery(activeGalleryId).then(setSelectedGalleryPhotos);
  }, [activeGalleryId, dataVersion]);

  const latestGallery = galleries.find((g) => g.featured) || galleries[0];
  const selectedGallery = useMemo(() => {
    if (!activeGalleryId) return null;
    return galleries.find((g) => g.id === activeGalleryId) || null;
  }, [activeGalleryId, galleries]);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('galeria/')) {
        setActiveGalleryId(hash.replace('galeria/', ''));
        setCurrentTab('galerias');
      } else if (hash === 'admin') {
        setCurrentTab('admin');
      } else if (['home', 'galerias', 'agenda', 'ministerios', 'sobre', 'contato'].includes(hash)) {
        setCurrentTab(hash as NavTab);
        setActiveGalleryId(null);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

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

  const handleAdminLogin = async (email: string, password: string) => {
    await DatabaseService.loginAdmin(email, password);
    setIsAdminLoggedIn(true);
    refreshData();
  };

  const handleAdminLogout = async () => {
    await DatabaseService.logoutAdmin();
    setIsAdminLoggedIn(false);
    navigateTo('home');
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-ink flex items-center justify-center text-cream">
        <div className="text-center space-y-3">
          <div className="mx-auto h-12 w-12 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
          <p className="font-heading tracking-[0.2em] uppercase text-sm text-gold">AD Barravento</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-dvh bg-ink text-cream flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="font-heading text-2xl">Não foi possível abrir o portal</h1>
          <p className="text-cream/70 text-sm">{loadError}</p>
          <button onClick={refreshData} className="px-5 py-3 rounded-xl bg-gold text-ink font-bold">
            Tentar de novo
          </button>
        </div>
      </div>
    );
  }

  if (currentTab === 'admin') {
    if (!isAdminLoggedIn) {
      return <AdminLogin onLogin={handleAdminLogin} onBackToSite={() => navigateTo('home')} />;
    }
    return (
      <AdminDashboard
        galleries={galleries}
        categories={categories}
        ministries={ministries}
        events={events}
        settings={settings}
        onRefresh={refreshData}
        onLogout={handleAdminLogout}
        onBackToSite={() => navigateTo('home')}
      />
    );
  }

  return (
    <div className="min-h-dvh flex flex-col bg-canvas text-fg font-sans">
      <ScrollFx />
      <Header
        currentTab={currentTab}
        onNavigate={(tab, params) => navigateTo(tab, params)}
        isAdminLoggedIn={isAdminLoggedIn}
      />
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            settings={settings}
            latestGallery={latestGallery}
            recentGalleries={galleries}
            categories={categories}
            ministries={ministries}
            events={events}
            onNavigate={navigateTo}
            onOpenGallery={handleOpenGallery}
            onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
          />
        )}
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
        {currentTab === 'agenda' && <AgendaPage events={events} settings={settings} />}
        {currentTab === 'ministerios' && (
          <MinisteriosPage
            ministries={ministries}
            galleries={galleries}
            selectedMinistrySlug={selectedMinistrySlug}
            onOpenGallery={handleOpenGallery}
            onFilterMinistryGalleries={() => navigateTo('galerias')}
          />
        )}
        {currentTab === 'sobre' && <SobrePage settings={settings} onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)} />}
        {currentTab === 'contato' && <ContatoPage settings={settings} onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)} />}
      </main>
      <Footer
        settings={settings}
        onNavigate={(tab) => navigateTo(tab)}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
      />
      <FloatingWhatsApp onOpenNotice={() => setIsWhatsAppModalOpen(true)} />
      <ChurchAssistant
        settings={settings}
        ministries={ministries}
        events={events}
        onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
      />
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        settings={settings}
        onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
      />
      <WhatsAppComingSoonModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        instagram={settings.instagram}
      />
    </div>
  );
}
