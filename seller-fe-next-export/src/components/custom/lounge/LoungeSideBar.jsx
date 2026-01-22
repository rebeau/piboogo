'use client';

import { LANGUAGES } from '@/constants/lang';
import { LOUNGE } from '@/constants/pageURL';
import useLocale from '@/hooks/useLocale';
import { Box, Text, VStack } from '@chakra-ui/react';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoungeSideButton from './LoungeSideButton';

const LoungeSideBar = () => {
  const { localeText } = useLocale();
  const pathName = usePathname();

  const [sideIndex, setSideIndex] = useState(0);

  const listSideMenu = [
    {
      title: localeText(LANGUAGES.LOUNGE.HOME),
      href: LOUNGE.HOME,
    },
    {
      title: localeText(LANGUAGES.LOUNGE.JOBS.JOBS),
      href: LOUNGE.JOBS,
    },
    {
      title: localeText(LANGUAGES.LOUNGE.JOBS_SEARCH),
      href: LOUNGE.JOBS_SEARCH,
    },
    {
      title: localeText(LANGUAGES.LOUNGE.SECOND_HAND),
      href: LOUNGE.SECOND_HAND,
    },
    {
      title: localeText(LANGUAGES.LOUNGE.ROUTINE),
      href: LOUNGE.ROUTINE,
    },
  ];

  useEffect(() => {
    if (pathName === LOUNGE.HOME) {
      setSideIndex(1);
    } else if (
      pathName === LOUNGE.JOBS ||
      pathName === LOUNGE.JOBS_WRITE ||
      pathName.indexOf(LOUNGE.JOBS_DETAIL) > -1
    ) {
      setSideIndex(2);
    } else if (pathName === LOUNGE.JOBS_SEARCH) {
      setSideIndex(3);
    } else if (pathName === LOUNGE.SECOND_HAND) {
      setSideIndex(4);
    } else if (pathName === LOUNGE.ROUTINE) {
      setSideIndex(5);
    }
  }, [pathName]);

  return (
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
