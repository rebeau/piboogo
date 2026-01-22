'use client';

import {
  Box,
  VStack,
  Center,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { DefaultButton } from '@/components';
import useModal from '@/hooks/useModal';

import utils from '@/utils';

const CustomModal = () => {
  const { modal, closeModal } = useModal();
  const { isOpen, onClose } = modal;
  const {
    onAgree,
    onAgreeText = '확인',
    onCancel,
    onCancelText = '넘어가기',
  } = modal;
  const { text } = modal;
  const { status, step } = modal;

  const handleFinaly = () => {
    closeModal();
  };

  const handleOnClick = () => {
    if (onAgree) {
      onAgree();
    }
  };

  const handleOnClickCancel = () => {
    if (onCancel) {
      onCancel();
    }
    handleFinaly();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleFinaly}
      // size="lg"
    >
      <ModalOverlay />
      <ModalContent
        alignSelf="center"
        w={'100%'}
        maxW={'87.5%'}
        h={'100%'}
        maxH={'40.3vh'}
        px={'6.25%'}
      >
        <ModalBody
          w={'100%'}
          h={'100%'}
          position={'relative'}
          pt={'12.3%'}
          pb={'7.4%'}
          px={0}
        >
          <VStack h={'100%'} justifyContent={'space-between'} spacing={0}>
            <Center w={'100%'}>
              <Box
                minW={{
                  xl: '100px',
                  lg: '90px',
                  md: '80px',
                  sm: '70px',
                  xs: '60px',
                }}
                w={'28.57%'}
              ></Box>
            </Center>

            <Box>
              <Center h={'100%'}>
                <Text
                  fontWeight={700}
                  textAlign={'center'}
                  color={'#000'}
                  fontSize={80}
                >
                  {setText()}
                </Text>
              </Center>
            </Box>

            <Box w={'100%'} h={'19%'}>
              <Center w={'100%'} h={'100%'}>
                <HStack w={'100%'} h={'100%'} justifyContent="center">
                  <Box
                    w={
                      status === 2 && utils.isNotEmpty(onCancel)
                        ? '50%'
                        : '100%'
                    }
                    h={'100%'}
                  >
                    <DefaultButton
                      onClick={handleOnClick}
                      theme="info"
                      size="sm"
                      text={onAgreeText}
                      fontSize={30}
                    />
                  </Box>
                  {status === 2 && utils.isNotEmpty(onCancel) && (
                    <Box w={'50%'} h={'100%'}>
                      <DefaultButton
                        onClick={handleOnClickCancel}
                        theme="info"
                        outline
                        fontColor={'#75B125'}
                        size="sm"
                        text={'넘어가기'}
                        fontSize={30}
                      />
                    </Box>
                  )}
                </HStack>
              </Center>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
