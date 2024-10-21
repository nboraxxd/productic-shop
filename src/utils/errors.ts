import { toast } from 'sonner'
import { UseFormSetError } from 'react-hook-form'

import { isBrowser } from '@/utils'
import { HttpStatusCode, StatusCodeType } from '@/constants/http-status-code'

export type EntityErrorPayload = {
  message: string
  errors: {
    field: string
    message: string
  }[]
}

export class HttpError extends Error {
  statusCode: number
  payload: {
    message: string
    [key: string]: any
  }

  constructor({
    statusCode,
    payload,
    message = 'Http Error',
  }: {
    statusCode: StatusCodeType
    payload: any
    message?: string
  }) {
    super(message)
    this.statusCode = statusCode
    this.payload = payload
  }
}

export class EntityError extends HttpError {
  statusCode: (typeof HttpStatusCode)['UnprocessableEntity'] = HttpStatusCode.UnprocessableEntity
  payload: EntityErrorPayload

  constructor(payload: EntityErrorPayload) {
    super({ statusCode: HttpStatusCode.UnprocessableEntity, payload, message: 'Entity Error' })
    this.payload = payload
  }
}

export const handleErrorApi = ({ error, setError }: { error: any; setError?: UseFormSetError<any> }) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach(({ field, message }) => {
      setError(field, { type: 'server', message })
    })
  } else if (error instanceof DOMException) {
    console.log('AbortError:', error.message)
  } else {
    if (isBrowser) {
      toast.error(error.payload?.message || error.toString())
    } else {
      console.log('🔥 ~ server ~ error:', error)
    }
  }
}
