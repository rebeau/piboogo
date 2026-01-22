'use client';

import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import {
  Box,
  Center,
  HStack,
  Text,
  useDisclosure,
  Img,
  Button,
  TableContainer,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import ContentBR from '@/components/common/ContentBR';
import IconRowArrow from '@public/svgs/icon/row-arrow.svg';
import CustomIcon from '@/components/icon/CustomIcon';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import utils from '@/utils';
import BestSellerModal from '@/components/custom/modal/BestSellerModal';
import bestSellerApi from '@/services/bestSellerApi';
import useMenu from '@/hooks/useMenu';
import MainContainer from '@/components/layout/MainContainer';
import { SUCCESS } from '@/constants/errorCode';
import useModal from '@/hooks/useModal';

const BestSellerPage = () => {
  const { listAllCategory, handleAllCategory, listFirstCategory } = useMenu();

  const { openModal } = useModal();
  const { lang, localeText } = useLocale();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState({});

  const {
    isOpen: isOpenBestSeller,
    onOpen: onOpenBestSeller,
    onClose: onCloseBestSeller,
  } = useDisclosure();

  const tableHeader = [
    { width: '2.75rem', title: localeText(LANGUAGES.SELLER.ORDER) },
    { width: '8.25rem', title: localeText(LANGUAGES.SELLER.MEMBER_EMAIL) },
    { width: '8.94rem', title: localeText(LANGUAGES.SELLER.BUSINESS) },
    { width: '8.9375rem', title: localeText(LANGUAGES.SELLER.BRAND) },
    { width: '8.9375rem', title: localeText(LANGUAGES.SELLER.PHONE_NUMBER) },
    { width: '7.75rem', title: localeText(LANGUAGES.SELLER.JOIN_DATE) },
    { width: '5rem', title: localeText(LANGUAGES.SELLER.FEE_RATES) },
    { width: '6.25rem', title: localeText(LANGUAGES.SELLER.LICENCE) },
    { width: '5.25rem', title: localeText(LANGUAGES.SELLER.REORDERING) },
    { width: '1.5rem', title: '' },
  ];

  const [totalListBestSeller, setTotalListBestSeller] = useState([]);

  useEffect(() => {
    if (listAllCategory.length > 0) {
      handleBeforeGetListBestSeller();
    } else {
      handleAllCategory();
    }
  }, [listAllCategory]);

  const handleBeforeGetListBestSeller = async () => {
    const totalListBestSeller = await Promise.all(
      listAllCategory.map(async (category) => {
        const first = category.firstCategoryId;
        return {
          firstCategoryId: first,
          name: category.name,
          list: await handleGetListBestSeller(first),
        };
      }),
    );

    setTotalListBestSeller(totalListBestSeller);
  };

  const handleGetListBestSeller = async (firstCategoryId) => {
    const param = {
      firstCategoryId: firstCategoryId,
    };
    const result = await bestSellerApi.getListBestSeller(param);
    if (result?.errorCode === SUCCESS) {
      return result.datas;
    } else {
      return [];
    }
  };

  const handleOnDragEnd = async (result, categoryKey) => {
    const { destination, source } = result;
    if (!destination || destination.index === source.index) return;

    let updatedCategory = null;

    const tempTotalListBestSeller = [...totalListBestSeller];
    const updatedTotalList = totalListBestSeller.map((category) => {
      if (category.firstCategoryId !== categoryKey) return category;

      const reorderedList = [...category.list];
      const [movedItem] = reorderedList.splice(source.index, 1);
      reorderedList.splice(destination.index, 0, movedItem);

      updatedCategory = { ...category, list: reorderedList };
      return updatedCategory;
    });

    if (!updatedCategory) return;
    setTotalListBestSeller(updatedTotalList);

    try {
      const param = handleReindex(updatedCategory.list).map((item) => {
        return {
          bestSellerId: item.bestSellerId,
          idx: item.idx,
        };
      });
      const result = await bestSellerApi.patchBestSeller(param);
      if (result?.errorCode !== SUCCESS) {
        openModal({ text: result.message });
        setTotalListBestSeller(tempTotalListBestSeller);
      }
    } finally {
      // console.error('API 업데이트 실패:', error);
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

  const itemCard = useCallback((provided, snapshot, item, index) => {
    const id = item?.id;
    const companyPhone = item?.companyPhone;
    const feeRate = item?.feeRate;
    const createdAt = item?.createdAt;
    const companyName = item?.companyName;
    const brandName = item?.brandName;
    const sellerUserId = item?.sellerUserId;
    const approvalFlag = item?.approvalFlag;
    const idx = item?.idx;
    const firstCategoryId = item?.firstCategoryId;
    const bestSellerId = item?.bestSellerId;

    const handleAuth = (auth) => {
      if (auth === 1) {
        return localeText(LANGUAGES.STATUS.UNAUTHORIZED);
      } else if (auth === 2) {
        return localeText(LANGUAGES.STATUS.AUTHORIZED);
      }
      return auth;
    };

    const handleDelete = async (item) => {
      const param = {
        bestSellerIds: [Number(item.bestSellerId)],
      };
      const result = await bestSellerApi.deleteBestSeller(param);
      if (result?.errorCode === SUCCESS) {
        handleBeforeGetListBestSeller();
      }
    };

    return (
      <Tr
        key={index}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        w={'100%'}
        px={'1rem'}
        py={'0.75rem'}
        borderBottom={snapshot.isDragging ? null : '1px solid #73829D'}
        boxSizing={'border-box'}
      >
        <Td
          cursor={'pointer'}
          onClick={() => {
            handleMember(item);
          }}
        >
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.parseAmount(idx)}
          </Text>
        </Td>
        <Td>
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
            {utils.parsePhoneNum(companyPhone)}
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
            {feeRate}%
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
        <Td>
          <Center>
            <Img
              w={'1.5rem'}
              h={'1.5rem'}
              objectFit={'cover'}
              src={IconRowArrow.src}
            />
          </Center>
        </Td>
        <Td px={'0.5rem'} pr={'1rem'}>
          <Center
            w={'100%'}
            minW={'100%'}
            cursor={'pointer'}
            onClick={() => {
              openModal({
                type: 'confirm',
                text: localeText(LANGUAGES.INFO_MSG.DELETE_A_BEST_SELLER),
                onAgree: () => {
                  handleDelete(item);
                },
              });
            }}
          >
            <CustomIcon name={'close'} color={'#940808'} />
          </Center>
        </Td>
      </Tr>
    );
  });

  return (
    <MainContainer>
      {totalListBestSeller.map((item, index) => {
        const category = item.name;
        const categoryKey = item.firstCategoryId;
        const listBestSeller = item.list;
        return (
          <Box w={'100%'} key={index}>
            <ContentBR h={'1.25rem'} />

            <Box w={'100%'}>
              <HStack justifyContent={'space-between'} alignContent={'center'}>
                <Text
                  textAlign={'center'}
                  color={'#485766'}
                  fontSize={'1.125rem'}
                  fontWeight={500}
                  lineHeight={'1.96875rem'}
                >
                  {category}
                </Text>
                <Box>
                  <HStack
                    spacing={'0.75rem'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                  >
                    <Box w={'7.5rem'} h={'3rem'}>
                      <Button
                        onClick={() => {
                          setSelectedCategory(item);
                          onOpenBestSeller();
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
                            {localeText(LANGUAGES.COMMON.ADD)}
                          </Text>
                        </HStack>
                      </Button>
                    </Box>
                  </HStack>
                </Box>
              </HStack>
            </Box>

            <ContentBR h={'1.25rem'} />

            <Box w={'100%'}>
              <TableContainer w={'100%'}>
                <Table w={'100%'}>
                  <Thead
                    w={'100%'}
                    borderTop={'1px solid #73829D'}
                    borderBottom={'1px solid #73829D'}
                    px={'1rem'}
                    py={'0.75rem'}
                  >
                    <Tr>
                      {tableHeader.map((item, index) => {
                        return (
                          <Th key={index} px={'1rem'}>
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
                    </Tr>
                  </Thead>
                  <DragDropContext
                    onDragEnd={(result) => handleOnDragEnd(result, categoryKey)}
                  >
                    <Droppable
                      droppableId={`${categoryKey}-droppable`}
                      direction="vertical"
                    >
                      {(provided) => (
                        <Tbody
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {listBestSeller.map((item, index) => {
                            const key = `${categoryKey}-${index}`;
                            return (
                              <Draggable
                                key={key}
                                draggableId={key}
                                index={index}
                              >
                                {(provided, snapshot) =>
                                  itemCard(provided, snapshot, item, index)
                                }
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </Tbody>
                      )}
                    </Droppable>
                  </DragDropContext>
                </Table>
              </TableContainer>
            </Box>

            <ContentBR h={'1.25rem'} />
          </Box>
        );
      })}

      <ContentBR h={'1.25rem'} />

      {isOpenBestSeller && (
        <BestSellerModal
          isOpen={isOpenBestSeller}
          selectedCategory={selectedCategory}
          onClose={(ret) => {
            if (ret) {
              handleBeforeGetListBestSeller();
            }
            onCloseBestSeller();
          }}
        />
      )}
    </MainContainer>
  );
};

export default BestSellerPage;
