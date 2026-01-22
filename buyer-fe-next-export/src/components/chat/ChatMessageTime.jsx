'use client';

import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import useLocale from '../../hooks/useLocale';

const ChatMessageTime = ({
  isAnswer = false,
  dateStr = null,
  messageUserName,
  isRead = false,
}) => {
  const { lang, localeText } = useLocale();
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const isAM = hours < 12;
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

    if (lang === 'en') {
      const period = isAM ? 'AM' : 'PM';
      return `${formattedHours}:${minutes} ${period}`;
    }

    if (lang === 'ko') {
      const period = isAM ? '오전' : '오후';
      return `${period} ${formattedHours}:${minutes}`;
    }

    return `${isAM ? '오전' : '오후'} ${formattedHours}:${minutes}`;
  };

  return (
    <Flex
      px={2}
      gap={2.5}
      align="flex-start"
      justify="flex-start"
      display="inline-flex"
    >
      {isAnswer && (
        <Text
          color="rgba(255, 255, 255, 0.7)"
          fontFamily={'SegoeUI'}
          fontSize="16px"
          fontWeight="400"
          lineHeight="150%"
          wordBreak="break-word"
          textAlign={isAnswer ? 'right' : 'left'}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          {messageUserName}
        </Text>
      )}

      {dateStr && (
        <Text
          color="rgba(255, 255, 255, 0.7)"
          fontFamily={'SegoeUI'}
          fontSize="16px"
          fontWeight="400"
          lineHeight="150%"
          wordBreak="break-word"
          textAlign={isAnswer ? 'right' : 'left'}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          {formatTime(dateStr)}
        </Text>
      )}

      {/*
      {isAnswer && (
        <Text
          color="rgba(255, 255, 255, 0.7)"
          fontSize="16px"
          fontWeight="300"
          wordBreak="break-word"
          textAlign={isAnswer ? 'right' : 'left'}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          {isRead ? `${t('INFO.READ')}` : t('INFO.UNREAD')}
        </Text>
      )}

      */}
    </Flex>
  );
};

export default ChatMessageTime;
