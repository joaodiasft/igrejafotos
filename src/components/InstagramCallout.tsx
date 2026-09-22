import React from 'react';
import { Instagram, ArrowUpRight, MessageCircle } from 'lucide-react';
import { Reveal } from './Reveal';
import { SiteSettings } from '../types';

interface InstagramCalloutProps {
  settings: SiteSettings;
  onOpenWhatsApp?: () => void;
}

export const InstagramCallout: React.FC<InstagramCalloutProps> = ({ settings, onOpenWhatsApp }) => {
  return (
    <section className="py-14 sm:py-20 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative rounded-[28px] bg-gradient-night text-white p-8 sm:p-12 overflow-hidden shadow-warm ring-1 ring-white/10">
            {/* Decorative glows */}
            <div className="absolute -top-24 -right-16 w-72 h-72 bg-flame/25 blur-[110px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-28 -left-10 w-72 h-72 bg-terracotta/25 blur-[110px] rounded-full pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold-bright text-xs font-bold border border-gold/30">
                  <Instagram className="w-3.5 h-3.5" />
                  Redes da igreja
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading leading-tight">
                  Siga a{' '}
                  <span className="bg-gradient-to-r from-gold-bright to-flame bg-clip-text text-transparent">
                    AD Barravento
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-cream/70 leading-relaxed">
                  Avisos, cultos e os bastidores da casa. As fotos do portal ficam no ar por 1 mês —
                  no Instagram a memória segue viva.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <a
                    href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group px-6 py-3.5 rounded-2xl bg-gradient-flame text-white font-bold text-sm flex items-center gap-2 shadow-glow hover:shadow-warm transition-all duration-300 hover:-translate-y-0.5 min-h-[52px]"
                  >
                    <Instagram className="w-4 h-4" />
                    {settings.instagram}
                    <ArrowUpRight className="w-4 h-4 opacity-80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <button
                    type="button"
                    onClick={onOpenWhatsApp}
                    className="px-5 py-3.5 rounded-2xl glass hover:bg-white/15 text-white border border-white/15 text-sm font-semibold flex items-center gap-2 transition-all duration-300 min-h-[52px]"
                  >
                    <MessageCircle className="w-4 h-4 text-gold-bright" />
                    WhatsApp
                  </button>
                </div>
              </div>

              {/* Instagram glyph accent */}
              <div className="hidden md:flex shrink-0 items-center justify-center w-40 h-40 rounded-3xl glass border border-white/10 animate-floaty">
                <Instagram className="w-20 h-20 text-gold-bright/90" strokeWidth={1.4} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
