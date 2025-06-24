import { useMutation } from "@tanstack/react-query";
import agent from "../api/agents";
import type { AdvancedSearch } from "../types/Search";

export const useSearch = () => {
  const searchArticles = useMutation({
    mutationFn: async (query: string) => {
      const response = await agent.get(`/productos/buscar?query=${encodeURIComponent(query)}`);
      return response.data;
    },
  });

  const advancedSearch = useMutation({
    mutationFn: async (searchParams: AdvancedSearch) => {
      const response = await agent.post("/productos/busqueda-avanzada", searchParams);
      return response.data;
    },
  });

  return {
    searchArticles,
    advancedSearch,
  };
}; 