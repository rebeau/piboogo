'use client';

import { Button, HStack, Text } from '@chakra-ui/react';
import { GText } from '@/components';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';

const DefaultButton = (props) => {
  const { lang, localeText } = useLocale();
  const { theme, outline = false, leftIcon, rightIcon } = props;

  const { size = 'md', fontSize, fontWeight, lineHeight, fontColor } = props;

  const { borderRadius, borderColor, bg } = props;
  const { id, text } = props;

  const { onClick, active, isDisabled = false } = props;

  let tempTheme = 'positive';
  if (theme !== undefined) {
    tempTheme = theme;
  }
  if (outline) {
    tempTheme += '.outline';
  }

  return (
    <Button
      w={'100%'}
      h={'100%'}
      id={id}
      onClick={onClick}
      isDisabled={isDisabled}
      bg={bg || `${tempTheme}.default`}
      _hover={{
        bg: `${tempTheme}.hoverBgColor`,
      }}
      _active={{
        bg: isDisabled ? '' : bg ? '' : `${tempTheme}.activeColor`,
      }}
      color={`${tempTheme}.fontColor`}
      borderRadius={borderRadius}
      border={'1px solid'}
      borderColor={borderColor || `${tempTheme}.borderColor`}
      size={size}
      _disabled={{
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: 0.5,
      }}
    >
      <HStack alignItems="center">
        {leftIcon || null}
        <Text
          color={fontColor ? fontColor : '#FFF'}
          fontSize={fontSize}
          fontWeight={fontWeight || '1rem'}
          lineHeight={lineHeight}
        >
          {text || localeText(LANGUAGES.COMMON.CONFIRM)}
        </Text>
        {rightIcon || null}
      </HStack>
    </Button>
  );
};

export default DefaultButton;
