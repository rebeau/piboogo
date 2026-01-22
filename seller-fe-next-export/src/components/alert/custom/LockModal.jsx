'use client';

import { CustomIcon } from '@/components';
import {
  Box,
  VStack,
  Center,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  HStack,
  Image,
  Text,
  Button,
  Input,
} from '@chakra-ui/react';

import utils from '@/utils';
import { useCallback, useEffect, useState } from 'react';
import LockImage from '@public/svgs/bg/lock-image.svg';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import ContentBR from '@/components/custom/ContentBR';

const LockModal = (props) => {
  const { localeText } = useLocale();
  const [email, setEmail] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const { onClose } = props;

  useEffect(() => {
    if (email && utils.checkEmail(email)) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, [email]);
  const {
    isOpen: isOpenLock,
    onOpen: onOpenLock,
    onClose: onCloseLock,
  } = useDisclosure();

  const handleFinaly = useCallback(() => {
    if (onClose) {
      onClose();
    }
  });

  return (
    <Modal isOpen={true} onClose={handleFinaly} size="md">
      <ModalOverlay bg={'rgba(0, 0, 0, 0.20)'} />
      <ModalContent
        alignSelf={'center'}
        borderRadius={0}
        w={'65rem'}
        maxW={null}
      >
        <ModalBody w={'100%'} h={'100%'} position={'relative'} p={0}>
          <Box w={'100%'}>
            <HStack spacing={0} w={'100%'}>
              <Box w={'32.5rem'} h={'32.5rem'} position={'relative'}>
                <Text
                  position={'absolute'}
                  top={'2.46rem'}
                  left={'2.75rem'}
                  color={'#FFF'}
                  fontSize={'2rem'}
                  fontWeight={400}
                  lineHeight={'2rem'}
                >
                  Piboogo
                </Text>
              </Box>
              <Box
                w={'32.5rem'}
                h={'32.5rem'}
                pt={'1.5rem'}
                pb={'2.5rem'}
                px={'2.5rem'}
              >
                <VStack spacing={'1rem'}>
                  <Box w={'100%'}>
                    <HStack justifyContent={'flex-end'}>
                      <Box
                        w={'2rem'}
                        h={'2rem'}
                        cursor={'pointer'}
                        onClick={() => {
                          console.log('asc');
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
                  <Box w={'100%'}>
                    <VStack spacing={'1.25rem'}>
                      <Text
                        color={'#485766'}
                        fontSize={'1.75rem'}
                        fontWeight={400}
                        lineHeight={'2.7475rem'}
                      >
                        Lock wholesale prices
                      </Text>
                      <Text
                        color={'#485766'}
                        fontSize={'1.125rem'}
                        fontWeight={400}
                        lineHeight={'1.96875rem'}
                        textAlign={'center'}
                      >
                        We ve got a unique beauty brand on board
                        <br />
                        Sign up for free!
                      </Text>
                    </VStack>
                  </Box>
                  <Center w={'100%'}>
                    <Box w={'25rem'}>
                      <Box h={'5.5rem'}>
                        <VStack alignItems={'flex-start'} spacing={'0.25rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.ACC.EMAIL)}
                          </Text>
                          <Input
                            type={'text'}
                            placeholder={localeText(LANGUAGES.ACC.PH_EMAIL_USE)}
                            _placeholder={{
                              color: '#485766',
                              fontSize: '1rem',
                              fontWeight: 400,
                              lineHeight: '1.75rem',
                            }}
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                            value={email || ''}
                            w={'100%'}
                            h={'3.5rem'}
                            p={'0.75rem'}
                            bg={'#FFF'}
                            borderRadius="0.25rem"
                            border={'1px solid #9CADBE'}
                          />
                        </VStack>
                      </Box>

                      <ContentBR h={'1.5rem'} />

                      <Box w={'100%'}>
                        <VStack spacing={'0.75rem'}>
                          <Box w={'100%'} h={'4rem'}>
                            <Button
                              onClick={() => {}}
                              isDisabled={!isChecked}
                              py={'0.88rem'}
                              px={'2rem'}
                              borderRadius={'0.25rem'}
                              bg={'#7895B2'}
                              h={'100%'}
                              w={'100%'}
                              _disabled={{
                                bg: '#D9E7EC',
                              }}
                              _hover={{ opacity: isChecked ? 1 : 0.8 }}
                            >
                              <Text
                                color={'#FFF'}
                                fontSize={'1.25rem'}
                                fontWeight={400}
                                lineHeight={'2.25rem'}
                              >
                                {localeText(LANGUAGES.NEXT)}
                              </Text>
                            </Button>
                          </Box>

                          <Center w={'100%'}>
                            <Text
                              color={'#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              or
                            </Text>
                          </Center>

                          <Center w={'100%'}>
                            <Text
                              color={'#556A7E'}
                              fontSize={'1.25rem'}
                              fontWeight={400}
                              lineHeight={'2.25rem'}
                            >
                              {localeText(LANGUAGES.ACC.LOGIN.LOGIN)}
                            </Text>
                          </Center>
                        </VStack>
                      </Box>
                    </Box>
                  </Center>
                </VStack>
              </Box>
            </HStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LockModal;
