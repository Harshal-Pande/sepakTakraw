#!/usr/bin/env node

/**
 * Environment Setup Script
 * 
 * This script helps set up the environment variables needed for the application.
 */

const fs = require('fs');
const path = require('path');

const envTemplate = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=your_database_url_here

# File Upload Configuration
MAX_FILE_SIZE=52428800
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,webp,doc,docx

# Admin Configuration
ADMIN_EMAIL=admin@sepaktakraw.org
ADMIN_PASSWORD=admin123
`;

function setupEnvironment() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  console.log('🔧 Setting up environment variables...');
  
  // Check if .env.local already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local already exists. Backing up to .env.local.backup');
    fs.copyFileSync(envPath, envPath + '.backup');
  }
  
  // Create .env.local from template
  fs.writeFileSync(envPath, envTemplate);
  
  console.log('✅ Created .env.local file');
  console.log('\n📝 Please edit .env.local and add your actual values:');
  console.log('   1. Get your Supabase URL and keys from https://supabase.com/dashboard');
  console.log('   2. Generate a random NEXTAUTH_SECRET');
  console.log('   3. Update other values as needed');
  console.log('\n🚀 After updating .env.local, run:');
  console.log('   npm run seed:db');
}

if (require.main === module) {
  setupEnvironment();
}

module.exports = { setupEnvironment };
