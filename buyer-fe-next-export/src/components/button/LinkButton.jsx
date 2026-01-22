'use client';

import { Button, Text } from '@chakra-ui/react';
const LinkButton = (props) => {
  const {
    size = 'md',
    color = '#222',
    fontSize = '16px',
    fontWeight = 400,
    lineHeight,
  } = props;
  const { id, text } = props;

  const { onClick, isDisabled = false } = props;

  return (
    <Button
      id={id}
      isDisabled={isDisabled}
      size={size}
      border={0}
      px={2}
      onClick={onClick}
      _focus={{}}
      _hover={{}}
      _active={{}}
      _disabled={{
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: 0.5,
      }}
    >
      <Text
        color={color}
        fontSize={fontSize}
        fontWeight={fontWeight}
        lineHeight={lineHeight}
        textDecoration={'underline'}
        textUnderlineOffset={4}
      >
        {text}
      </Text>
    </Button>
  );
};

export default LinkButton;
