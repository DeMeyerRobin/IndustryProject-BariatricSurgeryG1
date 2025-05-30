from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, predict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(predict.router)

@app.get("/")
def root():
    return {"status": "| API is running |"}