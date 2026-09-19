import React, { useState, useMemo } from 'react';
import { Search, Filter, Camera, X, Calendar, RefreshCw } from 'lucide-react';
import { Gallery, Category, Ministry } from '../types';
import { GalleryCard } from '../components/GalleryCard';

interface GaleriasPageProps {
  galleries: Gallery[];
  categories: Category[];
  ministries: Ministry[];
  initialCategoryId?: string;
  onOpenGallery: (id: string) => void;
}

export const GaleriasPage: React.FC<GaleriasPageProps> = ({
  galleries,
  categories,
  ministries,
  initialCategoryId = 'cat-todos',
  onOpenGallery
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);
  const [selectedMinistry, setSelectedMinistry] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Available Years
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    galleries.forEach(g => {
      if (g.date) {
        years.add(g.date.split('-')[0]);
      }
    });
    return Array.from(years).sort().reverse();
  }, [galleries]);

  // Months list
  const months = [
    { value: 'all', label: 'Todos os Meses' },
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' }
  ];

  // Filter logic
  const filteredGalleries = useMemo(() => {
    return galleries.filter(gallery => {
      // 1. Search term (title, category, ministry, date, description)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const matchesTitle = gallery.title.toLowerCase().includes(term);
        const matchesDesc = gallery.description.toLowerCase().includes(term);
        const matchesCat = gallery.categoryName.toLowerCase().includes(term);
        const matchesMin = gallery.ministryName ? gallery.ministryName.toLowerCase().includes(term) : false;
        const matchesDate = gallery.date.includes(term);
        if (!matchesTitle && !matchesDesc && !matchesCat && !matchesMin && !matchesDate) {
          return false;
        }
      }

      // 2. Category
      if (selectedCategory !== 'cat-todos' && gallery.categoryId !== selectedCategory) {
        return false;
      }

      // 3. Ministry
      if (selectedMinistry !== 'all' && gallery.ministryId !== selectedMinistry) {
        return false;
      }

      // 4. Year
      if (selectedYear !== 'all') {
        const y = gallery.date.split('-')[0];
        if (y !== selectedYear) return false;
      }

      // 5. Month
      if (selectedMonth !== 'all') {
        const m = gallery.date.split('-')[1];
        if (m !== selectedMonth) return false;
      }

      return true;
    });
  }, [galleries, searchTerm, selectedCategory, selectedMinistry, selectedYear, selectedMonth]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('cat-todos');
    setSelectedMinistry('all');
    setSelectedYear('all');
    setSelectedMonth('all');
  };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'cat-todos' || selectedMinistry !== 'all' || selectedYear !== 'all' || selectedMonth !== 'all';

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <Camera className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Arquivo e Memória
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Galerias de Fotos dos Cultos
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            Encontre os registros dos cultos, eventos e momentos especiais. Toque na galeria para visualizar e baixar gratuitamente.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
          
          {/* Main Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              id="search-galerias-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por culto, evento, ministério, data (ex: 'mulheres', 'ceia')..."
              className="w-full pl-12 pr-10 py-3.5 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 text-sm sm:text-base transition-all placeholder:text-slate-400 focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick toggle for mobile filters */}
          <div className="flex items-center justify-between sm:hidden">
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-2"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{showFiltersMobile ? 'Ocultar Filtros' : 'Filtros Avançados'}</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Limpar</span>
              </button>
            )}
          </div>

          {/* Filter Dropdowns / Selectors (always on desktop, collapsible on mobile) */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100 ${
            showFiltersMobile ? 'block' : 'hidden sm:grid'
          }`}>
            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Categoria
              </label>
              <select
                id="filter-select-categoria"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ministry Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Ministério
              </label>
              <select
                id="filter-select-ministerio"
                value={selectedMinistry}
                onChange={(e) => setSelectedMinistry(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos os Ministérios</option>
                {ministries.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Ano
              </label>
              <select
                id="filter-select-ano"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos os Anos</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Mês
              </label>
              <select
                id="filter-select-mes"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter summary */}
          <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
            <span>
              Mostrando <strong>{filteredGalleries.length}</strong> {filteredGalleries.length === 1 ? 'galeria' : 'galerias'}
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="hidden sm:inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Limpar filtros</span>
              </button>
            )}
          </div>

        </div>

        {/* Galleries Grid */}
        {filteredGalleries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredGalleries.map((gallery) => (
              <GalleryCard
                key={gallery.id}
                gallery={gallery}
                onOpen={onOpenGallery}
              />
            ))}
          </div>
        ) : (
          /* Empty State as requested in Section 56 */
          <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8 max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Camera className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 font-heading">
                Nenhuma galeria encontrada
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {searchTerm || hasActiveFilters
                  ? 'Tente remover os filtros ou buscar por outro termo para localizar os registros.'
                  : 'Nenhuma galeria publicada ainda. Volte em breve para conferir novos momentos da AD Barravento.'}
              </p>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-500 transition-colors"
              >
                Limpar Todos os Filtros
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
