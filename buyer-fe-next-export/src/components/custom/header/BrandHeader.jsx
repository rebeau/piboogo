'use client';

import useDevice from '@/hooks/useDevice';
import { Box, HStack, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react';

const BrandHeader = (props) => {
  const { isMobile, clampW, clampH } = useDevice();
  const { headerTitle = 'header', listMenu = [], targetId, onClick } = props;

  const handleOnClick = (item) => {
    if (onClick) {
      onClick(item);
    }
  };

  return isMobile(true) ? (
    <Box w={'100%'} h={'100%'}>
      <Box px={clampW(1, 1.25)} w={'100%'}>
        <VStack w={'100%'} spacing={'1.25rem'}>
          <Box
            display={'flex'}
            justifyContent={'flex-start'}
            py={'0.5rem'}
            w={'100%'}
          >
            <Text
              fontSize={'clamp(1.5rem, 5vw, 2.75rem)'}
              fontWeight={500}
              color={'#485766'}
              lineHeight={'160%'}
            >
              {headerTitle}
            </Text>
          </Box>
          {listMenu.length > 0 && (
            <Box w={'100%'}>
              <Wrap
                h={'100%'}
                spacingX={clampW(1.25, 1.5)}
                spacingY={'clamp(0.44rem, 1vw, 1.5rem)'}
              >
                {listMenu.map((item, index) => {
                  return (
                    <WrapItem
                      py={'0.5rem'}
                      w={'max-content'}
                      key={index}
                      onClick={() => {
                        handleOnClick(item);
                      }}
                    >
                      <Text
                        textAlign={'center'}
                        fontSize={clampW(0.9375, 1.25)}
                        fontWeight={
                          targetId === item.firstCategoryId ? 600 : 400
                        }
                        color={
                          targetId === item.firstCategoryId
                            ? '#66809C'
                            : '#9CADBE'
                        }
                        lineHeight={'160%'}
                      >
                        {item.name}
                      </Text>
                    </WrapItem>
                  );
                })}
              </Wrap>
            </Box>
          )}
        </VStack>
      </Box>
    </Box>
  ) : (
    <Box w={'100%'} h={'100%'} maxH={720} maxW={1920}>
      <Box pt={'1.5rem'} px={'1.25rem'} w={'100%'}>
        <VStack w={'100%'} spacing={'1.25rem'}>
          <Box
            display={'flex'}
            justifyContent={'flex-start'}
            py={'0.5rem'}
            px={'1.25rem'}
            w={'100%'}
          >
            <Text fontSize={'2.75rem'} fontWeight={500} color={'#485766'}>
              {headerTitle}
            </Text>
          </Box>
          <HStack py={'1rem'} px={'1.25rem'} w={'100%'} spacing={'3.75rem'}>
            {listMenu.map((item, index) => {
              return (
                <Box
                  minW={'6.875rem'}
                  key={index}
                  _hover={{
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    handleOnClick(item);
                  }}
                >
                  <Text
                    textAlign={'center'}
                    fontSize={'1.25rem'}
                    fontWeight={targetId === item.firstCategoryId ? 600 : 400}
                    color={
                      targetId === item.firstCategoryId ? '#66809C' : '#9CADBE'
                    }
                  >
                    {item.name}
                  </Text>
                </Box>
              );
            })}
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default BrandHeader;
