from copy import copy
from fastapi import APIRouter, Request, HTTPException, Depends, Body
from joblib import load
import pandas as pd
from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models import Patient
from schemas.patient import PatientCreate
from fastapi import Path

router = APIRouter()

antibiotic_columns = [
    "antibiotics_Augmentin",
    "antibiotics_Clindamycin",
    "antibiotics_Invanz",
    "antibiotics_Kefsol",
    "antibiotics_Rocephin"
]
procedure_category_columns = [
    "procedure_category_BPD -DS",
    "procedure_category_Mini gastric bypass (OAGB)",
    "procedure_category_RYGBP",
    "procedure_category_SADI",
    "procedure_category_Sleeve"
]

model_feature_order = [
    "age", "height", "weight", "bmi", "family_hist_cnt", "chronic_meds_cnt",
    "cholecystectomy_repair", "hiatus_hernia_repair",
    "CM_AIDS", "CM_ANEMDEF", "CM_ARTH", "CM_CHF", "CM_DEPRESS", "CM_DM", "CM_DMCX", "CM_HTN_C",
    "CM_HYPOTHY", "CM_LIVER", "CM_OBESE", "CM_PSYCH", "CM_SMOKE", "CM_APNEA", "CM_CHOLSTRL",
    "CM_OSTARTH", "CM_HPLD", "gender_Male",
    "procedure_category_BPD -DS", "procedure_category_Mini gastric bypass (OAGB)",
    "procedure_category_RYGBP", "procedure_category_SADI", "procedure_category_Sleeve",
    "antibiotics_Augmentin", "antibiotics_Clindamycin", "antibiotics_Invanz",
    "antibiotics_Kefsol", "antibiotics_Rocephin"
]

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


model = load("best_model_pipeline.pkl")

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

    # Calculate BMI
    try:
        height_m = copy(data_dict["height"]) / 100
        bmi = round(copy(data_dict["weight"]) / (copy(height_m) ** 2), 2)
    except ZeroDivisionError:
        bmi = 0.0
    except Exception:
        bmi = 0.0

    # ===========================
    # Predict Risk Using the Model
    try:
        # Prepare input for model
        model_input = data_dict.copy()

        # Remove non-model fields
        model_input.pop("name", None)
        model_input.pop("patient_notes", None)

        # Add calculated BMI
        model_input["bmi"] = bmi

        # One-hot encode antibiotics
        selected_ab = model_input.get("antibiotics", "")
        for ab_col in antibiotic_columns:
            model_input[ab_col] = 1 if ab_col.split("_")[1] == selected_ab else 0

        # Remove original string-based antibiotic field
        model_input.pop("antibiotics", None)

        # One-hot encode procedure_category
        selected_pc = model_input.get("procedure_category", "")
        for pc_col in procedure_category_columns:
            model_input[pc_col] = 1 if pc_col.split("_", 1)[1] == selected_pc else 0

        # Remove original string-based field (if model doesn’t expect it)
        model_input.pop("procedure_category", None)

        # Fill missing expected columns with 0
        for col in model_feature_order:
            if col not in model_input:
                model_input[col] = 0

        # Convert gender_Male from string to numeric (for model only)
        gender_str = model_input.get("gender_Male", "").lower()
        model_input["gender_Male"] = 1 if gender_str == "male" else 0

        # Convert numeric fields safely
        numeric_fields = [
            "age", "height", "weight", "family_hist_cnt", "chronic_meds_cnt",
            "cholecystectomy_repair", "hiatus_hernia_repair"
        ] + [cm for cm in model_input if cm.startswith("CM_")]

        for field in numeric_fields:
            val = model_input.get(field, 0)
            if val in [None, "", "n/a"]:
                print(f"[DEBUG] Field '{field}' has empty or invalid value: '{val}' — setting to 0.0")
                model_input[field] = 0.0
            else:
                try:
                    model_input[field] = float(val)
                except (ValueError, TypeError):
                    print(f"[DEBUG] Field '{field}' failed to convert: '{val}' — setting to 0.0")
                    model_input[field] = 0.0

        print("\n[DEBUG] Final model_input values before DataFrame creation:")
        for key in model_feature_order:
            val = model_input.get(key, None)
            print(f"  {key}: '{val}'")
        # Keep only the expected columns in correct order
        model_input_df = pd.DataFrame([[model_input[col] for col in model_feature_order]], columns=model_feature_order)

        model_input = model_input_df
        y_proba = model.predict_proba(model_input)[0, 1]
        risk_pred = round(float(y_proba) * 100, 2)  # scale to percentage
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
    # ===========================

    # Remove ML-only features that aren't in the database
    data_dict["gender"] = data_dict["gender_Male"]
    data_dict.pop("gender_Male", None)
    for ab in antibiotic_columns:
        data_dict.pop(ab, None)
    for pc in procedure_category_columns:
        data_dict.pop(pc, None)

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
    
    final = {
        "id": patient.idPatientInfo,
        "name": patient.name,
        "age": patient.age,
        "gender": patient.gender,
        "height": patient.height,
        "weight": patient.weight,
        "bmi": patient.bmi,
        "family_hist_cnt": patient.family_hist_cnt,
        "chronic_meds_cnt": patient.chronic_meds_cnt,
        "procedure_category": patient.procedure_category,
        "antibiotics": patient.antibiotics,
        "cholecystectomy_repair": convert_01_to_yesno(patient.cholecystectomy_repair),
        "hiatus_hernia_repair": convert_01_to_yesno(patient.hiatus_hernia_repair),
        "risk_pred": patient.risk_pred,
        "patient_notes": patient.patient_notes,
        "CM_AIDS": patient.CM_AIDS,
        "CM_ANEMDEF": patient.CM_ANEMDEF,
        "CM_ARTH": patient.CM_ARTH,
        "CM_CHF": patient.CM_CHF,
        "CM_DEPRESS": patient.CM_DEPRESS,
        "CM_DM": patient.CM_DM,
        "CM_DMCX": patient.CM_DMCX,
        "CM_HTN_C": patient.CM_HTN_C,
        "CM_HYPOTHY": patient.CM_HYPOTHY,
        "CM_LIVER": patient.CM_LIVER,
        "CM_OBESE": patient.CM_OBESE,
        "CM_PSYCH": patient.CM_PSYCH,
        "CM_SMOKE": patient.CM_SMOKE,
        "CM_APNEA": patient.CM_APNEA,
        "CM_CHOLSTRL": patient.CM_CHOLSTRL,
        "CM_OSTARTH": patient.CM_OSTARTH,
        "CM_HPLD": patient.CM_HPLD
    }

    return final


@router.put("/patient/{patient_id}/update")
def update_patient(
    patient_id: int,
    data: PatientCreate,
    request: Request,
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
        raise HTTPException(status_code=404, detail="Patient not found")

    data_dict = data.dict()

    # Convert 'yes'/'no' to 1/0
    data_dict["cholecystectomy_repair"] = convert_yes_no(data_dict["cholecystectomy_repair"])
    data_dict["hiatus_hernia_repair"] = convert_yes_no(data_dict["hiatus_hernia_repair"])

    # Calculate BMI
    try:
        height_m = copy(data_dict["height"]) / 100
        bmi = round(copy(data_dict["weight"]) / (height_m ** 2), 2)
    except ZeroDivisionError:
        bmi = 0.0
    except Exception:
        bmi = 0.0

    # ===========================
    # Predict Risk Using the Model
    try:
        model_input = data_dict.copy()
        model_input["bmi"] = bmi

        # Remove fields not needed for prediction
        model_input.pop("name", None)
        model_input.pop("patient_notes", None)

        # One-hot encode antibiotics
        selected_ab = model_input.get("antibiotics", "")
        for ab_col in antibiotic_columns:
            model_input[ab_col] = 1 if ab_col.split("_")[1] == selected_ab else 0
        model_input.pop("antibiotics", None)

        # One-hot encode procedure_category
        selected_pc = model_input.get("procedure_category", "")
        for pc_col in procedure_category_columns:
            model_input[pc_col] = 1 if pc_col.split("_", 1)[1] == selected_pc else 0
        model_input.pop("procedure_category", None)

        # Fill in any missing expected columns with 0
        for col in model_feature_order:
            if col not in model_input:
                model_input[col] = 0

        # Convert gender_Male from string to numeric (for model only)
        gender_str = model_input.get("gender_Male", "").lower()
        model_input["gender_Male"] = 1 if gender_str == "male" else 0

        # Safe numeric conversion
        numeric_fields = [
            "age", "height", "weight", "family_hist_cnt", "chronic_meds_cnt",
            "cholecystectomy_repair", "hiatus_hernia_repair", "gender_Male"
        ] + [cm for cm in model_input if cm.startswith("CM_")]

        for field in numeric_fields:
            val = model_input.get(field, 0)
            if val in [None, "", "n/a"]:
                print(f"[DEBUG] Field '{field}' has empty or invalid value: '{val}' — setting to 0.0")
                model_input[field] = 0.0
            else:
                try:
                    model_input[field] = float(val)
                except (ValueError, TypeError):
                    print(f"[DEBUG] Field '{field}' failed to convert: '{val}' — setting to 0.0")
                    model_input[field] = 0.0

        print("\n[DEBUG] Final model_input values before DataFrame creation:")
        for key in model_feature_order:
            val = model_input.get(key, None)
            print(f"  {key}: '{val}'")

        # Create DataFrame and predict
        model_input_df = pd.DataFrame([[model_input[col] for col in model_feature_order]], columns=model_feature_order)
        y_proba = model.predict_proba(model_input_df)[0, 1]
        risk_pred = round(float(y_proba) * 100, 2)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
    # ===========================

    # Clean fields that don't exist in DB
    data_dict["gender"] = data_dict["gender_Male"]
    data_dict.pop("gender_Male", None)
    for ab in antibiotic_columns:
        data_dict.pop(ab, None)
    for pc in procedure_category_columns:
        data_dict.pop(pc, None)

    # Update all patient fields
    for key, value in data_dict.items():
        setattr(patient, key, value)

    patient.bmi = bmi
    patient.risk_pred = risk_pred

    db.commit()
    return {"status": "success"}


@router.delete("/patient/{patient_id}/delete")
def delete_patient(
    patient_id: int,
    request: Request,
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

    db.delete(patient)
    db.commit()

    return {"status": "success"}