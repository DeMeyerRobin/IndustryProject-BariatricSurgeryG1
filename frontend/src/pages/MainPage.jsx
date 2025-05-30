import React from 'react';
import logo from '../assets/Logo.png';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Separator,
  Spacer,
  Flex,
} from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const mockPatients = [
    { id: 1, name: 'John Doe', age: 45 },
    { id: 2, name: 'Jane Smith', age: 38 },
  ];
  const navigate = useNavigate();

  return (
    <Box bg="gray.100" minH="100vh" p={8}>
      <Box bg="white" p={6} rounded="md" shadow="md" mb={8}>
        <Box mb={4} textAlign="center">
          <img src={logo} alt="Logo" style={{ height: '60px', objectFit: 'contain' }} />
        </Box>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="lg">Doctor Dashboard</Heading>
          <Button colorScheme="red" variant="outline">Logout</Button>
        </Flex>
        <Text color="gray.600">
          Welcome back. Manage your patients and get surgical success predictions below.
        </Text>
      </Box>

      <Box bg="white" p={6} rounded="md" shadow="md">
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">Patient List</Heading>
          <Button colorScheme="blue" onClick={() => navigate('/AddPatient')}>
            Add New Patient
          </Button>
        </Flex>

        <VStack Separator={<Separator borderColor="gray.200" />} spacing={4} align="stretch">
          {mockPatients.map((patient) => (
            <HStack key={patient.id} spacing={4} p={4} bg="gray.50" rounded="md">
              <Box>
                <Text fontWeight="bold">{patient.name}</Text>
                <Text fontSize="sm" color="gray.600">Age: {patient.age}</Text>
              </Box>
              <Spacer />
              <Button size="sm" colorScheme="teal">View</Button>
            </HStack>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default MainPage;