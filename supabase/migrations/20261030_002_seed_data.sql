-- ====================================================================
-- SMARTCITY 360 — Seed Data (Demonstration & Initial Setup)
-- AI-Powered Integrated Urban Management System
-- ====================================================================

-- 1. Insert Core Municipal Departments
INSERT INTO public.departments (id, code, name, description, head_officer_name, contact_email, contact_phone, sla_hours, icon)
VALUES 
  ('11111111-1111-1111-1111-111111111101', 'ROADS', 'Roads & Infrastructure', 'Maintains municipal streets, bridges, pavements, and repairs potholes and road surface hazards.', 'Eng. Rajesh Verma', 'roads@smartcity360.gov', '+1-800-ROADS-01', 36, 'Hammer'),
  ('11111111-1111-1111-1111-111111111102', 'WATER', 'Water Supply & Sewerage Board', 'Manages potable municipal drinking water networks, pipeline leaks, pressure, and sanitary sewage.', 'Dr. Sunita Rao', 'water@smartcity360.gov', '+1-800-WATER-02', 24, 'Droplets'),
  ('11111111-1111-1111-1111-111111111103', 'WASTE', 'Waste & Sanitation Management', 'Oversees municipal solid waste collection, smart bin telemetry, recycling drives, and illegal dumping.', 'Mr. Marcus Vance', 'waste@smartcity360.gov', '+1-800-CLEAN-03', 18, 'Trash2'),
  ('11111111-1111-1111-1111-111111111104', 'ENERGY', 'Electrical & Streetlight Authority', 'Supervises city illumination grids, solar infrastructure, broken fixtures, and power substations.', 'Eng. Priya Sharma', 'energy@smartcity360.gov', '+1-800-LIGHT-04', 24, 'Zap'),
  ('11111111-1111-1111-1111-111111111105', 'TRAFFIC', 'Traffic & Urban Mobility Directorate', 'Monitors arterial transit signals, congestion hotspots, road detours, parking, and public transit nodes.', 'Capt. David Chen', 'traffic@smartcity360.gov', '+1-800-TRANS-05', 12, 'Navigation'),
  ('11111111-1111-1111-1111-111111111106', 'ENV', 'Environmental Protection & Green Space', 'Monitors AQI telemetry, noise levels, public parks, urban tree cover, and industrial emissions.', 'Dr. Elena Rostova', 'environment@smartcity360.gov', '+1-800-GREEN-06', 48, 'Leaf'),
  ('11111111-1111-1111-1111-111111111107', 'SAFETY', 'Public Safety & Emergency Command', 'Coordinates hazard mitigations, emergency service integrations, flood barriers, and shelter alert systems.', 'Chief Robert Sterling', 'safety@smartcity360.gov', '+1-800-ALERT-07', 6, 'ShieldAlert')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Demonstration Profiles for 3 Roles
INSERT INTO public.profiles (id, email, full_name, phone, role, department_id, ward, avatar_url)
VALUES 
  ('22222222-2222-2222-2222-222222222201', 'citizen@smartcity360.gov', 'Aarav Mehta', '+1-555-019-2831', 'citizen', NULL, 'Ward 4 - Downtown Central', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
  ('22222222-2222-2222-2222-222222222202', 'officer.water@smartcity360.gov', 'Inspector Kevin Roy', '+1-555-019-4921', 'officer', '11111111-1111-1111-1111-111111111102', 'Ward 2 - Westside Harbor', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
  ('22222222-2222-2222-2222-222222222203', 'admin@smartcity360.gov', 'Director Sarah Jenkins', '+1-555-019-8812', 'admin', NULL, 'City Metropolitan Command', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Public Announcements
INSERT INTO public.announcements (id, title, content, category, priority, author_name, is_active, expires_at)
VALUES 
  ('44444444-4444-4444-4444-444444444401', 'Scheduled Water Grid Upgrades in Ward 4 & 5', 'Piped supply maintenance will occur Saturday 02:00 AM to 07:00 AM. Backup community water tankers will remain stationed at Civic Square.', 'maintenance', 'normal', 'Director Sarah Jenkins', true, NOW() + INTERVAL '5 days'),
  ('44444444-4444-4444-4444-444444444402', 'Monsoon Drainage Pre-Clearing Drive Initiated', 'Municipal suction trucks and bio-desilting crews are clearing all storm water culverts along the Riverfront Parkway ahead of expected high tide.', 'weather', 'urgent', 'Director Sarah Jenkins', true, NOW() + INTERVAL '10 days'),
  ('44444444-4444-4444-4444-444444444403', 'AI-Driven Smart Dustbin Network Online', 'Over 120 smart bins equipped with ultrasonic fill sensors now broadcast automated compaction and collection triggers across the central district.', 'general', 'normal', 'Mr. Marcus Vance', true, NOW() + INTERVAL '30 days')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert IoT Sensor Devices
INSERT INTO public.sensor_devices (id, device_id, module_type, name, location_name, latitude, longitude, ward, status, last_reading_value, last_reading_unit, threshold_value)
VALUES 
  ('55555555-5555-5555-5555-555555555501', 'IOT-BIN-101', 'waste', 'Solar Smart Bin 101', 'Civic Center North Plaza', 19.0760, 72.8777, 'Ward 4', 'alert', 88.0, '%', 80.0),
  ('55555555-5555-5555-5555-555555555502', 'IOT-BIN-102', 'waste', 'Compact Bin 102', 'Grand Central Metro Exit B', 19.0820, 72.8850, 'Ward 4', 'online', 42.0, '%', 80.0),
  ('55555555-5555-5555-5555-555555555503', 'IOT-WAT-201', 'water', 'Main Arterial Pressure Line A', 'Riverfront Pumphouse 3', 19.0680, 72.8690, 'Ward 2', 'warning', 28.5, 'PSI', 35.0),
  ('55555555-5555-5555-5555-555555555504', 'IOT-WAT-202', 'water', 'Elevated Reservoir Level 4', 'Highland Hill Storage Complex', 19.0910, 72.8950, 'Ward 7', 'online', 76.0, '%', 20.0),
  ('55555555-5555-5555-5555-555555555505', 'IOT-AQI-301', 'environment', 'Central Ambient Air Station', 'City Hall Green Park', 19.0740, 72.8810, 'Ward 4', 'online', 68.0, 'AQI (Moderate)', 100.0),
  ('55555555-5555-5555-5555-555555555506', 'IOT-LGT-401', 'energy', 'Smart Streetlight Mesh #401-440', 'Coastal Boulevard Section 2', 19.0620, 72.8620, 'Ward 1', 'online', 94.0, '% Operational', 85.0),
  ('55555555-5555-5555-5555-555555555507', 'IOT-FLD-501', 'flood', 'Storm Drainage Culvert Sensor 12', 'Lower Market Causeway Underpass', 19.0850, 72.8730, 'Ward 3', 'warning', 18.0, 'cm water depth', 15.0)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Realistic Seed Complaints
INSERT INTO public.complaints (
  id, reference_number, citizen_id, citizen_name, citizen_email, citizen_phone,
  title, description, category, priority, status,
  location_name, landmark, latitude, longitude, ward,
  assigned_department_id, assigned_officer_id, assigned_officer_name,
  ai_category_suggestion, ai_priority_suggestion, ai_summary, is_public, created_at
)
VALUES 
  (
    '33333333-3333-3333-3333-333333333301', 'SC360-2026-1041',
    '22222222-2222-2222-2222-222222222201', 'Aarav Mehta', 'citizen@smartcity360.gov', '+1-555-019-2831',
    'Deep dangerous pothole on Grand Avenue intersection',
    'Severe road depression measuring roughly 40cm wide and 15cm deep right at the pedestrian crossing. Causing two-wheeler skids and traffic slowdown during peak morning hours.',
    'Roads and potholes', 'high', 'in_progress',
    'Grand Ave & 4th Street Crossroad', 'Opposite Metro Station Gate 2',
    19.0775, 72.8789, 'Ward 4',
    '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222202', 'Inspector Kevin Roy',
    'Roads and potholes', 'high', 'Significant crater on active traffic corridor risking commuter injury.', true,
    NOW() - INTERVAL '2 days'
  ),
  (
    '33333333-3333-3333-3333-333333333302', 'SC360-2026-1042',
    '22222222-2222-2222-2222-222222222201', 'Aarav Mehta', 'citizen@smartcity360.gov', '+1-555-019-2831',
    'Major clean drinking water pipeline burst flooding pavement',
    'Pressurized water is erupting from under the sidewalk tiles since 6 AM. Millions of liters of potable water are draining into the gutter while nearby apartment buildings have zero pressure.',
    'Water leakage and water supply', 'critical', 'assigned',
    'Hillside Road, Block B', 'Near St. Jude Community Clinic',
    19.0712, 72.8724, 'Ward 2',
    '11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222202', 'Inspector Kevin Roy',
    'Water leakage and water supply', 'critical', 'Critical mainline rupture requiring immediate isolation valve closure.', true,
    NOW() - INTERVAL '5 hours'
  ),
  (
    '33333333-3333-3333-3333-333333333303', 'SC360-2026-1043',
    '22222222-2222-2222-2222-222222222201', 'Aarav Mehta', 'citizen@smartcity360.gov', '+1-555-019-2831',
    'Garbage overflow & unauthorized commercial dumping behind fish market',
    'Solid food waste and unsegregated plastic sacks piled over 2 meters high. Emitting foul odor and attracting strays; blocking access to rear service lane.',
    'Garbage and waste management', 'medium', 'verified',
    'Old Fishermans Wharf Alleyway', 'Behind South Fish Market Shed 4',
    19.0645, 72.8640, 'Ward 1',
    '11111111-1111-1111-1111-111111111103', NULL, NULL,
    'Garbage and waste management', 'medium', 'Accumulated commercial solid waste obstructing municipal lane.', true,
    NOW() - INTERVAL '1 day'
  ),
  (
    '33333333-3333-3333-3333-333333333304', 'SC360-2026-1044',
    '22222222-2222-2222-2222-222222222201', 'Aarav Mehta', 'citizen@smartcity360.gov', '+1-555-019-2831',
    'Streetlights completely out along 600m stretch of Parkview Promenade',
    'Entire series of 14 LED poles unlit for three consecutive evenings. Causes severe safety hazard for night runners and women commuters walking back from the bus depot.',
    'Streetlights', 'high', 'resolved',
    'Parkview Promenade Walkway', 'Adjoining City Botanical Gardens',
    19.0830, 72.8870, 'Ward 5',
    '11111111-1111-1111-1111-111111111104', '22222222-2222-2222-2222-222222222202', 'Inspector Kevin Roy',
    'Streetlights', 'high', 'Circuit breaker trip in secondary feeder box #12.', true,
    NOW() - INTERVAL '4 days'
  ),
  (
    '33333333-3333-3333-3333-333333333305', 'SC360-2026-1045',
    '22222222-2222-2222-2222-222222222201', 'Aarav Mehta', 'citizen@smartcity360.gov', '+1-555-019-2831',
    'Stormwater drain grate clogged with plastic debris causing street waterlogging',
    'After brief afternoon showers, water level rose above car tire rims at the underpass. Catch basin is clogged with plastic cups and tree leaves.',
    'Drainage and sewage', 'high', 'under_review',
    'Railway Underpass Sector 9', 'Near Eastern Railway Bridge',
    19.0880, 72.8710, 'Ward 3',
    '11111111-1111-1111-1111-111111111102', NULL, NULL,
    'Drainage and sewage', 'high', 'Grate blockage producing acute urban waterlogging.', true,
    NOW() - INTERVAL '3 hours'
  )
ON CONFLICT (id) DO NOTHING;

-- 6. Insert History Audit for Complaints
INSERT INTO public.complaint_history (complaint_id, previous_status, new_status, updated_by_name, updated_by_role, comment, created_at)
VALUES 
  ('33333333-3333-3333-3333-333333333301', 'submitted', 'under_review', 'Automated AI Dispatcher', 'system', 'Complaint verified and initial AI category confidence at 98%.', NOW() - INTERVAL '40 hours'),
  ('33333333-3333-3333-3333-333333333301', 'under_review', 'verified', 'Director Sarah Jenkins', 'admin', 'Field survey team confirmed location and severity.', NOW() - INTERVAL '30 hours'),
  ('33333333-3333-3333-3333-333333333301', 'verified', 'assigned', 'Director Sarah Jenkins', 'admin', 'Assigned to Ward 4 Asphalt Paving Rapid Response Unit.', NOW() - INTERVAL '20 hours'),
  ('33333333-3333-3333-3333-333333333301', 'assigned', 'in_progress', 'Inspector Kevin Roy', 'officer', 'Asphalt cold-mix truck dispatched to site. Work commenced.', NOW() - INTERVAL '4 hours'),
  ('33333333-3333-3333-3333-333333333304', 'in_progress', 'resolved', 'Inspector Kevin Roy', 'officer', 'Feeder box #12 circuit breaker replaced and tested. All 14 lamps operating at 100% luminosity.', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;
