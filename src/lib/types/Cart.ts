import { z } from 'zod';

export const CartItemSchema = z.object({
  article_id: z.string(),
  quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
});

export const CartItemResponseSchema = z.object({
  article_id: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  total: z.number(),
});

export const CartResponseSchema = z.object({
  items: z.array(CartItemResponseSchema),
  total_price: z.number(),
  cart_id: z.string().optional(),
});

export type CartItem = z.infer<typeof CartItemSchema>;
export type CartItemResponse = z.infer<typeof CartItemResponseSchema>;
export type CartResponse = z.infer<typeof CartResponseSchema>;

export interface PurchaseResponse {
  message: string;
  cantidad_articulos: number;
  precio_total: number;
} 