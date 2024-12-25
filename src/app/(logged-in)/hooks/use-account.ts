import accountApi from '@/api-requests/account.api'
import { useAuthStore } from '@/app/(logged-in)/stores/auth-store'
import { QUERY_KEY } from '@/constants/tanstack-key'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export function useGetMeQuery() {
  const setMe = useAuthStore((state) => state.setMe)

  const getMeQuery = useQuery({
    queryKey: [QUERY_KEY.ME],
    queryFn: () => accountApi.getMeFromBrowserToBackend(),
  })

  useEffect(() => {
    if (getMeQuery.isSuccess) {
      setMe(getMeQuery.data.payload.data)
    }
  }, [getMeQuery.data?.payload.data, getMeQuery.isSuccess, setMe])

  return getMeQuery
}

export function useUpdateMeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: accountApi.upadateMeFromBrowserToBackend,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ME] })
    },
  })
}
