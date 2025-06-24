import { z } from 'zod';

export const LoginForm = z.object({
  username: z.string(),
  password: z.string()
});

export type LoginFormType = z.infer<typeof LoginForm>;

export const RegisterForm = z.object({
  full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  cell_phone: z.string()
    .min(1, 'El teléfono es requerido')
    .regex(/^\d+$/, 'El teléfono debe contener solo números')
    .min(7, 'El teléfono debe tener al menos 7 dígitos')
    .max(15, 'El teléfono no puede tener más de 15 dígitos'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  password_2: z.string(),
  role: z.string().optional(),
}).refine((data) => data.password === data.password_2, {
  message: "Las contraseñas no coinciden",
  path: ["password_2"],
});

export type RegisterFormType = z.infer<typeof RegisterForm>;