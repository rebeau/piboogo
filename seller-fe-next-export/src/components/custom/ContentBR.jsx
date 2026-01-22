'use client';

import { Box } from '@chakra-ui/react';

const ContentBR = (props) => {
  const { h = '11.25rem' } = props;

  return <Box w={'100%'} h={h} maxH={720} maxW={1920}></Box>;
};

export default ContentBR;
