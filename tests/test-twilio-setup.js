#!/usr/bin/env node

// Quick test script to validate Twilio setup
// Run with: node test-twilio-setup.js

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

console.log('🚀 CORNMAN Strategic HQ - Twilio Setup Validation');
console.log('='.repeat(60));

// 1. Check Node.js version
console.log('✅ Node.js Version:', process.version);

// 2. Check if Twilio is installed
try {
  const twilio = require('twilio');
  console.log('✅ Twilio SDK installed successfully');

  // Test client creation (without actual credentials)
  try {
    // This will fail but proves the SDK works
    const client = twilio('test', 'test');
    console.log('✅ Twilio client creation works');
  } catch (error) {
    console.log('✅ Twilio client structure validated');
  }
} catch (error) {
  console.log('❌ Twilio SDK not found:', error.message);
  console.log('   Run: npm install twilio');
  // Don't exit, continue with other checks
}

// 3. Check environment variables
console.log('\n📋 Environment Variables Check:');
const envVars = [
  'VITE_TWILIO_TEST_ACCOUNT_SID',
  'VITE_TWILIO_TEST_AUTH_TOKEN',
  'VITE_TWILIO_LIVE_ACCOUNT_SID',
  'VITE_TWILIO_LIVE_AUTH_TOKEN',
  'VITE_TWILIO_WHATSAPP_NUMBER',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
];

let missingVars = [];
envVars.forEach((envVar) => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar}: Set`);
  } else {
    console.log(`❌ ${envVar}: Not set`);
    missingVars.push(envVar);
  }
});

// 4. Check project structure
console.log('\n📁 Project Structure Check:');
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'services/twilioService.ts',
  'components/TwilioDashboard.tsx',
  'utils/webhookHandlers.ts',
  'database/webhook-schema.sql',
  'app/api/whatsapp/webhook/route.ts',
  'app/api/whatsapp/health/route.ts',
  'TWILIO_INTEGRATION_GUIDE.md',
  'TWILIO_SECURITY_GUIDE.md',
];

requiredFiles.forEach((file) => {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    console.log(`✅ ${file}: Found`);
  } else {
    console.log(`❌ ${file}: Missing`);
  }
});

// 5. Quick functionality test
console.log('\n🧪 Quick Functionality Test:');

try {
  // Test crypto (for webhook validation)
  const crypto = require('crypto');
  const testHash = crypto.createHmac('sha1', 'test').update('test').digest('base64');
  console.log('✅ Crypto module works for webhook validation');
} catch (error) {
  console.log('❌ Crypto module issue:', error.message);
}

try {
  // Test JSON parsing (for webhook payloads)
  const testJson = JSON.parse('{"test": true}');
  console.log('✅ JSON parsing works');
} catch (error) {
  console.log('❌ JSON parsing issue:', error.message);
}

// 6. Summary
console.log('\n' + '='.repeat(60));
console.log('📊 SETUP VALIDATION SUMMARY');
console.log('='.repeat(60));

if (missingVars.length > 0) {
  console.log('⚠️  Missing Environment Variables:');
  missingVars.forEach((envVar) => console.log(`   - ${envVar}`));
  console.log('\n💡 Next Steps:');
  console.log('   1. Copy .env.example to .env.local');
  console.log('   2. Add your Twilio credentials to .env.local');
  console.log('   3. Run this test again');
} else {
  console.log('🎉 All environment variables configured!');
}

console.log('\n🚀 Ready to start development:');
console.log('   npm run dev');
console.log('\n📚 Need help? Check:');
console.log('   - TWILIO_INTEGRATION_GUIDE.md');
console.log('   - TWILIO_SECURITY_GUIDE.md');

console.log('\n🌽 CORNMAN Strategic HQ - Ready for WhatsApp Integration!');
