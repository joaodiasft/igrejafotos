import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  onOpenNotice: () => void;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ onOpenNotice }) => {
  return (
    <button
      id="floating-whatsapp-btn"
      type="button"
      onClick={onOpenNotice}
      aria-label="WhatsApp da igreja (em breve)"
      className="group fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2.5 bg-gradient-flame text-white pl-3.5 pr-4 py-3 sm:py-3.5 rounded-full shadow-warm animate-pulse-ring transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 min-h-[52px]"
    >
      <MessageCircle className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
      <span className="text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap">
        Falar com a Igreja
      </span>
    </button>
  );
};
