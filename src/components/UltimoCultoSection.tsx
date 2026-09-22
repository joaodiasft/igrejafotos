import React from 'react';
import { Camera, Calendar, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { Reveal } from './Reveal';
import { Gallery } from '../types';

interface UltimoCultoSectionProps {
  gallery?: Gallery;
  onOpenGallery: (galleryId: string) => void;
}

export const UltimoCultoSection: React.FC<UltimoCultoSectionProps> = ({
  gallery,
  onOpenGallery
}) => {
  if (!gallery) return null;

  const formatDateBR = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-');
      const months = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
      ];
      return `${parseInt(d, 10)} de ${months[parseInt(m, 10) - 1]} de ${y}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="ultimo-culto-section" className="py-10 sm:py-16 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-5 sm:mb-7">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-gradient-flame text-white shadow-glow">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-xs sm:text-sm font-bold tracking-[0.14em] uppercase text-terracotta dark:text-gold">
              Destaque Recente • Último Culto
            </h2>
          </div>
          <span className="text-xs text-subtle font-medium hidden sm:inline">
            Fotos já disponíveis para baixar
          </span>
        </div>

        <Reveal>
          <div
            id="card-ultimo-culto"
            className="group relative rounded-3xl overflow-hidden bg-gradient-night text-white shadow-warm ring-1 ring-white/10 transition-all duration-500"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[340px] sm:min-h-[420px]">

              {/* Image */}
              <div className="lg:col-span-7 relative h-64 sm:h-96 lg:h-auto overflow-hidden">
                <img
                  src={gallery.coverPhoto}
                  alt={gallery.title}
                  loading="eager"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[900ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-ink/80" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-white text-xs font-bold border border-white/20">
                  <Camera className="w-3.5 h-3.5 text-gold-bright" />
                  <span>{gallery.photoCount} fotos</span>
                </div>
              </div>

              {/* Info */}
              <div className="lg:col-span-5 p-6 sm:p-9 lg:p-10 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-gold/15 text-gold-bright font-semibold border border-gold/25">
                      {gallery.categoryName}
                    </span>
                    {gallery.ministryName && (
                      <span className="px-2.5 py-1 rounded-lg bg-white/8 text-cream/80 font-medium border border-white/10">
                        {gallery.ministryName}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-heading leading-tight">
                    {gallery.title}
                  </h3>

                  <div className="flex items-center gap-3 text-sm text-cream/75">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gold" />
                      <span className="font-medium capitalize">{formatDateBR(gallery.date)}</span>
                    </div>
                    {gallery.time && <span className="text-cream/50">• {gallery.time}</span>}
                  </div>

                  {gallery.location && (
                    <div className="flex items-center gap-1.5 text-xs text-cream/55">
                      <MapPin className="w-3.5 h-3.5 text-terracotta" />
                      <span>{gallery.location}</span>
                    </div>
                  )}

                  <p className="text-sm text-cream/70 leading-relaxed line-clamp-3">
                    {gallery.description}
                  </p>
                </div>

                <button
                  id="ultimo-culto-ver-galeria-btn"
                  onClick={() => onOpenGallery(gallery.id)}
                  className="group/btn w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-flame text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-glow hover:shadow-warm transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 min-h-[52px]"
                >
                  <span>VER GALERIA</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>

            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
};
