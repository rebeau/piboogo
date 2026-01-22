'use client';

import {
  Center,
  Img,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';

import SearchIcon from '@public/svgs/icon/big-search.svg';
import { useCallback } from 'react';

const SearchInput = (props) => {
  const {
    value,
    onClick,
    onChange,
    placeholder,
    borderRadius = '0.25rem',
    placeholderFontColor = '#7895B2',
  } = props;

  const handleOnChange = useCallback((e) => {
    if (onChange) {
      onChange(e);
    }
  });

  const handleOnClick = useCallback((e) => {
    if (onClick) {
      onClick();
    }
  });

  return (
    <InputGroup h={'100%'}>
      <Input
        py={'0.75rem'}
        px={'1rem'}
        w={'100%'}
        h={'100%'}
        borderRadius={borderRadius}
        border={'1px solid #9CADBE'}
        placeholder={placeholder}
        _placeholder={{
          fontWeight: 400,
          fontSize: '0.9375rem',
          color: placeholderFontColor,
          lineHeight: '1.5rem',
        }}
        fontSize={'0.9375rem'}
        lineHeight={'1.5rem'}
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
        w={'3.5rem'}
        h={'100%'}
        onClick={(e) => {
          e.preventDefault();
          handleOnClick();
        }}
        _hover={{
          cursor: 'pointer',
        }}
      >
        <Center w={'1.5rem'} h={'1.5rem'}>
          <Img w={'100%'} h={'100%'} src={SearchIcon.src} />
        </Center>
      </InputRightElement>
    </InputGroup>
  );
};

export default SearchInput;
