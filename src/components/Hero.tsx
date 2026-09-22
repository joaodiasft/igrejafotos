import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
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
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const item = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
      };

  return (
    <section ref={heroRef} id="hero-section" className="relative w-full overflow-hidden bg-ink text-white">
      {/* Background image with parallax + cinematic ken-burns */}
      <motion.div className="absolute inset-0 z-0" style={{ y: reduce ? 0 : bgY }}>
        <img
          src={settings.heroImageUrl || 'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1920&q=85'}
          alt="Culto de adoração na Igreja AD Barravento"
          className={`w-full h-[120%] object-cover object-center ${reduce ? 'scale-105' : 'animate-kenburns'}`}
        />
        <div className="absolute inset-0 hero-scrim" />
        {/* Warm glow accent */}
        <div className="absolute -top-1/3 -left-1/4 w-[60%] h-[120%] bg-flame/20 blur-[120px] rounded-full pointer-events-none" />
      </motion.div>

      {/* Floating embers */}
      {!reduce && (
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          {[
            { l: '12%', t: '30%', s: 6, d: '0s' },
            { l: '24%', t: '65%', s: 4, d: '1.2s' },
            { l: '68%', t: '22%', s: 5, d: '0.6s' },
            { l: '82%', t: '55%', s: 3, d: '1.8s' },
            { l: '45%', t: '78%', s: 4, d: '2.4s' },
          ].map((e, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-gold-bright/70 blur-[1px] animate-floaty"
              style={{ left: e.l, top: e.t, width: e.s, height: e.s, animationDelay: e.d }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 sm:pt-24 sm:pb-28 flex flex-col justify-center min-h-[420px] sm:min-h-[540px]"
      >
        <div className="max-w-3xl space-y-5 sm:space-y-7">
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-white/15 text-gold-bright text-xs sm:text-sm font-semibold tracking-wide"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
            </span>
            Portal oficial de fotos e momentos
          </motion.div>

          <motion.h1
            variants={item}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white font-heading leading-[1.02]"
          >
            Igreja{' '}
            <span className="bg-gradient-to-r from-gold-bright via-gold to-flame bg-clip-text text-transparent italic">
              AD Barravento
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-base sm:text-xl text-cream/80 font-normal leading-relaxed max-w-2xl"
          >
            {settings.subtitle || 'Vivendo momentos de fé, comunhão e adoração.'}
          </motion.p>

          <motion.div
            variants={item}
            className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
          >
            <button
              id="hero-btn-ver-fotos"
              onClick={onViewPhotos}
              className="group px-6 py-3.5 rounded-2xl bg-gradient-flame text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-glow hover:shadow-warm transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 min-h-[52px]"
            >
              <Camera className="w-5 h-5 transition-transform group-hover:-rotate-6" />
              VER ÚLTIMAS FOTOS
            </button>

            <button
              id="hero-btn-agenda"
              onClick={onViewAgenda}
              className="px-6 py-3.5 rounded-2xl glass hover:bg-white/15 text-white border border-white/20 font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] min-h-[52px]"
            >
              <Calendar className="w-5 h-5 text-gold-bright" />
              AGENDA DA IGREJA
            </button>
          </motion.div>

          <motion.div
            variants={item}
            className="pt-3 flex items-center gap-2 text-xs text-cream/50 sm:hidden"
          >
            <ArrowDown className="w-3.5 h-3.5 animate-bounce text-gold" />
            <span>Role para ver o último culto e galerias</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom fade into page */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-canvas to-transparent z-[5] pointer-events-none" />
    </section>
  );
};
