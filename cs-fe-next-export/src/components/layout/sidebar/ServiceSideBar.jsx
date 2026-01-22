'use client';

import { LANGUAGES } from '@/constants/lang';
import { MGNT, SERVICE } from '@/constants/pageURL';
import useLocale from '@/hooks/useLocale';
import { Box, VStack } from '@chakra-ui/react';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import ServiceSideBarButton from './ServiceSideBarButton';
import utils from '@/utils';

const ServiceSideBar = () => {
  const { localeText } = useLocale();
  const pathName = usePathname();

  const [sideIndex, setSideIndex] = useState(0);
  const userInfo = utils.getUserInfoSession();

  const [listSideMenu, setListSideMenu] = useState([]);

  useEffect(() => {
    const role = userInfo?.role;
    if (role === 1) {
      setListSideMenu([
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.DASHBOARD),
          href: SERVICE.DASHBOARD.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.REVENUE_MGMT),
          href: MGNT.REVENUE.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.SELLER_MGMT),
          href: MGNT.SELLER.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.BEST_SELLER_MGMT),
          href: MGNT.BEST_SELLER.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.BUYER_MGMT),
          href: MGNT.BUYER.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.SETTLEMENT_MGMT),
          href: MGNT.SETTLEMENT.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.BANNER_MGMT),
          href: MGNT.BANNER.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.PRODUCT_MGMT),
          href: MGNT.PRODUCT.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.CATEGORY_MGMT),
          href: MGNT.CATEGORY.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.PROMOTION_MGMT),
          href: MGNT.PROMOTION.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.COUPON_MGMT),
          href: MGNT.COUPON.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.CREDIT_MGMT),
          href: MGNT.CREDIT.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.LOUNGE_MGMT),
          href: MGNT.LOUNGE.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.HELP_CENTER_MGMT),
          href: MGNT.HELP.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.ADMIN_SETTINGS),
          href: SERVICE.ADMIN_SETTING.ROOT,
        },
      ]);
    } else if (role === 2) {
      setListSideMenu([
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.DASHBOARD),
          href: SERVICE.DASHBOARD.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.SELLER_MGMT),
          href: MGNT.SELLER.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.BUYER_MGMT),
          href: MGNT.BUYER.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.BANNER_MGMT),
          href: MGNT.BANNER.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.PRODUCT_MGMT),
          href: MGNT.PRODUCT.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.CATEGORY_MGMT),
          href: MGNT.CATEGORY.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.PROMOTION_MGMT),
          href: MGNT.PROMOTION.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.COUPON_MGMT),
          href: MGNT.COUPON.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.LOUNGE_MGMT),
          href: MGNT.LOUNGE.ROOT,
        },
        {
          title: localeText(LANGUAGES.SERVICE_SIDE_MENU.HELP_CENTER_MGMT),
          href: MGNT.HELP.ROOT,
        },
      ]);
    }
  }, [userInfo?.role, localeText]);

  useEffect(() => {
    const role = userInfo?.role;
    if (role === 1) {
      if (pathName.indexOf(SERVICE.DASHBOARD.ROOT) > -1) {
        setSideIndex(1);
      } else if (pathName.indexOf(MGNT.REVENUE.ROOT) > -1) {
        setSideIndex(2);
      } else if (pathName.indexOf(MGNT.SELLER.ROOT) > -1) {
        setSideIndex(3);
      } else if (pathName.indexOf(MGNT.BEST_SELLER.ROOT) > -1) {
        setSideIndex(4);
      } else if (pathName.indexOf(MGNT.BUYER.ROOT) > -1) {
        setSideIndex(5);
      } else if (pathName.indexOf(MGNT.SETTLEMENT.ROOT) > -1) {
        setSideIndex(6);
      } else if (pathName.indexOf(MGNT.BANNER.ROOT) > -1) {
        setSideIndex(7);
      } else if (pathName.indexOf(MGNT.PRODUCT.ROOT) > -1) {
        setSideIndex(8);
      } else if (pathName.indexOf(MGNT.CATEGORY.ROOT) > -1) {
        setSideIndex(9);
      } else if (pathName.indexOf(MGNT.PROMOTION.ROOT) > -1) {
        setSideIndex(10);
      } else if (pathName.indexOf(MGNT.COUPON.ROOT) > -1) {
        setSideIndex(11);
      } else if (pathName.indexOf(MGNT.CREDIT.ROOT) > -1) {
        setSideIndex(12);
      } else if (pathName.indexOf(MGNT.LOUNGE.ROOT) > -1) {
        setSideIndex(13);
      } else if (pathName.indexOf(MGNT.HELP.ROOT) > -1) {
        setSideIndex(14);
      } else if (pathName.indexOf(SERVICE.ADMIN_SETTING.ROOT) > -1) {
        setSideIndex(15);
      }
    } else {
      if (pathName.indexOf(SERVICE.DASHBOARD.ROOT) > -1) {
        return setSideIndex(1);
      } else if (pathName.indexOf(MGNT.REVENUE.ROOT) > -1) {
        return setSideIndex(2);
      } else if (pathName.indexOf(MGNT.BUYER.ROOT) > -1) {
        return setSideIndex(3);
      } else if (pathName.indexOf(MGNT.BANNER.ROOT) > -1) {
        return setSideIndex(4);
      } else if (pathName.indexOf(MGNT.PRODUCT.ROOT) > -1) {
        return setSideIndex(5);
      } else if (pathName.indexOf(MGNT.CATEGORY.ROOT) > -1) {
        return setSideIndex(6);
      } else if (pathName.indexOf(MGNT.PROMOTION.ROOT) > -1) {
        return setSideIndex(7);
      } else if (pathName.indexOf(MGNT.COUPON.ROOT) > -1) {
        return setSideIndex(8);
      } else if (pathName.indexOf(MGNT.LOUNGE.ROOT) > -1) {
        setSideIndex(9);
      } else if (pathName.indexOf(MGNT.HELP.ROOT) > -1) {
        return setSideIndex(10);
      }
    }
  }, [pathName]);

  return (
    <Box
      w={'100%'}
      h={'100%'}
      overflowY={'auto'}
      className={'no-scroll'}
      borderRight={'1px solid #AEBDCA'}
    >
      <VStack spacing={'0.5rem'}>
        {listSideMenu.map((menu, index) => {
          return (
            <ServiceSideBarButton
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

export default ServiceSideBar;
