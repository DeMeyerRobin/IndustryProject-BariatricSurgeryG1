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
import { FaMars, FaVenus, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


const MainPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [sortBy, setSortBy] = useState("name_asc");

  const sortedPatients = [...patients].sort((a, b) => {
    if (sortBy === "name_asc") return a.name.localeCompare(b.name);
    if (sortBy === "name_desc") return b.name.localeCompare(a.name);
    if (sortBy === "age_asc") return a.age - b.age;
    if (sortBy === "age_desc") return b.age - a.age;
    return 0;
  });

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
          <HStack spacing={4}>
            <Button
              variant="outline"
              onClick={() => navigate(`/profile`)}
            >
              Profile
            </Button>
          </HStack>
        </Flex>
        <Text color="gray.600">
          Welcome back Dr. | today is {new Date().toLocaleDateString()}
        </Text>
      </Box>

      <Box bg="white" p={6} rounded="md" shadow="md">
        <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md">Patient List</Heading>
        <Box>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #CBD5E0',
              marginRight: '12px'
            }}
          >
            <option value="name_asc">Sort by Name (A-Z)</option>
            <option value="name_desc">Sort by Name (Z-A)</option>
            <option value="age_asc">Sort by Age (Youngest)</option>
            <option value="age_desc">Sort by Age (Oldest)</option>
          </select>
          <Button colorScheme="blue" onClick={() => navigate('/AddPatient')}>
            Add New Patient
          </Button>
        </Box>
      </Flex>

        <div>
          {patients.length === 0 ? (
            <p>No patients yet.</p>
          ) : (
            sortedPatients.map((patient) => (
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong>{patient.name}</strong>
                    {patient.gender === 'male' && <FaMars color="#3182CE" />}
                    {patient.gender === 'female' && <FaVenus color="#D53F8C" />}
                  </div>
                  <div>Age: {patient.age}</div>
                </div>
                <button
                  onClick={() => navigate(`/patient/${patient.idPatientInfo}`)}
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