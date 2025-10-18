# ✅ Setup Checklist

## Pre-Installation

- [ ] **Node.js installed** (v18 or higher)
  - Check: Open terminal and run `node --version`
  - Should show: `v18.x.x` or higher
  - If not: Download from https://nodejs.org/

- [ ] **npm installed** (comes with Node.js)
  - Check: Run `npm --version`
  - Should show: `9.x.x` or higher

- [ ] **Terminal/Command Prompt** ready
  - Windows: PowerShell, CMD, or Git Bash
  - Mac: Terminal
  - Linux: Terminal

- [ ] **Code Editor** installed (optional but recommended)
  - VS Code, Sublime Text, or any editor you prefer

---

## Installation Steps

- [ ] **Navigate to project folder**
  ```bash
  cd /path/to/dtms-project
  ```

- [ ] **Verify all config files exist:**
  - [ ] `package.json` ✓
  - [ ] `vite.config.ts` ✓
  - [ ] `tsconfig.json` ✓
  - [ ] `index.html` ✓
  - [ ] `main.tsx` ✓

- [ ] **Install dependencies**
  ```bash
  npm install
  ```
  - Wait for "added XXX packages" message
  - Should complete without errors

- [ ] **Check for errors**
  - Red text = problem
  - Yellow warnings = usually okay
  - Look for `node_modules` folder created

---

## Running the App

- [ ] **Start development server**
  ```bash
  npm run dev
  ```

- [ ] **Check terminal output**
  - Should see: `VITE v5.4.2 ready in XXX ms`
  - Should see: `Local: http://localhost:5173/`
  - No red errors

- [ ] **Open browser**
  - Go to: `http://localhost:5173/`
  - OR click the link in terminal (Ctrl+Click)

- [ ] **Verify app loads**
  - See DTMS landing page
  - See "Access Dashboard" button
  - See "Scan Tool QR Code" button
  - No errors in browser console (F12)

---

## Testing Features

- [ ] **Landing Page Works**
  - Click "Access Dashboard" → Goes to login
  - Click "Scan Tool QR Code" → Goes to QR scanner
  - Back button works

- [ ] **Login Page Works**
  - Form appears
  - Can type in fields
  - (Note: Mock login - any credentials work for testing)

- [ ] **Admin Dashboard** (after login)
  - Sidebar navigation works
  - Dashboard tab shows stats
  - Users tab shows user table
  - Transactions tab shows data
  - Reports tab loads
  - Settings tab works

- [ ] **Instructor Dashboard**
  - Tool inventory visible
  - Can generate QR codes
  - Tabs switch properly

- [ ] **QR Scanner**
  - Page loads
  - Camera permission requested (if on device)

---

## Common Issues - Quick Fixes

### ❌ "npm: command not found"
- [ ] Install Node.js
- [ ] Restart terminal
- [ ] Verify with `node --version`

### ❌ "Cannot find module"
- [ ] Delete `node_modules` folder
- [ ] Run `npm install` again

### ❌ "Port already in use"
- [ ] Close other dev servers
- [ ] OR use different port: `npm run dev -- --port 3000`

### ❌ Blank white screen
- [ ] Check browser console (F12)
- [ ] Check terminal for errors
- [ ] Restart dev server (Ctrl+C, then `npm run dev`)

### ❌ Styles not loading
- [ ] Verify `globals.css` exists in `styles/` folder
- [ ] Check `main.tsx` imports it
- [ ] Restart dev server

### ❌ TypeScript errors
- [ ] Check `tsconfig.json` exists
- [ ] Run `npm install` again
- [ ] Restart VS Code (if using it)

---

## Production Build (Optional)

- [ ] **Create production build**
  ```bash
  npm run build
  ```

- [ ] **Check build output**
  - `dist` folder created
  - No errors during build
  - See success message

- [ ] **Test production build**
  ```bash
  npm run preview
  ```
  - Opens preview server
  - App works correctly

---

## Deployment Ready (Optional)

- [ ] **Choose deployment platform:**
  - [ ] Vercel (recommended)
  - [ ] Netlify
  - [ ] GitHub Pages
  - [ ] Other hosting

- [ ] **Prepare for deployment:**
  - [ ] Run `npm run build` successfully
  - [ ] Test production build locally
  - [ ] Update any environment variables
  - [ ] Check all features work

---

## File Structure Verification

Ensure these files/folders exist:

```
✅ Project Root
  ├── ✅ components/
  │   ├── ✅ AdminDashboard.tsx
  │   ├── ✅ InstructorDashboard.tsx
  │   ├── ✅ LandingPage.tsx
  │   ├── ✅ LoginPage.tsx
  │   ├── ✅ AppContext.tsx
  │   └── ✅ ui/ (shadcn components)
  ├── ✅ styles/
  │   └── ✅ globals.css
  ├── ✅ App.tsx
  ├── ✅ main.tsx
  ├── ✅ index.html
  ├── ✅ package.json
  ├── ✅ vite.config.ts
  ├── ✅ tsconfig.json
  └── ✅ tsconfig.node.json
```

---

## Success Indicators

### ✅ Installation Successful
- `node_modules` folder exists
- `package-lock.json` created
- No red errors in terminal

### ✅ Dev Server Running
- Terminal shows "ready in XXX ms"
- Can access `http://localhost:5173/`
- Page loads without errors

### ✅ App Working
- Landing page displays correctly
- Navigation works
- All dashboards load
- No console errors (F12)

---

## Next Steps After Setup

1. **Explore the app** - Try all features
2. **Read documentation** - Check README.md
3. **Customize** - Modify styles, add features
4. **Deploy** - Share with users

---

## Need Help?

- 📖 **Full Guide:** `LOCAL_SETUP_GUIDE.md`
- ⚡ **Quick Start:** `QUICK_START.md`
- 🔧 **Admin Features:** `ADMIN_FEATURES_UPDATE.md`
- 📝 **Main README:** `README.md`

---

## Support Resources

- **Node.js Issues:** https://nodejs.org/en/docs/
- **React Docs:** https://react.dev/
- **Vite Docs:** https://vitejs.dev/
- **Tailwind CSS:** https://tailwindcss.com/
- **Stack Overflow:** Search your error message

---

**Setup Status:** 
- [ ] Not Started
- [ ] In Progress
- [ ] Complete ✅

**Last Checked:** _______________

**Notes:** 
_____________________________________________
_____________________________________________
_____________________________________________
