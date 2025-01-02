'use client'

import { useGetMeQuery } from '@/app/(logged-in)/hooks/use-account'
import { useAuthStore } from '@/app/(logged-in)/stores/auth-store'
import useIsClient from '@/app/(logged-out)/hooks/use-is-client'

import { Skeleton } from '@/components/ui/skeleton'

export default function WelcomeMessage() {
  const isAuth = useAuthStore((state) => state.isAuth)
  const isClient = useIsClient()

  if (!isClient) return <Skeleton className="h-6 w-60" />

  return isAuth ? <WelcomeMessageContent /> : <p>You are not logged in</p>
}

function WelcomeMessageContent() {
  const getMeQuery = useGetMeQuery()

  if (getMeQuery.isLoading) return <Skeleton className="h-6 w-60" />

  return getMeQuery.isSuccess ? <p>Welcome {getMeQuery.data.payload.data.name}</p> : null
}
