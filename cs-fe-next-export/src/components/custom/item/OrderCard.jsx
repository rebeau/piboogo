'use client';

import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import {
  Box,
  HStack,
  Image as ChakraImage,
  Text,
  VStack,
} from '@chakra-ui/react';

const OrderCard = (props) => {
  const { item, w = '26.25rem', isPrice = false } = props;
  return (
    <Box width={w}>
      <HStack>
        <Box w={'6.25rem'} h={'6.25rem'}>
          <ChakraImage
            fallback={<DefaultSkeleton />}
            w={'100%'}
            h={'100%'}
            src={item.image}
          />
        </Box>
        <Box>
          {isPrice ? (
            <VStack spacing={'0.75rem'}>
              <Box w={'100%'}>
                <VStack spacing={0}>
                  <Box w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={'1rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                    >
                      {item.productName}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      color={'#66809C'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      Option : {item.option}
                    </Text>
                  </Box>
                </VStack>
              </Box>
              <Box w={'100%'}>
                <Text
                  color={'#485766'}
                  fontSize={'1rem'}
                  fontWeight={400}
                  lineHeight={'1.75rem'}
                >
                  $129.00 / 2ea
                </Text>
              </Box>
            </VStack>
          ) : (
            <VStack spacing={0}>
              <Box w={'100%'}>
                <Text
                  color={'#485766'}
                  fontSize={'1rem'}
                  fontWeight={500}
                  lineHeight={'1.75rem'}
                >
                  {item.content}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#66809C'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  Option : {item.option}
                </Text>
              </Box>
            </VStack>
          )}
        </Box>
      </HStack>
    </Box>
  );
};

export default OrderCard;
