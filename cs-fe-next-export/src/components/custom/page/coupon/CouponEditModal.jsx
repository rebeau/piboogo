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
  Flex,
  Button,
  Select,
  Image as ChakraImage,
  Input,
  Center,
} from '@chakra-ui/react';

import { useCallback, useEffect, useState } from 'react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import CustomIcon from '@/components/icon/CustomIcon';
import ContentBR from '@/components/common/ContentBR';
import CustomCheckBox from '@/components/common/checkbox/CustomCheckBox';
import utils from '@/utils';
import DragAndDrop from '@/components/input/file/DragAndDrop';
import useModal from '@/hooks/useModal';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import couponApi from '@/services/couponApi';
import { SUCCESS } from '@/constants/errorCode';
import RangeDateSplitPicker from '@/components/date/RangeDateSplitPicker';
import { toZonedTime } from 'date-fns-tz';
import { TIME_ZONE } from '@/constants/common';

const CouponEditModal = (props) => {
  const { isOpen, onClose } = props;
  const { isModify, selectedCoupon } = props;
  const { openModal } = useModal();
  const { localeText } = useLocale();

  useEffect(() => {
    if (isModify) {
      setName(selectedCoupon.name);
      setType(selectedCoupon.type);
      setDiscountAmount(selectedCoupon.discountAmount);
      setMinimumPurchaseAmount(selectedCoupon.minimumPurchaseAmount);
      if (selectedCoupon?.startDate && selectedCoupon?.endDate) {
        setStartDate(selectedCoupon.startDate);
        setEndDate(selectedCoupon.endDate);
      } else {
        setIsLimit(true);
      }
      if (selectedCoupon.imageS3Url) {
        setSrcs([selectedCoupon.imageS3Url]);
      }
    }
  }, [selectedCoupon]);

  const handleFinally = useCallback(() => {
    if (onClose) {
      onClose();
    }
  });

  const [isLimit, setIsLimit] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState(1);
  const [discountAmount, setDiscountAmount] = useState('');
  const [minimumPurchaseAmount, setMinimumPurchaseAmount] = useState('');

  const now = toZonedTime(new Date(), TIME_ZONE);
  const sevenDaysLater = new Date(now);
  sevenDaysLater.setDate(now.getDate() + 7);

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [files, setFiles] = useState([]);
  const [srcs, setSrcs] = useState([]);

  useEffect(() => {
    initDate();
  }, []);

  const initDate = () => {
    setStartDate(now);
    setEndDate(sevenDaysLater);
  };

  const handleOnChangeDatePicker = async (dates) => {
    const start = dates[0] || null;
    const end = dates[1] || null;
    if (start && end) {
      setStartDate(start);
      setEndDate(end);
    } else if (!start && !end) {
      // 초기화
      setStartDate(null);
      setEndDate(null);
    }
  };

  const checkParams = () => {
    if (!name) {
      openModal({ text: '이름 적으셈' });
      return false;
    }
    if (utils.isEmpty(discountAmount)) {
      openModal({ text: '할인금액 적으셈' });
      return false;
    }
    if (utils.isEmpty(minimumPurchaseAmount)) {
      openModal({ text: '최소금액 적으셈' });
      return false;
    }
    if (files.length === 0) {
      openModal({ text: '최소금액 적으셈' });
      return false;
    }
    if (isModify) {
      if (srcs.length === 0) {
        openModal({
          text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_UPLOAD_FILE),
        });
        return false;
      }
    } else {
      if (files.length === 0) {
        openModal({
          text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_UPLOAD_FILE),
        });
        return;
      }
    }
    return true;
  };

  const handleModifyCoupon = async () => {
    if (!checkParams) return;

    const param = {
      couponId: selectedCoupon.couponId,
      name: name,
      type: type,
      discountAmount: discountAmount,
      minimumPurchaseAmount: minimumPurchaseAmount,
    };
    if (!isLimit) {
      param.startDate = utils.parseDateToYMD(startDate);
      param.endDate = utils.parseDateToYMD(endDate);
    }

    console.log(param);
    const result = await couponApi.patchCoupon(param, files);
    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result.message,
        onAgree: () => {
          onClose(true);
        },
      });
    }
  };

  const handleAddCoupon = async () => {
    if (!checkParams) return;

    const param = {
      name: name,
      type: type,
      discountAmount: discountAmount,
      minimumPurchaseAmount: minimumPurchaseAmount,
    };
    if (!isLimit) {
      param.startDate = utils.parseDateToYMD(startDate);
      param.endDate = utils.parseDateToYMD(endDate);
    }

    const result = await couponApi.postCoupon(param, files);
    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result.message,
        onAgree: () => {
          onClose(true);
        },
      });
    }
  };

  const handleRemoveImage = useCallback((index) => {
    let tempImages = [...srcs];
    tempImages.splice(index, 1);
    setSrcs(tempImages);

    let tempFiles = [...files];
    tempFiles.splice(index, 1);
    setFiles(tempFiles);
  });

  return (
    <Modal isOpen={isOpen} onClose={handleFinally} size="md">
      <ModalOverlay bg={'rgba(0, 0, 0, 0.60)'} />
      <ModalContent
        alignSelf={'center'}
        borderRadius={0}
        w={'60rem'}
        h={'52.25rem'}
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
                        ? localeText(LANGUAGES.COUPON.MODIFY_COUPON)
                        : localeText(LANGUAGES.COUPON.ADD_COUPON)}
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
                h={'15.75rem'}
                flexDir={'column'}
                justifyContent={'flex-start'}
                alignItems={'flex-start'}
                gap={'1.25rem'}
                display={'inline-flex'}
              >
                <Flex
                  w={'100%'}
                  justifyContent={'flex-start'}
                  alignItems={'center'}
                  gap={'2rem'}
                  display={'inline-flex'}
                >
                  <Text
                    w={'12.5rem'}
                    color={'#7895B2'}
                    fontSize={'0.9375rem'}
                    fontFamily={'Poppins'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {localeText(LANGUAGES.COUPON.TITLE)}
                  </Text>
                  <Box
                    flex={'1 1 0'}
                    flexDir={'column'}
                    justifyContent={'flex-start'}
                    alignItems={'flex-start'}
                    gap={'0.25rem'}
                    display={'inline-flex'}
                  >
                    <Input
                      h={'100%'}
                      placeholder={localeText(
                        LANGUAGES.COUPON.PH_ENTER_COUPON_TITLE,
                      )}
                      _placeholder={{
                        fontWeight: 400,
                        fontSize: '0.9375rem',
                        color: '#7895B2',
                      }}
                      border={'1px solid #9CADBE'}
                      px={'1rem'}
                      py={'0.75rem'}
                      type={'text'}
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
                </Flex>
                <Flex
                  w={'100%'}
                  justifyContent={'flex-start'}
                  alignItems={'center'}
                  gap={'2rem'}
                  display={'inline-flex'}
                >
                  <Text
                    w={'12.5rem'}
                    color={'#7895B2'}
                    fontSize={'0.9375rem'}
                    fontFamily={'Poppins'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {localeText(LANGUAGES.COUPON.BENEFITS)}
                  </Text>
                  <Flex
                    flex={'1 1 0'}
                    h={'3rem'}
                    justifyContent={'flex-start'}
                    alignItems={'center'}
                    gap={'0.75rem'}
                    display={'flex'}
                  >
                    <Flex
                      w={'10rem'}
                      flexDir={'column'}
                      justifyContent={'flex-start'}
                      alignItems={'flex-start'}
                      gap={'0.25rem'}
                      display={'inline-flex'}
                    >
                      <Select
                        value={Number(type)}
                        onChange={(e) => {
                          setType(Number(e.target.value));
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
                          {localeText(LANGUAGES.COMMON.PRICE)}
                        </option>
                        <option value={2}>
                          {localeText(LANGUAGES.COMMON.PERCENTAGE)}
                        </option>
                      </Select>
                    </Flex>
                    <Flex
                      flex={'1 1 0'}
                      flexDir={'column'}
                      justifyContent={'flex-start'}
                      alignItems={'flex-start'}
                      gap={'0.25rem'}
                      display={'inline-flex'}
                    >
                      <Input
                        h={'100%'}
                        placeholder={localeText(
                          LANGUAGES.COUPON.PH_ENTER_THE_AMOUNT,
                        )}
                        _placeholder={{
                          fontWeight: 400,
                          fontSize: '0.9375rem',
                          color: '#7895B2',
                        }}
                        border={'1px solid #9CADBE'}
                        px={'1rem'}
                        py={'0.75rem'}
                        type={'text'}
                        color={'#556A7E'}
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                        value={Number(discountAmount)}
                        onChange={(e) => {
                          const onlyNum = utils.parseOnlyNum(e.target.value);
                          setDiscountAmount(onlyNum);
                        }}
                      />
                    </Flex>
                    {type === 2 ? (
                      <Text
                        color={'#485766'}
                        fontSize={'1rem'}
                        fontFamily={'Poppins'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        % off
                      </Text>
                    ) : (
                      <Text
                        color={'#485766'}
                        fontSize={'1rem'}
                        fontFamily={'Poppins'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        $
                      </Text>
                    )}
                  </Flex>
                </Flex>
                <Flex
                  w={'100%'}
                  justifyContent={'flex-start'}
                  alignItems={'center'}
                  gap={'2rem'}
                  display={'inline-flex'}
                >
                  <Text
                    w={'12.5rem'}
                    color={'#7895B2'}
                    fontSize={'0.9375rem'}
                    fontFamily={'Poppins'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {localeText(LANGUAGES.COUPON.REDEMPTION_CONDITIONS)}
                  </Text>
                  <Flex
                    flex={'1 1 0'}
                    h={'3rem'}
                    justifyContent={'flex-start'}
                    alignItems={'center'}
                    gap={'0.75rem'}
                    display={'flex'}
                  >
                    <Text
                      color={'#485766'}
                      fontSize={'1rem'}
                      fontFamily={'Poppins'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      $
                    </Text>
                    <Flex
                      flex={'1 1 0'}
                      flexDir={'column'}
                      justifyContent={'flex-start'}
                      alignItems={'flex-start'}
                      gap={'0.25rem'}
                      display={'inline-flex'}
                    >
                      <Input
                        h={'100%'}
                        placeholder={localeText(
                          LANGUAGES.COUPON.PH_ENTER_THE_AMOUNT,
                        )}
                        _placeholder={{
                          fontWeight: 400,
                          fontSize: '0.9375rem',
                          color: '#7895B2',
                        }}
                        border={'1px solid #9CADBE'}
                        px={'1rem'}
                        py={'0.75rem'}
                        type={'text'}
                        color={'#556A7E'}
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                        value={Number(minimumPurchaseAmount)}
                        onChange={(e) => {
                          const onlyNum = utils.parseOnlyNum(e.target.value);
                          setMinimumPurchaseAmount(onlyNum);
                        }}
                      />
                    </Flex>
                    <Text
                      textAlign={'center'}
                      color={'#485766'}
                      fontSize={'0.9375rem'}
                      fontFamily={'Poppins'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.COUPON.MINIMUM_PURCHASE)}
                    </Text>
                  </Flex>
                </Flex>
                <Flex
                  w={'100%'}
                  justifyContent={'flex-start'}
                  alignItems={'center'}
                  gap={'2rem'}
                  display={'inline-flex'}
                >
                  <Text
                    w={'12.5rem'}
                    color={'#7895B2'}
                    fontSize={'0.9375rem'}
                    fontFamily={'Poppins'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {localeText(LANGUAGES.COUPON.PERIOD)}
                  </Text>
                  <Flex
                    flex={'1 1 0'}
                    h={'3rem'}
                    justifyContent={'flex-start'}
                    alignItems={'center'}
                    gap={'0.75rem'}
                    display={'flex'}
                  >
                    <Flex
                      h={'1.75rem'}
                      justifyContent={'flex-start'}
                      alignItems={'center'}
                      gap={'0.5rem'}
                      display={'flex'}
                    >
                      <CustomCheckBox
                        isChecked={isLimit}
                        onChange={(v) => {
                          setIsLimit(v);
                        }}
                      />
                      <Text
                        color={'#485766'}
                        fontSize={'1rem'}
                        fontFamily={'Poppins'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.COMMON.UNLIMITED)}
                      </Text>
                    </Flex>
                    {!isLimit && (
                      <Flex
                        w={'16rem'}
                        flexDir={'column'}
                        justifyContent={'flex-start'}
                        alignItems={'flex-start'}
                        gap={'0.25rem'}
                        display={'inline-flex'}
                      >
                        <RangeDateSplitPicker
                          startDate={startDate}
                          endDate={endDate}
                          isAfter
                          onInit={initDate}
                          onChange={(date) => {
                            if (!date) return;
                            handleOnChangeDatePicker(date);
                          }}
                        />
                      </Flex>
                    )}
                  </Flex>
                </Flex>
              </Box>
            </VStack>

            <ContentBR h={'2.5rem'} />

            <Box w={'100%'}>
              <Flex
                w={'100%'}
                justifyContent={'flex-start'}
                alignItems={'flex-start'}
                gap={'2rem'}
                display={'inline-flex'}
              >
                <Text
                  w={'12.5rem'}
                  color={'#7895B2'}
                  fontSize={'0.9375rem'}
                  fontFamily={'Poppins'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.COUPON.COUPON_IMAGE)}
                </Text>
                <Flex
                  flex={'1 1 0'}
                  justifyContent={'flex-start'}
                  alignItems={'center'}
                  gap={'0.75rem'}
                  display={'flex'}
                >
                  <Box w={'40.5rem'} h={'18.75rem'}>
                    {/*
                    <DragAndDrop
                      w={'100%'}
                      h={'100%'}
                      limitSize={'1200*1200'}
                    />
                    */}

                    {srcs.length === 0 && (
                      <DragAndDrop
                        w={'100%'}
                        h={'100%'}
                        files={files}
                        maxFiles={1}
                        setFiles={(files) => {
                          files.forEach((file) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setSrcs((srcs) => [...srcs, reader.result]);
                            };
                            if (file) {
                              reader.readAsDataURL(file);
                            }
                          });
                          setFiles(files);
                        }}
                      />
                    )}
                    {srcs.length > 0 && (
                      <Box position={'relative'} w={'100%'} h={'100%'}>
                        <Center
                          _hover={{
                            bg: '#00000066',
                            opacity: 0.8,
                          }}
                          cursor={'pointer'}
                          onClick={() => {
                            handleRemoveImage(0);
                          }}
                          w={'100%'}
                          h={'100%'}
                          position={'absolute'}
                          top={0}
                          right={0}
                          opacity={0}
                        >
                          <Box w={'13.5rem'} h={'3rem'}>
                            <Box
                              px={'1.25rem'}
                              py={'0.62rem'}
                              borderRadius={'0.25rem'}
                              border={'1px solid #FFF'}
                              bg={'transparent'}
                              h={'100%'}
                              w={'100%'}
                              _groupHover={{
                                opacity: 0.8,
                              }}
                              // transition="opacity 0.3s"
                            >
                              <Text
                                color={'#FFF'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                                textAlign={'center'}
                              >
                                {localeText(LANGUAGES.COMMON.DELETE)}
                              </Text>
                            </Box>
                          </Box>
                        </Center>

                        <ChakraImage
                          fallback={<DefaultSkeleton />}
                          w={'100%'}
                          h={'100%'}
                          objectFit={'cover'}
                          src={srcs[0]}
                        />
                      </Box>
                    )}
                  </Box>
                </Flex>
              </Flex>
            </Box>
            <ContentBR h={'3.75rem'} />

            <Box w={'100%'} h={'4rem'}>
              <Button
                onClick={() => {
                  isModify ? handleModifyCoupon() : handleAddCoupon();
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
                    ? localeText(LANGUAGES.COUPON.MODIFY_COUPON)
                    : localeText(LANGUAGES.COUPON.ADD_COUPON)}
                </Text>
              </Button>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CouponEditModal;
