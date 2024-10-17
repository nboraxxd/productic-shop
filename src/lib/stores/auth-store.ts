import { create } from 'zustand'

type AuthStore = {
  sessionToken: string
  setSessionToken: (token: string) => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
  sessionToken: '',
  setSessionToken: (token) => set({ sessionToken: token }),
}))
