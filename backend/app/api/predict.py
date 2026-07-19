from fastapi import APIRouter

from app.schemas.request import PredictionRequest
from app.schemas.response import PredictionResponse

router = APIRouter(prefix="/predict", tags=["Prediction"])


@router.post("/", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    return PredictionResponse(
        pm10=18.5,
        pm25=12.3,
        so2=8.4,
        no2=5.7,
        co=2.1,
        voc=1.2,
    )