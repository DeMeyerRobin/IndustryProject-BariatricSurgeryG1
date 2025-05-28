import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const DashboardPage = () => {
  return (
    <Box bg="gray.50" minH="100vh" p={10}>
      <Heading mb={4}>Welcome to the Dashboard</Heading>
      <Text>This is where patient data and predictions will be displayed.</Text>
    </Box>
  );
};

export default DashboardPage;