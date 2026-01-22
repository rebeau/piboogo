'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Center,
  HStack,
  Img,
  SimpleGrid,
  Image as ChakraImage,
  Text,
  VStack,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  Input,
} from '@chakra-ui/react';

import ContentBR from '@/components/custom/ContentBR';
import MainTopHeader from '@/components/custom/header/MainTopHeader';
import CategorySideBar from '@/components/custom/category/CategorySideBar';
import { CustomIcon, DefaultPaginate } from '@/components';
import Footer from '@/components/common/custom/Footer';
import ProductItemCard from '@/components/custom/product/ProductItemCard';
import Information from '@public/svgs/simbol/information.svg';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import { useRecoilState } from 'recoil';
import utils from '@/utils';
import { NO_DATA_ERROR, SUCCESS } from '@/constants/errorCode';
import sellerApi from '@/services/sellerUserApi';
import useMove from '@/hooks/useMove';
import { productOrderState } from '@/stores/orderRecoil';
import useModal from '@/hooks/useModal';
import MainContainer from '@/components/layout/MainContainer';
import ProductBrandRight from '@/components/custom/product/ProductBrandRight';
import useDevice from '@/hooks/useDevice';
import FilterIcon from '@public/svgs/icon/filter.svg';
import RightIcon from '@public/svgs/icon/right.svg';
import InfoIcon from '@public/svgs/icon/info.svg';
import useOrders from '@/hooks/useOrders';

const BrandProductPage = () => {
  const { isMobile, clampW } = useDevice();
  const { handleClearOrder } = useOrders();
  const { moveMain, moveProductDetail, moveOrders, moveCart } = useMove();
  const { openModal } = useModal();
  const [productOrder, setProductOrder] = useRecoilState(productOrderState);
  const { localeText } = useLocale();

  const [sellerUserId, setSellerUserId] = useState(null);
  const [selectedSort, setSelectedSort] = useState(1);

  const [listSelectedProduct, setListSelectedProduct] = useState([]);

  const [initPage, setInitPage] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [contentNum, setContentNum] = useState(10);

  const [listProduct, setListProduct] = useState([]);
  const [listOrders, setListOrders] = useState([]);

  const [sellerUserInfo, setSellerUserInfo] = useState({});
  const [productInfo, setProductInfo] = useState({});
  const [totalOrderAmountPercent, setTotalOrderAmountPercent] = useState(0);
  const [totalOrderAmount, setTotalOrderAmount] = useState(0);
  const [insufficientAmount, setInsufficientAmount] = useState(0);
  const [isSetCategory, setIsSetCategory] = useState(false);
  const isLogin = utils.getIsLogin();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isOpenOrder,
    onOpen: onOpenOrder,
    onClose: onCloseOrder,
  } = useDisclosure();

  useEffect(() => {
    if (!isMobile(true)) {
      onCloseOrder();
    }
  }, [isMobile]);

  useEffect(() => {
    if (productOrder?.sellerUserId) {
      const sellerUserId = productOrder.sellerUserId;
      setSellerUserId(sellerUserId);
      const ordersProductList = productOrder?.ordersProductList || [];
      handleGetSeller(sellerUserId);
      setListOrders(ordersProductList);
    } else {
      // 판매자 조회 안됨
    }
  }, []);

  useEffect(() => {
    if (listOrders.length > 0 && sellerUserInfo?.minimumOrderAmount > 0) {
      let tempTotalPrice = 0;
      listOrders.map((orders) => {
        tempTotalPrice += orders.totalPrice;
      });

      let percent = (tempTotalPrice / sellerUserInfo.minimumOrderAmount) * 100;
      if (percent > 100) {
        percent = 100;
      }
      setTotalOrderAmountPercent(percent);

      let tempAmount = tempTotalPrice - sellerUserInfo.minimumOrderAmount;
      if (tempAmount < 0) {
        tempAmount === 0;
      }
      setTotalOrderAmount(tempTotalPrice);
      setInsufficientAmount(Number(tempAmount));
    }
  }, [listOrders, sellerUserInfo]);

  const handleGetSeller = async (sellerUserId) => {
    const param = { sellerUserId: sellerUserId };
    const result = await sellerApi.getSeller(param);

    if (result?.errorCode === SUCCESS) {
      setSellerUserInfo(result.data);
    } else if (result?.errorCode === NO_DATA_ERROR) {
      setSellerUserInfo({});
    }
  };

  const TextChecker = (text, targetIndex) => {
    const isCheck = selectedSort === targetIndex;

    const w = () => {
      if (targetIndex === 1) {
        return '7.5rem';
      } else if (targetIndex === 2) {
        return '3.5rem';
      } else {
        return '4rem';
      }
    };

    return (
      <Box
        minW={w()}
        _hover={{ cursor: 'pointer' }}
        onClick={() => {
          setSelectedSort(targetIndex);
        }}
      >
        <HStack justifyContent={'flex-end'}>
          <Box w={'0.7rem'}>
            <Text
              color={'#485766'}
              fontSize={'1rem'}
              fontWeight={500}
              lineHeight={'1.75rem'}
            >
              {isCheck && '✓'}
            </Text>
          </Box>
          <Text
            color={isCheck ? '#485766' : '#A7C3D2'}
            fontSize={'1rem'}
            fontWeight={500}
            lineHeight={'1.75rem'}
          >
            {text}
          </Text>
        </HStack>
      </Box>
    );
  };

  const listItems = useCallback(() => {
    return (
      <SimpleGrid
        columns={{
          '3xl': 3,
          '2xl': 2,
          xl: 2,
          lg: 2,
          md: 2,
          sm: 2,
          xs: 2,
        }}
        spacingX={'1.25rem'}
        spacingY={isMobile(true) ? '2rem' : '5rem'}
      >
        {listProduct.map((item, itemIndex) => (
          <ProductItemCard
            isAbleFavorite={false}
            key={itemIndex}
            item={item}
            onClick={(item) => {
              moveProductDetail(item.productId);
              /*
              if (isLogin) {
                moveProductDetail(item.productId);
              } else {
                openModal({
                  text: localeText(LANGUAGES.INFO_MSG.SERVICE_ONLY),
                });
              }
              */
            }}
          />
        ))}
      </SimpleGrid>
    );
  });

  const handleDrawer = () => {
    // 24
    // 148
    // 12
    // list
    // 96
    // 16
    // 103.5
    // 24
    const sum = 24 + 148 + 12 + 96 + 16 + 103.5 + 24;
    return `calc(100vh - ${sum}px)`;
  };

  const handleChangeProduct = useCallback(
    (count, item, index) => {
      const updatedList = [...listOrders];
      updatedList[index] = {
        ...updatedList[index],
        count: Number(count),
        totalPrice: Number(item.unitPrice) * Number(count),
      };
      setListOrders(updatedList);
      setProductOrder({
        ...productOrder,
        ordersProductList: updatedList,
      });
    },
    [listOrders, productOrder],
  );

  return isMobile(true) ? (
    <MainContainer>
      <Center w={'100%'} h={'calc(100% - 5.5rem)'} mb={'7rem'}>
        <VStack w={'100%'} spacing={0}>
          <MainTopHeader />

          {/* content */}
          <Box w={'100%'}>
            <VStack spacing={'1.25rem'} justifyContent={'flex-start'}>
              <Box px={clampW(1, 2.5)} w={'100%'}>
                <VStack spacing={'0.75rem'}>
                  <Box w={'100%'}>
                    <HStack justifyContent={'space-between'}>
                      <Text
                        color={'#485766'}
                        fontSize={clampW(1.5, 3)}
                        fontWeight={400}
                        lineHeight={'160%'}
                      >
                        {sellerUserInfo.brandName}
                      </Text>
                      <Box
                        onClick={() => {
                          onOpen();
                        }}
                      >
                        <HStack spacing={'0.5rem'}>
                          <Img src={FilterIcon.src} />
                          <Text
                            color={'#556A7E'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'160%'}
                          >
                            {localeText(LANGUAGES.M_FILTER)}
                          </Text>
                        </HStack>
                      </Box>
                    </HStack>
                  </Box>
                </VStack>
              </Box>
              <Box w={'100%'} px={clampW(1, 2.5)}>
                <HStack spacing={'2.5rem'} alignItems={'flex-start'}>
                  <Box display={'none'}>
                    {sellerUserId && (
                      <CategorySideBar
                        setListProduct={setListProduct}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalCount={totalCount}
                        setTotalCount={setTotalCount}
                        contentNum={contentNum}
                        isSetCategory={isSetCategory}
                        setIsSetCategory={setIsSetCategory}
                        //
                        sellerUserId={sellerUserId}
                        selectedSort={selectedSort}
                        //
                        isOpen={isOpen}
                        onOpen={onOpen}
                        onClose={onClose}
                      />
                    )}
                  </Box>
                  <Box w={'100%'}>
                    <VStack spacing={0} h={'100%'}>
                      <Box py={'1rem'} w={'100%'}>
                        <HStack justifyContent={'space-between'}>
                          <Text
                            color={'#485766'}
                            fontSize={clampW(1, 1.125)}
                            fontWeight={400}
                            lineHeight={'1.96875rem'}
                          >
                            {`${utils.parseAmount(totalCount)} ${localeText(LANGUAGES.ITEMS)}`}
                          </Text>

                          <Box>
                            <HStack spacing={clampW(0.7, 1.3)}>
                              {TextChecker(
                                localeText(LANGUAGES.COMMON.MOST_POPULAR),
                                1,
                              )}
                              {TextChecker(localeText(LANGUAGES.COMMON.NEW), 2)}
                              {TextChecker(
                                localeText(LANGUAGES.COMMON.PRICE),
                                3,
                              )}
                            </HStack>
                          </Box>
                        </HStack>
                      </Box>

                      <Box w={'100%'}>
                        {listProduct.length > 0 && listItems()}
                        {listProduct.length === 0 && (
                          <Center w={'100%'} h={'5rem'}>
                            <Text
                              fontSize={'1.5rem'}
                              fontWeight={500}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(LANGUAGES.INFO_MSG.NO_ITEM_SEARCHED)}
                            </Text>
                          </Center>
                        )}
                      </Box>
                    </VStack>
                  </Box>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Center>

      <Center
        w={'100%'}
        h={'5.5rem'}
        position={'fixed'}
        bottom={0}
        py={'0.62rem'}
        px={'1rem'}
      >
        <Box
          onClick={() => {
            onOpenOrder();
          }}
          w={'100%'}
          h={'100%'}
          px={'1.5rem'}
          py={'0.75rem'}
          bg={'#E8DFCA'}
          boxShadow={'4px 4px 0.625rem rgba(0, 0, 0, 0.10)'}
          borderRadius={'1.625rem'}
          display={'inline-flex'}
        >
          <HStack
            w={'100%'}
            spacing={'0.5rem'}
            justifyContent={'space-between'}
          >
            <Box w={'1.5rem'} h={'1.5rem'}>
              <Img src={InfoIcon.src} h={'100%'} w={'100%'} />
            </Box>
            <Box w={'100%'}>
              <Text
                color={'#485766'}
                fontSize="rem"
                fontFamily={clampW(0.875, 1)}
                fontWeight={500}
                lineHeight={'160%'}
              >
                {insufficientAmount < 0
                  ? localeText(LANGUAGES.INFO_MSG.ADD_OTHER_PRODUCTS, {
                      key: '@PRICE@',
                      value: insufficientAmount,
                    })
                  : localeText(LANGUAGES.INFO_MSG.CAN_PLACE_ORDER)}
              </Text>
            </Box>
            <Box w={'1.25rem'} h={'1.25rem'}>
              <Img src={RightIcon.src} h={'100%'} w={'100%'} />
            </Box>
          </HStack>
        </Box>
      </Center>

      <Drawer
        placement={'bottom'}
        size={'full'}
        onClose={onCloseOrder}
        isOpen={isOpenOrder}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody
            bg={'#F9F7F1'}
            py={'1.5rem'}
            px={'1rem'}
            h={'100%'}
            position={'relative'}
          >
            {/* 148 */}
            <Box w={'100%'} mb={'0.75rem'}>
              <VStack w={'100%'} spacing={'1rem'} h={'100%'}>
                <Box w={'100%'}>
                  <HStack justifyContent={'flex-end'}>
                    <Box
                      w={'2rem'}
                      h={'2rem'}
                      cursor={'pointer'}
                      onClick={() => {
                        onCloseOrder();
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
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <Box
                        w={'100%'}
                        h={'0.75rem'}
                        position={'relative'}
                        bg={'#0000001A'}
                        borderRadius={'0.375rem'}
                      >
                        <Box
                          w={`${totalOrderAmountPercent}%`}
                          h={'100%'}
                          position={'absolute'}
                          left={0}
                          bg={'#90AEC4'}
                          borderRadius={'0.375rem'}
                        />
                      </Box>
                    </Box>
                    <Box w={'100%'}>
                      <HStack justify={'space-between'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'1rem'}
                          fontWeight={400}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.PURCHASE_MINIMUM)}
                        </Text>
                        <Text
                          color={'#556A7E'}
                          fontSize={'1rem'}
                          fontWeight={500}
                          lineHeight={'1.75rem'}
                        >
                          {utils.parseDallar(sellerUserInfo.minimumOrderAmount)}
                        </Text>
                      </HStack>
                    </Box>
                  </VStack>
                </Box>

                <Box w={'100%'}>
                  <Text
                    opacity={'0.7'}
                    color={'#485766'}
                    fontSize={'1.125rem'}
                    fontWeight={400}
                    lineHeight={'2rem'}
                  >
                    {sellerUserInfo.brandName}
                  </Text>
                </Box>
              </VStack>
            </Box>

            {/* list */}
            <Box w={'100%'} h={handleDrawer()} overflow={'auto'}>
              <VStack spacing={0}>
                {listOrders.map((product, index) => {
                  return (
                    <ProductBrandRight
                      item={product}
                      key={index}
                      onChangeProduct={(count, item) =>
                        handleChangeProduct(count, item, index)
                      }
                    />
                  );
                })}
              </VStack>
            </Box>

            {/* bottom h={15.21875} */}
            {/* h={124} */}
            <Box position={'relative'}>
              <VStack spacing={'1rem'}>
                <Box
                  w={'100%'}
                  cursor={'pointer'}
                  onClick={() => {
                    openModal({
                      type: 'confirm',
                      text: localeText(LANGUAGES.INFO_MSG.MOVE_CANCEL_ORDER),
                      onAgree: () => {
                        handleClearOrder();
                        moveMain(true);
                      },
                    });
                  }}
                >
                  <Text
                    textAlign="center"
                    color={'#556A7E'}
                    fontSize={'1rem'}
                    fontWeight={500}
                    lineHeight={'1.75rem'}
                    textDecoration={'underline'}
                  >
                    {localeText(LANGUAGES.SEE_OTHER_BRANDED_PRODUCTS)}
                  </Text>
                </Box>
                <Box
                  bottom={'1.25rem'}
                  w={'100%'}
                  py={'0.75rem'}
                  px={'1.5rem'}
                  borderRadius={'1.625rem'}
                  bg={'#E8DFCA'}
                >
                  <HStack>
                    <Img src={Information.src} />
                    <Text
                      color={'#485766'}
                      fontSize={'1rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                    >
                      {insufficientAmount < 0
                        ? localeText(LANGUAGES.INFO_MSG.ADD_OTHER_PRODUCTS, {
                            key: '@PRICE@',
                            value: insufficientAmount,
                          })
                        : localeText(LANGUAGES.INFO_MSG.CAN_PLACE_ORDER)}
                    </Text>
                  </HStack>
                </Box>
              </VStack>
            </Box>

            <ContentBR h={'1rem'} />

            {/* h={103.5} */}
            <Box w={'100%'}>
              <VStack spacing={'1rem'}>
                <Box
                  w={'100%'}
                  borderTop={
                    listSelectedProduct.length > 3 ? '1px solid #9CADBE' : null
                  }
                >
                  <VStack spacing={'1.25rem'}>
                    <Box w={'100%'}>
                      <HStack justifyContent={'space-between'}>
                        <Box>
                          <Text
                            color={'#7895B2'}
                            fontSize={'1.125rem'}
                            fontWeight={400}
                            lineHeight={'1.96875rem'}
                          >
                            {localeText(LANGUAGES.ORDER.TOTAL_PRICE_LABEL)}
                          </Text>
                        </Box>
                        <Box>
                          <Text
                            color={'#556A7E'}
                            fontSize={'1.125rem'}
                            fontWeight={500}
                            lineHeight={'1.96875rem'}
                          >
                            {utils.parseDallar(totalOrderAmount)}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  </VStack>
                </Box>
                <Box w={'100%'} h={'3.5rem'}>
                  <Button
                    onClick={() => {
                      moveOrders(true);
                    }}
                    isDisabled={totalOrderAmountPercent !== 100}
                    py={'0.88rem'}
                    px={'2rem'}
                    _disabled={{
                      opacity: 0.5,
                      cursor:
                        totalOrderAmountPercent !== 100
                          ? 'not-allowed'
                          : 'pointer',
                    }}
                    _hover={{}}
                    borderRadius={'0.25rem'}
                    bg={'#7895B2'}
                    h={'100%'}
                    w={'100%'}
                  >
                    <Text
                      color={'#FFF'}
                      fontSize={'1.25rem'}
                      fontWeight={400}
                      lineHeight={'2.25rem'}
                    >
                      {localeText(LANGUAGES.ORDER.CHECK_OUT)}
                    </Text>
                  </Button>
                </Box>
              </VStack>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </MainContainer>
  ) : (
    <MainContainer>
      <Center w={'100%'}>
        <VStack w={'100%'} spacing={0}>
          <MainTopHeader />

          {/* content */}
          <Box w={'100%'} maxW={1920}>
            <HStack spacing={0} alignItems={'flex-start'}>
              {/* left form */}
              <Box
                w={'80rem'}
                maxW={'66.66%'}
                borderRight={'1px solid #AEBDCA'}
              >
                <Box w={'100%'}>
                  <Center w={'100%'} h={'15rem'} position={'relative'}>
                    <Img
                      src={sellerUserInfo?.brandBannerS3Url}
                      w={'100%'}
                      h={'100%'}
                      objectFit={'cover'}
                    />
                    <Img
                      src={sellerUserInfo?.brandLogoS3Url}
                      h={'50%'}
                      position={'absolute'}
                    />
                  </Center>
                </Box>
                <VStack spacing={'1.25rem'}>
                  <Box p={'2.5rem'} w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={'3rem'}
                      fontWeight={400}
                      lineHeight={'4.5rem'}
                    >
                      {sellerUserInfo.brandName}
                    </Text>
                  </Box>
                  <Box w={'100%'} px={'2.5rem'}>
                    <HStack spacing={'2.5rem'} alignItems={'flex-start'}>
                      {sellerUserId && (
                        <CategorySideBar
                          setListProduct={setListProduct}
                          currentPage={currentPage}
                          setCurrentPage={setCurrentPage}
                          totalCount={totalCount}
                          setTotalCount={setTotalCount}
                          contentNum={contentNum}
                          isSetCategory={isSetCategory}
                          setIsSetCategory={setIsSetCategory}
                          //
                          sellerUserId={sellerUserId}
                          selectedSort={selectedSort}
                          //
                          onClose={onClose}
                        />
                      )}
                      <Box w={'47.5rem'}>
                        <VStack spacing={0} h={'100%'}>
                          <Box py={'1rem'} w={'100%'}>
                            <HStack justifyContent={'space-between'}>
                              <Text
                                color={'#485766'}
                                fontSize={'1.125rem'}
                                fontWeight={400}
                                lineHeight={'1.96875rem'}
                              >
                                {`${utils.parseAmount(totalCount)} ${localeText(LANGUAGES.ITEMS)}`}
                              </Text>
                              <Box>
                                <HStack spacing={'1.3rem'}>
                                  {TextChecker(
                                    localeText(LANGUAGES.COMMON.MOST_POPULAR),
                                    1,
                                  )}
                                  {TextChecker(
                                    localeText(LANGUAGES.COMMON.NEW),
                                    2,
                                  )}
                                  {TextChecker(
                                    localeText(LANGUAGES.COMMON.PRICE),
                                    3,
                                  )}
                                </HStack>
                              </Box>
                            </HStack>
                          </Box>
                          <Box w={'100%'}>
                            {listProduct.length > 0 && listItems()}
                            {listProduct.length === 0 && (
                              <Center w={'100%'} h={'10rem'}>
                                <Text
                                  fontSize={'1.5rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {localeText(
                                    LANGUAGES.INFO_MSG.NO_ITEM_SEARCHED,
                                  )}
                                </Text>
                              </Center>
                            )}
                          </Box>
                          <Center w={'100%'} pt={'5rem'}>
                            <DefaultPaginate
                              currentPage={currentPage}
                              setCurrentPage={setCurrentPage}
                              totalCount={totalCount}
                              contentNum={contentNum}
                            />
                          </Center>
                        </VStack>
                      </Box>
                    </HStack>
                  </Box>
                </VStack>
              </Box>
              {/* right form */}
              <Box width={'40rem'} py={'2rem'} px={'2.5rem'} bg={'#8C644212'}>
                <VStack spacing={'2rem'}>
                  <Box w={'100%'}>
                    <VStack spacing={'0.75rem'}>
                      <Box w={'100%'}>
                        <Box
                          w={'100%'}
                          h={'0.75rem'}
                          position={'relative'}
                          bg={'#0000001A'}
                          borderRadius={'0.375rem'}
                        >
                          <Box
                            w={`${totalOrderAmountPercent}%`}
                            h={'100%'}
                            position={'absolute'}
                            left={0}
                            bg={'#90AEC4'}
                            borderRadius={'0.375rem'}
                          ></Box>
                        </Box>
                      </Box>
                      <Box w={'100%'}>
                        <HStack justify={'space-between'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.PURCHASE_MINIMUM)}
                          </Text>
                          <Text
                            color={'#556A7E'}
                            fontSize={'1rem'}
                            fontWeight={500}
                            lineHeight={'1.75rem'}
                          >
                            {utils.parseDallar(
                              sellerUserInfo.minimumOrderAmount,
                            )}
                          </Text>
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>

                  <Box w={'100%'} position={'relative'}>
                    <VStack spacing={'0.75rem'}>
                      <Box w={'100%'}>
                        <Text
                          opacity={'0.7'}
                          color={'#485766'}
                          fontSize={'1.125rem'}
                          fontWeight={400}
                          lineHeight={'2rem'}
                        >
                          {sellerUserInfo.brandName}
                        </Text>
                      </Box>
                      <Box
                        w={'100%'}
                        h={'562.5px'}
                        borderTop={'1px solid #AEBDCA'}
                        overflowY={'auto'}
                        className={'no-scroll'}
                      >
                        <VStack spacing={0}>
                          {listOrders.map((product, index) => {
                            return (
                              <ProductBrandRight
                                item={product}
                                key={index}
                                onChangeProduct={(count, item) =>
                                  handleChangeProduct(count, item, index)
                                }
                              />
                            );
                          })}
                          <Box
                            w={'100%'}
                            h={'8.789rem'}
                            pt={'1.25rem'}
                            cursor={'pointer'}
                            onClick={() => {
                              openModal({
                                type: 'confirm',
                                text: localeText(
                                  LANGUAGES.INFO_MSG.MOVE_CANCEL_ORDER,
                                ),
                                onAgree: () => {
                                  handleClearOrder();
                                  moveMain(true);
                                },
                              });
                            }}
                          >
                            <Text
                              textAlign="center"
                              color={'#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={500}
                              lineHeight={'1.75rem'}
                              textDecoration={'underline'}
                            >
                              {localeText(LANGUAGES.SEE_OTHER_BRANDED_PRODUCTS)}
                            </Text>
                          </Box>
                        </VStack>
                      </Box>
                    </VStack>
                    {insufficientAmount < 0 && (
                      <Box
                        position={'absolute'}
                        bottom={'1.25rem'}
                        w={'100%'}
                        py={'0.75rem'}
                        px={'1.5rem'}
                        borderRadius={'1.625rem'}
                        bg={'#E8DFCA'}
                      >
                        <HStack>
                          <Img src={Information.src} />
                          <Text
                            color={'#485766'}
                            fontSize={'1rem'}
                            fontWeight={500}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.INFO_MSG.ADD_OTHER_PRODUCTS, {
                              key: '@PRICE@',
                              value: insufficientAmount,
                            })}
                          </Text>
                        </HStack>
                      </Box>
                    )}
                  </Box>
                </VStack>
                <Box
                  w={'100%'}
                  borderTop={
                    listSelectedProduct.length > 3 ? '1px solid #9CADBE' : null
                  }
                >
                  <VStack spacing={'1.25rem'}>
                    <Box w={'100%'}>
                      <HStack justifyContent={'space-between'}>
                        <Box>
                          <Text
                            color={'#7895B2'}
                            fontSize={'1.125rem'}
                            fontWeight={400}
                            lineHeight={'1.96875rem'}
                          >
                            {localeText(LANGUAGES.ORDER.TOTAL_PRICE_LABEL)}
                          </Text>
                        </Box>
                        <Box>
                          <Text
                            color={'#556A7E'}
                            fontSize={'1.125rem'}
                            fontWeight={500}
                            lineHeight={'1.96875rem'}
                          >
                            {utils.parseDallar(totalOrderAmount)}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                    <Box w={'100%'}>
                      <Button
                        onClick={() => {
                          moveOrders(true);
                        }}
                        isDisabled={totalOrderAmountPercent !== 100}
                        py={'0.88rem'}
                        px={'2rem'}
                        _disabled={{
                          opacity: 0.5,
                          cursor:
                            totalOrderAmountPercent !== 100
                              ? 'not-allowed'
                              : 'pointer',
                        }}
                        _hover={{}}
                        borderRadius={'0.25rem'}
                        // bg={'#D9E7EC'}
                        bg={'#7895B2'}
                        h={'100%'}
                        w={'100%'}
                      >
                        <Text
                          color={'#FFF'}
                          fontSize={'1.25rem'}
                          fontWeight={400}
                          lineHeight={'2.25rem'}
                        >
                          {localeText(LANGUAGES.ORDER.CHECK_OUT)}
                        </Text>
                      </Button>
                    </Box>
                  </VStack>
                </Box>
              </Box>
            </HStack>
          </Box>

          <ContentBR h={'10rem'} />

          {/* footer */}
          <Footer />
        </VStack>
      </Center>
    </MainContainer>
  );
};

export default BrandProductPage;
