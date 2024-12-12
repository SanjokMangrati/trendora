import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 6 characters long',
  }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
