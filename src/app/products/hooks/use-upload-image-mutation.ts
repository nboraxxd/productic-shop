import { useMutation } from '@tanstack/react-query'
import mediaApi from '@/api-requests/media.api'

export default function useUploadImageMutation() {
  return useMutation({
    mutationFn: mediaApi.uploadImageFromBrowserToBackend,
  })
}
