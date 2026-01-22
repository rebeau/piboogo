'use client';

import { Text, useBreakpointValue, useTheme } from '@chakra-ui/react';
import utils from '@/utils';
import { useEffect, useState } from 'react';

const GText = ({
  fontSize,
  fontWeight,
  lineHeight,
  textAlign,
  color,
  children = 'TEXT',
  textShadow,
}) => {
  const theme = useTheme();

  const themeFontSize = useBreakpointValue(theme.fontSizes);

  const [tempFontSize, setTempFontSize] = useState('');

  useEffect(() => {
    if (fontSize) {
      setTempFontSize(utils.getFontSize(fontSize));
    }
  }, [fontSize]);

  return (
    <Text
      textShadow={textShadow}
      fontWeight={fontWeight}
      fontSize={themeFontSize}
      color={color || '#000'}
      lineHeight={lineHeight}
      textAlign={textAlign}
    >
      {children}
    </Text>
  );
};

export default GText;
