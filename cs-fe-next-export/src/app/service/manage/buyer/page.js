'use client';

import * as ExcelJS from 'exceljs';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import {
  Box,
  HStack,
  Text,
  VStack,
  Select,
  Button,
  Center,
  TableContainer,
  Table,
  Thead,
  Th,
  Tr,
  Tbody,
  Td,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { CustomIcon, DefaultPaginate } from '@/components';
import SearchInput from '@/components/custom/input/SearchInput';
import ContentBR from '@/components/common/ContentBR';
import { MGNT } from '@/constants/pageURL';
import MainContainer from '@/components/layout/MainContainer';
import { LIST_CONTENT_NUM } from '@/constants/common';
import buyerUserApi from '@/services/buyerUserApi';
import { SUCCESS } from '@/constants/errorCode';
import utils from '@/utils';
import useStatus from '@/hooks/useStatus';
import useMove from '@/hooks/useMove';

const BuyerPage = () => {
  const router = useRouter();
  const { lang, localeText } = useLocale();
  const { handleGetGrade } = useStatus();
  const { moveBuyerDetail } = useMove();

  const tableHeader = [
    { width: 'auto', title: localeText(LANGUAGES.BUYER.ORDER) },
    {
      width: 'auto',
      title: localeText(LANGUAGES.BUYER.MEMBER_EMAIL),
    },
    { width: 'auto', title: localeText(LANGUAGES.BUYER.NAME) },
    {
      width: 'auto',
      title: localeText(LANGUAGES.BUYER.MEMBERSHIP),
      orderDirection: 'asc',
    },
    { width: 'auto', title: localeText(LANGUAGES.BUYER.PHONE_NUMBER) },
    { width: 'auto', title: localeText(LANGUAGES.BUYER.JOIN_DATE) },
    { width: 'auto', title: localeText(LANGUAGES.BUYER.COUPON) },
    {
      width: 'auto',
      title: localeText(LANGUAGES.BUYER.TOTAL_PURCHASE_PRICE),
    },
    { width: 'auto', title: localeText(LANGUAGES.BUYER.LICENCE) },
  ];

  const [initFlag, setInitFlag] = useState(false);
  const [listBuyer, setListBuyer] = useState([]);
  const [searchBy, setSearchBy] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);
  const [orderBy, setOrderBy] = useState(1);
  const [orderDirection, setOrderDirection] = useState('asc');

  useEffect(() => {
    handleGetListBuyer();
  }, [currentPage]);

  useEffect(() => {
    if (!initFlag) {
      handleGetListBuyerAgent();
    }
  }, [contentNum, orderDirection]);

  const handleGetListBuyerAgent = () => {
    if (currentPage === 1) {
      handleGetListBuyer();
    } else {
      setCurrentPage(1);
    }
  };

  const handleGetListBuyer = async () => {
    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
    };
    if (searchBy) {
      param.searchBy = searchBy;
    }
    param.orderBy = 1;
    param.orderDirection = orderDirection;

    const result = await buyerUserApi.getListBuyerUser(param);
    setInitFlag(false);
    if (result?.errorCode === SUCCESS) {
      setListBuyer(result.datas);
      setTotalCount(result.totalCount);
    } else {
      setListBuyer([]);
      setTotalCount(0);
    }
  };

  const handleExcel = useCallback(() => {
    const datas = listBuyer;
    const headers = tableHeader.map((item) => {
      return item.title;
    });
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
        data.name,
        handleGetGrade(data.grade),
        utils.parsePhoneNum(data.phone),
        utils.parseDateByCountryCode(data.createdAt, lang),
        utils.parseAmount(data.holdingCouponCnt),
        utils.parseDallar(data.totalPurchaseAmount),
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
      link.download = 'buyer_user.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });

  const handleAuth = (auth) => {
    if (auth === 1) {
      return localeText(LANGUAGES.STATUS.UNAUTHORIZED);
    } else if (auth === 2) {
      return localeText(LANGUAGES.STATUS.AUTHORIZED);
    }
    return auth;
  };

  const buyerCard = useCallback((item, index) => {
    const name = item?.name;
    const id = item?.id;
    const approvalFlag = item?.approvalFlag;
    const createdAt = item?.createdAt;
    const totalPurchaseAmount = item?.totalPurchaseAmount;
    const phone = item?.phone;
    const grade = item?.grade;
    const buyerUserId = item?.buyerUserId;
    const holdingCouponCnt = item?.holdingCouponCnt;

    const handleDetail = (item) => {
      moveBuyerDetail(item.buyerUserId);
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
        <Td w={tableHeader[0].width}>
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
        <Td w={tableHeader[1].width}>
          <Text
            cursor={'pointer'}
            onClick={() => {
              handleDetail(item);
            }}
            textDecoration={'underline'}
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={500}
            lineHeight={'1.5rem'}
          >
            {id}
          </Text>
        </Td>
        <Td w={tableHeader[2].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {name}
          </Text>
        </Td>
        <Td w={tableHeader[3].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {handleGetGrade(grade)}
          </Text>
        </Td>
        <Td w={tableHeader[4].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parsePhoneNum(phone)}
          </Text>
        </Td>
        <Td w={tableHeader[5].width}>
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
        <Td w={tableHeader[6].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseAmount(holdingCouponCnt)}
          </Text>
        </Td>
        <Td w={tableHeader[7].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseDallar(totalPurchaseAmount)}
          </Text>
        </Td>
        <Td w={tableHeader[8].width}>
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

  return (
    <MainContainer>
      <Box w={'100%'}>
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
                    handleGetListBuyerAgent();
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
            <VStack spacing={'1.25rem'} alignItems={'flex-start'}>
              <Box w={'100%'}>
                <TableContainer w="100%">
                  <Table>
                    <Thead>
                      <Tr
                        borderTop={'1px solid #73829D'}
                        borderBottom={'1px solid #73829D'}
                      >
                        {tableHeader.map((item, index) => {
                          return (
                            <Th w={item.width} key={index}>
                              <HStack spacing={0} alignItems={'center'}>
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
                                {item.orderDirection && (
                                  <Center
                                    onClick={() => {
                                      if (orderDirection === 'asc') {
                                        setOrderDirection('desc');
                                      } else {
                                        setOrderDirection('asc');
                                      }
                                    }}
                                  >
                                    <CustomIcon
                                      name={
                                        orderDirection === 'asc'
                                          ? 'sortUp'
                                          : 'sortDown'
                                      }
                                      color="#000"
                                    />
                                  </Center>
                                )}
                              </HStack>
                            </Th>
                          );
                        })}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {listBuyer.map((item, index) => {
                        return buyerCard(item, index);
                      })}
                      {listBuyer.length === 0 && (
                        <Tr>
                          <Td colSpan={9}>
                            <Center w={'100%'} h={'10rem'}>
                              <Text
                                fontSize={'1.5rem'}
                                fontWeight={500}
                                lineHeight={'1.75rem'}
                              >
                                {localeText(LANGUAGES.INFO_MSG.NO_BUYER_FOUND)}
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
      </Box>

      <ContentBR h={'1.25rem'} />
    </MainContainer>
  );
};

export default BuyerPage;
