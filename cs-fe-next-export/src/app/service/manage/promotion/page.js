'use client';

import {
  Box,
  Center,
  HStack,
  Text,
  VStack,
  Select,
  Button,
  Tr,
  Td,
  TableContainer,
  Table,
  Tbody,
  Thead,
  Th,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import { useCallback, useEffect, useState } from 'react';
import { DefaultPaginate } from '@/components';
import SearchInput from '@/components/custom/input/SearchInput';
import ContentBR from '@/components/common/ContentBR';
import CustomCheckBox from '@/components/common/checkbox/CustomCheckBox';
import MainContainer from '@/components/layout/MainContainer';
import useModal from '@/hooks/useModal';
import { LIST_CONTENT_NUM } from '@/constants/common';
import promotionApi from '@/services/promotionApi';
import { SUCCESS } from '@/constants/errorCode';
import utils from '@/utils';
import useStatus from '@/hooks/useStatus';
import useMove from '@/hooks/useMove';

const PromotionPage = () => {
  const { movePromotionDetail, moveSellerDetail } = useMove();
  const router = useRouter();
  const { lang, localeText } = useLocale();
  const { openModal } = useModal();
  const { handleGetAuthStatus } = useStatus();

  const [initFlag, setInitFlag] = useState(true);
  const [status, setStatus] = useState(1);
  const [searchBy, setSearchBy] = useState('');
  const [searchByType2, setSearchByType2] = useState('');
  const [listDataType1, setListDataType1] = useState([]);
  const [listDataType1Msg, setListDataType1Msg] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);

  const [listDataType2, setListDataType2] = useState([]);
  const [listDataType2Msg, setListDataType2Msg] = useState(null);
  const [currentPageType2, setCurrentPageType2] = useState(1);
  const [totalCountType2, setTotalCountType2] = useState(1);
  const [contentNumType2, setContentNumType2] = useState(LIST_CONTENT_NUM[0]);

  const tableHeaderType1 = [
    { width: 'auto', title: localeText(LANGUAGES.PROMOTION.NUMBER) },
    { width: 'auto', title: localeText(LANGUAGES.PROMOTION.TITLE) },
    { width: 'auto', title: localeText(LANGUAGES.PROMOTION.PERIOD) },
    { width: 'auto', title: localeText(LANGUAGES.PROMOTION.REQUEST) },
    { width: 'auto', title: localeText(LANGUAGES.PROMOTION.SELLER) },
    { width: 'auto', title: localeText(LANGUAGES.PROMOTION.STATE) },
    { width: 'auto', title: localeText(LANGUAGES.PROMOTION.AUTHORIZATION) },
  ];

  const tableHeaderType2 = [
    { width: 'auto', title: localeText(LANGUAGES.PROMOTION.NUMBER) },
    { width: 'auto', title: localeText(LANGUAGES.PROMOTION.TITLE) },
    { width: 'auto', title: localeText(LANGUAGES.PROMOTION.AUTHORIZATION) },
    { width: 'auto', title: localeText(LANGUAGES.PROMOTION.PERIOD) },
    { width: 'auto', title: localeText(LANGUAGES.PROMOTION.REQUEST) },
    { width: 'auto', title: localeText(LANGUAGES.PROMOTION.SELLER) },
    {
      width: 'auto',
      title: localeText(LANGUAGES.PROMOTION.AUTHORIZATION),
    },
  ];

  useEffect(() => {
    handleGetListPromotionApproval();
  }, [currentPageType2]);

  useEffect(() => {
    handleGetListPromotion();
  }, [currentPage]);

  useEffect(() => {
    if (!initFlag) {
      handleGetListPromotionAgent();
    }
  }, [contentNum, status]);

  useEffect(() => {
    if (!initFlag) {
      handleGetListPromotionApprovalAgent();
    }
  }, [contentNumType2]);

  const handleGetListPromotionAgent = () => {
    if (currentPage === 1) {
      handleGetListPromotion();
    } else {
      setCurrentPage(1);
    }
  };

  const handleGetListPromotion = async () => {
    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
    };
    if (status !== 0) {
      param.status = status;
    }
    if (searchBy) {
      param.searchBy = searchBy;
    }
    const result = await promotionApi.getListPromotion(param);
    if (result?.errorCode === SUCCESS) {
      setListDataType1(result.datas);
      setTotalCount(result.totalCount);
    } else {
      setListDataType1([]);
      setTotalCount(0);
      setListDataType1Msg(result.message);
    }
    setInitFlag(false);
  };

  const handleGetListPromotionApprovalAgent = () => {
    if (currentPageType2 === 1) {
      handleGetListPromotionApproval();
    } else {
      setCurrentPageType2(1);
    }
  };

  const handleGetListPromotionApproval = async () => {
    const param = {
      pageNum: currentPageType2,
      contentNum: contentNumType2,
    };
    if (searchByType2) {
      param.searchBy = searchByType2;
    }
    const result = await promotionApi.getListPromotionApproval(param);
    if (result?.errorCode === SUCCESS) {
      setListDataType2(result.datas);
    } else {
      setListDataType2([]);
      setListDataType2Msg(result.message);
    }
  };

  const handlePatchPromotionApproval = async (promotionIds, status) => {
    const param = promotionIds.map((id) => {
      return {
        promotionId: id,
        status: status,
      };
    });
    const result = await promotionApi.patchPromotionApproval(param);
    openModal({ text: result.message });
    if (result?.errorCode === SUCCESS) {
      setTimeout(() => {
        if (status === 1) {
          setSelectedItemsType2(new Set());
        } else if (status === 3) {
          setSelectedItemsType1(new Set());
        }
        handleGetListPromotionAgent();
        handleGetListPromotionApproval();
      });
    }
  };

  const handleUnAuthorized = async () => {
    const promotionIds = Array.from(selectedItemsType2);
    handlePatchPromotionApproval(promotionIds, 1);
  };

  const handleDetail = useCallback((promotionId) => {
    movePromotionDetail(promotionId);
  });

  const handleSellerDetail = useCallback((sellerUserId) => {
    moveSellerDetail(sellerUserId);
  });

  const handleDelete = async () => {
    const param = {
      promotionIds: Array.from(selectedItemsType1),
    };
    const result = await promotionApi.deletePromotion(param);
    openModal({
      text: result.message,
      onAgree: () => {
        if (result?.errorCode === SUCCESS) {
          setSelectedItemsType1(new Set());
          handleGetListPromotion();
        }
      },
    });
  };

  const key = 'promotionId';

  const [selectedItemsType1, setSelectedItemsType1] = useState(new Set());
  const [selectAllType1, setSelectAllType1] = useState(false);
  const handleSelectAllType1 = () => {
    setSelectAllType1(!selectAllType1);
    if (!selectAllType1) {
      const currentPageItems = listDataType1;
      const newSelectedItems = new Set(selectedItemsType1);
      currentPageItems.forEach((item) => newSelectedItems.add(item[key]));
      setSelectedItemsType1(newSelectedItems);
    } else {
      const currentPageItems = listDataType1;
      const newSelectedItems = new Set(selectedItemsType1);
      currentPageItems.forEach((item) => newSelectedItems.delete(item[key]));
      setSelectedItemsType1(newSelectedItems);
    }
  };
  useEffect(() => {
    const allSelected = listDataType1.every((item) =>
      selectedItemsType1.has(item[key]),
    );
    setSelectAllType1(allSelected);
  }, [selectedItemsType1, listDataType1]);
  const handleItemSelectType1 = (item) => {
    const newSelectedItems = new Set(selectedItemsType1);
    if (newSelectedItems.has(item[key])) {
      newSelectedItems.delete(item[key]);
    } else {
      newSelectedItems.add(item[key]);
    }
    setSelectedItemsType1(newSelectedItems);
  };

  const itemCardType1 = useCallback((item, index) => {
    const name = item?.name;
    const status = item?.status;
    const promotionId = item?.promotionId;
    const createdAt = item?.createdAt;
    const brandName = item?.brandName;
    const sellerUserId = item?.sellerUserId;
    const startDate = item?.startDate;
    const endDate = item?.endDate;

    let period = localeText(LANGUAGES.COMMON.UNLIMITED);
    if (startDate && endDate) {
      period = `${utils.parseDateByCountryCode(startDate, lang)} - ${utils.parseDateByCountryCode(endDate, lang)}`;
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
          <Center>
            <CustomCheckBox
              isChecked={selectedItemsType1.has(promotionId)}
              onChange={() => handleItemSelectType1(item)}
            />
          </Center>
        </Td>
        <Td w={tableHeaderType1[0].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={500}
            lineHeight={'1.5rem'}
            whiteSpace={'pre-wrap'}
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
          w={tableHeaderType1[1].width}
          cursor={'pointer'}
          onClick={() => {
            handleDetail(promotionId);
          }}
        >
          <Text
            textDecoration={'underline'}
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {name}
          </Text>
        </Td>
        <Td w={tableHeaderType1[2].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={500}
            lineHeight={'1.5rem'}
            whiteSpace={'pre-wrap'}
          >
            {period}
          </Text>
        </Td>
        <Td w={tableHeaderType1[3].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={500}
            lineHeight={'1.5rem'}
            whiteSpace={'pre-wrap'}
          >
            {utils.parseDateByCountryCode(createdAt, lang)}
          </Text>
        </Td>
        <Td
          w={tableHeaderType1[4].width}
          cursor={'pointer'}
          onClick={() => {
            handleSellerDetail(sellerUserId);
          }}
        >
          <Text
            textDecoration={'underline'}
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {brandName}
          </Text>
        </Td>
        <Td w={tableHeaderType1[5].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {handleGetAuthStatus(status)}
          </Text>
        </Td>
        <Td w={tableHeaderType1[6].width} h={'3rem'}>
          <Button
            onClick={() => {
              handlePatchPromotionApproval([promotionId], 3);
            }}
            bg={'transparent'}
            px={'1.25rem'}
            py={'0.63rem'}
            borderRadius={'0.25rem'}
            border={'1px solid #73829D'}
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
              color={'#73829D'}
              fontSize={'1rem'}
              fontWeight={400}
              lineHeight={'1.75rem'}
            >
              {localeText(LANGUAGES.STATUS.AUTHORIZED)}
            </Text>
          </Button>
        </Td>
      </Tr>
    );
  });

  const [selectedItemsType2, setSelectedItemsType2] = useState(new Set());
  const [selectAllType2, setSelectAllType2] = useState(false);
  const handleSelectAllType2 = () => {
    setSelectAllType2(!selectAllType2);
    if (!selectAllType2) {
      const currentPageItems = listDataType2;
      const newSelectedItems = new Set(selectedItemsType2);
      currentPageItems.forEach((item) => newSelectedItems.add(item[key]));
      setSelectedItemsType2(newSelectedItems);
    } else {
      const currentPageItems = listDataType2;
      const newSelectedItems = new Set(selectedItemsType2);
      currentPageItems.forEach((item) => newSelectedItems.delete(item[key]));
      setSelectedItemsType2(newSelectedItems);
    }
  };
  useEffect(() => {
    const allSelected = listDataType2.every((item) =>
      selectedItemsType2.has(item[key]),
    );
    setSelectAllType2(allSelected);
  }, [selectedItemsType2, listDataType2]);
  const handleItemSelectType2 = (item) => {
    const newSelectedItems = new Set(selectedItemsType2);
    if (newSelectedItems.has(item[key])) {
      newSelectedItems.delete(item[key]);
    } else {
      newSelectedItems.add(item[key]);
    }
    setSelectedItemsType2(newSelectedItems);
  };

  const itemCardType2 = useCallback((item, index) => {
    const name = item?.name;
    const status = item?.status;
    const promotionId = item?.promotionId;
    const createdAt = item?.createdAt;
    const brandName = item?.brandName;
    const sellerUserId = item?.sellerUserId;
    const startDate = item?.startDate;
    const endDate = item?.endDate;

    let period = localeText(LANGUAGES.COMMON.UNLIMITED);
    if (startDate && endDate) {
      period = `${utils.parseDateByCountryCode(startDate, lang)} - ${utils.parseDateByCountryCode(endDate, lang)}`;
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
          <Center>
            <CustomCheckBox
              isChecked={selectedItemsType2.has(promotionId)}
              onChange={() => handleItemSelectType2(item)}
            />
          </Center>
        </Td>
        <Td w={tableHeaderType2[0].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={500}
            lineHeight={'1.5rem'}
            whiteSpace={'pre-wrap'}
          >
            {index + 1}
          </Text>
        </Td>
        <Td
          w={tableHeaderType2[1].width}
          cursor={'pointer'}
          onClick={() => {
            handleDetail(promotionId);
          }}
        >
          <Text
            textDecoration={'underline'}
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {name}
          </Text>
        </Td>
        <Td w={tableHeaderType2[2].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={500}
            lineHeight={'1.5rem'}
            whiteSpace={'pre-wrap'}
          >
            {handleGetAuthStatus(status)}
          </Text>
        </Td>
        <Td w={tableHeaderType2[3].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={500}
            lineHeight={'1.5rem'}
            whiteSpace={'pre-wrap'}
          >
            {period}
          </Text>
        </Td>
        <Td w={tableHeaderType2[4].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={500}
            lineHeight={'1.5rem'}
            whiteSpace={'pre-wrap'}
          >
            {utils.parseDateByCountryCode(createdAt, lang)}
          </Text>
        </Td>
        <Td
          w={tableHeaderType2[5].width}
          cursor={'pointer'}
          onClick={() => {
            handleSellerDetail(sellerUserId);
          }}
        >
          <Text
            textDecoration={'underline'}
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {brandName}
          </Text>
        </Td>
        <Td w={tableHeaderType2[6].width} h={'3rem'}>
          <Button
            onClick={() => {
              handlePatchPromotionApproval([promotionId], 1);
            }}
            bg={'transparent'}
            px={'1.25rem'}
            py={'0.63rem'}
            borderRadius={'0.25rem'}
            border={'1px solid #73829D'}
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
              color={'#73829D'}
              fontSize={'1rem'}
              fontWeight={400}
              lineHeight={'1.75rem'}
            >
              {localeText(LANGUAGES.STATUS.UNAUTHORIZED)}
            </Text>
          </Button>
        </Td>
      </Tr>
    );
  });

  return (
    <MainContainer
      contentHeader={
        <Box minW={'25rem'} h={'3rem'}>
          <SearchInput
            value={searchBy || ''}
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
      }
    >
      <ContentBR h={'1.25rem'} />

      <Box w={'100%'}></Box>

      <Box w={'100%'}>
        <VStack spacing={'1.25rem'}>
          <Box w="100%">
            <HStack justifyContent={'space-between'} alignItems={'center'}>
              <Box>
                <Text
                  color={'#485766'}
                  fontSize={'1.125rem'}
                  fontWeight={500}
                  lineHeight={'1.96875rem'}
                  whiteSpace={'pre-wrap'}
                >
                  {localeText(LANGUAGES.PROMOTION.SELLER_REQUEST_PROMOTION)}
                </Text>
              </Box>
              <Box>
                <HStack>
                  <Box w={'max-content'}>
                    <Select
                      value={status}
                      onChange={(e) => {
                        setStatus(Number(e.target.value));
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
                      {/* <option value={0}>{localeText(LANGUAGES.COMMON.ALL)}</option> */}
                      <option value={1}>
                        {localeText(LANGUAGES.STATUS.AUTHORIZATION_REQUEST)}
                      </option>
                      <option value={2}>
                        {localeText(LANGUAGES.STATUS.DENIED)}
                      </option>
                      {/*
                  <option value={3}>
                    {localeText(LANGUAGES.STATUS.APPROVED)}
                  </option>
                   */}
                      <option value={4}>
                        {localeText(LANGUAGES.STATUS.EXPIRED)}
                      </option>
                    </Select>
                  </Box>
                  <Box w={'7rem'} h={'3rem'}>
                    <Button
                      onClick={() => {
                        const deleteIds = Array.from(selectedItemsType1);
                        if (deleteIds.length > 0) {
                          openModal({
                            type: 'confirm',
                            text: localeText(
                              LANGUAGES.INFO_MSG.DELETE_PROMOTION_MSG,
                            ),
                            onAgree: () => {
                              handleDelete();
                            },
                          });
                        } else {
                          openModal({
                            text: localeText(
                              LANGUAGES.INFO_MSG.SELECT_PROMOTION_MSG,
                            ),
                          });
                        }
                      }}
                      px={'1.25rem'}
                      py={'0.63rem'}
                      borderRadius={'0.25rem'}
                      boxSizing={'border-box'}
                      bg={'transparent'}
                      border={'1px solid #D4C29D'}
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
                        {localeText(LANGUAGES.COMMON.DELETE)}
                      </Text>
                    </Button>
                  </Box>
                </HStack>
              </Box>
            </HStack>
          </Box>

          <Box w="100%">
            <TableContainer w="100%">
              <Table>
                <Thead>
                  <Tr
                    borderTop={'1px solid #73829D'}
                    borderBottom={'1px solid #73829D'}
                  >
                    <Th>
                      <Center>
                        <CustomCheckBox
                          isChecked={selectAllType1}
                          onChange={handleSelectAllType1}
                        />
                      </Center>
                    </Th>
                    {tableHeaderType1.map((item, index) => {
                      return (
                        <Th px="0.5rem" w={item.width} key={index}>
                          <Text
                            w={'100%'}
                            textAlign={'center'}
                            color={'#2A333C'}
                            // fontSize={lang === 'KR' ? '0.81rem' : '0.9375rem'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                            whiteSpace={'pre-wrap'}
                            textTransform={'none'}
                          >
                            {item.title}
                          </Text>
                        </Th>
                      );
                    })}
                  </Tr>
                </Thead>
                <Tbody>
                  {listDataType1.map((item, index) => {
                    return itemCardType1(item, index);
                  })}
                  {listDataType1.length === 0 && (
                    <Tr>
                      <Td colSpan={8}>
                        <Center w={'100%'} h={'10rem'}>
                          <Text
                            fontSize={'1.5rem'}
                            fontWeight={500}
                            lineHeight={'1.75rem'}
                          >
                            {listDataType1Msg}
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

      <Box w={'100%'} py="1.25rem">
        <VStack spacing={'1.25rem'}>
          <Box w="100%">
            <HStack justifyContent={'space-between'} alignItems={'center'}>
              <Text
                color={'#485766'}
                fontSize={'1.125rem'}
                fontWeight={500}
                lineHeight={'1.96875rem'}
                whiteSpace={'pre-wrap'}
              >
                {localeText(LANGUAGES.PROMOTION.AUTHORIZED_PROMOTION)}
              </Text>
              <Box>
                <HStack>
                  <Box minW={'25rem'} h={'3rem'}>
                    <SearchInput
                      value={searchByType2 || ''}
                      onChange={(e) => {
                        setSearchByType2(e.target.value);
                      }}
                      onClick={() => {
                        handleGetListPromotionApproval();
                      }}
                      placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
                      placeholderFontColor={'#A7C3D2'}
                    />
                  </Box>
                  <Box w={'19.0625rem'} h={'3rem'}>
                    <Button
                      onClick={() => {
                        const selectIds = Array.from(selectedItemsType2);
                        if (selectIds.length > 0) {
                          openModal({
                            type: 'confirm',
                            text: localeText(
                              LANGUAGES.INFO_MSG.UNAUTHORIZED_PROMOTION_MSG,
                            ),
                            onAgree: () => {
                              handleUnAuthorized();
                            },
                          });
                        } else {
                          openModal({
                            text: localeText(
                              LANGUAGES.INFO_MSG.SELECT_PROMOTION_MSG,
                            ),
                          });
                        }
                      }}
                      bg={'transparent'}
                      px={'1.25rem'}
                      py={'0.63rem'}
                      borderRadius={'0.25rem'}
                      border={'1px solid #D4C29D'}
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
                        {localeText(
                          LANGUAGES.PROMOTION.CHANGE_STATUS_TO_UNAUTHORIZED,
                        )}
                      </Text>
                    </Button>
                  </Box>
                </HStack>
              </Box>
            </HStack>
          </Box>
          <Box w="100%">
            <TableContainer w="100%">
              <Table>
                <Thead>
                  <Tr
                    borderTop={'1px solid #73829D'}
                    borderBottom={'1px solid #73829D'}
                  >
                    <Th>
                      <Center>
                        <CustomCheckBox
                          isChecked={selectAllType2}
                          onChange={handleSelectAllType2}
                        />
                      </Center>
                    </Th>
                    {tableHeaderType2.map((item, index) => {
                      return (
                        <Th w={item.width} key={index}>
                          <Text
                            w={'100%'}
                            textAlign={'center'}
                            color={'#2A333C'}
                            // fontSize={lang === 'KR' ? '0.81rem' : '0.9375rem'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                            whiteSpace={'pre-wrap'}
                            textTransform={'none'}
                          >
                            {item.title}
                          </Text>
                        </Th>
                      );
                    })}
                  </Tr>
                </Thead>
                <Tbody>
                  {listDataType2.map((item, index) => {
                    return itemCardType2(item, index);
                  })}
                  {listDataType2.length === 0 && (
                    <Tr>
                      <Td colSpan={8}>
                        <Center w={'100%'} h={'10rem'}>
                          <Text
                            fontSize={'1.5rem'}
                            fontWeight={500}
                            lineHeight={'1.75rem'}
                          >
                            {listDataType2Msg}
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
                  value={contentNumType2}
                  onChange={(e) => {
                    setContentNumType2(Number(e.target.value));
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
                  currentPage={currentPageType2}
                  setCurrentPage={setCurrentPageType2}
                  totalCount={totalCountType2}
                  contentNum={contentNumType2}
                />
              </Box>
            </HStack>
          </Box>
        </VStack>
      </Box>
    </MainContainer>
  );
};

export default PromotionPage;
