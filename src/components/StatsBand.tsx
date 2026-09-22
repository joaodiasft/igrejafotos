import React, { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';

export interface Stat {
  icon: LucideIcon;
  value: number;
  label: string;
  suffix?: string;
}

interface StatsBandProps {
  stats: Stat[];
}

const CountUp: React.FC<{ value: number; play: boolean; suffix?: string }> = ({ value, play, suffix }) => {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!play) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, value, reduce]);

  return (
    <span>
      {display.toLocaleString('pt-BR')}
      {suffix}
    </span>
  );
};

export const StatsBand: React.FC<StatsBandProps> = ({ stats }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  // Safety net: never leave the numbers stuck at 0 if the observer misfires.
  const [forced, setForced] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setForced(true), 1400);
    return () => clearTimeout(t);
  }, []);
  const play = inView || forced;

  return (
    <section className="bg-canvas-2 border-y border-line">
      <div
        ref={ref}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4"
      >
        {stats.map(({ icon: Icon, value, label, suffix }, i) => (
          <div
            key={label}
            className={`flex flex-col items-center text-center gap-1.5 ${
              i > 0 ? 'lg:border-l border-line' : ''
            }`}
          >
            <span className="mb-1 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-flame text-white shadow-glow">
              <Icon className="w-5 h-5" />
            </span>
            <span className="font-heading text-3xl sm:text-4xl font-extrabold text-fg tabular-nums">
              <CountUp value={value} play={play} suffix={suffix} />
            </span>
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
