import { isBrowser } from '@/utils'

const SESSION_TOKEN = 'sessionToken'
const SESSION_TOKEN_EXPIRES_AT = 'sessionTokenExpiresAt'

export const localStorageEventTarget = new EventTarget()

export const setSessionTokenToLocalStorage = (token: string) => localStorage.setItem(SESSION_TOKEN, token)

export const getSessionTokenFromLocalStorage = () => (isBrowser ? localStorage.getItem(SESSION_TOKEN) : null)

export const setSessionTokenExpiresAtToLocalStorage = (expiresAt: string) =>
  localStorage.setItem(SESSION_TOKEN_EXPIRES_AT, expiresAt)

export const getSessionTokenExpiresAtFromLocalStorage = () =>
  isBrowser ? localStorage.getItem(SESSION_TOKEN_EXPIRES_AT) : null

export const removeTokensFromLocalStorage = (isForce: boolean = false) => {
  localStorage.removeItem(SESSION_TOKEN)
  localStorage.removeItem(SESSION_TOKEN_EXPIRES_AT)

  if (isForce) localStorageEventTarget.dispatchEvent(new Event('removeLocalStorage'))
}
