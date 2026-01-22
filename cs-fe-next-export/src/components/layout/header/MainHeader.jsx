'use client';

import {
  Box,
  Center,
  HStack,
  Img,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import LogoGlobalLinear from '@public/svgs/icon/global-linear.svg';
import useLocale from '@/hooks/useLocale';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LogoPiboogo from '@public/svgs/logo/piboogo.svg';
import Logout from '@public/svgs/icon/logout.svg';
import useMove from '@/hooks/useMove';
import { COUNTRY, LANGUAGES } from '@/constants/lang';
import useAccount from '@/hooks/useAccount';
import utils from '@/utils';

const MainHeader = (props) => {
  const { bg = '#FFF' } = props;
  const router = useRouter();
  const { lang, setLang, localeText } = useLocale();

  const { userInfo, handleLogout } = useAccount();
  const { moveMain, moveLogin } = useMove();
  const [isOpenLang, setIsOpenLang] = useState(false);
  const [leaveTimeout, setLeaveTimeout] = useState(null);

  useEffect(() => {
    if (utils.isEmpty(userInfo)) {
      console.log('로그인 필요');
    }
  }, [userInfo]);

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

  return (
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
                  const isLogin = utils.getIsLogin();
                  if (isLogin) {
                    moveMain();
                  } else {
                    moveLogin();
                  }
                }}
              >
                <Img src={LogoPiboogo.src} />
              </Box>
            </Box>

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
                        onMouseEnter={handleMouseEnterLang}
                        onMouseLeave={handleMouseLeaveLang}
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
                {userInfo?.id && (
                  <Box
                    // cursor={'pointer'}
                    onClick={() => {
                      // router.push(SERVICE.MY_PAGE);
                    }}
                  >
                    <Text
                      fontSize={'0.9375rem'}
                      fontWeight={500}
                      color={'#556A7E'}
                      lineHeight={'1.5rem'}
                    >
                      {userInfo.id}
                    </Text>
                  </Box>
                )}
                {userInfo?.id && (
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
          </HStack>
        </Box>
      </Box>
    </Center>
  );
};

export default MainHeader;
