import styles from './Features.module.css';

export default function Features() {
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12l2 2 4-4"/>
          <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h9l4 7h4l-4-7z"/>
        </svg>
      ),
      title: 'Smart Application Tracking',
      description: 'Centralize all your job applications with intelligent status tracking, deadlines, and progress monitoring.',
      highlight: 'Never lose track again'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      title: 'AI-Powered Insights',
      description: 'Get personalized recommendations and insights to improve your application success rate and interview performance.',
      highlight: 'Data-driven success'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
      title: 'Document Management',
      description: 'Organize resumes, cover letters, and portfolios with version control and easy sharing capabilities.',
      highlight: 'All files organized'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      ),
      title: 'Smart Notifications',
      description: 'Receive timely reminders for follow-ups, interview dates, and application deadlines.',
      highlight: 'Never miss opportunities'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      ),
      title: 'Progress Analytics',
      description: 'Visualize your job search progress with detailed analytics and performance metrics.',
      highlight: 'Track your success'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: 'Team Collaboration',
      description: 'Share progress with mentors, career coaches, or accountability partners for better outcomes.',
      highlight: 'Get support when needed'
    },
  ];

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>Why Choose Nulla.io</div>
          <h2 className={styles.title}>
            Everything you need to land your next role
          </h2>
          <p className={styles.subtitle}>
            Our comprehensive suite of tools helps you stay organized, track progress, 
            and increase your chances of landing interviews at your dream companies.
          </p>
        </div>
        
        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  {feature.icon}
                </div>
                <div className={styles.highlight}>{feature.highlight}</div>
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.bottomCta}>
          <div className={styles.ctaCard}>
            <h3 className={styles.ctaTitle}>Ready to supercharge your job search?</h3>
            <p className={styles.ctaText}>Join thousands of successful job seekers already using our platform.</p>
            <a href="/auth/register" className={styles.ctaButton}>
              Get Started Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 