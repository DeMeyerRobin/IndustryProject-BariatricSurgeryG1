import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Input,
  VStack,
  Field,
} from '@chakra-ui/react';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
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
      console.log(data);
  
      // Optional: redirect or show success message
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
            <Button colorScheme="blue" type="submit" width="full">
              Register
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default RegisterPage;