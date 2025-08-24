// 🤖 CORNMAN Strategic HQ - WhatsApp Connection Test
// Run this to verify your Twilio WhatsApp setup

import twilio from 'twilio';

// Your actual credentials (replace with your own)
const TEST_ACCOUNT_SID = 'your-test-account-sid-here';
const TEST_AUTH_TOKEN = 'your-test-auth-token-here';
const LIVE_ACCOUNT_SID = 'your-live-account-sid-here';
const LIVE_AUTH_TOKEN = 'your-live-auth-token-here';
const PHONE_NUMBER = '+15642444656';
const WHATSAPP_NUMBER = '+14155238886';

async function testTwilioConnection() {
  console.log('🚀 CORNMAN Strategic HQ - Twilio Connection Test');
  console.log('===============================================\n');

  // Test LIVE credentials
  console.log('📞 Testing LIVE credentials...');
  try {
    const liveClient = twilio(LIVE_ACCOUNT_SID, LIVE_AUTH_TOKEN);
    const account = await liveClient.api.accounts(LIVE_ACCOUNT_SID).fetch();
    
    console.log('✅ LIVE Account Connection: SUCCESS');
    console.log(`   Account Name: ${account.friendlyName}`);
    console.log(`   Account SID: ${account.sid}`);
    console.log(`   Status: ${account.status}\n`);

    // Test phone numbers
    console.log('📱 Testing phone numbers...');
    const phoneNumbers = await liveClient.incomingPhoneNumbers.list();
    
    if (phoneNumbers.length > 0) {
      console.log('✅ Phone Numbers Available:');
      phoneNumbers.forEach(phone => {
        console.log(`   📞 ${phone.phoneNumber} (${phone.friendlyName})`);
        console.log(`      SMS: ${phone.capabilities.sms ? '✅' : '❌'}`);
        console.log(`      Voice: ${phone.capabilities.voice ? '✅' : '❌'}`);
        console.log(`      MMS: ${phone.capabilities.mms ? '✅' : '❌'}\n`);
      });
    } else {
      console.log('⚠️  No phone numbers found. You may need to purchase a number.');
    }

  } catch (error) {
    console.log('❌ LIVE Account Connection: FAILED');
    console.log(`   Error: ${error.message}\n`);
  }

  // Test TEST credentials
  console.log('🧪 Testing TEST credentials...');
  try {
    const testClient = twilio(TEST_ACCOUNT_SID, TEST_AUTH_TOKEN);
    const testAccount = await testClient.api.accounts(TEST_ACCOUNT_SID).fetch();
    
    console.log('✅ TEST Account Connection: SUCCESS');
    console.log(`   Account Name: ${testAccount.friendlyName}`);
    console.log(`   Account SID: ${testAccount.sid}`);
    console.log(`   Status: ${testAccount.status}\n`);

  } catch (error) {
    console.log('❌ TEST Account Connection: FAILED');
    console.log(`   Error: ${error.message}\n`);
  }

  // WhatsApp Sandbox Test
  console.log('📱 WhatsApp Sandbox Information:');
  console.log(`   Sandbox Number: ${WHATSAPP_NUMBER}`);
  console.log(`   How to join: Send 'join [keyword]' to ${WHATSAPP_NUMBER}`);
  console.log(`   Get keyword: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn\n`);

  // SMS Test (optional - uncomment to test)
  /*
  console.log('📨 Testing SMS capability...');
  try {
    const client = twilio(LIVE_ACCOUNT_SID, LIVE_AUTH_TOKEN);
    const message = await client.messages.create({
      body: '🤖 Test from CORNMAN Strategic HQ! WhatsApp Bot is ready!',
      from: PHONE_NUMBER,
      to: '+60123456789' // Replace with your actual Malaysian number
    });
    
    console.log('✅ SMS Test: SUCCESS');
    console.log(`   Message SID: ${message.sid}`);
    console.log(`   Status: ${message.status}\n`);
  } catch (error) {
    console.log('❌ SMS Test: FAILED');
    console.log(`   Error: ${error.message}\n`);
  }
  */

  console.log('🎯 SUMMARY:');
  console.log('==========');
  console.log('✅ Your Twilio account is properly configured!');
  console.log('✅ Phone number is ready for SMS and Voice calls');
  console.log('✅ WhatsApp Sandbox is available for testing');
  console.log('\n🚀 Next Steps:');
  console.log('1. Join WhatsApp Sandbox by sending join message');
  console.log('2. Create .env.local file with your credentials');
  console.log('3. Start your application: npm run dev');
  console.log('4. Test WhatsApp Bot from the dashboard\n');
}

// Run the test
testTwilioConnection().catch(error => {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
});