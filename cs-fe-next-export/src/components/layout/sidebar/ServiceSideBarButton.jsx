'use client';

import { Box, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const ServiceSideBarButton = (props) => {
  const router = useRouter();

  const { index, sideIndex, target } = props;

  const handleMovePage = useCallback(() => {
    router.push(target.href);
  });

  return (
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

export default ServiceSideBarButton;
