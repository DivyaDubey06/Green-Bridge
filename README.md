# GreenBridge – Community Impact Platform

> **Connecting People Who Care.**

GreenBridge is a full-stack community engagement platform that connects citizens, verified NGOs, community organizations, and volunteers through one unified ecosystem. The platform enables organizations to publish volunteering opportunities, community events, and donation drives while allowing users to discover meaningful ways to contribute, earn digital certificates, and track their social impact through an engaging, gamified experience.

Designed with a **nature-inspired watercolor aesthetic**, GreenBridge transforms community service into an accessible, interactive, and rewarding experience.

---
## Project Mission

In today's fast paced world, many people genuinely want to contribute to society, support meaningful causes, and give back to their communities. However, busy schedules, academic commitments, work, and personal responsibilities often make it difficult to actively associate with a single NGO or volunteer organization.

At the same time, NGOs and community groups struggle to reach people who are willing to help but simply don't know where opportunities exist.

**GreenBridge bridges this gap.**

The platform connects individuals with verified volunteering opportunities, community events, and donation drives based on their availability and interests allowing them to contribute whenever they can, without the need for a long term commitment to any single organization.

Whether it's spending a weekend teaching underprivileged children, joining a tree plantation drive, participating in a community clean-up, or donating books and clothing, GreenBridge makes community engagement simple, accessible, and meaningful.

Our vision is to build a trusted ecosystem where every small contribution creates a stronger, more connected community.

---

#  Core Features

### Authentication

* Secure User Registration & Login
* JWT Authentication
* Password Encryption (bcrypt)
* Protected Routes
* Role-Based Access Control

### NGO Registration & Verification

* Organization Registration
* Verification Workflow
* Admin Approval System
* Verified Organization Badge

### Volunteer Opportunities

* Browse Volunteer Opportunities
* Search & Filter Campaigns
* Opportunity Details
* Volunteer Applications

### Community Events

* Browse Community Events
* Event Registration
* Organization Event Management

Examples include:

* Tree Plantation
* Blood Donation Camps
* Community Clean-up Drives
* Education Campaigns
* Community Marathons
* Awareness Programs

### Donation Marketplace

Users can:

* Browse Donation Listings
* Request Available Items

Donation categories include:

* Books
* Clothing
* Furniture
* Food Essentials
* Electronics
* School Supplies

### Impact & Gamification

* Experience Points (XP)
* Level Progression
* Achievement Badges
* Digital Certificates
* Personal Impact Dashboard

---

# Future Roadmap

Planned enhancements include:

* AI-powered volunteer recommendations
* Location-based opportunity matching
* Real-time messaging
* Donation image uploads
* Advanced analytics dashboard
* Email & Push notifications
* Calendar integration
* Online donation gateway
* Android & iOS mobile application

---

# 🛠 Technology Stack

## Frontend                   ## Backend                       ## Database

* React 19                    * NestJS                         * Prisma ORM
* Vite                        * TypeScript                     * MongoDB Atlas
* TypeScript                  * JWT Authentication             * Local JSON Mock Database (`db.json`) for offline development
* Tailwind CSS v4             * bcrypt Password Hashing
* React Router                * REST APIs
* Framer Motion
* Recharts
* Lucide Icons

---

# 📂 Project Structure
```text
GreenBridge/
│
├── backend/          # NestJS REST API
│   ├── src/
│   ├── prisma/
│   └── package.json
│
├── frontend/         # React + Vite Application
│   ├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   └── package.json
│
├── db.json           # Local development database
├── render.yaml
├── package.json
└── README.md
```

---

# User Roles

## Volunteer                   ## Organization                   ## Administrator

* Register & Login             * Register NGO                    * Verify Organizations
* Browse Opportunities         * Get Verified                    * Moderate Platform Content
* Register for Events          * Publish Opportunities           * Approve or Reject NGO Requests
* Request Donations            * Organize Events                 * Manage Community Listings
* Track Social Impact          * Manage Volunteer Applications
* Download Certificates

---

# Demo Accounts

The local development database is automatically seeded with test users.

### Volunteer

**Email:** `sonaa@gmail.com`

**Password:** `sonaa123`

---

### Administrator

**Email:** `admin@greenbridge.org`

**Password:** `admin123`

---

# Getting Started

## 1. Clone the Repository

```bash
git clone <repository-url>
cd GreenBridge
```

---

## 2. Install Dependencies

```bash
npm run install:all
```

This installs the root, frontend, and backend dependencies.

---

## 3. Start Development

```bash
npm run dev
```

Applications will be available at:

* 🌐 Frontend: http://localhost:5173
* ⚙ Backend API: http://localhost:5000

---

## 4. Build for Production

```bash
npm run build:all
```

This compiles both the frontend and backend production builds.

---

# Current Status

**GreenBridge is currently in the MVP (Minimum Viable Product) stage.**

Core features have been implemented, and the project is actively undergoing testing, debugging, and feature enhancements before public deployment.

---

# Preview

UI mockups and working demo screenshots will be added soon.

---

# Vision

GreenBridge is more than a volunteering platform.

Our vision is to create a trusted digital ecosystem where citizens, organizations, and communities collaborate to make volunteering, donations, and social impact accessible to everyone.

> **Every small action creates a stronger community.**

---

# License

This project is licensed under the **MIT License**.

# Current Status

GreenBridge is currently in the **MVP (Minimum Viable Product)** stage.

The core architecture and primary user flows have been implemented, and the platform is actively undergoing testing, debugging, and feature enhancements. We have intentionally not deployed the application yet, as our current focus is on improving stability, refining the user experience, and completing the remaining core features before the first public release.

---

# Future Scope

GreenBridge is designed as a scalable community ecosystem, and we envision expanding it beyond volunteering and donations. Planned future enhancements include:

* AI-powered volunteer recommendations based on skills, interests, location, and availability.
* Smart location-based opportunity matching.
* Real-time communication between volunteers and organizations.
* Community fundraising campaigns for individuals and verified social causes.
* A curated social impact news section highlighting verified national and local initiatives, awareness campaigns, and opportunities to contribute.
* Advanced analytics and impact dashboards.
* Email and push notifications.
* Calendar integration and event reminders.
* Native Android and iOS applications.
* Public API for partner organizations and educational institutions.

---

# Vision

GreenBridge is more than a volunteering platform—it is a growing ecosystem for community engagement.

Our goal is to create a trusted space where individuals, NGOs, educational institutions, and communities can collaborate, contribute, and create meaningful social impact. By bringing volunteering, donations, community events, fundraising, and verified social initiatives together under one platform, GreenBridge aims to make contributing to society as simple and accessible as possible.

> **Every small action creates a stronger community.**

