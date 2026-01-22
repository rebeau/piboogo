'use client';

import { GText, DefaultButton } from '@/components';
import useModal from '@/hooks/useModal';
import utils from '@/utils';
import { deviceInfoState } from '@/stores/environmentRecoil';
import { useRecoilValue } from 'recoil';
import {
  Box,
  Center,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';

const ConfirmModal = () => {
  const deviceInfo = useRecoilValue(deviceInfoState);
  const { modal, closeModal } = useModal();
  const { localeText } = useLocale();

  const isMobile = deviceInfo.isMobile;
  const isWide = deviceInfo.isWide;

  const getWidth = () => {
    if (isWide) {
      return isMobile ? '700px' : '500px';
    } else {
      return '500px';
    }
  };

  return (
    <Modal isOpen={modal.isOpen} onClose={closeModal} size="md">
      <ModalOverlay />
      <ModalContent
        alignSelf="center"
        w={'100%'}
        maxW={getWidth()}
        borderRadius={'0.25rem'}
        px={5}
        mx={5}
      >
        {modal.isClose === true && <ModalCloseButton w="30px" h="30px" />}
        <ModalBody w={'100%'} h={'100%'} position={'relative'} py={'5%'} px={0}>
          <VStack
            w={'100%'}
            h={'100%'}
            justifyContent={'space-between'}
            spacing={2}
          >
            <Box w={'100%'} minH={'100px'} h={isMobile ? '20vh' : '120px'}>
              {utils.isNotEmpty(modal.text) && (
                <VStack spacing={1} h={'100%'} justifyContent={'center'}>
                  {utils.parseTextLine(modal.text).map((splitText, index) => {
                    let textOption = null;
                    if (modal.textOptions.length > 0) {
                      if (modal.textOptions[index]) {
                        textOption = modal.textOptions[index];
                      }
                    }
                    const boxKey = `boxKey_${index}`;
                    return (
                      <Box key={boxKey}>
                        <Text
                          fontWeight={
                            textOption?.fontWeight ? textOption.fontWeight : 700
                          }
                          fontSize={
                            textOption?.fontSize
                              ? textOption.fontSize
                              : '1.5rem'
                          }
                          textAlign={
                            textOption?.textAlign
                              ? textOption.textAlign
                              : 'center'
                          }
                          color={textOption?.color ? textOption.color : '#000'}
                        >
                          {splitText}
                        </Text>
                      </Box>
                    );
                  })}
                </VStack>
              )}
            </Box>
            <Box w={'100%'} minH={'50px'} h={isMobile ? '7vh' : '3rem'}>
              <Center w="100%" h={'100%'}>
                <HStack w="100%" h="100%" justifyContent="center">
                  <Box w="50%" h="100%">
                    <DefaultButton
                      borderRadius={'0.25rem'}
                      onClick={modal.onAgree}
                      theme={'primary'}
                      size="sm"
                      text={modal.onAgreeText}
                      fontSize={'1.5rem'}
                    />
                  </Box>
                  <Box w="50%" h="100%">
                    <DefaultButton
                      borderRadius={'0.25rem'}
                      onClick={closeModal}
                      theme={'primary'}
                      outline
                      fontColor={'#7895B2'}
                      size="sm"
                      text={localeText(LANGUAGES.COMMON.CANCEL)}
                      fontSize={'1.5rem'}
                    />
                  </Box>
                </HStack>
              </Center>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
