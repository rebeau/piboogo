'use client';

import ContentBR from '@/components/custom/ContentBR';
import IconRight from '@public/svgs/icon/right.svg';
import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Img,
  Input,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react';
import { COUNTRY, COUNTRY_LIST, LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import CustomCheckbox from '@/components/common/checkbox/CustomCheckBox';
import { useCallback, useEffect, useState } from 'react';
import TitleTextInput from '@/components/input/custom/TitleTextInput';
import { useRouter } from 'next/navigation';
import { ACCOUNT } from '@/constants/pageURL';
import useModal from '@/hooks/useModal';
import utils from '@/utils';
import buyerApi from '@/services/buyerUserApi';
import { SUCCESS } from '@/constants/errorCode';
import useDevice from '@/hooks/useDevice';
import TermsOfUse from '@/components/custom/policy/TermsOfUse';
import RetailerTermsOfService from '@/components/custom/policy/RetailerTermsOfService';
import PrivacyPolicy from '@/components/custom/policy/PrivacyPolicy';
import TitlePasswordInput from '@/components/input/custom/TitlePasswordInput';
import useMove from '@/hooks/useMove';
import {
  isOpenGoogleAddrState,
  selectedGoogleAddrState,
} from '@/stores/googleAddrRecoil';
import { useRecoilValue, useSetRecoilState } from 'recoil';

const LoginPage = () => {
  const { isMobile, clampW } = useDevice();
  const { moveLogin } = useMove();
  const { openModal } = useModal();
  const router = useRouter();
  const paramEmail = utils.getSessionItem('email');
  const [signUpStepIndex, setSignUpStepIndex] = useState(0);
  const { lang, localeText } = useLocale();
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isFirstChecked, setIsFirstChecked] = useState(false);
  const [isSecondChecked, setIsSecondChecked] = useState(false);
  const [isThirdChecked, setIsThirdChecked] = useState(false);
  const [isSendEmail, setIsSendEmail] = useState(false);
  const [isVerificationChecked, setIsVerificationChecked] = useState(false);

  const [email, setEmail] = useState('');
  const [verifiCode, setVerifiCode] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const [referrerId, setReferrerId] = useState('');

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState(0);
  const [businessNum, setBusinessNum] = useState('');
  const [phone, setPhone] = useState('');

  const [userAddress, setUserAddress] = useState({});

  const [addressType, setAddressType] = useState(1); // 국내, 해외
  const [country, setCountry] = useState(null);

  const [address1, setAddress1] = useState(null);
  const [address2, setAddress2] = useState(null);

  const setIsOpenGoogleAddr = useSetRecoilState(isOpenGoogleAddrState);
  const selectedAddress = useRecoilValue(selectedGoogleAddrState);

  useEffect(() => {
    if (selectedAddress) {
      if (selectedAddress.countryAlpha2Code === COUNTRY.COUNTRY_INFO.KR.CODE) {
        setAddress1(selectedAddress.streetAddress);
        setAddress2(selectedAddress.detailAddress);
        setCountry(COUNTRY.COUNTRY_INFO.KR.CODE);
        setAddressType(1);
      } else {
        setAddress1(selectedAddress.pullAddress);
        setAddress2('');
        setCountry(COUNTRY.COUNTRY_INFO.US.CODE);
        setAddressType(2);
      }
      setUserAddress((prev) => {
        return {
          ...prev,
          state: selectedAddress.stateOrProvince,
          city: selectedAddress.city,
          zipCode: selectedAddress.postalCode,
        };
      });
    }
  }, [selectedAddress]);

  useEffect(() => {
    if (paramEmail) {
      setEmail(paramEmail);
      utils.removeSessionItem('email');
    }
  }, [paramEmail]);

  useEffect(() => {
    if (country === 'KR') {
      setAddressType(1);
    } else {
      setAddressType(2);
    }
  }, [country]);

  useEffect(() => {
    if (lang === COUNTRY.COUNTRY_INFO.KR.CODE) {
      setAddressType(1);
      setCountry(COUNTRY.COUNTRY_INFO.KR.CODE);
    } else {
      setAddressType(2);
      setCountry(COUNTRY.COUNTRY_INFO.US.CODE);
    }
  }, []);

  const handleAllCheckboxChange = (newCheckedValue) => {
    setIsAllChecked(newCheckedValue);
    setIsFirstChecked(newCheckedValue);
    setIsSecondChecked(newCheckedValue);
    setIsThirdChecked(newCheckedValue);
  };

  const handleCheckboxChange = useCallback((newCheckedValue, setState) => {
    setState(newCheckedValue);
  });

  useEffect(() => {
    if (isFirstChecked && isSecondChecked && isThirdChecked) {
      setIsAllChecked(true);
    } else {
      setIsAllChecked(false);
    }
  }, [isFirstChecked, isSecondChecked, isThirdChecked]);

  const handleScrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  });

  const handleNext = useCallback(() => {
    setSignUpStepIndex((prev) => {
      return prev + 1;
    });
    handleScrollTop();
  });

  const handleSignUp = useCallback(async () => {
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
    if (!(lastName + firstName)) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_NAME),
      });
    }
    if (!phone) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_PHONE),
      });
    }
    if (!utils.checkPhoneNum(phone)) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_MATCH_PHONE),
      });
    }
    if (businessType === 0) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_SELECT_BUSINESS_TYPE),
      });
    }
    if (!businessNum) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_BUSINESS_NUMBER),
      });
    }

    if (!address1) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_ADDRESS),
      });
    }
    if (!userAddress.state) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_STATE),
      });
    }
    if (!userAddress.city) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_CITY),
      });
    }
    if (!userAddress.zipCode) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_ZIP_CODE),
      });
    }

    const param = {
      id: email,
      pw: pw,
      name: lastName + ' ' + firstName,
      phone: phone,
      businessType: businessType,
      businessNumber: businessNum,
    };
    if (referrerId) {
      param.referrerId = referrerId;
    }
    if (businessName) {
      param.businessName = businessName;
    }
    const address = {
      addressType: addressType,
      zipCode: userAddress.zipCode,
      state: userAddress.state,
      city: userAddress.city,
    };
    if (addressType === 1) {
      address.roadNameMainAddr = address1;
      // address.landNumberMainAddr = address1;
      if (address2) {
        address.subAddr = address2;
      }
    } else {
      address.addressLineOne = address1;
      if (address2) {
        address.addressLineTwo = address2;
      }
    }
    param.rqAddUserAddressDTO = { ...address };

    const result = await buyerApi.postBuyer(param);
    if (result?.errorCode === SUCCESS) {
      const userInfo = {
        id: email,
        isLogin: true,
        ...result.data,
      };
      utils.setUserInfoSession(userInfo);
      setSignUpStepIndex((prev) => {
        return prev + 1;
      });
      handleScrollTop();
      return;
    } else {
      openModal({ text: result.message });
    }
  });

  const handleGoLogin = useCallback(() => {
    moveLogin();
  });

  const handleSendEmail = useCallback(async () => {
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
    const result = await buyerApi.getBuyerEmailVerificationSend(param);
    if (result?.errorCode === SUCCESS) {
      setIsSendEmail(true);
      openModal({ text: result?.message });
    }
  });

  const handleVerify = useCallback(async () => {
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
    if (!verifiCode) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_VERIFICATION_CODE),
      });
    }
    const param = {
      email,
      code: verifiCode,
    };
    const result = await buyerApi.getBuyerEmailVerification(param);
    openModal({ text: result?.message });
    if (result?.errorCode === SUCCESS) {
      setIsVerificationChecked(true);
    }
  });

  const SignUpFormTitle = useCallback(() => {
    return isMobile(true) ? (
      <>
        <Box w={'100%'}>
          <HStack justifyContent={'center'}>
            {signUpStepIndex === 0 && (
              <Box>
                <Text
                  color={'#556A7E'}
                  fontSize={clampW(1.25, 1.5)}
                  lineHeight={'180%'}
                  fontWeight={signUpStepIndex === 0 ? 600 : 400}
                >
                  {localeText(LANGUAGES.ACC.SU.AGREE)}
                </Text>
              </Box>
            )}
            {signUpStepIndex === 1 && (
              <Box>
                <Text
                  color={'#556A7E'}
                  fontSize={clampW(1.25, 1.5)}
                  lineHeight={'180%'}
                  fontWeight={signUpStepIndex === 1 ? 600 : 400}
                >
                  {localeText(LANGUAGES.ACC.SU.ENTER_INFORMATION)}
                </Text>
              </Box>
            )}
            {signUpStepIndex === 2 && (
              <Box>
                <Text
                  color={'#556A7E'}
                  fontSize={clampW(1.25, 1.5)}
                  lineHeight={'180%'}
                  fontWeight={signUpStepIndex === 2 ? 600 : 400}
                >
                  {localeText(LANGUAGES.ACC.SU.COMPLETE_SIGN_UP)}
                </Text>
              </Box>
            )}
          </HStack>
        </Box>
      </>
    ) : (
      <>
        <Box w={'100%'}>
          <HStack justifyContent={'space-between'}>
            <Box>
              <Text
                color={'#556A7E'}
                fontSize={'1.5rem'}
                fontWeight={signUpStepIndex === 0 ? 600 : 400}
                lineHeight={'2.475rem'}
              >
                {localeText(LANGUAGES.ACC.SU.AGREE)}
              </Text>
            </Box>
            <Box>
              <Img src={IconRight.src} />
            </Box>
            <Box>
              <Text
                color={'#556A7E'}
                fontSize={'1.5rem'}
                fontWeight={signUpStepIndex === 1 ? 600 : 400}
                lineHeight={'2.475rem'}
              >
                {localeText(LANGUAGES.ACC.SU.ENTER_INFORMATION)}
              </Text>
            </Box>
            <Box>
              <Img src={IconRight.src} />
            </Box>
            <Box>
              <Text
                color={'#556A7E'}
                fontSize={'1.5rem'}
                fontWeight={signUpStepIndex === 2 ? 600 : 400}
                lineHeight={'2.475rem'}
              >
                {localeText(LANGUAGES.ACC.SU.COMPLETE_SIGN_UP)}
              </Text>
            </Box>
          </HStack>
        </Box>
      </>
    );
  });

  const SignUpForm = useCallback(() => {
    if (signUpStepIndex === 0) {
      return (
        <>
          <VStack spacing={'3.75rem'} justifyContent={'flex-start'}>
            <Box w={'100%'}>
              <VStack spacing={'2rem'}>
                <Box w={'100%'}>
                  <HStack>
                    <Box>
                      <CustomCheckbox
                        isChecked={isAllChecked}
                        onChange={(v) => {
                          handleAllCheckboxChange(v);
                        }}
                      />
                    </Box>
                    <Box>
                      <Text
                        color={'#556A7E'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.ACC.SU.FULL_AGREEMENT)}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
                <Box w={'100%'}>
                  <Divider
                    border={'1px solid #AEBDCA'}
                    boxSizing="border-box"
                  />
                </Box>
                <Box w={'100%'}>
                  <HStack>
                    <Box>
                      <CustomCheckbox
                        isChecked={isFirstChecked}
                        onChange={(v) => {
                          handleCheckboxChange(v, setIsFirstChecked);
                        }}
                      />
                    </Box>
                    <Box>
                      <Text
                        color={'#556A7E'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.ACC.SU.TERMS_AGREEMENT)}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
                <TermsOfUse />

                <Box w={'100%'}>
                  <HStack>
                    <Box>
                      <CustomCheckbox
                        isChecked={isSecondChecked}
                        onChange={(v) => {
                          handleCheckboxChange(v, setIsSecondChecked);
                        }}
                      />
                    </Box>
                    <Box>
                      <Text
                        color={'#556A7E'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem '}
                      >
                        {localeText(LANGUAGES.ACC.SU.PRIVACY_CONSENT)}
                      </Text>
                    </Box>
                  </HStack>
                </Box>

                <PrivacyPolicy />
                <Box w={'100%'}>
                  <HStack>
                    <Box>
                      <CustomCheckbox
                        isChecked={isThirdChecked}
                        onChange={(v) => {
                          handleCheckboxChange(v, setIsThirdChecked);
                        }}
                      />
                    </Box>
                    <Box>
                      <Text
                        color={'#556A7E'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem '}
                      >
                        {localeText(LANGUAGES.ACC.SU.SERVICE_AGREEMENT)}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
                <RetailerTermsOfService />
              </VStack>
            </Box>
            <Box w={'100%'}>
              <Button
                onClick={handleNext}
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
                  {localeText(LANGUAGES.NEXT)}
                </Text>
              </Button>
            </Box>
          </VStack>
        </>
      );
    } else if (signUpStepIndex === 1) {
      return isMobile(true) ? (
        <>
          <VStack spacing={'2.5rem'}>
            <Box w={'100%'}>
              <VStack spacing={'1.25rem'} justifyContent={'flex-start'}>
                <Box w={'100%'}>
                  <HStack
                    spacing={'1.25rem'}
                    justifyContent={'space-between'}
                    alignItems={'flex-end'}
                  >
                    <Box w={'30.375rem'}>
                      <TitleTextInput
                        value={email}
                        onChange={(v) => {
                          setEmail(v);
                          setIsSendEmail(false);
                          setIsVerificationChecked(false);
                        }}
                        title={localeText(LANGUAGES.ACC.EMAIL)}
                        placeholder={localeText(LANGUAGES.ACC.SU.PH_EMAIL)}
                      />
                    </Box>
                    <Box w={'8.375rem'} minW={'8rem'} h={'3rem'}>
                      <Button
                        onClick={handleSendEmail}
                        isDisabled={!(email.length > 0)}
                        px={'1rem'}
                        py={'0.75rem'}
                        borderRadius={'0.25rem'}
                        bg={'#7895B2'}
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
                          color={'#FFF'}
                          fontSize={'1.125rem'}
                          fontWeight={400}
                          lineHeight={'1.96875rem'}
                        >
                          {localeText(LANGUAGES.ACC.SU.SEND_EMAIL)}
                        </Text>
                      </Button>
                    </Box>
                  </HStack>
                </Box>
                <Box w={'100%'}>
                  <VStack
                    spacing={'1.25rem'}
                    justifyContent={'space-between'}
                    alignItems={'flex-end'}
                  >
                    <Box w={'100%'}>
                      <Box h={'7rem'}>
                        <VStack alignItems={'flex-start'} spacing={'0.25rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                          >
                            {`${localeText(LANGUAGES.ACC.SU.VERIFICATION)} ${localeText(LANGUAGES.ACC.SU.CODE)}`}
                          </Text>
                          <Input
                            _readOnly={{
                              color: '#A7C3D2',
                              bg: 'linear-gradient(0deg, var(--Semantic-fill-brand-hover, rgba(144, 174, 196, 0.07)) 0%, var(--Semantic-fill-brand-hover, rgba(144, 174, 196, 0.07)) 100%), var(--Semantic-fill-inverse-default, #FFF)',
                            }}
                            placeholder={localeText(
                              LANGUAGES.ACC.SU.PH_VERIFICATION_CODE,
                            )}
                            autoComplete={'off'}
                            _placeholder={{
                              position: 'absolute',
                              top: '15px',
                              w: '70%',
                              color: '#A7C3D2',
                              fontSize: '1rem',
                              fontWeight: 400,
                              lineHeight: '1.75rem',
                              whiteSpace: 'pre-wrap',
                            }}
                            onChange={(e) => {
                              const value = e.target.value;
                              setVerifiCode(value);
                            }}
                            value={verifiCode || ''}
                            w={'100%'}
                            h={'5rem'}
                            // py={'0.75rem'}
                            px={'1.25rem'}
                            bg={'#FFF'}
                            borderRadius="0.25rem"
                            border={'1px solid #9CADBE'}
                          />
                        </VStack>
                      </Box>
                    </Box>
                    <Box w={'100%'} h={'3.5rem'}>
                      <Button
                        onClick={handleVerify}
                        isDisabled={!isSendEmail}
                        px={'1rem'}
                        py={'0.75rem'}
                        borderRadius={'0.25rem'}
                        bg={'#7895B2'}
                        h={'100%'}
                        w={'100%'}
                        _disabled={{
                          bg: '#D9E7EC',
                        }}
                        _hover={{
                          opacity: !isSendEmail ? 1 : 0.8,
                          cursor: !isSendEmail ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <Text
                          color={'#FFF'}
                          fontSize={'clamp(1.125rem, 3vw, 1.25rem)'}
                          fontWeight={400}
                          lineHeight={'1.96875rem'}
                        >
                          {localeText(LANGUAGES.ACC.SU.VERIFICATION)}
                        </Text>
                      </Button>
                    </Box>
                  </VStack>
                </Box>
                <Box w={'100%'}>
                  <TitlePasswordInput
                    value={pw}
                    onChange={(v) => {
                      setPw(v);
                    }}
                    title={localeText(LANGUAGES.ACC.PASSWORD)}
                    placeholder={localeText(LANGUAGES.ACC.PH_PASSWORD)}
                  />
                </Box>
                <Box w={'100%'}>
                  <TitlePasswordInput
                    value={pwCheck}
                    onChange={(v) => {
                      setPwCheck(v);
                    }}
                    title={localeText(LANGUAGES.ACC.PASSWORD_CONFIRM)}
                    placeholder={localeText(LANGUAGES.ACC.PH_PASSWORD)}
                  />
                </Box>

                <Box w={'100%'}>
                  <Box h={'7rem'}>
                    <VStack alignItems={'flex-start'} spacing={'0.25rem'}>
                      <Text
                        color={'#7895B2'}
                        fontSize={'1rem'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        {`${localeText(LANGUAGES.ACC.SU.REFERRER_ID)} - ${localeText(LANGUAGES.ACC.SU.OPTIONAL)}`}
                      </Text>
                      <Input
                        placeholder={localeText(
                          LANGUAGES.ACC.SU.PH_REFERRER_ID,
                        )}
                        autoComplete={'off'}
                        _placeholder={{
                          position: 'absolute',
                          top: '15px',
                          color: '#A7C3D2',
                          fontSize: '1rem',
                          fontWeight: 400,
                          lineHeight: '1.75rem',
                          whiteSpace: 'pre-wrap',
                        }}
                        value={referrerId}
                        onChange={(e) => {
                          setReferrerId(e.target.value);
                        }}
                        w={'100%'}
                        h={'5rem'}
                        // py={'0.75rem'}
                        px={'1.25rem'}
                        bg={'#FFF'}
                        borderRadius="0.25rem"
                        border={'1px solid #9CADBE'}
                      />
                    </VStack>
                  </Box>
                </Box>
              </VStack>
            </Box>

            <Divider border={'1px solid #73829D'} boxSizing="border-box" />

            <Box w={'100%'}>
              <VStack spacing={'1.25rem'}>
                <Box w={'100%'}>
                  <HStack w={'100%'} spacing={'1.25rem'}>
                    <Box w={'50%'}>
                      <TitleTextInput
                        value={lastName}
                        onChange={(v) => {
                          setLastName(v);
                        }}
                        title={localeText(LANGUAGES.ACC.LAST_NAME)}
                        placeholder={localeText(LANGUAGES.ACC.LAST_NAME)}
                      />
                    </Box>
                    <Box w={'50%'}>
                      <TitleTextInput
                        value={firstName}
                        onChange={(v) => {
                          setFirstName(v);
                        }}
                        title={localeText(LANGUAGES.ACC.FIRST_NAME)}
                        placeholder={localeText(LANGUAGES.ACC.FIRST_NAME)}
                      />
                    </Box>
                  </HStack>
                </Box>
                <Box w={'100%'}>
                  <TitleTextInput
                    value={businessName}
                    onChange={(v) => {
                      setBusinessName(v);
                    }}
                    title={localeText(LANGUAGES.ACC.SU.BUSINESS_NAME)}
                    placeholder={localeText(LANGUAGES.ACC.SU.PH_BUSINESS_NAME)}
                  />
                </Box>
                <Box w={'100%'}>
                  <TitleTextInput
                    value={phone}
                    onChange={(v) => {
                      setPhone(v);
                    }}
                    type={'number'}
                    title={localeText(LANGUAGES.ACC.PHONE_NUMBER)}
                    placeholder={localeText(LANGUAGES.ACC.PH_PHONE_NUMBER)}
                  />
                </Box>
                {/* address */}
                <Box w={'100%'}>
                  <VStack spacing={'1rem'}>
                    <Box w={'100%'}>
                      <TitleTextInput
                        title={localeText(LANGUAGES.ADDRESS.ADDRESS)}
                        placeholder={localeText(LANGUAGES.ADDRESS.ADDRESS1)}
                        value={address1}
                        isReadOnly
                        onClick={() => {
                          setIsOpenGoogleAddr(true);
                        }}
                      />
                    </Box>
                    <Box w={'100%'}>
                      <TitleTextInput
                        //addressLineOne
                        placeholder={`${localeText(LANGUAGES.ADDRESS.ADDRESS2)} (${localeText(LANGUAGES.ACC.SU.OPTIONAL)})`}
                        value={address2}
                        onChange={(v) => {
                          setAddress2(v);
                        }}
                      />
                    </Box>
                    <Box w={'100%'}>
                      <HStack w={'100%'} spacing={'1.25rem'}>
                        <Box w={'50%'}>
                          <TitleTextInput
                            title={localeText(LANGUAGES.ADDRESS.CITY)}
                            placeholder={localeText(LANGUAGES.ADDRESS.CITY)}
                            value={userAddress.city}
                            onChange={(v) => {
                              setUserAddress({
                                ...userAddress,
                                city: v,
                              });
                            }}
                          />
                        </Box>
                        <Box w={'50%'}>
                          <TitleTextInput
                            title={localeText(LANGUAGES.ADDRESS.STATE)}
                            placeholder={localeText(LANGUAGES.ADDRESS.STATE)}
                            value={userAddress.state}
                            onChange={(v) => {
                              setUserAddress({
                                ...userAddress,
                                state: v,
                              });
                            }}
                          />
                        </Box>
                      </HStack>
                    </Box>
                    <Box w={'100%'}>
                      <HStack w={'100%'} spacing={'1.25rem'}>
                        <Box w={'50%'}>
                          <TitleTextInput
                            type={'number'}
                            max={5}
                            title={localeText(LANGUAGES.ADDRESS.POSCAL_CODE)}
                            placeholder={localeText(
                              LANGUAGES.ADDRESS.POSCAL_CODE,
                            )}
                            value={userAddress.zipCode}
                            onChange={(v) => {
                              setUserAddress({
                                ...userAddress,
                                zipCode: v,
                              });
                            }}
                          />
                        </Box>
                        <Box w={'50%'}>
                          <Box h={'5rem'} maxW={null}>
                            <VStack
                              alignItems={'flex-start'}
                              spacing={'0.25rem'}
                            >
                              <Text
                                color={'#7895B2'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                              >
                                {localeText(LANGUAGES.ADDRESS.COUNTRY)}
                              </Text>
                              <Select
                                value={country || ''}
                                onChange={(e) => {
                                  setCountry(e.target.value);
                                }}
                                w={'100%'}
                                h={'3rem'}
                                bg={'#FFF'}
                                borderRadius={'0.25rem'}
                                border={'1px solid #9CADBE'}
                                color={'#485766'}
                                fontSize={clampW(0.9375, 1)}
                              >
                                <option value={''}>
                                  {localeText(LANGUAGES.ADDRESS.COUNTRY)}
                                </option>
                                {COUNTRY_LIST.map((item, index) => {
                                  return (
                                    <option key={index} value={item.CODE}>
                                      {item[lang.toUpperCase()]}
                                    </option>
                                  );
                                })}
                              </Select>
                            </VStack>
                          </Box>
                        </Box>
                      </HStack>
                    </Box>
                  </VStack>
                </Box>
                {/* business */}
                <Box w={'100%'}>
                  <VStack spacing={'1rem'}>
                    <Box w={'100%'}>
                      <VStack spacing={'0.25rem'}>
                        <Box w={'100%'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.ACC.SU.BUSINESS_TYPE)}
                          </Text>
                        </Box>
                        <Select
                          value={businessType}
                          onChange={(e) => {
                            setBusinessType(e.target.value);
                          }}
                          w={'100%'}
                          h={'3rem'}
                          bg={'#FFF'}
                          borderRadius={'0.25rem'}
                          border={'1px solid #9CADBE'}
                          color={'#485766'}
                          fontSize={clampW(0.9375, 1)}
                        >
                          <option value={0}>
                            {localeText(
                              LANGUAGES.ACC.SU.PH_BUSINESS_TYPE_SELECT,
                            )}
                          </option>
                          <option value={1}>
                            {localeText(LANGUAGES.ACC.SU.MEDICAL_SPA)}
                          </option>
                          <option value={2}>
                            {localeText(LANGUAGES.ACC.SU.ESTHETICS)}
                          </option>
                          <option value={3}>
                            {localeText(LANGUAGES.ACC.SU.RETAILER)}
                          </option>
                          <option value={4}>
                            {localeText(LANGUAGES.ACC.SU.OTHER)}
                          </option>
                        </Select>
                      </VStack>
                    </Box>
                    <Box w={'100%'}>
                      <Input
                        placeholder={localeText(
                          LANGUAGES.ACC.SU.PH_BUSINESS_NUMBER,
                        )}
                        autoComplete={'off'}
                        _placeholder={{
                          position: 'absolute',
                          top: '15px',
                          color: '#A7C3D2',
                          fontSize: '1rem',
                          fontWeight: 400,
                          lineHeight: '1.75rem',
                          whiteSpace: 'pre-wrap',
                        }}
                        value={businessNum}
                        onChange={(e) => {
                          setBusinessNum(e.target.value);
                        }}
                        w={'100%'}
                        h={'5rem'}
                        // py={'0.75rem'}
                        px={'1.25rem'}
                        bg={'#FFF'}
                        borderRadius="0.25rem"
                        border={'1px solid #9CADBE'}
                      />
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </VStack>

          <ContentBR h={'3.75rem'} />

          <Box w={'100%'}>
            <Button
              onClick={handleSignUp}
              isDisabled={!isVerificationChecked}
              py={'0.875rem'}
              px={'2rem'}
              borderRadius={'0.25rem'}
              bg={'#7895B2'}
              h={'100%'}
              w={'100%'}
              _disabled={{
                bg: '#D9E7EC',
              }}
              _hover={{ opacity: !isVerificationChecked ? 1 : 0.8 }}
            >
              <Text
                color={'#FFF'}
                fontSize={'1.25rem'}
                fontWeight={400}
                lineHeight={'2.25rem'}
              >
                {localeText(LANGUAGES.ACC.SU.SIGN_UP)}
              </Text>
            </Button>
          </Box>
        </>
      ) : (
        <>
          <VStack spacing={'2.5rem'}>
            <Box w={'100%'}>
              <VStack spacing={'1.25rem'} justifyContent={'flex-start'}>
                <Box w={'100%'}>
                  <HStack
                    spacing={'1.25rem'}
                    justifyContent={'space-between'}
                    alignItems={'flex-end'}
                  >
                    <Box w={'30.375rem'}>
                      <TitleTextInput
                        value={email}
                        onChange={(v) => {
                          setEmail(v);
                          setIsSendEmail(false);
                          setIsVerificationChecked(false);
                        }}
                        title={localeText(LANGUAGES.ACC.EMAIL)}
                        placeholder={localeText(LANGUAGES.ACC.SU.PH_EMAIL)}
                      />
                    </Box>
                    <Box w={'8.375rem'} minW={'8rem'} h={'3.5rem'}>
                      <Button
                        onClick={handleSendEmail}
                        isDisabled={!(email.length > 0)}
                        px={'1rem'}
                        py={'0.75rem'}
                        borderRadius={'0.25rem'}
                        bg={'#7895B2'}
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
                          color={'#FFF'}
                          fontSize={'1.125rem'}
                          fontWeight={400}
                          lineHeight={'1.96875rem'}
                        >
                          {localeText(LANGUAGES.ACC.SU.SEND_EMAIL)}
                        </Text>
                      </Button>
                    </Box>
                  </HStack>
                </Box>
                <Box w={'100%'}>
                  <HStack
                    spacing={'1.25rem'}
                    justifyContent={'space-between'}
                    alignItems={'flex-end'}
                  >
                    <Box w={'30.375rem'}>
                      <TitleTextInput
                        value={verifiCode}
                        onChange={(v) => {
                          setVerifiCode(v);
                        }}
                        title={`${localeText(LANGUAGES.ACC.SU.VERIFICATION)} ${localeText(LANGUAGES.ACC.SU.CODE)}`}
                        placeholder={localeText(
                          LANGUAGES.ACC.SU.PH_VERIFICATION_CODE,
                        )}
                      />
                    </Box>
                    <Box w={'8.375rem'} minW={'8rem'} h={'3.5rem'}>
                      <Button
                        onClick={handleVerify}
                        isDisabled={!isSendEmail}
                        px={'1rem'}
                        py={'0.75rem'}
                        borderRadius={'0.25rem'}
                        bg={'#7895B2'}
                        h={'100%'}
                        w={'100%'}
                        _disabled={{
                          bg: '#D9E7EC',
                        }}
                        _hover={{
                          opacity: !isSendEmail ? 1 : 0.8,
                          cursor: !isSendEmail ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <Text
                          color={'#FFF'}
                          fontSize={'1.25rem'}
                          fontWeight={400}
                          lineHeight={'1.96875rem'}
                        >
                          {localeText(LANGUAGES.ACC.SU.VERIFICATION)}
                        </Text>
                      </Button>
                    </Box>
                  </HStack>
                </Box>
                <Box w={'100%'}>
                  <TitlePasswordInput
                    value={pw}
                    onChange={(v) => {
                      setPw(v);
                    }}
                    title={localeText(LANGUAGES.ACC.PASSWORD)}
                    placeholder={localeText(LANGUAGES.ACC.PH_PASSWORD)}
                  />
                </Box>
                <Box w={'100%'}>
                  <TitlePasswordInput
                    value={pwCheck}
                    onChange={(v) => {
                      setPwCheck(v);
                    }}
                    title={localeText(LANGUAGES.ACC.PASSWORD_CONFIRM)}
                    placeholder={localeText(LANGUAGES.ACC.PH_PASSWORD)}
                  />
                </Box>
                <Box w={'100%'}>
                  <TitleTextInput
                    value={referrerId}
                    onChange={(v) => {
                      setReferrerId(v);
                    }}
                    title={`${localeText(LANGUAGES.ACC.SU.REFERRER_ID)} - ${localeText(LANGUAGES.ACC.SU.OPTIONAL)}`}
                    placeholder={localeText(LANGUAGES.ACC.SU.PH_REFERRER_ID)}
                  />
                </Box>
              </VStack>
            </Box>

            <Divider border={'1px solid #73829D'} boxSizing="border-box" />

            <Box w={'100%'}>
              <VStack spacing={'1.25rem'}>
                <Box w={'100%'}>
                  <HStack w={'100%'} spacing={'1.25rem'}>
                    <Box w={'50%'}>
                      <TitleTextInput
                        value={lastName}
                        onChange={(v) => {
                          setLastName(v);
                        }}
                        title={localeText(LANGUAGES.ACC.LAST_NAME)}
                        placeholder={localeText(LANGUAGES.ACC.LAST_NAME)}
                      />
                    </Box>
                    <Box w={'50%'}>
                      <TitleTextInput
                        value={firstName}
                        onChange={(v) => {
                          setFirstName(v);
                        }}
                        title={localeText(LANGUAGES.ACC.FIRST_NAME)}
                        placeholder={localeText(LANGUAGES.ACC.FIRST_NAME)}
                      />
                    </Box>
                  </HStack>
                </Box>
                <Box w={'100%'}>
                  <TitleTextInput
                    value={businessName}
                    onChange={(v) => {
                      setBusinessName(v);
                    }}
                    title={localeText(LANGUAGES.ACC.SU.BUSINESS_NAME)}
                    placeholder={localeText(LANGUAGES.ACC.SU.PH_BUSINESS_NAME)}
                  />
                </Box>
                <Box w={'100%'}>
                  <TitleTextInput
                    value={phone}
                    onChange={(v) => {
                      setPhone(v);
                    }}
                    type={'number'}
                    title={localeText(LANGUAGES.ACC.PHONE_NUMBER)}
                    placeholder={localeText(LANGUAGES.ACC.PH_PHONE_NUMBER)}
                  />
                </Box>
                {/* address */}
                <Box w={'100%'}>
                  <VStack spacing={'1rem'}>
                    <Box w={'100%'}>
                      <TitleTextInput
                        title={localeText(LANGUAGES.ADDRESS.ADDRESS)}
                        placeholder={localeText(LANGUAGES.ADDRESS.ADDRESS1)}
                        value={address1}
                        isReadOnly
                        onClick={() => {
                          setIsOpenGoogleAddr(true);
                        }}
                      />
                    </Box>
                    <Box w={'100%'}>
                      <TitleTextInput
                        //addressLineOne
                        placeholder={`${localeText(LANGUAGES.ADDRESS.ADDRESS2)} (${localeText(LANGUAGES.ACC.SU.OPTIONAL)})`}
                        value={address2}
                        onChange={(v) => {
                          setAddress2(v);
                        }}
                      />
                    </Box>
                    <Box w={'100%'}>
                      <HStack w={'100%'} spacing={'1.25rem'}>
                        <Box w={'50%'}>
                          <TitleTextInput
                            title={localeText(LANGUAGES.ADDRESS.CITY)}
                            placeholder={localeText(LANGUAGES.ADDRESS.CITY)}
                            value={userAddress.city}
                            onChange={(v) => {
                              setUserAddress({
                                ...userAddress,
                                city: v,
                              });
                            }}
                          />
                        </Box>
                        <Box w={'50%'}>
                          <TitleTextInput
                            title={localeText(LANGUAGES.ADDRESS.STATE)}
                            placeholder={localeText(LANGUAGES.ADDRESS.STATE)}
                            value={userAddress.state}
                            onChange={(v) => {
                              setUserAddress({
                                ...userAddress,
                                state: v,
                              });
                            }}
                          />
                        </Box>
                      </HStack>
                    </Box>
                    <Box w={'100%'}>
                      <HStack w={'100%'} spacing={'1.25rem'}>
                        <Box w={'50%'}>
                          <TitleTextInput
                            type={'number'}
                            max={5}
                            title={localeText(LANGUAGES.ADDRESS.POSCAL_CODE)}
                            placeholder={localeText(
                              LANGUAGES.ADDRESS.POSCAL_CODE,
                            )}
                            value={userAddress.zipCode}
                            onChange={(v) => {
                              setUserAddress({
                                ...userAddress,
                                zipCode: v,
                              });
                            }}
                          />
                        </Box>
                        <Box w={'50%'}>
                          <Box h={'5.5rem'} maxW={null}>
                            <VStack
                              alignItems={'flex-start'}
                              spacing={'0.25rem'}
                            >
                              <Text
                                color={'#7895B2'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                              >
                                {localeText(LANGUAGES.ADDRESS.COUNTRY)}
                              </Text>
                              <Select
                                value={country || ''}
                                onChange={(e) => {
                                  setCountry(e.target.value);
                                }}
                                w={'100%'}
                                h={'3.5rem'}
                                bg={'#FFF'}
                                borderRadius={'0.25rem'}
                                border={'1px solid #9CADBE'}
                              >
                                <option value={''}>
                                  {localeText(LANGUAGES.ADDRESS.COUNTRY)}
                                </option>
                                {COUNTRY_LIST.map((item, index) => {
                                  return (
                                    <option key={index} value={item.CODE}>
                                      {item[lang.toUpperCase()]}
                                    </option>
                                  );
                                })}
                              </Select>
                            </VStack>
                          </Box>
                        </Box>
                      </HStack>
                    </Box>
                  </VStack>
                </Box>
                {/* business */}
                <Box w={'100%'}>
                  <VStack spacing={'1rem'}>
                    <Box w={'100%'}>
                      <VStack spacing={'0.25rem'}>
                        <Box w={'100%'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.ACC.SU.BUSINESS_TYPE)}
                          </Text>
                        </Box>
                        <Select
                          value={businessType}
                          onChange={(e) => {
                            setBusinessType(e.target.value);
                          }}
                          w={'100%'}
                          h={'3.5rem'}
                          bg={'#FFF'}
                          borderRadius={'0.25rem'}
                          border={'1px solid #9CADBE'}
                        >
                          <option value={0}>
                            {localeText(
                              LANGUAGES.ACC.SU.PH_BUSINESS_TYPE_SELECT,
                            )}
                          </option>
                          <option value={1}>
                            {localeText(LANGUAGES.ACC.SU.MEDICAL_SPA)}
                          </option>
                          <option value={2}>
                            {localeText(LANGUAGES.ACC.SU.ESTHETICS)}
                          </option>
                          <option value={3}>
                            {localeText(LANGUAGES.ACC.SU.RETAILER)}
                          </option>
                          <option value={4}>
                            {localeText(LANGUAGES.ACC.SU.OTHER)}
                          </option>
                        </Select>
                      </VStack>
                    </Box>
                    <Box w={'100%'}>
                      <TitleTextInput
                        value={businessNum}
                        onChange={(v) => {
                          setBusinessNum(v);
                        }}
                        type={'number'}
                        placeholder={localeText(
                          LANGUAGES.ACC.SU.PH_BUSINESS_NUMBER,
                        )}
                      />
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </VStack>

          <ContentBR h={'3.75rem'} />

          <Box w={'100%'}>
            <Button
              onClick={handleSignUp}
              isDisabled={!isVerificationChecked}
              py={'0.875rem'}
              px={'2rem'}
              borderRadius={'0.25rem'}
              bg={'#7895B2'}
              h={'100%'}
              w={'100%'}
              _disabled={{
                bg: '#D9E7EC',
              }}
              _hover={{ opacity: !isVerificationChecked ? 1 : 0.8 }}
            >
              <Text
                color={'#FFF'}
                fontSize={'1.25rem'}
                fontWeight={400}
                lineHeight={'2.25rem'}
              >
                {localeText(LANGUAGES.ACC.SU.SIGN_UP)}
              </Text>
            </Button>
          </Box>
        </>
      );
    } else if (signUpStepIndex === 2) {
      return isMobile(true) ? (
        <>
          <Center w={'100%'}>
            <VStack spacing={'0.75rem'}>
              <Box w={'100%'}>
                <Text
                  color={'#66809C'}
                  fontSize={'clamp(1.5rem, 3vw, 1.75rem)'}
                  fontWeight={500}
                  lineHeight={'2.7475rem'}
                  textAlign={'center'}
                >
                  {localeText(LANGUAGES.ACC.SU.SIGN_UP_IS_COMPLETE)}
                </Text>
              </Box>
              <Box w={'100%'}>
                <Text
                  color={'#66809C'}
                  fontSize={'1.25rem'}
                  fontWeight={400}
                  lineHeight={'2.25rem'}
                  textAlign={'center'}
                >
                  {localeText(LANGUAGES.ACC.SU.SERVICES_AND_BENEFITS)}
                </Text>
              </Box>
            </VStack>
          </Center>
          <ContentBR h={'2.5rem'} />
          <Box w={'100%'}>
            <Button
              onClick={handleGoLogin}
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
                {localeText(LANGUAGES.ACC.SU.GO_TO_SIGN_IN)}
              </Text>
            </Button>
          </Box>
        </>
      ) : (
        <>
          <ContentBR h={'3.75rem'} />
          <Center w={'100%'}>
            <VStack spacing={'0.75rem'}>
              <Box>
                <Text
                  color={'#66809C'}
                  fontSize={'1.75rem'}
                  fontWeight={500}
                  lineHeight={'2.7475rem'}
                >
                  {localeText(LANGUAGES.ACC.SU.SIGN_UP_IS_COMPLETE)}
                </Text>
              </Box>
              <Box w={'100%'}>
                <Text
                  color={'#66809C'}
                  fontSize={'1.25rem'}
                  fontWeight={400}
                  lineHeight={'2.25rem'}
                >
                  {localeText(LANGUAGES.ACC.SU.SERVICES_AND_BENEFITS)}
                </Text>
              </Box>
            </VStack>
          </Center>
          <ContentBR h={'3.75rem'} />
          <Box w={'100%'}>
            <Button
              onClick={handleGoLogin}
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
                {localeText(LANGUAGES.ACC.SU.GO_TO_SIGN_IN)}
              </Text>
            </Button>
          </Box>
        </>
      );
    }
  });

  return isMobile(true) ? (
    <Box w={'100%'} px={'1rem'}>
      <ContentBR h={'2.5rem'} />
      {SignUpFormTitle()}
      <ContentBR h={'3.75rem'} />
      {SignUpForm()}
    </Box>
  ) : (
    <Box w={'40rem'}>
      <ContentBR h={'2.5rem'} />
      {SignUpFormTitle()}
      <ContentBR h={'3.75rem'} />
      {SignUpForm()}
    </Box>
  );
};

export default LoginPage;
