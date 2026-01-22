'use client';

import { LANGUAGES } from '@/constants/lang';
import useDevice from '@/hooks/useDevice';
import useLocale from '@/hooks/useLocale';
import utils from '@/utils';
import { Box, Center, HStack, Img, Text, VStack } from '@chakra-ui/react';
import RightBlueArrow from '@public/svgs/icon/right-blue.svg';

const OrderHeader = (props) => {
  const { isMobile, clampW } = useDevice();
  const { lang, localeText } = useLocale();

  const { selectedOrders } = props;

  return isMobile(true) ? (
    <Box
      w={'100%'}
      py={'0.75rem'}
      boxSizing="border-box"
      borderTop={'1px solid #576076'}
      borderBottom={'1px solid #AEBDCA'}
    >
      <HStack justifyContent={'space-between'}>
        <Box w={'100%'}>
          <VStack spacing={'0.25rem'}>
            <Box w={'100%'}>
              <HStack justifyContent={'space-between'}>
                <Box>
                  <HStack spacing={'1.25rem'}>
                    <Box>
                      <Text
                        color={'#7895B2'}
                        fontSize={clampW(0.9375, 1)}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.MY_PAGE.ORDER.ORDER_DATE)}
                      </Text>
                    </Box>
                    <Box>
                      <Text
                        color={'#485766'}
                        fontSize={clampW(0.9375, 1)}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        {utils.parseDateByCountryCode(
                          selectedOrders.createdAt,
                          lang,
                          true,
                        )}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
                {/*
                <Box>
                  <Center h={'100%'}>
                    <HStack spacing={'0.5rem'}>
                      <Text
                        fontSize={clampW(0.9375, 1)}
                        fontWeight={400}
                        color={'#556A7E'}
                      >
                        {localeText(LANGUAGES.MY_PAGE.ORDER.DETAILS)}
                      </Text>
                      <Img
                        w={'1.25rem'}
                        h={'1.25rem'}
                        src={RightBlueArrow.src}
                      />
                    </HStack>
                  </Center>
                </Box>
                */}
              </HStack>
            </Box>
            <Box w={'100%'}>
              <HStack spacing={'1.25rem'}>
                <Box>
                  <Text
                    color={'#7895B2'}
                    fontSize={clampW(0.9375, 1)}
                    fontWeight={400}
                    lineHeight={'1.75rem'}
                  >
                    {localeText(LANGUAGES.MY_PAGE.ORDER.ORDER_NUMBER)}
                  </Text>
                </Box>
                <Box>
                  <Text
                    color={'#485766'}
                    fontSize={clampW(0.9375, 1)}
                    fontWeight={500}
                    lineHeight={'1.75rem'}
                  >
                    {selectedOrders.orderNum}
                  </Text>
                </Box>
              </HStack>
            </Box>
          </VStack>
        </Box>
      </HStack>
    </Box>
  ) : (
    <Box
      w={'100%'}
      h={'4.25rem'}
      py={'1.25rem'}
      boxSizing="border-box"
      borderTop={'1px solid #576076'}
      borderBottom={'1px solid #AEBDCA'}
    >
      <HStack justifyContent={'space-between'}>
        <Box>
          <HStack spacing={'1.25rem'}>
            <Box>
              <Text
                color={'#7895B2'}
                fontSize={'1rem'}
                fontWeight={400}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.MY_PAGE.ORDER.ORDER_DATE)}
              </Text>
            </Box>
            <Box>
              <Text
                color={'#485766'}
                fontSize={'1rem'}
                fontWeight={400}
                lineHeight={'1.75rem'}
              >
                {utils.parseDateByCountryCode(
                  selectedOrders.createdAt,
                  lang,
                  true,
                )}
              </Text>
            </Box>
            <Box w={'1px'} h={'1.25rem'} borderRight={'1px solid #AEBDCA'} />
            <Box>
              <Text
                color={'#7895B2'}
                fontSize={'1rem'}
                fontWeight={400}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.MY_PAGE.ORDER.ORDER_NUMBER)}
              </Text>
            </Box>
            <Box>
              <Text
                color={'#485766'}
                fontSize={'1rem'}
                fontWeight={500}
                lineHeight={'1.75rem'}
              >
                {selectedOrders.orderNum}
              </Text>
            </Box>
          </HStack>
        </Box>
        <Box h={'1.75rem'}>
          <Center
            h={'100%'}
            /*
            cursor={'pointer'}
            onClick={() => {
              handleDetail();
            }}
            */
          >
            <HStack spacing={'0.5rem'}>
              <Text
                fontSize={'1rem'}
                fontWeight={400}
                color={'#556A7E'}
                // lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.MY_PAGE.ORDER.DETAILS)}
              </Text>
              <Img w={'1.25rem'} h={'1.25rem'} src={RightBlueArrow.src} />
            </HStack>
          </Center>
        </Box>
      </HStack>
    </Box>
  );
};

export default OrderHeader;
