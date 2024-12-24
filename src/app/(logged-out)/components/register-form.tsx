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
import { useRegisterMutation } from '@/app/(logged-out)/hooks/use-auth'
import { registerBodySchema, RegisterBodyType } from '@/lib/schema-validations/auth.schema'
import { AuthFormSkeleton } from '@/app/(logged-out)/components'

function RegisterFormContent() {
  const router = useRouter()

  const pathname = usePathname()
  const from = queryString.stringify({ from: pathname })

  const searchParams = useSearchParams()
  const next = searchParams.get('next')

  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(registerBodySchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const authRegisterMutation = useRegisterMutation()

  async function onValid(values: RegisterBodyType) {
    if (authRegisterMutation.isPending) return

    try {
      await authRegisterMutation.mutateAsync(values)

      router.push(next ? `${next}?${from}` : '/me')
      router.refresh()

      form.reset()
    } catch (error: any) {
      handleErrorApi<RegisterBodyType>({ error, setError: form.setError })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValid)} noValidate className="flex w-full flex-col gap-3.5">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Bruce Wayne" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        {/* Confirm password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Please confirm your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Button */}
        <Button type="submit" className="mt-2 gap-2" disabled={authRegisterMutation.isPending}>
          {authRegisterMutation.isPending ? <LoaderCircleIcon className="ml-2 animate-spin" /> : null}
          Register
        </Button>
      </form>
    </Form>
  )
}

const registerFields = [
  { label: 'Name', placeholder: 'Bruce Wayne' },
  { label: 'Email', placeholder: 'bruce@wayne.dc' },
  { label: 'Password', placeholder: 'Please enter your password' },
  { label: 'Confirm password', placeholder: 'Please confirm your password' },
]

export default function RegisterForm() {
  return (
    <Suspense fallback={<AuthFormSkeleton itemList={registerFields} buttonLabel="Login" />}>
      <RegisterFormContent />
    </Suspense>
  )
}
