import styles from './CTA.module.css';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Start your success story today</h2>
            <p className={styles.subtitle}>
              Join thousands of professionals who have transformed their job search with our platform. 
              No credit card required - start your free trial now.
            </p>
          </div>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
              </div>
              <div className={styles.featureText}>
                <h3>Free forever plan</h3>
                <p>Start tracking applications immediately</p>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div className={styles.featureText}>
                <h3>Secure & private</h3>
                <p>Your data is encrypted and protected</p>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5z"/>
                  <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>
                </svg>
              </div>
              <div className={styles.featureText}>
                <h3>24/7 support</h3>
                <p>Get help whenever you need it</p>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <Link href="/auth/register" className={styles.primaryBtn}>
              <span>Get Started Free</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </Link>
            
            <Link href="/auth/login" className={styles.secondaryBtn}>
              <span>Sign In</span>
            </Link>
          </div>

          <div className={styles.trustIndicators}>
            <p className={styles.trustText}>Trusted by professionals at</p>
            <div className={styles.logos}>
              <div className={styles.logo}>Google</div>
              <div className={styles.logo}>Microsoft</div>
              <div className={styles.logo}>Amazon</div>
              <div className={styles.logo}>Apple</div>
              <div className={styles.logo}>Meta</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.backgroundPattern}></div>
    </section>
  );
} 