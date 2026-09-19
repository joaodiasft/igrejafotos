import React from 'react';
import { Camera, Calendar, ArrowRight, Sparkles, MapPin } from 'lucide-react';
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

  // Format Brazilian date
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
    <section id="ultimo-culto-section" className="py-8 sm:py-12 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-blue-700">
              Destaque Recente • Último Culto
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Fotos já disponíveis para baixar
          </span>
        </div>

        {/* Feature Card */}
        <div 
          id="card-ultimo-culto"
          className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl shadow-slate-900/10 border border-slate-800 transition-all duration-300 hover:shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[320px] sm:min-h-[380px]">
            
            {/* Image Column */}
            <div className="lg:col-span-7 relative h-60 sm:h-80 lg:h-auto overflow-hidden">
              <img
                src={gallery.coverPhoto}
                alt={gallery.title}
                loading="eager"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent lg:hidden" />
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                <Camera className="w-3.5 h-3.5 text-blue-400" />
                <span>{gallery.photoCount} fotos</span>
              </div>
            </div>

            {/* Information Column */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-gradient-to-b from-slate-900 to-slate-950">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-blue-600/30 text-blue-300 font-semibold border border-blue-500/30">
                    {gallery.categoryName}
                  </span>
                  {gallery.ministryName && (
                    <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-medium">
                      {gallery.ministryName}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading leading-tight group-hover:text-blue-300 transition-colors">
                  {gallery.title}
                </h3>

                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="font-medium capitalize">{formatDateBR(gallery.date)}</span>
                  </div>
                  {gallery.time && (
                    <span>• {gallery.time}</span>
                  )}
                </div>

                {gallery.location && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{gallery.location}</span>
                  </div>
                )}

                <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {gallery.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  id="ultimo-culto-ver-galeria-btn"
                  onClick={() => onOpenGallery(gallery.id)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:shadow-xl transition-all duration-200 active:scale-98 min-h-[48px]"
                >
                  <span>VER GALERIA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
