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
├── AI-Models/                         # Jupyter Notebooks for building AI models
│   ├── BIASmodel_making_1.ipynb
│   ├── Risk_Pred_Model.ipynb
│   ├── ROB_minor_major.ipynb
│   └── weight_loss.ipynb
│
├── backend/                          # FastAPI backend and database setup
│   ├── db/
│   │   ├── database.py              # SQLAlchemy engine and Base
│   │   └── models.py                # SQLAlchemy models
│   ├── routes/                      # FastAPI route definitions
│   ├── schemas/                     # Pydantic schemas
│   ├── main.py                      # Main FastAPI application
│   ├── backend_requirements.txt     # Python dependencies for backend
│   ├── database_migration.py        # Script for table creation
│   ├── database_requirements.txt    # Database requirements for database_venv
│   ├── docker-compose.yml           # Docker setup for database
│   ├── minor_major_model.pkl        # Minor_major classifier model
│   ├── shap_background.csv          # Background SHAP data, needed for SHAP graph generation
│   ├── SMOTE_logReg_risk_model.pkl  # Risk prediction model
│   └── weight_loss_pipeline.pkl     # Model for predicting weight loss
│
├── frontend/                        # React.js frontend interface
│   ├── public/                     # Static assets (index.html, etc.)
│   ├── src/                        # React component source code
│   ├── package.json                # NPM package config
│   └── package-lock.json           # NPM lock file
```

## 🔧 Technologies Used

- **Python** for AI modeling and FastAPI backend
- **React.js** with Chakra UI for the frontend
- **SQLAlchemy** for local database integration
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

(in a fresh terminal)
```bash
cd backend/
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

Be sure to first install [node.js](https://nodejs.org/)

Then to start the frontend, run:

(in a fresh terminal)
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
