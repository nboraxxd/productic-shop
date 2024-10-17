'use client'

import { useEffect, useState } from 'react'

import { SuccessResponse } from '@/types'
import { useAuthStore } from '@/lib/stores/auth-store'
import envVariables from '@/lib/schema-validations/env-variables.schema'
import { AccountDataResponseType } from '@/lib/schema-validations/account.schema'

export default function ProfilePage() {
  const [profile, setProfile] = useState<AccountDataResponseType | null>(null)

  const sessionToken = useAuthStore((state) => state.sessionToken)

  useEffect(() => {
    if (sessionToken) {
      ;(async () => {
        const result = await fetch(`${envVariables.NEXT_PUBLIC_API_ENDPOINT}/account/me`, {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }).then<{ status: number; payload: SuccessResponse<AccountDataResponseType> }>(async (res) => {
          const payload = await res.json()
          const data = {
            status: res.status,
            payload,
          }

          if (!res.ok) {
            throw data
          }

          return data
        })

        setProfile(result.payload.data)
      })()
    }
  }, [sessionToken])

  return <h1>Hello {profile?.name} (client)</h1>
}
