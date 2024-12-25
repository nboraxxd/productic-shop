import { useMutation } from '@tanstack/react-query'
import authApi from '@/api-requests/auth.api'
import { useAuthStore } from '@/app/(logged-in)/stores/auth-store'

export function useLogoutMutation() {
  const setIsAuth = useAuthStore((state) => state.setIsAuth)
  const setMe = useAuthStore((state) => state.setMe)

  return useMutation({
    mutationFn: authApi.logoutFromBrowserToServer,
    onSuccess: () => {
      setIsAuth(false)
      setMe(null)
    },
  })
}
