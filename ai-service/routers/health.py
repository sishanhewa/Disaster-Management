from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    """
    Health check endpoint. Reports readiness of each model.
    All models are ready by default since they train on-the-fly.
    """
    return {
        "status": "ok",
        "models": {
            "sarimax": "ready",
            "lstm": "ready",
            "xgboost": "ready",
            "holtwinters": "ready",
        },
    }
