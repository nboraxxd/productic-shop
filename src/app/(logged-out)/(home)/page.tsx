import Link from 'next/link'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { VercelLogoIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { LogoutButton } from '@/components/shared'
import { WelcomeMessage } from '@/app/(logged-out)/(home)/_components'

export const metadata: Metadata = {
  title: 'Homepage',
  description: 'This is the homepage of the app.',
}

export default async function HomePage() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('sessionToken')

  return (
    <>
      <h1 className="flex items-center gap-2 text-2xl font-semibold">
        <VercelLogoIcon className="size-10 text-pink-500" />
        Next free
      </h1>
      {sessionToken ? <WelcomeMessage /> : <p>You are not logged in</p>}

      <div className="flex items-center gap-2">
        <Button asChild>
          <Link href="/login">Log in</Link>
        </Button>
        <small>or</small>
        <Button variant="outline">
          <Link href="/register">Register</Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild>
          <Link href="/me">Me (server)</Link>
        </Button>
        <Button asChild>
          <Link href="/profile">Profile (client)</Link>
        </Button>
        <LogoutButton />
      </div>

      <div className="flex items-center gap-2">
        <Button asChild>
          <Link href="/products">Products</Link>
        </Button>
        <Button asChild>
          <Link href="/products/add">Add product</Link>
        </Button>
      </div>
    </>
  )
}
