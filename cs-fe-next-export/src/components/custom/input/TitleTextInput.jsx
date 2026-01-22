'use client';

import useDevice from '@/hooks/useDevice';
import { Box, Input, Text, VStack } from '@chakra-ui/react';
import { useCallback } from 'react';

const TitleTextInput = (props) => {
  const {
    title,
    placeholder = '',
    type = 'text',
    value,
    onChange,
    onClick,
    maxW,
    isReadOnly = false,
    isDisabled = false,
    max = 99999999999,
  } = props;

  const { isMobile, clampW } = useDevice();

  const handleOnChange = useCallback((value) => {
    if (onChange) {
      onChange(value);
    }
  });

  const handleOnClick = useCallback((e) => {
    if (onClick) {
      onClick(e);
    }
  });

  /*
  border-radius: 0.25rem;
  border: 1px solid var(--Semantic-border-default, #AEBDCA);
  background: linear-gradient(0deg, var(--Semantic-fill-brand-hover, rgba(144, 174, 196, 0.07)) 0%, var(--Semantic-fill-brand-hover, rgba(144, 174, 196, 0.07)) 100%), var(--Semantic-fill-inverse-default, #FFF);
  */

  const handleHeight = () => {
    if (isMobile(true)) {
      title ? '5.5rem' : '3.5rem';
    } else {
      title ? '5.5rem' : '3.5rem';
    }
  };

  return (
    <Box h={handleHeight()} maxW={maxW ? maxW : null}>
      <VStack alignItems={'flex-start'} spacing={'0.25rem'}>
        {title && (
          <Text
            color={'#7895B2'}
            fontSize={clampW(0.9375, 1)}
            fontWeight={400}
            lineHeight={'1.75rem'}
          >
            {title}
          </Text>
        )}
        <Input
          _readOnly={{
            color: '#A7C3D2',
            bg: 'linear-gradient(0deg, var(--Semantic-fill-brand-hover, rgba(144, 174, 196, 0.07)) 0%, var(--Semantic-fill-brand-hover, rgba(144, 174, 196, 0.07)) 100%), var(--Semantic-fill-inverse-default, #FFF)',
          }}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              handleOnClick(e);
            }
          }}
          isDisabled={isDisabled}
          isReadOnly={isReadOnly}
          type={type}
          placeholder={placeholder}
          // autoComplete={type === 'password' ? 'off' : null}
          autoComplete={'off'}
          _placeholder={{
            color: '#A7C3D2',
            fontSize: clampW(0.9375, 1),
            fontWeight: 400,
            lineHeight: '1.75rem',
          }}
          /*
          _disabled={{
            bg:'#FFF',
          }}
            */
          onChange={(e) => {
            const value = e.target.value;
            if (value.length > max) return;
            handleOnChange(value);
          }}
          value={value || ''}
          w={'100%'}
          h={isMobile(true) ? '3.5rem' : '3.5rem'}
          p={'0.75rem'}
          bg={'#FFF'}
          borderRadius="0.25rem"
          border={'1px solid #9CADBE'}
        />
      </VStack>
    </Box>
  );
};

export default TitleTextInput;
