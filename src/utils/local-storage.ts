import { isBrowser } from '@/utils'

const SESSION_TOKEN = 'sessionToken'

export const localStorageEventTarget = new EventTarget()

export const setSessionTokenToLocalStorage = (token: string) => localStorage.setItem(SESSION_TOKEN, token)

export const getSessionTokenFromLocalStorage = () => (isBrowser ? localStorage.getItem(SESSION_TOKEN) : null)

export const removeTokensFromLocalStorage = (isForce: boolean = false) => {
  localStorage.removeItem(SESSION_TOKEN)

  if (isForce) localStorageEventTarget.dispatchEvent(new Event('removeLocalStorage'))
}
