'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import ChatAiMessageList from '../../components/chat/ChatAiMessageList';
import ChatInput from '../../components/chat/ChatInput';
import useLocale from '../../hooks/useLocale';
import { LANGUAGES } from '../../constants/lang';
import useModal from '../../hooks/useModal';
import chatBootApi from '../../services/chatBootApi';
import { nanoid } from 'nanoid';
import { Box, Flex } from '@chakra-ui/react';

const ChatAiForm = () => {
  const [chatMessageList, setChatMessageList] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [chatValue, setChatValue] = useState('');

  const { lang, localeText } = useLocale();
  const { openModal } = useModal();

  const scrollRef = useRef(null);
  const sseRef = useRef(null); // SSE 인스턴스 유지
  const retryCountRef = useRef(0);
  const MAX_RETRY_COUNT = 3;

  const currentSessionId = useRef(null);

  const isWelcome = useRef(false);

  // 채팅방 초기화
  useEffect(() => {
    if (isWelcome.current) return;
    isWelcome.current = true;

    const resMessage = {
      chatMessageId: 0,
      createdTime: new Date(),
      messageUserType: 4,
      messageUserId: 4,
      messageUserName: 'CHAT BOT',
      type: 9,
      content: localeText(LANGUAGES.CHAT.AI_WELCOME_MESSAGE),
      isOwn: 2,
    };
    setChatMessageList([resMessage]);
  }, [localeText]);

  // 스크롤 관리
  const scrollToBottom = useCallback(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    el.scrollTop = el.scrollHeight;
  }, []);

  // 메시지 전송 + SSE 연결
  const enqueueMessage = useCallback(
    async (value) => {
      if (!value?.trim()) return;

      const userMessageId = nanoid(8);
      const botMessageId = nanoid(8);

      setChatMessageList((prev) => [
        {
          chatMessageId: botMessageId,
          createdTime: new Date(),
          messageUserType: 4,
          messageUserId: 4,
          messageUserName: 'CHAT BOT',
          type: 9,
          content: localeText(LANGUAGES.CHAT.AI_LOADING_MESSAGE),
          isOwn: 2,
        },
        {
          chatMessageId: userMessageId,
          createdTime: new Date(),
          messageUserType: 999,
          messageUserId: 999,
          messageUserName: 'AI',
          type: 1,
          content: value,
          isOwn: 1,
        },
        ...prev,
      ]);

      // 기존 SSE 종료
      if (sseRef.current) {
        sseRef.current.close();
        sseRef.current = null;
      }

      let streamingBuffer = '';

      try {
        // SSE 연결
        const param = {
          input: value,
          lang: lang,
        };
        if (currentSessionId.current) {
          param.sessionId = currentSessionId.current;
        }
        sseRef.current = chatBootApi.getChatbotIntentSee(param);

        sseRef.current.onopen = () => {
          console.log('# SSE 연결 완료');
        };

        sseRef.current.addEventListener('chatbot_intent_start', (event) => {
          setIsAiTyping(true);

          try {
            const startData = JSON.parse(event.data);
            if (startData.sessionId) {
              currentSessionId.current = startData.sessionId;
            }
          } catch (e) {
            // addDebugMessage('시작 이벤트 JSON 파싱 실패');
          }
        });

        sseRef.current.addEventListener('chatbot_intent_data', (event) => {
          try {
            const data = JSON.parse(event.data);
            streamingBuffer += data;
          } catch {
            streamingBuffer += (streamingBuffer ? '\n' : '') + event.data;
          }

          setChatMessageList((prev) =>
            prev.map((msg) =>
              msg.chatMessageId === botMessageId
                ? { ...msg, content: streamingBuffer, isContact: true }
                : msg,
            ),
          );
        });

        sseRef.current.addEventListener('chatbot_intent_complete', () => {
          setIsAiTyping(false);
          if (!streamingBuffer) {
            setChatMessageList((prev) =>
              prev.map((msg) =>
                msg.chatMessageId === botMessageId
                  ? {
                      ...msg,
                      content: localeText(LANGUAGES.CHAT.AI_EMPTY_MESSAGE),
                      isContact: false,
                    }
                  : msg,
              ),
            );
          }
          console.log('# SSE 연결 종료');
          sseRef.current?.close();
          sseRef.current = null;
        });

        sseRef.current.onerror = (err) => {
          console.error('# SSE 에러', err);
          setIsAiTyping(false);
          sseRef.current?.close();
          sseRef.current = null;

          if (retryCountRef.current < MAX_RETRY_COUNT) {
            retryCountRef.current += 1;
            setTimeout(() => enqueueMessage(value), 3000);
          } else {
            setChatMessageList((prev) =>
              prev.map((msg) =>
                msg.chatMessageId === botMessageId
                  ? {
                      ...msg,
                      content: localeText(LANGUAGES.CHAT.AI_FAIL_MESSAGE),
                    }
                  : msg,
              ),
            );
          }
        };
      } catch (err) {
        console.log('SSE 연결 실패', err);
      }
    },
    [localeText],
  );

  return (
    <Box w="100vw" h="100vh">
      <Flex direction="column" h="100%">
        <ChatAiMessageList
          chatMessageList={chatMessageList}
          scrollRef={scrollRef}
          scrollToBottom={scrollToBottom}
        />
        <ChatInput
          chatValue={chatValue}
          setChatValue={setChatValue}
          enqueueMessage={enqueueMessage}
        />
      </Flex>
    </Box>
  );
};

export default ChatAiForm;
