import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Roboto } from 'next/font/google'

import { baseOpenGraph } from '@/constants/shared-metadata'

import { Toaster } from '@/components/ui/sonner'
import { Header, SlideSession } from '@/components/shared'
import { TanstackQueryProvider, AuthProvider, ThemeProvider } from '@/components/provider'
import '@/app/globals.css'

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Next free',
    default: 'Next free',
  },
  description: 'This is the main layout of the app.',
  openGraph: baseOpenGraph,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('sessionToken')

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.className} ${roboto.variable} antialiased`}>
        <TanstackQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthProvider initialSessionToken={sessionToken?.value}>
              <Header />
              {children}
              <SlideSession />
            </AuthProvider>
            <Toaster />
          </ThemeProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  )
}
