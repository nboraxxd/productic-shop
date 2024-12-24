'use client'

import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { isBrowser } from '@/utils'
import { clientSessionToken } from '@/utils/http'
import { localStorageEventTarget } from '@/utils/local-storage'

interface Props {
  children: React.ReactNode
  initialSessionToken?: string
}

export default function AuthProvider({ children, initialSessionToken }: Props) {
  useState(() => {
    if (isBrowser && initialSessionToken) {
      clientSessionToken.value = initialSessionToken
    }
  })

  const router = useRouter()

  useEffect(() => {
    function handleRemoveAuth() {
      router.push('/login')
      router.refresh()
      toast.warning('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại. (force)')
    }

    localStorageEventTarget.addEventListener('removeAuth', handleRemoveAuth)
    return () => {
      localStorageEventTarget.removeEventListener('removeAuth', handleRemoveAuth)
    }
  }, [router])

  return children
}
