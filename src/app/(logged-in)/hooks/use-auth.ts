import { useMutation } from '@tanstack/react-query'
import authApi from '@/api-requests/auth.api'

export function useLogoutMutation() {
  return useMutation({
    mutationFn: authApi.logoutFromBrowserToServer,
  })
}
