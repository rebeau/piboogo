'use client';

import ContentBR from '@/components/custom/ContentBR';
import TitleTextInput from '@/components/input/custom/TitleTextInput';
import {
  Box,
  Button,
  Center,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import { useCallback, useEffect, useState } from 'react';
import utils from '@/utils';
import buyerApi from '@/services/buyerUserApi';
import useModal from '@/hooks/useModal';
import { SUCCESS } from '@/constants/errorCode';
import useDevice from '@/hooks/useDevice';
import TitlePasswordInput from '@/components/input/custom/TitlePasswordInput';
import useMove from '@/hooks/useMove';

const FindPage = () => {
  const { isMobile, clampW } = useDevice();
  const { openModal } = useModal();
  const { moveLogin, moveSignUp } = useMove();
  const { localeText } = useLocale();
  const [tabIndex, setTabIndex] = useState(0);

  const [resultData, setResultData] = useState({});
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pw, setPw] = useState('');

  useEffect(() => {
    if (isComplete) {
      handleInitData();
    }
  }, [tabIndex]);

  useEffect(() => {
    if (email || pw) {
      if (tabIndex === 0) {
        if (name && pw.length > 7) {
          setIsAllChecked(true);
        } else {
          setIsAllChecked(false);
        }
      } else {
        if (utils.checkEmail(email)) {
          setIsAllChecked(true);
        } else {
          setIsAllChecked(false);
        }
      }
    }
  }, [name, email, pw]);

  const handleInitData = useCallback(() => {
    setIsAllChecked(false);
    setIsComplete(false);
    setName('');
    setEmail('');
    setPw('');
  });

  const handleFind = useCallback(async () => {
    if (tabIndex === 0) {
      if (!name) {
        return openModal({
          text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_NAME),
        });
      }
      if (!pw) {
        return openModal({
          text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_PASSWORD),
        });
      }
      if (pw.length < 7) {
        return openModal({
          text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_MATCH_PASSWORD),
        });
      }
      const param = {
        name,
        pw,
      };
      const result = await buyerApi.getBuyerFindEmail(param);
      if (result?.errorCode === SUCCESS) {
        setResultData(result.data);
        setIsComplete(true);
      } else {
        openModal({ text: result.message });
      }
    } else {
      if (!email) {
        return openModal({
          text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_EMAIL),
        });
      }
      if (!utils.checkEmail(email)) {
        return openModal({
          text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_MATCH_EMAIL),
        });
      }
      const param = {
        email,
      };
      const result = await buyerApi.getBuyerFindPassword(param);
      if (result?.errorCode === SUCCESS) {
        openModal({
          text: result.message,
          onAgree: () => {
            setResultData(result.data);
            setIsComplete(true);
          },
        });
      } else {
        openModal({ text: result.message });
      }
    }
  });

  const handleButtonText = useCallback(() => {
    if (isComplete) {
      if (tabIndex === 0) return localeText(LANGUAGES.ACC.FIND.CONFIRM);
      if (tabIndex === 1) return localeText(LANGUAGES.ACC.FIND.GO_TO_LOG_IN);
    } else {
      if (tabIndex === 0) return localeText(LANGUAGES.ACC.FIND.FIND_A_EMAIL);
      if (tabIndex === 1)
        return localeText(LANGUAGES.ACC.FIND.ISSUE_TEMP_PASSWORD);
    }
  });

  const handleComplete = useCallback(() => {
    if (tabIndex === 0) {
      handleInitData();
    } else {
      moveLogin();
    }
  });

  return isMobile(true) ? (
    <Box w={'100%'} px={clampW(1, 5)}>
      <Tabs
        onChange={(index) => {
          setTabIndex(index);
        }}
      >
        <TabList py={clampW(0.75, 1.25)}>
          <Tab
            px={0}
            w={'50%'}
            _selected={{ color: '#66809C', fontWeight: 600 }}
            color={'#A7C3D2'}
            fontSize={clampW(1.125, 1.25)}
            fontWeight={400}
            lineHeight={'175%'}
          >
            {localeText(LANGUAGES.ACC.FIND.FORGOT_EMAIL)}
          </Tab>
          <Tab
            px={0}
            w={'50%'}
            _selected={{ color: '#66809C', fontWeight: 600 }}
            color={'#A7C3D2'}
            fontSize={clampW(1.125, 1.25)}
            fontWeight={400}
            lineHeight={'175%'}
          >
            {localeText(LANGUAGES.ACC.FIND.FORGOT_PASSWORD)}
          </Tab>
        </TabList>
        {!isComplete ? (
          <TabPanels>
            <TabPanel p={0}>
              <VStack spacing={'1.25rem'}>
                <Box w={'100%'}>
                  <Text
                    color={'#556A7E'}
                    fontSize={clampW(1, 1.125)}
                    fontWeight={500}
                    lineHeight={'175%'}
                    textAlign={'center'}
                  >
                    {localeText(LANGUAGES.ACC.FIND.SUB_TITLE_EMAIL)}
                  </Text>
                </Box>
                <Box w={'100%'}>
                  <TitleTextInput
                    value={name}
                    onChange={(v) => {
                      setName(v);
                    }}
                    title={localeText(LANGUAGES.ACC.NAME)}
                    placeholder={localeText(LANGUAGES.ACC.PH_NAME)}
                  />
                </Box>
                <Box w={'100%'}>
                  <TitlePasswordInput
                    value={pw}
                    onChange={(v) => {
                      setPw(v);
                    }}
                    title={localeText(LANGUAGES.ACC.PASSWORD)}
                    placeholder={localeText(
                      LANGUAGES.ACC.FIND.PH_PASSWORD_FOR_EMAIL,
                    )}
                  />
                </Box>
              </VStack>
            </TabPanel>
            <TabPanel p={0}>
              <VStack spacing={'2.5rem'}>
                <Box w={'100%'}>
                  <Text
                    color={'#556A7E'}
                    fontSize={clampW(1, 1.125)}
                    fontWeight={500}
                    lineHeight={'175%'}
                    textAlign={'center'}
                  >
                    {localeText(LANGUAGES.ACC.FIND.SUB_TITLE_PASSWORD)}
                  </Text>
                </Box>
                <Box w={'100%'}>
                  <TitleTextInput
                    value={email}
                    onChange={(v) => {
                      setEmail(v);
                    }}
                    title={localeText(LANGUAGES.ACC.EMAIL)}
                    placeholder={localeText(
                      LANGUAGES.ACC.FIND.PH_EMAIL_FOR_PASSWORD,
                    )}
                  />
                </Box>
              </VStack>
            </TabPanel>
          </TabPanels>
        ) : (
          <TabPanels>
            <TabPanel p={0}>
              <VStack spacing={'1.5rem'}>
                <Text
                  color={'#556A7E'}
                  fontSize={'1.125rem'}
                  fontWeight={500}
                  lineHeight={'1.96875rem'}
                  textAlign={'center'}
                >
                  {`${localeText(LANGUAGES.ACC.FIND.FIND_EMAIL_ADDRESS, { key: '@NAME@', value: name })}`}
                </Text>
                {resultData?.id && (
                  <Text
                    color={'#556A7E'}
                    fontSize={'1.75rem'}
                    fontWeight={500}
                    lineHeight={'2.7475rem'}
                    textAlign={'center'}
                  >
                    {resultData.id}
                  </Text>
                )}
              </VStack>
            </TabPanel>
            <TabPanel p={0}>
              <Text
                color={'#556A7E'}
                fontSize={'1.125rem'}
                fontWeight={500}
                lineHeight={'1.96875rem'}
                textAlign={'center'}
              >
                {localeText(LANGUAGES.ACC.FIND.COMPLETE_FIND_PASSWORD)}
              </Text>
            </TabPanel>
          </TabPanels>
        )}

        <ContentBR h={'3.75rem'} />

        <Box w={'100%'}>
          <Button
            onClick={() => {
              if (isComplete) {
                handleComplete();
              } else {
                handleFind();
              }
            }}
            isDisabled={!isAllChecked}
            py={'0.875rem'}
            px={'2rem'}
            borderRadius={'0.25rem'}
            bg={'#7895B2'}
            h={'100%'}
            w={'100%'}
            _disabled={{
              bg: '#D9E7EC',
            }}
            _hover={{ opacity: !isAllChecked ? 1 : 0.8 }}
          >
            <Text
              color={'#FFF'}
              fontSize={'1.25rem'}
              fontWeight={400}
              lineHeight={'2.25rem'}
            >
              {handleButtonText()}
            </Text>
          </Button>
        </Box>
        <Box w={'100%'} pt={'1.25rem'}>
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
                  moveSignUp();
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
      </Tabs>
    </Box>
  ) : (
    <Box w={'40rem'}>
      <Tabs
        onChange={(index) => {
          setTabIndex(index);
        }}
      >
        <TabList py={'1.25rem'}>
          <Tab
            w={'50%'}
            _selected={{ color: '#66809C', fontWeight: 600 }}
            color={'#A7C3D2'}
            fontSize={'1.25rem'}
            fontWeight={400}
            lineHeight={'2.25rem'}
          >
            {localeText(LANGUAGES.ACC.FIND.FORGOT_EMAIL)}
          </Tab>
          <Tab
            w={'50%'}
            _selected={{ color: '#66809C', fontWeight: 600 }}
            color={'#A7C3D2'}
            fontSize={'1.25rem'}
            fontWeight={400}
            lineHeight={'2.25rem'}
          >
            {localeText(LANGUAGES.ACC.FIND.FORGOT_PASSWORD)}
          </Tab>
        </TabList>
        {!isComplete ? (
          <TabPanels pt={'2.5rem'}>
            <TabPanel p={0}>
              <VStack spacing={'2.5rem'}>
                <Box w={'100%'}>
                  <Text
                    color={'#556A7E'}
                    fontSize={'1.125rem'}
                    fontWeight={500}
                    lineHeight={'1.96875rem'}
                    textAlign={'center'}
                  >
                    {localeText(LANGUAGES.ACC.FIND.SUB_TITLE_EMAIL)}
                  </Text>
                </Box>
                <Box w={'100%'}>
                  <TitleTextInput
                    value={name}
                    onChange={(v) => {
                      setName(v);
                    }}
                    title={localeText(LANGUAGES.ACC.NAME)}
                    placeholder={localeText(LANGUAGES.ACC.PH_NAME)}
                  />
                </Box>
                <Box w={'100%'}>
                  <TitlePasswordInput
                    value={pw}
                    onChange={(v) => {
                      setPw(v);
                    }}
                    title={localeText(LANGUAGES.ACC.PASSWORD)}
                    placeholder={localeText(
                      LANGUAGES.ACC.FIND.PH_PASSWORD_FOR_EMAIL,
                    )}
                  />
                </Box>
              </VStack>
            </TabPanel>
            <TabPanel p={0}>
              <VStack spacing={'2.5rem'}>
                <Box w={'100%'}>
                  <Text
                    color={'#556A7E'}
                    fontSize={'1.125rem'}
                    fontWeight={500}
                    lineHeight={'1.96875rem'}
                    textAlign={'center'}
                  >
                    {localeText(LANGUAGES.ACC.FIND.SUB_TITLE_PASSWORD)}
                  </Text>
                </Box>
                <Box w={'100%'}>
                  <TitleTextInput
                    value={email}
                    onChange={(v) => {
                      setEmail(v);
                    }}
                    title={localeText(LANGUAGES.ACC.EMAIL)}
                    placeholder={localeText(
                      LANGUAGES.ACC.FIND.PH_EMAIL_FOR_PASSWORD,
                    )}
                  />
                </Box>
              </VStack>
            </TabPanel>
          </TabPanels>
        ) : (
          <TabPanels pt={'2.5rem'}>
            <TabPanel p={0}>
              <VStack spacing={'1.5rem'}>
                <Text
                  color={'#556A7E'}
                  fontSize={'1.125rem'}
                  fontWeight={500}
                  lineHeight={'1.96875rem'}
                  textAlign={'center'}
                >
                  {`${localeText(LANGUAGES.ACC.FIND.FIND_EMAIL_ADDRESS, { key: '@NAME@', value: name })}`}
                </Text>

                {resultData?.id && (
                  <Text
                    color={'#556A7E'}
                    fontSize={'1.75rem'}
                    fontWeight={500}
                    lineHeight={'2.7475rem'}
                    textAlign={'center'}
                  >
                    {resultData.id}
                  </Text>
                )}
              </VStack>
            </TabPanel>
            <TabPanel p={0}>
              <Text
                color={'#556A7E'}
                fontSize={'1.125rem'}
                fontWeight={500}
                lineHeight={'1.96875rem'}
                textAlign={'center'}
              >
                {localeText(LANGUAGES.ACC.FIND.COMPLETE_FIND_PASSWORD)}
              </Text>
            </TabPanel>
          </TabPanels>
        )}
        <ContentBR h={'3.75rem'} />
        <Box w={'100%'}>
          <Button
            onClick={() => {
              if (isComplete) {
                handleComplete();
              } else {
                handleFind();
              }
            }}
            isDisabled={!isAllChecked}
            py={'0.875rem'}
            px={'2rem'}
            borderRadius={'0.25rem'}
            bg={'#7895B2'}
            h={'100%'}
            w={'100%'}
            _disabled={{
              bg: '#D9E7EC',
            }}
            _hover={{ opacity: !isAllChecked ? 1 : 0.8 }}
          >
            <Text
              color={'#FFF'}
              fontSize={'1.25rem'}
              fontWeight={400}
              lineHeight={'2.25rem'}
            >
              {handleButtonText()}
            </Text>
          </Button>
        </Box>
        <Box w={'100%'} pt={'1.25rem'}>
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
                  moveSignUp();
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
      </Tabs>
    </Box>
  );
};

export default FindPage;
