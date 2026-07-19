from pydantic import BaseModel
from typing import List
from pydantic import BaseModel
from typing import List
class AnnualEmissions(BaseModel):
    pm10: float
    pm25: float
    so2: float
    no2: float
    co: float
    voc: float

class Recommendation(BaseModel):
    title: str
    detail: str
    impact: str
class PredictionResponse(BaseModel):
    industry: str
    equipment: str
    fuel: str

    pm10: float
    pm25: float
    so2: float
    no2: float
    co: float
    voc: float

    ecoScore: int
    risk: str
    confidence: float

    recommendations: List[Recommendation]

    annualEmissions: AnnualEmissions