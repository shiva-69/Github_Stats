import React from 'react';
import { Box, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box textAlign="center" py={20} px={6}>
          <VStack spacing={6}>
            <Icon as={WarningIcon} w={16} h={16} color="red.500" />
            <Heading size="lg" color="red.500">
              Oops! Something went wrong
            </Heading>
            <Text color="gray.600" maxW="md">
              We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
            </Text>
            <Button
              colorScheme="blue"
              onClick={() => window.location.reload()}
              size="lg"
            >
              Refresh Page
            </Button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                mt={4}
                p={4}
                bg="gray.100"
                borderRadius="md"
                textAlign="left"
                maxW="2xl"
                overflow="auto"
              >
                <Text fontWeight="bold" mb={2}>Error Details:</Text>
                <Text fontSize="sm" fontFamily="mono">
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <>
                    <Text fontWeight="bold" mt={4} mb={2}>Stack Trace:</Text>
                    <Text fontSize="sm" fontFamily="mono">
                      {this.state.errorInfo.componentStack}
                    </Text>
                  </>
                )}
              </Box>
            )}
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
