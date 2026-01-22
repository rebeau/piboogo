'use client';

import useDevice from '@/hooks/useDevice';
import { Box } from '@chakra-ui/react';

const MainContainer = (props) => {
  const { isMobile } = useDevice();
  const { children } = props;

  return isMobile(true) ? (
    <Box className="main-container-mobile" minW={'100%'} overflowY={'hidden'}>
      {children}
    </Box>
  ) : (
    <Box className="main-container" minW={isMobile(true) ? '100%' : 1200}>
      {children}
    </Box>
  );
};

export default MainContainer;
