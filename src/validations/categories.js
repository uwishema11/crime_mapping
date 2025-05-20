import { z } from 'zod';

export const categoryValidation = z.object({
  name: z.string(),
  description: z
    .string()
    .min(5, 'category description must have more than five characters'),
});
