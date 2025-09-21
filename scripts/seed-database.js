#!/usr/bin/env node

/**
 * Database Seeding Script
 * 
 * This script populates the database with comprehensive sample data
 * for all tables in the Sepaktakraw Sports Federation system.
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Environment variable validation
function validateEnvironment() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  const missingVars = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }
  
  if (missingVars.length > 0) {
    console.log('❌ Missing required environment variables:');
    missingVars.forEach(envVar => {
      console.log(`   - ${envVar}`);
    });
    console.log('\nPlease check your .env.local file and ensure all required variables are set.');
    return false;
  }
  
  console.log('✅ All required environment variables are present');
  return true;
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Sample data for each table
const SAMPLE_DATA = {
  admin_users: [
    {
      email: 'admin@sepaktakraw.org',
      password_hash: bcrypt.hashSync('admin123', 10),
      name: 'System Administrator',
      role: 'admin',
      is_active: true
    },
    {
      email: 'editor@sepaktakraw.org',
      password_hash: bcrypt.hashSync('editor123', 10),
      name: 'Content Editor',
      role: 'editor',
      is_active: true
    }
  ],
  
  contact_info: [
    {
      address: '123 Sports Avenue, National City, 12345',
      phone: '+91 98765 43210',
      email: 'info@sepaktakraw.org',
      office_hours: 'Monday to Friday: 9:00 AM - 6:00 PM'
    }
  ],
  
  hero_images: [
    {
      image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop',
      alt_text: 'Sepaktakraw players in action during tournament',
      is_active: true
    },
    {
      image_url: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=1200&h=600&fit=crop',
      alt_text: 'Sepaktakraw championship final match',
      is_active: true
    },
    {
      image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=600&fit=crop',
      alt_text: 'Sepaktakraw training session',
      is_active: true
    }
  ],
  
  news: [
    {
      title: 'National Sepaktakraw Championship 2024',
      description: 'The annual national championship will be held in Mumbai from March 15-20, 2024. Teams from all states are invited to participate in this prestigious tournament.',
      featured_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
      document_url: 'https://example.com/championship-2024.pdf'
    },
    {
      title: 'New Training Program Launched',
      description: 'We are excited to announce a new training program for young Sepaktakraw players. The program will focus on developing fundamental skills and techniques.',
      featured_image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=400&fit=crop'
    },
    {
      title: 'International Tournament Results',
      description: 'Our national team has secured third place in the recent international Sepaktakraw tournament held in Thailand. Congratulations to all players!',
      featured_image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=400&fit=crop'
    }
  ],
  
  events: [
    {
      title: 'State Level Championship',
      description: 'Annual state level Sepaktakraw championship for all age groups. Registration is now open for teams across the state.',
      event_date: '2024-03-15',
      location: 'Mumbai Sports Complex, Maharashtra',
      photos: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=400&fit=crop'
      ]
    },
    {
      title: 'Training Workshop for Coaches',
      description: 'Technical training workshop for coaches and referees. Learn the latest techniques and rules of Sepaktakraw.',
      event_date: '2024-04-10',
      location: 'Delhi Sports Academy, Delhi',
      photos: [
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=400&fit=crop'
      ]
    },
    {
      title: 'Youth Development Camp',
      description: 'Special training camp for young players aged 12-18. Focus on skill development and team building.',
      event_date: '2024-05-20',
      location: 'Bangalore Sports Center, Karnataka',
      photos: []
    }
  ],
  
  results: [
    {
      title: 'National Championship 2023 Results',
      description: 'Complete results and standings from the 2023 National Sepaktakraw Championship held in Chennai.',
      document_url: 'https://example.com/results-2023.pdf'
    },
    {
      title: 'State Championship Results',
      description: 'Results from various state level championships held throughout the year 2023.',
      document_url: 'https://example.com/state-results-2023.pdf'
    },
    {
      title: 'International Tournament Results',
      description: 'Results from international tournaments where Indian teams participated in 2023.',
      document_url: 'https://example.com/international-results-2023.pdf'
    }
  ],
  
  general_body: [
    {
      district: 'Mumbai',
      position: 'President',
      name: 'Dr. Rajesh Kumar',
      contact: '+91 98765 43210',
      email: 'president@sepaktakraw.org'
    },
    {
      district: 'Delhi',
      position: 'Vice President',
      name: 'Ms. Priya Sharma',
      contact: '+91 98765 43211',
      email: 'vicepresident@sepaktakraw.org'
    },
    {
      district: 'Bangalore',
      position: 'Secretary',
      name: 'Mr. Amit Patel',
      contact: '+91 98765 43212',
      email: 'secretary@sepaktakraw.org'
    },
    {
      district: 'Chennai',
      position: 'Treasurer',
      name: 'Dr. Sunita Reddy',
      contact: '+91 98765 43213',
      email: 'treasurer@sepaktakraw.org'
    },
    {
      district: 'Kolkata',
      position: 'Technical Director',
      name: 'Mr. Vikram Singh',
      contact: '+91 98765 43214',
      email: 'technical@sepaktakraw.org'
    }
  ],
  
  history: [
    {
      content: 'Sepaktakraw Federation was established with the aim of promoting and developing Sepaktakraw sports across India.',
      timeline_year: 1995
    },
    {
      content: 'First National Championship was organized in Mumbai with participation from 15 states.',
      timeline_year: 1996
    },
    {
      content: 'Indian team participated in the first international Sepaktakraw tournament in Malaysia.',
      timeline_year: 1998
    },
    {
      content: 'Sepaktakraw was officially recognized as a sport by the Indian Olympic Association.',
      timeline_year: 2005
    },
    {
      content: 'First women\'s national championship was organized in Delhi.',
      timeline_year: 2010
    },
    {
      content: 'Indian team won bronze medal in the Asian Sepaktakraw Championship.',
      timeline_year: 2015
    },
    {
      content: 'Digital platform launched for online registration and tournament management.',
      timeline_year: 2020
    }
  ],
  
  elections: [
    {
      title: 'General Body Elections 2024',
      description: 'Elections for various positions in the General Body will be held on March 30, 2024. All registered members are eligible to vote.',
      election_date: '2024-03-30',
      document_url: 'https://example.com/election-notice-2024.pdf'
    },
    {
      title: 'State Association Elections',
      description: 'Elections for state-level association positions. Each state will conduct their own elections as per the guidelines.',
      election_date: '2024-04-15',
      document_url: 'https://example.com/state-election-guidelines.pdf'
    }
  ],
  
  anti_dop_guidelines: [
    {
      title: 'Anti-Doping Guidelines 2024',
      description: 'Comprehensive guidelines for anti-doping measures in Sepaktakraw sports. All athletes and coaches must follow these guidelines.',
      document_url: 'https://example.com/anti-doping-guidelines-2024.pdf'
    },
    {
      title: 'Doping Control Procedures',
      description: 'Detailed procedures for doping control during tournaments and training camps.',
      document_url: 'https://example.com/doping-control-procedures.pdf'
    }
  ],
  
  myas_compliance: [
    {
      title: 'MYAS Compliance Report 2023',
      description: 'Annual compliance report submitted to the Ministry of Youth Affairs and Sports for the year 2023.',
      document_url: 'https://example.com/myas-compliance-2023.pdf'
    },
    {
      title: 'Financial Audit Report',
      description: 'Financial audit report for the fiscal year 2023-24 as required by MYAS guidelines.',
      document_url: 'https://example.com/financial-audit-2023.pdf'
    }
  ],
  
  rti: [
    {
      title: 'RTI Information Disclosure',
      description: 'Information disclosed under the Right to Information Act. This section contains various documents and information as per RTI guidelines.',
      document_url: 'https://example.com/rti-disclosure.pdf'
    },
    {
      title: 'Annual Report 2023',
      description: 'Annual report of the Sepaktakraw Sports Federation for the year 2023.',
      document_url: 'https://example.com/annual-report-2023.pdf'
    }
  ],
  
  system_settings: [
    {
      key: 'site_name',
      value: { value: 'Sepaktakraw Sports Federation' },
      description: 'Official name of the organization'
    },
    {
      key: 'site_email',
      value: { value: 'info@sepaktakraw.org' },
      description: 'Primary contact email address'
    },
    {
      key: 'maintenance_mode',
      value: { value: false },
      description: 'Whether the site is in maintenance mode'
    },
    {
      key: 'max_file_size',
      value: { value: 52428800 },
      description: 'Maximum file upload size in bytes (50MB)'
    },
    {
      key: 'allowed_file_types',
      value: { value: 'pdf,jpg,jpeg,png,webp,doc,docx' },
      description: 'Allowed file types for uploads'
    }
  ]
};

// Function to seed a single table
async function seedTable(tableName, data) {
  console.log(`\n🌱 Seeding ${tableName}...`);
  
  try {
    // Check if table already has data
    const { data: existingData, error: checkError } = await supabase
      .from(tableName)
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.log(`❌ Error checking ${tableName}: ${checkError.message}`);
      return false;
    }
    
    if (existingData && existingData.length > 0) {
      console.log(`⚠️  ${tableName} already has data. Skipping...`);
      return true;
    }
    
    // Insert data
    const { data: insertedData, error: insertError } = await supabase
      .from(tableName)
      .insert(data);
    
    if (insertError) {
      console.log(`❌ Error inserting into ${tableName}: ${insertError.message}`);
      return false;
    }
    
    console.log(`✅ Successfully seeded ${tableName} with ${data.length} records`);
    return true;
    
  } catch (error) {
    console.log(`❌ Unexpected error seeding ${tableName}: ${error.message}`);
    return false;
  }
}

// Function to test database connection
async function testConnection() {
  console.log('🔗 Testing database connection...');
  
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log(`❌ Database connection failed: ${error.message}`);
      return false;
    }
    
    console.log('✅ Database connection successful');
    return true;
    
  } catch (error) {
    console.log(`❌ Database connection error: ${error.message}`);
    return false;
  }
}

// Main seeding function
async function seedDatabase() {
  console.log('🚀 Starting Database Seeding Process');
  console.log('=' .repeat(50));
  
  // Validate environment
  if (!validateEnvironment()) {
    process.exit(1);
  }
  
  // Test connection
  if (!(await testConnection())) {
    process.exit(1);
  }
  
  // Seed all tables
  const tables = Object.keys(SAMPLE_DATA);
  let successCount = 0;
  
  for (const tableName of tables) {
    const success = await seedTable(tableName, SAMPLE_DATA[tableName]);
    if (success) successCount++;
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log(`✅ Database seeding completed!`);
  console.log(`📊 Successfully seeded ${successCount}/${tables.length} tables`);
  
  // Final verification
  console.log('\n🔍 Final verification...');
  for (const tableName of tables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('id')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${tableName}: Verification failed - ${error.message}`);
      } else {
        const count = data ? data.length : 0;
        console.log(`✅ ${tableName}: ${count > 0 ? 'Has data' : 'Empty'}`);
      }
    } catch (error) {
      console.log(`❌ ${tableName}: Verification error - ${error.message}`);
    }
  }
}

// Run the seeding process
if (require.main === module) {
  seedDatabase().catch(console.error);
}

module.exports = { seedDatabase, seedTable, testConnection };
