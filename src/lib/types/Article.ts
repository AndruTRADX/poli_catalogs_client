import { z } from 'zod';

export const ArticleSchema = z.object({
  id: z.string(),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  category: z.string().min(1, 'La categoría es requerida'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z.number().positive('El precio debe ser mayor a 0'),
  stock: z.number().int().min(0, 'El stock no puede ser negativo'),
  imageUrl: z.string().url().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  isActive: z.boolean().default(true),
});

export type Article = z.infer<typeof ArticleSchema>;

export interface ArticleResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
} 