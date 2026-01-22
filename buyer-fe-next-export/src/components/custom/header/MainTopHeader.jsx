'use client';

import {
  Box,
  Button,
  Center,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  HStack,
  Img,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import LogoGlobalLinear from '@public/svgs/simbol/global-linear.svg';
import useLocale from '@/hooks/useLocale';
import { use, useCallback, useEffect, useState } from 'react';
import { COUNTRY, LANGUAGES } from '@/constants/lang';
import useMenu from '@/hooks/useMenu';
import { usePathname, useRouter } from 'next/navigation';
import { LOUNGE, SERVICE } from '@/constants/pageURL';
import SearchInput from '@/components/input/custom/SearchInput';
import utils from '@/utils';
import { useRecoilState } from 'recoil';
import useModal from '@/hooks/useModal';
import { isOrderAddFlagState } from '@/stores/orderRecoil';
import useDevice from '@/hooks/useDevice';
import useMove from '@/hooks/useMove';
import useOrders from '@/hooks/useOrders';
import { headerSearchState } from '@/stores/dataRecoil';
import useAccount from '@/hooks/useAccount';

const MainTopHeader = (props) => {
  const { isMobile, clampW } = useDevice();
  useOrders();
  const {
    moveTo,
    moveMyPage,
    moveSearch,
    moveCart,
    moveSignUp,
    moveLogin,
    moveLounge,
  } = useMove();

  const router = useRouter();
  const { openModal } = useModal();
  const { handleLogout } = useAccount();
  const [isOrderAddFlag, setIsOrderAddFlag] =
    useRecoilState(isOrderAddFlagState);

  const isLogin = utils.getIsLogin();
  const pathName = usePathname();

  const { bg = '#FAF7F2' } = props;
  const { lang, setLang, localeText, localeCategoryText } = useLocale();

  const [searchBy, setSearchBy] = useRecoilState(headerSearchState);

  const {
    initSelectCategory,
    listAllCategory,
    handleAllCategory,
    selectedFirstCategory,
  } = useMenu();

  useEffect(() => {
    if (listAllCategory.length === 0) {
      handleAllCategory();
    }
  }, []);

  useEffect(() => {
    if (pathName.indexOf(SERVICE.SEARCH.ROOT) === -1) {
      setSearchBy('');
    }
    if (pathName.indexOf(SERVICE.ROOT) === -1) {
      initSelectCategory();
    }
  }, [pathName]);

  const [hoverSecondCategoryByFirst, setHoverSecondCategoryByFirst] = useState(
    [],
  );
  const [hoverSecondCategoryId, setHoverSecondCategoryId] = useState(0);

  const [hoverThirdCategoryBySecond, setHoverThirdCategoryBySecond] = useState(
    [],
  );
  const [hoverThirdCategoryId, setHoverThirdCategoryId] = useState(0);

  const [isOpenLang, setIsOpenLang] = useState(false);
  const [isOpenSubCategory, setIsOpenSubCategory] = useState(false);
  const [isOpenPromotion, setIsOpenPromotion] = useState(false);
  const [leaveTimeout, setLeaveTimeout] = useState(null);

  const handleMouseEnterLang = () => {
    if (leaveTimeout) {
      clearTimeout(leaveTimeout);
    }
    setIsOpenLang(true);
  };
  const handleMouseLeaveLang = () => {
    const timeout = setTimeout(() => {
      setIsOpenLang(false);
    }, 100);
    setLeaveTimeout(timeout);
  };

  const handleMouseEnterSubCategory = () => {
    if (leaveTimeout) {
      clearTimeout(leaveTimeout);
    }
    setIsOpenSubCategory(true);
  };
  const handleMouseLeaveSubCategory = () => {
    const timeout = setTimeout(() => {
      setIsOpenSubCategory(false);
    }, 100);
    setLeaveTimeout(timeout);
  };

  const handleMouseEnterPromotion = () => {
    if (leaveTimeout) {
      clearTimeout(leaveTimeout);
    }
    setIsOpenPromotion(true);
  };
  const handleMouseLeavePromotion = () => {
    const timeout = setTimeout(() => {
      setIsOpenPromotion(false);
    }, 100);
    setLeaveTimeout(timeout);
  };

  const handleMoveMenu = useCallback((firstId, secondId, thirdId) => {
    if (isOrderAddFlag) {
      openModal({
        type: 'confirm',
        text: localeText(LANGUAGES.INFO_MSG.ORDER_CANCEL_AND_MOVE),
        onAgree: () => {
          setIsOrderAddFlag(false);
          handleMoveRealMenu(firstId, secondId, thirdId);
        },
      });
      return;
    } else {
      handleMoveRealMenu(firstId, secondId, thirdId);
    }
  });

  const handleMoveRealMenu = (firstId, secondId, thirdId) => {
    if (firstId === 'Promotion') {
      initSelectCategory();
      router.push(SERVICE.PROMOTION.ROOT);
    } else if (firstId) {
      const firstCategory = listAllCategory.find(
        (first) => first.firstCategoryId === firstId,
      );
      if (firstCategory) {
        const result = {
          firstName: firstCategory.name,
          firstCategoryId: firstCategory.firstCategoryId,
          listSecond: firstCategory?.secondCategoryDataList,
        };
        router.push(
          `${SERVICE.CATEGORY.ROOT}/${result.firstName.toLowerCase()}`,
        );
      }
    } else if (secondId) {
      for (const firstCategory of listAllCategory) {
        // 두 번째 카테고리 찾기
        if (firstCategory?.secondCategoryDataList) {
          const secondCategory = firstCategory.secondCategoryDataList.find(
            (second) => second.secondCategoryId === secondId,
          );

          if (secondCategory) {
            const result = {
              firstName: firstCategory.name,
              firstCategoryId: firstCategory.firstCategoryId,
              secondName: secondCategory.name,
              secondCategoryId: secondCategory.secondCategoryId,
              listSecond: firstCategory?.secondCategoryDataLis,
            };
            router.push(
              `${SERVICE.CATEGORY.ROOT}/${result.firstName.toLowerCase()}/${result.secondName.toLowerCase()}`,
            );
          }
        }
      }
    } else if (thirdId) {
      for (const firstCategory of listAllCategory) {
        for (const secondCategory of firstCategory.secondCategoryDataList) {
          if (secondCategory?.thirdCategoryDataList) {
            const thirdCategory = secondCategory.thirdCategoryDataList.find(
              (third) => third.thirdCategoryId === thirdId,
            );
            if (thirdCategory) {
              const result = {
                firstName: firstCategory.name,
                firstCategoryId: firstCategory.firstCategoryId,
                secondName: secondCategory.name,
                secondCategoryId: secondCategory.secondCategoryId,
                secondCategoryDataList: firstCategory.secondCategoryDataList,
                thirdName: thirdCategory.name,
                thirdCategoryId: thirdCategory.thirdCategoryId,
              };
              router.push(
                `${SERVICE.CATEGORY.ROOT}/${result.firstName.toLowerCase()}/${result.secondName.toLowerCase()}/${result.thirdName.toLowerCase()}`,
              );
            }
          }
        }
      }
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();

  const handleDisplayLang = (langCode) => {
    const tempLang = langCode || lang.toLowerCase();
    if (tempLang === COUNTRY.COUNTRY_INFO.KR.LANG) {
      return '한글';
    } else if (tempLang === COUNTRY.COUNTRY_INFO.US.LANG) {
      return 'Eng';
    } else if (tempLang === COUNTRY.COUNTRY_INFO.ZH.LANG) {
      return '中文';
    } else if (tempLang === COUNTRY.COUNTRY_INFO.ES.LANG) {
      return 'Esp';
    }
  };

  return isMobile(true) ? (
    <Box
      my={'1.5rem'}
      w={'100%'}
      h={'1.34375rem'}
      px={'1rem'}
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      display="inline-flex"
    >
      <Box
        w="full"
        h="1.953125rem"
        justifyContent="space-between"
        alignItems="center"
        display="inline-flex"
      >
        <HStack spacing={'0.75rem'}>
          <Box onClick={onOpen}>
            <svg
              height="2rem"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.53125 6.5625H24.4688V8.375H4.53125V6.5625ZM4.53125 14.7188H24.4688V16.5312H4.53125V14.7188ZM4.53125 22.875H24.4688V24.6875H4.53125V22.875Z"
                fill="#485766"
              />
            </svg>
          </Box>
          <Text
            fontSize={'1.9rem'}
            fontWeight={500}
            color={'#485766'}
            onClick={() => {
              router.push(SERVICE.MAIN.ROOT);
            }}
          >
            Piboogo
          </Text>
        </HStack>

        <HStack spacing={'1.25rem'}>
          <Box onClick={onSearchOpen}>
            <svg
              width="1.5rem"
              height="1.5rem"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                stroke="#485766"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Box>
          <Box
            onClick={() => {
              if (isLogin) {
                moveCart();
              } else {
                moveSignUp();
              }
            }}
          >
            <VStack spacing={0}>
              {isLogin && (
                <Text
                  minW={'max-content'}
                  textAlign="center"
                  color={'#2A333C'}
                  fontSize={'1rem'}
                  fontWeight={500}
                  lineHeight={'1.75rem'}
                >
                  {localeText(LANGUAGES.HEADER_MENU.MY_CART)}
                </Text>
              )}
            </VStack>
          </Box>
          {isLogin && (
            <Button
              onClick={() => {
                moveMyPage();
              }}
              px={0}
              py={'0.55rem'}
              border={0}
              bg={'transparent'}
              h={'100%'}
              w={'100%'}
            >
              <Text
                minW={'max-content'}
                textAlign="center"
                color={'#2A333C'}
                fontSize={'1rem'}
                fontWeight={500}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.HEADER_MENU.MY_PAGE)}
              </Text>
            </Button>
          )}
        </HStack>
      </Box>

      {/* 검색 모달 */}
      <Modal isOpen={isSearchOpen} onClose={onSearchClose} size="full">
        <ModalOverlay />
        <ModalContent bg="white" borderRadius={0}>
          <ModalHeader borderBottom="1px solid #E2E8F0" pb={4}>
            <HStack justify="space-between" align="center">
              <Text fontSize="1.25rem" fontWeight={600} color="#2A333C">
                {localeText(LANGUAGES.HEADER_MENU.SEARCH)}
              </Text>
              <Button onClick={onSearchClose} variant="ghost" size="sm" p={2}>
                <svg
                  width="1.5rem"
                  height="1.5rem"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="#485766"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </HStack>
          </ModalHeader>
          <ModalBody pt={6}>
            <VStack spacing={4} align="stretch">
              <Box>
                <SearchInput
                  value={searchBy}
                  onChange={(e) => {
                    setSearchBy(e.target.value);
                  }}
                  onClick={() => {
                    moveSearch(searchBy);
                    onSearchClose();
                  }}
                  placeholder={localeText(
                    LANGUAGES.HEADER_MENU.PH_HEADER_INPUT,
                  )}
                  size="lg"
                />
              </Box>
              <Button
                onClick={() => {
                  moveSearch(searchBy);
                  onSearchClose();
                }}
                colorScheme="blue"
                size="lg"
                w="full"
              >
                {localeText(LANGUAGES.HEADER_MENU.SEARCH)}
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Drawer placement={'left'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent maxW={'18rem'}>
          <DrawerBody pt={'1.5rem'} px={0}>
            <VStack spacing={'0.75rem'}>
              {!isLogin && (
                <>
                  <Box w={'100%'} px={'1rem'}>
                    <Button
                      onClick={() => {
                        onClose();
                        moveSignUp();
                      }}
                      px={0}
                      py={'0.55rem'}
                      border={0}
                      bg={'transparent'}
                      h={'100%'}
                      w={'100%'}
                    >
                      <Text
                        w={'100%'}
                        color={'#556A7E'}
                        fontSize={'0.9375rem'}
                        fontWeight={600}
                        lineHeight={'1.5rem'}
                        textAlign={'left'}
                      >
                        {localeText(LANGUAGES.ACC.LOGIN.SIGN_UP)}
                      </Text>
                    </Button>
                  </Box>
                  <Box w={'100%'} px={'1rem'}>
                    <Button
                      onClick={() => {
                        onClose();
                        moveLogin();
                      }}
                      px={0}
                      py={'0.55rem'}
                      border={0}
                      bg={'transparent'}
                      h={'100%'}
                      w={'100%'}
                    >
                      <Text
                        w={'100%'}
                        color={'#556A7E'}
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        lineHeight={'1.5rem'}
                        textAlign={'left'}
                      >
                        {localeText(LANGUAGES.HEADER_MENU.LOGIN)}
                      </Text>
                    </Button>
                  </Box>
                </>
              )}
              <Divider borderTop={'1px solid #AEBDCA'} />

              <Box w={'100%'} px={'1rem'}>
                <Button
                  onClick={() => {
                    window.open('https://seller.piboogo.com', '_blank');
                  }}
                  px={0}
                  py={'0.55rem'}
                  border={0}
                  bg={'transparent'}
                  h={'100%'}
                  w={'100%'}
                >
                  <Text
                    w={'100%'}
                    color={'#556A7E'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                    textAlign={'left'}
                  >
                    {localeText(LANGUAGES.HEADER_MENU.SIGN_UP_TO_SELLER)}
                  </Text>
                </Button>
              </Box>

              <Divider borderTop={'1px solid #AEBDCA'} />

              <Box w={'100%'} px={'1rem'}>
                <Button
                  onClick={() => {
                    handleMoveMenu('Promotion');
                  }}
                  px={0}
                  py={'0.55rem'}
                  border={0}
                  bg={'transparent'}
                  h={'100%'}
                  w={'100%'}
                >
                  <Text
                    w={'100%'}
                    color={'#556A7E'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                    textAlign={'left'}
                  >
                    {localeText(LANGUAGES.HEADER_MENU.PROMOTION)}
                  </Text>
                </Button>
              </Box>

              {listAllCategory.map((item, index) => {
                return (
                  <Box w={'100%'} px={'1rem'} key={index}>
                    <Button
                      onClick={() => {
                        handleMoveMenu(item.firstCategoryId);
                      }}
                      px={0}
                      py={'0.55rem'}
                      border={0}
                      bg={'transparent'}
                      h={'100%'}
                      w={'100%'}
                    >
                      <Text
                        w={'100%'}
                        color={'#556A7E'}
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        lineHeight={'1.5rem'}
                        textAlign={'left'}
                      >
                        {item.name}
                      </Text>
                    </Button>
                  </Box>
                );
              })}

              <Divider borderTop={'1px solid #AEBDCA'} />

              <Box w={'100%'} px={'1rem'}>
                <Button
                  onClick={() => {
                    moveLounge();
                  }}
                  px={0}
                  py={'0.55rem'}
                  border={0}
                  bg={'transparent'}
                  h={'100%'}
                  w={'100%'}
                >
                  <Text
                    w={'100%'}
                    color={'#556A7E'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                    textAlign={'left'}
                  >
                    {localeText(LANGUAGES.HEADER_MENU.LOUNGE)}
                  </Text>
                </Button>
              </Box>

              {isLogin && (
                <Box w={'100%'} px={'1rem'}>
                  <Button
                    onClick={() => {
                      moveCart();
                    }}
                    px={0}
                    py={'0.55rem'}
                    border={0}
                    bg={'transparent'}
                    h={'100%'}
                    w={'100%'}
                  >
                    <Text
                      w={'100%'}
                      color={'#556A7E'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                      textAlign={'left'}
                    >
                      {localeText(LANGUAGES.HEADER_MENU.MY_CART)}
                    </Text>
                  </Button>
                </Box>
              )}

              <Box w={'100%'} px={'1rem'}>
                {isLogin && (
                  <Button
                    onClick={() => {
                      moveMyPage();
                    }}
                    px={0}
                    py={'0.55rem'}
                    border={0}
                    bg={'transparent'}
                    h={'100%'}
                    w={'100%'}
                  >
                    <Text
                      w={'100%'}
                      color={'#556A7E'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                      textAlign={'left'}
                    >
                      {localeText(LANGUAGES.HEADER_MENU.MY_PAGE)}
                    </Text>
                  </Button>
                )}
              </Box>

              {isLogin && (
                <Box w={'100%'} px={'1rem'}>
                  <Button
                    onClick={() => {
                      handleLogout();
                    }}
                    px={0}
                    py={'0.55rem'}
                    border={0}
                    bg={'transparent'}
                    h={'100%'}
                    w={'100%'}
                  >
                    <Text
                      w={'100%'}
                      color={'#556A7E'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                      textAlign={'left'}
                    >
                      {localeText(LANGUAGES.COMMON.LOGOUT)}
                    </Text>
                  </Button>
                </Box>
              )}

              <Box w={'100%'}>
                <Select
                  h={'2.5rem'}
                  w={'100%'}
                  border={0}
                  iconSize="3xl"
                  iconColor="#7895B2"
                  value={lang}
                  onChange={(e) => {
                    setLang(e.target.value);
                  }}
                  fontSize={'0.9375rem'}
                  textColor={'#556A7E'}
                  lineHeight={'1.5rem'}
                >
                  <option value={COUNTRY.COUNTRY_INFO.KR.LANG.toUpperCase()}>
                    한글
                  </option>
                  <option value={COUNTRY.COUNTRY_INFO.US.LANG.toUpperCase()}>
                    English
                  </option>
                  <option value={COUNTRY.COUNTRY_INFO.ZH.LANG.toUpperCase()}>
                    中文
                  </option>
                  <option value={COUNTRY.COUNTRY_INFO.ES.LANG.toUpperCase()}>
                    Español
                  </option>
                </Select>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  ) : (
    <Center w={'100%'} h={'100%'} maxH={720} bg={bg}>
      <Box
        py={'1.5rem'}
        px={'1.25rem'}
        w={'100%'}
        maxW={1920}
        borderBottom={'1px solid #AEBDCA'}
        paddingTop={'0.5rem'}
      >
        <VStack w={'100%'} spacing={0}>
          <Box w={'100%'} py={'0.5rem'} px={'1.25rem'}>
            <HStack justifyContent={'space-between'}>
              <Box maxW={'330px'}>
                <Box
                  cursor={'pointer'}
                  display={'flex'}
                  justifyContent={'flex-start'}
                  onClick={() => {
                    router.push(SERVICE.MAIN.ROOT);
                  }}
                >
                  <Text fontSize={'2.75rem'} fontWeight={500} color={'#485766'}>
                    Piboogo
                  </Text>
                </Box>
              </Box>
              <Box
                flex={1}
                px={'2rem'}
                display={'flex'}
                justifyContent={'center'}
              >
                <Box w={'100%'}>
                  <SearchInput
                    value={searchBy}
                    onChange={(e) => {
                      setSearchBy(e.target.value);
                    }}
                    onClick={() => {
                      moveSearch(searchBy);
                    }}
                    placeholder={localeText(
                      LANGUAGES.HEADER_MENU.PH_HEADER_INPUT,
                    )}
                  />
                </Box>
              </Box>
              <Box>
                <HStack spacing={'0.8rem'} justifyContent={'flex-end'}>
                  <Box minW={'3.75rem'}>
                    <HStack spacing={'0.25rem'} alignItems={'center'}>
                      <Box>
                        <Img src={LogoGlobalLinear.src} />
                      </Box>
                      <Menu
                        isLazy
                        isOpen={isOpenLang}
                        onClose={() => setIsOpenLang(false)}
                      >
                        <MenuButton
                          onMouseEnter={handleMouseEnterLang}
                          onMouseLeave={handleMouseLeaveLang}
                          onClick={() => setIsOpenLang(true)}
                        >
                          <Text
                            fontSize={'1rem'}
                            fontWeight={300}
                            color={'#2A333C'}
                          >
                            {handleDisplayLang()}
                          </Text>
                        </MenuButton>
                        <MenuList
                          onMouseEnter={handleMouseEnterLang}
                          onMouseLeave={handleMouseLeaveLang}
                        >
                          <MenuItem
                            bg={
                              lang === COUNTRY.COUNTRY_INFO.US.LANG
                                ? '#7895B2'
                                : null
                            }
                            onClick={() => {
                              setLang(COUNTRY.COUNTRY_INFO.US.LANG);
                            }}
                          >
                            <Text
                              fontSize={'1rem'}
                              fontWeight={300}
                              color={
                                lang === COUNTRY.COUNTRY_INFO.US.LANG
                                  ? '#FFF'
                                  : '#2A333C'
                              }
                            >
                              {handleDisplayLang(COUNTRY.COUNTRY_INFO.US.LANG)}
                            </Text>
                          </MenuItem>
                          <MenuItem
                            bg={
                              lang === COUNTRY.COUNTRY_INFO.KR.LANG
                                ? '#7895B2'
                                : null
                            }
                            onClick={() => {
                              setLang(COUNTRY.COUNTRY_INFO.KR.LANG);
                            }}
                          >
                            <Text
                              fontSize={'1rem'}
                              fontWeight={300}
                              color={
                                lang === COUNTRY.COUNTRY_INFO.KR.LANG
                                  ? '#FFF'
                                  : '#2A333C'
                              }
                            >
                              {handleDisplayLang(COUNTRY.COUNTRY_INFO.KR.LANG)}
                            </Text>
                          </MenuItem>
                          <MenuItem
                            bg={
                              lang === COUNTRY.COUNTRY_INFO.ZH.LANG
                                ? '#7895B2'
                                : null
                            }
                            onClick={() => {
                              setLang(COUNTRY.COUNTRY_INFO.ZH.LANG);
                            }}
                          >
                            <Text
                              fontSize={'1rem'}
                              fontWeight={300}
                              color={
                                lang === COUNTRY.COUNTRY_INFO.ZH.LANG
                                  ? '#FFF'
                                  : '#2A333C'
                              }
                            >
                              {handleDisplayLang(COUNTRY.COUNTRY_INFO.ZH.LANG)}
                            </Text>
                          </MenuItem>
                          <MenuItem
                            bg={
                              lang === COUNTRY.COUNTRY_INFO.ES.LANG
                                ? '#7895B2'
                                : null
                            }
                            onClick={() => {
                              setLang(COUNTRY.COUNTRY_INFO.ES.LANG);
                            }}
                          >
                            <Text
                              fontSize={'1rem'}
                              fontWeight={300}
                              color={
                                lang === COUNTRY.COUNTRY_INFO.ES.LANG
                                  ? '#FFF'
                                  : '#2A333C'
                              }
                            >
                              {handleDisplayLang(COUNTRY.COUNTRY_INFO.ES.LANG)}
                            </Text>
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </HStack>
                  </Box>
                  <Box
                    // minW={'4.375rem'}
                    cursor={'pointer'}
                    onClick={() => {
                      moveLounge();
                    }}
                  >
                    <Text fontSize={'1rem'} fontWeight={300} color={'#2A333C'}>
                      {localeText(LANGUAGES.HEADER_MENU.LOUNGE)}
                    </Text>
                  </Box>
                  {!isLogin && (
                    <Box
                      minW={'max-content'}
                      cursor={'pointer'}
                      onClick={() => {
                        moveLogin();
                      }}
                    >
                      <Text
                        w={'100%'}
                        fontSize={'1rem'}
                        fontWeight={300}
                        color={'#2A333C'}
                      >
                        {localeText(LANGUAGES.HEADER_MENU.LOGIN)}
                      </Text>
                    </Box>
                  )}
                  {isLogin && (
                    <Box
                      cursor={'pointer'}
                      onClick={() => {
                        moveMyPage();
                      }}
                    >
                      <Text
                        // minW={'4.4rem'}
                        minW={'max-content'}
                        fontSize={'1rem'}
                        fontWeight={300}
                        color={'#2A333C'}
                      >
                        {localeText(LANGUAGES.HEADER_MENU.MY_PAGE)}
                      </Text>
                    </Box>
                  )}
                  {isLogin && (
                    <Box
                      cursor={'pointer'}
                      onClick={() => {
                        moveCart();
                      }}
                    >
                      <Text
                        // minW={'4.4rem'}
                        minW={'max-content'}
                        fontSize={'1rem'}
                        fontWeight={300}
                        color={'#2A333C'}
                      >
                        {localeText(LANGUAGES.HEADER_MENU.MY_CART)}
                      </Text>
                    </Box>
                  )}
                  <Box
                    // minW={'8.0625rem'}
                    minW={'max-content'}
                    cursor={'pointer'}
                    onClick={() => {
                      window.open('https://seller.piboogo.com', '_blank');
                    }}
                  >
                    <Text fontSize={'1rem'} fontWeight={300} color={'#2A333C'}>
                      {localeText(LANGUAGES.HEADER_MENU.SIGN_UP_TO_SELLER)}
                    </Text>
                  </Box>
                </HStack>
              </Box>
            </HStack>
          </Box>
          <Box px={'1.25rem'} w={'100%'} position={'relative'}>
            <HStack spacing={'3.75rem'} justifyContent={'center'}>
              <Box
                onMouseEnter={() => {
                  handleMouseEnterPromotion();
                }}
                onMouseLeave={handleMouseLeavePromotion}
                w={'6.65rem'}
                min={'6.65rem'}
                _hover={{
                  cursor: 'pointer',
                }}
                onClick={() => {
                  handleMoveMenu('Promotion');
                }}
              >
                <Text
                  fontSize={'1rem'}
                  fontWeight={500}
                  color={
                    pathName === SERVICE.PROMOTION.ROOT ? '#66809C' : '#495060'
                  }
                  textAlign={'center'}
                >
                  {localeText(LANGUAGES.HEADER_MENU.PROMOTION)}
                  {/* Promotion */}
                </Text>
              </Box>
              {listAllCategory.map((item, index) => {
                return (
                  <Box
                    onMouseEnter={() => {
                      setHoverSecondCategoryByFirst(
                        item.secondCategoryDataList || [],
                      );
                      if (item?.secondCategoryDataList) {
                        const second = item.secondCategoryDataList[0];
                        setHoverThirdCategoryBySecond(
                          second?.thirdCategoryDataList || [],
                        );
                        setHoverSecondCategoryId(second.secondCategoryId);
                      } else {
                        setHoverThirdCategoryBySecond([]);
                        setHoverThirdCategoryId(0);
                      }

                      handleMouseEnterSubCategory();
                    }}
                    onMouseLeave={handleMouseLeaveSubCategory}
                    // w={item.width}
                    // min={item.width}
                    minW={'6.875rem'}
                    key={index}
                    _hover={{
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      handleMoveMenu(item.firstCategoryId);
                    }}
                  >
                    <Text
                      fontSize={'1rem'}
                      fontWeight={500}
                      color={
                        selectedFirstCategory.name === item.name
                          ? '#66809C'
                          : '#495060'
                      }
                      // textAlign={'left'}
                      textAlign={'center'}
                    >
                      {/* {localeCategoryText(item.name)} */}
                      {item.name}
                    </Text>
                  </Box>
                );
              })}
            </HStack>
            {isOpenSubCategory && (
              <Box
                zIndex={5}
                onMouseEnter={handleMouseEnterSubCategory}
                onMouseLeave={handleMouseLeaveSubCategory}
                w={'100%'}
                // h={'15rem'}
                // bottom={'-16.5rem'}
                h={'11rem'}
                bottom={'-12.5rem'}
                bg={'#faf7f2'}
                // bg={'#FFF'}
                position={'absolute'}
                left={0}
              >
                <Box
                  w={'100%'}
                  h={'100%'}
                  position={'relative'}
                  px={'0.75rem'}
                  py={'1.25rem'}
                >
                  <HStack
                    h={'100%'}
                    spacing={'1.25rem'}
                    alignItems={'flex-start'}
                  >
                    <List spacing={3}>
                      {hoverSecondCategoryByFirst.map((item, index) => {
                        return (
                          <ListItem
                            px={'0.5rem'}
                            bg={
                              hoverSecondCategoryId === item.secondCategoryId
                                ? '#8C64420D'
                                : 'none'
                            }
                            cursor={'pointer'}
                            key={index}
                            w={'9rem'}
                            onMouseEnter={() => {
                              setHoverSecondCategoryId(item.secondCategoryId);
                              setHoverThirdCategoryBySecond(
                                item?.thirdCategoryDataList || [],
                              );
                            }}
                            onClick={() => {
                              handleMoveMenu(null, item.secondCategoryId);
                            }}
                          >
                            <Text
                              fontSize={'1rem'}
                              fontWeight={500}
                              color={'#485766'}
                            >
                              {item.name}
                            </Text>
                          </ListItem>
                        );
                      })}
                    </List>
                    <Divider
                      w={'1px'}
                      h={'100%'}
                      borderRight={'1px solid #AEBDCA'}
                    />
                    <Box h={'100%'}>
                      {/*
                      <List spacing={3}>
                        {hoverThirdCategoryBySecond.map((item, index) => {
                          return (
                            <ListItem
                              onMouseEnter={() => {
                                setHoverThirdCategoryId(item.thirdCategoryId);
                              }}
                              key={index}
                              w={'8.75rem'}
                              cursor={'pointer'}
                              onClick={() => {
                                handleMoveMenu(
                                  null,
                                  null,
                                  item.thirdCategoryId,
                                );
                              }}
                            >
                              <Text
                                fontSize={'1rem'}
                                fontWeight={
                                  hoverThirdCategoryId === item.thirdCategoryId
                                    ? 500
                                    : 400
                                }
                                color={'#485766'}
                              >
                                {item.name}
                              </Text>
                            </ListItem>
                          );
                        })}
                      </List>
                      */}

                      <HStack
                        h={'100%'}
                        spacing={'3rem'}
                        alignItems={'flex-start'}
                      >
                        <Box>
                          <List spacing={3}>
                            {hoverThirdCategoryBySecond
                              .slice(0, 4)
                              .map((item, index) => {
                                return (
                                  <ListItem
                                    onMouseEnter={() => {
                                      setHoverThirdCategoryId(
                                        item.thirdCategoryId,
                                      );
                                    }}
                                    key={index}
                                    w={'8.75rem'}
                                    cursor={'pointer'}
                                    onClick={() => {
                                      handleMoveMenu(
                                        null,
                                        null,
                                        item.thirdCategoryId,
                                      );
                                    }}
                                  >
                                    <Text
                                      fontSize={'1rem'}
                                      fontWeight={
                                        hoverThirdCategoryId ===
                                        item.thirdCategoryId
                                          ? 500
                                          : 400
                                      }
                                      color={'#485766'}
                                    >
                                      {item.name}
                                    </Text>
                                  </ListItem>
                                );
                              })}
                          </List>
                        </Box>
                        <Box>
                          <List spacing={3}>
                            {hoverThirdCategoryBySecond
                              .slice(4, 8)
                              .map((item, index) => {
                                return (
                                  <ListItem
                                    onMouseEnter={() => {
                                      setHoverThirdCategoryId(
                                        item.thirdCategoryId,
                                      );
                                    }}
                                    key={index}
                                    w={'8.75rem'}
                                    cursor={'pointer'}
                                    onClick={() => {
                                      handleMoveMenu(
                                        null,
                                        null,
                                        item.thirdCategoryId,
                                      );
                                    }}
                                  >
                                    <Text
                                      fontSize={'1rem'}
                                      fontWeight={
                                        hoverThirdCategoryId ===
                                        item.thirdCategoryId
                                          ? 500
                                          : 400
                                      }
                                      color={'#485766'}
                                    >
                                      {item.name}
                                    </Text>
                                  </ListItem>
                                );
                              })}
                          </List>
                        </Box>
                        <Box>
                          <List spacing={3}>
                            {hoverThirdCategoryBySecond
                              .slice(8, 12)
                              .map((item, index) => {
                                return (
                                  <ListItem
                                    onMouseEnter={() => {
                                      setHoverThirdCategoryId(
                                        item.thirdCategoryId,
                                      );
                                    }}
                                    key={index}
                                    w={'8.75rem'}
                                    cursor={'pointer'}
                                    onClick={() => {
                                      handleMoveMenu(
                                        null,
                                        null,
                                        item.thirdCategoryId,
                                      );
                                    }}
                                  >
                                    <Text
                                      fontSize={'1rem'}
                                      fontWeight={
                                        hoverThirdCategoryId ===
                                        item.thirdCategoryId
                                          ? 500
                                          : 400
                                      }
                                      color={'#485766'}
                                    >
                                      {item.name}
                                    </Text>
                                  </ListItem>
                                );
                              })}
                          </List>
                        </Box>
                        <Box>
                          <List spacing={3}>
                            {hoverThirdCategoryBySecond
                              .slice(12, 16)
                              .map((item, index) => {
                                return (
                                  <ListItem
                                    onMouseEnter={() => {
                                      setHoverThirdCategoryId(
                                        item.thirdCategoryId,
                                      );
                                    }}
                                    key={index}
                                    w={'8.75rem'}
                                    cursor={'pointer'}
                                    onClick={() => {
                                      handleMoveMenu(
                                        null,
                                        null,
                                        item.thirdCategoryId,
                                      );
                                    }}
                                  >
                                    <Text
                                      fontSize={'1rem'}
                                      fontWeight={
                                        hoverThirdCategoryId ===
                                        item.thirdCategoryId
                                          ? 500
                                          : 400
                                      }
                                      color={'#485766'}
                                    >
                                      {item.name}
                                    </Text>
                                  </ListItem>
                                );
                              })}
                          </List>
                        </Box>
                      </HStack>
                    </Box>
                  </HStack>
                </Box>
              </Box>
            )}
          </Box>
        </VStack>
      </Box>
    </Center>
  );
};

export default MainTopHeader;
