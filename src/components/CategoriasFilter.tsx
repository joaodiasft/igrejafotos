import React from 'react';
import { Category } from '../types';

interface CategoriasFilterProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  className?: string;
}

export const CategoriasFilter: React.FC<CategoriasFilterProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  className = ''
}) => {
  return (
    <div className={`w-full overflow-x-auto no-scrollbar py-1 ${className}`}>
      <div className="flex items-center gap-2 pb-2 min-w-max px-1">
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              id={`cat-filter-btn-${cat.slug}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap min-h-[40px] flex items-center justify-center ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-102'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
