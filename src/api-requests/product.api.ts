import http from '@/utils/http'
import { MessageResponse } from '@/types'
import {
  AddProductBodyType,
  ProductResponseType,
  ProductsResponseType,
  UpdateProductBodyType,
} from '@/lib/schema-validations/product.schema'

const productApi = {
  // API of backend server
  getProducts: () => http.get<ProductsResponseType>('/products', { next: { tags: ['products'] } }),

  getProduct: (id: number) => http.get<ProductResponseType>(`/products/${id}`),

  addProductFromBrowserToBackend: (body: AddProductBodyType) => http.post<ProductResponseType>('/products', body),

  updateProductFromBrowserToBackend: (id: number, body: UpdateProductBodyType) =>
    http.put<ProductResponseType>(`/products/${id}`, body),

  deleteProductFromBrowserToBackend: (id: number) => http.delete<MessageResponse>(`/products/${id}`),
}

export default productApi
