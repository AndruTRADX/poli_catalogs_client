import { useState } from 'react';
import { useSearch } from '../../lib/hooks/useSearch';
import { useCategories } from '../../lib/hooks/useCategories';
import type { AdvancedSearch } from '../../lib/types/Search';
import type { Article } from '../../lib/types/Article';

export default function SearchExample() {
  const { searchArticles, advancedSearch } = useSearch();
  const { categories } = useCategories();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [advancedSearchParams, setAdvancedSearchParams] = useState<AdvancedSearch>({});
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  const handleSimpleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const result = await searchArticles.mutateAsync(searchQuery);
      setSearchResults(result.articulos);
    } catch (error) {
      console.error('Error en la búsqueda:', error);
    }
  };

  const handleAdvancedSearch = async () => {
    try {
      const result = await advancedSearch.mutateAsync(advancedSearchParams);
      setSearchResults(result.articulos);
    } catch (error) {
      console.error('Error en la búsqueda avanzada:', error);
    }
  };

  const handleAdvancedParamChange = (field: keyof AdvancedSearch, value: string | number | undefined) => {
    setAdvancedSearchParams(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Búsqueda de Artículos</h1>

      {/* Búsqueda Simple */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Búsqueda Simple</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar artículos..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSimpleSearch()}
          />
          <button
            onClick={handleSimpleSearch}
            disabled={searchArticles.isPending}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {searchArticles.isPending ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </div>

      {/* Búsqueda Avanzada */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold">Búsqueda Avanzada</h2>
          <button
            onClick={() => setIsAdvancedSearch(!isAdvancedSearch)}
            className="text-blue-500 hover:text-blue-700"
          >
            {isAdvancedSearch ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>

        {isAdvancedSearch && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={advancedSearchParams.name || ''}
                onChange={(e) => handleAdvancedParamChange('name', e.target.value)}
                placeholder="Nombre del artículo"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                value={advancedSearchParams.category || ''}
                onChange={(e) => handleAdvancedParamChange('category', e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio mínimo
              </label>
              <input
                type="number"
                value={advancedSearchParams.min_price || ''}
                onChange={(e) => handleAdvancedParamChange('min_price', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio máximo
              </label>
              <input
                type="number"
                value={advancedSearchParams.max_price || ''}
                onChange={(e) => handleAdvancedParamChange('max_price', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="999999"
                min="0"
                step="0.01"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {isAdvancedSearch && (
          <div className="mt-4">
            <button
              onClick={handleAdvancedSearch}
              disabled={advancedSearch.isPending}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {advancedSearch.isPending ? 'Buscando...' : 'Búsqueda Avanzada'}
            </button>
          </div>
        )}
      </div>

      {/* Resultados */}
      {searchResults.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Resultados ({searchResults.length} artículos)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((article: Article) => (
              <div key={article.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-lg mb-2">{article.name}</h4>
                <p className="text-gray-600 text-sm mb-2">{article.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">${article.price}</span>
                  <span className="text-sm text-gray-500">Stock: {article.stock}</span>
                </div>
                <div className="mt-2">
                  <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs text-gray-700">
                    {article.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchResults.length === 0 && (searchArticles.isPending || advancedSearch.isPending) && (
        <div className="text-center py-8">
          <p className="text-gray-500">Buscando artículos...</p>
        </div>
      )}
    </div>
  );
} 