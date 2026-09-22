import React from 'react';
import { Clock, ArrowRight, CalendarDays } from 'lucide-react';
import { Reveal } from './Reveal';
import { SiteSettings } from '../types';

interface ProximosEventosSectionProps {
  cultSchedule: SiteSettings['cultSchedule'];
  onViewAllAgenda: () => void;
}

export const ProximosEventosSection: React.FC<ProximosEventosSectionProps> = ({
  cultSchedule,
  onViewAllAgenda
}) => {
  return (
    <section className="py-14 sm:py-20 bg-canvas-2 border-y border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-terracotta dark:text-gold">
              <CalendarDays className="w-3.5 h-3.5" />
              Programação da igreja
            </span>
            <h2 className="mt-1.5 text-3xl sm:text-4xl font-extrabold text-fg font-heading">
              Agenda semanal
            </h2>
          </div>
          <button
            onClick={onViewAllAgenda}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-terracotta dark:text-gold hover:opacity-80 group self-start sm:self-auto"
          >
            <span>Ver agenda completa</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(cultSchedule || []).map((item, i) => (
            <Reveal as="article" key={`${item.day}-${item.title}`} delay={i * 0.05}>
              <div className="group relative h-full rounded-2xl border border-line bg-surface p-5 space-y-2.5 shadow-soft hover:shadow-warm hover:border-brand/30 transition-all duration-300 overflow-hidden">
                <span className="absolute left-0 top-5 bottom-5 w-1 rounded-full bg-gradient-flame opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-terracotta dark:text-gold">{item.day}</p>
                <h3 className="text-lg font-heading font-bold text-fg leading-snug">{item.title}</h3>
                <p className="flex items-center gap-2 text-sm font-semibold text-muted">
                  <Clock className="w-4 h-4 text-flame" />
                  {item.time === '—' ? 'Horário a confirmar' : item.time}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
