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
      title: 'Dashboard',
      items: [
        {
          id: 'admin',
          label: 'Overview',
          href: '/admin',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          ),
        },
      ],
    },
    {
      title: 'Management',
      items: [
        {
          id: 'applications',
          label: 'Applications',
          href: '/admin/applications',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
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
    if (!email) return '?';
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
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
              N
            </div>
            <span className={styles.logoText}>Nulla.io</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {navigationSections.map((section) => (
            <div key={section.title} className={styles.navSection}>
              <h3 className={styles.sectionTitle}>
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
                    >
                      <span className={styles.navIcon}>{item.icon}</span>
                      <span className={styles.navLabel}>{item.label}</span>
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
                <p className={styles.userName}>
                  {user.email ? user.email.split('@')[0] : 'User'}
                </p>
                <p className={styles.userEmail}>
                  {user.email || 'No email'}
                </p>
              </div>
              <button 
                onClick={handleLogout}
                className={styles.logoutButton}
                aria-label="Logout"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className={styles.loginLink}>
              Sign In
            </Link>
          )}
        </div>
      </aside>
    </>
  );
} 