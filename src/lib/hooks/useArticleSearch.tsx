import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import agent from '../api/agents';

export const useArticleSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce effect - espera 500ms después de que el usuario deje de escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Query para buscar artículos
  const { 
    data: searchResults, 
    isPending: isSearching,
    error: searchError
  } = useQuery({
    queryKey: ['articles', 'search', debouncedSearchTerm],
    queryFn: async () => {
      if (!debouncedSearchTerm.trim()) {
        // Si no hay término de búsqueda, obtener todos los artículos
        const response = await agent.get("/productos/catalogo");
        return response.data.articulos;
      }
      
      // Si hay término de búsqueda, hacer la búsqueda
      const response = await agent.get(`/productos/buscar?query=${encodeURIComponent(debouncedSearchTerm)}`);
      return response.data.articulos || [];
    },
    enabled: true, // Siempre habilitado para manejar tanto búsqueda como lista completa
  });

  // Función para actualizar el término de búsqueda
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // Función para limpiar la búsqueda
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  }, []);

  return {
    searchTerm,
    debouncedSearchTerm,
    searchResults,
    isSearching,
    searchError,
    handleSearchChange,
    clearSearch,
    hasSearchTerm: debouncedSearchTerm.trim().length > 0,
  };
}; 