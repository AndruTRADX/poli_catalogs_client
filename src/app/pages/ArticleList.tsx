import { Link } from 'react-router';
import { useArticleSearch } from '../../lib/hooks/useArticleSearch';
import { useAdvancedSearch } from '../../lib/hooks/useAdvancedSearch';
import { useCategories } from '../../lib/hooks/useCategories';
import { useAuth } from '../../lib/hooks/useAuth';
import ProductImage from '../components/ProductImage';
import SearchBar from '../components/SearchBar';
import AdvancedSearchPanel from '../components/AdvancedSearchPanel';
import ActiveFilters from '../components/ActiveFilters';
import type { Article } from '../../lib/types/Article';

export default function ArticleList() {
  const { isAdmin } = useAuth();
  const { categories } = useCategories();
  
  // Búsqueda simple
  const {
    searchTerm,
    searchResults: simpleSearchResults,
    isSearching: isSimpleSearching,
    searchError: simpleSearchError,
    handleSearchChange,
    clearSearch: clearSimpleSearch,
    hasSearchTerm
  } = useArticleSearch();

  // Búsqueda avanzada
  const {
    searchParams,
    updateSearchParam,
    clearFilters,
    applyAdvancedSearch,
    hasActiveFilters,
    isAdvancedSearchActive,
    searchResults: advancedSearchResults,
    isSearching: isAdvancedSearching,
    searchError: advancedSearchError,
    resetSearch: resetAdvancedSearch
  } = useAdvancedSearch();

  // Función auxiliar para contar filtros activos
  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchParams.name) count++;
    if (searchParams.category) count++;
    if (searchParams.min_price) count++;
    if (searchParams.max_price) count++;
    return count;
  };

  // Determinar qué resultados mostrar
  const articles = isAdvancedSearchActive ? advancedSearchResults : simpleSearchResults;
  const isPendingArticles = isSimpleSearching || isAdvancedSearching;
  const searchError = simpleSearchError || advancedSearchError;

  // Función para limpiar búsqueda avanzada
  const handleClearAdvancedSearch = () => {
    clearFilters();
    resetAdvancedSearch();
  };

  // Función para remover un filtro específico
  const handleRemoveFilter = (key: keyof typeof searchParams) => {
    updateSearchParam(key, undefined);
  };

  // Función para limpiar todas las búsquedas
  const handleClearAllSearches = () => {
    clearSimpleSearch();
    handleClearAdvancedSearch();
  };

  if (isPendingArticles && !hasSearchTerm && !hasActiveFilters) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando artículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header con búsqueda */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isAdvancedSearchActive ? 'Búsqueda Avanzada' : hasSearchTerm ? 'Resultados de búsqueda' : 'Artículos'}
            </h2>
            {hasSearchTerm && (
              <p className="text-gray-600 mt-1">
                Buscando: "{searchTerm}"
              </p>
            )}
            {isAdvancedSearchActive && (
              <p className="text-gray-600 mt-1">
                Filtros aplicados: {getActiveFiltersCount()}
              </p>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Barra de búsqueda simple */}
            <div className="w-full lg:w-80">
              <SearchBar
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Buscar por nombre..."
                onClear={clearSimpleSearch}
                showSuggestions={!isAdvancedSearchActive}
              />
            </div>
            
            {/* Botón de nuevo artículo */}
            {isAdmin() && (
              <Link
                to="/articles/new"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-semibold whitespace-nowrap"
              >
                ✨ Nuevo Artículo
              </Link>
            )}
          </div>
        </div>

        {/* Panel de búsqueda avanzada */}
        <AdvancedSearchPanel
          searchParams={searchParams}
          onUpdateParam={updateSearchParam}
          onApplySearch={applyAdvancedSearch}
          onClearFilters={handleClearAdvancedSearch}
          hasActiveFilters={hasActiveFilters}
          isSearching={isAdvancedSearching}
          categories={categories as string[]}
        />

        {/* Filtros activos */}
        <ActiveFilters
          searchParams={searchParams}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAdvancedSearch}
        />

        {/* Información de resultados */}
        {(hasSearchTerm || isAdvancedSearchActive) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">🔍</span>
                <span className="text-blue-800 font-medium">
                  {isPendingArticles ? 'Buscando...' : `${articles?.length || 0} resultado${articles?.length !== 1 ? 's' : ''} encontrado${articles?.length !== 1 ? 's' : ''}`}
                </span>
              </div>
              <button
                onClick={handleClearAllSearches}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
              >
                Limpiar búsquedas
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error de búsqueda */}
      {searchError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-red-600">⚠️</span>
            <span className="text-red-800">
              Error al buscar artículos. Intenta de nuevo.
            </span>
          </div>
        </div>
      )}

      {/* Grid de artículos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {articles?.map((article: Article) => (
          <div
            key={article.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 search-result-item"
          >
            <div className="relative">
              <ProductImage
                src={article.imageUrl}
                alt={article.name}
                fallbackId={article.id}
                className="w-full h-48 object-cover"
                width={400}
                height={300}
              />
              {article.stock === 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                  Sin Stock
                </div>
              )}
              {article.stock > 0 && article.stock <= 5 && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-sm font-semibold">
                  Últimas {article.stock}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
                {article.name}
              </h3>
              <p className="text-gray-600 mb-3 text-sm line-clamp-3">
                {article.description}
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xl font-bold text-blue-600">${article.price}</span>
                  <div className="text-xs text-gray-500 mt-1">
                    Stock: {article.stock} unidades
                  </div>
                </div>
                <Link
                  to={`/articles/${article.id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estados vacíos */}
      {!isPendingArticles && articles?.length === 0 && (hasSearchTerm || isAdvancedSearchActive) && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron resultados</h3>
          <p className="text-gray-600 mb-4">
            {hasSearchTerm 
              ? `No hay artículos que coincidan con "${searchTerm}"`
              : 'No hay artículos que coincidan con los filtros aplicados'
            }
          </p>
          <button
            onClick={handleClearAllSearches}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Ver todos los artículos
          </button>
        </div>
      )}

      {!isPendingArticles && articles?.length === 0 && !hasSearchTerm && !hasActiveFilters && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <p className="text-gray-600 text-lg">No hay artículos disponibles</p>
          <p className="text-gray-500 text-sm mt-2">Vuelve más tarde para ver nuevos productos</p>
        </div>
      )}
    </div>
  );
} 