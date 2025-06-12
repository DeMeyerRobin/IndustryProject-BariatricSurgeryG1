from pydantic import BaseModel

class PatientCreate(BaseModel):
    name: str
    age: int
    gender_Male: str
    height: int
    weight: int
    family_hist_cnt: int
    chronic_meds_cnt: int
    procedure_category: str
    antibiotics: str
    patient_notes: str
    CM_DM: int
    CM_DMCX: int
    CM_HTN_C: int
    CM_LIVER: int
    CM_OBESE: int
    CM_APNEA: int
    CM_CHOLSTRL: int
    CM_OSTARTH: int
    CM_HPLD: int