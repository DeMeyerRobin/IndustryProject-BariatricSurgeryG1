import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Heading,
    Text,
    Spinner,
    Center,
    Avatar,
    VStack,
    Flex,
    Button,
} from '@chakra-ui/react';
import logo from '../assets/OCF Logo - Transparent Background.png';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/check-session', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (!data.logged_in) navigate('/');
      });

    fetch(`http://localhost:8000/me`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error("Access denied or not found");
        return res.json();
      })
      .then(data => {
        setDoctor(data);
        setLoading(false);
      })
      .catch(() => {
        alert("Unable to load profile");
        navigate('/dashboard');
      });
  }, [navigate]);

  if (loading || !doctor) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  const handleLogout = () => {
    fetch("http://localhost:8000/logout", {
      method: "POST",
      credentials: "include"
    })
      .then(() => navigate('/'))
      .catch(() => navigate('/'));
  };

  return (
    <Box bg="gray.50" minH="100vh" py={10} px={6}>
        <Flex justify="space-between" align="center" mb={10}>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            ← Back
          </Button>
          <Center flex="1">
            <img src={logo} alt="Logo" style={{ height: '80px' }} />
          </Center>
          <Box w="75px" /> {/* Spacer to balance layout */}
        </Flex>

        <Box bg="white" maxW="lg" mx="auto" p={6} rounded="lg" shadow="md">
        <VStack spacing={3} align="start">
        <Box>
            <Text><strong>Email:</strong> {doctor.email}</Text>
            <Text><strong>Amount of Patient Files:</strong> {doctor.patient_count}</Text>
            <Text>
            <strong>Account Created On:</strong>{' '}
            {new Date(doctor.date_created).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </Box>
        </VStack>
      </Box>
        <Center mt={6}>
            <Button variant="outline" onClick={handleLogout}>
                Logout
            </Button>   
        </Center>   
    </Box>
  );
};

export default ProfilePage;