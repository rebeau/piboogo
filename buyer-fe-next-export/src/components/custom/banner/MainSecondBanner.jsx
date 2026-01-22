'use client';

import { Box, Flex, Img } from '@chakra-ui/react';
import MainFirst from '@public/svgs/main/main-first.svg';

const MainFirstBanner = () => {
  return (
    <Box w={'100%'} h={'100%'} maxH={720} maxW={1920}>
      <Flex>
        <Box h={'100%'} w={'100%'} bg={'#90AEC4'} maxW={'50%'}>
          asd
        </Box>
        <Box h={'100%'} maxW={'50%'} maxH={720}>
          <Img src={MainFirst.src} />
        </Box>
      </Flex>
    </Box>
  );
};

export default MainFirstBanner;
