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
  VStack,
  RadioGroup,
  Radio,
  Input,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';

import { useCallback, useEffect, useState } from 'react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import ContentBR from '@/components/common/ContentBR';
import CustomIcon from '@/components/icon/CustomIcon';
import rewardApi from '@/services/rewardApi';
import { SUCCESS } from '@/constants/errorCode';
import useModal from '@/hooks/useModal';
import utils from '@/utils';

const RewardModal = (props) => {
  const { localeText } = useLocale();
  const { openModal } = useModal();
  const { isOpen, onClose, buyerUserIds = [], rewardCoin } = props;

  const [type, setType] = useState(1);
  const [coin, setCoin] = useState(null);
  const [reason, setReason] = useState(null);

  const [tempReward, setTempReward] = useState(0);

  const handleFinally = useCallback(() => {
    if (onClose) {
      onClose();
    }
  });

  const handleConfirm = useCallback(async () => {
    if (!(coin > 0)) {
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.MORE_THAN_ZERO_COINS),
      });
      return;
    }

    let buyerUserObj = buyerUserIds.map((buyerUserId) => {
      const data = {
        buyerUserId: buyerUserId,
        type: type,
        coin: type === 1 ? coin : -coin,
      };
      if (reason) {
        data.reason = reason;
      }
      return data;
    });

    const result = await rewardApi.postReward(buyerUserObj);
    openModal({ text: result.message });
    if (result?.errorCode === SUCCESS) {
      onClose(true);
    }
  });

  useEffect(() => {
    let reward = type === 1 ? rewardCoin + coin : rewardCoin - coin;
    if (reward < 0) {
      reward = 0;
    }
    setTempReward(reward);
  }, [type, coin]);

  return (
    <Modal isOpen={isOpen} onClose={handleFinally} size="md">
      <ModalOverlay bg={'rgba(0, 0, 0, 0.60)'} />
      <ModalContent
        alignSelf={'center'}
        borderRadius={0}
        w={'60rem'}
        h={'31.5rem'}
        maxW={null}
      >
        <ModalBody
          w={'100%'}
          h={'100%'}
          position={'relative'}
          pt={'1.5rem'}
          pb={'2.5rem'}
          px={'2.5rem'}
        >
          <VStack spacing={0} h={'100%'} justifyContent={'space-between'}>
            <Box w={'100%'}>
              <VStack spacing={0}>
                <Box w={'100%'}>
                  <HStack justifyContent={'space-between'}>
                    <Box>
                      <Text
                        color={'#485766'}
                        fontSize={'1.125rem'}
                        fontWeight={400}
                        lineHeight={'1.96875rem'}
                      >
                        {localeText(LANGUAGES.BUYER.MODIFY_REWARD_COINS)}
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

                <Box>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <RadioGroup
                        w={'100%'}
                        value={type}
                        onChange={(value) => {
                          setType(Number(value));
                        }}
                      >
                        <HStack spacing={'1.5rem'}>
                          <Box>
                            <HStack alignItems={'center'} spacing={'0.5rem'}>
                              <Radio value={1} />
                              <Box w={'3.4rem'}>
                                <Text
                                  color={'#485766'}
                                  fontSize={'0.9375rem'}
                                  fontWeight={400}
                                  lineHeight={'1.5rem'}
                                >
                                  {localeText(LANGUAGES.BUYER.CREDITS)}
                                </Text>
                              </Box>
                            </HStack>
                          </Box>
                          <Box>
                            <HStack alignItems={'center'} spacing={'0.5rem'}>
                              <Radio value={2} />
                              <Box w={'3.4rem'}>
                                <Text
                                  color={'#485766'}
                                  fontSize={'0.9375rem'}
                                  fontWeight={400}
                                  lineHeight={'1.5rem'}
                                >
                                  {localeText(LANGUAGES.BUYER.DEBITS)}
                                </Text>
                              </Box>
                            </HStack>
                          </Box>
                        </HStack>
                      </RadioGroup>
                    </Box>

                    <Box w={'100%'}>
                      <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                        <Box w={'12.5rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.BUYER.REWARD_COIN)}
                          </Text>
                        </Box>
                        <Box w={'40.5rem'} h={'3rem'}>
                          <NumberInput
                            value={coin || 0}
                            onChange={(value) => {
                              let numericValue = Number(value);
                              if (isNaN(numericValue)) return;
                              if (type === 1) {
                                numericValue = Math.max(numericValue, 0);
                              } else if (type === 2) {
                                if (buyerUserIds.length === 1) {
                                  numericValue = Math.min(
                                    numericValue,
                                    rewardCoin,
                                  );
                                }
                              }
                              setCoin(numericValue);
                            }}
                            min={type === 1 ? 0 : undefined}
                            max={type === 2 ? rewardCoin : undefined}
                            clampValueOnBlur
                          >
                            <NumberInputField
                              h={'100%'}
                              placeholder={localeText(
                                LANGUAGES.BUYER.PH_ENTER_REWARD_COINS,
                              )}
                              _placeholder={{
                                fontWeight: 400,
                                fontSize: '0.9375rem',
                                color: '#7895B2',
                              }}
                              color={'#485766'}
                              border={'1px solid #9CADBE'}
                              borderRadius={'0.25rem'}
                              px={'1rem'}
                              py={'0.75rem'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                            />
                          </NumberInput>
                        </Box>
                      </HStack>
                    </Box>

                    <Box w={'100%'}>
                      <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                        <Box w={'12.5rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.BUYER.REASON)}
                          </Text>
                        </Box>
                        <Box w={'40.5rem'} h={'3rem'}>
                          <Input
                            h={'100%'}
                            placeholder={localeText(
                              LANGUAGES.BUYER.PH_ENTER_REASON,
                            )}
                            _placeholder={{
                              fontWeight: 400,
                              fontSize: '0.9375rem',
                              color: '#7895B2',
                            }}
                            color={'#485766'}
                            border={'1px solid #9CADBE'}
                            px={'1rem'}
                            py={'0.75rem'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            value={reason || ''}
                            onChange={(e) => {
                              setReason(e.target.value);
                            }}
                          />
                        </Box>
                      </HStack>
                    </Box>
                  </VStack>
                </Box>

                <ContentBR h={'1.25rem'} />

                {buyerUserIds.length === 1 && (
                  <Box w={'55rem'} bg={'#90aec412'} py={'0.75rem'} px={'1rem'}>
                    <VStack spacing={'0.75rem'}>
                      <Box w={'100%'}>
                        <HStack
                          justifyContent={'space-between'}
                          alignItems={'center'}
                        >
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.BUYER.OWNED_COINS)}
                          </Text>
                          <Text
                            color={'#485766'}
                            fontSize={'1rem'}
                            fontWeight={500}
                            lineHeight={'1.75rem'}
                          >
                            {`${utils.parseAmount(rewardCoin)} ${localeText(LANGUAGES.BUYER.COINS)}`}
                          </Text>
                        </HStack>
                      </Box>
                      <Box w={'100%'}>
                        <HStack
                          justifyContent={'space-between'}
                          alignItems={'center'}
                        >
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.BUYER.EXPECTED_COINS)}
                          </Text>
                          <Text
                            color={'#940808'}
                            fontSize={'1rem'}
                            fontWeight={500}
                            lineHeight={'1.75rem'}
                          >
                            {`${utils.parseAmount(tempReward)} ${localeText(LANGUAGES.BUYER.COINS)}`}
                          </Text>
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>
                )}
              </VStack>
            </Box>

            <Box w={'100%'}>
              <VStack spacing={0}>
                <ContentBR h={'3.75rem'} />

                <Box w={'100%'} h={'4rem'}>
                  <Button
                    onClick={() => {
                      if (buyerUserIds.length === 1) {
                        handleConfirm();
                      } else {
                        openModal({
                          type: 'confirm',
                          text: localeText(LANGUAGES.INFO_MSG.MULTIPLE_USERS),
                          onAgree: () => {
                            handleConfirm();
                          },
                        });
                      }
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
                      fontSize={'1.25rem'}
                      fontWeight={400}
                      lineHeight={'2.25rem'}
                    >
                      {localeText(LANGUAGES.COMMON.CONFIRM)}
                    </Text>
                  </Button>
                </Box>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RewardModal;
