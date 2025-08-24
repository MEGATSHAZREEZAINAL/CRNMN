@echo off
echo 🚀 Starting Twilio Server with credentials...

set TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID
set TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN
set TWILIO_WHATSAPP_NUMBER=+14155238886

echo ✅ Environment variables set
echo 📱 Account SID: %TWILIO_ACCOUNT_SID%
echo 📞 WhatsApp Number: %TWILIO_WHATSAPP_NUMBER%

node twilio-real-server.js
