'use client';

import { Box, Center, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CouponItemCard from '@/components/custom/mypage/coupon/CouponItemCard';
import { DefaultPaginate } from '@/components';
import utils from '@/utils';
import holdingCouponApi from '@/services/holdingCouponApi';
import { NO_DATA_ERROR, SUCCESS } from '@/constants/errorCode';
import useDevice from '@/hooks/useDevice';

const RoutinePage = () => {
  const { isMobile, clampW } = useDevice();
  const { localeText } = useLocale();

  const [currentPage, setCurrentPage] = useState(1);
  const [contentNum, setContentNum] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [listCoupon, setListCoupon] = useState([]);

  useEffect(() => {
    handleGetListCoupon();
  }, []);

  const handleGetListCoupon = useCallback(async () => {
    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
      status: 0,
    };
    const result = await holdingCouponApi.getListHoldingCoupon(param);
    if (result?.errorCode === SUCCESS) {
      setListCoupon(result.datas);
      setTotalCount(result?.totalCount || result.datas.length);
    } else if (result?.errorCode === NO_DATA_ERROR) {
      setListCoupon([]);
      setTotalCount(0);
    }
  });

  const listItems = useCallback(() => {
    if (listCoupon.length === 0) {
      return (
        <Center w={'100%'} h={'10rem'}>
          <Text fontSize={'1.5rem'} fontWeight={500} lineHeight={'1.75rem'}>
            {localeText(LANGUAGES.INFO_MSG.NO_COUPON)}
          </Text>
        </Center>
      );
    }
    return (
      <SimpleGrid
        columns={{
          '3xl': 2,
          '2xl': 2,
          xl: 2,
          lg: 2,
          md: 1,
          sm: 1,
          xs: 1,
        }}
        spacingX={'2.5rem'}
        spacingY={isMobile(true) ? '1.5rem' : '2.5rem'}
      >
        {listCoupon.map((coupon, itemIndex) => (
          <CouponItemCard key={itemIndex} item={coupon} />
        ))}
      </SimpleGrid>
    );
  });

  return isMobile(true) ? (
    <Box w={'100%'}>
      <VStack spacing={'1.5rem'}>
        <Box w={'100%'}>
          <Text
            textAlign={'left'}
            color={'#485766'}
            fontSize={'1.5rem'}
            fontWeight={500}
            lineHeight={'2.475rem'}
          >
            {`${localeText(LANGUAGES.MY_PAGE.COUPON.COUPON)}(${totalCount})`}
          </Text>
        </Box>
        <Box w={'100%'}>{listItems()}</Box>
      </VStack>
    </Box>
  ) : (
    <Box w={'100%'}>
      <VStack spacing={0}>
        <Box w={'100%'} py={'5rem'} pb={'3.75rem'}>
          <Text
            textAlign={'left'}
            color={'#485766'}
            fontSize={'1.5rem'}
            fontWeight={500}
            lineHeight={'2.475rem'}
          >
            {`${localeText(LANGUAGES.MY_PAGE.COUPON.COUPON)}(${totalCount})`}
          </Text>
        </Box>
        <Box w={'100%'}>
          <VStack spacing={'5rem'}>
            <Box w={'100%'}>{listItems()}</Box>
            <Center w={'100%'}>
              <DefaultPaginate
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalCount={totalCount}
                contentNum={contentNum}
              />
            </Center>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default RoutinePage;
