from pydantic import BaseModel
from typing import List, Optional


class DailyRecord(BaseModel):
    date: str
    tempMax: float
    tempMin: float
    tempMean: float
    precipMm: float
    humidityMean: float
    windSpeedMean: float
    capeMax: float
    dayOfYear: int
    month: int
    dayOfWeek: int
    isCoastal: bool = False
    isMountain: bool = False
    elevationM: int = 0
    distanceToCoastKm: float = 0


class PredictionRequest(BaseModel):
    spatialUnitId: str
    metric: str  # "precipitation_mm", "temp_mean", "humidity_mean"
    horizonDays: int = 14
    historicalData: List[DailyRecord]


class ForecastPoint(BaseModel):
    date: str
    predictedValue: float
    lowerBound: float
    upperBound: float


class PredictionResponse(BaseModel):
    spatialUnitId: str
    metric: str
    modelUsed: str
    horizonDays: int
    predictions: List[ForecastPoint]
    qualityScore: float
    generatedAt: str


class TrainRequest(BaseModel):
    modelName: Optional[str] = None  # None = train all models


class TrainStatusResponse(BaseModel):
    jobId: str
    status: str
    modelsStatus: dict
