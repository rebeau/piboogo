'use client';

import * as ExcelJS from 'exceljs';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import {
  Box,
  Center,
  HStack,
  Text,
  VStack,
  Select,
  useDisclosure,
  Button,
  Tr,
  Th,
  Td,
  Table,
  Tbody,
  TableContainer,
  Thead,
  Image,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { DefaultPaginate } from '@/components';
import SearchInput from '@/components/custom/input/SearchInput';
import ContentBR from '@/components/common/ContentBR';
import IconRowArrow from '@public/svgs/icon/row-arrow.svg';
import CustomCheckBox from '@/components/common/checkbox/CustomCheckBox';
import CustomIcon from '@/components/icon/CustomIcon';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import utils from '@/utils';
import sellerUserApi from '@/services/sellerUserApi';
import { SUCCESS } from '@/constants/errorCode';
import MainContainer from '@/components/layout/MainContainer';
import { LIST_CONTENT_NUM } from '@/constants/common';
import useMove from '@/hooks/useMove';
import partnerSellerApi from '@/services/partnerSellerApi';
import useModal from '@/hooks/useModal';

const SellerPage = () => {
  const { openModal } = useModal();
  const { moveSellerDetail } = useMove();
  const [initPage, setInitPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);

  const [currentPagePartner, setCurrentPagePartner] = useState(1);
  const [totalCountPartner, setTotalCountPartner] = useState(1);
  const [contentNumPartner, setContentNumPartner] = useState(
    LIST_CONTENT_NUM[0],
  );

  const router = useRouter();
  const { lang, localeText } = useLocale();
  const [tabIndex, setTabIndex] = useState(0);
  const [searchBy, setSearchBy] = useState(null);
  const [orderBy, setOrderBy] = useState(1);
  const [orderDirection, setOrderDirection] = useState('asc');

  const [listSeller, setListSeller] = useState([]);
  const [listPartnerSeller, setListPartnerSeller] = useState([]);

  const key = 'sellerUserId';

  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const currentPageItems = listSeller;
      const newSelectedItems = new Set(selectedItems);
      currentPageItems.forEach((item) => newSelectedItems.add(item[key]));
      setSelectedItems(newSelectedItems);
    } else {
      const currentPageItems = listSeller;
      const newSelectedItems = new Set(selectedItems);
      currentPageItems.forEach((item) => newSelectedItems.delete(item[key]));
      setSelectedItems(newSelectedItems);
    }
  };
  useEffect(() => {
    const allSelected = listSeller.every((item) =>
      selectedItems.has(item[key]),
    );
    setSelectAll(allSelected);
  }, [selectedItems, listSeller]);

  const handleItemSelect = (item) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(item[key])) {
      newSelectedItems.delete(item[key]);
    } else {
      newSelectedItems.add(item[key]);
    }
    setSelectedItems(newSelectedItems);
  };

  const tableHeaderType1 = [
    { width: 'auto', title: localeText(LANGUAGES.SELLER.ORDER) },
    { width: 'auto', title: localeText(LANGUAGES.ACC.EMAIL) },
    { width: 'auto', title: localeText(LANGUAGES.SELLER.BUSINESS) },
    { width: 'auto', title: localeText(LANGUAGES.SELLER.BRAND) },
    { width: 'auto', title: localeText(LANGUAGES.SELLER.PHONE_NUMBER) },
    { width: 'auto', title: localeText(LANGUAGES.SELLER.JOIN_DATE) },
    { width: 'auto', title: localeText(LANGUAGES.SELLER.FEE_RATES) },
    { width: 'auto', title: localeText(LANGUAGES.SELLER.CUMULATIVE_SALES) },
    { width: 'auto', title: localeText(LANGUAGES.SELLER.LICENCE) },
  ];

  const tableHeaderType2 = [...tableHeaderType1];

  useEffect(() => {
    handleGetListSeller();
  }, [currentPage]);

  useEffect(() => {
    handleGetListSellerAgent();
  }, [contentNum]);

  useEffect(() => {
    handleGetListPartnerSeller();
  }, []);

  const handleGetListSellerAgent = () => {
    if (currentPage === 1) {
      handleGetListSeller();
    } else {
      setCurrentPage(1);
    }
  };

  const handleGetListSeller = async () => {
    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
      orderDirection: orderDirection === 'asc' ? 'asc' : 'desc',
    };
    if (searchBy) {
      param.searchBy = searchBy;
    }
    if (orderBy !== 0) {
      param.orderBy = orderBy;
    }
    const result = await sellerUserApi.getListSeller(param);
    setInitPage(false);
    if (result?.errorCode === SUCCESS) {
      setListSeller(result.datas);
      setTotalCount(result.totalCount);
    } else {
      setListSeller([]);
      setTotalCount(0);
    }
  };

  const handleGetListPartnerSeller = async () => {
    const result = await partnerSellerApi.getListPartnerSeller();
    setInitPage(false);
    if (result?.errorCode === SUCCESS) {
      setListPartnerSeller(result.datas);
      setTotalCountPartner(result.totalCount);
    } else {
      setListPartnerSeller([]);
      setTotalCountPartner(0);
    }
  };

  const handleReindex = (datas) => {
    return datas.map((item, index) => {
      item.idx = index + 1;
      return {
        ...item,
      };
    });
  };

  const handleOnDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (destination.index === source.index) {
      return;
    }

    const reorderedRows = Array.from(listPartnerSeller);
    const [removed] = reorderedRows.splice(source.index, 1);
    reorderedRows.splice(destination.index, 0, removed);
    const temp = handleReindex(reorderedRows);

    handlePatchPartnerUser(temp);
    setListPartnerSeller(temp);
  };

  const handlePatchPartnerUser = async (datas) => {
    const param = datas.map((item) => {
      return {
        partnerSellerId: item.partnerSellerId,
        idx: item.idx,
      };
    });
    const result = await partnerSellerApi.patchPartnerSeller(param);
  };

  const handleExcel = useCallback(() => {
    const datas = listSeller;
    const headers = [
      localeText(LANGUAGES.SELLER.ORDER),
      localeText(LANGUAGES.ACC.EMAIL),
      localeText(LANGUAGES.SELLER.BUSINESS),
      localeText(LANGUAGES.SELLER.BRAND),
      localeText(LANGUAGES.SELLER.PHONE_NUMBER),
      localeText(LANGUAGES.SELLER.JOIN_DATE),
      localeText(LANGUAGES.SELLER.FEE_RATES),
      localeText(LANGUAGES.SELLER.CUMULATIVE_SALES),
      localeText(LANGUAGES.SELLER.LICENCE),
    ];
    const columnWidths = [10, 25, 25, 25, 20, 15, 15, 15, 15, 15];

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');
    for (let col = 1; col <= columnWidths.length; col++) {
      sheet.getColumn(col).width = columnWidths[col - 1];
    }

    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center' };

    headers.forEach((header, index) => {
      const cell = headerRow.getCell(index + 1);
      cell.value = header;

      if (index <= 5) {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    });

    datas.map((data, index) => {
      const dataRow = sheet.addRow([
        String(index + 1),
        data.id,
        data.companyName,
        data.brandName,
        data.companyPhone,
        utils.parseDateByCountryCode(data.createdAt, lang),
        `${data.feeRate}%`,
        utils.parseDallar(data.totalSalesAmount),
        handleAuth(data.approvalFlag),
      ]);
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'seller_user.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });

  const handleBrand = useCallback((item) => {
    console.log('handleBrand', item);
  });

  const handleProduct = useCallback((item) => {
    console.log('handleProduct', item);
  });

  const handleAuth = useCallback((auth) => {
    if (auth === 1) {
      return localeText(LANGUAGES.STATUS.UNAUTHORIZED);
    } else if (auth === 2) {
      return localeText(LANGUAGES.STATUS.AUTHORIZED);
    }
    return auth;
  });

  const handleDelete = useCallback((item) => {
    openModal({
      type: 'confirm',
      text: localeText(LANGUAGES.INFO_MSG.CANCEL_SELLER),
      onAgree: async () => {
        const param = {
          partnerSellerIds: [Number(item.partnerSellerId)],
        };
        const result = await partnerSellerApi.deletePartnerSeller(param);
        if (result?.errorCode === SUCCESS) {
          openModal({
            text: result.message,
            onAgree: () => {
              handleGetListPartnerSeller();
            },
          });
        }
      },
    });
  });

  const handleDetail = useCallback((item) => {
    if (tabIndex === 0) {
      moveSellerDetail(item.sellerUserId);
    }
  });

  const handlePartnerSeller = async () => {
    if (selectedItems.length === 0) {
      openModal({ text: localeText(LANGUAGES.INFO_MSG.SELECT_A_SELLER) });
      return;
    }
    const param = [];
    const tempList = Array.from(selectedItems);
    tempList.map((id) => {
      param.push({
        sellerUserId: id,
      });
    });
    const result = await partnerSellerApi.postPartnerSeller(param);
    if (result?.errorCode === SUCCESS) {
      setSelectedItems(new Set());
      handleGetListPartnerSeller();
      openModal({ text: result.message });
    } else {
      openModal({ text: result.message });
    }
  };

  const itemCardType1 = useCallback((item, index) => {
    const id = item?.id;
    const companyName = item?.companyName;
    const brandName = item?.brandName;
    const totalSalesAmount = item?.totalSalesAmount;
    const createdAt = item?.createdAt;
    const companyPhone = item?.companyPhone;
    const feeRate = item?.feeRate;
    const sellerUserId = item?.sellerUserId;
    const approvalFlag = item?.approvalFlag;

    return (
      <Tr
        key={index}
        w={'100%'}
        px={'1rem'}
        py={'0.75rem'}
        borderBottom={'1px solid #73829D'}
        boxSizing={'border-box'}
      >
        {tabIndex === 1 && (
          <Td>
            <Center>
              <CustomCheckBox
                isChecked={selectedItems.has(sellerUserId)}
                onChange={() => handleItemSelect(item)}
              />
            </Center>
          </Td>
        )}
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
        <Td>
          <Text
            w={'100%'}
            cursor={tabIndex === 0 && 'pointer'}
            onClick={() => {
              handleDetail(item);
            }}
            textDecoration={tabIndex === 0 && 'underline'}
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={500}
            lineHeight={'1.5rem'}
          >
            {id}
          </Text>
        </Td>
        <Td>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {companyName}
          </Text>
        </Td>
        <Td>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {brandName}
          </Text>
        </Td>
        <Td>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {companyPhone}
          </Text>
        </Td>
        <Td>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseDateByCountryCode(createdAt, lang)}
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
            {`${feeRate}%`}
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
            {utils.parseDallar(totalSalesAmount)}
          </Text>
        </Td>
        <Td>
          <Text
            textAlign={'center'}
            color={approvalFlag === 1 ? '#940808' : '#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {handleAuth(approvalFlag)}
          </Text>
        </Td>
      </Tr>
    );
  });

  const partnerSellerCard = useCallback((provided, snapshot, item, index) => {
    const id = item?.id;
    const idx = item?.idx;
    const companyName = item?.companyName;
    const brandName = item?.brandName;
    const totalSalesAmount = item?.totalSalesAmount;
    const createdAt = item?.createdAt;
    const companyPhone = item?.companyPhone;
    const feeRate = item?.feeRate;
    const partnerSellerId = item?.partnerSellerId;
    const sellerUserId = item?.sellerUserId;
    const approvalFlag = item?.approvalFlag;

    return (
      <Tr
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        bg={snapshot.isDragging ? 'gray.100' : 'white'}
        w={'100%'}
        px={'1rem'}
        py={'0.75rem'}
        borderBottom={'1px solid #73829D'}
        boxSizing={'border-box'}
      >
        <Td w={tableHeaderType2[0].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {idx}
          </Text>
        </Td>
        <Td w={tableHeaderType2[1].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={500}
            lineHeight={'1.5rem'}
          >
            {id}
          </Text>
        </Td>
        <Td w={tableHeaderType2[2].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {companyName}
          </Text>
        </Td>
        <Td w={tableHeaderType2[3].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {brandName}
          </Text>
        </Td>
        <Td w={tableHeaderType2[4].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {companyPhone}
          </Text>
        </Td>
        <Td w={tableHeaderType2[5].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseDateByCountryCode(createdAt, lang)}
          </Text>
        </Td>
        <Td w={tableHeaderType2[6].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {feeRate}%
          </Text>
        </Td>
        <Td w={tableHeaderType2[7].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseDallar(totalSalesAmount)}
          </Text>
        </Td>

        <Td w={tableHeaderType2[8].width}>
          <Text
            textAlign={'center'}
            color={approvalFlag === 1 ? '#940808' : '#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {handleAuth(approvalFlag)}
          </Text>
        </Td>
        <Td w={tableHeaderType2[8].width}>
          <Center w={'1.25rem'} minW="1.25rem" aspectRatio={1}>
            <Image
              w="100%"
              h="100%"
              objectFit={'cover'}
              src={IconRowArrow.src}
              alt=""
            />
          </Center>
        </Td>
        <Td>
          <Center
            w={'1.25rem'}
            h={'1.25rem'}
            cursor={'pointer'}
            onClick={() => {
              handleDelete(item);
            }}
          >
            <CustomIcon
              w={'100%'}
              h={'100%'}
              name={'close'}
              color={'#940808'}
            />
          </Center>
        </Td>
      </Tr>
    );
  });

  return (
    <MainContainer>
      <Box w={'100%'} h={'2.75rem'}>
        <HStack justifyContent={'flex-start'}>
          <Box
            w={'3.5rem'}
            cursor={'pointer'}
            onClick={() => {
              setTabIndex(0);
            }}
          >
            <Text
              textAlign={'left'}
              fontSize={'1rem'}
              fontWeight={tabIndex === 0 ? 600 : 400}
              color={tabIndex === 0 ? '#66809C' : '#A7C3D2'}
              lineHeight={'1.75rem'}
            >
              {localeText(LANGUAGES.SELLER.SELLER)}
            </Text>
          </Box>

          <Box
            w={'9rem'}
            cursor={'pointer'}
            onClick={() => {
              setTabIndex(1);
            }}
          >
            <Text
              textAlign={'left'}
              fontSize={'1rem'}
              fontWeight={tabIndex === 1 ? 600 : 400}
              color={tabIndex === 1 ? '#66809C' : '#A7C3D2'}
              lineHeight={'1.75rem'}
            >
              {localeText(LANGUAGES.SELLER.PARTNER_SELECTION)}
            </Text>
          </Box>
        </HStack>
      </Box>

      <ContentBR h={'1.25rem'} />

      {tabIndex === 0 && (
        <Box w={'100%'} overflowX={'auto'}>
          <VStack spacing={0}>
            <Box w={'100%'}>
              <HStack justifyContent={'space-between'}>
                <Box w={'24.375rem'}>
                  <SearchInput
                    value={searchBy || ''}
                    onChange={(e) => {
                      setSearchBy(e.target.value);
                    }}
                    onClick={() => {
                      handleGetListSellerAgent();
                    }}
                    placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
                    placeholderFontColor={'#A7C3D2'}
                  />
                </Box>
                <Box w={'11.5625rem'} h={'3rem'}>
                  <Button
                    onClick={() => {
                      handleExcel();
                    }}
                    border={'1px solid #73829D'}
                    bg={'transparent'}
                    px={'1.25rem'}
                    py={'0.63rem'}
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
                      color={'#556A7E'}
                      fontSize={'1rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(LANGUAGES.COMMON.DOWNLOAD_EXCEL)}
                    </Text>
                  </Button>
                </Box>
              </HStack>
            </Box>

            <ContentBR h={'1.25rem'} />

            <Box w={'100%'}>
              <VStack spacing={'1.25rem'}>
                <TableContainer w="100%">
                  <Table>
                    <Thead>
                      <Tr
                        borderTop={'1px solid #73829D'}
                        borderBottom={'1px solid #73829D'}
                      >
                        {tableHeaderType1.map((item, index) => {
                          return (
                            <Th w={item.width} minW={item.width} key={index}>
                              <Text
                                w={'100%'}
                                textAlign={'center'}
                                color={'#2A333C'}
                                fontSize={
                                  '0.9375rem'
                                  // lang === 'KR' ? '0.81rem' : '0.9375rem'
                                }
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
                    <Tbody>
                      {listSeller.map((item, index) => {
                        return itemCardType1(item, index);
                      })}
                      {listSeller.length === 0 && (
                        <Tr w={'100%'} h={'10rem'}>
                          <Td>
                            <Text
                              fontSize={'1.5rem'}
                              fontWeight={500}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(LANGUAGES.INFO_MSG.NOT_SEARCHED)}
                            </Text>
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
              </VStack>
            </Box>
          </VStack>
        </Box>
      )}

      {tabIndex === 1 && (
        <Box w={'100%'}>
          <VStack spacing={0}>
            <Box w={'100%'}>
              <HStack justifyContent={'space-between'}>
                <Box>
                  <Text
                    textAlign={'center'}
                    color={'#485766'}
                    fontSize={'1.125rem'}
                    fontWeight={500}
                    lineHeight={'1.96875rem'}
                  >
                    {localeText(LANGUAGES.SELLER.SELLER_MEMBERS)}
                  </Text>
                </Box>
                <Box>
                  <HStack
                    spacing={'0.75rem'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                  >
                    <Box w={'25rem'}>
                      <SearchInput
                        value={searchBy || ''}
                        onChange={(e) => {
                          setSearchBy(e.target.value);
                        }}
                        placeholder={localeText(
                          LANGUAGES.COMMON.PH_SEARCH_TERM,
                        )}
                        placeholderFontColor={'#A7C3D2'}
                      />
                    </Box>
                    <Box w={'13.9375rem'} h={'3rem'}>
                      <Button
                        onClick={() => {
                          handlePartnerSeller();
                        }}
                        bg={'#7895B2'}
                        px={'1.25rem'}
                        py={'0.63rem'}
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
                          color={'#FFF'}
                          fontSize={'1rem'}
                          fontWeight={400}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.SELLER.SELECT_MEMBER_PARTNER)}
                        </Text>
                      </Button>
                    </Box>
                  </HStack>
                </Box>
              </HStack>
            </Box>

            <ContentBR h={'1.25rem'} />

            <Box w={'100%'}>
              <VStack spacing={'1.25rem'} alignItems={'flex-start'}>
                <TableContainer w="100%">
                  <Table>
                    <Thead>
                      <Tr
                        borderTop={'1px solid #73829D'}
                        borderBottom={'1px solid #73829D'}
                      >
                        <Th w="50px" maxW="50px">
                          <Center>
                            <CustomCheckBox
                              isChecked={selectAll}
                              onChange={handleSelectAll}
                            />
                          </Center>
                        </Th>
                        {tableHeaderType2.map((item, index) => {
                          return (
                            <Th w={item.width} minW={item.width} key={index}>
                              <Text
                                w={'100%'}
                                textAlign={'center'}
                                color={'#2A333C'}
                                fontSize={
                                  '0.9375rem'
                                  // lang === 'KR' ? '0.81rem' : '0.9375rem'
                                }
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
                    <Tbody>
                      {listPartnerSeller.map((item, index) => {
                        return itemCardType1(item, index);
                      })}
                      {listPartnerSeller.length === 0 && (
                        <Tr w={'100%'} h={'10rem'}>
                          <Td>
                            <Text
                              fontSize={'1.5rem'}
                              fontWeight={500}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(LANGUAGES.INFO_MSG.NOT_SEARCHED)}
                            </Text>
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
                <Box w={'100%'}>
                  <HStack justifyContent={'flex-end'}>
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

            <ContentBR h={'2.5rem'} />

            <Box w={'100%'}>
              <HStack justifyContent={'space-between'}>
                <Box>
                  <Text
                    textAlign={'center'}
                    color={'#485766'}
                    fontSize={'1.125rem'}
                    fontWeight={500}
                    lineHeight={'1.96875rem'}
                  >
                    {localeText(LANGUAGES.SELLER.PARTNER)}
                  </Text>
                </Box>
              </HStack>
            </Box>
            <ContentBR h={'1.25rem'} />

            <Box w={'100%'}>
              <VStack spacing={'1.25rem'} alignItems={'flex-start'}>
                <TableContainer w="100%">
                  <Table>
                    <Thead>
                      <Tr
                        borderTop={'1px solid #73829D'}
                        borderBottom={'1px solid #73829D'}
                      >
                        {tableHeaderType2.map((item, index) => {
                          return (
                            <Th w={item.width} key={index}>
                              <Text
                                textAlign={'center'}
                                color={'#2A333C'}
                                fontSize={'0.9375rem'}
                                fontWeight={500}
                                lineHeight={'1.5rem'}
                              >
                                {item.title}
                              </Text>
                            </Th>
                          );
                        })}
                        <Th>
                          <Text
                            textAlign={'center'}
                            color={'#2A333C'}
                            fontSize={'0.9375rem'}
                            fontWeight={500}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.SELLER.REORDERING)}
                          </Text>
                        </Th>
                      </Tr>
                    </Thead>

                    <DragDropContext onDragEnd={handleOnDragEnd}>
                      <Droppable droppableId="droppable">
                        {(provided) => (
                          <Tbody
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {listPartnerSeller.map((item, index) => (
                              <Draggable
                                key={item.id}
                                draggableId={item.id.toString()}
                                index={index}
                              >
                                {(provided, snapshot) =>
                                  partnerSellerCard(
                                    provided,
                                    snapshot,
                                    item,
                                    index,
                                  )
                                }
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </Tbody>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </Table>
                </TableContainer>
              </VStack>
            </Box>
          </VStack>
        </Box>
      )}

      <ContentBR h={'1.25rem'} />
    </MainContainer>
  );
};

export default SellerPage;
