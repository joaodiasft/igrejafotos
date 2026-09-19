import React from 'react';
import { Users, ArrowRight } from 'lucide-react';
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
    <section id="ministerios-section" className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-heading">
              Corpo de Cristo em Ação
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Nossos Ministérios
            </h2>
          </div>

          <button
            id="btn-ver-todos-ministerios"
            onClick={onViewAllMinistries}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 group self-start sm:self-auto"
          >
            <span>Conhecer todos os ministérios</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Ministries Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {ministries.map((min) => (
            <div
              key={min.id}
              id={`min-card-${min.slug}`}
              onClick={() => onSelectMinistry(min.slug)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-50 hover:bg-white hover:border-slate-300 hover:shadow-lg transition-all flex flex-col active:scale-95"
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <img
                  src={min.image}
                  alt={min.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 right-2 text-xs font-bold text-white leading-tight font-heading drop-shadow-sm">
                  {min.name}
                </span>
              </div>
              <div className="p-2.5 flex items-center justify-between text-[11px] font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
                <span>Ver galerias</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
