'use client';

import SearchInput from '@/components/input/custom/SearchInput';
import { LANGUAGES } from '@/constants/lang';
import useDevice from '@/hooks/useDevice';
import useLocale from '@/hooks/useLocale';
import utils from '@/utils';
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';

const LoungeListHeader = (props) => {
  const { isMobile, clampW } = useDevice();
  const router = useRouter();
  const pathName = usePathname();
  const { localeText } = useLocale();

  const { searchBy, setSearchBy, handleOnClick } = props;

  const handleAddPost = useCallback(() => {
    router.push(`${pathName}/write`);
  });

  return isMobile(true) ? (
    <Box w={'100%'}>
      <VStack justifyContent={'space-between'} spacing={'1.5rem'}>
        <Box w={'100%'} h={'3rem'}>
          <SearchInput
            value={searchBy}
            onChange={(e) => {
              setSearchBy(e.target.value);
            }}
            onClick={(e) => {
              if (handleOnClick) {
                handleOnClick();
              }
            }}
            placeholder={localeText(LANGUAGES.LOUNGE.JOBS.SEARCH_FOR_POSTS)}
          />
        </Box>
        {utils.getIsLogin() && (
          <Box minW={'7rem'} w={'100%'}>
            <Button
              onClick={handleAddPost}
              py={'0.625rem'}
              px={'1.25rem'}
              borderRadius={'0.25rem'}
              bg={'#7895B2'}
              h={'100%'}
              w={'100%'}
            >
              <Text
                color={'#FFF'}
                fontSize={'1rem'}
                fontWeight={400}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.LOUNGE.JOBS.WRITE_A_NEW_POST)}
              </Text>
            </Button>
          </Box>
        )}
      </VStack>
    </Box>
  ) : (
    <Box w={'100%'}>
      <HStack justifyContent={'space-between'}>
        <Box w={'25rem'} h={'3rem'}>
          <SearchInput
            value={searchBy}
            onChange={(e) => {
              setSearchBy(e.target.value);
            }}
            onClick={(e) => {
              if (handleOnClick) {
                handleOnClick();
              }
            }}
            placeholder={localeText(LANGUAGES.LOUNGE.JOBS.SEARCH_FOR_POSTS)}
          />
        </Box>
        {utils.getIsLogin() && (
          <Box minW={'7rem'} w={'11.625rem'}>
            <Button
              onClick={handleAddPost}
              py={'0.625rem'}
              px={'1.25rem'}
              borderRadius={'0.25rem'}
              bg={'#7895B2'}
              h={'100%'}
              w={'100%'}
            >
              <Text
                color={'#FFF'}
                fontSize={'1rem'}
                fontWeight={400}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.LOUNGE.JOBS.WRITE_A_NEW_POST)}
              </Text>
            </Button>
          </Box>
        )}
      </HStack>
    </Box>
  );
};

export default LoungeListHeader;
