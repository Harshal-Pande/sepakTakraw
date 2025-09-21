# Sepaktakraw Sports Website - Setup Guide

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory with:
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

3. **Set up Supabase Storage:**
   
   First, create storage buckets in your Supabase dashboard:
   - Go to Storage in your Supabase dashboard
   - Create a bucket named `documents` (for PDFs, DOCs, etc.)
   - Create a bucket named `images` (for JPGs, PNGs, etc.)
   - Set both buckets to public access

4. **Set up Supabase database:**
   
   **For a complete database setup, see `DATABASE_SETUP.md` for the full schema and sample data.**
   
   **Quick Setup**: Run the main database script from `DATABASE_SETUP.md` in your Supabase SQL Editor.
   
   **Migration**: After the main setup, run `database/migration-add-stats-quicklinks.sql` to add stats and quick links tables.
   
   **Manual Setup** (if you prefer to create tables individually):
   
   Create the following tables in your Supabase database:

   ```sql
   -- Hero Images
   CREATE TABLE hero_images (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     image_url TEXT NOT NULL,
     alt_text TEXT NOT NULL,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- News
   CREATE TABLE news (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     description TEXT NOT NULL,
     document_url TEXT,
     featured_image TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Results
   CREATE TABLE results (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     description TEXT NOT NULL,
     document_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Events
   CREATE TABLE events (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     description TEXT NOT NULL,
     event_date DATE NOT NULL,
     location TEXT NOT NULL,
     photos TEXT[],
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- General Body
   CREATE TABLE general_body (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     district TEXT NOT NULL,
     position TEXT NOT NULL,
     name TEXT NOT NULL,
     contact TEXT NOT NULL,
     email TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- MYAS Compliance
   CREATE TABLE myas_compliance (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     sno INTEGER NOT NULL,
     sub_sno INTEGER,
     title TEXT NOT NULL,
     description TEXT NOT NULL,
     documents TEXT[],
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Anti-DOP Guidelines
   CREATE TABLE anti_dop_guidelines (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     year INTEGER NOT NULL,
     description TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- RTI Officers
   CREATE TABLE rti_officers (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     designation TEXT NOT NULL,
     name TEXT NOT NULL,
     address TEXT NOT NULL,
     email TEXT NOT NULL,
     phone TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Elections
   CREATE TABLE elections (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     description TEXT NOT NULL,
     document_url TEXT,
     election_date DATE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- History
   CREATE TABLE history (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     content TEXT NOT NULL,
     timeline_year INTEGER,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Contact Info
   CREATE TABLE contact_info (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     address TEXT NOT NULL,
     phone TEXT NOT NULL,
     email TEXT NOT NULL,
     office_hours TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Rules and Regulations
   CREATE TABLE rules_regulations (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     game_format TEXT NOT NULL,
     document_url TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

4. **Set up Supabase Storage:**
   - Create storage buckets for `images` and `documents`
   - Set appropriate policies for public access

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:3000`

## Features

- ✅ Responsive design with custom color scheme
- ✅ Hero image carousel
- ✅ News and events management
- ✅ Results and documents viewer
- ✅ General body member directory
- ✅ Search functionality
- ✅ Contact form
- ✅ History timeline
- ✅ API routes for all content types
- ✅ Supabase integration
- ✅ Shadcn/ui components

## Project Structure

```
sepaktakraw-website/
├── app/
│   ├── api/                 # API routes
│   ├── components/          # React components
│   ├── layout.js           # Root layout
│   ├── page.js             # Home page
│   └── [pages]/            # Individual pages
├── components/
│   ├── ui/                 # Shadcn/ui components
│   ├── layout/             # Layout components
│   ├── common/             # Reusable components
│   └── sections/           # Page sections
├── lib/
│   ├── supabase.js         # Supabase client
│   ├── validations.js      # Input validation
│   └── api-helpers.js      # API utilities
└── public/                 # Static assets
```

## File Upload System

The application supports file uploads through Supabase Storage:

**Supported File Types:**
- **Documents**: PDF, DOC, DOCX (max 10MB)
- **Images**: JPG, PNG, WEBP (max 5MB)

**File Upload Flow:**
1. Files are uploaded to Supabase Storage buckets
2. Public URLs are generated and stored in database
3. Files are served directly from Supabase CDN

**API Endpoints:**
- `POST /api/upload/documents` - Upload document files
- `POST /api/upload/images` - Upload image files

**Database Fields:**
- `document_url` - Stores the public URL of uploaded documents
- `featured_image` - Stores the public URL of uploaded images
- `photos` - Array of image URLs for events

**Usage Example:**
```javascript
// Upload a document
const formData = new FormData()
formData.append('file', pdfFile)
formData.append('folder', 'documents')

const response = await fetch('/api/upload/documents', {
  method: 'POST',
  body: formData
})

const result = await response.json()
// result.data.url contains the public URL
```

## Customization

- **Colors**: Update CSS variables in `app/globals.css`
- **Content**: Use the API routes to manage content
- **Styling**: Modify Tailwind classes or add custom CSS
- **Components**: Extend or modify components in `components/`

## Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

3. **Alternative deployment:**
   - Use `npm start` for production server
   - Deploy to any Node.js hosting platform

## Support

For issues or questions, please check the documentation or contact the development team.
