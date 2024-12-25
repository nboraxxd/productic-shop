'use client'

import ms from 'ms'
import { useEffect, useRef } from 'react'

import { checkAndSlideSessionToken } from '@/utils'
import { usePathname, useRouter } from 'next/navigation'

export default function SlideSession() {
  const ref = useRef<unknown>(null)

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null

    const onError = () => {
      if (interval) {
        clearInterval(interval)
      }
    }

    if (!ref.current) {
      ref.current = checkAndSlideSessionToken

      // Phải gọi 1 lần đầu tiên vì interval sẽ chỉ chạy sau thời gian TIMEOUT
      checkAndSlideSessionToken({
        onError,
      })

      timeout = setTimeout(() => {
        ref.current = null
      }, 1000)
    }

    // Thời gian hết hạn của session token là 1 tiếng
    // Cứ mỗi 5 phút sẽ kiểm tra session token và slide nếu cần
    // Nếu expiredAt - now < 10 phút thì sẽ slide session token
    const interval = setInterval(async () => {
      checkAndSlideSessionToken({
        onError,
      })
    }, ms('5m'))

    return () => {
      if (timeout) clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [pathname, router])

  return null
}
