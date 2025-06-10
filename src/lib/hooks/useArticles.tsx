import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agents";
import type { ArticleFormType } from "../types/ArticleForm";

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

  return {
    articles,
    article,
    isPendingArticles,
    isPendingArticle,
    createArticle,
    updateArticle,
    deleteArticle,
  };
};