import React from 'react';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './Redux/Store';
import { Home } from './Pages/Home';
import { RepoDetails } from './Components/RepoDetails';
import ErrorBoundary from './Components/ErrorBoundary';
import theme from './theme';

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/repo_details" element={<RepoDetails />} />
            <Route path="/users" element={<div>Users Page - Coming Soon!</div>} />
            <Route path="/favorites" element={<div>Favorites Page - Coming Soon!</div>} />
          </Routes>
        </ErrorBoundary>
      </ChakraProvider>
    </Provider>
  );
}

export default App;
