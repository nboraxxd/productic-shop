import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { AccountDataResponseType } from '@/lib/schema-validations/account.schema'
import { isBrowser } from '@/utils'
import { getSessionTokenFromLocalStorage } from '@/utils/local-storage'

type AuthStore = {
  isAuth: boolean
  setIsAuth: (isAuth: boolean) => void
  me: AccountDataResponseType | null
  setMe: (me: AccountDataResponseType | null) => void
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      isAuth: Boolean(getSessionTokenFromLocalStorage()),
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
