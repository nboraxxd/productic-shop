import Link from 'next/link'
import { Metadata } from 'next'

import { VercelLogoIcon } from '@radix-ui/react-icons'
import { LoginForm, RedirectAuthLink } from '@/app/(logged-out)/_components'

export const metadata: Metadata = {
  title: 'Login',
  description: 'This is the login page of the app.',
}

export default function LoginPage() {
  return (
    <>
      <h1 className="flex items-center gap-2 text-2xl font-semibold">
        <Link href="/">
          <VercelLogoIcon className="size-10 text-pink-500" />
        </Link>
        Login to Next free
      </h1>
      <p>Welcome back! Please login to your account.</p>

      <div className="mt-5 flex w-full max-w-96 flex-col">
        <LoginForm />

        <div className="mt-5 flex items-center justify-center gap-1">
          <span>Don&apos;t have an account?</span>
          <RedirectAuthLink redirectPath="/register">Register</RedirectAuthLink>
        </div>
      </div>
    </>
  )
}
