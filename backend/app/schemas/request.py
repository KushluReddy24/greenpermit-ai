from pydantic import BaseModel

class PredictionRequest(BaseModel):
    industry: str
    equipment: str
    fuel: str
    ratedCapacity: float
    capacityUnit: str
    operatingHours: float
    daysPerYear: float
    loadFactor: float
    fuelConsumption: float
    fuelUnit: str
    apcd: str
    cems: bool