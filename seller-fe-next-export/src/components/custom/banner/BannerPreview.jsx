'use client';

import { Box, VStack, HStack, Text, Center } from '@chakra-ui/react';

import { useCallback } from 'react';
import useLocale from '@/hooks/useLocale';

const BannerPreview = (props) => {
  const { localeText } = useLocale();

  const { position } = props;

  const dividerLayout = useCallback(() => {
    return (
      <Center w={'100%'}>
        <Box w={'6.85rem'} h={'1.625rem'}>
          <HStack spacing={'0.25rem'}>
            <Box w={'1.625rem'} h={'1.625rem'} bg={'#E8DFCA'} />
            <Box w={'1.625rem'} h={'1.625rem'} bg={'#E8DFCA'} />
            <Box w={'1.625rem'} h={'1.625rem'} bg={'#E8DFCA'} />
            <Box w={'1.625rem'} h={'1.625rem'} bg={'#E8DFCA'} />
          </HStack>
        </Box>
      </Center>
    );
  });

  const dummyLayout = useCallback(() => {
    return <Box w={'6.85rem'} h={'2.835rem'} bg={'#E8DFCA'} />;
  });

  const bannerLayout = useCallback(() => {
    return (
      <Center
        w={'7.5rem'}
        px={'2.19rem'}
        py={'0.6875rem'}
        bg={'#D9E7EC'}
        border={'1px dashed #9CADBE'}
      >
        <Text
          textAlign="center"
          color="#485766"
          fontSize="0.875rem"
          fontWeight="400"
          lineHeight="1.4rem"
        >
          Banner
        </Text>
      </Center>
    );
  });

  return (
    <Box
      w={'7.5rem'}
      h={'15.8125rem'}
      position={'relative'}
      bg={'#F2EEE2'}
      //
    >
      <VStack spacing={'1rem'}>
        {position === 1 ? bannerLayout() : dummyLayout()}

        {dividerLayout()}

        {position === 3 ? bannerLayout() : dummyLayout()}

        {dividerLayout()}

        {position === 2 ? bannerLayout() : dummyLayout()}
      </VStack>
    </Box>
  );
};

export default BannerPreview;
