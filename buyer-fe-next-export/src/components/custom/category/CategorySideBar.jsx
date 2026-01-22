'use client';

import { CustomIcon } from '@/components';
import SideSearchToggle from '@/components/button/SideSearchToggle';
import CustomCheckbox from '@/components/common/checkbox/CustomCheckBox';
import { NO_DATA_ERROR, SUCCESS } from '@/constants/errorCode';
import { LANGUAGES } from '@/constants/lang';
import useDevice from '@/hooks/useDevice';
import useLocale from '@/hooks/useLocale';
import useMenu from '@/hooks/useMenu';
import productApi from '@/services/productApi';
import promotionApi from '@/services/promotionApi';
import utils from '@/utils';

import {
  Box,
  Button,
  Center,
  Checkbox,
  CheckboxGroup,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  HStack,
  Radio,
  RadioGroup,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';

const CategorySideBar = (props) => {
  const { isMobile, clampW } = useDevice();
  const { localeText } = useLocale();

  const sideTypeOptions = [
    { value: 1, label: localeText(LANGUAGES.COMMON.NONE) },
    { value: 2, label: localeText(LANGUAGES.DRY) },
    { value: 3, label: localeText(LANGUAGES.OILY) },
    { value: 4, label: localeText(LANGUAGES.SENSITIVE) },
    { value: 5, label: localeText(LANGUAGES.ACNE) },
    { value: 6, label: localeText(LANGUAGES.NORMAL) },
  ];

  const orderAmountOptions = [
    { value: 1, label: '0-$5' },
    { value: 2, label: '$6-$20' },
    { value: 3, label: '$21-$50' },
    { value: 4, label: '$51-$100' },
    { value: 5, label: '$101-' },
  ];

  const {
    listproduct,
    setListProduct,
    currentPage,
    setCurrentPage,
    setTotalCount,
    contentNum,
    // 추가 상품 구매시에만 사용 됨
    sellerUserId,
    selectedSort,
    //
    isSetCategory,
    setIsSetCategory,
    isOpen,
    onOpen,
    onClose,
  } = props;

  const {
    selectedFirstCategory,
    selectedSecondCategory,
    selectedThirdCategory,
  } = useMenu();

  const [isMobilePop, setIsMobilePop] = useState(false);
  const [initPage, setInitPage] = useState(false);

  const [approvalStatus, setApprovalStatus] = useState(false);
  const [sideType, setSideType] = useState([]);
  const [sidePromotion, setSidePromotion] = useState([]);
  const [minimumOrderAmountType, setMinimumOrderAmountType] = useState([]);
  const [defaultShipping, setDefaultShipping] = useState(0);

  const [promotionContentNum, setPromotionContentNum] = useState(5);
  const [promotionTotalCount, setPromotionTotalCount] = useState(0);
  const [listPromotion, setListPromotion] = useState([]);

  useEffect(() => {
    handleGetListPromotion();
  }, [promotionContentNum]);

  useEffect(() => {
    if (isMobile(true)) {
      setIsMobilePop(true);
    } else {
      if (onClose) {
        onClose();
      }
      setIsMobilePop(false);
    }
  }, [isMobile]);

  useEffect(() => {
    const shouldFetchList =
      currentPage !== undefined ||
      approvalStatus !== undefined ||
      sideType !== undefined ||
      sidePromotion !== undefined ||
      minimumOrderAmountType !== undefined ||
      defaultShipping !== undefined ||
      selectedSort !== undefined ||
      isSetCategory !== undefined ||
      isMobilePop !== undefined;

    const shouldSetCategory =
      selectedFirstCategory !== undefined ||
      selectedSecondCategory !== undefined ||
      selectedThirdCategory !== undefined;

    if (!isMobile(true) && shouldSetCategory) {
      const handler = setTimeout(() => {
        handleGetListAgent();
      }, 200);
      return () => clearTimeout(handler);
    }

    if (shouldFetchList) {
      if (isMobile(true)) {
        if (!isMobilePop) {
          handleGetListAgent();
        }
      } else {
        handleGetListAgent();
      }
    }
  }, [
    currentPage,
    approvalStatus,
    sideType,
    sidePromotion,
    minimumOrderAmountType,
    defaultShipping,
    //
    selectedSort,
    isSetCategory,
    // 모바일에서 사용
    isMobilePop,
    //
    selectedFirstCategory,
    selectedSecondCategory,
    selectedThirdCategory,
  ]);

  const [loading, setLoading] = useState(false);
  const lastScrollTop = useRef(0);

  const handleScroll = useCallback(async () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollY > lastScrollTop.current) {
      if (scrollY + windowHeight >= documentHeight && !loading) {
        if (currentPage !== 1) {
          if (listproduct.length === contentNum) {
            setCurrentPage((prevPage) => prevPage + 1);
          } else {
            handleGetListProduct();
          }
        } else {
          handleGetListProduct();
        }
      }
    }
    lastScrollTop.current = scrollY;
  }, [loading]);

  useEffect(() => {
    if (isMobile(true)) {
      const handleScrollEvent = () => handleScroll();
      window.addEventListener('scroll', handleScrollEvent);

      return () => {
        // window.removeEventListener('scroll', handleScrollEvent);
      };
    }
  }, [handleScroll]);

  const handleGetListPromotion = async () => {
    const param = {
      pageNum: 1,
      contentNum: promotionContentNum,
    };
    const result = await promotionApi.getListPromotion(param);
    if (result?.errorCode === SUCCESS) {
      setListPromotion(result.datas);
      setPromotionTotalCount(result.totalCount);
    } else if (NO_DATA_ERROR) {
      setListPromotion([]);
      setPromotionTotalCount(0);
    }
  };

  const handleGetListAgent = async () => {
    if (sellerUserId) {
      await handleGetListSellerProduct();
    } else {
      await handleGetListProduct(
        selectedFirstCategory?.firstCategoryId,
        selectedSecondCategory?.secondCategoryId,
        selectedThirdCategory?.thirdCategoryId,
      );
    }
    setInitPage(false);
  };

  const handleGetListProduct = useCallback(
    async (firstCategoryId, secondCategoryId, thirdCategoryId) => {
      if (!firstCategoryId) return;
      if (loading) return;
      setLoading(true);

      const param = {
        pageNum: currentPage,
        contentNum: contentNum,
        firstCategoryId: firstCategoryId,
      };
      if (secondCategoryId) {
        param.secondCategoryId = secondCategoryId;
      }
      if (thirdCategoryId) {
        param.thirdCategoryId = thirdCategoryId;
      }

      if (approvalStatus === true) {
        param.approvalStatus = approvalStatus === true ? 1 : 2;
      }
      if (sideType.length !== 0) {
        param.types = sideType.join(',');
      }
      if (sidePromotion.length !== 0) {
        param.promotionIds = sidePromotion.join(',');
      }
      if (minimumOrderAmountType.length !== 0) {
        param.minimumOrderAmountTypes = minimumOrderAmountType.join(',');
      }
      if (defaultShipping !== 0) {
        param.defaultShipping = defaultShipping;
      }

      try {
        const result = await productApi.getListProduct(param);
        if (result?.errorCode === SUCCESS) {
          setListProduct(result.datas);
          setTotalCount(result.totalCount);
        } else if (result?.errorCode === NO_DATA_ERROR) {
          setListProduct([]);
          setTotalCount(0);
        }
      } finally {
        setLoading(false);
      }
    },
  );

  const handleGetListSellerProduct = async () => {
    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
      sellerUserId: sellerUserId,
      sortType: selectedSort,
    };
    if (approvalStatus === true) {
      param.approvalStatus = approvalStatus === true ? 1 : 2;
    }

    if (sideType.length !== 0) {
      param.types = sideType.join(',');
    }
    if (sidePromotion.length !== 0) {
      param.promotionIds = sidePromotion.join(',');
    }
    /*
    if (minimumOrderAmountType !== 0) {
      param.minimumOrderAmountTypes = minimumOrderAmountType;
    }
    */

    if (defaultShipping !== 0) {
      param.defaultShipping = defaultShipping;
    }
    const result = await productApi.getListSellerProduct(param);
    if (result?.errorCode === SUCCESS) {
      setListProduct(result.datas);
      setTotalCount(result.totalCount);
    } else if (result?.errorCode === NO_DATA_ERROR) {
      setListProduct([]);
      setTotalCount(0);
    }
  };

  const handleInitData = () => {
    setApprovalStatus(false);
    setSideType([]);
    setSidePromotion([]);
    setMinimumOrderAmountType([]);
    setDefaultShipping(0);
    setPromotionContentNum(5);
  };

  return isMobile(true) ? (
    <Drawer placement={'left'} onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody p={0} h={'100%'}>
          <Box w={'100%'} px={'1.5rem'} mt={'1.5rem'} h={'2.25rem'}>
            <HStack justifyContent={'space-between'}>
              <Text
                color={'#485766'}
                fontSize={clampW(1.2, 1.5)}
                fontWeight={500}
                lineHeight={'160%'}
              >
                {localeText(LANGUAGES.FILTER)}
              </Text>
              <Box>
                <HStack>
                  <Box
                    cursor={'pointer'}
                    onClick={() => {
                      handleInitData();
                    }}
                  >
                    <Text
                      color={'#B20000'}
                      fontSize={'1rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(LANGUAGES.RESET)}
                    </Text>
                  </Box>
                  <Box
                    w={'2rem'}
                    h={'2rem'}
                    cursor={'pointer'}
                    onClick={() => {
                      onClose();
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
            </HStack>
          </Box>
          <Box w={'100%'} h={'calc(100% - 3.75rem - 5rem)'}>
            <VStack px={'1.5rem'} spacing={'2rem'} h={'100%'} overflow={'auto'}>
              <Box />
              <Box w={'100%'}>
                <HStack justifyContent={'space-between'}>
                  <Text
                    color={'#485766'}
                    fontSize={'1.125rem'}
                    fontWeight={500}
                    lineHeight={'1.96875rem'}
                  >
                    {localeText(LANGUAGES.MOCRA_FDA_REGISTERED)}
                  </Text>
                  <Box>
                    <CustomCheckbox
                      isChecked={approvalStatus}
                      onChange={(v) => {
                        setApprovalStatus(v);
                      }}
                    />
                  </Box>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <VStack spacing={'1rem'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={500}
                      lineHeight={'1.96875rem'}
                    >
                      {localeText(LANGUAGES.TYPE)}
                    </Text>
                  </Box>

                  <CheckboxGroup
                    value={sideType.map(String)}
                    onChange={(values) => setSideType(values.map(Number))}
                  >
                    <VStack spacing="1rem" w="100%" alignItems="flex-start">
                      {sideTypeOptions.map(({ value, label }) => {
                        const checked = sideType.includes(value);
                        return (
                          <SideSearchToggle
                            key={value}
                            checked={checked}
                            onToggle={() => {
                              setSideType((prev) =>
                                checked
                                  ? prev.filter((v) => v !== value)
                                  : [...prev, value],
                              );
                            }}
                          >
                            {label}
                          </SideSearchToggle>
                        );
                      })}
                    </VStack>
                  </CheckboxGroup>
                </VStack>
              </Box>

              <Box w={'100%'}>
                <VStack spacing={'1rem'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={500}
                      lineHeight={'1.96875rem'}
                    >
                      {localeText(LANGUAGES.HEADER_MENU.PROMOTION)}
                    </Text>
                  </Box>
                  <CheckboxGroup
                    value={sidePromotion.map(String)} // Chakra는 string 배열을 요구함
                    onChange={(values) => setSidePromotion(values.map(Number))} // string → number
                  >
                    <VStack w="100%" alignItems="flex-start">
                      {listPromotion.map((item, index) => {
                        const isChecked = sidePromotion.includes(
                          item.promotionId,
                        );
                        return (
                          <SideSearchToggle
                            key={index}
                            checked={isChecked}
                            onToggle={() => {
                              setSidePromotion((prev) =>
                                isChecked
                                  ? prev.filter((id) => id !== item.promotionId)
                                  : [...prev, item.promotionId],
                              );
                            }}
                          >
                            {item.name}
                          </SideSearchToggle>
                        );
                      })}
                    </VStack>
                  </CheckboxGroup>
                </VStack>
              </Box>

              <Box w={'100%'}>
                <VStack spacing={'1rem'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={500}
                      lineHeight={'1.96875rem'}
                    >
                      {localeText(LANGUAGES.PURCHASE_MINIMUM)}
                    </Text>
                  </Box>
                  <CheckboxGroup
                    value={minimumOrderAmountType.map(String)}
                    onChange={(values) =>
                      setMinimumOrderAmountType(values.map(Number))
                    }
                  >
                    <VStack spacing="1rem" w="100%" alignItems="flex-start">
                      {orderAmountOptions.map(({ value, label }) => {
                        const checked = minimumOrderAmountType.includes(value);
                        return (
                          <SideSearchToggle
                            key={value}
                            checked={checked}
                            onToggle={() => {
                              setMinimumOrderAmountType((prev) =>
                                checked
                                  ? prev.filter((v) => v !== value)
                                  : [...prev, value],
                              );
                            }}
                          >
                            {label}
                          </SideSearchToggle>
                        );
                      })}
                    </VStack>
                  </CheckboxGroup>
                </VStack>
              </Box>

              {/*
              <Box w={'100%'} mb={'1.5rem'}>
                <VStack spacing={'1rem'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={500}
                      lineHeight={'1.96875rem'}
                    >
                      {localeText(LANGUAGES.SHIPPING)}
                    </Text>
                  </Box>
                  <RadioGroup
                    w={'100%'}
                    value={Number(defaultShipping)}
                    display="flex"
                    onChange={(value) => {
                      setDefaultShipping(Number(value));
                    }}
                  >
                    <VStack
                      spacing={'1rem'}
                      w={'100%'}
                      alignItems={'flex-start'}
                    >
                      <Radio value={0}>
                        <Text
                          color={'#485766'}
                          fontSize={'1rem'}
                          fontWeight={400}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.COMMON.ALL)}
                        </Text>
                      </Radio>
                      <Radio value={2}>
                        <Text
                          color={'#485766'}
                          fontSize={'1rem'}
                          fontWeight={400}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.SIDE_BAR.DIRECT_SHIPPING)}
                        </Text>
                      </Radio>
                      <Radio value={1}>
                        <Text
                          color={'#485766'}
                          fontSize={'1rem'}
                          fontWeight={400}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.SIDE_BAR.CONSIGNMENT_SHIPPING)}
                        </Text>
                      </Radio>
                    </VStack>
                  </RadioGroup>
                </VStack>
              </Box>
              */}
            </VStack>
          </Box>
          <Center h={'5rem'} borderTop={'1px solid #AEBDCA'} p={'1rem'}>
            <Button
              // isDisabled={!handleActiveSave()}
              onClick={() => {
                onClose();
                setIsMobilePop(false);
              }}
              _disabled={{
                bg: '#D9E7EC',
              }}
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
                {localeText(LANGUAGES.APPLY)}
              </Text>
            </Button>
          </Center>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ) : (
    <Box w={'25rem'} maxW={'30%'}>
      <VStack spacing={0}>
        <Box py={'0.75rem'} w={'100%'}>
          <HStack justifyContent={'space-between'}>
            <Text
              color={'#485766'}
              fontSize={'1.5rem'}
              fontWeight={500}
              lineHeight={'2.475rem'}
            >
              {localeText(LANGUAGES.FILTER)}
            </Text>
            <Box
              cursor={'pointer'}
              onClick={() => {
                handleInitData();
              }}
            >
              <Text
                color={'#B20000'}
                fontSize={'1rem'}
                fontWeight={500}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.RESET)}
              </Text>
            </Box>
          </HStack>
        </Box>
        <Box
          border={'1px solid #9CADBE'}
          borderRadius={'0.06rem'}
          p={'2.5rem'}
          w={'100%'}
        >
          <VStack spacing={'2rem'}>
            <Box w={'100%'}>
              <HStack justifyContent={'space-between'}>
                <Text
                  color={'#485766'}
                  fontSize={'1.125rem'}
                  fontWeight={500}
                  lineHeight={'1.96875rem'}
                >
                  {localeText(LANGUAGES.MOCRA_FDA_REGISTERED)}
                </Text>
                <Box>
                  <CustomCheckbox
                    isChecked={approvalStatus}
                    onChange={(v) => {
                      setApprovalStatus(v);
                    }}
                  />
                </Box>
              </HStack>
            </Box>

            <Box w={'100%'}>
              <VStack spacing={'1.5rem'}>
                <Box w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'1.125rem'}
                    fontWeight={500}
                    lineHeight={'1.96875rem'}
                  >
                    {localeText(LANGUAGES.TYPE)}
                  </Text>
                </Box>
                <CheckboxGroup
                  value={sideType.map(String)}
                  onChange={(values) => setSideType(values.map(Number))}
                >
                  <VStack spacing="1rem" w="100%" alignItems="flex-start">
                    {sideTypeOptions.map(({ value, label }) => {
                      const checked = sideType.includes(value);
                      return (
                        <SideSearchToggle
                          key={value}
                          checked={checked}
                          onToggle={() => {
                            setSideType((prev) =>
                              checked
                                ? prev.filter((v) => v !== value)
                                : [...prev, value],
                            );
                          }}
                        >
                          {label}
                        </SideSearchToggle>
                      );
                    })}
                  </VStack>
                </CheckboxGroup>
              </VStack>
            </Box>
            <Box w={'100%'}>
              <VStack spacing={'1.5rem'}>
                <Box w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'1.125rem'}
                    fontWeight={500}
                    lineHeight={'1.96875rem'}
                  >
                    {localeText(LANGUAGES.HEADER_MENU.PROMOTION)}
                  </Text>
                </Box>

                <CheckboxGroup
                  value={sidePromotion.map(String)} // Chakra는 string 배열을 요구함
                  onChange={(values) => setSidePromotion(values.map(Number))} // string → number
                >
                  <VStack w="100%" alignItems="flex-start">
                    {listPromotion.map((item, index) => {
                      const isChecked = sidePromotion.includes(
                        item.promotionId,
                      );
                      return (
                        <SideSearchToggle
                          key={index}
                          checked={isChecked}
                          onToggle={() => {
                            setSidePromotion((prev) =>
                              isChecked
                                ? prev.filter((id) => id !== item.promotionId)
                                : [...prev, item.promotionId],
                            );
                          }}
                        >
                          {item.name}
                        </SideSearchToggle>
                      );
                    })}
                  </VStack>
                </CheckboxGroup>
              </VStack>
            </Box>
            <Box w={'100%'}>
              <VStack spacing={'1.5rem'}>
                <Box w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'1.125rem'}
                    fontWeight={500}
                    lineHeight={'1.96875rem'}
                  >
                    {localeText(LANGUAGES.PURCHASE_MINIMUM)}
                  </Text>
                </Box>

                <CheckboxGroup
                  value={minimumOrderAmountType.map(String)}
                  onChange={(values) =>
                    setMinimumOrderAmountType(values.map(Number))
                  }
                >
                  <VStack spacing="1rem" w="100%" alignItems="flex-start">
                    {orderAmountOptions.map(({ value, label }) => {
                      const checked = minimumOrderAmountType.includes(value);
                      return (
                        <SideSearchToggle
                          key={value}
                          checked={checked}
                          onToggle={() => {
                            setMinimumOrderAmountType((prev) =>
                              checked
                                ? prev.filter((v) => v !== value)
                                : [...prev, value],
                            );
                          }}
                        >
                          {label}
                        </SideSearchToggle>
                      );
                    })}
                  </VStack>
                </CheckboxGroup>
              </VStack>
            </Box>
            {/*
            <Box w={'100%'}>
              <VStack spacing={'1.5rem'}>
                <Box w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'1.125rem'}
                    fontWeight={500}
                    lineHeight={'1.96875rem'}
                  >
                    {localeText(LANGUAGES.SHIPPING)}
                  </Text>
                </Box>
                <RadioGroup
                  w={'100%'}
                  value={Number(defaultShipping)}
                  display="flex"
                  onChange={(value) => {
                    setDefaultShipping(Number(value));
                  }}
                >
                  <VStack spacing={'1rem'} w={'100%'} alignItems={'flex-start'}>
                    <Radio value={0}>
                      <Text
                        color={'#485766'}
                        fontSize={'1rem'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.COMMON.ALL)}
                      </Text>
                    </Radio>
                    <Radio value={2}>
                      <Text
                        color={'#485766'}
                        fontSize={'1rem'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.SIDE_BAR.DIRECT_SHIPPING)}
                      </Text>
                    </Radio>
                    <Radio value={1}>
                      <Text
                        color={'#485766'}
                        fontSize={'1rem'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.SIDE_BAR.CONSIGNMENT_SHIPPING)}
                      </Text>
                    </Radio>
                  </VStack>
                </RadioGroup>
              </VStack>
            </Box>
            */}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default CategorySideBar;
