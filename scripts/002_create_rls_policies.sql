-- Row Level Security Policies for HIPAA Compliance

-- Viewers table policies
CREATE POLICY "viewers_select_own" ON viewers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "viewers_insert_own" ON viewers FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "viewers_update_own" ON viewers FOR UPDATE USING (auth.uid() = id);

-- Hospitals table policies (public read for approved hospitals, restrict sensitive data)
CREATE POLICY "hospitals_public_read" ON hospitals FOR SELECT USING (is_active = true);

-- Hospital violations (public read for transparency)
CREATE POLICY "violations_public_read" ON hospital_violations FOR SELECT USING (true);

-- Contact info (public read)
CREATE POLICY "contact_public_read" ON contact_info FOR SELECT USING (is_active = true);

-- Patients - only accessible by the patient themselves (via custom auth) or hospital staff
-- Note: Patient auth is custom (not Supabase auth), so we'll handle this at the API level

-- Medical records - handled at API level with custom authentication
-- Audit logs - admin only, handled at API level
