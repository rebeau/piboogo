'use client';

import { Box, Stack, VStack } from '@chakra-ui/react';
import React from 'react';

import MessageForm from './MessageForm';
import AiAnswerTypingMessage from './AiAnswerTypingMessage';
import utils from '../../utils';

const ChatAiMessageList = ({ chatMessageList, scrollRef, scrollToBottom }) => {
  // const { t, language } = useLocale();

  return (
    <Box flex={1} overflowY="auto">
      <Stack
        w="100%"
        h="100%"
        overflow="hidden"
        alignSelf="stretch"
        flexDirection="column"
        alignItems="center"
        bg="linear-gradient(0deg, rgba(0, 0, 0, 0.24) 0%, rgba(0, 0, 0, 0.24) 100%), linear-gradient(180deg, rgba(24, 52, 128, 0) 0%, rgba(23.88, 91.61, 182.04, 0.16) 26%, rgba(55.41, 145.33, 255, 0.20) 64%, rgba(23.67, 51.59, 128.37, 0.20) 100%)"
      >
        <VStack
          ref={scrollRef}
          w="100%"
          h="100%"
          px="24px"
          overflowY="auto"
          position="relative"
          className="no-scroll"
          flexDirection="column-reverse"
          pb={3}
        >
          {chatMessageList.map((data, index) => {
            const {
              chatMessageId,
              content,
              createdTime,
              messageUserName,
              type,
              isOwn,
              receiverUserConfirm,
              randomUniqueId,
              functionName,
              functionResult,
              isContact,
            } = data;

            const key = crypto.randomUUID();

            // 이전 메시지 가져오기
            const prevMessage = chatMessageList[index - 1];
            const nextMessage = chatMessageList[index + 1];
            const isSameGroup = prevMessage?.isOwn === isOwn;

            const isNewDate = (() => {
              if (!nextMessage) return true;

              const currDate = new Date(createdTime);
              const nextDate = new Date(nextMessage.createdTime);

              return (
                currDate.getFullYear() !== nextDate.getFullYear() ||
                currDate.getMonth() !== nextDate.getMonth() ||
                currDate.getDate() !== nextDate.getDate()
              );
            })();

            // 이전 메시지와 시간 비교 (일/시/분)
            const showInfo = (() => {
              if (!isSameGroup) return true; // 그룹 다르면 무조건 표시

              if (!prevMessage) return true; // 첫 메시지일 경우

              const prevDate = new Date(prevMessage.createdTime);
              const currDate = new Date(createdTime);

              return !(
                prevDate.getFullYear() === currDate.getFullYear() &&
                prevDate.getMonth() === currDate.getMonth() &&
                prevDate.getDate() === currDate.getDate() &&
                prevDate.getHours() === currDate.getHours() &&
                prevDate.getMinutes() === currDate.getMinutes()
              );
            })();

            if (type === 1) {
              return (
                <Box key={key} w="100%">
                  {isNewDate && (
                    <Box
                      w="100%"
                      py={2}
                      textAlign="center"
                      color="gray.400"
                      fontWeight="bold"
                    >
                      {/*
                      {utils.parseDateByLangForChat({
                        dateString: createdTime,
                        language: language,
                      })}
                      */}
                    </Box>
                  )}

                  <MessageForm
                    text={content}
                    dateStr={showInfo ? createdTime : undefined}
                    isAnswer={isOwn !== 1}
                    messageUserName={showInfo ? messageUserName : undefined}
                    isRead={showInfo ? receiverUserConfirm === 2 : undefined}
                  />
                </Box>
              );
            }

            if (type === 9) {
              return (
                <Box key={chatMessageId} w="100%">
                  {isNewDate && (
                    <Box
                      w="100%"
                      py={2}
                      textAlign="center"
                      color="gray.400"
                      fontWeight="bold"
                    >
                      {/*
                      {utils.parseDateByLangForChat({
                        dateString: createdTime,
                        language: language,
                      })}
                     */}
                    </Box>
                  )}

                  <AiAnswerTypingMessage
                    text={content}
                    messageId={chatMessageId}
                    dateStr={showInfo ? createdTime : undefined}
                    messageUserName={showInfo ? messageUserName : undefined}
                    isRead={showInfo ? receiverUserConfirm === 2 : undefined}
                    randomKey={randomUniqueId || ''}
                    scrollToBottom={scrollToBottom}
                    functionName={functionName}
                    functionResult={functionResult}
                    isContact={isContact}
                  />
                </Box>
              );
            }

            return (
              <Box key={chatMessageId} w="100%">
                {isNewDate && (
                  <Box
                    w="100%"
                    py={2}
                    textAlign="center"
                    color="gray.400"
                    fontWeight="bold"
                  >
                    {/*
                    {utils.parseDateByLangForChat({
                      dateString: createdTime,
                      language: language,
                    })}
                    */}
                  </Box>
                )}

                <AiAnswerTypingMessage
                  text={content}
                  messageId={chatMessageId}
                  dateStr={showInfo ? createdTime : undefined}
                  messageUserName={showInfo ? messageUserName : undefined}
                  isRead={showInfo ? receiverUserConfirm === 2 : undefined}
                  randomKey={randomUniqueId || ''}
                  scrollToBottom={scrollToBottom}
                  functionName={functionName}
                  functionResult={functionResult}
                  isContact={isContact}
                  setShouldSkipEffect={setShouldSkipEffect}
                />
              </Box>
            );
          })}
        </VStack>
      </Stack>
    </Box>
  );
};

export default React.memo(ChatAiMessageList);
