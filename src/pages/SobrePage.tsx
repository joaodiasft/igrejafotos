import React from 'react';
import { 
  Heart, 
  Compass, 
  Eye, 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle, 
  Instagram, 
  Youtube, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { SiteSettings } from '../types';

interface SobrePageProps {
  settings: SiteSettings;
}

export const SobrePage: React.FC<SobrePageProps> = ({ settings }) => {
  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider font-heading">
            Nossa História & Propósito
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading">
            Conheça a {settings.churchName}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Uma família de fé comprometida com a pregação genuína do Evangelho de Jesus Cristo, discipulado bíblico e amor ao próximo.
          </p>
        </div>

        {/* History Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-heading">
              Nossa História
            </h2>
          </div>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Fundada com a missão de anunciar as boas novas da salvação, a Assembleia de Deus no Barravento tem sido um farol de esperança, restauração de famílias e acolhimento em nossa cidade. Através dos anos, testemunhamos incontáveis vidas transformadas pelo poder do Espírito Santo.
          </p>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Com cultos vibrantes, ensino bíblico aprofundado e ministérios dinâmicos para crianças, jovens, mulheres e homens, nossa igreja mantém viva a chama do avivamento genuíno, acolhendo cada visitante de braços abertos.
          </p>
        </div>

        {/* Mission, Vision, Values Triad */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              Nossa Missão
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Pregar o Evangelho integral de Cristo, promovendo o arrependimento, o batismo e o crescimento espiritual através da sã doutrina e comunhão cristã.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              Nossa Visão
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Ser uma igreja relevante, acolhedora e frutífera, que inspira fé nas próximas gerações e transforma comunidades através do amor de Deus.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              Nossos Valores
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Fidelidade bíblica, oração incessante, adoração sincera, integridade moral, amor fraternal, serviço desinteressado e comunhão familiar.
            </p>
          </div>
        </div>

        {/* Cultos e Horários */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold font-heading">
              Horários de Nossos Cultos
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(settings.cultSchedule || []).map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                  {item.day}
                </span>
                <h4 className="text-base font-bold text-white">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  {item.time}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>{settings.address}</span>
            </div>

            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Fale no WhatsApp da Igreja</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
