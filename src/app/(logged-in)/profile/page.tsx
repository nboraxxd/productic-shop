'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useAccountQuery } from '@/app/(logged-in)/hooks/use-account'

export default function ProfilePage() {
  const { data, isLoading, isSuccess, isError } = useAccountQuery()

  if (isLoading) return <Skeleton className="h-5 w-1/6" />

  if (isError) {
    return null
  }

  return isSuccess ? <h1>Hello {data.payload.data.name} (client)</h1> : null
}
