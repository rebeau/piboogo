'use client';

import { Box, Flex, Image, Input, Textarea } from '@chakra-ui/react';
import utils from '../../utils';
import useLocale from '../../hooks/useLocale';
import React, { useRef, useState, useMemo } from 'react';
import { LANGUAGES } from '../../constants/lang';

const ChatInput = (props) => {
  const { localeText } = useLocale();
  const { chatValue, setChatValue, enqueueMessage } = props;

  const [isComposing, setIsComposing] = useState(false);

  const handleChatValue = (e) => {
    const newValue = e.target.value;
    setChatValue?.(newValue);
  };

  const handlePostChatValue = () => {
    const tempChatValue = chatValue || '';
    if (!tempChatValue.trim()) return;

    setChatValue?.('');
    if (enqueueMessage) {
      enqueueMessage(tempChatValue);
    }
  };

  return (
    <Flex
      direction="column"
      align="center"
      gap={2.5}
      p={6}
      alignSelf="stretch"
      bg="#D9E7EC"
      // bg="rgba(23.67, 51.59, 128.37, 0.20)"
    >
      <Box position="relative" height="74px" width="100%" alignSelf="stretch">
        <Flex
          position="absolute"
          top="0.27px"
          left={0}
          height="100%"
          width="100%"
          boxShadow="0 0 46.58px 7.68px #FFF"
          borderRadius="16px"
          outline="1.92px solid #000"
          outlineOffset="-1.92px"
          direction="column"
          justify="center"
          align="center"
          gap={1.2}
          display="inline-flex"
          px="21.59px"
          py="6.24px"
        >
          <Flex justify="space-between" align="center" width="100%">
            <Flex w="100%" align="center" gap={3.84}>
              <Textarea
                w="100%"
                bg="transparent"
                variant="unstyled"
                fontSize="18px"
                resize="none"
                rows={1}
                lineHeight="1.5em"
                maxHeight="4.5em" // 1.5em * 3줄
                overflowY="auto"
                placeholder={localeText(LANGUAGES.CHAT.AI_CHAT_PLACEHOLDER)}
                color={'black'}
                _placeholder={{
                  paddingTop: '3px',
                  fontSize: '18px',
                  lineHeight: '18px',
                }}
                value={chatValue || ''}
                onChange={handleChatValue}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    if (!isComposing) {
                      e.preventDefault();
                      handlePostChatValue();
                    }
                  }
                }}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={(e) => {
                  setIsComposing(false);
                  setChatValue?.(e.currentTarget.value);
                }}
              />
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default React.memo(ChatInput);
