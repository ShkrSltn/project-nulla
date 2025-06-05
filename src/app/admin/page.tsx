export default function Admin() {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: '#1e293b',
          marginBottom: '0.5rem' 
        }}>
          Admin Panel
        </h1>
        <p style={{ 
          color: '#64748b', 
          fontSize: '1.125rem' 
        }}>
          Manage job applications, track progress, and optimize your job search process.
        </p>
      </div>
      
      <div style={{ 
        background: 'white', 
        padding: '3rem', 
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        textAlign: 'center' as const
      }}>
        <h2 style={{ 
          color: '#1e293b', 
          fontSize: '1.5rem', 
          fontWeight: '600',
          marginBottom: '1rem' 
        }}>
          Welcome to Nulla.io Admin
        </h2>
        <p style={{ 
          color: '#64748b', 
          fontSize: '1rem',
          marginBottom: '2rem',
          maxWidth: '500px',
          margin: '0 auto 2rem'
        }}>
          Get started by adding your first job application or explore the available features.
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          flexWrap: 'wrap' as const
        }}>
          <a 
            href="/admin/applications" 
            style={{ 
              background: '#667eea', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              textDecoration: 'none',
              fontWeight: '600',
              display: 'inline-block',
              transition: 'background 0.2s ease'
            }}
          >
            View Applications
          </a>
        </div>
      </div>
    </div>
  );
} 