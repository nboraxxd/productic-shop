import Image from 'next/image'
import { cache } from 'react'
import { Metadata } from 'next'

import { ParamsProps } from '@/types'
import { handleErrorApi } from '@/utils/errors'
import productApi from '@/api-requests/product.api'
import { baseOpenGraph } from '@/constants/shared-metadata'
import envVariables from '@/lib/schema-validations/env-variables.schema'

import { Heading } from '@/components/shared'
import { ProductResponseType } from '@/lib/schema-validations/product.schema'

const getProduct = cache(productApi.getProduct)

export async function generateMetadata({ params }: ParamsProps): Promise<Metadata> {
  let product: ProductResponseType['data'] | null = null

  try {
    const response = await getProduct(Number(params.id))

    product = response.payload.data
  } catch (error) {
    handleErrorApi({ error })
  }

  if (!product) {
    return {
      title: 'Không tìm thấy sản phẩm',
      description: 'Không tìm thấy sản phẩm',
    }
  }

  const url = `${envVariables.NEXT_PUBLIC_URL}/products/${params.id}`
  const title = product.name
  const description = product.description
  const image = product.image

  return {
    title,
    description,
    openGraph: {
      ...baseOpenGraph,
      title,
      description,
      url,
      images: [{ url: image, alt: title }],
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function ProductDetailPage({ params: { id: productId } }: ParamsProps) {
  let product: ProductResponseType['data'] | null = null

  try {
    const response = await getProduct(Number(productId))

    product = response.payload.data
  } catch (error) {
    handleErrorApi({ error })
  }

  return (
    <div>
      {product ? (
        <>
          <Heading>{product.name}</Heading>
          <div className="mt-4 flex flex-col items-center">
            <Image
              src={product.image}
              alt={product.name}
              width={3600}
              height={3600}
              priority
              className="size-[900px] object-cover"
            />
            <div className="mt-3">
              <p>
                ID: <span className="text-lg font-bold">{product.id}</span>
              </p>
              <p>
                Price: <span className="text-lg font-bold">{product.price}</span>
              </p>
              <p>
                Description: <span className="text-lg font-bold">{product.description}</span>
              </p>
            </div>
          </div>
        </>
      ) : (
        <Heading>Không tìm thấy sản phẩm</Heading>
      )}
    </div>
  )
}
