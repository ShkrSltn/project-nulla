'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#f8fafc',
      color: '#1e293b'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
          🔒
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Access Denied
        </h1>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          You do not have permission to access this page.
        </p>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.75rem',
          marginTop: '2rem'
        }}>
          <Link href="/" style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#667eea',
            color: 'white',
            borderRadius: '6px',
            fontWeight: '500',
            textDecoration: 'none',
            transition: 'background-color 0.2s'
          }}>
            Go to Home Page
          </Link>
          
          {user && (
            <button
              onClick={() => {
                logout();
                router.push('/auth/login');
              }}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'transparent',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 