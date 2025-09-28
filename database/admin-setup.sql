-- Admin Database Setup Script
-- Run this script in your Supabase SQL editor to set up admin tables

-- 1. Admin Users Table
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor', -- 'super_admin', 'admin', 'editor'
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Admin Sessions Table
CREATE TABLE admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Admin Activity Logs Table
CREATE TABLE admin_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
  resource_type TEXT NOT NULL, -- 'news', 'events', 'results', etc.
  resource_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Admin Permissions Table
CREATE TABLE admin_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  resource TEXT NOT NULL, -- 'news', 'events', 'results', etc.
  actions TEXT[] NOT NULL, -- ['create', 'read', 'update', 'delete']
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. System Settings Table
CREATE TABLE system_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. File Uploads Table
CREATE TABLE file_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  resource_type TEXT, -- 'news', 'events', etc.
  resource_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default super admin user
-- Password: ChangeMe123! (change this in production)
INSERT INTO admin_users (email, password_hash, name, role, is_active) 
VALUES (
  'admin@sepaktakraw.org',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXzgVuGgJJL.',
  'Super Administrator',
  'super_admin',
  true
);

-- Insert default permissions
INSERT INTO admin_permissions (role, resource, actions) VALUES
('super_admin', '*', ARRAY['create', 'read', 'update', 'delete']),
('admin', 'news', ARRAY['create', 'read', 'update', 'delete']),
('admin', 'events', ARRAY['create', 'read', 'update', 'delete']),
('admin', 'results', ARRAY['create', 'read', 'update', 'delete']),
('admin', 'general_body', ARRAY['create', 'read', 'update', 'delete']),
('admin', 'elections', ARRAY['create', 'read', 'update', 'delete']),
('admin', 'myas_compliance', ARRAY['create', 'read', 'update', 'delete']),
('admin', 'anti_dop_guidelines', ARRAY['create', 'read', 'update', 'delete']),
('admin', 'rti', ARRAY['create', 'read', 'update', 'delete']),
('admin', 'history', ARRAY['read', 'update']),
('admin', 'contact', ARRAY['read', 'update']),
('admin', 'hero_images', ARRAY['create', 'read', 'update', 'delete']),
('admin', 'files', ARRAY['create', 'read', 'update', 'delete']),
('admin', 'users', ARRAY['read']),
('admin', 'settings', ARRAY['read']),
('editor', 'news', ARRAY['create', 'read', 'update']),
('editor', 'events', ARRAY['create', 'read', 'update']),
('editor', 'results', ARRAY['create', 'read', 'update']),
('editor', 'general_body', ARRAY['read', 'update']),
('editor', 'elections', ARRAY['read', 'update']),
('editor', 'myas_compliance', ARRAY['read', 'update']),
('editor', 'anti_dop_guidelines', ARRAY['read', 'update']),
('editor', 'rti', ARRAY['read', 'update']),
('editor', 'history', ARRAY['read', 'update']),
('editor', 'contact', ARRAY['read']),
('editor', 'hero_images', ARRAY['read', 'update']),
('editor', 'files', ARRAY['create', 'read']);

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
('site_name', '"Sepaktakraw Federation"', 'Website name'),
('site_email', '"contact@sepaktakraw.org"', 'Contact email'),
('maintenance_mode', 'false', 'Enable/disable maintenance mode'),
('max_file_size', '52428800', 'Maximum file upload size in bytes'),
('allowed_file_types', '["pdf", "jpg", "jpeg", "png", "webp", "doc", "docx"]', 'Allowed file types for upload');

-- Create indexes for better performance
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);
CREATE INDEX idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX idx_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX idx_admin_activity_logs_user_id ON admin_activity_logs(user_id);
CREATE INDEX idx_admin_activity_logs_created_at ON admin_activity_logs(created_at);
CREATE INDEX idx_admin_activity_logs_action ON admin_activity_logs(action);
CREATE INDEX idx_admin_activity_logs_resource_type ON admin_activity_logs(resource_type);
CREATE INDEX idx_file_uploads_uploaded_by ON file_uploads(uploaded_by);
CREATE INDEX idx_file_uploads_resource_type ON file_uploads(resource_type);
CREATE INDEX idx_file_uploads_created_at ON file_uploads(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Admin users can only see their own data and super admins can see all
CREATE POLICY "Admin users can view own data" ON admin_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Super admins can view all users" ON admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Admin sessions are private to the user
CREATE POLICY "Users can view own sessions" ON admin_sessions
  FOR SELECT USING (user_id = auth.uid());

-- Activity logs are viewable by all admin users
CREATE POLICY "Admin users can view activity logs" ON admin_activity_logs
  FOR SELECT USING (true);

-- Permissions are viewable by all admin users
CREATE POLICY "Admin users can view permissions" ON admin_permissions
  FOR SELECT USING (true);

-- System settings are viewable by all admin users
CREATE POLICY "Admin users can view settings" ON system_settings
  FOR SELECT USING (true);

-- File uploads are viewable by all admin users
CREATE POLICY "Admin users can view file uploads" ON file_uploads
  FOR SELECT USING (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
