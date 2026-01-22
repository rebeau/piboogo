'use client';

import { LANGUAGES } from '@/constants/lang';
import { LOUNGE } from '@/constants/pageURL';
import useLocale from '@/hooks/useLocale';
import { Box, Text, VStack, Wrap } from '@chakra-ui/react';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoungeSideButton from './LoungeSideButton';
import useDevice from '@/hooks/useDevice';

const LoungeSideBar = () => {
  const { isMobile, clampW } = useDevice();
  const { localeText } = useLocale();
  const pathName = usePathname();

  const [sideIndex, setSideIndex] = useState(0);

  const listSideMenu = [
    {
      title: localeText(LANGUAGES.LOUNGE.HOME),
      href: LOUNGE.HOME,
    },
    {
      title: localeText(LANGUAGES.LOUNGE.JOB_POSTING),
      href: LOUNGE.JOB_POSTING,
    },
    {
      title: localeText(LANGUAGES.LOUNGE.JOB_HUNTING),
      href: LOUNGE.JOB_HUNTING,
    },
    {
      title: localeText(LANGUAGES.LOUNGE.MARKETPLACE),
      href: LOUNGE.MARKETPLACE,
    },
    {
      title: localeText(LANGUAGES.LOUNGE.LEGAL_SERVICES),
      href: LOUNGE.LEGAL_SERVICE,
    },
    {
      title: localeText(LANGUAGES.LOUNGE.COMMUNITY),
      href: LOUNGE.COMMUNITY,
    },
  ];

  useEffect(() => {
    if (pathName === LOUNGE.HOME) {
      setSideIndex(1);
    } else if (pathName.indexOf(LOUNGE.JOB_POSTING) > -1) {
      setSideIndex(2);
    } else if (pathName.indexOf(LOUNGE.JOB_HUNTING) > -1) {
      setSideIndex(3);
    } else if (pathName.indexOf(LOUNGE.MARKETPLACE) > -1) {
      setSideIndex(4);
    } else if (pathName.indexOf(LOUNGE.LEGAL_SERVICE) > -1) {
      setSideIndex(5);
    } else if (pathName.indexOf(LOUNGE.COMMUNITY) > -1) {
      setSideIndex(6);
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
            {localeText(LANGUAGES.HEADER_MENU.LOUNGE)}
          </Text>
        </Box>
        <Box w={'100%'}>
          <Wrap spacingX={'2.5rem'} spacingY={'0.4rem'}>
            {listSideMenu.map((menu, index) => {
              return (
                <LoungeSideButton
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
    <Box w={'25rem'} maxW={'30%'}>
      <VStack spacing={0}>
        <Box py={'2.5rem'} w={'100%'}>
          <Text
            color={'#485766'}
            fontSize={'3rem'}
            fontWeight={400}
            lineHeight={'4.5rem'}
          >
            {localeText(LANGUAGES.HEADER_MENU.LOUNGE)}
          </Text>
        </Box>
        <Box w={'100%'} pt={'2rem'}>
          <VStack spacing={'2rem'}>
            {listSideMenu.map((menu, index) => {
              return (
                <LoungeSideButton
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

export default LoungeSideBar;
