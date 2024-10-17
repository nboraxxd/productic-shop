'use client'

import { Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { LoginSchemaType, LoginSchema } from '@/lib/schema-validations/auth.schema'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import AuthFormSkeleton from '@/app/(logged-out)/_components/auth-form-skeleton'

function LoginFormWithoutSuspense() {
  // const router = useRouter()

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
    console.log(values)
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
