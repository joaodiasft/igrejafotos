import React, { useState } from 'react';
import { Download, X, CheckSquare, Square, Loader2 } from 'lucide-react';
import { Photo } from '../types';
import { downloadPhotosAsZip } from '../utils/downloader';

interface SelectionBarProps {
  selectedPhotos: Photo[];
  totalPhotosCount: number;
  galleryId: string;
  galleryTitle: string;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onCancelMode: () => void;
}

export const SelectionBar: React.FC<SelectionBarProps> = ({
  selectedPhotos,
  totalPhotosCount,
  galleryId,
  galleryTitle,
  onSelectAll,
  onDeselectAll,
  onCancelMode
}) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const count = selectedPhotos.length;
  const isAllSelected = count === totalPhotosCount && count > 0;

  const handleDownloadSelected = async () => {
    if (count === 0 || downloading) return;
    setDownloading(true);
    setProgress(0);

    try {
      const zipSlug = `AD_BARRAVENTO_${galleryTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${count}_fotos`;
      await downloadPhotosAsZip(
        selectedPhotos,
        zipSlug,
        galleryId,
        (percent) => setProgress(percent)
      );
    } catch (err) {
      console.error('Error downloading selected photos:', err);
    } finally {
      setDownloading(false);
      onCancelMode();
    }
  };

  return (
    <div 
      id="selection-bar"
      className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 text-white border-t border-slate-800 backdrop-blur-md px-4 py-3 sm:py-4 shadow-2xl animate-in slide-in-from-bottom duration-200"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left Info & Select all */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              {count}
            </span>
            <span className="text-sm font-semibold">
              {count === 1 ? '1 foto selecionada' : `${count} fotos selecionadas`}
            </span>
          </div>

          <button
            type="button"
            onClick={isAllSelected ? onDeselectAll : onSelectAll}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1.5 font-medium px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {isAllSelected ? (
              <>
                <Square className="w-3.5 h-3.5" />
                <span>Desmarcar todas</span>
              </>
            ) : (
              <>
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Marcar todas ({totalPhotosCount})</span>
              </>
            )}
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onCancelMode}
            disabled={downloading}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
          >
            <X className="w-4 h-4" />
            <span>Cancelar</span>
          </button>

          <button
            id="btn-download-selected-zip"
            type="button"
            disabled={count === 0 || downloading}
            onClick={handleDownloadSelected}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-blue-300" />
                <span>Compactando ({progress}%)...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>BAIXAR {count} FOTOS (ZIP)</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
