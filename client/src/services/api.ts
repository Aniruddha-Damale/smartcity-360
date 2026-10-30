import { 
  Complaint, Department, SensorDevice, Announcement, 
  NotificationItem, DashboardSummary 
} from '../types';

const API_BASE = '/api';

export const api = {
  // Complaints
  async getComplaints(filters?: Record<string, string>): Promise<Complaint[]> {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_BASE}/complaints?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch complaints');
    const data = await res.json();
    return data.data;
  },

  async getComplaintById(id: string): Promise<Complaint> {
    const res = await fetch(`${API_BASE}/complaints/${id}`);
    if (!res.ok) throw new Error('Failed to fetch complaint details');
    const data = await res.json();
    return data.data;
  },

  async createComplaint(payload: any): Promise<{ data: Complaint; duplicateWarning?: any }> {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to submit complaint');
    }
    return res.json();
  },

  async updateComplaintStatus(id: string, payload: {
    status: string;
    updated_by_name: string;
    updated_by_role: string;
    comment?: string;
    resolution_notes?: string;
    resolution_image_url?: string;
  }): Promise<Complaint> {
    const res = await fetch(`${API_BASE}/complaints/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update status');
    const data = await res.json();
    return data.data;
  },

  async assignComplaint(id: string, payload: {
    department_id: string;
    officer_id?: string;
    assigned_by_name?: string;
    assigned_by_role?: string;
    notes?: string;
  }): Promise<Complaint> {
    const res = await fetch(`${API_BASE}/complaints/${id}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to assign complaint');
    const data = await res.json();
    return data.data;
  },

  async reopenComplaint(id: string, payload: { reason: string; citizen_id?: string }): Promise<Complaint> {
    const res = await fetch(`${API_BASE}/complaints/${id}/reopen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to reopen complaint');
    const data = await res.json();
    return data.data;
  },

  async submitFeedback(id: string, payload: {
    rating: number;
    satisfaction_level: string;
    comment?: string;
    citizen_id?: string;
  }): Promise<Complaint> {
    const res = await fetch(`${API_BASE}/complaints/${id}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to submit feedback');
    const data = await res.json();
    return data.data;
  },

  // Dashboard
  async getDashboardSummary(): Promise<DashboardSummary> {
    const res = await fetch(`${API_BASE}/dashboard/summary`);
    if (!res.ok) throw new Error('Failed to fetch dashboard summary');
    const data = await res.json();
    return data.data;
  },

  async getDashboardAnalytics(): Promise<any> {
    const res = await fetch(`${API_BASE}/dashboard/analytics`);
    if (!res.ok) throw new Error('Failed to fetch dashboard analytics');
    const data = await res.json();
    return data.data;
  },

  // Departments
  async getDepartments(): Promise<Department[]> {
    const res = await fetch(`${API_BASE}/departments`);
    if (!res.ok) throw new Error('Failed to fetch departments');
    const data = await res.json();
    return data.data;
  },

  // Notifications
  async getNotifications(userId?: string, role?: string): Promise<NotificationItem[]> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (role) params.append('role', role);
    const res = await fetch(`${API_BASE}/notifications?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    const data = await res.json();
    return data.data;
  },

  async markNotificationRead(id: string): Promise<void> {
    await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PATCH' });
  },

  async markAllNotificationsRead(userId?: string): Promise<void> {
    await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
  },

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    const res = await fetch(`${API_BASE}/announcements`);
    if (!res.ok) throw new Error('Failed to fetch announcements');
    const data = await res.json();
    return data.data;
  },

  // Sensors
  async getSensors(moduleType?: string): Promise<SensorDevice[]> {
    const params = moduleType ? `?module_type=${moduleType}` : '';
    const res = await fetch(`${API_BASE}/sensors${params}`);
    if (!res.ok) throw new Error('Failed to fetch sensors');
    const data = await res.json();
    return data.data;
  },

  // Map
  async getMapComplaints(filters?: Record<string, string>): Promise<any[]> {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_BASE}/map/complaints?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch map complaints');
    const data = await res.json();
    return data.data;
  },

  // AI Services
  async classifyComplaintAI(title: string, description: string): Promise<any> {
    const res = await fetch(`${API_BASE}/ai/classify-complaint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    if (!res.ok) throw new Error('AI classification failed');
    const data = await res.json();
    return data.data;
  },

  async detectDuplicatesAI(payload: {
    title: string;
    description: string;
    latitude?: number;
    longitude?: number;
    category?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/ai/detect-duplicates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Duplicate check failed');
    const data = await res.json();
    return data.data;
  },

  async chatWithAI(message: string, user?: { name?: string; role?: string }): Promise<string> {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, user }),
    });
    if (!res.ok) throw new Error('CityAssist chat failed');
    const data = await res.json();
    return data.reply;
  }
};
