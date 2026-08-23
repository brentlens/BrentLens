// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET)

const ROUTES = {
  admin: [],
  user: [],
  public: ['/login', '/signup', '/admin/login'],
}

export async function proxy(req: NextRequest) {
  const token = req.cookies.get('auth-token')?.value
  const { pathname } = req.nextUrl

  // 1. Verify the JWT
  let payload: any = null
  if (token) {
    try {
      const { payload: verifiedPayload } = await jwtVerify(token, SECRET_KEY)
      payload = verifiedPayload
    } catch (err) {
      // Token expired or invalid
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  const userRole = payload?.role // 'admin' or 'user'
  const portal = payload?.portal // to get portal (admin/user)

  // 2. Logic for Authenticated Users trying to access Login/Signup
  if (token && ROUTES.public.includes(pathname)) {
    return NextResponse.redirect(new URL(userRole === 'admin' ? '/admin/dashboard' : '/home', req.url))
  }

  if (pathname.match('/admin/login')) {
    return NextResponse.next()
  }

  // 3. Admin Route Guard
  if (pathname.startsWith('/admin')) {
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  // 4. User Route Guard (General Registered Users)
  if (ROUTES.user.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    // Prevent Admins from seeing User-specific pages if you want strict separation
    // if (userRole === 'admin') {
    //    return NextResponse.redirect(new URL('/admin', req.url))
    // }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}