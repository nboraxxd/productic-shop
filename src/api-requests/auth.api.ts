import http from '@/utils/http'
import { MessageResponse, SuccessResponse } from '@/types'
import envVariables from '@/lib/schema-validations/env-variables.schema'
import {
  AuthDataResponseType,
  LoginBodyType,
  RegisterBodyType,
  SetTokenBodyType,
} from '@/lib/schema-validations/auth.schema'

const authApi = {
  // API OF BACKEND SERVER
  registerFromBrowserToBackend: (body: RegisterBodyType) =>
    http.post<SuccessResponse<AuthDataResponseType>>('/auth/register', body),

  loginFromBrowserToBackend: (body: LoginBodyType) =>
    http.post<SuccessResponse<AuthDataResponseType>>('/auth/login', body),

  // API OF NEXT.JS SERVER
  setTokenFromBrowserToServer: (body: SetTokenBodyType) =>
    http.post<SuccessResponse<MessageResponse>>('/api/auth/set-token', body, { baseUrl: envVariables.NEXT_PUBLIC_URL }),
}

export default authApi
