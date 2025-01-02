import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const loggedInPaths = ['/me', '/me/update', '/profile', '/products/add', '/products/edit']
const loggedOutPaths = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const sessionToken = request.cookies.get('sessionToken')?.value

  if (loggedInPaths.some((loggedInPath) => pathname.startsWith(loggedInPath) && !sessionToken)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)

    return NextResponse.redirect(loginUrl)
  }

  if (loggedOutPaths.some((loggedOutPath) => pathname.startsWith(loggedOutPath) && sessionToken)) {
    return NextResponse.redirect(new URL('/me', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/me', '/profile', '/login', '/register', '/products/:path*'],
}
