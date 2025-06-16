import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Text, Spinner, Heading, Flex, Button } from '@chakra-ui/react';

const AIExplanation = () => {
  const { patient_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');

  const getMinorMajorExplanation = (value) => {
    if (value === null || value === undefined) return null;
  
    const percent = value;
    if (percent > 50) {
      return {
        label: "Major complication",
        confidence: percent.toFixed(2),
      };
    } else {
      return {
        label: "Minor complication",
        confidence: (100 - percent).toFixed(2),
      };
    }
  };
  
  const minorMajor = getMinorMajorExplanation(patient?.minor_major_pred);

  useEffect(() => {
    fetch('http://localhost:8000/check-session', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (!data.logged_in) {
          navigate('/');
        } else {
          fetch(`http://localhost:8000/patient/${patient_id}`, {
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
  }, [patient_id, navigate]);

  if (loading) return <Box p={8}><Spinner /> Loading explainability...</Box>;
  if (error) return <Box p={8}><Text color="red.500">{error}</Text></Box>;

  return (
    <Box p={8} bg="gray.100" minH="100vh">
    <Button variant="ghost" onClick={() => navigate(`/patient/${patient_id}`)}>
        ← Back
    </Button>
      <Box bg="white" p={6} rounded="md" shadow="md" maxW="4xl" mx="auto">
        <Flex mt={6} direction="column" align="center">
        <Heading mb={4}>AI Explainability for {patient.name}</Heading>
        </Flex>

        {minorMajor && (
          <Box bg="blue.50" border="1px solid #bee3f8" p={4} rounded="md" mb={6} textAlign="center">
            <Text fontSize="lg" fontWeight="bold" color="blue.800">
              Predicted: {minorMajor.label}
            </Text>
            <Text fontSize="sm" color="blue.700">
              Confidence: {minorMajor.confidence}%
            </Text>
            <Text fontSize="xs" color="gray.600" mt={2}>
              This prediction estimates whether the complication—if one occurs—would likely be minor or major.
            </Text>
          </Box>
        )}


        {patient.saved_shap_positive_plot_path && (
          <Flex mt={6} direction="column" align="center">
            <Heading size="sm" mb={2}>Top Risk-Increasing Factors</Heading>
            <img
              src={`http://localhost:8000/${patient.saved_shap_positive_plot_path}`}
              alt="SHAP Positive Explanation"
              style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            {patient.feature_impact_positive.slice(0, 3).map(([feature, value], index) => (
              <Text key={index} fontSize="sm" color="gray.700">
                <strong>{feature}</strong> increases the risk by {value.toFixed(2)}%.
              </Text>
            ))}
            <Text fontSize="sm" color="gray.600" mt={4}>
              These factors each <strong>increase</strong> the predicted risk.
              The values explain how each feature <em>shifts</em> the AI's prediction
              relative to the baseline.
            </Text>
          </Flex>
        )}

        {patient.saved_shap_negative_plot_path && (
          <Flex mt={12} direction="column" align="center">
            <Heading size="sm" mb={2}>Top Risk-Reducing Factors</Heading>
            <img
              src={`http://localhost:8000/${patient.saved_shap_negative_plot_path}`}
              alt="SHAP Negative Explanation"
              style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            {patient.feature_impact_negative.slice(0, 3).map(([feature, value], index) => (
              <Text key={index} fontSize="sm" color="gray.700">
                <strong>{feature}</strong> helped reduce risk by {Math.abs(value).toFixed(2)}%.
              </Text>
            ))}
            <Text fontSize="sm" color="gray.600" mt={4}>
              These factors <strong>reduced</strong> the predicted risk.
              The values explain how each feature <em>lowers</em> the AI's prediction relative to the baseline.
            </Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default AIExplanation;