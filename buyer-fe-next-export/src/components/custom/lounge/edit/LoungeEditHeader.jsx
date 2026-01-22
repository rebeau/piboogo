'use client';

import { LANGUAGES } from '@/constants/lang';
import useDevice from '@/hooks/useDevice';
import useLocale from '@/hooks/useLocale';
import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';

const LoungeEditHeader = (props) => {
  const { isMobile, clampW } = useDevice();
  const pathName = usePathname();
  const isModify = pathName.indexOf('/modify') > -1;
  const { localeText } = useLocale();
  const { isDisabled = true, handleSavePost, handleModifyPost } = props;

  console.log('isModify', isModify);

  return isMobile(true) ? (
    <Box w={'100%'}>
      <Text
        color={'#485766'}
        fontSize={'1.5rem'}
        fontWeight={500}
        lineHeight={'2.457rem'}
      >
        {localeText(
          isModify
            ? LANGUAGES.LOUNGE.JOBS.MODIFY_A_POST
            : LANGUAGES.LOUNGE.JOBS.WRITE_A_NEW_POST,
        )}
      </Text>
    </Box>
  ) : (
    <Box w={'100%'}>
      <HStack justifyContent={'space-between'}>
        <Box>
          <Text
            color={'#485766'}
            fontSize={'1.5rem'}
            fontWeight={500}
            lineHeight={'2.457rem'}
          >
            {localeText(
              isModify
                ? LANGUAGES.LOUNGE.JOBS.MODIFY_A_POST
                : LANGUAGES.LOUNGE.JOBS.WRITE_A_NEW_POST,
            )}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
};

export default LoungeEditHeader;
