import { z } from 'zod';

export const LoginForm = z.object({
    username: z.string(),
    password: z.string()
});

export type LoginFormType = z.infer<typeof LoginForm>;