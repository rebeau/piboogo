'use client';

import { Box, Center, HStack, Img, Spacer, Text } from '@chakra-ui/react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import { useCallback } from 'react';
import IconLeft from '@public/svgs/icon/left.svg';
import useMove from '@/hooks/useMove';
import { usePathname } from 'next/navigation';
import { SERVICE } from '@/constants/pageURL';
import useDevice from '@/hooks/useDevice';

const ContentDetailHeader = (props) => {
  const { isMobile, clampW } = useDevice();
  const pathName = usePathname();
  const { moveBack, moveProducts } = useMove();
  const { localeText } = useLocale();
  const {
    children,
    title = localeText(LANGUAGES.COMMON.BACK_LIST),
    w = '100%',
  } = props;

  const handleOnClick = useCallback(() => {
    if (pathName.indexOf(SERVICE.PRODUCTS.ROOT) > -1) {
      moveProducts();
    } else {
      moveBack();
    }
  });

  return isMobile(true) ? (
    <Box w={w} h={'3rem'} maxH={'3rem'} px={clampW(1, 5)}>
      <HStack
        h={'100%'}
        alignItems={'center'}
        justifyContent={'space-between'}
        spacing={'0.75rem'}
      >
        <Box
          onClick={handleOnClick}
          cursor={'pointer'}
          w={children ? '75%' : '100%'}
        >
          <HStack w={'100%'} alignItems={'center'}>
            <Center h={'1.5rem'}>
              <Img src={IconLeft.src} />
            </Center>

            <Text
              w={'100%'}
              fontSize={'1.25rem'}
              fontWeight={500}
              color={'#485766'}
              lineHeight={'2.25rem'}
              whiteSpace={'nowrap'}
              overflow={'hidden'}
              textOverflow={'ellipsis'}
            >
              {title}
            </Text>
          </HStack>
        </Box>
        {children ? <Box min={'max-content'}>{children}</Box> : <Spacer />}
      </HStack>
    </Box>
  ) : (
    <Box w={w} h={'3rem'} maxH={'3rem'}>
      <HStack
        h={'100%'}
        alignItems={'center'}
        justifyContent={'space-between'}
        spacing={'0.75rem'}
      >
        <Box onClick={handleOnClick} cursor={'pointer'}>
          <HStack alignItems={'center'}>
            <Center h={'1.5rem'}>
              <Img src={IconLeft.src} />
            </Center>

            <Text
              fontSize={'1.25rem'}
              fontWeight={500}
              color={'#485766'}
              lineHeight={'2.25rem'}
            >
              {title}
            </Text>
          </HStack>
        </Box>
        {children ? children : <Spacer />}
      </HStack>
    </Box>
  );
};

export default ContentDetailHeader;
