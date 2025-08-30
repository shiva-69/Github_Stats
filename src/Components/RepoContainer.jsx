import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Badge,
  Select,
  useColorModeValue,
  Input
} from '@chakra-ui/react';
import { RepoCard } from './RepoCard';
import LoadingSpinner from './LoadingSpinner';

export const RepoContainer = ({ timeFilter }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [localTimeFilter, setLocalTimeFilter] = useState(timeFilter || '1week');
  const [sortBy, setSortBy] = useState('stars');
  const [language, setLanguage] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Time filter calculations
  const getDateFromFilter = useCallback((filter) => {
    const now = new Date();
    const filters = {
      '1week': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      '2week': new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      '1month': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      '6month': new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000),
      '1year': new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    };

    const date = filters[filter] || filters['1week'];
    return date.toISOString().split('T')[0];
  }, []);

  // Fetch repositories - define this BEFORE using it in useEffect
  const fetchRepos = useCallback(async (isSearch = false, isLoadMore = false) => {
    console.log('fetchRepos called with:', { isSearch, isLoadMore, localSearchQuery, localTimeFilter }); // Debug log
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const date = getDateFromFilter(localTimeFilter);
      let query = `created:>${date}`;

      if (localSearchQuery.trim()) {
        query = `${localSearchQuery} ${query}`;
      }

      if (language) {
        query += ` language:${language}`;
      }

      console.log('GitHub API query:', query); // Debug log

      const sortParam = sortBy === 'stars' ? 'stars' : sortBy === 'forks' ? 'forks' : 'updated';
      const orderParam = sortBy === 'updated' ? 'desc' : 'desc';

      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=${sortParam}&order=${orderParam}&page=${page}&per_page=20`
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('GitHub API response:', { total_count: data.total_count, items_count: data.items?.length }); // Debug log

      if (isLoadMore) {
        setRepos(prev => [...prev, ...data.items]);
      } else {
        setRepos(data.items);
        setPage(1);
      }

      setTotalCount(data.total_count);
      setHasMore(data.items.length === 20);

      if (data.items.length === 0) {
        toast({
          title: 'No repositories found',
          description: 'Try adjusting your search criteria or time filter',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
      }

    } catch (err) {
      console.error('fetchRepos error:', err); // Debug log
      setError(err.message);
      toast({
        title: 'Error fetching repositories',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

    } finally {
      setLoading(false);
    }
  }, [localSearchQuery, localTimeFilter, sortBy, language, page, loading, getDateFromFilter, toast]); // Removed onSearchComplete from dependencies

  // Update local state when props change
  useEffect(() => {
    if (timeFilter !== undefined) {
      setLocalTimeFilter(timeFilter);
    }
  }, [timeFilter]);

  // Initial fetch only once
  useEffect(() => {
    fetchRepos();
    setIsInitialized(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once

  // Manual search function - no useEffect dependencies
  const performSearch = useCallback(() => {
    if (localSearchQuery.trim()) {
      setPage(1);
      fetchRepos(true);
    }
  }, [localSearchQuery, fetchRepos]);

  // Fetch when filters change - only if not currently searching
  useEffect(() => {
    if (isInitialized && repos.length > 0) { // Removed shouldSearch check
      setPage(1);
      // Use setTimeout to break the dependency cycle
      setTimeout(() => {
        fetchRepos();
      }, 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localTimeFilter, sortBy, language]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!hasMore || loading) return;
    setPage(prev => prev + 1);
    fetchRepos(false, true);
  }, [hasMore, loading, fetchRepos]);

  if (error && repos.length === 0) {
    return (
      <Box p={8} textAlign="center">
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Error loading repositories!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
        </Alert>
        <Button
          mt={4}
          colorScheme="blue"
          onClick={() => fetchRepos()}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <VStack spacing={8} maxW="1200px" mx="auto" px={6}>
        {/* Filters Section */}
        <Box
          w="100%"
          bg="white"
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
          boxShadow="sm"
        >
          <VStack spacing={4} align="stretch">
            <Text fontSize="lg" fontWeight="semibold">
              Filters & Sorting
            </Text>

            {/* Manual Search Section */}
            <Box>
              <Text mb={2} fontSize="sm" fontWeight="medium">
                Search Repositories
              </Text>
              <HStack spacing={3}>
                <Input
                  placeholder="Type to search repositories..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      performSearch();
                    }
                  }}
                  size="md"
                  bg="white"
                  border="2px"
                  borderColor={borderColor}
                  _focus={{
                    borderColor: 'blue.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
                  }}
                />
                <Button
                  colorScheme="blue"
                  onClick={performSearch}
                  size="md"
                >
                  Search
                </Button>
                {localSearchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setLocalSearchQuery('');
                      setPage(1);
                      // Use setTimeout to break the dependency cycle
                      setTimeout(() => {
                        fetchRepos();
                      }, 0);
                    }}
                    size="md"
                  >
                    Clear
                  </Button>
                )}
              </HStack>
              <Text fontSize="xs" color="gray.500" mt={1}>
                Press Enter or click Search to find repositories
              </Text>
            </Box>

            <HStack spacing={4} wrap="wrap">
              <Box flex="1" minW="200px">
                <Text mb={2} fontSize="sm" fontWeight="medium">
                  Language
                </Text>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="All languages"
                  size="md"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="typescript">TypeScript</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="cpp">C++</option>
                  <option value="csharp">C#</option>
                </Select>
              </Box>

              <Box flex="1" minW="200px">
                <Text mb={2} fontSize="sm" fontWeight="medium">
                  Sort By
                </Text>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  size="md"
                >
                  <option value="stars">Stars</option>
                  <option value="forks">Forks</option>
                  <option value="updated">Recently Updated</option>
                </Select>
              </Box>
            </HStack>
          </VStack>
        </Box>

        {/* Results Summary */}
        {repos.length > 0 && (
          <Flex justify="space-between" align="center" w="100%">
            <VStack align="start" spacing={1}>
              <Text fontSize="lg" fontWeight="medium">
                Found {totalCount.toLocaleString()} repositories
              </Text>
              {(localSearchQuery || language || localTimeFilter !== '1week') && (
                <HStack spacing={2} fontSize="sm" color="gray.600">
                  {localSearchQuery && (
                    <Badge colorScheme="blue" variant="subtle">
                      Search: "{localSearchQuery}"
                    </Badge>
                  )}
                  {language && (
                    <Badge colorScheme="green" variant="subtle">
                      Language: {language}
                    </Badge>
                  )}
                  {localTimeFilter !== '1week' && (
                    <Badge colorScheme="purple" variant="subtle">
                      Time: {localTimeFilter === '2week' ? '2 Weeks' :
                             localTimeFilter === '1month' ? '1 Month' :
                             localTimeFilter === '6month' ? '6 Months' :
                             localTimeFilter === '1year' ? '1 Year' : '1 Week'}
                    </Badge>
                  )}
                </HStack>
              )}
            </VStack>
            <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
              Showing {repos.length} of {Math.min(totalCount, 1000)}
            </Badge>
          </Flex>
        )}

        {/* Repositories Grid */}
        <VStack spacing={4} w="100%" align="stretch">
          {repos.map((repo) => (
            <RepoCard key={repo.id} data={repo} />
          ))}
        </VStack>

        {/* Loading State */}
        {loading && <LoadingSpinner text="Loading repositories..." />}

        {/* Load More Button */}
        {hasMore && repos.length > 0 && !loading && (
          <Flex justify="center" pt={4}>
            <Button
              size="lg"
              colorScheme="blue"
              variant="outline"
              onClick={handleLoadMore}
              isLoading={loading}
              loadingText="Loading..."
            >
              Load More Repositories
            </Button>
          </Flex>
        )}

        {/* No Results */}
        {!loading && repos.length === 0 && !error && (
          <Box textAlign="center" py={20}>
            <Text fontSize="xl" color="gray.500">
              {localSearchQuery ? `No repositories found for "${localSearchQuery}"` : 'No repositories found'}
            </Text>
            <Text color="gray.400" mt={2}>
              {localSearchQuery
                ? 'Try adjusting your search terms or filters'
                : 'Try adjusting your search criteria or time filter'
              }
            </Text>
            {localSearchQuery && (
              <Button
                mt={4}
                variant="outline"
                onClick={() => {
                  setLocalSearchQuery('');
                  setPage(1);
                  // Use setTimeout to break the dependency cycle
                  setTimeout(() => {
                    fetchRepos();
                  }, 0);
                }}
              >
                Clear Search
              </Button>
            )}
          </Box>
        )}
      </VStack>
    </Box>
  );
};
