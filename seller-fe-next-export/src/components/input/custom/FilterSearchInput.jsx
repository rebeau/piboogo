'use client';

import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  HStack,
  Img,
  Input,
  Select,
  Spacer,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';

import IconSearch from '@public/svgs/icon/big-search.svg';
import IconFilter from '@public/svgs/icon/filter.svg';
import IconActiveFilter from '@public/svgs/icon/active-filter.svg';
import { useCallback, useEffect, useState } from 'react';
import RangeDatePicker from '@/components/date/RangeDatePicker';
import utils from '@/utils';
import CustomCheckBox from '@/components/common/checkbox/CustomCheckBox';
import firstCategoryApi from '@/services/firstCategoryApi';
import useMenu from '@/hooks/useMenu';
import promotionApi from '@/services/promotionApi';
import { SUCCESS } from '@/constants/errorCode';
import useDevice from '@/hooks/useDevice';
import { CustomIcon } from '@/components';

const FilterSearchInput = (props) => {
  const { isMobile, clampW } = useDevice();
  const {
    placeholder,
    borderRadius = '0.25rem',
    placeholderFontColor = '#A7C3D2',
    //
    onFilter,
    setOnFilter,
    returnFilter,
  } = props;

  const {
    listAllCategory,
    handleAllCategory,
    listFirstCategory,
    setListFirstCategory,
    listSecondCategory,
    setListSecondCategory,
    listThirdCategory,
    setListThirdCategory,
    handleGetFirstCategory,
    handleGetSecondCategory,
    handleGetThirdCategory,
    handleFindCategoryById,
  } = useMenu();

  const [initPage, setInitPage] = useState(true);
  const [dateStr, setDateStr] = useState('');
  const { localeText } = useLocale();

  // 옵션들

  const [searchBy, setSearchBy] = useState('');
  const [firstCategoryId, setFirstCategoryId] = useState(0);
  const [secondCategoryId, setSecondCategoryId] = useState(0);
  const [thirdCategoryId, setThirdCategoryId] = useState(0);
  const [promotionId, setPromotionId] = useState(0);
  const [status, setStatus] = useState(1);
  const [minWp, setMinWp] = useState(0);
  const [maxWp, setMaxWp] = useState(0);
  const [keyword, setKeyword] = useState(null);
  const [isPeriod, setIsPeriod] = useState(false);

  // 프로모션 처리
  // TODO 스크롤 갱신 필요할지도?
  const [currentPagePromotion, setCurrentPagePromotion] = useState(1);
  const [contentNumPromotion, setContentNumPromotion] = useState(10);
  const [listPromotion, setListPromotion] = useState([]);

  // 카테고리 처리
  useEffect(() => {
    const find = async () => {
      const result = await handleFindCategoryById(firstCategoryId);
      if (result?.secondCategoryDataList) {
        setListSecondCategory(result.secondCategoryDataList);
      } else {
        setListSecondCategory([]);
      }
    };
    if (utils.isNotEmpty(firstCategoryId)) {
      find();
    }
  }, [firstCategoryId]);
  useEffect(() => {
    const find = async () => {
      const result = await handleFindCategoryById(null, secondCategoryId);
      if (result?.thirdCategoryDataList) {
        setListThirdCategory(result.thirdCategoryDataList);
      } else {
        setListThirdCategory([]);
      }
    };
    if (utils.isNotEmpty(secondCategoryId)) {
      find();
    }
  }, [secondCategoryId]);

  const handleReset = () => {
    // 값 초기화
    setFirstCategoryId(0);
    setSecondCategoryId(0);
    setThirdCategoryId(0);
    setPromotionId(0);
    setStatus(1);
    setMinWp(0);
    setMaxWp(0);
    setKeyword(null);
    setIsPeriod(false);
  };

  const handleApply = (type) => {
    const param = {};
    if (type === 'SEARCH') {
      if (searchBy) {
        param.searchBy = searchBy;
      }
    } else {
      param.firstCategoryId = firstCategoryId;
      param.secondCategoryId = secondCategoryId;
      param.thirdCategoryId = thirdCategoryId;
      param.promotionId = promotionId;
      param.status = status;
      param.minWp = minWp;
      param.maxWp = maxWp;
      param.startDate = !isPeriod
        ? startDate
          ? utils.parseDateToYMD(startDate)
          : null
        : null;
      param.endDate = !isPeriod
        ? endDate
          ? utils.parseDateToYMD(endDate)
          : null
        : null;
      if (keyword) {
        param.searchBy = keyword;
      }
    }
    returnFilter(param);
    handleToggle();
  };

  const handleGetCategory = async () => {
    if (listAllCategory.length === 0) {
      handleAllCategory();
    } else {
      setListFirstCategory(listAllCategory);
    }
  };

  const handleGetListPromotion = async () => {
    const param = {
      pageNum: currentPagePromotion,
      contentNum: contentNumPromotion,
    };
    const result = await promotionApi.getListPromotion(param);

    if (result?.errorCode === SUCCESS) {
      setListPromotion(result.datas);
    } else {
      setListPromotion([]);
    }
  };

  const beforeToggle = async () => {
    if (initPage) {
      setInitPage(false);
      handleGetCategory();
      handleGetListPromotion();
    }
  };

  const handleToggle = async () => {
    // 예시: 버튼 클릭 시 첫 번째 항목을 활성화/비활성화
    if (onFilter === null) {
      await beforeToggle();
    }
    setOnFilter((prevIndex) => (prevIndex === 0 ? null : 0));
  };

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const {
    isOpen: isOpenDatePicker,
    onOpen: onOpenDatePicker,
    onClose: onCloseDatePicker,
  } = useDisclosure();

  const initDate = () => {
    setStartDate(null);
    setEndDate(null);
    onCloseDatePicker();
  };

  useEffect(() => {
    if (startDate && endDate) {
      setDateStr(
        `${utils.parseDateToStr(startDate, '.')} - ${utils.parseDateToStr(
          endDate,
          '.',
        )}`,
      );
    } else {
      setDateStr('YYYY.MM.DD - YYYY.MM.DD');
    }
  }, [startDate, endDate]);

  const handleOnChangeDatePicker = async (dates) => {
    setStartDate(dates.startDate);
    setEndDate(dates.endDate);
    if (dates.startDate && dates.endDate) {
      onCloseDatePicker();
    }
  };

  return (
    <Accordion index={onFilter} allowMultiple>
      <AccordionItem border={0}>
        <Box
          px={'1rem'}
          py={'0.75rem'}
          w={'100%'}
          h={'3rem'}
          borderRadius={borderRadius}
          border={'1px solid #9CADBE'}
          boxSizing={'border-box'}
        >
          <HStack h={'100%'} spacing={'1rem'} alignItems={'center'}>
            <Center minW={'1.5rem'} w={'1.5rem'} h={'1.5rem'}>
              <Img w={'100%'} h={'100%'} src={IconSearch.src} />
            </Center>
            <Input
              px={0}
              h={'100%'}
              placeholder={placeholder}
              _placeholder={{
                fontWeight: 400,
                fontSize: clampW(0.937, 1),
                color: placeholderFontColor,
              }}
              border={0}
              fontSize={clampW(0.937, 1)}
              fontWeight={400}
              value={searchBy || ''}
              onChange={(e) => {
                setSearchBy(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  handleApply('SEARCH');
                }
              }}
            />
            <Box w={'max-content'}>
              <AccordionButton p={0} _hover={{}} onClick={handleToggle}>
                <Center w={'1.25rem'} h={'1.25rem'}>
                  <Img
                    w={'100%'}
                    h={'100%'}
                    src={onFilter === 0 ? IconActiveFilter.src : IconFilter.src}
                  />
                </Center>
              </AccordionButton>
            </Box>
          </HStack>
        </Box>
        {isMobile(true) ? (
          <Drawer
            placement={'left'}
            onClose={handleToggle}
            isOpen={onFilter === 0}
          >
            <DrawerOverlay />
            <DrawerContent maxW={'18rem'}>
              <DrawerBody pt={'1.5rem'} px={'1.25rem'}>
                <Box w={'100%'} h={'2.25rem'}>
                  <HStack justifyContent={'space-between'}>
                    <Text
                      color={'#485766'}
                      fontSize={clampW(1.2, 1.5)}
                      fontWeight={500}
                      lineHeight={'160%'}
                    >
                      {localeText(LANGUAGES.FILTER)}
                    </Text>
                    <Box
                      w={'2rem'}
                      h={'2rem'}
                      cursor={'pointer'}
                      onClick={() => {
                        handleToggle();
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
                  w={'100%'}
                  // h={'calc(100% - 2.25rem - 5rem)'}
                  h={'calc(100% - 2.25rem)'}
                  overflowY={'auto'}
                >
                  <VStack spacing={'2rem'}>
                    <Spacer />
                    <Box w={'100%'}>
                      <VStack
                        alignItems={'flex-start'}
                        spacing={'0.25rem'}
                        h={'calc(100% - 3.75rem - 5rem)'}
                      >
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.CATEGORY)}
                        </Text>
                        <Box w={'100%'}>
                          <VStack
                            justifyContent={'space-between'}
                            spacing={'0.75rem'}
                          >
                            <Box w={'100%'}>
                              <Select
                                value={firstCategoryId}
                                onChange={(e) => {
                                  setSecondCategoryId(0);
                                  setThirdCategoryId(0);
                                  setFirstCategoryId(Number(e.target.value));
                                }}
                                w={'100%'}
                                h={'3rem'}
                                bg={'#FFF'}
                                borderRadius={'0.25rem'}
                                boxSizing={'border-box'}
                                border={'1px solid #9CADBE'}
                              >
                                <option value={0}>1st</option>
                                {listFirstCategory.map((item, index) => {
                                  return (
                                    <option
                                      value={item.firstCategoryId}
                                      key={index}
                                    >
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </Select>
                            </Box>
                            <Box w={'100%'}>
                              <Select
                                value={secondCategoryId}
                                onChange={(e) => {
                                  setThirdCategoryId(0);
                                  setSecondCategoryId(Number(e.target.value));
                                }}
                                w={'100%'}
                                h={'3rem'}
                                bg={'#FFF'}
                                borderRadius={'0.25rem'}
                                boxSizing={'border-box'}
                                border={'1px solid #9CADBE'}
                              >
                                <option value={0}>2st</option>
                                {listSecondCategory.map((item, index) => {
                                  return (
                                    <option
                                      value={item.secondCategoryId}
                                      key={index}
                                    >
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </Select>
                            </Box>
                            <Box w={'100%'}>
                              <Select
                                value={thirdCategoryId}
                                onChange={(e) => {
                                  setThirdCategoryId(Number(e.target.value));
                                }}
                                w={'100%'}
                                h={'3rem'}
                                bg={'#FFF'}
                                borderRadius={'0.25rem'}
                                boxSizing={'border-box'}
                                border={'1px solid #9CADBE'}
                              >
                                <option value={0}>3st</option>
                                {listThirdCategory.map((item, index) => {
                                  return (
                                    <option
                                      value={item.thirdCategoryId}
                                      key={index}
                                    >
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </Select>
                            </Box>
                          </VStack>
                        </Box>
                      </VStack>
                    </Box>

                    <Box w={'100%'}>
                      <VStack alignItems={'flex-start'} spacing={'0.25rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.PROMOTION)}
                        </Text>
                        <Box w={'100%'}>
                          <Select
                            value={promotionId}
                            onChange={(e) => {
                              setPromotionId(Number(e.target.value));
                            }}
                            w={'100%'}
                            h={'3rem'}
                            bg={'#FFF'}
                            borderRadius={'0.25rem'}
                            boxSizing={'border-box'}
                            border={'1px solid #9CADBE'}
                          >
                            <option value={0}>
                              {localeText(LANGUAGES.COMMON.ALL)}
                            </option>
                            {listPromotion.map((item, index) => {
                              return (
                                <option value={item.promotionId} key={index}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </Select>
                        </Box>
                      </VStack>
                    </Box>

                    <Box w={'100%'}>
                      <VStack alignItems={'flex-start'} spacing={'0.25rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.STATUS)}
                        </Text>
                        <Box w={'100%'}>
                          <Select
                            value={status}
                            onChange={(e) => {
                              setStatus(Number(e.target.value));
                            }}
                            w={'100%'}
                            h={'3rem'}
                            bg={'#FFF'}
                            borderRadius={'0.25rem'}
                            boxSizing={'border-box'}
                            border={'1px solid #9CADBE'}
                          >
                            <option value={1}>
                              {localeText(LANGUAGES.PRODUCTS.ON_SALE)}
                            </option>
                            <option value={2}>
                              {localeText(LANGUAGES.PRODUCTS.STOP_SELLING)}
                            </option>
                            <option value={3}>
                              {localeText(LANGUAGES.PRODUCTS.OUT_OF_STOCK)}
                            </option>
                          </Select>
                        </Box>
                      </VStack>
                    </Box>

                    <Box w={'100%'}>
                      <VStack alignItems={'flex-start'} spacing={'0.25rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.SUPPLY_PRICE)}
                        </Text>
                        <Box w={'100%'}>
                          <VStack spacing={'0.75rem'}>
                            <Box
                              w={'100%'}
                              h={'3rem'}
                              border={'1px solid #9CADBE'}
                              borderRadius={'0.25rem'}
                              boxSizing={'border-box'}
                            >
                              <Input
                                placeholder={localeText(
                                  LANGUAGES.PRODUCTS.PH_AMOUNT,
                                )}
                                w={'100%'}
                                h={'100%'}
                                _placeholder={{
                                  color: '#A7C3D2',
                                  fontSize: '1rem',
                                  fontWeight: 400,
                                  lineHeight: '1.75rem',
                                }}
                                border={0}
                                onChange={(e) => {
                                  setMinWp(Number(e.target.value));
                                }}
                                type={'number'}
                                value={minWp || ''}
                                bg={'#FFF'}
                              />
                            </Box>
                            <HStack spacing={'0.75rem'} w={'100%'}>
                              <Center h={'100%'}>
                                <Text
                                  fontSize={'1rem'}
                                  lineHeight={'1.75rem'}
                                  color={'#7895B2'}
                                >
                                  -
                                </Text>
                              </Center>
                              <Box
                                w={'100%'}
                                h={'3rem'}
                                border={'1px solid #9CADBE'}
                                borderRadius={'0.25rem'}
                                boxSizing={'border-box'}
                              >
                                <Input
                                  placeholder={localeText(
                                    LANGUAGES.PRODUCTS.PH_AMOUNT,
                                  )}
                                  w={'100%'}
                                  h={'100%'}
                                  _placeholder={{
                                    color: '#A7C3D2',
                                    fontSize: '1rem',
                                    fontWeight: 400,
                                    lineHeight: '1.75rem',
                                  }}
                                  border={0}
                                  onChange={(e) => {
                                    setMaxWp(Number(e.target.value));
                                  }}
                                  type={'number'}
                                  value={maxWp || ''}
                                  bg={'#FFF'}
                                />
                              </Box>
                            </HStack>
                          </VStack>
                        </Box>
                      </VStack>
                    </Box>

                    <Box w={'100%'}>
                      <VStack alignItems={'flex-start'} spacing={'0.5rem'}>
                        <Box>
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.REGISTRATION_DATE)}
                          </Text>
                        </Box>

                        <Box w={'100%'} h={'3rem'}>
                          <RangeDatePicker
                            dateStr={dateStr}
                            isOpen={isOpenDatePicker}
                            onOpen={onOpenDatePicker}
                            onClose={onCloseDatePicker}
                            onInitDate={initDate}
                            start={startDate}
                            end={endDate}
                            handleOnChangeDate={handleOnChangeDatePicker}
                          />
                        </Box>

                        <Box minW={'7.1875rem'} maxW={'max-content'}>
                          <HStack spacing={'0.5rem'}>
                            <CustomCheckBox
                              isChecked={isPeriod}
                              onChange={(v) => {
                                setIsPeriod(v);
                              }}
                            />
                            <Box w={'max-content'}>
                              <Text
                                color={'#485766'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                              >
                                {localeText(LANGUAGES.PRODUCTS.ALL_PERIODS)}
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                      </VStack>
                    </Box>

                    <Box w={'100%'}>
                      <VStack alignItems={'flex-start'} spacing={'0.25rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.KEYWORD)}
                        </Text>
                        <Box
                          w={'100%'}
                          h={'3rem'}
                          border={'1px solid #9CADBE'}
                          borderRadius={'0.25rem'}
                          boxSizing={'border-box'}
                        >
                          <Input
                            placeholder={localeText(
                              LANGUAGES.PRODUCTS.PH_KEYWORD,
                            )}
                            w={'100%'}
                            h={'100%'}
                            _placeholder={{
                              color: '#A7C3D2',
                              fontSize: '1rem',
                              fontWeight: 400,
                              lineHeight: '1.75rem',
                            }}
                            border={0}
                            onChange={(e) => {
                              setKeyword(e.target.value);
                            }}
                            value={keyword || ''}
                            bg={'#FFF'}
                            onKeyDown={(e) => {
                              if (e.keyCode === 13) {
                                handleApply('APPLY');
                              }
                            }}
                          />
                        </Box>
                      </VStack>
                    </Box>

                    <Box w={'100%'} mb={'1.5rem'}>
                      <HStack w={'100%'} justifyContent={'space-between'}>
                        <Button
                          onClick={handleReset}
                          px={'1.25rem'}
                          py={'0.63rem'}
                          border={'1px solid #73829D'}
                          boxSizing={'border-box'}
                          borderRadius={'0.25rem'}
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
                            color={'#556A7E'}
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.RESET)}
                          </Text>
                        </Button>
                        <Button
                          onClick={() => {
                            handleApply();
                          }}
                          px={'1.25rem'}
                          py={'0.63rem'}
                          borderRadius={'0.25rem'}
                          bg={'#7895B2'}
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
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.APPLY)}
                          </Text>
                        </Button>
                      </HStack>
                    </Box>
                  </VStack>
                </Box>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        ) : (
          <AccordionPanel p={'1rem'} bg={'#E9F2F5'}>
            <VStack spacing={'1rem'}>
              <Box w={'100%'}>
                <HStack spacing={'0.75rem'} justifyContent={'space-between'}>
                  <Box w={'50%'}>
                    <VStack spacing={'0.75rem'} h={'100%'}>
                      <Box w={'100%'}>
                        <VStack alignItems={'flex-start'} spacing={'0.25rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.CATEGORY)}
                          </Text>
                          <Box w={'100%'}>
                            <HStack justifyContent={'space-between'}>
                              <Box w={'33%'}>
                                <Select
                                  value={firstCategoryId}
                                  onChange={(e) => {
                                    setSecondCategoryId(0);
                                    setThirdCategoryId(0);
                                    setFirstCategoryId(Number(e.target.value));
                                  }}
                                  w={'100%'}
                                  h={'3rem'}
                                  bg={'#FFF'}
                                  borderRadius={'0.25rem'}
                                  boxSizing={'border-box'}
                                  border={'1px solid #9CADBE'}
                                >
                                  <option value={0}>1st</option>
                                  {listFirstCategory.map((item, index) => {
                                    return (
                                      <option
                                        value={item.firstCategoryId}
                                        key={index}
                                      >
                                        {item.name}
                                      </option>
                                    );
                                  })}
                                </Select>
                              </Box>
                              <Box w={'33%'}>
                                <Select
                                  value={secondCategoryId}
                                  onChange={(e) => {
                                    setThirdCategoryId(0);
                                    setSecondCategoryId(Number(e.target.value));
                                  }}
                                  w={'100%'}
                                  h={'3rem'}
                                  bg={'#FFF'}
                                  borderRadius={'0.25rem'}
                                  boxSizing={'border-box'}
                                  border={'1px solid #9CADBE'}
                                >
                                  <option value={0}>2st</option>
                                  {listSecondCategory.map((item, index) => {
                                    return (
                                      <option
                                        value={item.secondCategoryId}
                                        key={index}
                                      >
                                        {item.name}
                                      </option>
                                    );
                                  })}
                                </Select>
                              </Box>
                              <Box w={'33%'}>
                                <Select
                                  value={thirdCategoryId}
                                  onChange={(e) => {
                                    setThirdCategoryId(Number(e.target.value));
                                  }}
                                  w={'100%'}
                                  h={'3rem'}
                                  bg={'#FFF'}
                                  borderRadius={'0.25rem'}
                                  boxSizing={'border-box'}
                                  border={'1px solid #9CADBE'}
                                >
                                  <option value={0}>3st</option>
                                  {listThirdCategory.map((item, index) => {
                                    return (
                                      <option
                                        value={item.thirdCategoryId}
                                        key={index}
                                      >
                                        {item.name}
                                      </option>
                                    );
                                  })}
                                </Select>
                              </Box>
                            </HStack>
                          </Box>
                        </VStack>
                      </Box>
                      <Box w={'100%'}>
                        <VStack alignItems={'flex-start'} spacing={'0.25rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.STATUS)}
                          </Text>
                          <Box w={'100%'}>
                            <Select
                              value={status}
                              onChange={(e) => {
                                setStatus(Number(e.target.value));
                              }}
                              w={'100%'}
                              h={'3rem'}
                              bg={'#FFF'}
                              borderRadius={'0.25rem'}
                              boxSizing={'border-box'}
                              border={'1px solid #9CADBE'}
                            >
                              <option value={1}>
                                {localeText(LANGUAGES.PRODUCTS.ON_SALE)}
                              </option>
                              <option value={2}>
                                {localeText(LANGUAGES.PRODUCTS.STOP_SELLING)}
                              </option>
                              <option value={3}>
                                {localeText(LANGUAGES.PRODUCTS.OUT_OF_STOCK)}
                              </option>
                            </Select>
                          </Box>
                        </VStack>
                      </Box>
                      <Box w={'100%'}>
                        <VStack alignItems={'flex-start'} spacing={'0.25rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.REGISTRATION_DATE)}
                          </Text>
                          <Box w={'100%'}>
                            <HStack
                              justifyContent={'space-between'}
                              spacing={'1.25rem'}
                            >
                              <Box w={'26.5625rem'} h={'3rem'}>
                                <RangeDatePicker
                                  dateStr={dateStr}
                                  isOpen={isOpenDatePicker}
                                  onOpen={onOpenDatePicker}
                                  onClose={onCloseDatePicker}
                                  onInitDate={initDate}
                                  start={startDate}
                                  end={endDate}
                                  handleOnChangeDate={handleOnChangeDatePicker}
                                />
                              </Box>
                              <Box minW={'7.1875rem'} maxW={'max-content'}>
                                <HStack spacing={'0.5rem'}>
                                  <CustomCheckBox
                                    isChecked={isPeriod}
                                    onChange={(v) => {
                                      setIsPeriod(v);
                                    }}
                                  />
                                  <Box w={'max-content'}>
                                    <Text
                                      color={'#485766'}
                                      fontSize={'1rem'}
                                      fontWeight={400}
                                      lineHeight={'1.75rem'}
                                    >
                                      {localeText(
                                        LANGUAGES.PRODUCTS.ALL_PERIODS,
                                      )}
                                    </Text>
                                  </Box>
                                </HStack>
                              </Box>
                            </HStack>
                          </Box>
                        </VStack>
                      </Box>
                    </VStack>
                  </Box>
                  <Box w={'50%'}>
                    <VStack spacing={'0.75rem'}>
                      <Box w={'100%'}>
                        <VStack alignItems={'flex-start'} spacing={'0.25rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.PROMOTION)}
                          </Text>
                          <Box w={'100%'}>
                            <Select
                              value={promotionId}
                              onChange={(e) => {
                                setPromotionId(Number(e.target.value));
                              }}
                              w={'100%'}
                              h={'3rem'}
                              bg={'#FFF'}
                              borderRadius={'0.25rem'}
                              boxSizing={'border-box'}
                              border={'1px solid #9CADBE'}
                            >
                              <option value={0}>
                                {localeText(LANGUAGES.COMMON.ALL)}
                              </option>
                              {listPromotion.map((item, index) => {
                                return (
                                  <option value={item.promotionId} key={index}>
                                    {item.name}
                                  </option>
                                );
                              })}
                            </Select>
                          </Box>
                        </VStack>
                      </Box>
                      <Box w={'100%'}>
                        <VStack alignItems={'flex-start'} spacing={'0.25rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.SUPPLY_PRICE)}
                          </Text>
                          <Box w={'100%'}>
                            <HStack spacing={'0.75rem'}>
                              <Box
                                w={'100%'}
                                h={'3rem'}
                                border={'1px solid #9CADBE'}
                                borderRadius={'0.25rem'}
                                boxSizing={'border-box'}
                              >
                                <Input
                                  placeholder={localeText(
                                    LANGUAGES.PRODUCTS.PH_AMOUNT,
                                  )}
                                  w={'100%'}
                                  h={'100%'}
                                  _placeholder={{
                                    color: '#A7C3D2',
                                    fontSize: '1rem',
                                    fontWeight: 400,
                                    lineHeight: '1.75rem',
                                  }}
                                  border={0}
                                  onChange={(e) => {
                                    setMinWp(Number(e.target.value));
                                  }}
                                  type={'number'}
                                  value={minWp || ''}
                                  bg={'#FFF'}
                                />
                              </Box>
                              <Center h={'100%'}>
                                <Text
                                  fontSize={'1rem'}
                                  lineHeight={'1.75rem'}
                                  color={'#7895B2'}
                                >
                                  -
                                </Text>
                              </Center>
                              <Box
                                w={'100%'}
                                h={'3rem'}
                                border={'1px solid #9CADBE'}
                                borderRadius={'0.25rem'}
                                boxSizing={'border-box'}
                              >
                                <Input
                                  placeholder={localeText(
                                    LANGUAGES.PRODUCTS.PH_AMOUNT,
                                  )}
                                  w={'100%'}
                                  h={'100%'}
                                  _placeholder={{
                                    color: '#A7C3D2',
                                    fontSize: '1rem',
                                    fontWeight: 400,
                                    lineHeight: '1.75rem',
                                  }}
                                  border={0}
                                  onChange={(e) => {
                                    setMaxWp(Number(e.target.value));
                                  }}
                                  type={'number'}
                                  value={maxWp || ''}
                                  bg={'#FFF'}
                                />
                              </Box>
                            </HStack>
                          </Box>
                        </VStack>
                      </Box>
                      <Box w={'100%'}>
                        <VStack alignItems={'flex-start'} spacing={'0.25rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.KEYWORD)}
                          </Text>
                          <Box
                            w={'100%'}
                            h={'3rem'}
                            border={'1px solid #9CADBE'}
                            borderRadius={'0.25rem'}
                            boxSizing={'border-box'}
                          >
                            <Input
                              placeholder={localeText(
                                LANGUAGES.PRODUCTS.PH_KEYWORD,
                              )}
                              w={'100%'}
                              h={'100%'}
                              _placeholder={{
                                color: '#A7C3D2',
                                fontSize: '1rem',
                                fontWeight: 400,
                                lineHeight: '1.75rem',
                              }}
                              border={0}
                              onChange={(e) => {
                                setKeyword(e.target.value);
                              }}
                              value={keyword || ''}
                              bg={'#FFF'}
                              onKeyDown={(e) => {
                                if (e.keyCode === 13) {
                                  handleApply('APPLY');
                                }
                              }}
                            />
                          </Box>
                        </VStack>
                      </Box>
                    </VStack>
                  </Box>
                </HStack>
              </Box>
              <Box w={'100%'}>
                <HStack spacing={'0.75rem'} justifyContent={'flex-end'}>
                  <Box minW={'7rem'} h={'3rem'}>
                    <Button
                      onClick={handleReset}
                      px={'1.25rem'}
                      py={'0.63rem'}
                      border={'1px solid #73829D'}
                      boxSizing={'border-box'}
                      borderRadius={'0.25rem'}
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
                        color={'#556A7E'}
                        fontSize={'1rem'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.PRODUCTS.RESET)}
                      </Text>
                    </Button>
                  </Box>
                  <Box minW={'7rem'} h={'3rem'}>
                    <Button
                      onClick={() => {
                        handleApply();
                      }}
                      px={'1.25rem'}
                      py={'0.63rem'}
                      borderRadius={'0.25rem'}
                      bg={'#7895B2'}
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
                        fontSize={'1rem'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.PRODUCTS.APPLY)}
                      </Text>
                    </Button>
                  </Box>
                </HStack>
              </Box>
            </VStack>
          </AccordionPanel>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export default FilterSearchInput;
