import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const AIInfoWeightLossModel = () => {
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
        <Heading mb={6}>About the Weight Loss Prediction Model</Heading>

        <Box mb={5}>
          <Heading size="md" mb={2}>Model Overview</Heading>
          <Text>
            This AI model is trained to estimate the percentage of weight a patient may lose following bariatric surgery.
            It was built using anonymized clinical records and developed with a linear regression technique called{" "}
            <a
              href="https://www.ibm.com/think/topics/lasso-regression#:~:text=Lasso%20regression%20is%20a%20regularization,regularization%20for%20linear%20regression%20models."
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline', color: '#3182ce' }}
            >
              Lasso Regression
            </a>, which is ideal for identifying the most relevant medical features while reducing noise.
          </Text>
        </Box>

        <Box mb={5}>
          <Heading size="md" mb={2}>Model Features</Heading>
          <Text>
            The model considers various patient-specific characteristics such as: age, gender, BMI, comorbidities,
            surgical procedure type, and antibiotic use. These features have been selected based on clinical relevance to post-surgical outcomes.
          </Text>
        </Box>

        <Box mb={5}>
          <Heading size="md" mb={2}>Accuracy</Heading>
          <Text>
            The model achieves a mean absolute error (MAE) of approximately 7 percentage points on test data. This means that on average,
            the predicted weight loss deviates by about 7% from the actual result. It should be viewed as a helpful estimate — not a guarantee.
          </Text>
        </Box>

        <Box mb={5}>
          <Heading size="md" mb={2}>⚠️ Caution</Heading>
          <Text>
            This prediction should always be used as part of a broader clinical evaluation. It does not account for every medical nuance
            and should never be the sole factor in treatment planning. Always combine it with expert medical advice and patient-specific judgment.
          </Text>
        </Box>

        <Button onClick={() => navigate('/dashboard')} colorScheme="blue">
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default AIInfoWeightLossModel;