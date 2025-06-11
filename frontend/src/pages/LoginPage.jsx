import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import logo from '../assets/OCF Logo - Transparent Background.png';
import {
  Box,
  Button,
  Heading,
  Input,
  VStack,
  Field,
  Text,
} from '@chakra-ui/react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        setError(data.detail || data.message || "Invalid email or password");
      } else {
        setError('');
        console.log("Login success:", data);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <Box bg="gray.50" minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box bg="white" p={8} rounded="xl" shadow="md" w="100%" maxW="md">
      <Box mb={4} textAlign="center">
        <img src={logo} alt="Logo" style={{ height: '120px', display: 'block', margin: '0 auto' }} />
      </Box>
        <Heading size="lg" textAlign="center" mb={6}>Doctor Login</Heading>
        <form onSubmit={handleLogin}>
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
            {error && (
              <Text color="red.500" fontSize="sm" mt={-2} mb={2}>
                {error}
              </Text>
            )}
            <Button bg="#2e65df" color="white" _hover={{ bg: "#ac3df3" }} type="submit" width="full">
              Login
            </Button>
            <Text fontSize="sm" color="gray.600">
              Don&apos;t have an account?{' '}
              <Link to="/register" style={{ color: '#3182ce' }}>
                Register
              </Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default LoginPage;