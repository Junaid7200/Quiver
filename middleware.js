import { updateSession } from './src/utils/supabase/middleware'
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const response = await updateSession(request)
  const { user } = response

  const path = request.nextUrl.pathname

  if (path.startsWith('/dashboard')) {
    if (!user || !user.email_confirmed_at) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
