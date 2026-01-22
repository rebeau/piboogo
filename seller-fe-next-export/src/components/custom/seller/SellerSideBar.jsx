'use client';

import { LANGUAGES } from '@/constants/lang';
import { SERVICE } from '@/constants/pageURL';
import useLocale from '@/hooks/useLocale';
import { Box, VStack } from '@chakra-ui/react';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import SellerSideButton from './SellerSideButton';

const SellerSideBar = () => {
  const { localeText } = useLocale();
  const pathName = usePathname();

  const [sideIndex, setSideIndex] = useState(0);

  const listSideMenu = [
    {
      title: localeText(LANGUAGES.SELLER_SIDE_MENU.DASHBOARD),
      href: SERVICE.DASHBOARD.ROOT,
    },
    {
      title: localeText(LANGUAGES.SELLER_SIDE_MENU.PRODUCTS),
      href: SERVICE.PRODUCTS.ROOT,
    },
    {
      title: localeText(LANGUAGES.SELLER_SIDE_MENU.SALES),
      href: SERVICE.SALES.ROOT,
    },
    {
      title: localeText(LANGUAGES.SELLER_SIDE_MENU.BANNERS),
      href: SERVICE.BANNERS.ROOT,
    },
    {
      title: localeText(LANGUAGES.SELLER_SIDE_MENU.PROMOTIONS),
      href: SERVICE.PROMOTIONS.ROOT,
    },
    {
      title: localeText(LANGUAGES.SELLER_SIDE_MENU.SETTLEMENT),
      href: SERVICE.SETTLEMENT.ROOT,
    },
    {
      title: localeText(LANGUAGES.SELLER_SIDE_MENU.INQUIRIES),
      href: SERVICE.INQUIRIES.ROOT,
    },
    {
      title: localeText(LANGUAGES.SELLER_SIDE_MENU.REVIEWS),
      href: SERVICE.REVIEWS.ROOT,
    },
    {
      title: localeText(LANGUAGES.SELLER_SIDE_MENU.LOUNGE),
      href: SERVICE.LOUNGE.HOME,
    },
  ];

  useEffect(() => {
    if (pathName === SERVICE.DASHBOARD.ROOT) {
      setSideIndex(1);
    } else if (pathName.indexOf(SERVICE.PRODUCTS.ROOT) > -1) {
      setSideIndex(2);
    } else if (pathName.indexOf(SERVICE.SALES.ROOT) > -1) {
      setSideIndex(3);
    } else if (pathName.indexOf(SERVICE.BANNERS.ROOT) > -1) {
      setSideIndex(4);
    } else if (pathName.indexOf(SERVICE.PROMOTIONS.ROOT) > -1) {
      setSideIndex(5);
    } else if (pathName.indexOf(SERVICE.SETTLEMENT.ROOT) > -1) {
      setSideIndex(6);
    } else if (pathName.indexOf(SERVICE.INQUIRIES.ROOT) > -1) {
      setSideIndex(7);
    } else if (pathName.indexOf(SERVICE.REVIEWS.ROOT) > -1) {
      setSideIndex(8);
    } else if (pathName.indexOf(SERVICE.LOUNGE.ROOT) > -1) {
      setSideIndex(9);
    }
  }, [pathName]);

  return (
    <Box
      w={'100%'}
      h={'100%'}
      borderRight={'1px solid #AEBDCA'}
      overflowY={'auto'}
    >
      <VStack spacing={'0.5rem'}>
        {listSideMenu.map((menu, index) => {
          return (
            <SellerSideButton
              key={index}
              index={index + 1}
              target={menu}
              sideIndex={sideIndex}
            />
          );
        })}
      </VStack>
    </Box>
  );
};

export default SellerSideBar;
