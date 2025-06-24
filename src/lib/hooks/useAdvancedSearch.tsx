import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import agent from '../api/agents';
import type { AdvancedSearch } from '../types/Search';

export const useAdvancedSearch = () => {
  const [searchParams, setSearchParams] = useState<AdvancedSearch>({});
  const [isAdvancedSearchActive, setIsAdvancedSearchActive] = useState(false);

  // Mutación para búsqueda avanzada
  const advancedSearchMutation = useMutation({
    mutationFn: async (params: AdvancedSearch) => {
      console.log('Advanced search params:', params);
      const response = await agent.post("/productos/busqueda-avanzada", params);
      console.log('Advanced search response:', response.data);
      return response.data.articulos || [];
    },
    onError: (error) => {
      console.error('Advanced search error:', error);
    },
  });

  // Función para actualizar un parámetro específico
  const updateSearchParam = useCallback((key: keyof AdvancedSearch, value: string | number | undefined) => {
    setSearchParams(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }));
  }, []);

  // Función para limpiar todos los filtros
  const clearFilters = useCallback(() => {
    setSearchParams({});
    setIsAdvancedSearchActive(false);
  }, []);

  // Función para aplicar la búsqueda avanzada
  const applyAdvancedSearch = useCallback(() => {
    // Filtrar parámetros vacíos
    const filteredParams = Object.fromEntries(
      Object.entries(searchParams).filter(([, value]) => 
        value !== undefined && value !== '' && value !== null
      )
    ) as AdvancedSearch;

    if (Object.keys(filteredParams).length > 0) {
      setIsAdvancedSearchActive(true);
      advancedSearchMutation.mutate(filteredParams);
    } else {
      setIsAdvancedSearchActive(false);
    }
  }, [searchParams, advancedSearchMutation]);

  // Función para verificar si hay filtros activos
  const hasActiveFilters = useCallback(() => {
    return Object.values(searchParams).some(value => 
      value !== undefined && value !== '' && value !== null
    );
  }, [searchParams]);

  return {
    searchParams,
    updateSearchParam,
    clearFilters,
    applyAdvancedSearch,
    hasActiveFilters: hasActiveFilters(),
    isAdvancedSearchActive,
    searchResults: advancedSearchMutation.data,
    isSearching: advancedSearchMutation.isPending,
    searchError: advancedSearchMutation.error,
    resetSearch: () => {
      setIsAdvancedSearchActive(false);
      advancedSearchMutation.reset();
    }
  };
}; 