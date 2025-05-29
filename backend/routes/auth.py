from fastapi import APIRouter, HTTPException
from schemas.doctor import DoctorAuth
from fastapi import Depends
from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models import Doctor

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(data: DoctorAuth, db: Session = Depends(get_db)):
    new_doctor = Doctor(email=data.email, password=data.password)
    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)
    db.close()
    return {"status": "success", "doctor_id": new_doctor.idDoctorInfo}

@router.post("/login")
def login(data: DoctorAuth, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.email == data.email, Doctor.password == data.password).first()
    if not doctor:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"status": "success", "doctor_id": doctor.idDoctorInfo}