import { z } from 'zod';

export const RegisterForm = z.object({
    full_name: z.string(),
    email: z.string().email(),
    cell_phone: z.string(),
    password: z.string(),
    password_2: z.string(),
    role: z.string().optional(),
});

export type RegisterFormType = z.infer<typeof RegisterForm>;