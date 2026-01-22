'use client';

import ContentHeader from '@/components/custom/header/ContentHeader';
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
  Button,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import IconRight from '@public/svgs/icon/right.svg';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import utils from '@/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import RangeDatePicker from '@/components/date/RangeDatePicker';
import { DefaultPaginate } from '@/components';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import SearchInput from '@/components/input/custom/SearchInput';
import StarRating from '@/components/common/StarRating';
import AnswerModal from '@/components/alert/custom/AnswerModal';
import { LIST_CONTENT_NUM, TIME_ZONE } from '@/constants/common';
import productReviewApi from '@/services/productReviewApi';
import { SUCCESS } from '@/constants/errorCode';
import useStatus from '@/hooks/useStatus';
import useMove from '@/hooks/useMove';
import useModal from '@/hooks/useModal';
import MainContainer from '@/components/layout/MainContainer';
import ContentBR from '@/components/custom/ContentBR';
import { clampW, isMobile } from '@/utils/deviceUtils';
import { toZonedTime } from 'date-fns-tz';

const ReviewsPage = () => {
  const { openModal } = useModal();

  const { moveProductDetail } = useMove();
  const { handleGetAnswerStatus } = useStatus();
  const router = useRouter();
  const { lang, localeText } = useLocale();

  const [dateStr, setDateStr] = useState('');

  const now = toZonedTime(new Date(), TIME_ZONE);
  const sevenDaysLater = new Date(now);
  sevenDaysLater.setDate(now.getDate() + 7);
  const [startDate, setStartDate] = useState(now);
  const [endDate, setEndDate] = useState(sevenDaysLater);

  const headerInfo = [
    {
      title: localeText(LANGUAGES.PRODUCTS.PRODUCT),
      width: '40%',
    },
    {
      title: localeText(LANGUAGES.REVIEWS.RATING),
      width: '8rem',
    },
    {
      title: localeText(LANGUAGES.REVIEWS.INQUIRER),
      width: '8rem',
    },
    {
      title: localeText(LANGUAGES.REVIEWS.STATUS),
      width: '8rem',
    },
    {
      title: localeText(LANGUAGES.REVIEWS.CONTACT_LOG),
      width: '8rem',
    },
    {
      title: '',
      width: '8rem',
    },
  ];

  const {
    isOpen: isOpenAnswer,
    onOpen: onOpenAnswer,
    onClose: onCloseAnswer,
  } = useDisclosure();

  const {
    isOpen: isOpenDatePicker,
    onOpen: onOpenDatePicker,
    onClose: onCloseDatePicker,
  } = useDisclosure();

  const initDate = () => {
    setStartDate(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - 7,
      ),
    );
    setEndDate(new Date());
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
    }
  }, [startDate, endDate]);

  const handleOnChangeDatePicker = async (dates) => {
    setStartDate(dates.startDate);
    setEndDate(dates.endDate);
    if (dates.startDate && dates.endDate) {
      onCloseDatePicker();
    }
  };

  const key = 'productReviewId';
  const [initPage, setInitPage] = useState(true);
  const [status, setStatus] = useState(0);
  const [searchType, setSearchType] = useState(1);
  const [searchBy, setSearchBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);
  const [productReviewCountByStatus, setProductReviewCountByStatus] = useState({
    totalProductReviewCount: 0,
    readyProductReviewCount: 0,
    confirmProductReviewCount: 0,
  });
  const [listReview, setListReview] = useState([]);

  useEffect(() => {
    if (typeof startDate === 'object' && typeof endDate === 'object') {
      handleGetListReviewAgent();
    }
  }, [startDate, endDate, status]);

  useEffect(() => {
    if (!initPage) {
      handleGetListReview();
    }
  }, [currentPage, contentNum]);

  const handleGetListReviewAgent = () => {
    if (currentPage === 1) {
      handleGetListReview();
    } else {
      setCurrentPage(1);
    }
  };

  const [loading, setLoading] = useState(false);
  const lastScrollTop = useRef(0);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollY > lastScrollTop.current) {
      if (scrollY + windowHeight >= documentHeight && !loading) {
        if (currentPage !== 1) {
          if (listReview.length === contentNum) {
            setCurrentPage((prevPage) => prevPage + 1);
          } else {
            handleGetListReview();
          }
        } else {
          // 1 페이지
          handleGetListReview();
        }
      }
    }
    lastScrollTop.current = scrollY;
  }, [loading]);

  useEffect(() => {
    if (isMobile(true)) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const getNewDatas = (resultDatas, existingDatas) => {
    const existingProductIds = existingDatas.map((item) => item[key]);
    const newDatas = resultDatas.filter(
      (item) => !existingProductIds.includes(item[key]),
    );
    return newDatas;
  };
  const handleGetListReview = async () => {
    if (loading) return;
    setLoading(true);

    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
    };
    if (status !== 0) {
      param.status = status;
    }
    if (searchBy) {
      param.searchFlag = searchType;
      param.searchBy = searchBy;
    }

    try {
      const result = await productReviewApi.getListProductReview(param);

      if (result?.errorCode === SUCCESS) {
        if (currentPage === 1) {
          setProductReviewCountByStatus(result.productReviewCountByStatus);
        }
        if (isMobile(true)) {
          setListReview((prev) => {
            const newDatas = getNewDatas(
              result.datas,
              listReview,
              currentPage,
              contentNum,
            );
            return [...prev, ...newDatas];
          });
        } else {
          setListReview(result.datas);
        }
        setTotalCount(result.totalCount);
      } else {
        setProductReviewCountByStatus({
          totalProductReviewCount: 0,
          readyProductReviewCount: 0,
          confirmProductReviewCount: 0,
        });
        if (isMobile()) {
          setListReview((prev) => [...prev, ...[]]);
        } else {
          setListReview([]);
        }
        setTotalCount(result.totalCount);
      }
    } finally {
      setInitPage(false);
      setLoading(false);
    }
  };

  const handlePatchProductReview = async (item, answer) => {
    const param = {
      productReviewId: item.productReviewId,
      answer: answer,
    };
    const result = await productReviewApi.patchProductReview(param);

    if (result?.errorCode === SUCCESS) {
      setTimeout(() => {
        openModal({
          text: result.message,
          onAgree: () => {
            onCloseAnswer();
            handleGetListReview();
          },
        });
      });
    }
  };

  const reviewsCard = useCallback((item, index) => {
    const name = item?.name || '';
    const content = item?.content || '';
    const status = item?.status || '';
    const productReviewId = item?.productReviewId || '';
    const answer = item?.answer || '';
    const productId = item?.productId || '';
    const createdAt = item?.createdAt || '';
    const firstCategoryName = item?.firstCategoryName || '';
    const secondCategoryName = item?.secondCategoryName || '';
    const thirdCategoryName = item?.thirdCategoryName || '';
    const buyerName = item?.buyerName || '';
    const buyerId = item?.buyerId || '';
    const rating = item?.rating || '';
    const firstImageS3Url = item?.firstImageS3Url || '';
    const secondImageS3Url = item?.secondImageS3Url || '';
    const thirdImageS3Url = item?.thirdImageS3Url || '';
    const productImageList = item?.productImageList || [];
    let firstImageSrc = null;
    if (productImageList.length > 0) {
      firstImageSrc = productImageList[0].imageS3Url;
    }

    const handleOnOpenAnswer = (item) => {
      onOpenAnswer();
    };

    return isMobile(true) ? (
      <Box
        key={index}
        w={'100%'}
        borderTop={'1px solid #AEBDCA'}
        boxSizing={'border-box'}
        pt={'1.25rem'}
      >
        <VStack spacing={'0.75rem'}>
          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(5, 10)}>
                <Center w={clampW(3.75, 5)} h={clampW(3.75, 5)}>
                  <ChakraImage
                    fallback={<DefaultSkeleton />}
                    w={'100%'}
                    h={'100%'}
                    objectFit={'cover'}
                    src={firstImageSrc}
                  />
                </Center>
              </Box>
              <Box>
                <VStack spacing={'0.5rem'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={clampW(0.75, 0.825)}
                      fontWeight={500}
                      lineHeight={'1.5rem'}
                    >
                      {name}
                    </Text>
                  </Box>
                  <Box>
                    <HStack spacing={'0.25rem'} alignItems={'center'}>
                      <Text
                        color={'#66809C'}
                        fontSize={clampW(0.75, 0.825)}
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
                            fontSize={clampW(0.75, 0.825)}
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
                            fontSize={clampW(0.75, 0.825)}
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

          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(5, 10)}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.REVIEWS.RATING)}
                </Text>
              </Box>
              <Box>
                <StarRating initialRating={rating} w={'1.5rem'} h={'1.5rem'} />
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(5, 10)}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.REVIEWS.INQUIRER)}
                </Text>
              </Box>
              <Box alignContent={'center'}>
                <VStack spacing={0}>
                  <Box w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={clampW(0.75, 0.825)}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                      textAlign={'center'}
                      whiteSpace={'pre-wrap'}
                    >
                      {buyerName}
                    </Text>
                  </Box>
                  {buyerId && (
                    <Box w={'100%'}>
                      <Text
                        color={'#485766'}
                        fontSize={clampW(0.75, 0.825)}
                        fontWeight={400}
                        lineHeight={'1.5rem'}
                        textAlign={'center'}
                      >
                        {`(${buyerId})`}
                      </Text>
                    </Box>
                  )}
                </VStack>
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(5, 10)}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.REVIEWS.STATUS)}
                </Text>
              </Box>
              <Box>
                <Text
                  textAlign={'center'}
                  color={status === 1 ? '#940808' : '#485766'}
                  fontSize={clampW(0.75, 0.825)}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {handleGetAnswerStatus(status)}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={'1rem'}>
              <Box w={clampW(5, 10)}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.REVIEWS.CONTACT_LOG)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#66809C'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={400}
                  lineHeight={'1.4rem'}
                >
                  {utils.parseDateByCountryCode(createdAt, lang)}
                </Text>
              </Box>
            </HStack>
          </Box>

          {status === 1 && (
            <Button
              onClick={() => {
                handleOnOpenAnswer(item);
              }}
              px={'1.25rem'}
              py={'0.63rem'}
              borderRadius={'0.25rem'}
              border={'1px solid #73829D'}
              boxSizing={'border-box'}
              bg={'transparent'}
              h={'100%'}
              w={'100%'}
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
                {localeText(LANGUAGES.COMMON.ANSWER)}
              </Text>
            </Button>
          )}

          <Box w={'100%'} px={'1.25rem'} bg={'#90aec412'}>
            <VStack spacing={0}>
              <Box w={'100%'} py={'1.25rem'}>
                <VStack spacing={'1.25rem'}>
                  <Box>
                    <Text
                      color={'#7895B2'}
                      fontSize={clampW(0.875, 0.9375)}
                      fontWeight={500}
                      lineHeight={'1.5'}
                      whiteSpace={'pre-wrap'}
                    >
                      {content}
                    </Text>
                  </Box>
                  <Box>
                    <HStack spacing={'1.25rem'}>
                      {firstImageS3Url && (
                        <Center w={'5rem'} minW={'5rem'} h={'5rem'}>
                          <ChakraImage
                            fallback={<DefaultSkeleton />}
                            w={'100%'}
                            h={'100%'}
                            objectFit={'cover'}
                            src={firstImageS3Url}
                          />
                        </Center>
                      )}
                      {secondImageS3Url && (
                        <Center w={'5rem'} minW={'5rem'} h={'5rem'}>
                          <ChakraImage
                            fallback={<DefaultSkeleton />}
                            w={'100%'}
                            h={'100%'}
                            objectFit={'cover'}
                            src={secondImageS3Url}
                          />
                        </Center>
                      )}
                      {thirdImageS3Url && (
                        <Center w={'5rem'} minW={'5rem'} h={'5rem'}>
                          <ChakraImage
                            fallback={<DefaultSkeleton />}
                            w={'100%'}
                            h={'100%'}
                            objectFit={'cover'}
                            src={thirdImageS3Url}
                          />
                        </Center>
                      )}
                    </HStack>
                  </Box>
                </VStack>
              </Box>
              {status === 2 && (
                <>
                  <Divider w={'100%'} borderBottom={'1px solid #AEBDCA'} />

                  <Box w={'100%'} py={'1.25rem'}>
                    <VStack spacing={'0.25rem'}>
                      <Box w={'100%'}>
                        <Text
                          color={'#485766'}
                          fontSize={'1rem'}
                          fontWeight={500}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.COMMON.ANSWER)}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#7895B2'}
                          fontSize={clampW(0.875, 0.9375)}
                          fontWeight={500}
                          lineHeight={'1.5'}
                          whiteSpace={'pre-wrap'}
                        >
                          {answer}
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                </>
              )}
            </VStack>
          </Box>
        </VStack>
      </Box>
    ) : (
      <Box
        key={index}
        w={'100%'}
        h={status === 1 ? '14rem' : null}
        borderBottom={'1px solid #AEBDCA'}
        boxSizing={'border-box'}
      >
        <VStack spacing={0}>
          <Box w={'100%'} px={'1rem'} py={'0.75rem'}>
            <HStack spacing={'0.75rem'} justifyContent={'space-around'}>
              <Box
                w={headerInfo[0].width}
                onClick={() => {
                  moveProductDetail(productId);
                }}
                cursor={'pointer'}
              >
                <HStack spacing={'0.75rem'}>
                  <Center w={'5rem'} minW={'5rem'} h={'5rem'}>
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
              <Box w={headerInfo[1].width}>
                <StarRating initialRating={rating} w={'1.5rem'} h={'1.5rem'} />
              </Box>
              <Box w={headerInfo[2].width}>
                <Box alignContent={'center'}>
                  <VStack spacing={0}>
                    <Box w={'100%'}>
                      <Text
                        color={'#485766'}
                        fontSize={'0.9357rem'}
                        fontWeight={400}
                        lineHeight={'1.5rem'}
                        textAlign={'center'}
                        whiteSpace={'pre-wrap'}
                      >
                        {buyerName}
                      </Text>
                    </Box>
                    {buyerId && (
                      <Box w={'100%'}>
                        <Text
                          color={'#485766'}
                          fontSize={'0.9357rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                          textAlign={'center'}
                        >
                          {`(${buyerId})`}
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </Box>
              </Box>
              <Box w={headerInfo[3].width}>
                <Text
                  textAlign={'center'}
                  color={status === 1 ? '#940808' : '#485766'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {handleGetAnswerStatus(status)}
                </Text>
              </Box>
              <Box w={headerInfo[4].width}>
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
              <Box w={headerInfo[5].width} h={'3rem'}>
                {isOpenAnswer && (
                  <AnswerModal
                    selectedItem={item}
                    isOpen={isOpenAnswer}
                    onClose={onCloseAnswer}
                    callBack={(item, answer) => {
                      handlePatchProductReview(item, answer);
                    }}
                  />
                )}
                {item.status === 1 && (
                  <Button
                    onClick={() => {
                      handleOnOpenAnswer(item);
                    }}
                    px={'1.25rem'}
                    py={'0.63rem'}
                    borderRadius={'0.25rem'}
                    border={'1px solid #73829D'}
                    boxSizing={'border-box'}
                    bg={'transparent'}
                    h={'100%'}
                    w={'100%'}
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
                      {localeText(LANGUAGES.COMMON.ANSWER)}
                    </Text>
                  </Button>
                )}
              </Box>
            </HStack>
          </Box>
          <Box w={'100%'} px={'1.25rem'} bg={'#90aec412'}>
            <VStack spacing={0}>
              <Box w={'100%'} h={'7.5rem'} py={'1.25rem'}>
                <HStack spacing={'1.25rem'}>
                  <Box>
                    <Text
                      color={'#485766'}
                      fontSize={'0.9375rem'}
                      fontWeight={500}
                      lineHeight={'1.5'}
                      whiteSpace={'pre-wrap'}
                    >
                      {content}
                    </Text>
                  </Box>
                  <Box>
                    <HStack spacing={'1.25rem'}>
                      {firstImageS3Url && (
                        <Center w={'5rem'} minW={'5rem'} h={'5rem'}>
                          <ChakraImage
                            fallback={<DefaultSkeleton />}
                            w={'100%'}
                            h={'100%'}
                            objectFit={'cover'}
                            src={firstImageS3Url}
                          />
                        </Center>
                      )}
                      {secondImageS3Url && (
                        <Center w={'5rem'} minW={'5rem'} h={'5rem'}>
                          <ChakraImage
                            fallback={<DefaultSkeleton />}
                            w={'100%'}
                            h={'100%'}
                            objectFit={'cover'}
                            src={secondImageS3Url}
                          />
                        </Center>
                      )}
                      {thirdImageS3Url && (
                        <Center w={'5rem'} minW={'5rem'} h={'5rem'}>
                          <ChakraImage
                            fallback={<DefaultSkeleton />}
                            w={'100%'}
                            h={'100%'}
                            objectFit={'cover'}
                            src={thirdImageS3Url}
                          />
                        </Center>
                      )}
                    </HStack>
                  </Box>
                </HStack>
              </Box>
              {status === 2 && (
                <>
                  <Divider w={'100%'} borderBottom={'1px solid #AEBDCA'} />

                  <Box w={'100%'} py={'1.25rem'}>
                    <HStack spacing={'1.25rem'}>
                      <Box>
                        <Text
                          color={'#485766'}
                          fontSize={'1rem'}
                          fontWeight={500}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.COMMON.ANSWER)}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#485766'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5'}
                          whiteSpace={'pre-wrap'}
                        >
                          {answer}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                </>
              )}
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  });

  return isMobile(true) ? (
    <MainContainer>
      <Box w={'100%'} px={clampW(1, 5)}>
        <Box>
          <HStack spacing={'2.5rem'}>
            <Box
              py={'0.5rem'}
              cursor={'pointer'}
              onClick={() => {
                setStatus(0);
              }}
            >
              <Text
                textAlign={'center'}
                color={status === 0 ? '#66809C' : '#A7C3D2'}
                fontSize={'0.9375rem'}
                fontWeight={status === 0 ? 600 : 400}
                lineHeight={'1.5rem'}
              >
                {`${localeText(LANGUAGES.PRODUCTS.ALL)} (${utils.parseAmount(productReviewCountByStatus.totalProductReviewCount)})`}
              </Text>
            </Box>
            <Box
              py={'0.5rem'}
              cursor={'pointer'}
              onClick={() => {
                setStatus(1);
              }}
            >
              <Text
                textAlign={'center'}
                color={status === 1 ? '#66809C' : '#A7C3D2'}
                fontSize={'0.9375rem'}
                fontWeight={status === 1 ? 600 : 400}
                lineHeight={'1.5rem'}
              >
                {`${localeText(LANGUAGES.REVIEWS.WAIT_ANSWER)} (${utils.parseAmount(productReviewCountByStatus.readyProductReviewCount)})`}
              </Text>
            </Box>
            <Box
              py={'0.5rem'}
              cursor={'pointer'}
              onClick={() => {
                setStatus(2);
              }}
            >
              <Text
                textAlign={'center'}
                color={status === 2 ? '#66809C' : '#A7C3D2'}
                fontSize={'0.9375rem'}
                fontWeight={status === 2 ? 600 : 400}
                lineHeight={'1.5rem'}
              >
                {`${localeText(LANGUAGES.REVIEWS.ANSWERED)} (${utils.parseAmount(productReviewCountByStatus.confirmProductReviewCount)})`}
              </Text>
            </Box>
          </HStack>
        </Box>

        <ContentBR h={'0.75rem'} />

        {/*
        <Box w={'100%'}>
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
*/}

        <ContentBR h={'0.75rem'} />

        <Box w={'100%'} h={'3rem'}>
          <Select
            value={searchType}
            onChange={(e) => {
              setSearchType(Number(e.target.value));
            }}
            py={'0.75rem'}
            pl={'1rem'}
            p={0}
            w={'100%'}
            h={'3rem'}
            bg={'#FFF'}
            borderRadius={'0.25rem'}
            border={'1px solid #9CADBE'}
          >
            <option value={1}>{localeText(LANGUAGES.PRODUCTS.PRODUCT)}</option>
            <option value={2}>{localeText(LANGUAGES.REVIEWS.INQUIRER)}</option>
            <option value={3}>{localeText(LANGUAGES.COMMON.CONTENT)}</option>
          </Select>
        </Box>

        <ContentBR h={'0.75rem'} />

        <Box w={'100%'} h={'3rem'}>
          <SearchInput
            value={searchBy}
            onChange={(e) => {
              setSearchBy(e.target.value);
            }}
            onClick={() => {
              handleGetListReviewAgent();
            }}
            placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
            placeholderFontColor={'#A7C3D2'}
          />
        </Box>

        <ContentBR h={'0.75rem'} />

        <Box w={'100%'}>
          <VStack spacing={'1.25rem'}>
            {listReview.map((item, index) => {
              return reviewsCard(item, index);
            })}
            {listReview.length === 0 && (
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
        <ContentBR h={'1.25rem'} />
      </Box>
    </MainContainer>
  ) : (
    <MainContainer>
      <Box w={'100%'}>
        <VStack spacing={'2.5rem'} alignItems={'flex-start'}>
          <Box w={'100%'}>
            <VStack spacing={'1.25rem'}>
              <Box w={'100%'}>
                <HStack justifyContent={'space-between'}>
                  <Box>
                    <HStack spacing={'2.5rem'}>
                      <Box
                        py={'0.5rem'}
                        cursor={'pointer'}
                        onClick={() => {
                          setStatus(0);
                        }}
                      >
                        <Text
                          textAlign={'center'}
                          color={status === 0 ? '#66809C' : '#A7C3D2'}
                          fontSize={'0.9375rem'}
                          fontWeight={status === 0 ? 600 : 400}
                          lineHeight={'1.5rem'}
                        >
                          {`${localeText(LANGUAGES.PRODUCTS.ALL)} (${utils.parseAmount(productReviewCountByStatus.totalProductReviewCount)})`}
                        </Text>
                      </Box>
                      <Box
                        py={'0.5rem'}
                        cursor={'pointer'}
                        onClick={() => {
                          setStatus(1);
                        }}
                      >
                        <Text
                          textAlign={'center'}
                          color={status === 1 ? '#66809C' : '#A7C3D2'}
                          fontSize={'0.9375rem'}
                          fontWeight={status === 1 ? 600 : 400}
                          lineHeight={'1.5rem'}
                        >
                          {`${localeText(LANGUAGES.REVIEWS.WAIT_ANSWER)} (${utils.parseAmount(productReviewCountByStatus.readyProductReviewCount)})`}
                        </Text>
                      </Box>
                      <Box
                        py={'0.5rem'}
                        cursor={'pointer'}
                        onClick={() => {
                          setStatus(2);
                        }}
                      >
                        <Text
                          textAlign={'center'}
                          color={status === 2 ? '#66809C' : '#A7C3D2'}
                          fontSize={'0.9375rem'}
                          fontWeight={status === 2 ? 600 : 400}
                          lineHeight={'1.5rem'}
                        >
                          {`${localeText(LANGUAGES.REVIEWS.ANSWERED)} (${utils.parseAmount(productReviewCountByStatus.confirmProductReviewCount)})`}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box>
                    <HStack spacing={'0.63rem'}>
                      <Box w={'8.875rem'} h={'3rem'}>
                        <Select
                          value={searchType}
                          onChange={(e) => {
                            setSearchType(Number(e.target.value));
                          }}
                          py={'0.75rem'}
                          pl={'1rem'}
                          p={0}
                          w={'100%'}
                          h={'3rem'}
                          bg={'#FFF'}
                          borderRadius={'0.25rem'}
                          border={'1px solid #9CADBE'}
                        >
                          <option value={1}>
                            {localeText(LANGUAGES.PRODUCTS.PRODUCT)}
                          </option>
                          <option value={2}>
                            {localeText(LANGUAGES.REVIEWS.INQUIRER)}
                          </option>
                          <option value={3}>
                            {localeText(LANGUAGES.COMMON.CONTENT)}
                          </option>
                        </Select>
                      </Box>
                      <Box minW={'24.375rem'} h={'3rem'}>
                        <SearchInput
                          value={searchBy}
                          onChange={(e) => {
                            setSearchBy(e.target.value);
                          }}
                          onClick={() => {
                            handleGetListReviewAgent();
                          }}
                          placeholder={localeText(
                            LANGUAGES.COMMON.PH_SEARCH_TERM,
                          )}
                          placeholderFontColor={'#A7C3D2'}
                        />
                      </Box>
                    </HStack>
                  </Box>
                </HStack>
              </Box>
              {/*
              <Box w={'100%'}>
                <HStack justifyContent={'space-between'} alignItems={'center'}>
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
                  <Box>
                    <HStack spacing={'0.63rem'}>
                      <Box w={'8.875rem'} h={'3rem'}>
                        <Select
                          value={searchType}
                          onChange={(e) => {
                            setSearchType(Number(e.target.value));
                          }}
                          py={'0.75rem'}
                          pl={'1rem'}
                          p={0}
                          w={'100%'}
                          h={'3rem'}
                          bg={'#FFF'}
                          borderRadius={'0.25rem'}
                          border={'1px solid #9CADBE'}
                        >
                          <option value={1}>
                            {localeText(LANGUAGES.PRODUCTS.PRODUCT)}
                          </option>
                          <option value={2}>
                            {localeText(LANGUAGES.REVIEWS.INQUIRER)}
                          </option>
                          <option value={3}>
                            {localeText(LANGUAGES.COMMON.CONTENT)}
                          </option>
                        </Select>
                      </Box>
                      <Box minW={'24.375rem'} h={'3rem'}>
                        <SearchInput
                          value={searchBy}
                          onChange={(e) => {
                            setSearchBy(e.target.value);
                          }}
                          onClick={() => {
                            handleGetListReviewAgent();
                          }}
                          placeholder={localeText(
                            LANGUAGES.COMMON.PH_SEARCH_TERM,
                          )}
                          placeholderFontColor={'#A7C3D2'}
                        />
                      </Box>
                    </HStack>
                  </Box>
                </HStack>
              </Box>
              */}
              <Box w={'100%'} borderBottom={'1px solid #73829D'}>
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
                    <HStack spacing={'0.75rem'} justifyContent={'space-around'}>
                      {headerInfo.map((item, index) => {
                        return (
                          <Box key={index} w={item.width}>
                            <Text
                              textAlign={'center'}
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
                  <Box
                    w={'100%'}
                    h={'calc(14rem * 2)'}
                    overflowY={'auto'}
                    className={'no-scroll'}
                  >
                    <VStack spacing={'0.75rem'}>
                      <Box w={'100%'}>
                        <VStack spacing={0}>
                          {listReview.map((item, index) => {
                            return reviewsCard(item, index);
                          })}
                          {listReview.length === 0 && (
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
        <ContentBR h={'1.25rem'} />
      </Box>
    </MainContainer>
  );
};

export default ReviewsPage;
