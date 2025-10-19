# 🛠️ DTMS - DPR Tool Management System

> #### ⚠️ Disclaimer on Code Structure
>
> Some `.tsx` files (e.g., dashboard pages) are intentionally kept large on the `main` branch. This temporary monolithic structure ensures flexibility as backend logic and data structures continue to evolve. Once the backend stabilizes, these files will be modularized into smaller, reusable components.

[**❗RECOMMENDED DOWNLOAD**] A `secondary` branch is provided with a simplified interface that prioritizes component reusability.

**Modern tool tracking and inventory management for DPR Aviation College**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0.0-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg)](https://vitejs.dev/)

---

## 🚀 Quick Start

**Want to run this on your computer?**

### Option 1: Super Quick (5 minutes)

```bash
npm install
npm run dev
```

👉 **See:** [QUICK_START.md](doc/QUICK_START.md) for step-by-step guide

### Option 2: Detailed Setup

👉 **See:** [LOCAL_SETUP_GUIDE.md](doc/LOCAL_SETUP_GUIDE.md) for complete instructions

### Option 3: Checklist

👉 **See:** [SETUP_CHECKLIST.md](doc/SETUP_CHECKLIST.md) to track your progress

---

## 📋 Table of Contents

-   [Overview](#-overview)
-   [Features](#-features)
-   [Getting Started](#-getting-started)
-   [User Roles](#-user-roles)
-   [Technology Stack](#-technology-stack)
-   [Project Structure](#-project-structure)
-   [Documentation](#-documentation)
-   [Screenshots](#-screenshots)
-   [Contributing](#-contributing)

---

## 🎯 Overview

DTMS is a comprehensive web-based tool tracking and inventory management system designed specifically for DPR Aviation College's aircraft maintenance hangar. It helps track hand tools borrowed by students and issued by instructors, reducing tool losses and improving accountability through automated transaction recording.

### Key Objectives

-   ✅ Reduce tool losses through digital tracking
-   ✅ Improve accountability with transaction logs
-   ✅ Automate record-keeping processes
-   ✅ Streamline tool borrowing/return workflow
-   ✅ Enable QR-based quick access for students

---

## ✨ Features

### 🏠 Landing Page

-   Modern, professional aviation-themed design
-   Quick access buttons for all user types
-   System overview and feature highlights
-   Responsive mobile-friendly layout

### 👨‍💼 Admin Dashboard

-   **User Management**

    -   Add, edit, delete instructors and admins
    -   View user profiles and activity
    -   Search and filter users
    -   Real-time table updates

-   **Transaction Monitoring**

    -   View all tool turnovers
    -   Filter by status, date, instructor
    -   Search transactions
    -   Export data for reports

-   **System Settings**

    -   Email notification configuration
    -   Automated backup scheduling
    -   User permission management
    -   Role-based access control

-   **Reports & Analytics**
    -   Generate custom reports
    -   Download transaction history
    -   View system statistics
    -   Daily/weekly/monthly summaries

### 👨‍🏫 Instructor Dashboard

-   **Tool Inventory Management**

    -   Add new tools to personal inventory
    -   Edit tool details (name, quantity, location)
    -   Mark tools as available/unavailable
    -   Track tool condition

-   **QR Code Generation**

    -   Generate unique QR codes for each tool
    -   Download QR codes for printing
    -   Display QR codes for student scanning

-   **Transaction Tracking**

    -   View borrowed tools in real-time
    -   Accept tool returns from students
    -   Turn over tools to admin
    -   Bulk turnover functionality

-   **Shift Management**
    -   Set shift end times
    -   Automatic due date calculations
    -   Shift-based tool accountability

### 📱 Student QR Access

-   **No Login Required**

    -   Scan instructor's QR code
    -   Enter student details
    -   Quick tool borrowing process
    -   Instant transaction creation

-   **Mobile Optimized**
    -   Camera integration
    -   Touch-friendly interface
    -   Fast scanning response

---

## 🏃 Getting Started

### Prerequisites

-   **Node.js** v18 or higher ([Download](https://nodejs.org/))
-   **npm** (comes with Node.js)
-   Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone or download the project**

    ```bash
    cd dtms-project
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

    This will install all required packages (React, TypeScript, Tailwind, etc.)

3. **Start development server**

    ```bash
    npm run dev
    ```

4. **Open browser**
   Navigate to: `http://localhost:5173/`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

---

## 👥 User Roles

### Admin (Master Administrator)

**Capabilities:**

-   Full system access and control
-   Manage all users (create, edit, delete)
-   View all transactions and turnovers
-   Configure system settings
-   Generate comprehensive reports
-   Access system diagnostics

**Default Users:** (for testing)

-   Mock login - any credentials work in development mode

---

### Instructor

**Capabilities:**

-   Manage personal tool inventory
-   Issue tools to students via QR codes
-   Accept tool returns
-   Turn over tools to admin at shift end
-   View own transaction history
-   Update shift schedules

**Default Users:** (for testing)

-   Pre-populated with sample instructors

---

### Student

**Access Method:**

-   QR code scanning only
-   No login credentials needed
-   Submit borrower information
-   Receive tool assignment

---

## 🛠️ Technology Stack

### Frontend

-   **React 18.3.1** - UI library
-   **TypeScript 5.5.3** - Type safety
-   **Tailwind CSS 4.0** - Styling
-   **Vite 5.4.2** - Build tool & dev server

### UI Components

-   **Radix UI** - Accessible component primitives
-   **shadcn/ui** - Beautiful, customizable components
-   **Lucide Icons** - Modern icon library
-   **Recharts** - Data visualization

### QR Code

-   **qrcode** - QR code generation
-   **html5-qrcode** - QR code scanning

### State Management

-   **React Context API** - Global state
-   **React Hooks** - Local state

### Development Tools

-   **ESLint** - Code linting
-   **TypeScript** - Type checking
-   **Vite** - Hot module replacement

---

## 📁 Project Structure

```
dtms-project/
├── components/                 # React components
│   ├── AdminDashboard.tsx     # Admin panel
│   ├── InstructorDashboard.tsx # Instructor panel
│   ├── LandingPage.tsx        # Home page
│   ├── LoginPage.tsx          # Authentication
│   ├── StudentQRAccess.tsx    # QR scanning
│   ├── AppContext.tsx         # Global state
│   └── ui/                    # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ... (40+ components)
│
├── styles/
│   └── globals.css            # Global styles & Tailwind config
│
├── App.tsx                    # Main app component
├── main.tsx                   # App entry point
├── index.html                 # HTML template
│
├── package.json               # Dependencies
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript config
│
└── Documentation/
    ├── README.md              # This file
    ├── QUICK_START.md         # Quick setup guide
    ├── LOCAL_SETUP_GUIDE.md   # Detailed setup
    ├── SETUP_CHECKLIST.md     # Setup checklist
    └── ADMIN_FEATURES_UPDATE.md # Admin features doc
```

---

## 📚 Documentation

| Document                                                 | Description                    | Best For          |
| -------------------------------------------------------- | ------------------------------ | ----------------- |
| [QUICK_START.md](doc/QUICK_START.md)                     | ⚡ 5-minute setup guide        | First-time users  |
| [LOCAL_SETUP_GUIDE.md](doc/LOCAL_SETUP_GUIDE.md)         | 📖 Complete setup instructions | Detailed setup    |
| [SETUP_CHECKLIST.md](doc/SETUP_CHECKLIST.md)             | ✅ Step-by-step checklist      | Tracking progress |
| [ADMIN_FEATURES_UPDATE.md](doc/ADMIN_FEATURES_UPDATE.md) | 🔧 Admin panel features        | Administrators    |
| [Attributions.md](doc/Attributions.md)                   | 📝 Credits & licenses          | Reference         |

---

## 📸 Screenshots

### Landing Page

Modern, professional interface with quick access to all features

### Admin Dashboard

-   User management table
-   Transaction monitoring
-   System settings dialogs
-   Reports generation

### Instructor Dashboard

-   Tool inventory grid
-   QR code generator
-   Transaction tracking
-   Turnover management

### Student QR Scanner

-   Mobile-optimized scanning
-   Student information form
-   Instant borrowing confirmation

---

## 🎨 Design System

### Colors

-   **Primary:** Blue shades (aviation theme)
-   **Accent:** Orange/Amber (alerts & actions)
-   **Success:** Green (confirmations)
-   **Danger:** Red (warnings & errors)
-   **Neutral:** Slate/Gray (backgrounds)

### Typography

-   **Font Family:** System fonts (optimized for performance)
-   **Headings:** Medium weight (500)
-   **Body:** Regular weight (400)
-   **Responsive:** Scales with viewport

### Components

-   **Buttons:** Gradient effects, hover states
-   **Cards:** Subtle shadows, rounded corners
-   **Tables:** Striped rows, hover highlights
-   **Forms:** Clean inputs, inline validation
-   **Dialogs:** Modal overlays, smooth animations

---

## 🔧 Configuration

### Environment Variables (Optional)

Create `.env` file in project root:

```env
# API Configuration (if using backend)
VITE_API_URL=http://localhost:3000

# Feature Flags
VITE_ENABLE_ANALYTICS=false
```

### Customization

**Change App Title:**
Edit `index.html`:

```html
<title>Your Custom Title</title>
```

**Modify Colors:**
Edit `styles/globals.css`:

```css
:root {
    --primary: #your-color;
}
```

**Change Port:**
Edit `vite.config.ts`:

```typescript
server: {
    port: 3000;
}
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build
npm run build

# Drag & drop 'dist' folder to Netlify
```

### GitHub Pages

```bash
# Install gh-pages
npm install gh-pages --save-dev

# Add to package.json
"homepage": "https://yourusername.github.io/dtms"

# Deploy
npm run deploy
```

---

## 🧪 Testing

### Manual Testing

1. Run app: `npm run dev`
2. Test all navigation paths
3. Try all user workflows
4. Check responsive design
5. Verify form validations

### Browser Testing

-   ✅ Chrome/Edge (Chromium)
-   ✅ Firefox
-   ✅ Safari
-   ✅ Mobile browsers

---

## 🐛 Troubleshooting

### Common Issues

**App won't start**

```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Blank screen**

-   Check browser console (F12)
-   Verify all imports are correct
-   Restart dev server

**Styles not loading**

-   Ensure globals.css is imported
-   Check Tailwind config
-   Clear browser cache

**Port already in use**

```bash
# Use different port
npm run dev -- --port 3000
```

---

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**
    ```bash
    git checkout -b feature/amazing-feature
    ```
3. **Make changes**
4. **Commit changes**
    ```bash
    git commit -m "Add amazing feature"
    ```
5. **Push to branch**
    ```bash
    git push origin feature/amazing-feature
    ```
6. **Open Pull Request**

### Coding Standards

-   Use TypeScript for type safety
-   Follow React best practices
-   Use functional components & hooks
-   Write meaningful commit messages
-   Comment complex logic
-   Keep components small & focused

---

## 📝 License

This project is developed for **DPR Aviation College**.

---

## 👨‍💻 Authors

**DPR Aviation College Development Team**

---

## 🙏 Acknowledgments

-   React Team for amazing framework
-   Tailwind CSS for utility-first styling
-   Radix UI for accessible components
-   shadcn for beautiful component library
-   Lucide for modern icons
-   Vite for blazing fast dev experience

---

## 📊 Stats

-   **Components:** 50+
-   **UI Components:** 40+
-   **Lines of Code:** 5,000+
-   **Dependencies:** 50+
-   **Supported Browsers:** All modern browsers
-   **Mobile Responsive:** ✅ Yes

---

**Made with ❤️ for DPR Aviation College**

**Version:** 1.0.0
**Last Updated:** October 18, 2025
**Status:** ✅ Production Ready

> #### ⚠️ Disclaimer on Code Structure
>
> Some `.tsx` files (e.g., dashboard pages) are intentionally kept large. This temporary monolithic structure ensures flexibility as backend logic and data structures continue to evolve. Once the backend stabilizes, these files will be modularized into smaller, reusable components.

---

## Quick Links

-   [🚀 Quick Start Guide](QUICK_START.md)
-   [📖 Complete Setup Guide](LOCAL_SETUP_GUIDE.md)
-   [✅ Setup Checklist](SETUP_CHECKLIST.md)
-   [🔧 Admin Features](ADMIN_FEATURES_UPDATE.md)

**Ready to get started? Run `npm install` and `npm run dev`!** 🎉
