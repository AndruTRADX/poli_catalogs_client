import { z } from 'zod';

export const SearchQuerySchema = z.object({
  query: z.string().min(1, 'La búsqueda no puede estar vacía'),
});

export const AdvancedSearchSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  min_price: z.number().positive().optional(),
  max_price: z.number().positive().optional(),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type AdvancedSearch = z.infer<typeof AdvancedSearchSchema>;

export interface SearchResponse {
  articulos: Array<{
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
  }>;
} 