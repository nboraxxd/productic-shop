import { cache } from 'react'
import { Metadata } from 'next'

import productApi from '@/api-requests/product.api'
import { ParamsProps } from '@/types'

import { Heading } from '@/components/shared'
import { ProductForm } from '@/app/products/_components'
import { ProductResponseType } from '@/lib/schema-validations/product.schema'
import { notFound } from 'next/navigation'
import { HttpError } from '@/utils/errors'

const getProduct = cache(productApi.getProduct)

export async function generateMetadata({ params }: ParamsProps): Promise<Metadata> {
  // read route params
  const productId = params.id

  let product: ProductResponseType['data'] | null = null

  try {
    const response = await getProduct(Number(productId))
    product = response.payload.data
  } catch (error) {
    if (error instanceof HttpError) {
      notFound()
    }
  }

  return product
    ? {
        title: `Edit ${product.name}`,
        description: product.description,
      }
    : notFound()
}

export default async function EditProductPage({ params: { id: productId } }: ParamsProps) {
  let product: ProductResponseType['data'] | null = null

  try {
    const response = await getProduct(Number(productId))
    product = response.payload.data
  } catch (error) {
    if (error instanceof HttpError) {
      return notFound()
    }
  }

  return product ? (
    <div className="container p-4">
      <Heading>Edit {product.name} to Next free</Heading>
      <div className="mx-auto mt-5 flex w-full max-w-96 flex-col">
        <ProductForm product={product} />
      </div>
    </div>
  ) : (
    notFound()
  )
}
