export interface User {
  id: string;
  name: string;
  email: string;
  role: 'traffic_police' | 'bus_station_manager' | 'transportation_office' | 'anonymous';
  location?: string;
}

export interface IssueReport {
  id: string;
  type: 'overpriced_fare' | 'poor_service' | 'gas_station' | 'traffic_accident';
  title: string;
  description: string;
  location?: {
    startStation: string;
    endStation: string;
  };
  status: 'pending' | 'in_progress' | 'resolved' | 'urgent';
  priority: 'low' | 'medium' | 'high' | 'critical';
  reportedBy: string;
  reportedAt: Date;
  assignedTo?: string;
  resolvedAt?: Date;
  resolution?: string;
  attachments?: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
  };
}

export interface Notification {
  id: string;
  type: 'sms' | 'email' | 'in_app';
  recipient: string;
  message: string;
  sentAt: Date;
  status: 'sent' | 'failed' | 'pending';
}

export interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  urgentReports: number;
  reportsByType: Record<string, number>;
  reportsByLocation: Record<string, number>;
  averageResolutionTime: number;
}

export interface FilterOptions {
  status?: string[];
  type?: string[];
  priority?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  location?: string;
}