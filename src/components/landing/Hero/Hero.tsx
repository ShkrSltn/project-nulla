import styles from './Hero.module.css';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        {/* Status badge */}
        <div className={styles.badge}>
          <div className={styles.badgeIcon}>✨</div>
          <span className={styles.badgeText}>AI-Powered Job Application Manager</span>
        </div>
        
        {/* Main heading */}
        <h1 className={styles.title}>
          Transform Your Job Search with
          <span className={styles.highlight}> Smart Organization</span>
        </h1>
        
        {/* Subtitle */}
        <p className={styles.subtitle}>
          Stop losing track of applications. Our intelligent platform helps you manage, 
          track, and optimize your job search process with powerful tools and insights.
        </p>
        
        {/* CTA buttons */}
        <div className={styles.actions}>
          <Link href="/auth/register" className={styles.primaryBtn}>
            <span>Start Free Trial</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </Link>
          
          <Link href="/admin" className={styles.secondaryBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <span>Try Demo</span>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className={styles.trustSection}>
          <p className={styles.trustText}>Trusted by job seekers worldwide</p>
          <div className={styles.trustStats}>
            <div className={styles.trustStat}>
              <div className={styles.trustNumber}>10K+</div>
              <div className={styles.trustLabel}>Applications Tracked</div>
            </div>
            <div className={styles.trustStat}>
              <div className={styles.trustNumber}>95%</div>
              <div className={styles.trustLabel}>Success Rate</div>
            </div>
            <div className={styles.trustStat}>
              <div className={styles.trustNumber}>24/7</div>
              <div className={styles.trustLabel}>Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background elements */}
      <div className={styles.backgroundGrid}></div>
      <div className={styles.gradientBlur}></div>
    </section>
  );
} 