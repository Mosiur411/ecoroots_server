import { Role } from '@prisma/client';
import { z } from 'zod';

const createUserSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).trim(),
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z.string({ required_error: 'Password is required' }).trim(),
  }),
});

const updateUserStatusSchema = z.object({
  body: z.object({
    role: z.enum(Object.values(Role) as [string, ...string[]]).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const userValidation = {
  createUserSchema,
  updateUserStatusSchema,
};
