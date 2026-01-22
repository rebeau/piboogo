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
import MoneyBag from '@public/svgs/icon/dash-money-bag.svg';
import IconRight from '@public/svgs/icon/right.svg';
import Doc from '@public/svgs/icon/dash-doc.svg';
import Refund from '@public/svgs/icon/dash-refund.svg';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import utils from '@/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import RangeDatePicker from '@/components/date/RangeDatePicker';
import { DefaultPaginate } from '@/components';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';

import { Bar } from 'react-chartjs-2'; // Bar 차트를 사용
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import dashBoardApi from '@/services/dashBoardApi';
import { SUCCESS } from '@/constants/errorCode';
import { LIST_CONTENT_NUM, TIME_ZONE } from '@/constants/common';
import useDevice from '@/hooks/useDevice';
import useMove from '@/hooks/useMove';
import MainContainer from '@/components/layout/MainContainer';
import ContentBR from '@/components/custom/ContentBR';
import { toZonedTime } from 'date-fns-tz';

// Chart.js 모듈 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const DashBoardPage = () => {
  const { moveProductDetail } = useMove();
  const { isMobile, clampW } = useDevice();
  const chartRef = useRef(null);
  const { localeText } = useLocale();

  // 통계
  // 통계용 date
  const [dateStr, setDateStr] = useState('');
  const [salesStatisticsInfo, setSalesStatisticsInfo] = useState({
    dailyTotalSales: 0,
    ordersCount: 0,
    refundCount: 0,
  });
  const [dashboardDatas, setDashboardDatas] = useState([]);
  const [dataLabels, setDataLabels] = useState([]);

  // 상품 리스트 date
  const [isInitList, setIsInitList] = useState(true);
  const [listDateStr, setListDateStr] = useState('');
  const [currentPageList, setCurrentPageList] = useState(1);
  const [totalCountList, setTotalCountList] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);
  const [listProduct, setListProduct] = useState([]);

  const now = toZonedTime(new Date(), TIME_ZONE);

  // 통계용
  const sevenDaysBefore = new Date(now);
  sevenDaysBefore.setDate(now.getDate() - 7);
  const [startDate, setStartDate] = useState(sevenDaysBefore);
  const [endDate, setEndDate] = useState(now);

  // 리스트용
  const [listStartDate, setListStartDate] = useState(sevenDaysBefore);
  const [listEndDate, setListEndDate] = useState(now);

  const {
    isOpen: isOpenDatePicker,
    onOpen: onOpenDatePicker,
    onClose: onCloseDatePicker,
  } = useDisclosure();

  const {
    isOpen: isOpenListDatePicker,
    onOpen: onOpenListDatePicker,
    onClose: onCloseListDatePicker,
  } = useDisclosure();

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        // console.log(chartRef.current);
        // chartRef.current.chartInstance.resize();
      }
    };
    // 윈도우 크기 변화 시 차트 크기 업데이트
    window.addEventListener('resize', handleResize);
    // 클린업
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
      setListStartDate(dates.startDate);
      setListEndDate(dates.endDate);
      if (dates.startDate && dates.endDate) {
        onCloseListDatePicker();
      }
    } else {
      setStartDate(dates.startDate);
      setEndDate(dates.endDate);
      if (dates.startDate && dates.endDate) {
        onCloseDatePicker();
      }
    }
  };

  const initDate = (type) => {
    const initStart = sevenDaysBefore;
    const initEnd = now;
    if (type === 'LIST') {
      setListStartDate(initStart);
      setListEndDate(initEnd);
      onCloseListDatePicker();
    } else {
      setStartDate(initStart);
      setEndDate(initEnd);
      onCloseDatePicker();
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
      const dailyTotalSales = dailySalesStatistics.map((item) => {
        return item.dailyTotalSales;
      });
      const days = dailySalesStatistics.map((item) => {
        return item.date.slice(-2);
      });
      setDashboardDatas(dailyTotalSales);
      setDataLabels(days);
      setSalesStatisticsInfo(result.salesStatisticsInfo);
    } else {
      setDashboardDatas([]);
      setDataLabels([]);
      setSalesStatisticsInfo({
        dailyTotalSales: 0,
        ordersCount: 0,
        refundCount: 0,
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
          // 1 페이지
          handleGetListDashBoard();
        }
      }
    }
    lastScrollTop.current = scrollY;
  }, [loading]);

  useEffect(() => {
    // 이벤트 리스너 등록
    const handleScrollEvent = () => handleScroll();
    window.addEventListener('scroll', handleScrollEvent);

    // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScrollEvent);
    };
  }, [handleScroll]); // handleScroll 함수가 변경될 때마다 실행

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

        const newDatas = getNewDatas(
          resultRankDatas,
          listProduct,
          currentPageList,
          contentNum,
        );

        setListProduct((prev) => {
          if (isMobile()) {
            return [...prev, ...newDatas];
          } else {
            return [...resultRankDatas];
          }
        });

        setTotalCountList(result.totalCount);
      } else {
        if (isMobile()) {
          setListProduct((prev) => [...prev]); // 변화 없음
        } else {
          setListProduct([]);
        }
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

    // 최소값과 최대값 간의 간격을 4등분
    const interval = (max - min) / 4;

    // 4등분된 값 계산
    const intervals = [];
    for (let i = 0; i <= 4; i++) {
      intervals.push(min + interval * i);
    }

    // 특정 값이 어느 구간에 속하는지 찾기
    let rangeIndex = null;
    for (let i = 0; i < intervals.length - 1; i++) {
      if (value >= intervals[i] && value <= intervals[i + 1]) {
        rangeIndex = i + 1; // 구간 번호 (1부터 시작)
        break;
      }
    }

    if (rangeIndex === 1) return '#D9E7EC';
    if (rangeIndex === 2) return '#A7C3D2';
    if (rangeIndex === 3) return '#90AEC4';
    if (rangeIndex === 4) return '#556A7E';
  });

  // Bar 차트 데이터
  const data = {
    labels: dataLabels, // X축 레이블
    datasets: [
      {
        label: localeText(LANGUAGES.DASHBOARD.SALES_AMOUNT), // 데이터셋 레이블
        data: dashboardDatas, // 각 바의 값
        backgroundColor: (context) => {
          const value = context.dataset.data[context.dataIndex]; // 각 데이터의 값 가져오기
          return getColor(value);
        },
        borderColor: (context) => {
          const value = context.dataset.data[context.dataIndex]; // 각 데이터의 값 가져오기
          return getColor(value);
        },
        borderWidth: 1, // 바의 테두리 두께
        borderRadius: 50,
      },
    ],
  };
  // 차트 옵션 (선택 사항)
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // 범례 활성화
        // position: 'top', // 범례 위치 설정
      },
      tooltip: {
        // enabled: true, // 툴팁 활성화
        callbacks: {
          // 툴팁 내용 커스터마이징
          label: function (context) {
            // const xLabel = context.chart.data.labels[context.dataIndex];
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.raw; // 데이터 값 표시
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Y축 시작점을 0으로 설정
        grid: {
          display: true, // Y축 그리드 비활성화
        },
        ticks: {
          callback: (value) => {
            // 예를 들어, 값에 천 단위 구분기호를 추가할 수 있습니다
            return utils.parseAmount(value);
          },
          rotate: 0, // y축 라벨을 수평으로 설정
        },
      },
      x: {
        ticks: {
          rotate: 0, // X축 라벨을 수평으로 설정
          maxRotation: 0, // 라벨 회전 최대 각도를 0으로 설정
        },
        grid: {
          color: '#90AEC466',
          display: false, // x축 그리드 비활성화
        },
      },
    },
    animation: {
      duration: 1500, // 애니메이션 지속 시간 (1.5초)
      easing: 'linear',
      /*
      easeInQuad: 처음에 천천히 시작해서 점점 빨라짐.
      easeOutQuad: 처음에 빠르고 끝에 천천히 감속.
      easeInOutQuad: 처음과 끝이 부드럽게 시작하고 끝남.
      easeInSine, easeOutSine: 사인 곡선을 이용한 부드러운 시작/끝.
      linear: 일정한 속도로 애니메이션 진행.
      */
      delay: 500,
      onComplete: function () {
        // console.log('애니메이션 완료');
      },
    },
  };

  // 기존 데이터에서 새로운 데이터만 추출하는 함수
  const getNewDatas = (resultDatas, existingDatas) => {
    const existingProductIds = existingDatas.map((item) => item.productId);
    // 기존 데이터에서 이미 존재하는 데이터를 제외
    const newDatas = resultDatas.filter(
      (item) => !existingProductIds.includes(item.productId),
    );
    return newDatas;
  };

  // 랭킹을 부여하고 오름차순으로 정렬하는 함수
  const getRankedDatas = (datas, currentPage, contentNum) => {
    // count 기준으로 내림차순 정렬
    const sortedDatas = datas.sort((a, b) => b.salesCount - a.salesCount);

    // 페이지에 맞게 슬라이싱
    const startIndex = (currentPage - 1) * contentNum;
    const endIndex = startIndex + contentNum;
    const paginatedDatas = sortedDatas.slice(startIndex, endIndex);

    // 랭킹 부여
    const rankedDatas = paginatedDatas.map((item, index) => ({
      ...item,
      rank: startIndex + index + 1, // 랭킹은 페이지 번호를 기준으로 이어짐
    }));

    return rankedDatas;
  };

  const productCard = useCallback((item, index) => {
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

    return isMobile(true) ? (
      <Box
        key={index}
        w={'100%'}
        p="1rem"
        px={'0.75rem'}
        borderTop="1px solid #AEBDCA"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
        gap="1.25rem"
        overflowX={'hidden'}
        onClick={() => {
          moveProductDetail(productId);
        }}
      >
        <HStack spacing={'0.75rem'}>
          <Box w={'100%'}>
            <VStack w={'100%'} spacing={'0.75rem'} alignItems={'flex-start'}>
              <Box w={'100%'}>
                <HStack spacing={clampW(1, 3)}>
                  <Box w={clampW(5, 8)}>
                    <Center
                      w={clampW(3.75, 5)}
                      maxW={clampW(3.75, 5)}
                      h={clampW(3.75, 5)}
                    >
                      <ChakraImage
                        fallback={<DefaultSkeleton />}
                        w={'100%'}
                        h={'100%'}
                        objectFit={'cover'}
                        src={firstImageSrc}
                      />
                    </Center>
                  </Box>

                  <Box w={clampW(12, 80)}>
                    <VStack spacing={'0.5rem'}>
                      <Box w={'100%'}>
                        <Text
                          color={'#485766'}
                          fontSize={clampW(0.9357, 1)}
                          fontWeight={500}
                          whiteSpace={'nowrap'}
                          overflow={'hidden'}
                          textOverflow={'ellipsis'}
                        >
                          {name}
                        </Text>
                      </Box>
                      <Box w={'100%'}>
                        <Text
                          color={'#66809C'}
                          fontSize={clampW(0.75, 0.9375)}
                          fontWeight={400}
                          opacity={'0.7'}
                          whiteSpace={'nowrap'}
                          overflow={'hidden'}
                          textOverflow={'ellipsis'}
                        >
                          {handleCategory(
                            firstCategoryName,
                            secondCategoryName,
                            thirdCategoryName,
                          )}
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                </HStack>
              </Box>

              <Box>
                <HStack spacing={clampW(1, 3)}>
                  <Text
                    w={clampW(5, 8)}
                    textAlign={'left'}
                    color="#2A333C"
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={500}
                  >
                    {localeText(LANGUAGES.DASHBOARD.RANKING)}
                  </Text>
                  <Text
                    textAlign={'left'}
                    color="#2A333C"
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={500}
                  >
                    {rank}
                  </Text>
                </HStack>
              </Box>

              <Box>
                <HStack spacing={clampW(1, 3)}>
                  <Text
                    w={clampW(5, 8)}
                    textAlign={'left'}
                    color="#2A333C"
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={500}
                  >
                    {localeText(LANGUAGES.DASHBOARD.SALES_AMOUNT)}
                  </Text>
                  <Text
                    textAlign={'left'}
                    color="#485766"
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={400}
                  >
                    {utils.parseDallar(wp * salesCount)}
                  </Text>
                </HStack>
              </Box>

              <Box>
                <HStack spacing={clampW(1, 3)}>
                  <Text
                    w={clampW(5, 8)}
                    textAlign={'left'}
                    color="#2A333C"
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={500}
                  >
                    {localeText(LANGUAGES.DASHBOARD.SALES)}
                  </Text>
                  <Text
                    textAlign={'left'}
                    color="#485766"
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={400}
                  >
                    {utils.parseAmount(salesCount)}
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </HStack>
      </Box>
    ) : (
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

  return isMobile(true) ? (
    <MainContainer
      contentHeader={
        <Box w={'16rem'}>
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
      }
    >
      <VStack spacing={'2.5rem'} alignItems={'flex-start'} px={'1rem'}>
        <Box
          w={'100%'}
          p={'1.25rem'}
          bg={'#90aec412'}
          border={'1px solid #AEBDCA'}
          borderRadius={'0.25rem'}
          boxSizing={'border-box'}
        >
          <VStack spacing={'1.25rem'} alignItems={'flex-start'}>
            <Box w={'100%'}>
              <VStack spacing={'0.75rem'}>
                <Box w={'100%'}>
                  <HStack spacing={'0.25rem'}>
                    <Img src={MoneyBag.src} />
                    <Box>
                      <Text
                        fontSize={clampW(0.875, 0.9375)}
                        fontWeight={400}
                        color={'#66809C'}
                        lineHeight={'1.4rem'}
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
                    textAlign={'left'}
                  >
                    {utils.parseDallar(salesStatisticsInfo.dailyTotalSales)}
                  </Text>
                </Box>
              </VStack>
            </Box>

            <Box w={'100%'}>
              <VStack spacing={'0.75rem'}>
                <Box w={'100%'}>
                  <HStack spacing={'0.25rem'}>
                    <Img src={Doc.src} />
                    <Box>
                      <Text
                        fontSize={clampW(0.875, 0.9375)}
                        fontWeight={400}
                        color={'#66809C'}
                        lineHeight={'1.4rem'}
                      >
                        {localeText(LANGUAGES.DASHBOARD.NUMBER_ORDERS)}
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
                    textAlign={'left'}
                  >
                    {utils.parseAmount(salesStatisticsInfo.ordersCount)}
                  </Text>
                </Box>
              </VStack>
            </Box>

            <Box w={'100%'}>
              <VStack spacing={'0.75rem'}>
                <Box w={'100%'}>
                  <HStack spacing={'0.25rem'}>
                    <Img src={Refund.src} />
                    <Box>
                      <Text
                        fontSize={clampW(0.875, 0.9375)}
                        fontWeight={400}
                        color={'#66809C'}
                        lineHeight={'1.4rem'}
                      >
                        {localeText(LANGUAGES.DASHBOARD.NUMBER_REFUNDS)}
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
                    textAlign={'left'}
                  >
                    {utils.parseAmount(salesStatisticsInfo.refundCount)}
                  </Text>
                </Box>
              </VStack>
            </Box>
          </VStack>
        </Box>

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

        <Box w={'100%'}>
          <VStack spacing={'1.25rem'}>
            <Box w={'100%'}>
              <VStack alignItems={'flex-start'} spacing={'1.25rem'}>
                <Text
                  fontSize={'1.125rem'}
                  fontWeight={500}
                  color={'#485766'}
                  textAlign={'left'}
                >
                  {localeText(LANGUAGES.DASHBOARD.RANKING_PRODUCTS_SALE)}
                </Text>
                <Box w={'16rem'}>
                  <RangeDatePicker
                    dateStr={listDateStr}
                    isOpen={isOpenListDatePicker}
                    onOpen={onOpenListDatePicker}
                    onClose={onCloseListDatePicker}
                    onInitDate={() => {
                      initDate('LIST');
                    }}
                    start={listStartDate}
                    end={listEndDate}
                    handleOnChangeDate={(dates) => {
                      handleOnChangeDatePicker(dates, 'LIST');
                    }}
                  />
                </Box>
              </VStack>
            </Box>

            <Box
              w={'100%'}
              // overflowY={'auto'}
              // className="no-scroll"
              // boxSizing={'border-box'}
            >
              <VStack spacing={0}>
                {listProduct.map((item, index) => {
                  return productCard(item, index);
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
          </VStack>
        </Box>
      </VStack>

      <ContentBR h={'1.25rem'} />
    </MainContainer>
  ) : (
    <MainContainer
      contentHeader={
        <Box w={'16rem'}>
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
      }
    >
      <VStack spacing={'2.5rem'} alignItems={'flex-start'}>
        <Box
          w={'100%'}
          h={'7.5rem'}
          p={'1.25rem'}
          bg={'#90aec412'}
          border={'1px solid #AEBDCA'}
          borderRadius={'0.25rem'}
          boxSizing={'border-box'}
        >
          <HStack spacing={'1.25rem'}>
            <Box w={'33%'}>
              <VStack spacing={'0.75rem'}>
                <Box w={'100%'}>
                  <HStack spacing={'0.25rem'}>
                    <Img src={MoneyBag.src} />
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
                    {utils.parseDallar(salesStatisticsInfo.dailyTotalSales)}
                  </Text>
                </Box>
              </VStack>
            </Box>
            <Divider
              w={'1px'}
              h={'5rem'}
              boxSizing={'border-box'}
              borderRight={'1px solid #AEBDCA'}
            />
            <Box w={'33%'}>
              <VStack spacing={'0.75rem'}>
                <Box w={'100%'}>
                  <HStack spacing={'0.25rem'}>
                    <Img src={Doc.src} />
                    <Box>
                      <Text
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        color={'#66809C'}
                        lineHeight={'1.5rem'}
                      >
                        {localeText(LANGUAGES.DASHBOARD.NUMBER_ORDERS)}
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
              h={'5rem'}
              boxSizing={'border-box'}
              borderRight={'1px solid #AEBDCA'}
            />

            <Box w={'33%'}>
              <VStack spacing={'0.75rem'}>
                <Box w={'100%'}>
                  <HStack spacing={'0.25rem'}>
                    <Img src={Refund.src} />
                    <Box>
                      <Text
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        color={'#66809C'}
                        lineHeight={'1.5rem'}
                      >
                        {localeText(LANGUAGES.DASHBOARD.NUMBER_REFUNDS)}
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
                    {utils.parseAmount(salesStatisticsInfo.refundCount)}
                  </Text>
                </Box>
              </VStack>
            </Box>
          </HStack>
        </Box>

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
                <Box w={'16rem'}>
                  <RangeDatePicker
                    dateStr={listDateStr}
                    isOpen={isOpenListDatePicker}
                    onOpen={onOpenListDatePicker}
                    onClose={onCloseListDatePicker}
                    onInitDate={() => {
                      initDate('LIST');
                    }}
                    start={listStartDate}
                    end={listEndDate}
                    handleOnChangeDate={(dates) => {
                      handleOnChangeDatePicker(dates, 'LIST');
                    }}
                  />
                </Box>
              </HStack>
            </Box>

            <Box w={'100%'}>
              {/* Product Rows */}
              <VStack spacing={0}>
                {/* header */}
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
                {/* body */}
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
                          return productCard(item, index);
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
      </VStack>

      <ContentBR h={'1.25rem'} />
    </MainContainer>
  );
};

export default DashBoardPage;
