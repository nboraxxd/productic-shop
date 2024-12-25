import { z } from 'zod'

export const uploadImageResponseSchema = z.object({
  data: z.string(),
  message: z.string(),
})

export type UploadImageResponseType = z.TypeOf<typeof uploadImageResponseSchema>
