import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import http from '@/utils/http'
import { SuccessResponse } from '@/types'
import { AccountDataResponseType } from '@/lib/schema-validations/account.schema'

const accountApi = {
  // API OF BACKEND SERVER
  getMeFromBrowserToBackend: () => http.get<SuccessResponse<AccountDataResponseType>>('/account/me'),

  // API OF NEXT.JS SERVER
  getMeFromServerToBackend: () => {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('sessionToken')

    if (!sessionToken) redirect('/login')

    return http.get<SuccessResponse<AccountDataResponseType>>('/account/me', {
      headers: { Authorization: `Bearer ${sessionToken.value}` },
    })
  },
}

export default accountApi
