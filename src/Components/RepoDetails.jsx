import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  GridItem,
  useToast,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import {
  Line,
  Bar,
  Doughnut
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';
import { useSelector } from 'react-redux';
import { ArrowBackIcon, RepeatIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

export const RepoDetails = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [codeFrequencyData, setCodeFrequencyData] = useState([]);
  const [repoInfo, setRepoInfo] = useState(null);
  const [chartType, setChartType] = useState('line');

  const repo = useSelector(state => state.add);
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const tableBorderColor = useColorModeValue('gray.100', 'gray.700');
  const tableHoverBg = useColorModeValue('gray.50', 'gray.700');
  const pageBgColor = useColorModeValue('gray.50', 'gray.900');

  useEffect(() => {
    if (!repo) {
      navigate('/');
      return;
    }

    fetchRepoData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo, navigate]);

  const fetchRepoData = async () => {
    setLoading(true);
    setError(false);

    try {
      // Extract repo name from the API URL
      const repoName = repo.split('/repos/')[1].split('/stats')[0];

      // Fetch code frequency data
      const codeResponse = await fetch(repo);
      if (!codeResponse.ok) {
        throw new Error(`Failed to fetch code frequency: ${codeResponse.status}`);
      }
      const codeData = await codeResponse.json();

      // Fetch repository information
      const repoResponse = await fetch(`https://api.github.com/repos/${repoName}`);
      if (!repoResponse.ok) {
        throw new Error(`Failed to fetch repo info: ${repoResponse.status}`);
      }
      const repoData = await repoResponse.json();

      setCodeFrequencyData(codeData);
      setRepoInfo(repoData);

    } catch (err) {
      setError(err.message);
      toast({
        title: 'Error loading repository data',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading) {
    return <LoadingSpinner text="Loading repository analytics..." />;
  }

  if (error) {
    return (
      <Box p={8} textAlign="center">
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Error loading repository data!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
        </Alert>
        <Button
          mt={4}
          colorScheme="blue"
          onClick={fetchRepoData}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  if (!codeFrequencyData || codeFrequencyData.length === 0) {
    return (
      <Box p={8} textAlign="center">
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>No data available</AlertTitle>
            <AlertDescription>
              This repository doesn't have enough commit activity to display analytics.
            </AlertDescription>
          </Box>
        </Alert>
      </Box>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: codeFrequencyData.slice(0, 12).map(item => formatDate(item[0])),
    datasets: [
      {
        label: 'Additions',
        data: codeFrequencyData.slice(0, 12).map(item => item[1]),
        fill: true,
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Deletions',
        data: codeFrequencyData.slice(0, 12).map(item => item[2]),
        fill: false,
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const barData = {
    labels: codeFrequencyData.slice(0, 8).map(item => formatDate(item[0])),
    datasets: [
      {
        label: 'Net Changes',
        data: codeFrequencyData.slice(0, 8).map(item => item[1] - item[2]),
        backgroundColor: codeFrequencyData.slice(0, 8).map(item =>
          item[1] - item[2] >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
        ),
        borderColor: codeFrequencyData.slice(0, 8).map(item =>
          item[1] - item[2] >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
        ),
        borderWidth: 1
      }
    ]
  };

  const doughnutData = {
    labels: ['Additions', 'Deletions'],
    datasets: [
      {
        data: [
          codeFrequencyData.reduce((sum, item) => sum + item[1], 0),
          codeFrequencyData.reduce((sum, item) => sum + item[2], 0)
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        beginAtZero: true
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const totalAdditions = codeFrequencyData.reduce((sum, item) => sum + item[1], 0);
  const totalDeletions = codeFrequencyData.reduce((sum, item) => sum + item[2], 0);
  const netChange = totalAdditions - totalDeletions;
  const totalCommits = codeFrequencyData.length;

  return (
    <Box bg={pageBgColor} minH="100vh" py={8}>
      <VStack spacing={8} maxW="1400px" mx="auto" px={6}>
        {/* Header */}
        <Box
          w="100%"
          bg={bgColor}
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
          boxShadow="sm"
        >
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={2}>
              <Button
                leftIcon={<ArrowBackIcon />}
                variant="ghost"
                onClick={() => navigate('/')}
                colorScheme="blue"
              >
                Back to Repositories
              </Button>

              {repoInfo && (
                <VStack align="start" spacing={1}>
                  <Heading size="lg" color={textColor}>
                    {repoInfo.full_name}
                  </Heading>
                  <Text color="gray.600" maxW="2xl">
                    {repoInfo.description}
                  </Text>
                  <HStack spacing={4}>
                    <Badge colorScheme="blue">{repoInfo.language}</Badge>
                    <Badge colorScheme={repoInfo.private ? 'red' : 'green'}>
                      {repoInfo.private ? 'Private' : 'Public'}
                    </Badge>
                    <Badge colorScheme="purple">{repoInfo.license?.name || 'No License'}</Badge>
                  </HStack>
                </VStack>
              )}
            </VStack>

            <HStack spacing={3}>
              <Tooltip label="Refresh data">
                <IconButton
                  icon={<RepeatIcon />}
                  onClick={fetchRepoData}
                  colorScheme="blue"
                  variant="ghost"
                  aria-label="Refresh data"
                />
              </Tooltip>
            </HStack>
          </HStack>
        </Box>

        {/* Summary Stats */}
        <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6} w="100%">
          <GridItem>
            <Box
              bg={bgColor}
              p={6}
              borderRadius="lg"
              border="1px"
              borderColor={borderColor}
              textAlign="center"
            >
              <Stat>
                <StatLabel color="gray.600">Total Additions</StatLabel>
                <StatNumber color="green.500" fontSize="2xl">
                  {formatNumber(totalAdditions)}
                </StatNumber>
                <StatHelpText>Lines of code added</StatHelpText>
              </Stat>
            </Box>
          </GridItem>

          <GridItem>
            <Box
              bg={bgColor}
              p={6}
              borderRadius="lg"
              border="1px"
              borderColor={borderColor}
              textAlign="center"
            >
              <Stat>
                <StatLabel color="gray.600">Total Deletions</StatLabel>
                <StatNumber color="red.500" fontSize="2xl">
                  {formatNumber(totalDeletions)}
                </StatNumber>
                <StatHelpText>Lines of code removed</StatHelpText>
              </Stat>
            </Box>
          </GridItem>

          <GridItem>
            <Box
              bg={bgColor}
              p={6}
              borderRadius="lg"
              border="1px"
              borderColor={borderColor}
              textAlign="center"
            >
              <Stat>
                <StatLabel color="gray.600">Net Change</StatLabel>
                <StatNumber
                  color={netChange >= 0 ? 'green.500' : 'red.500'}
                  fontSize="2xl"
                >
                  {netChange >= 0 ? '+' : ''}{formatNumber(netChange)}
                </StatNumber>
                <StatHelpText>Overall code change</StatHelpText>
              </Stat>
            </Box>
          </GridItem>

          <GridItem>
            <Box
              bg={bgColor}
              p={6}
              borderRadius="lg"
              border="1px"
              borderColor={borderColor}
              textAlign="center"
            >
              <Stat>
                <StatLabel color="gray.600">Weeks Tracked</StatLabel>
                <StatNumber color="blue.500" fontSize="2xl">
                  {totalCommits}
                </StatNumber>
                <StatHelpText>Weeks of activity</StatHelpText>
              </Stat>
            </Box>
          </GridItem>
        </Grid>

        {/* Chart Type Selector */}
        <HStack spacing={4} justify="center">
          <Button
            variant={chartType === 'line' ? 'solid' : 'outline'}
            colorScheme="blue"
            onClick={() => setChartType('line')}
          >
            Line Chart
          </Button>
          <Button
            variant={chartType === 'bar' ? 'solid' : 'outline'}
            colorScheme="blue"
            onClick={() => setChartType('bar')}
          >
            Bar Chart
          </Button>
          <Button
            variant={chartType === 'doughnut' ? 'solid' : 'outline'}
            colorScheme="blue"
            onClick={() => setChartType('doughnut')}
          >
            Summary
          </Button>
        </HStack>

        {/* Charts */}
        <Box
          w="100%"
          bg={bgColor}
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
          boxShadow="sm"
        >
          <VStack spacing={6}>
            <Heading size="md" color={textColor}>
              Code Activity Over Time
            </Heading>

            <Box h="400px" w="100%">
              {chartType === 'line' && (
                <Line data={chartData} options={chartOptions} />
              )}
              {chartType === 'bar' && (
                <Bar data={barData} options={chartOptions} />
              )}
              {chartType === 'doughnut' && (
                <Box maxW="400px" mx="auto">
                  <Doughnut data={doughnutData} options={chartOptions} />
                </Box>
              )}
            </Box>

            <Text fontSize="sm" color="gray.500" textAlign="center">
              Data shows weekly code frequency changes. Positive values indicate additions, negative values indicate deletions.
            </Text>
          </VStack>
        </Box>

        {/* Raw Data Table */}
        <Box
          w="100%"
          bg={bgColor}
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
          boxShadow="sm"
        >
          <VStack spacing={4} align="stretch">
            <Heading size="md" color={textColor}>
              Weekly Breakdown
            </Heading>

            <Box overflowX="auto">
              <Box as="table" w="100%" borderCollapse="collapse">
                <Box as="thead">
                  <Box as="tr" borderBottom="1px" borderColor={borderColor}>
                    <Box as="th" p={3} textAlign="left" color={textColor}>Week</Box>
                    <Box as="th" p={3} textAlign="right" color="green.500">Additions</Box>
                    <Box as="th" p={3} textAlign="right" color="red.500">Deletions</Box>
                    <Box as="th" p={3} textAlign="right" color="blue.500">Net Change</Box>
                  </Box>
                </Box>
                <Box as="tbody">
                  {codeFrequencyData.slice(0, 12).map((item, index) => (
                    <Box
                      as="tr"
                      key={index}
                      borderBottom="1px"
                      borderColor={tableBorderColor}
                      _hover={{ bg: tableHoverBg }}
                    >
                      <Box as="td" p={3} color={textColor}>
                        {formatDate(item[0])}
                      </Box>
                      <Box as="td" p={3} textAlign="right" color="green.500">
                        +{item[1].toLocaleString()}
                      </Box>
                      <Box as="td" p={3} textAlign="right" color="red.500">
                        -{item[2].toLocaleString()}
                      </Box>
                      <Box
                        as="td"
                        p={3}
                        textAlign="right"
                        color={item[1] - item[2] >= 0 ? 'green.500' : 'red.500'}
                        fontWeight="semibold"
                      >
                        {item[1] - item[2] >= 0 ? '+' : ''}{(item[1] - item[2]).toLocaleString()}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};
