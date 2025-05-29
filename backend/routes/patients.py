from fastapi import APIRouter, Request, HTTPException, Depends, Body
from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models import Patient
from schemas.patient import PatientCreate

router = APIRouter()

def convert_yes_no(value):
    if value.lower() == "yes":
        return 1
    elif value.lower() == "no":
        return 0
    return None  # fallback for "n/a" or blank

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/add_patient")
async def add_patient(
    data: PatientCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    doctor_id = request.session.get("doctor_id")

    if not doctor_id:
        raise HTTPException(status_code=401, detail="Not logged in")

    data_dict = data.dict()

    # Convert 'yes'/'no' to 1/0
    data_dict["cholecystectomy_repair"] = convert_yes_no(data_dict["cholecystectomy_repair"])
    data_dict["hiatus_hernia_repair"] = convert_yes_no(data_dict["hiatus_hernia_repair"])
    data_dict["drain"] = convert_yes_no(data_dict["drain"])

    new_patient = Patient(
        fk_idDoctorInfo=doctor_id,
        **data_dict
    )

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    return {"status": "success", "patient_id": new_patient.idPatientInfo}