# 📱 WhatsApp QR Code - CARA NAK SCAN

## 🔍 **MANA NAK CARI QR CODE?**

### **📍 QR code ada di terminal yang running WhatsApp bot!**

## 🎯 **STEP-BY-STEP:**

### **1. 🔍 Cari Terminal Yang Running Bot**
Dalam Windows Terminal, anda ada **beberapa tabs**:
- **Tab 1**: `npm run dev` (frontend)
- **Tab 2**: `node scripts/wa-bot.mjs` (WhatsApp bot) ← **QR CODE ADA SINI!**

### **2. 📱 Switch ke Bot Terminal**
1. **Click tab** yang ada `node scripts/wa-bot.mjs`
2. **Atau look for terminal** yang show:
   ```
   WA bot server listening on http://0.0.0.0:4001
   ```

### **3. 👀 QR Code Akan Muncul**
Selepas anda trigger `/start`, QR code akan appear macam ini:
```
████ ▄▄▄▄▄ █▀█ █▄▀█▀▄█ ▄▄▄▄▄ ████
████ █   █ ███▄▄▀▀█▀▄▄█ █   █ ████
████ █▄▄▄█ █▀▄█▄▄▄█▄▄██ █▄▄▄█ ████
████▄▄▄▄▄▄▄█▄▀ ▀▄█▄▀ █▄▄▄▄▄▄▄████
████▄▄  █▄▄ ▄▀██▄▄ ▄▄▄ ▀▄▀▄█▄▄████
```

### **4. 📱 Scan Dengan WhatsApp**
1. **Buka WhatsApp** di phone
2. **Settings** → **Linked Devices** 
3. **"Link a Device"**
4. **Scan QR code** dari terminal
5. **Wait for connection**

---

## 🚨 **KALAU QR CODE TAK MUNCUL:**

### **🔧 Try These Steps:**

#### **Option 1: Mobile App Method**
1. **Go to**: http://localhost:5173/
2. **Click**: "📱 Mobile" 
3. **Login**: Any credentials
4. **WhatsApp tab** → **"🚀 Start REAL Bot"**
5. **QR code akan generate** di terminal

#### **Option 2: Manual Trigger**
```bash
curl -X POST http://localhost:4001/start
```

#### **Option 3: Restart Bot**
1. **Close terminal** yang ada bot
2. **Start fresh**:
   ```bash
   node scripts/wa-bot.mjs
   ```
3. **Trigger start** dari mobile app

---

## 📍 **CURRENT STATUS:**

### **✅ Bot Server Status:**
```json
{"ok": true, "starting": true}
```

### **⏳ QR Code Should Appear In:**
**Terminal yang running**: `node scripts/wa-bot.mjs`

---

## 🎯 **SEKARANG NAK BUAT APA:**

1. **🔍 Check terminal** yang ada bot running
2. **👀 Look for QR code** (ASCII art format)
3. **📱 Scan dengan WhatsApp** (Settings → Linked Devices)
4. **⏳ Wait for connection** 
5. **✅ Status jadi "connected"**

### **📱 Lepas connect, boleh:**
- **Send real WhatsApp messages** dari mobile app
- **Test auto-reply** dengan hantar "help" ke bot
- **Use for business** customer service

---

## 🌽 **BOTTOM LINE:**

**QR code ada di terminal yang running WhatsApp bot!**

**Look for terminal dengan**: `WA bot server listening on http://0.0.0.0:4001`

**QR code akan appear** after you trigger start dari mobile app atau manual command.

**📱 Go check terminal sekarang!** 🤖
