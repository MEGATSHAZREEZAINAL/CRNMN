@echo off
echo 🚀 CORNMAN Strategic HQ - Complete WhatsApp Bot Setup
echo =================================================

echo.
echo 📋 Setting up environment variables...

:: Set TEST environment credentials
set VITE_TWILIO_ENVIRONMENT=test
set VITE_TWILIO_TEST_ACCOUNT_SID=your-test-account-sid-here
set VITE_TWILIO_TEST_AUTH_TOKEN=your-test-auth-token-here
set VITE_TWILIO_TEST_PHONE_NUMBER=+15642444656

:: Set LIVE environment credentials  
set VITE_TWILIO_LIVE_ACCOUNT_SID=your-live-account-sid-here
set VITE_TWILIO_LIVE_AUTH_TOKEN=your-live-auth-token-here
set VITE_TWILIO_LIVE_PHONE_NUMBER=+15642444656

:: Set default configuration
set VITE_TWILIO_ACCOUNT_SID=your-account-sid-here
set VITE_TWILIO_AUTH_TOKEN=your-auth-token-here
set VITE_TWILIO_PHONE_NUMBER=+15642444656
set VITE_TWILIO_WHATSAPP_NUMBER=+14155238886
set VITE_TWILIO_API_KEY_SID=your-api-key-sid-here

:: WhatsApp Bot configuration
set VITE_WHATSAPP_BOT_ENABLED=true
set VITE_WEBHOOK_SECRET=your-webhook-secret-here

echo ✅ Environment variables configured!
echo.

echo 📱 Your Twilio Configuration:
echo TEST Account SID: %VITE_TWILIO_TEST_ACCOUNT_SID%
echo LIVE Account SID: %VITE_TWILIO_LIVE_ACCOUNT_SID%
echo Phone Number: %VITE_TWILIO_PHONE_NUMBER%
echo WhatsApp Number: %VITE_TWILIO_WHATSAPP_NUMBER%
echo.

echo 🎯 NEXT STEPS:
echo 1. Join WhatsApp Sandbox:
echo    - Send 'join [keyword]' to +14155238886
echo    - Get keyword from: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
echo.
echo 2. Start the application:
echo    npm run dev
echo.
echo 3. Test WhatsApp Bot:
echo    - Access Twilio Dashboard in your app
echo    - Send test messages to your phone
echo    - Try business commands like 'help', 'status jualan'
echo.

echo 🚀 Starting development server...
npm run dev

pause