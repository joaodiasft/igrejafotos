import React from 'react';
import { 
  Instagram, 
  Youtube, 
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
}

export const Footer: React.FC<FooterProps> = ({ 
  settings, 
  onNavigate,
  onOpenPrivacyModal
}) => {
  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-300 pt-14 pb-10 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand & Slogan */}
          <div className="space-y-4">
            <Logo variant="dark" size="md" />
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              {settings.subtitle}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                id="footer-instagram-link"
                href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-gradient-to-tr hover:from-amber-600 hover:via-pink-600 hover:to-purple-600 flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-sm"
                aria-label="Instagram da AD Barravento"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                id="footer-youtube-link"
                href={settings.youtube}
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-red-600 flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-sm"
                aria-label="Canal do YouTube da AD Barravento"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                id="footer-whatsapp-link"
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-emerald-600 flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-sm"
                aria-label="WhatsApp da Igreja"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Col 2: Menu Rápido */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 font-heading">
              Menu Rápido
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  id="footer-link-home"
                  onClick={() => onNavigate('home')} 
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  Página Inicial
                </button>
              </li>
              <li>
                <button 
                  id="footer-link-galerias"
                  onClick={() => onNavigate('galerias')} 
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  Galerias de Fotos
                </button>
              </li>
              <li>
                <button 
                  id="footer-link-videos"
                  onClick={() => onNavigate('videos')} 
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  Vídeos e Transmissões
                </button>
              </li>
              <li>
                <button 
                  id="footer-link-agenda"
                  onClick={() => onNavigate('agenda')} 
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  Agenda de Cultos & Eventos
                </button>
              </li>
              <li>
                <button 
                  id="footer-link-ministerios"
                  onClick={() => onNavigate('ministerios')} 
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  Nossos Ministérios
                </button>
              </li>
              <li>
                <button 
                  id="footer-link-sobre"
                  onClick={() => onNavigate('sobre')} 
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  Sobre Nós & Fé
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Horários dos Cultos */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 font-heading flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Horários de Reunião
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="border-l-2 border-blue-500 pl-3 py-0.5">
                <p className="font-semibold text-white">Domingos</p>
                <p className="text-slate-400">09h00: Escola Bíblica Dominical</p>
                <p className="text-slate-400">19h00: Culto de Celebração & Família</p>
              </div>
              <div className="border-l-2 border-indigo-500 pl-3 py-0.5">
                <p className="font-semibold text-white">Quartas-feiras</p>
                <p className="text-slate-400">19h30: Culto de Doutrina e Ensino</p>
              </div>
              <div className="border-l-2 border-violet-500 pl-3 py-0.5">
                <p className="font-semibold text-white">Sábados</p>
                <p className="text-slate-400">19h00: Rede Jovem Conexão</p>
              </div>
            </div>
          </div>

          {/* Col 4: Localização e Contato */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 font-heading flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              Onde Estamos
            </h3>
            <address className="not-italic text-sm text-slate-400 space-y-2">
              <p className="text-white font-medium">{settings.churchName}</p>
              <p>{settings.address}</p>
              <p>{settings.neighborhood} • {settings.city}</p>
              <div className="pt-2 text-xs">
                <p className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  {settings.phone}
                </p>
              </div>
              <div className="pt-3">
                <button
                  id="footer-open-map-btn"
                  onClick={() => onNavigate('contato')}
                  className="text-xs text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 font-semibold"
                >
                  Ver rotas no mapa <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </address>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Igreja AD Barravento. Todos os direitos reservados.</p>
          
          <div className="flex items-center gap-4">
            <button 
              id="footer-privacy-link"
              onClick={onOpenPrivacyModal}
              className="hover:text-slate-300 transition-colors underline-offset-4 hover:underline"
            >
              Política de Privacidade & Direitos de Imagem
            </button>
            <span>•</span>
            <button 
              id="footer-admin-login-link"
              onClick={() => onNavigate('admin')}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              Acesso Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
