import { accountDataResponseSchema } from '@/lib/schema-validations/account.schema'
import { z } from 'zod'

const email = z.string().email()
const password = z.string().min(6).max(100)

export const registerBodySchema = z
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

export type RegisterBodyType = z.infer<typeof registerBodySchema>

export const authDataResponseSchema = z.object({
  token: z.string(),
  expiresAt: z.string(),
  account: accountDataResponseSchema,
})

export type AuthDataResponseType = z.infer<typeof authDataResponseSchema>

export const loginBodySchema = z
  .object({
    email,
    password,
  })
  .strict('Additional properties not allowed')

export type LoginBodyType = z.infer<typeof loginBodySchema>

export const setTokenBodySchema = z
  .object({
    token: z.string(),
    expiresAt: z.string(),
  })
  .strict('Additional properties not allowed')

export type SetTokenBodyType = z.infer<typeof setTokenBodySchema>
