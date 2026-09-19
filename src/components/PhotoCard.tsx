import React, { useState } from 'react';
import { Download, Check, Eye } from 'lucide-react';
import { Photo } from '../types';

interface PhotoCardProps {
  photo: Photo;
  watermarkEnabled?: boolean;
  watermarkText?: string;
  isSelectionMode: boolean;
  isSelected: boolean;
  onToggleSelect: (photoId: string) => void;
  onOpenLightbox: (photo: Photo) => void;
  onQuickDownload: (photo: Photo, e: React.MouseEvent) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  watermarkEnabled = true,
  watermarkText = 'AD BARRAVENTO',
  isSelectionMode,
  isSelected,
  onToggleSelect,
  onOpenLightbox,
  onQuickDownload
}) => {
  const [loaded, setLoaded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (isSelectionMode) {
      e.stopPropagation();
      onToggleSelect(photo.id);
    } else {
      onOpenLightbox(photo);
    }
  };

  return (
    <div
      id={`photo-item-${photo.id}`}
      onClick={handleClick}
      className={`group relative aspect-[3/2] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-200 cursor-pointer select-none transition-all duration-200 ${
        isSelected 
          ? 'ring-4 ring-blue-600 ring-offset-2 scale-[0.98]' 
          : 'hover:shadow-md'
      }`}
    >
      {/* Skeleton loader */}
      {!loaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
          <span className="text-xs text-slate-400 font-medium">Carregando...</span>
        </div>
      )}

      {/* Image thumbnail */}
      <img
        src={photo.thumbnailUrl}
        alt={photo.caption || photo.filename}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover object-center transition-all duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${isSelected ? 'brightness-90' : 'group-hover:scale-102'}`}
      />

      {/* Watermark Overlay (Only on visual preview, NOT on downloaded file!) */}
      {watermarkEnabled && loaded && (
        <div className="absolute inset-0 watermark-overlay pointer-events-none flex flex-col justify-end p-2 sm:p-3">
          <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-90 transition-opacity">
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-white/90 uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-heading">
              {watermarkText}
            </span>
          </div>
        </div>
      )}

      {/* Selection Mode Checkbox */}
      {isSelectionMode ? (
        <div 
          className="absolute top-2 left-2 z-20"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(photo.id);
          }}
        >
          <div
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all shadow-md ${
              isSelected
                ? 'bg-blue-600 text-white ring-2 ring-white'
                : 'bg-black/50 text-transparent border-2 border-white/80 backdrop-blur-xs hover:border-white'
            }`}
          >
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
        </div>
      ) : (
        /* Normal Mode Overlay on hover / touch */
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-3 pointer-events-none">
          <span className="p-2 rounded-lg bg-black/60 backdrop-blur-xs text-white">
            <Eye className="w-4 h-4" />
          </span>

          <button
            id={`btn-quick-download-${photo.id}`}
            type="button"
            onClick={(e) => onQuickDownload(photo, e)}
            className="pointer-events-auto p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95 transition-transform"
            title="Baixar foto original"
            aria-label="Baixar foto original"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Selection indicator pill */}
      {isSelected && (
        <div className="absolute inset-0 bg-blue-600/15 pointer-events-none" />
      )}
    </div>
  );
};
