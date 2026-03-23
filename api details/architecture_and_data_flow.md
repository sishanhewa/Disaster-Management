# Architecture and Data Flow

This document provides a high-level overview of how the Rivernet AI application functions, helping new developers quickly understand how data travels from source to UI.

## Overall Stack
The application uses a modern decoupled architecture:
1. **Database:** PostgreSQL (Stores spatial observations and AI predictions).
2. **Backend Engine:** Python / FastAPI / APScheduler (Handles HTTP routes, recurring background tasks, and AI model inference).
3. **Frontend:** React (Vite / Tailwind / Lucide Icons) (Reads API endpoints and displays interactive dashboards).

## Core Data Loop (The 15-Minute Cycle)
The core uniqueness of this project compared to standard web apps is its autonomous, self-sustaining data cycle.

1. **The Scheduler (`app/main.py`)** 
   When the FastAPI server turns on, it initializes an `APScheduler` instance physically bound to the web server's lifecycle. It registers a cron-like instruction: *Run `fetch_and_process()` every 15 minutes.*

2. **Data Ingestion (`app/services/arcgis_fetcher.py`)**
   Every 15 minutes, the fetcher wakes up and makes external HTTP requests to the centralized **Sri Lanka ArcGIS Government endpoint**.
   - It pulls down paginated JSON data for all monitored river gauges across the country.
   - It normalizes the names, aligns them with internal `station_id`s, and inserts these raw telemetry points into the `live_observations` PostgreSQL table.
   - It logs the execution event inside the `sync_logs` table (used by the frontend audit logs).

3. **AI Inference (`app/services/prediction_service.py`)**
   Immediately after inserting new data, the script triggers the AI pipeline for any station that received updated telemetry.
   - It loads historical and current features from the database (`feature_service.py`).
   - It loads pre-trained XGBoost models from the `/models` directory (e.g., `model_3h.joblib` and `model_12h.joblib`).
   - It generates predicted water levels for both `+3 Hours` and `+12 Hours` into the future.
   - It stores these results into the `predictions` PostgreSQL table alongside a categorized Risk Class (e.g., `Major Flood`, `Normal`).

4. **Frontend Dashboard (`frontend/src/pages/Dashboard.jsx`)**
   The React frontend continuously polls the backend API (specifically `GET /stations/status/all`).
   - It receives a merged, flattened representation of the latest `live_observation` crossed with the latest `prediction`.
   - The UI automatically updates the water level tickers, the 12H predictive risks, and the flood color-coding (Green/Yellow/Red) natively.

## Directory Map

```text
Sri-Lanka-River-Level-Prediction/
├── app/                  # Main FastAPI Application
│   ├── db/               # Database connection and table schemas
│   ├── routes/           # REST API Endpoints (e.g. /stations)
│   ├── services/         # Core Logic (Fetcher, Model Inferences)
│   └── main.py           # Application entry point & Scheduler
├── docs/                 # Project documentation and architecture
├── frontend/             # React User Interface 
│   ├── src/components/   # Reusable UI elements (LogViewer, Cards)
│   └── src/pages/        # Full screen layouts (Dashboard)
├── models/               # Serialized .joblib AI models
└── scripts/              # Independent tooling (e.g. csv backfill scripts)
```
