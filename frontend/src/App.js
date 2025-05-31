import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/MainPage';
import AddPatient from './pages/AddPatient';
import PatientDetail from './pages/PatientDetail';
import EditPatient from './pages/EditPatient';
import ProfilePage from './pages/ProfilePage';

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
      </Routes>
    </Router>
  );
}

export default App;