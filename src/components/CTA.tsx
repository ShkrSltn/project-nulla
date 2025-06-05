import styles from './CTA.module.css';

export default function CTA() {
  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>Ready to transform your job search?</h2>
          <p className={styles.subtitle}>
            Join thousands of job seekers who have streamlined their application process and landed their dream jobs.
          </p>
          <div className={styles.actions}>
            <button className={styles.primaryBtn}>Start Free Trial</button>
            <button className={styles.secondaryBtn}>Schedule Demo</button>
          </div>
          <p className={styles.note}>No credit card required • 14-day free trial</p>
        </div>
      </div>
    </section>
  );
} 