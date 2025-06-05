const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface UploadedFile {
  original_name: string;
  file_path: string;
  file_size: number;
  content_type: string;
}

export interface FileUploadResponse {
  message: string;
  files: UploadedFile[];
}

export interface UserFile {
  filename: string;
  size: number;
  created_at: number;
  modified_at: number;
}

export interface UserFilesResponse {
  files: UserFile[];
}

class FileService {
  private getAuthHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
    };
  }

  async uploadFiles(files: File[], token: string): Promise<FileUploadResponse> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to upload files');
    }

    return response.json();
  }

  async downloadFile(userId: number, filename: string, token: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/files/download/${userId}/${filename}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to download file');
    }

    return response.blob();
  }

  async deleteFile(userId: number, filename: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/files/${userId}/${filename}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete file');
    }
  }

  async getUserFiles(userId: number, token: string): Promise<UserFilesResponse> {
    const response = await fetch(`${API_BASE_URL}/files/${userId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get user files');
    }

    return response.json();
  }

  // Helper method to trigger file download in browser
  downloadFileAs(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export const fileService = new FileService(); 