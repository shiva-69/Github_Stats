import React, { useState, useCallback } from 'react';
import { Header } from '../Components/Header';
import { RepoContainer } from '../Components/RepoContainer';
import { Box } from '@chakra-ui/react';

export const Home = () => {
  const [currentTimeFilter, setCurrentTimeFilter] = useState('1week');

  const handleTimeFilterChange = useCallback((filter) => {
    console.log('Time filter changed to:', filter);
    setCurrentTimeFilter(filter);
  }, []);

  return (
    <Box minH="100vh" bg="gray.50">
      <Header
        onTimeFilterChange={handleTimeFilterChange}
        currentTimeFilter={currentTimeFilter}
      />
      <RepoContainer
        timeFilter={currentTimeFilter}
      />
    </Box>
  );
};
