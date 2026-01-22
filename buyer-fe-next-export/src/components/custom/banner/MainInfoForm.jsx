'use client';

import useDevice from '@/hooks/useDevice';
import { Box, HStack, VStack } from '@chakra-ui/react';

const MainInfoForm = (props) => {
  const { isMobile, clampW, clampH } = useDevice();
  const { right, left, spacingH = 0 } = props;
  return isMobile(true) ? (
    <Box w={'100%'} h={'100%'}>
      <VStack h={'100%'} alignItems={'center'} spacing={spacingH}>
        <Box w={'100%'} h={'100%'} boxSizing="border-box">
          {left && left}
        </Box>
        <Box w={'100%'} h={'100%'} boxSizing="border-box">
          {right && right}
        </Box>
      </VStack>
    </Box>
  ) : (
    <Box w={'100%'} maxW={1920} h={740} maxH={740}>
      <HStack h={'100%'} alignItems={'center'} spacing={spacingH}>
        <Box w={'50%'} h={'100%'} boxSizing="border-box">
          {left && left}
        </Box>
        <Box w={'50%'} h={'100%'} boxSizing="border-box">
          {right && right}
        </Box>
      </HStack>
    </Box>
  );
};

export default MainInfoForm;
