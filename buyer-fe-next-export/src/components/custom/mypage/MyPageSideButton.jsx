'use client';

import useDevice from '@/hooks/useDevice';
import { Box, Text, WrapItem } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const ListSideButton = (props) => {
  const { isMobile, clampW } = useDevice();
  const router = useRouter();

  const { index, sideIndex, target } = props;

  const handleMovePage = useCallback(() => {
    router.push(target.href);
  });

  return isMobile(true) ? (
    <WrapItem cursor={'pointer'} onClick={handleMovePage}>
      <Text
        color={sideIndex === index ? '#66809C' : '#A7C3D2'}
        fontSize={clampW(0.9375, 1.25)}
        fontWeight={sideIndex === index ? 600 : 400}
        lineHeight={'160%'}
      >
        {target.title}
      </Text>
    </WrapItem>
  ) : (
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
