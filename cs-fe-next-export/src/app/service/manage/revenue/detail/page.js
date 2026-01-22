'use client';

import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import {
  Box,
  Button,
  HStack,
  Image as ChakraImage,
  Text,
  VStack,
  Img,
  Divider,
  Textarea,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import IconRight from '@public/svgs/icon/right.svg';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import ContentDetailHeader from '@/components/layout/header/ContentDetailHeader';
import OrderCard from '@/components/custom/item/OrderCard';

const RevenueDetailPage = () => {
  // const { category } = useParams();
  const router = useRouter();
  const { localeText } = useLocale();
  const [searchBy, setSearchBy] = useState(null);

  const listOrder = [
    {
      brand: 'Rampal Latour1',
      items: [
        {
          name: 'Rampal Latour1',
          content: 'Marseille Blanc 300g',
          option: '[Color]Cappuccino (+$2.00)',
          quantity: 2,
          price: 54,
          cost: 3,
          image: 'https://via.placeholder.com/100x100',
        },
        {
          name: 'Rampal Latour1',
          content: 'Marseille Blanc 300g',
          option: '[Color]Cappuccino (+$2.00)',
          quantity: 2,
          price: 54,
          cost: 3,
          image: 'https://via.placeholder.com/100x100',
        },
      ],
    },
    {
      brand: 'Rampal 22',
      items: [
        {
          name: 'Rampal Latour1',
          content: 'Marseille Blanc 300g',
          option: '[Color]Cappuccino (+$2.00)',
          quantity: 2,
          price: 54,
          cost: 3,
          image: 'https://via.placeholder.com/100x100',
        },
        {
          name: 'Rampal Latour1',
          content: 'Marseille Blanc 300g',
          option: '[Color]Cappuccino (+$2.00)',
          quantity: 2,
          price: 54,
          cost: 3,
          image: 'https://via.placeholder.com/100x100',
        },
      ],
    },
  ];

  const orderCardRow = useCallback((orders, rowIndex) => {
    const handleMoveBrand = (href) => {
      router.push(href);
    };

    const items = orders?.items || [];
    return (
      <Box
        key={rowIndex}
        w={'100%'}
        borderBottom="1px solid #AEBDCA"
        p={'1.25rem'}
      >
        <VStack spacing={'1.25rem'}>
          <Box
            w={'100%'}
            cursor={'pointer'}
            onClick={() => {
              handleMoveBrand(orders.href);
            }}
          >
            <HStack>
              <Text fontSize={'1rem'} fontWeight={400} color={'#556A7E'}>
                {orders.brand}
              </Text>
              <Img w={'1.25rem'} h={'1.25rem'} src={IconRight.src} />
            </HStack>
          </Box>

          {items.map((item, orderIndex) => {
            return (
              <Box key={orderIndex} w={'100%'}>
                <HStack spacing={'0.75rem'} justifyContent={'space-between'}>
                  <OrderCard item={item} />
                  <Box width={'8.8333rem'}>
                    <Text
                      textAlign={'center'}
                      color={'#485766'}
                      fontSize={'1rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                    >
                      {item.quantity}
                    </Text>
                  </Box>
                  <Box width={'8.8333rem'}>
                    <Text
                      textAlign={'center'}
                      color={'#485766'}
                      fontSize={'1rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                    >
                      ${item.price}
                    </Text>
                  </Box>
                  <Box width={'8.8333rem'}>
                    <Text
                      textAlign={'center'}
                      color={'#485766'}
                      fontSize={'1rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                    >
                      ${item.cost}
                    </Text>
                  </Box>
                </HStack>
              </Box>
            );
          })}
        </VStack>
      </Box>
    );
  });

  return (
    <Box
      w={'100%'}
      h={'100%'}
      py={'1.25rem'}
      overflowY={'auto'}
      className="no-scroll"
    >
      <VStack
        spacing={'1.25rem'}
        alignItems={'flex-start'}
        justifyContent={'flex-start'}
      >
        <Box w={'72.75rem'}>
          <ContentDetailHeader />
        </Box>
        <Box w={'72.75rem'}>
          <VStack spacing={'2.5rem'}>
            <Box>
              <VStack spacing={'1.25rem'}>
                <Box
                  w={'100%'}
                  h={'4rem'}
                  py={'0.75rem'}
                  boxSizing={'border-box'}
                  borderTop={'1px solid #576076'}
                  borderBottom={'1px solid #AEBDCA'}
                >
                  <Box w={'100%'}>
                    <HStack
                      spacing={'1.25rem'}
                      justifyContent={'space-between'}
                    >
                      <Box>
                        <HStack spacing={'1.25rem'}>
                          <Box w={'max-content'}>
                            <HStack spacing={'1.25rem'}>
                              <Box w={'max-content'}>
                                <Text
                                  color={'#7895B2'}
                                  fontSize={'0.9375rem'}
                                  fontWeight={400}
                                  lineHeight={'1.5rem'}
                                >
                                  {localeText(
                                    LANGUAGES.MY_PAGE.ORDER.ORDER_DETE,
                                  )}
                                </Text>
                              </Box>
                              <Box w={'max-content'}>
                                <Text
                                  color={'#485766'}
                                  fontSize={'0.9375rem'}
                                  fontWeight={400}
                                  lineHeight={'1.5rem'}
                                >
                                  19 Dec 2024
                                </Text>
                              </Box>
                            </HStack>
                          </Box>

                          <Divider
                            h={'1.25rem'}
                            borderRight={'1px solid #AEBDCA'}
                          />

                          <Box w={'max-content'}>
                            <HStack spacing={'1.25rem'}>
                              <Box w={'max-content'}>
                                <Text
                                  color={'#7895B2'}
                                  fontSize={'0.9375rem'}
                                  fontWeight={400}
                                  lineHeight={'1.5rem'}
                                >
                                  {localeText(
                                    LANGUAGES.MY_PAGE.ORDER.ORDER_NUMBER,
                                  )}
                                </Text>
                              </Box>
                              <Box w={'max-content'}>
                                <Text
                                  color={'#485766'}
                                  fontSize={'0.9375rem'}
                                  fontWeight={500}
                                  lineHeight={'1.5rem'}
                                >
                                  2024823-8413
                                </Text>
                              </Box>
                            </HStack>
                          </Box>
                        </HStack>
                      </Box>

                      <Box
                        px={'1rem'}
                        py={'0.5rem'}
                        bg={'#D9E7EC'}
                        borderRadius={'1.25rem'}
                      >
                        <Text
                          color={'#66809C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                          textAlign={'center'}
                        >
                          {localeText(LANGUAGES.SALES.COMPLETED_PAYMENT)}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                </Box>
                <Box w={'100%'}>
                  <HStack
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    {/* Left side: Image and product info */}
                    <Box h={'5rem'}>
                      <HStack
                        justifyContent={'flex-start'}
                        alignItems={'center'}
                        spacing={'1.25rem'}
                      >
                        <Box w={'5rem'} h={'5rem'}>
                          <ChakraImage
                            fallback={<DefaultSkeleton />}
                            w={'100%'}
                            h={'100%'}
                            src={''}
                          />
                        </Box>

                        <Box>
                          <VStack
                            justifyContent={'center'}
                            alignItems={'flex-start'}
                            spacing={'0.25rem'}
                          >
                            <VStack
                              flexDirection={'column'}
                              justifyContent={'flex-start'}
                              alignItems={'flex-start'}
                              gap={1}
                            >
                              <Text
                                color={'#485766'}
                                fontSize={'1rem'}
                                fontFamily={'Poppins'}
                                fontWeight={'500'}
                                lineHeight={'1.75rem'}
                                wordWrap={'break-word'}
                              >
                                Marseille Blanc 300g
                              </Text>
                              <Text
                                color={'#66809C'}
                                fontSize={'0.9375rem'}
                                fontFamily={'Poppins'}
                                fontWeight={'400'}
                                lineHeight={'1.5rem'}
                                wordWrap={'break-word'}
                              >
                                Option: [Color] Cappuccino (+$2.00)
                              </Text>
                            </VStack>
                          </VStack>
                        </Box>
                      </HStack>
                    </Box>

                    <Box>
                      <HStack>
                        {/* Price */}
                        <VStack
                          w={'8.75rem'}
                          flexDirection={'column'}
                          justifyContent={'center'}
                          alignItems={'flex-start'}
                          gap={1}
                        >
                          <Text
                            textAlign={'center'}
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontFamily={'Poppins'}
                            fontWeight={'500'}
                            lineHeight={'1.5rem'}
                            wordWrap={'break-word'}
                          >
                            {localeText(LANGUAGES.SALES.PRODUCT_PRICE)}
                          </Text>
                          <Text
                            textAlign={'center'}
                            color={'#485766'}
                            fontSize={'1rem'}
                            fontFamily={'Poppins'}
                            fontWeight={'500'}
                            lineHeight={'1.75rem'}
                            wordWrap={'break-word'}
                          >
                            $50
                          </Text>
                        </VStack>

                        {/* Quantity */}
                        <VStack
                          w={'6.25rem'}
                          flexDirection={'column'}
                          justifyContent={'center'}
                          alignItems={'flex-start'}
                          gap={1}
                        >
                          <Text
                            textAlign={'center'}
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontFamily={'Poppins'}
                            fontWeight={'500'}
                            lineHeight={'1.5rem'}
                            wordWrap={'break-word'}
                          >
                            {localeText(LANGUAGES.ORDER.QUANTITY)}
                          </Text>
                          <Text
                            textAlign={'center'}
                            color={'#485766'}
                            fontSize={'1rem'}
                            fontFamily={'Poppins'}
                            fontWeight={'500'}
                            lineHeight={'1.75rem'}
                            wordWrap={'break-word'}
                          >
                            2
                          </Text>
                        </VStack>

                        {/* Total */}
                        <VStack
                          w={'6.25rem'}
                          flexDirection={'column'}
                          justifyContent={'center'}
                          alignItems={'flex-start'}
                          gap={1}
                        >
                          <Text
                            textAlign={'center'}
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontFamily={'Poppins'}
                            fontWeight={'500'}
                            lineHeight={'1.5rem'}
                            wordWrap={'break-word'}
                          >
                            {localeText(LANGUAGES.ORDER.TOTAL)}
                          </Text>
                          <Text
                            textAlign={'center'}
                            color={'#485766'}
                            fontSize={'1rem'}
                            fontFamily={'Poppins'}
                            fontWeight={'500'}
                            lineHeight={'1.75rem'}
                            wordWrap={'break-word'}
                          >
                            $100
                          </Text>
                        </VStack>

                        {/* Order status */}
                        <VStack
                          w={'10rem'}
                          flexDirection={'column'}
                          justifyContent={'center'}
                          alignItems={'flex-start'}
                          gap={1}
                        >
                          <Text
                            textAlign={'center'}
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontFamily={'Poppins'}
                            fontWeight={'500'}
                            lineHeight={'1.5rem'}
                            wordWrap={'break-word'}
                          >
                            {localeText(LANGUAGES.SALES.ORDER_STATUS).replace(
                              '\n',
                              ' ',
                            )}
                          </Text>
                          <Text
                            textAlign={'center'}
                            color={'#485766'}
                            fontSize={'1rem'}
                            fontFamily={'Poppins'}
                            fontWeight={'500'}
                            lineHeight={'1.75rem'}
                            wordWrap={'break-word'}
                          >
                            {localeText(LANGUAGES.ORDER.DELIVERED)}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  </HStack>
                </Box>

                <Divider borderTop={'1px solid #AEBDCA'} />

                <Box
                  w={'72.75rem'} // 1164px -> 72.75rem
                  h={'19.5rem'} // 312px -> 19.5rem
                  p={5} // 20px -> 1.25rem
                  bg={'#90aec412'}
                  flexDirection={'column'}
                  justifyContent={'flex-start'}
                  alignItems={'flex-start'}
                  gap={5} // 20px -> 1.25rem
                  display={'inline-flex'}
                >
                  <Text
                    textAlign={'center'}
                    color={'#485766'}
                    fontSize={'1.125rem'}
                    fontFamily={'Poppins'}
                    fontWeight={'500'}
                    lineHeight={'1.96875rem'}
                    wordWrap={'break-word'}
                  >
                    {localeText(LANGUAGES.SALES.PAYMENT_INFO)}
                  </Text>

                  <VStack
                    alignSelf={'stretch'}
                    h={'13.75rem'}
                    flexDirection={'column'}
                    justifyContent={'flex-start'}
                    alignItems={'flex-start'}
                    spacing={'1rem'}
                    display={'flex'}
                  >
                    <HStack
                      alignSelf={'stretch'}
                      justifyContent={'flex-start'}
                      alignItems={'flex-start'}
                      gap={5} // 20px -> 1.25rem
                      display={'inline-flex'}
                    >
                      {/* Left Side */}
                      <VStack
                        flex={1}
                        flexDirection={'column'}
                        justifyContent={'flex-start'}
                        alignItems={'flex-start'}
                        gap={3} // 12px -> 0.75rem
                        display={'inline-flex'}
                      >
                        <HStack
                          alignSelf={'stretch'}
                          justifyContent={'space-between'}
                          alignItems={'flex-start'}
                          display={'inline-flex'}
                        >
                          <Text
                            w={'10rem'} // 160px -> 10rem
                            color={'#7895B2'}
                            fontSize={'0.9375rem'} // 15px -> 0.9375rem
                            fontFamily={'Poppins'}
                            fontWeight={'400'}
                            lineHeight={'1.5rem'} // 24px -> 1.5rem
                            wordWrap={'break-word'}
                          >
                            {localeText(LANGUAGES.ORDER.TOTAL_PRODUCT)}
                          </Text>
                          <Text
                            textAlign={'right'}
                            color={'#556A7E'}
                            fontSize={'0.9375rem'} // 15px -> 0.9375rem
                            fontFamily={'Poppins'}
                            fontWeight={'500'}
                            lineHeight={'1.5rem'} // 24px -> 1.5rem
                            wordWrap={'break-word'}
                          >
                            $81.00
                          </Text>
                        </HStack>
                        <HStack
                          alignSelf={'stretch'}
                          justifyContent={'space-between'}
                          alignItems={'flex-start'}
                          display={'inline-flex'}
                        >
                          <Text
                            w={'10rem'} // 160px -> 10rem
                            color={'#7895B2'}
                            fontSize={'0.9375rem'} // 15px -> 0.9375rem
                            fontFamily={'Poppins'}
                            fontWeight={'400'}
                            lineHeight={'1.5rem'} // 24px -> 1.5rem
                            wordWrap={'break-word'}
                          >
                            {localeText(LANGUAGES.ORDER.TOTAL_SHIPPING)}
                          </Text>
                          <Text
                            textAlign={'right'}
                            color={'#556A7E'}
                            fontSize={'0.9375rem'} // 15px -> 0.9375rem
                            fontFamily={'Poppins'}
                            fontWeight={'500'}
                            lineHeight={'1.5rem'} // 24px -> 1.5rem
                            wordWrap={'break-word'}
                          >
                            $3.00
                          </Text>
                        </HStack>
                      </VStack>

                      {/* Vertical divider */}
                      <Box
                        w={'3.75rem'} // 60px -> 3.75rem
                        transform={'rotate(90deg)'}
                        transformOrigin={'0 0'}
                        border={'1px #AEBDCA solid'}
                      />

                      {/* Right Side */}
                      <VStack
                        flex={1}
                        flexDirection={'column'}
                        justifyContent={'flex-start'}
                        alignItems={'flex-start'}
                        gap={3} // 12px -> 0.75rem
                        display={'inline-flex'}
                      >
                        <HStack
                          alignSelf={'stretch'}
                          justifyContent={'space-between'}
                          alignItems={'flex-start'}
                          display={'inline-flex'}
                        >
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'} // 15px -> 0.9375rem
                            fontFamily={'Poppins'}
                            fontWeight={'400'}
                            lineHeight={'1.5rem'} // 24px -> 1.5rem
                            wordWrap={'break-word'}
                          >
                            {localeText(LANGUAGES.ORDER.COUPON_DISCOUNT)}
                          </Text>
                          <Text
                            textAlign={'right'}
                            color={'#940808'}
                            fontSize={'0.9375rem'} // 15px -> 0.9375rem
                            fontFamily={'Poppins'}
                            fontWeight={'500'}
                            lineHeight={'1.5rem'} // 24px -> 1.5rem
                            wordWrap={'break-word'}
                          >
                            -$3.00
                          </Text>
                        </HStack>
                        <HStack
                          alignSelf={'stretch'}
                          justifyContent={'space-between'}
                          alignItems={'flex-start'}
                          display={'inline-flex'}
                        >
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'} // 15px -> 0.9375rem
                            fontFamily={'Poppins'}
                            fontWeight={'400'}
                            lineHeight={'1.5rem'} // 24px -> 1.5rem
                            wordWrap={'break-word'}
                          >
                            {localeText(LANGUAGES.ORDER.REDEEMING_MILES)}
                          </Text>
                          <Text
                            textAlign={'right'}
                            color={'#556A7E'}
                            fontSize={'0.9375rem'} // 15px -> 0.9375rem
                            fontFamily={'Poppins'}
                            fontWeight={'500'}
                            lineHeight={'1.5rem'} // 24px -> 1.5rem
                            wordWrap={'break-word'}
                          >
                            0 {localeText(LANGUAGES.ORDER.COIN)}
                          </Text>
                        </HStack>
                      </VStack>
                    </HStack>

                    {/* Divider line */}
                    <Divider borderTop={'1px solid #AEBDCA'} />

                    <VStack
                      alignSelf={'stretch'}
                      h={'4.25rem'} // 68px -> 4.25rem
                      flexDirection={'column'}
                      justifyContent={'flex-start'}
                      alignItems={'flex-start'}
                      gap={3} // 12px -> 0.75rem
                      display={'flex'}
                    >
                      <HStack
                        alignSelf={'stretch'}
                        justifyContent={'flex-start'}
                        alignItems={'flex-start'}
                        gap={8} // 32px -> 2rem
                        display={'inline-flex'}
                      >
                        <Text
                          color={'#66809C'}
                          fontSize={'1rem'} // 16px -> 1rem
                          fontFamily={'Poppins'}
                          fontWeight={'500'}
                          lineHeight={'1.75rem'} // 28px -> 1.75rem
                          wordWrap={'break-word'}
                        >
                          {localeText(LANGUAGES.ORDER.ORDER_TOTAL)}
                        </Text>
                        <Text
                          flex={1}
                          textAlign={'right'}
                          color={'#485766'}
                          fontSize={'1rem'} // 16px -> 1rem
                          fontFamily={'Poppins'}
                          fontWeight={'600'}
                          lineHeight={'1.75rem'} // 28px -> 1.75rem
                          wordWrap={'break-word'}
                        >
                          $84.00
                        </Text>
                      </HStack>

                      <HStack
                        alignSelf={'stretch'}
                        justifyContent={'flex-start'}
                        alignItems={'flex-start'}
                        gap={8} // 32px -> 2rem
                        display={'inline-flex'}
                      >
                        <Text
                          color={'#66809C'}
                          fontSize={'1rem'} // 16px -> 1rem
                          fontFamily={'Poppins'}
                          fontWeight={'500'}
                          lineHeight={'1.75rem'} // 28px -> 1.75rem
                          wordWrap={'break-word'}
                        >
                          {localeText(LANGUAGES.ORDER.DISCOUNT)}
                        </Text>
                        <Text
                          flex={1}
                          textAlign={'right'}
                          color={'#940808'}
                          fontSize={'1rem'} // 16px -> 1rem
                          fontFamily={'Poppins'}
                          fontWeight={'600'}
                          lineHeight={'1.75rem'} // 28px -> 1.75rem
                          wordWrap={'break-word'}
                        >
                          -$3.00
                        </Text>
                      </HStack>
                    </VStack>

                    {/* Divider line */}
                    <Divider borderTop={'1px solid #AEBDCA'} />

                    <HStack
                      alignSelf={'stretch'}
                      justifyContent={'flex-start'}
                      alignItems={'flex-start'}
                      gap={8} // 32px -> 2rem
                      display={'inline-flex'}
                    >
                      <Text
                        color={'#66809C'}
                        fontSize={'1rem'} // 16px -> 1rem
                        fontFamily={'Poppins'}
                        fontWeight={'500'}
                        lineHeight={'1.75rem'} // 28px -> 1.75rem
                        wordWrap={'break-word'}
                      >
                        {`${localeText(LANGUAGES.SALES.FINAL_PAYMENT_AMOUNT)} (${localeText(LANGUAGES.COMMON.CARD)})`}
                      </Text>
                      <Text
                        flex={1}
                        textAlign={'right'}
                        color={'#485766'}
                        fontSize={'1rem'} // 16px -> 1rem
                        fontFamily={'Poppins'}
                        fontWeight={'600'}
                        lineHeight={'1.75rem'} // 28px -> 1.75rem
                        wordWrap={'break-word'}
                      >
                        $81.00
                      </Text>
                    </HStack>
                  </VStack>
                </Box>

                <Box w={'100%'}>
                  <HStack
                    h={'17.75rem'}
                    spacing={'1.25rem'}
                    justifyContent={'space-between'}
                    alignItems={'flex-start'}
                  >
                    <Box
                      h={'100%'}
                      flex="1 1 0"
                      p="1.25rem"
                      bg="#90aec412"
                      flexDirection="column"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      gap="1.25rem"
                      display="inline-flex"
                    >
                      <Text
                        textAlign="center"
                        color="#485766"
                        fontSize="1.125rem"
                        fontWeight="500"
                        lineHeight="1.96875rem"
                      >
                        {localeText(LANGUAGES.ORDER.ORDERER_INFO)}
                      </Text>
                      <VStack
                        w="100%"
                        h="6.5rem"
                        gap="1rem"
                        alignItems="flex-start"
                      >
                        <HStack
                          w="100%"
                          spacing="2rem"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                        >
                          <Text
                            w="10rem"
                            color="#7895B2"
                            fontSize="0.9375rem"
                            fontWeight="400"
                            lineHeight="1.5rem"
                          >
                            {localeText(LANGUAGES.ORDER.ORDERER_NAME)}
                          </Text>
                          <Text
                            color="#556A7E"
                            fontSize="0.9375rem"
                            fontWeight="500"
                            lineHeight="1.5rem"
                          >
                            Gildong Hong
                          </Text>
                        </HStack>
                        <HStack
                          w="100%"
                          spacing="2rem"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                        >
                          <Text
                            w="10rem"
                            color="#7895B2"
                            fontSize="0.9375rem"
                            fontWeight="400"
                            lineHeight="1.5rem"
                          >
                            {localeText(LANGUAGES.ACC.PHONE_NUMBER)}
                          </Text>
                          <Text
                            color="#556A7E"
                            fontSize="0.9375rem"
                            fontWeight="500"
                            lineHeight="1.5rem"
                          >
                            +82 10 1234 5678
                          </Text>
                        </HStack>
                        <HStack
                          w="100%"
                          spacing="2rem"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                        >
                          <Text
                            w="10rem"
                            color="#7895B2"
                            fontSize="0.9375rem"
                            fontWeight="400"
                            lineHeight="1.5rem"
                          >
                            {localeText(LANGUAGES.ACC.EMAIL)}
                          </Text>
                          <Text
                            w="auto"
                            color="#556A7E"
                            fontSize="0.9375rem"
                            fontWeight="500"
                            lineHeight="1.5rem"
                          >
                            gildonghong@piboogo.com
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>
                    <Box
                      flex="1 1 0"
                      p="1.25rem"
                      bg="#90aec412"
                      flexDirection="column"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      gap="1.25rem"
                      display="inline-flex"
                    >
                      <Text
                        textAlign="center"
                        color="#485766"
                        fontSize="1.125rem"
                        fontWeight="500"
                        lineHeight="1.96875rem"
                      >
                        {localeText(LANGUAGES.ORDER.SHIPPING_INFO)}
                      </Text>
                      <VStack
                        w="100%"
                        h="12rem"
                        spacing="1rem"
                        alignItems="flex-start"
                      >
                        <HStack
                          w="100%"
                          spacing="2rem"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                        >
                          <Text
                            w="10rem"
                            color="#7895B2"
                            fontSize="0.9375rem"
                            fontWeight="400"
                            lineHeight="1.5rem"
                          >
                            {localeText(LANGUAGES.ACC.NAME)}
                          </Text>
                          <Text
                            w={'21.25rem'}
                            color="#556A7E"
                            fontSize="0.9375rem"
                            fontWeight="500"
                            lineHeight="1.5rem"
                          >
                            Gildong Hong
                          </Text>
                        </HStack>
                        <HStack
                          w="100%"
                          spacing="2rem"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                        >
                          <Text
                            w={'10rem'}
                            color="#7895B2"
                            fontSize="0.9375rem"
                            fontWeight="400"
                            lineHeight="1.5rem"
                          >
                            {localeText(LANGUAGES.ACC.PHONE_NUMBER)}
                          </Text>
                          <Text
                            w={'21.25rem'}
                            color="#556A7E"
                            fontSize="0.9375rem"
                            fontWeight="500"
                            lineHeight="1.5rem"
                          >
                            +82 10 1234 5678
                          </Text>
                        </HStack>
                        <HStack
                          w="100%"
                          spacing="2rem"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                        >
                          <Text
                            w="10rem"
                            color="#7895B2"
                            fontSize="0.9375rem"
                            fontWeight="400"
                            lineHeight="1.5rem"
                          >
                            Address
                          </Text>
                          <Text
                            w={'21.25rem'}
                            color="#556A7E"
                            fontSize="0.9375rem"
                            fontWeight="500"
                            lineHeight="1.5rem"
                          >
                            123 Elm Street, Apt 4B, Springfield, IL 62704, USA
                          </Text>
                        </HStack>
                        <HStack
                          w="100%"
                          spacing="2rem"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                        >
                          <Text
                            w="10rem"
                            color="#7895B2"
                            fontSize="0.9375rem"
                            fontWeight="400"
                            lineHeight="1.5rem"
                          >
                            Messages
                          </Text>
                          <Text
                            w={'21.25rem'}
                            color="#556A7E"
                            fontSize="0.9375rem"
                            fontWeight="500"
                            lineHeight="1.5rem"
                          >
                            Leave at front door if no one is home. Thanks!
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>
                  </HStack>
                </Box>
              </VStack>
            </Box>

            <Box w={'100%'}>
              <VStack spacing={'0.75rem'} alignItems="flex-start">
                <HStack
                  w="100%"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text
                    color="#485766"
                    fontSize="1.125rem"
                    fontWeight="500"
                    lineHeight="1.96875rem"
                  >
                    {localeText(LANGUAGES.SALES.NOTES)}
                  </Text>
                  <Button
                    w={'7rem'}
                    h={'3rem'}
                    p={'0.625rem 1.25rem'}
                    bg={'#7895B2'}
                    borderRadius={'0.25rem'}
                  >
                    <Text
                      fontSize={'1rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                      color={'#FFF'}
                    >
                      {localeText(LANGUAGES.COMMON.SAVE)}
                    </Text>
                  </Button>
                </HStack>
                <Box w={'100%'} h={'7.75rem'}>
                  <Textarea
                    p={'0.875rem'}
                    w={'100%'}
                    h={'100%'}
                    resize={'none'}
                    placeholder={localeText(LANGUAGES.SALES.PH_ENTER_NOTE)}
                    borderRadius={'0.25rem'}
                    border={'1px solid #9CADBE'}
                  />
                </Box>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default RevenueDetailPage;
