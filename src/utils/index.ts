import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

import { clientSessionToken } from '@/utils/http'
import { differenceInMinutes } from 'date-fns'
import authApi from '@/api-requests/auth.api'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isBrowser = typeof window !== 'undefined'

/**
 * Add a leading slash to a URL if it doesn't already have one, e.g. `about` or `/about` -> `/about`.
 * @param url - The URL to add a leading slash to.
 * @returns The URL with a leading slash.
 */
export function addLeadingSlash(url: string) {
  return url.startsWith('/') ? url : `/${url}`
}

export async function checkAndSlideSessionToken(params?: { onSuccess?: () => void; onError?: () => void }) {
  const sessionToken = clientSessionToken.value
  const expiresAt = clientSessionToken.expiresAt

  if (!sessionToken) return

  const now = new Date()

  // Trường hợp không có expiresAt là trường hợp vừa vào trang web, cần slide session token
  // Trường hợp expiresAt - now < 10 phút cũng cần slide session token
  if (!expiresAt || differenceInMinutes(new Date(expiresAt), now) < 10) {
    try {
      const res = await authApi.slideSessionFromBrowserToServer()

      clientSessionToken.expiresAt = res.payload.data.expiresAt
      params?.onSuccess?.()
    } catch (_error) {
      params?.onError?.()
    }
  }
}
