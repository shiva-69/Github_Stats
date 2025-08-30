import React from 'react';
import {
  Box,
  Flex,
  Heading,
  HStack,
  Button,
  Select,
  useColorModeValue,
} from '@chakra-ui/react';
import { TriangleUpIcon, ViewIcon, StarIcon } from '@chakra-ui/icons';

export const Header = ({ onTimeFilterChange, currentTimeFilter }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

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
        <Flex align="center" gap={3}>
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
            variant="ghost"
            leftIcon={<TriangleUpIcon />}
            colorScheme="blue"
            size="md"
          >
            Trending
          </Button>
          <Button
            variant="ghost"
            leftIcon={<ViewIcon />}
            colorScheme="blue"
            size="md"
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

        {/* Time Filter */}
        <Flex align="center" gap={3}>
          <Select
            value={currentTimeFilter}
            onChange={(e) => onTimeFilterChange(e.target.value)}
            size="md"
            w="auto"
            bg="white"
            border="2px"
            borderColor={borderColor}
            _focus={{
              borderColor: 'blue.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
            }}
          >
            <option value="1week">Last Week</option>
            <option value="2week">Last 2 Weeks</option>
            <option value="1month">Last Month</option>
            <option value="6month">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </Select>
        </Flex>
      </Flex>
    </Box>
  );
};
