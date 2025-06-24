import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import agent from '../../lib/api/agents';
import type { Article } from '../../lib/types/Article';

interface SearchSuggestionsProps {
  searchTerm: string;
  onSuggestionClick: (suggestion: string) => void;
  isVisible: boolean;
  onClose: () => void;
}

export default function SearchSuggestions({
  searchTerm,
  onSuggestionClick,
  isVisible,
  onClose
}: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Obtener sugerencias cuando hay un término de búsqueda
  const { data: searchData } = useQuery({
    queryKey: ['search-suggestions', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim() || searchTerm.length < 2) {
        return [];
      }
      
      try {
        const response = await agent.get(`/productos/buscar?query=${encodeURIComponent(searchTerm)}&limit=5`);
        const articles = response.data.articulos || [];
        
        // Extraer nombres únicos de artículos que coincidan
        const uniqueNames = [...new Set(
          articles
            .filter((article: Article) => 
              article.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((article: Article) => article.name)
        )];
        
        return uniqueNames.slice(0, 5);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        return [];
      }
    },
    enabled: searchTerm.length >= 2,
  });

  useEffect(() => {
    if (searchData && Array.isArray(searchData)) {
      setSuggestions(searchData as string[]);
    }
  }, [searchData]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => {
      if (isVisible) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isVisible, onClose]);

  if (!isVisible || !searchTerm || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
      <div className="p-2">
        <div className="text-xs text-gray-500 px-3 py-1 border-b border-gray-100">
          Sugerencias
        </div>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-700 transition-colors duration-150 flex items-center space-x-2"
          >
            <span className="text-gray-400">🔍</span>
            <span>{suggestion}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 