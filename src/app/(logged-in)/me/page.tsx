import Link from 'next/link'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import envVariables from '@/lib/schema-validations/env-variables.schema'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Me',
  description: 'This is the me page of the app.',
}

export default async function MePage() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('sessionToken')

  if (!sessionToken) redirect('/login')

  const result = await fetch(`${envVariables.NEXT_PUBLIC_API_ENDPOINT}/account/me`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionToken?.value}`,
    },
  }).then(async (res) => {
    const payload = await res.json()

    const data = { status: res.status, payload }

    if (!res.ok) throw data

    return data
  })
  console.log('🔥 ~ MePage ~ result:', result)

  return (
    <div>
      <h1>Hello {result.payload.data.name} (server)</h1>
      <Button asChild>
        <Link href="/me/update">Update me</Link>
      </Button>
    </div>
  )
}
