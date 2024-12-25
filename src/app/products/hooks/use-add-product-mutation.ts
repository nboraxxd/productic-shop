import productApi from '@/api-requests/product.api'
import revalidateApi from '@/api-requests/revalidate.api'
import { useMutation } from '@tanstack/react-query'

export default function useAddProductMutation() {
  return useMutation({
    mutationFn: productApi.addProductFromBrowserToBackend,
    onSuccess: async () => {
      await revalidateApi('products')
    },
  })
}
