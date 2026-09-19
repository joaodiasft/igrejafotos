import { ChurchEvent } from '../types';

/**
 * Generates and downloads an iCalendar (.ics) file for mobile and desktop calendar apps
 */
export function downloadEventIcs(event: ChurchEvent, churchName: string) {
  // Parse date and time
  const [year, month, day] = event.date.split('-').map(Number);
  const [hours, minutes] = (event.time || '19:00').split(':').map(Number);

  const startDate = new Date(year, month - 1, day, hours, minutes);
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration

  const formatIcsDate = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AD Barravento//Agenda//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:event-${event.id}-${Date.now()}@adbarravento.com.br`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:${event.title} - ${churchName}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/**
 * Creates a Google Calendar URL for one-click add
 */
export function getGoogleCalendarUrl(event: ChurchEvent, churchName: string): string {
  const [year, month, day] = event.date.split('-').map(Number);
  const [hours, minutes] = (event.time || '19:00').split(':').map(Number);

  const startDate = new Date(year, month - 1, day, hours, minutes);
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  const formatGDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${event.title} - ${churchName}`,
    dates: `${formatGDate(startDate)}/${formatGDate(endDate)}`,
    details: event.description,
    location: event.location
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
