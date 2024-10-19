import Link from 'next/link'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import accountApi from '@/api-requests/account.api'
import { AccountDataResponseType } from '@/lib/schema-validations/account.schema'

export const metadata: Metadata = {
  title: 'Me',
  description: 'This is the me page of the app.',
}

export default async function MePage() {
  let meData: AccountDataResponseType | null = null

  try {
    const result = await accountApi.getMeFromServerToBackend()

    meData = result.payload.data
  } catch (_err) {
    redirect('/login')
  }

  return (
    <div>
      <h1>Hello {meData.name} (server)</h1>
      <Button asChild>
        <Link href="/me/update">Update me</Link>
      </Button>
    </div>
  )
}
