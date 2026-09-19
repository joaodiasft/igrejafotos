import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Share2, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';
import { Photo } from '../types';
import { downloadSinglePhoto } from '../utils/downloader';

interface LightboxProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  galleryTitle: string;
  watermarkEnabled?: boolean;
  watermarkText?: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  photos,
  currentIndex,
  isOpen,
  galleryTitle,
  watermarkEnabled = true,
  watermarkText = 'AD BARRAVENTO',
  onClose,
  onNavigate
}) => {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const currentPhoto = photos[currentIndex];
  const total = photos.length;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    } else {
      onNavigate(total - 1); // loop
    }
  }, [currentIndex, onNavigate, total]);

  const handleNext = useCallback(() => {
    if (currentIndex < total - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onNavigate(0); // loop
    }
  }, [currentIndex, onNavigate, total]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Touch Swipe Handlers for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const handleDownload = async () => {
    if (!currentPhoto || downloading) return;
    setDownloading(true);
    try {
      await downloadSinglePhoto(currentPhoto, galleryTitle);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${galleryTitle} - AD Barravento`,
      text: `Veja esta foto de ${galleryTitle} na Igreja AD Barravento!`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Fallback to copy
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!isOpen || !currentPhoto) return null;

  return (
    <div 
      id="photo-lightbox-modal"
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between select-none animate-in fade-in duration-200"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent text-white z-20">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs sm:text-sm font-bold font-mono tracking-wider">
            {currentIndex + 1} / {total}
          </span>
          <span className="text-xs sm:text-sm font-medium text-slate-300 truncate max-w-[180px] sm:max-w-md hidden xs:inline">
            {galleryTitle}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Share button */}
          <button
            id="lightbox-share-btn"
            onClick={handleShare}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
            aria-label="Compartilhar foto"
            title="Compartilhar link da foto"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Link Copiado!' : 'Compartilhar'}</span>
          </button>

          {/* Download Original Photo button */}
          <button
            id="lightbox-download-btn"
            onClick={handleDownload}
            disabled={downloading}
            className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-all duration-200 flex items-center gap-2 text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 active:scale-95 disabled:opacity-50"
            title="Baixar foto original sem marca d'água"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Baixando...' : 'Baixar Original'}</span>
          </button>

          {/* Close button */}
          <button
            id="lightbox-close-btn"
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Fechar visualizador"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        {/* Left Nav Arrow (Desktop & Tablet) */}
        <button
          id="lightbox-prev-btn"
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/10 backdrop-blur-xs transition-all active:scale-95 hidden sm:flex items-center justify-center"
          aria-label="Foto anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* The Photo Image with Watermark on Display */}
        <div className="relative max-h-[82vh] max-w-full flex items-center justify-center">
          <img
            ref={imageRef}
            src={currentPhoto.webUrl}
            alt={currentPhoto.caption || currentPhoto.filename}
            className="max-h-[82vh] max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-200"
          />

          {/* Subtle Watermark on Web View */}
          {watermarkEnabled && (
            <div className="absolute bottom-3 right-3 px-3 py-1 rounded-md bg-slate-950/60 backdrop-blur-md border border-white/10 pointer-events-none flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] sm:text-xs font-bold text-white/90 tracking-wider font-heading uppercase">
                {watermarkText}
              </span>
            </div>
          )}
        </div>

        {/* Right Nav Arrow */}
        <button
          id="lightbox-next-btn"
          onClick={handleNext}
          className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/10 backdrop-blur-xs transition-all active:scale-95 hidden sm:flex items-center justify-center"
          aria-label="Próxima foto"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Bar with Swipe Hint and Photo info */}
      <div className="px-4 py-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white z-20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>Foto em alta definição • O download entrega o arquivo original sem marca d'água</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span className="sm:hidden text-[11px]">Deslize para os lados para navegar</span>
          <span className="hidden sm:inline">Use as setas do teclado ← → ou clique para navegar</span>
        </div>
      </div>
    </div>
  );
};
