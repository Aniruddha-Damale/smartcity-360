-- ====================================================================
-- SMARTCITY 360 — Supabase PostgreSQL Database Schema
-- AI-Powered Integrated Urban Management System
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    head_officer_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    sla_hours INTEGER DEFAULT 48,
    icon VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. User Profiles Table (extends Supabase auth.users or standalone auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL CHECK (role IN ('citizen', 'officer', 'admin')),
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    ward VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Complaints Table
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_number VARCHAR(50) UNIQUE NOT NULL,
    citizen_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    citizen_name VARCHAR(255) NOT NULL,
    citizen_email VARCHAR(255),
    citizen_phone VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(50) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'verified', 'assigned', 'in_progress', 'resolved', 'rejected', 'reopened')),
    location_name VARCHAR(255) NOT NULL,
    landmark VARCHAR(255),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    ward VARCHAR(100),
    assigned_department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    assigned_officer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_officer_name VARCHAR(255),
    rejection_reason TEXT,
    resolution_notes TEXT,
    resolution_image_url TEXT,
    ai_category_suggestion VARCHAR(100),
    ai_priority_suggestion VARCHAR(50),
    ai_summary TEXT,
    ai_duplicate_risk BOOLEAN DEFAULT FALSE,
    ai_recommended_department VARCHAR(100),
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 5. Complaint Images
CREATE TABLE IF NOT EXISTS public.complaint_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_resolution BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Complaint History (Audit Trail)
CREATE TABLE IF NOT EXISTS public.complaint_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    updated_by_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_by_name VARCHAR(255) NOT NULL,
    updated_by_role VARCHAR(50) NOT NULL,
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Complaint Assignments Log
CREATE TABLE IF NOT EXISTS public.complaint_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    officer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_by_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_target VARCHAR(50) DEFAULT 'all',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Citizen Feedback Table
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL UNIQUE REFERENCES public.complaints(id) ON DELETE CASCADE,
    citizen_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    satisfaction_level VARCHAR(50) CHECK (satisfaction_level IN ('very_satisfied', 'satisfied', 'neutral', 'dissatisfied')),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Public Announcements
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'normal',
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. IoT Sensor Devices
CREATE TABLE IF NOT EXISTS public.sensor_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(100) UNIQUE NOT NULL,
    module_type VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    ward VARCHAR(100),
    status VARCHAR(50) DEFAULT 'online',
    last_reading_value NUMERIC(10, 2),
    last_reading_unit VARCHAR(50),
    threshold_value NUMERIC(10, 2),
    last_ping_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Sensor Readings Log
CREATE TABLE IF NOT EXISTS public.sensor_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(100) NOT NULL REFERENCES public.sensor_devices(device_id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    value NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'normal',
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_name VARCHAR(255),
    actor_role VARCHAR(50),
    target_resource VARCHAR(100),
    target_id VARCHAR(100),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Indexes for High-Performance Queries
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON public.complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_priority ON public.complaints(priority);
CREATE INDEX IF NOT EXISTS idx_complaints_citizen ON public.complaints(citizen_id);
CREATE INDEX IF NOT EXISTS idx_complaints_department ON public.complaints(assigned_department_id);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON public.complaints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_sensor_devices_type ON public.sensor_devices(module_type);

-- 15. Supabase Row Level Security (RLS) Setup
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_devices ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view basic info, users can edit their own profile
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Complaints Policies:
-- 1. Anyone can view public complaints on the public map / dashboard
CREATE POLICY "Public complaints viewable by all" ON public.complaints FOR SELECT USING (is_public = true OR auth.uid() = citizen_id);
-- 2. Citizens can insert complaints
CREATE POLICY "Citizens can insert complaints" ON public.complaints FOR INSERT WITH CHECK (auth.uid() = citizen_id OR citizen_id IS NULL);
-- 3. Officers & Admins can update status, assign department
CREATE POLICY "Authorized officers can update complaints" ON public.complaints FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('officer', 'admin'))
);

-- Departments: Publicly readable, admin editable
CREATE POLICY "Departments are viewable by everyone" ON public.departments FOR SELECT USING (true);

-- Notifications: Only visible to the recipient
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id OR role_target = 'all');
