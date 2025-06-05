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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Восстанавливаем состояние аутентификации при загрузке приложения
    const initializeAuth = async () => {
      try {
        const savedToken = AuthService.getToken();
        const savedUser = AuthService.getUser();

        if (savedToken && savedUser) {
          // Проверяем валидность токена, запросив текущего пользователя
          try {
            const authService = new AuthService();
            const currentUser = await authService.getCurrentUser(savedToken);
            
            // Проверяем что у пользователя есть минимум необходимых полей
            if (currentUser && typeof currentUser.id !== 'undefined') {
              setToken(savedToken);
              setUser(currentUser);
            } else {
              // Неполные данные пользователя, сбрасываем авторизацию
              AuthService.removeToken();
              AuthService.removeUser();
            }
          } catch (error) {
            // Токен невалидный, очищаем данные
            AuthService.removeToken();
            AuthService.removeUser();
          }
        } else {
          // Нет токена или данных пользователя
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // В случае ошибки сбрасываем авторизацию
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
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
      
      // Сохраняем в localStorage
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