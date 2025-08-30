import React from 'react';
import {
  Box,
  Flex,
  Heading,
  HStack,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { TriangleUpIcon, ViewIcon, StarIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';

export const UsersHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const isActive = (path) => location.pathname === path;

  return (
    <Box
      as="header"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px={6}
      py={4}
      shadow="sm"
    >
      <Flex justify="space-between" align="center">
        {/* Logo and Title */}
        <Flex align="center" gap={3} cursor="pointer" onClick={() => navigate('/')}>
          <Box
            w={10}
            h={10}
            bg="gray.800"
            color="white"
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="xl"
            fontWeight="bold"
          >
            G
          </Box>
          <Heading size="lg" color="gray.800">
            GitHub Stats
          </Heading>
        </Flex>

        {/* Navigation */}
        <HStack spacing={4}>
          <Button
            variant={isActive('/') ? "solid" : "ghost"}
            leftIcon={<TriangleUpIcon />}
            colorScheme="blue"
            size="md"
            onClick={() => navigate('/')}
          >
            Trending
          </Button>
          <Button
            variant={isActive('/users') ? "solid" : "ghost"}
            leftIcon={<ViewIcon />}
            colorScheme="blue"
            size="md"
            onClick={() => navigate('/users')}
          >
            Users
          </Button>
          <Button
            variant="ghost"
            leftIcon={<StarIcon />}
            colorScheme="blue"
            size="md"
          >
            Favorites
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};
