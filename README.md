<div align="center">

# 🌊 SIDMS — Sri Lanka Integrated Disaster Management System

**A full-stack, real-time disaster intelligence platform built for Sri Lanka's emergency responders, analysts, and the general public.**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-PostGIS-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgis.net/)
[![FastAPI](https://img.shields.io/badge/FastAPI-AI%20Service-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database](#-database)
- [API Modules](#-api-modules)
- [User Roles](#-user-roles)
- [Contributing](#-contributing)

---

## 🌐 Overview

**SIDMS** (Sri Lanka Integrated Disaster Management System) is a full-stack geospatial platform that provides real-time situational awareness during natural disasters. It aggregates live data from weather stations, river sensors, satellite rain grids, and government advisories to give emergency stakeholders — responders, analysts, volunteers, and the public — a unified operational picture.

The system is designed specifically for Sri Lanka's disaster landscape, covering **floods, extreme weather, SOS emergencies, and relief coordination**.

---

## ✨ Key Features

### 🗺️ Real-Time Geospatial Dashboard
- Interactive map with live weather overlays, flood gauges, and sensor data
- GN Division / District / Province spatial unit search
- ArcGIS-powered geospatial visualisations
- Saved locations pinned per user profile

### 🌧️ Weather & Flood Intelligence
- Live weather from a network of IoT weather nodes
- Hourly and 7-day forecasts per spatial unit
- JAXA satellite rain grid ingestion
- River basin explorer with hydrograph charts
- Reservoir level and flood gauge monitoring
- AQI (Air Quality Index) tracking

### 🚨 Alerts & Warnings
- Automated broadcast alert system with configurable alert rules
- Active warning banners scoped to spatial units
- Real-time push notification delivery (in-app, email, push)
- SOS emergency channel with WebSocket live updates
- Event-triggered notifications (flood thresholds, wind speed, etc.)

### 📊 Expert Analytics & Predictions
- XGBoost-powered disaster risk forecasting
- Time-travel charts for historical weather analysis
- Hazard speedometers per district
- River basin data exploration with hydrological charts
- Incident tracking and mapping for field responders

### 🏕️ Relief & Camp Management
- Camp dashboard for shelter managers to track occupancy
- Community needs registry (public pledge & request system)
- Relief analytics with fulfillment-rate reporting
- Collection point management for relief goods

### 📝 Community Reporting & Verification
- Public disaster incident reporting with photo uploads
- Multi-stage verification workflow (admin-reviewed)
- Report confirmation and community upvoting
- Guide articles and FAQ for public preparedness

### 🔐 Security & User Management
- JWT-based auth with refresh token rotation
- Role-based access control (Guest, User, Analyst, Volunteer, Responder, Admin)
- Login attempt auditing and account lockout protection
- Email verification and password history enforcement
- Full audit log for system actions

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React/Vite)                     │
│  Dashboard · Map · Alerts · Expert Panel · Relief · Reports     │
└───────────────────────┬─────────────────────────────────────────┘
                        │ REST + WebSocket
┌───────────────────────▼─────────────────────────────────────────┐
│              Backend (Spring Boot — SIDMS API)                   │
│  Auth · Weather · Flood · Alerts · Relief · SOS · Analytics     │
└──────────┬────────────────────────────┬────────────────────────-┘
           │ JDBC/JPA                   │ HTTP
┌──────────▼──────────┐    ┌────────────▼──────────────────────┐
│  PostgreSQL+PostGIS  │    │   AI Service (FastAPI + XGBoost)  │
│  Redis (cache/queue) │    │   Predictions · Risk Forecasting  │
└─────────────────────┘    └───────────────────────────────────┘
           │
┌──────────▼────────────────────────────────────────────────────┐
│               External Data Sources                            │
│  JAXA Rain API · RiverNet IoT Sensors · DMC Gov Advisories    │
│  Open-Meteo Forecast · ArcGIS Spatial Services                │
└───────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, React Router, Recharts, Leaflet, ArcGIS Maps SDK |
| **Backend** | Spring Boot 3, Spring Security (JWT), Spring Data JPA, Flyway, WebSocket |
| **AI Service** | Python, FastAPI, XGBoost, scikit-learn |
| **Database** | PostgreSQL 16 + PostGIS 3.4 |
| **Cache** | Redis 7 |
| **DevOps** | Docker, Docker Compose |
| **Spatial** | PostGIS, ArcGIS Maps SDK for JavaScript, Leaflet |

---

## 📁 Project Structure

```
Disaster-Management/
├── backend/                  # Spring Boot API (SIDMS)
│   └── src/main/
│       ├── java/com/sidms/backend/
│       │   ├── controller/   # 31 REST controllers
│       │   ├── service/      # Business logic layer
│       │   ├── entity/       # 61 JPA entities
│       │   ├── repository/   # Spring Data repositories
│       │   ├── dto/          # Request / response DTOs
│       │   ├── security/     # JWT, auth filters
│       │   ├── scheduler/    # Background data sync jobs
│       │   └── config/       # App & security configuration
│       └── resources/
│           ├── application.yml
│           └── db/
│               ├── migration/  # 30 Flyway migrations (V1–V31)
│               └── seed/       # Demo data SQL
│
├── frontend/                 # React + Vite SPA
│   └── src/
│       ├── pages/            # Route-level page components
│       │   ├── expert/       # Expert analytics & predictions
│       │   ├── relief/       # Camp & relief management
│       │   ├── admin/        # System administration
│       │   ├── analytics/    # Data dashboards
│       │   ├── auth/         # Login, register, verify
│       │   ├── reports/      # Community reporting
│       │   └── guides/       # Safety articles & FAQs
│       ├── components/       # Reusable UI components
│       ├── api/              # Typed API client (endpoints)
│       ├── hooks/            # Custom React hooks
│       ├── store/            # Zustand state stores
│       └── types/            # Shared TypeScript types
│
├── ai-service/               # FastAPI risk prediction service
│   ├── routers/              # API route handlers
│   └── models/               # XGBoost model artefacts
│
└── docker-compose.yml        # PostgreSQL + Redis services
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 21+** (for the backend)
- **Node.js 20+** and npm (for the frontend)
- **Python 3.11+** (for the AI service)
- **Docker & Docker Compose** (for PostgreSQL and Redis)

### 1. Start Infrastructure

```bash
docker compose up -d
```

This starts a PostGIS-enabled PostgreSQL instance on port `5432` and Redis on port `6379`.

### 2. Backend

```bash
cd backend
cp .env.example .env    # Fill in your environment variables
./mvnw spring-boot:run
```

The API will start on **http://localhost:8080**. Flyway will automatically apply all database migrations on first run.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at **http://localhost:5173**. It proxies `/ai/*` requests to the AI service and `/api/dmc` to the DMC government portal.

### 4. AI Service

```bash
cd ai-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory (or the project root). The application auto-loads it on startup.

```env
# Database
DB_URL=jdbc:postgresql://localhost:5432/sidms
DB_USERNAME=sidms_user
DB_PASSWORD=sidms_pass

# JWT
JWT_SECRET=<your-256-bit-secret>
JWT_EXPIRY_MS=86400000

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# External APIs
OPEN_METEO_BASE_URL=https://api.open-meteo.com
JAXA_API_KEY=<your-jaxa-key>
RIVERNET_API_KEY=<your-rivernet-key>

# Lazy-start background syncs (useful for local dev)
APP_SYNC_LAZY_START=true

# AI Service
GEMINI_API_KEY=<your-key>
```

> **Note:** The `.env` file is gitignored. Never commit secrets to the repository.

---

## 🗄️ Database

The database schema is managed by **Flyway** with 30+ versioned migration scripts under `backend/src/main/resources/db/migration/`.

### Key Schema Areas

| Migration | Description |
|---|---|
| `V1` | Core enums (disaster categories, alert levels, roles) |
| `V2` | User auth tables (users, roles, sessions, audit logs) |
| `V3` | Spatial/weather tables (weather nodes, spatial units) |
| `V4` | Disaster & flood tables (incidents, warnings, river gauges) |
| `V5` | Analytics, alerts, and content tables |
| `V12` | Relief camp and incident management tables |
| `V13` | Full weather engine tables (forecasts, timeseries) |
| `V24` | Event-triggered notification tables |
| `V25` | Verification workflow tables |
| `V29` | SOS events and emergency tracking |

---

## 🔌 API Modules

The backend exposes **31 REST controllers** covering:

| Module | Endpoints |
|---|---|
| `AuthController` | Register, login, refresh token, logout |
| `WeatherController` | Live weather, forecasts, hourly strips |
| `FloodController` | Flood gauges, river levels, basin data |
| `DisasterWarningController` | Create, update, and list active warnings |
| `BroadcastAlertController` | System-wide broadcast alerts |
| `AlertRuleController` | Threshold-based auto-alert configuration |
| `EmergencyController` | SOS submissions and incident management |
| `SosWebSocketController` | Real-time SOS updates via WebSocket |
| `CampController` | Relief camp registration and management |
| `ReliefNeedController` | Community needs submissions |
| `ReliefPledgeController` | Pledge and fulfillment tracking |
| `VerificationController` | Report verification workflows |
| `AnalyticsController` | Aggregated system analytics |
| `ReportController` | Community disaster reports |
| `NotificationController` | User notification management |
| `UserProfileController` | Profile updates, saved locations |
| `AdminController` | System administration endpoints |
| `MapController` | Map bookmarks and spatial queries |
| `AiExportController` | AI/ML data export for predictions |

---

## 👥 User Roles

| Role | Description |
|---|---|
| `guest` | Unauthenticated visitor — read-only public data |
| `user` | Registered member — can report incidents, save locations |
| `volunteer` | Field volunteer — access to task assignments and camp data |
| `responder` | Emergency responder — SOS management and incident dispatch |
| `analyst` | Data analyst — full read access to analytics and expert panel |
| `admin` | System administrator — full system access |

---

## 🤝 Contributing

1. Fork the repository and create a feature branch from `main`.
2. Follow the existing code style (Java: Google Java Style, TypeScript: ESLint config).
3. Ensure all Flyway migrations are backwards-compatible.
4. Submit a pull request with a clear description of your changes.

---

<div align="center">
  <sub>Built with ❤️ for Sri Lanka's disaster resilience — SIDMS Team 2025</sub>
</div>
