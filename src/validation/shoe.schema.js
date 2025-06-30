

import { z } from 'zod'

export const createShoeSchema = z.object({
  name: z.string().trim().min(1, 'Shoe name is required'),
  brand: z.string().trim().min(1, 'Brand is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().int().min(0, 'Price must be a positive integer'),
  sizes: z.array(z.number().gt(0).lt(20)).min(1, 'At least one valid size is required'),
  category: z.string().trim().min(1, 'Category is required'),
  colors: z.array(z.string().min(1)).min(1, 'At least one color is required'),
  inStock: z.boolean(),
  images: z.array(z.string().url()).optional().default([]),
})
