import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        {/* Бейдж с новостью */}
        <div className={styles.badge}>
          <span className={styles.badgeText}>✨ AI-Powered Job Application Manager</span>
        </div>
        
        {/* Главный заголовок */}
        <h1 className={styles.title}>
          Manage Your Job Applications 
          <span className={styles.highlight}> Smarter</span>
        </h1>
        
        {/* Подзаголовок */}
        <p className={styles.subtitle}>
          Track applications, generate AI-powered cover letters, and organize your job search 
          in one powerful dashboard. Land your dream job faster.
        </p>
        
        {/* Кнопки действий */}
        <div className={styles.actions}>
          <button className={styles.primaryBtn}>
            Start Free Trial
            <svg className={styles.arrow} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button className={styles.secondaryBtn}>
            <svg className={styles.playIcon} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Watch Demo
          </button>
        </div>
        
        {/* Статистика */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>10K+</span>
            <span className={styles.statLabel}>Applications Tracked</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>89%</span>
            <span className={styles.statLabel}>Success Rate</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>500+</span>
            <span className={styles.statLabel}>Companies</span>
          </div>
        </div>
      </div>
      
      {/* Фоновая анимация */}
      <div className={styles.backgroundPattern}></div>
    </section>
  );
} 