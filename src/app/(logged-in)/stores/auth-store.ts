import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { clientSessionToken } from '@/utils/http'
import { AccountDataResponseType } from '@/lib/schema-validations/account.schema'
import { isBrowser } from '@/utils'

type AuthStore = {
  isAuth: boolean
  setIsAuth: (isAuth: boolean) => void
  me: AccountDataResponseType | null
  setMe: (me: AccountDataResponseType | null) => void
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      isAuth: Boolean(clientSessionToken.value),
      setIsAuth: (isAuth) => set({ isAuth }),
      me: null,
      setMe: (me) => set({ me }),
    }),
    {
      name: 'authStore',
      enabled: isBrowser,
    }
  )
)
