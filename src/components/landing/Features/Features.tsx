import styles from './Features.module.css';

export default function Features() {
  const features = [
    {
      icon: '📊',
      title: 'Application Tracking',
      description: 'Keep track of all your job applications in one organized dashboard with status updates and deadlines.',
    },
    {
      icon: '🤖',
      title: 'AI Cover Letters',
      description: 'Generate personalized cover letters using AI based on job descriptions and your experience.',
    },
    {
      icon: '📄',
      title: 'CV Management',
      description: 'Store and manage multiple versions of your CV for different roles and industries.',
    },
    {
      icon: '📈',
      title: 'Analytics & Insights',
      description: 'Get insights into your application success rate and identify improvement opportunities.',
    },
    {
      icon: '🔔',
      title: 'Smart Reminders',
      description: 'Never miss a deadline with intelligent notifications and follow-up reminders.',
    },
    {
      icon: '📁',
      title: 'File Organization',
      description: 'Organize all your job search documents, notes, and correspondence in one place.',
    },
  ];

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Features</span>
          <h2 className={styles.title}>Everything you need to land your dream job</h2>
          <p className={styles.subtitle}>
            Powerful tools designed to streamline your job search process and increase your success rate.
          </p>
        </div>
        
        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>{feature.icon}</span>
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 