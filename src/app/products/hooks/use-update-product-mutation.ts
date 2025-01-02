import productApi from '@/api-requests/product.api'
import revalidateApi from '@/api-requests/revalidate.api'
import { UpdateProductBodyType } from '@/lib/schema-validations/product.schema'
import { useMutation } from '@tanstack/react-query'

export default function useUpdateProductMutation() {
  return useMutation({
    mutationFn: ({ id, ...rest }: UpdateProductBodyType & { id: number }) =>
      productApi.updateProductFromBrowserToBackend(id, rest),
    onSuccess: async ({
      payload: {
        data: { id },
      },
    }) => {
      await revalidateApi.revalidateTag('products')
      await revalidateApi.revalidateTag(`products/${id}`)
    },
  })
}
