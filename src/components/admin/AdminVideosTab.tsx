import React, { useState } from 'react';
import { Plus, Trash2, Video as VideoIcon, Play, X } from 'lucide-react';
import { VideoItem } from '../../types';
import { DatabaseService } from '../../services/db';

interface AdminVideosTabProps {
  videos: VideoItem[];
  onRefresh: () => void;
}

export const AdminVideosTab: React.FC<AdminVideosTabProps> = ({ videos, onRefresh }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [eventName, setEventName] = useState('Culto de Celebração');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('1:15:30');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    // Extract ID if full youtube link was pasted
    let cleanId = youtubeId.trim();
    if (cleanId.includes('v=')) {
      cleanId = cleanId.split('v=')[1].split('&')[0];
    } else if (cleanId.includes('youtu.be/')) {
      cleanId = cleanId.split('youtu.be/')[1].split('?')[0];
    }

    await DatabaseService.addVideo({
      title,
      youtubeId: cleanId,
      youtubeUrl: `https://www.youtube.com/watch?v=${cleanId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${cleanId}/maxresdefault.jpg`,
      eventName,
      date: new Date().toISOString().slice(0, 10),
      description,
      duration,
      featured: false
    });

    setIsCreating(false);
    setTitle('');
    setYoutubeId('');
    setDescription('');
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Excluir este vídeo?')) {
      await DatabaseService.deleteVideo(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            Gerenciador de Vídeos & Transmissões
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Adicione links do YouTube de cultos ao vivo, pregações e retrospectivas.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>ADICIONAR VÍDEO</span>
        </button>
      </div>

      {/* Videos List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((vid) => (
          <div
            key={vid.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col justify-between"
          >
            <div className="relative aspect-video bg-black">
              <img
                src={vid.thumbnailUrl}
                alt={vid.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono">
                {vid.duration}
              </span>
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase">
                  {vid.eventName}
                </span>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                  {vid.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {vid.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  ID: {vid.youtubeId}
                </span>
                <button
                  onClick={() => handleDelete(vid.id)}
                  className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Novo Vídeo do YouTube</h3>
              <button onClick={() => setIsCreating(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Título do Vídeo</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Culto da Vitória - Pr. Lucas"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Link ou ID do YouTube</label>
                <input
                  type="text"
                  required
                  value={youtubeId}
                  onChange={(e) => setYoutubeId(e.target.value)}
                  placeholder="Ex: https://youtube.com/watch?v=dQw4w9WgXcQ ou dQw4w9WgXcQ"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nome do Evento / Culto</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Culto de Domingo"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Duração (Ex: 1:30:00)</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
