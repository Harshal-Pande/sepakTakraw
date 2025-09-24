#!/usr/bin/env node

/**
 * Simple Admin Features Testing Script
 * Tests basic functionality without external dependencies
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

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

// Test file existence
function testFileExists(filePath, description) {
  const fullPath = path.join(process.cwd(), filePath);
  const exists = fs.existsSync(fullPath);
  logTest(`${description} - File exists`, exists, exists ? '' : `File not found: ${filePath}`);
  return exists;
}

// Test admin pages structure
function testAdminPagesStructure() {
  log('\n🧪 Testing admin pages structure...');
  
  const adminPages = [
    'app/admin/page.js',
    'app/admin/layout.js',
    'app/admin/login/page.js',
    'app/admin/settings/page.js',
    'app/admin/news/page.js',
    'app/admin/news/create/page.js',
    'app/admin/news/edit/[id]/page.js',
    'app/admin/events/page.js',
    'app/admin/events/create/page.js',
    'app/admin/events/edit/[id]/page.js',
    'app/admin/results/page.js',
    'app/admin/results/create/page.js',
    'app/admin/results/edit/[id]/page.js',
    'app/admin/general-body/page.js',
    'app/admin/general-body/create/page.js',
    'app/admin/general-body/edit/[id]/page.js',
    'app/admin/elections/page.js',
    'app/admin/elections/create/page.js',
    'app/admin/elections/edit/[id]/page.js',
    'app/admin/history/page.js',
    'app/admin/history/create/page.js',
    'app/admin/history/edit/[id]/page.js',
    'app/admin/anti-dop-guidelines/page.js',
    'app/admin/anti-dop-guidelines/create/page.js',
    'app/admin/anti-dop-guidelines/edit/[id]/page.js',
    'app/admin/contact/page.js',
    'app/admin/file-manager/page.js',
    'app/admin/hero-images/page.js',
    'app/admin/hero-images/create/page.js',
    'app/admin/hero-images/edit/[id]/page.js',
    'app/admin/myas-compliance/page.js',
    'app/admin/myas-compliance/create/page.js',
    'app/admin/myas-compliance/edit/[id]/page.js',
    'app/admin/rti/page.js',
    'app/admin/rti/create/page.js',
    'app/admin/rti/edit/[id]/page.js'
  ];

  adminPages.forEach(page => {
    testFileExists(page, 'Admin Page');
  });
}

// Test API routes structure
function testApiRoutesStructure() {
  log('\n🧪 Testing API routes structure...');
  
  const apiRoutes = [
    'app/api/admin/dashboard/route.js',
    'app/api/admin/settings/route.js',
    'app/api/auth/login/route.js',
    'app/api/auth/logout/route.js',
    'app/api/auth/verify/route.js',
    'app/api/news/route.js',
    'app/api/news/[id]/route.js',
    'app/api/events/route.js',
    'app/api/events/[id]/route.js',
    'app/api/results/route.js',
    'app/api/results/[id]/route.js',
    'app/api/general-body/route.js',
    'app/api/general-body/[id]/route.js',
    'app/api/elections/route.js',
    'app/api/elections/[id]/route.js',
    'app/api/history/route.js',
    'app/api/history/[id]/route.js',
    'app/api/anti-dop-guidelines/route.js',
    'app/api/anti-dop-guidelines/[id]/route.js',
    'app/api/contact/route.js',
    'app/api/hero-images/route.js',
    'app/api/hero-images/[id]/route.js',
    'app/api/myas-compliance/route.js',
    'app/api/myas-compliance/[id]/route.js',
    'app/api/rti/route.js',
    'app/api/rti/[id]/route.js',
    'app/api/upload/images/route.js',
    'app/api/upload/documents/route.js',
    'app/api/stats/route.js',
    'app/api/search/route.js',
    'app/api/quick-links/route.js'
  ];

  apiRoutes.forEach(route => {
    testFileExists(route, 'API Route');
  });
}

// Test public pages structure
function testPublicPagesStructure() {
  log('\n🧪 Testing public pages structure...');
  
  const publicPages = [
    'app/page.js',
    'app/layout.js',
    'app/globals.css',
    'app/news/page.js',
    'app/events/page.js',
    'app/results/page.js',
    'app/general-body/page.js',
    'app/history/page.js',
    'app/contact/page.js',
    'app/anti-dop-guidelines/page.js',
    'app/elections/page.js',
    'app/myas-compliance/page.js',
    'app/rti/page.js'
  ];

  publicPages.forEach(page => {
    testFileExists(page, 'Public Page');
  });
}

// Test component structure
function testComponentStructure() {
  log('\n🧪 Testing component structure...');
  
  const components = [
    'components/admin/common/AdminPage.js',
    'components/admin/common/AdminCard.js',
    'components/admin/common/AdminForm.js',
    'components/admin/dashboard/StatsCard.js',
    'components/admin/dashboard/RecentActivity.js',
    'components/layout/PageHeader.js',
    'components/sections/NewsSection.js',
    'components/sections/EventsSection.js',
    'components/sections/StatsSection.js',
    'components/sections/QuickLinks.js',
    'components/common/FileUpload.js',
    'components/ui/button.jsx',
    'components/ui/input.jsx',
    'components/ui/textarea.jsx',
    'components/ui/label.jsx',
    'components/ui/badge.jsx',
    'components/ui/switch.jsx'
  ];

  components.forEach(component => {
    testFileExists(component, 'Component');
  });
}

// Test configuration files
function testConfigurationFiles() {
  log('\n🧪 Testing configuration files...');
  
  const configFiles = [
    'package.json',
    'next.config.mjs',
    'tailwind.config.js',
    'postcss.config.mjs',
    'eslint.config.mjs',
    'jsconfig.json',
    'components.json',
    'middleware.js'
  ];

  configFiles.forEach(config => {
    testFileExists(config, 'Config File');
  });
}

// Test file content validation
function testFileContent() {
  log('\n🧪 Testing file content validation...');
  
  // Test package.json has required scripts
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredScripts = ['dev', 'build', 'start', 'test:admin'];
    
    requiredScripts.forEach(script => {
      const hasScript = packageJson.scripts && packageJson.scripts[script];
      logTest(`Package.json - ${script} script`, hasScript, hasScript ? '' : `Missing script: ${script}`);
    });
  } catch (error) {
    logTest('Package.json - Valid JSON', false, error.message);
  }

  // Test next.config.mjs exists and is valid
  try {
    const nextConfigPath = 'next.config.mjs';
    if (fs.existsSync(nextConfigPath)) {
      const content = fs.readFileSync(nextConfigPath, 'utf8');
      const hasExport = content.includes('export default');
      logTest('Next.config.mjs - Valid export', hasExport, hasExport ? '' : 'Missing export default');
    }
  } catch (error) {
    logTest('Next.config.mjs - Valid content', false, error.message);
  }
}

// Test admin page imports
function testAdminPageImports() {
  log('\n🧪 Testing admin page imports...');
  
  const adminPages = [
    'app/admin/page.js',
    'app/admin/news/page.js',
    'app/admin/events/page.js',
    'app/admin/results/page.js'
  ];

  adminPages.forEach(pagePath => {
    try {
      if (fs.existsSync(pagePath)) {
        const content = fs.readFileSync(pagePath, 'utf8');
        const hasReactImport = content.includes("'use client'") || content.includes('"use client"');
        const hasAdminPageImport = content.includes('AdminPage') || content.includes('AdminCard');
        
        logTest(`${pagePath} - React client directive`, hasReactImport, hasReactImport ? '' : 'Missing use client directive');
        logTest(`${pagePath} - Admin components import`, hasAdminPageImport, hasAdminPageImport ? '' : 'Missing admin component imports');
      }
    } catch (error) {
      logTest(`${pagePath} - Readable`, false, error.message);
    }
  });
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
  const reportPath = path.join(__dirname, 'simple-test-report.json');
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

// Main test runner
function runTests() {
  log('🚀 Starting simple admin features testing...');
  log(`Working Directory: ${process.cwd()}`);
  
  // Run all tests
  testConfigurationFiles();
  testAdminPagesStructure();
  testApiRoutesStructure();
  testPublicPagesStructure();
  testComponentStructure();
  testFileContent();
  testAdminPageImports();
  
  // Generate test report
  generateTestReport();
}

// Run the tests
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
