import omit from 'lodash/omit'

import { addLeadingSlash, isBrowser } from '@/utils'
import envVariables from '@/lib/schema-validations/env-variables.schema'
import { AuthResponseType } from '@/lib/schema-validations/auth.schema'

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string
  headers?: HeadersInit & { Authorization?: string }
  params?: string | Record<string, string> | URLSearchParams | string[][]
}

type CustomOptionsExcluedBody = Omit<CustomOptions, 'body'>

class HttpError extends Error {
  status: number
  payload: {
    message: string
    [key: string]: any
  }

  constructor({ status, payload }: { status: number; payload: any }) {
    super('HTTP Error')
    this.status = status
    this.payload = payload
  }
}

class SessionToken {
  private token: string | null = null
  private _expiresAt = new Date().toISOString()

  get value() {
    return this.token
  }

  set value(token: string | null) {
    if (!isBrowser) {
      throw new Error('Cannot set token on server side')
    }
    this.token = token
  }

  get expiresAt() {
    return this._expiresAt
  }

  set expiresAt(expiresAt: string) {
    if (!isBrowser) {
      throw new Error('Cannot set expiresAt on server side')
    }
    this._expiresAt = expiresAt
  }
}

export const clientSessionToken = new SessionToken()

const request = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  options?: CustomOptions
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined

  const baseHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: clientSessionToken.value ? `Bearer ${clientSessionToken.value}` : '',
  }

  // Nếu không truyền base URL thì mặc định sẽ là backend endpoint
  const baseUrl = options?.baseUrl || envVariables.NEXT_PUBLIC_API_ENDPOINT

  const searchParams = new URLSearchParams(options?.params)
  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : ''

  const fullUrl = `${baseUrl}${addLeadingSlash(url)}${queryString}`

  const response = await fetch(fullUrl, {
    ...omit(options, 'baseUrl', 'params', 'headers'),
    body,
    method,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
  })

  const payload: T = await response.json()

  const data = {
    status: response.status,
    payload,
  }

  // Interceptors error
  if (!response.ok) {
    throw new HttpError(data)
  }

  // Interceptors response
  if (isBrowser && ['/auth/login', '/auth/register'].includes(addLeadingSlash(url))) {
    clientSessionToken.value = (payload as AuthResponseType).data.token
  } else if (isBrowser && addLeadingSlash(url) === '/auth/logout') {
    clientSessionToken.value = null
  }

  return data
}

const http = {
  get<Response>(url: string, options?: CustomOptionsExcluedBody) {
    return request<Response>('GET', url, options)
  },
  post<Response>(url: string, body: any, options?: CustomOptionsExcluedBody) {
    return request<Response>('POST', url, { ...options, body })
  },
  put<Response>(url: string, body: any, options?: CustomOptionsExcluedBody) {
    return request<Response>('PUT', url, { ...options, body })
  },
  patch<Response>(url: string, body: any, options?: CustomOptionsExcluedBody) {
    return request<Response>('PATCH', url, { ...options, body })
  },
  delete<Response>(url: string, options?: CustomOptionsExcluedBody) {
    return request<Response>('DELETE', url, options)
  },
}

export default http
