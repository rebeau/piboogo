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
  VStack,
  Input,
} from '@chakra-ui/react';

import { useCallback, useState } from 'react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import ContentBR from '@/components/custom/ContentBR';
import useModal from '@/hooks/useModal';
import sellerUserApi from '@/services/sellerUserApi';
import { SUCCESS } from '@/constants/errorCode';
import useDevice from '@/hooks/useDevice';

const PasswordModal = (props) => {
  const { isMobile, clampW } = useDevice();
  const { localeText } = useLocale();
  const { openModal } = useModal();

  const { onClose } = props;

  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPwCheck, setNewPwCheck] = useState('');

  const handleFinally = useCallback(() => {
    if (onClose) {
      onClose();
    }
  });

  const handlePatchUserInfo = useCallback(async () => {
    if (!oldPw) {
      setTimeout(() => {
        openModal({
          text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_PASSWORD),
        });
      });
      return;
    }
    if (!newPw) {
      setTimeout(() => {
        openModal({
          text: localeText(LANGUAGES.ACC.SU.PH_NEW_PASSWORD),
        });
      });
      return;
    }
    if (!newPwCheck) {
      setTimeout(() => {
        openModal({
          text: localeText(LANGUAGES.ACC.SU.PH_CONFIRM_NEW_PASSWORD),
        });
      });
      return;
    }
    if (newPw !== newPwCheck) {
      setTimeout(() => {
        openModal({
          text: localeText(LANGUAGES.ACC.SU.NO_PATCH_CONFIRM_NEW_PASSWORD),
        });
      });
      return;
    }
    const param = {
      oldPw,
      newPw,
    };
    const result = await sellerUserApi.patchSeller(param);
    if (result?.errorCode === SUCCESS) {
      setTimeout(() => {
        openModal({
          text: result.message,
          onAgree: () => {
            onClose(true);
          },
        });
      });
    } else {
      setTimeout(() => {
        openModal({ text: result.message });
      });
    }
  });

  return isMobile(true) ? (
    <Modal isOpen={true} onClose={handleFinally} size="sm">
      <ModalOverlay bg={'rgba(0, 0, 0, 0.60)'} />
      <ModalContent alignSelf={'center'} borderRadius={0} maxW={null}>
        <ModalBody
          h={'100%'}
          position={'relative'}
          py={'1.5rem'}
          px={clampW(1, 2.5)}
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
                  {localeText(LANGUAGES.ACC.SU.MODIFY_YOUR_PASSWORD)}
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

          <Box w={'100%'}>
            <VStack spacing={'1.25rem'}>
              <Box w={'100%'}>
                <VStack spacing={'0.25rem'} alignItems={'flex-start'}>
                  <Box alignContent={'center'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.EXISTING_PASSWORD)}
                    </Text>
                  </Box>
                  <Box w={'100%'} h={'3rem'}>
                    <Input
                      placeholder={localeText(
                        LANGUAGES.ACC.SU.PH_EXISTING_PASSWORD,
                      )}
                      _placeholder={{
                        color: '#A7C3D2',
                      }}
                      minW={'auto'}
                      type={'password'}
                      autoComplete={'off'}
                      w={'100%'}
                      h={'100%'}
                      color={'#485766'}
                      border={'1px solid #9CADBE'}
                      px={'1rem'}
                      py={'0.75rem'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                      value={oldPw}
                      onChange={(e) => {
                        setOldPw(e.target.value);
                      }}
                    />
                  </Box>
                </VStack>
              </Box>

              <Box w={'100%'}>
                <VStack spacing={'0.25rem'} alignItems={'flex-start'}>
                  <Box w={'12.5rem'} minW={'12.5rem'} alignContent={'center'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.NEW_PASSWORD)}
                    </Text>
                  </Box>
                  <Box w={'100%'} h={'3rem'}>
                    <Input
                      placeholder={localeText(LANGUAGES.ACC.SU.PH_NEW_PASSWORD)}
                      _placeholder={{
                        color: '#A7C3D2',
                      }}
                      minW={'auto'}
                      w={'100%'}
                      h={'100%'}
                      type={'password'}
                      autoComplete={'off'}
                      color={'#485766'}
                      border={'1px solid #9CADBE'}
                      px={'1rem'}
                      py={'0.75rem'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                      value={newPw}
                      onChange={(e) => {
                        setNewPw(e.target.value);
                      }}
                    />
                  </Box>
                </VStack>
              </Box>

              <Box w={'100%'}>
                <VStack spacing={'0.25rem'} alignItems={'flex-start'}>
                  <Box w={'12.5rem'} minW={'12.5rem'} alignContent={'center'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.CONFIRM_NEW_PASSWORD)}
                    </Text>
                  </Box>
                  <Box w={'100%'} h={'3rem'}>
                    <Input
                      placeholder={localeText(LANGUAGES.ACC.SU.PH_NEW_PASSWORD)}
                      _placeholder={{
                        color: '#A7C3D2',
                      }}
                      minW={'auto'}
                      w={'100%'}
                      h={'100%'}
                      type={'password'}
                      autoComplete={'off'}
                      color={'#485766'}
                      border={'1px solid #9CADBE'}
                      px={'1rem'}
                      py={'0.75rem'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                      value={newPwCheck}
                      onChange={(e) => {
                        setNewPwCheck(e.target.value);
                      }}
                    />
                  </Box>
                </VStack>
              </Box>

              <Box w={'100%'} h={'3rem'}>
                <Button
                  onClick={() => {
                    handlePatchUserInfo();
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
                    {localeText(LANGUAGES.COMMON.SAVE)}
                  </Text>
                </Button>
              </Box>
            </VStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  ) : (
    <Modal isOpen={true} onClose={handleFinally} size="md">
      <ModalOverlay bg={'rgba(0, 0, 0, 0.60)'} />
      <ModalContent
        alignSelf={'center'}
        borderRadius={0}
        w={'60rem'}
        h={'26.75rem'}
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
                  {localeText(LANGUAGES.ACC.SU.MODIFY_YOUR_PASSWORD)}
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

          <Box w={'55rem'}>
            <VStack spacing={'1.25rem'}>
              <Box w={'100%'}>
                <HStack spacing={'2rem'}>
                  <Box
                    w={'12.5rem'}
                    minW={'12.5rem'}
                    h={'3rem'}
                    alignContent={'center'}
                  >
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.EXISTING_PASSWORD)}
                    </Text>
                  </Box>
                  <Box w={'100%'} h={'3rem'}>
                    <Input
                      placeholder={localeText(
                        LANGUAGES.ACC.SU.PH_EXISTING_PASSWORD,
                      )}
                      _placeholder={{
                        color: '#A7C3D2',
                      }}
                      minW={'auto'}
                      type={'password'}
                      autoComplete={'off'}
                      w={'100%'}
                      h={'100%'}
                      color={'#485766'}
                      border={'1px solid #9CADBE'}
                      px={'1rem'}
                      py={'0.75rem'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                      value={oldPw}
                      onChange={(e) => {
                        setOldPw(e.target.value);
                      }}
                    />
                  </Box>
                </HStack>
              </Box>
              <Box w={'100%'}>
                <HStack spacing={'2rem'}>
                  <Box
                    w={'12.5rem'}
                    minW={'12.5rem'}
                    h={'3rem'}
                    alignContent={'center'}
                  >
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.NEW_PASSWORD)}
                    </Text>
                  </Box>
                  <Box w={'100%'} h={'3rem'}>
                    <Input
                      placeholder={localeText(LANGUAGES.ACC.SU.PH_NEW_PASSWORD)}
                      _placeholder={{
                        color: '#A7C3D2',
                      }}
                      minW={'auto'}
                      w={'100%'}
                      h={'100%'}
                      type={'password'}
                      autoComplete={'off'}
                      color={'#485766'}
                      border={'1px solid #9CADBE'}
                      px={'1rem'}
                      py={'0.75rem'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                      value={newPw}
                      onChange={(e) => {
                        setNewPw(e.target.value);
                      }}
                    />
                  </Box>
                </HStack>
              </Box>
              <Box w={'100%'}>
                <HStack spacing={'2rem'}>
                  <Box
                    w={'12.5rem'}
                    minW={'12.5rem'}
                    h={'3rem'}
                    alignContent={'center'}
                  >
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.CONFIRM_NEW_PASSWORD)}
                    </Text>
                  </Box>
                  <Box w={'100%'} h={'3rem'}>
                    <Input
                      placeholder={localeText(LANGUAGES.ACC.SU.PH_NEW_PASSWORD)}
                      _placeholder={{
                        color: '#A7C3D2',
                      }}
                      minW={'auto'}
                      w={'100%'}
                      h={'100%'}
                      type={'password'}
                      autoComplete={'off'}
                      color={'#485766'}
                      border={'1px solid #9CADBE'}
                      px={'1rem'}
                      py={'0.75rem'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                      value={newPwCheck}
                      onChange={(e) => {
                        setNewPwCheck(e.target.value);
                      }}
                    />
                  </Box>
                </HStack>
              </Box>
            </VStack>
          </Box>

          <ContentBR h={'3.75rem'} />

          <Box w={'100%'} h={'4rem'}>
            <Button
              onClick={() => {
                handlePatchUserInfo();
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
                {localeText(LANGUAGES.COMMON.SAVE)}
              </Text>
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PasswordModal;
