import styles from './Hero.module.css';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        {/* News badge */}
        <div className={styles.badge}>
          <span className={styles.badgeText}>✨ AI-Powered Job Application Manager</span>
        </div>
        
        {/* Main title */}
        <h1 className={styles.title}>
          Manage Your Job Applications 
          <span className={styles.highlight}> Smarter</span>
        </h1>
        
        {/* Subtitle */}
        <p className={styles.subtitle}>
          Track applications, generate AI-powered cover letters, and organize your job search 
          in one powerful dashboard. Land your dream job faster.
        </p>
        
        {/* Action buttons */}
        <div className={styles.actions}>
          <Link href="/auth/register" className={styles.primaryBtn}>
            Get Started Free
            <svg className={styles.arrow} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          
          <Link href="/auth/login" className={styles.secondaryBtn}>
            Sign In
          </Link>
          
          <Link href="/admin" className={styles.dashboardBtn}>
            Admin Panel
            <svg className={styles.arrow} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Background animation */}
      <div className={styles.backgroundPattern}></div>
    </section>
  );
} 