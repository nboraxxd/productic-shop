import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { compareDesc, parseISO } from 'date-fns'

import productApi from '@/api-requests/product.api'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/shared'
import { ProductCommands } from '@/app/products/_components'

export const metadata: Metadata = {
  title: 'Products',
  description: 'This is the products page of the app',
}

export default async function ProductsPage() {
  const response = await productApi.getProducts()

  const sortedProducts = [...response.payload.data].sort((a, b) =>
    compareDesc(parseISO(a.updatedAt), parseISO(b.updatedAt))
  )

  return (
    <div>
      <Heading>Product List</Heading>
      <div className="mx-auto mt-8 max-w-2xl space-y-7">
        {sortedProducts.map((product, index) => (
          <div key={product.id} className="flex space-x-5">
            <Image
              src={product.image}
              alt={product.name}
              width={180}
              height={180}
              className="size-32 object-cover"
              priority={index < 7}
            />
            <div className="flex flex-col gap-6">
              <div className="flex gap-3">
                <h3>id: {product.id}</h3>
                <h3>Name: {product.name}</h3>
                <p>Price: {product.price}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant={'outline'} asChild>
                  <Link href={`/products/${product.id}`}>View</Link>
                </Button>
                <ProductCommands productId={product.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
