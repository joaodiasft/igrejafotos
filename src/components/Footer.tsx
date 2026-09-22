import React from 'react';
import {
  Instagram,
  MapPin,
  Phone,
  Clock,
  Shield,
  ArrowUpRight
} from 'lucide-react';
import { Logo } from './Logo';
import { SiteSettings } from '../types';
import { NavTab } from './Header';

interface FooterProps {
  settings: SiteSettings;
  onNavigate: (tab: NavTab) => void;
  onOpenPrivacyModal?: () => void;
  onOpenWhatsApp?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenPrivacyModal,
  onOpenWhatsApp
}) => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${settings.address}, ${settings.neighborhood}, ${settings.city}`)}`;

  return (
    <footer id="main-footer" className="relative bg-ink text-cream/75 pt-16 pb-10 overflow-hidden">
      {/* Top hairline gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flame/60 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-flame/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          <div className="space-y-4">
            <Logo variant="dark" size="md" />
            <p className="text-sm text-cream/60 leading-relaxed">
              {settings.subtitle}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-gradient-flame flex items-center justify-center text-cream hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                aria-label="Instagram da AD Barravento"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <button
                type="button"
                onClick={onOpenWhatsApp}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-terracotta flex items-center justify-center text-cream hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                aria-label="WhatsApp da Igreja (em breve)"
              >
                <Phone className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 font-heading">
              Menu rápido
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                ['home', 'Página inicial'],
                ['galerias', 'Galerias de fotos'],
                ['agenda', 'Agenda de cultos'],
                ['ministerios', 'Departamentos'],
                ['sobre', 'Sobre nós'],
                ['contato', 'Como chegar'],
              ].map(([tab, label]) => (
                <li key={tab}>
                  <button
                    onClick={() => onNavigate(tab as NavTab)}
                    className="text-cream/65 hover:text-gold transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 font-heading flex items-center gap-2">
              <Clock className="w-4 h-4 text-flame" />
              Horários
            </h3>
            <div className="space-y-2.5 text-sm">
              {(settings.cultSchedule || []).map((item) => (
                <div key={`${item.day}-${item.title}`} className="border-l-2 border-flame/70 pl-3">
                  <p className="font-semibold text-white">{item.day}</p>
                  <p className="text-cream/60">{item.time !== '—' ? `${item.time}: ` : ''}{item.title}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 font-heading flex items-center gap-2">
              <MapPin className="w-4 h-4 text-flame" />
              Onde estamos
            </h3>
            <address className="not-italic text-sm text-cream/60 space-y-2">
              <p className="text-white font-medium">{settings.churchName}</p>
              <p>{settings.address}</p>
              <p>{settings.neighborhood} • {settings.city}</p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gold hover:text-gold-bright inline-flex items-center gap-1 font-semibold pt-2"
              >
                Ver no Google Maps <ArrowUpRight className="w-3 h-3" />
              </a>
            </address>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/50">
          <p>© 2026 Igreja AD Barravento. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <button onClick={onOpenPrivacyModal} className="hover:text-white underline-offset-4 hover:underline">
              Privacidade e fotos
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('admin')} className="hover:text-white flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
