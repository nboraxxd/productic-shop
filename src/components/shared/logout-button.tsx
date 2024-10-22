'use client'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { useLogoutMutation } from '@/app/(logged-out)/hooks'

export default function LogoutButton() {
  const logoutMutation = useLogoutMutation()
  const router = useRouter()

  async function handleLogout() {
    const response = await logoutMutation.mutateAsync()

    toast.success(response.payload.message)

    router.refresh()
  }

  return (
    <Button onClick={handleLogout} variant={'outline'}>
      Logout
    </Button>
  )
}
