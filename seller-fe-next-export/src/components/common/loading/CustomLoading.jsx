'use client';

import {
  Text,
  VStack,
  Center,
  CircularProgress,
  HStack,
  Box,
} from '@chakra-ui/react';

const CustomLoading = () => {
  return (
    <Box
      position="absolute"
      zIndex={99999}
      w="100%"
      h={document.getElementsByTagName('html')[0].scrollHeight}
      // bgColor="blackAlpha.600"
      bgColor="blackAlpha.700"
    >
      <HStack
        spacing={0}
        justifyContent="center"
        alignItems="center"
        w="100%"
        h="100%"
        position="relative"
      >
        <Center
          w="100%"
          h="250px"
          position="fixed"
          top="50%"
          transform="translate(0, -50%)"
        >
          <CircularProgress
            className="custom-loading"
            capIsRound
            trackColor="#01B16E"
            thickness="8px"
            color="#BFFF00"
            value={25}
            size="240px"
          />

          <Box position="absolute">
            <VStack>
              <Box w="100%">
                <Text
                  fontWeight={700}
                  fontSize="20px"
                  color="#BFFF00"
                  textAlign="center"
                >
                  똑똑한
                </Text>
              </Box>
              <Box w="100%">
                <Text
                  fontWeight={700}
                  fontSize="20px"
                  color="#BFFF00"
                  textAlign="center"
                >
                  AI 요금 계산 중
                </Text>
              </Box>
            </VStack>
          </Box>
        </Center>
      </HStack>
    </Box>
  );
};

export default CustomLoading;
