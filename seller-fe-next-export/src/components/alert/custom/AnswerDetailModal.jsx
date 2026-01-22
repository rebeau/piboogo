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
  Textarea,
} from '@chakra-ui/react';

import { useCallback } from 'react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import ContentBR from '@/components/custom/ContentBR';
import utils from '@/utils';
import useDevice from '@/hooks/useDevice';

const AnswerDetailModal = (props) => {
  const { isMobile } = useDevice();
  const { localeText } = useLocale();

  const { isOpen, onClose, selectedItem } = props;

  const handleFinaly = useCallback(() => {
    if (onClose) {
      onClose();
    }
  });

  return (
    <Modal isOpen={isOpen} onClose={handleFinaly} size="md">
      <ModalOverlay bg={'rgba(0, 0, 0, 0.20)'} />
      <ModalContent
        alignSelf={'center'}
        borderRadius={0}
        w={utils.isMobile(true) ? '100%' : '60rem'}
        h={isMobile(true) ? 'auto' : '20rem'}
        maxW={null}
      >
        <ModalBody
          w={'100%'}
          h={'100%'}
          position={'relative'}
          py={'1.5rem'}
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
                  {localeText(LANGUAGES.INQUIRIES.INQUIRIES)}
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

          <Box h={isMobile(true) && '15rem'} maxH="13rem" overflowY={'auto'}>
            <Textarea
              w={'100%'}
              h="100%"
              readOnly
              resize={'none'}
              border={0}
              value={selectedItem?.question}
            ></Textarea>
          </Box>
          <ContentBR h={'1.5rem'} />

          {selectedItem?.answer && (
            <Box>
              <Text
                color={'#485766'}
                fontSize={'1.125rem'}
                fontWeight={400}
                lineHeight={'1.96875rem'}
              >
                {localeText(LANGUAGES.COMMON.ANSWER)}
              </Text>
            </Box>
          )}

          {selectedItem?.answer && (
            <Box h={isMobile(true) && '15rem'} maxH="13rem" overflowY={'auto'}>
              <Textarea
                w={'100%'}
                h="100%"
                readOnly
                resize={'none'}
                border={0}
                value={selectedItem?.answer}
              ></Textarea>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AnswerDetailModal;
