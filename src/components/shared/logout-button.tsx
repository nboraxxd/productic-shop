'use client'

import { Button } from '@/components/ui/button'

export default function LogoutButton() {
  const handleLogout = async () => {
    console.log('logout')
  }

  return (
    <Button onClick={handleLogout} variant={'outline'}>
      Logout
    </Button>
  )
}
