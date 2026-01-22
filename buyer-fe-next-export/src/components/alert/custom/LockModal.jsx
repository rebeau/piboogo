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
  HStack,
  Image as ChakraImage,
  Text,
  Button,
  Input,
  Flex,
} from '@chakra-ui/react';

import utils from '@/utils';
import { useCallback, useEffect, useState } from 'react';
import LockImage from '@public/svgs/bg/lock-image.svg';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import ContentBR from '@/components/custom/ContentBR';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import buyerApi from '@/services/buyerUserApi';
import { SUCCESS } from '@/constants/errorCode';
import useModal from '@/hooks/useModal';
import useMove from '@/hooks/useMove';
import useDevice from '@/hooks/useDevice';

const LockModal = (props) => {
  const { isMobile } = useDevice();
  const { moveSignUp, moveLogin } = useMove();
  const { localeText } = useLocale();
  const { openModal } = useModal();
  const [email, setEmail] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const { isOpen, onClose } = props;

  useEffect(() => {
    if (email && utils.checkEmail(email)) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, [email]);

  const handleFinally = useCallback(() => {
    if (onClose) {
      onClose();
    }
  });

  const handleCheckId = async () => {
    const param = {
      email: email,
    };
    const result = await buyerApi.getBuyerCheckId(param);
    if (result?.errorCode === SUCCESS) {
      openModal({
        type: 'confirm',
        text: `${result.message}\n${localeText(LANGUAGES.INFO_MSG.WOULD_MEMBERSHIP)}`,
        onAgree: () => {
          onClose();
          moveSignUp(email);
        },
      });
    } else {
      setTimeout(() => {
        openModal({
          text: result.message,
        });
      });
    }
  };

  const handleMoveLogin = () => {
    onClose();
    moveLogin();
  };

  return isMobile(true) ? (
    <Modal isOpen={isOpen} onClose={handleFinally} size={'full'}>
      <ModalOverlay bg={'#00000099'} />
      <ModalContent alignSelf={'center'} borderRadius={0} maxW={null}>
        <ModalBody
          w={'100%'}
          h={'100vh'}
          position={'relative'}
          // px={'1rem'}
          // py={'1.5rem'}
          p={0}
        >
          <VStack spacing={'1rem'} h={'100vh'} px={'1rem'} py={'1.5rem'}>
            <Box w={'100%'}>
              <HStack justifyContent={'flex-end'}>
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

            <Box w={'100%'} h={'100%'}>
              <Flex
                w={'100%'}
                h={'100%'}
                alignSelf={'stretch'}
                flexDirection={'column'}
                justifyContent={'space-between'}
                // alignItems={'flex-end'}
                gap={'0.625rem'}
                display={'flex'}
              >
                <Box
                  flex={1}
                  w={'100%'}
                  h={'100%'}
                  maxH={'40vh'}
                  position={'relative'}
                  overflow={'hidden'}
                >
                  <Text
                    zIndex={1}
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
                  <Center maxW={'100%'}>
                    <ChakraImage
                      fallback={<DefaultSkeleton />}
                      objectFit={'cover'}
                      w={'100%'}
                      h={'100%'}
                      src={LockImage.src}
                    />
                  </Center>
                </Box>

                <Box w={'100%'}>
                  <Box w={'100%'}>
                    <VStack spacing={'1.25rem'}>
                      <Text
                        color={'#485766'}
                        fontSize={'clamp(1.5rem, 4vw, 1.75rem)'}
                        fontWeight={400}
                        lineHeight={'clamp(2.475rem, 3vh, 2.7475rem)'}
                      >
                        {localeText(LANGUAGES.INFO_MSG.LOCK_WHOLESALE_PRICES)}
                      </Text>
                      <Text
                        color={'#485766'}
                        fontSize={'clamp(1rem, 3vw, 1.125rem)'}
                        fontWeight={400}
                        lineHeight={'clamp(1.75rem, 3vh, 1.96875rem)'}
                        textAlign={'center'}
                        whiteSpace={'pre-wrap'}
                      >
                        {localeText(LANGUAGES.INFO_MSG.M_UNIQUE_BEAUTY_BRAND)}
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
                          <Box w={'100%'} h={'3rem'}>
                            <Button
                              onClick={handleCheckId}
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
                                {localeText(LANGUAGES.ACC.SU.SEND_EMAIL)}
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
                            <Box
                              cursor={'pointer'}
                              _hover={{
                                borderBottom: '1px solid #AEBDCA',
                              }}
                              onClick={handleMoveLogin}
                            >
                              <Text
                                color={'#556A7E'}
                                fontSize={'clamp(1rem, 2vw, 1.25rem)'}
                                fontWeight={400}
                                lineHeight={'clamp(1.75rem, 2vh, 2.25rem)'}
                              >
                                {localeText(LANGUAGES.ACC.LOGIN.LOGIN)}
                              </Text>
                            </Box>
                          </Center>
                        </VStack>
                      </Box>
                    </Box>
                  </Center>
                </Box>
              </Flex>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  ) : (
    <Modal isOpen={isOpen} onClose={handleFinally} size="md">
      <ModalOverlay bg={'#00000099'} />
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
                  zIndex={1}
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
                <Center h={'100%'} maxW={'100%'} maxH={'720'}>
                  <ChakraImage
                    fallback={<DefaultSkeleton />}
                    objectFit={'cover'}
                    w={'100%'}
                    h={'100%'}
                    src={LockImage.src}
                  />
                </Center>
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
                  <Box w={'100%'}>
                    <VStack spacing={'1.25rem'}>
                      <Text
                        color={'#485766'}
                        fontSize={'1.75rem'}
                        fontWeight={400}
                        lineHeight={'2.7475rem'}
                      >
                        {localeText(LANGUAGES.INFO_MSG.LOCK_WHOLESALE_PRICES)}
                      </Text>
                      <Text
                        color={'#485766'}
                        fontSize={'1.125rem'}
                        fontWeight={400}
                        lineHeight={'1.96875rem'}
                        textAlign={'center'}
                        whiteSpace={'pre-wrap'}
                      >
                        {localeText(LANGUAGES.INFO_MSG.UNIQUE_BEAUTY_BRAND)}
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
                              onClick={handleCheckId}
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
                                {localeText(LANGUAGES.ACC.SU.SEND_EMAIL)}
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
                            <Box
                              cursor={'pointer'}
                              _hover={{
                                borderBottom: '1px solid #AEBDCA',
                              }}
                              onClick={handleMoveLogin}
                            >
                              <Text
                                color={'#556A7E'}
                                fontSize={'1.25rem'}
                                fontWeight={400}
                                lineHeight={'2.25rem'}
                              >
                                {localeText(LANGUAGES.ACC.LOGIN.LOGIN)}
                              </Text>
                            </Box>
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
