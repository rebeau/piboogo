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
import { SUCCESS } from '@/constants/errorCode';
import holdingCouponApi from '@/services/holdingCouponApi';
import useModal from '@/hooks/useModal';

const CouponIssueModal = (props) => {
  const { lang, localeText } = useLocale();
  const { openModal } = useModal();

  const { isOpen, onClose, selectedCoupon, selectedItems } = props;

  const [name, setName] = useState();
  const [couponId, setCouponId] = useState();
  const [imageS3Url, setImageS3Url] = useState();

  const [minimumPurchaseAmount, setMinimumPurchaseAmount] = useState('');
  const [contents, setContents] = useState('');
  const [period, setPeriod] = useState('');

  useEffect(() => {
    if (selectedCoupon) {
      const name = selectedCoupon?.name;
      const type = selectedCoupon?.type;
      const createdAt = selectedCoupon?.createdAt;
      const couponId = selectedCoupon?.couponId;
      const discountAmount = selectedCoupon?.discountAmount;
      const startDate = selectedCoupon?.startDate;
      const endDate = selectedCoupon?.endDate;
      const minimumPurchaseAmount = selectedCoupon?.minimumPurchaseAmount || 0;
      const recentIssuedTime = selectedCoupon?.recentIssuedTime;
      const imageS3Url = selectedCoupon?.imageS3Url;

      setName(name);
      setCouponId(couponId);
      setMinimumPurchaseAmount(minimumPurchaseAmount);
      if (startDate && endDate) {
        const period = `${utils.parseDateByCountryCode(startDate, lang)} - ${utils.parseDateByCountryCode(selectedCoupon.endDate, lang)}`;
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
      setImageS3Url(imageS3Url);
    }

    // COUPON_MSG_TYPE1
    // COUPON_MSG_TYPE2
    /*
    "name": "신규가입 ( 첫날 가입자 ) ",
    "type": 2,
    "createdAt": "2025-06-09T16:09:37",
    "couponId": 5,
    "discountAmount": 10,
    "startDate": null,
    "endDate": null,
    "minimumPurchaseAmount": null,
    "recentIssuedTime": null,
    "imageS3Url": null
    */
  }, [selectedCoupon]);

  const handleFinally = useCallback(() => {
    if (onClose) {
      onClose();
    }
  });

  const handleConfirm = () => {
    const selectedCoupon = Array.from(selectedItems);
    if (selectedCoupon.length === 0) {
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.SELECT_COUPON_TARGET),
      });
      return;
    }
    openModal({
      type: 'confirm',
      text: localeText(LANGUAGES.INFO_MSG.ISSUE_COUPON),
      onAgree: () => {
        handlePostHoldingCoupon();
      },
    });
  };

  const handlePostHoldingCoupon = async () => {
    const param = {
      couponId: couponId,
      buyerUserIds: Array.from(selectedItems),
    };
    const result = await holdingCouponApi.postHoldingCoupon(param);
    openModal({
      text: result.message,
      onAgree: () => {
        if (result?.errorCode === SUCCESS) {
          onClose(true);
        }
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleFinally} size="md">
      <ModalOverlay bg={'rgba(0, 0, 0, 0.60)'} />
      <ModalContent
        alignSelf={'center'}
        borderRadius={0}
        w={'60rem'}
        h={'42rem'}
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
                      {localeText(LANGUAGES.COUPON.ISSUE_COUPON)}
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
                h={'26.25rem'}
                pt={'3.75rem'}
                pb={'3.75rem'}
                display={'inline-flex'}
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                gap={'0.625rem'}
              >
                <Box
                  w={'42.5rem'}
                  h={'18.75rem'}
                  p={'2.5rem'}
                  border={'1px #73829D solid'}
                  display={'flex'}
                  flexDirection={'column'}
                  justifyContent={'flex-start'}
                  alignItems={'flex-start'}
                  gap={'1.25rem'}
                >
                  <Flex
                    w={'full'}
                    justifyContent={'space-between'}
                    alignItems={'flex-start'}
                    display={'inline-flex'}
                  >
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontFamily={'Poppins'}
                      fontWeight={400}
                      lineHeight={'1.96875rem'}
                      wordWrap={'break-word'}
                    >
                      {name}
                    </Text>
                    {/*
                    <Text
                      color={'#7895B2'}
                      fontSize={'1.125rem'}
                      fontFamily={'Poppins'}
                      fontWeight={500}
                      lineHeight={'1.96875rem'}
                      wordWrap={'break-word'}
                    >
                      {localeText(LANGUAGES.STATUS.AVAILABLE)}
                    </Text>
                    */}
                  </Flex>
                  <Box w={'full'} h={0} border={'1px #AEBDCA solid'} />
                  <Flex
                    w={'full'}
                    justifyContent={'space-between'}
                    alignItems={'flex-start'}
                    display={'inline-flex'}
                  >
                    <Box
                      display={'inline-flex'}
                      flexDirection={'column'}
                      justifyContent={'flex-start'}
                      alignItems={'flex-start'}
                      gap={'1.25rem'}
                    >
                      <Text
                        color={'#485766'}
                        fontSize={'1.5rem'}
                        fontFamily={'Poppins'}
                        fontWeight={500}
                        lineHeight={'2.475rem'}
                        wordWrap={'break-word'}
                      >
                        {contents}
                      </Text>
                      <Text
                        color={'#66809C'}
                        fontSize={'1rem'}
                        fontFamily={'Poppins'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                        wordWrap={'break-word'}
                      >
                        {period}
                      </Text>
                      <Text
                        color={'#66809C'}
                        fontSize={'1rem'}
                        fontFamily={'Poppins'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                        wordWrap={'break-word'}
                      >
                        {localeText(LANGUAGES.COUPON.REDEMPTION_TERMS)}
                        <br />
                        {utils.parseDallar(minimumPurchaseAmount)}{' '}
                        {localeText(LANGUAGES.COUPON.MINIMUM_PURCHASE)}
                      </Text>
                    </Box>
                    {imageS3Url && (
                      <Center
                        w={'10.25rem'}
                        h={'10.25rem'}
                        position={'relative'}
                        background={'#F9F7F1'}
                      >
                        <ChakraImage
                          fallback={<DefaultSkeleton />}
                          w={'100%'}
                          h={'100%'}
                          src={imageS3Url}
                        />
                      </Center>
                    )}
                  </Flex>
                </Box>
              </Box>
            </VStack>

            <Box w={'100%'}>
              <Text
                color={'#485766'}
                fontSize={'1rem'}
                fontWeight={400}
                lineHeight={'1.75rem'}
                wordWrap={'break-word'}
              >
                {localeText(LANGUAGES.COUPON.PH_ISSUE_COUPON)}
              </Text>
            </Box>

            <ContentBR h={'2.5rem'} />

            <Box w={'100%'} h={'4rem'}>
              <Button
                onClick={() => {
                  handleConfirm();
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
                  {localeText(LANGUAGES.COMMON.CONFIRM)}
                </Text>
              </Button>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CouponIssueModal;
