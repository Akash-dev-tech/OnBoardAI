import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/login', '/register'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('onboardai_token')?.value;
  const { pathname } = req.nextUrl;

  const isPublic = publicRoutes.some(r => pathname.startsWith(r));

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
