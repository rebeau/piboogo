'use client';

import CustomCheckBox from '@/components/common/checkbox/CustomCheckBox';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import {
  Box,
  Button,
  Center,
  HStack,
  Image as ChakraImage,
  Text,
  VStack,
  Img,
  Select,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  Thead,
  Th,
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import IconRight from '@public/svgs/icon/right.svg';
import utils from '@/utils';
import { DefaultPaginate } from '@/components';
import { LIST_CONTENT_NUM } from '@/constants/common';
import productApi from '@/services/productApi';
import { SUCCESS } from '@/constants/errorCode';
import useMove from '@/hooks/useMove';
import useModal from '@/hooks/useModal';
import { useResetRecoilState } from 'recoil';
import { selectedProductState } from '@/stores/dataRecoil';
import MainContainer from '@/components/layout/MainContainer';
import ContentBR from '@/components/custom/ContentBR';
import FilterSearchInput from '@/components/input/custom/FilterSearchInput';

const WebProductPage = () => {
  const { openModal } = useModal();
  const { localeText } = useLocale();
  const { moveProductDetail, moveProductAdd } = useMove();

  const resetSelectedProducts = useResetRecoilState(selectedProductState);

  const [onFilter, setOnFilter] = useState(null);

  const [isInitList, setIsInitList] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);
  const [listProduct, setListProduct] = useState([]);
  const [productCountByStatus, setProductCountByStatus] = useState({
    totalProductCount: 0,
    inProductCount: 0,
    stopProductCount: 0,
    soldOutProductCount: 0,
  });

  // option
  const [firstCategoryId, setFirstCategoryId] = useState(0);
  const [secondCategoryId, setSecondCategoryId] = useState(0);
  const [thirdCategoryId, setThirdCategoryId] = useState(0);
  const [promotionId, setPromotionId] = useState(0);
  const [status, setStatus] = useState(0);
  const [minWp, setMinWp] = useState(0);
  const [maxWp, setMaxWp] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchBy, setSearchBy] = useState(null);

  useEffect(() => {
    handleGetListProductAgent();
  }, [
    firstCategoryId,
    secondCategoryId,
    thirdCategoryId,
    promotionId,
    status,
    minWp,
    maxWp,
    startDate,
    endDate,
    searchBy,
  ]);

  // 공통 key
  const key = 'productId';

  // 체크 담는 배열
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // 전체 선택
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const currentPageItems = listProduct;
      const newSelectedItems = new Set(selectedItems);
      currentPageItems.forEach((item) => newSelectedItems.add(item[key]));
      setSelectedItems(newSelectedItems);
    } else {
      const currentPageItems = listProduct;
      const newSelectedItems = new Set(selectedItems);
      currentPageItems.forEach((item) => newSelectedItems.delete(item[key]));
      setSelectedItems(newSelectedItems);
    }
  };
  // 전체 체크 여부
  useEffect(() => {
    // 전체 항목 중에서 선택된 항목의 개수를 확인
    const allSelected = listProduct.every((item) =>
      selectedItems.has(item[key]),
    );
    setSelectAll(allSelected); // 모든 항목이 선택되면 selectAll true로 설정, 아니면 false
  }, [selectedItems, listProduct]); // selectedItems와 listProduct 바뀔 때마다 실행
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

  const handleGetListProductAgent = () => {
    if (currentPage === 1) {
      handleGetListProduct();
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
          if (listProduct.length === contentNum) {
            setCurrentPage((prevPage) => prevPage + 1);
          } else {
            handleGetListProduct();
          }
        } else {
          // 1 페이지
          handleGetListProduct();
        }
      }
    }
    lastScrollTop.current = scrollY;
  }, [loading]);

  useEffect(() => {
    if (!isInitList) {
      handleGetListProduct();
    }
  }, [currentPage, contentNum]);

  const handleSetReturnFilter = (ret) => {
    setFirstCategoryId(ret?.firstCategoryId);
    setSecondCategoryId(ret?.secondCategoryId);
    setThirdCategoryId(ret?.thirdCategoryId);
    setPromotionId(ret?.promotionId);
    setStatus(ret?.status);
    setMinWp(ret?.minWp);
    setMaxWp(ret?.maxWp);
    setStartDate(ret?.startDate || null);
    setEndDate(ret?.endDate || null);
    setSearchBy(ret?.searchBy);
  };

  const getNewDatas = (resultDatas, existingDatas) => {
    const existingProductIds = existingDatas.map((item) => item.productId);
    const newDatas = resultDatas.filter(
      (item) => !existingProductIds.includes(item.productId),
    );
    return newDatas;
  };

  const handleGetListProduct = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
    };
    if (utils.isNotEmpty(firstCategoryId)) {
      param.firstCategoryId = firstCategoryId;
    }
    if (utils.isNotEmpty(secondCategoryId)) {
      param.secondCategoryId = secondCategoryId;
    }
    if (utils.isNotEmpty(thirdCategoryId)) {
      param.thirdCategoryId = thirdCategoryId;
    }
    if (utils.isNotEmpty(promotionId)) {
      param.promotionId = promotionId;
    }
    if (utils.isNotEmpty(status)) {
      param.status = status;
    }
    if (utils.isNotEmpty(minWp)) {
      param.minWp = minWp;
    }
    if (utils.isNotEmpty(maxWp)) {
      param.maxWp = maxWp;
    }
    if (startDate && endDate) {
      param.startDate = startDate;
      param.endDate = endDate;
    }
    if (searchBy) {
      param.searchBy = searchBy;
    }

    const result = await productApi.getListProduct(param);
    try {
      setIsInitList(false);
      if (result?.errorCode === SUCCESS) {
        if (currentPage === 1) {
          setProductCountByStatus(result.productCountByStatus);
        }
        setListProduct(result.datas);
        setTotalCount(result.totalCount);
      } else {
        if (currentPage === 1) {
          setProductCountByStatus({
            totalProductCount: 0,
            inProductCount: 0,
            stopProductCount: 0,
            soldOutProductCount: 0,
          });
        }
        setListProduct([]);
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
    }
  });

  const handleDeleteProduct = async () => {
    const param = {
      productIds: Array.from(selectedItems),
    };
    const result = await productApi.deleteProduct(param);
    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result.message,
        onAgree: () => {
          handleGetListProductAgent();
        },
      });
    } else {
      openModal({ text: result.message });
    }
  };

  const productCard = useCallback((item, index) => {
    const handleGetStatus = (status) => {
      if (status === 1) {
        return localeText(LANGUAGES.PRODUCTS.ON_SALE);
      } else if (status === 2) {
        return localeText(LANGUAGES.PRODUCTS.STOP_SELLING);
      } else if (status === 3) {
        return localeText(LANGUAGES.PRODUCTS.OUT_OF_STOCK);
      }
    };

    const productId = item?.productId || 1;
    const name = item?.name || '';
    const status = item?.status || 1;
    const msrp = item?.msrp || 20;
    const wp = item?.wp || 15;
    const stockCnt = item?.stockCnt;
    const thirdCategoryName = item?.thirdCategoryName || '';
    const firstCategoryName = item?.firstCategoryName || '';
    const secondCategoryName = item?.secondCategoryName || '';
    const cartCnt = item?.cartCnt || 0;
    const favoritesCnt = item?.favoritesCnt || 0;
    const viewCnt = item?.viewCnt || 0;
    const productImageList = item?.productImageList || [];

    let firstImageSrc = null;
    if (productImageList.length > 0) {
      firstImageSrc = productImageList[0].imageS3Url;
    }

    return (
      <Tr
        key={index}
        w={'100%'}
        px={'1rem'}
        py={'0.75rem'}
        borderBottom={'1px solid #73829D'}
        boxSizing={'border-box'}
      >
        <Td>
          <CustomCheckBox
            isChecked={selectedItems.has(item[key])}
            onChange={() => handleItemSelect(item)}
          />
        </Td>
        <Td>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.getPageContentNum(
              index,
              currentPage,
              totalCount,
              contentNum,
            )}
          </Text>
        </Td>
        <Td
          w={'19.875rem'}
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
        </Td>
        <Td>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseDallar(wp)}
          </Text>
        </Td>
        <Td>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseDallar(msrp)}
          </Text>
        </Td>
        <Td>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {handleGetStatus(status)}
          </Text>
        </Td>
        <Td>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {stockCnt !== 0
              ? utils.parseAmount(stockCnt)
              : localeText(LANGUAGES.INFO_MSG.NOT_APPLICABLE)}
          </Text>
        </Td>
        <Td>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseAmount(viewCnt)}
          </Text>
        </Td>
        <Td>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseAmount(favoritesCnt)}
          </Text>
        </Td>
        <Td>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseAmount(cartCnt)}
          </Text>
        </Td>
      </Tr>
    );
  });

  return (
    <MainContainer
      contentHeader={
        <Box minW={'7rem'} h={'3rem'}>
          <Button
            onClick={() => {
              resetSelectedProducts();
              moveProductAdd();
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
              {localeText(LANGUAGES.PRODUCTS.ADD)}
            </Text>
          </Button>
        </Box>
      }
    >
      <Box w={'100%'}>
        <VStack spacing={'2.5rem'} alignItems={'flex-start'}>
          <Box w={'100%'}>
            <FilterSearchInput
              onFilter={onFilter}
              setOnFilter={setOnFilter}
              returnFilter={(ret) => {
                handleSetReturnFilter(ret);
              }}
              placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
            />
          </Box>

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
                          {`${localeText(LANGUAGES.PRODUCTS.ALL)} (${utils.parseAmount(productCountByStatus.totalProductCount)})`}
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
                          {`${localeText(LANGUAGES.PRODUCTS.ON_SALE)} (${utils.parseAmount(productCountByStatus.inProductCount)})`}
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
                          {`${localeText(LANGUAGES.PRODUCTS.STOP_SELLING)} (${utils.parseAmount(productCountByStatus.stopProductCount)})`}
                        </Text>
                      </Box>
                      <Box
                        py={'0.5rem'}
                        cursor={'pointer'}
                        onClick={() => {
                          setStatus(3);
                        }}
                      >
                        <Text
                          textAlign={'center'}
                          color={status === 3 ? '#66809C' : '#A7C3D2'}
                          fontSize={'0.9375rem'}
                          fontWeight={status === 3 ? 600 : 400}
                          lineHeight={'1.5rem'}
                        >
                          {`${localeText(LANGUAGES.PRODUCTS.OUT_OF_STOCK)} (${utils.parseAmount(productCountByStatus.soldOutProductCount)})`}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box minW={'7rem'} h={'3rem'}>
                    <Button
                      onClick={() => {
                        setTimeout(() => {
                          const deleteIds = Array.from(selectedItems);
                          if (deleteIds.length === 0) {
                            setTimeout(() => {
                              openModal({
                                text: localeText(
                                  LANGUAGES.INFO_MSG.SELECT_PRODUCT_MSG,
                                ),
                              });
                            });
                            return;
                          }
                          openModal({
                            type: 'confirm',
                            text: localeText(
                              LANGUAGES.INFO_MSG.DELETE_PRODUCT_MSG,
                            ),
                            onAgree: () => {
                              handleDeleteProduct();
                            },
                          });
                        });
                      }}
                      px={'1.75rem'}
                      py={'0.62rem'}
                      border={'1px solid #D4C29D'}
                      borderRadius={'0.25rem'}
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
                        color={'#D4C29D'}
                        fontSize={'1rem'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.PRODUCTS.DELETE_SELECTION)}
                      </Text>
                    </Button>
                  </Box>
                </HStack>
              </Box>
              <Box w={'100%'}>
                <TableContainer w="100%">
                  <Table>
                    <Thead>
                      <Tr
                        w={'100%'}
                        borderTop={'1px solid #73829D'}
                        borderBottom={'1px solid #73829D'}
                        px={'1rem'}
                        py={'0.75rem'}
                        boxSizing={'border-box'}
                      >
                        <Th w="50px" maxW={'50px'}>
                          <Center>
                            <CustomCheckBox
                              isChecked={selectAll}
                              onChange={handleSelectAll}
                            />
                          </Center>
                        </Th>
                        <Th>
                          <Text
                            textAlign={'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.NUMBER)}
                          </Text>
                        </Th>
                        <Th>
                          <Text
                            textAlign={'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.PRODUCT)}
                          </Text>
                        </Th>
                        <Th>
                          <Text
                            textAlign={'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.SUPPLY_PRICE)}
                          </Text>
                        </Th>
                        <Th>
                          <Text
                            textAlign={'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.MSRP)}
                          </Text>
                        </Th>
                        <Th>
                          <Text
                            textAlign={'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.STATE)}
                          </Text>
                        </Th>
                        <Th>
                          <Text
                            textAlign={'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.STOCK)}
                          </Text>
                        </Th>
                        <Th>
                          <Text
                            textAlign={'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.VIEW)}
                          </Text>
                        </Th>
                        <Th>
                          <Text
                            textAlign={'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.WISH)}
                          </Text>
                        </Th>
                        <Th>
                          <Text
                            textAlign={'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.CART)}
                          </Text>
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {listProduct.map((item, index) => {
                        return productCard(item, index);
                      })}
                      {listProduct.length === 0 && (
                        <Tr>
                          <Td colSpan={10}>
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
                        setContentNum(Number(e.target.value));
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

export default WebProductPage;
