import { z } from 'zod';

export const loginFormSchema = z.object({
  username: z.string().email('Debe ser un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export const registerFormSchema = z.object({
  full_name: z.string().min(3, 'Nombre completo es requerido'),
  email: z.string().email('Email inválido'),
  cell_phone: z.string().min(6, 'Teléfono inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  password_2: z.string()
}).refine(data => data.password === data.password_2, {
  message: 'Las contraseñas no coinciden',
  path: ['password_2']
});