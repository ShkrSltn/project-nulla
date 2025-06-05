export interface Application {
  id: number;
  company: string;
  position: string;
  level: string;
  city: string;
  company_size: string;
  type: 'Hybrid' | 'Remote' | 'On-site';
  stage: 'Rejected' | 'Closed' | 'Applied' | 'Not interested' | 'Interested';
  referral: boolean;
  contact?: string;
  apply_date: string; // ISO date string
  response_date?: string; // ISO date string
  salary_range?: string;
  files: string[];
  posting_url: string;
  languages: string[];
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface ApplicationCreate {
  company: string;
  position: string;
  level: string;
  city: string;
  company_size: string;
  type: 'Hybrid' | 'Remote' | 'On-site';
  stage: 'Rejected' | 'Closed' | 'Applied' | 'Not interested' | 'Interested';
  referral: boolean;
  contact?: string;
  apply_date: string; // ISO date string
  response_date?: string; // ISO date string
  salary_range?: string;
  files: string[];
  posting_url: string;
  languages: string[];
}

export interface ApplicationUpdate {
  company?: string;
  position?: string;
  level?: string;
  city?: string;
  company_size?: string;
  type?: 'Hybrid' | 'Remote' | 'On-site';
  stage?: 'Rejected' | 'Closed' | 'Applied' | 'Not interested' | 'Interested';
  referral?: boolean;
  contact?: string;
  apply_date?: string;
  response_date?: string;
  salary_range?: string;
  files?: string[];
  posting_url?: string;
  languages?: string[];
}

export interface ApplicationFilter {
  company?: string;
  position?: string;
  city?: string;
  type?: 'Hybrid' | 'Remote' | 'On-site';
  stage?: 'Rejected' | 'Closed' | 'Applied' | 'Not interested' | 'Interested';
  referral?: boolean;
  limit?: number;
  offset?: number;
}

export interface ApplicationStats {
  total: number;
  applied: number;
  interested: number;
  rejected: number;
  closed: number;
  not_interested: number;
  with_referral: number;
} 