import { useState } from 'react';
import type { AdvancedSearch } from '../../lib/types/Search';

interface AdvancedSearchPanelProps {
  searchParams: AdvancedSearch;
  onUpdateParam: (key: keyof AdvancedSearch, value: string | number | undefined) => void;
  onApplySearch: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  isSearching: boolean;
  categories?: string[];
}

export default function AdvancedSearchPanel({
  searchParams,
  onUpdateParam,
  onApplySearch,
  onClearFilters,
  hasActiveFilters,
  isSearching,
  categories = []
}: AdvancedSearchPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (key: keyof AdvancedSearch, value: string) => {
    if (key === 'min_price' || key === 'max_price') {
      const numValue = value === '' ? undefined : parseFloat(value);
      onUpdateParam(key, numValue);
    } else {
      onUpdateParam(key, value === '' ? undefined : value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onApplySearch();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header del panel */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-800">🔍 Búsqueda Avanzada</span>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
              Filtros activos
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClearFilters();
            }}
            disabled={!hasActiveFilters}
            className="text-sm text-gray-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Limpiar
          </button>
          <svg 
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-6">
          {/* Filtro por nombre */}
          <div>
            <label htmlFor="name-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del artículo
            </label>
            <input
              id="name-filter"
              type="text"
              value={searchParams.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Buscar por nombre..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtro por categoría */}
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              id="category-filter"
              value={searchParams.category || ''}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por rango de precios */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rango de precios
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="min-price" className="block text-xs text-gray-500 mb-1">
                  Precio mínimo
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    id="min-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={searchParams.min_price || ''}
                    onChange={(e) => handleInputChange('min_price', e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="0.00"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="max-price" className="block text-xs text-gray-500 mb-1">
                  Precio máximo
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    id="max-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={searchParams.max_price || ''}
                    onChange={(e) => handleInputChange('max_price', e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="999.99"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {hasActiveFilters ? (
                <span>Filtros aplicados: {Object.keys(searchParams).filter(key => searchParams[key as keyof AdvancedSearch]).length}</span>
              ) : (
                <span>Sin filtros aplicados</span>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClearFilters}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Limpiar
              </button>
              <button
                onClick={onApplySearch}
                disabled={isSearching || !hasActiveFilters}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Buscando...</span>
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    <span>Buscar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 