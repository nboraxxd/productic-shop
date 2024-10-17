'use client'

import { toast } from 'sonner'
import { Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import envVariables from '@/lib/schema-validations/env-variables.schema'
import { LoginSchemaType, LoginSchema } from '@/lib/schema-validations/auth.schema'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import AuthFormSkeleton from '@/app/(logged-out)/_components/auth-form-skeleton'

function LoginFormWithoutSuspense() {
  const router = useRouter()

  // const pathname = usePathname()
  // const from = queryString.stringify({ from: pathname })

  // const searchParams = useSearchParams()
  // const next = searchParams.get('next')

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onValid(values: LoginSchemaType) {
    try {
      const result = await fetch(`${envVariables.NEXT_PUBLIC_API_ENDPOINT}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }).then(async (res) => {
        const payload = await res.json()

        const data = { status: res.status, payload }

        if (!res.ok) throw data

        return data
      })
      console.log('🔥 ~ login ~ result:', result)

      form.reset()
      router.push('/')
    } catch (error: any) {
      const status = error.status

      if (status === 422) {
        const errors = error.payload?.errors as { field: string; message: string }[]

        errors.forEach(({ field, message }) => {
          form.setError(field as keyof LoginSchemaType, { type: 'server', message })
        })
      } else {
        toast.error(error.payload?.message || error.toString())
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValid)} noValidate className="flex w-full flex-col gap-3.5">
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" placeholder="bruce@wayne.dc" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Please enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Button */}
        <Button type="submit" className="mt-2 gap-2">
          {/* {status === false ? <LoaderCircle className="ml-2 animate-spin" /> : null} */}
          Login
        </Button>
      </form>
    </Form>
  )
}

const loginFields = [
  { label: 'Email', placeholder: 'bruce@wayne.dc' },
  { label: 'Password', placeholder: 'Please enter your password' },
]

export default function LoginForm() {
  return (
    <Suspense fallback={<AuthFormSkeleton itemList={loginFields} buttonLabel="Login" />}>
      <LoginFormWithoutSuspense />
    </Suspense>
  )
}
