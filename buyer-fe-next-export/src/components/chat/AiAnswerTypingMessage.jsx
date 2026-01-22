'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import ChatMessageTime from './ChatMessageTime';

const AiAnswerTypingMessage = ({
  text,
  dateStr,
  messageUserName,
  messageId,
  typingSpeed = 30,
  isRead = false,
  scrollToBottom,
  randomKey,
  isContact = false,
}) => {
  const typedRef = useRef({});
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    const uniqueKey = `${messageId}-${randomKey}`;

    // randomKey가 바뀌었으면 typedRef 초기화
    if (typedRef.current[uniqueKey]) {
      typedRef.current[uniqueKey] = false;
    }

    if (!text || typedRef.current[uniqueKey]) return;

    typedRef.current[uniqueKey] = true;

    let index = 0;
    let cleanText = text.replace(/\\n/g, '\n');
    cleanText = cleanText.replace(/&nbsp;/g, ' ');
    setDisplayedText('');

    if (isContact) {
      setDisplayedText(cleanText);

      if (scrollToBottom) scrollToBottom();
      return;
    }

    const interval = setInterval(
      () => {
        index++;
        setDisplayedText(cleanText.slice(0, index));

        if (scrollToBottom) scrollToBottom();

        if (index >= cleanText.length) {
          clearInterval(interval);
        }
      },
      isContact === true ? typingSpeed + 570 : typingSpeed,
    );

    return () => clearInterval(interval);
  }, [text, messageId, typingSpeed, randomKey, isContact]);

  return (
    <Box w="100%">
      <Flex
        maxWidth={'clamp(300px, 85vw, 100%)'}
        direction="column"
        gap={2.5}
        align="flex-start"
        justify="center"
        alignSelf="stretch"
      >
        <Flex
          px={4}
          py={1}
          borderRadius="0.75rem"
          gap={2.5}
          display="inline-grid"
          justifyContent="center"
          alignItems="center"
          bg="rgba(255, 255, 255, 0.05)"
          outline="1px solid rgba(255, 255, 255, 0.5)"
          outlineOffset="-1px"
          wordBreak="break-word"
          minHeight="50px"
        >
          {text === '' ? (
            // <Spinner color="white" size="sm" />
            <Text
              fontFamily={'SegoeUI'}
              color="#FFFFFF99"
              fontSize="16px"
              fontWeight={400}
              lineHeight="150%"
              whiteSpace="pre-wrap"
            >
              {/* {localText('INFO.AI_LOADING_MESSAGE')} */}
            </Text>
          ) : (
            <Text
              fontFamily={'SegoeUI'}
              color="white"
              fontSize="16px"
              fontWeight={400}
              lineHeight="150%"
              whiteSpace="pre-wrap"
              userSelect={'text'}
            >
              {displayedText}
            </Text>
          )}
        </Flex>

        <ChatMessageTime
          isAnswer
          dateStr={dateStr}
          messageUserName={messageUserName}
          isRead={isRead}
        />
      </Flex>
    </Box>
  );
};

export default React.memo(AiAnswerTypingMessage, (prev, next) => {
  return (
    prev.text === next.text &&
    prev.messageId === next.messageId &&
    prev.dateStr === next.dateStr &&
    prev.messageUserName === next.messageUserName &&
    prev.randomKey === next.randomKey
  );
});
