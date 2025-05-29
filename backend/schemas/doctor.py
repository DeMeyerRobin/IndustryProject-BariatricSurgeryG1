from pydantic import BaseModel

class DoctorAuth(BaseModel):
    email: str
    password: str