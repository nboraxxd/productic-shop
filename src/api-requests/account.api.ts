import http from '@/utils/http'
import { AccountResponseType } from '@/lib/schema-validations/account.schema'

const accountApi = {
  // API OF BACKEND SERVER
  getMeFromBrowserToBackend: () => http.get<AccountResponseType>('/account/me'),

  // API OF NEXT.JS SERVER
  getMeFromServerToBackend: (sessionToken: string) => {
    return http.get<AccountResponseType>('/account/me', {
      headers: { Authorization: `Bearer ${sessionToken}` },
    })
  },
}

export default accountApi
