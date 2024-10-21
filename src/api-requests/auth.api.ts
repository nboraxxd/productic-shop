import http from '@/utils/http'
import { MessageResponse } from '@/types'
import envVariables from '@/lib/schema-validations/env-variables.schema'
import {
  AuthResponseType,
  LoginBodyType,
  RegisterBodyType,
  SetTokenBodyType,
} from '@/lib/schema-validations/auth.schema'

const authApi = {
  // API OF BACKEND SERVER
  registerFromBrowserToBackend: (body: RegisterBodyType) => http.post<AuthResponseType>('/auth/register', body),

  loginFromBrowserToBackend: (body: LoginBodyType) => http.post<AuthResponseType>('/auth/login', body),

  // API OF NEXT.JS SERVER
  setTokenFromBrowserToServer: (body: SetTokenBodyType) =>
    http.post<MessageResponse>('/api/auth/set-token', body, { baseUrl: envVariables.NEXT_PUBLIC_URL }),
}

export default authApi
