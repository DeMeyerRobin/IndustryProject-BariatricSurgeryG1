import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const cmOptions = [
  'CM_AIDS', 'CM_ANEMDEF', 'CM_ARTH', 'CM_CHF', 'CM_DEPRESS',
  'CM_DM', 'CM_DMCX', 'CM_HTN_C', 'CM_HYPOTHY', 'CM_LIVER',
  'CM_OBESE', 'CM_PSYCH', 'CM_SMOKE', 'CM_APNEA', 'CM_CHOLSTRL',
  'CM_OSTARTH', 'CM_HPLD'
];

const EditPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comorbidities, setComorbidities] = useState([]);
  const [comorbidityErrors, setComorbidityErrors] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/check-session", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (!data.logged_in) {
          navigate('/');
        } else {
          fetch(`http://localhost:8000/patient/${id}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
              setPatient(data);
            
              const filled = cmOptions
                .filter(cm => data[cm] !== null && data[cm] !== undefined && data[cm] !== 0)
                .map(cm => ({ key: cm, value: data[cm] }));
            
              setComorbidities(filled);
            })
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
  
    // Reset all comorbidities to 0
    cmOptions.forEach(key => cleanedPatient[key] = 0);
  
    // Fill with values from current form state
    comorbidities.forEach(({ key, value }) => {
      if (key) cleanedPatient[key] = parseInt(value) || 0;
    });
  
    // Convert gender to gender_Male (1 if male, 0 otherwise)
    cleanedPatient.gender_Male = patient.gender
    delete cleanedPatient.gender; // Remove the original 'gender' field
  
    // Send update request
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
          { label: 'Family Surgery Count', field: 'family_hist_cnt', type: 'number' },
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

        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Comorbidities</h3>
          {comorbidities.map((cm, index) => (
            <div key={index} style={{ ...fieldStyle, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <select
                  style={{ ...inputStyle, flex: 1 }}
                  value={cm.key}
                  onChange={(e) => {
                    const newCm = [...comorbidities];
                    newCm[index].key = e.target.value;
                    setComorbidities(newCm);

                    const newErrors = [...comorbidityErrors];
                    newErrors[index] = !e.target.value;
                    setComorbidityErrors(newErrors);
                  }}
                >
                  <option value="">Select Condition</option>
                  {cmOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Severity (e.g., 1)"
                  style={{ ...inputStyle, flex: 1 }}
                  value={cm.value}
                  onChange={(e) => {
                    const newCm = [...comorbidities];
                    newCm[index].value = parseInt(e.target.value) || 0;
                    setComorbidities(newCm);
                  }}
                />
              </div>
              {comorbidityErrors[index] && (
                <span style={{ color: 'red', fontSize: '14px' }}>
                  Please select a condition.
                </span>
              )}
            </div>
          ))}
          <button
            onClick={() => setComorbidities([...comorbidities, { key: '', value: 0 }])}
            style={{
              marginTop: '8px',
              backgroundColor: '#EDF2F7',
              border: '1px solid #CBD5E0',
              borderRadius: '4px',
              padding: '6px 12px',
              cursor: 'pointer'
            }}
          >
            + Add Comorbidity
          </button>
        </div>
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