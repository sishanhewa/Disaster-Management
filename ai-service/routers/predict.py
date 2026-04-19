import logging
from typing import List

import pandas as pd
from fastapi import APIRouter, HTTPException

from schemas import PredictionRequest, PredictionResponse
from models.feature_engineering import add_features
from models.ensemble import CascadeEnsemble

logger = logging.getLogger(__name__)
router = APIRouter()
ensemble = CascadeEnsemble()


@router.post("/enhanced", response_model=PredictionResponse)
async def predict_enhanced(request: PredictionRequest):
    """
    Generate a weather prediction for a single spatial unit.
    Uses cascade ensemble: SARIMAX → LSTM → XGBoost → Holt-Winters → naive fallback.
    """
    if not request.historicalData or len(request.historicalData) < 14:
        raise HTTPException(
            status_code=400,
            detail="At least 14 days of historical data required for prediction",
        )

    try:
        # Convert to DataFrame
        records = [r.model_dump() for r in request.historicalData]
        df = pd.DataFrame(records)
        df["date"] = pd.to_datetime(df["date"])
        df = df.sort_values("date").reset_index(drop=True)

        # Add engineered features
        df = add_features(df)

        # Run cascade ensemble
        response = ensemble.predict(
            df=df,
            metric=request.metric,
            horizon_days=request.horizonDays,
            spatial_unit_id=request.spatialUnitId,
        )

        logger.info(
            "Prediction complete for %s using %s (quality=%.3f)",
            request.spatialUnitId,
            response.modelUsed,
            response.qualityScore,
        )
        return response

    except Exception as e:
        logger.error("Prediction failed for %s: %s", request.spatialUnitId, str(e))
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.post("/multi", response_model=List[PredictionResponse])
async def predict_multi(requests: List[PredictionRequest]):
    """
    Batch prediction for multiple spatial units.
    Processes each request independently and returns all results.
    """
    if len(requests) > 50:
        raise HTTPException(
            status_code=400,
            detail="Maximum 50 spatial units per batch request",
        )

    results = []
    for req in requests:
        try:
            result = await predict_enhanced(req)
            results.append(result)
        except HTTPException as e:
            logger.warning(
                "Batch prediction failed for %s: %s", req.spatialUnitId, e.detail
            )
            # Skip failed units rather than failing the whole batch
            continue

    return results
