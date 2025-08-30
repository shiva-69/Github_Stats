import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Image,
  Badge,
  Link,
  Text,
  HStack,
  VStack,
  Button,
  useColorModeValue,
  Tooltip,
  IconButton,
  Collapse,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  useToast
} from '@chakra-ui/react';
import {
  ArrowForwardIcon,
  ExternalLinkIcon,
  CalendarIcon,
  TimeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon
} from '@chakra-ui/icons';
import { useDispatch } from 'react-redux';
import { addRepo } from '../Redux/Repo/Actions';
import { useNavigate } from 'react-router-dom';

export const RepoCard = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const handleClick = (info) => {
    const link = `https://api.github.com/repos/${info}/stats/code_frequency`;
    dispatch(addRepo(link));
    navigate('/repo_details');
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied to clipboard!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Failed to copy',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f1e05a',
      Python: '#3572A5',
      Java: '#b07219',
      TypeScript: '#2b7489',
      Go: '#00ADD8',
      Rust: '#dea584',
      'C++': '#f34b7d',
      'C#': '#178600'
    };
    return colors[language] || '#8250df';
  };

  return (
    <Box
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      borderRadius="xl"
      boxShadow="lg"
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'xl',
        borderColor: 'blue.300'
      }}
    >
      {/* Main Content */}
      <Flex p={6} gap={6} align="start">
        {/* Avatar and Basic Info */}
        <VStack spacing={4} align="center" flexShrink={0}>
          <Image
            src={data.owner.avatar_url}
            alt={`${data.owner.login} avatar`}
            boxSize="80px"
            borderRadius="full"
            border="3px solid"
            borderColor={borderColor}
            _hover={{ borderColor: 'blue.300' }}
            transition="border-color 0.3s ease"
          />

          <VStack spacing={1} textAlign="center">
            <Text fontSize="sm" fontWeight="medium" color={mutedColor}>
              {data.owner.login}
            </Text>
            <Badge
              colorScheme={data.private ? 'red' : 'green'}
              variant="subtle"
              fontSize="xs"
            >
              {data.private ? 'Private' : 'Public'}
            </Badge>
          </VStack>
        </VStack>

        {/* Repository Details */}
        <VStack spacing={4} align="stretch" flex={1}>
          <Box>
            <HStack spacing={3} align="center" mb={2}>
              <Heading size="md" color={textColor} _hover={{ color: 'blue.500' }}>
                {data.name}
              </Heading>
              {data.language && (
                <HStack spacing={1}>
                  <Box
                    w={3}
                    h={3}
                    borderRadius="full"
                    bg={getLanguageColor(data.language)}
                  />
                  <Text fontSize="sm" color={mutedColor}>
                    {data.language}
                  </Text>
                </HStack>
              )}
            </HStack>

            <Text color={mutedColor} mb={3} lineHeight="1.6">
              {data.description || 'No description available'}
            </Text>
          </Box>

          {/* Stats Row */}
          <HStack spacing={6} wrap="wrap">
            <Stat size="sm">
              <StatLabel color={mutedColor}>Stars</StatLabel>
              <StatNumber color="yellow.500" fontSize="lg">
                {formatNumber(data.stargazers_count)}
              </StatNumber>
            </Stat>

            <Stat size="sm">
              <StatLabel color={mutedColor}>Forks</StatLabel>
              <StatNumber color="blue.500" fontSize="lg">
                {formatNumber(data.forks_count)}
              </StatNumber>
            </Stat>

            <Stat size="sm">
              <StatLabel color={mutedColor}>Issues</StatLabel>
              <StatNumber color="red.500" fontSize="lg">
                {formatNumber(data.open_issues_count)}
              </StatNumber>
            </Stat>

            <Stat size="sm">
              <StatLabel color={mutedColor}>Watchers</StatLabel>
              <StatNumber color="purple.500" fontSize="lg">
                {formatNumber(data.watchers_count)}
              </StatNumber>
            </Stat>
          </HStack>

          {/* Additional Info */}
          <HStack spacing={4} color={mutedColor} fontSize="sm">
            <HStack spacing={1}>
              <TimeIcon />
              <Text>Updated {formatDate(data.updated_at)}</Text>
            </HStack>

            <HStack spacing={1}>
              <CalendarIcon />
              <Text>Created {formatDate(data.created_at)}</Text>
            </HStack>
          </HStack>

          {/* Topics */}
          {data.topics && data.topics.length > 0 && (
            <HStack spacing={2} wrap="wrap">
              {data.topics.slice(0, 5).map((topic, index) => (
                <Badge
                  key={index}
                  colorScheme="blue"
                  variant="subtle"
                  fontSize="xs"
                  px={2}
                  py={1}
                >
                  {topic}
                </Badge>
              ))}
              {data.topics.length > 5 && (
                <Badge colorScheme="gray" variant="subtle" fontSize="xs">
                  +{data.topics.length - 5} more
                </Badge>
              )}
            </HStack>
          )}
        </VStack>

        {/* Action Buttons */}
        <VStack spacing={3} align="center" flexShrink={0}>
          <Tooltip label="View detailed analytics" placement="top">
            <IconButton
              icon={<ArrowForwardIcon />}
              colorScheme="blue"
              variant="ghost"
              size="lg"
              onClick={() => handleClick(data.full_name)}
              aria-label="View analytics"
            />
          </Tooltip>

          <Tooltip label="Copy clone URL" placement="top">
            <IconButton
              icon={<CopyIcon />}
              colorScheme="gray"
              variant="ghost"
              size="md"
              onClick={() => copyToClipboard(data.clone_url)}
              aria-label="Copy clone URL"
            />
          </Tooltip>
        </VStack>
      </Flex>

      {/* Expandable Section */}
      <Collapse in={isExpanded}>
        <Divider />
        <Box p={6} bg={useColorModeValue('gray.50', 'gray.700')}>
          <VStack spacing={4} align="stretch">
            <Text fontSize="lg" fontWeight="semibold">
              Repository Details
            </Text>

            <HStack spacing={6} wrap="wrap">
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color={mutedColor}>Default Branch</Text>
                <Text fontWeight="medium">{data.default_branch}</Text>
              </VStack>

              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color={mutedColor}>Size</Text>
                <Text fontWeight="medium">{formatNumber(data.size)} KB</Text>
              </VStack>

              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color={mutedColor}>License</Text>
                <Text fontWeight="medium">
                  {data.license?.name || 'Not specified'}
                </Text>
              </VStack>

              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color={mutedColor}>Archived</Text>
                <Text fontWeight="medium">
                  {data.archived ? 'Yes' : 'No'}
                </Text>
              </VStack>
            </HStack>

            <HStack spacing={4}>
              <Link href={data.html_url} isExternal>
                <Button
                  leftIcon={<ExternalLinkIcon />}
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                >
                  View on GitHub
                </Button>
              </Link>

              <Link href={data.clone_url} isExternal>
                <Button
                  leftIcon={<CopyIcon />}
                  colorScheme="green"
                  variant="outline"
                  size="sm"
                >
                  Clone Repository
                </Button>
              </Link>
            </HStack>
          </VStack>
        </Box>
      </Collapse>

      {/* Expand/Collapse Button */}
      <Box
        borderTop="1px"
        borderColor={borderColor}
        p={3}
        textAlign="center"
        cursor="pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
        transition="background-color 0.3s ease"
      >
        <HStack spacing={2} justify="center" color={mutedColor}>
          <Text fontSize="sm" fontWeight="medium">
            {isExpanded ? 'Show less' : 'Show more details'}
          </Text>
          {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </HStack>
      </Box>
    </Box>
  );
};

