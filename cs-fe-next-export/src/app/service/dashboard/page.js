'use client';

import {
  Box,
  Center,
  Divider,
  HStack,
  Img,
  Text,
  Image as ChakraImage,
  useDisclosure,
  VStack,
  Select,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import IconMoneyBag from '@public/svgs/icon/dash-money-bag.svg';
import IconRight from '@public/svgs/icon/right.svg';
import IconDoc from '@public/svgs/icon/dash-doc.svg';
import IconSeller from '@public/svgs/icon/dash-seller.svg';
import IconBuyer from '@public/svgs/icon/dash-buyer.svg';
import IconVisitor from '@public/svgs/icon/dash-visitors.svg';

import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import utils from '@/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import DefaultPaginate from '@/components/common/pagination/DefaultPaginate';
import ContentBR from '@/components/common/ContentBR';
import { SUCCESS } from '@/constants/errorCode';
import { LIST_CONTENT_NUM, TIME_ZONE } from '@/constants/common';
import MainContainer from '@/components/layout/MainContainer';
import dashBoardApi from '@/services/dashboardApi';
import RangeDateSplitPicker from '@/components/date/RangeDateSplitPicker';
import { toZonedTime } from 'date-fns-tz';
import useMove from '@/hooks/useMove';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const DashBoardPage = () => {
  const chartRef = useRef(null);
  const { moveProductDetail } = useMove();
  const router = useRouter();
  const { localeText } = useLocale();

  const [dateStr, setDateStr] = useState('');
  const [salesStatisticsInfo, setSalesStatisticsInfo] = useState({
    totalSalesAmount: 0,
    ordersCount: 0,
  });
  const [usersStatisticsInfo, setUsersStatisticsInfo] = useState({
    newBuyerUserCount: 0,
    newSellerUserCount: 0,
    visitCount: 0,
  });
  const [dashboardDatas, setDashboardDatas] = useState([]);
  const [dataLabels, setDataLabels] = useState([]);

  const [isInitList, setIsInitList] = useState(true);
  const [listDateStr, setListDateStr] = useState('');
  const [currentPageList, setCurrentPageList] = useState(1);
  const [totalCountList, setTotalCountList] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);
  const [listProduct, setListProduct] = useState([]);

  const now = toZonedTime(new Date(), TIME_ZONE);
  const sevenDaysBefore = new Date(now);
  sevenDaysBefore.setDate(now.getDate() - 7);

  const [startDate, setStartDate] = useState(sevenDaysBefore);
  const [endDate, setEndDate] = useState(now);

  const [listStartDate, setListStartDate] = useState(sevenDaysBefore);
  const [listEndDate, setListEndDate] = useState(now);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (typeof startDate === 'object' && typeof endDate === 'object') {
      handleGetDashBoard(startDate, endDate);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (typeof listStartDate === 'object' && typeof listEndDate === 'object') {
      handleGetListDashBoardAgent();
    }
  }, [listStartDate, listEndDate]);

  useEffect(() => {
    if (
      !isInitList &&
      typeof listStartDate === 'object' &&
      typeof listEndDate === 'object'
    ) {
      handleGetListDashBoard();
    }
  }, [currentPageList, contentNum]);

  const handleGetListDashBoardAgent = () => {
    if (currentPageList === 1) {
      handleGetListDashBoard();
    } else {
      setCurrentPageList(1);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      setDateStr(
        `${utils.parseDateToStr(startDate, '.')} - ${utils.parseDateToStr(
          endDate,
          '.',
        )}`,
      );
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (listStartDate && listEndDate) {
      setListDateStr(
        `${utils.parseDateToStr(listStartDate, '.')} - ${utils.parseDateToStr(
          listEndDate,
          '.',
        )}`,
      );
    }
  }, [listStartDate, listEndDate]);

  const handleOnChangeDatePicker = async (dates, type) => {
    if (type === 'LIST') {
      const start = dates[0] || null;
      const end = dates[1] || null;
      if (start && end) {
        setListStartDate(start);
        setListEndDate(end);
      } else if (!start && !end) {
        setListStartDate(null);
        setListEndDate(null);
      }
    } else {
      const start = dates[0] || null;
      const end = dates[1] || null;
      if (start && end) {
        setStartDate(start);
        setEndDate(end);
      } else if (!start && !end) {
        setStartDate(null);
        setEndDate(null);
      }
    }
  };

  const initDate = (type) => {
    const initStart = sevenDaysBefore;
    const initEnd = now;
    if (type === 'LIST') {
      setListStartDate(initStart);
      setListEndDate(initEnd);
    } else {
      setStartDate(initStart);
      setEndDate(initEnd);
    }
  };

  const handleGetDashBoard = async (startDate, endDate) => {
    if (!startDate || !endDate) return;
    const param = {
      startDate: utils.parseDateToYMD(startDate),
      endDate: utils.parseDateToYMD(endDate),
    };
    const result = await dashBoardApi.getDashBoardStatistics(param);
    if (result?.errorCode === SUCCESS) {
      const dailySalesStatistics = result.dailySalesStatistics;
      const totalSalesAmount = dailySalesStatistics.map((item) => {
        return item.totalSalesAmount;
      });
      const days = dailySalesStatistics.map((item) => {
        return item.date.slice(-2);
      });
      const usersStatisticsInfo = result.usersStatisticsInfo;
      setUsersStatisticsInfo(usersStatisticsInfo);
      setDashboardDatas(totalSalesAmount);
      setDataLabels(days);
      setSalesStatisticsInfo(result.salesStatisticsInfo);
    } else {
      setDashboardDatas([]);
      setDataLabels([]);
      setSalesStatisticsInfo({
        totalSalesAmount: 0,
        ordersCount: 0,
      });
      setUsersStatisticsInfo({
        newBuyerUserCount: 0,
        newSellerUserCount: 0,
        visitCount: 0,
      });
    }
  };

  const [loading, setLoading] = useState(false);
  const lastScrollTop = useRef(0);

  const handleScroll = useCallback(async () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollY > lastScrollTop.current) {
      if (scrollY + windowHeight >= documentHeight && !loading) {
        if (currentPageList !== 1) {
          if (listProduct.length === contentNum) {
            setCurrentPageList((prevPage) => prevPage + 1);
          } else {
            handleGetListDashBoard();
          }
        } else {
          handleGetListDashBoard();
        }
      }
    }
    lastScrollTop.current = scrollY;
  }, [loading]);

  useEffect(() => {
    const handleScrollEvent = () => handleScroll();
    window.addEventListener('scroll', handleScrollEvent);

    return () => {
      window.removeEventListener('scroll', handleScrollEvent);
    };
  }, [handleScroll]);

  const handleGetListDashBoard = async () => {
    if (!listStartDate || !listEndDate) return;
    if (loading) return;
    setLoading(true);

    const param = {
      pageNum: currentPageList,
      contentNum: contentNum,
      startDate: utils.parseDateToYMD(listStartDate),
      endDate: utils.parseDateToYMD(listEndDate),
    };
    const result = await dashBoardApi.getListDashBoard(param);
    try {
      if (result?.errorCode === SUCCESS) {
        const resultRankDatas = getRankedDatas(
          result.datas,
          currentPageList,
          contentNum,
        );
        setListProduct(resultRankDatas);
        setTotalCountList(result.totalCount);
      } else {
        setListProduct([]);
        setTotalCountList(0);
      }
    } finally {
      setIsInitList(false);
      setLoading(false);
    }
  };

  const getColor = useCallback((value) => {
    const min = Math.min(...dashboardDatas);
    const max = Math.max(...dashboardDatas);

    const interval = (max - min) / 4;

    const intervals = [];
    for (let i = 0; i <= 4; i++) {
      intervals.push(min + interval * i);
    }

    let rangeIndex = null;
    for (let i = 0; i < intervals.length - 1; i++) {
      if (value >= intervals[i] && value <= intervals[i + 1]) {
        rangeIndex = i + 1;
        break;
      }
    }

    if (rangeIndex === 1) return '#D9E7EC';
    if (rangeIndex === 2) return '#A7C3D2';
    if (rangeIndex === 3) return '#90AEC4';
    if (rangeIndex === 4) return '#556A7E';
  });

  const data = {
    labels: dataLabels,
    datasets: [
      {
        label: localeText(LANGUAGES.DASHBOARD.SALES_AMOUNT),
        data: dashboardDatas,
        backgroundColor: (context) => {
          const value = context.dataset.data[context.dataIndex];
          return getColor(value);
        },
        borderColor: (context) => {
          const value = context.dataset.data[context.dataIndex];
          return getColor(value);
        },
        borderWidth: 1,
        borderRadius: 50,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.raw;
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
        },
        ticks: {
          callback: (value) => {
            return utils.parseAmount(value);
          },
          rotate: 0,
        },
      },
      x: {
        ticks: {
          rotate: 0,
          maxRotation: 0,
        },
        grid: {
          color: '#90AEC466',
          display: false,
        },
      },
    },
    animation: {
      duration: 1500,
      easing: 'linear',

      delay: 500,
      onComplete: function () {
        //
      },
    },
  };

  const getNewDatas = (resultDatas, existingDatas) => {
    const existingProductIds = existingDatas.map((item) => item.productId);
    const newDatas = resultDatas.filter(
      (item) => !existingProductIds.includes(item.productId),
    );
    return newDatas;
  };

  const getRankedDatas = (datas, currentPage, contentNum) => {
    const sortedDatas = datas.sort((a, b) => b.salesCount - a.salesCount);

    const startIndex = (currentPage - 1) * contentNum;
    const endIndex = startIndex + contentNum;
    const paginatedDatas = sortedDatas.slice(startIndex, endIndex);

    const rankedDatas = paginatedDatas.map((item, index) => ({
      ...item,
      rank: startIndex + index + 1,
    }));

    return rankedDatas;
  };

  const orderCard = useCallback((item, index) => {
    const name = item?.name || '';
    const msrp = item?.msrp || 0;
    const wp = item?.wp || 0;
    const productId = item?.productId;
    const thirdCategoryName = item?.thirdCategoryName || '';
    const productImageList = item?.productImageList || [];
    const firstCategoryName = item?.firstCategoryName || '';
    const secondCategoryName = item?.secondCategoryName || '';
    const salesCount = item?.salesCount || 0;
    const rank = item?.rank;

    let firstImageSrc = null;
    if (productImageList.length > 0) {
      firstImageSrc = productImageList[0].imageS3Url;
    }

    const handleCategory = (first, second, third) => {
      if (third) {
        return `${first} > ${second} > ${third}`;
      } else if (second) {
        return `${first} > ${second}`;
      } else if (first) {
        return `${first}`;
      }
    };

    return (
      <Box
        key={index}
        w={'100%'}
        h={'6.5rem'}
        px={'1rem'}
        py={'0.75rem'}
        borderBottom={
          listProduct.length - 1 === index ? null : '1px solid #73829D'
        }
        boxSizing={'border-box'}
      >
        <HStack spacing={'0.75rem'}>
          <Box w={'3.875rem'}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {rank}
            </Text>
          </Box>
          <Box
            w={'50.875rem'}
            onClick={() => {
              moveProductDetail(productId);
            }}
            cursor={'pointer'}
          >
            <HStack spacing={'0.75rem'}>
              <Center w={'5rem'} h={'5rem'}>
                <ChakraImage
                  fallback={<DefaultSkeleton />}
                  w={'100%'}
                  h={'100%'}
                  objectFit={'cover'}
                  src={firstImageSrc}
                />
              </Center>
              <Box>
                <VStack spacing={'0.5rem'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={'0.9357rem'}
                      fontWeight={500}
                      lineHeight={'1.5rem'}
                    >
                      {name}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <HStack spacing={'0.25rem'} alignItems={'center'}>
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
                </VStack>
              </Box>
            </HStack>
          </Box>
          <Box w={'8.75rem'}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {utils.parseDallar(wp * salesCount)}
            </Text>
          </Box>
          <Box w={'5rem'}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9375rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {utils.parseAmount(salesCount)}
            </Text>
          </Box>
        </HStack>
      </Box>
    );
  });

  return (
    <MainContainer
      contentHeader={
        <Box>
          <RangeDateSplitPicker
            startDate={startDate}
            endDate={endDate}
            onInit={() => {
              initDate();
            }}
            onChange={(date) => {
              if (!date) return;
              handleOnChangeDatePicker(date);
            }}
          />
        </Box>
      }
    >
      <Box
        w={'100%'}
        h={'9rem'}
        p={'1.25rem'}
        bg={'#90aec412'}
        border={'1px solid #AEBDCA'}
        borderRadius={'0.25rem'}
        boxSizing={'border-box'}
      >
        <HStack spacing={'1.25rem'} h={'100%'}>
          <Box w={'20%'} h={'100%'}>
            <VStack h={'100%'} justifyContent={'space-between'}>
              <Box w={'100%'}>
                <HStack spacing={'0.25rem'} alignItems={'flex-start'}>
                  <Img src={IconMoneyBag.src} />
                  <Box>
                    <Text
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      color={'#66809C'}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.DASHBOARD.TOTAL_SALES)}
                    </Text>
                  </Box>
                </HStack>
              </Box>
              <Box w={'100%'}>
                <Text
                  fontSize={'1.75rem'}
                  fontWeight={500}
                  lineHeight={'2.7475rem'}
                  color={'#485766'}
                  textAlign={'right'}
                >
                  {utils.parseDallar(salesStatisticsInfo.totalSalesAmount || 0)}
                </Text>
              </Box>
            </VStack>
          </Box>

          <Divider
            w={'1px'}
            h={'6.5rem'}
            boxSizing={'border-box'}
            borderRight={'1px solid #AEBDCA'}
          />

          <Box w={'20%'} h={'100%'}>
            <VStack h={'100%'} justifyContent={'space-between'}>
              <Box w={'100%'}>
                <HStack spacing={'0.25rem'} alignItems={'flex-start'}>
                  <Img src={IconDoc.src} />
                  <Box>
                    <Text
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      color={'#66809C'}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.DASHBOARD.NUMBER_OF_ORDERS)}
                    </Text>
                  </Box>
                </HStack>
              </Box>
              <Box w={'100%'}>
                <Text
                  fontSize={'1.75rem'}
                  fontWeight={500}
                  lineHeight={'2.7475rem'}
                  color={'#485766'}
                  textAlign={'right'}
                >
                  {utils.parseAmount(salesStatisticsInfo.ordersCount)}
                </Text>
              </Box>
            </VStack>
          </Box>

          <Divider
            w={'1px'}
            h={'6.5rem'}
            boxSizing={'border-box'}
            borderRight={'1px solid #AEBDCA'}
          />

          <Box w={'20%'} h={'100%'}>
            <VStack h={'100%'} justifyContent={'space-between'}>
              <Box w={'100%'}>
                <HStack spacing={'0.25rem'} alignItems={'flex-start'}>
                  <Img src={IconVisitor.src} />
                  <Box>
                    <Text
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      color={'#66809C'}
                      lineHeight={'1.5rem'}
                      whiteSpace={'pre-wrap'}
                    >
                      {localeText(LANGUAGES.DASHBOARD.NUMBER_OF_VISITORS)}
                    </Text>
                  </Box>
                </HStack>
              </Box>
              <Box w={'100%'}>
                <Text
                  fontSize={'1.75rem'}
                  fontWeight={500}
                  lineHeight={'2.7475rem'}
                  color={'#485766'}
                  textAlign={'right'}
                >
                  {utils.parseAmount(usersStatisticsInfo.visitCount)}
                </Text>
              </Box>
            </VStack>
          </Box>

          <Divider
            w={'1px'}
            h={'6.5rem'}
            boxSizing={'border-box'}
            borderRight={'1px solid #AEBDCA'}
          />

          <Box w={'20%'} h={'100%'}>
            <VStack h={'100%'} justifyContent={'space-between'}>
              <Box w={'100%'}>
                <HStack spacing={'0.25rem'} alignItems={'flex-start'}>
                  <Img src={IconSeller.src} />
                  <Box>
                    <Text
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      color={'#66809C'}
                      lineHeight={'1.5rem'}
                      whiteSpace={'pre-wrap'}
                    >
                      {localeText(LANGUAGES.DASHBOARD.NUMBER_OF_SELLER)}
                    </Text>
                  </Box>
                </HStack>
              </Box>
              <Box w={'100%'}>
                <Text
                  fontSize={'1.75rem'}
                  fontWeight={500}
                  lineHeight={'2.7475rem'}
                  color={'#485766'}
                  textAlign={'right'}
                >
                  {utils.parseAmount(usersStatisticsInfo.newSellerUserCount)}
                </Text>
              </Box>
            </VStack>
          </Box>

          <Divider
            w={'1px'}
            h={'6.5rem'}
            boxSizing={'border-box'}
            borderRight={'1px solid #AEBDCA'}
          />

          <Box w={'20%'} h={'100%'}>
            <VStack h={'100%'} justifyContent={'space-between'}>
              <Box w={'100%'}>
                <HStack spacing={'0.25rem'} alignItems={'flex-start'}>
                  <Img src={IconBuyer.src} />
                  <Box>
                    <Text
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      color={'#66809C'}
                      lineHeight={'1.5rem'}
                      whiteSpace={'pre-wrap'}
                    >
                      {localeText(LANGUAGES.DASHBOARD.NUMBER_OF_BUYER)}
                    </Text>
                  </Box>
                </HStack>
              </Box>
              <Box w={'100%'}>
                <Text
                  fontSize={'1.75rem'}
                  fontWeight={500}
                  lineHeight={'2.7475rem'}
                  color={'#485766'}
                  textAlign={'right'}
                >
                  {utils.parseAmount(usersStatisticsInfo.newBuyerUserCount)}
                </Text>
              </Box>
            </VStack>
          </Box>
        </HStack>
      </Box>

      <ContentBR h={'2.5rem'} />

      <Box w={'100%'}>
        <VStack spacing={'1.25rem'} alignItems={'flex-start'}>
          <Box w={'100%'}>
            <Text
              color={'#485766'}
              fontSize={'1.125rem'}
              fontWeight={500}
              lineHeight={'1.96875rem'}
            >
              {localeText(LANGUAGES.DASHBOARD.SALES_STATUS)}
            </Text>
          </Box>
          <Box w={'100%'} h={'13.5rem'}>
            <Bar ref={chartRef} data={data} options={options} />
          </Box>
        </VStack>
      </Box>

      <ContentBR h={'2.5rem'} />

      <Box w={'100%'}>
        <VStack spacing={'1.25rem'}>
          <Box w={'100%'}>
            <HStack justifyContent={'space-between'}>
              <Text
                fontSize={'1.125rem'}
                fontWeight={500}
                lineHeight={'1.96875rem'}
                color={'#485766'}
                textAlign={'right'}
              >
                {localeText(LANGUAGES.DASHBOARD.RANKING_PRODUCTS_SALE)}
              </Text>
              <Box>
                <RangeDateSplitPicker
                  startDate={listStartDate}
                  endDate={listEndDate}
                  onInit={() => {
                    initDate('LIST');
                  }}
                  onChange={(date) => {
                    if (!date) return;
                    handleOnChangeDatePicker(date, 'LIST');
                  }}
                />
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <VStack spacing={0}>
              <Box
                w={'100%'}
                h={'3rem'}
                borderTop={'1px solid #73829D'}
                borderBottom={'1px solid #73829D'}
                px={'1rem'}
                py={'0.75rem'}
                boxSizing={'border-box'}
              >
                <HStack spacing={'0.75rem'}>
                  <Box w={'3.875rem'}>
                    <Text
                      textAlign={'center'}
                      color={'#2A333C'}
                      fontSize={'0.9375rem'}
                      fontWeight={500}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.DASHBOARD.RANKING)}
                    </Text>
                  </Box>
                  <Box w={'50.875rem'}>
                    <Text
                      textAlign={'center'}
                      color={'#2A333C'}
                      fontSize={'0.9375rem'}
                      fontWeight={500}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.DASHBOARD.PRODUCT)}
                    </Text>
                  </Box>
                  <Box w={'8.75rem'}>
                    <Text
                      textAlign={'center'}
                      color={'#2A333C'}
                      fontSize={'0.9375rem'}
                      fontWeight={500}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.DASHBOARD.SALES_AMOUNT)}
                    </Text>
                  </Box>
                  <Box w={'5rem'}>
                    <Text
                      textAlign={'center'}
                      color={'#2A333C'}
                      fontSize={'0.9375rem'}
                      fontWeight={500}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.DASHBOARD.SALES)}
                    </Text>
                  </Box>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <VStack spacing={'0.75rem'}>
                  <Box
                    w={'100%'}
                    overflowY={'auto'}
                    className="no-scroll"
                    borderBottom={'1px solid #AEBDCA'}
                    boxSizing={'border-box'}
                  >
                    <VStack spacing={0}>
                      {listProduct.map((item, index) => {
                        return orderCard(item, index);
                      })}
                      {listProduct.length === 0 && (
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
                  <Box w={'100%'}>
                    <HStack justifyContent={'space-between'}>
                      <Box w={'6.125rem'}>
                        <Select
                          value={contentNum}
                          onChange={(e) => {
                            setContentNum(e.target.value);
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
                          currentPage={currentPageList}
                          setCurrentPage={setCurrentPageList}
                          totalCount={totalCountList}
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

      <ContentBR h={'1.25rem'} />
    </MainContainer>
  );
};

export default DashBoardPage;
