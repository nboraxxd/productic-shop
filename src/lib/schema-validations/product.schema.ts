import z from 'zod'

export const AddProductSchema = z.object({
  name: z.string().min(1).max(256),
  price: z.coerce.number().positive(),
  description: z.string().max(10000),
  image: z.string().url(),
})

export type AddProductSchemaType = z.TypeOf<typeof AddProductSchema>
