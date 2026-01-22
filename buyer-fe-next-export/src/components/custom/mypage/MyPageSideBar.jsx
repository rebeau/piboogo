'use client';

import { LANGUAGES } from '@/constants/lang';
import { MY_PAGE } from '@/constants/pageURL';
import useLocale from '@/hooks/useLocale';
import { Box, Text, VStack, Wrap } from '@chakra-ui/react';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import MyPageSideButton from './MyPageSideButton';
import useDevice from '@/hooks/useDevice';

const MyPageSideBar = () => {
  const { isMobile, clampW } = useDevice();
  const { localeText } = useLocale();
  const pathName = usePathname();

  const [sideIndex, setSideIndex] = useState(0);

  const listSideMenu = [
    {
      title: localeText(LANGUAGES.MY_PAGE.MY_INFO),
      href: MY_PAGE.INFO,
    },
    {
      title: localeText(LANGUAGES.MY_PAGE.ORDER_HISTORY),
      href: MY_PAGE.ORDER_HISTORY,
    },
    {
      title: localeText(LANGUAGES.MY_PAGE.COUPON.COUPON),
      href: MY_PAGE.COUPON,
    },
    {
      title: localeText(LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES.REVIEWS_INQUIRIES),
      href: MY_PAGE.REVIEWS_INQUIRIES,
    },
    {
      title: localeText(LANGUAGES.MY_PAGE.HELP.HELP),
      href: MY_PAGE.HELP,
    },
  ];

  useEffect(() => {
    if (pathName === MY_PAGE.INFO || pathName === MY_PAGE.INFO_EDIT) {
      setSideIndex(1);
    } else if (pathName === MY_PAGE.ORDER_HISTORY) {
      setSideIndex(2);
    } else if (pathName === MY_PAGE.COUPON) {
      setSideIndex(3);
    } else if (pathName === MY_PAGE.REVIEWS_INQUIRIES) {
      setSideIndex(4);
    } else if (pathName === MY_PAGE.HELP) {
      setSideIndex(5);
    }
  }, [pathName]);

  return isMobile(true) ? (
    <Box w={'100%'}>
      <VStack spacing={'1.25rem'}>
        <Box w={'100%'}>
          <Text
            color={'#485766'}
            fontSize={clampW(1.5, 3)}
            fontWeight={400}
            lineHeight={'4.5rem'}
          >
            {localeText(LANGUAGES.MY_PAGE.MY_PAGE)}
          </Text>
        </Box>
        <Box w={'100%'}>
          <Wrap spacingX={'2.5rem'} spacingY={'0.4rem'}>
            {listSideMenu.map((menu, index) => {
              return (
                <MyPageSideButton
                  key={index}
                  index={index + 1}
                  target={menu}
                  sideIndex={sideIndex}
                />
              );
            })}
          </Wrap>
        </Box>
      </VStack>
    </Box>
  ) : (
    <Box minW={'15rem'} w={'25rem'} maxW={'30%'}>
      <VStack spacing={0}>
        <Box py={'2.5rem'} w={'100%'}>
          <Text
            color={'#485766'}
            fontSize={'3rem'}
            fontWeight={400}
            lineHeight={'4.5rem'}
          >
            {localeText(LANGUAGES.MY_PAGE.MY_PAGE)}
          </Text>
        </Box>
        <Box w={'100%'} pt={'2rem'}>
          <VStack spacing={'2rem'}>
            {listSideMenu.map((menu, index) => {
              return (
                <MyPageSideButton
                  key={index}
                  index={index + 1}
                  target={menu}
                  sideIndex={sideIndex}
                />
              );
            })}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default MyPageSideBar;
