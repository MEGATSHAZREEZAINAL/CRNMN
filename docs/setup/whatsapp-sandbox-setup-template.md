# 📱 WhatsApp Sandbox Setup Guide - CORNMAN Strategic HQ

## 🔑 YOUR TWILIO CREDENTIALS (READY!)

### **TEST CREDENTIALS (Sandbox)**
- **Account SID:** `your-test-account-sid-here`
- **Auth Token:** `your-test-auth-token-here`
- **WhatsApp Number:** `+14155238886` (Sandbox)

### **LIVE CREDENTIALS (Production)**
- **Account SID:** `your-live-account-sid-here`
- **Auth Token:** `your-live-auth-token-here`
- **API Key SID:** `your-api-key-sid-here`
- **Phone Number:** `+15642444656` (SMS & Voice)
- **WhatsApp Number:** `+14155238886` (Sandbox)

## 🚀 SETUP STEPS (5 minutes):

### Step 1: Join Sandbox

1. **Open WhatsApp** on your phone
2. **Send this message**: `join adventure-feature`
3. **To this number**: `+1 415 523 8886`
4. **Wait for confirmation** from Twilio

### Step 2: Get Your Sandbox Keyword

1. Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. Login with your Twilio account
3. **Copy the JOIN CODE** (something like "join gray-cloud")

### Step 3: Join via WhatsApp

1. Send WhatsApp message: `join adventure-feature`
2. To: `+1 415 523 8886`
3. You'll get confirmation: "You are now subscribed to the sandbox"

### Step 4: Configure Environment Variables

1. **Create `.env.local` file** in your project root:
   ```bash
   # Copy template
   cp env.example .env.local
   ```

2. **Add your credentials** to `.env.local`:
   ```env
   # Environment Configuration
   VITE_TWILIO_ENVIRONMENT=test

   # TEST Environment (Sandbox)
   VITE_TWILIO_TEST_ACCOUNT_SID=your-test-account-sid-here
   VITE_TWILIO_TEST_AUTH_TOKEN=your-test-auth-token-here
   VITE_TWILIO_TEST_PHONE_NUMBER=+15642444656
   VITE_TWILIO_WHATSAPP_NUMBER=+14155238886

   # LIVE Environment (Production)
   VITE_TWILIO_LIVE_ACCOUNT_SID=your-live-account-sid-here
   VITE_TWILIO_LIVE_AUTH_TOKEN=your-live-auth-token-here
   VITE_TWILIO_LIVE_PHONE_NUMBER=+15642444656
   VITE_TWILIO_LIVE_WHATSAPP_NUMBER=+14155238886

   # Default Configuration
   VITE_TWILIO_ACCOUNT_SID=your-account-sid-here
   VITE_TWILIO_AUTH_TOKEN=your-auth-token-here
   VITE_TWILIO_PHONE_NUMBER=+15642444656
   VITE_TWILIO_API_KEY_SID=your-api-key-sid-here

   # WhatsApp Bot Configuration
   VITE_WHATSAPP_BOT_ENABLED=true
   VITE_WEBHOOK_SECRET=your-webhook-secret-here

   # Optional: Add your other API keys
   VITE_GEMINI_API_KEY=your-gemini-api-key
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-key
   ```

### Step 5: Start the Application

1. **Install dependencies** (if not done):
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Access WhatsApp Dashboard**:
   - Navigate to the Twilio section in your app
   - Click "Start Bot" to initialize WhatsApp connection

### Step 6: Test WhatsApp Bot

1. **Send test message via dashboard**:
   - Use your Malaysian number: `+60123456789`
   - Dashboard will send to: `whatsapp:+60123456789`
   - **Message akan sampai WhatsApp anda!** 🎉

2. **Try business commands**:
   - Send WhatsApp: `help` → Get command list
   - Send WhatsApp: `status jualan` → Get sales data
   - Send WhatsApp: `check stok` → Check inventory
   - Send WhatsApp: `revenue harini` → Today's revenue

## 🎯 BUSINESS COMMANDS AVAILABLE:

| Command | Description |
|---------|-------------|
| `daftar` | Register to use the bot |
| `help` | Show all available commands |
| `status jualan` | Get latest sales status |
| `check stok` | Check inventory levels |
| `stok rendah` | Show low stock alerts |
| `revenue harini` | Get today's revenue |
| `order stok [item]` | Place restock order |

## 💡 Pro Tips:

- ✅ **Sandbox is FREE** for testing
- ✅ **Only authorized numbers** can receive messages
- ✅ **AI-powered responses** dalam Bahasa Melayu
- ✅ **Real-time business data** integration
- ✅ **Anti-ban protection** built-in

## 🚀 NEXT STEPS:

1. **Test all business commands** via WhatsApp
2. **Add your team members** to sandbox
3. **Configure Supabase** for data persistence
4. **Set up webhooks** for incoming messages
5. **Upgrade to production** WhatsApp Business API

## 🔧 TROUBLESHOOTING:

**Issue:** "Could not find a Channel"  
**Fix:** Make sure you joined sandbox: `join [keyword]` to `+14155238886`

**Issue:** Messages not receiving  
**Fix:** Check your phone number is authorized in Twilio Console

**Issue:** Bot not responding  
**Fix:** Verify credentials in `.env.local` and restart app