'use client';

import TitleTextInput from '@/components/input/custom/TitleTextInput';
import { Box, Button, Center, HStack, Text, VStack } from '@chakra-ui/react';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import { useRouter } from 'next/navigation';
import { ACCOUNT } from '@/constants/pageURL';
import { useEffect, useState } from 'react';
import useModal from '@/hooks/useModal';
import sellerUserApi from '@/services/sellerUserApi';
import utils from '@/utils';
import {
  NO_DATA_ERROR,
  REQUIRE_SIGNUP_ERROR,
  SUCCESS,
} from '@/constants/errorCode';
import useDevice from '@/hooks/useDevice';
import useMove from '@/hooks/useMove';
import CustomCheckBox from '@/components/common/checkbox/CustomCheckBox';
import TitlePasswordInput from '@/components/input/custom/TitlePasswordInput';

const LoginPage = () => {
  const { isMobile, clampW } = useDevice();
  const { moveSignUp, moveMain } = useMove();
  const router = useRouter();

  const [autoLogin, setAutoLogin] = useState(false);
  const { openModal } = useModal();
  const { localeText } = useLocale();

  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [isAutoSet, setIsAuthSet] = useState(false);

  useEffect(() => {
    const userInfo = utils.getUserInfoSession();
    if (userInfo) {
      setEmail(userInfo.id);
      utils.resetUserInfoSession();
    }

    const loginUserInfo = utils.getUserInfo();
    if (loginUserInfo) {
      const tempAutoLogin = utils.getAutoLogin();
      setEmail(loginUserInfo.id);
      setPw(loginUserInfo.pw);
      setAutoLogin(tempAutoLogin);
      if (tempAutoLogin) {
        setTimeout(() => {
          setIsAuthSet(true);
        }, 50);
      }
    }
  }, []);

  useEffect(() => {
    if (email && pw) {
      handleLogin();
    }
  }, [isAutoSet]);

  const handleLogin = async () => {
    if (!email) {
      return setTimeout(() => {
        openModal({
          text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_EMAIL),
        });
      });
    }
    if (!utils.checkEmail(email)) {
      return setTimeout(() => {
        openModal({
          text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_MATCH_EMAIL),
        });
      });
    }
    if (!pw) {
      return setTimeout(() => {
        openModal({
          text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_PASSWORD),
        });
      });
    }
    /*
    if (pw.length < 7) {
      return setTimeout(() => {
        openModal({
          text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_MATCH_PASSWORD),
        });
      });
    }
    */

    const param = {
      id: email,
      pw: pw,
    };
    const result = await sellerUserApi.getSeller(param);

    if (result?.errorCode === SUCCESS) {
      const userInfo = {
        id: email,
        ...result.data,
      };
      utils.setUserInfoSession(userInfo);
      const { accessToken, refreshToken } = result.data;
      utils.setAccessToken(accessToken);
      utils.setRefreshToken(refreshToken);

      utils.setAutoLogin(autoLogin);
      if (autoLogin === true) {
        const loginUserInfo = {
          id: email,
          pw: pw,
        };
        utils.setUserInfo(loginUserInfo);
      }

      moveMain(true);
    } else if (
      result?.errorCode === REQUIRE_SIGNUP_ERROR ||
      result?.errorCode === NO_DATA_ERROR
    ) {
      setTimeout(() => {
        openModal({
          type: 'confirm',
          text: localeText(LANGUAGES.ACC.LOGIN.GO_TO_SIGN_UP),
          onAgree: () => {
            moveSignUp();
          },
          onAgreeText: localeText(LANGUAGES.COMMON.MOVE),
        });
      });
    } else {
      setTimeout(() => {
        openModal({
          text: result?.message,
        });
      });
    }
  };

  return isMobile(true) ? (
    <Box w={'100%'} px={clampW(1, 5)}>
      <VStack spacing={'3.75rem'}>
        <Box w={'100%'}>
          <VStack spacing={'1.25rem'}>
            <Box w={'100%'}>
              <TitleTextInput
                value={email}
                onChange={(v) => {
                  setEmail(v);
                }}
                onClick={() => {
                  handleLogin();
                }}
                title={localeText(LANGUAGES.ACC.EMAIL)}
                placeholder={localeText(LANGUAGES.ACC.PH_EMAIL)}
              />
            </Box>
            <Box w={'100%'}>
              <TitlePasswordInput
                value={pw}
                onChange={(v) => {
                  setPw(v);
                }}
                onClick={() => {
                  handleLogin();
                }}
                title={localeText(LANGUAGES.ACC.PASSWORD)}
                placeholder={localeText(LANGUAGES.ACC.PH_PASSWORD)}
              />
            </Box>
            <Box w={'100%'}>
              <VStack justifyContent={'space-between'}>
                <Box>
                  <HStack>
                    <Box>
                      <CustomCheckBox
                        isChecked={autoLogin}
                        onChange={(v) => {
                          setAutoLogin(v);
                        }}
                      />
                    </Box>
                    <Box>
                      <Text
                        color={'#485766'}
                        fontSize={'1rem'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.ACC.LOGIN.KEEP_ME_LOGGED_IN)}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
                <Box
                  _hover={{ cursor: 'pointer' }}
                  onClick={() => {
                    router.push(ACCOUNT.FIND);
                  }}
                >
                  <Text
                    color={'#66809C'}
                    fontSize={'1rem'}
                    fontWeight={500}
                    lineHeight={'1.75rem'}
                  >
                    {localeText(LANGUAGES.ACC.LOGIN.FORGOT_ACCOUNT)}
                  </Text>
                </Box>
              </VStack>
            </Box>
          </VStack>
        </Box>

        <Box w={'100%'}>
          <VStack spacing={'1.5rem'}>
            <Box w={'100%'}>
              <Button
                onClick={() => {
                  handleLogin();
                }}
                py={'0.88rem'}
                px={'2rem'}
                borderRadius={'0.25rem'}
                bg={'#7895B2'}
                h={'100%'}
                w={'100%'}
              >
                <Text
                  color={'#FFF'}
                  fontSize={'1.25rem'}
                  fontWeight={400}
                  lineHeight={'2.25rem'}
                >
                  {localeText(LANGUAGES.ACC.LOGIN.LOGIN)}
                </Text>
              </Button>
            </Box>
            <Box w={'100%'}>
              <Center>
                <VStack>
                  <Box>
                    <Text
                      color={'#485766'}
                      fontSize={'1rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(LANGUAGES.ACC.LOGIN.DONTS_HAVE_AN_ACCOUNT)}
                    </Text>
                  </Box>
                  <Box
                    borderBottom={'1px solid #66809C'}
                    _hover={{ cursor: 'pointer' }}
                    onClick={() => {
                      router.push(ACCOUNT.SIGN_UP);
                    }}
                  >
                    <Text
                      color={'#66809C'}
                      fontSize={'1rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(LANGUAGES.ACC.LOGIN.CREATE_AN_ACCOUNT)}
                    </Text>
                  </Box>
                </VStack>
              </Center>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ) : (
    <Box w={'40rem'}>
      <VStack spacing={'3.75rem'}>
        <Box w={'100%'}>
          <VStack spacing={'2.5rem'}>
            <Box w={'100%'}>
              <TitleTextInput
                value={email}
                onChange={(v) => {
                  setEmail(v);
                }}
                onClick={() => {
                  handleLogin();
                }}
                title={localeText(LANGUAGES.ACC.EMAIL)}
                placeholder={localeText(LANGUAGES.ACC.PH_EMAIL)}
              />
            </Box>
            <Box w={'100%'}>
              <TitlePasswordInput
                value={pw}
                onChange={(v) => {
                  setPw(v);
                }}
                onClick={() => {
                  handleLogin();
                }}
                title={localeText(LANGUAGES.ACC.PASSWORD)}
                placeholder={localeText(LANGUAGES.ACC.PH_PASSWORD)}
              />
            </Box>
            <Box w={'100%'}>
              <HStack justifyContent={'space-between'}>
                <Box>
                  <HStack>
                    <Box>
                      <CustomCheckBox
                        isChecked={autoLogin}
                        onChange={(v) => {
                          setAutoLogin(v);
                        }}
                      />
                    </Box>
                    <Box>
                      <Text
                        color={'#485766'}
                        fontSize={'1rem'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.ACC.LOGIN.KEEP_ME_LOGGED_IN)}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
                <Box
                  _hover={{ cursor: 'pointer' }}
                  onClick={() => {
                    router.push(ACCOUNT.FIND);
                  }}
                >
                  <Text
                    color={'#66809C'}
                    fontSize={'1rem'}
                    fontWeight={500}
                    lineHeight={'1.75rem'}
                  >
                    {localeText(LANGUAGES.ACC.LOGIN.FORGOT_ACCOUNT)}
                  </Text>
                </Box>
              </HStack>
            </Box>
          </VStack>
        </Box>

        <Box w={'100%'}>
          <VStack spacing={'1.5rem'}>
            <Box w={'100%'}>
              <Button
                onClick={() => {
                  handleLogin();
                }}
                py={'0.88rem'}
                px={'2rem'}
                borderRadius={'0.25rem'}
                bg={'#7895B2'}
                h={'100%'}
                w={'100%'}
              >
                <Text
                  color={'#FFF'}
                  fontSize={'1.25rem'}
                  fontWeight={400}
                  lineHeight={'2.25rem'}
                >
                  {localeText(LANGUAGES.ACC.LOGIN.LOGIN)}
                </Text>
              </Button>
            </Box>
            <Box w={'100%'}>
              <Center>
                <HStack>
                  <Box>
                    <Text
                      color={'#485766'}
                      fontSize={'1rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(LANGUAGES.ACC.LOGIN.DONTS_HAVE_AN_ACCOUNT)}
                    </Text>
                  </Box>
                  <Box
                    borderBottom={'1px solid #66809C'}
                    _hover={{ cursor: 'pointer' }}
                    onClick={() => {
                      router.push(ACCOUNT.SIGN_UP);
                    }}
                  >
                    <Text
                      color={'#66809C'}
                      fontSize={'1rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(LANGUAGES.ACC.LOGIN.CREATE_AN_ACCOUNT)}
                    </Text>
                  </Box>
                </HStack>
              </Center>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default LoginPage;
