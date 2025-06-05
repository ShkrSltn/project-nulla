'use client';

import { useState, useEffect } from 'react';
import { Application, ApplicationCreate, ApplicationUpdate } from '@/types/applications';
import styles from './ApplicationModal.module.css';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApplicationCreate | ApplicationUpdate) => Promise<void>;
  application?: Application | null;
  isLoading?: boolean;
}

const initialFormData: ApplicationCreate = {
  company: '',
  position: '',
  level: '',
  city: '',
  company_size: '',
  type: 'Remote',
  stage: 'Interested',
  referral: false,
  contact: '',
  apply_date: new Date().toISOString().split('T')[0],
  response_date: '',
  salary_range: '',
  files: [],
  posting_url: '',
  languages: []
};

export default function ApplicationModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  application, 
  isLoading = false 
}: ApplicationModalProps) {
  const [formData, setFormData] = useState<ApplicationCreate>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [languageInput, setLanguageInput] = useState('');
  const [fileInput, setFileInput] = useState('');

  const isEditing = !!application;

  useEffect(() => {
    if (isOpen) {
      if (application) {
        // Convert dates from backend format to form format
        setFormData({
          company: application.company,
          position: application.position,
          level: application.level,
          city: application.city,
          company_size: application.company_size,
          type: application.type,
          stage: application.stage,
          referral: application.referral,
          contact: application.contact || '',
          apply_date: application.apply_date,
          response_date: application.response_date || '',
          salary_range: application.salary_range || '',
          files: application.files,
          posting_url: application.posting_url,
          languages: application.languages
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
      setLanguageInput('');
      setFileInput('');
    }
  }, [isOpen, application]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.level.trim()) newErrors.level = 'Level is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.company_size.trim()) newErrors.company_size = 'Company size is required';
    if (!formData.apply_date) newErrors.apply_date = 'Apply date is required';
    if (!formData.posting_url.trim()) newErrors.posting_url = 'Posting URL is required';

    // URL validation
    try {
      if (formData.posting_url && !formData.posting_url.startsWith('http')) {
        new URL('https://' + formData.posting_url);
      } else if (formData.posting_url) {
        new URL(formData.posting_url);
      }
    } catch {
      newErrors.posting_url = 'Invalid URL format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addLanguage = () => {
    if (languageInput.trim() && !formData.languages.includes(languageInput.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, languageInput.trim()]
      }));
      setLanguageInput('');
    }
  };

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  const addFile = () => {
    if (fileInput.trim() && !formData.files.includes(fileInput.trim())) {
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, fileInput.trim()]
      }));
      setFileInput('');
    }
  };

  const removeFile = (file: string) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter(f => f !== file)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // For editing, we need to explicitly send null for cleared fields
      const cleanedData = {
        ...formData,
        response_date: formData.response_date || null,
        salary_range: formData.salary_range || null,
        contact: formData.contact || null
      };
      
      await onSubmit(cleanedData as ApplicationCreate | ApplicationUpdate);
      onClose();
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isEditing ? 'Edit Application' : 'Add New Application'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>Company *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={`${styles.input} ${errors.company ? styles.error : ''}`}
                placeholder="Enter company name"
              />
              {errors.company && <span className={styles.errorText}>{errors.company}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Position *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className={`${styles.input} ${errors.position ? styles.error : ''}`}
                placeholder="Enter position title"
              />
              {errors.position && <span className={styles.errorText}>{errors.position}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Level *</label>
              <input
                type="text"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className={`${styles.input} ${errors.level ? styles.error : ''}`}
                placeholder="e.g., Senior, Mid-level, Junior"
              />
              {errors.level && <span className={styles.errorText}>{errors.level}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`${styles.input} ${errors.city ? styles.error : ''}`}
                placeholder="Enter city"
              />
              {errors.city && <span className={styles.errorText}>{errors.city}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Company Size *</label>
              <select
                name="company_size"
                value={formData.company_size}
                onChange={handleChange}
                className={`${styles.input} ${errors.company_size ? styles.error : ''}`}
              >
                <option value="">Select size</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="501-1000">501-1000</option>
                <option value="1000+">1000+</option>
              </select>
              {errors.company_size && <span className={styles.errorText}>{errors.company_size}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Work Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Status</label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="Interested">Interested</option>
                <option value="Applied">Applied</option>
                <option value="Rejected">Rejected</option>
                <option value="Closed">Closed</option>
                <option value="Not interested">Not interested</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Apply Date *</label>
              <input
                type="date"
                name="apply_date"
                value={formData.apply_date}
                onChange={handleChange}
                className={`${styles.input} ${errors.apply_date ? styles.error : ''}`}
              />
              {errors.apply_date && <span className={styles.errorText}>{errors.apply_date}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Response Date</label>
              <input
                type="date"
                name="response_date"
                value={formData.response_date}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Salary Range</label>
              <input
                type="text"
                name="salary_range"
                value={formData.salary_range}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g., $80k - $120k"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Contact</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className={styles.input}
                placeholder="Contact person or email"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Posting URL *</label>
              <input
                type="url"
                name="posting_url"
                value={formData.posting_url}
                onChange={handleChange}
                className={`${styles.input} ${errors.posting_url ? styles.error : ''}`}
                placeholder="https://example.com/job-posting"
              />
              {errors.posting_url && <span className={styles.errorText}>{errors.posting_url}</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="referral"
                checked={formData.referral}
                onChange={handleChange}
                className={styles.checkbox}
              />
              <span>I have a referral for this position</span>
            </label>
          </div>

          {/* Languages */}
          <div className={styles.field}>
            <label className={styles.label}>Languages</label>
            <div className={styles.tagInput}>
              <input
                type="text"
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                className={styles.input}
                placeholder="Add language and press Enter"
              />
              <button type="button" onClick={addLanguage} className={styles.addButton}>
                Add
              </button>
            </div>
            <div className={styles.tags}>
              {formData.languages.map((language, index) => (
                <span key={index} className={styles.tag}>
                  {language}
                  <button type="button" onClick={() => removeLanguage(language)} className={styles.removeTag}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Files */}
          <div className={styles.field}>
            <label className={styles.label}>Files</label>
            <div className={styles.tagInput}>
              <input
                type="text"
                value={fileInput}
                onChange={(e) => setFileInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFile())}
                className={styles.input}
                placeholder="Add file name and press Enter"
              />
              <button type="button" onClick={addFile} className={styles.addButton}>
                Add
              </button>
            </div>
            <div className={styles.tags}>
              {formData.files.map((file, index) => (
                <span key={index} className={styles.tag}>
                  {file}
                  <button type="button" onClick={() => removeFile(file)} className={styles.removeTag}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className={styles.spinner} />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Application' : 'Create Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 