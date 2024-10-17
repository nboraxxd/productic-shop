import { accountDataResponseSchema } from '@/lib/schema-validations/account.schema'
import { z } from 'zod'

const email = z.string().email()
const password = z.string().min(6).max(100)

export const registerSchema = z
  .object({
    name: z.string().min(2).max(255),
    email,
    password,
    confirmPassword: z.string().min(6).max(100),
  })
  .strict('Additional properties not allowed')
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        message: 'Passwords do not match',
        path: ['confirmPassword'],
        code: z.ZodIssueCode.custom,
      })
    }
  })

export type RegisterSchemaType = z.infer<typeof registerSchema>

export const registerDataResponseSchema = z.object({
  token: z.string(),
  expiresAt: z.string(),
  account: accountDataResponseSchema,
})

export type RegisterDataResponseType = z.infer<typeof registerDataResponseSchema>

export const loginSchema = z
  .object({
    email,
    password,
  })
  .strict('Additional properties not allowed')

export type LoginSchemaType = z.infer<typeof loginSchema>

export const loginDataResponseSchema = registerDataResponseSchema

export type LoginDataResponseType = z.infer<typeof loginDataResponseSchema>

export const setTokenBodySchema = z
  .object({
    token: z.string(),
    expiresAt: z.string(),
  })
  .strict('Additional properties not allowed')

export type SetTokenBodyType = z.infer<typeof setTokenBodySchema>

export const setTokenDataResponseSchema = z.object({
  token: z.string(),
  expiresAt: z.string(),
})

export type SetTokenDataResponseType = z.infer<typeof setTokenDataResponseSchema>
