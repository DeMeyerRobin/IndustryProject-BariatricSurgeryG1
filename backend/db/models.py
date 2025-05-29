from sqlalchemy import Column, Integer, String, ForeignKey
from db.database import Base

class Doctor(Base):
    __tablename__ = "doctorinfo"

    idDoctorInfo = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255))

class Patient(Base):
    __tablename__ = "patientinfo"

    idPatientInfo = Column(Integer, primary_key=True, index=True)
    fk_idDoctorInfo = Column(Integer, ForeignKey("doctorinfo.idDoctorInfo"))
    name = Column("FullName", String)
    age = Column("Age", Integer)
    gender = Column("Gender", String)
    height = Column("Height(cm)", Integer)
    weight = Column("Weight(kg)", Integer)
    family_surgery_count = Column("FamilyHistCnt", Integer)
    chronic_meds_cnt = Column("ChronicMedsCnt", Integer)
    procedure_category = Column("ProcedureCategory", String)
    antibiotics = Column("Antibiotics", String)
    cholecystectomy_repair = Column("CholecystectomyRepair", String)
    hiatus_hernia_repair = Column("HiatusHerniaRepair", String)
    drain = Column("DrainUsed", String)