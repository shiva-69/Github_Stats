import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  Text,
  useColorModeValue,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

export const Favorites = () => {
  const [favoriteRepos, setFavoriteRepos] = useState([]);
  const [favoriteUsers, setFavoriteUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Load favorites from localStorage on component mount
  const loadFavorites = useCallback(() => {
    try {
      const savedRepos = localStorage.getItem('githubStats_favoriteRepos');
      const savedUsers = localStorage.getItem('githubStats_favoriteUsers');

      if (savedRepos) {
        setFavoriteRepos(JSON.parse(savedRepos));
      }
      if (savedUsers) {
        setFavoriteUsers(JSON.parse(savedUsers));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast({
        title: 'Error loading favorites',
        description: 'Failed to load your saved items',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const totalFavorites = favoriteRepos.length + favoriteUsers.length;

  if (loading) {
    return (
      <Box minH="100vh" bg={bgColor} p={6}>
        <VStack spacing={8} align="stretch">
          <Text>Loading favorites...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor} p={6}>
      <VStack spacing={8} align="stretch">
        {/* Page Header */}
        <Box textAlign="center">
          <Heading size="2xl" color="gray.800" mb={4}>
            My Favorites
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Your saved repositories and users
          </Text>
          <Text fontSize="lg" color="blue.600" mt={3}>
            {totalFavorites} total favorites
          </Text>
        </Box>

        {/* Content */}
        <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
          <VStack spacing={6} align="stretch">
            <Text fontSize="lg" fontWeight="medium">
              Favorite Repositories: {favoriteRepos.length}
            </Text>
            <Text fontSize="lg" fontWeight="medium">
              Favorite Users: {favoriteUsers.length}
            </Text>

            {totalFavorites === 0 && (
              <Box textAlign="center" py={20}>
                <StarIcon w={16} h={16} color="gray.400" mb={4} />
                <Text fontSize="xl" color="gray.500">
                  No favorites yet
                </Text>
                <Text color="gray.400" mt={2}>
                  Start exploring and add items to your favorites
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};
