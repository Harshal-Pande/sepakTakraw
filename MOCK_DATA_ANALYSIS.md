# Mock Data Analysis & Database Migration Plan

## 📊 Pages Using Mock Data

### 1. **StatsSection Component** (`components/sections/StatsSection.js`)
**Status**: ❌ Using hardcoded data
**Current Data**:
```javascript
const stats = [
  { icon: Trophy, value: '150+', label: 'Tournaments Won' },
  { icon: Users, value: '500+', label: 'Active Players' },
  { icon: Calendar, value: '25+', label: 'Events This Year' },
  { icon: Award, value: '50+', label: 'Medals Won' }
]
```
**Action Required**: Create `stats` table and API endpoint

### 2. **QuickLinksSection Component** (`components/sections/QuickLinks.js`)
**Status**: ❌ Using hardcoded data
**Current Data**: Static array of 11 quick links
**Action Required**: Create `quick_links` table and API endpoint

### 3. **Contact Information** (Various components)
**Status**: ❌ Using hardcoded data
**Current Data**: Hardcoded contact details in components
**Action Required**: Use `contact_info` table (already exists)

### 4. **Hero Images** (`app/page.js`)
**Status**: ✅ Using database (already implemented)
**Current Data**: Fetches from `/api/hero-images`

### 5. **News Section** (`components/sections/NewsSection.js`)
**Status**: ✅ Using database (already implemented)
**Current Data**: Fetches from `/api/news`

### 6. **Events Section** (`components/sections/EventsSection.js`)
**Status**: ✅ Using database (already implemented)
**Current Data**: Fetches from `/api/events`

### 7. **Results Section** (Various components)
**Status**: ✅ Using database (already implemented)
**Current Data**: Fetches from `/api/results`

### 8. **General Body** (Various components)
**Status**: ✅ Using database (already implemented)
**Current Data**: Fetches from `/api/general-body`

## 🗄️ Database Tables Needed

### 1. **Stats Table**
```sql
CREATE TABLE stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  icon TEXT NOT NULL, -- Icon name/identifier
  value TEXT NOT NULL, -- The stat value (e.g., "150+")
  label TEXT NOT NULL, -- The stat label (e.g., "Tournaments Won")
  color TEXT NOT NULL, -- CSS color class
  bg_color TEXT NOT NULL, -- CSS background color class
  order_index INTEGER DEFAULT 0, -- For ordering
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. **Quick Links Table**
```sql
CREATE TABLE quick_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  href TEXT NOT NULL,
  icon TEXT NOT NULL, -- Icon name/identifier
  color TEXT NOT NULL, -- CSS color class
  bg_color TEXT NOT NULL, -- CSS background color class
  order_index INTEGER DEFAULT 0, -- For ordering
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 Migration Plan

### Phase 1: Create New Tables
1. Add `stats` table to database
2. Add `quick_links` table to database
3. Create API endpoints for both tables

### Phase 2: Update Components
1. Update `StatsSection` to fetch from database
2. Update `QuickLinksSection` to fetch from database
3. Update contact information to use database

### Phase 3: Populate Data
1. Insert sample stats data
2. Insert sample quick links data
3. Update contact information

## 📝 Implementation Steps

### Step 1: Database Schema Update
Run the following SQL in Supabase:

```sql
-- Add stats table
CREATE TABLE stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  icon TEXT NOT NULL,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  color TEXT NOT NULL,
  bg_color TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add quick_links table
CREATE TABLE quick_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  href TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  bg_color TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Enable RLS
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_links ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public read access for stats" ON stats FOR SELECT USING (true);
CREATE POLICY "Public read access for quick_links" ON quick_links FOR SELECT USING (true);
```

### Step 2: Create API Endpoints
1. Create `/api/stats/route.js`
2. Create `/api/quick-links/route.js`

### Step 3: Update Components
1. Update `StatsSection` to fetch from API
2. Update `QuickLinksSection` to fetch from API

## ✅ Current Status

### ✅ Already Using Database
- Hero Images
- News
- Events
- Results
- General Body
- Elections
- MYAS Compliance
- Anti-DOP Guidelines
- RTI
- History
- Contact Info

### ❌ Still Using Mock Data
- Stats Section
- Quick Links Section

## 🎯 Priority Order

1. **High Priority**: Stats Section (main homepage)
2. **Medium Priority**: Quick Links Section
3. **Low Priority**: Contact information (already has table)

## 📊 Data Migration Checklist

- [ ] Create `stats` table
- [ ] Create `quick_links` table
- [ ] Insert sample data
- [ ] Create API endpoints
- [ ] Update StatsSection component
- [ ] Update QuickLinksSection component
- [ ] Test all functionality
- [ ] Verify data consistency
- [ ] Update admin panel for new tables
