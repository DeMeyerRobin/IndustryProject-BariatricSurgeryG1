from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from schemas.doctor import DoctorAuth
from db.database import SessionLocal
from db.models import Doctor
import bcrypt

router = APIRouter()

def hash_password(plain_password: str) -> str:
    return bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(data: DoctorAuth, db: Session = Depends(get_db)):
    hashed_pw = hash_password(data.password)
    new_doctor = Doctor(email=data.email, password=hashed_pw)
    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)
    return {"status": "success", "doctor_id": new_doctor.idDoctorInfo}

@router.post("/login")
def login(request: Request, data: DoctorAuth, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.email == data.email).first()
    if not doctor or not verify_password(data.password, doctor.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # ✅ Store doctor ID in the session
    request.session["doctor_id"] = doctor.idDoctorInfo

    return {"status": "success", "doctor_id": doctor.idDoctorInfo}

@router.post("/logout")
def logout(request: Request):
    request.session.clear()
    return {"status": "success", "message": "Logged out"}

@router.get("/check-session")
def check_session(request: Request):
    doctor_id = request.session.get("doctor_id")
    if doctor_id is None:
        return {"logged_in": False}
    return {"logged_in": True, "doctor_id": doctor_id}