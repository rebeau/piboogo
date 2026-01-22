'use client';

import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import useDevice from '@/hooks/useDevice';
import { Box, Text, VStack, Image as ChakraImage } from '@chakra-ui/react';

const BrandBannerItem = (props) => {
  const { isMobile } = useDevice();
  const { key, image = null, title = 'title', content } = props;
  return isMobile(true) ? (
    <Box w={'100%'} h={'100%'} maxH={720} key={key}>
      <VStack spacing={0} w={'100%'}>
        <Box w={'100%'} h={'28.125rem'}>
          <ChakraImage
            fallback={<DefaultSkeleton />}
            objectFit={'cover'}
            w={'100%'}
            h={'100%'}
            src={image}
          />
        </Box>
        <Box py={'1.5rem'} px={'2.5rem'} w={'100%'}>
          <Box w={'100%'}>
            <Text
              textAlign={'left'}
              fontSize={'1.25rem'}
              fontWeight={500}
              color={'#576076'}
            >
              {title}
            </Text>
          </Box>
          {content && (
            <Text fontSize={'1rem'} fontWeight={400} color={'#66809C'}>
              {content}
            </Text>
          )}
        </Box>
      </VStack>
    </Box>
  ) : (
    <Box w={'100%'} h={'100%'} maxH={720} maxW={1920} key={key}>
      <VStack spacing={0} w={'30rem'}>
        <Box w={'100%'} h={'28.125rem'}>
          <ChakraImage
            fallback={<DefaultSkeleton />}
            objectFit={'cover'}
            w={'100%'}
            h={'100%'}
            src={image}
          />
        </Box>
        <Box py={'1.5rem'} px={'2.5rem'} w={'100%'}>
          <Box w={'100%'}>
            <Text
              textAlign={'left'}
              fontSize={'1.25rem'}
              fontWeight={500}
              color={'#576076'}
            >
              {title}
            </Text>
          </Box>
          {content && (
            <Text fontSize={'1rem'} fontWeight={400} color={'#66809C'}>
              {content}
            </Text>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default BrandBannerItem;
