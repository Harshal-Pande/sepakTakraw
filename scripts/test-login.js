#!/usr/bin/env node

const BASE_URL = 'http://localhost:3000';
const ADMIN_EMAIL = 'admin@sepaktakraw.org';
const ADMIN_PASSWORD = 'Admin@123';

async function testLogin() {
  console.log('🧪 Testing login...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      })
    });
    
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.success && data.token) {
      console.log('✅ Login successful! Token:', data.token.substring(0, 20) + '...');
      
      // Test using the token
      const testResponse = await fetch(`${BASE_URL}/api/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });
      
      const testData = await testResponse.json();
      console.log('Dashboard test status:', testResponse.status);
      console.log('Dashboard test data:', JSON.stringify(testData, null, 2));
      
    } else {
      console.log('❌ Login failed:', data.error || 'Unknown error');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testLogin();
