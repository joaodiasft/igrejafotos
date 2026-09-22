import React, { useState } from 'react';
import { Plus, Trash2, Tag, Check } from 'lucide-react';
import { Category } from '../../types';
import { DatabaseService } from '../../services/db';

interface AdminCategoriesTabProps {
  categories: Category[];
  onRefresh: () => void;
}

export const AdminCategoriesTab: React.FC<AdminCategoriesTabProps> = ({ categories, onRefresh }) => {
  const [newCatName, setNewCatName] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await DatabaseService.addCategory(newCatName.trim());
    setNewCatName('');
    onRefresh();
  };

  const handleDelete = async (id: string, name: string) => {
    if (id === 'cat-todos') {
      alert('A categoria "Todos" é padrão do sistema e não pode ser excluída.');
      return;
    }
    if (window.confirm(`Excluir a categoria "${name}"?`)) {
      await DatabaseService.deleteCategory(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-xl font-bold text-slate-900 font-heading">
          Categorias de Eventos & Fotos
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Gerencie as tags de filtro rápido exibidas no portal público.
        </p>

        {/* Add input */}
        <form onSubmit={handleAdd} className="mt-4 flex gap-2 max-w-md">
          <input
            type="text"
            required
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Nome da nova categoria (ex: Batismos)..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </button>
        </form>
      </div>

      {/* Categories Pills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-slate-800 text-sm">{cat.name}</span>
            </div>

            {cat.id !== 'cat-todos' && (
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                title="Excluir categoria"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
