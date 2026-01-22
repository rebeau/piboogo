'use client';

import { DefaultPaginate } from '@/components';
import CustomCheckBox from '@/components/common/checkbox/CustomCheckBox';
import BannerPreviewModal from '@/components/custom/banner/BannerPreviewModal';
import ContentBR from '@/components/custom/ContentBR';
import ContentHeader from '@/components/custom/header/ContentHeader';
import SearchInput from '@/components/input/custom/SearchInput';
import MainContainer from '@/components/layout/MainContainer';
import { LIST_CONTENT_NUM } from '@/constants/common';
import { SUCCESS } from '@/constants/errorCode';
import { LANGUAGES } from '@/constants/lang';
import useDevice from '@/hooks/useDevice';
import useLocale from '@/hooks/useLocale';
import useModal from '@/hooks/useModal';
import useMove from '@/hooks/useMove';
import useStatus from '@/hooks/useStatus';
import promotionApi from '@/services/promotionApi';
import { selectedPromotionState } from '@/stores/dataRecoil';
import utils from '@/utils';
import {
  Box,
  Button,
  Center,
  HStack,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useResetRecoilState, useSetRecoilState } from 'recoil';

const PromotionsPage = () => {
  const { isMobile, clampW } = useDevice();
  const { lang, localeText } = useLocale();
  const { movePromotionDetail, movePromotionAdd } = useMove();
  const { openModal } = useModal();
  const { handleGetAuthStatus } = useStatus();

  const [searchBy, setSearchBy] = useState('');

  const resetSelectedProducts = useResetRecoilState(selectedPromotionState);

  const {
    isOpen: isOpenPreview,
    onOpen: onOpenPreview,
    onClose: onClosePreview,
  } = useDisclosure();

  const [isInitList, setIsInitList] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);
  const [listPromotion, setListPromotion] = useState([]);

  useEffect(() => {
    handleGetListPromotionAgent();
  }, []);

  // 공통 key
  const key = 'promotionId';

  // 체크 담는 배열
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // 전체 선택
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const currentPageItems = listPromotion;
      const newSelectedItems = new Set(selectedItems);
      currentPageItems.forEach((item) => newSelectedItems.add(item[key]));
      setSelectedItems(newSelectedItems);
    } else {
      const currentPageItems = listPromotion;
      const newSelectedItems = new Set(selectedItems);
      currentPageItems.forEach((item) => newSelectedItems.delete(item[key]));
      setSelectedItems(newSelectedItems);
    }
  };

  // 전체 체크 여부
  useEffect(() => {
    // 전체 항목 중에서 선택된 항목의 개수를 확인
    const allSelected = listPromotion.every((item) =>
      selectedItems.has(item[key]),
    );
    setSelectAll(allSelected); // 모든 항목이 선택되면 selectAll true로 설정, 아니면 false
  }, [selectedItems, listPromotion]); // selectedItems와 listPromotion이 바뀔 때마다 실행

  // 개벌 체크
  const handleItemSelect = (item) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(item[key])) {
      newSelectedItems.delete(item[key]);
    } else {
      newSelectedItems.add(item[key]);
    }
    setSelectedItems(newSelectedItems);
  };

  const handleGetListPromotionAgent = () => {
    if (currentPage === 1) {
      handleGetListPromotion();
    } else {
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    if (!isInitList) {
      handleGetListPromotion();
    }
  }, [currentPage, contentNum]);

  // 기존 데이터 + 새로운 데이터
  const getNewDatas = (resultDatas, existingDatas) => {
    const existingIds = existingDatas.map((item) => item[key]);
    const newDatas = resultDatas.filter(
      (item) => !existingIds.includes(item[key]),
    );
    return newDatas;
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
          if (listPromotion.length === contentNum) {
            setCurrentPage((prevPage) => prevPage + 1);
          } else {
            handleGetListPromotion();
          }
        } else {
          // 1 페이지
          handleGetListPromotion();
        }
      }
    }
    lastScrollTop.current = scrollY;
  }, [loading]);

  useEffect(() => {
    if (isMobile(true)) {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  const handleGetListPromotion = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
    };
    if (searchBy) {
      param.searchBy = searchBy;
    }

    try {
      const result = await promotionApi.getListPromotion(param);
      setIsInitList(false);

      if (result?.errorCode === SUCCESS) {
        if (isMobile(true)) {
          setListPromotion((prev) => {
            const newDatas = getNewDatas(
              result.datas,
              listPromotion,
              currentPage,
              contentNum,
            );
            return [...prev, ...newDatas];
          });
        } else {
          setListPromotion(result.datas);
        }
        setTotalCount(result.totalCount);
      } else {
        if (isMobile(true)) {
          setListPromotion((prev) => [...prev, ...[]]);
        } else {
          setListPromotion([]);
        }
        setTotalCount(result.totalCount);
      }
    } finally {
      setLoading(false);
    }
  });

  const handleDeleteBanner = () => {
    const deleteIds = Array.from(selectedItems);
    if (deleteIds.length === 0) {
      setTimeout(() => {
        openModal({
          text: localeText(LANGUAGES.INFO_MSG.SELECT_PROMOTION_MSG),
        });
      });
      return;
    }
    setTimeout(() => {
      openModal({
        type: 'confirm',
        text: localeText(LANGUAGES.INFO_MSG.DELETE_PROMOTION_MSG),
        onAgree: () => {
          handleDelete();
        },
        onAgreeText: localeText(LANGUAGES.COMMON.DELETE),
      });
    });
  };

  const handleDelete = async () => {
    const param = {
      promotionIds: Array.from(selectedItems),
    };
    const result = await promotionApi.deletePromotion(param);
    if (result?.errorCode === SUCCESS) {
      setTimeout(() => {
        openModal({
          text: result.message,
          onAgree: () => {
            handleGetListPromotionAgent();
          },
        });
      });
    }
  };

  const promotionCard = useCallback((item, index) => {
    const name = item?.name;
    const status = item?.status;
    const promotionId = item?.promotionId;
    const createdAt = item?.createdAt;
    const startDate = item?.startDate || null;
    const endDate = item?.endDate || null;

    let period = null;
    if (startDate && endDate) {
      period = `${utils.parseDateByCountryCode(startDate, lang)} - ${utils.parseDateByCountryCode(endDate, lang)}`;
    } else {
      period = localeText(LANGUAGES.COMMON.UNLIMITED);
    }

    return isMobile(true) ? (
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
          <Box>
            <CustomCheckBox
              isChecked={selectedItems.has(item.promotionId)}
              onChange={() => handleItemSelect(item)}
            />
          </Box>
          <Box
            onClick={() => {
              movePromotionDetail(promotionId);
            }}
          >
            <VStack spacing={'0.75rem'} alignItems={'flex-start'}>
              <Box>
                <HStack spacing={clampW(1, 3)}>
                  <Text
                    w={clampW(6.25, 8)}
                    textAlign={'left'}
                    color="#2A333C"
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={500}
                    lineHeight="1.5rem"
                  >
                    {localeText(LANGUAGES.PROMOTIONS.NUMBER)}
                  </Text>
                  <Text
                    textAlign={'left'}
                    color="#2A333C"
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={500}
                    lineHeight="1.5rem"
                  >
                    {utils.getPageContentNum(
                      index,
                      currentPage,
                      totalCount,
                      contentNum,
                    )}
                  </Text>
                </HStack>
              </Box>

              <Box>
                <HStack spacing={clampW(1, 3)}>
                  <Text
                    w={clampW(6.25, 8)}
                    textAlign={'left'}
                    color="#2A333C"
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={500}
                    lineHeight="1.5rem"
                  >
                    {localeText(LANGUAGES.PROMOTIONS.TITLE)}
                  </Text>

                  <Text
                    textAlign={'left'}
                    color="#485766"
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={400}
                    lineHeight="1.5rem"
                    whiteSpace={'pre-wrap'}
                  >
                    {name}
                  </Text>
                </HStack>
              </Box>

              <Box>
                <HStack spacing={clampW(1, 3)}>
                  <Text
                    w={clampW(6.25, 8)}
                    textAlign={'left'}
                    color="#2A333C"
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={500}
                    lineHeight="1.5rem"
                  >
                    {localeText(LANGUAGES.PROMOTIONS.PERIOD)}
                  </Text>
                  <Text
                    textAlign={'left'}
                    color="#485766"
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={400}
                    lineHeight="1.5rem"
                  >
                    {period}
                  </Text>
                </HStack>
              </Box>
              <Box>
                <HStack spacing={clampW(1, 3)}>
                  <Text
                    w={clampW(6.25, 8)}
                    textAlign={'left'}
                    color="#2A333C"
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={500}
                    lineHeight="1.5rem"
                  >
                    {localeText(LANGUAGES.PROMOTIONS.AUTHORIZATION)}
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
              <Box>
                <HStack spacing={clampW(1, 3)}>
                  <Text
                    w={clampW(6.25, 8)}
                    textAlign={'left'}
                    color="#2A333C"
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={500}
                    lineHeight="1.5rem"
                  >
                    {localeText(LANGUAGES.PROMOTIONS.DATE_REQUEST)}
                  </Text>
                  <Text
                    textAlign={'left'}
                    color="#485766"
                    fontSize={clampW(0.75, 0.9375)}
                    fontWeight={400}
                    lineHeight="1.5rem"
                  >
                    {utils.parseDateByCountryCode(createdAt, lang)}
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </HStack>
      </Box>
    ) : (
      <Tr key={index} borderTop="1px solid #AEBDCA">
        <Td>
          <CustomCheckBox
            isChecked={selectedItems.has(item.promotionId)}
            onChange={() => handleItemSelect(item)}
          />
        </Td>
        <Td>
          <Text
            w={clampW(3.875, 3.875)}
            minW={clampW(3.875, 3.875)}
            textAlign="center"
            color="#2A333C"
            fontSize="0.9375rem"
            fontWeight={500}
            lineHeight="1.5rem"
          >
            {utils.getPageContentNum(
              index,
              currentPage,
              totalCount,
              contentNum,
            )}
          </Text>
        </Td>

        <Td>
          <Center
            w={clampW(10, 33.3125)}
            minW={clampW(10, 33.3125)}
            cursor={'pointer'}
            onClick={() => {
              movePromotionDetail(promotionId);
            }}
          >
            <Text
              color="#485766"
              fontSize="0.9375rem"
              fontWeight={400}
              lineHeight="1.5rem"
              textAlign={'center'}
            >
              {name}
            </Text>
          </Center>
        </Td>

        <Td>
          <Text
            w={clampW(11.25, 11.25)}
            minW={clampW(11.25, 11.25)}
            color="#485766"
            fontSize="0.9375rem"
            fontWeight={400}
            lineHeight="1.5rem"
            textAlign={'center'}
          >
            {period}
          </Text>
        </Td>

        <Td>
          <Text
            w={clampW(6.3125, 6.3125)}
            minW={clampW(6.3125, 6.3125)}
            textAlign="center"
            color={status === 1 || status === 3 ? '#485766' : '#B20000'}
            fontSize="0.9375rem"
            fontWeight={400}
            lineHeight="1.5rem"
          >
            {handleGetAuthStatus(status)}
          </Text>
        </Td>

        <Td>
          <Text
            w={clampW(8.75, 8.75)}
            minW={clampW(8.75, 8.75)}
            textAlign="center"
            color="#485766"
            fontSize="0.9375rem"
            fontWeight={400}
            lineHeight="1.5rem"
          >
            {utils.parseDateByCountryCode(createdAt, lang)}
          </Text>
        </Td>
      </Tr>
    );
  });

  return isMobile(true) ? (
    <MainContainer>
      <Box w={'100%'}>
        <VStack spacing={0} alignItems={'flex-start'} px={clampW(1, 5)}>
          <Box w={'100%'} h={'3rem'}>
            <SearchInput
              value={searchBy}
              onChange={(e) => {
                setSearchBy(e.target.value);
              }}
              onClick={() => {
                handleGetListPromotionAgent();
              }}
              placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
              placeholderFontColor={'#A7C3D2'}
            />
          </Box>

          <ContentBR h={'1.25rem'} />

          <Box w={'100%'}>
            <HStack justifyContent={'space-between'}>
              <Box onClick={handleSelectAll}>
                <HStack>
                  <Box
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    w={'1.5rem'}
                    h={'1.5rem'}
                    position={'relative'}
                    zIndex={3}
                  >
                    <Box position={'absolute'} zIndex={2}>
                      <CustomCheckBox isChecked={selectAll} />
                    </Box>
                  </Box>
                  <Text
                    color={'#66809C'}
                    fontSize={clampW(0.875, 0.9375)}
                    fontWeight={400}
                  >
                    {`${localeText(LANGUAGES.COMMON.OVERALL_SELECTION)}(${Array.from(selectedItems).length}/${totalCount})`}
                  </Text>
                </HStack>
              </Box>

              <Box
                onClick={() => {
                  handleDeleteBanner();
                }}
              >
                <Text
                  color={'#66809C'}
                  fontSize={clampW(0.875, 0.9375)}
                  fontWeight={400}
                >
                  {localeText(LANGUAGES.COMMON.DELETE_SELECTION)}
                </Text>
              </Box>
            </HStack>
          </Box>
        </VStack>
      </Box>

      <ContentBR h={'1.25rem'} />

      <Box
        w={'100%'}
        px={clampW(1, 5)}
        // h={'calc(100vh - 21.5rem)'}
        // overflowY={'auto'}
        //
      >
        <VStack spacing={0} h={'100%'}>
          {listPromotion.map((item, index) => {
            return promotionCard(item, index);
          })}
          {listPromotion.length === 0 && (
            <Center w={'100%'} h={'10rem'}>
              <Text fontSize={'1.5rem'} fontWeight={500} lineHeight={'1.75rem'}>
                {localeText(LANGUAGES.INFO_MSG.NO_ITEM_SEARCHED)}
              </Text>
            </Center>
          )}
        </VStack>
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
            resetSelectedProducts({});
            movePromotionAdd();
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
            {localeText(LANGUAGES.PROMOTIONS.REQUEST_PROMOTION)}
          </Text>
        </Button>
      </Box>

      {isOpenPreview && (
        <BannerPreviewModal isOpen={isOpenPreview} onClose={onClosePreview} />
      )}
    </MainContainer>
  ) : (
    <MainContainer
      contentHeader={
        <Button
          onClick={() => {
            resetSelectedProducts({});
            movePromotionAdd();
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
            {localeText(LANGUAGES.PROMOTIONS.REQUEST_PROMOTION)}
          </Text>
        </Button>
      }
    >
      <Box w={'100%'}>
        <VStack spacing={'1.25rem'} alignItems={'flex-start'}>
          <Box w={'100%'}>
            <HStack justifyContent={'space-between'}>
              <Box w={'25rem'} h={'3rem'}>
                <SearchInput
                  value={searchBy}
                  onChange={(e) => {
                    setSearchBy(e.target.value);
                  }}
                  onClick={() => {
                    handleGetListPromotionAgent();
                  }}
                  placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
                  placeholderFontColor={'#A7C3D2'}
                />
              </Box>
              <Box minW={'7rem'} h={'3rem'}>
                <Button
                  onClick={() => {
                    handleDeleteBanner();
                  }}
                  px={'1.25rem'}
                  py={'0.63rem'}
                  borderRadius={'0.25rem'}
                  border={'1px solid #B20000'}
                  boxSizing={'border-box'}
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
                    color={'#B20000'}
                    fontSize={'1rem'}
                    fontWeight={400}
                    lineHeight={'1.75rem'}
                  >
                    {localeText(LANGUAGES.COMMON.DELETE)}
                  </Text>
                </Button>
              </Box>
            </HStack>
          </Box>

          <TableContainer w="100%">
            <Table>
              <Thead>
                <Tr borderTop="1px solid #73829D">
                  <Th>
                    <CustomCheckBox
                      isChecked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </Th>
                  <Th>
                    <Text
                      w={clampW(3.875, 3.875)}
                      minW={clampW(3.875, 3.875)}
                      textAlign="center"
                      color="#2A333C"
                      fontSize="0.9375rem"
                      fontWeight={500}
                      lineHeight="1.5rem"
                    >
                      {localeText(LANGUAGES.PROMOTIONS.NUMBER)}
                    </Text>
                  </Th>
                  <Th>
                    <Text
                      w={clampW(10, 33.3125)}
                      minW={clampW(10, 33.3125)}
                      textAlign="center"
                      color="#2A333C"
                      fontSize="0.9375rem"
                      fontWeight={500}
                      lineHeight="1.5rem"
                    >
                      {localeText(LANGUAGES.PROMOTIONS.TITLE)}
                    </Text>
                  </Th>
                  <Th>
                    <Text
                      w={clampW(9, 11.25)}
                      minW={clampW(9, 11.25)}
                      textAlign="center"
                      color="#2A333C"
                      fontSize="0.9375rem"
                      fontWeight={500}
                      lineHeight="1.5rem"
                    >
                      {localeText(LANGUAGES.PROMOTIONS.PERIOD)}
                    </Text>
                  </Th>
                  <Th>
                    <Text
                      w={clampW(6.3125, 6.3125)}
                      minW={clampW(6.3125, 6.3125)}
                      textAlign="center"
                      color="#2A333C"
                      fontSize="0.9375rem"
                      fontWeight={500}
                      lineHeight="1.5rem"
                    >
                      {localeText(LANGUAGES.PROMOTIONS.AUTHORIZATION)}
                    </Text>
                  </Th>
                  <Th>
                    <Text
                      w={clampW(8.75, 8.75)}
                      minW={clampW(8.75, 8.75)}
                      textAlign="center"
                      color="#2A333C"
                      fontSize="0.9375rem"
                      fontWeight={500}
                      lineHeight="1.5rem"
                    >
                      {localeText(LANGUAGES.PROMOTIONS.DATE_REQUEST)}
                    </Text>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {listPromotion.map((item, index) => {
                  return promotionCard(item, index);
                })}
                {listPromotion.length === 0 && (
                  <Tr>
                    <Td colSpan={5}>
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

      {isOpenPreview && (
        <BannerPreviewModal isOpen={isOpenPreview} onClose={onClosePreview} />
      )}
    </MainContainer>
  );
};

export default PromotionsPage;
