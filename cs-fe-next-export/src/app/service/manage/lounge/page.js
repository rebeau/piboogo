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
  Thead,
  Tbody,
  Th,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import { useCallback, useEffect, useState } from 'react';
import { DefaultPaginate } from '@/components';
import SearchInput from '@/components/custom/input/SearchInput';
import ContentBR from '@/components/common/ContentBR';
import { MGNT } from '@/constants/pageURL';
import CustomCheckBox from '@/components/common/checkbox/CustomCheckBox';
import MainContainer from '@/components/layout/MainContainer';
import loungeApi from '@/services/loungeApi';
import { SUCCESS } from '@/constants/errorCode';
import { LIST_CONTENT_NUM } from '@/constants/common';
import utils from '@/utils';
import useModal from '@/hooks/useModal';

const LoungePage = () => {
  const router = useRouter();
  const { openModal } = useModal();
  const { lang, localeText } = useLocale();

  const [initFlag, setInitFlag] = useState(true);
  const [searchBy, setSearchBy] = useState('');
  const [loungeType, setLoungeType] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);

  const tableHeader = [
    { width: 'auto', title: localeText(LANGUAGES.LOUNGE.TYPE) },
    { width: 'auto', title: localeText(LANGUAGES.LOUNGE.MEMBER_EMAIL) },
    { width: 'auto', title: localeText(LANGUAGES.LOUNGE.TITLE) },
    { width: 'auto', title: localeText(LANGUAGES.LOUNGE.CREATED_ON) },
    { width: 'auto', title: localeText(LANGUAGES.LOUNGE.VIEWS) },
  ];

  const [listLounge, setListLounge] = useState([]);

  useEffect(() => {
    handleGetListLounge();
  }, [currentPage]);

  useEffect(() => {
    if (!initFlag) {
      handleGetListLoungeAgent();
    }
  }, [contentNum, loungeType]);

  const key = 'loungeId';

  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const currentPageItems = listLounge;
      const newSelectedItems = new Set(selectedItems);
      currentPageItems.forEach((item) => newSelectedItems.add(item[key]));
      setSelectedItems(newSelectedItems);
    } else {
      const currentPageItems = listLounge;
      const newSelectedItems = new Set(selectedItems);
      currentPageItems.forEach((item) => newSelectedItems.delete(item[key]));
      setSelectedItems(newSelectedItems);
    }
  };
  useEffect(() => {
    const allSelected = listLounge.every((item) =>
      selectedItems.has(item[key]),
    );
    setSelectAll(allSelected);
  }, [selectedItems, listLounge]);

  const handleItemSelect = (item) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(item[key])) {
      newSelectedItems.delete(item[key]);
    } else {
      newSelectedItems.add(item[key]);
    }
    setSelectedItems(newSelectedItems);
  };

  const handleGetListLoungeAgent = () => {
    if (currentPage === 1) {
      handleGetListLounge();
    } else {
      setCurrentPage(1);
    }
  };

  const handleGetListLounge = async () => {
    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
    };
    if (loungeType !== 0) {
      param.loungeType = loungeType;
    }
    if (searchBy) {
      param.searchBy = searchBy;
    }
    const result = await loungeApi.getListLounge(param);
    if (result?.errorCode === SUCCESS) {
      setListLounge(result.datas);
      setTotalCount(result.totalCount);
    } else {
      setListLounge([]);
      setTotalCount(0);
    }
    setInitFlag(false);
  };

  const handleDeleteLounge = async () => {
    const param = {
      loungeIds: Array.from(selectedItems),
    };
    const result = await loungeApi.deleteLounge(param);
    openModal({ text: result.message });
    if (result?.errorCode === SUCCESS) {
      setSelectedItems(new Set());
      handleGetListLoungeAgent();
    }
  };

  const itemCard = useCallback((item, index) => {
    const id = item?.id;
    const createdAt = item?.createdAt;
    const loungeId = item?.loungeId;
    const title = item?.title;
    const viewCnt = item?.viewCnt;
    const userType = item?.userType;

    const handleDetail = (item) => {
      router.push(`${MGNT.LOUNGE.DETAIL}/${item.loungeId}`);
    };

    const handleType = (type) => {
      if (type === 1) return localeText(LANGUAGES.LOUNGE.BUYER);
      if (type === 2) return localeText(LANGUAGES.LOUNGE.SELLER);
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
          <Center>
            <CustomCheckBox
              isChecked={selectedItems.has(loungeId)}
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
            whiteSpace={'pre-wrap'}
          >
            {handleType(userType)}
          </Text>
        </Td>
        <Td w={tableHeader[1].width}>
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
        <Td w={tableHeader[2].width}>
          <Text
            cursor={'pointer'}
            onClick={() => {
              handleDetail(item);
            }}
            textDecoration={'underline'}
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
            whiteSpace={'nowrap'}
            overflow={'hidden'}
            textOverflow={'ellipsis'}
          >
            {title}
          </Text>
        </Td>
        <Td w={tableHeader[3].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
            whiteSpace={'pre-wrap'}
          >
            {utils.parseDateByCountryCode(createdAt, lang)}
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
            {utils.parseAmount(viewCnt)}
          </Text>
        </Td>
      </Tr>
    );
  });

  return (
    <MainContainer>
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
                  onClick={() => {
                    handleGetListLoungeAgent();
                  }}
                  placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
                  placeholderFontColor={'#A7C3D2'}
                />
              </Box>
              <Box>
                <HStack>
                  <Box w={'12.5rem'}>
                    <Select
                      value={Number(loungeType)}
                      onChange={(e) => {
                        setLoungeType(Number(e.target.value));
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
                      <option value={0}>
                        {localeText(LANGUAGES.COMMON.ALL)}
                      </option>
                      <option value={1}>
                        {localeText(LANGUAGES.LOUNGE.JOB_POSTING)}
                      </option>
                      <option value={2}>
                        {localeText(LANGUAGES.LOUNGE.JOB_HUNTING)}
                      </option>
                      <option value={3}>
                        {localeText(LANGUAGES.LOUNGE.MARKETPLACE)}
                      </option>
                      <option value={4}>
                        {localeText(LANGUAGES.LOUNGE.LEGAL_SERVICES)}
                      </option>
                      <option value={5}>
                        {localeText(LANGUAGES.LOUNGE.COMMUNITY)}
                      </option>
                    </Select>
                  </Box>
                  <Box w={'7rem'} h={'3rem'}>
                    <Button
                      onClick={() => {
                        const deleteIds = Array.from(selectedItems);
                        if (deleteIds.length > 0) {
                          openModal({
                            type: 'confirm',
                            text: localeText(LANGUAGES.INFO_MSG.DELETE_POST),
                            onAgree: () => {
                              handleDeleteLounge();
                            },
                          });
                        } else {
                          openModal({
                            text: localeText(LANGUAGES.INFO_MSG.SELECT_POST),
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
                            minW={'max-content'}
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
                  {listLounge.map((item, index) => {
                    return itemCard(item, index);
                  })}
                  {listLounge.length === 0 && (
                    <Tr>
                      <Td colSpan={6}>
                        <Center w={'100%'} h={'10rem'}>
                          <Text
                            fontSize={'1.5rem'}
                            fontWeight={500}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.INFO_MSG.NO_POST)}
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
    </MainContainer>
  );
};

export default LoungePage;
