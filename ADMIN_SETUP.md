# Sepaktakraw Admin Panel Setup Guide

## 🚀 Quick Start

The admin panel is now fully implemented and ready to use! Here's how to get started:

### 1. Database Setup

1. **Run the admin database setup script:**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `database/admin-setup.sql`
   - Execute the script

2. **Create Supabase Storage buckets:**
   - Go to Storage in your Supabase dashboard
   - Create a bucket named `documents` (for PDFs, DOCs, etc.)
   - Create a bucket named `images` (for JPGs, PNGs, etc.)
   - Set both buckets to public access

### 2. Environment Variables

Add these to your `.env.local` file:

```env
# Admin Authentication
ADMIN_JWT_SECRET=your-super-secret-jwt-key-min-32-characters-change-in-production
ADMIN_SESSION_TIMEOUT=24h

# File Upload Settings
MAX_UPLOAD_SIZE=52428800  # 50MB in bytes
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,gif,doc,docx

# Admin Settings
ADMIN_EMAIL=admin@sepaktakraw.org
SITE_NAME=Sepaktakraw Federation
DEFAULT_ADMIN_PASSWORD=ChangeMe123!
```

### 3. Access the Admin Panel

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the admin panel:**
   - Go to `http://localhost:3001/admin`
   - You'll be redirected to the login page

3. **Login with default credentials:**
   - Email: `admin@sepaktakraw.org`
   - Password: `ChangeMe123!`

## 🎯 Admin Panel Features

### ✅ Implemented Features

1. **Authentication System**
   - Secure JWT-based authentication
   - Role-based access control (Super Admin, Admin, Editor)
   - Session management with automatic logout
   - Password hashing with bcrypt

2. **Dashboard**
   - Real-time statistics and metrics
   - Recent activity logs
   - Quick actions for common tasks
   - Recent content overview

3. **Content Management**
   - News articles (CRUD operations)
   - Events management
   - Results management
   - General body directory
   - File upload system

4. **Admin Interface**
   - Responsive design
   - Modern UI with Tailwind CSS
   - Mobile-friendly navigation
   - Dark/light mode support

5. **Security Features**
   - Route protection middleware
   - File upload validation
   - Activity logging
   - Permission-based access control

### 🔧 Admin Panel Structure

```
app/admin/
├── layout.js                 # Admin layout wrapper
├── page.js                   # Dashboard
├── login/page.js            # Login page
├── news/                    # News management
│   ├── page.js             # News list
│   ├── create/page.js      # Create news
│   └── edit/[id]/page.js   # Edit news
├── events/                  # Events management
├── results/                 # Results management
├── general-body/           # General body management
├── elections/              # Elections management
├── myas-compliance/        # MYAS compliance
├── anti-dop-guidelines/    # Anti-doping guidelines
├── rti/                    # RTI management
├── history/                # History management
├── contact/                # Contact management
├── hero-images/            # Hero images management
├── file-manager/           # File manager
└── settings/               # Admin settings
```

### 🎨 Admin Components

```
components/admin/
├── layout/
│   ├── AdminLayout.js      # Main admin layout
│   ├── AdminNavbar.js      # Top navigation
│   └── AdminSidebar.js     # Side navigation
├── dashboard/
│   ├── StatsCard.js        # Statistics cards
│   └── RecentActivity.js   # Activity feed
├── forms/
│   └── NewsForm.js         # News form component
├── tables/
│   └── DataTable.js        # Data table component
├── common/
│   ├── AdminCard.js        # Admin card component
│   └── LoadingSpinner.js   # Loading spinner
└── file-manager/
    └── FileUpload.js       # File upload component
```

## 🔐 User Roles & Permissions

### Super Admin
- Full access to all features
- User management
- System settings
- All CRUD operations

### Admin
- Content management (News, Events, Results, etc.)
- File management
- User read access
- Settings read access

### Editor
- Content creation and editing
- Limited file access
- No user management
- No system settings

## 📁 File Upload System

### Supported File Types
- **Documents**: PDF, DOC, DOCX (max 10MB)
- **Images**: JPG, PNG, WEBP (max 5MB)

### Upload Flow
1. Files are uploaded to Supabase Storage
2. Public URLs are generated
3. URLs are stored in database
4. Files are served via CDN

### API Endpoints
- `POST /api/upload/documents` - Upload document files
- `POST /api/upload/images` - Upload image files

## 🛡️ Security Features

### Authentication Security
- JWT tokens with expiration
- Secure password hashing
- Session management
- Automatic logout on token expiry

### File Upload Security
- File type validation
- File size limits
- Secure storage in Supabase
- Content-Type validation

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

## 🚀 Deployment

### 1. Build the Project
```bash
npm run build
```

### 2. Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### 3. Production Checklist
- [ ] Change default admin password
- [ ] Update JWT secret
- [ ] Configure proper CORS settings
- [ ] Set up monitoring and logging
- [ ] Enable HTTPS
- [ ] Configure backup strategy

## 🔧 Customization

### Adding New Content Types
1. Create database table
2. Add API routes
3. Create admin pages
4. Update navigation
5. Add permissions

### Styling
- Modify `styles/admin.css`
- Update Tailwind classes
- Customize color variables

### Features
- Add new dashboard widgets
- Create custom forms
- Implement new file types
- Add notification system

## 📊 Monitoring & Analytics

### Activity Logs
- All admin actions are logged
- User activity tracking
- Resource change history
- IP address and user agent logging

### Performance
- Optimized database queries
- Image optimization
- CDN delivery
- Caching strategies

## 🆘 Troubleshooting

### Common Issues

1. **Login not working**
   - Check JWT secret in environment variables
   - Verify database connection
   - Check admin user exists

2. **File uploads failing**
   - Verify Supabase storage buckets exist
   - Check file size limits
   - Validate file types

3. **Permission errors**
   - Check user role in database
   - Verify permission policies
   - Check RLS policies

### Support
- Check the console for errors
- Review activity logs
- Verify environment variables
- Check Supabase dashboard

## 🎉 Success!

Your admin panel is now fully functional! You can:

- ✅ Manage all website content
- ✅ Upload and organize files
- ✅ Monitor user activity
- ✅ Control user permissions
- ✅ Customize the interface

The admin panel provides a complete content management solution for your Sepaktakraw website with enterprise-level security and functionality.




SUPABASE VARIABLES
SUPABASE_SERVICE_ROLE_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1ZnZzY3lrcW15b2l0dW10dmJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQ2OTY5OCwiZXhwIjoyMDc0MDQ1Njk4fQ.n_wzWipOh_yecTkinMyxktmSmNx0x62uYRwVVlibOw8
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1ZnZzY3lrcW15b2l0dW10dmJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0Njk2OTgsImV4cCI6MjA3NDA0NTY5OH0.d5j3HlhQ_LbZoVcM78x1s7DOyzv-EUsMWaHW5Eumz2Y
SUPABASE_URL=https://gufvscykqmyoitumtvbl.supabase.co

