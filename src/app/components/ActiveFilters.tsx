import type { AdvancedSearch } from '../../lib/types/Search';

interface ActiveFiltersProps {
  searchParams: AdvancedSearch;
  onRemoveFilter: (key: keyof AdvancedSearch) => void;
  onClearAll: () => void;
}

export default function ActiveFilters({
  searchParams,
  onRemoveFilter,
  onClearAll
}: ActiveFiltersProps) {
  const activeFilters = Object.entries(searchParams).filter(([, value]) => 
    value !== undefined && value !== '' && value !== null
  ) as [string, string | number][];

  if (activeFilters.length === 0) {
    return null;
  }

  const getFilterLabel = (key: string, value: string | number) => {
    switch (key) {
      case 'name':
        return `Nombre: "${value}"`;
      case 'category':
        return `Categoría: ${value}`;
      case 'min_price':
        return `Precio mínimo: $${value}`;
      case 'max_price':
        return `Precio máximo: $${value}`;
      default:
        return `${key}: ${value}`;
    }
  };

  const getFilterIcon = (key: string) => {
    switch (key) {
      case 'name':
        return '📝';
      case 'category':
        return '🏷️';
      case 'min_price':
        return '💰';
      case 'max_price':
        return '💰';
      default:
        return '🔍';
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-blue-600">🔍</span>
          <span className="text-blue-800 font-medium">Filtros activos</span>
          <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">
            {activeFilters.length}
          </span>
        </div>
        <button
          onClick={onClearAll}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
        >
          Limpiar todos
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {activeFilters.map(([key, value]) => (
          <div
            key={key}
            className="flex items-center space-x-2 bg-white border border-blue-200 rounded-full px-3 py-1 text-sm"
          >
            <span className="text-blue-600">{getFilterIcon(key)}</span>
            <span className="text-blue-800">{getFilterLabel(key, value)}</span>
            <button
              onClick={() => onRemoveFilter(key as keyof AdvancedSearch)}
              className="text-blue-400 hover:text-blue-600 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 