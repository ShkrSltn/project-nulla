import styles from './CTA.module.css';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>Ready to transform your job search?</h2>
          <p className={styles.subtitle}>
            Get started with our powerful job application management tools.
          </p>
          <div className={styles.actions}>
            <Link href="/admin" className={styles.primaryBtn}>
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 