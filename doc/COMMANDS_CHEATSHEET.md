# 💻 Terminal Commands Cheat Sheet

## Essential Commands for DTMS Project

---

## 🚀 Getting Started

### Navigate to Project

```bash
# Windows
cd C:\Users\YourName\dtms-project

# Mac/Linux
cd ~/Documents/dtms-project
```

### Check if Node.js is Installed

```bash
node --version
# Should show: v18.x.x or higher

npm --version
# Should show: 9.x.x or higher
```

---

## 📦 Installation

### First Time Setup

```bash
# Install all dependencies
npm install

# This will take 2-5 minutes
# Downloads all required packages to node_modules/
```

### Clean Install (if having issues)

```bash
# Windows PowerShell
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install

# Mac/Linux/Git Bash
rm -rf node_modules package-lock.json
npm install
```

---

## ▶️ Running the App

### Start Development Server

```bash
npm run dev

# Starts server at http://localhost:5173/
# Press Ctrl+C to stop
```

### Start on Different Port

```bash
npm run dev -- --port 3000
# Will use port 3000 instead of 5173
```

### Open Browser Automatically

```bash
# Already configured in vite.config.ts
# Browser opens automatically when you run npm run dev
```

---

## 🏗️ Building

### Create Production Build

```bash
npm run build

# Creates optimized files in dist/ folder
# Takes ~30 seconds
```

### Preview Production Build

```bash
npm run preview

# Runs production build locally
# Opens at http://localhost:4173/
```

---

## 🧹 Cleanup

### Clear npm Cache

```bash
npm cache clean --force
```

### Delete Generated Folders

```bash
# Windows PowerShell
Remove-Item -Recurse -Force dist, node_modules

# Mac/Linux/Git Bash
rm -rf dist node_modules
```

### Start Fresh

```bash
# Delete everything and reinstall
rm -rf node_modules package-lock.json dist
npm cache clean --force
npm install
```

---

## 🔍 Debugging

### Check for Errors

```bash
# Run linter
npm run lint

# TypeScript type checking is done automatically
```

### Verbose Output

```bash
# See detailed installation logs
npm install --verbose

# See what's happening during build
npm run build --verbose
```

### Check Outdated Packages

```bash
npm outdated
```

### Update Packages

```bash
# Update all packages to latest within version range
npm update

# Update specific package
npm update react
```

---

## 📁 File Operations

### List Files

```bash
# Windows
dir

# Mac/Linux
ls -la
```

### Show Current Directory

```bash
# Windows
cd

# Mac/Linux
pwd
```

### Create File

```bash
# Windows
type nul > filename.txt

# Mac/Linux
touch filename.txt
```

### View File Content

```bash
# Windows
type package.json

# Mac/Linux
cat package.json
```

---

## 🌐 Git Commands (Optional)

### Initialize Git

```bash
git init
```

### Check Status

```bash
git status
```

### Add Files

```bash
# Add all files
git add .

# Add specific file
git add App.tsx
```

### Commit Changes

```bash
git commit -m "Your commit message"
```

### Create Branch

```bash
git checkout -b feature-name
```

### Switch Branch

```bash
git checkout main
```

### Push to Remote

```bash
git push origin main
```

---

## 🎯 Package Management

### Install New Package

```bash
# Install and save to dependencies
npm install package-name

# Install as dev dependency
npm install --save-dev package-name

# Install specific version
npm install package-name
```

### Uninstall Package

```bash
npm uninstall package-name
```

### List Installed Packages

```bash
# All packages
npm list

# Top-level only
npm list --depth=0
```

---

## 🔧 Useful Shortcuts

### Terminal Shortcuts

**Windows:**

-   `Ctrl + C` - Stop running process
-   `Ctrl + L` - Clear screen
-   `↑` / `↓` - Previous/next command
-   `Tab` - Auto-complete

**Mac/Linux:**

-   `Cmd/Ctrl + C` - Stop running process
-   `Cmd/Ctrl + K` - Clear screen
-   `↑` / `↓` - Previous/next command
-   `Tab` - Auto-complete

---

## 📋 Common Workflows

### Daily Development

```bash
# 1. Navigate to project
cd dtms-project

# 2. Pull latest changes (if using Git)
git pull

# 3. Install any new dependencies
npm install

# 4. Start dev server
npm run dev

# 5. Make changes, save files (auto-reload)

# 6. Stop server when done
# Press Ctrl+C
```

### Deploying Update

```bash
# 1. Test locally
npm run dev

# 2. Build production version
npm run build

# 3. Test production build
npm run preview

# 4. Deploy (example: Vercel)
vercel deploy
```

### Fixing Issues

```bash
# 1. Stop server (Ctrl+C)

# 2. Clean install
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# 3. Restart server
npm run dev
```

---

## 🆘 Emergency Commands

### App Won't Start

```bash
# Full reset
rm -rf node_modules package-lock.json dist .vite
npm cache clean --force
npm install
npm run dev
```

### Port in Use

```bash
# Windows - Find process using port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux - Find and kill process
lsof -ti:5173 | xargs kill -9
```

### Permission Errors (Mac/Linux)

```bash
# Fix permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) ./
```

---

## 📊 Monitoring

### Watch File Changes

```bash
# Dev server does this automatically
# Look for "HMR update" in terminal
```

### Check Build Size

```bash
npm run build

# Look for output:
# dist/index.html              X kB
# dist/assets/index-XXX.js     X kB
```

### Network Access

```bash
# See the app on other devices on same network
npm run dev -- --host

# Will show:
# Network: http://192.168.X.X:5173/
```

---

## 🎨 Development Tools

### Open in Browser

```bash
# Windows
start http://localhost:5173

# Mac
open http://localhost:5173

# Linux
xdg-open http://localhost:5173
```

### Open in VS Code

```bash
code .
```

### Open Terminal in VS Code

```bash
# Already in VS Code: Ctrl+` (backtick)
```

---

## 📝 Package.json Scripts Explained

```json
"scripts": {
  "dev": "vite",              // Start dev server
  "build": "tsc && vite build", // Build for production
  "preview": "vite preview",   // Preview production build
  "lint": "eslint ..."         // Check code quality
}
```

### Running Scripts

```bash
npm run <script-name>

# Examples:
npm run dev
npm run build
npm run preview
npm run lint
```

---

## 🔐 Environment Variables

### Create .env File

```bash
# Windows
type nul > .env

# Mac/Linux
touch .env
```

### Edit .env

```bash
# Add variables (no spaces around =)
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=DTMS
```

### Access in Code

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 💡 Pro Tips

### 1. Use Terminal History

```bash
# Press ↑ arrow to see previous commands
# No need to retype common commands!
```

### 2. Tab Completion

```bash
# Type first few letters and press Tab
npm run d[Tab]  # Completes to "npm run dev"
```

### 3. Stop Server Quickly

```bash
# Ctrl+C works in all terminals
# Don't close terminal window - just stop the process
```

### 4. Multiple Terminals

```bash
# Open multiple terminal tabs:
# - One for dev server
# - One for git commands
# - One for testing
```

### 5. Clear Terminal

```bash
# Windows: cls
# Mac/Linux: clear
# Or Ctrl+L / Cmd+K
```

---

## 🎓 Learning More

### Help Commands

```bash
# npm help
npm help

# Specific command help
npm help install

# Vite help
npm run dev -- --help
```

### Documentation

-   npm: https://docs.npmjs.com/
-   Vite: https://vitejs.dev/guide/
-   Node.js: https://nodejs.org/docs/

---

## ✅ Quick Reference

| Task          | Command               |
| ------------- | --------------------- |
| Install       | `npm install`         |
| Start Dev     | `npm run dev`         |
| Stop          | `Ctrl+C`              |
| Build         | `npm run build`       |
| Clean         | `rm -rf node_modules` |
| Update        | `npm update`          |
| Check Version | `npm --version`       |

---

**Save this file for quick reference!** 📌

**Need more help?** Check [LOCAL_SETUP_GUIDE.md](LOCAL_SETUP_GUIDE.md)
