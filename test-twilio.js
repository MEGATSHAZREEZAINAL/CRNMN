import { twilioService } from './services/twilioService.ts';

async function testTwilio() {
  try {
    console.log('🧪 Testing Twilio Service...');

    // Initialize with live credentials
    const initialized = await twilioService.initializeLive();
    console.log('Initialization:', initialized ? '✅ Success' : '❌ Failed');

    if (initialized) {
      // Test sending a WhatsApp message
      console.log('\n📱 Testing WhatsApp message...');
      const result = await twilioService.sendWhatsApp(
        '+601168444656',
        'Hello from Strategic HQ! This is a test message from the dashboard.',
      );

      console.log('WhatsApp Result:', result);

      // Test business commands
      console.log('\n💼 Testing business commands...');
      const stockAlert = await twilioService.processBusinessCommand('check stok', '+601168444656');
      console.log('Stock Alert:', stockAlert);

      const revenue = await twilioService.processBusinessCommand('revenue harini', '+601168444656');
      console.log('Revenue:', revenue);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testTwilio();
