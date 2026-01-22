'use client';

import { DefaultPaginate } from '@/components';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import BannerPreview from '@/components/custom/banner/BannerPreview';
import BannerPreviewModal from '@/components/custom/banner/BannerPreviewModal';
import SearchInput from '@/components/input/custom/SearchInput';
import MainContainer from '@/components/layout/MainContainer';
import { LIST_CONTENT_NUM } from '@/constants/common';
import { SUCCESS } from '@/constants/errorCode';
import { LANGUAGES } from '@/constants/lang';
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
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  Thead,
  Th,
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useResetRecoilState } from 'recoil';

const WebBannersPage = () => {
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
        setListBanner(result.datas);
        setTotalCount(result.totalCount);
      } else {
        setListBanner([]);
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

    return (
      <Tr key={index} p="1rem" borderTop="1px solid #AEBDCA">
        <Td>
          <Center>
            <BannerPreview position={type} />
          </Center>
        </Td>

        <Td
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
        </Td>

        <Td>
          <Text
            color="#485766"
            fontSize="0.9375rem"
            fontWeight="400"
            lineHeight="1.5rem"
            textAlign={'center'}
            whiteSpace={'pre-wrap'}
          >
            {period}
          </Text>
        </Td>

        <Td>
          <Center>
            <ChakraImage
              fallback={<DefaultSkeleton />}
              w={'12.5rem'}
              h={'4.6875rem'}
              src={imageS3Url}
            />
          </Center>
        </Td>

        <Td>
          <Text
            textAlign="center"
            color={status === 1 || status === 3 ? '#485766' : '#B20000'}
            fontSize="0.9375rem"
            fontWeight="400"
            lineHeight="1.5rem"
          >
            {handleGetAuthStatus(status)}
          </Text>
        </Td>

        <Td>
          <Text
            textAlign="center"
            color="#485766"
            fontSize="0.9375rem"
            fontWeight="400"
            lineHeight="1.5rem"
          >
            {utils.parseDateByCountryCode(createdAt, lang, true)}
          </Text>
        </Td>

        <Td>
          <Center
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
        </Td>
      </Tr>
    );
  });

  return (
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
      <Box w={'100%'} py={'1.25rem'}>
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
            <TableContainer w="100%">
              <Table>
                <Thead>
                  <Tr
                    borderTop={'1px solid #73829D'}
                    borderBottom={'1px solid #73829D'}
                  >
                    <Th>
                      <Text
                        textAlign="center"
                        color="#2A333C"
                        fontSize="0.9375rem"
                        fontWeight={500}
                        lineHeight="1.5rem"
                      >
                        {localeText(LANGUAGES.BANNERS.POSITION)}
                      </Text>
                    </Th>
                    <Th>
                      <Text
                        textAlign="center"
                        color="#2A333C"
                        fontSize="0.9375rem"
                        fontWeight={500}
                        lineHeight="1.5rem"
                      >
                        {localeText(LANGUAGES.BANNERS.NAME)}
                      </Text>
                    </Th>
                    <Th>
                      <Text
                        textAlign="center"
                        color="#2A333C"
                        fontSize="0.9375rem"
                        fontWeight={500}
                        lineHeight="1.5rem"
                      >
                        {localeText(LANGUAGES.BANNERS.PERIOD)}
                      </Text>
                    </Th>
                    <Th>
                      <Text
                        textAlign="center"
                        color="#2A333C"
                        fontSize="0.9375rem"
                        fontWeight={500}
                        lineHeight="1.5rem"
                      >
                        {localeText(LANGUAGES.BANNERS.IMAGE)}
                      </Text>
                    </Th>
                    <Th>
                      <Text
                        textAlign="center"
                        color="#2A333C"
                        fontSize="0.9375rem"
                        fontWeight={500}
                        lineHeight="1.5rem"
                      >
                        {localeText(LANGUAGES.BANNERS.AUTHORIZATION)}
                      </Text>
                    </Th>
                    <Th>
                      <Text
                        textAlign="center"
                        color="#2A333C"
                        fontSize="0.9375rem"
                        fontWeight={500}
                        lineHeight="1.5rem"
                      >
                        {localeText(LANGUAGES.BANNERS.DATE_REQUEST)}
                      </Text>
                    </Th>
                    <Th>
                      <Text
                        textAlign="center"
                        color="#2A333C"
                        fontSize="0.9375rem"
                        fontWeight={500}
                        lineHeight="1.5rem"
                      >
                        {localeText(LANGUAGES.BANNERS.ACTION)}
                      </Text>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {listBanner.map((item, index) => {
                    return bannerCard(item, index);
                  })}
                  {listBanner.length === 0 && (
                    <Tr>
                      <Td colSpan={7}>
                        <Center w={'100%'} h={'10rem'}>
                          <Text
                            fontSize={'1.5rem'}
                            fontWeight={500}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.INFO_MSG.NO_ITEM_SEARCHED)}
                          </Text>
                        </Center>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
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

export default WebBannersPage;
