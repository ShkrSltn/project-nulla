import { Metadata } from 'next';
import Sidebar from '@/components/admin/Sidebar/Sidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute/ProtectedRoute';
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: 'Admin Panel - Nulla.io',
  description: 'Admin panel for Nulla.io platform',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requireAuth={true}>
      <div className={styles.dashboardLayout}>
        <Sidebar />
        <main className={styles.dashboardMain}>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
} 