'use client';

import { Box, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

const ListSideButton = (props) => {
  const router = useRouter();

  const { index, sideIndex, target } = props;

  const handleMovePage = useCallback(() => {
    router.push(target.href);
  });

  return (
    <Box cursor={'pointer'} w={'100%'} onClick={handleMovePage}>
      <Text
        color={sideIndex === index ? '#66809C' : '#A7C3D2'}
        fontSize={'1.25rem'}
        fontWeight={sideIndex === index ? 600 : 400}
        lineHeight={'2.25rem'}
      >
        {target.title}
      </Text>
    </Box>
  );
};

export default ListSideButton;
