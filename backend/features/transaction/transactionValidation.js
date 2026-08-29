import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category id');

export const createTransactionSchema = z.object({
  body: z.object({
    category: objectId,
    description: z.string().max(200).optional().default(''),
    amount: z.coerce.number().positive('Amount must be positive'),
    type: z.enum(['income', 'expense']),
    date: z.coerce.date().optional(),
  }),
});

export const updateTransactionSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    category: objectId.optional(),
    description: z.string().max(200).optional(),
    amount: z.coerce.number().positive().optional(),
    type: z.enum(['income', 'expense']).optional(),
    date: z.coerce.date().optional(),
  }),
});

export const transactionQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().optional(),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/).optional().or(z.literal('')),
    type: z.enum(['income', 'expense']).optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  }),
});

export const transactionIdSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});
