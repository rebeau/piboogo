'use client';

import TitleTextInput from '@/components/custom/input/TitleTextInput';
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import csUserApi from '@/services/csUserApi';
import { SUCCESS } from '@/constants/errorCode';
import utils from '@/utils';
import useMove from '@/hooks/useMove';
import useDevice from '@/hooks/useDevice';
import useModal from '@/hooks/useModal';
import CustomCheckBox from '@/components/common/checkbox/CustomCheckBox';

const LoginPage = () => {
  const router = useRouter();
  const { isMobile, clampW } = useDevice();
  const { moveMain } = useMove();
  const { openModal } = useModal();
  const { localeText } = useLocale();

  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [tempAutoLogin, setTempAutoLogin] = useState(utils.getAutoLogin());

  useEffect(() => {
    const userInfo = utils.getUserInfo();
    if (tempAutoLogin === true && userInfo?.id && userInfo?.pw) {
      handleGetLogin(userInfo.id, userInfo.pw);
    } else {
      setTempAutoLogin(false);
    }
  }, []);

  const handleLogin = async () => {
    if (!email) {
      return setTimeout(() => {
        openModal({
          text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_EMAIL),
        });
      });
    }
    if (!utils.checkEmail(email)) {
      return setTimeout(() => {
        openModal({
          text: localeText(LANGUAGES.INFO_MSG.NOT_MATCH_EMAIL),
        });
      });
    }
    if (!pw) {
      return setTimeout(() => {
        openModal({
          text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_PASSWORD),
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
    handleGetLogin(email, pw);
  };

  const handleGetLogin = async (id, pw) => {
    const param = {
      id: id,
      pw: pw,
    };
    const result = await csUserApi.getCsUser(param);

    if (result?.errorCode === SUCCESS) {
      const userInfo = {
        id: id,
        ...result.data,
      };
      utils.setUserInfoSession(userInfo);
      const { accessToken, refreshToken } = result.data;
      utils.setAccessToken(accessToken);
      utils.setRefreshToken(refreshToken);

      utils.setAutoLogin(tempAutoLogin);
      if (tempAutoLogin === true) {
        const loginUserInfo = {
          id: id,
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
        openModal({ type: result.massage });
      });
    }
  };

  return (
    <Box w={'40rem'}>
      <VStack spacing={'3.75rem'}>
        <Box w={'100%'}>
          <VStack spacing={'2.5rem'}>
            <Box w={'100%'}>
              <TitleTextInput
                value={email || ''}
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
              <TitleTextInput
                type={'password'}
                value={pw || ''}
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
                        isChecked={tempAutoLogin}
                        onChange={(v) => {
                          setTempAutoLogin(v);
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
              </HStack>
            </Box>
          </VStack>
        </Box>

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
      </VStack>
    </Box>
  );
};

export default LoginPage;
