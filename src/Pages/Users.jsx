import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Select,
  Text,
  Grid,
  GridItem,
  useToast,
  useColorModeValue,
  Avatar,
  Stat,
  StatLabel,
  StatNumber,
  Divider,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { SearchIcon, ViewIcon, StarIcon, CopyIcon } from '@chakra-ui/icons';
import LoadingSpinner from '../Components/LoadingSpinner';
import { UsersHeader } from '../Components/UsersHeader';

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('followers');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Fetch users from GitHub API
  const fetchUsers = useCallback(async (isSearch = false, isLoadMore = false) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      let query = searchQuery.trim() || 'followers:>1000';
      const sortParam = sortBy === 'followers' ? 'followers' : sortBy === 'repositories' ? 'repositories' : 'joined';
      const orderParam = order;

      const response = await fetch(
        `https://api.github.com/search/users?q=${encodeURIComponent(query)}&sort=${sortParam}&order=${orderParam}&page=${page}&per_page=20`
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('GitHub Users API response:', { total_count: data.total_count, items_count: data.items?.length });

      // Fetch detailed user information for each user
      const detailedUsers = await Promise.all(
        data.items.map(async (user) => {
          try {
            const userResponse = await fetch(`https://api.github.com/users/${user.login}`);
            if (userResponse.ok) {
              const userData = await userResponse.json();
              return {
                ...user,
                followers: userData.followers,
                following: userData.following,
                public_repos: userData.public_repos,
                name: userData.name,
                bio: userData.bio,
                location: userData.location,
                company: userData.company,
                blog: userData.blog,
                created_at: userData.created_at,
                updated_at: userData.updated_at
              };
            }
            return user; // Return basic user data if detailed fetch fails
          } catch (err) {
            console.warn(`Failed to fetch details for user ${user.login}:`, err);
            return user; // Return basic user data if detailed fetch fails
          }
        })
      );

      if (isLoadMore) {
        setUsers(prev => [...prev, ...detailedUsers]);
      } else {
        setUsers(detailedUsers);
        setPage(1);
      }

      setTotalCount(data.total_count);
      setHasMore(data.items.length === 20);

      if (data.items.length === 0) {
        toast({
          title: 'No users found',
          description: 'Try adjusting your search criteria',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
      }

    } catch (err) {
      console.error('fetchUsers error:', err);
      setError(err.message);
      toast({
        title: 'Error fetching users',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortBy, order, page, loading, toast]);

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch when filters change
  useEffect(() => {
    if (users.length > 0) {
      setPage(1);
      fetchUsers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, order]);

  // Handle search
  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      setPage(1);
      fetchUsers(true);
    }
  }, [searchQuery, fetchUsers]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!hasMore || loading) return;
    setPage(prev => prev + 1);
    fetchUsers(false, true);
  }, [hasMore, loading, fetchUsers]);

  // Handle key press
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <Box minH="100vh" bg={bgColor}>
      <UsersHeader />
      <Box p={6}>
        <VStack spacing={8} align="stretch">
          {/* Page Header */}
          <Box textAlign="center">
            <Heading size="2xl" color="gray.800" mb={4}>
              GitHub Users
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Discover top developers, contributors, and open source enthusiasts
            </Text>
          </Box>

          {/* Search and Filters */}
          <Box bg={cardBg} p={6} borderRadius="xl" shadow="md" border="1px" borderColor={borderColor}>
            <VStack spacing={6}>
              {/* Search Section */}
              <Box w="100%">
                <Text mb={3} fontSize="lg" fontWeight="medium">
                  Search Users
                </Text>
                <HStack spacing={3}>
                  <Input
                    placeholder="Search by username, location, language..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    size="lg"
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
                    onClick={handleSearch}
                    size="lg"
                    leftIcon={<SearchIcon />}
                    px={8}
                  >
                    Search
                  </Button>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        setPage(1);
                        fetchUsers();
                      }}
                      size="lg"
                      px={6}
                    >
                      Clear
                    </Button>
                  )}
                </HStack>
                <Text fontSize="sm" color="gray.500" mt={2}>
                  Press Enter or click Search to find users
                </Text>
              </Box>

              {/* Filters */}
              <HStack spacing={6} w="100%">
                <Box flex={1}>
                  <Text mb={2} fontSize="sm" fontWeight="medium">
                    Sort By
                  </Text>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    size="md"
                    bg="white"
                    border="2px"
                    borderColor={borderColor}
                  >
                    <option value="followers">Followers</option>
                    <option value="repositories">Repositories</option>
                    <option value="joined">Join Date</option>
                  </Select>
                </Box>
                <Box flex={1}>
                  <Text mb={2} fontSize="sm" fontWeight="medium">
                    Order
                  </Text>
                  <Select
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    size="md"
                    bg="white"
                    border="2px"
                    borderColor={borderColor}
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </Select>
                </Box>
              </HStack>
            </VStack>
          </Box>

          {/* Results Summary */}
          {!loading && users.length > 0 && (
            <Box bg={cardBg} p={4} borderRadius="lg" shadow="sm" border="1px" borderColor={borderColor}>
              <Text fontSize="sm" color="gray.600">
                Found {totalCount.toLocaleString()} users • Showing {users.length} results
              </Text>
            </Box>
          )}

          {/* Loading State */}
          {loading && <LoadingSpinner text="Finding amazing developers..." />}

          {/* Error State */}
          {error && (
            <Alert status="error" borderRadius="lg">
              <AlertIcon />
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Users Grid */}
          {!loading && users.length > 0 && (
            <Grid templateColumns="repeat(auto-fill, minmax(350px, 1fr))" gap={6}>
              {users.map((user) => (
                <GridItem key={user.id}>
                  <UserCard user={user} />
                </GridItem>
              ))}
            </Grid>
          )}

          {/* No Results */}
          {!loading && users.length === 0 && !error && (
            <Box textAlign="center" py={20}>
              <Text fontSize="xl" color="gray.500">
                {searchQuery ? `No users found for "${searchQuery}"` : 'No users found'}
              </Text>
              <Text color="gray.400" mt={2}>
                {searchQuery
                  ? 'Try adjusting your search terms or filters'
                  : 'Try adjusting your search criteria'
                }
              </Text>
            </Box>
          )}

          {/* Load More Button */}
          {!loading && hasMore && users.length > 0 && (
            <Box textAlign="center">
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={handleLoadMore}
                size="lg"
                px={8}
              >
                Load More Users
              </Button>
            </Box>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

// User Card Component
const UserCard = ({ user }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={cardBg}
      p={6}
      borderRadius="xl"
      shadow="md"
      border="1px"
      borderColor={borderColor}
      _hover={{
        shadow: 'lg',
        transform: 'translateY(-2px)',
        transition: 'all 0.2s',
      }}
    >
      <VStack spacing={4} align="stretch">
        {/* User Header */}
        <HStack spacing={4}>
          <Avatar
            size="xl"
            src={user.avatar_url}
            name={user.login}
            border="3px"
            borderColor="blue.200"
          />
          <VStack align="start" spacing={1} flex={1}>
            <Text fontSize="xl" fontWeight="bold" color="gray.800">
              {user.login}
            </Text>
            {user.name && (
              <Text fontSize="md" color="gray.600">
                {user.name}
              </Text>
            )}
            {user.bio && (
              <Text fontSize="sm" color="gray.500" noOfLines={2}>
                {user.bio}
              </Text>
            )}
          </VStack>
        </HStack>

        <Divider />

        {/* User Stats */}
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          <Stat textAlign="center">
            <StatLabel fontSize="sm" color="gray.600">
              <HStack justify="center" spacing={1}>
                <ViewIcon />
                <Text>Followers</Text>
              </HStack>
            </StatLabel>
            <StatNumber fontSize="lg" color="blue.600">
              {user.followers ? user.followers.toLocaleString() : 'N/A'}
            </StatNumber>
          </Stat>
          <Stat textAlign="center">
            <StatLabel fontSize="sm" color="gray.600">
              <HStack justify="center" spacing={1}>
                <StarIcon />
                <Text>Following</Text>
              </HStack>
            </StatLabel>
            <StatNumber fontSize="lg" color="green.600">
              {user.following ? user.following.toLocaleString() : 'N/A'}
            </StatNumber>
          </Stat>
          <Stat textAlign="center">
            <StatLabel fontSize="sm" color="gray.600">
              <HStack justify="center" spacing={1}>
                <CopyIcon />
                <Text>Repos</Text>
              </HStack>
            </StatLabel>
            <StatNumber fontSize="lg" color="purple.600">
              {user.public_repos ? user.public_repos.toLocaleString() : 'N/A'}
            </StatNumber>
          </Stat>
        </Grid>

        {/* User Details */}
        <VStack spacing={2} align="stretch">
          {user.location && (
            <HStack spacing={2}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">
                📍
              </Text>
              <Text fontSize="sm" color="gray.600">
                {user.location}
              </Text>
            </HStack>
          )}
          {user.company && (
            <HStack spacing={2}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">
                🏢
              </Text>
              <Text fontSize="sm" color="gray.600">
                {user.company}
              </Text>
            </HStack>
          )}
          {user.blog && (
            <HStack spacing={2}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">
                🌐
              </Text>
              <Text fontSize="sm" color="gray.600">
                {user.blog}
              </Text>
            </HStack>
          )}
        </VStack>

        {/* Action Buttons */}
        <HStack spacing={3}>
          <Button
            colorScheme="blue"
            size="sm"
            w="100%"
            onClick={() => window.open(user.html_url, '_blank')}
          >
            View Profile
          </Button>
          <Button
            variant="outline"
            size="sm"
            w="100%"
            onClick={() => window.open(`${user.html_url}?tab=repositories`, '_blank')}
          >
            View Repos
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};
