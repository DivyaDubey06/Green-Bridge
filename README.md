# GreenBridge - Community Impact Platform

**GreenBridge** is a premium, watercolor-themed full-stack web application designed to connect citizens, verified organizations, NGOs, and community clubs. Rather than a dry corporate portal, GreenBridge features an organic nature aesthetic (soft mints, warm forest greens, watercolor textures) with interactive vector graphics to inspire community service, volunteering, local events organization, and support through material donations.

---

## 🍃 Project Mission
**Connecting People Who Care.** GreenBridge exists to make contributing to society approachable. Citizens can volunteer whenever they are free, join local clean-ups and educational campaigns, donate books, clothes, or stationery, and watch their visual social impact tree grow as they accumulate experience points.

---

## 🛠️ Technology Stack
- **Frontend**: Vite, React 19, TypeScript, Tailwind CSS v4, Recharts, Framer Motion, Lucide Icons.
- **Backend**: NestJS, TypeScript, JWT Authentication, Bcrypt password hashing.
- **Database**: Prisma ORM with native support for MongoDB Atlas (via connection string) and a built-in local JSON file database fallback (`db.json`) for instant, offline local runs.

---

## 📂 Directory Layout
```text
Greenbridge/
├── package.json                   # Root monorepo script coordinator
├── db.json                        # Local mock database file (created on startup)
├── backend/                       # NestJS API application
│   ├── src/
│   │   ├── app.controller.ts      # REST API endpoints (Auth, Campaigns, Events, Donations, Certs)
│   │   ├── app.module.ts          # Main application module config (JWT/Config service loading)
│   │   ├── main.ts                # Server bootloader with CORS enabled
│   │   ├── common/database/       # Hybrid database service (mock JSON file vs MongoDB Atlas)
│   │   └── prisma/                # Prisma database client wrappers
│   ├── prisma/schema.prisma       # Prisma collection model definitions for MongoDB
│   └── .env                       # Backend environment variables
└── frontend/                      # Vite + React web client
    ├── src/
    │   ├── App.tsx                # Client-side router configuration (React Router v7)
    │   ├── main.tsx               # Client entry point
    │   ├── index.css              # Custom Tailwind CSS v4 theme, fonts, & animations
    │   ├── types/                 # Domain interface definitions
    │   ├── store/                 # Zustand authentication and database states
    │   ├── components/            # Layout shells, customizable Avatars, growing Impact Tree
    │   └── pages/                 # Public landing, workspaces, dashboards, listings
    └── package.json               # Web application package specs
```

---

## 🔑 Preloaded Test Accounts
On your very first launch, the local database initializes with two preloaded user profiles:

1. **Volunteer Citizen (Sonaa)**
   - **Email**: `sonaa@gmail.com`
   - **Password**: `sonaa123`
   - **Role**: Normal user profile, has access to the citizen workspace, tree growing dashboard, and certificate galleries.

2. **System Administrator (Admin)**
   - **Email**: `admin@greenbridge.org`
   - **Password**: `admin123`
   - **Role**: Administrator, has access to the Moderator Panel to approve/reject pending NGO registrations and delete inappropriate listings.

---

## 🚀 Getting Started

Follow these steps to run both the frontend and backend servers concurrently:

### 1. Install Dependencies
Open a terminal inside the root workspace folder and execute:
```bash
npm run install:all
```
This automatically installs the root package dependencies, backend NestJS packages, and frontend React dependencies.

### 2. Run in Development Mode
Execute:
```bash
npm run dev
```
This runs the client React web application and the NestJS REST API together:
- **Vite Web Client**: Running on `http://localhost:5173`
- **NestJS REST API**: Running on `http://localhost:5000`

### 3. Build for Production
To verify compilation and test optimization builds, run:
```bash
npm run build:all
```
This builds the production package assets inside `frontend/dist` and transpiles the backend server into `backend/dist` files.
