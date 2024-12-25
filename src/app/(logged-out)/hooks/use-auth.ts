import { useMutation } from '@tanstack/react-query'

import authApi from '@/api-requests/auth.api'
import { useAuthStore } from '@/app/(logged-in)/stores/auth-store'

export function useSetTokenToServerMutation() {
  return useMutation({
    mutationFn: authApi.setTokenFromBrowserToServer,
  })
}

export function useRegisterMutation() {
  const setIsAuth = useAuthStore((state) => state.setIsAuth)
  const setTokenToServerMutation = useSetTokenToServerMutation()

  return useMutation({
    mutationFn: authApi.registerFromBrowserToBackend,
    onSuccess: async ({
      payload: {
        data: { expiresAt, token },
      },
    }) => {
      await setTokenToServerMutation.mutateAsync({
        expiresAt,
        token,
      })
      setIsAuth(true)
    },
  })
}

export function useLoginMutation() {
  const setIsAuth = useAuthStore((state) => state.setIsAuth)
  const setTokenToServerMutation = useSetTokenToServerMutation()

  return useMutation({
    mutationFn: authApi.loginFromBrowserToBackend,
    onSuccess: async ({
      payload: {
        data: { expiresAt, token },
      },
    }) => {
      await setTokenToServerMutation.mutateAsync({
        expiresAt,
        token,
      })
      setIsAuth(true)
    },
  })
}
