import React from 'react';
import { MessageCircle, X, Instagram, Clock } from 'lucide-react';

interface WhatsAppComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  instagram: string;
}

export const WhatsAppComingSoonModal: React.FC<WhatsAppComingSoonModalProps> = ({
  isOpen,
  onClose,
  instagram,
}) => {
  if (!isOpen) return null;
  const handle = instagram.replace('@', '');

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-soon-title"
    >
      <div
        className="bg-paper max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-blush relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-ink/50 hover:bg-blush min-h-11 min-w-11 flex items-center justify-center"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-gradient-flame text-white flex items-center justify-center mb-4">
          <MessageCircle className="w-7 h-7" />
        </div>
        <h2 id="whatsapp-soon-title" className="font-heading text-2xl text-ink">
          WhatsApp em breve
        </h2>
        <p className="mt-3 text-sm text-ink/70 leading-relaxed">
          O número oficial de WhatsApp da AD Barravento ainda será criado. Assim que estiver pronto, ele aparece aqui no portal.
        </p>
        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-blush/60 px-4 py-3 text-sm text-ink/80">
          <Clock className="w-4 h-4 mt-0.5 shrink-0 text-terracotta" />
          <span>Enquanto isso, fale conosco pelo Instagram.</span>
        </div>
        <a
          href={`https://instagram.com/${handle}`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 w-full inline-flex items-center justify-center gap-2 min-h-12 rounded-xl bg-terracotta hover:bg-flame text-white font-bold text-sm"
        >
          <Instagram className="w-4 h-4" />
          Seguir @{handle}
        </a>
      </div>
    </div>
  );
};
