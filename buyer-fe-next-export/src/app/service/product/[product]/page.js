'use client';

import {
  Box,
  Center,
  HStack,
  Image as ChakraImage,
  Text,
  VStack,
  Button,
  Select,
  Divider,
  Input,
} from '@chakra-ui/react';

import { ChevronDownIcon } from '@chakra-ui/icons';

import { use, useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CustomIcon } from '@/components';

import MainTopHeader from '@/components/custom/header/MainTopHeader';
import ContentBR from '@/components/custom/ContentBR';
import { ChevronRightIcon } from '@chakra-ui/icons';
import StarRating from '@/components/common/StarRating';
import Footer from '@/components/common/custom/Footer';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import utils from '@/utils';
import { NO_DATA_ERROR, SUCCESS } from '@/constants/errorCode';
import productApi from '@/services/productApi';
import ProductBottomInfo from '@/components/custom/product/ProductBottomInfo';
import productFavoritesApi from '@/services/productFavoritesApi';
import useModal from '@/hooks/useModal';
import productCartApi from '@/services/productCartApi';
import { MY_CART, SERVICE } from '@/constants/pageURL';
import useOrders from '@/hooks/useOrders';
import { useRecoilState, useRecoilValue } from 'recoil';
import useMove from '@/hooks/useMove';
import { isOrderAddFlagState, productOrderState } from '@/stores/orderRecoil';
import MainContainer from '@/components/layout/MainContainer';
import useDevice from '@/hooks/useDevice';

const ProductPage = () => {
  const { isMobile, clampW } = useDevice();
  const isLogin = utils.getIsLogin();
  const { moveBack, moveBrand, moveOrders, moveBrandProduct } = useMove();
  const router = useRouter();
  const [isOrderAddFlag, setIsOrderAddFlag] =
    useRecoilState(isOrderAddFlagState);
  const [productOrder, setProductOrder] = useRecoilState(productOrderState);
  const { openModal } = useModal();
  const { localeText } = useLocale();
  const { product } = useParams();

  const [productInfo, setProductInfo] = useState({});
  const [selectedOption, setSelectedOption] = useState(0);
  const [productOptionList, setProductOptionList] = useState([]);
  const [productDiscountList, setProductDiscountList] = useState([]);

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [productImageList, setProductImageList] = useState([]);

  const [stockCnt, setStockCnt] = useState(0);
  const [stockFlag, setStockFlag] = useState(0);
  const [count, setCount] = useState(1); // 초기값을 1로 설정
  const [isSoldOut, setIsSoldOut] = useState(false);

  useEffect(() => {
    if (product) {
      handleGetProduct();
    }
  }, [product]);

  const handleGetProduct = useCallback(async () => {
    const param = {
      productId: Number(product),
      clientIp: await utils.fetchIp(),
    };
    const result = await productApi.getProduct(param);

    if (result?.errorCode === SUCCESS) {
      const tempProductInfo = { ...result.data, productId: Number(product) };
      setProductImageList(tempProductInfo.productImageList);
      setProductDiscountList(tempProductInfo.productDiscountList);
      if (tempProductInfo?.productOptionList) {
        setProductOptionList(tempProductInfo.productOptionList);
      }
      setStockFlag(tempProductInfo?.stockFlag);
      setStockCnt(tempProductInfo?.stockCnt || 0);

      if (tempProductInfo?.stockFlag === 1 && tempProductInfo?.stockCnt === 0) {
        setIsSoldOut(true);
        setTimeout(() => {
          openModal({
            text: localeText(LANGUAGES.INFO_MSG.PRODUCT_OUT_STOCK),
          });
        }, 200);
      } else {
        setIsSoldOut(false);
      }

      setProductInfo(tempProductInfo);
    } else if (result?.errorCode === NO_DATA_ERROR) {
      openModal({
        text: result.message,
        onAgree: () => {
          router.back();
        },
      });
    }
  });

  const increment = () => {
    if (stockFlag === 2 || count < stockCnt) {
      setCount(count + 1);
    } else {
      setTimeout(() => {
        openModal({
          text: localeText(LANGUAGES.INFO_MSG.MAXIMUM_ORDER_COUNT, {
            key: '@COUNT@',
            value: utils.parseAmount(stockCnt),
          }),
        });
      }, 200);
      setCount(stockCnt);
    }
  };

  const decrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const handleBuyNow = useCallback(() => {
    if (!productInfo) return;

    const minOrderCnt = productInfo?.minOrderCnt || 0;
    if (minOrderCnt > count) {
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.MINIMUM_ORDER_COUNT, {
          key: '@COUNT@',
          value: utils.parseAmount(minOrderCnt),
        }),
      });
      return;
    }

    if (productOptionList.length > 0 && Number(selectedOption) === 0) {
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.SELECT_AN_PURCHASE_OPTION),
      });
      return;
    }
    /*
    if (selectedOption === 0) {
      openModal({ text: localeText(LANGUAGES.INFO_MSG.SELECT_AN_OPTION) });
      return;
    }
    */

    const productImageList =
      productInfo?.productImageList || productInfo?.productImages || [];
    let orderProduct = {
      productId: productInfo.productId,
      brandName: productInfo.brandName,
      name: productInfo.name,
      productImageList: productImageList,
      count: count,
    };

    orderProduct.stockFlag = productInfo?.stockFlag;
    if (productInfo?.stockFlag === 1) {
      orderProduct.stockCnt = productInfo.stockCnt;
    }

    const targetSelectOption = productOptionList.find(
      (option) => option.productOptionId === Number(selectedOption),
    );
    if (targetSelectOption) {
      const ordersProductOptionList = [];
      const ordersProductOption = {
        productOptionId: targetSelectOption.productOptionId,
        name: targetSelectOption.name,
        unitPrice: targetSelectOption.price,
        totalPrice: targetSelectOption.price,
      };
      ordersProductOptionList.push(ordersProductOption);
      orderProduct.ordersProductOptionList = ordersProductOptionList;

      orderProduct.totalPrice =
        (Number(productInfo.wp) + Number(targetSelectOption.price)) * count;

      orderProduct.unitPrice =
        Number(productInfo.wp) + Number(targetSelectOption.price);
    } else {
      orderProduct.totalPrice = Number(productInfo.wp) * count;
      orderProduct.unitPrice = productInfo.wp;
    }

    if (productDiscountList?.length > 0) {
      orderProduct.productDiscountList = productDiscountList;
    }

    const buyParam = {
      sellerUserId: productInfo.sellerUserId,
      minimumOrderAmount: productInfo.minimumOrderAmount,
      ordersProductList: [orderProduct],
    };

    setProductOrder(buyParam);
    setTimeout(() => {
      moveOrders();
    }, 200);
  }, [productInfo, count, selectedOption]);

  const handleToggleFavorite = useCallback(async (isFavorite) => {
    const param = {};
    let result = null;
    if (isFavorite === 2) {
      param.productId = Number(product);
      result = await productFavoritesApi.deleteProductFavorites(param);
      if (result?.errorCode === 0) {
        handleRemoveFavorite();
      }
    } else {
      param.productId = Number(product);
      result = await productFavoritesApi.postProductFavorites(param);
      if (result?.errorCode === 0) {
        handleAddFavorite();
      }
    }
  });

  const handleAddFavorite = useCallback(async () => {
    const temp = { ...productInfo, isFavorite: 2 };
    setProductInfo(temp);
  });

  const handleRemoveFavorite = useCallback(async () => {
    const temp = { ...productInfo, isFavorite: 1 };
    setProductInfo(temp);
  });

  const handleAddOrder = () => {
    if (productOptionList.length > 0 && Number(selectedOption) === 0) {
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.SELECT_AN_PURCHASE_OPTION),
      });
      return;
    }
    const productImageList =
      productInfo?.productImageList || productInfo?.productImages || [];
    let orderProduct = {
      productId: productInfo.productId,
      brandName: productInfo.brandName,
      name: productInfo.name,
      productImageList: productImageList,
      count: count,
    };

    orderProduct.stockFlag = stockFlag;
    if (stockCnt) {
      orderProduct.stockCnt = stockCnt;
    }

    const targetSelectOption = productOptionList.find(
      (option) => option.productOptionId === Number(selectedOption),
    );
    if (targetSelectOption) {
      const ordersProductOptionList = [];
      const ordersProductOption = {
        productOptionId: targetSelectOption.productOptionId,
        name: targetSelectOption.name,
        unitPrice: targetSelectOption.price,
        totalPrice: targetSelectOption.price,
      };
      ordersProductOptionList.push(ordersProductOption);
      orderProduct.ordersProductOptionList = ordersProductOptionList;

      orderProduct.totalPrice =
        (Number(productInfo.wp) + Number(targetSelectOption.price)) * count;

      orderProduct.unitPrice =
        Number(productInfo.wp) + Number(targetSelectOption.price);
    } else {
      orderProduct.totalPrice = Number(productInfo.wp) * count;
      orderProduct.unitPrice = productInfo.wp;
    }

    if (productInfo?.productDiscountList?.length > 0) {
      orderProduct.productDiscountList = productInfo.productDiscountList;
    }

    let finalSellerUserId = productInfo.sellerUserId;
    let orders = [];
    if (productOrder) {
      if (productInfo.sellerUserId !== productOrder.sellerUserId) {
        openModal({
          type: 'confirm',
          text: localeText(LANGUAGES.INFO_MSG.ORDER_CANCEL_AND_ADD),
          onAgree: () => {
            setIsOrderAddFlag(false);
            finalSellerUserId = productInfo.sellerUserId;
            orders = [orderProduct];
          },
        });
      } else {
        finalSellerUserId = productInfo.sellerUserId;
        const tempOrdersProductList = [
          ...(productOrder?.ordersProductList || []),
        ];

        const existIndex = tempOrdersProductList.findIndex(
          (p) => p.productId === orderProduct.productId,
        );

        if (existIndex > -1) {
          const existItem = tempOrdersProductList[existIndex];
          let newCount = existItem.count + orderProduct.count;

          if (stockCnt) {
            newCount = Math.min(
              Number(stockCnt),
              existItem.count + orderProduct.count,
            );
          }

          tempOrdersProductList[existIndex] = {
            ...existItem,
            count: newCount,
            totalPrice: newCount * existItem.unitPrice,
          };
        } else {
          tempOrdersProductList.push(orderProduct);
        }
        orders = tempOrdersProductList;
      }
    }

    const buyParam = {
      sellerUserId: finalSellerUserId,
      minimumOrderAmount: productInfo.minimumOrderAmount,
      ordersProductList: orders,
    };

    setProductOrder(buyParam);
    setTimeout(() => {
      if (isOrderAddFlag) {
        moveBrandProduct();
      } else {
        moveOrders();
      }
    }, 200);
  };

  const handleAddCart = useCallback(async () => {
    const minOrderCnt = productInfo?.minOrderCnt || 0;
    if (minOrderCnt > count) {
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.MINIMUM_ORDER_COUNT, {
          key: '@COUNT@',
          value: utils.parseAmount(minOrderCnt),
        }),
      });
      return;
    }

    if (productOptionList.length > 0 && Number(selectedOption) === 0) {
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.SELECT_AN_PURCHASE_OPTION),
      });
      return;
    }
    /*
    if (selectedOption === 0) {
      openModal({ text: localeText(LANGUAGES.INFO_MSG.SELECT_AN_OPTION) });
      return;
    }
    */
    const param = {
      productId: Number(product),
      count: count,
    };
    if (Number(selectedOption) !== 0 && productOptionList.length > 0) {
      const option = {
        productOptionId: Number(selectedOption),
      };
      param.productOptionList = [option];
    } else {
      param.productOptionList = [];
    }
    const result = await productCartApi.postProductCart(param);
    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result.message,
        onAgree: () => {
          setTimeout(() => {
            openModal({
              type: 'confirm',
              text: localeText(LANGUAGES.INFO_MSG.MOVE_CART),
              onAgreeText: localeText(LANGUAGES.COMMON.MOVE),
              onAgree: () => {
                router.push(MY_CART.CART);
              },
            });
          }, 50);
        },
      });
    }
  });

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

  return isMobile(true) ? (
    <MainContainer>
      <Center w={'100%'} h={'100%'}>
        <VStack w={'100%'} spacing={0} h={'100%'} mb={'5.5rem'}>
          <MainTopHeader />

          {/* content */}
          <Box w={'100%'}>
            <Box w={'100%'} minH={'20vh'} h={'auto'} position={'relative'}>
              {productInfo?.promotionName && (
                <Center
                  minW={'clamp(6rem, 7rem, 8rem)'}
                  position={'absolute'}
                  left={'0.75rem'}
                  bottom={'0.75rem'}
                  borderRadius={'5rem'}
                  p={'0.75rem'}
                  bg={'#66809C'}
                >
                  <Text
                    color={'#FFF'}
                    fontSize={'clamp(1.5rem, 2vw, 3rem)'}
                    fontWeight={500}
                  >
                    {productInfo.promotionName}
                  </Text>
                </Center>
              )}
              <ChakraImage
                fallback={<DefaultSkeleton />}
                w={'100%'}
                h={'100%'}
                objectFit={'cover'}
                src={productImageList[selectedImageIdx]?.imageS3Url}
              />
            </Box>

            <ContentBR h={'0.5rem'} />

            <Box w={'100%'} overflowX={'auto'}>
              <HStack>
                {productImageList.map((image, index) => {
                  return (
                    <Box
                      cursor={'pointer'}
                      onClick={() => {
                        setSelectedImageIdx(index);
                      }}
                      key={index}
                      minW={clampW(5, 6.25)}
                      w={clampW(5, 6.25)}
                      opacity={selectedImageIdx !== index ? '0.5' : null}
                      aspectRatio={1 / 1}
                    >
                      <ChakraImage
                        fallback={<DefaultSkeleton />}
                        w={'100%'}
                        h={'100%'}
                        objectFit={'cover'}
                        src={image?.imageS3Url}
                      />
                    </Box>
                  );
                })}
              </HStack>
            </Box>

            <ContentBR h={'1.5rem'} />

            <Box w={'100%'} px={clampW(1, 10)}>
              <VStack spacing={'1.5rem'}>
                <Box w={'100%'}>
                  <VStack spacing={'1.25rem'}>
                    <Box
                      alignSelf={'flex-start'}
                      cursor={'pointer'}
                      onClick={() => {
                        moveBrand(productInfo.sellerUserId);
                      }}
                    >
                      <HStack alignContent={'center'}>
                        <Text
                          color={'#66809C'}
                          fontSize={'1.25rem'}
                          lineHeight={'2.25rem'}
                          fontWeight={400}
                        >
                          {productInfo.brandName}
                        </Text>
                        <ChevronRightIcon
                          w={'1.5rem'}
                          h={'1.5rem'}
                          color={'#66809C'}
                        />
                      </HStack>
                    </Box>

                    <Box w={'100%'}>
                      <VStack spacing={'0.5rem'}>
                        <Box w={'100%'}>
                          <HStack
                            justifyContent={'space-between'}
                            alignItems={'center'}
                          >
                            <Box>
                              <Text
                                color={'#485766'}
                                fontSize={'2.25rem'}
                                fontWeight={400}
                                lineHeight={'3.2625rem'}
                              >
                                {productInfo.name}
                              </Text>
                            </Box>
                            {isLogin && (
                              <Box
                                cursor={'pointer'}
                                onClick={() => {
                                  handleToggleFavorite(productInfo.isFavorite);
                                }}
                                w={'2rem'}
                                h={'2rem'}
                              >
                                <CustomIcon
                                  name={
                                    productInfo.isFavorite === 2
                                      ? 'heartFill'
                                      : 'heart'
                                  }
                                  w={'100%'}
                                  h={'100%'}
                                  color={'#556A7E'}
                                />
                              </Box>
                            )}
                          </HStack>
                        </Box>

                        <Box w={'100%'}>
                          <HStack spacing={'0.5rem'}>
                            <Text
                              color={'#485766'}
                              fontSize={'1.125rem'}
                              fontWeight={400}
                              lineHeight={'1.96875rem'}
                            >
                              {`${utils.parseAmount(productInfo?.totalReviewCnt)} ${localeText(LANGUAGES.REVIEWS)}`}
                            </Text>
                            <Box>
                              <StarRating
                                initialRating={productInfo.rating}
                                w={'1.5rem'}
                                h={'1.5rem'}
                              />
                            </Box>
                            <Box>
                              <Text
                                color={'#66809C'}
                                fontSize={'1.25rem'}
                                fontWeight={400}
                                lineHeight={'2.25rem'}
                              >{`(${productInfo.rating})`}</Text>
                            </Box>
                          </HStack>
                        </Box>
                      </VStack>
                    </Box>

                    <Box w={'100%'}>
                      <VStack spacing={'0.5rem'}>
                        <Box w={'100%'}>
                          <Text
                            color={'#66809C'}
                            fontSize={'1.25rem'}
                            fontWeight={400}
                            lineHeight={'2.25rem'}
                          >
                            {`${localeText(LANGUAGES.MSRP)} ${utils.parseDallar(productInfo.msrp)}`}
                          </Text>
                          {isLogin && (
                            <Text
                              color={'#485766'}
                              fontSize={'3rem'}
                              fontWeight={600}
                              lineHeight={'4.5rem'}
                            >
                              {utils.parseDallar(productInfo.wp)}
                            </Text>
                          )}
                        </Box>
                        {isLogin && (
                          <Box w="100%">
                            <Box w={'100%'}>
                              <HStack spacing={'0.5rem'}>
                                <Text
                                  color={'#7895B2'}
                                  fontSize={'1.125rem'}
                                  fontWeight={400}
                                  lineHeight={'1.96875rem'}
                                >
                                  {localeText(LANGUAGES.PURCHASE_MINIMUM)}
                                </Text>
                                <Text
                                  color={'#7895B2'}
                                  fontSize={'1.125rem'}
                                  fontWeight={500}
                                  lineHeight={'1.96875rem'}
                                >
                                  {utils.parseDallar(
                                    productInfo.minimumOrderAmount,
                                  )}
                                </Text>
                              </HStack>
                            </Box>
                            <Box w={'100%'}>
                              <HStack spacing={'0.5rem'}>
                                <Text
                                  color={'#7895B2'}
                                  fontSize={'1.125rem'}
                                  fontWeight={400}
                                  lineHeight={'1.96875rem'}
                                >
                                  {localeText(LANGUAGES.PURCHASE_MINIMUM_COUNT)}
                                </Text>
                                <Text
                                  color={'#7895B2'}
                                  fontSize={'1.125rem'}
                                  fontWeight={500}
                                  lineHeight={'1.96875rem'}
                                >
                                  {utils.parseAmount(productInfo.minOrderCnt)}
                                </Text>
                              </HStack>
                            </Box>
                          </Box>
                        )}
                      </VStack>
                    </Box>
                  </VStack>
                </Box>

                <Divider borderTop={'1px solid #73829D'} />

                <Box w={'100%'}>
                  <VStack spacing={'1rem'}>
                    {productInfo?.type && (
                      <Box w={'100%'}>
                        <HStack spacing={'0.75rem'}>
                          <Text
                            color={'#485766'}
                            fontSize={'1.125rem'}
                            fontWeight={400}
                            lineHeight={'1.96875rem'}
                            whiteSpace={'pre-wrap'}
                          >
                            {localeText(LANGUAGES.TYPE)}
                          </Text>
                          <Text
                            color={'#485766'}
                            fontSize={'1.125rem'}
                            fontWeight={400}
                            lineHeight={'1.96875rem'}
                            whiteSpace={'pre-wrap'}
                          >
                            {getProductType(productInfo.type)}
                          </Text>
                        </HStack>
                      </Box>
                    )}
                  </VStack>
                </Box>

                <Divider borderTop={'1px solid #AEBDCA'} />

                <Box w={'100%'}>
                  <VStack spacing={'2rem'}>
                    {productDiscountList.length > 0 && (
                      <>
                        <Box w="100%">
                          <VStack spacing={'2rem'}>
                            <Box w={'100%'}>
                              <HStack justifyContent={'space-between'}>
                                <Box w="100%">
                                  <Text
                                    color={'#485766'}
                                    fontSize={'1.25rem'}
                                    fontWeight={500}
                                    lineHeight={'2.25rem'}
                                  >
                                    {localeText(
                                      LANGUAGES.ORDER.DISCOUNT_EVENTS,
                                    )}
                                  </Text>
                                </Box>
                                <Box>
                                  <ChevronDownIcon w={'1.5rem'} h={'1.5rem'} />
                                </Box>
                              </HStack>
                            </Box>
                            <Box w={'100%'}>
                              <VStack>
                                {productDiscountList.map(
                                  (item, discountIndex) => {
                                    const type = item.type;
                                    const amount = item.amount;
                                    const discountCnt = item.discountCnt;
                                    return (
                                      <Box key={discountIndex} w={'100%'}>
                                        <Text
                                          color={'#556A7E'}
                                          fontSize={'1rem'}
                                          fontWeight={500}
                                          lineHeight={'1.75rem'}
                                        >
                                          {localeText(
                                            LANGUAGES.INFO_MSG
                                              .DISCOUNT_MSG_TYPE,
                                            {
                                              key: '@PRICE@',
                                              value:
                                                type === 1
                                                  ? `${amount}%`
                                                  : utils.parseDallar(amount),
                                            },
                                            {
                                              key: '@EA@',
                                              value:
                                                utils.parseAmount(discountCnt),
                                            },
                                          )}
                                        </Text>
                                      </Box>
                                    );
                                  },
                                )}
                              </VStack>
                            </Box>
                          </VStack>
                        </Box>
                        <Divider borderTop={'1px solid #AEBDCA'} />
                      </>
                    )}

                    {isLogin && (
                      <Box w={'100%'}>
                        <VStack spacing={'1.25rem'}>
                          {productOptionList.length > 0 && (
                            <Box w={'100%'}>
                              <HStack justifyContent={'space-between'}>
                                <Box w={clampW(4.625, 9)}>
                                  <Text
                                    color={'#485766'}
                                    fontSize={clampW(0.9375, 1.25)}
                                    fontWeight={500}
                                    lineHeight={'160%'}
                                  >
                                    {localeText(
                                      LANGUAGES.ORDER.SELECT_AN_OPTION,
                                    )}
                                  </Text>
                                </Box>
                                <Box w={clampW(14, 25)}>
                                  <Select
                                    border={'1px solid #9CADBE'}
                                    w={'100%'}
                                    h={'3rem'}
                                    value={selectedOption}
                                    onChange={(e) => {
                                      setSelectedOption(e.target.value);
                                    }}
                                    color={'#485766'}
                                    fontSize={clampW(0.9375, 1.25)}
                                    fontWeight={'400'}
                                    lineHeight={'160%'}
                                  >
                                    <option value={0}>
                                      {localeText(
                                        LANGUAGES.INFO_MSG.SELECT_AN_OPTION,
                                      )}
                                    </option>
                                    {productOptionList.map((option, index) => {
                                      return (
                                        <option
                                          key={index}
                                          value={option.productOptionId}
                                        >
                                          {option.name}
                                        </option>
                                      );
                                    })}
                                  </Select>
                                </Box>
                              </HStack>
                            </Box>
                          )}

                          {!isSoldOut ? (
                            <Box w={'100%'}>
                              <HStack justifyContent={'space-between'}>
                                <Box w={clampW(4.625, 9)}>
                                  <Text
                                    color={'#485766'}
                                    fontSize={clampW(0.9375, 1.25)}
                                    fontWeight="500"
                                    lineHeight={'160%'}
                                  >
                                    {localeText(
                                      LANGUAGES.ORDER.SELECT_QUANTITY,
                                    )}
                                  </Text>
                                </Box>
                                <Box w={clampW(14, 25)}>
                                  <HStack
                                    h="3.75rem"
                                    px="0.75rem"
                                    py="1rem"
                                    background="#FFF"
                                    borderRadius="0.25rem"
                                    border="1px solid #9CADBE"
                                    spacing="1.25rem"
                                    justifyContent="space-between"
                                  >
                                    <Box
                                      w="1.25rem"
                                      h="1.25rem"
                                      cursor="pointer"
                                      onClick={() => {
                                        decrement();
                                      }}
                                    >
                                      <CustomIcon
                                        name="minus"
                                        color="#7895B2"
                                      />
                                    </Box>

                                    <Input
                                      value={count}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        if (Number(val) < 1) {
                                          setCount(1);
                                        } else if (Number(val) < stockCnt) {
                                          if (/^\d*$/.test(val)) {
                                            setCount(Number(val)); // setCount는 상태 업데이트 함수
                                          }
                                        } else {
                                          setTimeout(() => {
                                            openModal({
                                              text: localeText(
                                                LANGUAGES.INFO_MSG
                                                  .MAXIMUM_ORDER_COUNT,
                                                {
                                                  key: '@COUNT@',
                                                  value:
                                                    utils.parseAmount(stockCnt),
                                                },
                                              ),
                                            });
                                          }, 200);
                                          setCount(Number(stockCnt));
                                        }
                                      }}
                                      border={0}
                                      textAlign="center"
                                      color="#485766"
                                      fontSize="1rem"
                                      fontWeight={400}
                                      lineHeight="1.75rem"
                                      variant="unstyled"
                                      px={0}
                                    />

                                    <Box
                                      w="1.25rem"
                                      h="1.25rem"
                                      cursor="pointer"
                                      onClick={() => {
                                        increment();
                                      }}
                                    >
                                      <CustomIcon name="plus" color="#7895B2" />
                                    </Box>
                                  </HStack>
                                </Box>
                              </HStack>
                            </Box>
                          ) : (
                            <Text
                              color="#000"
                              fontSize={'1.5rem'}
                              fontWeight="400"
                              lineHeight={'2.25rem'}
                            >
                              {localeText(LANGUAGES.ORDER.OUT_OF_STOCK)}
                            </Text>
                          )}
                        </VStack>
                      </Box>
                    )}
                  </VStack>
                </Box>
              </VStack>
            </Box>

            <ContentBR h={'2rem'} />

            {productInfo?.productId && (
              <ProductBottomInfo
                productInfo={productInfo}
                setProductInfo={setProductInfo}
                productImageList={productImageList}
              />
            )}
          </Box>
        </VStack>

        {isLogin && !isSoldOut && (
          <Box
            position={'fixed'}
            bottom={0}
            w={'100%'}
            h={'5.5rem'}
            p={'1rem'}
            borderTop={'1px solid #AEBDCA'}
            bg={'#FFF'}
          >
            {isOrderAddFlag ? (
              <Box w={'100%'} h={'3.5rem'}>
                <Button
                  onClick={() => {
                    handleAddOrder();
                  }}
                  borderRadius={'0.25rem'}
                  bg={'#7895B2'}
                  h={'100%'}
                  w={'100%'}
                >
                  <Text
                    color="white"
                    fontSize={'1.25rem'}
                    fontWeight="400"
                    lineHeight={'2.25rem'}
                  >
                    {localeText(LANGUAGES.ORDER.ADD_ORDER)}
                  </Text>
                </Button>
              </Box>
            ) : (
              <HStack h={'3.5rem'}>
                <Box w={'50%'} h={'100%'}>
                  <Button
                    onClick={() => {
                      handleAddCart();
                    }}
                    borderRadius={'0.25rem'}
                    border="1px solid #73829D"
                    h={'100%'}
                    w={'100%'}
                  >
                    <Text
                      color={'#556A7E'}
                      fontSize={'1.25rem'}
                      fontWeight="400"
                      lineHeight={'2.25rem'}
                    >
                      {localeText(LANGUAGES.ORDER.SHOPPING_CART)}
                    </Text>
                  </Button>
                </Box>
                <Box w={'50%'} h={'100%'}>
                  <Button
                    onClick={() => {
                      handleBuyNow();
                    }}
                    borderRadius={'0.25rem'}
                    bg={'#7895B2'}
                    h={'100%'}
                    w={'100%'}
                  >
                    <Text
                      color="white"
                      fontSize={'1.25rem'}
                      fontWeight="400"
                      lineHeight={'2.25rem'}
                    >
                      {localeText(LANGUAGES.ORDER.BUY_NOW)}
                    </Text>
                  </Button>
                </Box>
              </HStack>
            )}
          </Box>
        )}
      </Center>
    </MainContainer>
  ) : (
    <MainContainer>
      <Center w={'100%'}>
        <VStack w={'100%'} maxW={1920} spacing={0}>
          <MainTopHeader />

          {/* content */}
          <Box w={'100%'} py={'5rem'}>
            <HStack
              spacing={0}
              justifyContent={'space-between'}
              alignItems={'flex-start'}
            >
              <Box minW={'50rem'} w={'60rem'}>
                <HStack spacing={0} alignItems={'flex-start'}>
                  <Box minW={'6.25rem'} w={'100%'} maxW={'10rem'}>
                    <VStack w={'100%'} spacing={0}>
                      {productImageList.map((image, index) => {
                        return (
                          <Box
                            cursor={'pointer'}
                            onClick={() => {
                              setSelectedImageIdx(index);
                            }}
                            key={index}
                            minW={'6.25rem'}
                            w={'10rem'}
                            opacity={selectedImageIdx !== index ? '0.5' : null}
                            aspectRatio={1 / 1}
                          >
                            <ChakraImage
                              fallback={<DefaultSkeleton />}
                              w={'100%'}
                              h={'100%'}
                              objectFit={'cover'}
                              src={image?.imageS3Url}
                            />
                          </Box>
                        );
                      })}
                    </VStack>
                  </Box>
                  <Box
                    position={'relative'}
                    minW={'40rem'}
                    w={'100%'}
                    maxW={'50rem'}
                    aspectRatio={1 / 1}
                  >
                    {productInfo?.promotionName && (
                      <Center
                        minW={'8rem'}
                        position={'absolute'}
                        left={'0.75rem'}
                        bottom={'0.75rem'}
                        borderRadius={'5rem'}
                        p={'0.75rem'}
                        bg={'#66809C'}
                      >
                        <Text
                          color={'#FFF'}
                          fontSize={'clamp(2.2rem, 2vw, 3rem)'}
                          fontWeight={500}
                        >
                          {productInfo.promotionName}
                          {/* {'안녕하세요 반갑습니다'} */}
                        </Text>
                      </Center>
                    )}
                    <ChakraImage
                      fallback={<DefaultSkeleton />}
                      w={'100%'}
                      h={'100%'}
                      objectFit={'cover'}
                      src={productImageList[selectedImageIdx]?.imageS3Url}
                    />
                  </Box>
                </HStack>
              </Box>
              <Box minW={'40rem'} w={'60rem'} pl={'3rem'} pr={'10rem'}>
                <VStack spacing={'2rem'}>
                  <Box
                    w={'100%'}
                    cursor={'pointer'}
                    onClick={() => {
                      moveBrand(productInfo.sellerUserId);
                    }}
                  >
                    <HStack alignContent={'center'}>
                      <Text
                        color={'#66809C'}
                        fontSize={'1.25rem'}
                        lineHeight={'2.25rem'}
                        fontWeight={400}
                      >
                        {productInfo.brandName}
                      </Text>
                      <ChevronRightIcon
                        w={'1.5rem'}
                        h={'1.5rem'}
                        color={'#66809C'}
                      />
                    </HStack>
                  </Box>

                  <Box w={'100%'}>
                    <VStack spacing={'0.5rem'}>
                      <Box w={'100%'}>
                        <HStack
                          justifyContent={'space-between'}
                          alignItems={'center'}
                        >
                          <Box>
                            <Text
                              color={'#485766'}
                              fontSize={'2.25rem'}
                              fontWeight={400}
                              lineHeight={'3.2625rem'}
                            >
                              {productInfo.name}
                            </Text>
                          </Box>
                          {isLogin && (
                            <Box
                              cursor={'pointer'}
                              onClick={() => {
                                handleToggleFavorite(productInfo.isFavorite);
                              }}
                              w={'2rem'}
                              h={'2rem'}
                            >
                              <CustomIcon
                                name={
                                  productInfo.isFavorite === 2
                                    ? 'heartFill'
                                    : 'heart'
                                }
                                w={'100%'}
                                h={'100%'}
                                color={'#556A7E'}
                              />
                            </Box>
                          )}
                        </HStack>
                      </Box>
                      <Box w={'100%'}>
                        <HStack spacing={'0.5rem'}>
                          <Text
                            color={'#485766'}
                            fontSize={'1.125rem'}
                            fontWeight={400}
                            lineHeight={'1.96875rem'}
                          >
                            {`${utils.parseAmount(productInfo?.totalReviewCnt)} ${localeText(LANGUAGES.REVIEWS)}`}
                          </Text>
                          <Box>
                            <StarRating
                              initialRating={productInfo.rating}
                              w={'1.5rem'}
                              h={'1.5rem'}
                            />
                          </Box>
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>

                  <Box w={'100%'}>
                    <HStack
                      alignItems={'flex-end'}
                      justifyContent={'space-between'}
                    >
                      <Box w={'50%'}>
                        <VStack w={'100%'} spacing={0}>
                          <Box w={'100%'}>
                            <Text
                              color={'#66809C'}
                              fontSize={'1.25rem'}
                              fontWeight={400}
                              lineHeight={'2.25rem'}
                            >
                              {`${localeText(LANGUAGES.MSRP)} ${utils.parseDallar(productInfo.msrp)}`}
                            </Text>
                          </Box>
                          {isLogin && (
                            <Box w={'100%'}>
                              <Text
                                color={'#485766'}
                                fontSize={'3rem'}
                                fontWeight={600}
                                lineHeight={'4.5rem'}
                              >
                                {utils.parseDallar(productInfo.wp)}
                              </Text>
                            </Box>
                          )}
                        </VStack>
                      </Box>
                    </HStack>
                  </Box>

                  {isLogin && (
                    <Box w="100%">
                      <VStack>
                        <Box w={'100%'}>
                          <HStack spacing={'0.5rem'}>
                            <Text
                              color={'#7895B2'}
                              fontSize={'1.125rem'}
                              fontWeight={400}
                              lineHeight={'1.96875rem'}
                            >
                              {localeText(LANGUAGES.PURCHASE_MINIMUM)}
                            </Text>
                            <Text
                              color={'#7895B2'}
                              fontSize={'1.125rem'}
                              fontWeight={500}
                              lineHeight={'1.96875rem'}
                            >
                              {utils.parseDallar(
                                productInfo.minimumOrderAmount,
                              )}
                            </Text>
                          </HStack>
                        </Box>
                        <Box w={'100%'}>
                          <HStack spacing={'0.5rem'}>
                            <Text
                              color={'#7895B2'}
                              fontSize={'1.125rem'}
                              fontWeight={400}
                              lineHeight={'1.96875rem'}
                            >
                              {localeText(LANGUAGES.PURCHASE_MINIMUM_COUNT)}
                            </Text>
                            <Text
                              color={'#7895B2'}
                              fontSize={'1.125rem'}
                              fontWeight={500}
                              lineHeight={'1.96875rem'}
                            >
                              {utils.parseAmount(productInfo.minOrderCnt)}
                            </Text>
                          </HStack>
                        </Box>
                      </VStack>
                    </Box>
                  )}

                  <Divider borderTop={'1px solid #73829D'} />

                  <Box w={'100%'}>
                    {productInfo?.type && (
                      <Box w={'100%'}>
                        <HStack spacing={'0.75rem'}>
                          <Text
                            color={'#485766'}
                            fontSize={'1.125rem'}
                            fontWeight={400}
                            lineHeight={'1.96875rem'}
                            whiteSpace={'pre-wrap'}
                          >
                            {localeText(LANGUAGES.TYPE)}
                          </Text>
                          <Text
                            color={'#485766'}
                            fontSize={'1.125rem'}
                            fontWeight={400}
                            lineHeight={'1.96875rem'}
                            whiteSpace={'pre-wrap'}
                          >
                            {getProductType(productInfo.type)}
                          </Text>
                        </HStack>
                      </Box>
                    )}
                  </Box>

                  <Divider borderTop={'1px solid #AEBDCA'} />

                  {productDiscountList.length > 0 && (
                    <>
                      <Box w={'100%'}>
                        <VStack spacing={'2rem'}>
                          <Box w={'100%'}>
                            <HStack justifyContent={'space-between'}>
                              <Box>
                                <Text
                                  color={'#485766'}
                                  fontSize={'1.25rem'}
                                  fontWeight={500}
                                  lineHeight={'2.25rem'}
                                >
                                  {localeText(LANGUAGES.ORDER.DISCOUNT_EVENTS)}
                                </Text>
                              </Box>
                              <Box>
                                <ChevronDownIcon w={'1.5rem'} h={'1.5rem'} />
                              </Box>
                            </HStack>
                          </Box>
                          <Box w={'100%'}>
                            <VStack>
                              {productDiscountList.map(
                                (item, discountIndex) => {
                                  const type = item.type;
                                  const amount = item.amount;
                                  const discountCnt = item.discountCnt;
                                  return (
                                    <Box key={discountIndex} w={'100%'}>
                                      <Text
                                        color={'#556A7E'}
                                        fontSize={'1rem'}
                                        fontWeight={500}
                                        lineHeight={'1.75rem'}
                                      >
                                        {localeText(
                                          LANGUAGES.INFO_MSG.DISCOUNT_MSG_TYPE,
                                          {
                                            key: '@PRICE@',
                                            value:
                                              type === 1
                                                ? `${amount}%`
                                                : utils.parseDallar(amount),
                                          },
                                          {
                                            key: '@EA@',
                                            value:
                                              utils.parseAmount(discountCnt),
                                          },
                                        )}
                                      </Text>
                                    </Box>
                                  );
                                },
                              )}
                            </VStack>
                          </Box>
                        </VStack>
                      </Box>
                      <Divider borderTop={'1px solid #AEBDCA'} />
                    </>
                  )}

                  {isLogin && (
                    <Box w={'100%'}>
                      <VStack spacing={'1.25rem'}>
                        {productOptionList.length > 0 && (
                          <Box w={'100%'}>
                            <HStack justifyContent={'space-between'}>
                              <Box>
                                <Text
                                  color={'#485766'}
                                  fontSize={'1.25rem'}
                                  fontWeight={500}
                                  lineHeight={'2.25rem'}
                                >
                                  {localeText(LANGUAGES.ORDER.SELECT_AN_OPTION)}
                                </Text>
                              </Box>
                              <Box w={'25rem'}>
                                <Select
                                  border={'1px solid #9CADBE'}
                                  h={'3.75rem'}
                                  value={selectedOption}
                                  onChange={(e) => {
                                    setSelectedOption(e.target.value);
                                  }}
                                  // fontSize={"1.25rem"}
                                  // fontWeight="500"
                                  // lineHeight={"2.25rem"}
                                >
                                  <option value={0}>
                                    {localeText(
                                      LANGUAGES.INFO_MSG.SELECT_AN_OPTION,
                                    )}
                                  </option>
                                  {productOptionList.map((option, index) => {
                                    return (
                                      <option
                                        key={index}
                                        value={option.productOptionId}
                                      >
                                        {option.name}
                                      </option>
                                    );
                                  })}
                                </Select>
                              </Box>
                            </HStack>
                          </Box>
                        )}

                        {!isSoldOut ? (
                          <Box w={'100%'}>
                            <HStack justifyContent={'space-between'}>
                              <Box>
                                <Text
                                  color={'#485766'}
                                  fontSize={'1.25rem'}
                                  fontWeight="500"
                                  lineHeight={'2.25rem'}
                                >
                                  {localeText(LANGUAGES.ORDER.SELECT_QUANTITY)}
                                </Text>
                              </Box>
                              <Box w={'13rem'}>
                                <HStack
                                  h="3.75rem"
                                  px="0.75rem"
                                  py="1rem"
                                  background="#FFF"
                                  borderRadius="0.25rem"
                                  border="1px solid #9CADBE"
                                  spacing="1.25rem"
                                  justifyContent="space-between"
                                >
                                  <Box
                                    w="1.25rem"
                                    h="1.25rem"
                                    cursor="pointer"
                                    onClick={() => {
                                      decrement();
                                    }}
                                  >
                                    <CustomIcon name="minus" color="#7895B2" />
                                  </Box>

                                  <Input
                                    value={count}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (Number(val) < 1) {
                                        setCount(1);
                                      } else if (Number(val) < stockCnt) {
                                        if (/^\d*$/.test(val)) {
                                          setCount(Number(val));
                                        }
                                      } else {
                                        setTimeout(() => {
                                          openModal({
                                            text: localeText(
                                              LANGUAGES.INFO_MSG
                                                .MAXIMUM_ORDER_COUNT,
                                              {
                                                key: '@COUNT@',
                                                value:
                                                  utils.parseAmount(stockCnt),
                                              },
                                            ),
                                          });
                                        }, 200);
                                        setCount(Number(stockCnt));
                                      }
                                    }}
                                    border={0}
                                    textAlign="center"
                                    color="#485766"
                                    fontSize="1rem"
                                    fontWeight={400}
                                    lineHeight="1.75rem"
                                    variant="unstyled"
                                    px={0}
                                  />

                                  <Box
                                    w="1.25rem"
                                    h="1.25rem"
                                    cursor="pointer"
                                    onClick={() => {
                                      increment();
                                    }}
                                  >
                                    <CustomIcon name="plus" color="#7895B2" />
                                  </Box>
                                </HStack>
                              </Box>
                            </HStack>
                          </Box>
                        ) : (
                          <Text
                            color="#000"
                            fontSize={'1.5rem'}
                            fontWeight="400"
                            lineHeight={'2.25rem'}
                          >
                            {localeText(LANGUAGES.ORDER.OUT_OF_STOCK)}
                          </Text>
                        )}
                      </VStack>
                    </Box>
                  )}

                  {isLogin && !isSoldOut && (
                    <Box w={'100%'} h={'4rem'}>
                      {isOrderAddFlag ? (
                        <Box w={'100%'} h={'100%'}>
                          <Button
                            onClick={() => {
                              handleAddOrder();
                            }}
                            borderRadius={'0.25rem'}
                            bg={'#7895B2'}
                            h={'100%'}
                            w={'100%'}
                          >
                            <Text
                              color="white"
                              fontSize={'1.25rem'}
                              fontWeight="400"
                              lineHeight={'2.25rem'}
                            >
                              {localeText(LANGUAGES.ORDER.ADD_ORDER)}
                            </Text>
                          </Button>
                        </Box>
                      ) : (
                        <HStack h={'100%'}>
                          <Box w={'50%'} h={'100%'}>
                            <Button
                              onClick={() => {
                                handleAddCart();
                              }}
                              borderRadius={'0.25rem'}
                              border="1px solid #73829D"
                              h={'100%'}
                              w={'100%'}
                            >
                              <Text
                                color={'#556A7E'}
                                fontSize={'1.25rem'}
                                fontWeight="400"
                                lineHeight={'2.25rem'}
                              >
                                {localeText(LANGUAGES.ORDER.SHOPPING_CART)}
                              </Text>
                            </Button>
                          </Box>
                          <Box w={'50%'} h={'100%'}>
                            <Button
                              onClick={() => {
                                handleBuyNow();
                              }}
                              borderRadius={'0.25rem'}
                              bg={'#7895B2'}
                              h={'100%'}
                              w={'100%'}
                            >
                              <Text
                                color="white"
                                fontSize={'1.25rem'}
                                fontWeight="400"
                                lineHeight={'2.25rem'}
                              >
                                {localeText(LANGUAGES.ORDER.BUY_NOW)}
                              </Text>
                            </Button>
                          </Box>
                        </HStack>
                      )}
                    </Box>
                  )}
                </VStack>
              </Box>
            </HStack>
          </Box>

          <ContentBR h={'5rem'} />

          {productInfo?.productId && (
            <ProductBottomInfo
              productInfo={productInfo}
              setProductInfo={setProductInfo}
              productImageList={productImageList}
            />
          )}

          <ContentBR h={'10rem'} />

          <Footer />
        </VStack>
      </Center>
    </MainContainer>
  );
};

export default ProductPage;
