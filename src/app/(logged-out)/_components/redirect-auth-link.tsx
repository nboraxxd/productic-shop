'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

interface Props {
  children: React.ReactNode
  redirectPath: string
}

function RedirectAuthLinkWithoutSuspense({ children, redirectPath }: Props) {
  const searchParams = useSearchParams()
  const next = searchParams.get('next')

  return (
    <Link
      href={{
        pathname: redirectPath,
        query: next ? { next } : undefined,
      }}
      className="text-blue-600 hover:underline"
    >
      {children}
    </Link>
  )
}

export default function RedirectAuthLink(props: Props) {
  return (
    <Suspense fallback={<span className="text-blue-600 hover:underline">{props.children}</span>}>
      <RedirectAuthLinkWithoutSuspense {...props} />
    </Suspense>
  )
}
