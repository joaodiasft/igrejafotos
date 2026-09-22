import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring, useReducedMotion } from 'motion/react';
import { ArrowUp } from 'lucide-react';

/**
 * Global scroll flourishes: a reading-progress bar at the very top and a
 * back-to-top button that appears once the visitor has scrolled down.
 */
export const ScrollFx: React.FC = () => {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 right-0 z-50 h-[3px] origin-left bg-gradient-to-r from-gold via-flame to-terracotta"
        style={{ scaleX: reduce ? 1 : scaleX }}
      />

      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
            aria-label="Voltar ao topo"
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 h-11 w-11 rounded-full glass border border-line text-fg shadow-soft flex items-center justify-center hover:text-brand hover:border-brand/40 transition-colors"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
