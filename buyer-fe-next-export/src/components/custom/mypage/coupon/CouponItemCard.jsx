'use client';

import { LANGUAGES } from '@/constants/lang';
import useDevice from '@/hooks/useDevice';
import useLocale from '@/hooks/useLocale';
import utils from '@/utils';
import { Box, Divider, HStack, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const CouponItemCard = (props) => {
  const { isMobile, clampW } = useDevice();
  const { lang, localeText } = useLocale();
  const { item } = props;

  const status = item.status;
  const active = status === 1;

  const [period, setPeriod] = useState('');

  const parseDate = (paramDate) => {
    if (!paramDate) return;
    const dateString = paramDate;

    // 날짜 문자열을 Date 객체로 변환 (년, 월, 일로 나누어 처리)
    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10) - 1; // 월은 0부터 시작
    const day = parseInt(dateString.substring(6, 8), 10);

    // Date 객체 생성 (그날의 마지막 시간으로 설정)
    const date = new Date(year, month, day, 23, 59, 59, 999);

    return utils.parseDateByCountryCode(date, lang);
  };

  useEffect(() => {
    const name = item?.name;
    const type = item?.type;
    const status = item?.status;
    const holdingCouponId = item?.holdingCouponId;
    const discountAmount = item?.discountAmount;
    const startDate = item?.startDate;
    const endDate = item?.endDate;
    const couponId = item?.couponId;
    const minimumPurchaseAmount = item?.minimumPurchaseAmount;
    if (startDate && endDate) {
      setPeriod(`${parseDate(startDate)} ~ ${parseDate(endDate)}`);
    } else {
      setPeriod(localeText(LANGUAGES.COMMON.UNLIMITED));
    }
  }, [item]);

  return isMobile(true) ? (
    <Box
      w={'100%'}
      p={'1rem'}
      border={`1px solid #${active ? '73829D' : 'AEBDCA'}`}
      bg={active ? 'transparent' : 'rgba(144, 174, 196, 0.07)'}
    >
      <VStack spacing={'0.75rem'}>
        <Box w={'100%'}>
          <HStack justifyContent={'space-between'}>
            <Box>
              <Text
                color={active ? '#485766' : '#7895B2'}
                fontSize={clampW(0.875, 1.125)}
                fontWeight={400}
                lineHeight={'160%'}
              >
                {item.name}
              </Text>
            </Box>
            <Box>
              <Text
                color={'#7895B2'}
                fontSize={clampW(1, 1.125)}
                fontWeight={500}
                lineHeight={'175%'}
              >
                {status === 1
                  ? localeText(LANGUAGES.STATUS.AVAILABLE)
                  : status === 2
                    ? localeText(LANGUAGES.STATUS.USED)
                    : localeText(LANGUAGES.STATUS.EXPIRED)}
              </Text>
            </Box>
          </HStack>
        </Box>

        <Divider borderBottom={'1px solid #AEBDCA'} />

        <Box w={'100%'}>
          {item.type === 1 ? (
            <Text
              color={'#485766'}
              fontSize={clampW(1, 1.5)}
              fontWeight={500}
              lineHeight={'170%'}
            >
              {localeText(LANGUAGES.INFO_MSG.COUPON_MSG_TYPE1).replace(
                '@PRICE@',
                utils.parseAmount(item?.discountAmount || 0),
              )}
            </Text>
          ) : (
            <Text
              color={'#485766'}
              fontSize={clampW(1, 1.5)}
              fontWeight={500}
              lineHeight={'170%'}
            >
              {localeText(LANGUAGES.INFO_MSG.COUPON_MSG_TYPE2).replace(
                '@PRICE@',
                utils.parseDallar(item?.discountAmount || 0),
              )}
            </Text>
          )}
        </Box>
        <Box w={'100%'}>
          <Text
            color={active ? '#66809C' : '#7895B2'}
            fontSize={clampW(0.75, 1)}
            fontWeight={500}
            lineHeight={'175%'}
            whiteSpace={'pre-wrap'}
          >
            {period}
          </Text>
        </Box>
        <Box w={'100%'}>
          <Text
            color={active ? '#66809C' : '#7895B2'}
            fontSize={clampW(0.75, 1)}
            fontWeight={500}
            lineHeight={'175%'}
            whiteSpace={'pre-wrap'}
          >
            {localeText(LANGUAGES.MY_PAGE.COUPON.REDEMPTION_TERMS)}
          </Text>
          <Text
            color={active ? '#66809C' : '#7895B2'}
            fontSize={clampW(0.75, 1)}
            fontWeight={500}
            lineHeight={'175%'}
            whiteSpace={'pre-wrap'}
          >
            {`${utils.parseDallar(item?.minimumPurchaseAmount || 0)} ${localeText(LANGUAGES.MY_PAGE.COUPON.MINIMUM_PURCHASE)}`}
          </Text>
        </Box>
      </VStack>
    </Box>
  ) : (
    <Box
      w={'100%'}
      px={'2.5rem'}
      py={'2rem'}
      border={`1px solid #${active ? '73829D' : 'AEBDCA'}`}
      bg={active ? 'transparent' : 'rgba(144, 174, 196, 0.07)'}
    >
      <VStack spacing={'1.25rem'}>
        <Box w={'100%'}>
          <HStack justifyContent={'space-between'}>
            <Box>
              <Text
                color={active ? '#485766' : '#7895B2'}
                fontSize={'1.125rem'}
                fontWeight={400}
                lineHeight={'1.96875rem'}
              >
                {item.name}
              </Text>
            </Box>
            <Box>
              <Text
                color={'#7895B2'}
                fontSize={'1.125rem'}
                fontWeight={500}
                lineHeight={'1.96875rem'}
              >
                {status === 1
                  ? localeText(LANGUAGES.STATUS.AVAILABLE)
                  : status === 2
                    ? localeText(LANGUAGES.STATUS.USED)
                    : localeText(LANGUAGES.STATUS.EXPIRED)}
              </Text>
            </Box>
          </HStack>
        </Box>
        <Divider borderBottom={'1px solid #AEBDCA'} />
        <Box w={'100%'}>
          {item.type === 1 ? (
            <Text
              color={'#485766'}
              fontSize={'1.5rem'}
              fontWeight={500}
              lineHeight={'2.475rem'}
            >
              {localeText(LANGUAGES.INFO_MSG.COUPON_MSG_TYPE1).replace(
                '@PRICE@',
                utils.parseAmount(item.discountAmount),
              )}
            </Text>
          ) : (
            <Text
              color={'#485766'}
              fontSize={'1.5rem'}
              fontWeight={500}
              lineHeight={'2.475rem'}
            >
              {localeText(LANGUAGES.INFO_MSG.COUPON_MSG_TYPE2).replace(
                '@PRICE@',
                utils.parseDallar(item.discountAmount),
              )}
            </Text>
          )}
        </Box>
        <Box w={'100%'}>
          <Text
            color={active ? '#66809C' : '#7895B2'}
            fontSize={'1rem'}
            fontWeight={500}
            lineHeight={'1.75rem'}
            whiteSpace={'pre-wrap'}
          >
            {period}
          </Text>
        </Box>
        <Box w={'100%'}>
          <Text
            color={active ? '#66809C' : '#7895B2'}
            fontSize={'1rem'}
            fontWeight={500}
            lineHeight={'1.75rem'}
            whiteSpace={'pre-wrap'}
          >
            {localeText(LANGUAGES.MY_PAGE.COUPON.REDEMPTION_TERMS)}
          </Text>
          <Text
            color={active ? '#66809C' : '#7895B2'}
            fontSize={'1rem'}
            fontWeight={500}
            lineHeight={'1.75rem'}
            whiteSpace={'pre-wrap'}
          >
            {`${utils.parseDallar(item?.minimumPurchaseAmount || 0)} ${localeText(LANGUAGES.MY_PAGE.COUPON.MINIMUM_PURCHASE)}`}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default CouponItemCard;
