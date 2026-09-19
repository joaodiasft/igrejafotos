import React from 'react';
import { Instagram, Heart, ArrowUpRight, MessageCircle } from 'lucide-react';
import { SiteSettings } from '../types';

interface InstagramCalloutProps {
  settings: SiteSettings;
}

export const InstagramCallout: React.FC<InstagramCalloutProps> = ({ settings }) => {
  return (
    <section id="instagram-callout-section" className="py-12 sm:py-16 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-10 lg:p-12 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold border border-pink-500/30">
              <Instagram className="w-3.5 h-3.5" />
              <span>Conecte-se conosco no Instagram</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white leading-tight">
              Siga a <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300">AD Barravento</span> nas Redes
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Acompanhe os avisos, transmissões ao vivo, versículos diários e bastidores dos nossos cultos e eventos. Marque nossa página em seus stories!
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                id="btn-instagram-follow"
                href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-pink-600/20 transition-all flex items-center gap-2 min-h-[48px]"
              >
                <Instagram className="w-4 h-4" />
                <span>{settings.instagram}</span>
                <ArrowUpRight className="w-4 h-4 opacity-80" />
              </a>

              <a
                id="btn-whatsapp-join"
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-sm font-semibold transition-all flex items-center gap-2 min-h-[48px]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Grupo no WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Social Proof / Visual badges */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1 backdrop-blur-xs min-w-[110px]">
              <span className="text-xl sm:text-2xl font-black font-heading text-white">4.3k+</span>
              <p className="text-[11px] text-slate-400 font-medium">Fotos no portal</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1 backdrop-blur-xs min-w-[110px]">
              <span className="text-xl sm:text-2xl font-black font-heading text-pink-400">100%</span>
              <p className="text-[11px] text-slate-400 font-medium">Gratuito p/ baixar</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1 backdrop-blur-xs min-w-[110px] hidden sm:block">
              <span className="text-xl sm:text-2xl font-black font-heading text-blue-400">Sem</span>
              <p className="text-[11px] text-slate-400 font-medium">Cadastro exigido</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
