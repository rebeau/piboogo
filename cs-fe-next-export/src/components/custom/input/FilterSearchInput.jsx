'use client';

import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  HStack,
  Img,
  Input,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react';

import IconSearch from '@public/svgs/icon/big-search.svg';
import IconFilter from '@public/svgs/icon/filter.svg';
import IconActiveFilter from '@public/svgs/icon/active-filter.svg';
import { useEffect, useState } from 'react';
import utils from '@/utils';
import CustomCheckBox from '@/components/common/checkbox/CustomCheckBox';
import useMenu from '@/hooks/useMenu';
import useDevice from '@/hooks/useDevice';
import promotionApi from '@/services/promotionApi';
import { SUCCESS } from '@/constants/errorCode';
import RangeDateSplitPicker from '@/components/date/RangeDateSplitPicker';
import { toZonedTime } from 'date-fns-tz';
import { TIME_ZONE } from '@/constants/common';

const FilterSearchInput = (props) => {
  const { clampW } = useDevice();
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
    handleFindCategoryById,
  } = useMenu();

  const [initPage, setInitPage] = useState(true);
  const { localeText } = useLocale();

  const [searchBy, setSearchBy] = useState('');
  const [firstCategoryId, setFirstCategoryId] = useState(0);
  const [secondCategoryId, setSecondCategoryId] = useState(0);
  const [thirdCategoryId, setThirdCategoryId] = useState(0);
  const [promotionId, setPromotionId] = useState(0);
  const [status, setStatus] = useState(0);
  const [minWp, setMinWp] = useState(0);
  const [maxWp, setMaxWp] = useState(0);
  const [productName, setProductName] = useState(null);
  const [isPeriod, setIsPeriod] = useState(false);

  const [currentPagePromotion, setCurrentPagePromotion] = useState(1);
  const [contentNumPromotion, setContentNumPromotion] = useState(20);
  const [listPromotion, setListPromotion] = useState([]);

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
    setFirstCategoryId(0);
    setSecondCategoryId(0);
    setThirdCategoryId(0);
    setPromotionId(0);
    setStatus(1);
    setMinWp(0);
    setMaxWp(0);
    setProductName(null);
    setIsPeriod(false);
  };

  const handleApply = (type) => {
    const param = {};
    param.firstCategoryId = firstCategoryId;
    param.secondCategoryId = secondCategoryId;
    param.thirdCategoryId = thirdCategoryId;
    param.promotionId = promotionId;
    param.status = status;
    param.minWp = minWp;
    param.maxWp = maxWp;
    param.startDate = !isPeriod ? utils.parseDateToYMD(startDate) : null;
    param.endDate = !isPeriod ? utils.parseDateToYMD(endDate) : null;
    if (type === 'SEARCH') {
      if (searchBy) {
        setProductName('');
        param.searchBy = searchBy;
      }
    } else {
      if (productName) {
        setSearchBy('');
        param.searchBy = productName;
      }
    }

    returnFilter(param);
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
    const result = await promotionApi.getListPromotionApproval(param);
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
    if (onFilter === null) {
      await beforeToggle();
    }
    setOnFilter((prevIndex) => (prevIndex === 0 ? null : 0));
  };

  const now = toZonedTime(new Date(), TIME_ZONE);
  const sevenDaysBefore = new Date(now);
  sevenDaysBefore.setDate(now.getDate() - 7);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const initDate = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleOnChangeDatePicker = async (dates) => {
    const start = dates[0] || null;
    const end = dates[1] || null;
    if (start && end) {
      setStartDate(start);
      setEndDate(end);
    } else if (!start && !end) {
      setStartDate(null);
      setEndDate(null);
    }
  };

  return (
    <Accordion
      index={onFilter}
      allowMultiple
      overflow={'visible'}
      className="filter-form"
    >
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
                            <option value={0}>
                              {localeText(LANGUAGES.COMMON.ALL)}
                            </option>
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
                            <Box h={'3rem'} position={'relative'}>
                              <RangeDateSplitPicker
                                startDate={startDate}
                                endDate={endDate}
                                onInit={initDate}
                                onChange={(date) => {
                                  if (!date) return;
                                  handleOnChangeDatePicker(date);
                                }}
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
                          {localeText(LANGUAGES.PRODUCTS.BRAND_NAME)}
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
                              LANGUAGES.PRODUCTS.PH_BRAND_NAME,
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
                              setProductName(e.target.value);
                            }}
                            value={productName || ''}
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
      </AccordionItem>
    </Accordion>
  );
};

export default FilterSearchInput;
