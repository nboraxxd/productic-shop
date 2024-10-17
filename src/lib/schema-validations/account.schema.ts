import { z } from 'zod'

export const UpdateMeSchema = z.object({
  name: z.string().trim().min(2).max(256),
})

export type UpdateMeSchemaType = z.TypeOf<typeof UpdateMeSchema>
