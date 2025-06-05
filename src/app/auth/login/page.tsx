import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm/LoginForm';

export const metadata: Metadata = {
  title: 'Login - Nulla.io',
  description: 'Sign in to your Nulla.io account',
};

export default function LoginPage() {
  return <LoginForm />;
} 