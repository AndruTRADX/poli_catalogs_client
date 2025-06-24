import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agents";
import type { CartItem, PurchaseResponse } from "../types/Cart";

export const useCart = () => {
  const queryClient = useQueryClient();

  const { 
    data: cart, 
    isPending: isPendingCart 
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await agent.get("/carrito/");
      return response.data;
    },
  });

  const addToCart = useMutation({
    mutationFn: async (item: CartItem) => {
      const response = await agent.post("/carrito/agregar", item);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeFromCart = useMutation({
    mutationFn: async (articleId: string) => {
      await agent.delete(`/carrito/eliminar/${articleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const clearCart = useMutation({
    mutationFn: async () => {
      await agent.delete("/carrito/vaciar");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const purchaseCart = useMutation({
    mutationFn: async (): Promise<PurchaseResponse> => {
      const response = await agent.post("/carrito/comprar");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  return {
    cart,
    isPendingCart,
    addToCart,
    removeFromCart,
    clearCart,
    purchaseCart,
  };
}; 