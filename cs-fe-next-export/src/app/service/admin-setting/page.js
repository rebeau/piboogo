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
  Spacer,
  Tr,
  Td,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Th,
} from '@chakra-ui/react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import { useCallback, useEffect, useState } from 'react';
import { DefaultPaginate } from '@/components';
import SearchInput from '@/components/custom/input/SearchInput';
import ContentBR from '@/components/common/ContentBR';
import CustomIcon from '@/components/icon/CustomIcon';
import AdminSettingModal from '@/components/custom/page/admin-setting/AdminSettingModal';
import csUserApi from '@/services/csUserApi';
import { SUCCESS } from '@/constants/errorCode';
import utils from '@/utils';
import { LIST_CONTENT_NUM } from '@/constants/common';
import MainContainer from '@/components/layout/MainContainer';
import useModal from '@/hooks/useModal';
import CustomCheckBox from '@/components/common/checkbox/CustomCheckBox';

const AdminSettingPage = () => {
  const { openModal } = useModal();
  const { lang, localeText } = useLocale();

  const [initFlag, setIsInitFlag] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);
  const [searchBy, setSearchBy] = useState('');
  const [isModify, setIsModify] = useState(false);
  const [targetItem, setTargetItem] = useState({});

  const {
    isOpen: isOpenAdmin,
    onOpen: onOpenAdmin,
    onClose: onCloseAdmin,
  } = useDisclosure();

  const userInfo = utils.getUserInfoSession();
  const [listAdminUser, setListAdminUser] = useState([]);

  useEffect(() => {
    handleGetListCsUser();
  }, [currentPage]);

  useEffect(() => {
    if (!initFlag) {
      handleGetListCsUserAgent();
    }
  }, [contentNum]);

  const handleGetListCsUserAgent = () => {
    if (currentPage === 1) {
      handleGetListCsUser();
    } else {
      setCurrentPage(1);
    }
  };

  const handleGetListCsUser = async () => {
    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
    };
    if (searchBy) {
      param.searchBy = searchBy;
    }
    const result = await csUserApi.getListCsUser(param);
    if (result?.errorCode === SUCCESS) {
      setListAdminUser(result.datas);
      setTotalCount(result.totalCount);
    } else {
      setListAdminUser([]);
      setTotalCount(0);
    }
    setIsInitFlag(false);
  };

  const handleDeleteAdmin = useCallback(async () => {
    const param = {
      csUserIds: Array.from(selectedItems),
    };
    const result = await csUserApi.deleteCsUser(param);
    openModal({ text: result.message });
    if (result?.errorCode === SUCCESS) {
      setSelectedItems(new Set());
      handleGetListCsUser();
    }
  });

  const handleAddAdmin = useCallback(() => {
    setIsModify(false);
    setTargetItem({});
    onOpenAdmin();
  });

  const handleSetting = useCallback((item) => {
    setIsModify(true);
    setTargetItem(item);
    onOpenAdmin();
  });

  const key = 'csUserId';

  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const currentPageItems = listAdminUser;
      const newSelectedItems = new Set(selectedItems);
      currentPageItems.forEach((item) => newSelectedItems.add(item[key]));
      setSelectedItems(newSelectedItems);
    } else {
      const currentPageItems = listAdminUser;
      const newSelectedItems = new Set(selectedItems);
      currentPageItems.forEach((item) => newSelectedItems.delete(item[key]));
      setSelectedItems(newSelectedItems);
    }
  };

  useEffect(() => {
    const allSelected = listAdminUser.every((item) =>
      selectedItems.has(item[key]),
    );
    setSelectAll(allSelected);
  }, [selectedItems, listAdminUser]);

  const handleItemSelect = (item) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(item[key])) {
      newSelectedItems.delete(item[key]);
    } else {
      newSelectedItems.add(item[key]);
    }
    setSelectedItems(newSelectedItems);
  };

  const adminHeader = [
    { width: 'auto', title: localeText(LANGUAGES.ADMIN_SETTING.ORDER) },
    {
      width: 'auto',
      title: localeText(LANGUAGES.ADMIN_SETTING.ADMIN_EMAIL),
    },
    {
      width: 'auto',
      title: localeText(LANGUAGES.ADMIN_SETTING.NAME),
    },
    {
      width: 'auto',
      title: localeText(LANGUAGES.ADMIN_SETTING.PERMISSION),
    },
  ];

  const adminItemCard = useCallback((item, index) => {
    const csUserId = item?.csUserId;
    const id = item?.id;
    const name = item?.name;
    const pw = item?.pw;
    const role = item?.role;

    const handlePermission = (perm) => {
      if (perm === 1) {
        return localeText(LANGUAGES.ADMIN_SETTING.SUPER_ADMIN);
      } else if (perm === 2) {
        return localeText(LANGUAGES.ADMIN_SETTING.ADMIN);
      } else if (perm === 3) {
        //
      }
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
              isChecked={selectedItems.has(csUserId)}
              onChange={() => handleItemSelect(item)}
            />
          </Center>
        </Td>
        <Td w={adminHeader[0].width}>
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
        <Td w={adminHeader[1].width}>
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
        <Td w={adminHeader[2].width}>
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
        <Td w={adminHeader[3].width}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'0.9357rem'}
            fontWeight={400}
            lineHeight={'1.5rem'}
          >
            {handlePermission(role)}
          </Text>
        </Td>
        <Td w={'11rem'} h={'3rem'}>
          <Button
            onClick={() => {
              handleSetting(item);
            }}
            px={'1rem'}
            py={'0.63rem'}
            borderRadius={'0.25rem'}
            boxSizing={'border-box'}
            border={'1px solid #556A7E'}
            bg={'transparent'}
            h={'100%'}
            w={'100%'}
            _hover={{
              opacity: 0.8,
            }}
          >
            <Text
              textAlign={'center'}
              color={'#556A7E'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {localeText(LANGUAGES.ADMIN_SETTING.SETTING)}
            </Text>
          </Button>
        </Td>
      </Tr>
    );
  });

  return (
    <MainContainer>
      <VStack w={'100%'} spacing={0} alignItems={'flex-start'}>
        <ContentBR h={'1.25rem'} />

        <Box w={'100%'}>
          <HStack justifyContent={'space-between'} alignItems={'center'}>
            <Box w={'24.375rem'}>
              <SearchInput
                value={searchBy}
                onChange={(e) => {
                  setSearchBy(e.target.value);
                }}
                onClick={handleGetListCsUserAgent}
                placeholder={localeText(LANGUAGES.COMMON.PH_SEARCH_TERM)}
                placeholderFontColor={'#A7C3D2'}
              />
            </Box>
            <HStack spacing={'0.75rem'}>
              <Box w={'7.5rem'} h={'3rem'}>
                <Button
                  onClick={() => {
                    handleAddAdmin();
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
                    const deleteIds = Array.from(selectedItems);
                    if (deleteIds.length > 0) {
                      openModal({
                        type: 'confirm',
                        text: localeText(LANGUAGES.INFO_MSG.DELETE_USER),
                        onAgree: () => {
                          handleDeleteAdmin();
                        },
                      });
                    } else {
                      openModal({
                        text: localeText(LANGUAGES.INFO_MSG.SELECT_USER),
                      });
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
                          isChecked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </Center>
                    </Th>
                    {adminHeader.map((item, index) => {
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
                  {listAdminUser.map((item, index) => {
                    return adminItemCard(item, index);
                  })}
                  {listAdminUser.length === 0 && (
                    <Tr>
                      <Td colSpan={4}>
                        <Center w={'100%'} h={'10rem'}>
                          <Text
                            fontSize={'1.5rem'}
                            fontWeight={500}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.INFO_MSG.NOT_SEARCHED)}
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
                      setContentNum(e.target.value);
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

      {isOpenAdmin && (
        <AdminSettingModal
          isModify={isModify}
          item={targetItem}
          isOpen={isOpenAdmin}
          onClose={(ret) => {
            if (ret) {
              handleGetListCsUser();
            }
            onCloseAdmin();
          }}
        />
      )}
    </MainContainer>
  );
};

export default AdminSettingPage;
