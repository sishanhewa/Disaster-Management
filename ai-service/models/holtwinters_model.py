import logging
import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

METRIC_COL = {
    "precipitation_mm": "precipMm",
    "temp_mean": "tempMean",
    "humidity_mean": "humidityMean",
}


class HoltWintersModel:
    """Holt-Winters (Triple Exponential Smoothing) for seasonal forecasting."""

    name = "holtwinters"

    def predict(
        self, df: pd.DataFrame, metric: str, horizon_days: int
    ) -> tuple[np.ndarray, float]:
        try:
            from statsmodels.tsa.holtwinters import ExponentialSmoothing

            col = METRIC_COL.get(metric, metric)
            series = df[col].dropna().values

            if len(series) < 14:
                raise ValueError(
                    f"Insufficient data for Holt-Winters: {len(series)} rows (need ≥14)"
                )

            # Use weekly seasonality (period=7)
            seasonal_period = 7
            if len(series) < 2 * seasonal_period:
                # Fall back to simple exponential smoothing
                model = ExponentialSmoothing(
                    series,
                    trend="add",
                    seasonal=None,
                ).fit(optimized=True)
            else:
                model = ExponentialSmoothing(
                    series,
                    trend="add",
                    seasonal="add",
                    seasonal_periods=seasonal_period,
                ).fit(optimized=True)

            forecast = model.forecast(horizon_days)
            forecast = np.clip(forecast, 0, None)

            # Quality from SSE (sum of squared errors)
            sse = model.sse
            quality = max(0.0, min(1.0, 1.0 - (sse / (len(series) * np.var(series) + 1e-8))))

            logger.info(
                "Holt-Winters forecast complete: %d days, SSE=%.2f, quality=%.3f",
                horizon_days,
                sse,
                quality,
            )
            return forecast, quality

        except Exception as e:
            logger.warning("Holt-Winters failed: %s – falling back", str(e))
            raise
