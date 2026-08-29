import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(50).trim(),
    budget: z.coerce.number().min(0).optional().default(0),
    icon: z.string().optional().default(''),
    color: z.string().optional().default(''),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    name: z.string().min(1).max(50).trim().optional(),
    budget: z.coerce.number().min(0).optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
  }),
});

export const categoryIdSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});
