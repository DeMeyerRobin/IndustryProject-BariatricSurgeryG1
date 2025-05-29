from sqlalchemy import Column, Integer, String
from db.database import Base

class Doctor(Base):
    __tablename__ = "doctorinfo"

    idDoctorInfo = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255))