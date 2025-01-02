'use client'

import { LoaderCircleIcon } from 'lucide-react'
import { Suspense, useEffect, useRef } from 'react'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { handleErrorApi } from '@/utils/errors'
import { useLogoutMutation } from '@/app/(logged-in)/hooks/use-auth'
import { getSessionTokenFromLocalStorage } from '@/utils/local-storage'

function LogoutPageContent() {
  const logoutRef = useRef<UseMutateAsyncFunction | null>(null)

  const router = useRouter()

  const pathname = usePathname()

  const searchParams = useSearchParams()
  const sessionTokenFromUrl = searchParams.get('sessionToken')

  const { mutateAsync } = useLogoutMutation()

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null

    if (!logoutRef.current && sessionTokenFromUrl === getSessionTokenFromLocalStorage()) {
      ;(async () => {
        logoutRef.current = mutateAsync

        try {
          await mutateAsync()

          const from = new URLSearchParams()
          from.set('from', pathname)
          router.push(`/?${from}`)
          router.refresh()

          timeout = setTimeout(() => {
            logoutRef.current = null
          }, 1000)
        } catch (error) {
          handleErrorApi({ error })
        }
      })()
    } else {
      router.push('/')
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [mutateAsync, pathname, router, sessionTokenFromUrl])

  return sessionTokenFromUrl ? <LogoutView /> : null
}

function LogoutView() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <p className="flex items-center gap-x-3">
        <LoaderCircleIcon className="size-8 animate-spin" />
        <span className="font-medium text-foreground">Đang đăng xuất...</span>
      </p>
    </div>
  )
}

export default function LogoutPage() {
  return (
    <Suspense fallback={<LogoutView />}>
      <LogoutPageContent />
    </Suspense>
  )
}
