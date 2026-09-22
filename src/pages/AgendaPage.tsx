import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { ChurchEvent, SiteSettings } from '../types';

interface AgendaPageProps {
  events: ChurchEvent[];
  settings: SiteSettings;
}

export const AgendaPage: React.FC<AgendaPageProps> = ({ events, settings }) => {
  const weekly = settings.cultSchedule || [];
  const specials = events.filter((event) =>
    !weekly.some((item) => item.title === event.title)
  );

  return (
    <div className="py-8 sm:py-12 bg-paper min-h-dvh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blush text-terracotta">
              <Calendar className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
              Programação semanal
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-ink font-heading">
            Agenda da igreja
          </h1>
          <p className="text-sm sm:text-base text-ink/70 max-w-2xl">
            Cultos e encontros da AD Barravento. Venha participar com a gente.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {weekly.map((item) => (
            <article
              key={`${item.day}-${item.title}`}
              className="rounded-3xl border border-blush bg-white p-6 space-y-3"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-terracotta">{item.day}</p>
              <h2 className="text-xl font-heading font-bold text-ink">{item.title}</h2>
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Clock className="w-4 h-4 text-flame" />
                {item.time === '—' ? 'Horário a confirmar' : item.time}
              </p>
              {item.description && <p className="text-sm text-ink/65">{item.description}</p>}
              <p className="flex items-center gap-1.5 text-xs text-ink/50">
                <MapPin className="w-3.5 h-3.5" />
                {settings.address}
              </p>
            </article>
          ))}
        </div>

        {specials.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-bold text-ink">Outros encontros</h2>
            {specials.map((event) => (
              <div key={event.id} className="rounded-2xl border border-blush bg-white p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-flame text-white flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold uppercase">{event.month}</span>
                  <span className="text-xl font-black leading-none">{event.dayNumber}</span>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-ink">{event.title}</h3>
                  <p className="text-sm text-ink/60">{event.time} • {event.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
