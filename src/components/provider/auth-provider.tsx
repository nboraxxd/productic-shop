'use client'

import { useState } from 'react'

import { isBrowser } from '@/utils'
import { clientSessionToken } from '@/utils/http'

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

  return children
}
