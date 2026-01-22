'use client';

import {
  Box,
  Center,
  HStack,
  Img,
  Text,
  Image as ChakraImage,
  useDisclosure,
  VStack,
  Select,
  Button,
  Tooltip,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import IconRight from '@public/svgs/icon/right.svg';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import utils from '@/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DefaultPaginate } from '@/components';
import SearchInput from '@/components/input/custom/SearchInput';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import AnswerModal from '@/components/alert/custom/AnswerModal';
import { LIST_CONTENT_NUM } from '@/constants/common';
import productQuestionApi from '@/services/productQuestionApi';
import { SUCCESS } from '@/constants/errorCode';
import useStatus from '@/hooks/useStatus';
import useMove from '@/hooks/useMove';
import useModal from '@/hooks/useModal';
import MainContainer from '@/components/layout/MainContainer';
import ContentBR from '@/components/custom/ContentBR';
import useDevice from '@/hooks/useDevice';
import IconEdit from '@public/svgs/icon/lounge-pen.svg';
import AnswerDetailModal from '@/components/alert/custom/AnswerDetailModal';

const InquiriesPage = () => {
  const {
    isOpen: isOpenAnswer,
    onOpen: onOpenAnswer,
    onClose: onCloseAnswer,
  } = useDisclosure();
  const {
    isOpen: isOpenDetail,
    onOpen: onOpenDetail,
    onClose: onCloseDetail,
  } = useDisclosure();

  const { isMobile, clampW } = useDevice();
  const { moveProductDetail } = useMove();
  const { openModal } = useModal();
  const { handleGetAnswerStatus } = useStatus();
  const { lang, localeText } = useLocale();

  const [selectedItem, setSelectedItem] = useState();

  const key = 'productQuestionId';
  const [initPage, setInitPage] = useState(true);
  const [status, setStatus] = useState(0);
  const [searchBy, setSearchBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);
  const [productQuestionCountByStatus, setProductQuestionCountByStatus] =
    useState({
      totalProductQuestionCount: 0,
      readyProductQuestionCount: 0,
      confirmProductQuestionCount: 0,
    });
  const [listInquiries, setListInquiries] = useState([]);
  const [isModify, setIsModify] = useState(false);

  useEffect(() => {
    handleGetListInquireisAgent();
  }, [status]);

  useEffect(() => {
    if (!initPage) {
      setListInquiries([]);
      handleGetListInquireis();
    }
  }, [currentPage, contentNum]);

  const [loading, setLoading] = useState(false);
  const lastScrollTop = useRef(0);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollY > lastScrollTop.current) {
      if (scrollY + windowHeight >= documentHeight && !loading) {
        if (currentPage !== 1) {
          if (listInquiries.length === contentNum) {
            setCurrentPage((prevPage) => prevPage + 1);
          } else {
            handleGetListInquireis();
          }
        } else {
          // 1 페이지
          handleGetListInquireis();
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

  const handleGetListInquireisAgent = () => {
    setListInquiries([]);
    setTimeout(() => {
      if (currentPage === 1) {
        handleGetListInquireis();
      } else {
        setCurrentPage(1);
      }
    }, 100);
  };

  const getNewDatas = (resultDatas, existingDatas) => {
    const existingProductIds = existingDatas.map((item) => item[key]);
    const newDatas = resultDatas.filter(
      (item) => !existingProductIds.includes(item[key]),
    );
    return newDatas;
  };
  const handleGetListInquireis = async (isInit = false) => {
    if (loading) return;
    setLoading(true);

    const param = {
      pageNum: currentPage,
      contentNum: Number(contentNum),
    };
    if (status !== 0) {
      param.status = status;
    }
    if (searchBy) {
      param.searchBy = searchBy;
    }

    const result = await productQuestionApi.getListProductQuestion(param);

    try {
      if (result?.errorCode === SUCCESS) {
        if (currentPage === 1) {
          setProductQuestionCountByStatus(result.productQuestionCountByStatus);
        }
        if (isInit) {
          setListInquiries(result.datas);
        } else if (isMobile(true)) {
          setListInquiries((prev) => {
            const newDatas = getNewDatas(
              result.datas,
              listInquiries,
              currentPage,
              contentNum,
            );
            return [...prev, ...newDatas];
          });
        } else {
          setListInquiries(result.datas);
        }
        setTotalCount(result.totalCount);
      } else {
        if (currentPage === 1) {
          setProductQuestionCountByStatus({
            totalProductQuestionCount: 0,
            readyProductQuestionCount: 0,
            confirmProductQuestionCount: 0,
          });
        }
        if (isMobile(true)) {
          setListInquiries((prev) => [...prev, ...[]]);
        } else {
          setListInquiries([]);
        }
        setTotalCount(result.totalCount);
      }
    } finally {
      setLoading(false);
      setInitPage(false);
    }
  };

  const handlePatchProductInquireis = async (item, answer, isInit = false) => {
    const param = {
      productQuestionId: item.productQuestionId,
      answer: answer,
    };
    const result = await productQuestionApi.patchProductQuestion(param);
    if (result?.errorCode === SUCCESS) {
      setTimeout(() => {
        openModal({
          text: result.message,
          onAgree: () => {
            onCloseAnswer();
            setSelectedItem(null);
            handleGetListInquireis(isInit);
          },
        });
      });
    }
    setIsModify(false);
  };

  const inquiriesCard = useCallback((item, index) => {
    const productQuestionId = item?.productQuestionId || 1;
    const name = item?.name || '';
    const status = item?.status;
    const productId = item?.productId || 1;
    const firstCategoryName = item?.firstCategoryName || '';
    const secondCategoryName = item?.secondCategoryName || '';
    const thirdCategoryName = item?.thirdCategoryName || '';
    const question = item?.question || '';
    const buyerName = item?.buyerName || '';
    const buyerId = item?.buyerId || '';
    const answer = item?.answer || '';
    const createdAt = item?.createdAt || '2025-03-13T16:58:38.534Z';

    const productImageList = item?.productImageList || [];
    let firstImageSrc = null;
    if (productImageList.length > 0) {
      firstImageSrc = productImageList[0].imageS3Url;
    }

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
                  {localeText(LANGUAGES.INQUIRIES.INQUIRER)}
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
                  {localeText(LANGUAGES.INQUIRIES.INQUIRIES)}
                </Text>
              </Box>
              <Box
                cursor={'pointer'}
                onClick={() => {
                  setSelectedItem(item);
                  setTimeout(() => {
                    onOpenDetail();
                  });
                }}
              >
                <Text
                  color={'#66809C'}
                  fontSize={clampW(0.75, 0.875)}
                  fontWeight={400}
                  lineHeight={'1.4rem'}
                  whiteSpace={'pre-wrap'}
                >
                  {question}
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
                  {localeText(LANGUAGES.INQUIRIES.STATUS)}
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
                  {localeText(LANGUAGES.INQUIRIES.CONTACT_LOG)}
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
                setSelectedItem(item);
                setTimeout(() => {
                  onOpenAnswer();
                });
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

          {status === 2 && (
            <Box w={'100%'} p={'1.25rem'} bg={'#90aec412'}>
              <HStack
                w="100%"
                spacing={'1.25rem'}
                justifyContent={'space-between'}
              >
                <HStack>
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
                <Center
                  cursor={'pointer'}
                  w={clampW(1.875, 2)}
                  minW={clampW(1.875, 2)}
                  h={clampW(1.875, 2)}
                  onClick={() => {
                    // moveBannerModify();
                    setIsModify(true);
                    setSelectedItem(item);
                    setTimeout(() => {
                      onOpenAnswer();
                    });
                  }}
                >
                  <Img src={IconEdit.src} />
                </Center>
              </HStack>
            </Box>
          )}
        </VStack>
      </Box>
    ) : (
      <Box
        key={index}
        w={'100%'}
        h={status === 1 ? '6.5rem' : null}
        borderBottom={'1px solid #AEBDCA'}
        boxSizing={'border-box'}
      >
        <VStack spacing={0}>
          <Box w={'100%'} px={'1rem'} py={'0.75rem'}>
            <HStack spacing={'0.75rem'}>
              <Box
                w={'17rem'}
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
              <Box w={'12.5rem'}>
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
              <Box
                w={'13.75rem'}
                cursor={'pointer'}
                onClick={() => {
                  setSelectedItem(item);
                  setTimeout(() => {
                    onOpenDetail();
                  });
                }}
              >
                <Tooltip label={question} whiteSpace={'pre-wrap'} size={'xl'}>
                  <Text
                    w={'100%'}
                    textAlign={'center'}
                    color={'#485766'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                    whiteSpace={'nowrap'}
                    overflow={'hidden'}
                    textOverflow={'ellipsis'}
                  >
                    {question}
                  </Text>
                </Tooltip>
              </Box>
              <Box w={'8.375rem'}>
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
              <Box w={'8.375rem'}>
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
              <Box w={'7rem'} h={'3rem'}>
                {status === 1 && (
                  <Button
                    onClick={() => {
                      setIsModify(false);
                      setSelectedItem(item);
                      setTimeout(() => {
                        onOpenAnswer();
                      });
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
          {status === 2 && (
            <Box w={'100%'} p={'1.25rem'} bg={'#90aec412'}>
              <HStack
                w="100%"
                spacing={'1.25rem'}
                justifyContent={'space-between'}
              >
                <HStack>
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
                <Center
                  cursor={'pointer'}
                  w={clampW(1.875, 2)}
                  minW={clampW(1.875, 2)}
                  h={clampW(1.875, 2)}
                  onClick={() => {
                    // moveBannerModify();
                    setIsModify(true);
                    setSelectedItem(item);
                    setTimeout(() => {
                      onOpenAnswer();
                    });
                  }}
                >
                  <Img src={IconEdit.src} />
                </Center>
              </HStack>
            </Box>
          )}
        </VStack>
      </Box>
    );
  });

  return isMobile(true) ? (
    <MainContainer>
      <Box w={'100%'} px={clampW(1, 5)}>
        <Box>
          <Wrap spacingX={'2.5rem'}>
            <WrapItem>
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
                  {`${localeText(LANGUAGES.PRODUCTS.ALL)} (${utils.parseAmount(productQuestionCountByStatus.totalProductQuestionCount)})`}
                </Text>
              </Box>
            </WrapItem>
            <WrapItem>
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
                  {`${localeText(LANGUAGES.INQUIRIES.WAIT_ANSWER)} (${utils.parseAmount(productQuestionCountByStatus.readyProductQuestionCount)})`}
                </Text>
              </Box>
            </WrapItem>
            <WrapItem>
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
                  {`${localeText(LANGUAGES.INQUIRIES.ANSWERED)} (${utils.parseAmount(productQuestionCountByStatus.confirmProductQuestionCount)})`}
                </Text>
              </Box>
            </WrapItem>
          </Wrap>
        </Box>

        <Box h={'3rem'}>
          <SearchInput
            value={searchBy}
            onChange={(e) => {
              setSearchBy(e.target.value);
            }}
            onClick={() => {
              handleGetListInquireisAgent();
            }}
            placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
            placeholderFontColor={'#A7C3D2'}
          />
        </Box>

        <ContentBR h={'1.25rem'} />

        <Box w={'100%'}>
          <VStack spacing={'2rems'}>
            {listInquiries.map((item, index) => {
              return inquiriesCard(item, index);
            })}

            {listInquiries.length === 0 && (
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
      {isOpenAnswer && (
        <AnswerModal
          isModify={isModify}
          selectedItem={selectedItem}
          isOpen={isOpenAnswer}
          onClose={onCloseAnswer}
          callBack={(item, answer) => {
            handlePatchProductInquireis(item, answer, true);
          }}
        />
      )}
      {isOpenDetail && (
        <AnswerDetailModal
          selectedItem={selectedItem}
          isOpen={isOpenDetail}
          onClose={onCloseDetail}
        />
      )}
    </MainContainer>
  ) : (
    <MainContainer>
      <Box w={'100%'}>
        <VStack spacing={'2.5rem'} alignItems={'flex-start'}>
          <Box w={'100%'}>
            <VStack spacing={'1.25rem'}>
              <Box w={'100%'}>
                <HStack justifyContent={'space-between'} alignItems={'center'}>
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
                          {`${localeText(LANGUAGES.PRODUCTS.ALL)} (${utils.parseAmount(productQuestionCountByStatus.totalProductQuestionCount)})`}
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
                          {`${localeText(LANGUAGES.INQUIRIES.WAIT_ANSWER)} (${utils.parseAmount(productQuestionCountByStatus.readyProductQuestionCount)})`}
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
                          {`${localeText(LANGUAGES.INQUIRIES.ANSWERED)} (${utils.parseAmount(productQuestionCountByStatus.confirmProductQuestionCount)})`}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box minW={'24.375rem'} h={'3rem'}>
                    <SearchInput
                      value={searchBy}
                      onChange={(e) => {
                        setSearchBy(e.target.value);
                      }}
                      onClick={() => {
                        handleGetListInquireisAgent();
                      }}
                      placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
                      placeholderFontColor={'#A7C3D2'}
                    />
                  </Box>
                </HStack>
              </Box>
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
                    <HStack spacing={'0.75rem'}>
                      <Box w={'17rem'}>
                        <Text
                          textAlign={'center'}
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.PRODUCT)}
                        </Text>
                      </Box>
                      <Box w={'12.5rem'}>
                        <Text
                          textAlign={'center'}
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.INQUIRIES.INQUIRER)}
                        </Text>
                      </Box>
                      <Box w={'13.75rem'}>
                        <Text
                          textAlign={'center'}
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.INQUIRIES.INQUIRIES)}
                        </Text>
                      </Box>
                      <Box w={'8.375rem'}>
                        <Text
                          textAlign={'center'}
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.INQUIRIES.STATUS)}
                        </Text>
                      </Box>
                      <Box w={'8.375rem'}>
                        <Text
                          textAlign={'center'}
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.INQUIRIES.CONTACT_LOG)}
                        </Text>
                      </Box>
                      <Box w={'7rem'} />
                    </HStack>
                  </Box>
                  {/* body */}
                  <Box
                    w={'100%'}
                    h={'calc(6.5rem * 5)'}
                    overflowY={'auto'}
                    className={'no-scroll'}
                  >
                    <VStack spacing={'0.75rem'}>
                      <Box w={'100%'}>
                        <VStack spacing={0}>
                          {listInquiries.map((item, index) => {
                            return inquiriesCard(item, index);
                          })}
                          {listInquiries.length === 0 && (
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

      {isOpenAnswer && (
        <AnswerModal
          isModify={isModify}
          selectedItem={selectedItem}
          isOpen={isOpenAnswer}
          onClose={onCloseAnswer}
          callBack={handlePatchProductInquireis}
        />
      )}
      {isOpenDetail && (
        <AnswerDetailModal
          selectedItem={selectedItem}
          isOpen={isOpenDetail}
          onClose={onCloseDetail}
        />
      )}
    </MainContainer>
  );
};

export default InquiriesPage;
