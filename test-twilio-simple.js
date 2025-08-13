#!/usr/bin/env node

// Simple Twilio setup validation script
// Run with: node test-twilio-simple.js

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
  console.log('   Version:', twilio.version || 'Unknown');
} catch (error) {
  console.log('❌ Twilio SDK not found:', error.message);
  console.log('   Run: npm install twilio');
}

// 3. Check project structure
console.log('\n📁 Project Structure Check:');
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'services/twilioService.ts',
  'components/TwilioDashboard.tsx',
  'utils/webhookHandlers.ts',
  'config/twilio.config.ts',
  'env.example',
];

const missingFiles = [];
requiredFiles.forEach((file) => {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    console.log(`✅ ${file}: Found`);
  } else {
    console.log(`❌ ${file}: Missing`);
    missingFiles.push(file);
  }
});

// 4. Check configuration
console.log('\n⚙️  Configuration Check:');
try {
  const configPath = path.join(process.cwd(), 'config/twilio.config.ts');
  if (fs.existsSync(configPath)) {
    console.log('✅ Twilio config file exists');
  } else {
    console.log('❌ Twilio config file missing');
  }
} catch (error) {
  console.log('❌ Error checking config:', error.message);
}

// 5. Summary
console.log('\n' + '='.repeat(60));
console.log('📊 SETUP VALIDATION SUMMARY');
console.log('='.repeat(60));

if (missingFiles.length > 0) {
  console.log('⚠️  Missing Files:');
  missingFiles.forEach((file) => console.log(`   - ${file}`));
}

console.log('\n💡 Next Steps:');
console.log('   1. Copy env.example to .env.local');
console.log('   2. Add your Twilio credentials to .env.local');
console.log('   3. Run: npm run dev');
console.log('   4. Navigate to the Twilio Dashboard component');

console.log('\n🚀 Ready to start development!');
console.log('🌽 CORNMAN Strategic HQ - Ready for WhatsApp Integration!');
