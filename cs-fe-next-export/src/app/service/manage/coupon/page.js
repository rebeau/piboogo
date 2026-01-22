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
import CustomIcon from '@/components/icon/CustomIcon';
import CouponDetailModal from '@/components/custom/page/coupon/CouponDetailModal';
import CouponIssueModal from '@/components/custom/page/coupon/CouponIssueModal';
import CouponEditModal from '@/components/custom/page/coupon/CouponEditModal';
import CustomCheckBox from '@/components/common/checkbox/CustomCheckBox';
import MainContainer from '@/components/layout/MainContainer';
import buyerUserApi from '@/services/buyerUserApi';
import { SUCCESS } from '@/constants/errorCode';
import { LIST_CONTENT_NUM } from '@/constants/common';
import utils from '@/utils';
import couponApi from '@/services/couponApi';
import useMove from '@/hooks/useMove';
import holdingCouponApi from '@/services/holdingCouponApi';

const CouponPage = () => {
  const { moveBuyerDetail } = useMove();
  const { lang, localeText } = useLocale();

  const {
    isOpen: isOpenDetail,
    onOpen: onOpenDetail,
    onClose: onCloseDetail,
  } = useDisclosure();

  const {
    isOpen: isOpenIssue,
    onOpen: onOpenIssue,
    onClose: onCloseIssue,
  } = useDisclosure();

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseAdd,
  } = useDisclosure();

  const [initFlag, setInitFlag] = useState(true);

  const [isModify, setIsModify] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState({});

  const [tabIndex, setTabIndex] = useState(0);
  const [listUser, setListUser] = useState([]);
  const [searchBy, setSearchBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);

  const [listCoupon, setListCoupon] = useState([]);
  const [searchByCoupon, setSearchByCoupon] = useState('');
  const [currentPageCoupon, setCurrentPageCoupon] = useState(1);
  const [totalCountCoupon, setTotalCountCoupon] = useState(1);
  const [contentNumCoupon, setContentNumCoupon] = useState(LIST_CONTENT_NUM[0]);

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

  const tableHeaderType1 = [
    { width: 'auto', title: localeText(LANGUAGES.COUPON.MEMBER_EMAIL) },
    { width: 'auto', title: localeText(LANGUAGES.COUPON.NAME) },
    { width: 'auto', title: localeText(LANGUAGES.COUPON.PHONE_NUMBER) },
    { width: 'auto', title: localeText(LANGUAGES.COUPON.JOIN_DATE) },
    { width: 'auto', title: localeText(LANGUAGES.COUPON.COUPON) },
    {
      width: 'auto',
      title: localeText(LANGUAGES.COUPON.TOTAL_PURCHASE_PRICE),
    },
  ];

  useEffect(() => {
    handleGetListCouponAgent();
  }, [contentNumCoupon]);

  useEffect(() => {
    if (!initFlag) {
      handleGetListCoupon();
    }
  }, [currentPageCoupon]);

  const handleGetListCouponAgent = () => {
    setSelectedItems(new Set());
    if (currentPageCoupon === 1) {
      handleGetListCoupon();
    } else {
      setCurrentPageCoupon(1);
    }
  };

  const handleGetListCoupon = async () => {
    const param = {
      pageNum: currentPageCoupon,
      contentNum: contentNumCoupon,
    };
    if (searchByCoupon) {
      param.searchBy = searchByCoupon;
    }

    const result = await couponApi.getListCoupon(param);
    if (result?.errorCode === SUCCESS) {
      setListCoupon(result.datas);
      setTotalCountCoupon(result.totalCount);
    } else {
      setListCoupon([]);
      setTotalCountCoupon(0);
    }
  };

  const tableHeaderType2 = [
    { width: 'auto', title: localeText(LANGUAGES.COUPON.TITLE) },
    { width: 'auto', title: localeText(LANGUAGES.COUPON.CONTENTS) },
    {
      width: 'auto',
      title: localeText(LANGUAGES.COUPON.REDEMPTION_TERMS),
    },
    { width: 'auto', title: localeText(LANGUAGES.COUPON.USAGE_PERIOD) },
    { width: 'auto', title: localeText(LANGUAGES.COUPON.PURCHASE_DATE) },
    { width: 'auto', title: localeText(LANGUAGES.COUPON.LATEST_ISSUE_DATE) },
    {
      width: 'auto',
      title: localeText(LANGUAGES.COUPON.ISSUE_COUPON),
    },
  ];

  const handleDetail = useCallback((item) => {
    setSelectedCoupon(item);
    onOpenDetail();
  });

  const handleIssue = useCallback((item) => {
    setSelectedCoupon(item);
    onOpenIssue();
  });

  const handleAdd = useCallback(() => {
    onOpenEdit();
  });

  const handleCoupon = useCallback((item) => {
    moveBuyerDetail(item.buyerUserId);
  });

  const userCard = useCallback((item, index) => {
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
        <Td w={tableHeaderType1[0].width}>
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
        <Td w={tableHeaderType1[1].width}>
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
        <Td w={tableHeaderType1[2].width}>
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
        <Td w={tableHeaderType1[3].width}>
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
        <Td w={tableHeaderType1[4].width}>
          <Text
            cursor={'pointer'}
            onClick={() => {
              handleCoupon(item);
            }}
            textDecoration={'underline'}
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseAmount(holdingCouponCnt)}
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
            {utils.parseDallar(totalPurchaseAmount)}
          </Text>
        </Td>
      </Tr>
    );
  });

  const couponCard = useCallback((item, index) => {
    const name = item?.name;
    const type = item?.type;
    const createdAt = item?.createdAt;
    const discountAmount = item?.discountAmount;
    const startDate = item?.startDate;
    const endDate = item?.endDate;
    const minimumPurchaseAmount = item?.minimumPurchaseAmount;
    const couponId = item?.couponId;
    const recentIssuedTime = item?.recentIssuedTime;
    const imageS3Url = item?.imageS3Url;

    let contents = null;
    if (type === 1) {
      contents = `${localeText(LANGUAGES.INFO_MSG.COUPON_MSG_TYPE1).replace(
        '@PRICE@',
        discountAmount,
      )}`;
    } else if (type === 2) {
      contents = `${localeText(LANGUAGES.INFO_MSG.COUPON_MSG_TYPE2).replace(
        '@PRICE@',
        utils.parseDallar(discountAmount),
      )}`;
    }
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
        <Td
          w={tableHeaderType2[0].width}
          cursor={'pointer'}
          onClick={() => {
            handleDetail(item);
          }}
        >
          <Text
            textDecoration={'underline'}
            textAlign={'left'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {name}
          </Text>
        </Td>
        <Td w={tableHeaderType2[1].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
            whiteSpace={'pre-wrap'}
          >
            {contents}
          </Text>
        </Td>
        <Td w={tableHeaderType2[2].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
            whiteSpace={'pre-wrap'}
          >
            {utils.parseDallar(minimumPurchaseAmount)}{' '}
            {localeText(LANGUAGES.COUPON.MINIMUM_PURCHASE)}
          </Text>
        </Td>
        <Td w={tableHeaderType2[3].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
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
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseDateByCountryCode(createdAt, lang)}
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
            {utils.parseDateByCountryCode(recentIssuedTime, lang)}
          </Text>
        </Td>
        <Td w={tableHeaderType2[6].width}>
          <Button
            onClick={() => {
              handleIssue(item);
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
              {localeText(LANGUAGES.COUPON.ISSUE_COUPON)}
            </Text>
          </Button>
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
                    w={'4rem'}
                    textAlign={'center'}
                    color={tabIndex === 0 ? '#66809C' : '#A7C3D2'}
                    fontSize={'0.9375rem'}
                    fontWeight={tabIndex === 0 ? 600 : 400}
                    lineHeight={'1.5rem'}
                  >
                    {localeText(LANGUAGES.COMMON.ALL)}
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
              <Box minW={'25rem'} h={'3rem'}>
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
                    {tableHeaderType1.map((item, index) => {
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
                    return userCard(item, index);
                  })}
                  {listUser.length === 0 && (
                    <Tr>
                      <Td colSpan={8}>
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

      <ContentBR h={'2.5rem'} />

      <Box w={'100%'}>
        <VStack spacing={'1.25rem'}>
          <Box w={'100%'}>
            <HStack justifyContent={'space-between'} alignItems={'center'}>
              <Text
                color={'#485766'}
                fontSize={'1.125rem'}
                fontWeight={500}
                lineHeight={'1.96875rem'}
                whiteSpace={'pre-wrap'}
              >
                {localeText(LANGUAGES.COUPON.ISSUE_COUPON)}
              </Text>
              <Box>
                <HStack spacing={'1.25rem'}>
                  <Box w={'25rem'} h={'3rem'}>
                    <SearchInput
                      value={searchByCoupon}
                      onChange={(e) => {
                        setSearchByCoupon(e.target.value);
                      }}
                      onClick={handleGetListCouponAgent}
                      placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
                      placeholderFontColor={'#A7C3D2'}
                    />
                  </Box>
                  <Box w={'9.9375rem'} h={'3rem'}>
                    <Button
                      onClick={() => {
                        handleAdd();
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
                      <HStack spacing={'0.5rem'} justifyContent={'center'}>
                        <Center w={'1.25rem'} h={'1.25rem'}>
                          <CustomIcon
                            w={'100%'}
                            h={'100%'}
                            name={'plus'}
                            color={'#FFF'}
                          />
                        </Center>
                        <Text
                          color={'#FFF'}
                          fontSize={'1rem'}
                          fontWeight={400}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.COUPON.ADD_COUPON)}
                        </Text>
                      </HStack>
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
                    {tableHeaderType2.map((item, index) => {
                      return (
                        <Th w={item.width} key={index}>
                          <Text
                            w={'100%'}
                            textAlign={index === 0 ? 'left' : 'center'}
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
                  {listCoupon.map((item, index) => {
                    return couponCard(item, index);
                  })}
                  {listCoupon.length === 0 && (
                    <Tr>
                      <Td colSpan={5}>
                        <Center w={'100%'} h={'10rem'}>
                          <Text
                            fontSize={'1.5rem'}
                            fontWeight={500}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.INFO_MSG.NO_COUPON_FOUND)}
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
                  value={Number(contentNumCoupon)}
                  onChange={(e) => {
                    setContentNumCoupon(Number(e.target.value));
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
                  currentPage={currentPageCoupon}
                  setCurrentPage={setCurrentPageCoupon}
                  totalCount={totalCountCoupon}
                  contentNum={contentNumCoupon}
                />
              </Box>
            </HStack>
          </Box>
        </VStack>
      </Box>

      <ContentBR h={'1.25rem'} />
      {isOpenDetail && (
        <CouponDetailModal
          selectedCoupon={selectedCoupon}
          handleGetListCouponAgent={handleGetListCouponAgent}
          isOpen={isOpenDetail}
          onClose={(ret) => {
            if (ret) {
              setIsModify(true);
              onOpenEdit();
            } else {
              setSelectedCoupon({});
            }
            onCloseDetail();
          }}
        />
      )}
      {isOpenIssue && (
        <CouponIssueModal
          isOpen={isOpenIssue}
          selectedItems={selectedItems}
          selectedCoupon={selectedCoupon}
          onClose={(ret) => {
            if (ret) {
              handleGetListBuyerUserGrade();
              handleGetListCouponAgent();
            }
            setSelectedCoupon({});
            onCloseIssue();
          }}
        />
      )}
      {isOpenEdit && (
        <CouponEditModal
          isModify={isModify}
          selectedCoupon={selectedCoupon}
          isOpen={isOpenEdit}
          onClose={(ret) => {
            if (ret) {
              handleGetListCouponAgent();
            }
            setIsModify(false);
            setSelectedCoupon({});
            onCloseAdd();
          }}
        />
      )}
    </MainContainer>
  );
};

export default CouponPage;
