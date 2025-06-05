import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Проверяем наличие токена в cookie (серверная часть)
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  // Проверяем защищенные admin роуты
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Если нет токена в cookie, редиректим на логин
    // (на клиенте еще будет проверка в localStorage через useAuth)
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      
      // Устанавливаем флаг в cookie для проверки на клиенте
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set('auth_redirect', request.nextUrl.pathname, { 
        path: '/',
        maxAge: 60 * 5, // 5 минут
        httpOnly: false
      });
      
      return response;
    }
  }

  // Редиректим авторизованных пользователей с auth страниц
  if (request.nextUrl.pathname.startsWith('/auth/') && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - landing (public landing page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|landing).*)',
  ],
}; 