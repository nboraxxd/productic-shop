import omit from 'lodash/omit'

import { addLeadingSlash, isBrowser } from '@/utils'
import { HttpStatusCode, StatusCodeType } from '@/constants/http-status-code'
import { EntityError, EntityErrorPayload, HttpError } from '@/utils/errors'
import { AuthResponseType } from '@/lib/schema-validations/auth.schema'
import envVariables from '@/lib/schema-validations/env-variables.schema'

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string
  headers?: HeadersInit & { Authorization?: string }
  params?: string | Record<string, string> | URLSearchParams | string[][]
}

type CustomOptionsExcluedBody = Omit<CustomOptions, 'body'>

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
  // Dự án này backend yêu cầu Body cannot be empty when content-type is set to 'application/json'
  // Nên nếu không có body thì body sẽ là {}
  const body = JSON.stringify(options?.body || {})

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
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  })

  const payload: T = await response.json()

  const data = {
    statusCode: response.status as StatusCodeType,
    payload,
  }

  // Interceptors error
  if (!response.ok) {
    if (response.status === HttpStatusCode.UnprocessableEntity) {
      const omittedPayload: EntityErrorPayload = omit(
        payload as EntityErrorPayload & { statusCode: typeof HttpStatusCode.UnprocessableEntity },
        'statusCode'
      )

      throw new EntityError(omittedPayload)
    } else {
      throw new HttpError(data)
    }
  }

  // Interceptors response
  if (isBrowser && ['/auth/login', '/auth/register'].includes(addLeadingSlash(url))) {
    clientSessionToken.value = (payload as AuthResponseType).data.token
  } else if (isBrowser && addLeadingSlash(url) === '/api/auth/logout') {
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
