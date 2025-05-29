from starlette.middleware.sessions import SessionMiddleware
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import doctors, predict, patients

app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key="BIASSuperSecretKey")  # store in .env later

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(doctors.router)
app.include_router(predict.router)
app.include_router(patients.router)

@app.get("/")
def root():
    return {"status": "| API is running |"}