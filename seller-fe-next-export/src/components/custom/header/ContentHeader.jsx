'use client';

import { Box, Flex, HStack, Spacer, Text, VStack } from '@chakra-ui/react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import { LOUNGE, MY_PAGE, SELLER, SERVICE } from '@/constants/pageURL';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useDevice from '@/hooks/useDevice';

const ContentHeader = (props) => {
  const router = useRouter();
  const { children, w = '100%', otherTitle } = props;
  const pathName = usePathname();
  const { lang, localeText } = useLocale();
  const { isMobile, clampW } = useDevice();

  const [isVStack, setIsVStack] = useState(true);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (otherTitle) {
      setTitle(otherTitle);
      return;
    }
    if (pathName === SERVICE.DASHBOARD.ROOT) {
      setTitle(localeText(LANGUAGES.SELLER_SIDE_MENU.DASHBOARD));
    } else if (pathName.indexOf(SERVICE.PRODUCTS.ROOT) > -1) {
      setIsVStack(false);
      setTitle(localeText(LANGUAGES.SELLER_SIDE_MENU.PRODUCTS));
    } else if (pathName.indexOf(SERVICE.SALES.ROOT) > -1) {
      setTitle(localeText(LANGUAGES.SELLER_SIDE_MENU.SALES));
    } else if (pathName.indexOf(SERVICE.BANNERS.ROOT) > -1) {
      setTitle(localeText(LANGUAGES.SELLER_SIDE_MENU.BANNERS));
    } else if (pathName.indexOf(SERVICE.PROMOTIONS.ROOT) > -1) {
      setTitle(localeText(LANGUAGES.SELLER_SIDE_MENU.PROMOTIONS));
    } else if (pathName.indexOf(SERVICE.SETTLEMENT.ROOT) > -1) {
      setTitle(localeText(LANGUAGES.SELLER_SIDE_MENU.SETTLEMENT));
    } else if (pathName.indexOf(SERVICE.INQUIRIES.ROOT) > -1) {
      setTitle(localeText(LANGUAGES.SELLER_SIDE_MENU.INQUIRIES));
    } else if (pathName.indexOf(SERVICE.REVIEWS.ROOT) > -1) {
      setTitle(localeText(LANGUAGES.SELLER_SIDE_MENU.REVIEWS));
    } else if (pathName.indexOf(SERVICE.LOUNGE.ROOT) > -1) {
      setTitle(localeText(LANGUAGES.SELLER_SIDE_MENU.LOUNGE));
    } else if (pathName.indexOf(MY_PAGE.ROOT) > -1) {
      setTitle(localeText(LANGUAGES.SELLER_SIDE_MENU.MY_PAGE));
    }
  }, [pathName, lang]);

  return isMobile(true) ? (
    <Box w={w} px={clampW(1, 5)}>
      <Flex
        direction={isVStack ? 'column' : 'row'} // 조건에 따라 column 또는 row 설정
        gap={'0.75rem'}
        alignItems={isVStack ? 'flex-start' : 'center'}
        justifyContent={'space-between'}
      >
        {/* <VStack spacing={'0.75rem'} alignItems={'flex-start'}> */}
        <Box alignSelf={isVStack ? 'flex-start' : 'center'}>
          <Text
            fontSize={'1.5rem'}
            fontWeight={500}
            color={'#485766'}
            lineHeight={'2.475rem'}
          >
            {title}
          </Text>
        </Box>
        {children ? children : <Spacer />}
        {/* </VStack> */}
      </Flex>
    </Box>
  ) : (
    <Box w={w} h={'3rem'} maxH={'3rem'}>
      <HStack h={'100%'} alignItems={'center'} justifyContent={'space-between'}>
        <Box alignSelf={'center'}>
          <Text
            fontSize={'1.5rem'}
            fontWeight={500}
            color={'#485766'}
            lineHeight={'2.475rem'}
          >
            {title}
          </Text>
        </Box>
        {children ? children : <Spacer />}
      </HStack>
    </Box>
  );
};

export default ContentHeader;
