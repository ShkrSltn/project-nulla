'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Sidebar.module.css';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const navigationSections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        {
          id: 'admin',
          label: 'Admin Panel',
          href: '/admin',
          icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className={styles.navIcon}>
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: 'Job Applications',
      items: [
        {
          id: 'applications',
          label: 'All Applications',
          href: '/admin/applications',
          icon: (
            <svg viewBox="0 0 20 20" fill="currentColor" className={styles.navIcon}>
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
          ),
        },
      ],
    },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const isActiveLink = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const getUserInitials = (email?: string): string => {
    // Безопасно обрабатываем случай, когда email отсутствует
    if (!email) return '?';
    
    // Получаем первый символ email или первый символ до @
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        className={styles.toggleButton}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      </button>

      {/* Mobile overlay */}
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        {/* Header */}
        <div className={styles.header}>
          <Link href="/admin" className={styles.logo}>
            <div className={styles.logoIcon}>
              ⚙️
            </div>
            <span style={{ color: 'white' }}>Nulla.io Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {navigationSections.map((section) => (
            <div key={section.title} className={styles.navSection}>
              <h3 className={styles.sectionTitle} style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {section.title}
              </h3>
              <ul className={styles.navList}>
                {section.items.map((item) => (
                  <li key={item.id} className={styles.navItem}>
                    <Link
                      href={item.href}
                      className={`${styles.navLink} ${
                        isActiveLink(item.href) ? styles.active : ''
                      }`}
                      onClick={closeSidebar}
                      style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer with user info */}
        <div className={styles.footer}>
          {user ? (
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                {getUserInitials(user.email)}
              </div>
              <div className={styles.userDetails}>
                <p className={styles.userName} style={{ color: 'white' }}>
                  {user.email ? user.email.split('@')[0] : 'User'}
                </p>
                <p className={styles.userEmail} style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {user.email || 'No email'}
                </p>
                <div style={{ marginTop: '0.5rem' }}>
                  <button 
                    onClick={handleLogout}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.userInfo}>
              <div className={styles.userDetails}>
                <Link href="/auth/login" style={{ color: 'white', textDecoration: 'none' }}>
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
} 