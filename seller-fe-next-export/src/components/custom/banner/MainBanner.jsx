'use client';

import { Box, Flex } from '@chakra-ui/react';

const MainBanner = (props) => {
  const { right, left, isHeight = false } = props;
  return (
    <Box
      w={'100%'}
      maxH={'45rem'}
      maxW={1920}
      // maxH={720}
    >
      <Flex
        direction="row"
        h={isHeight ? '100%' : null}
        // justify="center"
        // align="center"
        // bg="gray.100"
      >
        {right && right}
        {left && left}
      </Flex>
    </Box>
  );
};

export default MainBanner;
