'use client';

import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import {
  Box,
  Center,
  HStack,
  Text,
  VStack,
  Select,
  useDisclosure,
  Img,
  Flex,
  Button,
  RadioGroup,
  Radio,
  Image as ChakraImage,
  Divider,
} from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { DefaultPaginate } from '@/components';
import SearchInput from '@/components/custom/input/SearchInput';
import ContentBR from '@/components/common/ContentBR';
import IconRight from '@public/svgs/icon/right.svg';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import IconQuestion from '@public/svgs/icon/question.svg';
import RewardModal from '@/components/custom/modal/RewardModal';
import buyerUserApi from '@/services/buyerUserApi';
import MainContainer from '@/components/layout/MainContainer';
import { SUCCESS } from '@/constants/errorCode';
import utils from '@/utils';
import useStatus from '@/hooks/useStatus';
import ordersProductApi from '@/services/ordersProductApi';
import { LIST_CONTENT_NUM } from '@/constants/common';
import rewardApi from '@/services/rewardApi';
import holdingCouponApi from '@/services/holdingCouponApi';
import useModal from '@/hooks/useModal';

const BuyerDetailPage = () => {
  const router = useRouter();
  const { buyerUserId } = useParams();
  const { openModal } = useModal();
  const { handleGetGrade } = useStatus();
  const { lang, localeText } = useLocale();

  const [searchBy, setSearchBy] = useState(null);
  const [searchByCoupon, setSearchByCoupon] = useState(null);
  const [isTooltip, setIsTooptip] = useState(false);
  const onOpenTooltip = () => setIsTooptip(true);
  const onCloseTooltip = () => setIsTooptip(false);

  const {
    isOpen: isOpenReward,
    onOpen: onOpenReward,
    onClose: onCloseReward,
  } = useDisclosure();

  const [initFlag, setInitFlag] = useState(true);

  const [listOrders, setListOrders] = useState([]);
  const [ordersMsg, setOrdersMsg] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);

  const [listReward, setListReward] = useState([]);
  const [totalReward, setTotalReward] = useState(0);
  const [rewardMsg, setRewardMsg] = useState(null);
  const [currentPageReward, setCurrentPageReward] = useState(1);
  const [totalCountReward, setTotalCountReward] = useState(1);
  const [contentNumReward, setContentNumReward] = useState(LIST_CONTENT_NUM[0]);

  const [listCoupon, setListCoupon] = useState([]);
  const [couponMsg, setCouponMsg] = useState(null);

  const [buyerUserInfo, setBuyerUserInfo] = useState(null);
  const [buyerUserAddressInfo, setBuyerUserAddressInfo] = useState(null);
  const [approvalFlag, setApprovalFlag] = useState(1);

  useEffect(() => {
    if (buyerUserId) {
      handleGetBuyer();
      handleGetListHoldingCouponBuyer();
    }
  }, [buyerUserId]);

  useEffect(() => {
    if (buyerUserId) {
      handleGetListOrdersProductBuyer();
    }
  }, [currentPage]);

  useEffect(() => {
    if (!initFlag) {
      handleGetListOrdersProductBuyerAgent();
    }
  }, [contentNum]);

  const handleGetListHoldingCouponBuyer = async () => {
    const param = {
      buyerUserId: buyerUserId,
    };
    if (searchByCoupon) {
      param.searchBy = searchByCoupon;
    }
    const result = await holdingCouponApi.getListHoldingCouponBuyer(param);
    if (result?.errorCode === SUCCESS) {
      setListCoupon(result.datas);
    } else {
      setListCoupon([]);
      setCouponMsg(result.message);
    }
  };

  const handlePatchBuyerUser = async (approvalFlag) => {
    const param = {
      buyerUserId: buyerUserId,
    };
    if (approvalFlag) {
      param.approvalFlag = approvalFlag;
    }

    const result = await buyerUserApi.patchBuyerUser(param);
    openModal({ text: result.message });
    if (result?.errorCode === SUCCESS) {
      if (approvalFlag) {
        setApprovalFlag(Number(approvalFlag));
      }
    }
  };

  const handleGetBuyer = async () => {
    const param = {
      buyerUserId: buyerUserId,
    };
    const result = await buyerUserApi.getBuyerUser(param);

    if (result?.errorCode === SUCCESS) {
      const resultData = result.data;
      setBuyerUserInfo(resultData);
      setBuyerUserAddressInfo(resultData.rsGetUserAddressDTO);
      setApprovalFlag(resultData?.approvalFlag || 1);
    }
    setInitFlag(false);
  };

  const handleGetListOrdersProductBuyerAgent = () => {
    if (currentPage === 1) {
      handleGetListOrdersProductBuyer();
    } else {
      setCurrentPage(1);
    }
  };

  const handleGetListOrdersProductBuyer = async () => {
    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
      buyerUserId: buyerUserId,
    };
    if (searchBy) {
      param.searchBy = searchBy;
    }
    const result = await ordersProductApi.getListOrdersProductBuyer(param);

    if (result?.errorCode === SUCCESS) {
      setListOrders(result.datas);
      setTotalCount(result.totalCount);
    } else {
      setListOrders([]);
      setTotalCount(0);
      setOrdersMsg(result.message);
    }
  };

  useEffect(() => {
    if (buyerUserId) {
      handleGetListReward();
    }
  }, [currentPageReward]);

  useEffect(() => {
    if (!initFlag) {
      handleGetListRewardAgent();
    }
  }, [contentNumReward]);

  const handleGetListReward = async () => {
    const param = {
      pageNum: currentPageReward,
      contentNum: contentNumReward,
      buyerUserId: buyerUserId,
    };
    const result = await rewardApi.getListRewardBuyer(param);

    if (result?.errorCode === SUCCESS) {
      setListReward(result.datas);
      setTotalCountReward(result.totalCount);
    } else {
      setListReward([]);
      setTotalCountReward(0);
      setRewardMsg(result.message);
    }
  };

  const handleGetListRewardAgent = () => {
    if (currentPageReward === 1) {
      handleGetListReward();
    } else {
      setCurrentPageReward(1);
    }
  };

  const productHeader = [
    { width: '25rem', title: localeText(LANGUAGES.BUYER.PRODUCT) },
    { width: '8.75rem', title: localeText(LANGUAGES.BUYER.SALES_AMOUNT) },
    { width: '10rem', title: localeText(LANGUAGES.BUYER.CATEGORY) },
    { width: '5rem', title: localeText(LANGUAGES.BUYER.STATE) },
    { width: '5rem', title: localeText(LANGUAGES.BUYER.QTY) },
    { width: '6.25rem', title: localeText(LANGUAGES.BUYER.BRAND) },
    { width: '7.5rem', title: localeText(LANGUAGES.BUYER.PURCHASE_DATE) },
  ];

  const couponHeader = [
    { width: '18.625rem', title: localeText(LANGUAGES.BUYER.TITLE) },
    { width: '18.625rem', title: localeText(LANGUAGES.BUYER.CONTENTS) },
    { width: '13rem', title: localeText(LANGUAGES.BUYER.REDEMPTION_TERMS) },
    { width: '10rem', title: localeText(LANGUAGES.BUYER.USAGE_PERIOD) },
    { width: '7.5rem', title: localeText(LANGUAGES.BUYER.ISSUE_DATE) },
  ];

  const rewardHeader = [
    { width: '10rem', title: localeText(LANGUAGES.BUYER.TYPE) },
    { width: '12.5rem', title: localeText(LANGUAGES.BUYER.REWARD_COIN) },
    { width: '36rem', title: localeText(LANGUAGES.BUYER.REASON) },
    { width: '10rem', title: localeText(LANGUAGES.BUYER.PUBLICATION_DATE) },
  ];

  const handleProduct = useCallback((item) => {
    console.log('handleProduct', item);
    // return router.push(MGNT.SELLER.PRODCUT);
  });

  const handleCoupon = useCallback((item) => {
    console.log('handleCoupon', item);
    // return router.push(MGNT.SELLER.PRODCUT);
  });

  const handleModifyReward = useCallback(() => {
    console.log('handleModifyReward');
    onOpenReward();
    // return router.push(MGNT.SELLER.PRODCUT);
  });

  const orderCard = useCallback((item, index) => {
    const name = item?.name;
    const count = item?.count;
    const createdAt = item?.createdAt;
    const brandName = item?.brandName;
    const productId = item?.productId;
    const firstCategoryName = item?.firstCategoryName;
    const secondCategoryName = item?.secondCategoryName;
    const thirdCategoryName = item?.thirdCategoryName;
    const ordersProductId = item?.ordersProductId;
    const deliveryStatus = item?.deliveryStatus;
    const ordersId = item?.ordersId;
    const totalPrice = item?.totalPrice;
    const productImageList = item?.productImageList || [];

    let firstImageSrc = null;
    if (productImageList.length > 0) {
      firstImageSrc = productImageList[0].imageS3Url;
    }

    const handleGetState = (state) => {
      if (state === 1) {
        return localeText(LANGUAGES.PRODUCTS.ON_SALE);
      } else if (state === 2) {
        return localeText(LANGUAGES.PRODUCTS.STOP_SELLING);
      } else if (state === 3) {
        return localeText(LANGUAGES.PRODUCTS.OUT_OF_STOCK);
      }
    };

    return (
      <Box
        key={index}
        w={'100%'}
        px={'1rem'}
        py={'0.75rem'}
        borderBottom={'1px solid #73829D'}
        boxSizing={'border-box'}
      >
        <HStack spacing={'0.75rem'}>
          <Box w={productHeader[0].width}>
            <HStack spacing={'0.75rem'}>
              <Center w={'5rem'} minW={'5rem'} aspectRatio={1}>
                <ChakraImage
                  fallback={<DefaultSkeleton />}
                  w={'100%'}
                  h={'100%'}
                  objectFit={'cover'}
                  src={firstImageSrc}
                />
              </Center>
              <Box w={'100%'}>
                <VStack spacing={0} alignItems={'flex-start'}>
                  <Text
                    cursor={'pointer'}
                    onClick={() => {
                      handleProduct(item);
                    }}
                    textDecoration={'underline'}
                    color={'#485766'}
                    fontSize={'1rem'}
                    fontWeight={500}
                    lineHeight={'1.75rem'}
                  >
                    {name}
                  </Text>
                  {item?.option &&
                    item.option.map((option, index) => {
                      return (
                        <Text
                          key={index}
                          color={'#66809C'}
                          fontSize={'0.9357rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {option}
                        </Text>
                      );
                    })}
                </VStack>
              </Box>
            </HStack>
          </Box>
          <Box w={productHeader[1].width}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {utils.parseDallar(totalPrice)}
            </Text>
          </Box>
          <Box w={productHeader[2].width}>
            <HStack
              spacing={'0.25rem'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Text
                color={'#66809C'}
                fontSize={'0.875rem'}
                fontWeight={400}
                lineHeight={'1.4rem'}
                opacity={'0.7'}
              >
                {firstCategoryName}
              </Text>
              {secondCategoryName && (
                <>
                  <Center w={'1rem'} h={'1rem'}>
                    <Img h={'100%'} src={IconRight.src} />
                  </Center>
                  <Text
                    color={'#485766'}
                    fontSize={'0.875rem'}
                    fontWeight={400}
                    lineHeight={'1.4rem'}
                    opacity={'0.7'}
                  >
                    {secondCategoryName}
                  </Text>
                </>
              )}
              {thirdCategoryName && (
                <>
                  <Center w={'1rem'} h={'1rem'}>
                    <Img h={'100%'} src={IconRight.src} />
                  </Center>
                  <Text
                    color={'#485766'}
                    fontSize={'0.875rem'}
                    fontWeight={400}
                    lineHeight={'1.4rem'}
                    opacity={'0.7'}
                  >
                    {thirdCategoryName}
                  </Text>
                </>
              )}
            </HStack>
          </Box>
          <Box w={productHeader[3].width}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {handleGetState(deliveryStatus)}
            </Text>
          </Box>
          <Box w={productHeader[4].width}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {utils.parseAmount(count)}
            </Text>
          </Box>
          <Box w={productHeader[5].width}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {brandName}
            </Text>
          </Box>
          <Box w={productHeader[6].width}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9375rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {utils.parseDateByCountryCode(createdAt, lang)}
            </Text>
          </Box>
        </HStack>
      </Box>
    );
  });

  const couponItemCard = useCallback((item, index) => {
    return (
      <Box
        key={index}
        w={'100%'}
        px={'1rem'}
        py={'0.75rem'}
        borderBottom={'1px solid #73829D'}
        boxSizing={'border-box'}
      >
        <HStack spacing={'0.75rem'}>
          <Box w={couponHeader[0].width}>
            <Text
              cursor={'pointer'}
              onClick={() => {
                handleCoupon(item);
              }}
              textDecoration={'underline'}
              color={'#485766'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {item.title}
            </Text>
          </Box>
          <Box w={couponHeader[1].width}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {item.contents}
            </Text>
          </Box>
          <Box w={couponHeader[2].width}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {`$${item.minimumPurchase} ${localeText(LANGUAGES.BUYER.MINIMUM_PURCHASE)}`}
            </Text>
          </Box>
          <Box w={couponHeader[3].width}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
              whiteSpace={'pre-wrap'}
            >
              {item.period}
            </Text>
          </Box>
          <Box w={couponHeader[4].width}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {item.date}
            </Text>
          </Box>
        </HStack>
      </Box>
    );
  });

  const rewardItemCard = useCallback((item, index) => {
    const reason = item?.reason;
    const type = item?.type;
    const createdAt = item?.createdAt;
    const coin = item?.coin;
    const rewardId = item?.rewardId;

    const handleRewardType = (type) => {
      if (type === 1) {
        return localeText(LANGUAGES.BUYER.CREDITS);
      } else if (type === 2) {
        return localeText(LANGUAGES.BUYER.DEBITS);
      }
    };

    return (
      <Box
        key={index}
        w={'100%'}
        px={'1rem'}
        py={'0.75rem'}
        borderBottom={'1px solid #73829D'}
        boxSizing={'border-box'}
      >
        <HStack spacing={'0.75rem'}>
          <Box w={rewardHeader[0].width}>
            <Text
              color={'#485766'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {handleRewardType(type)}
            </Text>
          </Box>
          <Box w={rewardHeader[1].width}>
            <Text
              textAlign={'center'}
              color={Math.sign(type) === 1 ? '#485766' : '#940808'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {coin} {localeText(LANGUAGES.BUYER.COINS)}
            </Text>
          </Box>
          <Box w={rewardHeader[2].width}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {reason}
            </Text>
          </Box>
          <Box w={rewardHeader[3].width}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
              whiteSpace={'pre-wrap'}
            >
              {utils.parseDateByCountryCode(createdAt, lang)}
            </Text>
          </Box>
        </HStack>
      </Box>
    );
  });

  const handleAddr = () => {
    const {
      addressType,
      zipCode,
      roadNameMainAddr,
      landNumberMainAddr,
      subAddr,
      state,
      city,
      addressLineOne,
      addressLineTwo,
    } = buyerUserAddressInfo;

    let addr = null;

    if (addressType === 1) {
      addr = roadNameMainAddr;
      if (subAddr) {
        addr += `, ${subAddr}`;
      }
    } else {
      addr = addressLineOne;
      if (addressLineTwo) {
        addr += `, ${addressLineTwo}`;
      }
    }
    return `${addr}, ${city}, ${zipCode}, ${state}`;
  };

  return (
    <MainContainer
      isDetailHeader
      contentHeader={
        <Box w={'26.75rem'}>
          <HStack
            alignItems={'center'}
            spacing={'1.5rem'}
            justifyContent={'flex-end'}
          >
            <Box>
              <Text
                color={'#7895B2'}
                fontSize={'0.9375rem'}
                fontWeight={400}
                lineHeight={'1.5rem'}
                textAlign={'right'}
              >
                {localeText(LANGUAGES.BUYER.MEMBER_PERMISSIONS)}
              </Text>
            </Box>

            <Box>
              <RadioGroup
                w={'100%'}
                value={Number(approvalFlag)}
                onChange={(value) => {
                  handlePatchBuyerUser(Number(value));
                }}
              >
                <HStack spacing={'1rem'}>
                  <Box>
                    <HStack alignItems={'center'} spacing={'0.5rem'}>
                      <Radio value={2} />
                      <Box w={'4rem'}>
                        <Text
                          color={'#485766'}
                          fontSize={'1rem'}
                          fontWeight={400}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.STATUS.ALLOWED)}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box>
                    <HStack alignItems={'center'} spacing={'0.5rem'}>
                      <Radio value={1} />
                      <Box w={'5.9375rem'}>
                        <Text
                          color={'#485766'}
                          fontSize={'1rem'}
                          fontWeight={400}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.STATUS.NOT_ALLOWED)}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                </HStack>
              </RadioGroup>
            </Box>
          </HStack>
        </Box>
      }
    >
      <VStack spacing={0}>
        <ContentBR h={'1.25rem'} />

        {buyerUserInfo && (
          <Flex
            w={'100%'}
            justifyContent="flex-start"
            alignItems="flex-start"
            display="inline-flex"
          >
            <Flex
              flex="1 1 0"
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              gap="1rem" // 16px -> 1rem
              display="inline-flex"
            >
              <Flex
                alignSelf="stretch"
                justifyContent="flex-start"
                alignItems="flex-start"
                gap="2rem" // 32px -> 2rem
                display="inline-flex"
              >
                <Box
                  w="12.5rem"
                  color="#7895B2"
                  fontSize="0.9375rem"
                  fontWeight={400}
                  lineHeight="1.5rem"
                >
                  {localeText(LANGUAGES.BUYER.MEMBER_EMAIL)}
                </Box>
                <Text
                  color="#556A7E"
                  fontSize="0.9375rem"
                  fontWeight={400}
                  lineHeight="1.5rem"
                >
                  {buyerUserInfo.id}
                </Text>
              </Flex>
              <Flex
                alignSelf="stretch"
                justifyContent="flex-start"
                alignItems="flex-start"
                gap="2rem" // 32px -> 2rem
                display="inline-flex"
              >
                <Box
                  w="12.5rem"
                  color="#7895B2"
                  fontSize="0.9375rem"
                  fontWeight={400}
                  lineHeight="1.5rem"
                >
                  {localeText(LANGUAGES.BUYER.PHONE_NUMBER)}
                </Box>
                <Text
                  color="#556A7E"
                  fontSize="0.9375rem"
                  fontWeight={400}
                  lineHeight="1.5rem"
                >
                  {utils.parsePhoneNum(buyerUserInfo.phone)}
                </Text>
              </Flex>
              <Flex
                alignSelf="stretch"
                justifyContent="flex-start"
                alignItems="flex-start"
                gap="2rem" // 32px -> 2rem
                display="inline-flex"
              >
                <Box
                  w="12.5rem"
                  color="#7895B2"
                  fontSize="0.9375rem"
                  fontWeight={400}
                  lineHeight="1.5rem"
                >
                  {localeText(LANGUAGES.BUYER.MEMBERSHIP)}
                </Box>
                <Box>
                  <HStack>
                    <Text
                      color="#556A7E"
                      fontSize="0.9375rem"
                      fontWeight={400}
                      lineHeight="1.5rem"
                    >
                      {handleGetGrade(buyerUserInfo.grade)}
                    </Text>
                    <Box
                      position={'relative'}
                      display={'inline-block'}
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
                        border={'1px solid #7895B2'}
                        position={'absolute'}
                        top={'calc(100%)'}
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
                              {localeText(LANGUAGES.BUYER.MEMBERSHIP)}
                            </Text>
                          </Box>
                          <Box w={'100%'}>
                            <Text
                              color={'#485766'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {`Purchases over $10000.00 - ${localeText(LANGUAGES.COMMON.PLATINUM)}`}
                              <br />
                              {`1000.00 to $10000.00 - ${localeText(LANGUAGES.COMMON.GOLD)} Purchases`}
                              <br />
                              {`$999.00 or less - ${localeText(LANGUAGES.COMMON.BRONZE)}`}
                            </Text>
                          </Box>
                          <Box w={'100%'}>
                            <Text
                              color={'#A87C4E'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              * Membership evaluations are conducted quarterly
                              (January/April/July/October).
                            </Text>
                          </Box>
                        </VStack>
                      </Box>
                    </Box>
                  </HStack>
                </Box>
              </Flex>
            </Flex>
            <Flex
              flex="1 1 0"
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              gap="1rem" // 16px -> 1rem
              display="inline-flex"
            >
              <Flex
                alignSelf="stretch"
                justifyContent="flex-start"
                alignItems="flex-start"
                gap="2rem" // 32px -> 2rem
                display="inline-flex"
              >
                <Box
                  w="12.5rem"
                  color="#7895B2"
                  fontSize="0.9375rem"
                  fontWeight={400}
                  lineHeight="1.5rem"
                >
                  {localeText(LANGUAGES.BUYER.NAME)}
                </Box>
                <Text
                  color="#556A7E"
                  fontSize="0.9375rem"
                  fontWeight={400}
                  lineHeight="1.5rem"
                >
                  {buyerUserInfo.name}
                </Text>
              </Flex>
              <Flex
                alignSelf="stretch"
                justifyContent="flex-start"
                alignItems="flex-start"
                gap="2rem" // 32px -> 2rem
                display="inline-flex"
              >
                <Box
                  w="12.5rem"
                  color="#7895B2"
                  fontSize="0.9375rem"
                  fontWeight={400}
                  lineHeight="1.5rem"
                >
                  {localeText(LANGUAGES.BUYER.JOIN_DATE)}
                </Box>
                <Text
                  color="#556A7E"
                  fontSize="0.9375rem"
                  fontWeight={400}
                  lineHeight="1.5rem"
                >
                  {utils.parseDateByCountryCode(buyerUserInfo.createdAt, lang)}
                </Text>
              </Flex>
              <Flex
                alignSelf="stretch"
                justifyContent="flex-start"
                alignItems="flex-start"
                gap="2rem" // 32px -> 2rem
                display="inline-flex"
              >
                <Box
                  w="12.5rem"
                  color="#7895B2"
                  fontSize="0.9375rem"
                  fontWeight={400}
                  lineHeight="1.5rem"
                >
                  {localeText(LANGUAGES.ADDRESS)}
                </Box>
                <Text
                  flex="1 1 0"
                  color="#556A7E"
                  fontSize="0.9375rem"
                  fontWeight={400}
                  lineHeight="1.5rem"
                >
                  {handleAddr()}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        )}

        <ContentBR h={'2.5rem'} />

        <Divider borderTop={'1px solid #AEBDCA'} />

        <ContentBR h={'2.5rem'} />

        <Box w={'100%'}>
          <VStack spacing={0}>
            <Box w={'100%'}>
              <HStack justifyContent={'space-between'}>
                <Box h={'3rem'} alignContent={'center'}>
                  <HStack spacing={'1.25rem'}>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={400}
                      lineHeight={'1.96875rem'}
                    >
                      {localeText(LANGUAGES.BUYER.PURCHASE_LIST)}
                    </Text>
                    <Center
                      w={'13.625rem'}
                      py={'0.5rem'}
                      px={'1rem'}
                      borderRadius={'1.25rem'}
                      bg={'#D9E7EC'}
                    >
                      <HStack spacing={'0.75rem'} justifyContent={'center'}>
                        <Text
                          color={'#66809C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.BUYER.TOTAL_PURCHASE)}
                        </Text>
                        <Text
                          color={'#66809C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {utils.parseDallar(
                            buyerUserInfo?.totalPurchaseAmount || 0,
                          )}
                        </Text>
                      </HStack>
                    </Center>
                  </HStack>
                </Box>
                <Box w={'25rem'}>
                  <SearchInput
                    value={searchBy || ''}
                    onChange={(e) => {
                      setSearchBy(e.target.value);
                    }}
                    onClick={() => {
                      handleGetListOrdersProductBuyerAgent();
                    }}
                    placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
                    placeholderFontColor={'#A7C3D2'}
                  />
                </Box>
              </HStack>
            </Box>

            <ContentBR h={'1rem'} />

            <Box w={'100%'}>
              <VStack spacing={0}>
                <Box
                  w={'100%'}
                  borderTop={'1px solid #73829D'}
                  borderBottom={'1px solid #73829D'}
                  px={'1rem'}
                  py={'0.75rem'}
                  boxSizing={'border-box'}
                >
                  <HStack spacing={'0.75rem'}>
                    {productHeader.map((item, index) => {
                      return (
                        <Box w={item.width} key={index}>
                          <Text
                            textAlign={index === 0 ? 'left' : 'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {item.title}
                          </Text>
                        </Box>
                      );
                    })}
                  </HStack>
                </Box>
                {/* body */}
                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <VStack spacing={0}>
                        {listOrders.map((item, index) => {
                          return orderCard(item, index);
                        })}
                        {listOrders.length === 0 && (
                          <Center w={'100%'} h={'10rem'}>
                            <Text
                              fontSize={'1.5rem'}
                              fontWeight={500}
                              lineHeight={'1.75rem'}
                            >
                              {ordersMsg}
                            </Text>
                          </Center>
                        )}
                      </VStack>
                    </Box>
                    <Box w={'100%'}>
                      <HStack justifyContent={'space-between'}>
                        <Box w={'6.125rem'}>
                          <Select
                            value={contentNum}
                            onChange={(e) => {
                              setContentNum(Number(e.target.value));
                            }}
                            py={'0.75rem'}
                            pl={'1rem'}
                            p={0}
                            w={'100%'}
                            h={'3rem'}
                            bg={'#FFF'}
                            boxSizing={'border-box'}
                            borderRadius={'0.25rem'}
                            border={'1px solid #9CADBE'}
                          >
                            {LIST_CONTENT_NUM.map((value, index) => {
                              return (
                                <option value={value} key={index}>
                                  {value}
                                </option>
                              );
                            })}
                          </Select>
                        </Box>

                        <Box>
                          <DefaultPaginate
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalCount={totalCount}
                            contentNum={contentNum}
                          />
                        </Box>
                      </HStack>
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </VStack>
        </Box>

        <ContentBR h={'2.5rem'} />

        <Box w={'100%'}>
          <VStack spacing={0}>
            <Box w={'100%'}>
              <HStack justifyContent={'space-between'}>
                <Box h={'3rem'} alignContent={'center'}>
                  <Text
                    color={'#485766'}
                    fontSize={'1.125rem'}
                    fontWeight={500}
                    lineHeight={'1.96875rem'}
                  >
                    {localeText(LANGUAGES.BUYER.COUPON_LIST)}
                  </Text>
                </Box>
                <Box w={'25rem'}>
                  <SearchInput
                    value={searchByCoupon || ''}
                    onChange={(e) => {
                      setSearchByCoupon(e.target.value);
                    }}
                    onClick={() => {
                      handleGetListHoldingCouponBuyer();
                    }}
                    placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
                    placeholderFontColor={'#A7C3D2'}
                  />
                </Box>
              </HStack>
            </Box>

            <ContentBR h={'1rem'} />

            <Box w={'100%'}>
              {/* Product Rows */}
              <VStack spacing={0}>
                {/* header */}
                <Box
                  w={'100%'}
                  borderTop={'1px solid #73829D'}
                  borderBottom={'1px solid #73829D'}
                  px={'1rem'}
                  py={'0.75rem'}
                  boxSizing={'border-box'}
                >
                  <HStack spacing={'0.75rem'}>
                    {couponHeader.map((item, index) => {
                      return (
                        <Box w={item.width} key={index}>
                          <Text
                            textAlign={index === 0 ? 'left' : 'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {item.title}
                          </Text>
                        </Box>
                      );
                    })}
                  </HStack>
                </Box>
                {/* body */}
                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <VStack spacing={0}>
                        {listCoupon.map((item, index) => {
                          return couponItemCard(item, index);
                        })}
                        {listCoupon.length === 0 && (
                          <Center w={'100%'} h={'10rem'}>
                            <Text
                              fontSize={'1.5rem'}
                              fontWeight={500}
                              lineHeight={'1.75rem'}
                            >
                              {couponMsg}
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

        <ContentBR h={'2.5rem'} />

        <Box w={'100%'}>
          <VStack spacing={0}>
            <Box w={'100%'}>
              <HStack justifyContent={'space-between'}>
                <Box h={'3rem'} alignContent={'center'}>
                  <HStack spacing={'1.25rem'}>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={500}
                      lineHeight={'1.96875rem'}
                    >
                      {localeText(LANGUAGES.BUYER.REWARD_COIN_HISTORY)}
                    </Text>
                    <Center
                      w={'18.4rem'}
                      py={'0.5rem'}
                      px={'1rem'}
                      borderRadius={'1.25rem'}
                      bg={'#D9E7EC'}
                    >
                      <HStack spacing={'0.75rem'} justifyContent={'center'}>
                        <Text
                          color={'#66809C'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.BUYER.TOTAL_REWARD_COINS)}
                        </Text>
                        <Text
                          color={'#66809C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {`${utils.parseAmount(buyerUserInfo?.rewardCoin || 0)} ${localeText(LANGUAGES.BUYER.COINS)}`}
                        </Text>
                      </HStack>
                    </Center>
                  </HStack>
                </Box>
                <Box w={'12.8125rem'} h={'3rem'}>
                  <Button
                    onClick={() => {
                      handleModifyReward();
                    }}
                    px={'1.25rem'}
                    py={'0.63rem'}
                    borderRadius={'0.25rem'}
                    boxSizing={'border-box'}
                    bg={'#7895B2'}
                    h={'100%'}
                    w={'100%'}
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
                      {localeText(LANGUAGES.BUYER.MODIFY_REWARD_COINS)}
                    </Text>
                  </Button>
                </Box>
              </HStack>
            </Box>

            <ContentBR h={'1rem'} />

            <Box w={'100%'}>
              {/* Product Rows */}
              <VStack spacing={0}>
                {/* header */}
                <Box
                  w={'100%'}
                  borderTop={'1px solid #73829D'}
                  borderBottom={'1px solid #73829D'}
                  px={'1rem'}
                  py={'0.75rem'}
                  boxSizing={'border-box'}
                >
                  <HStack spacing={'0.75rem'}>
                    {rewardHeader.map((item, index) => {
                      return (
                        <Box w={item.width} key={index}>
                          <Text
                            textAlign={index === 0 ? 'left' : 'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {item.title}
                          </Text>
                        </Box>
                      );
                    })}
                  </HStack>
                </Box>
                {/* body */}
                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <VStack spacing={0}>
                        {listReward.map((item, index) => {
                          return rewardItemCard(item, index);
                        })}
                        {listReward.length === 0 && (
                          <Center w={'100%'} h={'10rem'}>
                            <Text
                              fontSize={'1.5rem'}
                              fontWeight={500}
                              lineHeight={'1.75rem'}
                            >
                              {rewardMsg}
                            </Text>
                          </Center>
                        )}
                      </VStack>
                    </Box>
                    <Box w={'100%'}>
                      <HStack justifyContent={'space-between'}>
                        <Box w={'6.125rem'}>
                          <Select
                            value={contentNumReward}
                            onChange={(e) => {
                              setContentNumReward(Number(e.target.value));
                            }}
                            py={'0.75rem'}
                            pl={'1rem'}
                            p={0}
                            w={'100%'}
                            h={'3rem'}
                            bg={'#FFF'}
                            boxSizing={'border-box'}
                            borderRadius={'0.25rem'}
                            border={'1px solid #9CADBE'}
                          >
                            {LIST_CONTENT_NUM.map((value, index) => {
                              return (
                                <option value={value} key={index}>
                                  {value}
                                </option>
                              );
                            })}
                          </Select>
                        </Box>

                        <Box>
                          <DefaultPaginate
                            currentPage={currentPageReward}
                            setCurrentPage={setCurrentPageReward}
                            totalCount={totalCountReward}
                            contentNum={contentNumReward}
                          />
                        </Box>
                      </HStack>
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </VStack>
        </Box>

        <ContentBR h={'1.25rem'} />
      </VStack>

      {isOpenReward && (
        <RewardModal
          isOpen={isOpenReward}
          onClose={(ret) => {
            if (ret) {
              handleGetBuyer();
              handleGetListReward();
            }
            onCloseReward();
          }}
          buyerUserIds={[buyerUserId]}
          rewardCoin={buyerUserInfo?.rewardCoin || 0}
        />
      )}
    </MainContainer>
  );
};

export default BuyerDetailPage;
