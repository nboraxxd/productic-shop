import envVariables from '@/lib/schema-validations/env-variables.schema'
import { addLeadingSlash } from '@/utils'
import { omit } from 'lodash'

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

const request = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  options?: CustomOptions
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined
  const baseHeaders: HeadersInit = {
    'Content-Type': 'application/json',
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

  if (!response.ok) {
    throw new HttpError(data)
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
