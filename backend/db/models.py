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
    family_hist_cnt = Column("FamilyHistCnt", Integer)
    chronic_meds_cnt = Column("ChronicMedsCnt", Integer)
    procedure_category = Column("ProcedureCategory", String)
    antibiotics = Column("Antibiotics", String)
    risk_pred = Column("ModelRiskPred", Float)
    weight_loss_pred = Column("WeightLossPred", Float)
    patient_notes = Column("PatientNotes", String)
    CM_DM = Column("CM_DM", Integer)
    CM_DMCX = Column("CM_DMCX", Integer)
    CM_HTN_C = Column("CM_HTN_C", Integer)
    CM_LIVER = Column("CM_LIVER", Integer)
    CM_OBESE = Column("CM_OBESE", Integer)
    CM_APNEA = Column("CM_APNEA", Integer)
    CM_CHOLSTRL = Column("CM_CHOLSTRL", Integer)
    CM_OSTARTH = Column("CM_OSTARTH", Integer)
    CM_HPLD = Column("CM_HPLD", Integer)