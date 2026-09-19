import React from 'react';
import { Calendar, Clock, MapPin, Plus, ArrowRight, Check } from 'lucide-react';
import { ChurchEvent } from '../types';
import { downloadEventIcs, getGoogleCalendarUrl } from '../utils/calendar';

interface ProximosEventosSectionProps {
  events: ChurchEvent[];
  churchName: string;
  onViewAllAgenda: () => void;
}

export const ProximosEventosSection: React.FC<ProximosEventosSectionProps> = ({
  events,
  churchName,
  onViewAllAgenda
}) => {
  const [addedId, setAddedId] = React.useState<string | null>(null);

  const handleAddCalendar = (event: ChurchEvent) => {
    downloadEventIcs(event, churchName);
    setAddedId(event.id);
    setTimeout(() => setAddedId(null), 3000);
  };

  const displayEvents = events.slice(0, 4);

  return (
    <section id="proximos-eventos-section" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-heading">
              Programação da Igreja
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Próximos Cultos & Eventos
            </h2>
          </div>

          <button
            id="btn-ver-agenda-completa"
            onClick={onViewAllAgenda}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 group self-start sm:self-auto"
          >
            <span>Ver agenda completa</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {displayEvents.map((event) => {
            const isAdded = addedId === event.id;
            return (
              <div
                key={event.id}
                id={`event-card-${event.id}`}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                {/* Date Badge */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
                    <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-blue-200">
                      {event.month}
                    </span>
                    <span className="text-xl sm:text-2xl font-black font-heading leading-none my-0.5">
                      {event.dayNumber}
                    </span>
                    <span className="text-[9px] font-bold tracking-widest text-blue-100 uppercase">
                      {event.dayOfWeek}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                        {event.category}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading leading-tight">
                      {event.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        {event.time}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[180px]">{event.location}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Calendar Action */}
                <div className="w-full sm:w-auto flex sm:flex-col gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    id={`btn-add-cal-${event.id}`}
                    onClick={() => handleAddCalendar(event)}
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all min-h-[42px] ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white'
                    }`}
                    title="Baixar lembrete de calendário (.ics)"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Adicionado!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Lembrar (.ics)</span>
                      </>
                    )}
                  </button>

                  <a
                    href={getGoogleCalendarUrl(event, churchName)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-3 py-2 rounded-xl text-[11px] font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors text-center"
                  >
                    Google Agenda
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
