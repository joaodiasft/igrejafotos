import React from 'react';
import { Camera, Calendar, ArrowRight } from 'lucide-react';
import { Gallery } from '../types';

interface GalleryCardProps {
  gallery: Gallery;
  onOpen: (id: string) => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ gallery, onOpen }) => {
  // Format short date (e.g. 12 SET 2026)
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
      className="group cursor-pointer rounded-[18px] bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden active:scale-[0.985]"
    >
      {/* Image Thumbnail Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={gallery.coverPhoto}
          alt={gallery.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg bg-slate-950/75 backdrop-blur-md text-white text-[11px] font-bold tracking-wide uppercase">
            {gallery.categoryName}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-medium">
            <Camera className="w-3 h-3 text-blue-400" />
            <span>{gallery.photoCount} fotos</span>
          </span>
        </div>

        {/* Bottom subtle gradient */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{formatShortDate(gallery.date)}</span>
            {gallery.ministryName && (
              <>
                <span>•</span>
                <span className="text-slate-600 truncate max-w-[140px]">{gallery.ministryName}</span>
              </>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
            {gallery.title}
          </h3>
        </div>

        {/* Action Button / Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
            {gallery.photoCount} registros
          </span>

          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white text-xs font-bold transition-all duration-200"
          >
            <span>ABRIR</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
