'use client';

import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import utils from '@/utils';
import {
  Box,
  HStack,
  Image as ChakraImage,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const OrderCard = (props) => {
  const { localeText } = useLocale();
  const { item, w = '26.25rem', isPrice = false } = props;

  const [name, setName] = useState(null);
  const [count, setCount] = useState(null);
  const [brandName, setBrandName] = useState(null);
  const [productId, setProductId] = useState(null);
  const [ordersProductId, setOrdersProductId] = useState(null);
  const [unitPrice, setUnitPrice] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [ordersProductOptionList, setOrdersProductOptionList] = useState([]);
  const [productImageList, setProductImageList] = useState([]);

  const [firstImageSrc, setFirstImageSrc] = useState(null);
  const [pricePerUnit, setPricePerUnit] = useState([]); // 옵션 가 까지 합친 1개당 가격

  useEffect(() => {
    if (item?.ordersProductId) {
      const name = item?.name;
      const count = item?.count;
      const brandName = item?.brandName;
      const productId = item?.productId;
      const ordersProductId = item?.ordersProductId;
      const unitPrice = item?.unitPrice;
      const totalPrice = item?.totalPrice;
      const deliveryStatus = item?.deliveryStatus;
      const ordersProductOptionList = item?.ordersProductOptionList;
      const productImageList = item?.productImageList;
      setName(name);
      setCount(count);
      setBrandName(brandName);
      setProductId(productId);
      setOrdersProductId(ordersProductId);
      setUnitPrice(unitPrice);
      setTotalPrice(totalPrice);
      setDeliveryStatus(deliveryStatus);
      setProductImageList(productImageList);
      if (productImageList.length > 0) {
        setFirstImageSrc(productImageList[0].imageS3Url);
      }
      setOrdersProductOptionList(ordersProductOptionList);
      if (ordersProductOptionList.length > 0) {
        const pricePerUnit = ordersProductOptionList.map((option) => {
          return option.unitPrice + unitPrice;
        });
        setPricePerUnit(pricePerUnit);
      } else {
        setPricePerUnit(unitPrice);
      }
    }
  }, [item]);

  return (
    <Box width={w}>
      <HStack>
        <Box w={'6.25rem'} minW={'6.25rem'} h={'6.25rem'}>
          <ChakraImage
            fallback={<DefaultSkeleton />}
            w={'100%'}
            h={'100%'}
            src={firstImageSrc}
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
                      {name}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <VStack alignItems={'flex-start'}>
                      {ordersProductOptionList.map((option, optionIndex) => {
                        return (
                          <Text
                            key={optionIndex}
                            color={'#66809C'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                            textAlign={'left'}
                          >
                            {`${localeText(LANGUAGES.COMMON.OPTION)} : ${option.name}`}
                          </Text>
                        );
                      })}
                    </VStack>
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
                  {`${utils.parseDallar(pricePerUnit)} / ${count}${localeText(LANGUAGES.ORDER.EA)}`}
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
                  {name}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#66809C'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {utils.parseDallar(totalPrice)}
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
