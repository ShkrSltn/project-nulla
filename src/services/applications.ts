import { Application, ApplicationCreate, ApplicationUpdate, ApplicationFilter, ApplicationStats } from '@/types/applications';
import AuthService from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApplicationService {
  private getAuthHeaders() {
    const token = AuthService.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async createApplication(data: ApplicationCreate): Promise<Application> {
    const response = await fetch(`${API_BASE_URL}/applications/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create application');
    }

    return response.json();
  }

  async getApplications(filters?: ApplicationFilter): Promise<Application[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/applications/?${params.toString()}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch applications');
    }

    return response.json();
  }

  async getApplication(id: number): Promise<Application> {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch application');
    }

    return response.json();
  }

  async updateApplication(id: number, data: ApplicationUpdate): Promise<Application> {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update application');
    }

    return response.json();
  }

  async deleteApplication(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete application');
    }
  }

  async getApplicationStats(): Promise<ApplicationStats> {
    const response = await fetch(`${API_BASE_URL}/applications/stats/summary`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch application stats');
    }

    return response.json();
  }
}

export default ApplicationService; 