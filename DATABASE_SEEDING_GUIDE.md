# Database Seeding Guide

This guide will help you set up and populate your Sepaktakraw Sports Federation database with sample data.

## 🚀 Quick Start

1. **Set up environment variables:**
   ```bash
   npm run setup:env
   ```

2. **Edit `.env.local` with your Supabase credentials:**
   - Get your Supabase URL and keys from [Supabase Dashboard](https://supabase.com/dashboard)
   - Update the values in `.env.local`

3. **Seed the database:**
   ```bash
   npm run seed:db
   ```

4. **Test the database:**
   ```bash
   npm run test:db
   ```

## 📋 Database Schema

Your database includes the following tables:

### Core Tables
- `admin_users` - System administrators and editors
- `admin_sessions` - User authentication sessions
- `admin_permissions` - Role-based access control
- `admin_activity_logs` - User activity tracking

### Content Tables
- `news` - News articles and announcements
- `events` - Tournaments and events
- `results` - Competition results and documents
- `general_body` - Organization leadership
- `history` - Federation timeline and milestones

### Configuration Tables
- `contact_info` - Organization contact details
- `hero_images` - Homepage carousel images
- `system_settings` - Application configuration
- `file_uploads` - File management

### Compliance Tables
- `elections` - Election information
- `anti_dop_guidelines` - Anti-doping policies
- `myas_compliance` - Ministry compliance reports
- `rti` - Right to Information documents

## 🌱 Sample Data Included

The seeding script populates your database with:

### Admin Users
- **Admin User**: `admin@sepaktakraw.org` / `admin123`
- **Editor User**: `editor@sepaktakraw.org` / `editor123`

### Content Data
- **3 News Articles** - Sample news with images and documents
- **3 Events** - Tournaments and workshops with photos
- **3 Results** - Competition results with PDF documents
- **5 General Body Members** - Leadership positions across districts
- **7 History Entries** - Federation timeline from 1995-2020
- **3 Hero Images** - Homepage carousel images
- **Contact Information** - Organization details

### System Settings
- Site configuration
- File upload limits
- Maintenance mode settings

## 🔧 Scripts Available

### `npm run setup:env`
Creates a `.env.local` file with required environment variables.

### `npm run seed:db`
Populates the database with comprehensive sample data.

### `npm run test:db`
Tests all API routes and verifies database connectivity.

## 🛠️ Environment Variables Required

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

## 🔍 Database Schema Validation

The schema includes proper:
- ✅ Primary keys (UUID)
- ✅ Foreign key relationships
- ✅ Timestamps (created_at, updated_at)
- ✅ Data validation constraints
- ✅ Indexes for performance

## 🚨 Troubleshooting

### Environment Variables Not Found
```bash
# Make sure .env.local exists and has correct values
npm run setup:env
```

### Database Connection Failed
1. Check your Supabase credentials
2. Ensure your Supabase project is active
3. Verify RLS policies are set up correctly

### Seeding Failed
1. Check if tables exist in your database
2. Verify you have the correct permissions
3. Check the console output for specific error messages

## 📊 Database Statistics

After seeding, you should have:
- **2** admin users
- **3** news articles
- **3** events
- **3** results documents
- **5** general body members
- **7** history entries
- **3** hero images
- **1** contact info record
- **5** system settings

## 🔄 Re-seeding

To clear and re-seed the database:

1. **Clear existing data** (in Supabase dashboard or via SQL):
   ```sql
   -- Clear all data (be careful!)
   TRUNCATE TABLE admin_activity_logs, admin_sessions, admin_users, 
   news, events, results, general_body, history, hero_images, 
   contact_info, system_settings, elections, anti_dop_guidelines, 
   myas_compliance, rti, file_uploads CASCADE;
   ```

2. **Re-run the seeding script**:
   ```bash
   npm run seed:db
   ```

## 🎯 Next Steps

After seeding your database:

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Access the admin panel**:
   - Go to `http://localhost:3000/admin/login`
   - Login with `admin@sepaktakraw.org` / `admin123`

3. **Explore the features**:
   - View seeded content on the public pages
   - Test admin functionality
   - Add your own content

## 📝 Customization

To customize the sample data:

1. Edit `scripts/seed-database.js`
2. Modify the `SAMPLE_DATA` object
3. Re-run `npm run seed:db`

## 🔒 Security Notes

- Change default admin passwords in production
- Use strong, unique secrets for NEXTAUTH_SECRET
- Regularly rotate Supabase service keys
- Enable RLS policies in Supabase

---

**Need Help?** Check the main README.md or create an issue in the repository.
