import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import App from './App';
import '@fontsource/open-sans';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider value={defaultSystem}>
    <App />
  </ChakraProvider>
);