'use client';

import { CustomIcon } from '@/components';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import { LANGUAGES } from '@/constants/lang';
import useDevice from '@/hooks/useDevice';
import useLocale from '@/hooks/useLocale';
import useModal from '@/hooks/useModal';
import utils from '@/utils';
import {
  Box,
  Center,
  HStack,
  Input,
  Text,
  VStack,
  Image as ChakraImage,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

const ProductBrandRight = ({ item, onChangeProduct }) => {
  const { openModal } = useModal();
  const { localeText } = useLocale();
  const { isMobile, clampW } = useDevice();
  const [name, setName] = useState('');
  const [optionName, setOptionName] = useState('');
  const [count, setCount] = useState(0);
  const [firstImage, setFirstImage] = useState(null);
  const [stockCnt, setStockCnt] = useState(null);
  const [stockFlag, setStockFlag] = useState(null);
  const [isSoldOut, setIsSoldOut] = useState(false);

  useEffect(() => {
    if (item) {
      const orderName = item?.name || '';
      const orderCount = item?.count || 0;
      const orderTotalPrice = item?.totalPrice || 0;
      const orderProductImageList =
        item?.productImages || item?.productImageList || [];
      const orderOrdersProductOptionList = item?.ordersProductOptionList || [];

      let firstOption = null;
      if (orderOrdersProductOptionList.length > 0) {
        firstOption = orderOrdersProductOptionList[0];
      }
      if (orderProductImageList.length > 0) {
        const firstImage = orderProductImageList[0].imageS3Url;
        setFirstImage(firstImage);
      }

      setStockFlag(item?.stockFlag);
      setStockCnt(item?.stockCnt || 0);

      if (item?.stockFlag === 1 && item?.stockCnt === 0) {
        setIsSoldOut(true);
      } else {
        setIsSoldOut(false);
      }

      setCount(orderCount);
      const optionName = firstOption ? firstOption.name : '';
      setName(orderName);
      setOptionName(optionName);
    }
  }, [item]);

  useEffect(() => {
    if (count === null) return;

    const timer = setTimeout(() => {
      onChangeProduct(count, item);
    }, 200);

    return () => clearTimeout(timer);
  }, [count]);

  const increment = () => {
    if (isSoldOut) {
      setTimeout(() => {
        openModal({
          text: localeText(LANGUAGES.INFO_MSG.PRODUCT_OUT_STOCK),
        });
      }, 200);
      return;
    }

    if (stockFlag === 2 || count < stockCnt) {
      setCount(count + 1);
    } else {
      setTimeout(() => {
        openModal({
          text: localeText(LANGUAGES.INFO_MSG.MAXIMUM_ORDER_COUNT, {
            key: '@COUNT@',
            value: utils.parseAmount(stockCnt),
          }),
        });
      }, 200);
      setCount(stockCnt);
    }
  };

  const decrement = () => {
    if (isSoldOut) {
      setTimeout(() => {
        openModal({
          text: localeText(LANGUAGES.INFO_MSG.PRODUCT_OUT_STOCK),
        });
      }, 200);
      return;
    }

    if (count > 1) {
      setCount(count - 1);
    }
  };

  return isMobile(true) ? (
    <Box width={'100%'} borderBottom={'1px solid #AEBDCA'} py={'1.25rem'}>
      <VStack spacing={'0.75rem'}>
        <Box w={'100%'}>
          <HStack spacing={'1rem'}>
            <Center w={'6.25rem'} h={'6.25rem'} aspectRatio={1 / 1}>
              <ChakraImage
                fallback={<DefaultSkeleton />}
                objectFit={'cover'}
                w={'100%'}
                h={'100%'}
                src={firstImage}
              />
            </Center>
            <Box w={'100%'}>
              <VStack spacing={'0.5rem'}>
                <Box w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'1rem'}
                    fontWeight={500}
                    lineHeight={'1.75rem'}
                  >
                    {name}
                  </Text>
                </Box>
                <Box w={'100%'}>
                  <Text
                    color={'#66809C'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {optionName}
                  </Text>
                </Box>
                <Box w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'1rem'}
                    fontWeight={500}
                    lineHeight={'1.75rem'}
                  >
                    {utils.parseDallar(item.totalPrice)}
                  </Text>
                  <Text
                    color={'#485766'}
                    fontSize={'1rem'}
                    fontWeight={500}
                    lineHeight={'1.75rem'}
                  >
                    {utils.handleGetDiscountPrice(item)}
                  </Text>
                </Box>
              </VStack>
            </Box>
          </HStack>
        </Box>
        <Box w={'100%'}>
          <HStack
            h="3.75rem"
            px="0.75rem"
            py="1rem"
            background="#FFF"
            borderRadius="0.25rem"
            border="1px solid #9CADBE"
            spacing="1.25rem"
            justifyContent="space-between"
          >
            <Box
              w="1.25rem"
              h="1.25rem"
              cursor="pointer"
              onClick={() => {
                decrement(item);
              }}
            >
              <CustomIcon name="minus" color="#7895B2" />
            </Box>

            <Input
              value={count}
              onChange={(e) => {
                const val = e.target.value;
                if (Number(val) < 1) {
                  setCount(1);
                } else if (Number(val) < stockCnt) {
                  if (/^\d*$/.test(val)) {
                    setCount(Number(val)); // setCount는 상태 업데이트 함수
                  }
                } else {
                  setTimeout(() => {
                    openModal({
                      text: localeText(LANGUAGES.INFO_MSG.MAXIMUM_ORDER_COUNT, {
                        key: '@COUNT@',
                        value: utils.parseAmount(stockCnt),
                      }),
                    });
                  }, 200);
                  setCount(Number(stockCnt));
                }
              }}
              border={0}
              textAlign="center"
              color="#485766"
              fontSize="1rem"
              fontWeight={400}
              lineHeight="1.75rem"
              variant="unstyled"
              px={0}
            />

            <Box
              w="1.25rem"
              h="1.25rem"
              cursor="pointer"
              onClick={() => {
                increment(item);
              }}
            >
              <CustomIcon name="plus" color="#7895B2" />
            </Box>
          </HStack>
        </Box>
      </VStack>
    </Box>
  ) : (
    <Box width={'100%'} borderBottom={'1px solid #AEBDCA'} py={'1.25rem'}>
      <HStack justifyContent={'space-between'}>
        <Box>
          <HStack spacing={'1rem'}>
            <Center w={'6.25rem'} h={'6.25rem'} aspectRatio={1 / 1}>
              <ChakraImage
                fallback={<DefaultSkeleton />}
                objectFit={'cover'}
                w={'100%'}
                h={'100%'}
                src={firstImage}
              />
            </Center>
            <Box w={'100%'}>
              <VStack spacing={'0.5rem'}>
                <Box w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'1rem'}
                    fontWeight={500}
                    lineHeight={'1.75rem'}
                  >
                    {name}
                  </Text>
                </Box>
                <Box w={'100%'}>
                  <Text
                    color={'#66809C'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {optionName}
                  </Text>
                </Box>
                <Box w={'100%'}>
                  <HStack>
                    <Text
                      color={'#485766'}
                      fontSize={'1rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                    >
                      {utils.parseDallar(item.totalPrice)}
                    </Text>
                    <Text
                      color={'#485766'}
                      fontSize={'1rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                    >
                      {utils.handleGetDiscountPrice(item)}
                    </Text>
                  </HStack>
                </Box>
              </VStack>
            </Box>
          </HStack>
        </Box>
        <Box>
          <HStack
            // w={'15rem'}
            h="3.75rem"
            px="0.75rem"
            py="1rem"
            background="#FFF"
            borderRadius="0.25rem"
            border="1px solid #9CADBE"
            spacing="1.25rem"
            justifyContent="space-between"
          >
            <Box
              w="1.25rem"
              h="1.25rem"
              cursor="pointer"
              onClick={() => {
                decrement(item);
              }}
            >
              <CustomIcon name="minus" color="#7895B2" />
            </Box>

            <Input
              w="3rem"
              value={count}
              onChange={(e) => {
                const val = e.target.value;
                if (Number(val) < 1) {
                  setCount(1);
                } else if (Number(val) < stockCnt) {
                  if (/^\d*$/.test(val)) {
                    setCount(Number(val)); // setCount는 상태 업데이트 함수
                  }
                } else {
                  setTimeout(() => {
                    openModal({
                      text: localeText(LANGUAGES.INFO_MSG.MAXIMUM_ORDER_COUNT, {
                        key: '@COUNT@',
                        value: utils.parseAmount(stockCnt),
                      }),
                    });
                  }, 200);
                  setCount(Number(stockCnt));
                }
              }}
              border={0}
              textAlign="center"
              color="#485766"
              fontSize="1rem"
              fontWeight={400}
              lineHeight="1.75rem"
              variant="unstyled"
              px={0}
            />

            <Box
              w="1.25rem"
              h="1.25rem"
              cursor="pointer"
              onClick={() => {
                increment(item);
              }}
            >
              <CustomIcon name="plus" color="#7895B2" />
            </Box>
          </HStack>
        </Box>
      </HStack>
    </Box>
  );
};

export default React.memo(ProductBrandRight, (prev, next) => {
  return (
    prev.item?.id === next.item?.id &&
    prev.item?.count === next.item?.count &&
    prev.onChangeProduct === next.onChangeProduct
  );
});
