import copy
from fastapi import APIRouter, Request, HTTPException, Depends, Body
from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models import Patient
from schemas.patient import PatientCreate
from fastapi import Path

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

    # Calculate BMI
    try:
        height_m = copy(data_dict["height"]) / 100
        bmi = round(copy(data_dict["weight"]) / (copy(height_m) ** 2), 2)
    except ZeroDivisionError:
        bmi = 0.0
    except Exception as e:
        bmi = 0.0



    # MODEL PREDICTION COMES HERE
    # ===========================
    risk_pred = float(round((copy(data_dict["weight"]) / 10) * 2, 2))
    # ===========================



    new_patient = Patient(
        fk_idDoctorInfo=doctor_id,
        bmi=bmi,
        risk_pred=risk_pred,
        **data_dict
    )

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    return {"status": "success", "patient_id": new_patient.idPatientInfo}

@router.get("/patient/{patient_id}")
async def get_patient(
    patient_id: int = Path(..., description="ID of the patient to fetch"),
    request: Request = None,
    db: Session = Depends(get_db)
):
    doctor_id = request.session.get("doctor_id")

    if not doctor_id:
        raise HTTPException(status_code=401, detail="Not logged in")

    patient = db.query(Patient).filter(
        Patient.idPatientInfo == patient_id,
        Patient.fk_idDoctorInfo == doctor_id
    ).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found or access denied")

    def convert_01_to_yesno(value: int) -> str:
        return "yes" if value == 1 else "no"

    return {
        "id": patient.idPatientInfo,
        "name": patient.name,
        "age": patient.age,
        "gender": patient.gender,
        "height": patient.height,
        "weight": patient.weight,
        "bmi": patient.bmi,
        "family_surgery_cnt": patient.family_surgery_cnt,
        "chronic_meds_cnt": patient.chronic_meds_cnt,
        "procedure_category": patient.procedure_category,
        "antibiotics": patient.antibiotics,
        "cholecystectomy_repair": convert_01_to_yesno(patient.cholecystectomy_repair),
        "hiatus_hernia_repair": convert_01_to_yesno(patient.hiatus_hernia_repair),
        "drain": convert_01_to_yesno(patient.drain),
        "risk_pred": patient.risk_pred
    }


@router.put("/patient/{patient_id}/update")
def update_patient(patient_id: int, data: PatientCreate, request: Request, db: Session = Depends(get_db)):
    doctor_id = request.session.get("doctor_id")
    if not doctor_id:
        raise HTTPException(status_code=401)

    patient = db.query(Patient).filter(
        Patient.idPatientInfo == patient_id,
        Patient.fk_idDoctorInfo == doctor_id
    ).first()
    if not patient:
        raise HTTPException(status_code=404)

    data_dict = data.dict()

    # Convert 'yes'/'no' to 1/0 like in /add_patient
    data_dict["cholecystectomy_repair"] = convert_yes_no(data_dict["cholecystectomy_repair"])
    data_dict["hiatus_hernia_repair"] = convert_yes_no(data_dict["hiatus_hernia_repair"])
    data_dict["drain"] = convert_yes_no(data_dict["drain"])

    # Update patient fields
    for key, value in data_dict.items():
        setattr(patient, key, value)

    # Recalculate BMI & risk prediction
    try:
        height_m = patient.height / 100
        patient.bmi = round(patient.weight / (height_m ** 2), 2)

        # MODEL PREDICTION COMES HERE
        # ===========================
        patient.risk_pred = round((patient.weight / 100) * 2, 2)
        # ===========================


        
    except:
        patient.bmi = 0.0
        patient.risk_pred = 0.0

    db.commit()
    return {"status": "success"}