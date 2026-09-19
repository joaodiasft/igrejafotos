import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { UltimoCultoSection } from '../components/UltimoCultoSection';
import { CategoriasFilter } from '../components/CategoriasFilter';
import { GalleryCard } from '../components/GalleryCard';
import { ProximosEventosSection } from '../components/ProximosEventosSection';
import { MinisteriosSection } from '../components/MinisteriosSection';
import { InstagramCallout } from '../components/InstagramCallout';
import { VideoModal } from '../components/VideoModal';
import { Play, ArrowRight, Camera } from 'lucide-react';
import { Gallery, Category, Ministry, ChurchEvent, VideoItem, SiteSettings } from '../types';
import { NavTab } from '../components/Header';

interface HomePageProps {
  settings: SiteSettings;
  latestGallery?: Gallery;
  recentGalleries: Gallery[];
  categories: Category[];
  ministries: Ministry[];
  events: ChurchEvent[];
  featuredVideo?: VideoItem;
  onNavigate: (tab: NavTab, params?: { galleryId?: string; ministrySlug?: string; categoryId?: string }) => void;
  onOpenGallery: (galleryId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  latestGallery,
  recentGalleries,
  categories,
  ministries,
  events,
  featuredVideo,
  onNavigate,
  onOpenGallery
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('cat-todos');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  // Filter recent galleries based on quick category bar
  const filteredGalleries = selectedCategoryId === 'cat-todos'
    ? recentGalleries
    : recentGalleries.filter(g => g.categoryId === selectedCategoryId);

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

      {/* 3. GALERIAS RECENTES */}
      <section id="secao-galerias" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 font-heading mb-1">
                <Camera className="w-3.5 h-3.5" />
                <span>Momentos & Celebrações</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                Galerias Recentes
              </h2>
            </div>

            <button
              id="btn-ver-todas-galerias"
              onClick={() => onNavigate('galerias')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 group self-start sm:self-auto"
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
              {filteredGalleries.slice(0, 6).map((gallery) => (
                <GalleryCard
                  key={gallery.id}
                  gallery={gallery}
                  onOpen={onOpenGallery}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 p-8">
              <Camera className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-600 font-medium text-sm">
                Nenhuma galeria encontrada nesta categoria no momento.
              </p>
              <button
                onClick={() => setSelectedCategoryId('cat-todos')}
                className="mt-3 text-xs font-bold text-blue-600 hover:underline"
              >
                Ver todas as categorias
              </button>
            </div>
          )}

          {/* Mobile "Ver Mais" button */}
          <div className="pt-8 text-center sm:hidden">
            <button
              onClick={() => onNavigate('galerias')}
              className="w-full py-3.5 px-6 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-sm shadow-xs flex items-center justify-center gap-2"
            >
              <span>EXPLORAR TODAS AS GALERIAS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 4. PRÓXIMOS EVENTOS & AGENDA */}
      <ProximosEventosSection
        events={events}
        churchName={settings.churchName}
        onViewAllAgenda={() => onNavigate('agenda')}
      />

      {/* 5. MINISTÉRIOS */}
      <MinisteriosSection
        ministries={ministries}
        onSelectMinistry={(slug) => onNavigate('ministerios', { ministrySlug: slug })}
        onViewAllMinistries={() => onNavigate('ministerios')}
      />

      {/* 6. VÍDEO EM DESTAQUE */}
      {featuredVideo && (
        <section id="video-destaque-section" className="py-12 sm:py-16 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-heading">
                  Transmissões & Mensagens
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                  Vídeo em Destaque
                </h2>
              </div>

              <button
                onClick={() => onNavigate('videos')}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 group self-start sm:self-auto"
              >
                <span>Ver mais vídeos</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Video Banner Card */}
            <div
              onClick={() => setActiveVideo(featuredVideo)}
              className="group cursor-pointer relative rounded-3xl overflow-hidden bg-slate-950 aspect-[16/9] sm:aspect-[21/9] shadow-xl border border-slate-800 flex items-center justify-center"
            >
              <img
                src={featuredVideo.thumbnailUrl}
                alt={featuredVideo.title}
                className="w-full h-full object-cover object-center opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Central Play Button */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-300">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
                <div className="max-w-2xl space-y-1 text-white">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase">
                    {featuredVideo.eventName}
                  </span>
                  <h3 className="text-lg sm:text-2xl font-bold font-heading line-clamp-2">
                    {featuredVideo.title}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. CHAMADA INSTAGRAM */}
      <InstagramCallout settings={settings} />

      {/* Video Modal Player */}
      <VideoModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </div>
  );
};
