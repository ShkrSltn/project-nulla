import { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm/RegisterForm';

export const metadata: Metadata = {
  title: 'Register - Nulla.io',
  description: 'Create your Nulla.io account',
};

export default function RegisterPage() {
  return <RegisterForm />;
} 