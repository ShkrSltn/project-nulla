'use client';

import { useState, useMemo } from 'react';
import styles from './ApplicationsTable.module.css';

interface Application {
  id: string;
  company: string;
  position: string;
  level: string;
  city: string;
  companySize: string;
  type: 'Hybrid' | 'Remote' | 'On-site';
  stage: 'Rejected' | 'Closed' | 'Applied' | "Don't like" | 'Interested';
  referral: boolean;
  contact: string;
  applyDate: string;
  responseDate?: string;
  salaryRange?: string;
  files: string[];
  postingUrl: string;
  languages: string[];
}

export default function ApplicationsTable() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = 
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || app.stage === statusFilter;
      const matchesType = typeFilter === 'all' || app.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [applications, searchTerm, statusFilter, typeFilter]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Rejected':
        return `${styles.statusBadge} ${styles.statusRejected}`;
      case 'Closed':
        return `${styles.statusBadge} ${styles.statusClosed}`;
      case 'Applied':
        return `${styles.statusBadge} ${styles.statusApplied}`;
      case "Don't like":
        return `${styles.statusBadge} ${styles.statusDontLike}`;
      case 'Interested':
        return `${styles.statusBadge} ${styles.statusInterested}`;
      default:
        return styles.statusBadge;
    }
  };

  const handleAddApplication = () => {
    // TODO: Implement add application modal
    console.log('Add new application');
  };

  const handleEditApplication = (id: string) => {
    // TODO: Implement edit application modal
    console.log('Edit application:', id);
  };

  const handleDeleteApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Job Applications</h1>
        <p className={styles.subtitle}>
          Manage and track all your job applications in one place
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchFilter}>
          <input
            type="text"
            placeholder="Search by company, position, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interested">Interested</option>
            <option value="Rejected">Rejected</option>
            <option value="Closed">Closed</option>
            <option value="Don't like">Don't like</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Types</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
          </select>
        </div>

        <button onClick={handleAddApplication} className={styles.addButton}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add Application
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Company</th>
              <th>Position + Level</th>
              <th>City</th>
              <th>Company Size</th>
              <th>Type</th>
              <th>Stage</th>
              <th>Referral?</th>
              <th>Contact</th>
              <th>Apply Date</th>
              <th>Response Date</th>
              <th>Salary Range</th>
              <th>Files</th>
              <th>Posting URL</th>
              <th>Language</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app.id} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <div className={styles.company}>{app.company}</div>
                </td>
                
                <td className={styles.tableCell}>
                  <div className={styles.position}>{app.position}</div>
                  {app.level && <div className={styles.level}>{app.level}</div>}
                </td>
                
                <td className={styles.tableCell}>{app.city}</td>
                
                <td className={styles.tableCell}>{app.companySize}</td>
                
                <td className={styles.tableCell}>
                  <span className={styles.typeBadge}>{app.type}</span>
                </td>
                
                <td className={styles.tableCell}>
                  <span className={getStatusBadgeClass(app.stage)}>
                    {app.stage}
                  </span>
                </td>
                
                <td className={styles.tableCell}>
                  {app.referral ? (
                    <svg className={styles.referralIcon} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className={styles.noReferral}>No</span>
                  )}
                </td>
                
                <td className={styles.tableCell}>
                  <div className={styles.contactInfo}>{app.contact || '-'}</div>
                </td>
                
                <td className={styles.tableCell}>
                  <div className={styles.dateInfo}>{app.applyDate}</div>
                </td>
                
                <td className={styles.tableCell}>
                  <div className={styles.dateInfo}>{app.responseDate || '-'}</div>
                </td>
                
                <td className={styles.tableCell}>
                  {app.salaryRange && (
                    <div className={styles.salaryRange}>{app.salaryRange}</div>
                  )}
                </td>
                
                <td className={styles.tableCell}>
                  <div className={styles.filesCell}>
                    {app.files.length > 0 ? (
                      app.files.map((file, index) => (
                        <span key={index} className={styles.fileLink}>
                          {file}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>-</span>
                    )}
                  </div>
                </td>
                
                <td className={styles.tableCell}>
                  <a 
                    href={`https://${app.postingUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.urlLink}
                  >
                    {app.postingUrl}
                  </a>
                </td>
                
                <td className={styles.tableCell}>
                  <div className={styles.languageTags}>
                    {app.languages.map((lang, index) => (
                      <span key={index} className={styles.languageTag}>
                        {lang}
                      </span>
                    ))}
                  </div>
                </td>
                
                <td className={styles.tableCell}>
                  <div className={styles.actions}>
                    <button 
                      onClick={() => handleEditApplication(app.id)}
                      className={styles.actionButton}
                      title="Edit"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteApplication(app.id)}
                      className={styles.actionButton}
                      title="Delete"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {applications.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: '#64748b' 
        }}>
          <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No applications yet</p>
          <p style={{ fontSize: '0.875rem' }}>Click "Add Application" to get started</p>
        </div>
      )}
    </div>
  );
} 