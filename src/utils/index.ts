import jwt from 'jsonwebtoken'
import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'
import { TokenPayload } from '@/types/jwt.types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isBrowser = typeof window !== 'undefined'

/**
 *
 * @param token - The token to decode.
 * @returns The decoded token, including the user ID, token type, issued at, and expiration time.
 */
export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload
}

/**
 * Add a leading slash to a URL if it doesn't already have one, e.g. `about` or `/about` -> `/about`.
 * @param url - The URL to add a leading slash to.
 * @returns The URL with a leading slash.
 */
export function addLeadingSlash(url: string) {
  return url.startsWith('/') ? url : `/${url}`
}
