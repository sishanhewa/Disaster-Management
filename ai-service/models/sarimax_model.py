import logging
import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

# Metric column mapping
METRIC_COL = {
    "precipitation_mm": "precipMm",
    "temp_mean": "tempMean",
    "humidity_mean": "humidityMean",
}


class SarimaxModel:
    """SARIMAX model using pmdarima auto_arima for automatic order selection."""

    name = "sarimax"

    def predict(
        self, df: pd.DataFrame, metric: str, horizon_days: int
    ) -> tuple[np.ndarray, float]:
        try:
            from pmdarima import auto_arima

            col = METRIC_COL.get(metric, metric)
            series = df[col].dropna().values

            if len(series) < 30:
                raise ValueError(
                    f"Insufficient data for SARIMAX: {len(series)} rows (need ≥30)"
                )

            model = auto_arima(
                series,
                seasonal=True,
                m=7,  # weekly seasonality
                stepwise=True,
                suppress_warnings=True,
                error_action="ignore",
                max_order=5,
                max_p=3,
                max_q=3,
                max_P=2,
                max_Q=2,
                max_d=2,
                max_D=1,
                n_fits=30,
            )

            forecast = model.predict(n_periods=horizon_days)
            forecast = np.clip(forecast, 0, None)  # no negative values

            # Quality score based on AIC (lower = better, normalize)
            aic = model.aic()
            quality = max(0.0, min(1.0, 1.0 - (aic / 10000)))

            logger.info(
                "SARIMAX forecast complete: %d days, AIC=%.2f, quality=%.3f",
                horizon_days,
                aic,
                quality,
            )
            return forecast, quality

        except Exception as e:
            logger.warning("SARIMAX failed: %s – falling back", str(e))
            raise
