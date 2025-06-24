import { z } from 'zod';

export const LoginForm = z.object({
  username: z.string(),
  password: z.string()
});

export type LoginFormType = z.infer<typeof LoginForm>;

export const RegisterForm = z.object({
  full_name: z.string(),
  email: z.string().email(),
  cell_phone: z.number().int().positive('El teléfono debe ser un número válido'),
  password: z.string(),
  password_2: z.string(),
  role: z.string().optional(),
});

export type RegisterFormType = z.infer<typeof RegisterForm>;