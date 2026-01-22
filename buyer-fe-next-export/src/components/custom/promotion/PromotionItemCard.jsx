'use client';

import useLocale from '@/hooks/useLocale';
import { Box, Center, Img, Text, VStack } from '@chakra-ui/react';

const PromotionItemCard = (props) => {
  const { localeText } = useLocale();
  const { isNew = false } = props;
  return (
    <Box w={'100%'}>
      <VStack spacing={0} w={'100%'}>
        <Box w={'100%'} position={'relative'}>
          {/* <Img w={'100%'} src={BestBanner1.src} /> */}
          {isNew && (
            <Center
              minW={'5rem'}
              position={'absolute'}
              left={'0.75rem'}
              bottom={'0.75rem'}
              borderRadius={'5rem'}
              p={'0.25rem'}
              bg={'#66809C'}
            >
              <Text
                color={'#FFF'}
                fontSize={'0.9375rem'}
                lineHeight={'1.5rem'}
                fontWeight={500}
              >
                New
              </Text>
            </Center>
          )}
        </Box>
        <Box w={'100%'} pt={'1rem'}>
          <VStack spacing={'0.75rem'}>
            <Box w={'100%'}>
              <VStack spacing={0}>
                <Box w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'1.75rem'}
                    fontWeight={500}
                    lineHeight={'2.7475rem'}
                  >
                    Best of Showcase
                  </Text>
                </Box>
                <Box w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'1.25rem'}
                    fontWeight={400}
                    lineHeight={'2.25rem'}
                  >
                    2024.12.22 ~ 2024.12.22
                  </Text>
                </Box>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default PromotionItemCard;
