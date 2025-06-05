'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fileService } from '@/services/fileService';
import styles from './FilesList.module.css';

interface FilesListProps {
  files: string[];
  userId: number;
}

export default function FilesList({ files, userId }: FilesListProps) {
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const { token } = useAuth();

  const extractFileName = (filePath: string): string => {
    return filePath.split('/').pop() || filePath;
  };

  const handleDownload = async (filePath: string) => {
    if (!token) return;

    const filename = extractFileName(filePath);
    setDownloadingFile(filename);

    try {
      const blob = await fileService.downloadFile(userId, filename, token);
      fileService.downloadFileAs(blob, filename);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Error downloading file');
    } finally {
      setDownloadingFile(null);
    }
  };

  if (files.length === 0) {
    return <span className={styles.noFiles}>No files</span>;
  }

  return (
    <div className={styles.filesList}>
      {files.map((filePath, index) => {
        const filename = extractFileName(filePath);
        const isDownloading = downloadingFile === filename;
        
        return (
          <button
            key={index}
            onClick={() => handleDownload(filePath)}
            disabled={isDownloading}
            className={styles.fileButton}
            title={`Download ${filename}`}
          >
            📄 {filename}
            {isDownloading && <span className={styles.loading}>⏳</span>}
          </button>
        );
      })}
    </div>
  );
} 