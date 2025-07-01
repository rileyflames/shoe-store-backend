import { z } from 'zod';

export const createShoeSchema = z.object({
  name: z.string().min(1, { message: 'Shoe name is required' }),
  brand: z.string().min(1, { message: 'Brand is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  price: z.number().int().positive({ message: 'Price must be a positive integer' }),
  sizes: z.array(z.number().gt(0).lt(20)).min(1, { message: 'At least one valid size is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  colors: z.array(z.string().min(1)).min(1, { message: 'At least one color is required' }),
  inStock: z.boolean(),
  images: z.array(z.string().url({ message: 'images[0] must be a valid URL' })).optional(),
});
