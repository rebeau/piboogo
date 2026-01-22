'use client';

import { Box, Center, HStack, Img, Spacer, Text } from '@chakra-ui/react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import IconLeft from '@public/svgs/icon/left.svg';

const ContentDetailHeader = (props) => {
  const router = useRouter();
  const { localeText } = useLocale();
  const {
    children,
    title = localeText(LANGUAGES.COMMON.BACK_LIST),
    w = '100%',
  } = props;

  const handleOnClick = useCallback(() => {
    router.back();
  });

  return (
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
