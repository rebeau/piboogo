'use client';

import ContentHeader from '@/components/layout/header/ContentHeader';
import {
  Box,
  Center,
  HStack,
  Text,
  VStack,
  Select,
  Button,
  useDisclosure,
  Textarea,
  TableContainer,
  Table,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import { useCallback, useEffect, useState } from 'react';
import { DefaultPaginate } from '@/components';
import SearchInput from '@/components/custom/input/SearchInput';
import ContentBR from '@/components/common/ContentBR';
import CustomCheckBox from '@/components/common/checkbox/CustomCheckBox';
import CustomIcon from '@/components/icon/CustomIcon';
import HelpQuestionModal from '@/components/custom/page/help/HelpQuestionModal';
import HelpNoticeModal from '@/components/custom/page/help/HelpNoticeModal';
import HelpNoticeEditModal from '@/components/custom/page/help/HelpNoticeEditModal';
import MainContainer from '@/components/layout/MainContainer';
import { LIST_CONTENT_NUM } from '@/constants/common';
import fnqApi from '@/services/fnqApi';
import { SUCCESS } from '@/constants/errorCode';
import noticeApi from '@/services/noticeApi';
import useModal from '@/hooks/useModal';
import utils from '@/utils';

const HelpPage = () => {
  const router = useRouter();
  const { lang, localeText } = useLocale();
  const { openModal } = useModal();

  const {
    isOpen: isOpenQuestion,
    onOpen: onOpenQuestion,
    onClose: onCloseQuestion,
  } = useDisclosure();

  const {
    isOpen: isOpenNotice,
    onOpen: onOpenNotice,
    onClose: onCloseNotice,
  } = useDisclosure();

  const {
    isOpen: isOpenNoticeEdit,
    onOpen: onOpenNoticeEdit,
    onClose: onCloseNoticeEdit,
  } = useDisclosure();

  const [searchBy, setSearchBy] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [isModify, setIsModify] = useState(false);
  const [targetItem, setTargetItem] = useState({});

  const [initFlag, setInitFlag] = useState(true);
  const [listFnq, setListFnq] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);

  const [listNotice, setListNotice] = useState([]);
  const [currentPageNotice, setCurrentPageNotice] = useState(1);
  const [totalCountNotice, setTotalCountNotice] = useState(1);
  const [contentNumNotice, setContentNumNotice] = useState(LIST_CONTENT_NUM[0]);

  useEffect(() => {
    setSearchBy('');
  }, [tabIndex]);

  const key = 'fnqId';

  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const currentPageItems = listFnq;
      const newSelectedItems = new Set(selectedItems);
      currentPageItems.forEach((item) => newSelectedItems.add(item[key]));
      setSelectedItems(newSelectedItems);
    } else {
      const currentPageItems = listFnq;
      const newSelectedItems = new Set(selectedItems);
      currentPageItems.forEach((item) => newSelectedItems.delete(item[key]));
      setSelectedItems(newSelectedItems);
    }
  };
  useEffect(() => {
    const allSelected = listFnq.every((item) => selectedItems.has(item[key]));
    setSelectAll(allSelected);
  }, [selectedItems, listFnq]);

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
    handleGetListFnq();
  }, [currentPage]);

  useEffect(() => {
    if (!initFlag) {
      handleGetListFnqAgent();
    }
  }, [contentNum]);

  const handleGetListFnqAgent = () => {
    if (currentPage === 1) {
      handleGetListFnq();
    } else {
      setCurrentPage(1);
    }
  };

  const handleGetListFnq = async () => {
    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
    };
    if (searchBy) {
      param.searchBy = searchBy;
    }

    const result = await fnqApi.getListFnq(param);
    if (result?.errorCode === SUCCESS) {
      setListFnq(result.datas);
      setTotalCount(result.totalCount);
    } else {
      setListFnq([]);
      setTotalCount(0);
    }
    setInitFlag(false);
  };

  const noticekey = 'noticeId';

  const [selectedItemsNotice, setSelectedItemsNotice] = useState(new Set());
  const [selectAllNotice, setSelectAllNotice] = useState(false);

  const handleSelectAllNotice = () => {
    setSelectAllNotice(!selectAllNotice);
    if (!selectAllNotice) {
      const currentPageItems = listNotice;
      const newSelectedItems = new Set(selectedItemsNotice);
      currentPageItems.forEach((item) => newSelectedItems.add(item[noticekey]));
      setSelectedItemsNotice(newSelectedItems);
    } else {
      const currentPageItems = listNotice;
      const newSelectedItems = new Set(selectedItemsNotice);
      currentPageItems.forEach((item) =>
        newSelectedItems.delete(item[noticekey]),
      );
      setSelectedItemsNotice(newSelectedItems);
    }
  };
  useEffect(() => {
    const allSelected = listNotice.every((item) =>
      selectedItemsNotice.has(item[noticekey]),
    );
    setSelectAllNotice(allSelected);
  }, [selectedItemsNotice, listNotice]);

  const handleItemSelectNotice = (item) => {
    const newSelectedItems = new Set(selectedItemsNotice);
    if (newSelectedItems.has(item[noticekey])) {
      newSelectedItems.delete(item[noticekey]);
    } else {
      newSelectedItems.add(item[noticekey]);
    }
    setSelectedItemsNotice(newSelectedItems);
  };

  useEffect(() => {
    handleGetListNotice();
  }, [currentPageNotice]);

  useEffect(() => {
    if (!initFlag) {
      handleGetListNoticeAgent();
    }
  }, [contentNumNotice]);

  const handleGetListNoticeAgent = () => {
    if (currentPageNotice === 1) {
      handleGetListNotice();
    } else {
      setCurrentPageNotice(1);
    }
  };

  const handleGetListNotice = async () => {
    const param = {
      pageNum: currentPageNotice,
      contentNum: contentNumNotice,
    };
    if (searchBy) {
      param.searchBy = searchBy;
    }

    const result = await noticeApi.getListNotice(param);
    if (result?.errorCode === SUCCESS) {
      setListNotice(result.datas);
      setTotalCountNotice(result.totalCount);
    } else {
      setListNotice([]);
      setTotalCountNotice(0);
    }
  };

  const handleDeleteQuestion = useCallback(async () => {
    const param = {
      fnqIds: Array.from(selectedItems),
    };

    const result = await fnqApi.deleteFnq(param);
    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result.message,
        onAgree: () => {
          setSelectedItems(new Set());
          handleGetListFnqAgent();
        },
      });
    }
  });

  const handleAddQuestion = useCallback(() => {
    setIsModify(false);
    setTargetItem({});
    setTimeout(() => {
      onOpenQuestion();
    }, 50);
  });

  const handleModifyQuestion = useCallback((item) => {
    setIsModify(true);
    setTargetItem(item);
    setTimeout(() => {
      onOpenQuestion();
    }, 50);
  });

  const handleDeleteNotice = useCallback(async () => {
    const param = {
      noticeIds: Array.from(selectedItemsNotice),
    };

    const result = await noticeApi.deleteNotice(param);
    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result.message,
        onAgree: () => {
          setSelectedItemsNotice(new Set());
          handleGetListNoticeAgent();
        },
      });
    }
  });

  const handleAddNotice = useCallback(() => {
    setIsModify(false);
    setTargetItem({});
    setTimeout(() => {
      onOpenNoticeEdit();
    }, 50);
  });

  const handleModifyNotice = useCallback((item) => {
    setIsModify(false);
    setTargetItem(item);
    setTimeout(() => {
      onOpenNotice();
    }, 50);
  });

  const questionItemCard = useCallback((item, index) => {
    const fnqId = item?.fnqId;
    const question = item?.question;
    const answer = item?.answer;

    return (
      <Box
        key={index}
        w={'100%'}
        px={'1rem'}
        py={'1.25rem'}
        borderBottom={'1px solid #73829D'}
        boxSizing={'border-box'}
      >
        <VStack spacing={'0.75rem'} alignItems={'flex-start'}>
          <Box w={'100%'}>
            <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
              <Center>
                <CustomCheckBox
                  isChecked={selectedItems.has(fnqId)}
                  onChange={() => handleItemSelect(item)}
                />
              </Center>
              <Box w="100%">
                <VStack w="100%">
                  <Box w="100%">
                    <HStack spacing={'1rem'} justifyContent={'space-between'}>
                      <Box>
                        <HStack alignItems={'flex-start'}>
                          <Text
                            w="21px"
                            fontSize={'1rem'}
                            fontWeight={600}
                            lineHeight={'1.75rem'}
                            color={'#485766'}
                          >
                            {`Q :`}
                          </Text>
                          <Text
                            fontSize={'1rem'}
                            fontWeight={600}
                            lineHeight={'1.75rem'}
                            color={'#485766'}
                          >
                            {question}
                          </Text>
                        </HStack>
                      </Box>
                      <Box
                        cursor={'pointer'}
                        onClick={() => {
                          handleModifyQuestion(item);
                        }}
                      >
                        <Text
                          fontSize={'1rem'}
                          fontWeight={500}
                          lineHeight={'1.75rem'}
                          color={'#556A7E'}
                        >
                          {localeText(LANGUAGES.HELP.MODIFY_CONTENTS)}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box w="100%">
                    <HStack spacing={'1rem'} justifyContent={'space-between'}>
                      <Box w="100%">
                        <HStack alignItems={'flex-start'}>
                          <Text
                            w="21px"
                            fontSize={'1rem'}
                            fontWeight={600}
                            color={'#485766'}
                          >
                            {`A :`}
                          </Text>
                          <Textarea
                            p={'0'}
                            readOnly
                            border={0}
                            value={answer}
                            w={'100%'}
                            h={'100%'}
                            resize={'none'}
                            placeholder={localeText(
                              LANGUAGES.HELP.PH_ENTER_YOUR_CONTENT,
                            )}
                          />
                        </HStack>
                      </Box>
                    </HStack>
                  </Box>
                </VStack>
              </Box>
            </HStack>
          </Box>
        </VStack>
      </Box>
    );
  });

  const noticeHeader = [
    { width: 'auto', title: localeText(LANGUAGES.HELP.ORDER) },
    { width: 'auto', title: localeText(LANGUAGES.HELP.TITLE) },
    { width: 'auto', title: localeText(LANGUAGES.HELP.CREADTED_ON) },
  ];

  const noticeItemCard = useCallback((item, index) => {
    const noticeId = item?.noticeId;
    const title = item?.title;
    const createdAt = item?.createdAt;

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
              isChecked={selectedItemsNotice.has(noticeId)}
              onChange={() => handleItemSelectNotice(item)}
            />
          </Center>
        </Td>
        <Td w={noticeHeader[0].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {utils.getPageContentNum(
              index,
              currentPageNotice,
              totalCountNotice,
              contentNumNotice,
            )}
          </Text>
        </Td>
        <Td w={noticeHeader[1].width}>
          <Text
            cursor={'pointer'}
            onClick={() => {
              handleModifyNotice(item);
            }}
            textDecoration={'underline'}
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {title}
          </Text>
        </Td>
        <Td w={noticeHeader[2].width}>
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
      </Tr>
    );
  });

  return (
    <MainContainer>
      <VStack w={'100%'} spacing={0} alignItems={'flex-start'}>
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
                w={'13.1875rem'}
                textAlign={'center'}
                color={tabIndex === 0 ? '#66809C' : '#A7C3D2'}
                fontSize={'0.9375rem'}
                fontWeight={tabIndex === 0 ? 600 : 400}
                lineHeight={'1.5rem'}
              >
                {localeText(LANGUAGES.HELP.FREQUENTLY_ASKED_QUESTIONS)}
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
                w={'4rem'}
                textAlign={'left'}
                color={tabIndex === 1 ? '#66809C' : '#A7C3D2'}
                fontSize={'0.9375rem'}
                fontWeight={tabIndex === 1 ? 600 : 400}
                lineHeight={'1.5rem'}
              >
                {localeText(LANGUAGES.HELP.NOTICES)}
              </Text>
            </Box>
          </HStack>
        </Box>

        <ContentBR h={'1.25rem'} />

        <Box w={'100%'}>
          <HStack justifyContent={'space-between'} alignItems={'center'}>
            <Box w={'24.375rem'}>
              <SearchInput
                value={searchBy}
                onChange={(e) => {
                  setSearchBy(e.target.value);
                }}
                onClick={() => {
                  if (tabIndex === 0) {
                    handleGetListFnqAgent();
                  } else {
                    handleGetListNoticeAgent();
                  }
                }}
                placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
                placeholderFontColor={'#A7C3D2'}
              />
            </Box>
            <HStack spacing={'0.75rem'}>
              <Box w={'7.5rem'} h={'3rem'}>
                <Button
                  onClick={() => {
                    if (tabIndex === 0) {
                      handleAddQuestion();
                    } else {
                      handleAddNotice();
                    }
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
              <Box w={'11.5rem'} h={'3rem'}>
                <Button
                  onClick={() => {
                    if (tabIndex === 0) {
                      const deleteIds = Array.from(selectedItems);
                      if (deleteIds.length > 0) {
                        openModal({
                          type: 'confirm',
                          text: localeText(LANGUAGES.INFO_MSG.DELETE_QUESTION),
                          onAgree: () => {
                            handleDeleteQuestion();
                          },
                        });
                      } else {
                        openModal({
                          text: localeText(LANGUAGES.INFO_MSG.SELECT_QUESTION),
                        });
                      }
                    } else if (tabIndex === 1) {
                      const deleteIds = Array.from(selectedItemsNotice);
                      if (deleteIds.length > 0) {
                        openModal({
                          type: 'confirm',
                          text: localeText(LANGUAGES.INFO_MSG.DELETE_NOTICE),
                          onAgree: () => {
                            handleDeleteNotice();
                          },
                        });
                      } else {
                        openModal({
                          text: localeText(LANGUAGES.INFO_MSG.SELECT_NOTICE),
                        });
                      }
                    }
                  }}
                  px={'1rem'}
                  py={'0.63rem'}
                  borderRadius={'0.25rem'}
                  boxSizing={'border-box'}
                  border={'1px solid #D4C29D'}
                  bg={'transparent'}
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
                    {localeText(LANGUAGES.HELP.DELETE_SELECTION)}
                  </Text>
                </Button>
              </Box>
            </HStack>
          </HStack>
        </Box>

        <ContentBR h={'1.25rem'} />

        {tabIndex === 0 && (
          <>
            <Box w={'100%'}>
              <VStack spacing={0}>
                <Box
                  w={'100%'}
                  borderTop={'1px solid #73829D'}
                  // borderBottom={'1px solid #73829D'}
                  py={'0.75rem'}
                  boxSizing={'border-box'}
                >
                  {listFnq.map((item, index) => {
                    return questionItemCard(item, index);
                  })}
                  {listFnq.length === 0 && (
                    <Center w={'100%'} h={'10rem'}>
                      <Text
                        fontSize={'1.5rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.INFO_MSG.NOT_FOUND_POST)}
                      </Text>
                    </Center>
                  )}
                </Box>
              </VStack>
            </Box>

            <ContentBR h={'1.25rem'} />

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

            <ContentBR h={'1.25rem'} />
          </>
        )}

        {tabIndex === 1 && (
          <>
            <Box w={'100%'}>
              <VStack spacing={'1.25rem'}>
                <TableContainer w="100%">
                  <Table>
                    <Thead>
                      <Tr
                        borderTop={'1px solid #73829D'}
                        borderBottom={'1px solid #73829D'}
                      >
                        <Th w="50px" maxW={'50px'}>
                          <Center>
                            <CustomCheckBox
                              isChecked={selectAllNotice}
                              onChange={handleSelectAllNotice}
                            />
                          </Center>
                        </Th>
                        {noticeHeader.map((item, index) => {
                          return (
                            <Th w={item.width} key={index}>
                              <Text
                                textAlign={'center'}
                                color={'#2A333C'}
                                fontSize={'0.9375rem'}
                                fontWeight={500}
                                lineHeight={'1.5rem'}
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
                      {listNotice.map((item, index) => {
                        return noticeItemCard(item, index);
                      })}
                      {listNotice.length === 0 && (
                        <Tr>
                          <Td colSpan={4}>
                            <Center w={'100%'} h={'10rem'}>
                              <Text
                                fontSize={'1.5rem'}
                                fontWeight={500}
                                lineHeight={'1.75rem'}
                              >
                                {localeText(LANGUAGES.INFO_MSG.NOT_FOUND_POST)}
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
                        value={contentNumNotice}
                        onChange={(e) => {
                          setContentNumNotice(Number(e.target.value));
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
                        currentPage={currentPageNotice}
                        setCurrentPage={setCurrentPageNotice}
                        totalCount={totalCountNotice}
                        contentNum={contentNumNotice}
                      />
                    </Box>
                  </HStack>
                </Box>
              </VStack>
            </Box>
          </>
        )}
      </VStack>

      {isOpenQuestion && (
        <HelpQuestionModal
          isModify={isModify}
          item={targetItem}
          isOpen={isOpenQuestion}
          onClose={(ret) => {
            if (ret) {
              handleGetListFnqAgent();
            }
            onCloseQuestion();
          }}
        />
      )}
      {isOpenNotice && (
        <HelpNoticeModal
          isModify={isModify}
          item={targetItem}
          isOpen={isOpenNotice}
          onClose={(ret) => {
            onCloseNotice();
            if (ret?.noticeId) {
              setIsModify(true);
              setTargetItem(ret);
              setTimeout(() => {
                onOpenNoticeEdit();
              }, 50);
            }
          }}
        />
      )}
      {isOpenNoticeEdit && (
        <HelpNoticeEditModal
          isModify={isModify}
          item={targetItem}
          isOpen={isOpenNoticeEdit}
          onClose={(ret) => {
            if (ret) {
              handleGetListNoticeAgent();
            }
            onCloseNoticeEdit();
          }}
        />
      )}
    </MainContainer>
  );
};

export default HelpPage;
