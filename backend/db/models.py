from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String, ForeignKey, Float
from db.database import Base

class Doctor(Base):
    __tablename__ = "doctorinfo"

    idDoctorInfo = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255))
    DateCreated = Column(DateTime, default=datetime.utcnow)

class Patient(Base):
    __tablename__ = "patientinfo"

    idPatientInfo = Column(Integer, primary_key=True, index=True)
    fk_idDoctorInfo = Column(Integer, ForeignKey("doctorinfo.idDoctorInfo"))
    name = Column("FullName", String)
    age = Column("Age", Integer)
    gender = Column("Gender", String)
    height = Column("Height(cm)", Integer)
    weight = Column("Weight(kg)", Integer)
    bmi = Column("Bmi", Float)
    family_surgery_cnt = Column("FamilyHistCnt", Integer)
    chronic_meds_cnt = Column("ChronicMedsCnt", Integer)
    procedure_category = Column("ProcedureCategory", String)
    antibiotics = Column("Antibiotics", String)
    cholecystectomy_repair = Column("CholecystectomyRepair", String)
    hiatus_hernia_repair = Column("HiatusHerniaRepair", String)
    drain = Column("DrainUsed", String)
    risk_pred = Column("ModelRiskPred", Float)