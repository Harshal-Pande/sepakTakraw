# Sepaktakraw Database Setup Guide

## 🗄️ Complete Database Setup for Supabase

This guide will help you set up the complete database structure for the Sepaktakraw website, including all tables, relationships, and sample data.

## 📋 Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Project Created**: Create a new Supabase project
3. **Environment Variables**: Set up your `.env.local` file

## 🔧 Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Admin Authentication
ADMIN_JWT_SECRET=your-super-secret-jwt-key-min-32-characters-change-in-production
ADMIN_SESSION_TIMEOUT=24h

# File Upload Settings
MAX_UPLOAD_SIZE=52428800
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,webp,doc,docx

# Admin Settings
ADMIN_EMAIL=admin@sepaktakraw.org
SITE_NAME=Sepaktakraw Federation
DEFAULT_ADMIN_PASSWORD=ChangeMe123!
```

## 🏗️ Database Schema Setup

### Step 1: Run the Main Database Schema

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the following SQL script:

```sql
-- =============================================
-- SEPAKTAKRAW FEDERATION DATABASE SCHEMA
-- =============================================

-- 1. HERO IMAGES TABLE
CREATE TABLE hero_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. NEWS TABLE
CREATE TABLE news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  document_url TEXT,
  featured_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. EVENTS TABLE
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  location TEXT NOT NULL,
  photos TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RESULTS TABLE
CREATE TABLE results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  document_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. GENERAL BODY TABLE
CREATE TABLE general_body (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  district TEXT NOT NULL,
  position TEXT NOT NULL,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ELECTIONS TABLE
CREATE TABLE elections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  election_date DATE NOT NULL,
  document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. MYAS COMPLIANCE TABLE
CREATE TABLE myas_compliance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. ANTI-DOPING GUIDELINES TABLE
CREATE TABLE anti_dop_guidelines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. RTI TABLE
CREATE TABLE rti (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. HISTORY TABLE
CREATE TABLE history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  timeline_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. CONTACT INFO TABLE
CREATE TABLE contact_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  office_hours TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ADMIN SYSTEM TABLES
-- =============================================

-- 12. ADMIN USERS TABLE
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

-- 13. ADMIN SESSIONS TABLE
CREATE TABLE admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. ADMIN ACTIVITY LOGS TABLE
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

-- 15. ADMIN PERMISSIONS TABLE
CREATE TABLE admin_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  resource TEXT NOT NULL, -- 'news', 'events', 'results', etc.
  actions TEXT[] NOT NULL, -- ['create', 'read', 'update', 'delete']
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. SYSTEM SETTINGS TABLE
CREATE TABLE system_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. FILE UPLOADS TABLE
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

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Main content tables indexes
CREATE INDEX idx_news_created_at ON news(created_at);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_results_created_at ON results(created_at);
CREATE INDEX idx_general_body_district ON general_body(district);
CREATE INDEX idx_general_body_position ON general_body(position);

-- Admin system indexes
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

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE general_body ENABLE ROW LEVEL SECURITY;
ALTER TABLE elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE myas_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE anti_dop_guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE rti ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- Public read access for main content
CREATE POLICY "Public read access for hero_images" ON hero_images FOR SELECT USING (true);
CREATE POLICY "Public read access for news" ON news FOR SELECT USING (true);
CREATE POLICY "Public read access for events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read access for results" ON results FOR SELECT USING (true);
CREATE POLICY "Public read access for general_body" ON general_body FOR SELECT USING (true);
CREATE POLICY "Public read access for elections" ON elections FOR SELECT USING (true);
CREATE POLICY "Public read access for myas_compliance" ON myas_compliance FOR SELECT USING (true);
CREATE POLICY "Public read access for anti_dop_guidelines" ON anti_dop_guidelines FOR SELECT USING (true);
CREATE POLICY "Public read access for rti" ON rti FOR SELECT USING (true);
CREATE POLICY "Public read access for history" ON history FOR SELECT USING (true);
CREATE POLICY "Public read access for contact_info" ON contact_info FOR SELECT USING (true);

-- Admin users policies
CREATE POLICY "Admin users can view own data" ON admin_users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Super admins can view all users" ON admin_users FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND role = 'super_admin'
  )
);

-- Admin sessions policies
CREATE POLICY "Users can view own sessions" ON admin_sessions FOR SELECT USING (user_id = auth.uid());

-- Activity logs policies
CREATE POLICY "Admin users can view activity logs" ON admin_activity_logs FOR SELECT USING (true);

-- Permissions policies
CREATE POLICY "Admin users can view permissions" ON admin_permissions FOR SELECT USING (true);

-- System settings policies
CREATE POLICY "Admin users can view settings" ON system_settings FOR SELECT USING (true);

-- File uploads policies
CREATE POLICY "Admin users can view file uploads" ON file_uploads FOR SELECT USING (true);

-- =============================================
-- SAMPLE DATA INSERTION
-- =============================================

-- Insert default admin user
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

-- Insert sample hero images
INSERT INTO hero_images (image_url, alt_text, is_active) VALUES
('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop', 'Sepaktakraw players in action', true),
('https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=1200&h=600&fit=crop', 'Sepaktakraw tournament', true),
('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop', 'Sepaktakraw championship', true);

-- Insert sample news
INSERT INTO news (title, description, featured_image) VALUES
('National Sepaktakraw Championship 2024', 'The annual national championship will be held in Mumbai from March 15-20, 2024. Teams from all states are invited to participate.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop'),
('New Training Program Launched', 'We are excited to announce a new training program for young Sepaktakraw players. The program will focus on developing fundamental skills and techniques.', 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=400&fit=crop'),
('International Tournament Results', 'Our national team has secured second place in the Asian Sepaktakraw Championship held in Thailand. Congratulations to all players!', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop');

-- Insert sample events
INSERT INTO events (title, description, event_date, location, photos) VALUES
('State Level Championship', 'Annual state level Sepaktakraw championship for all age groups', '2024-03-15', 'Mumbai Sports Complex', ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop']),
('Training Workshop', 'Technical training workshop for coaches and referees', '2024-04-10', 'Delhi Sports Academy', ARRAY['https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=400&fit=crop']),
('Youth Development Program', 'Special program for young players aged 12-18', '2024-05-20', 'Bangalore Sports Center', ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop']);

-- Insert sample results
INSERT INTO results (title, description, document_url) VALUES
('National Championship 2023 Results', 'Complete results and standings from the 2023 National Sepaktakraw Championship', 'https://example.com/results-2023.pdf'),
('State Championship Results', 'Results from various state level championships held throughout the year', 'https://example.com/state-results.pdf'),
('International Tournament Results', 'Results from international tournaments and championships', 'https://example.com/international-results.pdf');

-- Insert sample general body members
INSERT INTO general_body (district, position, name, contact, email) VALUES
('Mumbai', 'President', 'Dr. Rajesh Kumar', '+91 98765 43210', 'president@sepaktakraw.org'),
('Delhi', 'Vice President', 'Ms. Priya Sharma', '+91 98765 43211', 'vicepresident@sepaktakraw.org'),
('Kolkata', 'Secretary', 'Mr. Amit Singh', '+91 98765 43212', 'secretary@sepaktakraw.org'),
('Chennai', 'Treasurer', 'Dr. Suresh Patel', '+91 98765 43213', 'treasurer@sepaktakraw.org'),
('Bangalore', 'Member', 'Ms. Anjali Reddy', '+91 98765 43214', 'member1@sepaktakraw.org');

-- Insert sample elections
INSERT INTO elections (title, description, election_date, document_url) VALUES
('Executive Committee Elections 2024', 'Elections for the new executive committee members. All registered members are eligible to vote.', '2024-06-15', 'https://example.com/election-notice.pdf'),
('State Association Elections', 'Elections for state level association positions', '2024-07-20', 'https://example.com/state-elections.pdf');

-- Insert sample MYAS compliance
INSERT INTO myas_compliance (title, description, document_url) VALUES
('MYAS Compliance Report 2023', 'Annual compliance report submitted to Ministry of Youth Affairs and Sports', 'https://example.com/myas-compliance-2023.pdf'),
('Code of Conduct', 'Code of conduct and ethics for all members and officials', 'https://example.com/code-of-conduct.pdf');

-- Insert sample anti-doping guidelines
INSERT INTO anti_dop_guidelines (title, description, document_url) VALUES
('Anti-Doping Policy', 'Comprehensive anti-doping policy and guidelines for all athletes', 'https://example.com/anti-doping-policy.pdf'),
('Doping Control Procedures', 'Procedures and protocols for doping control during competitions', 'https://example.com/doping-control.pdf');

-- Insert sample RTI information
INSERT INTO rti (title, description, document_url) VALUES
('RTI Information', 'Information available under Right to Information Act', 'https://example.com/rti-information.pdf'),
('Annual Report 2023', 'Annual report of the federation for the year 2023', 'https://example.com/annual-report-2023.pdf');

-- Insert sample history
INSERT INTO history (content, timeline_year) VALUES
('Sepaktakraw Federation was established with the aim of promoting and developing Sepaktakraw sports across India.', 1995),
('First National Championship was organized in Mumbai with participation from 15 states.', 1996),
('Federation became affiliated with the Asian Sepaktakraw Federation.', 1998),
('First international tournament participation in Thailand.', 2000),
('Women''s Sepaktakraw was introduced at the national level.', 2005),
('Federation achieved recognition from the Ministry of Youth Affairs and Sports.', 2010),
('First Asian Championship participation with medal winning performance.', 2015),
('Introduction of youth development programs across all states.', 2020),
('Digital transformation with online registration and result systems.', 2023);

-- Insert sample contact information
INSERT INTO contact_info (address, phone, email, office_hours) VALUES
('123 Sports Avenue, National City, 12345', '+91 98765 43210', 'info@sepaktakraw.org', 'Monday to Friday: 9:00 AM - 6:00 PM');

-- =============================================
-- GRANT PERMISSIONS
-- =============================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
```

### Step 2: Create Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Create the following buckets:

#### Documents Bucket
- **Name**: `documents`
- **Public**: Yes
- **File size limit**: 50MB
- **Allowed MIME types**: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

#### Images Bucket
- **Name**: `images`
- **Public**: Yes
- **File size limit**: 10MB
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

### Step 3: Set Up Storage Policies

Run this SQL script to set up storage policies:

```sql
-- Storage policies for documents bucket
CREATE POLICY "Public read access for documents" ON storage.objects
FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can upload documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Storage policies for images bucket
CREATE POLICY "Public read access for images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
```

## 🧪 Testing the Setup

### 1. Test Database Connection

Create a test file `test-db.js` in your project root:

```javascript
import { createClient } from './lib/supabase.js'

const supabase = createClient()

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Database connection failed:', error)
    } else {
      console.log('Database connection successful!')
      console.log('Sample data:', data)
    }
  } catch (error) {
    console.error('Connection error:', error)
  }
}

testConnection()
```

### 2. Test Admin Login

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3001/admin`
3. Login with:
   - **Email**: `admin@sepaktakraw.org`
   - **Password**: `ChangeMe123!`

## 📊 Database Schema Overview

### Main Content Tables
- **hero_images**: Hero carousel images
- **news**: News articles and announcements
- **events**: Events and tournaments
- **results**: Match results and standings
- **general_body**: General body members
- **elections**: Election information
- **myas_compliance**: MYAS compliance documents
- **anti_dop_guidelines**: Anti-doping guidelines
- **rti**: RTI information
- **history**: Federation history
- **contact_info**: Contact information

### Admin System Tables
- **admin_users**: Admin user accounts
- **admin_sessions**: User sessions
- **admin_activity_logs**: Activity tracking
- **admin_permissions**: Role-based permissions
- **system_settings**: System configuration
- **file_uploads**: File upload tracking

## 🔧 Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check environment variables
   - Verify Supabase URL and key
   - Ensure project is active

2. **Permission Denied**
   - Check RLS policies
   - Verify user authentication
   - Check API key permissions

3. **File Upload Issues**
   - Verify storage buckets exist
   - Check bucket policies
   - Verify file size limits

### Support

- Check Supabase dashboard for errors
- Review browser console for client-side errors
- Check server logs for API errors
- Verify environment variables are loaded

## ✅ Verification Checklist

- [ ] Database schema created successfully
- [ ] All tables have proper indexes
- [ ] RLS policies are active
- [ ] Storage buckets created
- [ ] Storage policies configured
- [ ] Sample data inserted
- [ ] Admin user created
- [ ] Environment variables set
- [ ] Application connects to database
- [ ] Admin panel accessible
- [ ] File uploads working

## 🚀 Next Steps

1. **Customize Data**: Replace sample data with real content
2. **Configure Settings**: Update system settings as needed
3. **Add Users**: Create additional admin users
4. **Upload Files**: Add real images and documents
5. **Test Features**: Verify all functionality works correctly

Your database is now fully set up and ready for production use!
