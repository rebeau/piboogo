'use client';

import { Box, Img, Text, VStack } from '@chakra-ui/react';

const BrandBannerItem = (props) => {
  const { key, image = null, title = 'title', content = 'content' } = props;
  return (
    <Box w={'100%'} h={'100%'} maxH={720} maxW={1920} key={key}>
      <VStack spacing={0}>
        <Box>
          <Img src={image.src} />
        </Box>
        <Box py={'1.5rem'} px={'2.5rem'}>
          <VStack spacing={'1rem'} w={'100%'}>
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
            <Text fontSize={'1rem'} fontWeight={400} color={'#66809C'}>
              {content}
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default BrandBannerItem;
