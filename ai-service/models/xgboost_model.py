import logging
import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

METRIC_COL = {
    "precipitation_mm": "precipMm",
    "temp_mean": "tempMean",
    "humidity_mean": "humidityMean",
}

FEATURE_COLS = [
    "tempMax", "tempMin", "tempMean", "precipMm", "humidityMean",
    "windSpeedMean", "capeMax", "dayOfYear", "month", "dayOfWeek",
    "day_sin", "day_cos", "month_sin", "month_cos", "week_sin", "week_cos",
    "rolling_7d", "rolling_14d", "rolling_30d",
    "cape_ma_3d", "precip_ma_7d_ratio", "humidity_pressure",
]


class XgboostModel:
    """XGBoost with recursive multi-step forecasting."""

    name = "xgboost"

    def predict(
        self, df: pd.DataFrame, metric: str, horizon_days: int
    ) -> tuple[np.ndarray, float]:
        try:
            from xgboost import XGBRegressor
            from models.feature_engineering import add_features

            col = METRIC_COL.get(metric, metric)
            df_feat = add_features(df)

            # Add lag features as extra columns
            for lag in range(1, 15):
                lag_col = f"lag_{lag}d"
                if lag_col not in df_feat.columns:
                    df_feat[lag_col] = df_feat[col].shift(lag)
            df_feat = df_feat.fillna(0)

            # Build feature list
            feature_cols = [c for c in FEATURE_COLS if c in df_feat.columns]
            lag_cols = [f"lag_{i}d" for i in range(1, 15) if f"lag_{i}d" in df_feat.columns]
            all_features = feature_cols + lag_cols

            X = df_feat[all_features].values
            y = df_feat[col].values

            if len(X) < 30:
                raise ValueError(
                    f"Insufficient data for XGBoost: {len(X)} rows (need ≥30)"
                )

            model = XGBRegressor(
                n_estimators=200,
                max_depth=6,
                learning_rate=0.05,
                subsample=0.8,
                colsample_bytree=0.8,
                random_state=42,
                verbosity=0,
            )
            model.fit(X, y)

            # Recursive multi-step forecast
            forecasts = []
            last_row = df_feat.iloc[-1].copy()

            for step in range(horizon_days):
                features = np.array([[last_row.get(f, 0) for f in all_features]])
                pred = model.predict(features)[0]
                pred = max(0.0, pred)
                forecasts.append(pred)

                # Update lag features for next step
                for lag in range(14, 1, -1):
                    last_row[f"lag_{lag}d"] = last_row.get(f"lag_{lag - 1}d", 0)
                last_row["lag_1d"] = pred

                # Advance day-of-year cyclical features
                new_doy = (last_row.get("dayOfYear", 1) + 1) % 365
                last_row["dayOfYear"] = new_doy if new_doy > 0 else 365
                last_row["day_sin"] = np.sin(2 * np.pi * last_row["dayOfYear"] / 365)
                last_row["day_cos"] = np.cos(2 * np.pi * last_row["dayOfYear"] / 365)

            forecast = np.array(forecasts)

            # Quality from training R² (capped)
            train_pred = model.predict(X)
            ss_res = np.sum((y - train_pred) ** 2)
            ss_tot = np.sum((y - y.mean()) ** 2) + 1e-8
            r2 = 1 - ss_res / ss_tot
            quality = max(0.0, min(1.0, r2))

            logger.info(
                "XGBoost forecast complete: %d days, R²=%.3f, quality=%.3f",
                horizon_days,
                r2,
                quality,
            )
            return forecast, quality

        except Exception as e:
            logger.warning("XGBoost failed: %s – falling back", str(e))
            raise
