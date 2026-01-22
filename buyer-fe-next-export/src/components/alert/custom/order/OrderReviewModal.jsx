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
  Center,
  Img,
  Image as ChakraImage,
  Textarea,
} from '@chakra-ui/react';

import { useCallback, useEffect, useState } from 'react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import ContentBR from '@/components/custom/ContentBR';
import OrderCard from '@/components/custom/order/OrderCard';
import RightBlueArrow from '@public/svgs/icon/right-blue.svg';
import OrderHeader from './OrderHeader';
import useOrders from '@/hooks/useOrders';
import utils from '@/utils';
import StarRating from '@/components/common/StarRating';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import DefaultImage from '@/components/input/file/DefaultImage';
import productReviewApi from '@/services/productReviewApi';
import { SUCCESS } from '@/constants/errorCode';
import useModal from '@/hooks/useModal';
import useDevice from '@/hooks/useDevice';

const OrderReviewsModal = (props) => {
  const { isMobile, clampW } = useDevice();
  const { openModal } = useModal();
  const { localeText } = useLocale();

  const { isOpen, onClose } = props;

  const [isDisabled, setIsDisabled] = useState(true);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);

  const { selectedOrder, selectedOrders } = useOrders();

  useEffect(() => {
    if (rating > 0 && content) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [content, rating]);

  const handleFinally = useCallback(() => {
    if (onClose) {
      onClose();
    }
  });

  const handleImageFile = useCallback((file, srcData) => {
    if (file && srcData) {
      const tempImages = [...images];
      tempImages.push(srcData);
      setImages(tempImages);

      const tempFiles = [...files];
      tempFiles.push(file);
      setFiles(tempFiles);
    }
  });

  const handleRemoveImage = useCallback((index) => {
    let tempImages = [...images];
    tempImages.splice(index, 1);
    setImages(tempImages);

    let tempFiles = [...files];
    tempFiles.splice(index, 1);
    setFiles(tempFiles);
  });

  const handleActionReview = useCallback(async () => {
    const param = {
      productId: selectedOrder.productId,
      ordersProductId: selectedOrder.ordersProductId,
      rating: rating,
      content: content,
    };
    let firstImage = null;
    let secondImage = null;
    let thirdImage = null;
    files.map((file, index) => {
      if (index === 0) {
        firstImage = file;
      } else if (index === 1) {
        secondImage = file;
      } else if (index === 2) {
        thirdImage = file;
      }
    });
    const result = await productReviewApi.postProductReview(
      param,
      firstImage,
      secondImage,
      thirdImage,
    );
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
    const firstOrder = selectedOrder;
    console.log(firstOrder);
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
                      // handleMoveBrand(brand.href);
                    }}
                  >
                    <Text fontSize={'1rem'} fontWeight={400} color={'#556A7E'}>
                      {firstOrder.brandName}
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
                <OrderCard w={'max-content'} item={firstOrder} isPrice />
              </Box>
              <Box w={'100%'} bg={'#8C644212'} px={'1rem'} py={'0.75rem'}>
                <Box w={'100%'}>
                  <HStack justifyContent={'space-between'}>
                    <Text fontSize={'1rem'} fontWeight={400} color={'#556A7E'}>
                      {localeText(LANGUAGES.MY_PAGE.ORDER.PRODUCT_PRICE)}
                    </Text>
                    <Text color={'#485766'} fontSize={'1rem'} fontWeight={500}>
                      {utils.parseDallar(firstOrder.totalPrice)}
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

            <Box w={'100%'}>
              <VStack spacing={0} h={'100%'} justifyContent={'space-between'}>
                <Box w={'100%'}>
                  <ContentBR h={'1.25rem'} />
                  {orderCardRow()}
                </Box>
                <Box w={'100%'}>
                  <ContentBR h={'3.75rem'} />
                  <VStack spacing={0}>
                    <Box w={'100%'}>
                      <Text
                        color={'#485766'}
                        fontSize={'1.25rem'}
                        fontWeight={500}
                        lineHeight={'2.25rem'}
                      >
                        {localeText(
                          LANGUAGES.MY_PAGE.ORDER.WRITE_REVIEW_DETAILS,
                        )}
                      </Text>
                    </Box>

                    <ContentBR h={'1.5rem'} />

                    <Center w={'100%'}>
                      <StarRating
                        initialRating={rating}
                        w={'3.25rem'}
                        h={'3.25rem'}
                        onChange={(e) => {
                          setRating(e);
                        }}
                      />
                    </Center>

                    <ContentBR h={'1.5rem'} />

                    <Box w={'100%'}>
                      <HStack spacing={'1.25rem'}>
                        {images.map((image, index) => {
                          const key = `img_${index}`;
                          return (
                            <Center
                              position={'relative'}
                              w={'6.25rem'}
                              h={'6.25rem'}
                              key={key}
                            >
                              <ChakraImage
                                fallback={<DefaultSkeleton />}
                                w={'100%'}
                                h={'100%'}
                                objectFit={'cover'}
                                src={image}
                              />
                              <Center
                                cursor={'pointer'}
                                onClick={() => {
                                  handleRemoveImage(index);
                                }}
                                w={'1.5rem'}
                                h={'1.5rem'}
                                position={'absolute'}
                                top={0}
                                right={0}
                                transform="translate(30%, -30%)"
                                bg={'#FFF'}
                                border={'1px solid #7895B2'}
                                borderRadius={'50%'}
                              >
                                <CustomIcon name={'minus'} color={'#7895B2'} />
                              </Center>
                            </Center>
                          );
                        })}
                        {images.length < 3 && (
                          <DefaultImage
                            retFile={(file, srcData) => {
                              handleImageFile(file, srcData);
                            }}
                          />
                        )}
                      </HStack>
                    </Box>

                    <ContentBR h={'1.5rem'} />

                    <Box w={'100%'} h={'12.25rem'}>
                      <Textarea
                        type={'text'}
                        placeholder={localeText(
                          LANGUAGES.MY_PAGE.ORDER.PH_WRITE_PRODUCT_REVIEW,
                        )}
                        _placeholder={{
                          color: '#A7C3D2',
                          fontSize: '1rem',
                          fontWeight: 400,
                          lineHeight: '1.75rem',
                        }}
                        onChange={(e) => {
                          setContent(e.target.value);
                        }}
                        value={content}
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

                    <ContentBR h={'1.5rem'} />

                    <Box minW={'8.5rem'} w={'100%'} h={'4rem'} mb={'1.5rem'}>
                      <Button
                        isDisabled={isDisabled}
                        onClick={handleActionReview}
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
                          {localeText(LANGUAGES.MY_PAGE.ORDER.REGISTER_REVIEW)}
                        </Text>
                      </Button>
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  ) : (
    <Modal
      isOpen={isOpen}
      onClose={handleFinally}
      size="md"
      scrollBehavior="inside"
    >
      <ModalOverlay bg={'#00000099'} />
      <ModalContent
        alignSelf={'center'}
        borderRadius={0}
        w={'60rem'}
        maxW={null}
        h={'100%'}
        maxH={'80%'}
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
                  <VStack spacing={0}>
                    <Box w={'100%'}>
                      <Text
                        color={'#485766'}
                        fontSize={'1.25rem'}
                        fontWeight={500}
                        lineHeight={'2.25rem'}
                      >
                        {localeText(
                          LANGUAGES.MY_PAGE.ORDER.WRITE_REVIEW_DETAILS,
                        )}
                      </Text>
                    </Box>

                    <ContentBR h={'1.5rem'} />

                    <Center w={'100%'}>
                      <StarRating
                        initialRating={rating}
                        w={'3.25rem'}
                        h={'3.25rem'}
                        onChange={(e) => {
                          setRating(e);
                        }}
                      />
                    </Center>

                    <ContentBR h={'1.5rem'} />

                    <Box w={'100%'}>
                      <HStack spacing={'1.25rem'}>
                        {images.map((image, index) => {
                          const key = `img_${index}`;
                          return (
                            <Center
                              position={'relative'}
                              w={'6.25rem'}
                              h={'6.25rem'}
                              key={key}
                            >
                              <ChakraImage
                                fallback={<DefaultSkeleton />}
                                w={'100%'}
                                h={'100%'}
                                objectFit={'cover'}
                                src={image}
                              />
                              <Center
                                cursor={'pointer'}
                                onClick={() => {
                                  handleRemoveImage(index);
                                }}
                                w={'1.5rem'}
                                h={'1.5rem'}
                                position={'absolute'}
                                top={0}
                                right={0}
                                transform="translate(30%, -30%)"
                                bg={'#FFF'}
                                border={'1px solid #7895B2'}
                                borderRadius={'50%'}
                              >
                                <CustomIcon name={'minus'} color={'#7895B2'} />
                              </Center>
                            </Center>
                          );
                        })}
                        {images.length < 3 && (
                          <DefaultImage
                            retFile={(file, srcData) => {
                              handleImageFile(file, srcData);
                            }}
                          />
                        )}
                      </HStack>
                    </Box>

                    <ContentBR h={'1.5rem'} />

                    <Box w={'100%'} h={'12.25rem'}>
                      <Textarea
                        type={'text'}
                        placeholder={localeText(
                          LANGUAGES.MY_PAGE.ORDER.PH_WRITE_PRODUCT_REVIEW,
                        )}
                        _placeholder={{
                          color: '#A7C3D2',
                          fontSize: '1rem',
                          fontWeight: 400,
                          lineHeight: '1.75rem',
                        }}
                        onChange={(e) => {
                          setContent(e.target.value);
                        }}
                        value={content}
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
                        isDisabled={isDisabled}
                        onClick={handleActionReview}
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
                          {localeText(LANGUAGES.MY_PAGE.ORDER.REGISTER_REVIEW)}
                        </Text>
                      </Button>
                    </Box>

                    <ContentBR h={'2.5rem'} />
                  </VStack>
                </Box>
                <ContentBR h={'2.5rem'} />
              </VStack>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OrderReviewsModal;
