'use client'

import { toast } from 'sonner'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { localStorageEventTarget } from '@/utils/local-storage'

interface Props {
  children: React.ReactNode
}

export default function AuthProvider({ children }: Props) {
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
