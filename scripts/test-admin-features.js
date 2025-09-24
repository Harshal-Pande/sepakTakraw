#!/usr/bin/env node

/**
 * Comprehensive Admin Features Testing Script
 * Tests all CRUD operations for every admin section
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@sepaktakraw.org';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Test data templates
const TEST_DATA = {
  news: {
    title: 'Test News Article',
    content: 'This is a test news article content.',
    excerpt: 'Test news excerpt',
    featured: false,
    status: 'published'
  },
  events: {
    title: 'Test Event',
    description: 'This is a test event description.',
    event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    location: 'Test Location',
    photos: []
  },
  results: {
    title: 'Test Match Result',
    description: 'Test match description',
    match_date: new Date().toISOString().split('T')[0],
    venue: 'Test Venue',
    team1: 'Team A',
    team2: 'Team B',
    score1: 2,
    score2: 1,
    winner: 'Team A',
    photos: []
  },
  'general-body': {
    name: 'Test Member',
    position: 'Test Position',
    email: 'test@example.com',
    phone: '+1234567890',
    bio: 'Test member bio',
    photo_url: '',
    order: 1
  },
  elections: {
    title: 'Test Election',
    description: 'Test election description',
    election_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    document_url: ''
  },
  history: {
    title: 'Test History Entry',
    description: 'Test history description',
    year: 2024,
    image_url: ''
  },
  'anti-dop-guidelines': {
    title: 'Test Anti-DOP Guideline',
    description: 'Test anti-doping guideline description',
    document_url: ''
  },
  'myas-compliance': {
    title: 'Test Compliance Document',
    description: 'Test compliance document description',
    category: 'guidelines',
    document_type: 'pdf',
    effective_date: new Date().toISOString().split('T')[0],
    document_url: '',
    status: 'active'
  },
  rti: {
    request_number: `RTI-TEST-${Date.now()}`,
    applicant_name: 'Test Applicant',
    applicant_email: 'applicant@example.com',
    applicant_phone: '+1234567890',
    subject: 'Test RTI Request',
    description: 'Test RTI request description',
    request_date: new Date().toISOString().split('T')[0],
    response_due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'pending',
    response: ''
  },
  'hero-images': {
    title: 'Test Hero Image',
    subtitle: 'Test Subtitle',
    description: 'Test hero image description',
    image_url: 'https://via.placeholder.com/1200x600',
    display_order: 1,
    is_active: true
  }
};

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function logTest(testName, success, message = '') {
  testResults.total++;
  if (success) {
    testResults.passed++;
    log(`PASS: ${testName}`, 'success');
  } else {
    testResults.failed++;
    log(`FAIL: ${testName} - ${message}`, 'error');
  }
  testResults.details.push({ testName, success, message });
}

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message, status: 0 };
  }
}

// Authentication
async function login() {
  log('Attempting to login...');
  const result = await makeRequest(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
  });
  
  if (result.success && result.data.success) {
    log('Login successful', 'success');
    return result.data.token;
  } else {
    log('Login failed', 'error');
    return null;
  }
}

// Test CRUD operations for a specific resource
async function testResourceCRUD(resourceName, testData) {
  log(`\n🧪 Testing ${resourceName} CRUD operations...`);
  
  let createdId = null;
  const authToken = await login();
  
  if (!authToken) {
    logTest(`${resourceName} - Authentication`, false, 'Failed to authenticate');
    return;
  }

  const headers = {
    'Authorization': `Bearer ${authToken}`
  };

  // Test CREATE
  try {
    const createResult = await makeRequest(`${BASE_URL}/api/${resourceName}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(testData)
    });
    
    if (createResult.success && createResult.data.success) {
      createdId = createResult.data.data.id;
      logTest(`${resourceName} - CREATE`, true);
    } else {
      logTest(`${resourceName} - CREATE`, false, createResult.data?.error || 'Unknown error');
      return;
    }
  } catch (error) {
    logTest(`${resourceName} - CREATE`, false, error.message);
    return;
  }

  // Test READ (list)
  try {
    const listResult = await makeRequest(`${BASE_URL}/api/${resourceName}`, {
      headers
    });
    
    if (listResult.success && listResult.data.success) {
      logTest(`${resourceName} - READ (list)`, true);
    } else {
      logTest(`${resourceName} - READ (list)`, false, listResult.data?.error || 'Unknown error');
    }
  } catch (error) {
    logTest(`${resourceName} - READ (list)`, false, error.message);
  }

  // Test READ (single)
  if (createdId) {
    try {
      const singleResult = await makeRequest(`${BASE_URL}/api/${resourceName}/${createdId}`, {
        headers
      });
      
      if (singleResult.success && singleResult.data.success) {
        logTest(`${resourceName} - READ (single)`, true);
      } else {
        logTest(`${resourceName} - READ (single)`, false, singleResult.data?.error || 'Unknown error');
      }
    } catch (error) {
      logTest(`${resourceName} - READ (single)`, false, error.message);
    }

    // Test UPDATE
    try {
      const updateData = { ...testData, title: `Updated ${testData.title}` };
      const updateResult = await makeRequest(`${BASE_URL}/api/${resourceName}/${createdId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
      });
      
      if (updateResult.success && updateResult.data.success) {
        logTest(`${resourceName} - UPDATE`, true);
      } else {
        logTest(`${resourceName} - UPDATE`, false, updateResult.data?.error || 'Unknown error');
      }
    } catch (error) {
      logTest(`${resourceName} - UPDATE`, false, error.message);
    }

    // Test DELETE
    try {
      const deleteResult = await makeRequest(`${BASE_URL}/api/${resourceName}/${createdId}`, {
        method: 'DELETE',
        headers
      });
      
      if (deleteResult.success && deleteResult.data.success) {
        logTest(`${resourceName} - DELETE`, true);
      } else {
        logTest(`${resourceName} - DELETE`, false, deleteResult.data?.error || 'Unknown error');
      }
    } catch (error) {
      logTest(`${resourceName} - DELETE`, false, error.message);
    }
  }
}

// Test admin dashboard
async function testAdminDashboard() {
  log('\n🧪 Testing admin dashboard...');
  
  const authToken = await login();
  if (!authToken) {
    logTest('Admin Dashboard - Authentication', false, 'Failed to authenticate');
    return;
  }

  try {
    const result = await makeRequest(`${BASE_URL}/api/admin/dashboard`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (result.success && result.data.success) {
      logTest('Admin Dashboard - Data Fetch', true);
    } else {
      logTest('Admin Dashboard - Data Fetch', false, result.data?.error || 'Unknown error');
    }
  } catch (error) {
    logTest('Admin Dashboard - Data Fetch', false, error.message);
  }
}

// Test admin settings
async function testAdminSettings() {
  log('\n🧪 Testing admin settings...');
  
  const authToken = await login();
  if (!authToken) {
    logTest('Admin Settings - Authentication', false, 'Failed to authenticate');
    return;
  }

  try {
    // Test GET settings
    const getResult = await makeRequest(`${BASE_URL}/api/admin/settings`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (getResult.success && getResult.data.success) {
      logTest('Admin Settings - GET', true);
    } else {
      logTest('Admin Settings - GET', false, getResult.data?.error || 'Unknown error');
    }

    // Test POST settings
    const settingsData = {
      site_name: 'Test Site',
      site_email: 'test@example.com',
      maintenance_mode: false
    };

    const postResult = await makeRequest(`${BASE_URL}/api/admin/settings`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify(settingsData)
    });
    
    if (postResult.success && postResult.data.success) {
      logTest('Admin Settings - POST', true);
    } else {
      logTest('Admin Settings - POST', false, postResult.data?.error || 'Unknown error');
    }
  } catch (error) {
    logTest('Admin Settings - POST', false, error.message);
  }
}

// Test file upload functionality
async function testFileUpload() {
  log('\n🧪 Testing file upload...');
  
  const authToken = await login();
  if (!authToken) {
    logTest('File Upload - Authentication', false, 'Failed to authenticate');
    return;
  }

  try {
    // Test image upload
    const imageFormData = new FormData();
    imageFormData.append('file', new Blob(['fake image data'], { type: 'image/jpeg' }), 'test.jpg');

    const imageResult = await fetch(`${BASE_URL}/api/upload/images`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: imageFormData
    });

    if (imageResult.ok) {
      logTest('File Upload - Images', true);
    } else {
      logTest('File Upload - Images', false, 'Image upload failed');
    }

    // Test document upload
    const docFormData = new FormData();
    docFormData.append('file', new Blob(['fake document data'], { type: 'application/pdf' }), 'test.pdf');

    const docResult = await fetch(`${BASE_URL}/api/upload/documents`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: docFormData
    });

    if (docResult.ok) {
      logTest('File Upload - Documents', true);
    } else {
      logTest('File Upload - Documents', false, 'Document upload failed');
    }
  } catch (error) {
    logTest('File Upload', false, error.message);
  }
}

// Test public pages
async function testPublicPages() {
  log('\n🧪 Testing public pages...');
  
  const publicPages = [
    '/',
    '/news',
    '/events',
    '/results',
    '/general-body',
    '/history',
    '/contact',
    '/anti-dop-guidelines',
    '/elections',
    '/myas-compliance',
    '/rti'
  ];

  for (const page of publicPages) {
    try {
      const result = await makeRequest(`${BASE_URL}${page}`);
      
      if (result.success && result.status === 200) {
        logTest(`Public Page - ${page}`, true);
      } else {
        logTest(`Public Page - ${page}`, false, `Status: ${result.status}`);
      }
    } catch (error) {
      logTest(`Public Page - ${page}`, false, error.message);
    }
  }
}

// Main test runner
async function runTests() {
  log('🚀 Starting comprehensive admin features testing...');
  log(`Base URL: ${BASE_URL}`);
  log(`Admin Email: ${ADMIN_EMAIL}`);
  
  // Test public pages first
  await testPublicPages();
  
  // Test admin dashboard and settings
  await testAdminDashboard();
  await testAdminSettings();
  
  // Test file upload
  await testFileUpload();
  
  // Test all resource CRUD operations
  for (const [resourceName, testData] of Object.entries(TEST_DATA)) {
    await testResourceCRUD(resourceName, testData);
  }
  
  // Generate test report
  generateTestReport();
}

// Generate test report
function generateTestReport() {
  log('\n📊 Test Results Summary:');
  log(`Total Tests: ${testResults.total}`);
  log(`Passed: ${testResults.passed}`, 'success');
  log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? 'error' : 'success');
  log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(2)}%`);
  
  if (testResults.failed > 0) {
    log('\n❌ Failed Tests:');
    testResults.details
      .filter(test => !test.success)
      .forEach(test => log(`  - ${test.testName}: ${test.message}`, 'error'));
  }
  
  // Save detailed report to file
  const reportPath = path.join(__dirname, 'test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      successRate: ((testResults.passed / testResults.total) * 100).toFixed(2)
    },
    details: testResults.details
  }, null, 2));
  
  log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  // Exit with appropriate code
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled Rejection at: ${promise}, reason: ${reason}`, 'error');
  process.exit(1);
});

// Run the tests
if (require.main === module) {
  runTests().catch(error => {
    log(`Test runner failed: ${error.message}`, 'error');
    process.exit(1);
  });
}

module.exports = { runTests, testResourceCRUD, testAdminDashboard, testPublicPages };
