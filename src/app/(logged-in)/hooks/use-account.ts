import accountApi from '@/api-requests/account.api'
import { useQuery } from '@tanstack/react-query'

export function useAccountQuery() {
  return useQuery({
    queryKey: ['account'],
    queryFn: () => accountApi.getMeFromBrowserToBackend(),
  })
}
