import React from 'react';
import {
  Heart,
  Compass,
  Eye,
  MapPin,
  Clock,
  Instagram,
  BookOpen,
  Timer
} from 'lucide-react';
import { SiteSettings } from '../types';

interface SobrePageProps {
  settings: SiteSettings;
  onOpenWhatsApp?: () => void;
}

export const SobrePage: React.FC<SobrePageProps> = ({ settings, onOpenWhatsApp }) => {
  return (
    <div className="py-8 sm:py-12 bg-paper min-h-dvh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-blush text-terracotta text-xs font-bold uppercase tracking-wider">
            Nossa casa
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-ink font-heading">
            Assembleia de Deus Barravento
          </h1>
          <p className="text-sm sm:text-base text-ink/70 leading-relaxed">
            Uma família de fé no Residencial Barravento. Cultivamos comunhão, ensino da Palavra e um lugar onde cada pessoa é bem-vinda.
          </p>
        </div>

        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-night text-white flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-12 h-12 rounded-2xl bg-flame/30 text-flame flex items-center justify-center shrink-0">
            <Timer className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-heading font-bold">As fotos ficam no ar por 1 mês</h2>
            <p className="text-sm text-blush/90 leading-relaxed">
              Cada galeria permanece publicada por cerca de 30 dias. Depois desse período as fotos saem do portal para preservar a memória recente da igreja e o espaço das novas celebrações. Se quiser guardar alguma imagem, faça o download enquanto a galeria estiver disponível.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-blush shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blush text-terracotta">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-ink font-heading">Quem somos</h2>
          </div>
          <p className="text-ink/70 leading-relaxed text-sm sm:text-base">
            {settings.historyText}
          </p>
          <p className="text-ink/70 leading-relaxed text-sm sm:text-base">
            Da Escola Bíblica no domingo de manhã à Santa Ceia no primeiro domingo do mês, a AD Barravento vive a fé no cotidiano: discipulado, ensino, oração e celebração. Os departamentos de Jovens, Casais, Kids, Homens e Mulheres cuidam de cada geração da casa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Compass, title: 'Missão', text: settings.missionText },
            { icon: Eye, title: 'Visão', text: settings.visionText },
            { icon: Heart, title: 'Valores', text: settings.valuesText },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-3xl p-6 sm:p-8 border border-blush space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blush text-terracotta flex items-center justify-center">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-ink font-heading">{item.title}</h3>
              <p className="text-sm text-ink/70 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-ink text-white rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-flame" />
            <h2 className="text-2xl font-bold font-heading">Horários dos cultos</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(settings.cultSchedule || []).map((item) => (
              <div key={`${item.day}-${item.title}`} className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
                <span className="text-xs font-bold text-flame uppercase tracking-wider">{item.day}</span>
                <h4 className="text-base font-bold text-white">{item.title}</h4>
                <p className="text-xs text-blush/70">{item.time}</p>
                {item.description && <p className="text-xs text-blush/60">{item.description}</p>}
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-sm text-blush/80">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-flame" />
              <span>{settings.address} — {settings.neighborhood}</span>
            </div>
            <div className="flex gap-2">
              <a
                href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-terracotta hover:bg-flame text-white font-bold flex items-center gap-1.5 min-h-11"
              >
                <Instagram className="w-4 h-4" />
                {settings.instagram}
              </a>
              <button
                type="button"
                onClick={onOpenWhatsApp}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold min-h-11"
              >
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
