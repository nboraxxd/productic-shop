import http from '@/utils/http'
import { AccountResponseType, UpdateMeSchemaType } from '@/lib/schema-validations/account.schema'

const PREFIX = '/account'

const accountApi = {
  // API OF BACKEND SERVER
  getMeFromBrowserToBackend: () => http.get<AccountResponseType>(`${PREFIX}/me`),

  upadateMeFromBrowserToBackend: (body: UpdateMeSchemaType) => http.put<AccountResponseType>(`${PREFIX}/me`, body),

  // API OF NEXT.JS SERVER
  getMeFromServerToBackend: (sessionToken: string) => {
    return http.get<AccountResponseType>(`${PREFIX}/me`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    })
  },
}

export default accountApi
