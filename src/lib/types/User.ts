import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  role: z.enum(['admin', 'user']),
  cellPhone: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

export interface UserResponse {
  user: User;
  token: string;
} 