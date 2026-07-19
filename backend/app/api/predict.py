from fastapi import APIRouter
import pandas as pd
import joblib

from pathlib import Path

from app.schemas.request import PredictionRequest
from app.schemas.response import PredictionResponse, Recommendation, AnnualEmissions
MODEL_PATH = Path(__file__).resolve().parents[2] / "pipeline.pkl"

pipeline = joblib.load(MODEL_PATH)
router = APIRouter(prefix="/predict", tags=["Prediction"])


def calculate_eco_score(pm10, pm25, so2, no2, co, voc):
    score = 100 - (
        pm10 * 0.15
        + pm25 * 0.20
        + so2 * 0.15
        + no2 * 0.15
        + co * 0.20
        + voc * 0.15
    )

    return max(0, min(100, round(score)))


def calculate_risk(score):
    if score >= 80:
        return "LOW"
    elif score >= 60:
        return "MEDIUM"
    return "HIGH"


def generate_recommendations(pm10, pm25, so2, no2, co, voc):
    recommendations = []

    if pm10 > 15 or pm25 > 10:
        recommendations.append(
            Recommendation(
                title="Improve Particulate Control",
                detail="Upgrade or maintain the air pollution control device to reduce particulate emissions.",
                impact="High",
            )
        )

    if so2 > 8:
        recommendations.append(
            Recommendation(
                title="Switch to Cleaner Fuel",
                detail="Lower sulphur fuel can significantly reduce SO₂ emissions.",
                impact="High",
            )
        )

    if co > 2:
        recommendations.append(
            Recommendation(
                title="Optimize Combustion",
                detail="Improve combustion efficiency to reduce CO emissions.",
                impact="Medium",
            )
        )

    if not recommendations:
        recommendations.append(
            Recommendation(
                title="Maintain Current Operations",
                detail="Current emission levels are within expected limits.",
                impact="Low",
            )
        )

    return recommendations

@router.post("/", response_model=PredictionResponse)
def predict(request: PredictionRequest):

    features = pd.DataFrame([{
        "Industry Type": request.industry,
        "Equipment": request.equipment,
        "Fuel Type": request.fuel,
        "Any CEMS installed? Yes/No.": "Yes" if request.cems else "No",
        "Rated capacity": request.ratedCapacity,
        "Capacity Unit (TPH / MW / kVA / (cal/hr))": request.capacityUnit,
        "Avg hours/day:": request.operatingHours,
        "Days/Year": request.daysPerYear,
        "Load factor - non DG set (%):": request.loadFactor,
        "Avg Fuel used per day:(kg/kl/kw)": request.fuelConsumption,
        "Fuel unit per day (kg/kl)": request.fuelUnit,
        "APCD Type": request.apcd,
    }])

    prediction = pipeline.predict(features)[0]

    pm10 = float(prediction[0])
    pm25 = float(prediction[1])
    so2 = float(prediction[2])
    no2 = float(prediction[3])
    co = float(prediction[4])
    voc = float(prediction[5])
    annual_pm10 = pm10 * request.operatingHours * request.daysPerYear
    annual_pm25 = pm25 * request.operatingHours * request.daysPerYear
    annual_so2 = so2 * request.operatingHours * request.daysPerYear
    annual_no2 = no2 * request.operatingHours * request.daysPerYear
    annual_co = co * request.operatingHours * request.daysPerYear
    annual_voc = voc * request.operatingHours * request.daysPerYear

    eco_score = calculate_eco_score(
        pm10,
        pm25,
        so2,
        no2,
        co,
        voc,
    )

    risk = calculate_risk(eco_score)

    recommendations = generate_recommendations(
        pm10,
        pm25,
        so2,
        no2,
        co,
        voc,
    )

    return PredictionResponse(
        industry=request.industry,
        equipment=request.equipment,
        fuel=request.fuel,
        pm10=pm10,
        pm25=pm25,
        so2=so2,
        no2=no2,
        co=co,
        voc=voc,
        ecoScore=eco_score,
        risk=risk,
        confidence=0.94,
        recommendations=recommendations,
        annualEmissions=AnnualEmissions( pm10=annual_pm10,pm25=annual_pm25,so2=annual_so2,no2=annual_no2, co=annual_co, voc=annual_voc)
    )