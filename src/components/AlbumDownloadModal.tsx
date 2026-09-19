import React, { useState } from 'react';
import { Download, X, AlertCircle, CheckCircle2, FileArchive } from 'lucide-react';
import { Photo } from '../types';
import { downloadPhotosAsZip } from '../utils/downloader';

interface AlbumDownloadModalProps {
  isOpen: boolean;
  galleryTitle: string;
  galleryId: string;
  photos: Photo[];
  onClose: () => void;
}

export const AlbumDownloadModal: React.FC<AlbumDownloadModalProps> = ({
  isOpen,
  galleryTitle,
  galleryId,
  photos,
  onClose
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressDetails, setProgressDetails] = useState({ current: 0, total: photos.length });
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  // Calculate approximate size in MB
  const totalSizeBytes = photos.reduce((acc, p) => acc + (p.fileSize || 3200000), 0);
  const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(0);

  const handleStartDownload = async () => {
    setIsProcessing(true);
    setProgress(0);
    setIsDone(false);

    try {
      const zipSlug = `AD_BARRAVENTO_${galleryTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_completo`;
      await downloadPhotosAsZip(
        photos,
        zipSlug,
        galleryId,
        (percent, current, total) => {
          setProgress(percent);
          setProgressDetails({ current, total });
        }
      );
      setIsDone(true);
      setTimeout(() => {
        setIsProcessing(false);
        setIsDone(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error generating album zip:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div 
      id="album-download-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={() => !isProcessing && onClose()}
    >
      <div 
        id="album-download-modal-box"
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
              <FileArchive className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Baixar Álbum Completo
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-[220px]">
                {galleryTitle}
              </p>
            </div>
          </div>

          {!isProcessing && (
            <button
              id="close-album-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content & Stats */}
        {!isProcessing && !isDone && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Total de fotos:</span>
                <span className="font-bold text-slate-900">{photos.length} fotos</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Tamanho aproximado:</span>
                <span className="font-bold text-slate-900">~{totalSizeMB} MB</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Qualidade:</span>
                <span className="font-bold text-emerald-600">Original sem marca d'água</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-500 bg-amber-50/70 text-amber-800 p-3 rounded-xl border border-amber-200/60">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                As fotografias serão compactadas em um único arquivo ZIP pronto para o seu celular ou computador.
              </span>
            </div>

            <div className="text-center pt-2">
              <p className="text-sm font-medium text-slate-700">
                Deseja iniciar o download agora?
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>

              <button
                id="btn-confirm-album-download"
                type="button"
                onClick={handleStartDownload}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>BAIXAR ÁLBUM</span>
              </button>
            </div>
          </div>
        )}

        {/* Processing / Progress State */}
        {isProcessing && !isDone && (
          <div className="space-y-5 py-4 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center animate-spin">
              <FileArchive className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">
                Gerando pacote ZIP...
              </h4>
              <p className="text-xs text-slate-500">
                Processando {progressDetails.current} de {progressDetails.total} fotos ({progress}%)
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-xs text-slate-400">
              Por favor, não feche esta tela enquanto o arquivo é gerado.
            </p>
          </div>
        )}

        {/* Done State */}
        {isDone && (
          <div className="space-y-4 py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              Download Iniciado com Sucesso!
            </h4>
            <p className="text-xs text-slate-500">
              O arquivo ZIP contendo todas as {photos.length} fotos originais já está sendo salvo no seu aparelho.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
