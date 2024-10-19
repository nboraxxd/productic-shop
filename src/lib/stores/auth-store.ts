import { create } from 'zustand'

type AuthStore = {
  sessionToken: string | null
  setSessionToken: (token: string) => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
  sessionToken: null,
  setSessionToken: (token) => set({ sessionToken: token }),
}))
