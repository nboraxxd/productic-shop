'use client'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { handleErrorApi } from '@/utils/errors'
import { useDeleteProductMutation } from '@/app/products/hooks'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

export default function DeleteProductBtn({ productId }: { productId: number }) {
  const router = useRouter()
  const deleteProductMutation = useDeleteProductMutation()

  async function handleDeleteProduct() {
    if (deleteProductMutation.isPending) return

    try {
      const result = await deleteProductMutation.mutateAsync(productId)

      toast.success(result.payload.message)
      router.refresh()
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the product.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
            onClick={handleDeleteProduct}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
