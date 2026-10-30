export type UserRole = 'citizen' | 'officer' | 'admin';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'critical';

export type ComplaintStatus = 
  | 'submitted' 
  | 'under_review' 
  | 'verified' 
  | 'assigned' 
  | 'in_progress' 
  | 'resolved' 
  | 'rejected' 
  | 'reopened';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  department_id?: string;
  department_name?: string;
  ward?: string;
  avatar_url?: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  description: string;
  head_officer_name: string;
  contact_email: string;
  contact_phone: string;
  sla_hours: number;
  icon: string;
}

export interface ComplaintHistory {
  id: string;
  complaint_id: string;
  previous_status?: ComplaintStatus;
  new_status: ComplaintStatus;
  updated_by_id?: string;
  updated_by_name: string;
  updated_by_role: string;
  comment?: string;
  created_at: string;
}

export interface CitizenFeedback {
  id: string;
  complaint_id: string;
  citizen_id?: string;
  rating: number;
  satisfaction_level: 'very_satisfied' | 'satisfied' | 'neutral' | 'dissatisfied';
  comment?: string;
  created_at: string;
}

export interface Complaint {
  id: string;
  reference_number: string;
  citizen_id: string;
  citizen_name: string;
  citizen_email?: string;
  citizen_phone?: string;
  title: string;
  description: string;
  category: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  location_name: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  ward?: string;
  images?: string[];
  assigned_department_id?: string;
  assigned_department_name?: string;
  assigned_officer_id?: string;
  assigned_officer_name?: string;
  rejection_reason?: string;
  resolution_notes?: string;
  resolution_image_url?: string;
  ai_category_suggestion?: string;
  ai_priority_suggestion?: ComplaintPriority;
  ai_summary?: string;
  ai_duplicate_risk?: boolean;
  ai_recommended_department?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  history?: ComplaintHistory[];
  feedback?: CitizenFeedback;
}

export interface NotificationItem {
  id: string;
  user_id?: string;
  role_target: 'all' | 'citizen' | 'officer' | 'admin';
  title: string;
  message: string;
  type: 'complaint_status' | 'assignment' | 'announcement' | 'alert';
  complaint_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'maintenance' | 'weather' | 'emergency' | 'traffic' | 'general';
  priority: 'normal' | 'urgent' | 'critical';
  author_name: string;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

export interface SensorDevice {
  id: string;
  device_id: string;
  module_type: 'waste' | 'water' | 'energy' | 'flood' | 'environment' | 'traffic';
  name: string;
  location_name: string;
  latitude: number;
  longitude: number;
  ward: string;
  status: 'online' | 'warning' | 'alert' | 'offline';
  last_reading_value: number;
  last_reading_unit: string;
  threshold_value: number;
  last_ping_at: string;
}

export interface DashboardSummary {
  total: number;
  active: number;
  submitted: number;
  under_review: number;
  verified: number;
  assigned: number;
  in_progress: number;
  resolved: number;
  rejected: number;
  reopened: number;
  critical: number;
  avg_resolution_hours: number;
  resolution_rate: number;
  satisfaction_score: number;
}
