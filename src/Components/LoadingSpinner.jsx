import React from 'react';
import { Box, Spinner, Text, VStack, keyframes } from '@chakra-ui/react';

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const LoadingSpinner = ({
  size = 'xl',
  text = 'Loading...',
  showText = true,
  color = 'blue.500',
  thickness = '4px',
  speed = '0.65s'
}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minH="200px"
      w="100%"
    >
      <VStack spacing={4}>
        <Spinner
          thickness={thickness}
          speed={speed}
          color={color}
          size={size}
          animation={`${pulse} 2s ease-in-out infinite`}
        />
        {showText && (
          <Text
            color="gray.600"
            fontSize="lg"
            fontWeight="medium"
            animation={`${pulse} 2s ease-in-out infinite`}
          >
            {text}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default LoadingSpinner;
