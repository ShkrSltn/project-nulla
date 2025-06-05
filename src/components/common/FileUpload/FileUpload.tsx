'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './FileUpload.module.css';

interface FileUploadProps {
  onFilesUploaded: (files: string[]) => void;
  maxFiles?: number;
  accept?: string;
}

interface UploadedFile {
  original_name: string;
  file_path: string;
  file_size: number;
  content_type: string;
}

export default function FileUpload({ 
  onFilesUploaded, 
  maxFiles = 5,
  accept = ".pdf,.doc,.docx"
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const { token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    if (files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate file types
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const invalidFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return !allowedExtensions.includes(extension);
    });

    if (invalidFiles.length > 0) {
      alert('Only PDF, DOC, DOCX files are allowed');
      return;
    }

    // Check file sizes
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Maximum file size is 10MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('http://localhost:8000/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadedFiles(prev => [...prev, ...result.files]);
        
        // Notify parent component
        const filePaths = result.files.map((file: UploadedFile) => file.file_path);
        onFilesUploaded(filePaths);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const error = await response.json();
        alert(`Upload error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading files');
    } finally {
      setUploading(false);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    const filePaths = newFiles.map(file => file.file_path);
    onFilesUploaded(filePaths);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.fileUpload}>
      <div
        className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className={styles.fileInput}
          multiple
          accept={accept}
          onChange={handleChange}
        />
        
        <div className={styles.dropContent}>
          <div className={styles.uploadIcon}>📁</div>
          <p className={styles.dropText}>
            {uploading ? 'Uploading...' : 'Drag files here or click to select'}
          </p>
          <p className={styles.fileTypes}>
            Supported formats: PDF, DOC, DOCX (max. 10MB)
          </p>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className={styles.fileList}>
          <h4>Uploaded files:</h4>
          {uploadedFiles.map((file, index) => (
            <div key={index} className={styles.fileItem}>
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{file.original_name}</span>
                <span className={styles.fileSize}>{formatFileSize(file.file_size)}</span>
              </div>
              <button
                onClick={() => removeFile(index)}
                className={styles.removeButton}
                type="button"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 