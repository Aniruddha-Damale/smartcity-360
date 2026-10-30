import { 
  Complaint, Department, SensorDevice, Announcement, 
  NotificationItem, DashboardSummary 
} from '../types';
import { 
  initialDepartments, initialComplaints, initialSensors, 
  initialAnnouncements, initialNotifications 
} from '../data/seedData';

const API_BASE = '/api';

// Local storage keys for standalone static / GitHub Pages mode
const STORAGE_COMPLAINTS = 'smartcity360_complaints';
const STORAGE_NOTIFICATIONS = 'smartcity360_notifications';
const STORAGE_ANNOUNCEMENTS = 'smartcity360_announcements';

function getLocalComplaints(): Complaint[] {
  try {
    const saved = localStorage.getItem(STORAGE_COMPLAINTS);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [...initialComplaints];
}

function saveLocalComplaints(data: Complaint[]) {
  try {
    localStorage.setItem(STORAGE_COMPLAINTS, JSON.stringify(data));
  } catch {}
}

function getLocalNotifications(): NotificationItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_NOTIFICATIONS);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [...initialNotifications];
}

function saveLocalNotifications(data: NotificationItem[]) {
  try {
    localStorage.setItem(STORAGE_NOTIFICATIONS, JSON.stringify(data));
  } catch {}
}

async function tryFetchJson(url: string, options?: RequestInit): Promise<any | null> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export const api = {
  // Complaints
  async getComplaints(filters?: Record<string, string>): Promise<Complaint[]> {
    const params = new URLSearchParams(filters);
    const json = await tryFetchJson(`${API_BASE}/complaints?${params.toString()}`);
    if (json && json.data) return json.data;

    let list = getLocalComplaints();
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        list = list.filter(c => c.status === filters.status);
      }
      if (filters.priority && filters.priority !== 'all') {
        list = list.filter(c => c.priority === filters.priority);
      }
      if (filters.department_id && filters.department_id !== 'all') {
        list = list.filter(c => c.assigned_department_id === filters.department_id);
      }
      if (filters.ward && filters.ward !== 'all') {
        list = list.filter(c => c.ward === filters.ward);
      }
    }
    return list;
  },

  async getComplaintById(id: string): Promise<Complaint> {
    const json = await tryFetchJson(`${API_BASE}/complaints/${id}`);
    if (json && json.data) return json.data;

    const list = getLocalComplaints();
    const item = list.find(c => c.id === id || c.reference_number === id);
    if (!item) throw new Error('Complaint not found');
    return item;
  },

  async createComplaint(payload: any): Promise<{ data: Complaint; duplicateWarning?: any }> {
    const json = await tryFetchJson(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (json && json.data) return json;

    const list = getLocalComplaints();
    const newRef = `SC360-2026-${String(list.length + 101).padStart(5, '0')}`;
    const newComplaint: Complaint = {
      id: `complaint-${Date.now()}`,
      reference_number: newRef,
      title: payload.title,
      description: payload.description,
      category: payload.category || 'general',
      priority: payload.priority || 'medium',
      severity_score: payload.severity_score || 55,
      status: 'submitted',
      citizen_id: payload.citizen_id || 'user-citizen',
      citizen_name: payload.citizen_name || 'Aarav Mehta',
      citizen_phone: payload.citizen_phone || '+1-555-019-2831',
      citizen_email: payload.citizen_email || 'citizen@smartcity360.gov',
      ward: payload.ward || 'Ward 4 - Downtown Central',
      address_text: payload.address_text || 'Downtown City Core',
      latitude: payload.latitude || 40.7128,
      longitude: payload.longitude || -74.0060,
      image_urls: payload.image_urls || ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800'],
      assigned_department_id: payload.assigned_department_id || 'dept-roads',
      assigned_department_name: payload.assigned_department_name || 'Roads & Infrastructure',
      ai_auto_triaged: true,
      sla_due_at: new Date(Date.now() + 36 * 3600000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      history: [
        {
          id: `hist-${Date.now()}`,
          complaint_id: `complaint-${Date.now()}`,
          new_status: 'submitted',
          updated_by_name: payload.citizen_name || 'Citizen Portal',
          updated_by_role: 'citizen',
          comment: 'Civic grievance officially registered in municipal records.',
          created_at: new Date().toISOString()
        }
      ]
    };

    list.unshift(newComplaint);
    saveLocalComplaints(list);
    return { data: newComplaint };
  },

  async updateComplaintStatus(id: string, payload: {
    status: string;
    updated_by_name: string;
    updated_by_role: string;
    comment?: string;
    resolution_notes?: string;
    resolution_image_url?: string;
  }): Promise<Complaint> {
    const json = await tryFetchJson(`${API_BASE}/complaints/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (json && json.data) return json.data;

    const list = getLocalComplaints();
    const idx = list.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Complaint not found');

    const prev = list[idx];
    const updated: Complaint = {
      ...prev,
      status: payload.status as any,
      resolution_notes: payload.resolution_notes || prev.resolution_notes,
      resolution_image_url: payload.resolution_image_url || prev.resolution_image_url,
      updated_at: new Date().toISOString(),
      history: [
        ...(prev.history || []),
        {
          id: `hist-${Date.now()}`,
          complaint_id: prev.id,
          previous_status: prev.status,
          new_status: payload.status as any,
          updated_by_name: payload.updated_by_name,
          updated_by_role: payload.updated_by_role,
          comment: payload.comment || `Status changed to ${payload.status.replace('_', ' ')}`,
          created_at: new Date().toISOString()
        }
      ]
    };
    list[idx] = updated;
    saveLocalComplaints(list);
    return updated;
  },

  async assignComplaint(id: string, payload: {
    department_id: string;
    officer_id?: string;
    assigned_by_name?: string;
    assigned_by_role?: string;
    notes?: string;
  }): Promise<Complaint> {
    const json = await tryFetchJson(`${API_BASE}/complaints/${id}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (json && json.data) return json.data;

    const list = getLocalComplaints();
    const idx = list.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Complaint not found');

    const dept = initialDepartments.find(d => d.id === payload.department_id);
    const updated: Complaint = {
      ...list[idx],
      assigned_department_id: payload.department_id,
      assigned_department_name: dept?.name || list[idx].assigned_department_name,
      assigned_officer_id: payload.officer_id,
      status: 'assigned',
      updated_at: new Date().toISOString(),
      history: [
        ...(list[idx].history || []),
        {
          id: `hist-${Date.now()}`,
          complaint_id: list[idx].id,
          previous_status: list[idx].status,
          new_status: 'assigned',
          updated_by_name: payload.assigned_by_name || 'Admin Dispatch',
          updated_by_role: payload.assigned_by_role || 'admin',
          comment: payload.notes || `Reassigned to ${dept?.name || payload.department_id}`,
          created_at: new Date().toISOString()
        }
      ]
    };
    list[idx] = updated;
    saveLocalComplaints(list);
    return updated;
  },

  async reopenComplaint(id: string, payload: { reason: string; citizen_id?: string }): Promise<Complaint> {
    const json = await tryFetchJson(`${API_BASE}/complaints/${id}/reopen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (json && json.data) return json.data;

    const list = getLocalComplaints();
    const idx = list.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Complaint not found');

    const updated: Complaint = {
      ...list[idx],
      status: 'reopened',
      updated_at: new Date().toISOString(),
      history: [
        ...(list[idx].history || []),
        {
          id: `hist-${Date.now()}`,
          complaint_id: list[idx].id,
          previous_status: list[idx].status,
          new_status: 'reopened',
          updated_by_name: 'Citizen',
          updated_by_role: 'citizen',
          comment: payload.reason || 'Citizen unsatisfied with resolution. Reopened for audit.',
          created_at: new Date().toISOString()
        }
      ]
    };
    list[idx] = updated;
    saveLocalComplaints(list);
    return updated;
  },

  async submitFeedback(id: string, payload: {
    rating: number;
    satisfaction_level: string;
    comment?: string;
    citizen_id?: string;
  }): Promise<Complaint> {
    const json = await tryFetchJson(`${API_BASE}/complaints/${id}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (json && json.data) return json.data;

    const list = getLocalComplaints();
    const idx = list.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Complaint not found');

    const updated: Complaint = {
      ...list[idx],
      feedback: {
        id: `fb-${Date.now()}`,
        complaint_id: list[idx].id,
        rating: payload.rating,
        satisfaction_level: payload.satisfaction_level as any,
        comment: payload.comment,
        created_at: new Date().toISOString()
      }
    };
    list[idx] = updated;
    saveLocalComplaints(list);
    return updated;
  },

  // Dashboard
  async getDashboardSummary(): Promise<DashboardSummary> {
    const json = await tryFetchJson(`${API_BASE}/dashboard/summary`);
    if (json && json.data) return json.data;

    const list = getLocalComplaints();
    const total = list.length;
    const resolved = list.filter(c => c.status === 'resolved').length;
    const pending = list.filter(c => ['submitted', 'under_review', 'verified', 'assigned', 'in_progress', 'reopened'].includes(c.status)).length;
    const critical = list.filter(c => c.priority === 'critical' && c.status !== 'resolved').length;

    return {
      total_complaints: total,
      pending_complaints: pending,
      resolved_complaints: resolved,
      critical_alerts: critical,
      resolution_rate_percentage: total > 0 ? Math.round((resolved / total) * 100) : 88,
      average_resolution_hours: 21.4,
      department_counts: initialDepartments.map(d => ({
        department_id: d.id,
        department_name: d.name,
        count: list.filter(c => c.assigned_department_id === d.id).length
      })),
      recent_activity: list.slice(0, 5)
    };
  },

  async getDashboardAnalytics(): Promise<any> {
    const json = await tryFetchJson(`${API_BASE}/dashboard/analytics`);
    if (json && json.data) return json.data;

    return {
      trends: [
        { day: 'Mon', count: 14, resolved: 12 },
        { day: 'Tue', count: 18, resolved: 15 },
        { day: 'Wed', count: 24, resolved: 20 },
        { day: 'Thu', count: 19, resolved: 17 },
        { day: 'Fri', count: 27, resolved: 22 },
        { day: 'Sat', count: 12, resolved: 11 },
        { day: 'Sun', count: 8, resolved: 7 },
      ],
      slaCompliance: 92.4,
      citizenSatisfactionScore: 4.6
    };
  },

  // Departments
  async getDepartments(): Promise<Department[]> {
    const json = await tryFetchJson(`${API_BASE}/departments`);
    if (json && json.data) return json.data;
    return initialDepartments;
  },

  // Notifications
  async getNotifications(userId?: string, role?: string): Promise<NotificationItem[]> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (role) params.append('role', role);
    const json = await tryFetchJson(`${API_BASE}/notifications?${params.toString()}`);
    if (json && json.data) return json.data;
    return getLocalNotifications();
  },

  async markNotificationRead(id: string): Promise<void> {
    await tryFetchJson(`${API_BASE}/notifications/${id}/read`, { method: 'PATCH' });
    const list = getLocalNotifications();
    const item = list.find(n => n.id === id);
    if (item) {
      item.read = true;
      saveLocalNotifications(list);
    }
  },

  async markAllNotificationsRead(userId?: string): Promise<void> {
    await tryFetchJson(`${API_BASE}/notifications/read-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const list = getLocalNotifications().map(n => ({ ...n, read: true }));
    saveLocalNotifications(list);
  },

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    const json = await tryFetchJson(`${API_BASE}/announcements`);
    if (json && json.data) return json.data;
    return initialAnnouncements;
  },

  // Sensors
  async getSensors(moduleType?: string): Promise<SensorDevice[]> {
    const params = moduleType ? `?module_type=${moduleType}` : '';
    const json = await tryFetchJson(`${API_BASE}/sensors${params}`);
    if (json && json.data) return json.data;
    if (moduleType) {
      return initialSensors.filter(s => s.module_type === moduleType);
    }
    return initialSensors;
  },

  // Map
  async getMapComplaints(filters?: Record<string, string>): Promise<any[]> {
    const params = new URLSearchParams(filters);
    const json = await tryFetchJson(`${API_BASE}/map/complaints?${params.toString()}`);
    if (json && json.data) return json.data;
    return this.getComplaints(filters);
  },

  // AI Services
  async classifyComplaintAI(title: string, description: string): Promise<any> {
    const json = await tryFetchJson(`${API_BASE}/ai/classify-complaint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    if (json && json.data) return json.data;

    const text = `${title} ${description}`.toLowerCase();
    let category = 'general';
    let department_id = 'dept-roads';
    let priority = 'medium';
    let severity = 50;

    if (text.includes('pothole') || text.includes('road') || text.includes('pavement') || text.includes('bridge')) {
      category = 'roads';
      department_id = 'dept-roads';
      priority = text.includes('deep') || text.includes('accident') ? 'high' : 'medium';
      severity = 68;
    } else if (text.includes('water') || text.includes('pipe') || text.includes('leak') || text.includes('sewage')) {
      category = 'water';
      department_id = 'dept-water';
      priority = text.includes('flood') || text.includes('burst') ? 'critical' : 'high';
      severity = 82;
    } else if (text.includes('garbage') || text.includes('waste') || text.includes('trash') || text.includes('dump')) {
      category = 'waste';
      department_id = 'dept-waste';
      priority = 'medium';
      severity = 45;
    } else if (text.includes('light') || text.includes('street light') || text.includes('lamp') || text.includes('spark') || text.includes('wire')) {
      category = 'energy';
      department_id = 'dept-energy';
      priority = text.includes('live wire') ? 'critical' : 'medium';
      severity = 62;
    } else if (text.includes('traffic') || text.includes('signal') || text.includes('congestion')) {
      category = 'traffic';
      department_id = 'dept-traffic';
      priority = 'high';
      severity = 75;
    }

    return {
      category,
      department_id,
      priority,
      severity_score: severity,
      confidence_score: 0.94,
      tags: [category, 'triaged-ai'],
      ai_reasoning: `AI analyzed report keywords and classified this issue under ${category.toUpperCase()} with ${priority.toUpperCase()} priority.`
    };
  },

  async detectDuplicatesAI(payload: {
    title: string;
    description: string;
    latitude?: number;
    longitude?: number;
    category?: string;
  }): Promise<any> {
    const json = await tryFetchJson(`${API_BASE}/ai/detect-duplicates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (json && json.data) return json.data;

    return {
      is_duplicate: false,
      potential_matches: []
    };
  },

  async chatWithAI(message: string, user?: { name?: string; role?: string }): Promise<string> {
    const json = await tryFetchJson(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, user }),
    });
    if (json && json.reply) return json.reply;

    const lower = message.toLowerCase();
    if (lower.includes('pothole') || lower.includes('road')) {
      return `Hello ${user?.name || 'Citizen'}! To report road hazards or potholes, head to the "Report Issue" tab. Our AI will automatically calculate severity and assign the complaint directly to the Roads & Infrastructure Directorate (SLA: 36h).`;
    }
    if (lower.includes('status') || lower.includes('track')) {
      return `You can track active grievances live in your dashboard or using the search bar with your Reference ID (e.g., SC360-2026-00101).`;
    }
    if (lower.includes('water') || lower.includes('leak')) {
      return `Water leakage and pipeline faults are treated with high urgency by the Water Supply & Sewerage Board. Submitting with photo verification activates GPS triangulation for maintenance squads.`;
    }
    return `SmartCity 360 AI Assistant: I am connected to all 7 municipal service directorates. How can I assist you with city services, grievance tracking, or municipal alerts today?`;
  }
};
