'use client';

import React, { useRef } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import ChatMessageTime from './ChatMessageTime';

const MessageForm = ({
  isAnswer = false,
  isRead = false,
  text,
  dateStr,
  messageUserName,
}) => {
  // const { t } = useLocale();
  // const showToast = useCustomToast();
  const messageRef = useRef(null);
  const menuRef = useRef(null);

  const handleClose = () => setIsMenuOpen(false);

  // 공통 스타일
  const containerProps = {
    direction: 'column',
    gap: 2.5,
    alignSelf: isAnswer ? 'stretch' : undefined,
    align: isAnswer ? 'flex-start' : 'flex-end',
    justify: isAnswer ? 'center' : 'flex-start',
    maxWidth: '100%',
  };

  const messageBoxProps = {
    px: 4,
    py: 1,
    borderRadius: '0.75rem',
    gap: 2.5,
    display: 'inline-flex',
    justifyContent: isAnswer ? 'center' : 'center',
    alignItems: isAnswer ? 'center' : 'flex-start',
    bg: isAnswer ? 'rgba(255, 255, 255, 0.05)' : '#b8bec4ff',
    outline: isAnswer ? '1px solid rgba(255, 255, 255, 0.5)' : undefined,
    outlineOffset: isAnswer ? '-1px' : undefined,
    maxWidth: '100%',
  };

  const textProps = {
    fontFamily: 'SegoeUI',
    color: 'white',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '150%',
    wordBreak: 'break-word',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  const formattedText = (text ?? '').replace(/\\n/g, '\n');
  return (
    <Box w="100%">
      <Flex {...containerProps}>
        <Flex ref={messageRef} {...messageBoxProps} position={'relative'}>
          <Text {...textProps} whiteSpace="pre-wrap" userSelect={'text'}>
            {formattedText}
          </Text>
        </Flex>
        <ChatMessageTime
          isAnswer={isAnswer}
          dateStr={dateStr}
          messageUserName={messageUserName}
          isRead={isRead}
        />
      </Flex>
    </Box>
  );
};

export default MessageForm;
