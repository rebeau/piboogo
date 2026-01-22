'use client';

import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import {
  Box,
  Button,
  Center,
  HStack,
  Image as ChakraImage,
  Text,
  VStack,
  Img,
  Divider,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import IconRight from '@public/svgs/icon/right.svg';
import productApi from '@/services/productApi';
import MainContainer from '@/components/layout/MainContainer';
import { SUCCESS } from '@/constants/errorCode';
import useMove from '@/hooks/useMove';
import useModal from '@/hooks/useModal';
import utils from '@/utils';
import ContentBR from '@/components/common/ContentBR';
import QuillViewer from '@/components/input/editor/QuillViewer';

const ProductsDetailPage = () => {
  const { productId } = useParams();
  const { openModal } = useModal();
  const { moveBack } = useMove();
  const router = useRouter();
  const { localeText } = useLocale();

  const [productInfo, setProductInfo] = useState({});
  const [promotionList, setPromotionList] = useState([]);
  const [productImageList, setProductImageList] = useState([]);
  const [productOptionList, setproductOptionList] = useState([]);
  const [productDiscountList, setProductDiscountList] = useState([]);

  const getProductType = (type) => {
    // 1:None, 2:Dry, 3:Oily, 4:Sensitive, 5:Acne, 6:Normal
    if (type === 1) {
      return localeText(LANGUAGES.COMMON.NONE);
    } else if (type === 2) {
      return localeText(LANGUAGES.DRY);
    } else if (type === 3) {
      return localeText(LANGUAGES.OILY);
    } else if (type === 4) {
      return localeText(LANGUAGES.SENSITIVE);
    } else if (type === 6) {
      return localeText(LANGUAGES.ACNE);
    } else if (type === 7) {
      return localeText(LANGUAGES.NORMAL);
    }
  };

  useEffect(() => {
    if (productId) {
      handleGetProduct();
    }
  }, [productId]);

  const handleGetProduct = async () => {
    const param = {
      productId: productId,
    };
    const result = await productApi.getProduct(param);
    if (result?.errorCode === SUCCESS) {
      const resultData = result.data;
      setProductInfo(resultData);
      setPromotionList(resultData.promotionList);
      setProductImageList(resultData.productImageList);
      setproductOptionList(resultData.productOptionList);
      setProductDiscountList(resultData.productDiscountList);
    } else {
      openModal({
        text: result.message,
        onAgree: () => {
          moveBack();
        },
      });
    }
  };

  const handleDeleteProduct = async () => {
    const param = {
      productIds: [Number(productId)],
    };
    const result = await productApi.deleteProduct(param);
    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result.message,
        onAgree: () => {
          moveBack();
        },
      });
    }
  };

  const handlePatchStatus = async (status) => {
    const param = {
      productId: Number(productId),
      status: Number(status),
    };
    const result = await productApi.patchProduct(param);
    openModal({ text: result.message });
    if (result?.errorCode === SUCCESS) {
      setProductInfo({
        ...productInfo,
        status: Number(status),
      });
    }
  };

  const handleStatus = (status) => {
    if (status === 1) return localeText(LANGUAGES.PRODUCTS.ON_SALE);
    if (status === 2) return localeText(LANGUAGES.PRODUCTS.STOP_SELLING);
    if (status === 2) return localeText(LANGUAGES.PRODUCTS.OUT_OF_STOCK);
  };

  const handleApproval = (status) => {
    if (status === 1) return localeText(LANGUAGES.PRODUCTS.REGISTER);
    if (status === 2) return localeText(LANGUAGES.PRODUCTS.NOT_APPROVED);
  };

  const handleShippingMethod = (method) => {
    if (method === 1) {
      return localeText(LANGUAGES.COMMON.SYSTEM_CONSIGNMENT_SHIPPING);
    }
    if (method === 2) return localeText(LANGUAGES.COMMON.DIRECT_DELIVERY);
  };

  return (
    <MainContainer
      title={productInfo.name}
      isDetailHeader
      contentHeader={
        <Box minW={'7rem'} h={'3rem'}>
          <Button
            onClick={() => {
              openModal({
                type: 'confirm',
                text: localeText(LANGUAGES.INFO_MSG.DELETE_PRODUCT_MSG),
                onAgree: () => {
                  handleDeleteProduct();
                },
              });
            }}
            px={'1.25rem'}
            py={'0.63rem'}
            borderRadius={'0.25rem'}
            border={'1px solid #B20000'}
            boxSizing={'border-box'}
            bg={'transparent'}
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
              fontSize={'1rem'}
              fontWeight={400}
              lineHeight={'1.75rem'}
            >
              {localeText(LANGUAGES.COMMON.DELETE)}
            </Text>
          </Button>
        </Box>
      }
    >
      <Box w={'100%'}>
        <HStack
          spacing={'1.25rem'}
          justifyContent={'space-between'}
          alignItems={'flex-start'}
        >
          <Box w={'43.25rem'}>
            <VStack spacing={'2.5rem'}>
              <Box w={'100%'}>
                <VStack spacing={'1rem'}>
                  <Box w={'100%'}>
                    <HStack
                      justifyContent={'flex-start'}
                      alignItems={'center'}
                      spacing={'2rem'}
                    >
                      <Box w={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.STATUS)}
                        </Text>
                      </Box>
                      <Box>
                        <RadioGroup
                          w={'100%'}
                          defaultValue={1}
                          value={Number(productInfo.status)}
                          onChange={(value) => {
                            handlePatchStatus(value);
                          }}
                        >
                          <HStack spacing={'1.5rem'} alignItems={'center'}>
                            <Box>
                              <HStack alignItems={'center'} spacing={'0.5rem'}>
                                <Radio value={1} />
                                <Box w={'5.375rem'}>
                                  <Text
                                    textAlign={'left'}
                                    color={'#485766'}
                                    fontSize={'1rem'}
                                    fontWeight={400}
                                    lineHeight={'1.75rem'}
                                  >
                                    {localeText(LANGUAGES.STATUS.ON_SALE)}
                                  </Text>
                                </Box>
                              </HStack>
                            </Box>
                            <Box>
                              <HStack alignItems={'center'} spacing={'0.5rem'}>
                                <Radio value={2} />
                                <Box w={'6.6875rem'}>
                                  <Text
                                    textAlign={'left'}
                                    color={'#485766'}
                                    fontSize={'1rem'}
                                    fontWeight={400}
                                    lineHeight={'1.75rem'}
                                  >
                                    {localeText(LANGUAGES.STATUS.STOP_SELLING)}
                                  </Text>
                                </Box>
                              </HStack>
                            </Box>
                            <Box>
                              <HStack alignItems={'center'} spacing={'0.5rem'}>
                                <Radio value={3} />
                                <Box w={'6.6875rem'}>
                                  <Text
                                    textAlign={'left'}
                                    color={'#485766'}
                                    fontSize={'1rem'}
                                    fontWeight={400}
                                    lineHeight={'1.75rem'}
                                  >
                                    {localeText(LANGUAGES.STATUS.OUT_OF_STOCK)}
                                  </Text>
                                </Box>
                              </HStack>
                            </Box>
                          </HStack>
                        </RadioGroup>
                      </Box>
                    </HStack>
                  </Box>

                  {promotionList.length > 0 && (
                    <Box w={'100%'}>
                      <HStack
                        justifyContent={'flex-start'}
                        alignItems={'flex-start'}
                        spacing={'2rem'}
                      >
                        <Box w={'12.5rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(
                              LANGUAGES.PRODUCTS.AFFILIATE_PROMOTIONS,
                            )}
                          </Text>
                        </Box>

                        <Box>
                          <VStack>
                            {promotionList.map((item, index) => {
                              return (
                                <Box w={'100%'} key={index}>
                                  <Text
                                    color={'#556A7E'}
                                    fontSize={'0.9375rem'}
                                    fontWeight={400}
                                    lineHeight={'1.5rem'}
                                  >
                                    {item.name}
                                  </Text>
                                </Box>
                              );
                            })}
                          </VStack>
                        </Box>
                      </HStack>
                    </Box>
                  )}

                  <Box w={'100%'}>
                    <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                      <Box w={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.PRODUCT_NAME)}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#556A7E'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {productInfo.name}
                        </Text>
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
                          {localeText(LANGUAGES.PRODUCTS.BRAND_NAME)}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#556A7E'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {productInfo.brandName}
                        </Text>
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
                          {localeText(LANGUAGES.PRODUCTS.MOCRA_FDA_APPROVED)}
                        </Text>
                      </Box>
                      <Center
                        px={'1rem'}
                        py={'0.5rem'}
                        borderRadius={'1.25rem'}
                        bg={'#D9E7EC'}
                      >
                        <Text
                          color={'#66809C'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {handleApproval(productInfo.approvalStatus)}
                        </Text>
                      </Center>
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
                          {localeText(LANGUAGES.PRODUCTS.CATEGORY)}
                        </Text>
                      </Box>
                      <Box>
                        <HStack spacing={'0.25rem'} alignItems={'center'}>
                          <Text
                            color={'#A7C3D2'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                            opacity={'0.7'}
                          >
                            {productInfo.firstCategoryName}
                          </Text>
                          {productInfo.secondCategoryName && (
                            <>
                              <Center w={'1rem'} h={'1rem'}>
                                <Img h={'100%'} src={IconRight.src} />
                              </Center>
                              <Text
                                color={
                                  productInfo?.thirdCategoryName
                                    ? '#A7C3D2'
                                    : '#556A7E'
                                }
                                fontSize={'0.9375rem'}
                                fontWeight={400}
                                lineHeight={'1.5rem'}
                              >
                                {productInfo.secondCategoryName}
                              </Text>
                            </>
                          )}
                          {productInfo.thirdCategoryName && (
                            <>
                              <Center w={'1rem'} h={'1rem'}>
                                <Img h={'100%'} src={IconRight.src} />
                              </Center>
                              <Text
                                color={'#556A7E'}
                                fontSize={'0.9375rem'}
                                fontWeight={400}
                                lineHeight={'1.5rem'}
                              >
                                {productInfo.thirdCategoryName}
                              </Text>
                            </>
                          )}
                        </HStack>
                      </Box>
                    </HStack>
                  </Box>

                  <Box w={'100%'}>
                    <HStack
                      alignItems={'flex-start'}
                      justifyContent={'flex-start'}
                      spacing={'2rem'}
                    >
                      <Box w={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.OPTION)}
                        </Text>
                      </Box>
                      <Box>
                        <VStack spacing={'0.75rem'}>
                          {productOptionList.map((item, index) => {
                            return (
                              <Box w={'100%'} key={index}>
                                <HStack
                                  spacing={'0.75rem'}
                                  alignItems={'center'}
                                >
                                  <Text
                                    color={'#66809C'}
                                    fontSize={'0.9375rem'}
                                    fontWeight={400}
                                    lineHeight={'1.5rem'}
                                    opacity={'0.7'}
                                  >
                                    {item.name}
                                  </Text>
                                </HStack>
                              </Box>
                            );
                          })}
                        </VStack>
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
                          {localeText(LANGUAGES.PRODUCTS.TYPE)}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#556A7E'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {getProductType(productInfo.type)}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                </VStack>
              </Box>
              <Divider borderTop={'1px solid #AEBDCA'} />
              <Box w={'100%'}>
                <VStack spacing={'0.75rem'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.PRODUCTS.REPRESENTATIVE_IMAGE)}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <HStack spacing={'0.5rem'}>
                      {productImageList.map((item, index) => {
                        return (
                          <Center w={'6.25rem'} aspectRatio={1} key={index}>
                            <ChakraImage
                              fallback={<DefaultSkeleton />}
                              w={'100%'}
                              h={'100%'}
                              objectFit={'cover'}
                              src={item.imageS3Url}
                            />
                          </Center>
                        );
                      })}
                    </HStack>
                  </Box>
                </VStack>
              </Box>
              <Box w={'100%'}>
                <VStack spacing={'0.75rem'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.PRODUCTS.DETAILED_DESCRIPTION)}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <VStack spacing={'2.5rem'}>
                      {productImageList.map((item, index) => {
                        return (
                          <Box w={'100%'} key={index}>
                            <ChakraImage
                              fallback={<DefaultSkeleton />}
                              objectFit={'cover'}
                              src={item.imageS3Url}
                            />
                          </Box>
                        );
                      })}
                      <Box w="100%">
                        <QuillViewer html={productInfo?.content || ''} />
                      </Box>
                    </VStack>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </Box>

          <Box w={'28.25rem'}>
            <VStack spacing={'1.25rem'}>
              <Box
                w={'100%'}
                p={'1.25rem'}
                border={'1px solid #AEBDCA'}
                boxSizing={'border-box'}
              >
                <VStack spacing={'1.25rem'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={500}
                      lineHeight={'1.96875rem'}
                    >
                      {localeText(LANGUAGES.PRODUCTS.SALES_INFORMATION)}
                    </Text>
                  </Box>
                  <Divider borderTop={'1px solid #AEBDCA'} />
                  <Box w={'100%'}>
                    <VStack spacing={'0.75rem'}>
                      <Box w={'100%'}>
                        <HStack justifyContent={'space-between'}>
                          <Box>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                            >
                              {localeText(LANGUAGES.PRODUCTS.MSRP)}
                            </Text>
                          </Box>
                          <Box>
                            <Text
                              color={'#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {utils.parseDallar(productInfo.msrp)}
                            </Text>
                          </Box>
                        </HStack>
                      </Box>
                      <Box w={'100%'}>
                        <HStack justifyContent={'space-between'}>
                          <Box>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                            >
                              {localeText(LANGUAGES.PRODUCTS.SUPPLY_PRICE)}
                            </Text>
                          </Box>
                          <Box>
                            <Text
                              color={'#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {utils.parseDallar(productInfo.wp)}
                            </Text>
                          </Box>
                        </HStack>
                      </Box>
                      <Box w={'100%'}>
                        <HStack justifyContent={'space-between'}>
                          <Box>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                            >
                              {localeText(
                                LANGUAGES.PRODUCTS.INVENTORY_QUANTITY,
                              )}
                            </Text>
                          </Box>
                          <Box>
                            <Text
                              color={'#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {utils.parseAmount(productInfo.stockCnt)}
                            </Text>
                          </Box>
                        </HStack>
                      </Box>
                      <Box w={'100%'}>
                        <HStack justifyContent={'space-between'}>
                          <Box>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                            >
                              {localeText(LANGUAGES.PRODUCTS.SALES_QUANTITY)}
                            </Text>
                          </Box>
                          <Box>
                            <Text
                              color={'#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {utils.parseAmount(productInfo.orderCnt)}
                            </Text>
                          </Box>
                        </HStack>
                      </Box>
                      <Box w={'100%'}>
                        <HStack justifyContent={'space-between'}>
                          <Box>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                            >
                              {localeText(LANGUAGES.PRODUCTS.INTEREST)}
                            </Text>
                          </Box>
                          <Box>
                            <Text
                              color={'#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {utils.parseAmount(productInfo.favoritesCnt)}
                            </Text>
                          </Box>
                        </HStack>
                      </Box>
                      <Box w={'100%'}>
                        <HStack justifyContent={'space-between'}>
                          <Box>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                            >
                              {localeText(LANGUAGES.PRODUCTS.CART)}
                            </Text>
                          </Box>
                          <Box>
                            <Text
                              color={'#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {utils.parseAmount(productInfo.cartCnt)}
                            </Text>
                          </Box>
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>
                </VStack>
              </Box>

              <Box
                w={'100%'}
                p={'1.25rem'}
                border={'1px solid #AEBDCA'}
                boxSizing={'border-box'}
              >
                <VStack spacing={'1.25rem'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={500}
                      lineHeight={'1.96875rem'}
                    >
                      {localeText(LANGUAGES.PRODUCTS.ABOUT_VENDORS)}
                    </Text>
                  </Box>
                  <Divider borderTop={'1px solid #AEBDCA'} />
                  <Box w={'100%'}>
                    <VStack spacing={'0.75rem'}>
                      <Box w={'100%'}>
                        <HStack
                          justifyContent={'space-between'}
                          spacing={'1rem'}
                        >
                          <Box minW={'max-content'}>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                            >
                              {localeText(LANGUAGES.PRODUCTS.MERCHANT_BRANDS)}
                            </Text>
                          </Box>
                          <Box>
                            <Text
                              color={'#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {productInfo.brandName}
                            </Text>
                          </Box>
                        </HStack>
                      </Box>
                      <Box w={'100%'}>
                        <HStack
                          justifyContent={'space-between'}
                          spacing={'1rem'}
                        >
                          <Box minW={'max-content'}>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                            >
                              {localeText(LANGUAGES.PRODUCTS.FEES)}
                            </Text>
                          </Box>
                          <Box>
                            <Text
                              color={'#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {`${productInfo.feeRate}%`}
                            </Text>
                          </Box>
                        </HStack>
                      </Box>
                      <Box w={'100%'}>
                        <HStack
                          justifyContent={'space-between'}
                          spacing={'1rem'}
                        >
                          <Box minW={'max-content'}>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                            >
                              {localeText(LANGUAGES.PRODUCTS.SHIPPING_METHOD)}
                            </Text>
                          </Box>
                          <Box>
                            <Text
                              color={'#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {handleShippingMethod(
                                productInfo.defaultShipping,
                              )}
                            </Text>
                          </Box>
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>
                </VStack>
              </Box>

              <Box
                w={'100%'}
                p={'1.25rem'}
                border={'1px solid #AEBDCA'}
                boxSizing={'border-box'}
              >
                <VStack spacing={'1.25rem'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={500}
                      lineHeight={'1.96875rem'}
                    >
                      {localeText(
                        LANGUAGES.PRODUCTS.DISCOUNT_PER_UNIT_PURCHASE_FEATURE,
                      )}
                    </Text>
                  </Box>

                  <Divider borderTop={'1px solid #AEBDCA'} />

                  <Box w={'100%'}>
                    <VStack spacing={'0.75rem'}>
                      <Box w={'100%'}>
                        <HStack
                          justifyContent={'space-between'}
                          spacing={'1rem'}
                        >
                          <Box minW={'max-content'}>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                            >
                              {localeText(LANGUAGES.PRODUCTS.CONDITIONS)}
                            </Text>
                          </Box>
                          <Box>
                            <VStack>
                              {productDiscountList.map((item, index) => {
                                return (
                                  <Box key={index}>
                                    <Text
                                      color={'#556A7E'}
                                      fontSize={'1rem'}
                                      fontWeight={400}
                                      lineHeight={'1.75rem'}
                                    >
                                      {localeText(
                                        LANGUAGES.INFO_MSG.DISCOUNT_MSG_TYPE1,
                                        {
                                          key: '@PRICE@',
                                          value: utils.parseDallar(item.amount),
                                        },
                                        {
                                          key: '@EA@',
                                          value: utils.parseAmount(
                                            item.discountCnt,
                                          ),
                                        },
                                      )}
                                    </Text>
                                  </Box>
                                );
                              })}
                            </VStack>
                          </Box>
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </HStack>
        <ContentBR h={'1.25rem'} />
      </Box>
    </MainContainer>
  );
};

export default ProductsDetailPage;
