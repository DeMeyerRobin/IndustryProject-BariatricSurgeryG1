import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Text, Spinner, Button } from '@chakra-ui/react';

const PatientScoreExplanation = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/check-session', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (!data.logged_in) {
          navigate('/');
        } else {
          fetch(`http://localhost:8000/patient/${patientId}`, {
            credentials: 'include'
          })
            .then(res => {
              if (!res.ok) throw new Error('Patient not found or access denied');
              return res.json();
            })
            .then(data => {
              setPatient(data);
              setLoading(false);
            })
            .catch(err => {
              setError(err.message);
              setLoading(false);
            });
        }
      })
      .catch(() => navigate('/'));
  }, [patientId, navigate]);

  if (loading) {
    return <Box p={8}><Spinner /> Loading explanation...</Box>;
  }

  if (error) {
    return <Box p={8}><Text color="red.500">{error}</Text></Box>;
  }

  const { name, age, risk_pred, patient_score } = patient;
  const raw_score = 100 - (0.5 * age + 1.2 * risk_pred);
  const calculated_score = Math.max(0, Math.min(100, Math.round(raw_score * 10) / 10));

  return (
    <Box bg="gray.100" minH="100vh" p={8}>
      <Box bg="white" p={6} rounded="md" shadow="md" maxW="2xl" mx="auto">
        <Heading mb={4}>Score Explanation for {name}</Heading>

        <Text mb={4}>
          The <strong>Patient Score</strong> is a synthetic value between <strong>0</strong> and <strong>100</strong>, intended to help prioritize patients based on their risk and age.
        </Text>

        <Text mb={2}><strong>Formula:</strong></Text>
        <Box fontFamily="monospace" fontSize="md" bg="gray.50" p={3} mb={4} borderRadius="md" border="1px solid #ddd">
          raw_score = 100 - (0.5 x age + 1.2 x risk_prediction)<br />
          patient_score = max(0, min(100, round(raw_score, 1)))
        </Box>

        <Text mb={3}>
          <strong>Age:</strong> {age} years<br />
          <strong>Risk Prediction:</strong> {risk_pred}%<br />
          <strong>Raw Score:</strong> {raw_score.toFixed(2)}<br />
          <strong>Final Patient Score:</strong> {calculated_score}
        </Text>

        <Text mt={4}>
          A <strong>high score</strong> means the patient is relatively <strong>young</strong> and has a <strong>low predicted risk</strong> of complications.
          These are typically <strong>good candidates</strong> for surgery and could be prioritized.
        </Text>

        <Text mt={2}>
          A <strong>low score</strong> may suggest that the patient has a higher risk or is older, so extra caution or alternative treatment might be considered.
        </Text>

        <Button mt={6} colorScheme="blue" onClick={() => navigate(`/patient/${patientId}`)}>
          Back to Patient File
        </Button>
      </Box>
    </Box>
  );
};

export default PatientScoreExplanation;