-- Seed System Officials for Admin Portal
-- Password for all: admin123 (bcrypt hashed)
-- NOTE: Change these passwords in production!

INSERT INTO system_officials (official_id, name, email, password_hash, role, department, phone, is_active)
VALUES 
  ('ADMIN001', 'Dr. Rajesh Kumar', 'admin@healthrecords.gov.in', '$2a$10$xVWsJ9PmHgYk8F9H6xQZxOqZ3KJvX4s5t6u7v8w9x0y1z2A3B4C5D', 'super_admin', 'IT Administration', '+91-11-23456789', true),
  ('ADMIN002', 'Priya Sharma', 'support@healthrecords.gov.in', '$2a$10$xVWsJ9PmHgYk8F9H6xQZxOqZ3KJvX4s5t6u7v8w9x0y1z2A3B4C5D', 'support', 'User Support', '+91-11-23456790', true),
  ('ADMIN003', 'Amit Verma', 'compliance@healthrecords.gov.in', '$2a$10$xVWsJ9PmHgYk8F9H6xQZxOqZ3KJvX4s5t6u7v8w9x0y1z2A3B4C5D', 'admin', 'Compliance & Audit', '+91-11-23456791', true)
ON CONFLICT (official_id) DO NOTHING;

-- For demo purposes, here's how to generate a proper bcrypt hash:
-- Use: await bcrypt.hash('admin123', 10)
-- The hash above is a placeholder - you should generate real hashes for production
