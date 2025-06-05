'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requireAdmin = false, 
  redirectTo = '/auth/login' 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Создаем URL для редиректа с сохранением текущего пути
    const handleRedirect = (redirectPath: string) => {
      // Избегаем циклического редиректа
      if (isRedirecting) return;
      
      setIsRedirecting(true);
      
      // Проверяем, нужно ли добавлять параметр redirect
      const redirect = window.location.pathname;
      if (redirectPath.includes('/auth/')) {
        // Добавляем текущий путь как параметр для возврата после авторизации
        router.push(`${redirectPath}?redirect=${encodeURIComponent(redirect)}`);
      } else {
        router.push(redirectPath);
      }
    };

    if (!isLoading) {
      // Проверка авторизации
      if (requireAuth && !user) {
        handleRedirect(redirectTo);
        return;
      }

      // Проверка прав администратора
      if (requireAdmin && (!user || user.role !== 'admin')) {
        // Если пользователь не авторизован, отправляем на логин
        // Если авторизован но не админ, отправляем на страницу с ошибкой доступа
        const redirectPath = !user ? redirectTo : '/unauthorized';
        handleRedirect(redirectPath);
        return;
      }
      
      // Проверяем, нужно ли сделать редирект после успешной авторизации
      const redirectParam = searchParams.get('redirect');
      if (user && redirectParam) {
        router.push(decodeURIComponent(redirectParam));
      }
    }
  }, [user, isLoading, requireAuth, requireAdmin, redirectTo, router, searchParams, isRedirecting]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#f8fafc',
        color: '#1e293b'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Loading...
          </div>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Don't render children if auth requirements aren't met
  if ((requireAuth && !user) || (requireAdmin && (!user || user.role !== 'admin'))) {
    return null;
  }

  return <>{children}</>;
} 