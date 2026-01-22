'use client';

import {
  Box,
  Center,
  HStack,
  Image as ChakraImage,
  Text,
  VStack,
  Img,
  Button,
  Divider,
} from '@chakra-ui/react';
import useLocale from '@/hooks/useLocale';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { COUNTRY, LANGUAGES } from '@/constants/lang';

import IconQuestion from '@public/svgs/icon/question.svg';
import IconEdit from '@public/svgs/icon/lounge-pen.svg';
import IconRight from '@public/svgs/icon/right.svg';
import WishListSwiper from '@/components/custom/mypage/information/WishListSwiper';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import { MY_CART, MY_PAGE } from '@/constants/pageURL';
import utils from '@/utils';
import useCustom from '@/hooks/useCustom';
import ProfileEdit from '@public/svgs/icon/profile-edit.svg';
import NoUser from '@public/svgs/icon/no-user.svg';
import Logout from '@public/svgs/icon/logout.svg';

import { useSetRecoilState } from 'recoil';
import { cartTabIndexState } from '@/stores/menuRecoil';
import { SUCCESS } from '@/constants/errorCode';
import buyerApi from '@/services/buyerUserApi';
import holdingCouponApi from '@/services/holdingCouponApi';
import ordersApi from '@/services/ordersApi';
import productFavoritesApi from '@/services/productFavoritesApi';
import useDevice from '@/hooks/useDevice';
import useAccount from '@/hooks/useAccount';

const MyPageInformationPage = () => {
  const { handleLogout } = useAccount();
  const { isMobile, clampW } = useDevice();
  const setCartTabIndex = useSetRecoilState(cartTabIndexState);
  const router = useRouter();
  const imageInput = useRef(null);
  const isLogin = utils.getIsLogin();

  const [currentPageWish, setCurrentPageWish] = useState(1);
  const [contentNumWish, setContentNumWish] = useState(5);

  const [currentPageOrders, setCurrentPageOrders] = useState(1);
  const [contentNumOrders, setContentNumOrders] = useState(5);

  const { getGrade } = useCustom();
  const [userInfo, setUserInfo] = useState({});
  const [userAddress, setUserAddress] = useState({});

  const onOpenTooltip = () => setIsTooptip(true);
  const onCloseTooltip = () => setIsTooptip(false);
  const [isTooltip, setIsTooptip] = useState(false);

  const { lang, localeText } = useLocale();

  const [listOrders, setListOrders] = useState([]);
  const [listCart, setListCart] = useState([]);
  const [listWish, setListWish] = useState([]);

  const [rewardCoin, setRewardCoin] = useState(0);
  const [couponCount, setCouponCount] = useState(0);

  useEffect(() => {
    handleGetMyInfo();
    handleGetListCoupon();
    handleGetMyReward();
    handleGetListWish();
    handleGetListOrders();
  }, []);

  const handleParseAddress = () => {
    let addr = null;
    if (userAddress.addressType === 1) {
      addr = userAddress.roadNameMainAddr;
      if (userAddress?.subAddr) {
        addr += ' ' + userAddress.subAddr;
      }
    } else {
      addr = userAddress.addressLineOne;
      if (userAddress?.addressLineTwo) {
        addr += ' ' + userAddress.addressLineTwo;
      }
    }
    return addr;
  };

  const handleGetMyInfo = useCallback(async () => {
    const result = await buyerApi.getBuyerMyInfo();
    if (result?.errorCode === SUCCESS) {
      setUserInfo(result.data);
      setUserAddress(result.data.rsGetUserAddressDTO);
    }
  });

  const handleGetListCoupon = useCallback(async () => {
    const param = {
      pageNum: 1,
      contentNum: 99999,
      status: 1,
    };
    const result = await holdingCouponApi.getListHoldingCoupon(param);
    if (result?.errorCode === SUCCESS) {
      setCouponCount(result.datas.length);
    } else {
      setCouponCount(0);
    }
  });

  const handleGetMyReward = useCallback(async () => {
    const result = await buyerApi.getBuyerMyReward();
    if (result?.errorCode === SUCCESS) {
      setRewardCoin(result.data.rewardCoin);
    }
  });

  const handleGetListOrders = useCallback(async () => {
    const param = {
      pageNum: currentPageOrders,
      contentNum: contentNumOrders,
    };
    const result = await ordersApi.getListOrders(param);
    if (result?.errorCode === SUCCESS) {
      setListOrders(result.datas);
    } else {
      setListOrders([]);
    }
  });

  const handleGetListWish = useCallback(async () => {
    const param = {
      pageNum: currentPageWish,
      contentNum: contentNumWish,
    };
    const result = await productFavoritesApi.getListProductFavorites(param);
    if (result?.errorCode === SUCCESS) {
      setListWish(result.datas);
    } else {
      setListWish([]);
    }
  });

  const [isEditProfile, setIsEditProfile] = useState(false);
  const editProfileImage = useCallback(() => {
    setIsEditProfile(true);
  });
  const closeEditProfileImage = useCallback(() => {
    setIsEditProfile(false);
  });

  const handleChangeImage = useCallback(() => {
    if (imageInput) {
      imageInput.current.click();
    }
  });

  const saveImageFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (data) => {
      if (typeof data.target?.result === 'string') {
        const srcData = data.target.result;

        handleUpdateUserProfileImage(file);
      } else {
        console.log('## image upload Failed');
      }
    };
  };

  const handleUpdateUserProfileImage = useCallback(async (file) => {
    const result = await buyerApi.patchBuyer(null, file);
    if (result?.errorCode === SUCCESS) {
      handleGetMyInfo();
    }
  });

  const handleWishlistView = useCallback(() => {
    setCartTabIndex(1);
    router.push(MY_CART.WISH_LIST);
  });

  const handleRecentOrdersView = useCallback(() => {
    router.push(MY_PAGE.ORDER_HISTORY);
  });

  const handleCoupon = useCallback(() => {
    router.push(MY_PAGE.COUPON);
  });

  const orderCard = useCallback((item, index) => {
    const status = item?.status;
    const orderNum = item?.orderNum;
    const actualAmount = item?.actualAmount;
    const totalAmount = item?.totalAmount;
    const discountAmount = item?.discountAmount;
    const ordersId = item?.ordersId;
    const payStatus = item?.payStatus;
    const createdAt = item?.createdAt;

    const ordersProducts = item?.ordersProducts;
    let ordersCount = 0;

    // firstOrdersProduct
    let name = null;
    let count = null;
    let brandName = null;
    let productId = null;
    let ordersProductId = null;
    let unitPrice = null;
    let totalPrice = null;
    let ordersProductOptionList = null;
    let deliveryStatus = null;

    let firstImageSrc = null;
    if (ordersProducts.length > 0) {
      ordersCount = ordersProducts.length - 1;
      const firstOrdersProduct = ordersProducts[0];
      name = firstOrdersProduct?.name;
      count = firstOrdersProduct?.count;
      brandName = firstOrdersProduct?.brandName;
      productId = firstOrdersProduct?.productId;
      ordersProductId = firstOrdersProduct?.ordersProductId;
      unitPrice = firstOrdersProduct?.unitPrice;
      totalPrice = firstOrdersProduct?.totalPrice;
      deliveryStatus = firstOrdersProduct?.deliveryStatus;
      ordersProductOptionList =
        firstOrdersProduct.ordersProductOptionList || [];
      const productImageList = firstOrdersProduct?.productImageList || [];
      if (productImageList.length > 0) {
        firstImageSrc = productImageList[0].imageS3Url;
      }
    }

    return isMobile(true) ? (
      <div
        key={index}
        style={{
          alignSelf: 'stretch',
          paddingLeft: '0.75rem',
          paddingRight: '0.75rem',
          paddingTop: '1rem',
          paddingBottom: '1rem',
          borderTop: '1px var(--Semantic-border-default, #AEBDCA) solid',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '0.75rem',
          display: 'inline-flex',
        }}
      >
        <div
          style={{
            flex: '1 1 0',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '0.75rem',
            display: 'inline-flex',
          }}
        >
          <div
            style={{
              alignSelf: 'stretch',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '2.25rem',
              display: 'inline-flex',
            }}
          >
            <Center w={clampW(5, 5)} minW={clampW(5, 5)} h={clampW(5, 5)}>
              <ChakraImage
                fallback={<DefaultSkeleton />}
                w={'100%'}
                h={'100%'}
                src={firstImageSrc}
              />
            </Center>
            <div
              style={{
                flex: '1 1 0',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '0.75rem',
                display: 'inline-flex',
              }}
            >
              <div
                style={{
                  alignSelf: 'stretch',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  display: 'inline-flex',
                }}
              >
                <div
                  style={{
                    flex: '1 1 0',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    display: 'inline-flex',
                  }}
                >
                  <div
                    style={{
                      opacity: 0.7,
                      justifyContent: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      color: 'var(--Semantic-text-brand-default, #485766)',
                      fontSize: '0.875rem',

                      fontWeight: '400',
                      lineHeight: '1.4rem',
                      wordWrap: 'break-word',
                    }}
                  >
                    {brandName}
                  </div>
                  <div
                    style={{
                      justifyContent: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      color: 'var(--Semantic-text-brand-default, #485766)',
                      fontSize: '0.9375rem',

                      fontWeight: '500',
                      lineHeight: '1.5rem',
                      wordWrap: 'break-word',
                    }}
                  >
                    {name}
                    {ordersCount > 0 && (
                      <Box w={'max-content'}>
                        <Text
                          color={'#485766'}
                          fontSize={'1rem'}
                          fontWeight={500}
                          lineHeight={'1.75rem'}
                        >
                          {lang === COUNTRY.COUNTRY_INFO.KR.LANG
                            ? `외 ${ordersCount} 개`
                            : `and ${ordersCount} others`}
                        </Text>
                      </Box>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              alignSelf: 'stretch',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: '0.75rem',
              display: 'flex',
            }}
          >
            <div
              style={{
                alignSelf: 'stretch',
                justifyContent: 'center',
                alignItems: 'flex-start',
                gap: '2.25rem',
                display: 'inline-flex',
              }}
            >
              <div
                style={{
                  width: '5rem',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  color: 'var(--Semantic-text-brand-strong, #2A333C)',
                  fontSize: '0.75rem',

                  fontWeight: '500',
                  lineHeight: '1.2rem',
                  wordWrap: 'break-word',
                }}
              >
                {localeText(LANGUAGES.ORDER.DATE)}
              </div>
              <div
                style={{
                  flex: '1 1 0',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  color: 'var(--Semantic-text-brand-default, #485766)',
                  fontSize: '0.75rem',

                  fontWeight: '400',
                  lineHeight: '1.2rem',
                  wordWrap: 'break-word',
                }}
              >
                {utils.parseDateByCountryCode(createdAt, lang)}
              </div>
            </div>
            <div
              style={{
                alignSelf: 'stretch',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '2.25rem',
                display: 'inline-flex',
              }}
            >
              <div
                style={{
                  width: '5rem',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  color: 'var(--Semantic-text-brand-strong, #2A333C)',
                  fontSize: '0.75rem',

                  fontWeight: '500',
                  lineHeight: '1.2rem',
                  wordWrap: 'break-word',
                }}
              >
                {localeText(LANGUAGES.ORDER.ORDER_NUMBER)}
              </div>
              <div
                style={{
                  flex: '1 1 0',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  color: 'var(--Semantic-text-brand-default, #485766)',
                  fontSize: '0.75rem',

                  fontWeight: '400',
                  lineHeight: '1.2rem',
                  wordWrap: 'break-word',
                }}
              >
                {orderNum}
              </div>
            </div>
            <div
              style={{
                alignSelf: 'stretch',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '2.25rem',
                display: 'inline-flex',
              }}
            >
              <div
                style={{
                  width: '5rem',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  color: 'var(--Semantic-text-brand-strong, #2A333C)',
                  fontSize: '0.75rem',

                  fontWeight: '500',
                  lineHeight: '1.2rem',
                  wordWrap: 'break-word',
                }}
              >
                {localeText(LANGUAGES.ORDER.TOTAL_ORDER_PRICE)}
              </div>
              <div
                style={{
                  flex: '1 1 0',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  color: 'var(--Semantic-text-brand-default, #485766)',
                  fontSize: '0.75rem',

                  fontWeight: '400',
                  lineHeight: '1.2rem',
                  wordWrap: 'break-word',
                }}
              >
                {utils.parseDallar(totalAmount)}
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <Box
        key={index}
        w={'100%'}
        borderBottom="1px solid #73829D"
        p={'1.25rem'}
      >
        <HStack spacing={'0.75rem'}>
          <Box width={'7.5rem'}>
            <Text
              color={'#485766'}
              textAlign={'left'}
              fontSize={'1rem'}
              fontWeight={400}
              lineHeight={'1.75rem'}
            >
              {utils.parseDateByCountryCode(createdAt, lang)}
            </Text>
          </Box>
          <Box width={'10rem'}>
            <Text
              color={'#485766'}
              textAlign={'center'}
              fontSize={'1rem'}
              fontWeight={400}
              lineHeight={'1.75rem'}
            >
              {orderNum}
            </Text>
          </Box>
          <Box width={'55.25rem'}>
            <HStack spacing={'0.75rem'}>
              <Center w={'6.25rem'} h={'6.25rem'}>
                <ChakraImage
                  fallback={<DefaultSkeleton />}
                  w={'100%'}
                  h={'100%'}
                  src={firstImageSrc}
                />
              </Center>
              <Box>
                <HStack spacing={'0.75rem'}>
                  <Box>
                    <Text
                      color={'#66809C'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {brandName || ''}
                    </Text>
                  </Box>
                  <Box w={'max-content'}>
                    <HStack spacing={'0.75rem'}>
                      <Text
                        color={'#485766'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                      >
                        {name || ''}
                      </Text>
                      {ordersCount > 0 && (
                        <Box w={'max-content'}>
                          <Text
                            color={'#485766'}
                            fontSize={'1rem'}
                            fontWeight={500}
                            lineHeight={'1.75rem'}
                          >
                            {lang === COUNTRY.COUNTRY_INFO.KR.LANG
                              ? `외 ${ordersCount} 개`
                              : `and ${ordersCount} others`}
                          </Text>
                        </Box>
                      )}
                    </HStack>
                  </Box>
                </HStack>
              </Box>
            </HStack>
          </Box>
          <Box width={'10rem'}>
            <Text
              color={'#485766'}
              textAlign={'center'}
              fontSize={'1rem'}
              fontWeight={400}
              lineHeight={'1.75rem'}
            >
              {utils.parseDallar(totalAmount)}
            </Text>
          </Box>
        </HStack>
      </Box>
    );
  });

  return isMobile(true) ? (
    <Box w={'100%'}>
      <VStack spacing={'2rem'}>
        {/* user info */}
        <Box w={'100%'}>
          <VStack spacing={0}>
            <Box w={'100%'}>
              <VStack spacing={'2rem'} bg={'#8c644212'} p={'1rem'}>
                <Box w={'100%'}>
                  <HStack spacing={'0.75rem'}>
                    <Center
                      w={clampW(3, 7)}
                      h={clampW(3, 7)}
                      borderRadius={clampW(3.125, 7)}
                      onMouseOver={editProfileImage}
                      onMouseLeave={closeEditProfileImage}
                      position={'relative'}
                    >
                      <input
                        onChange={(e) => {
                          saveImageFile(e);
                        }}
                        style={{ display: 'none' }}
                        type="file"
                        accept="image/*"
                        ref={imageInput}
                      />

                      {isEditProfile && (
                        <Center
                          cursor={'pointer'}
                          onClick={() => {
                            handleChangeImage();
                          }}
                          borderRadius={clampW(3.125, 7)}
                          w={'100%'}
                          h={'100%'}
                          position={'absolute'}
                          _hover={{
                            bg: '#00000066',
                          }}
                        >
                          <Img src={ProfileEdit.src} />
                        </Center>
                      )}
                      <ChakraImage
                        borderRadius={clampW(3.125, 7)}
                        fallback={
                          <Img src={NoUser.src} w={'100%'} h={'100%'} />
                        }
                        w={'100%'}
                        h={'100%'}
                        objectFit={'cover'}
                        src={userInfo?.profileS3Url}
                      />
                    </Center>
                    <Box>
                      <VStack spacing={0}>
                        <Box w={'100%'}>
                          <Text
                            color={'#2A333C'}
                            fontSize={clampW(0.9375, 1.5)}
                            fontWeight={500}
                          >
                            {userInfo.name}
                          </Text>
                        </Box>
                        <Box w={'100%'}>
                          <Text
                            color={'#66809C'}
                            fontSize={clampW(0.8125, 1)}
                            fontWeight={500}
                          >
                            {userInfo.id}
                          </Text>
                        </Box>
                      </VStack>
                    </Box>
                  </HStack>
                </Box>
                <Box w={'100%'}>
                  <HStack
                    spacing={'0.75rem'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <Box w={'33%'}>
                      <VStack spacing={'0.5rem'}>
                        <Box w={'100%'}>
                          <HStack
                            spacing={clampW(0.2, 0.5)}
                            alignItems={'center'}
                          >
                            <Text
                              color={'#556A7E'}
                              fontSize={clampW(0.75, 1)}
                              fontWeight={400}
                            >
                              {localeText(LANGUAGES.MY_PAGE.MEMBERSHIP)}
                            </Text>
                            <Box
                              position={'relative'}
                              display="inline-block"
                              cursor={'pointer'}
                              onMouseOver={onOpenTooltip}
                              onMouseLeave={onCloseTooltip}
                            >
                              <ChakraImage
                                fallback={<DefaultSkeleton />}
                                src={IconQuestion.src}
                                w={'1rem'}
                                minW={'1rem'}
                                aspectRatio={1}
                              />
                              <Box
                                zIndex={3}
                                position={'absolute'}
                                top={'calc(100% + 12px)'}
                                left={'-5rem'}
                                aspectRatio={26.25 / 14.25}
                                w={clampW(20, 26.25)}
                                py={'1.25rem'}
                                px={'1.5rem'}
                                bg={'#FFF'}
                                color={'#000'}
                                opacity={isTooltip ? 1 : 0}
                                visibility={isTooltip ? 'visible' : 'hidden'}
                                transition="opacity 0.2s ease-in-out"
                              >
                                <VStack spacing={'0.62rem'}>
                                  <Box w={'100%'}>
                                    <Text
                                      color={'#485766'}
                                      fontSize={clampW(0.75, 1)}
                                      fontWeight={400}
                                      lineHeight={'160%'}
                                    >
                                      {localeText(LANGUAGES.MY_PAGE.MEMBERSHIP)}
                                    </Text>
                                  </Box>
                                  <Box w={'100%'}>
                                    <Text
                                      color={'#485766'}
                                      fontSize={clampW(0.75, 1)}
                                      fontWeight={400}
                                      lineHeight={'160%'}
                                      whiteSpace={'pre-wrap'}
                                    >
                                      {localeText(
                                        LANGUAGES.INFO_MSG.MEMBERSHIP_CONTENT1,
                                      )}
                                    </Text>
                                  </Box>
                                  <Box w={'100%'}>
                                    <Text
                                      color={'#A87C4E'}
                                      fontSize={clampW(0.75, 1)}
                                      fontWeight={400}
                                      lineHeight={'160%'}
                                      whiteSpace={'pre-wrap'}
                                    >
                                      {localeText(
                                        LANGUAGES.INFO_MSG.MEMBERSHIP_CONTENT2,
                                      )}
                                    </Text>
                                  </Box>
                                </VStack>
                              </Box>
                            </Box>
                          </HStack>
                        </Box>
                        <Box w={'100%'}>
                          <Text
                            color={'#000'}
                            fontSize={clampW(1.4, 1.5)}
                            fontWeight={400}
                          >
                            {getGrade(userInfo.grade || 0)}
                          </Text>
                        </Box>
                      </VStack>
                    </Box>
                    <Box
                      w={'33%'}
                      cursor={'pointer'}
                      onClick={() => {
                        handleCoupon();
                      }}
                    >
                      <VStack spacing={'0.5rem'}>
                        <Box w={'100%'}>
                          <Text
                            color={'#556A7E'}
                            fontSize={clampW(0.75, 1)}
                            fontWeight={400}
                          >
                            {localeText(LANGUAGES.MY_PAGE.COUPON.COUPON)}
                          </Text>
                        </Box>
                        <Box w={'100%'}>
                          <Text
                            color={'#000'}
                            fontSize={clampW(1.4, 1.5)}
                            fontWeight={400}
                          >
                            {utils.parseAmount(couponCount)}
                          </Text>
                        </Box>
                      </VStack>
                    </Box>
                    <Box w={'33%'}>
                      <VStack spacing={'0.5rem'}>
                        <Box w={'100%'}>
                          <Text
                            color={'#556A7E'}
                            fontSize={clampW(0.75, 1)}
                            fontWeight={400}
                          >
                            {localeText(LANGUAGES.MY_PAGE.REWARD_COINS)}
                          </Text>
                        </Box>
                        <Box w={'100%'}>
                          <Text
                            color={'#000'}
                            fontSize={clampW(1.4, 1.5)}
                            fontWeight={400}
                          >
                            {rewardCoin}
                          </Text>
                        </Box>
                      </VStack>
                    </Box>
                  </HStack>
                </Box>
                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <VStack spacing={'0.25rem'}>
                        <Box w={'100%'}>
                          <HStack justifyContent={'space-between'}>
                            <Text
                              color={'#66809C'}
                              fontSize={clampW(0.75, 1)}
                              fontWeight={400}
                            >
                              {localeText(LANGUAGES.ACC.SU.BUSINESS_NAME)}
                            </Text>
                            <Center
                              w={clampW(1.5, 2)}
                              h={clampW(1.5, 2)}
                              onClick={() => {
                                router.push(MY_PAGE.INFO_EDIT);
                              }}
                            >
                              <Img src={IconEdit.src} />
                            </Center>
                          </HStack>
                        </Box>
                        <Box w={'100%'}>
                          <Text
                            color={'#485766'}
                            fontSize={clampW(0.8125, 1.125)}
                            fontWeight={500}
                          >
                            {userInfo?.businessName || ''}
                          </Text>
                        </Box>
                      </VStack>
                    </Box>
                    <Box w={'100%'}>
                      <VStack spacing={'0.25rem'}>
                        <Box w={'100%'}>
                          <Text
                            color={'#66809C'}
                            fontSize={clampW(0.75, 1)}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.ADDRESS.ADDRESS)}
                          </Text>
                        </Box>
                        <Box w={'100%'}>
                          <Text
                            w={'100%'}
                            color={'#485766'}
                            fontSize={clampW(0.8125, 1.125)}
                            fontWeight={500}
                            lineHeight={'1.96875rem'}
                            whiteSpace={'nowrap'}
                            overflow={'hidden'}
                            textOverflow={'ellipsis'}
                          >
                            {handleParseAddress()}
                          </Text>
                        </Box>
                      </VStack>
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </VStack>
        </Box>

        <Box w={'100%'}>
          <VStack spacing={'0.5rem'}>
            <Box w={'100%'}>
              <HStack justifyContent={'space-between'}>
                <Box>
                  <Text
                    color={'#485766'}
                    fontSize={clampW(1, 1.5)}
                    fontWeight={500}
                  >
                    {localeText(LANGUAGES.ORDER.WISH_LIST)}
                  </Text>
                </Box>
                <Box
                  cursor={'pointer'}
                  onClick={() => {
                    handleWishlistView();
                  }}
                >
                  <HStack spacing={'0.5rem'}>
                    <Text
                      color={'#556A7E'}
                      fontSize={clampW(0.875, 1.125)}
                      fontWeight={400}
                    >
                      {localeText(LANGUAGES.VIEW_ALL)}
                    </Text>
                    <Center w={clampW(1, 1.25)} h={clampW(1, 1.25)}>
                      <Img src={IconRight.src} />
                    </Center>
                  </HStack>
                </Box>
              </HStack>
            </Box>
            <Box w={'100%'}>
              <WishListSwiper data={listWish} isDetail />
            </Box>
          </VStack>
        </Box>

        <Box w={'100%'}>
          <VStack spacing={'1.5rem'}>
            <Box w={'100%'}>
              <HStack justifyContent={'space-between'}>
                <Box>
                  <Text
                    color={'#485766'}
                    fontSize={clampW(1, 1.5)}
                    fontWeight={500}
                    lineHeight={'2.475rem'}
                  >
                    {localeText(LANGUAGES.ORDER.RECENT_ORDERS)}
                  </Text>
                </Box>
                <Box
                  cursor={'pointer'}
                  onClick={() => {
                    handleRecentOrdersView();
                  }}
                >
                  <HStack spacing={'0.5rem'}>
                    <Text
                      color={'#556A7E'}
                      fontSize={clampW(0.875, 1.125)}
                      fontWeight={400}
                    >
                      {localeText(LANGUAGES.VIEW_ALL)}
                    </Text>
                    <Center w={clampW(1, 1.25)} h={clampW(1, 1.25)}>
                      <Img src={IconRight.src} />
                    </Center>
                  </HStack>
                </Box>
              </HStack>
            </Box>

            <Box w={'100%'}>
              <VStack spacing={0}>
                {listOrders.map((orders, index) => {
                  return orderCard(orders, index);
                })}
                {listOrders.length === 0 && (
                  <Center w={'100%'} h={'10rem'}>
                    <Text
                      fontSize={'1.5rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(LANGUAGES.INFO_MSG.NO_POST)}
                    </Text>
                  </Center>
                )}
              </VStack>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ) : (
    <Box w={'100%'}>
      <VStack spacing={'7.5rem'}>
        <Box w={'100%'}>
          <VStack spacing={0}>
            <Box w={'100%'} py={'2.5rem'}>
              <HStack justifyContent={'space-between'}>
                <Box minW={'25rem'}>
                  <HStack spacing={'1.5rem'}>
                    <Center
                      w={'7rem'}
                      h={'7rem'}
                      borderRadius={'7rem'}
                      onMouseOver={editProfileImage}
                      onMouseLeave={closeEditProfileImage}
                      position={'relative'}
                    >
                      <input
                        onChange={(e) => {
                          saveImageFile(e);
                        }}
                        style={{ display: 'none' }}
                        type="file"
                        accept="image/*"
                        ref={imageInput}
                      />

                      {isEditProfile && (
                        <Center
                          cursor={'pointer'}
                          onClick={() => {
                            handleChangeImage();
                          }}
                          borderRadius={'7rem'}
                          w={'100%'}
                          h={'100%'}
                          position={'absolute'}
                          _hover={{
                            bg: '#00000066',
                          }}
                        >
                          <Img src={ProfileEdit.src} />
                        </Center>
                      )}
                      <ChakraImage
                        borderRadius={'7rem'}
                        fallback={
                          <Img src={NoUser.src} w={'100%'} h={'100%'} />
                        }
                        w={'100%'}
                        h={'100%'}
                        objectFit={'cover'}
                        src={userInfo?.profileS3Url}
                      />
                    </Center>
                    <Box>
                      <VStack spacing={0}>
                        <Box w={'100%'}>
                          <Text
                            color={'#2A333C'}
                            fontSize={'1.5rem'}
                            fontWeight={500}
                            lineHeight={'2.475rem'}
                          >
                            {userInfo.name}
                          </Text>
                        </Box>
                        <Box w={'100%'}>
                          <Text
                            color={'#66809C'}
                            fontSize={'1rem'}
                            fontWeight={500}
                            lineHeight={'1.75rem'}
                          >
                            {userInfo.id}
                          </Text>
                        </Box>
                      </VStack>
                    </Box>
                  </HStack>
                </Box>
                <Box w={'48rem'}>
                  <HStack spacing={0} alignItems={'center'}>
                    <Box minW={'10rem'} w={'33%'}>
                      <VStack spacing={'0.5rem'}>
                        <Box w={'100%'}>
                          <HStack spacing={'0.5rem'} alignItems={'center'}>
                            <Center h={'1.75rem'}>
                              <Text
                                color={'#556A7E'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                              >
                                {localeText(LANGUAGES.MY_PAGE.MEMBERSHIP)}
                              </Text>
                            </Center>
                            <Box
                              position="relative"
                              display="inline-block"
                              cursor={'pointer'}
                              onMouseOver={onOpenTooltip}
                              onMouseLeave={onCloseTooltip}
                            >
                              <ChakraImage
                                fallback={<DefaultSkeleton />}
                                src={IconQuestion.src}
                                w={'1.5rem'}
                                h={'1.5rem'}
                              />
                              <Box
                                zIndex={3}
                                position={'absolute'}
                                top={'calc(100% + 12px)'}
                                left={'0%'}
                                w={'26.25rem'}
                                h={'14.25rem'}
                                py={'1.25rem'}
                                px={'1.5rem'}
                                bg={'#FFF'}
                                color={'#000'}
                                opacity={isTooltip ? 1 : 0}
                                visibility={isTooltip ? 'visible' : 'hidden'}
                                transition="opacity 0.2s ease-in-out"
                              >
                                <VStack spacing={'0.62rem'}>
                                  <Box w={'100%'}>
                                    <Text
                                      color={'#485766'}
                                      fontSize={'1rem'}
                                      fontWeight={400}
                                      lineHeight={'1.75rem'}
                                    >
                                      {localeText(LANGUAGES.MY_PAGE.MEMBERSHIP)}
                                    </Text>
                                  </Box>
                                  <Box w={'100%'}>
                                    <Text
                                      color={'#485766'}
                                      fontSize={'1rem'}
                                      fontWeight={400}
                                      lineHeight={'1.75rem'}
                                      whiteSpace={'pre-wrap'}
                                    >
                                      {localeText(
                                        LANGUAGES.INFO_MSG.MEMBERSHIP_CONTENT1,
                                      )}
                                    </Text>
                                  </Box>
                                  <Box w={'100%'}>
                                    <Text
                                      color={'#A87C4E'}
                                      fontSize={'1rem'}
                                      fontWeight={400}
                                      lineHeight={'1.75rem'}
                                      whiteSpace={'pre-wrap'}
                                    >
                                      {localeText(
                                        LANGUAGES.INFO_MSG.MEMBERSHIP_CONTENT2,
                                      )}
                                    </Text>
                                  </Box>
                                </VStack>
                              </Box>
                            </Box>
                          </HStack>
                        </Box>
                        <Box w={'100%'}>
                          <Text
                            color={'#000'}
                            fontSize={'1.5rem'}
                            fontWeight={400}
                            lineHeight={'2.475rem'}
                          >
                            {getGrade(userInfo.grade || 0)}
                          </Text>
                        </Box>
                      </VStack>
                    </Box>
                    <Box
                      minW={'10rem'}
                      w={'33%'}
                      cursor={'pointer'}
                      onClick={() => {
                        handleCoupon();
                      }}
                    >
                      <VStack spacing={'0.5rem'}>
                        <Box w={'100%'}>
                          <HStack spacing={'0.5rem'}>
                            <Center h={'1.75rem'}>
                              <Text
                                color={'#556A7E'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                              >
                                {localeText(LANGUAGES.MY_PAGE.COUPON.COUPON)}
                              </Text>
                            </Center>
                            <Center w={'1.25rem'} h={'1.25rem'}>
                              <Img src={IconRight.src} />
                            </Center>
                          </HStack>
                        </Box>
                        <Box w={'100%'}>
                          <Text
                            color={'#000'}
                            fontSize={'1.5rem'}
                            fontWeight={400}
                            lineHeight={'2.475rem'}
                          >
                            {utils.parseAmount(couponCount)}
                          </Text>
                        </Box>
                      </VStack>
                    </Box>
                    <Box
                      minW={'10rem'}
                      w={'33%'}
                      // cursor={'pointer'}
                      onClick={() => {
                        // handleRewardCoin();
                      }}
                    >
                      <VStack spacing={'0.5rem'}>
                        <Box w={'100%'}>
                          <HStack spacing={'0.5rem'}>
                            <Center h={'1.75rem'}>
                              <Text
                                color={'#556A7E'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                              >
                                {localeText(LANGUAGES.MY_PAGE.REWARD_COINS)}
                              </Text>
                            </Center>
                            <Center w={'1.25rem'} h={'1.25rem'}>
                              <Img src={IconRight.src} />
                            </Center>
                          </HStack>
                        </Box>
                        <Box w={'100%'}>
                          <Text
                            color={'#000'}
                            fontSize={'1.5rem'}
                            fontWeight={400}
                            lineHeight={'2.475rem'}
                          >
                            {rewardCoin}
                          </Text>
                        </Box>
                      </VStack>
                    </Box>
                  </HStack>
                </Box>
              </HStack>
            </Box>

            {/*  */}
            <div
              style={{
                alignSelf: 'stretch',
                padding: '1.25rem',
                background:
                  'var(--Semantic-fill-baige-hover, rgba(140, 100, 66, 0.07))',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '2.5rem',
                display: 'inline-flex',
              }}
            >
              <div
                style={{
                  flex: '1 1 0',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  display: 'flex',
                }}
              >
                <div
                  style={{
                    minWidth: '7rem',
                    width: '50%',
                    maxwidth: '28.75rem',
                    // width: '28.75rem',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '1.5rem',
                    display: 'flex',
                  }}
                >
                  <div
                    style={{
                      minWidth: 'max-content',
                      justifyContent: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      color: 'var(--Semantic-text-brand-subtler, #66809C)',
                      fontSize: '1rem',

                      fontWeight: '400',
                      lineHeight: '1.75rem',
                      wordWrap: 'break-word',
                    }}
                  >
                    {localeText(LANGUAGES.ACC.SU.BUSINESS_NAME)}
                  </div>
                  <div
                    style={{
                      justifyContent: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      color: 'var(--Semantic-text-brand-default, #485766)',
                      fontSize: '1.125rem',

                      fontWeight: '500',
                      lineHeight: '1.96875rem',
                      wordWrap: 'break-word',
                    }}
                  >
                    {userInfo?.businessName || ''}
                  </div>
                </div>
                <div
                  style={{
                    flex: '1 1 0',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '1.5rem',
                    display: 'flex',
                  }}
                >
                  <div
                    style={{
                      minWidth: 'max-content',
                      justifyContent: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      color: 'var(--Semantic-text-brand-subtler, #66809C)',
                      fontSize: '1rem',

                      fontWeight: '400',
                      lineHeight: '1.75rem',
                      wordWrap: 'break-word',
                    }}
                  >
                    {localeText(LANGUAGES.ADDRESS.ADDRESS)}
                  </div>
                  <div
                    style={{
                      justifyContent: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      color: 'var(--Semantic-text-brand-default, #485766)',
                      fontSize: '1.125rem',

                      fontWeight: '500',
                      lineHeight: '1.96875rem',
                      wordWrap: 'break-word',
                      // whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {handleParseAddress()}
                  </div>
                </div>
              </div>

              <div
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: '0.75rem',
                  display: 'flex',
                }}
              >
                <div
                  data-design="line"
                  data-size="Small"
                  data-status="Default"
                  style={{
                    minWidth: '7rem',
                    paddingLeft: '1.25rem',
                    paddingRight: '1.25rem',
                    paddingTop: '0.625rem',
                    paddingBottom: '0.625rem',
                    borderRadius: '0.25rem',
                    outline:
                      '1px var(--Semantic-border-stronger, #73829D) solid',
                    outlineOffset: '-1px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '0.5rem',
                    display: 'flex',
                  }}
                >
                  <div
                    onClick={() => {
                      handleLogout();
                    }}
                    style={{
                      cursor: 'pointer',
                      justifyContent: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      color: 'var(--Semantic-text-brand-subtle, #556A7E)',
                      fontSize: '1rem',
                      fontWeight: '400',
                      lineHeight: '1.75rem',
                      wordWrap: 'break-word',
                    }}
                  >
                    {localeText(LANGUAGES.COMMON.LOGOUT)}
                  </div>
                </div>
                <div
                  data-design="Default"
                  data-size="Small"
                  data-status="Default"
                  style={{
                    minWidth: '7rem',
                    paddingLeft: '1.25rem',
                    paddingRight: '1.25rem',
                    paddingTop: '0.625rem',
                    paddingBottom: '0.625rem',
                    background: 'var(--Semantic-fill-brand-strong, #7895B2)',
                    borderRadius: '0.25rem',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '0.5rem',
                    display: 'flex',
                  }}
                >
                  <div
                    onClick={() => {
                      router.push(MY_PAGE.INFO_EDIT);
                    }}
                    style={{
                      cursor: 'pointer',
                      justifyContent: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      color: 'var(--Semantic-text-inverse-default, white)',
                      fontSize: '1rem',
                      fontWeight: '400',
                      lineHeight: '1.75rem',
                      wordWrap: 'break-word',
                    }}
                  >
                    {localeText(LANGUAGES.MY_PAGE.EDIT_ACCOUNT_INFO)}
                  </div>
                </div>
              </div>
            </div>
          </VStack>
        </Box>
        <Box w={'100%'}>
          <VStack spacing={'2rem'}>
            <Box w={'100%'}>
              <HStack justifyContent={'space-between'}>
                <Box>
                  <Text
                    color={'#485766'}
                    fontSize={clampW(1, 1.5)}
                    fontWeight={500}
                    lineHeight={'2.475rem'}
                  >
                    {localeText(LANGUAGES.ORDER.WISH_LIST)}
                  </Text>
                </Box>
                <Box
                  cursor={'pointer'}
                  onClick={() => {
                    handleWishlistView();
                  }}
                >
                  <HStack spacing={'0.5rem'}>
                    <Text
                      color={'#556A7E'}
                      fontSize={'1.125rem'}
                      fontWeight={400}
                      lineHeight={'1.96875rem'}
                    >
                      {localeText(LANGUAGES.VIEW_ALL)}
                    </Text>
                    <Center w={'1.25rem'} h={'1.25rem'}>
                      <Img src={IconRight.src} />
                    </Center>
                  </HStack>
                </Box>
              </HStack>
            </Box>
            <Divider borderTop={'1px solid #73829D'} />
            <Box w={'100%'}>
              <WishListSwiper data={listWish} />
            </Box>
          </VStack>
        </Box>
        <Box w={'100%'}>
          <VStack spacing={'2rem'}>
            <Box w={'100%'}>
              <HStack justifyContent={'space-between'}>
                <Box>
                  <Text
                    color={'#485766'}
                    fontSize={clampW(1, 1.5)}
                    fontWeight={500}
                    lineHeight={'2.475rem'}
                  >
                    {localeText(LANGUAGES.ORDER.RECENT_ORDERS)}
                  </Text>
                </Box>
                <Box
                  cursor={'pointer'}
                  onClick={() => {
                    handleRecentOrdersView();
                  }}
                >
                  <HStack spacing={'0.5rem'}>
                    <Text
                      color={'#556A7E'}
                      fontSize={'1.125rem'}
                      fontWeight={400}
                      lineHeight={'1.96875rem'}
                    >
                      {localeText(LANGUAGES.VIEW_ALL)}
                    </Text>
                    <Center w={'1.25rem'} h={'1.25rem'}>
                      <Img src={IconRight.src} />
                    </Center>
                  </HStack>
                </Box>
              </HStack>
            </Box>

            <Box w={'100%'}>
              {/* Product Rows */}
              <VStack spacing={0}>
                {/* header */}
                <Box
                  w={'100%'}
                  borderTop="1px solid #73829D"
                  borderBottom="1px solid #73829D"
                  px={'1.25rem'}
                  py={'1rem'}
                >
                  <HStack spacing={'0.75rem'}>
                    <Box width={'7.5rem'}>
                      <Text
                        textAlign={'center'}
                        color={'#2A333C'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.ORDER.DATE)}
                      </Text>
                    </Box>
                    <Box width={'10rem'}>
                      <Text
                        textAlign={'center'}
                        color={'#2A333C'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.ORDER.ORDER_NUMBER)}
                      </Text>
                    </Box>
                    <Box width={'55.25rem'}>
                      <Text
                        textAlign={'center'}
                        color={'#2A333C'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.ORDER.PRODUCT)}
                      </Text>
                    </Box>
                    <Box width={'10rem'}>
                      <Text
                        textAlign={'center'}
                        color={'#2A333C'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.ORDER.TOTAL_PRICE)}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
                {/* body */}
                <Box w={'100%'}>
                  <VStack spacing={0}>
                    {listOrders.map((orders, index) => {
                      return orderCard(orders, index);
                    })}
                    {listOrders.length === 0 && (
                      <Center w={'100%'} h={'10rem'}>
                        <Text
                          fontSize={'1.5rem'}
                          fontWeight={500}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.INFO_MSG.NO_POST)}
                        </Text>
                      </Center>
                    )}
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default MyPageInformationPage;
