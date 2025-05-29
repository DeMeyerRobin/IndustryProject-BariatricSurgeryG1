import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Input,
  VStack,
  Field,
  Text,
} from '@chakra-ui/react';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/check-session", {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.logged_in) {
          navigate('/dashboard');
        }
      })
      .catch((err) => {
        console.error("Session check failed", err);
      });
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    } else if (password.length <= 4) {
      setError("Password must be at least 5 characters");
      return;
    } else {
      setError('');
    }

    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          confirmPassword,  // optional if used in backend
        }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        console.error("Registration failed:", data.detail || data.message);
      } else {
        console.log("Registration success:", data);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
    console.log({ email, password, confirmPassword });
  };

  return (
    <Box bg="gray.50" minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box bg="white" p={8} rounded="xl" shadow="md" w="100%" maxW="md">
        <Heading size="lg" textAlign="center" mb={6}>Doctor Registration</Heading>
        <form onSubmit={handleRegister}>
          <VStack spacing={4}>
            <Field.Root>
              <Field.Label>Email</Field.Label>
              <Input
                type="email"
                placeholder="doctor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field.Root>
            <Field.Root>
              <Field.Label>Password</Field.Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field.Root>
            <Field.Root>
              <Field.Label>Confirm Password</Field.Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Field.Root>
            {error && (
              <Text color="red.500" fontSize="sm" mt={-2} mb={2}>
                {error}
              </Text>
            )}
            <Button colorScheme="blue" type="submit" width="full">
              Register
            </Button>
            <Text fontSize="sm" color="gray.600">
              Already have an account?{' '}
              <Link to="/" style={{ color: '#3182ce' }}>
                Log in
              </Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default RegisterPage;