'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Application, ApplicationFilter } from '@/types/applications';
import ApplicationService from '@/services/applications';
import ApplicationModal from '@/components/admin/ApplicationModal/ApplicationModal';
import styles from './ApplicationsTable.module.css';

export default function ApplicationsTable() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const applicationService = new ApplicationService();

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: ApplicationFilter = {};
      
      if (searchTerm) {
        filters.company = searchTerm;
      }
      if (statusFilter !== 'all') {
        filters.stage = statusFilter as any;
      }
      if (typeFilter !== 'all') {
        filters.type = typeFilter as any;
      }

      const data = await applicationService.getApplications(filters);
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications');
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, typeFilter]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = 
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [applications, searchTerm]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Rejected':
        return `${styles.statusBadge} ${styles.statusRejected}`;
      case 'Closed':
        return `${styles.statusBadge} ${styles.statusClosed}`;
      case 'Applied':
        return `${styles.statusBadge} ${styles.statusApplied}`;
      case 'Not interested':
        return `${styles.statusBadge} ${styles.statusDontLike}`;
      case 'Interested':
        return `${styles.statusBadge} ${styles.statusInterested}`;
      default:
        return styles.statusBadge;
    }
  };

  const handleAddApplication = () => {
    setEditingApplication(null);
    setIsModalOpen(true);
  };

  const handleEditApplication = (application: Application) => {
    setEditingApplication(application);
    setIsModalOpen(true);
  };

  const handleDeleteApplication = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return;
    }

    try {
      await applicationService.deleteApplication(id);
      await loadApplications();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete application');
    }
  };

  const handleModalSubmit = async (data: any) => {
    try {
      setModalLoading(true);
      
      if (editingApplication) {
        await applicationService.updateApplication(editingApplication.id, data);
      } else {
        await applicationService.createApplication(data);
      }
      
      await loadApplications();
      setIsModalOpen(false);
    } catch (err) {
      throw err;
    } finally {
      setModalLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatUrl = (url: string) => {
    if (!url) return '';
    return url.replace(/^https?:\/\//, '');
  };

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Error loading applications</h2>
          <p className={styles.errorText}>{error}</p>
          <button 
            onClick={loadApplications}
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
            <option value="Not interested">Not interested</option>
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Application
        </button>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p>Loading applications...</p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Location</th>
                  <th>Company Size</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Referral</th>
                  <th>Contact</th>
                  <th>Applied</th>
                  <th>Response</th>
                  <th>Salary</th>
                  <th>Files</th>
                  <th>Posting</th>
                  <th>Languages</th>
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
                    
                    <td className={styles.tableCell}>
                      <span className={styles.contactInfo}>{app.city}</span>
                    </td>
                    
                    <td className={styles.tableCell}>
                      <span className={styles.contactInfo}>{app.company_size}</span>
                    </td>
                    
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
                      <span className={styles.contactInfo}>{app.contact || '-'}</span>
                    </td>
                    
                    <td className={styles.tableCell}>
                      <span className={styles.dateInfo}>{formatDate(app.apply_date)}</span>
                    </td>
                    
                    <td className={styles.tableCell}>
                      <span className={styles.dateInfo}>{formatDate(app.response_date)}</span>
                    </td>
                    
                    <td className={styles.tableCell}>
                      {app.salary_range && (
                        <span className={styles.salaryRange}>{app.salary_range}</span>
                      )}
                    </td>
                    
                    <td className={styles.tableCell}>
                      <div className={styles.filesCell}>
                        {app.files.length > 0 ? (
                          app.files.slice(0, 2).map((file, index) => (
                            <span key={index} className={styles.fileLink}>
                              📄 {file.split('/').pop()}
                            </span>
                          ))
                        ) : (
                          <span className={styles.noReferral}>-</span>
                        )}
                        {app.files.length > 2 && (
                          <span className={styles.noReferral}>+{app.files.length - 2}</span>
                        )}
                      </div>
                    </td>
                    
                    <td className={styles.tableCell}>
                      <a 
                        href={app.posting_url.startsWith('http') ? app.posting_url : `https://${app.posting_url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.urlLink}
                        title={app.posting_url}
                      >
                        {formatUrl(app.posting_url)}
                      </a>
                    </td>
                    
                    <td className={styles.tableCell}>
                      <div className={styles.languageTags}>
                        {app.languages.slice(0, 3).map((lang, index) => (
                          <span key={index} className={styles.languageTag}>
                            {lang}
                          </span>
                        ))}
                        {app.languages.length > 3 && (
                          <span className={styles.languageTag}>+{app.languages.length - 3}</span>
                        )}
                      </div>
                    </td>
                    
                    <td className={styles.tableCell}>
                      <div className={styles.actions}>
                        <button 
                          onClick={() => handleEditApplication(app)}
                          className={styles.actionButton}
                          title="Edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m18 2 4 4-12 12H6v-4z"/>
                            <path d="m21.5 6.5-4-4"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteApplication(app.id)}
                          className={styles.actionButton}
                          title="Delete"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplications.length === 0 && !loading && (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyTitle}>
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                  ? 'No applications match your filters' 
                  : 'No applications yet'
                }
              </h3>
              <p className={styles.emptyText}>
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'Click "Add Application" to get started'
                }
              </p>
            </div>
          )}
        </>
      )}

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        application={editingApplication}
        isLoading={modalLoading}
      />
    </div>
  );
} 