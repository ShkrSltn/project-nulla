import { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types/auth';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const COOKIE_EXPIRES = 7; // 7 дней

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    return response.json();
  }

  async register(userData: RegisterRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
  }

  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get current user');
    }

    return response.json();
  }

  // Utility methods for token management
  static saveToken(token: string): void {
    // Сохраняем в localStorage для доступа из JS
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      
      // Также сохраняем в cookie для доступа на сервере (middleware)
      try {
        Cookies.set('auth_token', token, { expires: COOKIE_EXPIRES, path: '/' });
      } catch (error) {
        console.error('Failed to set cookie:', error);
      }
    }
  }

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      // Сначала проверяем localStorage
      const token = localStorage.getItem('auth_token');
      if (token) return token;
      
      // Если нет в localStorage, проверяем cookie
      try {
        const cookieToken = Cookies.get('auth_token');
        return cookieToken || null;
      } catch (error) {
        console.error('Failed to get cookie:', error);
      }
    }
    return null;
  }

  static removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      
      // Удаляем и из cookie
      try {
        Cookies.remove('auth_token', { path: '/' });
      } catch (error) {
        console.error('Failed to remove cookie:', error);
      }
    }
  }

  static saveUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  }

  static getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('auth_user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  static removeUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user');
    }
  }
}

export default AuthService; 