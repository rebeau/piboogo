'use client';

import { CustomIcon } from '@/components';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import { Button, HStack, Text } from '@chakra-ui/react';

const RightIconButton = (props) => {
  const {
    bg = 'red',
    color = '#FFF',
    onClick,
    iconName = null,
    textTarget = LANGUAGES.VIEW_ALL,
    w = '11rem',
    h = '3.875rem',
  } = props;

  const { localeText } = useLocale();
  return (
    <Button
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      borderRadius={'1.88rem'}
      py={'1rem'}
      px={'2rem'}
      bg={bg}
      w={w}
      h={h}
    >
      <HStack spacing={'0.75rem'}>
        <Text fontSize={'1.25rem'} fontWeight={400} color={color}>
          {localeText(textTarget)}
        </Text>
        {iconName && (
          <CustomIcon w={'1.5rem'} h={'1.5rem'} color={color} name={iconName} />
        )}
      </HStack>
    </Button>
  );
};

export default RightIconButton;
