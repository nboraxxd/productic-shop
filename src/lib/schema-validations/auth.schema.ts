import { z } from 'zod'

const email = z.string().email()
const password = z.string().min(6).max(100)

export const RegisterSchema = z
  .object({
    name: z.string().min(2).max(255),
    email,
    password,
    confirmPassword: z.string().min(6).max(100),
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        message: 'Passwords do not match',
        path: ['confirmPassword'],
        code: z.ZodIssueCode.custom,
      })
    }
  })

export const LoginSchema = z.object({
  email,
  password,
})

export type RegisterSchemaType = z.infer<typeof RegisterSchema>
export type LoginSchemaType = z.infer<typeof LoginSchema>
