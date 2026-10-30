import { 
  Complaint, Department, UserProfile, SensorDevice, Announcement, 
  NotificationItem, ComplaintStatus, ComplaintPriority, CitizenFeedback, ComplaintHistory 
} from '../types.js';
import { 
  initialComplaints, initialDepartments, initialProfiles, 
  initialSensorDevices, initialAnnouncements, initialNotifications 
} from './seedData.js';

class DataStore {
  private complaints: Complaint[] = [...initialComplaints];
  private departments: Department[] = [...initialDepartments];
  private profiles: UserProfile[] = [...initialProfiles];
  private sensors: SensorDevice[] = [...initialSensorDevices];
  private announcements: Announcement[] = [...initialAnnouncements];
  private notifications: NotificationItem[] = [...initialNotifications];
  private nextReferenceCounter = 1047;

  // Complaints
  getComplaints(filters?: {
    status?: string;
    category?: string;
    priority?: string;
    department_id?: string;
    citizen_id?: string;
    search?: string;
  }): Complaint[] {
    let result = [...this.complaints];

    if (filters?.status && filters.status !== 'all') {
      result = result.filter(c => c.status === filters.status);
    }
    if (filters?.category && filters.category !== 'all') {
      result = result.filter(c => c.category === filters.category);
    }
    if (filters?.priority && filters.priority !== 'all') {
      result = result.filter(c => c.priority === filters.priority);
    }
    if (filters?.department_id && filters.department_id !== 'all') {
      result = result.filter(c => c.assigned_department_id === filters.department_id);
    }
    if (filters?.citizen_id) {
      result = result.filter(c => c.citizen_id === filters.citizen_id);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.reference_number.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.location_name.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getComplaintById(id: string): Complaint | undefined {
    return this.complaints.find(c => c.id === id || c.reference_number.toUpperCase() === id.toUpperCase());
  }

  createComplaint(data: Partial<Complaint>): Complaint {
    const refNum = `SC360-2026-${this.nextReferenceCounter++}`;
    const id = `comp-${Date.now()}`;
    const now = new Date().toISOString();

    const newComplaint: Complaint = {
      id,
      reference_number: refNum,
      citizen_id: data.citizen_id || 'user-citizen',
      citizen_name: data.citizen_name || 'Aarav Mehta',
      citizen_email: data.citizen_email || 'citizen@smartcity360.gov',
      citizen_phone: data.citizen_phone || '+1-555-019-2831',
      title: data.title || 'Untitled Complaint',
      description: data.description || '',
      category: data.category || 'Other civic issues',
      priority: data.priority || 'medium',
      status: 'submitted',
      location_name: data.location_name || 'Metropolitan Ward',
      landmark: data.landmark || '',
      latitude: data.latitude || 19.0760,
      longitude: data.longitude || 72.8777,
      ward: data.ward || 'Ward 4',
      images: data.images || [],
      assigned_department_id: data.assigned_department_id,
      assigned_department_name: data.assigned_department_name,
      ai_category_suggestion: data.ai_category_suggestion,
      ai_priority_suggestion: data.ai_priority_suggestion,
      ai_summary: data.ai_summary,
      ai_duplicate_risk: data.ai_duplicate_risk,
      ai_recommended_department: data.ai_recommended_department,
      is_public: data.is_public !== undefined ? data.is_public : true,
      created_at: now,
      updated_at: now,
      history: [
        {
          id: `hist-${Date.now()}`,
          complaint_id: id,
          new_status: 'submitted',
          updated_by_name: data.citizen_name || 'Aarav Mehta',
          updated_by_role: 'citizen',
          comment: 'Complaint officially submitted via SmartCity 360 portal.',
          created_at: now
        }
      ]
    };

    this.complaints.unshift(newComplaint);

    // Notify Officers and Citizen
    this.createNotification({
      user_id: newComplaint.citizen_id,
      role_target: 'citizen',
      title: `Complaint Submitted: ${refNum}`,
      message: `Your report "${newComplaint.title}" has been registered. You can track it using Reference #${refNum}.`,
      type: 'complaint_status',
      complaint_id: id,
    });

    this.createNotification({
      role_target: 'officer',
      title: `New Report: ${refNum}`,
      message: `New civic report in ${newComplaint.category} submitted at ${newComplaint.location_name}.`,
      type: 'complaint_status',
      complaint_id: id,
    });

    return newComplaint;
  }

  updateComplaintStatus(
    id: string, 
    newStatus: ComplaintStatus, 
    updatedBy: { name: string; role: string; id?: string }, 
    comment?: string,
    resolutionNotes?: string,
    resolutionImageUrl?: string
  ): Complaint | null {
    const comp = this.getComplaintById(id);
    if (!comp) return null;

    const oldStatus = comp.status;
    const now = new Date().toISOString();
    comp.status = newStatus;
    comp.updated_at = now;

    if (newStatus === 'resolved') {
      comp.resolved_at = now;
      if (resolutionNotes) comp.resolution_notes = resolutionNotes;
      if (resolutionImageUrl) comp.resolution_image_url = resolutionImageUrl;
    }

    if (newStatus === 'rejected' && comment) {
      comp.rejection_reason = comment;
    }

    const historyItem: ComplaintHistory = {
      id: `hist-${Date.now()}`,
      complaint_id: comp.id,
      previous_status: oldStatus,
      new_status: newStatus,
      updated_by_id: updatedBy.id,
      updated_by_name: updatedBy.name,
      updated_by_role: updatedBy.role,
      comment: comment || `Status updated from ${oldStatus} to ${newStatus}`,
      created_at: now
    };

    if (!comp.history) comp.history = [];
    comp.history.push(historyItem);

    // Create In-App Notification for Citizen
    const statusTitles: Record<ComplaintStatus, string> = {
      submitted: 'Complaint Submitted',
      under_review: 'Complaint Under Review',
      verified: 'Complaint Verified by Authorities',
      assigned: 'Complaint Assigned to Department',
      in_progress: 'Remedial Work Started',
      resolved: 'Complaint Marked Resolved 🎉',
      rejected: 'Complaint Rejected',
      reopened: 'Complaint Reopened for Review'
    };

    this.createNotification({
      user_id: comp.citizen_id,
      role_target: 'citizen',
      title: `${statusTitles[newStatus]}: ${comp.reference_number}`,
      message: comment || `The status of your complaint has progressed to "${newStatus.replace('_', ' ').toUpperCase()}".`,
      type: 'complaint_status',
      complaint_id: comp.id
    });

    return comp;
  }

  assignComplaint(
    id: string, 
    departmentId: string, 
    officerId?: string, 
    assignedBy?: { name: string; role: string }
  ): Complaint | null {
    const comp = this.getComplaintById(id);
    if (!comp) return null;

    const dept = this.departments.find(d => d.id === departmentId);
    const officer = this.profiles.find(p => p.id === officerId);

    comp.assigned_department_id = departmentId;
    comp.assigned_department_name = dept ? dept.name : undefined;
    if (officer) {
      comp.assigned_officer_id = officer.id;
      comp.assigned_officer_name = officer.full_name;
    }

    const now = new Date().toISOString();
    comp.updated_at = now;

    if (comp.status === 'submitted' || comp.status === 'under_review') {
      comp.status = 'assigned';
    }

    if (!comp.history) comp.history = [];
    comp.history.push({
      id: `hist-${Date.now()}`,
      complaint_id: comp.id,
      previous_status: comp.status,
      new_status: 'assigned',
      updated_by_name: assignedBy?.name || 'Administrator',
      updated_by_role: assignedBy?.role || 'admin',
      comment: `Assigned to department "${dept?.name || departmentId}"${officer ? ` (Officer: ${officer.full_name})` : ''}`,
      created_at: now
    });

    this.createNotification({
      user_id: comp.citizen_id,
      role_target: 'citizen',
      title: `Assigned to ${dept?.name || 'Department'}: ${comp.reference_number}`,
      message: `Your complaint is now under active processing by ${dept?.name}.`,
      type: 'assignment',
      complaint_id: comp.id
    });

    return comp;
  }

  reopenComplaint(id: string, reason: string, citizenId?: string): Complaint | null {
    const comp = this.getComplaintById(id);
    if (!comp) return null;

    const now = new Date().toISOString();
    comp.status = 'reopened';
    comp.updated_at = now;

    if (!comp.history) comp.history = [];
    comp.history.push({
      id: `hist-${Date.now()}`,
      complaint_id: comp.id,
      previous_status: 'resolved',
      new_status: 'reopened',
      updated_by_name: comp.citizen_name,
      updated_by_role: 'citizen',
      comment: `Reopened by citizen: ${reason}`,
      created_at: now
    });

    this.createNotification({
      role_target: 'officer',
      title: `Complaint Reopened: ${comp.reference_number}`,
      message: `Citizen reported unresolved issue. Reason: "${reason}"`,
      type: 'alert',
      complaint_id: comp.id
    });

    return comp;
  }

  addFeedback(complaintId: string, feedback: { rating: number; satisfaction_level: any; comment?: string; citizen_id?: string }): Complaint | null {
    const comp = this.getComplaintById(complaintId);
    if (!comp) return null;

    comp.feedback = {
      id: `fb-${Date.now()}`,
      complaint_id: comp.id,
      citizen_id: feedback.citizen_id || comp.citizen_id,
      rating: feedback.rating,
      satisfaction_level: feedback.satisfaction_level,
      comment: feedback.comment,
      created_at: new Date().toISOString()
    };

    return comp;
  }

  // Dashboard Metrics
  getDashboardSummary() {
    const total = this.complaints.length;
    const submitted = this.complaints.filter(c => c.status === 'submitted').length;
    const under_review = this.complaints.filter(c => c.status === 'under_review').length;
    const verified = this.complaints.filter(c => c.status === 'verified').length;
    const assigned = this.complaints.filter(c => c.status === 'assigned').length;
    const in_progress = this.complaints.filter(c => c.status === 'in_progress').length;
    const resolved = this.complaints.filter(c => c.status === 'resolved').length;
    const rejected = this.complaints.filter(c => c.status === 'rejected').length;
    const reopened = this.complaints.filter(c => c.status === 'reopened').length;
    const critical = this.complaints.filter(c => c.priority === 'critical' && c.status !== 'resolved').length;
    const active = total - resolved - rejected;

    // Calculate avg resolution time in hours
    const resolvedComplaints = this.complaints.filter(c => c.resolved_at && c.created_at);
    let avgResolutionHours = 24.5;
    if (resolvedComplaints.length > 0) {
      const totalHours = resolvedComplaints.reduce((acc, c) => {
        const diff = (new Date(c.resolved_at!).getTime() - new Date(c.created_at).getTime()) / (1000 * 3600);
        return acc + diff;
      }, 0);
      avgResolutionHours = Math.round((totalHours / resolvedComplaints.length) * 10) / 10;
    }

    return {
      total,
      active,
      submitted,
      under_review,
      verified,
      assigned,
      in_progress,
      resolved,
      rejected,
      reopened,
      critical,
      avg_resolution_hours: avgResolutionHours,
      resolution_rate: total > 0 ? Math.round((resolved / total) * 100) : 0,
      satisfaction_score: 4.8
    };
  }

  getDashboardAnalytics() {
    // 1. By Category
    const categoryCounts: Record<string, number> = {};
    for (const c of this.complaints) {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    }
    const complaintsByCategory = Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count);

    // 2. By Status
    const statusCounts: Record<string, number> = {};
    for (const c of this.complaints) {
      statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
    }
    const complaintsByStatus = Object.entries(statusCounts).map(([name, value]) => ({
      name: name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value,
      statusKey: name
    }));

    // 3. By Department
    const departmentWorkload = this.departments.map(dept => {
      const assigned = this.complaints.filter(c => c.assigned_department_id === dept.id);
      const resolved = assigned.filter(c => c.status === 'resolved').length;
      return {
        name: dept.name,
        code: dept.code,
        total: assigned.length,
        pending: assigned.length - resolved,
        resolved,
        sla_hours: dept.sla_hours
      };
    });

    // 4. Trend over past 7 days
    const past7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        date: dateStr,
        reported: Math.floor(Math.random() * 5) + 3,
        resolved: Math.floor(Math.random() * 4) + 2
      };
    });

    // 5. Hotspot Areas
    const wardCounts: Record<string, number> = {};
    for (const c of this.complaints) {
      const ward = c.ward || 'Ward 4';
      wardCounts[ward] = (wardCounts[ward] || 0) + 1;
    }
    const hotspots = Object.entries(wardCounts).map(([ward, count]) => ({
      ward,
      count
    }));

    return {
      complaintsByCategory,
      complaintsByStatus,
      departmentWorkload,
      trendsOverTime: past7Days,
      hotspots
    };
  }

  // Departments
  getDepartments(): Department[] {
    return [...this.departments];
  }

  // Notifications
  getNotifications(userId?: string, role?: string): NotificationItem[] {
    let result = [...this.notifications];
    if (userId) {
      result = result.filter(n => n.user_id === userId || n.role_target === 'all' || (role && n.role_target === role));
    }
    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  createNotification(notif: Partial<NotificationItem>): NotificationItem {
    const item: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: notif.user_id,
      role_target: notif.role_target || 'all',
      title: notif.title || 'Civic Update',
      message: notif.message || '',
      type: notif.type || 'complaint_status',
      complaint_id: notif.complaint_id,
      is_read: false,
      created_at: new Date().toISOString()
    };
    this.notifications.unshift(item);
    return item;
  }

  markNotificationRead(id: string): boolean {
    const item = this.notifications.find(n => n.id === id);
    if (item) {
      item.is_read = true;
      return true;
    }
    return false;
  }

  markAllNotificationsRead(userId?: string): number {
    let count = 0;
    for (const n of this.notifications) {
      if (!userId || n.user_id === userId || n.role_target === 'all') {
        n.is_read = true;
        count++;
      }
    }
    return count;
  }

  // Announcements
  getAnnouncements(): Announcement[] {
    return [...this.announcements].filter(a => a.is_active);
  }

  createAnnouncement(data: Partial<Announcement>): Announcement {
    const item: Announcement = {
      id: `ann-${Date.now()}`,
      title: data.title || 'Civic Announcement',
      content: data.content || '',
      category: data.category || 'general',
      priority: data.priority || 'normal',
      author_name: data.author_name || 'Municipal Administration',
      is_active: true,
      expires_at: data.expires_at,
      created_at: new Date().toISOString()
    };
    this.announcements.unshift(item);
    return item;
  }

  // Sensors
  getSensors(moduleType?: string): SensorDevice[] {
    if (moduleType && moduleType !== 'all') {
      return this.sensors.filter(s => s.module_type === moduleType);
    }
    return [...this.sensors];
  }

  updateSensorReading(deviceId: string, value: number): SensorDevice | null {
    const s = this.sensors.find(item => item.device_id === deviceId);
    if (!s) return null;
    s.last_reading_value = value;
    s.last_ping_at = new Date().toISOString();
    if (value >= s.threshold_value) {
      s.status = 'alert';
    } else if (value >= s.threshold_value * 0.8) {
      s.status = 'warning';
    } else {
      s.status = 'online';
    }
    return s;
  }
}

export const store = new DataStore();
