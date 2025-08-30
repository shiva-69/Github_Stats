import React from 'react';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './Pages/Home';
import { Users } from './Pages/Users';
import { RepoDetails } from './Components/RepoDetails';
import ErrorBoundary from './Components/ErrorBoundary';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/repo/:owner/:repo" element={<RepoDetails />} />
        </Routes>
      </ErrorBoundary>
    </ChakraProvider>
  );
}

export default App;
