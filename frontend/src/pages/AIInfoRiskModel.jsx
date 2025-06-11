import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const AIInfoRiskModel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/check-session', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (!data.logged_in) {
          navigate('/');
        } else {
          setLoading(false);
        }
      })
      .catch(() => navigate('/'));
  }, [navigate]);

  if (loading) {
    return <Box p={8}><Spinner /> Loading AI information...</Box>;
  }

  return (
    <Box bg="gray.100" minH="100vh" p={8}>
      <Box bg="white" p={6} rounded="md" shadow="md" maxW="4xl" mx="auto">
        <Heading mb={6}>About the AI Risk Prediction Model</Heading>

        <Box mb={5}>
            <Heading size="md" mb={2}>Model Overview</Heading>
            <Text>
                This AI model is trained to predict the risk of post-operative complications for patients undergoing bariatric surgery.
                It was developed using a dataset of anonymized patient records and trained using a gradient boosting algorithm (
                <a
                href="https://xgboost.readthedocs.io/en/stable/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'underline', color: '#3182ce' }} // Chakra UI blue.500
                >
                XGBoost
                </a>
                ), which is known for high performance with tabular medical data.
            </Text>
        </Box>

        <Box mb={5}>
          <Heading size="md" mb={2}>Model Features</Heading>
          <Text>
            The model takes into account multiple factors including:
            age, gender, BMI, comorbidities (e.g., diabetes, hypertension), procedure type, and antibiotic use.
          </Text>
        </Box>

        <Box mb={5}>
          <Heading size="md" mb={2}>Accuracy</Heading>
          <Text>
            The model achieves an estimated accuracy of 70% on unseen data. This means it correctly predicts about 7 out of 10 patient cases. 
            However, it should not be used as a replacement for medical judgment — it is a decision-support tool.
          </Text>
        </Box>

        <Box mb={5}>
            <Heading size="md" mb={2}>⚠️ Caution</Heading>
            <Text>
                This prediction should never be used in isolation. Always combine it with a full medical diagnosis and clinical judgment.
                The model is designed to support — not replace — medical decision-making. It can serve as a confirmation of what a qualified
                doctor might already suspect, but it should not be the sole basis for determining treatment.
            </Text>
        </Box>

        <Button bg="#2e65df" color="white" _hover={{ bg: "#ac3df3" }} onClick={() => navigate(-1)} colorScheme="blue">
          Go Back
        </Button>
      </Box>
    </Box>
  );
};

export default AIInfoRiskModel;