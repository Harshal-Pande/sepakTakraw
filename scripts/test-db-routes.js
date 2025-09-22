#!/usr/bin/env node

/**
 * Database API Routes Testing Script
 * 
 * This script tests all public database API routes to:
 * 1. Check if tables are populated
 * 2. Test database connections
 * 3. Add sample data to empty tables
 * 4. Verify schemas are working properly
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const https = require('https');
const http = require('http');

// Configuration
// Force localhost:3000 as requested
const BASE_URL = 'http://localhost:3000';

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
const API_ROUTES = [
  { path: '/api/news', table: 'news', name: 'News' },
  { path: '/api/events', table: 'events', name: 'Events' },
  { path: '/api/results', table: 'results', name: 'Results' },
  { path: '/api/general-body', table: 'general_body', name: 'General Body' },
  { path: '/api/history', table: 'history', name: 'History' },
  { path: '/api/hero-images', table: 'hero_images', name: 'Hero Images' },
  { path: '/api/contact', table: 'contact_info', name: 'Contact Info' },
  // Newly added routes switched from mock to DB-backed
  { path: '/api/stats', table: null, name: 'Stats', readOnly: true },
  { path: '/api/quick-links', table: null, name: 'Quick Links', readOnly: true },
];

// Sample data for each table
const SAMPLE_DATA = {
  news: [
    {
      title: "National Sepaktakraw Championship 2024",
      description: "The annual national championship will be held in Mumbai from March 15-20, 2024. Teams from all states are invited to participate.",
      featured_image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop"
    },
    {
      title: "New Training Program Launched",
      description: "We are excited to announce a new training program for young Sepaktakraw players. The program will focus on developing fundamental skills and techniques.",
      featured_image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=400&fit=crop"
    }
  ],
  events: [
    {
      title: "State Level Championship",
      description: "Annual state level Sepaktakraw championship for all age groups",
      event_date: "2024-03-15",
      location: "Mumbai Sports Complex",
      photos: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop"]
    },
    {
      title: "Training Workshop",
      description: "Technical training workshop for coaches and referees",
      event_date: "2024-04-10",
      location: "Delhi Sports Academy",
      photos: ["https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=400&fit=crop"]
    }
  ],
  results: [
    {
      title: "National Championship 2023 Results",
      description: "Complete results and standings from the 2023 National Sepaktakraw Championship",
      document_url: "https://example.com/results-2023.pdf"
    },
    {
      title: "State Championship Results",
      description: "Results from various state level championships held throughout the year",
      document_url: "https://example.com/state-results.pdf"
    }
  ],
  general_body: [
    {
      district: "Mumbai",
      position: "President",
      name: "Dr. Rajesh Kumar",
      contact: "+91 98765 43210",
      email: "president@sepaktakraw.org"
    },
    {
      district: "Delhi",
      position: "Vice President",
      name: "Ms. Priya Sharma",
      contact: "+91 98765 43211",
      email: "vicepresident@sepaktakraw.org"
    }
  ],
  history: [
    {
      content: "Sepaktakraw Federation was established with the aim of promoting and developing Sepaktakraw sports across India.",
      timeline_year: 1995
    },
    {
      content: "First National Championship was organized in Mumbai with participation from 15 states.",
      timeline_year: 1996
    }
  ],
  hero_images: [
    {
      image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop",
      alt_text: "Sepaktakraw players in action",
      is_active: true
    },
    {
      image_url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=1200&h=600&fit=crop",
      alt_text: "Sepaktakraw tournament",
      is_active: true
    }
  ],
  quick_links: [
    {
      title: "Latest News",
      url: "/news",
      icon: "Newspaper",
      description: "Stay updated with the latest news and announcements"
    },
    {
      title: "Upcoming Events",
      url: "/events",
      icon: "Calendar",
      description: "Check out upcoming tournaments and events"
    }
  ],
  stats: [
    {
      title: "Total Players",
      value: "5000",
      icon: "Users",
      description: "Registered players across all states"
    },
    {
      title: "Tournaments",
      value: "150",
      icon: "Trophy",
      description: "Tournaments organized this year"
    }
  ],
  contact_info: [
    {
      address: "123 Sports Avenue, National City, 12345",
      phone: "+91 98765 43210",
      email: "info@sepaktakraw.org",
      office_hours: "Monday to Friday: 9:00 AM - 6:00 PM"
    }
  ]
};

// Utility function to make HTTP requests
function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const bodyString = data ? JSON.stringify(data) : null;

    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (bodyString) {
      req.write(bodyString);
    }
    req.end();
  });
}

// Test a single API route
async function testRoute(route) {
  console.log(`\n🔍 Testing ${route.name} (${route.path})...`);
  
  try {
    const response = await makeRequest(`${BASE_URL}${route.path}`);
    
    if (response.status === 200) {
      const data = response.data;
      
      if (data.success && Array.isArray(data.data)) {
        const count = data.data.length;
        console.log(`✅ ${route.name}: ${count} records found`);
        
        if (count === 0) {
          if (route.readOnly) {
            console.log(`ℹ️  ${route.name} is read-only. Skipping population.`);
          } else {
          console.log(`⚠️  ${route.name} table is empty. Adding sample data...`);
          await populateTable(route);
          }
        } else {
          console.log(`✅ ${route.name} table has data`);
        }
      } else {
        console.log(`❌ ${route.name}: Invalid response format`);
        console.log(`   Response:`, JSON.stringify(data, null, 2));
      }
    } else {
      console.log(`❌ ${route.name}: HTTP ${response.status}`);
      console.log(`   Response:`, JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.log(`❌ ${route.name}: Error - ${error.message}`);
  }
}

// Populate a table with sample data
async function populateTable(route) {
  const sampleData = SAMPLE_DATA[route.table];
  
  if (!sampleData) {
    console.log(`⚠️  No sample data available for ${route.table}`);
    return;
  }

  try {
    for (const item of sampleData) {
      const response = await makeRequest(`${BASE_URL}${route.path}`, 'POST', item);
      
      if (response.status === 200 || response.status === 201) {
        console.log(`   ✅ Added: ${item.title || item.name || 'Record'}`);
      } else {
        console.log(`   ❌ Failed to add: ${item.title || item.name || 'Record'}`);
        console.log(`      Response:`, JSON.stringify(response.data, null, 2));
      }
    }
  } catch (error) {
    console.log(`   ❌ Error populating ${route.table}: ${error.message}`);
  }
}

// Test database connection
async function testDatabaseConnection() {
  console.log('🔗 Testing database connection...');
  
  try {
    // Test a simple route that should always work
    const response = await makeRequest(`${BASE_URL}/api/news`);
    
    if (response.status === 200) {
      console.log('✅ Database connection successful');
      return true;
    } else {
      console.log('❌ Database connection failed');
      return false;
    }
  } catch (error) {
    console.log(`❌ Database connection error: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 Starting Database API Routes Test');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log('=' .repeat(50));

  // Validate environment variables first
  if (!validateEnvironment()) {
    process.exit(1);
  }

  // Test database connection first
  const dbConnected = await testDatabaseConnection();
  
  if (!dbConnected) {
    console.log('\n❌ Cannot proceed without database connection');
    process.exit(1);
  }

  // Test all routes
  for (const route of API_ROUTES) {
    await testRoute(route);
  }

  console.log('\n' + '=' .repeat(50));
  console.log('✅ Database testing completed!');
  
  // Final verification
  console.log('\n🔍 Final verification...');
  for (const route of API_ROUTES) {
    try {
      const response = await makeRequest(`${BASE_URL}${route.path}`);
      if (response.status === 200 && response.data.success) {
        const count = response.data.data.length;
        console.log(`✅ ${route.name}: ${count} records`);
      }
    } catch (error) {
      console.log(`❌ ${route.name}: Verification failed`);
    }
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testRoute, populateTable, testDatabaseConnection };
