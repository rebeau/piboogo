'use client';

import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import { Box, Text } from '@chakra-ui/react';

const LoungeTableHeader = () => {
  const { localeText } = useLocale();
  return (
    <Box
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
        color="#2A333C"
        fontSize="0.9375rem"
        fontWeight={500}
        lineHeight="1.5rem"
      >
        <Text>{localeText(LANGUAGES.LOUNGE.JOBS.TITLE)}</Text>
      </Box>

      <Box
        w="12.5rem" // 200px -> 12.5rem
        textAlign="center"
        justifyContent="center"
        display="flex"
        flexDirection="column"
        color="#2A333C"
        fontSize="0.9375rem"
        fontWeight={500}
        lineHeight="1.5rem"
      >
        <Text>{localeText(LANGUAGES.LOUNGE.JOBS.AUTHOR)}</Text>
      </Box>

      <Box
        w="8.75rem" // 140px -> 8.75rem
        textAlign="center"
        justifyContent="center"
        display="flex"
        flexDirection="column"
        color="#2A333C"
        fontSize="0.9375rem"
        fontWeight={500}
        lineHeight="1.5rem"
      >
        <Text>{localeText(LANGUAGES.LOUNGE.JOBS.CREATED_ON)}</Text>
      </Box>

      <Box
        w={'2.8125rem'}
        textAlign="center"
        justifyContent="center"
        display="flex"
        flexDirection="column"
        color="#2A333C"
        fontSize="0.9375rem"
        fontWeight={500}
        lineHeight="1.5rem"
      >
        <Text>{localeText(LANGUAGES.LOUNGE.JOBS.VIEWS)}</Text>
      </Box>
    </Box>
  );
};

export default LoungeTableHeader;
