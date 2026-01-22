'use client';

import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import AutoImageSlider from '@/components/input/file/AutoImageSlider';
import { LANGUAGES } from '@/constants/lang';
import useDevice from '@/hooks/useDevice';
import useLocale from '@/hooks/useLocale';
import utils from '@/utils';
import { clampW } from '@/utils/deviceUtils';
import {
  Box,
  Center,
  HStack,
  Text,
  VStack,
  Image as ChakraImage,
} from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const LoungePostCard = (props) => {
  const router = useRouter();
  const pathName = usePathname();
  const { localeText } = useLocale();
  const { isMobile } = useDevice();
  const { lang } = useLocale();
  const { item } = props;

  const [listImage, setListImage] = useState([]);

  useEffect(() => {
    if (item) {
      if (item?.loungeImageList) {
        setListImage(item.loungeImageList);
      }
    }
  }, [item]);

  const handleMoveDetail = useCallback((item) => {
    router.push(`${pathName}/detail/${item.loungeId}`);
  });

  return isMobile(true) ? (
    <Box
      cursor={'pointer'}
      onClick={() => {
        handleMoveDetail(item);
      }}
      w={'100%'}
      borderTop={'1px solid #AEBDCA'}
      py={'1rem'}
      px={clampW(0.7, 1.25)}
    >
      <VStack spacing={0}>
        <Box w={'100%'}>
          <HStack spacing={'1rem'}>
            <Box w={'5rem'} h={'5rem'} minW={'5rem'}>
              <AutoImageSlider images={listImage} />
            </Box>
            <Box>
              <Text
                textAlign={'center'}
                color={'#485766'}
                fontSize={clampW(0.75, 1)}
                fontWeight={500}
                lineHeight={'1.75rem'}
              >
                {item.title}
              </Text>
            </Box>
          </HStack>
        </Box>
        <Box w={'100%'}>
          <HStack spacing={'1rem'}>
            <Box w={'5rem'} minW={'5rem'}>
              <Text
                textAlign={'left'}
                color={'#2A333C'}
                fontSize={clampW(0.75, 1)}
                fontWeight={500}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.LOUNGE.JOBS.AUTHOR)}
              </Text>
            </Box>
            <Box>
              <Text
                textAlign={'center'}
                color={'#485766'}
                fontSize={clampW(0.75, 1)}
                fontWeight={500}
                lineHeight={'1.75rem'}
              >
                {item.id}
              </Text>
            </Box>
          </HStack>
        </Box>
        <Box w={'100%'}>
          <HStack spacing={'1rem'}>
            <Box w={'5rem'} minW={'5rem'}>
              <Text
                textAlign={'left'}
                color={'#2A333C'}
                fontSize={clampW(0.75, 1)}
                fontWeight={500}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.LOUNGE.JOBS.CREATED_ON)}
              </Text>
            </Box>
            <Box>
              <Text
                textAlign={'center'}
                color={'#485766'}
                fontSize={clampW(0.75, 1)}
                fontWeight={500}
                lineHeight={'1.75rem'}
              >
                {utils.parseDateByCountryCode(item.createdAt, lang)}
              </Text>
            </Box>
          </HStack>
        </Box>
        <Box w={'100%'}>
          <HStack spacing={'1rem'}>
            <Box w={'5rem'} minW={'5rem'}>
              <Text
                textAlign={'left'}
                color={'#2A333C'}
                fontSize={clampW(0.75, 1)}
                fontWeight={500}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.LOUNGE.JOBS.VIEWS)}
              </Text>
            </Box>
            <Box>
              <Text
                textAlign={'center'}
                color={'#485766'}
                fontSize={clampW(0.75, 1)}
                fontWeight={500}
                lineHeight={'1.75rem'}
              >
                {utils.parseAmount(item.viewCnt)}
              </Text>
            </Box>
          </HStack>
        </Box>
      </VStack>
    </Box>
  ) : (
    <Box
      cursor={'pointer'}
      onClick={() => {
        handleMoveDetail(item);
      }}
      w={'100%'}
      // borderTop={'1px solid #AEBDCA'}
      // p={'1.25rem'}
    >
      <Box
        w={'100%'}
        alignSelf="stretch"
        px={5}
        py={4}
        borderTop="1px solid #73829D"
        justifyContent="flex-start"
        alignItems="center"
        gap={6}
        display="inline-flex"
      >
        <Box
          flex="1 1 0"
          justifyContent="center"
          display="flex"
          flexDirection="column"
        >
          <HStack>
            <Box minW={'6.25rem'} w={'6.25rem'} h={'6.25rem'}>
              <AutoImageSlider images={listImage} />
            </Box>
            <Box>
              <Text
                textAlign={'center'}
                color={'#485766'}
                fontSize={'1rem'}
                fontWeight={500}
                lineHeight={'1.75rem'}
              >
                {item.title}
              </Text>
            </Box>
          </HStack>
        </Box>

        <Box
          w={'12.5rem'}
          justifyContent="center"
          display="flex"
          flexDirection="column"
        >
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'1rem'}
            fontWeight={500}
            lineHeight={'1.75rem'}
          >
            {item.id}
          </Text>
        </Box>

        <Box
          w={'8.75rem'}
          justifyContent="center"
          display="flex"
          flexDirection="column"
        >
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'1rem'}
            fontWeight={500}
            lineHeight={'1.75rem'}
          >
            {utils.parseDateByCountryCode(item.createdAt, lang)}
          </Text>
        </Box>

        <Box
          w={'2.8125rem'}
          justifyContent="center"
          display="flex"
          flexDirection="column"
        >
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'1rem'}
            fontWeight={500}
            lineHeight={'1.75rem'}
          >
            {utils.parseAmount(item.viewCnt)}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default LoungePostCard;
