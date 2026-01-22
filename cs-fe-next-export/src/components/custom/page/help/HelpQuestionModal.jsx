'use client';

import {
  Box,
  VStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  HStack,
  Text,
  Button,
  Input,
  Textarea,
} from '@chakra-ui/react';

import { useCallback, useEffect, useState } from 'react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import CustomIcon from '@/components/icon/CustomIcon';
import ContentBR from '@/components/common/ContentBR';
import fnqApi from '@/services/fnqApi';
import { SUCCESS } from '@/constants/errorCode';
import useModal from '@/hooks/useModal';

const HelpQuestionModal = (props) => {
  const { openModal } = useModal();
  const { localeText } = useLocale();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const { isModify = false, isOpen, onClose, item } = props;

  useEffect(() => {
    if (item) {
      setQuestion(item.question || '');
      setAnswer(item.answer || '');
    }
  }, [item]);

  const handleFinally = useCallback(() => {
    if (onClose) {
      onClose();
    }
  });

  const handleModify = async () => {
    if (!question) {
      openModal({ text: localeText(LANGUAGES.INFO_MSG.NO_QUESTION) });
      return;
    }
    if (!answer) {
      openModal({ text: localeText(LANGUAGES.INFO_MSG.NO_ANSWER) });
      return;
    }
    const param = {
      fnqId: item.fnqId,
      question,
      answer,
    };
    const result = await fnqApi.patchFnq(param);
    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result.message,
        onAgree: () => {
          onClose(true);
        },
      });
    } else {
      openModal({ text: result.message });
    }
  };

  const handleAdd = async () => {
    if (!question) {
      openModal({ text: localeText(LANGUAGES.INFO_MSG.NO_QUESTION) });
      return;
    }
    if (!answer) {
      openModal({ text: localeText(LANGUAGES.INFO_MSG.NO_ANSWER) });
      return;
    }
    const param = {
      question,
      answer,
    };

    const result = await fnqApi.postFnq(param);
    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result.message,
        onAgree: () => {
          onClose(true);
        },
      });
    } else {
      openModal({ text: result.message });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleFinally} size="md">
      <ModalOverlay bg={'rgba(0, 0, 0, 0.60)'} />
      <ModalContent
        alignSelf={'center'}
        borderRadius={0}
        w={'60rem'}
        h={'37.75rem'}
        maxW={null}
      >
        <ModalBody
          w={'100%'}
          h={'100%'}
          position={'relative'}
          pt={'1.5rem'}
          // pb={'2.5rem'}
          pb={0}
          px={'2.5rem'}
        >
          <Box w={'100%'}>
            <VStack spacing={'1.5rem'}>
              <Box w={'100%'}>
                <HStack justifyContent={'space-between'}>
                  <Box>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={400}
                      lineHeight={'1.96875rem'}
                    >
                      {isModify
                        ? localeText(LANGUAGES.HELP.MODIFY_A_QUESTION)
                        : localeText(LANGUAGES.HELP.ADD_A_QUESTION)}
                    </Text>
                  </Box>
                  <Box
                    w={'2rem'}
                    h={'2rem'}
                    cursor={'pointer'}
                    onClick={() => {
                      handleFinally();
                    }}
                  >
                    <CustomIcon
                      w={'100%'}
                      h={'100%'}
                      name={'close'}
                      color={'#7895B2'}
                    />
                  </Box>
                </HStack>
              </Box>

              <Box
                w={'55rem'}
                h={'22.5rem'}
                display="inline-flex"
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                gap={'2.5rem'}
              >
                <Box
                  w="full"
                  h={'3rem'}
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  gap={'0.75rem'}
                >
                  <Box
                    w="full"
                    display="inline-flex"
                    justifyContent="flex-start"
                    alignItems="center"
                    gap={'2rem'}
                  >
                    <Text
                      w={'12.5rem'}
                      color="#7895B2"
                      fontSize={'0.9375rem'}
                      fontFamily="Poppins"
                      fontWeight="400"
                      lineHeight={'1.5rem'}
                      wordWrap="break-word"
                    >
                      {localeText(LANGUAGES.HELP.QUESTION)}
                    </Text>
                    <Box
                      flex="1 1 0"
                      display="inline-flex"
                      flexDirection="column"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      gap={'0.25rem'}
                    >
                      <Input
                        h={'100%'}
                        placeholder={localeText(LANGUAGES.HELP.PH_ENTER_TITLE)}
                        _placeholder={{
                          fontWeight: 400,
                          fontSize: '0.9375rem',
                          color: '#7895B2',
                        }}
                        border={'1px solid #9CADBE'}
                        px={'1rem'}
                        py={'0.75rem'}
                        color={'#556A7E'}
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                        value={question || ''}
                        onChange={(e) => {
                          setQuestion(e.target.value);
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                <Box
                  w="full"
                  h={'17rem'}
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  gap={'1.25rem'}
                >
                  <Text
                    w="full"
                    color="#485766"
                    fontSize={'1.25rem'}
                    fontFamily="Poppins"
                    fontWeight="500"
                    lineHeight={'2.25rem'}
                    wordWrap="break-word"
                  >
                    {localeText(LANGUAGES.HELP.WRITE_YOUR_ANSWER)}
                  </Text>
                  <Box w="full" h={'13.5rem'}>
                    <Textarea
                      className={'no-scroll'}
                      onChange={(e) => {
                        setAnswer(e.target.value);
                      }}
                      border={'1px solid #9CADBE'}
                      value={answer}
                      py={'0.88rem'}
                      px={'1rem'}
                      w={'100%'}
                      h={'100%'}
                      resize={'none'}
                      placeholder={localeText(
                        LANGUAGES.HELP.PH_ENTER_YOUR_CONTENT,
                      )}
                    ></Textarea>
                  </Box>
                </Box>
              </Box>
            </VStack>

            <ContentBR h={'3.75rem'} />

            <Box w={'100%'} h={'4rem'}>
              <Button
                onClick={() => {
                  if (isModify) {
                    handleModify();
                  } else {
                    handleAdd();
                  }
                }}
                bg={'#7895B2'}
                px={'1.25rem'}
                py={'0.63rem'}
                borderRadius={'0.25rem'}
                h={'100%'}
                w={'100%'}
                _disabled={{
                  bg: '#7895B290',
                }}
                _hover={{
                  opacity: 0.8,
                }}
              >
                <Text
                  color={'#FFF'}
                  fontSize={'1.25rem'}
                  fontWeight={400}
                  lineHeight={'2.25rem'}
                >
                  {isModify
                    ? localeText(LANGUAGES.COMMON.MODIFY)
                    : localeText(LANGUAGES.COMMON.ADD)}
                </Text>
              </Button>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default HelpQuestionModal;
