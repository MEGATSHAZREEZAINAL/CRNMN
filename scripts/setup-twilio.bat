@echo off
echo 🚀 CORNMAN Strategic HQ - Twilio Setup
echo =====================================
echo.

echo 💡 To send REAL WhatsApp messages, you need Twilio credentials:
echo.
echo 1. Go to https://console.twilio.com
echo 2. Get your Account SID and Auth Token
echo 3. Set up WhatsApp Sandbox: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
echo.

echo 📱 QUICK SETUP for WhatsApp Sandbox:
echo.
echo 1. In Twilio Console, go to Messaging ^> Try it out ^> Send a WhatsApp message
echo 2. Follow the instructions to join the sandbox
echo 3. Send "join [sandbox-keyword]" to +1 415 523 8886
echo.

echo 🔧 Then set these environment variables:
echo.
echo set TWILIO_ACCOUNT_SID=your_account_sid_here
echo set TWILIO_AUTH_TOKEN=your_auth_token_here
echo set TWILIO_WHATSAPP_NUMBER=+14155238886
echo set TWILIO_SMS_NUMBER=your_twilio_phone_number
echo.

echo 🚀 Then restart the server:
echo node twilio-real-server.js
echo.

pause
