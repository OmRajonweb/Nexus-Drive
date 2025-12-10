# Nexus Drive – Connected Vehicle Intelligence Platform

Live site: https://nexus-drive-app.vercel.app/

Demo video: https://drive.google.com/file/d/1HYJ0k0PUicwYcyynfDeC59sRnrYj8RvA/view?usp=sharing

---

## Overview

Nexus Drive is a next‑generation automotive intelligence dashboard built with Next.js and React. It simulates a full connected‑vehicle ecosystem where drivers, service centers, and OEM/admin users can see telemetry, get AI‑style recommendations, manage service operations, and analyze feedback.

The app is designed as a **role‑based single‑page experience**:

- **Driver** – sees vehicle health, AI recommendations, and can book services.
- **Service Center** – manages work orders, calendars, technicians, inventory, and feedback.
- **Admin / Manufacturer** – monitors network‑level analytics, parts requests, feedback, and broadcasts to centers.

This project is meant to be a polished front‑end prototype and a strong starting point for a real connected‑car platform.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript, React
- **Styling:** Tailwind CSS, custom global styles
- **UI Toolkit:** Radix UI primitives + shadcn‑style components
- **Icons:** lucide‑react
- **Animations:** framer‑motion
- **Charts & Visualization:** recharts
- **State & Utilities:** React context (`RoleProvider`), custom hooks, localStorage helpers

---

## Live Demo

- **Live Site:** https://nexus-drive-app.vercel.app/
- **Demo Video (walkthrough):** https://drive.google.com/file/d/1HYJ0k0PUicwYcyynfDeC59sRnrYj8RvA/view?usp=sharing

Use the video if the live deployment is unavailable or you want a quick guided tour.

---

## Features

### 1. Role‑Based Experience

- **Login & Role selection**
  - Simple login screen where you choose a role (Driver, Service Center, Admin/OEM).
  - `RoleProvider` context stores authentication state and role.
  - The main layout (`app/page.tsx`) switches the dashboard based on the selected role.

- **Persistent role**
  - Role and minimal session info are kept on the client so you can refresh without losing your view.

### 2. Driver Dashboard

- **Overview dashboard**
  - KPIs for uptime, service adherence, and satisfaction.
  - Real‑time style telemetry card with engine temperature, battery, tire pressure, fluids, etc.
  - Animated agent‑orchestration panel showing how different AI agents collaborate.

- **AI‑style recommendations**
  - Cards suggesting actions like brake pad replacement, battery health check, tire rotation.
  - Each recommendation includes priority, impact, and suggested next step.

- **Service booking flow**
  - Multi‑step modal flow:
    1. Select service type (with optional AI suggestion).
    2. Choose a service center (distance, rating, availability).
    3. Select a date from the calendar.
    4. Select a time slot.
    5. Review and confirm.
  - Bookings are persisted on the client and shown in an **Upcoming & History** section.

- **Engagement & feedback**
  - Chat‑style “AI Voice Agent” interface for asking questions.
  - Post‑service feedback flows (ratings and comments) connected to service records.

### 3. Service Center Console

- **Work orders & calendar**
  - Tabbed service‑center console with Overview, Calendar, Inventory, Technicians, Feedback, and Messages.
  - Work orders table listing order ID, vehicle, service type, technician, status, and time window.
  - Calendar view of bookings for the selected day.

- **Technician performance**
  - Technician cards and charts showing jobs completed, average completion time, and ratings.

- **Inventory & AI insights**
  - Parts inventory view with ID, name, quantity, last restock, supplier, cost.
  - “AI‑powered Inventory Insights” summarizing predicted demand for parts based on upcoming bookings.

- **Feedback & messages**
  - Feedback tab to review and triage customer feedback.
  - Messages/broadcasts tab with unread indicators and acknowledgement flows.

### 4. Admin / OEM Dashboard

- **Network‑level KPIs**
  - Summary of high‑priority parts requests, approved requests, pending feedback, and broadcast reach.

- **Parts request management**
  - Table of requests from centers with status transitions (Pending → Approved/Rejected → Dispatched → Fulfilled).

- **Feedback overview**
  - Aggregated view of feedback across centers to spot recurring issues.

- **Broadcasts**
  - Compose and send broadcasts to centers.
  - Track acknowledgements and impact metrics.

### 5. Analytics & Visualization

- Rich use of charts (`recharts`) across pages, including:
  - Telemetry time‑series.
  - Failure probability and diagnostics.
  - Technician performance over time.
  - Feedback sentiment and quality metrics.

- Animations and transitions (via `framer-motion`) make the experience feel like a modern analytics product.

---

## Project Structure

High‑level layout (simplified):

```text
app/
  layout.tsx        # Root layout, fonts, theme, providers
  page.tsx          # Entry point, role‑based dashboard switching
components/
  header.tsx        # Top bar
  sidebar.tsx       # Role‑aware navigation
  role-provider.tsx # Auth/role context
  pages/
    overview-dashboard.tsx
    data-analysis.tsx
    prediction.tsx
    engagement.tsx
    feedback.tsx
    service-center.tsx
    admin.tsx
    fleet.tsx
    manufacturing.tsx
    security.tsx
  ui/               # Reusable UI primitives (buttons, inputs, dialogs, etc.)
hooks/
  use-toast.ts      # Toast utilities
lib/
  ...               # Helpers (localStorage, etc.)
public/
styles/
  globals.css       # Global styles and Tailwind entry
```

Refer to the source files for full implementation details.

---

## Getting Started (Local Development)

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm, pnpm, or yarn (the project includes `package-lock.json` and `pnpm-lock.yaml`; npm is fine for local dev)

### Installation

```bash
# clone the repo
git clone https://github.com/OmRajonweb/Nexus-Drive.git
cd Nexus-Drive

# install dependencies (using npm)
npm install --legacy-peer-deps
```

> Note: `--legacy-peer-deps` may be required because some UI libraries expect slightly older React/Next versions. This is safe for local experimentation.

### Run the dev server

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

---

## Usage Guide

1. **Open the app** (local or live URL).
2. **Choose a role** on the login screen:
   - Driver
   - Service Center
   - Admin/OEM
3. **Explore the dashboard** for that role:
   - Check cards, charts, and tabs.
   - Try the booking flow (Driver) and see it reflected in the Service Center view.
   - Browse inventory, technician analytics, and feedback lists.
   - As Admin, explore parts requests and broadcasts.

Because this is primarily a front‑end prototype, data is mocked or stored on the client rather than backed by a production database.

---

## Potential Next Steps

If you want to extend this prototype into a more realistic platform, you could:

- Add a real backend (Next.js API routes with Prisma + SQLite/Postgres).
- Replace mocked data with persistent storage for bookings, work orders, and feedback.
- Integrate real telematics feeds or OBD data streams.
- Connect to an LLM or ML service to power the recommendations and assistant flows.
- Harden authentication and authorization with a proper identity provider.

---

## Team

- Om Raj
- Aanya Verma
- Prayatshu Misra
- Arnav Ranjan
- Satvik Maheshwari

---

## License

This project is available for learning and demonstration purposes. Please refer to the repository or author for any specific licensing or reuse questions.
