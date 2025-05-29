from fastapi import APIRouter

router = APIRouter()

@router.post("/predict")
def predict():
    return {"success_rate": 87.3}