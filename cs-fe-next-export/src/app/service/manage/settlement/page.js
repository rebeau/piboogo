'use client';

import ContentHeader from '@/components/layout/header/ContentHeader';
import {
  Box,
  Center,
  Divider,
  HStack,
  Img,
  Text,
  VStack,
  Select,
  Tbody,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Collapse,
  Image,
  Button,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import React, { use, useCallback, useEffect, useRef, useState } from 'react';
import { DefaultPaginate } from '@/components';
import SearchInput from '@/components/custom/input/SearchInput';
import MonthDatePicker from '@/components/date/MonthDatePicker';
import ContentBR from '@/components/common/ContentBR';
import CustomCheckBox from '@/components/common/checkbox/CustomCheckBox';
import MainContainer from '@/components/layout/MainContainer';
import { LIST_CONTENT_NUM } from '@/constants/common';
import settlementApi from '@/services/settlementApi';
import utils from '@/utils';
import { SUCCESS } from '@/constants/errorCode';
import IconRight from '@public/svgs/icon/right.svg';
import useStatus from '@/hooks/useStatus';
import useMove from '@/hooks/useMove';
import useModal from '@/hooks/useModal';
import ReturnInputForm from '@/components/custom/page/settlement/ReturnInputForm';

const SettlementPage = () => {
  const { openModal } = useModal();
  const [tabIndex, setTabIndex] = useState(0);
  const { moveBuyerDetail } = useMove();
  const { handleGetSettlementStatus } = useStatus();
  const router = useRouter();
  const { lang, localeText } = useLocale();
  const now = new Date();
  const firstDayOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
    0,
    0,
    0,
  );
  const lastDayOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
  );

  const [settlementStatistics, setSettlementStatistics] = useState({
    totalSettlementAmount: 0,
    readyTotalSettlementAmount: 0,
    successTotalSettlementAmount: 0,
  });

  const [openIndex, setOpenIndex] = useState(null);

  const toggleOpen = async (sellerUserId) => {
    if (openIndex === sellerUserId) {
      setOpenIndex(null);
      return;
    }

    const current = listSettlement.find(
      (item) => item.sellerUserId === sellerUserId,
    );

    if (!current.items || current.items.length === 0) {
      try {
        const response = await handleGetListSettlement(sellerUserId);
        const updatedList = listSettlement.map((item) =>
          item.sellerUserId === sellerUserId
            ? { ...item, items: response }
            : item,
        );
        setListSettlement(updatedList);
      } catch (e) {
        console.error('정산 상세 불러오기 실패:', e);
      }
    }

    setOpenIndex(sellerUserId);
  };

  const [searchBy, setSearchBy] = useState('');

  const [listSettlement, setListSettlement] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);
  const [totalCount, setTotalCount] = useState(1);
  const [sellerPayStatus, setSellerPayStatus] = useState(0);

  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(lastDayOfMonth);

  const [selectSellerPayStatus, setSelectSellerPayStatus] = useState(1);

  const tableHeader = [
    { width: '50px', title: '' },
    { width: '8.3rem', title: localeText(LANGUAGES.SETTLEMENT.BUSINESS) },
    {
      width: '22rem',
      title: localeText(LANGUAGES.SETTLEMENT.PRODUCT),
    },
    { width: '5rem', title: localeText(LANGUAGES.SETTLEMENT.PRICE) },
    { width: '4rem', title: localeText(LANGUAGES.SETTLEMENT.QTY) },
    {
      width: '5rem',
      title: localeText(LANGUAGES.SETTLEMENT.SALES),
    },
    { width: '5rem', title: localeText(LANGUAGES.SETTLEMENT.FEE) },
    { width: '5rem', title: localeText(LANGUAGES.SETTLEMENT.COUPON) },
    {
      width: '5rem',
      title: localeText(LANGUAGES.SETTLEMENT.COIN),
    },
    { width: '7.9rem', title: localeText(LANGUAGES.SETTLEMENT.SETTLEMENT) },
    { width: '8.3rem', title: localeText(LANGUAGES.SETTLEMENT.BUYER) },
    {
      width: 'max-content',
      title: localeText(LANGUAGES.SETTLEMENT.SETTLEMENT_STATUS),
    },
    { width: '8.125rem', title: localeText(LANGUAGES.SETTLEMENT.DATE_OF_SALE) },
    { width: '10rem', title: '' },
  ];

  useEffect(() => {
    handleGetListSettlementSellerAgent();
  }, [startDate, endDate, tabIndex]);

  useEffect(() => {
    if (listSettlement.length > 0 && !openIndex) {
      const sellerUserId = listSettlement[0].sellerUserId;
      toggleOpen(sellerUserId);
    }
  }, [listSettlement]);

  const handleGetListSettlementSellerAgent = () => {
    setSelectedMap({});
    if (currentPage === 1) {
      handleGetListSettlementSeller();
    } else {
      setCurrentPage(1);
    }
  };

  const handleGetListSettlementSeller = async () => {
    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
      startDate: utils.parseDateToStr(startDate, ''),
      endDate: utils.parseDateToStr(endDate, ''),
    };
    if (tabIndex !== 0) {
      param.sellerPayStatus = tabIndex;
    }
    if (searchBy !== 0) {
      param.searchBy = searchBy;
    }

    const result = await settlementApi.getListSettlementSeller(param);
    if (result?.errorCode === SUCCESS) {
      const { datas, totalCount, settlementStatistics } = result;
      if (currentPage === 1) {
        setSettlementStatistics(settlementStatistics);
      }
      setListSettlement(datas);
      setTotalCount(totalCount);
    } else {
      setSettlementStatistics({
        totalSettlementAmount: 0,
        readyTotalSettlementAmount: 0,
        successTotalSettlementAmount: 0,
      });
      setListSettlement([]);
      setTotalCount(1);
    }
  };

  const handleGetListSettlement = async (sellerUserId) => {
    const param = {
      sellerUserId: sellerUserId,
      startDate: utils.parseDateToStr(startDate, ''),
      endDate: utils.parseDateToStr(endDate, ''),
    };
    if (sellerPayStatus !== 0) {
      param.sellerPayStatus = sellerPayStatus;
    }

    const result = await settlementApi.getListSettlement(param);
    if (result?.errorCode === SUCCESS) {
      const { datas } = result;
      return datas;
    }
  };

  const handlePatchSettlementStatus = async () => {
    console.log('handlePatchSettlementStatus');
    const allOrdersId = Object.values(selectedMap).flatMap((set) =>
      Array.from(set),
    );

    if (allOrdersId.length === 0) {
      openModal({ text: localeText(LANGUAGES.INFO_MSG.SELECT_AN_ORDER) });
    } else {
      const param = [];
      allOrdersId.map((orderIn) => {
        let tempParam = {
          ordersId: orderIn,
          sellerPayStatus: selectSellerPayStatus,
        };
        param.push(tempParam);
      });
      const result = await settlementApi.patchSettlementSellerPayStatus(param);
      if (result?.errorCode === SUCCESS) {
        openModal({
          text: result.message,
          onAgree: () => {
            handleGetListSettlementSellerAgent();
          },
        });
      } else {
        openModal({ text: result.message });
      }
    }
    // selectSellerPayStatus
    // console.log('전체 ordersId:', allOrdersId);
  };

  const [selectedMap, setSelectedMap] = useState({});

  const isAllSelected = () => {
    if (!selectedMap) return false;
    return listSettlement.every((user) => {
      const sellerUserId = user?.sellerUserId;
      const items = user?.items || [];
      const selectedProducts = selectedMap[sellerUserId];
      return selectedProducts && selectedProducts.size === items.length;
    });
  };

  const handleSelectAll = () => {
    if (isAllSelected()) {
      setSelectedMap({});
    } else {
      const allSelected = {};
      listSettlement.forEach((user) => {
        const sellerUserId = user?.sellerUserId;
        const items = user?.items || [];
        allSelected[sellerUserId] = new Set(items.map((item) => item.ordersId));
      });
      setSelectedMap(allSelected);
    }
  };

  const handleSelectUser = async (user) => {
    const sellerUserId = user?.sellerUserId;
    const items = user?.items || [];
    if (items?.length > 0) {
      setSelectedMap((prev) => {
        const selectedProducts = prev[sellerUserId];
        const allItemIds = new Set(items.map((item) => item.ordersId));

        const isFullySelected =
          selectedProducts && selectedProducts.size === items.length;

        if (isFullySelected) {
          const newMap = { ...prev };
          delete newMap[sellerUserId];
          return newMap;
        } else {
          return {
            ...prev,
            [sellerUserId]: allItemIds,
          };
        }
      });
    } else {
      await toggleOpen(sellerUserId);
      const updatedUser = listSettlement.find(
        (user) => user.sellerUserId === sellerUserId,
      );
      if (updatedUser?.items?.length > 0) {
        await handleSelectUser(updatedUser);
      }
    }
  };

  const handleSelectOrders = (userId, ordersId) => {
    setSelectedMap((prev) => {
      const current = prev[userId] ?? new Set();
      if (current.has(ordersId)) {
        const newSet = new Set(current);
        newSet.delete(ordersId);
        if (newSet.size === 0) {
          const newMap = { ...prev };
          delete newMap[userId];
          return newMap;
        }
        return { ...prev, [userId]: newSet };
      } else {
        const newSet = new Set(current);
        newSet.add(ordersId);
        return { ...prev, [userId]: newSet };
      }
    });
  };

  return (
    <MainContainer
      contentHeader={
        <Box>
          <MonthDatePicker
            handleOnChangeDate={(date) => {
              setStartDate(date.startDate);
              setEndDate(date.endDate);
            }}
          />
        </Box>
      }
    >
      <Box
        w={'100%'}
        h={'7.25rem'}
        p={'1.25rem'}
        bg={'#90aec412'}
        border={'1px solid #AEBDCA'}
        borderRadius={'0.25rem'}
        boxSizing={'border-box'}
      >
        <HStack spacing={'1.25rem'}>
          <Box w={'33%'} maxW={'33%'}>
            <VStack spacing={'1rem'}>
              <Box w={'100%'}>
                <Box>
                  <Text
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    color={'#66809C'}
                    lineHeight={'1.5rem'}
                  >
                    {localeText(LANGUAGES.SETTLEMENT.TOTAL_SETTLEMENT_AMOUNT)}
                  </Text>
                </Box>
              </Box>
              <Box w={'100%'}>
                <Text
                  fontSize={'1.25rem'}
                  fontWeight={500}
                  lineHeight={'2.25rem'}
                  color={'#485766'}
                  textAlign={'right'}
                >
                  {utils.parseDallar(
                    settlementStatistics.totalSettlementAmount,
                  )}
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
          <Box w={'33%'} maxW={'33%'}>
            <VStack spacing={'1rem'}>
              <Box w={'100%'}>
                <Box>
                  <Text
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    color={'#66809C'}
                    lineHeight={'1.5rem'}
                  >
                    {localeText(LANGUAGES.SETTLEMENT.PENDING_SETTLEMENT)}
                  </Text>
                </Box>
              </Box>
              <Box w={'100%'}>
                <Text
                  fontSize={'1.25rem'}
                  fontWeight={500}
                  lineHeight={'2.25rem'}
                  color={'#485766'}
                  textAlign={'right'}
                >
                  {utils.parseDallar(
                    settlementStatistics.readyTotalSettlementAmount,
                  )}
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
          <Box w={'33%'} maxW={'33%'}>
            <VStack spacing={'1rem'}>
              <Box w={'100%'}>
                <Box>
                  <Text
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    color={'#66809C'}
                    lineHeight={'1.5rem'}
                  >
                    {localeText(LANGUAGES.SETTLEMENT.SETTLEMENT_COMPLETED)}
                  </Text>
                </Box>
              </Box>
              <Box w={'100%'}>
                <Text
                  fontSize={'1.25rem'}
                  fontWeight={500}
                  lineHeight={'2.25rem'}
                  color={'#485766'}
                  textAlign={'right'}
                >
                  {utils.parseDallar(
                    settlementStatistics.successTotalSettlementAmount || 0,
                  )}
                </Text>
              </Box>
            </VStack>
          </Box>
        </HStack>
      </Box>

      <ContentBR h={'2.5rem'} />

      <Box w={'100%'}>
        <HStack justifyContent={'space-between'} alignItems={'center'}>
          <Box>
            <HStack spacing={'2.5rem'}>
              <Box
                py={'0.5rem'}
                cursor={'pointer'}
                onClick={() => {
                  setTabIndex(0);
                }}
              >
                <Text
                  textAlign={'center'}
                  color={tabIndex === 0 ? '#66809C' : '#A7C3D2'}
                  fontSize={'0.9375rem'}
                  fontWeight={tabIndex === 0 ? 600 : 400}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.PRODUCTS.ALL)}
                </Text>
              </Box>
              <Box
                py={'0.5rem'}
                cursor={'pointer'}
                onClick={() => {
                  setTabIndex(1);
                }}
              >
                <Text
                  textAlign={'center'}
                  color={tabIndex === 1 ? '#66809C' : '#A7C3D2'}
                  fontSize={'0.9375rem'}
                  fontWeight={tabIndex === 1 ? 600 : 400}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.SETTLEMENT.WAIT_FOR_SETTLEMENT)}
                </Text>
              </Box>
              <Box
                py={'0.5rem'}
                cursor={'pointer'}
                onClick={() => {
                  setTabIndex(2);
                }}
              >
                <Text
                  textAlign={'center'}
                  color={tabIndex === 2 ? '#66809C' : '#A7C3D2'}
                  fontSize={'0.9375rem'}
                  fontWeight={tabIndex === 2 ? 600 : 400}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.SETTLEMENT.SETTLED)}
                </Text>
              </Box>
              <Box
                py={'0.5rem'}
                cursor={'pointer'}
                onClick={() => {
                  setTabIndex(3);
                }}
              >
                <Text
                  textAlign={'center'}
                  color={tabIndex === 3 ? '#66809C' : '#A7C3D2'}
                  fontSize={'0.9375rem'}
                  fontWeight={tabIndex === 3 ? 600 : 400}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.SETTLEMENT.CANCELED)}
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
                handleGetListSettlementSellerAgent();
              }}
              placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
              placeholderFontColor={'#A7C3D2'}
            />
          </Box>
        </HStack>
      </Box>

      <ContentBR h={'1.25rem'} />

      <Box w={'100%'}>
        <HStack justifyContent={'space-between'} alignItems={'center'}>
          <Box>
            <Text
              color={'#A87C4E'}
              fontSize={'0.875rem'}
              fontWeight={400}
              lineHeight={'1.4rem'}
              whiteSpace={'pre-wrap'}
            >
              {localeText(LANGUAGES.SETTLEMENT.INFO_TOTAL_SETTLEMENT)}
            </Text>
          </Box>
          <Box>
            <HStack justifyContent={'space-between'}>
              <Box>
                <Select
                  value={selectSellerPayStatus}
                  onChange={(e) => {
                    setSelectSellerPayStatus(Number(e.target.value));
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
                    {localeText(LANGUAGES.SETTLEMENT.WAIT_FOR_SETTLEMENT)}
                  </option>
                  <option value={2}>
                    {localeText(LANGUAGES.SETTLEMENT.SETTLED)}
                  </option>
                  <option value={3}>
                    {localeText(LANGUAGES.SETTLEMENT.CANCELED)}
                  </option>
                </Select>
              </Box>

              <Box>
                <Button
                  onClick={() => {
                    handlePatchSettlementStatus();
                  }}
                  px={'1rem'}
                  py={'0.63rem'}
                  borderRadius={'0.25rem'}
                  boxSizing={'border-box'}
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
                    {localeText(LANGUAGES.SETTLEMENT.MODIFY_STATUS)}
                  </Text>
                </Button>
              </Box>
            </HStack>
          </Box>
        </HStack>
      </Box>

      <ContentBR h={'1.25rem'} />

      <Box w={'100%'}>
        <TableContainer w={'100%'}>
          <Table w={'100%'} tableLayout="fixed">
            <Thead
              w={'100%'}
              borderTop={'1px solid #73829D'}
              borderBottom={'1px solid #73829D'}
              px={'1rem'}
              py={'0.75rem'}
            >
              <Tr>
                {tableHeader.map((item, index) => {
                  const hasData = listSettlement.length > 0;
                  if (index === 0) {
                    return (
                      <Th
                        px={'0.25rem'}
                        key={index}
                        minW={item.width}
                        w={item.width}
                        maxW={item.width}
                      >
                        <CustomCheckBox
                          isChecked={isAllSelected()}
                          onChange={handleSelectAll}
                        />
                      </Th>
                    );
                  }
                  return (
                    <Th
                      px={'0.25rem'}
                      key={index}
                      minW={hasData && item.width}
                      w={hasData && item.width}
                      maxW={hasData && item.width}
                    >
                      <Text
                        minW={'100%'}
                        w={'100%'}
                        maxW={'100%'}
                        textAlign={'center'}
                        color={'#2A333C'}
                        fontSize={lang === 'KR' ? '0.81rem' : '0.9375rem'}
                        fontWeight={500}
                        lineHeight={'1.5rem'}
                      >
                        {item.title}
                      </Text>
                    </Th>
                  );
                })}
              </Tr>
            </Thead>
            {listSettlement.length > 0 && (
              <Tbody>
                {listSettlement.map((item, index) => {
                  const sellerUserId = item?.sellerUserId;
                  const items = item?.items || [];

                  const userChecked =
                    selectedMap[sellerUserId]?.size === items.length;

                  const brandName = item?.brandName;
                  const bankName = item?.bankName;
                  const bankNumber = item?.bankNumber;
                  const settlementAmount = item?.settlementAmount;
                  const readySettlementAmount = item?.readySettlementAmount;
                  const successSettlementAmount = item?.successSettlementAmount;

                  return (
                    <React.Fragment key={index}>
                      <Tr
                        cursor={'pointer'}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          toggleOpen(sellerUserId);
                        }}
                      >
                        <Td
                          px={'0.25rem'}
                          minW={tableHeader[0].width}
                          w={tableHeader[0].width}
                          maxW={tableHeader[0].width}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleSelectUser(item);
                          }}
                        >
                          <CustomCheckBox isChecked={userChecked} />
                        </Td>
                        <Td
                          px={'0.25rem'}
                          minW={tableHeader[1].width}
                          w={tableHeader[1].width}
                          maxW={tableHeader[1].width}
                        >
                          <Text
                            w="100%"
                            textAlign={'center'}
                            fontSize={'0.9375rem'}
                            color={'#485766'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                            whiteSpace={'nowrap'}
                            overflow={'hidden'}
                            textOverflow={'ellipsis'}
                          >
                            {brandName}
                          </Text>
                        </Td>
                        <Td colSpan={12}>
                          <HStack w={'full'}>
                            <Box w="21%">
                              <Text
                                textAlign={'center'}
                                fontSize={'0.9375rem'}
                                color={'#66809C'}
                                fontWeight={400}
                              >
                                {localeText(
                                  LANGUAGES.SETTLEMENT.TOTAL_SETTLEMENT_AMOUNT,
                                )}
                                <br />
                                {utils.parseDallar(settlementAmount)}
                              </Text>
                            </Box>
                            <Box w="22%">
                              <Text
                                textAlign={'center'}
                                fontSize={'0.9375rem'}
                                color={'#66809C'}
                                fontWeight={400}
                              >
                                {localeText(
                                  LANGUAGES.SETTLEMENT.WAIT_FOR_SETTLEMENT,
                                )}
                                <br />
                                {utils.parseDallar(readySettlementAmount)}
                              </Text>
                            </Box>
                            <Box w="22%">
                              <Text
                                textAlign={'center'}
                                fontSize={'0.9375rem'}
                                color={'#66809C'}
                                fontWeight={400}
                              >
                                {localeText(LANGUAGES.SETTLEMENT.SETTLED)}
                                <br />
                                {utils.parseDallar(successSettlementAmount)}
                              </Text>
                            </Box>
                            <Box w="30%">
                              <Text
                                textAlign={'center'}
                                fontSize={'0.9375rem'}
                                color={'#66809C'}
                                fontWeight={400}
                              >
                                {localeText(
                                  LANGUAGES.SETTLEMENT.SETTLEMENT_ACCOUNT,
                                )}
                                <br />
                                {`${bankName} ${bankNumber}`}
                              </Text>
                            </Box>
                          </HStack>
                        </Td>
                      </Tr>

                      {items.length > 0 && (
                        <Tr w="100%" bg="#90AEC412">
                          <Td colSpan={14} p={0} border="none">
                            <Collapse
                              in={openIndex === sellerUserId}
                              animateOpacity
                            >
                              <Box w="100%">
                                <Table size="sm" width="100%">
                                  <Tbody>
                                    {items.map((item, idx) => {
                                      const sellerUserId = item?.sellerUserId;
                                      const ordersId = item?.ordersId;

                                      const productChecked =
                                        selectedMap[sellerUserId]?.has(
                                          ordersId,
                                        ) ?? false;

                                      const createdAt = item?.createdAt;
                                      const brandName = item?.brandName;

                                      const sellerPayStatus =
                                        item?.sellerPayStatus;
                                      const settlementAmount =
                                        item?.settlementAmount || 0;
                                      const buyerUserId = item?.buyerUserId;
                                      const discountAmount =
                                        item?.discountAmount || 0;
                                      const totalAmount =
                                        item?.totalAmount || 0;
                                      const actualAmount =
                                        item?.actualAmount || 0;
                                      const feeAmount = item?.feeAmount || 0;
                                      const bundleDiscountAmount =
                                        item?.bundleDiscountAmount || 0;
                                      const couponDiscountAmount =
                                        item?.couponDiscountAmount || 0;
                                      const rewardDiscountAmount =
                                        item?.rewardDiscountAmount || 0;
                                      const buyerName = item?.buyerName;
                                      const ordersProductList =
                                        item?.ordersProductList || [];

                                      return ordersProductList.map(
                                        (orderItem, idx) => {
                                          const name = orderItem?.name;
                                          const count = orderItem?.count;
                                          const productId =
                                            orderItem?.productId;
                                          const firstCategoryName =
                                            orderItem?.firstCategoryName;
                                          const secondCategoryName =
                                            orderItem?.secondCategoryName;
                                          const thirdCategoryName =
                                            orderItem?.thirdCategoryName;
                                          const ordersProductId =
                                            orderItem?.ordersProductId;
                                          const unitPrice =
                                            orderItem?.unitPrice;
                                          const productImageList =
                                            orderItem?.productImageList;

                                          let firstImage = '';
                                          if (productImageList.length > 0) {
                                            firstImage =
                                              productImageList[0].imageS3Url;
                                          }

                                          return (
                                            <Tr
                                              key={idx}
                                              w={'100%'}
                                              h={'100%'}
                                              px={'1rem'}
                                              py={'0.75rem'}
                                              borderBottom={
                                                items.length - 1 === index
                                                  ? '1px solid #73829D'
                                                  : null
                                              }
                                              boxSizing={'border-box'}
                                            >
                                              <Td
                                                px={'0.25rem'}
                                                minW={tableHeader[0].width}
                                                w={tableHeader[0].width}
                                                maxW={tableHeader[0].width}
                                              >
                                                <CustomCheckBox
                                                  isChecked={productChecked}
                                                  onChange={() =>
                                                    handleSelectOrders(
                                                      item.sellerUserId,
                                                      item.ordersId,
                                                    )
                                                  }
                                                />
                                              </Td>
                                              <Td
                                                px={'0.25rem'}
                                                minW={tableHeader[1].width}
                                                w={tableHeader[1].width}
                                                maxW={tableHeader[1].width}
                                              >
                                                <Text
                                                  w="100%"
                                                  maxW={'100%'}
                                                  textAlign={'center'}
                                                  color={'#485766'}
                                                  fontSize={'0.9357rem'}
                                                  fontWeight={500}
                                                  lineHeight={'1.5rem'}
                                                  // whiteSpace={'normal'}
                                                  whiteSpace={'nowrap'}
                                                  overflow={'hidden'}
                                                  textOverflow={'ellipsis'}
                                                >
                                                  {brandName}
                                                </Text>
                                              </Td>
                                              <Td
                                                px={'0.25rem'}
                                                minW={tableHeader[2].width}
                                                w={tableHeader[2].width}
                                                maxW={tableHeader[2].width}
                                              >
                                                <HStack
                                                  w="100%"
                                                  spacing={'0.75rem'}
                                                >
                                                  {firstImage && (
                                                    <Center
                                                      w={'5rem'}
                                                      maxW={'5rem'}
                                                      aspectRatio={1}
                                                    >
                                                      <Image
                                                        w={'100%'}
                                                        h={'100%'}
                                                        src={firstImage}
                                                        objectFit={'cover'}
                                                      />
                                                    </Center>
                                                  )}
                                                  <Box
                                                    minW={'calc(100% - 6rem)'}
                                                    w="calc(100% - 6rem)"
                                                    maxW={'calc(100% - 6rem)'}
                                                  >
                                                    <VStack
                                                      w="100%"
                                                      spacing={'0.5rem'}
                                                    >
                                                      <Text
                                                        w="100%"
                                                        color={'#485766'}
                                                        fontSize={'0.9357rem'}
                                                        fontWeight={500}
                                                        lineHeight={'1.5rem'}
                                                      >
                                                        {name}
                                                      </Text>
                                                      <Box w="100%">
                                                        <HStack
                                                          w="100%"
                                                          spacing={'0.25rem'}
                                                          alignItems={'center'}
                                                        >
                                                          <Text
                                                            color={'#66809C'}
                                                            fontSize={
                                                              '0.875rem'
                                                            }
                                                            fontWeight={400}
                                                            lineHeight={
                                                              '1.4rem'
                                                            }
                                                            opacity={'0.7'}
                                                          >
                                                            {firstCategoryName}
                                                          </Text>
                                                          {secondCategoryName && (
                                                            <>
                                                              <Center
                                                                w={'1rem'}
                                                                h={'1rem'}
                                                              >
                                                                <Img
                                                                  h={'100%'}
                                                                  src={
                                                                    IconRight.src
                                                                  }
                                                                />
                                                              </Center>
                                                              <Text
                                                                color={
                                                                  '#485766'
                                                                }
                                                                fontSize={
                                                                  '0.875rem'
                                                                }
                                                                fontWeight={400}
                                                                lineHeight={
                                                                  '1.4rem'
                                                                }
                                                                opacity={'0.7'}
                                                              >
                                                                {
                                                                  secondCategoryName
                                                                }
                                                              </Text>
                                                            </>
                                                          )}
                                                          {thirdCategoryName && (
                                                            <>
                                                              <Center
                                                                w={'1rem'}
                                                                h={'1rem'}
                                                              >
                                                                <Img
                                                                  h={'100%'}
                                                                  src={
                                                                    IconRight.src
                                                                  }
                                                                />
                                                              </Center>
                                                              <Text
                                                                color={
                                                                  '#485766'
                                                                }
                                                                fontSize={
                                                                  '0.875rem'
                                                                }
                                                                fontWeight={400}
                                                                lineHeight={
                                                                  '1.4rem'
                                                                }
                                                                opacity={'0.7'}
                                                              >
                                                                {
                                                                  thirdCategoryName
                                                                }
                                                              </Text>
                                                            </>
                                                          )}
                                                        </HStack>
                                                      </Box>
                                                    </VStack>
                                                  </Box>
                                                </HStack>
                                              </Td>
                                              <Td
                                                px={'0.25rem'}
                                                minW={tableHeader[3].width}
                                                w={tableHeader[3].width}
                                                maxW={tableHeader[3].width}
                                              >
                                                <Text
                                                  textAlign={'center'}
                                                  color={'#485766'}
                                                  fontSize={'0.9357rem'}
                                                  fontWeight={400}
                                                  lineHeight={'1.5rem'}
                                                  w={'100%'}
                                                  maxW={'100%'}
                                                  whiteSpace={'normal'}
                                                  // whiteSpace={'nowrap'}
                                                  // overflow={'hidden'}
                                                  // textOverflow={'ellipsis'}
                                                >
                                                  {utils.parseDallar(unitPrice)}
                                                </Text>
                                              </Td>
                                              <Td
                                                px={'0.25rem'}
                                                minW={tableHeader[4].width}
                                                w={tableHeader[4].width}
                                                maxW={tableHeader[4].width}
                                              >
                                                <Text
                                                  textAlign={'center'}
                                                  color={'#485766'}
                                                  fontSize={'0.9357rem'}
                                                  fontWeight={400}
                                                  lineHeight={'1.5rem'}
                                                  w={'100%'}
                                                  maxW={'100%'}
                                                  whiteSpace={'normal'}
                                                  // whiteSpace={'nowrap'}
                                                  // overflow={'hidden'}
                                                  // textOverflow={'ellipsis'}
                                                >
                                                  {utils.parseAmount(count)}
                                                </Text>
                                              </Td>
                                              <Td
                                                px={'0.25rem'}
                                                minW={tableHeader[5].width}
                                                w={tableHeader[5].width}
                                                maxW={tableHeader[5].width}
                                              >
                                                <Text
                                                  textAlign={'center'}
                                                  color={'#485766'}
                                                  fontSize={'0.9375rem'}
                                                  fontWeight={400}
                                                  lineHeight={'1.5rem'}
                                                  w={'100%'}
                                                  maxW={'100%'}
                                                  whiteSpace={'normal'}
                                                  // whiteSpace={'nowrap'}
                                                  // overflow={'hidden'}
                                                  // textOverflow={'ellipsis'}
                                                >
                                                  {utils.parseDallar(
                                                    totalAmount,
                                                  )}
                                                </Text>
                                              </Td>
                                              <Td
                                                px={'0.25rem'}
                                                minW={tableHeader[6].width}
                                                w={tableHeader[6].width}
                                                maxW={tableHeader[6].width}
                                              >
                                                <Text
                                                  textAlign={'center'}
                                                  color={'#485766'}
                                                  fontSize={'0.9375rem'}
                                                  fontWeight={400}
                                                  lineHeight={'1.5rem'}
                                                  w={'100%'}
                                                  maxW={'100%'}
                                                  whiteSpace={'normal'}
                                                  // whiteSpace={'nowrap'}
                                                  // overflow={'hidden'}
                                                  // textOverflow={'ellipsis'}
                                                >
                                                  {utils.parseDallar(feeAmount)}
                                                </Text>
                                              </Td>
                                              <Td
                                                px={'0.25rem'}
                                                minW={tableHeader[7].width}
                                                w={tableHeader[7].width}
                                                maxW={tableHeader[7].width}
                                              >
                                                <Text
                                                  textAlign={'center'}
                                                  color={'#485766'}
                                                  fontSize={'0.9375rem'}
                                                  fontWeight={400}
                                                  lineHeight={'1.5rem'}
                                                  w={'100%'}
                                                  maxW={'100%'}
                                                  whiteSpace={'normal'}
                                                  // whiteSpace={'nowrap'}
                                                  // overflow={'hidden'}
                                                  // textOverflow={'ellipsis'}
                                                >
                                                  {utils.parseDallar(
                                                    couponDiscountAmount,
                                                  )}
                                                </Text>
                                              </Td>
                                              <Td
                                                px={'0.25rem'}
                                                minW={tableHeader[8].width}
                                                w={tableHeader[8].width}
                                                maxW={tableHeader[8].width}
                                              >
                                                <Text
                                                  textAlign={'center'}
                                                  color={'#485766'}
                                                  fontSize={'0.9375rem'}
                                                  fontWeight={400}
                                                  lineHeight={'1.5rem'}
                                                  w={'100%'}
                                                  maxW={'100%'}
                                                  whiteSpace={'normal'}
                                                  // whiteSpace={'nowrap'}
                                                  // overflow={'hidden'}
                                                  // textOverflow={'ellipsis'}
                                                >
                                                  {utils.parseDallar(
                                                    rewardDiscountAmount,
                                                  )}
                                                </Text>
                                              </Td>
                                              <Td
                                                px={'0.25rem'}
                                                minW={tableHeader[9].width}
                                                w={tableHeader[9].width}
                                                maxW={tableHeader[9].width}
                                              >
                                                <Text
                                                  textAlign={'center'}
                                                  color={'#485766'}
                                                  fontSize={'0.9375rem'}
                                                  fontWeight={400}
                                                  lineHeight={'1.5rem'}
                                                  whiteSpace={'normal'}
                                                  w="100%"
                                                  maxW={'100%'}
                                                  // whiteSpace={'nowrap'}
                                                  // overflow={'hidden'}
                                                  // textOverflow={'ellipsis'}
                                                >
                                                  {utils.parseDallar(
                                                    settlementAmount,
                                                  )}
                                                </Text>
                                              </Td>
                                              <Td
                                                px={'0.25rem'}
                                                minW={tableHeader[10].width}
                                                w={tableHeader[10].width}
                                                maxW={tableHeader[10].width}
                                                cursor={'pointer'}
                                                onClick={() => {
                                                  moveBuyerDetail(buyerUserId);
                                                }}
                                              >
                                                <Text
                                                  w="100%"
                                                  minW="100%"
                                                  textDecoration={'underline'}
                                                  textAlign={'center'}
                                                  color={'#485766'}
                                                  fontSize={'0.9375rem'}
                                                  fontWeight={400}
                                                  lineHeight={'1.5rem'}
                                                  whiteSpace={'normal'}
                                                  // whiteSpace={'nowrap'}
                                                  // overflow={'hidden'}
                                                  // textOverflow={'ellipsis'}
                                                >
                                                  {buyerName}
                                                </Text>
                                              </Td>
                                              <Td
                                                px={'0.25rem'}
                                                minW={tableHeader[11].width}
                                                w={tableHeader[11].width}
                                                maxW={tableHeader[11].width}
                                              >
                                                <Text
                                                  w={'100%'}
                                                  textAlign={'center'}
                                                  color={'#485766'}
                                                  fontSize={'0.9375rem'}
                                                  fontWeight={400}
                                                  lineHeight={'1.5rem'}
                                                  whiteSpace={'normal'}
                                                  // whiteSpace={'nowrap'}
                                                  // overflow={'hidden'}
                                                  // textOverflow={'ellipsis'}
                                                >
                                                  {handleGetSettlementStatus(
                                                    sellerPayStatus,
                                                  )}
                                                </Text>
                                              </Td>
                                              <Td
                                                px={'0.25rem'}
                                                minW={tableHeader[12].width}
                                                w={tableHeader[12].width}
                                                maxW={tableHeader[12].width}
                                              >
                                                <Text
                                                  w={'100%'}
                                                  textAlign={'center'}
                                                  color={'#485766'}
                                                  fontSize={'0.9375rem'}
                                                  fontWeight={400}
                                                  lineHeight={'1.5rem'}
                                                  whiteSpace={'normal'}
                                                  // whiteSpace={'nowrap'}
                                                  // overflow={'hidden'}
                                                  // textOverflow={'ellipsis'}
                                                >
                                                  {utils.parseDateByCountryCode(
                                                    createdAt,
                                                    lang,
                                                  )}
                                                </Text>
                                              </Td>
                                              <Td
                                                px={'0.25rem'}
                                                minW={tableHeader[13].width}
                                                w={tableHeader[13].width}
                                                maxW={tableHeader[13].width}
                                              >
                                                <Box w={'100%'} h={'3rem'}>
                                                  <ReturnInputForm
                                                    selectedMap={selectedMap}
                                                    listSettlement={
                                                      listSettlement
                                                    }
                                                    setListSettlement={
                                                      setListSettlement
                                                    }
                                                    item={item}
                                                    index={index} // 헤더 index
                                                  />
                                                </Box>
                                              </Td>
                                            </Tr>
                                          );
                                        },
                                      );
                                    })}
                                  </Tbody>
                                </Table>
                              </Box>
                            </Collapse>
                          </Td>
                        </Tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </Tbody>
            )}
            {listSettlement.length === 0 && (
              <Tbody>
                <Tr
                  cursor={'pointer'}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    toggleOpen(sellerUserId);
                  }}
                >
                  <Td colSpan={14}>
                    <Text
                      w="100%"
                      fontSize={'1.5rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                      textAlign={'center'}
                    >
                      {localeText(LANGUAGES.INFO_MSG.NOT_FOUND_SETTLEMENT)}
                    </Text>
                  </Td>
                </Tr>
              </Tbody>
            )}
          </Table>
        </TableContainer>
      </Box>

      <ContentBR h={'1.25rem'} />

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
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalCount={totalCount}
              contentNum={contentNum}
            />
          </Box>
        </HStack>
      </Box>

      <ContentBR h={'1.25rem'} />
    </MainContainer>
  );
};

export default SettlementPage;
