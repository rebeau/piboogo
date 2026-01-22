'use client';

import {
  Box,
  Center,
  HStack,
  Text,
  VStack,
  Select,
  Button,
  useDisclosure,
  Tr,
  Td,
  TableContainer,
  Table,
  Tbody,
  Thead,
  Th,
} from '@chakra-ui/react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import { useCallback, useEffect, useState } from 'react';
import { DefaultPaginate } from '@/components';
import SearchInput from '@/components/custom/input/SearchInput';
import ContentBR from '@/components/common/ContentBR';
import utils from '@/utils';
import RewardModal from '@/components/custom/modal/RewardModal';
import CustomCheckBox from '@/components/common/checkbox/CustomCheckBox';
import MainContainer from '@/components/layout/MainContainer';
import buyerUserApi from '@/services/buyerUserApi';
import { SUCCESS } from '@/constants/errorCode';
import { LIST_CONTENT_NUM } from '@/constants/common';
import useMove from '@/hooks/useMove';

const CreditPage = () => {
  const { moveBuyerDetail } = useMove();
  const [initFlag, setInitFlag] = useState(true);

  const [listUser, setListUser] = useState([]);
  const [searchBy, setSearchBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(10);
  const [tabIndex, setTabIndex] = useState(0);

  const { lang, localeText } = useLocale();

  const {
    isOpen: isOpenReward,
    onOpen: onOpenReward,
    onClose: onCloseReward,
  } = useDisclosure();

  const tableHeader = [
    { width: 'auto', title: localeText(LANGUAGES.ACC.EMAIL) },
    { width: 'auto', title: localeText(LANGUAGES.ACC.NAME) },
    { width: 'auto', title: localeText(LANGUAGES.ACC.PHONE_NUMBER) },
    { width: 'auto', title: localeText(LANGUAGES.CREDIT.JOIN_DATE) },
    { width: 'auto', title: localeText(LANGUAGES.CREDIT.CREDIT) },
    {
      width: 'auto',
      title: localeText(LANGUAGES.CREDIT.PURCHASE_AMOUNT),
    },
  ];

  const key = 'buyerUserId';
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const currentPageItems = listUser;
      const newSelectedItems = new Set(selectedItems);
      currentPageItems.forEach((item) => newSelectedItems.add(item[key]));
      setSelectedItems(newSelectedItems);
    } else {
      const currentPageItems = listUser;
      const newSelectedItems = new Set(selectedItems);
      currentPageItems.forEach((item) => newSelectedItems.delete(item[key]));
      setSelectedItems(newSelectedItems);
    }
  };

  useEffect(() => {
    const allSelected = listUser.every((item) => selectedItems.has(item[key]));
    setSelectAll(allSelected);
  }, [selectedItems, listUser]);

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
    handleGetListBuyerUserGradeAgent();
  }, [tabIndex, contentNum]);

  useEffect(() => {
    if (!initFlag) {
      handleGetListBuyerUserGrade();
    }
  }, [currentPage]);

  const handleGetListBuyerUserGradeAgent = () => {
    setSelectedItems(new Set());
    if (currentPage === 1) {
      handleGetListBuyerUserGrade();
    } else {
      setCurrentPage(1);
    }
  };

  const handleGetListBuyerUserGrade = async () => {
    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
    };
    if (tabIndex !== 0) {
      if (tabIndex === 3) {
        param.grade = 1;
      }
      if (tabIndex === 2) {
        param.grade = 2;
      }
      if (tabIndex === 1) {
        param.grade = 3;
      }
    }
    if (searchBy) {
      param.searchBy = searchBy;
    }
    const result = await buyerUserApi.getListBuyerUserGrade(param);
    if (result?.errorCode === SUCCESS) {
      setListUser(result.datas);
      setTotalCount(result.totalCount);
    } else {
      setListUser([]);
      setTotalCount(0);
    }
    setInitFlag(false);
  };

  const handleBuyer = useCallback((item) => {
    moveBuyerDetail(item.buyerUserId);
  });

  const handleReward = useCallback((item) => {
    onOpenReward();
  });

  const itemCard = useCallback((item, index) => {
    const name = item?.name;
    const id = item?.id;
    const createdAt = item?.createdAt;
    const totalPurchaseAmount = item?.totalPurchaseAmount;
    const rewardCoin = item?.rewardCoin;
    const phone = item?.phone;
    const buyerUserId = item?.buyerUserId;
    const holdingCouponCnt = item?.holdingCouponCnt;
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
              isChecked={selectedItems.has(buyerUserId)}
              onChange={() => handleItemSelect(item)}
            />
          </Center>
        </Td>
        <Td w={tableHeader[0].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {id}
          </Text>
        </Td>
        <Td w={tableHeader[1].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
            whiteSpace={'pre-wrap'}
          >
            {name}
          </Text>
        </Td>
        <Td w={tableHeader[2].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
            whiteSpace={'pre-wrap'}
          >
            {utils.parsePhoneNum(phone)}
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
            {utils.parseDateByCountryCode(createdAt, lang)}
          </Text>
        </Td>
        <Td w={tableHeader[4].width}>
          <Text
            cursor={'pointer'}
            onClick={() => {
              handleBuyer(item);
            }}
            textDecoration={'underline'}
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseAmount(rewardCoin)}
          </Text>
        </Td>
        <Td w={tableHeader[5].width}>
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
      </Tr>
    );
  });

  return (
    <MainContainer>
      <Box w={'100%'}>
        <HStack
          justifyContent={'flex-start'}
          alignItems={'center'}
          spacing={'2.5rem'}
        >
          <Box
            py={'0.5rem'}
            cursor={'pointer'}
            onClick={() => {
              setTabIndex(0);
            }}
          >
            <Text
              w={'6.125rem'}
              textAlign={'center'}
              color={tabIndex === 0 ? '#66809C' : '#A7C3D2'}
              fontSize={'0.9375rem'}
              fontWeight={tabIndex === 0 ? 600 : 400}
              lineHeight={'1.5rem'}
            >
              {localeText(LANGUAGES.CREDIT.ALL_MEMBERS)}
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
              w={'4.4rem'}
              textAlign={'left'}
              color={tabIndex === 1 ? '#66809C' : '#A7C3D2'}
              fontSize={'0.9375rem'}
              fontWeight={tabIndex === 1 ? 600 : 400}
              lineHeight={'1.5rem'}
            >
              {localeText(LANGUAGES.COMMON.PLATINUM)}
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
              w={'2.5rem'}
              textAlign={'left'}
              color={tabIndex === 2 ? '#66809C' : '#A7C3D2'}
              fontSize={'0.9375rem'}
              fontWeight={tabIndex === 2 ? 600 : 400}
              lineHeight={'1.5rem'}
            >
              {localeText(LANGUAGES.COMMON.GOLD)}
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
              w={'3.3rem'}
              textAlign={'left'}
              color={tabIndex === 3 ? '#66809C' : '#A7C3D2'}
              fontSize={'0.9375rem'}
              fontWeight={tabIndex === 3 ? 600 : 400}
              lineHeight={'1.5rem'}
            >
              {localeText(LANGUAGES.COMMON.BRONZE)}
            </Text>
          </Box>
        </HStack>
      </Box>

      <Box w={'100%'}>
        <VStack spacing={'1.25rem'}>
          <Box w={'100%'}>
            <HStack justifyContent={'space-between'} alignItems={'center'}>
              <Box w={'24.375rem'}>
                <SearchInput
                  value={searchBy}
                  onChange={(e) => {
                    setSearchBy(e.target.value);
                  }}
                  onClick={handleGetListBuyerUserGradeAgent}
                  placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
                  placeholderFontColor={'#A7C3D2'}
                />
              </Box>
              <Box w={'9.25rem'} h={'3rem'}>
                <Button
                  onClick={() => {
                    handleReward();
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
                    {localeText(LANGUAGES.CREDIT.BATCH_PAYOUTS)}
                  </Text>
                </Button>
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
                          isChecked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </Center>
                    </Th>
                    {tableHeader.map((item, index) => {
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
                  {listUser.map((item, index) => {
                    return itemCard(item, index);
                  })}
                  {listUser.length === 0 && (
                    <Tr>
                      <Td colSpan={7}>
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
                  value={Number(contentNum)}
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
                  {LIST_CONTENT_NUM.map((item, index) => {
                    return (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </Select>
              </Box>

              <Box>
                <DefaultPaginate
                  isSmall
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

      <ContentBR h={'1.25rem'} />

      {isOpenReward && (
        <RewardModal
          isOpen={isOpenReward}
          buyerUserIds={Array.from(selectedItems)}
          onClose={(ret) => {
            if (ret) {
              handleGetListBuyerUserGradeAgent();
            }
            onCloseReward();
          }}
        />
      )}
    </MainContainer>
  );
};

export default CreditPage;
