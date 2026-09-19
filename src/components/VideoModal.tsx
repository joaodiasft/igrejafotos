import React from 'react';
import { X, Calendar, Play } from 'lucide-react';
import { VideoItem } from '../types';

interface VideoModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  if (!video) return null;

  return (
    <div 
      id="video-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="video-modal-box"
        className="bg-slate-900 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-800 space-y-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 text-white">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-600/30 text-blue-300 uppercase">
              {video.eventName}
            </span>
            <h3 className="text-base sm:text-xl font-bold font-heading line-clamp-1">
              {video.title}
            </h3>
          </div>

          <button
            id="btn-close-video-modal"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player (Responsive 16:9) */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>

        {/* Footer info */}
        <div className="p-4 sm:p-6 space-y-2 text-slate-300">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              {video.date}
            </span>
            {video.duration && <span>• Duração: {video.duration}</span>}
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {video.description}
          </p>
        </div>

      </div>
    </div>
  );
};
