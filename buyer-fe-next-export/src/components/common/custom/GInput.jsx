'use client';

import { Box, Input, InputGroup, VStack } from '@chakra-ui/react';
import { GText } from '@/components';
import utils from '@/utils';
import { useEffect, useState } from 'react';
import { RADIUS_S_20 } from '@/constants/common';

// GInput
const GInput = (props) => {
  const { value, onChange } = props;
  const { fontSize, title, placeholder = '', readOnly = false } = props;

  const [tempFontSize, setTempFontSize] = useState('');

  useEffect(() => {
    if (fontSize) {
      const temp = utils.getFontSize(fontSize);
      setTempFontSize(temp);
    }
  }, [fontSize]);

  const handleOnChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <Box w={'100%'}>
      <VStack spacing={2}>
        {title && (
          <Box w="100%">
            <GText fontWeight={500} fontSize={38}>
              {title}
            </GText>
          </Box>
        )}
        <Box w={'100%'} h={'15vh'}>
          <InputGroup h={'100%'}>
            <Input
              readOnly={readOnly}
              h={'100%'}
              value={value}
              onChange={handleOnChange}
              fontSize={tempFontSize}
              fontWeight={700}
              color={'#222'}
              borderRadius={RADIUS_S_20}
              placeholder={placeholder}
              _placeholder={{
                fontSize: tempFontSize,
                fontWeight: 400,
                color: '#999',
              }}
            />
          </InputGroup>
        </Box>
      </VStack>
    </Box>
  );
};

export default GInput;
