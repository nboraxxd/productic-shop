'use client'

import { toast } from 'sonner'
import { Suspense } from 'react'
import queryString from 'query-string'
import { useForm } from 'react-hook-form'
import { LoaderCircleIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { useAuthStore } from '@/lib/stores/auth-store'
import { useAuthLoginMutation } from '@/app/(logged-out)/hooks'
import { LoginBodyType, loginBodySchema } from '@/lib/schema-validations/auth.schema'
import { AuthFormSkeleton } from '@/app/(logged-out)/components'

function LoginFormWithoutSuspense() {
  const router = useRouter()

  const pathname = usePathname()
  const from = queryString.stringify({ from: pathname })

  const searchParams = useSearchParams()
  const next = searchParams.get('next')

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(loginBodySchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const authLoginMutation = useAuthLoginMutation()
  const setSessionToken = useAuthStore((state) => state.setSessionToken)

  async function onValid(values: LoginBodyType) {
    if (authLoginMutation.isPending) return

    try {
      const response = await authLoginMutation.mutateAsync(values)

      setSessionToken(response.payload.data.token)

      router.push(next ? `${next}?${from}` : '/me')
      router.refresh()

      form.reset()
    } catch (error: any) {
      console.log('🔥 ~ onValid ~ error:', error)
      const status = error.status

      if (status === 422) {
        const errors = error.payload?.errors as { field: string; message: string }[]

        errors.forEach(({ field, message }) => {
          form.setError(field as keyof LoginBodyType, { type: 'server', message })
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
        <Button type="submit" className="mt-2 gap-2" disabled={authLoginMutation.isPending}>
          {authLoginMutation.isPending ? <LoaderCircleIcon className="ml-2 animate-spin" /> : null}
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
