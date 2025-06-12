from starlette.middleware.sessions import SessionMiddleware
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import doctors, patients
from dotenv import load_dotenv
import os
from fastapi.staticfiles import StaticFiles



load_dotenv()
app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(doctors.router)
app.include_router(patients.router)


app.mount("/shap_plots", StaticFiles(directory="shap_plots"), name="shap_plots")

@app.get("/")
def root():
    return {"status": "| API is running |"}