# ⚡ Quick Start - 3 Simple Steps

## Get DTMS Running in 5 Minutes!

### Prerequisites
- ✅ **Node.js 18+** installed ([Download here](https://nodejs.org/))

---

## 🚀 Setup Steps

### 1️⃣ Open Terminal in Project Folder

**Windows:**
- Right-click in the project folder
- Select "Open in Terminal" or "Git Bash Here"

**Mac/Linux:**
- Open Terminal
- Navigate to project:
  ```bash
  cd /path/to/dtms-project
  ```

---

### 2️⃣ Install Dependencies

Copy and paste this command:

```bash
npm install
```

⏳ **Wait 2-5 minutes** for installation to complete.

You should see:
```
added 500+ packages in 2m
```

---

### 3️⃣ Start the App

```bash
npm run dev
```

You should see:
```
  VITE v5.4.2  ready in 500 ms

  ➜  Local:   http://localhost:5173/
```

🎉 **Open your browser** to: `http://localhost:5173/`

---

## ✅ Success!

You should see the **DTMS Landing Page** with:
- DPR Aviation College branding
- "Access Dashboard" button
- "Scan Tool QR Code" button

---

## 🛑 Troubleshooting

### ❌ "npm: command not found"
**Fix:** Install Node.js from https://nodejs.org/

### ❌ "Port 5173 already in use"
**Fix:** Use different port:
```bash
npm run dev -- --port 3000
```
Then open: `http://localhost:3000/`

### ❌ Installation fails
**Fix:** Clear cache and retry:
```bash
npm cache clean --force
npm install
```

### ❌ Nothing happens
**Fix:** Check terminal for errors (red text)

---

## 🎯 What's Next?

Once the app is running:

1. **Click "Access Dashboard"** to go to login
2. **Use default credentials:**
   - Admin: (mock login, any email/password works)
3. **Explore the dashboards:**
   - Admin Dashboard - User & transaction management
   - Instructor Dashboard - Tool inventory & QR generation
   - QR Scanner - Student tool borrowing

---

## 📝 Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Stop server
Press Ctrl + C in terminal
```

---

## 📚 Need More Help?

- **Full Setup Guide:** See `LOCAL_SETUP_GUIDE.md`
- **System Features:** See `README.md`
- **Admin Features:** See `ADMIN_FEATURES_UPDATE.md`

---

## 🎨 App Features Overview

### 🏠 Landing Page
- Modern, aviation-themed design
- Quick access buttons
- System overview

### 👤 Admin Dashboard
- User management (Add/Edit/Delete)
- Transaction monitoring
- System settings
- Reports generation

### 👨‍🏫 Instructor Dashboard
- Tool inventory management
- QR code generation
- Student transaction tracking
- Tool turnover to admin

### 📱 Student QR Access
- Scan instructor QR codes
- Borrow tools quickly
- No login required

---

**That's it! You're ready to go! 🚀**

If you encounter any issues, check the detailed guide in `LOCAL_SETUP_GUIDE.md`
