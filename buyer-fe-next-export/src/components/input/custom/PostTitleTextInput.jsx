'use client';

import useDevice from '@/hooks/useDevice';
import { Box, Input, Text, VStack } from '@chakra-ui/react';
import { useCallback } from 'react';

const PostTitleTextInput = (props) => {
  const { isMobile, clampW } = useDevice();
  const {
    title,
    placeholder = '',
    type = 'text',
    value,
    onChange,
    maxW,
  } = props;

  const handleOnChange = useCallback((value) => {
    if (onChange) {
      onChange(value);
    }
  });

  return isMobile(true) ? (
    <Box h={'5.25rem'} maxW={maxW ? maxW : null}>
      <VStack alignItems={'flex-start'} spacing={'0.25rem'}>
        <Text
          color={'#485766'}
          fontSize={clampW(0.9375, 1.25)}
          fontWeight={500}
          lineHeight={'2.25rem'}
        >
          {title}
        </Text>
        <Input
          type={type}
          placeholder={placeholder}
          _placeholder={{
            color: '#A7C3D2',
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: '1.75rem',
          }}
          onChange={(e) => {
            handleOnChange(e.target.value);
          }}
          value={value || ''}
          w={'100%'}
          h={'3.5rem'}
          py={'0.75rem'}
          px={'1.25rem'}
          bg={'#FFF'}
          borderRadius="0.25rem"
          border={'1px solid #9CADBE'}
        />
      </VStack>
    </Box>
  ) : (
    <Box h={'7.5rem'} maxW={maxW ? maxW : null}>
      <VStack alignItems={'flex-start'} spacing={'1.5rem'}>
        <Text
          color={'#485766'}
          fontSize={'1.25rem'}
          fontWeight={500}
          lineHeight={'2.25rem'}
        >
          {title}
        </Text>
        <Input
          type={type}
          placeholder={placeholder}
          _placeholder={{
            color: '#A7C3D2',
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: '1.75rem',
          }}
          onChange={(e) => {
            handleOnChange(e.target.value);
          }}
          value={value || ''}
          w={'100%'}
          h={'3.5rem'}
          py={'0.75rem'}
          px={'1.25rem'}
          bg={'#FFF'}
          borderRadius="0.25rem"
          border={'1px solid #9CADBE'}
        />
      </VStack>
    </Box>
  );
};

export default PostTitleTextInput;
