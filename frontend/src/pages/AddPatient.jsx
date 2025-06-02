// src/pages/AddPatient.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AddPatient = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [familySurgeryCnt, setFamilySurgeryCount] = useState('');
  const [chronicMedsCnt, setChronicMedsCnt] = useState('');
  const [procedureCategory, setProcedureCategory] = useState('');
  const [antibiotics, setAntibiotics] = useState('');
  const [cholecystectomyRepair, setCholecystectomyRepair] = useState('');
  const [hiatusHerniaRepair, setHiatusHerniaRepair] = useState('');
  const [drain, setDrain] = useState('');
  const [nameError, setNameError] = useState('');
  const [patientNotes, setPatientNotes] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/check-session', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (!data.logged_in) {
          navigate('/');
        } else {
          console.log("Logged-in doctor ID:", data.doctor_id);
          // Optionally store in state:
          // setDoctorId(data.doctor_id);
        }
      })
      .catch(err => {
        console.error("Session check failed", err);
        navigate('/');
      });
  }, [navigate]);

  const handleSubmit = () => {
      if (!name.trim()) {
        setNameError("Full name is required.");
        return;
      } else {
        setNameError("");
      }
    
      const parseOrZero = (val) => val ? parseInt(val) : 0;
    
      const patientData = {
        name,
        age: parseOrZero(age),
        gender,
        height: parseOrZero(height),
        weight: parseOrZero(weight),
        family_surgery_cnt: parseOrZero(familySurgeryCnt),
        chronic_meds_cnt: parseOrZero(chronicMedsCnt),
        procedure_category: procedureCategory,
        antibiotics,
        cholecystectomy_repair: cholecystectomyRepair,
        hiatus_hernia_repair: hiatusHerniaRepair,
        drain,
        patient_notes: patientNotes
      };
    
      fetch("http://localhost:8000/add_patient", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(patientData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === "success") {
            console.log("Patient saved with ID:", data.patient_id);
            navigate(`/patient/${data.patient_id}`);
          } else {
            console.error("Failed to save patient:", data);
            alert("Something went wrong when saving the patient.");
          }
        })
        .catch(err => {
          console.error("Network or server error:", err);
          alert("Network error. Try again later.");
        });
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
          <label style={labelStyle}>What is the patient's full name?</label>
          <input
            style={inputStyle}
            placeholder="Full Name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.trim()) setNameError("");
            }}
          />
          {nameError && (
            <span style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>
              {nameError}
            </span>
          )}
        </div>
        {[
          { label: "How old is the patient?", value: age, setter: setAge, type: "number" },
          { label: "Patient's height (cm)?", value: height, setter: setHeight, type: "number" },
          { label: "Patient's weight (kg)?", value: weight, setter: setWeight, type: "number" },
          { label: "Previous number of family surgeries?", value: familySurgeryCnt, setter: setFamilySurgeryCount, type: "number" },
          { label: "Number of chronic medications?", value: chronicMedsCnt, setter: setChronicMedsCnt, type: "number" }
        ].map(({ label, value, setter, type }, idx) => (
          <div key={idx} style={fieldStyle}>
            <label style={labelStyle}>{label}</label>
            <input
              style={inputStyle}
              placeholder={label}
              type={type}
              value={value}
              onChange={(e) => setter(e.target.value)}
            />
          </div>
        ))}

        <div style={fieldStyle}>
          <label style={labelStyle}>Procedure category</label>
          <select
            style={inputStyle}
            value={procedureCategory}
            onChange={(e) => setProcedureCategory(e.target.value)}
          >
            <option value="">n/a</option>
            <option value="SADI">SADI</option>
            <option value="Sleeve">Sleeve</option>
            <option value="RYGBP">RYGBP</option>
            <option value="Mini gastric bypass (OAGB)">Mini gastric bypass (OAGB)</option>
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Antibiotic given</label>
          <select
            style={inputStyle}
            value={antibiotics}
            onChange={(e) => setAntibiotics(e.target.value)}
          >
            <option value="">n/a</option>
            <option value="Kefsol">Kefsol</option>
            <option value="Augmentin">Augmentin</option>
            <option value="Clindamycin">Clindamycin</option>
            <option value="Invanz">Invanz</option>
            <option value="Rocephin">Rocephin</option>
          </select>
        </div>

        {[
          { label: "Cholecystectomy repair?", value: cholecystectomyRepair, setter: setCholecystectomyRepair },
          { label: "Hiatus hernia repair?", value: hiatusHerniaRepair, setter: setHiatusHerniaRepair },
          { label: "Drain used?", value: drain, setter: setDrain }
        ].map(({ label, value, setter }, idx) => (
          <div key={idx} style={fieldStyle}>
            <label style={labelStyle}>{label}</label>
            <select
              style={inputStyle}
              value={value}
              onChange={(e) => setter(e.target.value)}
            >
              <option value="">n/a</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        ))}

        <div style={fieldStyle}>
          <label style={labelStyle}>What is the patient's gender?</label>
          <select
            style={inputStyle}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Patient Notes</label>
          <textarea
            style={{ ...inputStyle, height: '100px' }}
            placeholder="Any extra notes for this patient"
            value={patientNotes}
            onChange={(e) => setPatientNotes(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button style={buttonStyle} onClick={handleSubmit}>
            Submit
          </button>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: '#E2E8F0',
              color: '#1A202C'
            }}
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPatient;