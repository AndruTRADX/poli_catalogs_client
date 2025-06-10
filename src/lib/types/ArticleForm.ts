import { z } from 'zod';

export const ArticleForm = z.object({
    name: z.string(),
    category: z.string(),
    description: z.string(),
    price: z.number(),
    stock: z.number().int(),
});

export type ArticleFormType = z.infer<typeof ArticleForm>;