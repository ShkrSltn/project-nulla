'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthContextType, User } from '@/types/auth';
import AuthService from '@/services/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  // Начинаем с true чтобы избежать проблем гидратации
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Предотвращаем выполнение на сервере
    if (typeof window === 'undefined') return;
    
    // Восстанавливаем состояние аутентификации при загрузке приложения
    const initializeAuth = async () => {
      try {
        const savedToken = AuthService.getToken();
        const savedUser = AuthService.getUser();

        if (savedToken && savedUser) {
          // Сначала устанавливаем данные из localStorage
          setToken(savedToken);
          setUser(savedUser);
          
          // Затем в фоне проверяем валидность токена (без блокирования UI)
          try {
            const authService = new AuthService();
            const currentUser = await authService.getCurrentUser(savedToken);
            
            // Обновляем данные пользователя если они изменились
            if (currentUser && typeof currentUser.id !== 'undefined') {
              setUser(currentUser);
              AuthService.saveUser(currentUser);
            }
          } catch (error) {
            console.warn('Token validation failed, but keeping user logged in:', error);
            // НЕ делаем logout при ошибке проверки токена
            // Пользователь останется авторизованным до следующего действия
          }
        } else {
          // Нет токена или данных пользователя
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // При ошибке инициализации НЕ сбрасываем авторизацию
        // Пытаемся восстановить из localStorage
        const savedToken = AuthService.getToken();
        const savedUser = AuthService.getUser();
        
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(savedUser);
        }
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    // Небольшая задержка для избежания проблем гидратации
    const timer = setTimeout(initializeAuth, 50);
    
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const authService = new AuthService();
      const response = await authService.login({ email, password });
      
      // Проверяем что получили валидный ответ
      if (!response || !response.access_token || !response.user) {
        throw new Error('Invalid response from server');
      }
      
      setToken(response.access_token);
      setUser(response.user);
      
      // Сохраняем в localStorage и cookies
      AuthService.saveToken(response.access_token);
      AuthService.saveUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const authService = new AuthService();
      const newUser = await authService.register({ email, password });
      
      // После регистрации автоматически логинимся
      await login(email, password);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    AuthService.removeToken();
    AuthService.removeUser();
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
  };

  // Не рендерим children пока не инициализировались
  if (!isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#f8fafc' 
      }}>
        <div style={{
          width: '2rem',
          height: '2rem',
          border: '3px solid #e2e8f0',
          borderTop: '3px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}