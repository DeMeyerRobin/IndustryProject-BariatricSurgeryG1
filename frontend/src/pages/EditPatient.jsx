import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/check-session", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (!data.logged_in) {
          navigate('/');
        } else {
          fetch(`http://localhost:8000/patient/${id}`, { credentials: 'include' })
            .then(res => res.json())
            .then(setPatient)
            .catch(() => alert("Failed to load patient"))
            .finally(() => setLoading(false));
        }
      });
  }, [id, navigate]);
  

  const handleChange = (field, value) => {
    setPatient(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = () => {
    const {
      bmi,
      risk_pred,
      idPatientInfo,
      fk_idDoctorInfo,
      id,
      ...cleanedPatient
    } = patient;
    

    // Set default 'no' for missing optional fields
    cleanedPatient.cholecystectomy_repair = cleanedPatient.cholecystectomy_repair || 'no';
    cleanedPatient.hiatus_hernia_repair = cleanedPatient.hiatus_hernia_repair || 'no';
    cleanedPatient.drain = cleanedPatient.drain || 'no';

    console.log(cleanedPatient);
  
    fetch(`http://localhost:8000/patient/${id}/update`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanedPatient)
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          navigate(`/patient/${id}`);
        } else {
          console.log(cleanedPatient);
          alert('Failed to update');
        }
      })
      .catch(err => console.error(err));
  };

  if (loading || !patient) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  const formStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '2rem auto'
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
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px'
  };

  const yesNoOptions = ['yes', 'no'];

  return (
    <div style={{ backgroundColor: '#F7FAFC', minHeight: '100vh', padding: '2rem' }}>
      <div style={formStyle}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Edit Patient</h2>

        {[
          { label: 'Full Name', field: 'name' },
          { label: 'Age', field: 'age', type: 'number' },
          { label: 'Height (cm)', field: 'height', type: 'number' },
          { label: 'Weight (kg)', field: 'weight', type: 'number' },
          { label: 'Family Surgery Count', field: 'family_surgery_cnt', type: 'number' },
          { label: 'Chronic Meds Count', field: 'chronic_meds_cnt', type: 'number' }
        ].map(({ label, field, type = 'text' }) => (
          <div key={field} style={fieldStyle}>
            <label style={labelStyle}>{label}</label>
            <input
              type={type}
              style={inputStyle}
              value={patient[field]}
              onChange={(e) => handleChange(field, e.target.value)}
            />
          </div>
        ))}

        <div style={fieldStyle}>
          <label style={labelStyle}>Gender</label>
          <select
            style={inputStyle}
            value={patient.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Procedure Category</label>
          <select
            style={inputStyle}
            value={patient.procedure_category}
            onChange={(e) => handleChange('procedure_category', e.target.value)}
          >
            <option value="">n/a</option>
            <option value="SADI">SADI</option>
            <option value="Sleeve">Sleeve</option>
            <option value="RYGBP">RYGBP</option>
            <option value="Mini gastric bypass (OAGB)">Mini gastric bypass (OAGB)</option>
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Antibiotics</label>
          <select
            style={inputStyle}
            value={patient.antibiotics}
            onChange={(e) => handleChange('antibiotics', e.target.value)}
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
          { label: 'Cholecystectomy Repair', field: 'cholecystectomy_repair' },
          { label: 'Hiatus Hernia Repair', field: 'hiatus_hernia_repair' },
          { label: 'Drain Used', field: 'drain' }
        ].map(({ label, field }) => (
          <div key={field} style={fieldStyle}>
            <label style={labelStyle}>{label}</label>
            <select
              style={inputStyle}
              value={patient[field]}
              onChange={(e) => handleChange(field, e.target.value)}
            >
              <option value="">n/a</option>
              {yesNoOptions.map(opt => (
                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
              ))}
            </select>
          </div>
        ))}
        <div style={fieldStyle}>
          <label style={labelStyle}>Patient Notes</label>
          <textarea
            style={{ ...inputStyle, height: '100px' }}
            value={patient.patient_notes || ''}
            onChange={(e) => handleChange('patient_notes', e.target.value)}
            placeholder="Any extra notes about the patient..."
          />
        </div>

        <button style={{ ...buttonStyle, backgroundColor: '#3182CE', color: 'white' }} onClick={handleUpdate}>
          Save Changes
        </button>
        <button style={{ ...buttonStyle, border: '1px solid #E2E8F0' }} onClick={() => navigate(`/patient/${id}`)}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditPatient;