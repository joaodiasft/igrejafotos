import React from 'react';
import { Camera, Calendar, ArrowRight } from 'lucide-react';
import { Gallery } from '../types';

interface GalleryCardProps {
  gallery: Gallery;
  onOpen: (id: string) => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ gallery, onOpen }) => {
  const formatShortDate = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-');
      const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
      return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      id={`gallery-card-${gallery.id}`}
      onClick={() => onOpen(gallery.id)}
      className="group cursor-pointer rounded-3xl bg-surface border border-line shadow-soft hover:shadow-warm hover:border-brand/30 transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1 active:translate-y-0"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-elevate">
        <img
          src={gallery.coverPhoto}
          alt={gallery.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[900ms] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent opacity-70" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg bg-gradient-flame text-white text-[11px] font-bold tracking-wide uppercase shadow-sm">
            {gallery.categoryName}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg glass text-white text-[11px] font-semibold border border-white/15">
            <Camera className="w-3 h-3 text-gold-bright" />
            <span>{gallery.photoCount}</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted font-medium">
            <Calendar className="w-3.5 h-3.5 text-terracotta dark:text-gold" />
            <span>{formatShortDate(gallery.date)}</span>
            {gallery.ministryName && (
              <>
                <span className="text-subtle">•</span>
                <span className="truncate max-w-[140px]">{gallery.ministryName}</span>
              </>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-fg font-heading leading-snug group-hover:text-terracotta dark:group-hover:text-gold transition-colors line-clamp-2">
            {gallery.title}
          </h3>
        </div>

        <div className="pt-2 border-t border-line flex items-center justify-between">
          <span className="text-xs font-semibold text-subtle">
            {gallery.photoCount} registros
          </span>

          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand/10 text-terracotta dark:text-gold group-hover:bg-gradient-flame group-hover:text-white text-xs font-bold transition-all duration-200"
          >
            <span>ABRIR</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
