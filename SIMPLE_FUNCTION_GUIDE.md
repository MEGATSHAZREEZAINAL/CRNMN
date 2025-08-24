# 🌽 CORNMAN - SIMPLE FUNCTION GUIDE

## 🎯 **APA ITU FUNCTION?**

Function = **Kod yang buat kerja tertentu**

Macam dalam kehidupan:
- `masak()` = Function untuk masak nasi
- `drive()` = Function untuk drive kereta
- `count()` = Function untuk kira duit

## 📱 **FUNCTIONS DALAM CORNMAN APP**

### **1. 🏠 RUMAH (Main App)**
```
App() = Rumah utama yang contain semua
```

### **2. 🔐 SECURITY (Authentication)**
```
useAuth() = Check siapa yang login
signIn() = Masuk ke app
signOut() = Keluar dari app
```

### **3. 🎨 UI (Yang nampak kat screen)**
```
Card() = Kotak untuk display info
Button() = Butang untuk click
Input() = Tempat type text
```

### **4. 💰 BUSINESS (Jual beli)**
```
getSales() = Ambil data jualan
getInventory() = Check stock barang
getCustomers() = List customer
```

### **5. 📱 WHATSAPP**
```
sendMessage() = Hantar WhatsApp
startBot() = Start WhatsApp bot
```

---

## 🎮 **MACAM MANA NAK GUNA?**

### **Contoh 1: Display Sales**
```javascript
// 1. Ambil data sales
const sales = getSales()

// 2. Display dalam Card
<Card>
  <h3>Jualan Hari Ni</h3>
  <p>RM {sales.today}</p>
</Card>
```

### **Contoh 2: Hantar WhatsApp**
```javascript
// 1. Call function hantar message
sendMessage({
  to: "+60123456789",
  text: "Order anda ready!"
})
```

### **Contoh 3: Check User Login**
```javascript
// 1. Check user
const { user } = useAuth()

// 2. Show different thing based on user
if (user) {
  return <Dashboard />  // Show dashboard
} else {
  return <LoginForm />  // Show login
}
```

---

## 🚦 **STATUS: MANA YANG WORKING?**

### **✅ WORKING (Boleh guna)**
- `Card()` - Display kotak ✅
- `Button()` - Butang click ✅
- `Input()` - Type text ✅
- `useAuth()` - Check login ✅ (demo mode)

### **🟡 SOMETIMES WORKING**
- `getSales()` - Ambil sales data 🟡
- `sendMessage()` - WhatsApp 🟡 (need server)

### **❌ BROKEN (Tak boleh guna)**
- `Firebase stuff` - Database ❌
- `AI functions` - Generate content ❌

---

## 💡 **SIMPLE PLAN:**

### **Step 1: Guna Yang Working**
- Build UI dengan Card, Button, Input
- Show mock data (fake data)
- Make it look nice

### **Step 2: Add Simple Logic**
- Calculate sales total
- Count inventory
- Basic math functions

### **Step 3: Try Complex Stuff**
- Connect database
- WhatsApp integration
- AI features

---

## 🌽 **REAL EXAMPLE: Sales Card**

```javascript
// Function untuk display sales today
function SalesTodayCard() {
  // 1. Calculate sales (simple math)
  const todaySales = 1250  // RM
  
  // 2. Display dalam card
  return (
    <Card variant="brand">
      <h3>💰 Sales Hari Ni</h3>
      <p className="text-2xl">RM {todaySales}</p>
      <Button>View Details</Button>
    </Card>
  )
}
```

## 🎯 **BOTTOM LINE:**

**Function = Kerja khas yang app boleh buat**

- Ada 150+ functions dalam app ni
- 60+ functions WORKING ✅
- 30+ functions KADANG-KADANG ✅
- 20+ functions BROKEN ❌

**Strategy: Guna yang WORKING dulu, then slowly add complex stuff!**

---

## 🤔 **STILL CONFUSED?**

**Think like this:**
- Function = **Recipe** 
- You give **ingredients** (parameters)
- Function **cook** and give you **food** (result)

**Example:**
```
makeCoffee(sugar=2, milk=yes) → "Hot coffee with 2 sugar and milk"
```

**In app:**
```
calculateSales(today) → "RM 1,250"
```

**🌽 Make sense now?**
