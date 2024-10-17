import { HttpStatusCode, TStatusCode } from '@/constants/http-status-code'

type EntityErrorPayload = {
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
    statusCode: TStatusCode
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
