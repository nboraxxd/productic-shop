import omit from 'lodash/omit'
import { redirect } from 'next/navigation'

import { addLeadingSlash, isBrowser } from '@/utils'
import {
  getSessionTokenFromLocalStorage,
  removeTokensFromLocalStorage,
  setSessionTokenExpiresAtToLocalStorage,
  setSessionTokenToLocalStorage,
} from '@/utils/local-storage'
import { EntityError, EntityErrorPayload, HttpError } from '@/utils/errors'
import { HttpStatusCode, StatusCodeType } from '@/constants/http-status-code'
import { AuthResponseType } from '@/lib/schema-validations/auth.schema'
import envVariables from '@/lib/schema-validations/env-variables.schema'

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string
  headers?: HeadersInit & { Authorization?: string }
  params?: string | Record<string, string> | URLSearchParams | string[][]
}

type CustomOptionsExcluedBody = Omit<CustomOptions, 'body'>

// Phải đưa clientLogoutRequest vào global scope
// vì nếu đặt trong hàm request thì mỗi lần request sẽ tạo ra một clientLogoutRequest mới
let clientLogoutRequest: Promise<any> | null = null

const request = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  options?: CustomOptions
) => {
  // Dự án này backend yêu cầu Body cannot be empty when content-type is set to 'application/json'
  const body = options?.body instanceof FormData ? options.body : JSON.stringify(options?.body)

  const baseHeaders: HeadersInit = options?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }

  // Nếu không truyền base URL thì mặc định sẽ là backend endpoint
  const baseUrl = options?.baseUrl || envVariables.NEXT_PUBLIC_API_ENDPOINT

  const searchParams = new URLSearchParams(options?.params)
  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : ''

  const fullUrl = `${baseUrl}${addLeadingSlash(url)}${queryString}`

  if (isBrowser) {
    const accessToken = getSessionTokenFromLocalStorage()
    if (accessToken) baseHeaders.Authorization = `Bearer ${accessToken}`
  }

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
    } else if (response.status === HttpStatusCode.Unauthorized) {
      // clientLogoutRequest dùng để tránh việc gửi nhiều request logout cùng một lúc
      if (isBrowser && !clientLogoutRequest) {
        // phải thực hiện thủ công gọi đến route handler logout bằng fetch
        // đây là file cơ sở, không nên dùng các method trong api-requests
        // vì các method trong api-requests dùng file cơ sở này
        // gọi qua, gọi lại vậy sẽ gây ra chồng chéo import
        clientLogoutRequest = fetch('/api/auth/logout', {
          method: 'POST',
          body: null,
          headers: { ...baseHeaders },
        })

        try {
          await clientLogoutRequest
        } catch (error) {
          console.log('😰 clientLogoutRequest', error)
        } finally {
          removeTokensFromLocalStorage(true)
          clientLogoutRequest = null
        }
      } else if (!isBrowser) {
        const sessionToken = options?.headers?.Authorization?.split('Bearer ')[1] || ''
        redirect(`/logout?sessionToken=${sessionToken}`)
      }

      throw new HttpError(data)
    } else {
      throw new HttpError(data)
    }
  }

  // Interceptors response
  if (isBrowser && ['/auth/login', '/auth/register'].includes(addLeadingSlash(url))) {
    setSessionTokenToLocalStorage((payload as AuthResponseType).data.token)
    setSessionTokenExpiresAtToLocalStorage((payload as AuthResponseType).data.expiresAt)
  } else if (isBrowser && addLeadingSlash(url) === '/api/auth/logout') {
    removeTokensFromLocalStorage()
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
