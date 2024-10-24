'use client'

import ms from 'ms'
import { useEffect, useRef } from 'react'

import { checkAndSlideSessionToken } from '@/utils'

export default function SlideSession() {
  const ref = useRef<unknown>(null)

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null

    if (!ref.current) {
      ref.current = checkAndSlideSessionToken

      // Phải gọi 1 lần đầu tiên vì interval sẽ chỉ chạy sau thời gian TIMEOUT
      checkAndSlideSessionToken()

      timeout = setTimeout(() => {
        ref.current = null
      }, 1000)
    }

    const interval = setInterval(async () => {
      checkAndSlideSessionToken()
    }, ms('20s'))

    return () => {
      if (timeout) clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [])

  return null
}
