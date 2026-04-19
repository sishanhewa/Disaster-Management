import logging
import uuid
from typing import Dict

from fastapi import APIRouter

from schemas import TrainRequest, TrainStatusResponse

logger = logging.getLogger(__name__)
router = APIRouter()

# In-memory training state
_training_jobs: Dict[str, dict] = {}


@router.post("/train", response_model=TrainStatusResponse)
async def train_models(request: TrainRequest = TrainRequest()):
    """
    Trigger model training (async). Returns a job ID to poll status.
    In a production system this would launch background training tasks.
    """
    job_id = str(uuid.uuid4())

    models_status = {
        "sarimax": "queued",
        "lstm": "queued",
        "xgboost": "queued",
        "holtwinters": "queued",
    }

    # If specific model requested, only queue that one
    if request.modelName:
        if request.modelName not in models_status:
            models_status = {request.modelName: "queued"}
        else:
            models_status = {request.modelName: "queued"}

    _training_jobs[job_id] = {
        "status": "accepted",
        "modelsStatus": models_status,
    }

    logger.info("Training job %s accepted for models: %s", job_id, list(models_status.keys()))

    # In production, this would dispatch to a background worker.
    # For now, mark as "ready" immediately (models train on-the-fly during prediction).
    for model_name in models_status:
        _training_jobs[job_id]["modelsStatus"][model_name] = "ready"
    _training_jobs[job_id]["status"] = "completed"

    return TrainStatusResponse(
        jobId=job_id,
        status=_training_jobs[job_id]["status"],
        modelsStatus=_training_jobs[job_id]["modelsStatus"],
    )


@router.get("/status", response_model=Dict[str, TrainStatusResponse])
async def training_status():
    """Return training status for all jobs."""
    result = {}
    for job_id, data in _training_jobs.items():
        result[job_id] = TrainStatusResponse(
            jobId=job_id,
            status=data["status"],
            modelsStatus=data["modelsStatus"],
        )
    return result
