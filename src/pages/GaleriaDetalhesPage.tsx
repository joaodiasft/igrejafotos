import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Camera, 
  Share2, 
  Download, 
  CheckSquare, 
  Check, 
  ChevronDown, 
  Sparkles,
  Info
} from 'lucide-react';
import { Gallery, Photo } from '../types';
import { PhotoCard } from '../components/PhotoCard';
import { Lightbox } from '../components/Lightbox';
import { AlbumDownloadModal } from '../components/AlbumDownloadModal';
import { SelectionBar } from '../components/SelectionBar';
import { downloadSinglePhoto, shareGalleryWhatsApp } from '../utils/downloader';

interface GaleriaDetalhesPageProps {
  gallery: Gallery;
  photos: Photo[];
  churchName: string;
  onBack: () => void;
}

const PAGE_SIZE = 24;

export const GaleriaDetalhesPage: React.FC<GaleriaDetalhesPageProps> = ({
  gallery,
  photos,
  churchName,
  onBack
}) => {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(new Set());
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [copiedLink, setCopiedLink] = useState(false);

  // Format date in Brazilian style
  const formatDateExtended = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-');
      const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      return `${parseInt(d, 10)} de ${months[parseInt(m, 10) - 1]} de ${y}`;
    } catch {
      return dateStr;
    }
  };

  const visiblePhotos = useMemo(() => {
    return photos.slice(0, visibleCount);
  }, [photos, visibleCount]);

  const selectedPhotosList = useMemo(() => {
    return photos.filter(p => selectedPhotoIds.has(p.id));
  }, [photos, selectedPhotoIds]);

  const handleToggleSelect = (photoId: string) => {
    setSelectedPhotoIds(prev => {
      const next = new Set(prev);
      if (next.has(photoId)) {
        next.delete(photoId);
      } else {
        next.add(photoId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedPhotoIds(new Set(photos.map(p => p.id)));
  };

  const handleDeselectAll = () => {
    setSelectedPhotoIds(new Set());
  };

  const handleQuickDownload = async (photo: Photo, e: React.MouseEvent) => {
    e.stopPropagation();
    await downloadSinglePhoto(photo, gallery.title);
  };

  const handleShareWhatsApp = () => {
    shareGalleryWhatsApp(gallery.title, formatDateExtended(gallery.date), churchName);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="py-6 sm:py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Navigation & Header Info */}
        <div className="space-y-4">
          <button
            id="btn-back-to-galerias"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-blue-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para todas as galerias</span>
          </button>

          {/* Gallery Meta Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold uppercase tracking-wider">
                {gallery.categoryName}
              </span>
              {gallery.ministryName && (
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  {gallery.ministryName}
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold flex items-center gap-1">
                <Camera className="w-3.5 h-3.5" />
                <span>{photos.length} fotos disponíveis</span>
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading leading-tight">
                {gallery.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-500 pt-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>{formatDateExtended(gallery.date)}</span>
                </div>
                {gallery.time && (
                  <div className="flex items-center gap-1 text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{gallery.time}</span>
                  </div>
                )}
                {gallery.location && (
                  <div className="flex items-center gap-1 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{gallery.location}</span>
                  </div>
                )}
              </div>

              {gallery.description && (
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-2 max-w-3xl">
                  {gallery.description}
                </p>
              )}
            </div>

            {/* Action Buttons Toolbar */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Select Mode Toggle */}
              <button
                id="btn-toggle-select-mode"
                onClick={() => {
                  setIsSelectionMode(!isSelectionMode);
                  if (isSelectionMode) setSelectedPhotoIds(new Set());
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all min-h-[42px] ${
                  isSelectionMode
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>{isSelectionMode ? 'Modo de Seleção Ativo' : 'Selecionar Fotos'}</span>
              </button>

              {/* Download Full Album */}
              <button
                id="btn-open-album-download"
                onClick={() => setIsAlbumModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-all min-h-[42px]"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>Baixar Álbum Completo</span>
              </button>

              {/* Share WhatsApp */}
              <button
                id="btn-share-whatsapp"
                onClick={handleShareWhatsApp}
                className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all min-h-[42px]"
                title="Compartilhar galeria no WhatsApp"
              >
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </button>

              {/* Copy Link */}
              <button
                id="btn-copy-gallery-link"
                onClick={handleCopyLink}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors min-h-[42px]"
              >
                {copiedLink ? (
                  <span className="text-emerald-600 flex items-center gap-1 font-bold">
                    <Check className="w-4 h-4" /> Link Copiado!
                  </span>
                ) : (
                  <span>Copiar Link</span>
                )}
              </button>
            </div>

            {/* Helpful instructions banner */}
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-blue-50/70 text-blue-900 px-3.5 py-2.5 rounded-xl">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Toque em qualquer foto para abrir em tela cheia e baixar o arquivo original de alta definição sem marca d'água.
              </span>
            </div>

          </div>
        </div>

        {/* PHOTO GRID */}
        {/* Mobile: 2 cols | Tablet: 3 cols | Desktop: 4 cols */}
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Exibindo <strong>{visiblePhotos.length}</strong> de <strong>{photos.length}</strong> fotos
            </span>
            {isSelectionMode && (
              <span className="text-blue-600 font-semibold">
                Toque nas fotos para marcar
              </span>
            )}
          </div>

          <div 
            id="gallery-photos-grid"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4"
          >
            {visiblePhotos.map((photo, idx) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                watermarkEnabled={gallery.watermarkEnabled}
                isSelectionMode={isSelectionMode}
                isSelected={selectedPhotoIds.has(photo.id)}
                onToggleSelect={handleToggleSelect}
                onOpenLightbox={() => setLightboxIndex(idx)}
                onQuickDownload={handleQuickDownload}
              />
            ))}
          </div>

          {/* Load More Button if more photos exist */}
          {visibleCount < photos.length && (
            <div className="pt-4 pb-8 text-center">
              <button
                id="btn-load-more-photos"
                onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                className="px-8 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-sm shadow-xs hover:bg-slate-50 active:scale-95 transition-all inline-flex items-center gap-2"
              >
                <span>Carregar mais fotos ({photos.length - visibleCount} restantes)</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Lightbox Viewer */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          galleryTitle={gallery.title}
          watermarkEnabled={gallery.watermarkEnabled}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        />
      )}

      {/* Album Download Modal */}
      <AlbumDownloadModal
        isOpen={isAlbumModalOpen}
        galleryTitle={gallery.title}
        galleryId={gallery.id}
        photos={photos}
        onClose={() => setIsAlbumModalOpen(false)}
      />

      {/* Bottom Floating Bar when in Selection Mode */}
      {isSelectionMode && (
        <SelectionBar
          selectedPhotos={selectedPhotosList}
          totalPhotosCount={photos.length}
          galleryId={gallery.id}
          galleryTitle={gallery.title}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onCancelMode={() => {
            setIsSelectionMode(false);
            setSelectedPhotoIds(new Set());
          }}
        />
      )}
    </div>
  );
};
