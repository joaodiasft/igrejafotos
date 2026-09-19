import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  UploadCloud, 
  Camera, 
  Calendar, 
  Check, 
  X, 
  Image as ImageIcon,
  Star,
  FileCheck
} from 'lucide-react';
import { Gallery, Category, Ministry, Photo } from '../../types';
import { DatabaseService } from '../../services/db';

interface AdminGalleriesTabProps {
  galleries: Gallery[];
  categories: Category[];
  ministries: Ministry[];
  onRefresh: () => void;
}

export const AdminGalleriesTab: React.FC<AdminGalleriesTabProps> = ({
  galleries,
  categories,
  ministries,
  onRefresh
}) => {
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedGalleryForPhotos, setSelectedGalleryForPhotos] = useState<Gallery | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<Photo[]>([]);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formMinistryId, setFormMinistryId] = useState('');
  const [formLocation, setFormLocation] = useState('Templo Sede');
  const [formDescription, setFormDescription] = useState('');
  const [formCover, setFormCover] = useState('');
  const [formWatermark, setFormWatermark] = useState(true);

  // Upload Progress State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const openCreateModal = () => {
    setIsCreating(true);
    setEditingGallery(null);
    setFormTitle('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormTime('19:00');
    setFormCategoryId(categories[1]?.id || categories[0]?.id || '');
    setFormMinistryId('');
    setFormLocation('Templo Sede');
    setFormDescription('');
    setFormCover('https://images.unsplash.com/photo-1510590337019-5ef8d3d32116?w=1200&q=80');
    setFormWatermark(true);
  };

  const openEditModal = (gallery: Gallery) => {
    setEditingGallery(gallery);
    setIsCreating(false);
    setFormTitle(gallery.title);
    setFormDate(gallery.date);
    setFormTime(gallery.time || '');
    setFormCategoryId(gallery.categoryId);
    setFormMinistryId(gallery.ministryId || '');
    setFormLocation(gallery.location || 'Templo Sede');
    setFormDescription(gallery.description);
    setFormCover(gallery.coverPhoto);
    setFormWatermark(gallery.watermarkEnabled);
  };

  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find(c => c.id === formCategoryId);
    const min = ministries.find(m => m.id === formMinistryId);

    if (isCreating) {
      DatabaseService.createGallery({
        title: formTitle,
        slug: formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        date: formDate,
        time: formTime,
        categoryId: formCategoryId,
        categoryName: cat?.name || 'Cultos',
        ministryId: formMinistryId || undefined,
        ministryName: min?.name || undefined,
        location: formLocation,
        description: formDescription,
        coverPhoto: formCover,
        watermarkEnabled: formWatermark,
        featured: false,
        status: 'publicada',
        publishedAt: new Date().toISOString()
      });
    } else if (editingGallery) {
      DatabaseService.updateGallery(editingGallery.id, {
        title: formTitle,
        date: formDate,
        time: formTime,
        categoryId: formCategoryId,
        categoryName: cat?.name || 'Cultos',
        ministryId: formMinistryId || undefined,
        ministryName: min?.name || undefined,
        location: formLocation,
        description: formDescription,
        coverPhoto: formCover,
        watermarkEnabled: formWatermark
      });
    }

    setIsCreating(false);
    setEditingGallery(null);
    onRefresh();
  };

  const handleDeleteGallery = (id: string, title: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a galeria "${title}" e todas as suas fotos?`)) {
      DatabaseService.deleteGallery(id);
      onRefresh();
    }
  };

  // Open photo manager for a specific gallery
  const openPhotoManager = (gallery: Gallery) => {
    setSelectedGalleryForPhotos(gallery);
    const photos = DatabaseService.getPhotosByGallery(gallery.id);
    setGalleryPhotos(photos);
  };

  // Upload handler for simulated high-res photo addition
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedGalleryForPhotos || !e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);

    setIsUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      // Create photo entries
      const stockUrls = [
        'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1600&q=85',
        'https://images.unsplash.com/photo-1510590337019-5ef8d3d32116?w=1600&q=85',
        'https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=1600&q=85',
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=85',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&q=85'
      ];

      files.forEach((file, index) => {
        const fallbackUrl = stockUrls[index % stockUrls.length];
        const objUrl = URL.createObjectURL(file);

        DatabaseService.addPhoto({
          galleryId: selectedGalleryForPhotos.id,
          originalUrl: objUrl || fallbackUrl,
          webUrl: objUrl || fallbackUrl,
          thumbnailUrl: objUrl || fallbackUrl,
          filename: file.name,
          fileSize: file.size,
          width: 1920,
          height: 1080
        });
      });

      setIsUploading(false);
      setUploadProgress(0);
      const updated = DatabaseService.getPhotosByGallery(selectedGalleryForPhotos.id);
      setGalleryPhotos(updated);
      onRefresh();
    }, 1200);
  };

  const handleDeletePhoto = (photoId: string) => {
    if (!selectedGalleryForPhotos) return;
    if (window.confirm('Excluir esta foto da galeria?')) {
      DatabaseService.deletePhoto(photoId);
      const updated = DatabaseService.getPhotosByGallery(selectedGalleryForPhotos.id);
      setGalleryPhotos(updated);
      onRefresh();
    }
  };

  const handleSetCover = (photo: Photo) => {
    if (!selectedGalleryForPhotos) return;
    DatabaseService.updateGallery(selectedGalleryForPhotos.id, {
      coverPhoto: photo.webUrl
    });
    alert('Foto definida como capa da galeria com sucesso!');
    onRefresh();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            Gerenciador de Galerias de Fotos
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Crie novos álbuns, adicione fotos em alta qualidade, edite títulos e defina capas.
          </p>
        </div>

        <button
          id="admin-btn-nova-galeria"
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>NOVA GALERIA</span>
        </button>
      </div>

      {/* Galleries Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Capa & Título</th>
                <th className="p-4">Data</th>
                <th className="p-4">Categoria</th>
                <th className="p-4 text-center">Fotos</th>
                <th className="p-4 text-center">Marca D'água</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {galleries.map((gal) => (
                <tr key={gal.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={gal.coverPhoto}
                      alt={gal.title}
                      className="w-14 h-11 object-cover rounded-lg border border-slate-200 shrink-0"
                    />
                    <div className="overflow-hidden">
                      <span className="font-bold text-slate-900 block truncate max-w-xs sm:max-w-sm">
                        {gal.title}
                      </span>
                      <span className="text-xs text-slate-400">
                        {gal.ministryName || gal.location}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs whitespace-nowrap">
                    {gal.date}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                      {gal.categoryName}
                    </span>
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => openPhotoManager(gal)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-xs font-bold transition-colors"
                      title="Gerenciar fotos deste álbum"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{gal.photoCount} fotos</span>
                    </button>
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                    {gal.watermarkEnabled ? (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                        Ativa
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-500">
                        Desativada
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap space-x-2">
                    <button
                      onClick={() => openPhotoManager(gal)}
                      className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      title="Fazer Upload e Gerenciar Fotos"
                    >
                      <UploadCloud className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(gal)}
                      className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                      title="Editar detalhes"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGallery(gal.id, gal.title)}
                      className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                      title="Excluir Galeria"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {(isCreating || editingGallery) && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                {isCreating ? 'Cadastrar Nova Galeria' : 'Editar Galeria'}
              </h3>
              <button
                onClick={() => { setIsCreating(false); setEditingGallery(null); }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Título do Culto / Evento</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ex: Culto de Celebração e Milagres"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Data do Evento</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Horário</label>
                  <input
                    type="text"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="19:00"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Categoria</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.filter(c => c.id !== 'cat-todos').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Ministério (Opcional)</label>
                  <select
                    value={formMinistryId}
                    onChange={(e) => setFormMinistryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Nenhum / Geral</option>
                    {ministries.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Local</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="Templo Sede"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Foto de Capa (URL)</label>
                <input
                  type="text"
                  required
                  value={formCover}
                  onChange={(e) => setFormCover(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Descrição do Culto</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Breve resumo da celebração..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Watermark toggle */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  id="watermark-toggle"
                  checked={formWatermark}
                  onChange={(e) => setFormWatermark(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="watermark-toggle" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Exibir marca d'água 'AD BARRAVENTO' no visualizador do site
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsCreating(false); setEditingGallery(null); }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md"
                >
                  {isCreating ? 'Criar Galeria' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PHOTO MANAGER MODAL (Upload, View, Delete, Set Cover) */}
      {selectedGalleryForPhotos && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-8 shadow-2xl border border-slate-100 my-6 space-y-6 animate-in zoom-in-95">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 uppercase">
                  Gerenciador de Fotos
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-heading">
                  {selectedGalleryForPhotos.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {galleryPhotos.length} fotos cadastradas nesta galeria.
                </p>
              </div>

              <button
                onClick={() => setSelectedGalleryForPhotos(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload Dropzone */}
            <div className="border-2 border-dashed border-blue-300 rounded-2xl p-6 sm:p-8 text-center bg-blue-50/40 hover:bg-blue-50/70 transition-colors relative">
              <input
                id="admin-file-upload-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="space-y-2 pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">
                  Arraste e solte fotos aqui ou clique para selecionar
                </h4>
                <p className="text-xs text-slate-500">
                  Envie fotos em alta resolução (JPEG, PNG, WebP). Suporta seleção múltipla.
                </p>
              </div>
            </div>

            {/* Upload progress indicator */}
            {isUploading && (
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Enviando fotos e gerando miniaturas...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Photos Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Fotos no Álbum ({galleryPhotos.length})
              </h4>

              {galleryPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[45vh] overflow-y-auto p-1">
                  {galleryPhotos.map((photo) => {
                    const isCover = selectedGalleryForPhotos.coverPhoto === photo.webUrl;
                    return (
                      <div
                        key={photo.id}
                        className="group relative rounded-xl overflow-hidden border border-slate-200 aspect-[3/2] bg-slate-100"
                      >
                        <img
                          src={photo.thumbnailUrl}
                          alt={photo.filename}
                          className="w-full h-full object-cover"
                        />

                        {isCover && (
                          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                            <Star className="w-3 h-3 fill-current" />
                            <span>Capa</span>
                          </div>
                        )}

                        {/* Action buttons on hover */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                          {!isCover && (
                            <button
                              onClick={() => handleSetCover(photo)}
                              className="p-2 rounded-lg bg-white text-slate-800 hover:bg-blue-600 hover:text-white transition-colors"
                              title="Definir como capa do álbum"
                            >
                              <Star className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeletePhoto(photo.id)}
                            className="p-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                            title="Excluir esta foto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">
                  Nenhuma foto carregada ainda. Use o campo acima para enviar as primeiras fotos.
                </p>
              )}
            </div>

            {/* Close */}
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedGalleryForPhotos(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
              >
                Concluir
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
