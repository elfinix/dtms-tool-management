# 🚀 Local Development Setup Guide

## DPR Tool Management System (DTMS) - React.js Setup

This guide will help you set up and run the DTMS React application on your local machine.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your computer:

### Required Software:

1. **Node.js** (v18 or higher recommended)
   - Download from: https://nodejs.org/
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **Git** (optional, for version control)
   - Download from: https://git-scm.com/
   - Verify installation:
     ```bash
     git --version
     ```

3. **Code Editor** (recommended)
   - Visual Studio Code: https://code.visualstudio.com/
   - Or any text editor of your choice

---

## 🛠️ Installation Steps

### Step 1: Download the Project

**Option A: If you have the project files**
1. Extract the project folder to your desired location
2. Open terminal/command prompt
3. Navigate to the project folder:
   ```bash
   cd path/to/dtms-project
   ```

**Option B: If using Git**
```bash
git clone <repository-url>
cd dtms-project
```

### Step 2: Create package.json (if not exists)

If you don't have a `package.json` file, create one in the project root:

```json
{
  "name": "dtms-tool-management",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.461.0",
    "recharts": "^2.12.7",
    "sonner": "^1.7.1",
    "qrcode": "^1.5.4",
    "html5-qrcode": "^2.3.8",
    "@radix-ui/react-accordion": "^1.2.2",
    "@radix-ui/react-alert-dialog": "^1.1.4",
    "@radix-ui/react-aspect-ratio": "^1.1.1",
    "@radix-ui/react-avatar": "^1.1.2",
    "@radix-ui/react-checkbox": "^1.1.3",
    "@radix-ui/react-collapsible": "^1.1.2",
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-dropdown-menu": "^2.1.4",
    "@radix-ui/react-hover-card": "^1.1.4",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-menubar": "^1.1.4",
    "@radix-ui/react-navigation-menu": "^1.2.3",
    "@radix-ui/react-popover": "^1.1.4",
    "@radix-ui/react-progress": "^1.1.1",
    "@radix-ui/react-radio-group": "^1.2.2",
    "@radix-ui/react-scroll-area": "^1.2.2",
    "@radix-ui/react-select": "^2.1.4",
    "@radix-ui/react-separator": "^1.1.1",
    "@radix-ui/react-slider": "^1.2.2",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-switch": "^1.1.2",
    "@radix-ui/react-tabs": "^1.1.2",
    "@radix-ui/react-toast": "^1.2.4",
    "@radix-ui/react-toggle": "^1.1.1",
    "@radix-ui/react-toggle-group": "^1.1.1",
    "@radix-ui/react-tooltip": "^1.1.6",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "react-day-picker": "^8.10.1",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.5.2",
    "react-resizable-panels": "^2.1.7",
    "vaul": "^1.1.3",
    "cmdk": "^1.0.4",
    "input-otp": "^1.4.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@types/node": "^22.10.2",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.2",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.7",
    "@typescript-eslint/eslint-plugin": "^7.13.1",
    "@typescript-eslint/parser": "^7.13.1"
  }
}
```

### Step 3: Create vite.config.ts

Create a `vite.config.ts` file in the project root:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

### Step 4: Create tsconfig.json

Create a `tsconfig.json` file in the project root:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Step 5: Create tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### Step 6: Create index.html

Create an `index.html` file in the project root:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DTMS - DPR Tool Management System</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
```

### Step 7: Create main.tsx

Create a `main.tsx` file in the project root:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### Step 8: Install Dependencies

Open your terminal in the project root and run:

```bash
npm install
```

This will:
- Read the `package.json` file
- Download all required dependencies
- Create a `node_modules` folder
- Generate a `package-lock.json` file

**Wait for installation to complete** (may take 2-5 minutes depending on internet speed)

---

## ▶️ Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

You should see output like:
```
  VITE v5.4.2  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Open your browser** and navigate to: `http://localhost:5173/`

The app will automatically reload when you make changes to the code! ✨

### Production Build

To create a production-ready build:

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

To preview the production build locally:

```bash
npm run preview
```

---

## 📁 Project Structure

```
dtms-project/
├── components/          # React components
│   ├── AdminDashboard.tsx
│   ├── InstructorDashboard.tsx
│   ├── LandingPage.tsx
│   └── ui/             # Reusable UI components
├── styles/
│   └── globals.css     # Global styles & Tailwind
├── App.tsx             # Main app component
├── main.tsx            # App entry point
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.ts      # Vite configuration
└── tsconfig.json       # TypeScript configuration
```

---

## 🔧 Common Issues & Solutions

### Issue 1: "npm: command not found"

**Solution:** Install Node.js from https://nodejs.org/

### Issue 2: "Port 5173 is already in use"

**Solution:** Kill the process or use a different port:
```bash
npm run dev -- --port 3000
```

### Issue 3: Module not found errors

**Solution:** Delete and reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: TypeScript errors

**Solution:** Make sure all `.tsx` files have proper imports and types

### Issue 5: Tailwind styles not loading

**Solution:** 
1. Check that `globals.css` is imported in `main.tsx`
2. Verify `@tailwindcss/vite` is in devDependencies
3. Restart dev server

---

## 🎨 Customization

### Changing Port

Edit `package.json` scripts:
```json
"dev": "vite --port 3000"
```

### Changing App Title

Edit `index.html`:
```html
<title>Your Custom Title</title>
```

### Modifying Styles

Edit `styles/globals.css` to change:
- Colors (`:root` variables)
- Typography
- Default theme

---

## 📦 Deployment Options

### 1. **Vercel** (Recommended)
- Create account at https://vercel.com
- Connect your Git repository
- Deploy automatically

### 2. **Netlify**
- Sign up at https://netlify.com
- Drag & drop `dist` folder
- Or connect Git repository

### 3. **GitHub Pages**
```bash
npm install gh-pages --save-dev
```

Add to `package.json`:
```json
"homepage": "https://yourusername.github.io/dtms",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

Deploy:
```bash
npm run deploy
```

---

## 🔍 Development Tips

### 1. **Hot Module Replacement (HMR)**
- Vite supports instant updates without page refresh
- Save files to see changes immediately

### 2. **Browser DevTools**
- Press F12 to open developer tools
- Check Console for errors
- Use React DevTools extension

### 3. **Code Editor Extensions** (VS Code)
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier

### 4. **Useful Commands**
```bash
# Clear cache and reinstall
npm cache clean --force
npm install

# Update all dependencies
npm update

# Check for outdated packages
npm outdated

# Run linter
npm run lint
```

---

## 📚 Additional Resources

- **React Docs:** https://react.dev/
- **Vite Docs:** https://vitejs.dev/
- **Tailwind CSS:** https://tailwindcss.com/
- **TypeScript:** https://www.typescriptlang.org/
- **Radix UI:** https://www.radix-ui.com/

---

## ✅ Quick Start Checklist

- [ ] Node.js installed (v18+)
- [ ] Project files downloaded
- [ ] Configuration files created (package.json, vite.config.ts, etc.)
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] Browser opened to http://localhost:5173/
- [ ] App loads successfully

---

## 🆘 Getting Help

If you encounter issues:

1. **Check the terminal** for error messages
2. **Check browser console** (F12 → Console tab)
3. **Read error messages carefully** - they usually tell you what's wrong
4. **Search the error** on Google or Stack Overflow
5. **Delete node_modules** and reinstall if weird errors persist

---

## 📝 Notes

- **Development Mode:** Files are not optimized, includes debugging tools
- **Production Mode:** Files are minified and optimized for performance
- **Hot Reload:** Changes appear instantly without refresh in dev mode
- **TypeScript:** Provides type safety and better IDE support

---

**Happy Coding! 🚀**

**DPR Tool Management System (DTMS)**  
Version 1.0.0 | Last Updated: October 18, 2025
