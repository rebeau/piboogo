'use client';

import { LANGUAGES } from '@/constants/lang';
import { MGNT } from '@/constants/pageURL';
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
  Tr,
  Td,
  TableContainer,
  Table,
  Tbody,
  Thead,
  Th,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import IconRight from '@public/svgs/icon/right.svg';
import utils from '@/utils';
import { DefaultPaginate } from '@/components';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import MainContainer from '@/components/layout/MainContainer';
import productApi from '@/services/productApi';
import { LIST_CONTENT_NUM } from '@/constants/common';
import { selectdProductState } from '@/stores/dataRecoil';
import { useResetRecoilState } from 'recoil';
import { SUCCESS } from '@/constants/errorCode';
import useModal from '@/hooks/useModal';
import useMove from '@/hooks/useMove';
import CustomCheckBox from '@/components/common/checkbox/CustomCheckBox';
import FilterSearchInput from '@/components/custom/input/FilterSearchInput';
import promotionApi from '@/services/promotionApi';

const ProductsPage = () => {
  const router = useRouter();
  const { moveProductDetail } = useMove();
  const { openModal } = useModal();
  const { localeText } = useLocale();

  const [listProduct, setListProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);
  const [productCountByStatus, setProductCountByStatus] = useState({
    totalProductCount: 0,
    inProductCount: 0,
    stopProductCount: 0,
    soldOutProductCount: 0,
  });

  const resetSelectdProduct = useResetRecoilState(selectdProductState);

  const [isFilterSearch, setIsFilterSearch] = useState(false);

  const [initFlag, setInitData] = useState(true);
  const [onFilter, setOnFilter] = useState(null);

  const [firstCategoryId, setFirstCategoryId] = useState(0);
  const [secondCategoryId, setSecondCategoryId] = useState(0);
  const [thirdCategoryId, setThirdCategoryId] = useState(0);
  const [promotionId, setPromotionId] = useState(0);
  const [status, setStatus] = useState(0);
  const [minWp, setMinWp] = useState(0);
  const [maxWp, setMaxWp] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [productName, setProductName] = useState(null);

  useEffect(() => {
    if (isFilterSearch) {
      handleGetListProductAgent();
      setIsFilterSearch(false);
    }
  }, [
    isFilterSearch,
    //
    firstCategoryId,
    secondCategoryId,
    thirdCategoryId,
    promotionId,
    status,
    minWp,
    maxWp,
    startDate,
    endDate,
    productName,
  ]);

  const handleSetReturnFilter = (ret) => {
    setFirstCategoryId(ret?.firstCategoryId);
    setSecondCategoryId(ret?.secondCategoryId);
    setThirdCategoryId(ret?.thirdCategoryId);
    setPromotionId(ret?.promotionId);
    setStatus(ret?.status || 0);
    setMinWp(ret?.minWp);
    setMaxWp(ret?.maxWp);
    setStartDate(ret?.startDate || null);
    setEndDate(ret?.endDate || null);
    setProductName(ret?.searchBy);
    setTimeout(() => {
      setIsFilterSearch(true);
    });
  };

  const key = 'productId';

  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

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
  useEffect(() => {
    const allSelected = listProduct.every((item) =>
      selectedItems.has(item[key]),
    );
    setSelectAll(allSelected);
  }, [selectedItems, listProduct]);

  const handleItemSelect = (item) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(item[key])) {
      newSelectedItems.delete(item[key]);
    } else {
      newSelectedItems.add(item[key]);
    }
    setSelectedItems(newSelectedItems);
  };

  useEffect(() => {
    handleGetListProduct();
  }, [currentPage]);

  useEffect(() => {
    if (!initFlag) {
      handleGetListProductAgent();
    }
  }, [contentNum, status]);

  const handleGetListProductAgent = () => {
    if (currentPage === 1) {
      handleGetListProduct();
    } else {
      setCurrentPage(1);
    }
  };

  const handleGetListProduct = async () => {
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
    if (status !== 0) {
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
    if (productName) {
      param.productName = productName;
    }
    const result = await productApi.getListProduct(param);
    setInitData(false);
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
      setTotalCount(result.totalCount);
    }
  };

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
    const stockCnt = item?.stockCnt || 100;
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
          onClick={() => {
            moveProductDetail(productId);
          }}
          cursor={'pointer'}
        >
          <HStack spacing={'0.75rem'}>
            <Center w={'5rem'} minW={'5rem'} aspectRatio={1}>
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
            {utils.parseAmount(stockCnt)}
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
              // handleUploadFile('logo');
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

              <TableContainer w="100%">
                <Table>
                  <Thead>
                    <Tr
                      borderTop={'1px solid #73829D'}
                      borderBottom={'1px solid #73829D'}
                    >
                      <Th w="50px" maxW="50px">
                        <CustomCheckBox
                          isChecked={selectAll}
                          onChange={handleSelectAll}
                        />
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
                          {localeText(LANGUAGES.PRODUCTS.SALES_AMOUNT)}
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

              <Box />
            </VStack>
          </Box>
        </VStack>
      </Box>
    </MainContainer>
  );
};

export default ProductsPage;
