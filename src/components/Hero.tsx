import React from 'react';
import { Camera, Calendar, ArrowDown } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeroProps {
  settings: SiteSettings;
  onViewPhotos: () => void;
  onViewAgenda: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  settings, 
  onViewPhotos, 
  onViewAgenda 
}) => {
  return (
    <section id="hero-section" className="relative w-full overflow-hidden bg-slate-950 text-white">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.heroImageUrl || "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1920&q=85"}
          alt="Culto de Adoração na Igreja AD Barravento"
          className="w-full h-full object-cover object-center scale-105 transform motion-safe:animate-pulse opacity-40 mix-blend-luminosity"
        />
        {/* Gradients to ensure text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 via-slate-950/60 to-transparent" />
      </div>

      {/* Hero Content - balanced height on mobile */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-20 sm:pb-24 flex flex-col justify-center min-h-[360px] sm:min-h-[460px]">
        <div className="max-w-3xl space-y-4 sm:space-y-6">
          
          {/* Subtle badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            Portal Oficial de Fotos e Momentos
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-heading leading-tight">
            IGREJA <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-300">AD BARRAVENTO</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-200 font-normal leading-relaxed max-w-2xl font-sans">
            {settings.subtitle || 'Vivendo momentos de fé, comunhão e adoração.'}
          </p>

          {/* Action Buttons - Mobile friendly min 44px */}
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              id="hero-btn-ver-fotos"
              onClick={onViewPhotos}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-blue-600/30 hover:shadow-xl transition-all duration-200 active:scale-98 min-h-[48px]"
            >
              <Camera className="w-5 h-5" />
              VER ÚLTIMAS FOTOS
            </button>

            <button
              id="hero-btn-agenda"
              onClick={onViewAgenda}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-98 min-h-[48px]"
            >
              <Calendar className="w-5 h-5 text-blue-300" />
              AGENDA DA IGREJA
            </button>
          </div>

          {/* Mobile quick scroll hint */}
          <div className="pt-4 flex items-center gap-2 text-xs text-slate-400 sm:hidden">
            <ArrowDown className="w-3.5 h-3.5 animate-bounce text-blue-400" />
            <span>Role para ver o último culto e galerias</span>
          </div>

        </div>
      </div>
    </section>
  );
};
