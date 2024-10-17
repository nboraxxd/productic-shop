import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { VercelLogoIcon } from '@radix-ui/react-icons'
import { ModeToggle } from '@/components/shared'

export default function Header() {
  return (
    <header className="container flex h-header-height w-full items-center justify-between border-b border-b-foreground/10">
      <Button
        asChild
        variant="ghost"
        className="inline-block px-2 transition-transform hover:scale-110 hover:bg-transparent active:scale-105"
      >
        <Link href="/">
          <VercelLogoIcon className="size-6" />
        </Link>
      </Button>

      <ModeToggle />
    </header>
  )
}
