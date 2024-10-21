import { SuccessResponse } from '@/types'
import { z } from 'zod'

export const accountDataResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
})

export type AccountDataResponseType = z.TypeOf<typeof accountDataResponseSchema>
export type AccountResponseType = SuccessResponse<AccountDataResponseType>

export const updateMeSchema = z
  .object({
    name: z.string().trim().min(2).max(256),
  })
  .strict('Additional properties not allowed')

export type UpdateMeSchemaType = z.TypeOf<typeof updateMeSchema>
