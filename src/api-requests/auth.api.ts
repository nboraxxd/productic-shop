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
  // API FROM NEXT.JS APP TO BACKEND
  registerFromBrowserToBackend: (body: RegisterBodyType) => http.post<AuthResponseType>('/auth/register', body),

  loginFromBrowserToBackend: (body: LoginBodyType) => http.post<AuthResponseType>('/auth/login', body),

  logoutFromServerToBackend: (sessionToken: string) =>
    http.post<MessageResponse>('/auth/logout', null, { headers: { Authorization: `Bearer ${sessionToken}` } }),

  // API FROM BROWSER TO SERVER NEXT.JS
  setTokenFromBrowserToServer: (body: SetTokenBodyType) =>
    http.post<MessageResponse>('/api/auth/set-token', body, { baseUrl: envVariables.NEXT_PUBLIC_URL }),

  logoutFromBrowserToServer: () =>
    http.post<MessageResponse>('/api/auth/logout', null, { baseUrl: envVariables.NEXT_PUBLIC_URL }),
}

export default authApi
