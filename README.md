# Bariatric Surgery Complication Risk Analysis with AI

This project focuses on predicting the risk of post-operative complications for patients undergoing bariatric surgery. It utilizes machine learning models to assist healthcare professionals in assessing patient outcomes and identifying potential risks early in the process.

## 🧠 Project Overview

The goal is to develop an AI-driven system that analyzes patient data (such as demographics, comorbidities, and surgical details) and predicts the likelihood of post-surgical complications. The project incorporates a complete pipeline including:

- Data preprocessing and cleaning
- Feature engineering
- Machine learning modeling (Logistic Regression, Lasso, etc.)
- SHAP-based explainability
- Frontend display using React.js
- Backend API using FastAPI
- Database MySQL with Docker

## 📁 File Structure

```
IndustryProject-BariatricSurgeryG1/
├── ai_model/                 # Python scripts related to data cleaning, feature selection, model training and SHAP explainability
│   ├── shap_background.csv   # Background data used for SHAP explainability
│   └── model_pipeline.pkl    # Trained model pipeline
│
├── backend/                  # FastAPI backend serving model predictions
│   ├── main.py               # Main FastAPI server
│   ├── endpoints/            # Endpoint definitions
│   └── db/                   # SQLite or SQLAlchemy ORM models
│
├── frontend/                 # React.js frontend for user interaction
│   ├── src/                  # Source code for components and pages
│   └── public/               # Public assets like logos or index.html
│
├── data/                     # Datasets used in the project (anonymized patient data)
│
├── shap_plots/               # Saved SHAP waterfall plots for individual patient predictions
│
├── .gitignore
├── Dockerfile
├── docker-compose.yml
└── README.md                 # Project documentation (this file)
```

## 🔧 Technologies Used

- **Python** for AI modeling and FastAPI backend
- **React.js** with Chakra UI for the frontend
- **SQLite / SQLAlchemy** for local database integration
- **SHAP** for model interpretability
- **Docker** and `docker-compose` for containerization

## 🚀 How to Run

### Clone the Repository
```bash
git clone https://github.com/DeMeyerRobin/IndustryProject-BariatricSurgeryG1.git
cd IndustryProject-BariatricSurgeryG1
```

### Start the Application
To start this application we need 3 running parts:
1. Database in docker
2. The Backend
3. The Frontend

---
🔷 Database in docker

Make sure Docker and Python is installed, then run:
```bash
cd backend/
python3 -m venv database_venv
source ./database_venv/bin/activate
pip install -r database_requirements.txt
docker-compose up --build -d
```
Then run:
```bash
python3 database_migration.py
```
---
🔷 The Backend

To start the backend, run:

(if the terminal is not already in backend folder)
```bash
cd backend/
```
then:
```bash
python3 -m venv backend_venv
source ./backend_venv/bin/activate
pip install -r backend_requirements.txt
```
And at last:
```bash
./backend_venv/bin/python -m uvicorn main:app --reload
```
---
🔷 The Frontend

To start the frontend, run:

```bash
cd frontend/
npm install
```
then:
```bash
npm start
```
---

The frontend will be available at `http://localhost:3000`, the backend at `http://localhost:8000` and the database at `localhost:3307/DoctorDb`.

## 📊 Explanation

- Each patient is assessed using a trained model, with SHAP used to generate visual explanations of feature importance.
- Risk scores, minor/major risk classifications, and top features are displayed to the user.

## 🧪 Testing

You can test model predictions by accessing the frontend and inputting patient data or directly using the API endpoints via Postman.

## 📩 Contact

For more information or to report issues, please contact:

- [Tobias Pottier](https://github.com/TobiasPottier)
- [Wout Crombez](https://github.com/CrombezWout)
- [Robin De Meyer](https://github.com/DeMeyerRobin)

---

> **Disclaimer**: This tool is for research and educational purposes only. It should not be used as a sole decision-making tool in clinical settings.