import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agents";
import type { ArticleFormType } from "../types/ArticleForm";
import type { AdvancedSearch } from "../types/Search";

export const useArticles = (id?: string) => {
  const queryClient = useQueryClient();

  const { 
    data: articles, 
    isPending: isPendingArticles 
  } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const response = await agent.get("/productos/catalogo");
      return response.data.articulos;
    },
  });

  const { 
    data: article, 
    isPending: isPendingArticle 
  } = useQuery({
    queryKey: ["articles", id],
    queryFn: async () => {
      const response = await agent.get(`/productos/detalle-articulo/${id}`);
      return response.data.articulo;
    },
    enabled: !!id,
  });

  const createArticle = useMutation({
    mutationFn: async (articleData: ArticleFormType) => {
      const response = await agent.post("/productos/agregar-articulo", articleData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  const createMultipleArticles = useMutation({
    mutationFn: async (articlesData: ArticleFormType[]) => {
      const response = await agent.post("/productos/agregar-multiples-articulos", articlesData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  const updateArticle = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ArticleFormType }) => {
      await agent.put(`/productos/actualizar/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  const deleteArticle = useMutation({
    mutationFn: async (id: string) => {
      await agent.delete(`/productos/eliminar/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

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
    articles,
    article,
    isPendingArticles,
    isPendingArticle,
    createArticle,
    createMultipleArticles,
    updateArticle,
    deleteArticle,
    searchArticles,
    advancedSearch,
  };
};