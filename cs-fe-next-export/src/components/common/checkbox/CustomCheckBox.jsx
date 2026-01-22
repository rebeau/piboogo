import React, { useCallback, useEffect, useState } from 'react';
import { Box, Center, Checkbox, Img, useCheckbox } from '@chakra-ui/react';
import IconChecked from '@public/svgs/icon/checked.svg';

const CustomCheckBox = (props) => {
  const { onChange, isChecked = false, isSmall = false } = props;
  const { getInputProps, getCheckboxProps, state } = useCheckbox({
    defaultChecked: false,
  });

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  // const isCheckedState = state.isChecked;

  const handleOnChange = (e) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  /*
  return (
    <Center
      as="label"
      position={'relative'}
    >
      <input
        checked={isChecked}
        {...input}
        onChange={(e) => {
          handleOnChange(e);
        }}
      />
      <Box
        {...checkbox}
        cursor="pointer"
        w={'1.75rem'}
        h={'1.75rem'}
        border={'1px solid'}
        borderColor={'#9CADBE !important'}
        borderRadius={'0.25rem'}
        bg={'#FFF'}
        _checked={{
          border: '1px solid',
          borderColor: '#9CADBE !important',
          color: '#556A7E',
          background: '#FFF',
        }}
      >
        {props.children}
      </Box>
      {isChecked && <Img src={IconChecked.src} position={'absolute'} />}
    </Center>
  );
  */
  return (
    <Center as="label" position={'relative'}>
      <input
        {...input}
        checked={isChecked}
        onChange={(e) => {
          handleOnChange(e);
        }}
      />
      <Box
        {...checkbox}
        cursor="pointer"
        w={isSmall ? '1.5rem' : '1.75rem'}
        h={isSmall ? '1.5rem' : '1.75rem'}
        border={'1px solid'}
        borderColor={'#9CADBE !important'}
        borderRadius={'0.25rem'}
        bg={'#FFF'}
        _checked={{
          border: '1px solid',
          borderColor: '#9CADBE !important',
          color: '#556A7E',
          background: '#FFF',
        }}
      >
        {props.children}
      </Box>
      {isChecked && <Img src={IconChecked.src} position={'absolute'} />}
    </Center>
  );
};

export default CustomCheckBox;
