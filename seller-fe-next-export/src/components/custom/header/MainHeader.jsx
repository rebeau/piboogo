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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import LogoGlobalLinear from '@public/svgs/simbol/global-linear.svg';
import useLocale from '@/hooks/useLocale';
import { useCallback, useEffect, useState } from 'react';
import { COUNTRY, LANGUAGES } from '@/constants/lang';
import { usePathname, useRouter } from 'next/navigation';
import { MAIN, SERVICE } from '@/constants/pageURL';
import LogoPiboogo from '@public/svgs/logo/piboogo.svg';
import Logout from '@public/svgs/icon/logout.svg';
import utils from '@/utils';
import useAccount from '@/hooks/useAccount';
import useDevice from '@/hooks/useDevice';
import SellerSideButton from '../seller/SellerSideButton';
import useMove from '@/hooks/useMove';

const MainHeader = (props) => {
  const { moveLogin } = useMove();
  const { bg = '#FFF' } = props;
  const { isMobile, clampW } = useDevice();
  const { userInfo, handleLogout, handleGetMyInfo } = useAccount();
  const router = useRouter();
  const isLogin = utils.getIsLogin();
  const { lang, setLang } = useLocale();
  const { localeText } = useLocale();

  const [isOpenMouse, setIsOpenMouse] = useState(false);

  const [isOpenLang, setIsOpenLang] = useState(false);
  const [leaveTimeout, setLeaveTimeout] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const pathName = usePathname();

  const [sideIndex, setSideIndex] = useState(0);

  const listSideMenu = [
    {
      title: localeText(LANGUAGES.SELLER_SIDE_MENU.DASHBOARD),
      href: SERVICE.DASHBOARD.ROOT,
    },
    {
      title: localeText(LANGUAGES.SELLER_SIDE_MENU.PRODUCTS),
      href: SERVICE.PRODUCTS.ROOT,
    },
    {
      title: localeText(LANGUAGES.SELLER_SIDE_MENU.SALES),
      href: SERVICE.SALES.ROOT,
    },
    {
      title: localeText(LANGUAGES.SELLER_SIDE_MENU.BANNERS),
      href: SERVICE.BANNERS.ROOT,
    },
    {
      title: localeText(LANGUAGES.SELLER_SIDE_MENU.PROMOTIONS),
      href: SERVICE.PROMOTIONS.ROOT,
    },
    {
      title: localeText(LANGUAGES.SELLER_SIDE_MENU.SETTLEMENT),
      href: SERVICE.SETTLEMENT.ROOT,
    },
    {
      title: localeText(LANGUAGES.SELLER_SIDE_MENU.INQUIRIES),
      href: SERVICE.INQUIRIES.ROOT,
    },
    {
      title: localeText(LANGUAGES.SELLER_SIDE_MENU.REVIEWS),
      href: SERVICE.REVIEWS.ROOT,
    },
    {
      title: localeText(LANGUAGES.SELLER_SIDE_MENU.LOUNGE),
      href: SERVICE.LOUNGE.HOME,
    },
  ];

  useEffect(() => {
    if (pathName === SERVICE.DASHBOARD.ROOT) {
      setSideIndex(1);
    } else if (pathName.indexOf(SERVICE.PRODUCTS.ROOT) > -1) {
      setSideIndex(2);
    } else if (pathName.indexOf(SERVICE.SALES.ROOT) > -1) {
      setSideIndex(3);
    } else if (pathName.indexOf(SERVICE.BANNERS.ROOT) > -1) {
      setSideIndex(4);
    } else if (pathName.indexOf(SERVICE.PROMOTIONS.ROOT) > -1) {
      setSideIndex(5);
    } else if (pathName.indexOf(SERVICE.SETTLEMENT.ROOT) > -1) {
      setSideIndex(6);
    } else if (pathName.indexOf(SERVICE.INQUIRIES.ROOT) > -1) {
      setSideIndex(7);
    } else if (pathName.indexOf(SERVICE.REVIEWS.ROOT) > -1) {
      setSideIndex(8);
    } else if (pathName.indexOf(SERVICE.LOUNGE.ROOT) > -1) {
      setSideIndex(9);
    }
  }, [pathName]);

  useEffect(() => {
    if (isLogin) {
      handleGetMyInfo();
    }
  }, [isLogin]);

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

  const handleMouseEnter = () => {
    if (leaveTimeout) {
      clearTimeout(leaveTimeout);
    }
    setIsOpenMouse(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsOpenMouse(false);
    }, 100);
    setLeaveTimeout(timeout);
  };

  return isMobile(true) ? (
    <Box
      my={'1.5rem'}
      w={'100%'}
      px={'1rem'}
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      gap="1.5rem"
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
          {isLogin && (
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
          )}
          <Text
            fontSize={clampW(1.3, 1.9)}
            fontWeight={500}
            color={'#485766'}
            onClick={() => {
              if (isLogin) {
                router.push(SERVICE.DASHBOARD.ROOT);
              } else {
                moveLogin();
              }
            }}
          >
            Piboogo
          </Text>
        </HStack>

        <Box>
          <VStack spacing={0}>
            {isLogin ? (
              <Box
                cursor={'pointer'}
                onClick={() => {
                  router.push(SERVICE.MY_PAGE.ROOT);
                }}
              >
                <Text
                  fontSize={'0.9375rem'}
                  fontWeight={500}
                  color={'#556A7E'}
                  lineHeight={'1.5rem'}
                >
                  {userInfo?.brandName}
                </Text>
              </Box>
            ) : (
              <Box></Box>
            )}
          </VStack>
        </Box>
      </Box>

      <Drawer placement={'left'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent maxW={'18rem'}>
          <DrawerBody pt={'1.5rem'} px={0}>
            <VStack spacing={'0.75rem'}>
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
                  <option value={COUNTRY.COUNTRY_INFO.KR.LANG.toLowerCase()}>
                    한글
                  </option>
                  <option value={COUNTRY.COUNTRY_INFO.US.LANG.toLowerCase()}>
                    English
                  </option>
                </Select>
              </Box>

              <Divider borderTop={'1px solid #AEBDCA'} />

              {listSideMenu.map((menu, index) => {
                return (
                  <SellerSideButton
                    key={index}
                    index={index + 1}
                    target={menu}
                    sideIndex={sideIndex}
                  />
                );
              })}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  ) : (
    <Center
      w={'100%'}
      h={'4.5rem'}
      maxH={'4.5rem'}
      bg={bg}
      boxSizing={'border-box'}
      borderBottom={'1px solid #AEBDCA'}
    >
      <Box py={'1rem'} px={'1.25rem'} w={'100%'} maxW={1920}>
        <Box>
          <HStack justifyContent={'space-between'}>
            <Box minW={'330px'}>
              <Box
                cursor={'pointer'}
                display={'flex'}
                justifyContent={'flex-start'}
                onClick={() => {
                  router.push(SERVICE.DASHBOARD.ROOT);
                }}
              >
                <Img src={LogoPiboogo.src} />
              </Box>
            </Box>

            <Box>
              <Box display={'flex'} justifyContent={'flex-end'}>
                <HStack spacing={'2.5rem'}>
                  <Box minW={'50px'}>
                    <HStack spacing={1}>
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
                            fontWeight={500}
                            color={'#2A333C'}
                          >
                            {lang === COUNTRY.COUNTRY_INFO.KR.LANG
                              ? '한글'
                              : 'Eng'}
                          </Text>
                        </MenuButton>
                        <MenuList
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                        >
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
                              fontWeight={500}
                              color={
                                lang === COUNTRY.COUNTRY_INFO.KR.LANG
                                  ? '#FFF'
                                  : '#2A333C'
                              }
                            >
                              {lang === COUNTRY.COUNTRY_INFO.KR.LANG
                                ? '한글'
                                : 'Kor'}
                            </Text>
                          </MenuItem>
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
                              fontWeight={500}
                              color={
                                lang === COUNTRY.COUNTRY_INFO.US.LANG
                                  ? '#FFF'
                                  : '#2A333C'
                              }
                            >
                              {lang === COUNTRY.COUNTRY_INFO.KR.LANG
                                ? '영문'
                                : 'Eng'}
                            </Text>
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </HStack>
                  </Box>
                  {isLogin && (
                    <Box
                      cursor={'pointer'}
                      onClick={() => {
                        router.push(SERVICE.MY_PAGE.ROOT);
                      }}
                    >
                      <Text
                        fontSize={'0.9375rem'}
                        fontWeight={500}
                        color={'#556A7E'}
                        lineHeight={'1.5rem'}
                      >
                        {userInfo?.brandName}
                      </Text>
                    </Box>
                  )}
                  {isLogin && (
                    <Box
                      cursor={'pointer'}
                      onClick={() => {
                        handleLogout();
                      }}
                    >
                      <HStack>
                        <Text
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                          color={'#556A7E'}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.COMMON.LOGOUT)}
                        </Text>
                        <Img src={Logout.src} />
                      </HStack>
                    </Box>
                  )}
                </HStack>
              </Box>
            </Box>
          </HStack>
        </Box>
      </Box>
    </Center>
  );
};

export default MainHeader;
