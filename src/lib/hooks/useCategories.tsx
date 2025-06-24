import { useQuery } from '@tanstack/react-query';
import agent from '../api/agents';
import type { Article } from '../types/Article';

export const useCategories = () => {
  const { data: categories, isPending, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        // Obtener todos los artículos para extraer categorías únicas
        const response = await agent.get("/productos/catalogo");
        const articles = response.data.articulos || [];
        
        // Extraer categorías únicas y ordenarlas
        const uniqueCategories = [...new Set(
          articles.map((article: Article) => article.category).filter(Boolean)
        )].sort();
        
        return uniqueCategories;
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
  });

  return {
    categories: categories || [],
    isPending,
    error,
  };
}; 