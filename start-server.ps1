# PowerShell script to start Twilio server with all credentials set
Write-Host "🚀 Starting CORNMAN Twilio Server..." -ForegroundColor Green

# Set all environment variables
$env:TWILIO_ACCOUNT_SID = "YOUR_TWILIO_ACCOUNT_SID"
$env:TWILIO_AUTH_TOKEN = "YOUR_TWILIO_AUTH_TOKEN"
$env:TWILIO_WHATSAPP_NUMBER = "+14155238886"
$env:TWILIO_SMS_NUMBER = ""

Write-Host "✅ Environment variables set:" -ForegroundColor Yellow
Write-Host "   TWILIO_ACCOUNT_SID: $env:TWILIO_ACCOUNT_SID" -ForegroundColor Cyan
Write-Host "   TWILIO_WHATSAPP_NUMBER: $env:TWILIO_WHATSAPP_NUMBER" -ForegroundColor Cyan

Write-Host "🎯 Starting server..." -ForegroundColor Green
node twilio-real-server.js
