// src/pages/AddPatient.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddPatient = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log({ name, age, gender }); // Later: send to backend
    navigate('/dashboard');
  };

  const containerStyle = {
    backgroundColor: '#F7FAFC',
    minHeight: '100vh',
    padding: '32px'
  };

  const formStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    margin: '0 auto'
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px'
  };

  const fieldStyle = {
    marginBottom: '16px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#4A5568'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #E2E8F0',
    borderRadius: '4px',
    fontSize: '16px'
  };

  const buttonStyle = {
    backgroundColor: '#3182CE',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '16px'
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h1 style={headingStyle}>Add New Patient</h1>
        
        <div style={fieldStyle}>
          <label style={labelStyle}>
            What is the patient's full name?
          </label>
          <input
            style={inputStyle}
            placeholder="Enter patient's full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>
            How old is the patient?
          </label>
          <input
            style={inputStyle}
            placeholder="Enter age in years"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>
            What is the patient's gender?
          </label>
          <select
            style={inputStyle}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <button style={buttonStyle} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddPatient;