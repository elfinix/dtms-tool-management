# 📁 Project Structure Guide

## Understanding the DTMS File Organization

---

## 🌳 Complete File Tree

```
dtms-project/
│
├── 📄 Configuration Files (Root Level)
│   ├── package.json           # Dependencies & scripts
│   ├── package-lock.json      # Locked dependency versions
│   ├── vite.config.ts         # Vite build configuration
│   ├── tsconfig.json          # TypeScript config
│   ├── tsconfig.node.json     # TypeScript for Node files
│   ├── index.html             # HTML entry point
│   ├── main.tsx               # React app entry point
│   └── .gitignore             # Git ignore rules
│
├── 📱 App.tsx                 # Main application component
│
├── 📂 components/             # All React components
│   ├── AdminDashboard.tsx     # Admin panel
│   ├── InstructorDashboard.tsx # Instructor panel
│   ├── LandingPage.tsx        # Home page
│   ├── LoginPage.tsx          # Login screen
│   ├── StudentQRAccess.tsx    # QR scanner
│   ├── ReportsPage.tsx        # Reports page
│   ├── AdminReportsTab.tsx    # Admin reports
│   ├── AppContext.tsx         # Global state management
│   │
│   ├── 📂 ui/                 # Reusable UI components (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── ... (40+ components)
│   │
│   └── 📂 figma/              # Figma-specific utilities
│       └── ImageWithFallback.tsx
│
├── 📂 styles/                 # Styling files
│   └── globals.css            # Global styles & Tailwind config
│
├── 📂 .vscode/                # VS Code settings
│   └── extensions.json        # Recommended extensions
│
├── 📂 guidelines/             # Development guidelines
│   └── Guidelines.md
│
├── 📚 Documentation Files
│   ├── README.md              # Main project documentation
│   ├── QUICK_START.md         # Quick setup guide
│   ├── LOCAL_SETUP_GUIDE.md   # Detailed setup instructions
│   ├── SETUP_CHECKLIST.md     # Setup progress tracker
│   ├── COMMANDS_CHEATSHEET.md # Terminal commands reference
│   ├── PROJECT_STRUCTURE.md   # This file
│   ├── ADMIN_FEATURES_UPDATE.md # Admin features documentation
│   └── Attributions.md        # Credits & licenses
│
└── 📂 Generated Folders (created by npm/vite)
    ├── node_modules/          # Installed dependencies (don't edit)
    ├── dist/                  # Production build output
    └── .vite/                 # Vite cache
```

---

## 📄 File Explanations

### Root Configuration Files

#### `package.json`
**Purpose:** Project manifest - defines dependencies, scripts, and metadata

**Contains:**
- Project name and version
- npm scripts (dev, build, preview)
- Dependencies (React, TypeScript, etc.)
- DevDependencies (build tools)

**You'll edit this to:**
- Add new packages
- Modify scripts
- Update project metadata

---

#### `vite.config.ts`
**Purpose:** Configures Vite build tool

**Contains:**
- React plugin setup
- Tailwind CSS plugin
- Path aliases (@/ → root)
- Dev server settings

**You'll edit this to:**
- Change dev server port
- Add build optimizations
- Configure path aliases

---

#### `tsconfig.json`
**Purpose:** TypeScript compiler configuration

**Contains:**
- Target JavaScript version
- Module resolution rules
- Type checking strictness
- Path mapping

**You'll edit this to:**
- Adjust type strictness
- Add path aliases
- Change compilation target

---

#### `index.html`
**Purpose:** HTML entry point for the app

**Contains:**
- Basic HTML structure
- Root div element
- Script tag linking to main.tsx
- Meta tags (title, viewport, etc.)

**You'll edit this to:**
- Change page title
- Add meta tags (SEO)
- Include external scripts/fonts

---

#### `main.tsx`
**Purpose:** JavaScript entry point - initializes React

**Contains:**
- React DOM rendering
- Import of App.tsx
- Import of global styles
- StrictMode wrapper

**Rarely edited** - usually stays as is

---

### Application Files

#### `App.tsx`
**Purpose:** Main application component - routing & navigation

**Contains:**
- Page state management
- Conditional rendering of pages
- AppProvider wrapper
- Toaster for notifications

**You'll edit this to:**
- Add new pages
- Modify navigation logic
- Change app structure

---

### Component Files

#### `AppContext.tsx`
**Purpose:** Global state management using React Context

**Contains:**
- Tool inventory state
- Transaction state
- User state
- CRUD operations for all entities
- Helper functions

**You'll edit this to:**
- Add new state variables
- Create new CRUD operations
- Modify data structures

---

#### `LandingPage.tsx`
**Purpose:** Home page - first thing users see

**Contains:**
- Hero section
- Feature highlights
- Navigation buttons
- Responsive layout

**You'll edit this to:**
- Change welcome message
- Update features list
- Modify styling

---

#### `LoginPage.tsx`
**Purpose:** Authentication screen

**Contains:**
- Login form (currently mock)
- Input validation
- Navigation to dashboards
- Error handling

**You'll edit this to:**
- Add real authentication
- Customize login flow
- Change form fields

---

#### `AdminDashboard.tsx`
**Purpose:** Admin control panel

**Contains:**
- User management (add/edit/delete)
- Transaction monitoring
- System settings dialogs
- Reports access
- Statistics cards

**You'll edit this to:**
- Add admin features
- Modify user management
- Customize settings

---

#### `InstructorDashboard.tsx`
**Purpose:** Instructor tool management panel

**Contains:**
- Tool inventory grid
- QR code generation
- Transaction tracking
- Turnover management
- Shift settings

**You'll edit this to:**
- Add instructor features
- Modify tool management
- Customize layout

---

#### `StudentQRAccess.tsx`
**Purpose:** QR code scanner for students

**Contains:**
- Camera integration
- QR code scanning
- Student info form
- Transaction creation

**You'll edit this to:**
- Customize scanning flow
- Modify student form
- Add validation

---

### UI Components (`components/ui/`)

#### Purpose
Pre-built, reusable UI components from shadcn/ui

#### Common Components:
- `button.tsx` - Clickable buttons
- `card.tsx` - Content containers
- `dialog.tsx` - Modal popups
- `input.tsx` - Form inputs
- `table.tsx` - Data tables
- `select.tsx` - Dropdown selects
- `switch.tsx` - Toggle switches

#### **DO NOT edit these directly**
- They're standardized components
- Changes affect entire app
- Update via shadcn CLI if needed

---

### Styling Files

#### `styles/globals.css`
**Purpose:** Global styles and Tailwind configuration

**Contains:**
- CSS custom properties (colors, fonts)
- Tailwind v4 configuration
- Base typography styles
- Dark mode theme
- Default component styles

**You'll edit this to:**
- Change color scheme
- Modify typography
- Adjust spacing/sizing
- Customize theme

---

## 📂 Generated Folders

### `node_modules/`
**Created by:** `npm install`
**Contains:** All installed npm packages
**Size:** Usually 100-500 MB
**Status:** ❌ Don't edit, ❌ Don't commit to Git

### `dist/`
**Created by:** `npm run build`
**Contains:** Production-ready files (minified & optimized)
**Purpose:** Deploy this folder to hosting
**Status:** ❌ Don't edit, ✅ Can delete and rebuild

### `.vite/`
**Created by:** `npm run dev`
**Contains:** Vite's cache for faster builds
**Purpose:** Speed up development
**Status:** ❌ Don't edit, ✅ Can delete safely

---

## 🎯 What Files Do You Need to Touch?

### ✅ Frequently Edited
- `App.tsx` - Adding pages, routing
- `components/*.tsx` - Adding features
- `styles/globals.css` - Styling changes
- `AppContext.tsx` - State management

### 🔧 Occasionally Edited
- `package.json` - Adding dependencies
- `vite.config.ts` - Build configuration
- `index.html` - Meta tags, title

### ❌ Rarely/Never Edited
- `main.tsx` - Entry point
- `tsconfig.json` - Unless changing TypeScript settings
- `components/ui/*` - Pre-built components
- Configuration files - Usually set once

---

## 🗂️ File Naming Conventions

### React Components
- **PascalCase** - `AdminDashboard.tsx`
- **Extension** - `.tsx` (React + TypeScript)
- **Location** - `components/` folder

### Utilities & Helpers
- **camelCase** - `useHook.ts`
- **Extension** - `.ts` (pure TypeScript)

### Styles
- **kebab-case** - `globals.css`
- **Extension** - `.css`

### Config Files
- **lowercase** - `package.json`, `vite.config.ts`

---

## 📏 File Size Guidelines

### Small Files (< 100 lines)
- UI components
- Utility functions
- Simple pages

### Medium Files (100-500 lines)
- Dashboard components
- Context providers
- Complex forms

### Large Files (500+ lines)
- `AdminDashboard.tsx` (~1000 lines)
- `AppContext.tsx` (~400 lines)

**Tip:** If file > 500 lines, consider splitting into smaller components

---

## 🔍 Finding Files

### By Feature
- Admin features → `AdminDashboard.tsx`, `AdminReportsTab.tsx`
- Instructor features → `InstructorDashboard.tsx`
- Student features → `StudentQRAccess.tsx`
- Shared UI → `components/ui/`
- Global state → `AppContext.tsx`

### By Type
- Pages → `*Page.tsx`, `*Dashboard.tsx`
- UI Components → `components/ui/*.tsx`
- Styles → `styles/*.css`
- Config → Root `*.json`, `*.ts` files

---

## 🎨 Import Path Examples

### Absolute Imports (using @/)
```typescript
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/components/AppContext";
```

### Relative Imports
```typescript
import { Button } from "./components/ui/button";
import { LandingPage } from "./components/LandingPage";
```

**Tip:** Use absolute imports for cleaner code

---

## 📦 Adding New Files

### New Component
```typescript
// components/NewFeature.tsx
import { Card } from "./ui/card";

export function NewFeature() {
  return <Card>Content</Card>;
}
```

### New Page
```typescript
// components/NewPage.tsx
export function NewPage({ onNavigate }) {
  return <div>New Page</div>;
}
```

Then add to `App.tsx`:
```typescript
{currentPage === "new-page" && <NewPage onNavigate={handleNavigate} />}
```

---

## 🗑️ Safe to Delete

- ✅ `node_modules/` - Can reinstall with `npm install`
- ✅ `dist/` - Can rebuild with `npm run build`
- ✅ `.vite/` - Vite cache, regenerates automatically
- ✅ `package-lock.json` - Regenerates on `npm install`

## ❌ Don't Delete

- ❌ `package.json` - Required for npm
- ❌ `vite.config.ts` - Needed for builds
- ❌ `tsconfig.json` - TypeScript won't work
- ❌ `index.html` - App won't load
- ❌ `main.tsx` - Entry point
- ❌ `components/` - Your entire app!

---

## 🔄 File Relationships

### Dependency Chain
```
index.html
  └─→ main.tsx
      └─→ App.tsx
          └─→ AppContext.tsx (provides global state)
              └─→ Dashboard components
                  └─→ UI components
```

### Style Chain
```
index.html
  └─→ main.tsx
      └─→ imports globals.css
          └─→ Tailwind classes available everywhere
```

---

## 💡 Best Practices

### 1. Component Organization
- One component per file
- Related components in same folder
- Shared components in `components/ui/`

### 2. File Naming
- Component = PascalCase
- Utilities = camelCase
- Be descriptive: `AdminDashboard.tsx` not `Dash.tsx`

### 3. Import Order
```typescript
// 1. External libraries
import { useState } from 'react';

// 2. Internal components
import { Button } from './ui/button';

// 3. Types/Interfaces
import type { User } from './types';

// 4. Styles (if any)
import './styles.css';
```

### 4. Keep Files Focused
- One responsibility per file
- Extract reusable logic to separate files
- Split large components

---

## 🎯 Quick Navigation Tips

### VS Code Shortcuts
- `Ctrl+P` - Quick file search
- `Ctrl+Click` - Go to definition
- `F12` - Go to implementation
- `Alt+←` - Go back

### Terminal
```bash
# Find all TypeScript files
find . -name "*.tsx"

# Search in files
grep -r "AdminDashboard" .
```

---

## 📊 File Statistics

- **Total Files:** ~60
- **React Components:** ~15
- **UI Components:** ~40
- **Config Files:** ~7
- **Documentation:** ~10
- **Total Lines:** ~7,000+

---

**Understanding the structure helps you:**
- ✅ Find files quickly
- ✅ Know what to edit
- ✅ Avoid breaking things
- ✅ Organize new features properly

**Pro Tip:** Keep this file open as reference when developing! 📌
