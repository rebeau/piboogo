'use client';

import useDevice from '@/hooks/useDevice';
import { Box, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

const SellerSideButton = (props) => {
  const router = useRouter();

  const { isMobile, clampW } = useDevice();

  const { index, sideIndex, target } = props;

  const handleMovePage = useCallback(() => {
    router.push(target.href);
  });

  return isMobile(true) ? (
    <Box
      cursor={'pointer'}
      onClick={handleMovePage}
      w={'100%'}
      py={'0.5rem'}
      px={'1rem'}
      bg={sideIndex === index ? '#90aec426' : null}
    >
      <Text
        color={sideIndex === index ? '#66809C' : '#556A7E'}
        fontSize={clampW(0.9375, 1.125)}
        fontWeight={sideIndex === index ? 600 : 400}
        lineHeight={'1.96875rem'}
      >
        {target.title}
      </Text>
    </Box>
  ) : (
    <Box
      cursor={'pointer'}
      onClick={handleMovePage}
      w={'100%'}
      py={'1rem'}
      px={'1.25rem'}
      bg={sideIndex === index ? '#90aec426' : null}
    >
      <Text
        color={sideIndex === index ? '#66809C' : '#A7C3D2'}
        fontSize={'1.125rem'}
        fontWeight={sideIndex === index ? 600 : 400}
        lineHeight={'1.96875rem'}
      >
        {target.title}
      </Text>
    </Box>
  );
};

export default SellerSideButton;
