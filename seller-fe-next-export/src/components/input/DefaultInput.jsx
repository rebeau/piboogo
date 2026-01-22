'use client';

import { Input } from '@chakra-ui/react';

const DefaultInput = (props) => {
  // 기본
  const {
    value,
    placeholder = '',
    color,
    type = 'text',
    max = 999999,
    borderRadius,
    borderColor,
    fontWeight,
    fontSize,
    _placeholder,
    _hover,
  } = props;
  // 권한
  const { isDisabled = false, readOnly = false } = props;
  // 이벤트
  const { onChange, onKeyDown, onBlur } = props;
  // chakra ui prop
  const { textAlign = 'left' } = props;

  const handleOnChange = (event) => {
    const tempValue = event.target.value;
    if (type === 'number' && Number.isNaN(Number(tempValue))) return;
    if (max) {
      if (event.target.value.length > max) {
        event.preventDefault();
        return;
      }
    }
    if (onChange) {
      return onChange(tempValue);
    }
  };

  const handleOnKeyDown = (event) => {
    const { keyCode } = event;
    // 13 enter, 38 방향키 위, 40 방향키 아래
    if (keyCode === 13 || keyCode === 38 || keyCode === 40) {
      event.preventDefault();
      return;
    }
    if (onKeyDown) {
      return onKeyDown(event);
    }
  };

  const handleOnBlur = (event) => {
    if (onBlur) {
      return onBlur(event);
    }
  };

  return (
    <Input
      // w="100%"
      // h="100%"
      value={value || ''}
      borderColor={borderColor}
      borderRadius={borderRadius}
      autoComplete={'one-time-code'}
      type={type}
      color={color}
      fontWeight={fontWeight}
      fontSize={fontSize}
      textAlign={textAlign}
      maxLength={max}
      //
      readOnly={readOnly}
      isDisabled={isDisabled}
      //
      onChange={handleOnChange}
      onKeyDown={handleOnKeyDown}
      onBlur={handleOnBlur}
      //
      placeholder={placeholder}
      _placeholder={_placeholder}
      _hover={_hover}
    />
  );
};

export default DefaultInput;
