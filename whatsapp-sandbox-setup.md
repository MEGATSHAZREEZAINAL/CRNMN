# 📱 WhatsApp Sandbox Setup Guide

## Error: "Could not find a Channel with the specified From address"

**Reason:** Ko belum join Twilio WhatsApp Sandbox yet!

## 🚀 Quick Fix (2 minutes):

### Step 1: Join Sandbox

1. **Open WhatsApp** on your phone
2. **Send this message**: `join <keyword>`
3. **To this number**: `+1 415 523 8886`
4. **Wait for confirmation** from Twilio

### Step 2: Get Your Sandbox Keyword

1. Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. Login with your Twilio account
3. **Copy the JOIN CODE** (something like "join gray-cloud")

### Step 3: Join via WhatsApp

1. Send WhatsApp message: `join gray-cloud` (use your actual keyword)
2. To: `+1 415 523 8886`
3. You'll get confirmation: "You are now subscribed to the sandbox"

### Step 4: Test Your Number

1. Your phone number is now authorized
2. Restart Twilio server:
   ```bash
   # Stop current server (Ctrl+C)
   # Restart with:
   $env:TWILIO_ACCOUNT_SID="YOUR_TWILIO_ACCOUNT_SID"
   $env:TWILIO_AUTH_TOKEN="YOUR_TWILIO_AUTH_TOKEN"
   $env:TWILIO_WHATSAPP_NUMBER="+14155238886"
   node twilio-real-server.js
   ```

### Step 5: Send Real Message

1. Use format: `+60123456789` (your Malaysian number)
2. Dashboard will send to: `whatsapp:+60123456789`
3. **Message akan sampai WhatsApp ko!** 🎉

## 💡 Pro Tips:

- Only your authorized number can receive messages
- Sandbox free for testing
- For production, need approved WhatsApp Business account

## 🔧 Alternative Test:

Try sending to the sandbox number itself: `+14155238886`
