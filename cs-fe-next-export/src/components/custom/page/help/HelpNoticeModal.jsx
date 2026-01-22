'use client';

import {
  Box,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  HStack,
  Text,
  Button,
} from '@chakra-ui/react';

import { useCallback, useEffect, useState } from 'react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import CustomIcon from '@/components/icon/CustomIcon';
import ContentBR from '@/components/common/ContentBR';
import { SUCCESS } from '@/constants/errorCode';
import noticeApi from '@/services/noticeApi';
import utils from '@/utils';
import QuillViewer from '@/components/input/editor/QuillViewer';

const HelpNoticeModal = (props) => {
  const { lang, localeText } = useLocale();

  const { isOpen, onClose, item } = props;

  const [noticeId, setNoticeId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [createdAt, setCreatedAt] = useState(null);

  useEffect(() => {
    if (item?.noticeId) {
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
      setNoticeId(data.noticeId);
      setTitle(data.title);
      setContent(data.content);
      setCreatedAt(data.createdAt);
    }
  };

  const handleFinally = useCallback((isModify = false) => {
    if (onClose) {
      if (isModify) {
        onClose({
          noticeId,
        });
      } else {
        onClose();
      }
    }
  });

  return (
    <Modal isOpen={isOpen} onClose={handleFinally} size="md">
      <ModalOverlay bg={'rgba(0, 0, 0, 0.60)'} />
      <ModalContent
        alignSelf={'center'}
        borderRadius={0}
        w={'60rem'}
        h={'32rem'}
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
                    {item.title}
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
              w={'55rem'}
              h={'24.5rem'}
              display="inline-flex"
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              gap={'2.5rem'}
            >
              <Box
                w="full"
                display="inline-flex"
                justifyContent="flex-start"
                alignItems="center"
                gap={'1.25rem'}
              >
                <Text
                  w={'8.125rem'}
                  color="#7895B2"
                  fontSize={'0.9375rem'}
                  fontFamily="Poppins"
                  fontWeight="400"
                  lineHeight={'1.5rem'}
                  wordWrap="break-word"
                >
                  {localeText(LANGUAGES.HELP.REGISTRATION_DATE)}
                </Text>
                <Text
                  textAlign="center"
                  color="#485766"
                  fontSize={'0.9375rem'}
                  fontFamily="Poppins"
                  fontWeight="400"
                  lineHeight={'1.5rem'}
                  wordWrap="break-word"
                >
                  {utils.parseDateByCountryCode(createdAt, lang)}
                </Text>
              </Box>

              <Box w={'100%'} h={'14rem'} overflowY={'auto'}>
                <QuillViewer html={content || ''} />
              </Box>

              <Box w={'100%'} h={'4rem'}>
                <Button
                  onClick={() => {
                    handleFinally(true);
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
                    {localeText(LANGUAGES.COMMON.MODIFY)}
                  </Text>
                </Button>
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default HelpNoticeModal;
