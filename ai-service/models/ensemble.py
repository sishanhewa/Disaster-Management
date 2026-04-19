import logging
from datetime import datetime, timedelta

import numpy as np
import pandas as pd

from schemas import PredictionResponse, ForecastPoint
from models.sarimax_model import SarimaxModel
from models.lstm_model import LstmModel
from models.xgboost_model import XgboostModel
from models.holtwinters_model import HoltWintersModel

logger = logging.getLogger(__name__)

# Cascade order – try each model, fall back on failure
MODEL_CASCADE = [
    SarimaxModel,
    LstmModel,
    XgboostModel,
    HoltWintersModel,
]


class CascadeEnsemble:
    """
    Cascade ensemble that tries models in priority order.
    Falls back to the next model if one fails.
    """

    def predict(
        self, df: pd.DataFrame, metric: str, horizon_days: int, spatial_unit_id: str
    ) -> PredictionResponse:
        last_date = pd.to_datetime(df["date"].iloc[-1])

        for model_cls in MODEL_CASCADE:
            model = model_cls()
            try:
                logger.info("Trying model: %s", model.name)
                predictions, quality = model.predict(df, metric, horizon_days)

                forecast_points = self._build_forecast_points(
                    predictions, last_date, horizon_days
                )

                return PredictionResponse(
                    spatialUnitId=spatial_unit_id,
                    metric=metric,
                    modelUsed=model.name,
                    horizonDays=horizon_days,
                    predictions=forecast_points,
                    qualityScore=round(quality, 4),
                    generatedAt=datetime.utcnow().isoformat() + "Z",
                )

            except Exception as e:
                logger.warning(
                    "Model %s failed: %s – trying next", model.name, str(e)
                )
                continue

        # All models failed – return fallback with last known values
        logger.error("All models failed – returning naive fallback forecast")
        return self._fallback_forecast(df, metric, horizon_days, spatial_unit_id, last_date)

    def _build_forecast_points(
        self,
        predictions: np.ndarray,
        last_date: pd.Timestamp,
        horizon_days: int,
    ) -> list[ForecastPoint]:
        """Build ForecastPoint list with ±15% confidence bounds."""
        points = []
        for i, val in enumerate(predictions):
            forecast_date = last_date + timedelta(days=i + 1)
            margin = abs(val) * 0.15
            points.append(
                ForecastPoint(
                    date=forecast_date.strftime("%Y-%m-%d"),
                    predictedValue=round(float(val), 2),
                    lowerBound=round(float(max(0, val - margin)), 2),
                    upperBound=round(float(val + margin), 2),
                )
            )
        return points

    def _fallback_forecast(
        self,
        df: pd.DataFrame,
        metric: str,
        horizon_days: int,
        spatial_unit_id: str,
        last_date: pd.Timestamp,
    ) -> PredictionResponse:
        """Naive fallback: repeat last 7 days average."""
        METRIC_COL = {
            "precipitation_mm": "precipMm",
            "temp_mean": "tempMean",
            "humidity_mean": "humidityMean",
        }
        col = METRIC_COL.get(metric, metric)
        recent = df[col].tail(7).values
        avg = float(np.mean(recent)) if len(recent) > 0 else 0.0

        predictions = np.full(horizon_days, avg)
        forecast_points = self._build_forecast_points(predictions, last_date, horizon_days)

        return PredictionResponse(
            spatialUnitId=spatial_unit_id,
            metric=metric,
            modelUsed="fallback_naive",
            horizonDays=horizon_days,
            predictions=forecast_points,
            qualityScore=0.1,
            generatedAt=datetime.utcnow().isoformat() + "Z",
        )
