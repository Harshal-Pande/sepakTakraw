# Player Registration System Setup Guide

This guide will help you set up the player registration system that replaces Google Forms with a database-backed solution.

## 🗄️ Database Setup

### 1. Run the Database Schema

Execute the SQL commands in `database/player-registration-schema.sql` in your Supabase SQL editor:

```sql
-- Copy and paste the entire contents of database/player-registration-schema.sql
-- This will create the necessary tables, indexes, and functions
```

### 2. Verify Tables Created

After running the schema, verify these tables exist:
- `player_reference_numbers` - Stores Step 1 data (reference number generation)
- `player_registrations` - Stores Step 2 data (complete registration)

### 3. Test Reference Number Generation

Test the reference number generation function:

```sql
-- Test the function
SELECT generate_player_reference_number();

-- Test inserting a reference number
INSERT INTO player_reference_numbers (full_name, email) 
VALUES ('Test User', 'test@example.com');

-- Check the generated reference number
SELECT * FROM player_reference_numbers WHERE email = 'test@example.com';
```

## 🔧 Environment Variables

Ensure these environment variables are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 📱 Features Implemented

### ✅ Step 1: Reference Number Generation
- **Page**: `/player-registration/step1`
- **API**: `/api/player-registration/step1`
- **Features**:
  - Collects full name and email
  - Generates unique reference number (format: SPF-YYYY-NNNNN)
  - Validates email format
  - Prevents duplicate email usage
  - 7-day expiration for reference numbers
  - Copy-to-clipboard functionality

### ✅ Step 2: Complete Registration
- **Page**: `/player-registration/step2`
- **API**: `/api/player-registration/step2`
- **Features**:
  - Validates reference number
  - Comprehensive registration form
  - Personal information collection
  - Address information
  - Sports information
  - Emergency contact details
  - Terms and conditions acceptance
  - File upload support (for future enhancement)

### ✅ Admin Panel
- **Page**: `/admin/player-registrations`
- **API**: `/api/admin/player-registrations`
- **Features**:
  - View all registrations
  - Filter by status (pending, approved, rejected, under review)
  - Search by name, email, or reference number
  - Statistics dashboard
  - Approve/reject registrations
  - Add review notes
  - Detailed registration view

## 🎨 UI Components Used

All necessary UI components are already available:
- ✅ `Card`, `CardContent`, `CardHeader`, `CardTitle`
- ✅ `Button`
- ✅ `Input`, `Label`, `Textarea`
- ✅ `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`
- ✅ `Alert`, `AlertDescription`
- ✅ `Checkbox`
- ✅ `Badge`

## 🔄 User Flow

### Player Registration Flow:
1. **Step 1**: Player visits `/player-registration/step1`
2. **Step 1**: Enters name and email
3. **Step 1**: Receives unique reference number
4. **Step 2**: Player visits `/player-registration/step2?ref=SPF-2025-00001`
5. **Step 2**: Completes full registration form
6. **Step 2**: Submits registration (status: pending)
7. **Admin**: Reviews registration in admin panel
8. **Admin**: Approves/rejects with notes
9. **Player**: Receives email notification (future enhancement)

### Admin Management Flow:
1. **Admin**: Visits `/admin/player-registrations`
2. **Admin**: Views registration statistics
3. **Admin**: Filters/searches registrations
4. **Admin**: Reviews individual registration details
5. **Admin**: Approves/rejects with review notes
6. **System**: Updates registration status

## 📊 Database Schema Details

### `player_reference_numbers` Table:
- `id` (UUID, Primary Key)
- `full_name` (VARCHAR, Required)
- `email` (VARCHAR, Required, Unique)
- `reference_number` (VARCHAR, Auto-generated, Unique)
- `created_at` (Timestamp)
- `expires_at` (Timestamp, 7 days from creation)
- `is_used` (Boolean, Default: false)
- `used_at` (Timestamp, Nullable)

### `player_registrations` Table:
- `id` (UUID, Primary Key)
- `reference_number` (VARCHAR, Foreign Key)
- Personal Information: `full_name`, `email`, `phone`, `date_of_birth`, `gender`
- Address Information: `address_line_1`, `address_line_2`, `city`, `state`, `postal_code`, `country`
- Sports Information: `playing_position`, `experience_years`, `previous_teams`, `achievements`
- Emergency Contact: `emergency_contact_name`, `emergency_contact_phone`, `emergency_contact_relation`
- Documents: `photo_url`, `id_proof_url`, `medical_certificate_url`
- Status: `status`, `submitted_at`, `reviewed_at`, `reviewed_by`, `review_notes`
- Additional: `additional_notes`, `terms_accepted`, `privacy_policy_accepted`

## 🚀 Navigation Updates

The navbar has been updated to include:
- ✅ "PLAYER REGISTRATION" link pointing to Step 1
- ✅ RTI page removed as requested
- ✅ Contact page updated (department contacts removed)

## 📈 Analytics Integration

Vercel Analytics has been integrated:
- ✅ Package installed: `@vercel/analytics`
- ✅ Component added to root layout
- ✅ Will track page views and user interactions

## 🔍 Testing Checklist

### Test Step 1:
- [ ] Visit `/player-registration/step1`
- [ ] Enter valid name and email
- [ ] Verify reference number generation
- [ ] Test copy-to-clipboard functionality
- [ ] Test duplicate email prevention
- [ ] Test invalid email format rejection

### Test Step 2:
- [ ] Use generated reference number in URL
- [ ] Complete all required fields
- [ ] Test form validation
- [ ] Submit registration
- [ ] Verify success message

### Test Admin Panel:
- [ ] Visit `/admin/player-registrations`
- [ ] View registration statistics
- [ ] Test search functionality
- [ ] Test status filtering
- [ ] Test approve/reject actions
- [ ] Test review notes functionality

## 🛠️ Future Enhancements

### Planned Features:
1. **Email Notifications**: Send emails when reference numbers are generated and when registrations are approved/rejected
2. **File Upload**: Add photo, ID proof, and medical certificate upload functionality
3. **Email Integration**: Send confirmation emails with reference numbers
4. **Export Functionality**: Export registrations to CSV/Excel
5. **Bulk Actions**: Approve/reject multiple registrations at once
6. **Registration Analytics**: Track registration trends and statistics
7. **Mobile Optimization**: Ensure perfect mobile experience
8. **Multi-language Support**: Add support for multiple languages

### API Enhancements:
1. **Email Service Integration**: Send automated emails
2. **File Upload Service**: Handle document uploads
3. **Notification System**: Real-time notifications for admins
4. **Audit Logging**: Track all registration changes
5. **Rate Limiting**: Prevent spam registrations

## 🐛 Troubleshooting

### Common Issues:

1. **Reference Number Not Generated**:
   - Check database connection
   - Verify Supabase environment variables
   - Check database schema is properly created

2. **Form Validation Errors**:
   - Ensure all required fields are filled
   - Check email format validation
   - Verify terms and conditions are accepted

3. **Admin Panel Not Loading**:
   - Check API routes are accessible
   - Verify database permissions
   - Check console for JavaScript errors

4. **Database Connection Issues**:
   - Verify Supabase URL and keys
   - Check network connectivity
   - Verify database tables exist

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify database schema is properly set up
3. Check environment variables
4. Test API endpoints directly
5. Review the implementation files for any customizations needed

The system is now ready for production use and provides a complete replacement for Google Forms with enhanced functionality and admin management capabilities.
