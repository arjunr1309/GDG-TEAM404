-- Seed Initial Data for Development/Testing
-- NOTE: Change passwords in production!

-- Insert Contact Information
INSERT INTO contact_info (name, designation, department, email, phone, office_address, office_hours, is_primary, display_order) VALUES
('Dr. Rajesh Kumar', 'Chief Technology Officer', 'IT Administration', 'cto@healthrecords.gov.in', '+91-11-23456789', 'Room 101, Health Ministry Building, New Delhi', '9:00 AM - 5:00 PM (Mon-Fri)', true, 1),
('Priya Sharma', 'User Support Manager', 'User Support', 'support@healthrecords.gov.in', '+91-11-23456790', 'Room 102, Health Ministry Building, New Delhi', '9:00 AM - 6:00 PM (Mon-Sat)', false, 2),
('Amit Verma', 'Compliance Officer', 'Compliance & Audit', 'compliance@healthrecords.gov.in', '+91-11-23456791', 'Room 103, Health Ministry Building, New Delhi', '9:00 AM - 5:00 PM (Mon-Fri)', false, 3),
('Technical Helpdesk', 'Technical Support', 'IT Support', 'techsupport@healthrecords.gov.in', '1800-123-4567', 'Online Support Available', '24/7 Support', false, 4),
('Grievance Cell', 'Public Grievance Officer', 'Public Relations', 'grievance@healthrecords.gov.in', '+91-11-23456792', 'Room 105, Health Ministry Building, New Delhi', '10:00 AM - 4:00 PM (Mon-Fri)', false, 5)
ON CONFLICT DO NOTHING;

-- Insert Sample Hospitals
-- Password: hospital123 (you need to generate actual bcrypt hash)
INSERT INTO hospitals (
  hospital_id, name, director_name, email, phone,
  address, city, state, pincode, region, type,
  specializations, total_beds, established_year, website,
  is_verified, nabh_certified, nabl_certified, iso_certified, hipaa_compliant, indian_health_law_compliant,
  password_hash
) VALUES
('HOSP001', 'All India Institute of Medical Sciences', 'Dr. M. Srinivas', 'contact@aiims.edu', '+91-11-26588500',
 'Ansari Nagar', 'New Delhi', 'Delhi', '110029', 'North', 'government',
 ARRAY['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics'], 2478, 1956, 'https://www.aiims.edu',
 true, true, true, true, true, true,
 '$2a$10$xVWsJ9PmHgYk8F9H6xQZxOqZ3KJvX4s5t6u7v8w9x0y1z2A3B4C5D'),

('HOSP002', 'Apollo Hospitals', 'Dr. Prathap C. Reddy', 'contact@apollohospitals.com', '+91-44-28293333',
 '21 Greams Lane', 'Chennai', 'Tamil Nadu', '600006', 'South', 'private',
 ARRAY['Cardiology', 'Oncology', 'Neurosciences', 'Orthopedics', 'Transplants'], 710, 1983, 'https://www.apollohospitals.com',
 true, true, true, true, true, true,
 '$2a$10$xVWsJ9PmHgYk8F9H6xQZxOqZ3KJvX4s5t6u7v8w9x0y1z2A3B4C5D'),

('HOSP003', 'Tata Memorial Hospital', 'Dr. R. A. Badwe', 'contact@tmc.gov.in', '+91-22-24177000',
 'Dr. E Borges Road, Parel', 'Mumbai', 'Maharashtra', '400012', 'West', 'research',
 ARRAY['Oncology', 'Radiation Therapy', 'Surgical Oncology'], 629, 1941, 'https://tmc.gov.in',
 true, true, true, true, true, true,
 '$2a$10$xVWsJ9PmHgYk8F9H6xQZxOqZ3KJvX4s5t6u7v8w9x0y1z2A3B4C5D'),

('HOSP004', 'Christian Medical College', 'Dr. J. V. Peter', 'contact@cmcvellore.ac.in', '+91-416-2281000',
 'Ida Scudder Road', 'Vellore', 'Tamil Nadu', '632004', 'South', 'teaching',
 ARRAY['General Medicine', 'Surgery', 'Pediatrics', 'Orthopedics', 'Cardiology'], 2700, 1900, 'https://www.cmcvellore.ac.in',
 true, true, true, true, true, true,
 '$2a$10$xVWsJ9PmHgYk8F9H6xQZxOqZ3KJvX4s5t6u7v8w9x0y1z2A3B4C5D'),

('HOSP005', 'Narayana Health', 'Dr. Devi Prasad Shetty', 'contact@narayanahealth.org', '+91-80-71222222',
 'Bommasandra Industrial Area', 'Bangalore', 'Karnataka', '560099', 'South', 'private',
 ARRAY['Cardiac Surgery', 'Pediatric Cardiac Care', 'Oncology', 'Nephrology'], 3200, 2000, 'https://www.narayanahealth.org',
 true, true, true, true, true, true,
 '$2a$10$xVWsJ9PmHgYk8F9H6xQZxOqZ3KJvX4s5t6u7v8w9x0y1z2A3B4C5D'),

('HOSP006', 'PGIMER', 'Dr. Vivek Lal', 'contact@pgimer.edu.in', '+91-172-2756565',
 'Sector 12', 'Chandigarh', 'Chandigarh', '160012', 'North', 'government',
 ARRAY['Gastroenterology', 'Hepatology', 'Nephrology', 'Neurology', 'Cardiology'], 1900, 1962, 'https://pgimer.edu.in',
 true, true, true, true, true, true,
 '$2a$10$xVWsJ9PmHgYk8F9H6xQZxOqZ3KJvX4s5t6u7v8w9x0y1z2A3B4C5D'),

('HOSP007', 'Medanta The Medicity', 'Dr. Naresh Trehan', 'contact@medanta.org', '+91-124-4141414',
 'CH Baktawar Singh Road, Sector 38', 'Gurugram', 'Haryana', '122001', 'North', 'private',
 ARRAY['Cardiac Surgery', 'Neurosciences', 'Oncology', 'Liver Transplant', 'Robotic Surgery'], 1600, 2009, 'https://www.medanta.org',
 true, true, true, true, true, true,
 '$2a$10$xVWsJ9PmHgYk8F9H6xQZxOqZ3KJvX4s5t6u7v8w9x0y1z2A3B4C5D'),

('HOSP008', 'NIMHANS', 'Dr. Pratima Murthy', 'contact@nimhans.ac.in', '+91-80-26995000',
 'Hosur Road', 'Bangalore', 'Karnataka', '560029', 'South', 'government',
 ARRAY['Psychiatry', 'Neurology', 'Neurosurgery', 'Mental Health'], 897, 1954, 'https://nimhans.ac.in',
 true, true, true, true, true, true,
 '$2a$10$xVWsJ9PmHgYk8F9H6xQZxOqZ3KJvX4s5t6u7v8w9x0y1z2A3B4C5D')
ON CONFLICT (hospital_id) DO NOTHING;

-- Insert sample violations
INSERT INTO hospital_violations (hospital_id, violation_type, description, severity, violation_date, status, fine_amount, corrective_action)
SELECT h.id, 'documentation', 'Incomplete patient discharge summaries found during routine audit', 'minor', '2024-01-15', 'resolved', 50000, 'Staff training conducted and documentation protocols updated'
FROM hospitals h WHERE h.hospital_id = 'HOSP002'
ON CONFLICT DO NOTHING;

INSERT INTO hospital_violations (hospital_id, violation_type, description, severity, violation_date, status, corrective_action)
SELECT h.id, 'hygiene', 'Biomedical waste segregation issues identified during inspection', 'major', '2024-06-20', 'under_review', 'Implementing new waste management protocol'
FROM hospitals h WHERE h.hospital_id = 'HOSP005'
ON CONFLICT DO NOTHING;
