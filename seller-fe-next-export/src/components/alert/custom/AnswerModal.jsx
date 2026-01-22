'use client';

import { CustomIcon } from '@/components';
import {
  Box,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  HStack,
  Text,
  Button,
  Textarea,
} from '@chakra-ui/react';

import { useCallback, useEffect, useState } from 'react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import ContentBR from '@/components/custom/ContentBR';
import useModal from '@/hooks/useModal';
import utils from '@/utils';

const AnswerModal = (props) => {
  const { openModal } = useModal();
  const { localeText } = useLocale();

  const { isOpen, onClose, callBack, selectedItem, isModify = false } = props;

  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (isModify) {
      setAnswer(selectedItem.answer);
    }
  }, [isModify]);

  const handleFinaly = useCallback(() => {
    if (onClose) {
      onClose();
    }
  });

  const handleAnswer = useCallback(async () => {
    if (utils.isEmpty(answer)) {
      setTimeout(() => {
        openModal({
          text: localeText(LANGUAGES.INFO_MSG.ENTER_ANSWER),
        });
      });
      return;
    }
    if (callBack) {
      callBack(selectedItem, answer);
    }
  });

  return (
    <Modal isOpen={isOpen} onClose={handleFinaly} size="md">
      <ModalOverlay bg={'rgba(0, 0, 0, 0.20)'} />
      <ModalContent
        alignSelf={'center'}
        borderRadius={0}
        w={utils.isMobile(true) ? '100%' : '60rem'}
        h={'28.75rem'}
        maxW={null}
      >
        <ModalBody
          w={'100%'}
          h={'100%'}
          position={'relative'}
          pt={'1.5rem'}
          pb={0}
          px={'2.5rem'}
        >
          <Box w={'100%'}>
            <HStack justifyContent={'space-between'}>
              <Box>
                <Text
                  color={'#485766'}
                  fontSize={'1.125rem'}
                  fontWeight={400}
                  lineHeight={'1.96875rem'}
                >
                  {localeText(LANGUAGES.COMMON.ANSWER)}
                  {isModify && localeText(LANGUAGES.COMMON.MODIFY)}
                </Text>
              </Box>
              <Box
                w={'2rem'}
                h={'2rem'}
                cursor={'pointer'}
                onClick={() => {
                  handleFinaly();
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
          <ContentBR h={'1.5rem'} />
          <Box h={'13.5rem'}>
            <Textarea
              w={'100%'}
              h={'100%'}
              resize={'none'}
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
              }}
            ></Textarea>
          </Box>
          <ContentBR h={'3.75rem'} />
          <Box w={'100%'} h={'4rem'}>
            <Button
              onClick={() => {
                handleAnswer();
              }}
              px={'1.25rem'}
              py={'0.63rem'}
              borderRadius={'0.25rem'}
              bg={'#7895B2'}
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
                fontSize={'1rem'}
                fontWeight={400}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.COMMON.ANSWER)}
                {isModify && localeText(LANGUAGES.COMMON.MODIFY)}
              </Text>
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AnswerModal;
