'use client'

import Link from 'next/link'

import { useAuthStore } from '@/app/(logged-in)/stores/auth-store'

import { Button } from '@/components/ui/button'
import { DeleteProductBtn } from '@/app/products/_components'
import useIsClient from '@/app/(logged-out)/hooks/use-is-client'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProductCommands({ productId }: { productId: number }) {
  const isAuth = useAuthStore((state) => state.isAuth)
  const isClient = useIsClient()

  if (!isClient)
    return (
      <>
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </>
    )

  return isAuth ? (
    <>
      <Button variant={'outline'} asChild>
        <Link href={`/products/edit/${productId}`}>Edit</Link>
      </Button>
      <DeleteProductBtn productId={productId} />
    </>
  ) : null
}
