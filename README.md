# SmartCity 360 🏙️

> **AI-Powered Integrated Urban Management System**

SmartCity 360 is a full-stack civic technology platform connecting citizens, municipal departments, and city leadership. It enables real-time grievance reporting, AI-assisted department triaging, interactive geospatial mapping, IoT sensor monitoring, and data-driven civic administration.

---

## 🚀 Key Features

- **Civic Issue Reporting**: Citizen dashboard to log grievances with photo uploads, geolocation tagging, and live status tracking.
- **AI-Powered Department Triaging**: Automated categorization, severity scoring, and smart dispatching for incoming municipal issues.
- **Interactive City Map**: Real-time geospatial visualization of civic reports, infrastructure alerts, and municipal assets.
- **Department Workflow Portal**: Tailored views for municipal departments (Roads, Sanitation, Water, Electrical, Public Health) to assign, update, and resolve issues.
- **City Command Center & Analytics**: High-level KPIs, resolution rate tracking, heatmaps, and trend forecasting for city administrators.
- **Public Announcements & Alerts**: Broadcast system for urgent municipal notices, weather alerts, and civic updates.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **React 18** with **TypeScript**
- **Vite** build tooling
- **Tailwind CSS** & Lucide Icons
- **React Router** for navigation
- **Leaflet / React Leaflet** for geospatial mapping

### Backend (`/server`)
- **Node.js** & **Express** with TypeScript
- **tsx** for rapid development
- **RESTful API Architecture**
- **Supabase** database & authentication integration

### Database & Migrations (`/supabase`)
- **PostgreSQL** schema & SQL migrations
- Initial schema and seed data included

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or newer recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Aniruddha-Damale/smartcity-360.git
   cd smartcity-360
   ```

2. **Install dependencies**:
   ```bash
   # Install server dependencies
   npm --prefix server install

   # Install client dependencies
   npm --prefix client install
   ```

3. **Run the development servers**:
   ```bash
   # Runs both client and server concurrently
   npm run dev
   ```

   - Client runs at: `http://localhost:5173`
   - Server runs at: `http://localhost:5000`

---

## 📜 License

This project is licensed under the MIT License.
