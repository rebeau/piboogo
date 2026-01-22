'use client';

import useDevice from '@/hooks/useDevice';
import {
  Center,
  Img,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';

import SearchIcon from '@public/svgs/icon/search-icon.svg';
import { useCallback } from 'react';

const SearchInput = (props) => {
  const {
    value,
    onClick,
    onChange,
    placeholder,
    borderRadius = '4.13rem',
    placeholderFontColor = '#7895B2',
  } = props;

  const { isMobile, clampW, clampH } = useDevice();

  const handleOnChange = useCallback((e) => {
    if (onChange) {
      onChange(e);
    }
  });

  const handleOnClick = useCallback((e) => {
    if (onClick) {
      onClick(e);
    }
  });

  return (
    <InputGroup
      h={'100%'}
      p={'0.06rem'}
      onClick={() => {
        // handleOnClick();
      }}
    >
      <Input
        w={'100%'}
        // h={isMobile(true) ? '2.87rem' : '3.5rem'}
        h={'2.5rem'}
        borderRadius={borderRadius}
        border={'1px solid #9CADBE'}
        placeholder={placeholder}
        _placeholder={{
          fontWeight: 400,
          fontSize: isMobile(true) ? '0.875rem' : '1rem',
          color: placeholderFontColor,
        }}
        fontSize={isMobile(true) ? '0.875rem' : '1rem'}
        fontWeight={400}
        value={value || ''}
        onChange={handleOnChange}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            handleOnClick();
          }
        }}
      />
      <InputRightElement
        h={'100%'}
        onClick={(e) => {
          e.preventDefault();
          handleOnClick();
        }}
        _hover={{
          cursor: 'pointer',
        }}
      >
        <Center h={'100%'}>
          <Img w={'2rem'} h={'2rem'} src={SearchIcon.src} />
        </Center>
      </InputRightElement>
    </InputGroup>
  );
};

export default SearchInput;
