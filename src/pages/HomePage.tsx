import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { UltimoCultoSection } from '../components/UltimoCultoSection';
import { CategoriasFilter } from '../components/CategoriasFilter';
import { GalleryCard } from '../components/GalleryCard';
import { ProximosEventosSection } from '../components/ProximosEventosSection';
import { MinisteriosSection } from '../components/MinisteriosSection';
import { InstagramCallout } from '../components/InstagramCallout';
import { Reveal } from '../components/Reveal';
import { StatsBand } from '../components/StatsBand';
import { ArrowRight, Camera, Timer, Image as ImageIcon, Users, CalendarDays } from 'lucide-react';
import { Gallery, Category, Ministry, ChurchEvent, SiteSettings } from '../types';
import { NavTab } from '../components/Header';

interface HomePageProps {
  settings: SiteSettings;
  latestGallery?: Gallery;
  recentGalleries: Gallery[];
  categories: Category[];
  ministries: Ministry[];
  events: ChurchEvent[];
  onNavigate: (tab: NavTab, params?: { galleryId?: string; ministrySlug?: string; categoryId?: string }) => void;
  onOpenGallery: (galleryId: string) => void;
  onOpenWhatsApp?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  latestGallery,
  recentGalleries,
  categories,
  ministries,
  events,
  onNavigate,
  onOpenGallery,
  onOpenWhatsApp
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('cat-todos');

  // Filter recent galleries based on quick category bar
  const filteredGalleries = selectedCategoryId === 'cat-todos'
    ? recentGalleries
    : recentGalleries.filter(g => g.categoryId === selectedCategoryId);

  const totalPhotos = recentGalleries.reduce((sum, g) => sum + (g.photoCount || 0), 0);
  const stats = [
    { icon: Camera, value: recentGalleries.length, label: 'Galerias' },
    { icon: ImageIcon, value: totalPhotos, label: 'Fotos registradas' },
    { icon: Users, value: ministries.length, label: 'Departamentos' },
    { icon: CalendarDays, value: (settings.cultSchedule || []).length, label: 'Cultos por semana' },
  ];

  return (
    <div className="space-y-0">
      {/* 1. HERO PRINCIPAL */}
      <Hero
        settings={settings}
        onViewPhotos={() => {
          const el = document.getElementById('secao-galerias');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          else onNavigate('galerias');
        }}
        onViewAgenda={() => onNavigate('agenda')}
      />

      {/* 2. ÚLTIMO CULTO */}
      {latestGallery && (
        <UltimoCultoSection
          gallery={latestGallery}
          onOpenGallery={onOpenGallery}
        />
      )}

      {/* FAIXA DE NÚMEROS */}
      <StatsBand stats={stats} />

      <div className="bg-brand/8 border-y border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-start sm:items-center gap-3 text-sm text-fg">
          <span className="shrink-0 p-1.5 rounded-lg bg-gradient-flame text-white">
            <Timer className="w-4 h-4" />
          </span>
          <p className="text-muted">
            <strong className="text-fg">As fotos ficam disponíveis por 1 mês.</strong> Depois desse prazo a galeria sai do portal — baixe as suas enquanto ainda estiver no ar.
          </p>
        </div>
      </div>

      {/* 3. GALERIAS RECENTES */}
      <section id="secao-galerias" className="py-14 sm:py-20 bg-canvas-2 border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-terracotta dark:text-gold mb-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>Momentos & Celebrações</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-fg font-heading">
                Galerias Recentes
              </h2>
            </div>

            <button
              id="btn-ver-todas-galerias"
              onClick={() => onNavigate('galerias')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-terracotta dark:text-gold hover:opacity-80 group self-start sm:self-auto"
            >
              <span>Ver todas as galerias</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Quick Category filter pills */}
          <CategoriasFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            className="mb-8"
          />

          {/* Galleries Grid - 1 on small mobile, 2 on mobile/tablet, 3 or 4 on desktop */}
          {filteredGalleries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredGalleries.slice(0, 6).map((gallery, i) => (
                <Reveal key={gallery.id} delay={i * 0.05}>
                  <GalleryCard gallery={gallery} onOpen={onOpenGallery} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-surface rounded-2xl border border-dashed border-line-strong p-8">
              <Camera className="w-10 h-10 text-subtle mx-auto mb-2" />
              <p className="text-muted font-medium text-sm">
                Nenhuma galeria encontrada nesta categoria no momento.
              </p>
              <button
                onClick={() => setSelectedCategoryId('cat-todos')}
                className="mt-3 text-xs font-bold text-terracotta dark:text-gold hover:underline"
              >
                Ver todas as categorias
              </button>
            </div>
          )}

          {/* Mobile "Ver Mais" button */}
          <div className="pt-8 text-center sm:hidden">
            <button
              onClick={() => onNavigate('galerias')}
              className="w-full py-3.5 px-6 rounded-2xl bg-surface border border-line text-fg font-bold text-sm shadow-soft flex items-center justify-center gap-2"
            >
              <span>EXPLORAR TODAS AS GALERIAS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 4. PRÓXIMOS EVENTOS & AGENDA */}
      <ProximosEventosSection
        cultSchedule={settings.cultSchedule}
        onViewAllAgenda={() => onNavigate('agenda')}
      />

      {/* 5. MINISTÉRIOS */}
      <MinisteriosSection
        ministries={ministries}
        onSelectMinistry={(slug) => onNavigate('ministerios', { ministrySlug: slug })}
        onViewAllMinistries={() => onNavigate('ministerios')}
      />

      <InstagramCallout settings={settings} onOpenWhatsApp={onOpenWhatsApp} />
    </div>
  );
};
