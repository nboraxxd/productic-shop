import { useMutation } from '@tanstack/react-query'

import authApi from '@/api-requests/auth.api'

export function useSetTokenToServerMutation() {
  return useMutation({
    mutationFn: authApi.setTokenFromBrowserToServer,
  })
}

export function useRegisterMutation() {
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
    },
  })
}

export function useLoginMutation() {
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
    },
  })
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: authApi.logoutFromBrowserToServer,
  })
}
