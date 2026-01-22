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
  Image as ChakraImage,
  Flex,
  Center,
  Button,
} from '@chakra-ui/react';

import { useCallback, useEffect, useState } from 'react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import CustomIcon from '@/components/icon/CustomIcon';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import ContentBR from '@/components/common/ContentBR';
import utils from '@/utils';
import couponApi from '@/services/couponApi';
import { SUCCESS } from '@/constants/errorCode';
import useModal from '@/hooks/useModal';

const CouponDetailModal = (props) => {
  const { isOpen, onClose } = props;
  const { selectedCoupon, handleGetListCouponAgent } = props;
  const { lang, localeText } = useLocale();
  const { openModal } = useModal();

  const [contents, setContents] = useState('');
  const [period, setPeriod] = useState('');

  useEffect(() => {
    const startDate = selectedCoupon?.startDate;
    const endDate = selectedCoupon?.endDate;
    const type = selectedCoupon?.type;
    const discountAmount = selectedCoupon?.discountAmount || 0;

    if (startDate && endDate) {
      const period = `${utils.parseDateByCountryCode(startDate, lang)} - ${utils.parseDateByCountryCode(endDate, lang)}`;
      setPeriod(period);
    } else {
      const period = localeText(LANGUAGES.COMMON.UNLIMITED);
      setPeriod(period);
    }
    if (type === 1) {
      const contents = `${localeText(
        LANGUAGES.INFO_MSG.COUPON_MSG_TYPE1,
      ).replace('@PRICE@', discountAmount)}`;
      setContents(contents);
    } else if (type === 2) {
      const contents = `${localeText(
        LANGUAGES.INFO_MSG.COUPON_MSG_TYPE2,
      ).replace('@PRICE@', utils.parseDallar(discountAmount))}`;
      setContents(contents);
    }
  }, [selectedCoupon]);

  const handleFinally = useCallback(() => {
    if (onClose) {
      onClose();
    }
  });

  const handleModifyCoupon = () => {
    onClose(true);
  };

  const handleDeleteCoupon = async () => {
    const param = {
      couponIds: [selectedCoupon.couponId],
    };
    const result = await couponApi.deleteCoupon(param);
    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result.message,
        onAgree: () => {
          handleGetListCouponAgent();
          onClose();
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
        h={'42.5rem'}
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
                      {localeText(LANGUAGES.COUPON.COUPON_DETAILS)}
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
                w={'55rem'}
                h={'27.25rem'}
                display={'inline-flex'}
                flexDirection={'column'}
                justifyContent={'flex-start'}
                alignItems={'flex-start'}
                gap={'1.25rem'}
              >
                <Flex
                  w={'full'}
                  justifyContent={'flex-start'}
                  alignItems={'center'}
                  gap={'2rem'}
                >
                  <Text
                    w={'12.5rem'}
                    color={'#7895B2'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {localeText(LANGUAGES.COUPON.TITLE)}
                  </Text>
                  <Text
                    color={'#485766'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {selectedCoupon.name}
                  </Text>
                </Flex>
                <Flex
                  w={'full'}
                  justifyContent={'flex-start'}
                  alignItems={'center'}
                  gap={'2rem'}
                >
                  <Text
                    w={'12.5rem'}
                    color={'#7895B2'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {localeText(LANGUAGES.COUPON.BENEFITS)}
                  </Text>
                  <Text
                    color={'#485766'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {contents}
                  </Text>
                </Flex>
                <Flex
                  w={'full'}
                  justifyContent={'flex-start'}
                  alignItems={'center'}
                  gap={'2rem'}
                >
                  <Text
                    w={'12.5rem'}
                    color={'#7895B2'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {localeText(LANGUAGES.COUPON.REDEMPTION_CONDITIONS)}
                  </Text>
                  <Text
                    color={'#485766'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {utils.parseDallar(selectedCoupon.minimumPurchaseAmount)}{' '}
                    {localeText(LANGUAGES.COUPON.MINIMUM_PURCHASE)}
                  </Text>
                </Flex>
                <Flex
                  w={'full'}
                  justifyContent={'flex-start'}
                  alignItems={'center'}
                  gap={'2rem'}
                >
                  <Text
                    w={'12.5rem'}
                    color={'#7895B2'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {localeText(LANGUAGES.COUPON.PERIOD)}
                  </Text>
                  <Text
                    color={'#485766'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {period}
                  </Text>
                </Flex>
                <Flex
                  w={'full'}
                  justifyContent={'flex-start'}
                  alignItems={'flex-start'}
                  gap={'2rem'}
                >
                  <Text
                    w={'12.5rem'}
                    color={'#7895B2'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {localeText(LANGUAGES.COUPON.COUPON_IMAGE)}
                  </Text>
                  <Center
                    maxW={'15rem'}
                    position={'relative'}
                    background={'#F9F7F1'}
                  >
                    <ChakraImage
                      fallback={<DefaultSkeleton />}
                      w={'100%'}
                      h={'100%'}
                      src={selectedCoupon.imageS3Url}
                    />
                  </Center>
                </Flex>
              </Box>
            </VStack>

            <ContentBR h={'3.75rem'} />

            <Box w={'100%'}>
              <HStack spacing={'1.25rem'}>
                <Box w={'26.875rem'} h={'4rem'}>
                  <Button
                    onClick={() => {
                      handleModifyCoupon();
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
                      fontSize={'1rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(LANGUAGES.COMMON.MODIFY)}
                    </Text>
                  </Button>
                </Box>
                <Box w={'26.875rem'} h={'4rem'}>
                  <Button
                    onClick={() => {
                      openModal({
                        type: 'confirm',
                        text: localeText(LANGUAGES.INFO_MSG.DELETE_COUPON),
                        onAgree: () => {
                          handleDeleteCoupon();
                        },
                      });
                    }}
                    bg={'transparent'}
                    px={'1.25rem'}
                    py={'0.63rem'}
                    borderRadius={'0.25rem'}
                    border={'1px solid #B20000'}
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
                      color={'#B20000'}
                      fontSize={'1.25rem'}
                      fontWeight={400}
                      lineHeight={'2.25rem'}
                    >
                      {localeText(LANGUAGES.COMMON.DELETE)}
                    </Text>
                  </Button>
                </Box>
              </HStack>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CouponDetailModal;
