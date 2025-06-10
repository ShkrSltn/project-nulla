'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Application, ApplicationFilter } from '@/types/applications';
import ApplicationService from '@/services/applications';
import ApplicationModal from '@/components/admin/ApplicationModal/ApplicationModal';
import FilesList from './FilesList';
import styles from './ApplicationsTable.module.css';

const columnHelper = createColumnHelper<Application>();

// Default column size for consistent width
const DEFAULT_COLUMN_SIZE = 150;

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
  const [globalFilter, setGlobalFilter] = useState('');

  const applicationService = new ApplicationService();

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: ApplicationFilter = {};
      
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
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('company', {
        header: 'Company',
        cell: (info) => (
          <div className={styles.company}>{info.getValue()}</div>
        ),
        size: DEFAULT_COLUMN_SIZE,
        minSize: 100,
        maxSize: 300,
      }),
      columnHelper.accessor('position', {
        header: 'Position',
        cell: (info) => (
          <div>
            <div className={styles.position}>{info.getValue()}</div>
            {info.row.original.level && (
              <div className={styles.level}>{info.row.original.level}</div>
            )}
          </div>
        ),
        size: DEFAULT_COLUMN_SIZE,
        minSize: 120,
        maxSize: 350,
      }),
      columnHelper.accessor('city', {
        header: 'Location',
        cell: (info) => (
          <span className={styles.contactInfo}>{info.getValue()}</span>
        ),
        size: DEFAULT_COLUMN_SIZE,
        minSize: 80,
        maxSize: 250,
      }),
      columnHelper.accessor('company_size', {
        header: 'Company Size',
        cell: (info) => (
          <span className={styles.contactInfo}>{info.getValue()}</span>
        ),
        size: DEFAULT_COLUMN_SIZE,
        minSize: 80,
        maxSize: 200,
      }),
      columnHelper.accessor('type', {
        header: 'Type',
        cell: (info) => (
          <span className={styles.typeBadge}>{info.getValue()}</span>
        ),
        size: DEFAULT_COLUMN_SIZE,
        minSize: 80,
        maxSize: 180,
      }),
      columnHelper.accessor('stage', {
        header: 'Status',
        cell: (info) => (
          <span className={getStatusBadgeClass(info.getValue())}>
            {info.getValue()}
          </span>
        ),
        size: DEFAULT_COLUMN_SIZE,
        minSize: 100,
        maxSize: 200,
      }),
      columnHelper.accessor('referral', {
        header: 'Referral',
        cell: (info) => (
          info.getValue() ? (
            <svg className={styles.referralIcon} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <span className={styles.noReferral}>No</span>
          )
        ),
        size: 100,
        minSize: 60,
        maxSize: 120,
      }),
      columnHelper.accessor('contact', {
        header: 'Contact',
        cell: (info) => (
          <span className={styles.contactInfo}>{info.getValue() || '-'}</span>
        ),
        size: DEFAULT_COLUMN_SIZE,
        minSize: 80,
        maxSize: 200,
      }),
      columnHelper.accessor('apply_date', {
        header: 'Applied',
        cell: (info) => (
          <span className={styles.dateInfo}>{formatDate(info.getValue())}</span>
        ),
        size: DEFAULT_COLUMN_SIZE,
        minSize: 80,
        maxSize: 180,
      }),
      columnHelper.accessor('response_date', {
        header: 'Response',
        cell: (info) => (
          <span className={styles.dateInfo}>{formatDate(info.getValue())}</span>
        ),
        size: DEFAULT_COLUMN_SIZE,
        minSize: 80,
        maxSize: 180,
      }),
      columnHelper.accessor('salary_range', {
        header: 'Salary',
        cell: (info) => (
          info.getValue() ? (
            <span className={styles.salaryRange}>{info.getValue()}</span>
          ) : null
        ),
        size: DEFAULT_COLUMN_SIZE,
        minSize: 80,
        maxSize: 200,
      }),
      columnHelper.accessor('files', {
        header: 'Files',
        cell: (info) => (
          <FilesList files={info.getValue()} userId={1} />
        ),
        size: DEFAULT_COLUMN_SIZE,
        minSize: 100,
        maxSize: 250,
      }),
      columnHelper.accessor('posting_url', {
        header: 'Posting',
        cell: (info) => (
          <a 
            href={info.getValue().startsWith('http') ? info.getValue() : `https://${info.getValue()}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.urlLink}
            title={info.getValue()}
          >
            {formatUrl(info.getValue())}
          </a>
        ),
        size: DEFAULT_COLUMN_SIZE,
        minSize: 100,
        maxSize: 250,
      }),
      columnHelper.accessor('languages', {
        header: 'Languages',
        cell: (info) => (
          <div className={styles.languageTags}>
            {info.getValue().slice(0, 3).map((lang, index) => (
              <span key={index} className={styles.languageTag}>
                {lang}
              </span>
            ))}
            {info.getValue().length > 3 && (
              <span className={styles.languageTag}>+{info.getValue().length - 3}</span>
            )}
          </div>
        ),
        size: DEFAULT_COLUMN_SIZE,
        minSize: 80,
        maxSize: 200,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className={styles.actions}>
            <button 
              onClick={() => handleEditApplication(info.row.original)}
              className={styles.actionButton}
              title="Edit"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m18 2 4 4-12 12H6v-4z"/>
                <path d="m21.5 6.5-4-4"/>
              </svg>
            </button>
            <button 
              onClick={() => handleDeleteApplication(info.row.original.id)}
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
        ),
        size: 120,
        minSize: 80,
        maxSize: 150,
        enableResizing: false, // Disable resizing for actions column
      }),
    ],
    []
  );

  const filteredData = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = 
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [applications, searchTerm]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: 'onChange',
    enableColumnResizing: true,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

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
            <div className={styles.tableWrapper}>
              <table className={styles.table} style={{ width: table.getCenterTotalSize() }}>
                <thead className={styles.tableHeader}>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header, index) => (
                        <th
                          key={header.id}
                          className={styles.tableHeaderCell}
                          style={{
                            width: header.getSize(),
                          }}
                        >
                          <div className={styles.headerContent}>
                            <div
                              className={styles.headerText}
                              onClick={header.column.getToggleSortingHandler()}
                              style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {{
                                asc: ' ↑',
                                desc: ' ↓',
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          </div>
                          
                          {/* Notion-style column divider/resizer */}
                          {index < headerGroup.headers.length - 1 && header.column.getCanResize() && (
                            <div className={styles.columnDivider}>
                              <div 
                                className={`${styles.dividerLine} ${header.column.getIsResizing() ? styles.dividerResizing : ''}`}
                              />
                              <div
                                className={`${styles.resizeHandle} ${header.column.getIsResizing() ? styles.resizeHandleActive : ''}`}
                                onMouseDown={header.getResizeHandler()}
                                onTouchStart={header.getResizeHandler()}
                              />
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className={styles.tableRow}>
                      {row.getVisibleCells().map((cell, index) => (
                        <td
                          key={cell.id}
                          className={styles.tableCell}
                          style={{
                            width: cell.column.getSize(),
                          }}
                        >
                          <div className={styles.cellContent}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                          
                          {/* Cell divider */}
                          {index < row.getVisibleCells().length - 1 && (
                            <div className={styles.cellDivider} />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredData.length === 0 && !loading && (
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