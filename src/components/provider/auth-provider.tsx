'use client'

import { useAuthStore } from '@/lib/stores/auth-store'

interface Props {
  children: React.ReactNode
  initialSessionToken?: string
}

export default function AuthProvider({ children, initialSessionToken = '' }: Props) {
  const setSessionToken = useAuthStore((state) => state.setSessionToken)

  setSessionToken(initialSessionToken)
  return children
}
