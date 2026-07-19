from pydantic import BaseModel

class PredictionResponse(BaseModel):
    pm10: float
    pm25: float
    so2: float
    no2: float
    co: float
    voc: float