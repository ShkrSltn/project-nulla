import { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types/auth';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const COOKIE_EXPIRES = 7; // 7 days

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
    // Save to localStorage for JS access only on client side
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('auth_token', token);
        
        // Also save to cookie for server access (middleware)
        Cookies.set('auth_token', token, { 
          expires: COOKIE_EXPIRES, 
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      } catch (error) {
        console.error('Failed to save token:', error);
      }
    }
  }

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      try {
        // First check localStorage (priority)
        const token = localStorage.getItem('auth_token');
        if (token) return token;
        
        // If not in localStorage, check cookie
        const cookieToken = Cookies.get('auth_token');
        if (cookieToken) {
          // Restore to localStorage if found in cookie
          localStorage.setItem('auth_token', cookieToken);
          return cookieToken;
        }
      } catch (error) {
        console.error('Failed to get token:', error);
        return null;
      }
    }
    return null;
  }

  static removeToken(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('auth_token');
        Cookies.remove('auth_token', { path: '/' });
        // Also try to remove from all paths
        Cookies.remove('auth_token');
      } catch (error) {
        console.error('Failed to remove token:', error);
      }
    }
  }

  static saveUser(user: User): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('auth_user', JSON.stringify(user));
      } catch (error) {
        console.error('Failed to save user:', error);
      }
    }
  }

  static getUser(): User | null {
    if (typeof window !== 'undefined') {
      try {
        const userStr = localStorage.getItem('auth_user');
        return userStr ? JSON.parse(userStr) : null;
      } catch (error) {
        console.error('Failed to get user:', error);
        return null;
      }
    }
    return null;
  }

  static removeUser(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('auth_user');
      } catch (error) {
        console.error('Failed to remove user:', error);
      }
    }
  }
}

export default AuthService; 