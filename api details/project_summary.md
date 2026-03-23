# Project Summary: Sri Lanka River Level Prediction System

This document summarizes the progress, technical architecture, and configurations implemented as of **Phase 3 Completion**.

---

## 1. Data Preprocessing (Phase 1)
Converted irregular river readings into a high-frequency, continuous time-series dataset.

### Technical Steps
- **Station Name Unification**: Standardized inconsistent names to ensure history grouping works.
- **3-Hour Continuous Resampling**: Used bucketed mean aggregation to snap irregular timestamps (e.g., 9:30 AM) to a strict 3-hour grid (00:00, 03:00, etc.).
- **Leakage Prevention**: 
    - Replaced interpolation with **Strict Forward-Fill (ffill)**. The model only knows what has happened in the past; it never "sees" the next data point to draw a slope.
    - Purged the raw `previous_water_level` column to avoid unknown historical leakage.
- **Dataset Size**: Expanded from ~45k raw scattered rows to **395,629** continuous, mathematically aligned 3-hour sequences.

---

## 2. Machine Learning Models (Phase 2)
Trained dual-horizon XGBoost regression models for short-term nowcasting and long-term forecasting.

### Model Configurations
- **Algorithm**: `XGBoost Regressor`
- **Tuning**: `n_estimators=250`, `learning_rate=0.03`, `max_depth=7`, `colsample_bytree=0.6`.
- **Horizons**:
    - **3-Hour Model** (`waterlevel_xgb_3h.joblib`)
    - **12-Hour Model** (`waterlevel_xgb_12h.joblib`)

### Engineered Features (40 Total)
- **Momentum**: `water_level_delta` (Current - Previous).
- **Lags**: 1, 2, 4, 8, 16, 24 steps back (up to 72 hours of history).
- **Rainfall Memory**: Rolling sums for 3h, 6h, 24h, and 48h windows.
- **Thresholds**: Ratios and binary flags for Minor/Major flood levels.
- **Seasonality**: Month, Hour, Quarter, and `is_monsoon` flag.

### Performance (Strict Physical Evaluation)
*Metrics calculated only on natively recorded timestamps (ignoring flat-line padding).*

| Metric | 3-Hour Forecast | 12-Hour Forecast |
|--------|-----------------|------------------|
| **MAE** | ~16.8 cm | ~36.6 cm |
| **RMSE** | ~0.61 | ~0.87 |

---

## 3. Database & Backend (Phase 3)
Built the production-ready infrastructure using PostgreSQL and FastAPI.

### PostgreSQL Schema (6 Tables)
1. `stations`: Metadata, coordinates, and flood thresholds.
2. `historical_observations`: Backfilled 45,748 rows from the original CSV.
3. `live_observations`: Incoming real-time data from Rivernet.
4. `predictions`: Stored model outputs with risk classification.
5. `simulation_runs`: Metadata for "What-if" rainfall scenarios.
6. `simulation_results`: Outputs of the simulation engine.

### Backend Structure
- **API**: FastAPI with routes for `/stations`, `/predictions`, and `/simulation`.
- **Feature Service**: A unified Python module that generates the identical 40 features for both training and live inference.
- **Prediction Service**: Automatically loads models and classifies risk (Normal / Minor / Major).

---

## 4. Key Mappings & Constants

### Station Name Mapping
```python
{
    'NagalagamStreet': 'Nagalagam Street',
    'Kalawellawa(Millakanda)': 'Kalawellawa (Millakanda)',
}
```

### Risk Classification Logic
- `predicted < minor_flood_level` → **Normal**
- `predicted >= minor && < major` → **Minor Flood**
- `predicted >= major` → **Major Flood**

---

## 5. Directory Structure
```text
Sri-Lanka-River-Level-Prediction/
├── app/
│   ├── main.py              # FastAPI Entry Point
│   ├── routes/              # API Endpoints
│   ├── db/                  # SQL Schema & SQLAlchemy Models
│   └── services/            # Feature & Prediction Logic
├── models/
│   ├── waterlevel_xgb_3h.joblib
│   └── waterlevel_xgb_12h.joblib
├── scripts/
│   └── backfill_history.py  # DB Initialization Script
├── preprocessing.ipynb      # Final V7 Data Pipeline
├── training.ipynb           # Final V7 ML Pipeline
├── venv/                    # Python Virtual Environment
├── .env                     # Database Credentials
└── .gitignore               # Automated Ignores
```

---

## 6. Next Steps
1. **Phase 4**: Build the **Rivernet Fetcher** to ingest live data every 15 minutes.
2. **Phase 5**: Develop the **Frontend Dashboard** (React/Streamlit) for map-based visualization.
3. **Phase 6**: Fully implement the **Simulation Engine** for scenario testing.
