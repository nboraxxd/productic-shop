import z from 'zod'

export const addProductBodySchema = z.object({
  name: z.string().min(1).max(256),
  price: z.coerce.number().positive(),
  description: z.string().max(10000),
  image: z.string().url(),
})

export type AddProductBodyType = z.TypeOf<typeof addProductBodySchema>

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  image: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const productResponseSchema = z.object({
  data: productSchema,
  message: z.string(),
})

export type ProductResponseType = z.TypeOf<typeof productResponseSchema>

export const productsResponseSchema = z.object({
  data: z.array(productSchema),
  message: z.string(),
})

export type ProductsResponseType = z.TypeOf<typeof productsResponseSchema>

export const updateProductBodySchema = addProductBodySchema

export type UpdateProductBodyType = z.TypeOf<typeof updateProductBodySchema>
