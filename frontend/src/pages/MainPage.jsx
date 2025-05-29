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
import { useEffect, useState } from 'react';


const MainPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/my-patients', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setPatients(data.patients);
          console.log("Fetched patients:", data.patients);
        }
      })
      .catch(err => {
        console.error("Failed to fetch patients:", err);
      });
  }, []);
  

  useEffect(() => {
    fetch("http://localhost:8000/check-session", {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.logged_in) {
          navigate('/');
        } else {
          setLoading(false);
        }
      })
      .catch(() => navigate('/'));
  }, [navigate]);

  if (loading) {
    return <Box p={8}><Text>Loading...</Text></Box>;
  }

  const mockPatients = [
    { id: 1, name: 'John Doe', age: 45 },
    { id: 2, name: 'Jane Smith', age: 38 },
  ];

  const handleLogout = () => {
    fetch("http://localhost:8000/logout", {
      method: "POST",
      credentials: "include"
    })
      .then((res) => res.json())
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        console.error("Logout failed", err);
        navigate('/');
      });
  };

  return (
    <Box bg="gray.100" minH="100vh" p={8}>
      <Box bg="white" p={6} rounded="md" shadow="md" mb={8}>
        <Box mb={4} textAlign="center">
          <img src={logo} alt="Logo" style={{ height: '60px', objectFit: 'contain' }} />
        </Box>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="lg">Doctor Dashboard</Heading>
          <Button colorScheme="red" variant="outline" onClick={handleLogout}>
            Logout
          </Button>
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

        <div>
          {patients.length === 0 ? (
            <p>No patients yet.</p>
          ) : (
            patients.map((patient) => (
              <div key={patient.idPatientInfo} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                margin: '8px 0',
                background: '#f9f9f9',
                borderRadius: '8px'
              }}>
                <div>
                  <strong>{patient.name}</strong><br />
                  Age: {patient.age}
                </div>
                <button
                  onClick={() => navigate(`/patient/${patient.idPatientInfo}`)} // if you have a route like that
                  style={{
                    background: '#3182CE',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  View
                </button>
              </div>
            ))
          )}
        </div>
      </Box>
    </Box>
  );
};

export default MainPage;