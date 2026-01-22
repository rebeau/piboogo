'use client';

import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import {
  Box,
  Center,
  HStack,
  Text,
  VStack,
  Select,
  Img,
  Button,
  Image as ChakraImage,
  RadioGroup,
  Radio,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  Thead,
  Th,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { DefaultPaginate } from '@/components';
import ContentBR from '@/components/common/ContentBR';
import IconRowArrow from '@public/svgs/icon/row-arrow.svg';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import utils from '@/utils';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import BannerPreview from '@/components/custom/page/banner/BannerPreview';
import CustomCheckBox from '@/components/common/checkbox/CustomCheckBox';
import MainContainer from '@/components/layout/MainContainer';
import bannerApi from '@/services/bannerApi';
import { SUCCESS } from '@/constants/errorCode';
import { LIST_CONTENT_NUM } from '@/constants/common';
import useModal from '@/hooks/useModal';
import useMove from '@/hooks/useMove';
import useStatus from '@/hooks/useStatus';

const BannerPage = () => {
  const router = useRouter();
  const { lang, localeText } = useLocale();
  const { openModal } = useModal();
  const { moveBannerDetail } = useMove();
  const { handleGetAuthStatus } = useStatus();

  const [initFlag, setInitFlag] = useState(true);
  const [type, setType] = useState(1);
  const [status, setStatus] = useState(1);
  const [listDataType1, setListDataType1] = useState([]);
  const [listDataType1Msg, setListDataType1Msg] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);

  const [listDataType2, setListDataType2] = useState([]);
  const [listDataType2Msg, setListDataType2Msg] = useState(null);

  const tableHeaderType1 = [
    { width: 'auto', title: localeText(LANGUAGES.BANNER.NAME) },
    { width: 'auto', title: localeText(LANGUAGES.BANNER.PERIOD) },
    { width: 'auto', title: localeText(LANGUAGES.BANNER.IMAGE) },
    { width: 'auto', title: localeText(LANGUAGES.BANNER.LINK) },
    { width: 'auto', title: localeText(LANGUAGES.BANNER.TARGET) },
    { width: 'auto', title: localeText(LANGUAGES.BANNER.SELLER) },
    { width: 'auto', title: localeText(LANGUAGES.BANNER.REQUEST) },
    { width: 'auto', title: localeText(LANGUAGES.BANNER.STATE) },
    { width: 'auto', title: localeText(LANGUAGES.BANNER.AUTHORIZATION) },
  ];

  const tableHeaderType2 = [
    { width: 'auto', title: localeText(LANGUAGES.BANNER.NAME) },
    { width: 'auto', title: localeText(LANGUAGES.BANNER.PERIOD) },
    { width: 'auto', title: localeText(LANGUAGES.BANNER.IMAGE) },
    { width: 'auto', title: localeText(LANGUAGES.BANNER.LINK) },
    { width: 'auto', title: localeText(LANGUAGES.BANNER.TARGET) },
    { width: 'auto', title: localeText(LANGUAGES.BANNER.SELLER) },
    { width: 'auto', title: localeText(LANGUAGES.BANNER.REQUEST) },
    { width: 'auto', title: localeText(LANGUAGES.BANNER.AUTHORIZATION) },
    { width: 'auto', title: localeText(LANGUAGES.BANNER.REORDERING) },
  ];

  useEffect(() => {
    handleGetListBannerApproval();
  }, [type]);

  useEffect(() => {
    handleGetListBanner();
  }, [currentPage, type]);

  useEffect(() => {
    if (!initFlag) {
      handleGetListBannerAgent();
    }
  }, [contentNum, status]);

  const handleGetListBannerAgent = () => {
    if (currentPage === 1) {
      handleGetListBanner();
    } else {
      setCurrentPage(1);
    }
  };

  const handleGetListBanner = async () => {
    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
    };
    if (type !== 0) {
      param.type = type;
    }
    if (status !== 0) {
      param.status = status;
    }
    const result = await bannerApi.getListBanner(param);
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

  const handleGetListBannerApproval = async () => {
    const param = {
      type: type,
    };
    const result = await bannerApi.getListBannerApproval(param);
    if (result?.errorCode === SUCCESS) {
      setListDataType2(result.datas);
    } else {
      setListDataType2([]);
      setListDataType2Msg(result.message);
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
    const reorderedRows = Array.from(listDataType2);
    const [removed] = reorderedRows.splice(source.index, 1);
    reorderedRows.splice(destination.index, 0, removed);

    const temp = handleReindex(reorderedRows);
    handlePatchBannerIdx(temp);
    setListDataType2(temp);
  };

  const handlePatchBannerIdx = async (datas) => {
    const param = datas.map((item) => {
      return {
        bannerId: item.bannerId,
        idx: item.idx,
      };
    });
    const result = await bannerApi.patchBannerIdx(param);
  };

  const handleMember = useCallback((item) => {
    console.log('handleMember', item);
  });

  const handleDetail = useCallback((item) => {
    moveBannerDetail(item.bannerId);
  });

  const handleDelete = async () => {
    const param = {
      bannerIds: Array.from(selectedItemsType1),
    };
    const result = await bannerApi.deleteBanner(param);
    openModal({
      text: result.message,
      onAgree: () => {
        if (result?.errorCode === SUCCESS) {
          setSelectedItemsType1(new Set());
          handleGetListBanner();
        }
      },
    });
  };

  const handleUnAuthorized = async () => {
    const bannerIds = Array.from(selectedItemsType2);
    handlePatchBannerApproval(bannerIds, 1);
  };

  const handleTargetLink = useCallback((targetLink) => {
    if (targetLink === 1) return localeText(LANGUAGES.BANNER.NAVIGATE_TO_PAGE);
  });

  const handlePatchBannerApproval = async (bannerIds, status) => {
    const param = bannerIds.map((id) => {
      return {
        bannerId: id,
        status: status,
      };
    });

    const result = await bannerApi.patchBannerApproval(param);
    openModal({ text: result.message });
    if (result?.errorCode === SUCCESS) {
      if (status === 1) {
        setSelectedItemsType2(new Set());
      } else if (status === 3) {
        setSelectedItemsType1(new Set());
      }
      handleGetListBannerAgent();
      handleGetListBannerApproval();
    }
  };

  const key = 'bannerId';

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
    const type = item?.type;
    const status = item?.status;
    const bannerId = item?.bannerId;
    const createdAt = item?.createdAt;
    const brandName = item?.brandName;
    const sellerUserId = item?.sellerUserId;
    const imageS3Url = item?.imageS3Url;
    const startDate = item?.startDate;
    const endDate = item?.endDate;
    const linkType = item?.linkType;
    const link = item?.link;

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
              isChecked={selectedItemsType1.has(bannerId)}
              onChange={() => handleItemSelectType1(item)}
            />
          </Center>
        </Td>
        <Td
          w={tableHeaderType1[0].width}
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
        <Td w={tableHeaderType1[1].width}>
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
        <Td w={tableHeaderType1[2].width}>
          <Center>
            <Center maxW={'12.5rem'} aspectRatio={12.5 / 4.6875}>
              <ChakraImage
                fallback={<DefaultSkeleton />}
                w={'100%'}
                h={'100%'}
                src={imageS3Url}
              />
            </Center>
          </Center>
        </Td>
        <Td w={tableHeaderType1[3].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseLongText(link, 5)}
          </Text>
        </Td>
        <Td w={tableHeaderType1[4].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
            whiteSpace={'pre-wrap'}
          >
            {handleTargetLink(linkType)}
          </Text>
        </Td>
        <Td
          w={tableHeaderType1[5].width}
          cursor={'pointer'}
          onClick={() => {
            handleMember(item);
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
        <Td w={tableHeaderType1[6].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
            whiteSpace={'pre-wrap'}
          >
            {utils.parseDateByCountryCode(createdAt, lang)}
          </Text>
        </Td>
        <Td w={tableHeaderType1[7].width}>
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
        <Td w={tableHeaderType1[8].width}>
          <Button
            onClick={() => {
              handlePatchBannerApproval([bannerId], 3);
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

  const itemCardType2 = useCallback((provided, snapshot, item, index) => {
    const name = item?.name;
    const type = item?.type;
    const status = item?.status;
    const bannerId = item?.bannerId;
    const createdAt = item?.createdAt;
    const brandName = item?.brandName;
    const sellerUserId = item?.sellerUserId;
    const imageS3Url = item?.imageS3Url;
    const startDate = item?.startDate;
    const endDate = item?.endDate;
    const linkType = item?.linkType;
    const link = item?.link;

    let period = localeText(LANGUAGES.COMMON.UNLIMITED);
    if (startDate && endDate) {
      period = `${utils.parseDateByCountryCode(startDate, lang)} - ${utils.parseDateByCountryCode(endDate, lang)}`;
    }

    return (
      <Tr
        key={index}
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
        <Td>
          <Center>
            <CustomCheckBox
              isChecked={selectedItemsType2.has(bannerId)}
              onChange={() => handleItemSelectType2(item)}
            />
          </Center>
        </Td>
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
            fontWeight={500}
            lineHeight={'1.5rem'}
          >
            {period}
          </Text>
        </Td>
        <Td w={tableHeaderType2[2].width}>
          <Center maxW={'12.5rem'} aspectRatio={12.5 / 4.6875}>
            <ChakraImage
              fallback={<DefaultSkeleton />}
              w={'100%'}
              h={'100%'}
              src={imageS3Url}
            />
          </Center>
        </Td>
        <Td w={tableHeaderType2[3].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseLongText(link, 5)}
          </Text>
        </Td>
        <Td w={tableHeaderType2[4].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
            whiteSpace={'pre-wrap'}
          >
            {handleTargetLink(linkType)}
          </Text>
        </Td>
        <Td
          w={tableHeaderType2[5].width}
          cursor={'pointer'}
          onClick={() => {
            handleMember(item);
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
        <Td w={tableHeaderType2[6].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9375rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
            whiteSpace={'pre-wrap'}
          >
            {utils.parseDateByCountryCode(createdAt, lang)}
          </Text>
        </Td>
        <Td w={tableHeaderType2[7].width}>
          <Button
            onClick={() => {
              handlePatchBannerApproval([bannerId], 1);
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
        <Td w={tableHeaderType2[8].width}>
          <Center w={'100%'}>
            <Img src={IconRowArrow.src} />
          </Center>
        </Td>
      </Tr>
    );
  });

  return (
    <MainContainer>
      <ContentBR h={'1.25rem'} />

      <Box>
        <RadioGroup
          w={'100%'}
          // value={type}
          value={Number(type)}
          onChange={(value) => {
            setType(Number(value));
          }}
        >
          <HStack spacing={'1.25rem'}>
            <Box>
              <HStack alignItems={'center'} spacing={'0.5rem'}>
                <Radio value={1} />
                <BannerPreview position={1} />
              </HStack>
            </Box>
            <Box>
              <HStack alignItems={'center'} spacing={'0.5rem'}>
                <Radio value={2} />
                <BannerPreview position={2} />
              </HStack>
            </Box>
          </HStack>
        </RadioGroup>
      </Box>

      <ContentBR h={'2.5rem'} />

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
                  {localeText(LANGUAGES.BANNER.SELLER_REQUEST_BANNER)}
                </Text>
              </Box>
              <Box>
                <HStack
                  spacing={'0.75rem'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                >
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
                      {/*
                      <option value={0}>
                        {localeText(LANGUAGES.COMMON.ALL)}
                      </option>
                      */}
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
                              LANGUAGES.INFO_MSG.DELETE_BANNER_MSG,
                            ),
                            onAgree: () => {
                              handleDelete();
                            },
                          });
                        } else {
                          openModal({
                            text: localeText(
                              LANGUAGES.INFO_MSG.SELECT_BANNER_MSG,
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
                        {localeText(LANGUAGES.COMMON.DELETE)}
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
                            isChecked={selectAllType1}
                            onChange={handleSelectAllType1}
                          />
                        </Center>
                      </Th>
                      {tableHeaderType1.map((item, index) => {
                        return (
                          <Th w={item.width} key={index}>
                            <Text
                              textAlign={index === 0 ? 'left' : 'center'}
                              color={'#2A333C'}
                              fontSize={
                                /*
                              lang === 'KR' && index === 3
                                ? '0.7rem'
                                : '0.9375rem'
                              */
                                '0.9375rem'
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
                    {listDataType1.map((item, index) => {
                      return itemCardType1(item, index);
                    })}
                    {listDataType1.length === 0 && (
                      <Tr>
                        <Td colSpan={10}>
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
                  {localeText(LANGUAGES.BANNER.AUTHORIZED_BANNER)}
                </Text>
              </Box>
              <Box w={'19.0625rem'} h={'3rem'}>
                <Button
                  onClick={() => {
                    const selectIds = Array.from(selectedItemsType2);
                    if (selectIds.length > 0) {
                      openModal({
                        type: 'confirm',
                        text: localeText(
                          LANGUAGES.INFO_MSG.UNAUTHORIZED_BANNER_MSG,
                        ),
                        onAgree: () => {
                          handleUnAuthorized();
                        },
                      });
                    } else {
                      openModal({
                        text: localeText(LANGUAGES.INFO_MSG.SELECT_BANNER_MSG),
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
                    {localeText(LANGUAGES.BANNER.CHANGE_STATUS_TO_UNAUTHORIZED)}
                  </Text>
                </Button>
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
                            isChecked={selectAllType2}
                            onChange={handleSelectAllType2}
                          />
                        </Center>
                      </Th>
                      {tableHeaderType2.map((item, index) => {
                        return (
                          <Th w={item.width} key={index}>
                            <Text
                              textAlign={index === 0 ? 'left' : 'center'}
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
                    </Tr>
                  </Thead>
                  {listDataType2.length > 0 && (
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                      <Droppable droppableId="droppable">
                        {(provided) => (
                          <Tbody
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {listDataType2.map((item, index) => {
                              return (
                                <Draggable
                                  key={String(item.bannerId)}
                                  draggableId={String(item.bannerId)}
                                  index={index}
                                >
                                  {(provided, snapshot) =>
                                    itemCardType2(
                                      provided,
                                      snapshot,
                                      item,
                                      index,
                                    )
                                  }
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </Tbody>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                  {listDataType2.length === 0 && (
                    <Tbody>
                      <Tr>
                        <Td colSpan={10}>
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
                    </Tbody>
                  )}
                </Table>
              </TableContainer>
            </VStack>
          </Box>
        </VStack>
      </Box>

      <ContentBR h={'1.25rem'} />
    </MainContainer>
  );
};

export default BannerPage;
