'use client';

import {
  Box,
  Center,
  Text,
  VStack,
  Button,
  Flex,
  HStack,
} from '@chakra-ui/react';
import useLocale from '@/hooks/useLocale';
import { useCallback, useEffect, useState } from 'react';
import { LANGUAGES } from '@/constants/lang';

import MainTopHeader from '@/components/custom/header/MainTopHeader';
import ContentBR from '@/components/custom/ContentBR';
import Footer from '@/components/common/custom/Footer';
import { DefaultPaginate } from '@/components';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { cartTabIndexState } from '@/stores/menuRecoil';
import productCartApi from '@/services/productCartApi';
import { checkedItemsState } from '@/stores/dataRecoil';
import productFavoritesApi from '@/services/productFavoritesApi';
import useModal from '@/hooks/useModal';
import CartListCardForm from '@/components/custom/mypage/information/CartListCardForm';
import { NO_DATA_ERROR, SUCCESS } from '@/constants/errorCode';
import Wishlist from '@/components/custom/mypage/information/WishList';
import MainContainer from '@/components/layout/MainContainer';
import { productOrderState } from '@/stores/orderRecoil';
import useDevice from '@/hooks/useDevice';
import useMove from '@/hooks/useMove';

const CartPage = () => {
  const { isMobile, clampW } = useDevice();
  const { openModal } = useModal();
  const { moveOrders } = useMove();
  const setProductOrder = useSetRecoilState(productOrderState);
  const [cartTabIndex, setCartTabIndex] = useRecoilState(cartTabIndexState);
  const [checkedItems, setCheckedItems] = useRecoilState(checkedItemsState);

  const [currentPageCart, setCurrentPageCart] = useState(1);
  const [totalCountCart, setTotalCountCart] = useState(1);
  const [contentNumCart, setContentNumCart] = useState(10);

  const [currentPageWish, setCurrentPageWish] = useState(1);
  const [totalCountWish, setTotalCountWish] = useState(1);
  const [contentNumWish, setContentNumWish] = useState(10);

  const [listWish, setListWish] = useState([]);

  const { localeText } = useLocale();

  const [listCart, setListCart] = useState([]);

  useEffect(() => {
    handleGetListCartAgent();
    handleGetListWishAgent();
    return () => {
      setCartTabIndex(0);
    };
  }, []);

  useEffect(() => {
    setCheckedItems([]);
  }, [cartTabIndex]);

  // cart
  const handleGetListCartAgent = () => {
    if (currentPageCart === 1) {
      handleGetListCart();
    } else {
      setCurrentPageCart(1);
    }
  };

  const handleGetListCart = useCallback(async () => {
    const param = {
      pageNum: currentPageCart,
      contentNum: contentNumCart,
    };
    const result = await productCartApi.getListProductCart(param);
    if (result?.errorCode === SUCCESS) {
      setListCart(result.datas);
      setTotalCountCart(result.totalCount);
    } else if (result?.errorCode === NO_DATA_ERROR) {
      setListCart([]);
      setTotalCountCart(0);
    }
  });
  const handleDeleteCart = useCallback(() => {
    if (checkedItems.length === 0) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.SERVICE.NOT_SELECTED),
      });
    }
    const param = {
      productCartIds: checkedItems,
    };
    handleActionDeleteCart(param);
  });
  const handleActionDeleteCart = useCallback(async (param) => {
    const result = await productCartApi.deleteProductCart(param);
    if (result?.errorCode === SUCCESS) {
      handleGetListCartAgent();
    }
  });

  const handleSetCart = (cart) => {
    const updatedCart = listCart.map((item) =>
      item.productCartId === cart.productCartId ? cart : item,
    );
    setListCart(updatedCart);
  };
  //

  // wishlist
  const handleGetListWishAgent = () => {
    if (currentPageWish === 1) {
      handleGetListWish();
    } else {
      setCurrentPageWish(1);
    }
  };
  const handleGetListWish = useCallback(async () => {
    const param = {
      pageNum: currentPageWish,
      contentNum: contentNumWish,
    };
    const result = await productFavoritesApi.getListProductFavorites(param);
    if (result?.errorCode === SUCCESS) {
      setListWish(result.datas);
      setTotalCountWish(result.totalCount);
    } else if (result?.errorCode === NO_DATA_ERROR) {
      setListWish([]);
      setTotalCountWish(0);
    }
  });
  const handleDeleteWish = useCallback(async () => {
    if (checkedItems.length === 0) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.SERVICE.NOT_SELECTED),
      });
    }
    openModal({
      type: 'confirm',
      text: `${localeText(LANGUAGES.INFO_MSG.DELETE_MSG).replace('@', checkedItems.length)}`,
      onAgreeText: localeText(LANGUAGES.COMMON.DELETE),
      onAgree: () => {
        const param = {
          productFavoritesIds: [...checkedItems],
        };
        handleActionDeleteWish(param);
      },
    });
  });
  const handleActionDeleteWish = useCallback(async (param) => {
    const result = await productFavoritesApi.deleteProductFavorites(param);
    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result?.message,
        onAgree: () => {
          setCheckedItems([]);
          handleGetListWish();
        },
      });
    }
  });

  const handleAddCartFromFavorite = async () => {
    const filteredFavoriteItems = listWish.filter((item) =>
      checkedItems.some(
        (checkedItem) => checkedItem === item.productFavoritesId,
      ),
    );

    if (filteredFavoriteItems.length === 0) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.SERVICE.NOT_SELECTED),
      });
    }

    if (filteredFavoriteItems.length > 0) {
      try {
        await Promise.all(
          filteredFavoriteItems.map(async (item) => {
            const temp = {
              productId: item.productId,
              count: 1,
            };
            const result = await productCartApi.postProductCart(temp);

            if (result?.errorCode === SUCCESS) {
              openModal({
                text: result?.message,
                onAgree: () => {
                  handleGetListCartAgent();
                  setCheckedItems([]);
                  setCartTabIndex(0);
                },
              });
            }
          }),
        );
      } catch (error) {
        console.error('Error processing items:', error);
      }
    }
  };
  //

  const handleCheckOut = () => {
    if (checkedItems.length === 0) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.SERVICE.NOT_SELECTED),
      });
    }

    const buyParam = {};
    checkedItems.map((item, index) => {
      if (index === 0) {
        buyParam.sellerUserId = item.sellerUserId;
        buyParam.minimumOrderAmount = item.minimumOrderAmount;
        buyParam.ordersProductList = [];
      }

      const count = item.count || 0;
      const unitPrice = item.unitPrice || 0;
      let totalPrice = item.totalPrice || 0;
      const productImages = item?.productImages || [];
      const productCartOptions = item?.productCartOptions || [];

      let orderProduct = {
        productId: item.productId,
        brandName: item.brandName,
        name: item.name,
        productImageList: productImages,
        count: count,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
      };

      orderProduct.stockFlag = item.stockFlag;
      if (item?.stockFlag === 1) {
        orderProduct.stockCnt = item.stockCnt;
      }

      // product option
      if (productCartOptions.length > 0) {
        let ordersProductOptionList = [];

        let productCartOption = productCartOptions[0];
        const ordersProductOption = {
          productOptionId: productCartOption.productOptionId,
          name: productCartOption.name,
          unitPrice: productCartOption.unitPrice,
          totalPrice: productCartOption.unitPrice,
        };

        ordersProductOptionList.push(ordersProductOption);
        orderProduct.ordersProductOptionList = ordersProductOptionList;
      }

      if (item?.productDiscountData?.length > 0) {
        orderProduct.productDiscountList = item.productDiscountData;
      }

      buyParam.ordersProductList.push(orderProduct);
    });

    setProductOrder(buyParam);
    setTimeout(() => {
      moveOrders();
    }, 200);
  };

  return isMobile(true) ? (
    <MainContainer>
      <Center w={'100%'}>
        <VStack w={'100%'} spacing={0}>
          <MainTopHeader />

          <Box w={'100%'} px={clampW(1, 10)}>
            <Text
              color={'#485766'}
              fontSize={clampW(1.5, 3)}
              fontStyle={'normal'}
              fontWeight={400}
              lineHeight={'4.5rem'}
            >
              {localeText(LANGUAGES.MY_CART.MY_CART)}
            </Text>
          </Box>

          <ContentBR h={'0.62rem'} />

          <Box w={'100%'} px={clampW(1, 10)}>
            <Box w={'100%'}>
              <VStack spacing={'0.5rem'}>
                <Box w={'100%'}>
                  <HStack spacing={'0.75rem'}>
                    <Flex
                      cursor={'pointer'}
                      onClick={() => {
                        setCartTabIndex(0);
                      }}
                      pt={'0.5rem'}
                      pb={'0.5rem'}
                      justifyContent={'center'}
                      alignItems={'center'}
                      gap={'0.625rem'}
                      display={'flex'}
                    >
                      <Text
                        textAlign={'center'}
                        color={cartTabIndex === 0 ? '#66809C' : '#A7C3D2'}
                        fontSize={clampW(1, 1.25)}
                        fontWeight={cartTabIndex === 0 ? 600 : 400}
                        lineHeight={'180%'}
                      >
                        {localeText(LANGUAGES.MY_CART.MY_CART)}
                      </Text>
                    </Flex>
                    <Flex
                      cursor={'pointer'}
                      onClick={() => {
                        setCartTabIndex(1);
                      }}
                      pt={'0.5rem'}
                      pb={'0.5rem'}
                      justifyContent={'center'}
                      alignItems={'center'}
                      gap={'0.625rem'}
                      display={'flex'}
                    >
                      <Text
                        textAlign={'center'}
                        color={cartTabIndex === 1 ? '#66809C' : '#A7C3D2'}
                        fontSize={clampW(1, 1.25)}
                        fontWeight={cartTabIndex === 1 ? 600 : 400}
                        lineHeight={'180%'}
                      >
                        {localeText(LANGUAGES.MY_CART.WISH_LIST)}
                      </Text>
                    </Flex>
                  </HStack>
                </Box>
                <Box w={'100%'}>
                  <HStack justifyContent={'space-between'}>
                    {cartTabIndex === 0 && (
                      <Box w={'100%'}>
                        <HStack justifyContent={'space-between'}>
                          <Text
                            color={'#66809C'}
                            fontSize={clampW(0.875, 0.9375)}
                            fontWeight={400}
                          >
                            {`${checkedItems.length} ${localeText(LANGUAGES.MY_CART.PRODUCTS_ARE_SELECTED)}`}
                          </Text>
                          <Box
                            onClick={() => {
                              handleDeleteCart();
                            }}
                          >
                            <Text
                              color={'#66809C'}
                              fontSize={clampW(0.875, 0.9375)}
                              fontWeight={400}
                            >
                              {localeText(LANGUAGES.MY_CART.DELETE_SELECTION)}
                            </Text>
                          </Box>
                        </HStack>
                      </Box>
                    )}
                    {cartTabIndex === 1 && (
                      <Box w={'100%'}>
                        <HStack justifyContent={'space-between'}>
                          <Text
                            color={'#66809C'}
                            fontSize={clampW(0.875, 0.9375)}
                            fontWeight={400}
                          >
                            {`${checkedItems.length} ${localeText(LANGUAGES.MY_CART.PRODUCTS_ARE_SELECTED)}`}
                          </Text>
                          <Box
                            onClick={() => {
                              handleDeleteWish();
                            }}
                          >
                            <Text
                              color={'#66809C'}
                              fontSize={clampW(0.875, 0.9375)}
                              fontWeight={400}
                            >
                              {localeText(LANGUAGES.MY_CART.DELETE_SELECTION)}
                            </Text>
                          </Box>
                        </HStack>
                      </Box>
                    )}
                  </HStack>
                </Box>
              </VStack>
            </Box>

            <ContentBR h={'1.25rem'} />

            {cartTabIndex === 0 && (
              <Box w={'100%'}>
                <VStack spacing={'2.5rem'}>
                  {listCart.map((cart, cartIndex) => {
                    return (
                      <CartListCardForm
                        key={cartIndex}
                        checkedItems={checkedItems}
                        setCheckedItems={setCheckedItems}
                        cart={cart}
                        index={cartIndex}
                        setCart={(cart) => {
                          handleSetCart(cart);
                        }}
                        onClickDelete={(item) => {
                          openModal({
                            type: 'confirm',
                            text: localeText(
                              LANGUAGES.INFO_MSG.DELETE_PRODUCT_MSG,
                            ),
                            onAgreeText: localeText(LANGUAGES.COMMON.DELETE),
                            onAgree: () => {
                              const param = {
                                productCartIds: [item.productCartId],
                              };
                              handleActionDeleteCart(param);
                            },
                          });
                        }}
                        onClickCheckOut={handleCheckOut}
                      />
                    );
                  })}
                  {listCart.length === 0 && (
                    <Center w={'100%'} h={'10rem'}>
                      <Text
                        fontSize={'1.5rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.INFO_MSG.NO_ITEM_SEARCHED)}
                      </Text>
                    </Center>
                  )}
                </VStack>
              </Box>
            )}

            {cartTabIndex === 1 && (
              <Wishlist
                products={listWish}
                isDetail
                isCheck
                onClickFavorite={(item) => {
                  const param = {
                    productFavoritesIds: [item],
                  };
                  handleActionDeleteWish(param);
                }}
              />
            )}
          </Box>

          <ContentBR h={'5rem'} />

          <Footer />
        </VStack>
      </Center>
    </MainContainer>
  ) : (
    <MainContainer>
      <Center w={'100%'}>
        <VStack w={'100%'} maxW={1920} spacing={0}>
          <MainTopHeader />

          <Box w={'100%'} px={'10rem'} py={'2.5rem'}>
            <Text
              color={'#485766'}
              fontSize={'3rem'}
              fontStyle={'normal'}
              fontWeight={400}
              lineHeight={'4.5rem'}
            >
              {localeText(LANGUAGES.MY_CART.MY_CART)}
            </Text>
          </Box>

          <ContentBR h={'2.5rem'} />

          <Box w={'100%'} px={'10rem'}>
            <Flex
              w={'100%'}
              h={'6.25rem'}
              flexDirection={'column'}
              justifyContent={'flex-start'}
              alignItems={'flex-start'}
              display={'inline-flex'}
            >
              <Flex
                alignSelf={'stretch'}
                justifyContent={'flex-start'}
                alignItems={'center'}
                gap={'3.25rem'}
                display={'inline-flex'}
              >
                <Flex
                  cursor={'pointer'}
                  onClick={() => {
                    setCartTabIndex(0);
                  }}
                  pt={'0.5rem'}
                  pb={'0.5rem'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  gap={'0.625rem'}
                  display={'flex'}
                >
                  <Text
                    textAlign={'center'}
                    color={cartTabIndex === 0 ? '#66809C' : '#A7C3D2'}
                    fontSize={'1.25rem'}
                    fontWeight={cartTabIndex === 0 ? 600 : 400}
                    lineHeight={'2.25rem'}
                  >
                    {localeText(LANGUAGES.MY_CART.MY_CART)}
                  </Text>
                </Flex>
                <Flex
                  cursor={'pointer'}
                  onClick={() => {
                    setCartTabIndex(1);
                  }}
                  pt={'0.5rem'}
                  pb={'0.5rem'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  gap={'0.625rem'}
                  display={'flex'}
                >
                  <Text
                    textAlign={'center'}
                    color={cartTabIndex === 1 ? '#66809C' : '#A7C3D2'}
                    fontSize={'1.25rem'}
                    fontWeight={cartTabIndex === 1 ? 600 : 400}
                    lineHeight={'2.25rem'}
                  >
                    {localeText(LANGUAGES.MY_CART.WISH_LIST)}
                  </Text>
                </Flex>
              </Flex>
              <Flex
                alignSelf={'stretch'}
                h={'3rem'}
                flexDirection={'column'}
                justifyContent={'flex-start'}
                alignItems={'flex-end'}
                gap={'0.625rem'}
                display={'flex'}
              >
                {cartTabIndex === 0 && (
                  <Box w={'11.5rem'} h={'3rem'}>
                    <Button
                      onClick={() => {
                        handleDeleteCart();
                      }}
                      px={'1.75rem'}
                      py={'0.625rem'}
                      border={'1px solid #A87C4E'}
                      borderRadius={'0.25rem'}
                      bg={'transparent'}
                      h={'100%'}
                      w={'100%'}
                    >
                      <Text
                        color={'#A87C4E'}
                        fontSize={'1rem'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.MY_CART.DELETE_SELECTION)}
                      </Text>
                    </Button>
                  </Box>
                )}
                {cartTabIndex === 1 && (
                  <Box
                    w={'100%'}
                    h={'3rem'}
                    justifyContent={'flex-end'}
                    alignItems={'center'}
                    gap={'0.75rem'}
                    display={'inline-flex'}
                  >
                    <Text
                      color={'#66809C'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {`${checkedItems.length} ${localeText(LANGUAGES.MY_CART.PRODUCTS_ARE_SELECTED)}`}
                    </Text>

                    <Box w={'11.5rem'} h={'3rem'}>
                      <Button
                        onClick={() => {
                          handleDeleteWish();
                        }}
                        px={'1.75rem'}
                        py={'0.625rem'}
                        border={'1px solid #A87C4E'}
                        borderRadius={'0.25rem'}
                        bg={'transparent'}
                        h={'100%'}
                        w={'100%'}
                      >
                        <Text
                          color={'#A87C4E'}
                          fontSize={'1rem'}
                          fontWeight={400}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.MY_CART.DELETE_SELECTION)}
                        </Text>
                      </Button>
                    </Box>

                    <Box w={'15.6875rem'} h={'3rem'}>
                      <Button
                        onClick={() => {
                          handleAddCartFromFavorite();
                        }}
                        px={'1.25rem'}
                        py={'0.625rem'}
                        borderRadius={'0.25rem'}
                        bg={'#7895B2'}
                        h={'100%'}
                        w={'100%'}
                      >
                        <Text
                          color={'#FFF'}
                          fontSize={'1rem'}
                          fontWeight={400}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.MY_CART.ADD_SELECTED_CART)}
                        </Text>
                      </Button>
                    </Box>
                  </Box>
                )}
              </Flex>
            </Flex>

            <ContentBR h={'1.25rem'} />

            {cartTabIndex === 0 && (
              <Box w={'100%'}>
                <VStack spacing={0}>
                  {listCart.map((cart, cartIndex) => {
                    return (
                      <CartListCardForm
                        key={cartIndex}
                        checkedItems={checkedItems}
                        setCheckedItems={setCheckedItems}
                        cart={cart}
                        index={cartIndex}
                        setCart={(cart) => {
                          handleSetCart(cart);
                        }}
                        onClickDelete={(item) => {
                          openModal({
                            type: 'confirm',
                            text: localeText(
                              LANGUAGES.INFO_MSG.DELETE_PRODUCT_MSG,
                            ),
                            onAgreeText: localeText(LANGUAGES.COMMON.DELETE),
                            onAgree: () => {
                              const param = {
                                productCartIds: [item.productCartId],
                              };
                              handleActionDeleteCart(param);
                            },
                          });
                        }}
                        onClickCheckOut={handleCheckOut}
                      />
                    );
                  })}
                  {listCart.length === 0 && (
                    <Center w={'100%'} h={'10rem'}>
                      <Text
                        fontSize={'1.5rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.INFO_MSG.NO_ITEM_SEARCHED)}
                      </Text>
                    </Center>
                  )}
                  <ContentBR h={'5rem'} />
                  <Center>
                    <DefaultPaginate
                      currentPage={currentPageCart}
                      setCurrentPage={setCurrentPageCart}
                      totalCount={totalCountCart}
                      contentNum={contentNumCart}
                    />
                  </Center>
                </VStack>
              </Box>
            )}

            {cartTabIndex === 1 && (
              <>
                <Box w={'100%'}>
                  <Wishlist
                    products={listWish}
                    isDetail
                    onClickFavorite={(item) => {
                      const param = {
                        productFavoritesIds: [item],
                      };
                      handleActionDeleteWish(param);
                    }}
                  />
                  <ContentBR h={'5rem'} />
                  <Center>
                    <DefaultPaginate
                      currentPage={currentPageWish}
                      setCurrentPage={setCurrentPageWish}
                      totalCount={totalCountWish}
                      contentNum={contentNumWish}
                    />
                  </Center>
                </Box>
              </>
            )}
          </Box>

          <ContentBR h={'10rem'} />

          <Footer />
        </VStack>
      </Center>
    </MainContainer>
  );
};

export default CartPage;
