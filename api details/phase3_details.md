# Phase 3: Database & Backend Documentation

This document explains the production infrastructure that hosts the ML models and serves predictions.

## 1. PostgreSQL Database
A PostgreSQL 18 instance serves as the "source of truth" for the entire system.

### Tables & Purpose
1. **`stations`**: Unique master list of all monitoring points. Stores latitude, longitude, and Minor/Major flood thresholds.
2. **`historical_observations`**: Repository of backfilled historical records (approx. 45k rows).
3. **`live_observations`**: Working table for real-time Rivernet data.
4. **`predictions`**: Log of all model-generated forecasts.
5. **`simulation_runs` / `simulation_results`**: Tables for "What-if" scenario data.

---

## 2. Shared Service Layer
To prevent logic duplication, core mechanics are moved into reusable Python modules.

### `feature_service.py`
This is the heart of the backend. It contains a `generate_features()` function that accepts raw historical/live rows and computes the **exact same 40 features** used during model training. This guarantees that "Live" predictions use the same mathematical logic as "Training" data.

### `prediction_service.py`
- Loads both 3H and 12H `.joblib` model files.
- Orchestrates the retrieval of recent DB records.
- **Risk Classification**: Converts the numeric prediction into a human-readable alert:
    - Below Minor → **Normal**
    - Above Minor → **Minor Flood**
    - Above Major → **Major Flood**

---

## 3. FastAPI REST API
The backend exposes several endpoints for the mobile app or web dashboard.

### Core Endpoints
- `GET /stations`: List all active stations.
- `GET /stations/{id}/latest`: Show the most recent water level reading.
- `GET /stations/{id}/history`: Output data for historical charting (7-day default).
- `GET /stations/{id}/prediction`: Return the current 3-hour and 12-hour warnings.
- `POST /simulate`: (Phase 6) Accepts hypothetical rainfall to run a "what-if" scenario.

---

## 4. Setup & Ingestion
- **Environment**: A `.env` file secures the database password (`Sishan.123`).
- **Initialization**: `scripts/backfill_history.py` automatically:
    1. Creates the database and schema.
    2. Maps station names.
    3. Bulk-inserts the 45k rows from the processed CSV.
- **Execution**: The system runs inside a Python Virtual Environment (`venv`) with dependencies managed via `requirements.txt`.
