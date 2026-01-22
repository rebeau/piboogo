'use client';

import { Box, HStack, Spacer, Text } from '@chakra-ui/react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import { MGNT, SERVICE } from '@/constants/pageURL';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ContentHeader = (props) => {
  const router = useRouter();
  const { children, w = '100%', otherTitle } = props;
  const pathName = usePathname();
  const { lang, localeText } = useLocale();

  const [title, setTitle] = useState('');

  useEffect(() => {
    if (pathName === SERVICE.DASHBOARD.ROOT) {
      setTitle(localeText(LANGUAGES.CONTENT_HEADER_MENU.DASHBOARD));
    } else if (pathName === MGNT.REVENUE.ROOT) {
      setTitle(localeText(LANGUAGES.CONTENT_HEADER_MENU.REVENUE_MGMT));
    } else if (pathName === MGNT.SELLER.ROOT) {
      setTitle(localeText(LANGUAGES.CONTENT_HEADER_MENU.SELLER_MGMT));
    } else if (pathName === MGNT.BEST_SELLER.ROOT) {
      setTitle(localeText(LANGUAGES.CONTENT_HEADER_MENU.BEST_SELLER_MGMT));
    } else if (pathName === MGNT.BUYER.ROOT) {
      setTitle(localeText(LANGUAGES.CONTENT_HEADER_MENU.BUYER_MGMT));
    } else if (pathName === MGNT.SETTLEMENT.ROOT) {
      setTitle(localeText(LANGUAGES.CONTENT_HEADER_MENU.SETTLEMENT_MGMT));
    } else if (pathName === MGNT.BANNER.ROOT) {
      setTitle(localeText(LANGUAGES.CONTENT_HEADER_MENU.BANNER_MGMT));
    } else if (pathName === MGNT.PRODUCT.ROOT) {
      setTitle(localeText(LANGUAGES.CONTENT_HEADER_MENU.PRODUCT_MGMT));
    } else if (pathName === MGNT.CATEGORY.ROOT) {
      setTitle(localeText(LANGUAGES.CONTENT_HEADER_MENU.CATEGORY_MGMT));
    } else if (pathName === MGNT.PROMOTION.ROOT) {
      setTitle(localeText(LANGUAGES.CONTENT_HEADER_MENU.PROMOTION_MGMT));
    } else if (pathName === MGNT.COUPON.ROOT) {
      setTitle(localeText(LANGUAGES.CONTENT_HEADER_MENU.COUPON_MGMT));
    } else if (pathName === MGNT.CREDIT.ROOT) {
      setTitle(localeText(LANGUAGES.CONTENT_HEADER_MENU.CREDIT_MGMT));
    } else if (pathName === MGNT.LOUNGE.ROOT) {
      setTitle(localeText(LANGUAGES.CONTENT_HEADER_MENU.LOUNGE_MGMT));
    } else if (pathName === MGNT.HELP.ROOT) {
      setTitle(localeText(LANGUAGES.CONTENT_HEADER_MENU.HELP_CENTER_MGMT));
    } else if (pathName === SERVICE.ADMIN_SETTING.ROOT) {
      setTitle(localeText(LANGUAGES.CONTENT_HEADER_MENU.ADMIN_SETTINGS));
    }
  }, [pathName, lang]);

  return (
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
