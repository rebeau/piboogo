'use client';

import { CustomIcon } from '@/components';
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
  Img,
  Textarea,
} from '@chakra-ui/react';

import { useCallback, useState } from 'react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import ContentBR from '@/components/custom/ContentBR';
import OrderCard from '@/components/custom/order/OrderCard';
import RightBlueArrow from '@public/svgs/icon/right-blue.svg';
import OrderHeader from './OrderHeader';
import CustomCheckbox from '@/components/common/checkbox/CustomCheckBox';
import useOrders from '@/hooks/useOrders';
import utils from '@/utils';
import productQuestionApi from '@/services/productQuestionApi';
import { SUCCESS } from '@/constants/errorCode';
import useModal from '@/hooks/useModal';
import useDevice from '@/hooks/useDevice';
import useMove from '@/hooks/useMove';

const OrderInquiriesModal = (props) => {
  const { isMobile, clampW } = useDevice();
  const { openModal } = useModal();
  const { localeText } = useLocale();
  const { moveProductDetail } = useMove();

  const { isOpen, onClose } = props;

  const { selectedOrder, selectedOrders } = useOrders();

  const [isSecret, setIsSecret] = useState(false);
  const [question, setQuestion] = useState('');

  const handleFinally = useCallback(() => {
    if (onClose) {
      onClose();
    }
  });

  const handleActionInquiries = useCallback(async () => {
    const param = {
      productId: selectedOrder.ordersProductId,
      secretFlag: isSecret === true ? 2 : 1,
      question: question,
    };
    const result = await productQuestionApi.postProductQuestion(param);

    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result.message,
        onAgree: () => {
          handleFinally();
        },
      });
    } else {
      openModal({ text: result.message });
    }
  });

  const orderCardRow = useCallback((rowIndex) => {
    const name = selectedOrder?.name;
    const count = selectedOrder?.count || 0;
    const brandName = selectedOrder?.brandName;
    const productId = selectedOrder?.productId;
    const ordersProductId = selectedOrder?.ordersProductId;
    const unitPrice = selectedOrder?.unitPrice || 0;
    const totalPrice = selectedOrder?.totalPrice || 0;
    const ordersProductOptionList =
      selectedOrder?.ordersProductOptionList || [];
    const deliveryStatus = selectedOrder?.deliveryStatus;
    const productImageList = selectedOrder?.productImageList || [];

    const payStatus = selectedOrders?.payStatus;
    const status = selectedOrders?.status;
    const createdAt = selectedOrders?.createdAt;
    const orderNum = selectedOrders?.orderNum;
    const actualAmount = selectedOrders?.actualAmount || 0;
    const totalAmount = selectedOrders?.totalAmount || 0;
    const discountAmount = selectedOrders?.discountAmount || 0;
    const ordersId = selectedOrders?.ordersId;
    const ordersProducts = selectedOrders?.ordersProducts || [];

    let firstOrders = null;
    if (ordersProducts.length > 0) {
      firstOrders = ordersProducts[0];
    }
    let firstImage = null;
    if (productImageList.length > 0) {
      {
        firstImage = productImageList[0].imageS3Url;
      }
    }

    return (
      <Box w={'100%'} key={rowIndex}>
        <VStack spacing={'1.25rem'}>
          <Box w={'100%'}>
            <VStack spacing={'1.25rem'}>
              <Box w={'100%'}>
                <HStack>
                  <Box
                    cursor={'pointer'}
                    onClick={() => {
                      moveProductDetail(productId);
                    }}
                  >
                    <Text fontSize={'1rem'} fontWeight={400} color={'#556A7E'}>
                      {brandName}
                    </Text>
                  </Box>
                  <Img w={'1.25rem'} h={'1.25rem'} src={RightBlueArrow.src} />
                </HStack>
              </Box>
              <Box w={'100%'}>
                {/*
                <VStack spacing={'1.25rem'}>
                  {productList.map((product, productIndex) => {
                    return (
                      <Box key={productIndex} w={'100%'}>
                        <OrderCard w={'max-content'} item={product} isPrice />
                      </Box>
                    );
                  })}
                </VStack>
                */}
                <OrderCard w={'max-content'} item={selectedOrder} isPrice />
              </Box>
              <Box w={'100%'} bg={'#8C644212'} px={'1rem'} py={'0.75rem'}>
                <Box w={'100%'}>
                  <HStack justifyContent={'space-between'}>
                    <Text fontSize={'1rem'} fontWeight={400} color={'#556A7E'}>
                      {localeText(LANGUAGES.MY_PAGE.ORDER.PRODUCT_PRICE)}
                    </Text>
                    <Text color={'#485766'} fontSize={'1rem'} fontWeight={500}>
                      {utils.parseDallar(totalPrice)}
                    </Text>
                  </HStack>
                </Box>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  });

  return isMobile(true) ? (
    <Modal
      isOpen={isOpen}
      onClose={handleFinally}
      size={'full'}
      scrollBehavior="inside"
    >
      <ModalOverlay bg={'#00000099'} />
      <ModalContent alignSelf={'center'} borderRadius={0} w={'100%'}>
        <ModalBody
          w={'100%'}
          h={'100%'}
          position={'relative'}
          py={0}
          pt={'1.5rem'}
          px={clampW(1, 5)}
        >
          <Box w={'100%'} h={'100%'}>
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
                      {localeText(LANGUAGES.MY_PAGE.ORDER.PRODUCT_INQUIRIES)}
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

              {/* 상태 바 */}
              <OrderHeader selectedOrders={selectedOrders} />
            </VStack>

            <ContentBR h={'1.25rem'} />

            <Box w={'100%'}>{orderCardRow()}</Box>

            <ContentBR h={'1.25rem'} />

            <Box w={'100%'}>
              <VStack justifyContent={'space-between'}>
                <Box w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={clampW(1.125, 1.25)}
                    fontWeight={500}
                    lineHeight={'175%'}
                  >
                    {localeText(LANGUAGES.MY_PAGE.ORDER.WRITE_PRODUCT_INQUIRY)}
                  </Text>
                </Box>
                <Box w={'100%'}>
                  <HStack>
                    <Box>
                      <CustomCheckbox
                        isChecked={isSecret}
                        onChange={(v) => {
                          setIsSecret(v);
                        }}
                      />
                    </Box>
                    <Box>
                      <Text
                        color={'#485766'}
                        fontSize={clampW(0.875, 1)}
                        fontWeight={400}
                        lineHeight={'160%'}
                      >
                        {localeText(LANGUAGES.MY_PAGE.ORDER.WRITE_IN_SECRET)}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              </VStack>
            </Box>

            <ContentBR h={'1.25rem'} />

            <Box w={'100%'} h={'12.25rem'}>
              <Textarea
                type={'text'}
                placeholder={localeText(
                  LANGUAGES.MY_PAGE.ORDER.PH_WRITE_PRODUCT_INQUIRY,
                )}
                _placeholder={{
                  color: '#A7C3D2',
                  fontSize: '1rem',
                  fontWeight: 400,
                  lineHeight: '1.75rem',
                }}
                onChange={(e) => {
                  setQuestion(e.target.value);
                }}
                value={question}
                w={'100%'}
                h={'100%'}
                py={'0.875rem'}
                px={'1.25rem'}
                bg={'#FFF'}
                borderRadius={'0.25rem'}
                resize={'none'}
                //
                border={'1px solid #9CADBE'}
                fontSize={'1rem'}
                fontWeight={400}
                lineHeight={'1.75rem'}
              />
            </Box>

            <ContentBR h={'1.25rem'} />

            <Box w={'100%'} h={'3rem'} mb={'1.25rem'}>
              <Button
                isDisabled={question.length < 1}
                onClick={handleActionInquiries}
                _disabled={{
                  bg: '#D9E7EC',
                  cursor: 'not-allowed',
                }}
                _active={{}}
                _hover={{}}
                py={'0.625rem'}
                px={'1.25rem'}
                borderRadius={'0.25rem'}
                bg={'#66809C'}
                h={'100%'}
                w={'100%'}
              >
                <Text
                  color={'#FFF'}
                  fontSize={clampW(1.125, 1.25)}
                  fontWeight={400}
                  lineHeight={'2.25rem'}
                >
                  {localeText(LANGUAGES.MY_PAGE.ORDER.REGISTER_INQUIRIES)}
                </Text>
              </Button>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  ) : (
    <Modal isOpen={isOpen} onClose={handleFinally} size="md" isCentered>
      <ModalOverlay bg={'#00000099'} />
      <ModalContent
        alignSelf={'center'}
        borderRadius={0}
        w={'60rem'}
        h={'100%'}
        maxH={'max-content'}
        maxW={null}
      >
        <ModalBody
          w={'100%'}
          h={'100%'}
          position={'relative'}
          pt={'1.5rem'}
          pb={0}
          px={0}
        >
          <Box w={'100%'} h={'100%'}>
            <VStack spacing={'1.5rem'} px={'2.5rem'}>
              <Box w={'100%'}>
                <HStack justifyContent={'space-between'}>
                  <Box>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={400}
                      lineHeight={'1.96875rem'}
                    >
                      {localeText(LANGUAGES.MY_PAGE.ORDER.PRODUCT_INQUIRIES)}
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

              {/* 상태 바 */}
              <OrderHeader selectedOrders={selectedOrders} />
            </VStack>

            <Box
              w={'100%'}
              h={'calc(100% - 7.75rem)'}
              overflowY={'auto'}
              className={'no-scroll'}
            >
              <VStack
                spacing={0}
                px={'2.5rem'}
                h={'100%'}
                justifyContent={'space-between'}
              >
                <Box w={'100%'}>
                  <ContentBR h={'1.25rem'} />
                  {orderCardRow()}
                </Box>

                <Box w={'100%'}>
                  <ContentBR h={'3.75rem'} />

                  <Box w={'100%'}>
                    <HStack justifyContent={'space-between'}>
                      <Box>
                        <Text
                          color={'#485766'}
                          fontSize={'1.25rem'}
                          fontWeight={500}
                          lineHeight={'2.25rem'}
                        >
                          {localeText(
                            LANGUAGES.MY_PAGE.ORDER.WRITE_PRODUCT_INQUIRY,
                          )}
                        </Text>
                      </Box>
                      <Box>
                        <HStack>
                          <Box>
                            <CustomCheckbox
                              isChecked={isSecret}
                              onChange={(v) => {
                                setIsSecret(v);
                              }}
                            />
                          </Box>
                          <Box>
                            <Text
                              color={'#485766'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(
                                LANGUAGES.MY_PAGE.ORDER.WRITE_IN_SECRET,
                              )}
                            </Text>
                          </Box>
                        </HStack>
                      </Box>
                    </HStack>
                  </Box>

                  <ContentBR h={'1.5rem'} />

                  <Box w={'100%'} h={'12.25rem'}>
                    <Textarea
                      type={'text'}
                      placeholder={localeText(
                        LANGUAGES.MY_PAGE.ORDER.PH_WRITE_PRODUCT_INQUIRY,
                      )}
                      _placeholder={{
                        color: '#A7C3D2',
                        fontSize: '1rem',
                        fontWeight: 400,
                        lineHeight: '1.75rem',
                      }}
                      onChange={(e) => {
                        setQuestion(e.target.value);
                      }}
                      value={question}
                      w={'100%'}
                      h={'100%'}
                      py={'0.875rem'}
                      px={'1.25rem'}
                      bg={'#FFF'}
                      borderRadius={'0.25rem'}
                      resize={'none'}
                      //
                      border={'1px solid #9CADBE'}
                      fontSize={'1rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    />
                  </Box>

                  <ContentBR h={'3.75rem'} />

                  <Box minW={'8.5rem'} w={'100%'} h={'4rem'}>
                    <Button
                      isDisabled={question.length < 1}
                      onClick={handleActionInquiries}
                      _disabled={{
                        bg: '#D9E7EC',
                        cursor: 'not-allowed',
                      }}
                      _active={{}}
                      _hover={{}}
                      py={'0.625rem'}
                      px={'1.25rem'}
                      borderRadius={'0.25rem'}
                      bg={'#66809C'}
                      h={'100%'}
                      w={'100%'}
                    >
                      <Text
                        color={'#FFF'}
                        fontSize={'1.25rem'}
                        fontWeight={400}
                        lineHeight={'2.25rem'}
                      >
                        {localeText(LANGUAGES.MY_PAGE.ORDER.REGISTER_INQUIRIES)}
                      </Text>
                    </Button>
                  </Box>

                  <ContentBR h={'2.5rem'} />
                </Box>
              </VStack>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OrderInquiriesModal;
