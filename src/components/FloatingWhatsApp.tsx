import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  whatsappNumber: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ whatsappNumber }) => {
  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  const message = encodeURIComponent('Olá, paz do Senhor! Vim pelo site da AD Barravento e gostaria de tirar uma dúvida ou pedir oração.');
  const waUrl = `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <a
      id="floating-whatsapp-btn"
      href={waUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com a Igreja pelo WhatsApp"
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-lg shadow-emerald-950/20 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
    >
      <div className="relative">
        <MessageCircle className="w-5 h-5 sm:w-5 sm:h-5 fill-current" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping opacity-75"></span>
      </div>
      <span className="text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap">
        Falar com a Igreja
      </span>
    </a>
  );
};
