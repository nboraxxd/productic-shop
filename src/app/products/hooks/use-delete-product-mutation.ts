import productApi from '@/api-requests/product.api'
import revalidateApi from '@/api-requests/revalidate.api'
import { useMutation } from '@tanstack/react-query'

export default function useDeleteProductMutation() {
  return useMutation({
    mutationFn: productApi.deleteProductFromBrowserToBackend,
    onSuccess: async () => {
      await revalidateApi.revalidateTag('products')
    },
  })
}
