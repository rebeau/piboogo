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
import dynamic from 'next/dynamic';
import useModal from '@/hooks/useModal';
import noticeApi from '@/services/noticeApi';
import { SUCCESS } from '@/constants/errorCode';
const CustomEditor = dynamic(
  () => import('@/components/input/editor/CustomEditor'),
  {
    ssr: false,
  },
);

const HelpNoticeEditModal = (props) => {
  const { openModal } = useModal();
  const { localeText } = useLocale();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const { isModify = false, isOpen, onClose, item } = props;

  useEffect(() => {
    if (isModify && item?.noticeId) {
      handleGetNotice();
    }
  }, [item]);

  const handleGetNotice = async () => {
    const param = {
      noticeId: item.noticeId,
    };

    const result = await noticeApi.getNotice(param);
    if (result?.errorCode === SUCCESS) {
      const data = result.data;
      setTitle(data.title);
      setContent(data.content);
    }
  };

  const handleFinally = useCallback(() => {
    if (onClose) {
      onClose();
    }
  });

  const handleModify = async () => {
    if (!title) {
      openModal({ text: localeText(LANGUAGES.INFO_MSG.ENTER_THE_TITLE) });
      return;
    }
    if (!content) {
      openModal({ text: localeText(LANGUAGES.INFO_MSG.ENTER_THE_CONTENT) });
      return;
    }

    const param = {
      noticeId: item.noticeId,
      title: title,
      content: content,
    };

    const result = await noticeApi.patchNotice(param);
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
    if (!title) {
      openModal({ text: localeText(LANGUAGES.INFO_MSG.ENTER_THE_TITLE) });
      return;
    }
    if (!content) {
      openModal({ text: localeText(LANGUAGES.INFO_MSG.ENTER_THE_CONTENT) });
      return;
    }

    const param = {
      title: title,
      content: content,
    };

    const result = await noticeApi.postNotice(param);
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
        h={'49.25rem'}
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
                      ? localeText(LANGUAGES.HELP.MODIFY_AN_ANNOUNCEMENT)
                      : localeText(LANGUAGES.HELP.ADD_AN_ANNOUNCEMENT)}
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

            <ContentBR h={'1.5rem'} />

            <Box
              w={'100%'}
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
                  {localeText(LANGUAGES.HELP.TITLE)}
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
                    value={title || ''}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <ContentBR h={'2.5rem'} />

            <Box w={'100%'}>
              <Box
                w="full"
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
                  {localeText(LANGUAGES.HELP.WRITE_YOUR_content)}
                </Text>
                <Box w="full" h={'25.75rem'}>
                  <CustomEditor info={content} setInfo={setContent} />
                </Box>
              </Box>
            </Box>

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

export default HelpNoticeEditModal;
