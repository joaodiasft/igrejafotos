import React, { useState } from 'react';
import { Play, Calendar, Video as VideoIcon, Search, Sparkles } from 'lucide-react';
import { VideoItem } from '../types';
import { VideoModal } from '../components/VideoModal';

interface VideosPageProps {
  videos: VideoItem[];
}

export const VideosPage: React.FC<VideosPageProps> = ({ videos }) => {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = videos.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <VideoIcon className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Mídia & Transmissões
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Vídeos e Mensagens da AD Barravento
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            Assista a ministrações da Palavra, retrospectivas de congressos e momentos especiais de louvor congregacional.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar vídeos por título ou evento..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((video) => (
            <div
              key={video.id}
              id={`video-card-${video.id}`}
              onClick={() => setActiveVideo(video)}
              className="group cursor-pointer bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col active:scale-[0.99]"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Play Button Pill */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600/90 group-hover:bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-200">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                {video.duration && (
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded bg-black/80 text-white text-[11px] font-mono font-bold">
                    {video.duration}
                  </span>
                )}

                {/* Event Name */}
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
                  {video.eventName}
                </span>
              </div>

              {/* Video Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>{video.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-heading leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                  <span>ASSISTIR VÍDEO</span>
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Video Player Modal */}
      <VideoModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </div>
  );
};
