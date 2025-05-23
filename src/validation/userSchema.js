import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z.string().min(1, 'Password is required'),
  email: z.string().email('Invalid email'),
  confirm_password: z.string().min(1, 'Confirm password is required'),
  image_url: z
    .union([
      z.string().url('Invalid URL'),
      z.instanceof(File),
      z.null(),
      z.undefined(),
    ])
    .optional(),
});
