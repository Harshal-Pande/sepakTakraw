#!/usr/bin/env node

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testServer() {
  console.log('🧪 Testing server connectivity...');
  
  try {
    // Test basic connectivity
    const response = await fetch('http://localhost:3000');
    console.log('✅ Server is running!');
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    // Test login endpoint
    console.log('\n🔐 Testing login...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@sepaktakraw.org',
        password: 'Admin@123'
      })
    });
    
    const loginText = await loginResponse.text();
    console.log('Login Status:', loginResponse.status);
    console.log('Login Response (raw):', loginText.substring(0, 200) + '...');
    
    try {
      const loginData = JSON.parse(loginText);
      console.log('Login Response (parsed):', JSON.stringify(loginData, null, 2));
    } catch (e) {
      console.log('Failed to parse JSON:', e.message);
    }
    
    if (loginData.success && loginData.token) {
      console.log('✅ Login successful!');
      
      // Test a simple API endpoint
      console.log('\n📊 Testing API endpoint...');
      const apiResponse = await fetch('http://localhost:3000/api/news', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const apiData = await apiResponse.json();
      console.log('API Status:', apiResponse.status);
      console.log('API Response:', JSON.stringify(apiData, null, 2));
      
    } else {
      console.log('❌ Login failed');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testServer();
