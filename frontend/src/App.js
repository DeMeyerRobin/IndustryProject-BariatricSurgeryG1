import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/MainPage';
import AddPatient from './pages/AddPatient';
import PatientDetail from './pages/PatientDetail';
import EditPatient from './pages/EditPatient';
import ProfilePage from './pages/ProfilePage';
import AIInfoRiskModel from './pages/AIInfoRiskModel';
import AIInfoWeightLossModel from './pages/AIInfoWeightLossModel';
import AIExplanation from './pages/AIExplanation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/AddPatient" element={<AddPatient />} />
        <Route path="/patient/:id" element={<PatientDetail />} />
        <Route path="/patient/:id/edit" element={<EditPatient />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/AI-info/risk-model" element={<AIInfoRiskModel />} />
        <Route path="/AI-info/weight-loss-model" element={<AIInfoWeightLossModel />} />
        <Route path="/explanation/:patient_id" element={<AIExplanation />} />
      </Routes>
    </Router>
  );
}

export default App;