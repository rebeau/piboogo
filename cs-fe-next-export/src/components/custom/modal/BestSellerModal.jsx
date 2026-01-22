'use client';

import {
  Box,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  HStack,
  Text,
  Button,
  Select,
  VStack,
  Center,
} from '@chakra-ui/react';

import { useCallback, useEffect, useState } from 'react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import ContentBR from '@/components/common/ContentBR';
import SearchInput from '../input/SearchInput';
import { DefaultPaginate } from '@/components';
import CustomIcon from '@/components/icon/CustomIcon';
import CustomCheckBox from '@/components/common/checkbox/CustomCheckBox';
import { LIST_CONTENT_NUM } from '@/constants/common';
import sellerUserApi from '@/services/sellerUserApi';
import { SUCCESS } from '@/constants/errorCode';
import utils from '@/utils';
import useModal from '@/hooks/useModal';
import bestSellerApi from '@/services/bestSellerApi';

const BestSellerModal = (props) => {
  const { openModal } = useModal();
  const { lang, localeText } = useLocale();
  const [searchBy, setSearchBy] = useState(null);
  const { isOpen, onClose, selectedCategory } = props;

  const [listSeller, setListSeller] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);

  // 공통 key
  const key = 'sellerUserId';

  // 체크 담는 배열
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // 전체 선택
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
  // 전체 체크 여부
  useEffect(() => {
    // 전체 항목 중에서 선택된 항목의 개수를 확인
    const allSelected = listSeller.every((item) =>
      selectedItems.has(item[key]),
    );
    setSelectAll(allSelected); // 모든 항목이 선택되면 selectAll true로 설정, 아니면 false
  }, [selectedItems, listSeller]); // selectedItems와 listProduct 바뀔 때마다 실행
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

  useEffect(() => {
    handleGetListSeller();
  }, [currentPage, contentNum]);

  const handleGetListSellerAgent = () => {
    if (currentPage === 1) {
      handleGetListSeller();
    } else {
      setContentNum(1);
    }
  };

  const handleGetListSeller = async () => {
    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
      firstCategoryId: selectedCategory.firstCategoryId,
    };
    if (searchBy) {
      param.searchBy = searchBy;
    }
    const result = await sellerUserApi.getListSeller(param);
    if (result?.errorCode === SUCCESS) {
      setListSeller(result.datas);
      setTotalCount(result.totalCount);
    } else {
      setListSeller([]);
      setTotalCount(0);
    }
  };

  const tableHeader = [
    { width: '7rem', title: localeText(LANGUAGES.ACC.EMAIL) },
    { width: '7rem', title: localeText(LANGUAGES.SELLER.BUSINESS) },
    { width: '7rem', title: localeText(LANGUAGES.SELLER.BRAND) },
    { width: '7rem', title: localeText(LANGUAGES.SELLER.PHONE_NUMBER) },
    { width: '7rem', title: localeText(LANGUAGES.SELLER.JOIN_DATE) },
    { width: '5rem', title: localeText(LANGUAGES.SELLER.FEE_RATES) },
    { width: '6.25rem', title: localeText(LANGUAGES.SELLER.LICENCE) },
  ];

  const handleFinally = useCallback(() => {
    if (onClose) {
      onClose();
    }
  });

  const handleSelect = useCallback(async () => {
    const selectedIds = Array.from(selectedItems);
    const param = {
      firstCategoryId: selectedCategory.firstCategoryId,
      sellerUserId: selectedIds,
    };
    const result = await bestSellerApi.postBestSeller(param);
    openModal({ text: result.message });
    if (result?.errorCode === SUCCESS) {
      onClose(true);
    }
  });

  const sellerCard = useCallback((item, index) => {
    const id = item?.id;
    const companyPhone = item?.companyPhone;
    const feeRate = item?.feeRate;
    const totalSalesAmount = item?.totalSalesAmount;
    const createdAt = item?.createdAt;
    const companyName = item?.companyName;
    const brandName = item?.brandName;
    const sellerUserId = item?.sellerUserId;
    const approvalFlag = item?.approvalFlag;

    const handleAuth = (auth) => {
      if (auth === 1) {
        return localeText(LANGUAGES.STATUS.UNAUTHORIZED);
      } else if (auth === 2) {
        return localeText(LANGUAGES.STATUS.AUTHORIZED);
      }
      return auth;
    };

    return (
      <Box
        key={index}
        w={'100%'}
        px={'1rem'}
        py={'0.75rem'}
        borderBottom={'1px solid #73829D'}
        boxSizing={'border-box'}
      >
        <HStack spacing={'0.75rem'}>
          <Center>
            <CustomCheckBox
              isChecked={selectedItems.has(item[key])}
              onChange={() => handleItemSelect(item)}
            />
          </Center>
          <Box w={tableHeader[0].width}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9357rem'}
              fontWeight={500}
              lineHeight={'1.5rem'}
            >
              {id}
            </Text>
          </Box>
          <Box w={tableHeader[1].width}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {companyName}
            </Text>
          </Box>
          <Box w={tableHeader[2].width}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {brandName}
            </Text>
          </Box>
          <Box w={tableHeader[3].width}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {utils.parsePhoneNum(companyPhone)}
            </Text>
          </Box>
          <Box w={tableHeader[4].width}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {utils.parseDateByCountryCode(createdAt, lang)}
            </Text>
          </Box>
          <Box w={tableHeader[5].width}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9375rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {feeRate}%
            </Text>
          </Box>
          <Box w={tableHeader[6].width}>
            <Text
              textAlign={'center'}
              color={approvalFlag === 1 ? '#940808' : '#485766'}
              fontSize={'0.9375rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {handleAuth(approvalFlag)}
            </Text>
          </Box>
        </HStack>
      </Box>
    );
  });

  return (
    <Modal isOpen={isOpen} onClose={handleFinally} size="md">
      <ModalOverlay bg={'rgba(0, 0, 0, 0.60)'} />
      <ModalContent
        alignSelf={'center'}
        borderRadius={0}
        w={'60rem'}
        maxW={null}
      >
        <ModalBody
          w={'100%'}
          h={'100%'}
          position={'relative'}
          pt={'1.5rem'}
          pb={'1.5rem'}
          px={'1.5rem'}
        >
          <VStack>
            <Box w={'100%'}>
              <HStack justifyContent={'space-between'}>
                <Box>
                  <Text
                    color={'#485766'}
                    fontSize={'1.125rem'}
                    fontWeight={400}
                    lineHeight={'1.96875rem'}
                  >
                    {localeText(LANGUAGES.BEST_SELLER.ADD_SELLER)}
                  </Text>
                </Box>
                <Box
                  w={'2rem'}
                  h={'2rem'}
                  cursor={'pointer'}
                  onClick={() => {
                    handleFinally();
                  }}
                >
                  <CustomIcon
                    w={'100%'}
                    h={'100%'}
                    name={'close'}
                    color={'#7895B2'}
                  />
                </Box>
              </HStack>
            </Box>

            <Box w={'100%'}>
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

            <Box w="100%">
              <VStack
                spacing={0}
                justifyContent={'space-between'}
                h="30rem"
                maxH={'80%'}
                overflowY={'auto'}
              >
                <Box w={'100%'}>
                  <Box w={'100%'}>
                    {/* Product Rows */}
                    <VStack spacing={0}>
                      {/* header */}
                      <Box
                        w={'100%'}
                        borderTop={'1px solid #73829D'}
                        borderBottom={'1px solid #73829D'}
                        px={'1rem'}
                        py={'0.75rem'}
                        boxSizing={'border-box'}
                      >
                        <HStack spacing={'0.75rem'}>
                          <Center>
                            <CustomCheckBox
                              isChecked={selectAll}
                              onChange={handleSelectAll}
                            />
                          </Center>
                          {tableHeader.map((item, index) => {
                            return (
                              <Box w={item.width} key={index}>
                                <Text
                                  textAlign={'center'}
                                  color={'#2A333C'}
                                  fontSize={'0.9375rem'}
                                  fontWeight={500}
                                  lineHeight={'1.5rem'}
                                >
                                  {item.title}
                                </Text>
                              </Box>
                            );
                          })}
                        </HStack>
                      </Box>
                      {/* body */}
                      <Box w={'100%'}>
                        {listSeller.map((item, index) => {
                          return sellerCard(item, index);
                        })}
                      </Box>

                      <ContentBR h={'1.5rem'} />

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
                </Box>
              </VStack>
            </Box>

            <Box w={'100%'} h={'4rem'}>
              <Button
                onClick={() => {
                  const selectedIds = Array.from(selectedItems);
                  if (selectedIds.length === 0) {
                    setTimeout(() => {
                      openModal({
                        text: localeText(LANGUAGES.INFO_MSG.SELECT_A_SELLER),
                      });
                    });
                    return;
                  }
                  openModal({
                    type: 'confirm',
                    text: localeText(LANGUAGES.INFO_MSG.SELECT_A_BEST_SELLER),
                    onAgree: () => {
                      handleSelect();
                    },
                  });
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
                  fontSize={'1.25rem'}
                  fontWeight={400}
                  lineHeight={'2.25rem'}
                >
                  {localeText(LANGUAGES.BEST_SELLER.SELECTING_BESTSELLER)}
                </Text>
              </Button>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BestSellerModal;
