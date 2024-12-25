import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

import accountApi from '@/api-requests/account.api'

import { Heading } from '@/components/shared'
import UpdateMeForm from '@/app/(logged-in)/components/update-me-form'

export const metadata: Metadata = {
  title: 'Update Me',
  description: 'This is the update me page of the app.',
}

export default async function UpdateMe() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('sessionToken')

  if (!sessionToken) redirect('/login')

  const result = await accountApi.getMeFromServerToBackend(sessionToken.value)

  return (
    <div className="container p-4">
      <Heading>Update Me {result.payload.data.name}</Heading>

      <div className="mx-auto mt-5 flex w-full max-w-96 flex-col">
        <UpdateMeForm me={result.payload.data} />
      </div>
    </div>
  )
}
