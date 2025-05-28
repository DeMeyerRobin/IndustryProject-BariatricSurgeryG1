from fastapi import APIRouter
from schemas.user import UserAuth

router = APIRouter()

@router.post("/register")
def register(data: UserAuth):
    print(f"Registering {data.email}")
    return {"status": "success", "message": "Registered (mocked)"}

@router.post("/login")
def login(data: UserAuth):
    print(f"Logging in {data.email}")
    return {"status": "success", "message": "Logged in (mocked)"}