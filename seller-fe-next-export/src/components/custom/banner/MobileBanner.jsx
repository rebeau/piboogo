'use client';

import { DefaultPaginate } from '@/components';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import BannerPreview from '@/components/custom/banner/BannerPreview';
import BannerPreviewModal from '@/components/custom/banner/BannerPreviewModal';
import ContentBR from '@/components/custom/ContentBR';
import SearchInput from '@/components/input/custom/SearchInput';
import MainContainer from '@/components/layout/MainContainer';
import { LIST_CONTENT_NUM } from '@/constants/common';
import { SUCCESS } from '@/constants/errorCode';
import { LANGUAGES } from '@/constants/lang';
import useDevice from '@/hooks/useDevice';
import useLocale from '@/hooks/useLocale';
import useMove from '@/hooks/useMove';
import useStatus from '@/hooks/useStatus';
import bannerApi from '@/services/bannerApi';
import { selectedBannerState } from '@/stores/dataRecoil';
import utils from '@/utils';
import {
  Box,
  Button,
  Center,
  HStack,
  Select,
  Text,
  VStack,
  Image as ChakraImage,
  useDisclosure,
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useResetRecoilState } from 'recoil';

const MobileBannersPage = () => {
  const { isMobile, clampW } = useDevice();
  const { lang, localeText } = useLocale();
  const { moveBannerDetail, moveBannerAdd } = useMove();
  const { handleGetAuthStatus } = useStatus();

  const resetSelectedBanner = useResetRecoilState(selectedBannerState);

  const {
    isOpen: isOpenPreview,
    onOpen: onOpenPreview,
    onClose: onClosePreview,
  } = useDisclosure();

  const [isInitList, setIsInitList] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);

  const [searchBy, setSearchBy] = useState(null);

  const key = 'bannerId';
  const [listBanner, setListBanner] = useState([]);

  const getNewDatas = (resultDatas, existingDatas) => {
    const existingIds = existingDatas.map((item) => item[key]);
    const newDatas = resultDatas.filter(
      (item) => !existingIds.includes(item[key]),
    );
    return newDatas;
  };

  useEffect(() => {
    handleGetListBanner();
  }, [currentPage]);

  useEffect(() => {
    if (!isInitList) {
      handleGetListBannerAgent();
    }
  }, [contentNum]);

  const handleGetListBannerAgent = () => {
    if (currentPage === 1) {
      handleGetListBanner();
    } else {
      setCurrentPage(1);
    }
  };

  const [previewPosition, setPreviewPosition] = useState(null);
  const [previewBannerImageUrl, setPreviewBannerImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const lastScrollTop = useRef(0);

  const handleScroll = useCallback(async () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollY > lastScrollTop.current) {
      if (scrollY + windowHeight >= documentHeight && !loading) {
        if (currentPage !== 1) {
          if (listBanner.length === contentNum) {
            setCurrentPage((prevPage) => prevPage + 1);
          } else {
            handleGetListBanner();
          }
        } else {
          // 1 페이지
          handleGetListBanner();
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

  const handleGetListBanner = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    const param = {
      pageNum: Number(currentPage),
      contentNum: Number(contentNum),
    };
    if (searchBy) {
      param.searchBy = searchBy;
    }

    try {
      const result = await bannerApi.getListBanner(param);
      setIsInitList(false);
      if (result?.errorCode === SUCCESS) {
        if (isMobile(true)) {
          setListBanner((prev) => {
            const newDatas = getNewDatas(
              result.datas,
              listBanner,
              currentPage,
              contentNum,
            );
            return [...prev, ...newDatas];
          });
        } else {
          setListBanner(result.datas);
        }
        setTotalCount(result.totalCount);
      } else {
        if (isMobile(true)) {
          setListBanner((prev) => [...prev, ...[]]);
        } else {
          setListBanner([]);
        }
        setTotalCount(result.totalCount);
      }
    } finally {
      setLoading(false);
    }
  });

  const bannerCard = useCallback((item, index) => {
    const bannerId = item?.bannerId;
    const createdAt = item?.createdAt;
    const imageS3Url = item?.imageS3Url;
    const name = item?.name;
    const status = item?.status;
    const type = item?.type;
    const startDate = item?.startDate;
    const endDate = item?.endDate;

    let period = localeText(LANGUAGES.COMMON.UNLIMITED);
    if (startDate && endDate) {
      period = `${utils.parseDateByCountryCode(startDate, lang)} - ${utils.parseDateByCountryCode(endDate, lang)}`;
    }

    return isMobile(true) ? (
      <Box
        key={index}
        w={'100%'}
        p={'1rem'}
        borderTop="1px solid #AEBDCA"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
        gap="1.25rem"
        onClick={() => {
          moveBannerDetail(bannerId);
        }}
      >
        <VStack w={'100%'} spacing={'0.75rem'} alignSelf={'flex-start'}>
          <Box w={'100%'}>
            <BannerPreview position={type} />
          </Box>

          <Box w={'100%'}>
            <HStack spacing={clampW(1, 3)}>
              <Text
                w={clampW(5, 8)}
                textAlign={'left'}
                color="#2A333C"
                fontSize={clampW(0.75, 0.9375)}
                fontWeight={500}
              >
                {localeText(LANGUAGES.BANNERS.NAME)}
              </Text>
              <Text
                textAlign={'left'}
                color={'#485766'}
                fontSize={clampW(0.75, 0.9375)}
                fontWeight={400}
              >
                {name}
              </Text>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={clampW(1, 3)}>
              <Text
                w={clampW(5, 8)}
                textAlign={'left'}
                color="#2A333C"
                fontSize={clampW(0.75, 0.9375)}
                fontWeight={500}
              >
                {localeText(LANGUAGES.BANNERS.PERIOD)}
              </Text>
              <Text
                textAlign={'left'}
                color={'#485766'}
                fontSize={clampW(0.75, 0.9375)}
                fontWeight={400}
              >
                {period}
              </Text>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={clampW(1, 3)}>
              <Text
                w={clampW(5, 8)}
                textAlign={'left'}
                color="#2A333C"
                fontSize={clampW(0.75, 0.9375)}
                fontWeight={500}
              >
                {localeText(LANGUAGES.BANNERS.IMAGE)}
              </Text>
              <Box>
                <Center w={'12.5rem'} aspectRatio={12.5 / 4.6875}>
                  <ChakraImage
                    fallback={<DefaultSkeleton />}
                    w={'100%'}
                    h={'100%'}
                    src={imageS3Url}
                  />
                </Center>
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={clampW(1, 3)}>
              <Text
                w={clampW(5, 8)}
                textAlign={'left'}
                color="#2A333C"
                fontSize={clampW(0.75, 0.9375)}
                fontWeight={500}
              >
                {localeText(LANGUAGES.BANNERS.AUTHORIZATION)}
              </Text>
              <Text
                textAlign={'left'}
                color={status === 1 || status === 3 ? '#485766' : '#B20000'}
                fontSize={clampW(0.75, 0.9375)}
                fontWeight={400}
              >
                {handleGetAuthStatus(status)}
              </Text>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={clampW(1, 3)}>
              <Text
                w={clampW(5, 8)}
                textAlign={'left'}
                color="#2A333C"
                fontSize={clampW(0.75, 0.9375)}
                fontWeight={500}
              >
                {localeText(LANGUAGES.BANNERS.DATE_REQUEST)}
              </Text>
              <Text
                textAlign={'left'}
                color={'#485766'}
                fontSize={clampW(0.75, 0.9375)}
                fontWeight={400}
              >
                {utils.parseDateByCountryCode(createdAt, lang, true)}
              </Text>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={clampW(1, 3)}>
              <Text
                w={clampW(5, 8)}
                textAlign={'left'}
                color="#2A333C"
                fontSize={clampW(0.75, 0.9375)}
                fontWeight={500}
              >
                {localeText(LANGUAGES.BANNERS.ACTION)}
              </Text>
              <Box
                cursor={'pointer'}
                onClick={() => {
                  setPreviewPosition(type);
                  setPreviewBannerImageUrl(imageS3Url);
                  onOpenPreview();
                }}
              >
                <Box borderBottom={'1px solid #66809C'}>
                  <Text
                    textAlign="center"
                    color="#556A7E"
                    fontSize="1rem"
                    fontWeight={500}
                    lineHeight="1.75rem"
                  >
                    {localeText(LANGUAGES.BANNERS.PREVIEW)}
                  </Text>
                </Box>
              </Box>
            </HStack>
          </Box>
        </VStack>
      </Box>
    ) : (
      <Box
        key={index}
        w={'100%'}
        p="1rem"
        borderTop="1px solid #AEBDCA"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
        gap="1.25rem"
      >
        <HStack spacing={'1.25rem'}>
          <BannerPreview position={type} />

          <Center
            w={'18.5rem'}
            cursor={'pointer'}
            onClick={() => {
              moveBannerDetail(bannerId);
            }}
          >
            <Text
              color="#485766"
              fontSize="0.9375rem"
              fontWeight="400"
              lineHeight="1.5rem"
              textAlign={'center'}
            >
              {name}
            </Text>
          </Center>

          <Text
            w={'5.75rem'}
            color="#485766"
            fontSize="0.9375rem"
            fontWeight="400"
            lineHeight="1.5rem"
            whiteSpace={'pre-wrap'}
          >
            {period}
          </Text>
          <Center w={'12.5rem'} h={'4.6875rem'}>
            <ChakraImage
              fallback={<DefaultSkeleton />}
              w={'100%'}
              h={'100%'}
              src={imageS3Url}
            />
          </Center>

          <Text
            w={'6.3125rem'}
            textAlign="center"
            color={status === 1 || status === 3 ? '#485766' : '#B20000'}
            fontSize="0.9375rem"
            fontWeight="400"
            lineHeight="1.5rem"
          >
            {handleGetAuthStatus(status)}
          </Text>

          <Text
            w={'8.75rem'}
            textAlign="center"
            color="#485766"
            fontSize="0.9375rem"
            fontWeight="400"
            lineHeight="1.5rem"
          >
            {utils.parseDateByCountryCode(createdAt, lang, true)}
          </Text>
          <Center
            w={'4rem'}
            cursor={'pointer'}
            onClick={() => {
              setPreviewPosition(type);
              setPreviewBannerImageUrl(imageS3Url);
              onOpenPreview();
            }}
          >
            <Box borderBottom={'1px solid #66809C'}>
              <Text
                textAlign="center"
                color="#556A7E"
                fontSize="1rem"
                fontWeight={500}
                lineHeight="1.75rem"
              >
                {localeText(LANGUAGES.BANNERS.PREVIEW)}
              </Text>
            </Box>
          </Center>
        </HStack>
      </Box>
    );
  });

  return isMobile(true) ? (
    <MainContainer>
      <Box w={'100%'} px={clampW(1, 5)}>
        <Box w={'100%'} h={'3rem'}>
          <SearchInput
            value={searchBy}
            onChange={(e) => {
              setSearchBy(e.target.value);
            }}
            onClick={() => {
              handleGetListBannerAgent();
            }}
            placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
            placeholderFontColor={'#A7C3D2'}
          />
        </Box>

        <ContentBR h={'1.25rem'} />

        <Box w={'100%'}>
          <VStack spacing={0}>
            {listBanner.map((item, index) => {
              return bannerCard(item, index);
            })}
            {listBanner.length === 0 && (
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
      </Box>

      <ContentBR h={'5.25rem'} />

      <Box
        bg={'#FFF'}
        minW={'100%'}
        h={'5rem'}
        position={'fixed'}
        bottom={0}
        p={'1rem'}
        borderTop={'1px solid #AEBDCA'}
      >
        <Button
          onClick={() => {
            resetSelectedBanner();
            moveBannerAdd();
          }}
          w={'100%'}
          h={'3rem'}
          p={'0.625rem 1.25rem'}
          bg={'#7895B2'}
          borderRadius={'0.25rem'}
        >
          <Text
            fontSize={'1rem'}
            fontWeight={400}
            lineHeight={'1.75rem'}
            color={'#FFF'}
          >
            {localeText(LANGUAGES.BANNERS.REQUEST_BANNER)}
          </Text>
        </Button>
      </Box>

      {isOpenPreview && (
        <BannerPreviewModal
          position={type}
          isOpen={isOpenPreview}
          onClose={() => {
            setPreviewPosition(null);
            setPreviewBannerImageUrl(null);
            onClosePreview();
          }}
          image={previewBannerImageUrl}
        />
      )}
    </MainContainer>
  ) : (
    <MainContainer
      contentHeader={
        <Box>
          <Button
            onClick={() => {
              resetSelectedBanner();
              moveBannerAdd();
            }}
            w={'max-content'}
            h={'3rem'}
            p={'0.625rem 1.25rem'}
            bg={'#7895B2'}
            borderRadius={'0.25rem'}
          >
            <Text
              fontSize={'1rem'}
              fontWeight={400}
              lineHeight={'1.75rem'}
              color={'#FFF'}
            >
              {localeText(LANGUAGES.BANNERS.REQUEST_BANNER)}
            </Text>
          </Button>
        </Box>
      }
    >
      <Box w={'100%'}>
        <VStack spacing={'1.25rem'} alignItems={'flex-start'}>
          <Box w={'25rem'} h={'3rem'}>
            <SearchInput
              value={searchBy}
              onChange={(e) => {
                setSearchBy(e.target.value);
              }}
              onClick={() => {
                handleGetListBannerAgent();
              }}
              placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
              placeholderFontColor={'#A7C3D2'}
            />
          </Box>

          <Box w={'100%'}>
            <VStack spacing={'1.25rem'}>
              <Box w={'100%'}>
                {/* Product Rows */}
                <VStack spacing={0}>
                  {/* header */}
                  <Box
                    w={'100%'}
                    h={'3rem'}
                    p={'1rem'}
                    borderTop="1px solid #73829D"
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <HStack spacing={'1.25rem'}>
                      <Text
                        w={'7.5rem'}
                        minW={'7.5rem'}
                        textAlign="center"
                        color="#2A333C"
                        fontSize="0.9375rem"
                        fontWeight={500}
                        lineHeight="1.5rem"
                      >
                        {localeText(LANGUAGES.BANNERS.POSITION)}
                      </Text>
                      <Text
                        w={'18.5rem'}
                        textAlign="center"
                        color="#2A333C"
                        fontSize="0.9375rem"
                        fontWeight={500}
                        lineHeight="1.5rem"
                      >
                        {localeText(LANGUAGES.BANNERS.NAME)}
                      </Text>
                      <Text
                        w={'5.75rem'}
                        textAlign="center"
                        color="#2A333C"
                        fontSize="0.9375rem"
                        fontWeight={500}
                        lineHeight="1.5rem"
                      >
                        {localeText(LANGUAGES.BANNERS.PERIOD)}
                      </Text>
                      <Text
                        w={'12.5rem'}
                        textAlign="center"
                        color="#2A333C"
                        fontSize="0.9375rem"
                        fontWeight={500}
                        lineHeight="1.5rem"
                      >
                        {localeText(LANGUAGES.BANNERS.IMAGE)}
                      </Text>
                      <Text
                        w={'6.3125rem'}
                        textAlign="center"
                        color="#2A333C"
                        fontSize="0.9375rem"
                        fontWeight={500}
                        lineHeight="1.5rem"
                      >
                        {localeText(LANGUAGES.BANNERS.AUTHORIZATION)}
                      </Text>
                      <Text
                        w={'8.75rem'}
                        textAlign="center"
                        color="#2A333C"
                        fontSize="0.9375rem"
                        fontWeight={500}
                        lineHeight="1.5rem"
                      >
                        {localeText(LANGUAGES.BANNERS.DATE_REQUEST)}
                      </Text>
                      <Text
                        w={'4rem'}
                        textAlign="center"
                        color="#2A333C"
                        fontSize="0.9375rem"
                        fontWeight={500}
                        lineHeight="1.5rem"
                      >
                        {localeText(LANGUAGES.BANNERS.ACTION)}
                      </Text>
                    </HStack>
                  </Box>
                  {/* body */}
                  <Box w={'100%'}>
                    <VStack spacing={'0.75rem'}>
                      <Box w={'100%'} borderBottom={'1px solid #AEBDCA'}>
                        <VStack spacing={0}>
                          {listBanner.map((item, index) => {
                            return bannerCard(item, index);
                          })}
                          {listBanner.length === 0 && (
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
                        </VStack>
                      </Box>
                      <Box w={'100%'}>
                        <HStack justifyContent={'space-between'}>
                          <Box w={'6.125rem'}>
                            <Select
                              value={contentNum}
                              onChange={(e) => {
                                setContentNum((prev) => {
                                  const temp = e.target.value;
                                  if (Number(temp) < Number(prev)) {
                                    setListBanner([]);
                                  }
                                  return temp;
                                });
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
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Box>

      {isOpenPreview && (
        <BannerPreviewModal
          position={previewPosition}
          isOpen={isOpenPreview}
          onClose={() => {
            setPreviewPosition(null);
            setPreviewBannerImageUrl(null);
            onClosePreview();
          }}
          image={previewBannerImageUrl}
        />
      )}
    </MainContainer>
  );
};

export default MobileBannersPage;
