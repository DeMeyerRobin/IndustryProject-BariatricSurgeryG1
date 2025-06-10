// src/pages/PatientDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Text, Spinner, Button } from '@chakra-ui/react';

const cmOptions = [
  'CM_AIDS', 'CM_ANEMDEF', 'CM_ARTH', 'CM_CHF', 'CM_DEPRESS',
  'CM_DM', 'CM_DMCX', 'CM_HTN_C', 'CM_HYPOTHY', 'CM_LIVER',
  'CM_OBESE', 'CM_PSYCH', 'CM_SMOKE', 'CM_APNEA', 'CM_CHOLSTRL',
  'CM_OSTARTH', 'CM_HPLD'
];

const PatientDetail = () => {
  const { id } = useParams();
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
          fetch(`http://localhost:8000/patient/${id}`, {
            credentials: 'include'
          })
            .then(res => {
              if (!res.ok) throw new Error('Patient not found or access denied');
              return res.json();
            })
            .then(data => {
              setPatient(data);
              console.log(data);
              setLoading(false);
            })
            .catch(err => {
              setError(err.message);
              setLoading(false);
            });
        }
      })
      .catch(() => navigate('/'));
  }, [id, navigate]);

  if (loading) {
    return <Box p={8}><Spinner /> Loading patient details...</Box>;
  }

  if (error) {
    return <Box p={8}><Text color="red.500">{error}</Text></Box>;
  }

  return (
    <Box bg="gray.100" minH="100vh" p={8}>
      <Box bg="white" p={6} rounded="md" shadow="md" maxW="xl" mx="auto">
        <Heading mb={6}>Patient Details</Heading>

        <Box mb={3}><Text><strong>Name:</strong> {patient.name}</Text></Box>
        <Box mb={3}><Text><strong>Age:</strong> {patient.age}</Text></Box>
        <Box mb={3}><Text><strong>Gender:</strong> {patient.gender}</Text></Box>
        <Box mb={3}><Text><strong>Height:</strong> {patient.height} cm</Text></Box>
        <Box mb={3}><Text><strong>Weight:</strong> {patient.weight} kg</Text></Box>
        <Box mb={3}><Text><strong>Bmi:</strong> {patient.bmi}</Text></Box>
        <Box mb={3}><Text><strong>Family Surgery Count:</strong> {patient.family_hist_cnt}</Text></Box>
        <Box mb={3}><Text><strong>Chronic Meds Count:</strong> {patient.chronic_meds_cnt}</Text></Box>
        <Box mb={3}><Text><strong>Procedure Category:</strong> {patient.procedure_category}</Text></Box>
        <Box mb={3}><Text><strong>Antibiotics:</strong> {patient.antibiotics}</Text></Box>
        <Box mb={3}><Text><strong>Cholecystectomy Repair:</strong> {patient.cholecystectomy_repair}</Text></Box>
        <Box mb={3}><Text><strong>Hiatus Hernia Repair:</strong> {patient.hiatus_hernia_repair}</Text></Box>
        <Box mb={6}>
        <Heading size="md" mb={3}>Comorbidities</Heading>
        {cmOptions
          .filter(key => patient[key] !== 0 && patient[key] !== null && patient[key] !== undefined)
          .map(key => (
            <Box key={key} mb={2}>
              <Text>
                <strong>{key.replace('CM_', '').replace('_', ' ')}:</strong>{" "}
                {patient[key]}
              </Text>
            </Box>
        ))}
      </Box>
        <Box mb={10}><Text><strong>Patient Notes:</strong> {patient.patient_notes}</Text></Box>
        <Box mb={6}>
          <Text mb={2}><strong>BMI Class:</strong> {
            patient.bmi < 18.5 ? 'Underweight' :
            patient.bmi < 25 ? 'Normal weight' :
            patient.bmi < 30 ? 'Overweight' :
            patient.bmi < 35 ? 'Obesity Class I' :
            patient.bmi < 40 ? 'Obesity Class II' :
            'Obesity Class III'
          }</Text>

          {(patient.bmi >= 25 || patient.risk_pred > 10) && patient.age > 0 && patient.height > 0 && patient.weight > 0 ? (
            <>
              <Text mb={2}><strong>AI Risk Prediction For Bariatric Surgery:</strong> {patient.risk_pred}%</Text>
              <Box w="100%" h="20px" bg="gray.200" borderRadius="md" overflow="hidden">
                <Box
                  h="100%"
                  w={`${patient.risk_pred}%`}
                  bg={
                    patient.risk_pred < 10
                      ? 'green.400'
                      : patient.risk_pred < 40
                      ? 'orange.400'
                      : 'red.500'
                  }
                  transition="width 0.5s ease-in-out"
                />
              </Box>

              <Text mt={2} fontSize="sm" color="gray.600">
                {
                  patient.risk_pred < 10
                    ? 'Mild Risk – Likely a good candidate for surgery.'
                    : patient.risk_pred < 40
                    ? 'Moderate Risk – Caution advised; additional assessment recommended.'
                    : 'High Risk – Bariatric surgery may not be advisable without further evaluation.'
                }
              </Text>
              <Text mt={3} fontSize="sm" color="gray.500">
                This AI model is approximately 70% accurate.{" "}
                <Text
                  as="span"
                  color="blue.500"
                  textDecoration="underline"
                  cursor="pointer"
                  onClick={() => navigate('/AI-info')}
                >
                  Learn more
                  </Text>
                </Text>
                {patient.weight_loss_pred !== undefined && (
                <Box mt={8}>
                  <Text mb={2}><strong>Expected Weight Loss After Surgery:</strong> {patient.weight_loss_pred}%</Text>
                  <Box w="100%" h="20px" bg="gray.200" borderRadius="md" overflow="hidden">
                    <Box
                      h="100%"
                      w={`${patient.weight_loss_pred}%`}
                      bg={
                        patient.weight_loss_pred >= 30
                          ? 'green.400'
                          : patient.weight_loss_pred >= 15
                          ? 'orange.400'
                          : 'red.500'
                      }
                      transition="width 0.5s ease-in-out"
                    />
                  </Box>
                  <Text mt={2} fontSize="sm" color="gray.600">
                    {patient.weight_loss_pred >= 30
                      ? '✅ Strong expected improvement in patient weight.'
                      : patient.weight_loss_pred >= 15
                      ? '⚠️ Moderate weight loss predicted – encourage additional lifestyle change.'
                      : '❗️Low predicted impact – consult clinical team for further action.'}
                  </Text>
                </Box>
                )}

            </>
          ) : (
            <><Text mb={2}><strong>AI Risk Prediction For Bariatric Surgery:</strong> </Text><Text mt={2} fontSize="sm" color={patient.bmi < 25 ? "green.600" : "orange.600"}>
                {patient.age > 0 && patient.height > 0 && patient.weight > 0
                  ? '✅ No bariatric surgery required – Patient appears healthy.'
                  : '⚠️ Not enough information to assess risk. Please ensure that at least, age, height, and weight are provided.'}
              </Text></>
          )}

        </Box>

        <Box display="flex" gap={3} mt={6}>
          <Button onClick={() => navigate('/dashboard')} colorScheme="blue">
            Back to Dashboard
          </Button>
          <Button
            onClick={() => navigate(`/patient/${id}/edit`)}
            variant="outline"
            borderColor="gray.300"
            color="black"
            _hover={{ bg: "gray.100" }}
          >
            Edit File
          </Button>
          <Button
            bg="red.500"
            color="white"
            _hover={{ bg: "red.600" }}
            _active={{ bg: "red.700" }}
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this patient?")) {
                fetch(`http://localhost:8000/patient/${id}/delete`, {
                  method: 'DELETE',
                  credentials: 'include',
                })
                  .then(res => res.json())
                  .then(data => {
                    if (data.status === 'success') {
                      alert("Patient deleted successfully.");
                      navigate('/dashboard');
                    } else {
                      alert("Failed to delete patient.");
                    }
                  })
                  .catch(err => {
                    console.error("Delete failed", err);
                    alert("An error occurred while deleting the patient.");
                  });
              }
            }}
          >
            Delete Patient
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PatientDetail;