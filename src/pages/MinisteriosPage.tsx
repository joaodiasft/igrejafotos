import React from 'react';
import { Users, Calendar, ArrowRight, ShieldCheck, Camera } from 'lucide-react';
import { Ministry, Gallery } from '../types';

interface MinisteriosPageProps {
  ministries: Ministry[];
  galleries: Gallery[];
  selectedMinistrySlug?: string;
  onOpenGallery: (id: string) => void;
  onFilterMinistryGalleries: (ministryId: string) => void;
}

export const MinisteriosPage: React.FC<MinisteriosPageProps> = ({
  ministries,
  galleries,
  selectedMinistrySlug,
  onOpenGallery,
  onFilterMinistryGalleries
}) => {
  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <Users className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Comunhão & Propósito
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Ministérios da AD Barravento
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            Conheça as frentes de atuação da nossa igreja e participe das atividades voltadas para cada faixa etária e chamado ministerial.
          </p>
        </div>

        {/* Ministries Detailed List */}
        <div className="space-y-8 sm:space-y-10">
          {ministries.map((min) => {
            const minGalleries = galleries.filter(g => g.ministryId === min.id);

            return (
              <div
                key={min.id}
                id={`ministry-detail-${min.slug}`}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6"
              >
                {/* Ministry Header Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-4 aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                    <img
                      src={min.image}
                      alt={min.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="md:col-span-8 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                        Ministério Ativo
                      </span>
                      {min.meetingSchedule && (
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          {min.meetingSchedule}
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                      {min.name}
                    </h2>

                    {min.leader && (
                      <p className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Liderança: {min.leader} {min.leaderRole ? `(${min.leaderRole})` : ''}</span>
                      </p>
                    )}

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {min.description}
                    </p>

                    <div className="pt-2">
                      <button
                        onClick={() => onFilterMinistryGalleries(min.id)}
                        className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Ver todas as fotos deste ministério ({minGalleries.length} eventos)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Related Gallery Thumbnails if any */}
                {minGalleries.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Últimos eventos registrados:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {minGalleries.slice(0, 3).map((g) => (
                        <div
                          key={g.id}
                          onClick={() => onOpenGallery(g.id)}
                          className="cursor-pointer group flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/60 transition-colors"
                        >
                          <img
                            src={g.coverPhoto}
                            alt={g.title}
                            className="w-14 h-14 rounded-lg object-cover shrink-0"
                          />
                          <div className="space-y-0.5 overflow-hidden">
                            <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-700 truncate">
                              {g.title}
                            </h4>
                            <p className="text-[11px] text-slate-500">{g.date} • {g.photoCount} fotos</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
