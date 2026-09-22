import React from 'react';
import { Users, ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { Ministry } from '../types';

interface MinisteriosSectionProps {
  ministries: Ministry[];
  onSelectMinistry: (slug: string) => void;
  onViewAllMinistries: () => void;
}

export const MinisteriosSection: React.FC<MinisteriosSectionProps> = ({
  ministries,
  onSelectMinistry,
  onViewAllMinistries
}) => {
  return (
    <section id="ministerios-section" className="py-14 sm:py-20 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-terracotta dark:text-gold">
              <Users className="w-3.5 h-3.5" />
              Corpo de Cristo em ação
            </span>
            <h2 className="mt-1.5 text-3xl sm:text-4xl font-extrabold text-fg font-heading">
              Departamentos
            </h2>
          </div>

          <button
            id="btn-ver-todos-ministerios"
            onClick={onViewAllMinistries}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-terracotta dark:text-gold hover:opacity-80 group self-start sm:self-auto"
          >
            <span>Ver todos os departamentos</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {ministries.map((min, i) => (
            <Reveal key={min.id} delay={i * 0.04}>
              <div
                id={`min-card-${min.slug}`}
                onClick={() => onSelectMinistry(min.slug)}
                className="group h-full cursor-pointer rounded-2xl overflow-hidden border border-line bg-surface hover:border-brand/30 hover:shadow-warm transition-all duration-300 flex flex-col hover:-translate-y-1 active:translate-y-0"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <img
                    src={min.image}
                    alt={min.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[900ms] ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                  <span className="absolute bottom-2.5 left-2.5 right-2.5 text-sm font-bold text-white leading-tight font-heading drop-shadow">
                    {min.name}
                  </span>
                </div>
                <div className="p-2.5 flex items-center justify-between text-[11px] font-semibold text-muted group-hover:text-terracotta dark:group-hover:text-gold transition-colors">
                  <span>Ver galerias</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
};
