import Link from 'next/link'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import accountApi from '@/api-requests/account.api'
import { AccountDataResponseType } from '@/lib/schema-validations/account.schema'

export const metadata: Metadata = {
  title: 'Me',
  description: 'This is the me page of the app.',
}

export default async function MePage() {
  const cookieStore = cookies()

  const sessionToken = cookieStore.get('sessionToken')

  if (!sessionToken) redirect('/login')

  let meData: AccountDataResponseType | null = null

  try {
    const result = await accountApi.getMeFromServerToBackend(sessionToken.value)

    meData = result.payload.data
  } catch (err: any) {
    if (err.digest?.includes('NEXT_REDIRECT')) {
      throw err
    }
  }

  return (
    <div className="container w-full">
      <h1>Hello {meData?.name} (server)</h1>
      <Button asChild>
        <Link href="/me/update">Update me</Link>
      </Button>
    </div>
  )
}
