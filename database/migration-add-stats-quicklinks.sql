-- =============================================
-- MIGRATION: Add Stats and Quick Links Tables
-- =============================================
-- This script adds the missing tables for stats and quick links
-- Run this after the main database setup

-- 1. STATS TABLE
CREATE TABLE stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  icon TEXT NOT NULL, -- Icon name/identifier (e.g., 'Trophy', 'Users')
  value TEXT NOT NULL, -- The stat value (e.g., "150+")
  label TEXT NOT NULL, -- The stat label (e.g., "Tournaments Won")
  color TEXT NOT NULL, -- CSS color class (e.g., "text-primary-gold")
  bg_color TEXT NOT NULL, -- CSS background color class (e.g., "bg-primary-gold/10")
  order_index INTEGER DEFAULT 0, -- For ordering
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. QUICK LINKS TABLE
CREATE TABLE quick_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  href TEXT NOT NULL,
  icon TEXT NOT NULL, -- Icon name/identifier (e.g., 'Newspaper', 'Trophy')
  color TEXT NOT NULL, -- CSS color class (e.g., "text-blue-600")
  bg_color TEXT NOT NULL, -- CSS background color class (e.g., "bg-blue-100")
  order_index INTEGER DEFAULT 0, -- For ordering
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_stats_order_index ON stats(order_index);
CREATE INDEX idx_stats_active ON stats(is_active);
CREATE INDEX idx_quick_links_order_index ON quick_links(order_index);
CREATE INDEX idx_quick_links_active ON quick_links(is_active);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_links ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Public read access for stats" ON stats FOR SELECT USING (true);
CREATE POLICY "Public read access for quick_links" ON quick_links FOR SELECT USING (true);

-- =============================================
-- SAMPLE DATA INSERTION
-- =============================================

-- Insert sample stats data
INSERT INTO stats (icon, value, label, color, bg_color, order_index) VALUES
('Trophy', '150+', 'Tournaments Won', 'text-primary-gold', 'bg-primary-gold/10', 1),
('Users', '500+', 'Active Players', 'text-primary-blue', 'bg-primary-blue/10', 2),
('Calendar', '25+', 'Events This Year', 'text-green-600', 'bg-green-100', 3),
('Award', '50+', 'Medals Won', 'text-purple-600', 'bg-purple-100', 4);

-- Insert sample quick links data
INSERT INTO quick_links (title, description, href, icon, color, bg_color, order_index) VALUES
('News & Updates', 'Latest news and announcements', '/news', 'Newspaper', 'text-blue-600', 'bg-blue-100', 1),
('Results', 'Tournament results and standings', '/results', 'Trophy', 'text-yellow-600', 'bg-yellow-100', 2),
('Events', 'Upcoming tournaments and events', '/events', 'Calendar', 'text-green-600', 'bg-green-100', 3),
('General Body', 'Federation members and officials', '/general-body', 'Users', 'text-purple-600', 'bg-purple-100', 4),
('Rules & Regulations', 'Game rules and regulations', '/events/rules-regulations', 'BookOpen', 'text-indigo-600', 'bg-indigo-100', 5),
('MYAS Compliance', 'Ministry compliance documents', '/myas-compliance', 'Shield', 'text-red-600', 'bg-red-100', 6),
('Anti-DOP Guidelines', 'Anti-doping guidelines and policies', '/anti-dop-guidelines', 'AlertTriangle', 'text-orange-600', 'bg-orange-100', 7),
('RTI Information', 'Right to Information details', '/rti', 'Info', 'text-teal-600', 'bg-teal-100', 8),
('Elections', 'Election information and results', '/elections', 'Vote', 'text-pink-600', 'bg-pink-100', 9),
('History', 'Federation history and milestones', '/history', 'History', 'text-gray-600', 'bg-gray-100', 10),
('Contact Us', 'Get in touch with us', '/contact', 'Phone', 'text-cyan-600', 'bg-cyan-100', 11);

-- =============================================
-- GRANT PERMISSIONS
-- =============================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON stats TO authenticated;
GRANT ALL ON quick_links TO authenticated;
