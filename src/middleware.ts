import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import PocketBase from 'pocketbase';

const ADMIN_PROTECTED_PATHS = ['/blog/admin', '/admin'];
const IGNORED_PATHS = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/static'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (IGNORED_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const requiresAdmin = ADMIN_PROTECTED_PATHS.some(path =>
    pathname.startsWith(path)
  );

  if (!requiresAdmin) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get('pb_auth');

  if (!authCookie?.value) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  try {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

    const authData = JSON.parse(authCookie.value);

    if (!authData.token || !authData.model) {
      throw new Error('Invalid auth data structure');
    }

    pb.authStore.save(authData.token, authData.model);

    try {
      const authRefresh = await pb.collection('users').authRefresh();

      if (!authRefresh.record || authRefresh.record.role !== 'admin') {
        console.log('User is not admin:', authRefresh.record?.role);
        return NextResponse.redirect(new URL('/blog', request.url));
      }

      return NextResponse.next();
    } catch (refreshError) {
      console.log('Token refresh failed:', refreshError);
      throw new Error('Token validation failed');
    }
  } catch (error) {
    console.error('Middleware auth error:', error);

    const response = NextResponse.redirect(
      new URL('/auth/sign-in', request.url)
    );
    response.cookies.delete('pb_auth');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};
