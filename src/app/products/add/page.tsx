import { Metadata } from 'next'

import { Heading } from '@/components/shared'
import { ProductForm } from '@/app/products/_components'

export const metadata: Metadata = {
  title: 'Add product',
  description: 'This is the add product page of the app.',
}

export default function AddProductPage() {
  return (
    <div className="container p-4">
      <Heading>Add product to Next free</Heading>
      <div className="mx-auto mt-5 flex w-full max-w-96 flex-col">
        <ProductForm />
      </div>
    </div>
  )
}
