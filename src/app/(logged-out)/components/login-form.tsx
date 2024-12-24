'use client'

import { Suspense } from 'react'
import queryString from 'query-string'
import { useForm } from 'react-hook-form'
import { LoaderCircleIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { handleErrorApi } from '@/utils/errors'
import { LoginBodyType, loginBodySchema } from '@/lib/schema-validations/auth.schema'
import { useLoginMutation } from '@/app/(logged-out)/hooks/use-auth'
import { AuthFormSkeleton } from '@/app/(logged-out)/components'

function LoginFormContent() {
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

  const authLoginMutation = useLoginMutation()

  async function onValid(values: LoginBodyType) {
    if (authLoginMutation.isPending) return

    try {
      await authLoginMutation.mutateAsync(values)

      router.push(next ? `${next}?${from}` : '/me')
      router.refresh()
    } catch (error) {
      handleErrorApi<LoginBodyType>({ error, setError: form.setError })
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
      <LoginFormContent />
    </Suspense>
  )
}
