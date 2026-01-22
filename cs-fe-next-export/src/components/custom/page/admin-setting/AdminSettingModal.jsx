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
  Select,
} from '@chakra-ui/react';

import { useCallback, useEffect, useState } from 'react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import CustomIcon from '@/components/icon/CustomIcon';
import ContentBR from '@/components/common/ContentBR';
import csUserApi from '@/services/csUserApi';
import useModal from '@/hooks/useModal';
import utils from '@/utils';
import { SUCCESS } from '@/constants/errorCode';

const AdminSettingModal = (props) => {
  const { openModal } = useModal();
  const { localeText } = useLocale();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [permission, setPermission] = useState(1);

  const { isModify = false, isOpen, onClose, item } = props;

  useEffect(() => {
    if (item) {
      // 1:대표 CS 사용자, 2:일반 CS 사용자
      console.log(item);
      setName(item.name || '');
      setEmail(item.id || '');
      setPassword(item.password || '');
      setPermission(Number(item.permission));
    }
  }, [item]);

  const handleFinally = useCallback(() => {
    if (onClose) {
      onClose();
    }
  });

  const handleAction = () => {
    if (isModify) {
      handleModifyAdminUser();
    } else {
      handlePostAdminUser();
    }
  };
  const handleModifyAdminUser = async () => {
    if (!name) {
      return openModal({
        text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_NAME),
      });
    }
    if (!email) {
      return openModal({
        text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_EMAIL),
      });
    }
    if (!utils.checkEmail(email)) {
      return openModal({
        text: localeText(LANGUAGES.INFO_MSG.NOT_MATCH_EMAIL),
      });
    }

    const param = {
      csUserId: item.csUserId,
      name: name,
      id: email,
      role: permission,
    };
    if (password) {
      param.pw = password;
    }

    const result = await csUserApi.patchCsUser(param);
    openModal({ text: result.message });
    if (result?.errorCode === SUCCESS) {
      onClose(true);
    }
  };

  const handlePostAdminUser = async () => {
    if (!name) {
      return openModal({
        text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_NAME),
      });
    }
    if (!email) {
      return openModal({
        text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_EMAIL),
      });
    }
    if (!utils.checkEmail(email)) {
      return openModal({
        text: localeText(LANGUAGES.INFO_MSG.NOT_MATCH_EMAIL),
      });
    }
    if (!password) {
      return openModal({
        text: localeText(LANGUAGES.ADMIN_SETTING.PH_PASSWORD),
      });
    }

    const param = {
      name: name,
      id: email,
      pw: password,
      role: permission,
    };
    const result = await csUserApi.postCsUser(param);
    openModal({ text: result.message });
    if (result?.errorCode === SUCCESS) {
      onClose(true);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleFinally} size="md">
      <ModalOverlay bg={'rgba(0, 0, 0, 0.60)'} />
      <ModalContent
        alignSelf={'center'}
        borderRadius={0}
        w={'60rem'}
        h={'31rem'}
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
                        ? localeText(LANGUAGES.ADMIN_SETTING.EDIT_ADMIN)
                        : localeText(LANGUAGES.ADMIN_SETTING.ADD_AN_ADMIN)}
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
                w={'100%'}
                display="inline-flex"
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                gap={'1.25rem'}
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
                    >
                      {localeText(LANGUAGES.ADMIN_SETTING.NAME)}
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
                        placeholder={localeText(
                          LANGUAGES.ADMIN_SETTING.PH_NAME,
                        )}
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
                        value={name || ''}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
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
                    >
                      {localeText(LANGUAGES.ACC.EMAIL)}
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
                        placeholder={localeText(
                          LANGUAGES.ADMIN_SETTING.PH_EMAIL,
                        )}
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
                        value={email || ''}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
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
                    >
                      {localeText(LANGUAGES.ACC.PASSWORD)}
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
                        placeholder={localeText(
                          LANGUAGES.ADMIN_SETTING.PH_PASSWORD,
                        )}
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
                        value={password || ''}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
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
                    >
                      {localeText(LANGUAGES.ADMIN_SETTING.PERMISSION)}
                    </Text>
                    <Box
                      flex="1 1 0"
                      display="inline-flex"
                      flexDirection="column"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      gap={'0.25rem'}
                    >
                      <Select
                        value={permission}
                        onChange={(e) => {
                          setPermission(e.target.value);
                        }}
                        py={'0.75rem'}
                        pl={'1rem'}
                        p={0}
                        w={'100%'}
                        h={'3rem'}
                        bg={'#FFF'}
                        borderRadius={'0.25rem'}
                        border={'1px solid #9CADBE'}
                      >
                        <option value={1}>
                          {localeText(LANGUAGES.ADMIN_SETTING.SUPER_ADMIN)}
                        </option>
                        <option value={2}>
                          {localeText(LANGUAGES.ADMIN_SETTING.ADMIN)}
                        </option>
                      </Select>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </VStack>

            <ContentBR h={'3.75rem'} />

            <Box w={'100%'} h={'4rem'}>
              <Button
                onClick={() => {
                  handleAction();
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
                    ? localeText(LANGUAGES.COMMON.SAVE)
                    : localeText(LANGUAGES.ADMIN_SETTING.ADD_ADMIN)}
                </Text>
              </Button>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AdminSettingModal;
