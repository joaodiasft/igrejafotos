import React from 'react';
import {
  MapPin,
  MessageCircle,
  Instagram,
  Clock
} from 'lucide-react';
import { SiteSettings } from '../types';

interface ContatoPageProps {
  settings: SiteSettings;
  onOpenWhatsApp?: () => void;
}

const mapsQuery = 'Rua José Percival de Almeida, 69, Residencial Barravento, Goiânia - GO';
const mapsEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(mapsQuery)}&hl=pt-BR&z=17&output=embed`;
const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;

export const ContatoPage: React.FC<ContatoPageProps> = ({ settings, onOpenWhatsApp }) => {
  return (
    <div className="py-8 sm:py-12 bg-paper min-h-dvh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta">Como chegar</span>
          <h1 className="text-2xl sm:text-4xl font-bold text-ink font-heading">
            Igreja AD Barravento
          </h1>
          <p className="text-sm sm:text-base text-ink/70 max-w-2xl">
            Estamos no Residencial Barravento. Use o mapa para traçar a rota e fale conosco pelo Instagram enquanto o WhatsApp oficial é criado.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blush text-terracotta flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Endereço</h3>
                  <p className="text-sm text-ink/70 leading-relaxed">
                    {settings.address}<br />
                    {settings.neighborhood}<br />
                    {settings.city}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-blush">
                <div className="w-12 h-12 rounded-2xl bg-blush text-terracotta flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-ink uppercase tracking-wider">WhatsApp</h3>
                  <p className="text-sm text-ink/70">Ainda será criado.</p>
                  <button type="button" onClick={onOpenWhatsApp} className="text-xs font-bold text-terracotta hover:underline pt-1">
                    Ver aviso →
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-blush">
                <div className="w-12 h-12 rounded-2xl bg-blush text-terracotta flex items-center justify-center shrink-0">
                  <Instagram className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Instagram</h3>
                  <p className="text-sm text-ink/70">{settings.instagram}</p>
                  <a
                    href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-xs font-bold text-terracotta hover:underline pt-1"
                  >
                    Seguir no Instagram →
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-ink text-white rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-flame" />
                Horários de culto
              </h3>
              <div className="space-y-2 text-sm">
                {(settings.cultSchedule || []).map((item) => (
                  <div key={`${item.day}-${item.title}`} className="flex items-center justify-between py-1 border-b border-white/10 last:border-0 gap-3">
                    <span className="text-blush/80">{item.day} — {item.title}</span>
                    <span className="font-mono text-flame font-bold shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl overflow-hidden border border-blush bg-white">
              <div className="p-4 bg-blush/40 flex items-center justify-between text-xs text-ink/70">
                <span className="font-bold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-terracotta" />
                  Localização no Google Maps
                </span>
                <a href={mapsLink} target="_blank" rel="noreferrer" className="font-semibold text-terracotta hover:underline">
                  Abrir rota →
                </a>
              </div>
              <iframe
                title="Mapa da AD Barravento"
                src={mapsEmbed}
                width="100%"
                height="420"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
