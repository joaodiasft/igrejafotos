import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, Check, ExternalLink, Sparkles } from 'lucide-react';
import { ChurchEvent } from '../types';
import { downloadEventIcs, getGoogleCalendarUrl } from '../utils/calendar';

interface AgendaPageProps {
  events: ChurchEvent[];
  churchName: string;
}

export const AgendaPage: React.FC<AgendaPageProps> = ({ events, churchName }) => {
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Cultos', 'Jovens', 'Mulheres', 'Santa Ceia', 'Eventos', 'Escola Bíblica'];

  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter(e => e.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const handleAddCalendar = (event: ChurchEvent) => {
    downloadEventIcs(event, churchName);
    setAddedId(event.id);
    setTimeout(() => setAddedId(null), 3000);
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <Calendar className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Programação da Igreja
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Agenda de Cultos & Eventos
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            Programe-se para estar conosco em comunhão. Toque em "Adicionar à Agenda" para salvar o lembrete automaticamente no seu celular.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors min-h-[38px] ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'all' ? 'Todos os Eventos' : cat}
            </button>
          ))}
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event) => {
            const isAdded = addedId === event.id;
            return (
              <div
                key={event.id}
                id={`agenda-item-${event.id}`}
                className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Left: Date Badge + Info */}
                <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1">
                  <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white flex flex-col items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-200">
                      {event.month}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black font-heading leading-none my-0.5">
                      {event.dayNumber}
                    </span>
                    <span className="text-[9px] font-bold tracking-widest text-blue-100 uppercase">
                      {event.dayOfWeek}
                    </span>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 uppercase">
                        {event.category}
                      </span>
                      {event.featured && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Destaque
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-heading leading-tight">
                      {event.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-500">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <Clock className="w-4 h-4 text-blue-600" />
                        {event.time}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{event.location}</span>
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="w-full md:w-auto flex flex-row md:flex-col gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => handleAddCalendar(event)}
                    className={`flex-1 md:flex-none px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all min-h-[44px] ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Adicionado!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Adicionar à Agenda (.ics)</span>
                      </>
                    )}
                  </button>

                  <a
                    href={getGoogleCalendarUrl(event, churchName)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold text-center flex items-center justify-center gap-1.5 min-h-[44px]"
                  >
                    <span>Google Agenda</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
