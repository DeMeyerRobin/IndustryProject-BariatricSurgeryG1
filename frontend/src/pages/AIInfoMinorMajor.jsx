import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const AIInfoMinorMajor = () => {
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
        <Heading mb={6}>About the AI Minor/Major Classification Model</Heading>

        <Box mb={5}>
          <Heading size="md" mb={2}>Model Overview</Heading>
          <Text>
            This AI model predicts whether a patient's post-operative outcome is likely to be minor or major in terms of complications.
            It uses an ensemble learning technique called&nbsp;
            <a
              href="https://scikit-learn.org/stable/modules/ensemble.html#bagging"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline', color: '#3182ce' }}
            >
              Bagging (Bootstrap Aggregating)
            </a>
            , with logistic regression as the base estimator. This approach improves model stability and performance by combining the results of multiple logistic regression classifiers trained on different subsets of the data.
          </Text>
        </Box>

        <Box mb={5}>
          <Heading size="md" mb={2}>Model Features</Heading>
          <Text>
            The model incorporates relevant medical factors such as patient demographics (e.g., age, gender), comorbidities,
            and clinical indicators related to their health status and treatment pathway.
          </Text>
        </Box>

        <Box mb={5}>
          <Heading size="md" mb={2}>Performance</Heading>
          <Text>
            This model achieves a sensitivity of 85.7%, specificity of 82.3%, and an F1 score of 0.500. It is designed to
            identify serious complications while minimizing false alarms — making it a helpful tool in pre-surgical evaluation.
          </Text>
        </Box>

        <Box mb={5}>
          <Heading size="md" mb={2}>⚠️ Caution</Heading>
          <Text>
            The mode's predictions should always be interpreted alongside professional medical evaluation.
            It is intended to assist clinical decision-making, not replace it. The classification can reinforce a doctor's initial assessment,
            but should not be used on its own for treatment decisions.
          </Text>
        </Box>

        <Button bg="#2e65df" color="white" _hover={{ bg: "#ac3df3" }} onClick={() => navigate(-1)} colorScheme="blue">
          Go Back
        </Button>
      </Box>
    </Box>
  );
};

export default AIInfoMinorMajor;