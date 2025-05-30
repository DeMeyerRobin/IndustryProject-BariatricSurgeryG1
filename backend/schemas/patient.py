from pydantic import BaseModel

class PatientCreate(BaseModel):
    name: str
    age: int
    gender: str
    height: int
    weight: int
    family_surgery_cnt: int
    chronic_meds_cnt: int
    procedure_category: str
    antibiotics: str
    cholecystectomy_repair: str
    hiatus_hernia_repair: str
    drain: str