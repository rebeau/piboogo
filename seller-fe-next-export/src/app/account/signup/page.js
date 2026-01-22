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
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { COUNTRY, COUNTRY_LIST, LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import CustomCheckBox from '@/components/common/checkbox/CustomCheckBox';
import { useCallback, useEffect, useRef, useState } from 'react';
import TitleTextInput from '@/components/input/custom/TitleTextInput';
import { useRouter } from 'next/navigation';
import { ACCOUNT } from '@/constants/pageURL';
import { CustomIcon } from '@/components';

import dynamic from 'next/dynamic';
import useDevice from '@/hooks/useDevice';
import sellerUserApi from '@/services/sellerUserApi';
import utils from '@/utils';
import { SUCCESS } from '@/constants/errorCode';
import { BANK_LIST_KR, BANK_LIST_US } from '@/constants/common';
import useModal from '@/hooks/useModal';
import useMenu from '@/hooks/useMenu';
import TermsOfUse from '@/components/custom/policy/TermsOfUse';
import PrivacyPolicy from '@/components/custom/policy/PrivacyPolicy';
import BrandTermsOfService from '@/components/custom/policy/BrandTermsOfService';
import TitlePasswordInput from '@/components/input/custom/TitlePasswordInput';
import QuillViewer from '@/components/input/QuillViewer';
import {
  isOpenGoogleAddrState,
  selectedGoogleAddrState,
} from '@/stores/googleAddrRecoil';
import { useRecoilValue, useSetRecoilState } from 'recoil';

const CustomEditor = dynamic(() => import('@/components/input/CustomEditor'), {
  ssr: false,
});

const SignUpPage = () => {
  const {
    isOpen: isOpenPreview,
    onOpen: onOpenPreview,
    onClose: onClosePreview,
  } = useDisclosure();

  const brandLogoInput = useRef(null);
  const brandBannerInput = useRef(null);
  const companyCertificateInput = useRef(null);
  const accInput = useRef(null);

  const { openModal } = useModal();
  const { isMobile, clampW } = useDevice();
  const { lang, localeText } = useLocale();

  const router = useRouter();
  const paramEmail = utils.getSessionItem('email');

  const setIsOpenGoogleAddr = useSetRecoilState(isOpenGoogleAddrState);
  const selectedAddress = useRecoilValue(selectedGoogleAddrState);

  const [signUpStepIndex, setSignUpStepIndex] = useState(0);
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

  const [brandName, setBrandName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState(0);
  const [businessNum, setBusinessNum] = useState('');

  const [userAddress, setUserAddress] = useState({});

  const [phone, setPhone] = useState('');
  const [addressType, setAddressType] = useState(1); // 국내, 해외
  const [country, setCountry] = useState(null);

  const [listBank, setListBank] = useState([]);
  const [bankName, setBankName] = useState('');
  const [bankNumber, setBankNumber] = useState(null);

  const [address1, setAddress1] = useState(null);
  const [address2, setAddress2] = useState(null);

  const [shippingMethod, setShippingMethod] = useState(0);
  const [minimumOrderAmount, setMinimumOrderAmount] = useState(0);
  const [info, setInfo] = useState(null);

  const [brandLogoImage, setBrandLogoImage] = useState(null);
  const [brandBannerImage, setBrandBannerImage] = useState(null);
  const [companyCertificateImage, setCompanyCertificateImage] = useState(null);
  const [accImage, setAccImage] = useState(null);

  useEffect(() => {
    if (selectedAddress) {
      if (selectedAddress.countryAlpha2Code === COUNTRY.COUNTRY_INFO.KR.CODE) {
        setAddress1(selectedAddress.streetAddress);
        setAddress2(selectedAddress.detailAddress);
        setCountry(COUNTRY.COUNTRY_INFO.KR.CODE);
        setAddressType(1);
        setListBank(BANK_LIST_KR);
      } else {
        setAddress1(selectedAddress.pullAddress);
        setAddress2('');
        setCountry(COUNTRY.COUNTRY_INFO.US.CODE);
        setAddressType(2);
        setListBank(BANK_LIST_US);
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

  const [isThirdCategory, setIsThirdCategory] = useState(false);
  const [firstCategoryId, setFirstCategoryId] = useState(0);
  const [secondCategoryId, setSecondCategoryId] = useState(0);
  const [thirdCategoryId, setThirdCategoryId] = useState(0);
  const [listCategory, setListCategory] = useState([
    {
      index: 0,
      firstCategoryId: 0,
      secondCategoryId: 0,
      thirdCategoryId: 0,
      listSecondCategory: [],
      listThirdCategory: [],
    },
  ]);

  const {
    listAllCategory,
    listFirstCategory,
    setListFirstCategory,
    listSecondCategory,
    setListSecondCategory,
    listThirdCategory,
    setListThirdCategory,
    handleAllCategory,
    handleFindCategoryById,
  } = useMenu();

  useEffect(() => {
    if (paramEmail) {
      setEmail(paramEmail);
      utils.removeSessionItem('email');
    }
  }, [paramEmail]);

  useEffect(() => {
    handleAllCategory();
  }, []);

  useEffect(() => {
    if (listAllCategory.length > 0) {
      setListFirstCategory(listAllCategory);
    }
  }, [listAllCategory]);

  useEffect(() => {
    handleAllCategory();
  }, []);

  const updateListCategory = async (index, key, value) => {
    setListCategory((prev) => {
      const updated = [...prev];
      const target = updated[index];

      if (key === 'firstCategoryId') {
        updated[index] = {
          ...target,
          firstCategoryId: value,
          secondCategoryId: 0,
          thirdCategoryId: 0,
          listSecondCategory: [],
          listThirdCategory: [],
        };
      } else if (key === 'secondCategoryId') {
        updated[index] = {
          ...target,
          secondCategoryId: value,
          thirdCategoryId: 0,
          listThirdCategory: [],
        };
      } else {
        updated[index] = {
          ...target,
          thirdCategoryId: value,
        };
      }

      return updated;
    });

    // 비동기 호출을 useEffect 대신 여기서 처리
    if (key === 'firstCategoryId') {
      const res = await handleFindCategoryById(value);
      setListCategory((prev) => {
        const updated = [...prev];
        updated[index].listSecondCategory = res?.secondCategoryDataList || [];
        return updated;
      });
    }

    if (key === 'secondCategoryId') {
      const res = await handleFindCategoryById(null, value);
      setListCategory((prev) => {
        const updated = [...prev];
        updated[index].listThirdCategory = res?.thirdCategoryDataList || [];
        return updated;
      });
    }
  };

  const addCategory = () => {
    setListCategory((prev) => [
      ...prev,
      {
        index: listCategory.length,
        firstCategoryId: 0,
        secondCategoryId: 0,
        thirdCategoryId: 0,
        listSecondCategory: [],
        listThirdCategory: [],
      },
    ]);
  };

  const removeCategoryItem = (indexToRemove) => {
    setListCategory((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, index) => index !== indexToRemove);
    });
  };

  useEffect(() => {
    console.log('listCategory', listCategory);
  }, [listCategory]);

  useEffect(() => {
    setBankName('');
    if (country === COUNTRY.COUNTRY_INFO.KR.CODE) {
      setAddressType(1);
      setListBank(BANK_LIST_KR);
    } else {
      setAddressType(2);
      setListBank(BANK_LIST_US);
    }
  }, [country]);

  useEffect(() => {
    if (lang === COUNTRY.COUNTRY_INFO.KR.CODE) {
      setAddressType(1);
      setCountry(COUNTRY.COUNTRY_INFO.KR.CODE);

      setTimeout(() => {
        setListBank(BANK_LIST_KR);
      });
    } else {
      setAddressType(2);
      setCountry(COUNTRY.COUNTRY_INFO.US.CODE);
      setTimeout(() => {
        setListBank(BANK_LIST_US);
      });
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

  useEffect(() => {
    if (lang === COUNTRY.COUNTRY_INFO.KR.CODE) {
      setAddressType(1);
      setCountry(COUNTRY.COUNTRY_INFO.KR.CODE);
    } else {
      setAddressType(2);
      setCountry(COUNTRY.COUNTRY_INFO.US.CODE);
    }
  }, []);

  const handleScrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  });

  const handleNext = useCallback(() => {
    setSignUpStepIndex((prev) => {
      return prev + 1;
    });
    handleScrollTop();
  });

  const saveImageFile = (e, target) => {
    const file = e.target.files[0];
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = (data) => {
        if (typeof data.target?.result === 'string') {
          if (target === 'logo') {
            setBrandLogoImage(file);
          } else if (target === 'banner') {
            setBrandBannerImage(file);
          } else if (target === 'companyCert') {
            setCompanyCertificateImage(file);
          } else if (target === 'acc') {
            setAccImage(file);
          }
        } else {
          console.log('## image upload Failed');
        }
      };
    } catch (e) {
      console.log('## image upload Failed', e);
    }
  };

  const handleSignUp = useCallback(async () => {
    if (!utils.isLocalTest()) {
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
      if (!businessNum) {
        return openModal({
          text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_BUSINESS_NUMBER),
        });
      }

      if (Number(shippingMethod) === 0) {
        return openModal({
          text: localeText(LANGUAGES.INFO_MSG.SELECT_SHIPPING_METHOD),
        });
      }

      if (Number(minimumOrderAmount) === 0) {
        return openModal({
          text: localeText(LANGUAGES.INFO_MSG.SELECT_MINIMUM_PURCHASE),
        });
      }

      if (utils.isEmpty(info)) {
        return openModal({
          text: localeText(LANGUAGES.INFO_MSG.ENTER_BRAND_INFO),
        });
      }

      /*
      if (utils.isEmpty(firstCategoryId)) {
        return openModal({
          text: localeText(LANGUAGES.INFO_MSG.SELECT_AN_FIRST),
        });
      }
      if (utils.isEmpty(secondCategoryId)) {
        return openModal({
          text: localeText(LANGUAGES.INFO_MSG.SELECT_AN_SECOND),
        });
      }
      */

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
      // 이미지 체크
      if (!brandLogoImage?.name) {
        return openModal({
          text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_BRAND_LOGO),
        });
      }
      if (!brandBannerImage?.name) {
        return openModal({
          text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_BRAND_BANNER),
        });
      }
      if (!companyCertificateImage?.name) {
        return openModal({
          text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_COMPANY_CERT),
        });
      }
      if (!accImage?.name) {
        return openModal({
          text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_BANK_ACCOUNT),
        });
      }
    }

    const hasInvalid = listCategory.some((item) => item.firstCategoryId === 0);
    let rqAddSellerCategoriesDTO = [];
    if (hasInvalid && !utils.isLocalTest()) {
      return openModal({
        text: localeText(LANGUAGES.INFO_MSG.SELECT_AN_FIRST),
      });
    } else {
      const filtered = listCategory.filter(
        (item) => item.firstCategoryId !== 0,
      );

      const tempFiltered = filtered
        .filter((item) => item.firstCategoryId !== 0)
        .map((item) => {
          const cleaned = {
            firstCategoryId: item.firstCategoryId,
          };
          if (item.secondCategoryId !== 0) {
            cleaned.secondCategoryId = item.secondCategoryId;
          }
          if (item.thirdCategoryId !== 0) {
            cleaned.thirdCategoryId = item.thirdCategoryId;
          }
          return cleaned;
        });

      rqAddSellerCategoriesDTO = [...tempFiltered];
    }

    const param = {
      id: email,
      pw: pw,
      brandName: brandName,
      companyName: businessName,
      companyNumber: businessNum,
      companyPhone: phone,
      bankName: bankName,
      bankNumber: bankNumber,
      defaultShipping: Number(shippingMethod),
      minimumOrderAmount: Number(minimumOrderAmount),
      info: info,
    };
    if (businessName) {
      param.businessName = businessName;
    }

    param.rqAddSellerCategoriesDTO = rqAddSellerCategoriesDTO;

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

    const result = await sellerUserApi.postSeller(
      param,
      brandLogoImage,
      brandBannerImage,
      companyCertificateImage,
      accImage,
    );
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
    //
    router.replace(ACCOUNT.LOGIN);
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
    const result = await sellerUserApi.getSellerEmailVerificationSend(param);
    if (result?.errorCode === SUCCESS) {
      setIsSendEmail(true);
      openModal({ text: result?.message });
    } else {
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
    const result = await sellerUserApi.getSellerEmailVerification(param);
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
                      <CustomCheckBox
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

                <Divider
                  borderTop={'1px solid #AEBDCA'}
                  boxSizing={'border-box'}
                />

                <Box w={'100%'}>
                  <VStack spacing={'2rem'}>
                    <Box w={'100%'}>
                      <HStack>
                        <Box>
                          <CustomCheckBox
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
                            {localeText(LANGUAGES.ACC.SU.TERMS_OF_USE)}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>

                    <TermsOfUse />
                  </VStack>
                </Box>

                <Box w={'100%'}>
                  <VStack spacing={'2rem'}>
                    <Box w={'100%'}>
                      <HStack>
                        <Box>
                          <CustomCheckBox
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
                            {localeText(LANGUAGES.ACC.SU.PRIVACY_POLICY)}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>

                    <PrivacyPolicy />
                  </VStack>
                </Box>

                <Box w={'100%'}>
                  <VStack spacing={'2rem'}>
                    <Box w={'100%'}>
                      <HStack>
                        <Box>
                          <CustomCheckBox
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
                            {localeText(
                              LANGUAGES.ACC.SU.BRAND_TERMS_OF_SERVICE,
                            )}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>

                    <BrandTermsOfService />
                  </VStack>
                </Box>
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
                  <Text
                    color={'#485766'}
                    fontSize={'1.125rem'}
                    fontWeight={400}
                    lineHeight={'1.96875rem'}
                  >
                    {localeText(LANGUAGES.ACC.SU.ACCOUNT_INFOMATION)}
                  </Text>
                </Box>

                <Box w={'100%'}>
                  <VStack
                    spacing={'1.25rem'}
                    justifyContent={'space-between'}
                    alignItems={'flex-end'}
                  >
                    <Box w={'100%'}>
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
                    <Box w={'100%'} h={'3.5rem'}>
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
                  </VStack>
                </Box>

                <Box w={'100%'}>
                  <VStack
                    spacing={'1.25rem'}
                    justifyContent={'space-between'}
                    alignItems={'flex-end'}
                  >
                    <Box w={'100%'}>
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
                          fontSize={'1.25rem'}
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
                  <TitleTextInput
                    value={pw}
                    onChange={(v) => {
                      setPw(v);
                    }}
                    title={localeText(LANGUAGES.ACC.PASSWORD)}
                    placeholder={localeText(LANGUAGES.ACC.PH_PASSWORD)}
                  />
                </Box>

                <Box w={'100%'}>
                  <TitleTextInput
                    value={pwCheck}
                    onChange={(v) => {
                      setPwCheck(v);
                    }}
                    title={localeText(LANGUAGES.ACC.PASSWORD_CONFIRM)}
                    placeholder={localeText(LANGUAGES.ACC.PH_PASSWORD)}
                  />
                </Box>
              </VStack>
            </Box>

            <Divider borderTop={'1px solid #73829D'} boxSizing={'border-box'} />

            <Box w={'100%'}>
              <VStack spacing={'1.25rem'}>
                <Box w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'1.125rem'}
                    fontWeight={400}
                    lineHeight={'1.96875rem'}
                  >
                    {localeText(LANGUAGES.ACC.SU.SELLER_INFOMATION)}
                  </Text>
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

                {/* Brand name */}
                <Box w={'100%'}>
                  <TitleTextInput
                    value={brandName}
                    onChange={(v) => {
                      setBrandName(v);
                    }}
                    title={localeText(LANGUAGES.ACC.SU.BRAND_NAME)}
                    placeholder={localeText(LANGUAGES.ACC.SU.PH_BRAND_NAME)}
                  />
                </Box>

                {/* Brand Category */}
                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <Text
                        color={'#7895B2'}
                        fontSize={'1rem'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.ACC.SU.BRAND_CATEGORY)}
                      </Text>
                    </Box>

                    <Box w={'100%'}>
                      <VStack w="100%">
                        {listCategory.map((item, index) => {
                          const firstCategoryId = item.firstCategoryId;
                          const secondCategoryId = item.secondCategoryId;
                          const listSecondCategory =
                            item?.listSecondCategory || [];
                          return (
                            <HStack
                              w="100%"
                              key={index}
                              justifyContent={'space-between'}
                              spacing={'1.25rem'}
                            >
                              <Box w={'100%'}>
                                <VStack spacing={'0.5'} w="100%">
                                  <Select
                                    value={Number(firstCategoryId)}
                                    onChange={(e) => {
                                      updateListCategory(
                                        index,
                                        'firstCategoryId',
                                        Number(e.target.value),
                                      );
                                    }}
                                    w={'100%'}
                                    h={'3.5rem'}
                                    bg={'#FFF'}
                                    borderRadius={'0.25rem'}
                                    border={'1px solid #9CADBE'}
                                  >
                                    <option value={0}>
                                      {localeText(
                                        LANGUAGES.ACC.SU.PH_BRAND_CATEGORY,
                                      )}
                                    </option>
                                    {listFirstCategory.map((item, index) => {
                                      return (
                                        <option
                                          value={item.firstCategoryId}
                                          key={index}
                                        >
                                          {item.name}
                                        </option>
                                      );
                                    })}
                                  </Select>
                                  <Select
                                    value={Number(secondCategoryId)}
                                    onChange={(e) => {
                                      updateListCategory(
                                        index,
                                        'secondCategoryId',
                                        Number(e.target.value),
                                      );
                                    }}
                                    w={'100%'}
                                    h={'3.5rem'}
                                    bg={'#FFF'}
                                    borderRadius={'0.25rem'}
                                    border={'1px solid #9CADBE'}
                                  >
                                    <option value={0}>
                                      {localeText(
                                        LANGUAGES.ACC.SU
                                          .PH_BRAND_SECONDERY_CATEGORY,
                                      )}
                                    </option>
                                    {listSecondCategory.map((item, index) => {
                                      return (
                                        <option
                                          value={item.secondCategoryId}
                                          key={index}
                                        >
                                          {item.name}
                                        </option>
                                      );
                                    })}
                                  </Select>
                                </VStack>
                              </Box>
                              {index !== 0 && (
                                <Center
                                  w={'1.5rem'}
                                  h={'1.5rem'}
                                  cursor={'pointer'}
                                  onClick={() => {
                                    removeCategoryItem(index);
                                  }}
                                >
                                  <CustomIcon name="close" color={'#7895B2'} />
                                </Center>
                              )}
                            </HStack>
                          );
                        })}
                      </VStack>
                    </Box>

                    <Box
                      w={'100%'}
                      cursor={'pointer'}
                      onClick={() => {
                        addCategory();
                      }}
                    >
                      <Text
                        color={'#556A7E'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.ACC.SU.ADD)}
                      </Text>
                    </Box>

                    <Box w={'100%'}>
                      <Text
                        color={'#A87C4E'}
                        fontSize={'0.875rem'}
                        fontWeight={400}
                        lineHeight={'1.4rem'}
                      >
                        {localeText(LANGUAGES.INFO_MSG.SEE_THE_CATEGORY)}
                      </Text>
                    </Box>
                  </VStack>
                </Box>

                {/* Brand logo */}
                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <VStack
                        spacing={'1.25rem'}
                        justifyContent={'space-between'}
                        alignItems={'flex-end'}
                      >
                        <Box w={'100%'}>
                          <TitleTextInput
                            isDisabled
                            value={brandLogoImage?.name}
                            title={localeText(LANGUAGES.ACC.SU.BRAND_LOGO)}
                            placeholder={localeText(
                              LANGUAGES.ACC.SU.PH_SELECT_FILE,
                            )}
                          />
                        </Box>
                        <Box w={'100%'} h={'3rem'}>
                          <input
                            onChange={(e) => {
                              saveImageFile(e, 'logo');
                            }}
                            style={{ display: 'none' }}
                            type="file"
                            accept="image/*"
                            ref={brandLogoInput}
                          />
                          <Button
                            onClick={() => {
                              if (brandLogoInput?.current) {
                                brandLogoInput.current.click();
                              }
                            }}
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
                              {localeText(LANGUAGES.ACC.SU.FILE_UPLOAD)}
                            </Text>
                          </Button>
                        </Box>
                      </VStack>
                    </Box>
                    <Box w={'100%'}>
                      <Text
                        color={'#A87C4E'}
                        fontSize={'0.875rem'}
                        fontWeight={400}
                        lineHeight={'1.4rem'}
                      >
                        {`${localeText(LANGUAGES.INFO_MSG.RECOMMENDED_IMAGE_SIZES)} : 250*250`}
                      </Text>
                    </Box>
                  </VStack>
                </Box>

                {/* Brand banner */}
                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <VStack
                        spacing={'1.25rem'}
                        justifyContent={'space-between'}
                        alignItems={'flex-end'}
                      >
                        <Box w={'100%'}>
                          <TitleTextInput
                            isDisabled
                            value={brandBannerImage?.name}
                            title={localeText(LANGUAGES.ACC.SU.BRAND_BANNER)}
                            placeholder={localeText(
                              LANGUAGES.ACC.SU.PH_SELECT_FILE,
                            )}
                          />
                        </Box>
                        <Box w={'100%'} h={'3rem'}>
                          <input
                            onChange={(e) => {
                              saveImageFile(e, 'banner');
                            }}
                            style={{ display: 'none' }}
                            type="file"
                            accept="image/*"
                            ref={brandBannerInput}
                          />
                          <Button
                            onClick={() => {
                              if (brandBannerInput?.current) {
                                brandBannerInput.current.click();
                              }
                            }}
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
                              {localeText(LANGUAGES.ACC.SU.FILE_UPLOAD)}
                            </Text>
                          </Button>
                        </Box>
                      </VStack>
                    </Box>
                    <Box w={'100%'}>
                      <Text
                        color={'#A87C4E'}
                        fontSize={'0.875rem'}
                        fontWeight={400}
                        lineHeight={'1.4rem'}
                      >
                        {`${localeText(LANGUAGES.INFO_MSG.RECOMMENDED_IMAGE_SIZES)} : 1920*760`}
                      </Text>
                    </Box>
                  </VStack>
                </Box>

                {/* Business license number */}
                <Box w={'100%'}>
                  <TitleTextInput
                    value={businessNum}
                    onChange={(v) => {
                      setBusinessNum(v);
                    }}
                    title={localeText(LANGUAGES.ACC.SU.BUSINESS_LICENSE_NUMBER)}
                    placeholder={localeText(
                      LANGUAGES.ACC.SU.BUSINESS_LICENSE_NUMBER,
                    )}
                  />
                </Box>

                {/* Business license */}
                <Box w={'100%'}>
                  <VStack
                    spacing={'1.25rem'}
                    justifyContent={'space-between'}
                    alignItems={'flex-end'}
                  >
                    <Box w={'100%'}>
                      <TitleTextInput
                        isDisabled
                        value={companyCertificateImage?.name}
                        title={localeText(LANGUAGES.ACC.SU.BUSINESS_LICENSE)}
                        placeholder={localeText(
                          LANGUAGES.ACC.SU.PH_SELECT_FILE,
                        )}
                      />
                    </Box>
                    <Box w={'100%'} h={'3rem'}>
                      <input
                        onChange={(e) => {
                          saveImageFile(e, 'companyCert');
                        }}
                        style={{ display: 'none' }}
                        type="file"
                        accept="image/*"
                        ref={companyCertificateInput}
                      />
                      <Button
                        onClick={() => {
                          if (companyCertificateInput?.current) {
                            companyCertificateInput.current.click();
                          }
                        }}
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
                          {localeText(LANGUAGES.ACC.SU.FILE_UPLOAD)}
                        </Text>
                      </Button>
                    </Box>
                  </VStack>
                </Box>

                {/* Business phone number */}
                <Box w={'100%'}>
                  <TitleTextInput
                    value={phone}
                    onChange={(v) => {
                      setPhone(v);
                    }}
                    title={localeText(LANGUAGES.ACC.SU.BUSINESS_PHONE_NUMBER)}
                    placeholder={localeText(LANGUAGES.ACC.PH_PHONE_NUMBER)}
                  />
                </Box>

                {/* address */}
                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <TitleTextInput
                        value={address1}
                        title={localeText(LANGUAGES.ACC.SU.BUSINESS_ADDRESS)}
                        placeholder={localeText(LANGUAGES.PH_ADDR_1)}
                        isReadOnly
                        onClick={() => {
                          setIsOpenGoogleAddr(true);
                        }}
                      />
                    </Box>
                    <Box w={'100%'}>
                      <TitleTextInput
                        value={address2}
                        onChange={(v) => {
                          setAddress2(v);
                        }}
                        placeholder={`${localeText(LANGUAGES.PH_ADDR_2)} (${localeText(LANGUAGES.ACC.SU.OPTIONAL)})`}
                      />
                    </Box>
                    <Box w={'100%'}>
                      <HStack w={'100%'} spacing={'1.25rem'}>
                        <Box w={'50%'}>
                          <TitleTextInput
                            value={userAddress.city}
                            onChange={(v) => {
                              setUserAddress({
                                ...userAddress,
                                city: v,
                              });
                            }}
                            placeholder={localeText(LANGUAGES.CITY)}
                          />
                        </Box>
                        <Box w={'50%'}>
                          <TitleTextInput
                            value={userAddress.state}
                            onChange={(v) => {
                              setUserAddress({
                                ...userAddress,
                                state: v,
                              });
                            }}
                            placeholder={localeText(LANGUAGES.STATE)}
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
                            value={userAddress.zipCode}
                            onChange={(v) => {
                              setUserAddress({
                                ...userAddress,
                                zipCode: v,
                              });
                            }}
                            placeholder={localeText(LANGUAGES.POSCAL_CODE)}
                          />
                        </Box>
                        <Box w={'50%'}>
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
                        </Box>
                      </HStack>
                    </Box>
                  </VStack>
                </Box>

                {/* Settlement accounts */}
                <Box w={'100%'}>
                  <VStack spacing={'0.25rem'}>
                    <Box w={'100%'}>
                      <Text
                        color={'#7895B2'}
                        fontSize={'1rem'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.ACC.SU.SETTLEMENT_ACCOUNTS)}
                      </Text>
                    </Box>
                    {listBank.length > 0 && (
                      <Box w={'100%'}>
                        <VStack
                          spacing={'0.75rem'}
                          justifyContent={'space-between'}
                          alignItems={'flex-end'}
                        >
                          <Select
                            value={bankName || ''}
                            onChange={(e) => {
                              setBankName(e.target.value);
                            }}
                            w={'100%'}
                            h={'3.5rem'}
                            bg={'#FFF'}
                            borderRadius={'0.25rem'}
                            border={'1px solid #9CADBE'}
                            fontSize={clampW(1, 1)}
                          >
                            <option value={''}>
                              {localeText(LANGUAGES.ACC.SU.SELECT_BANK)}
                            </option>

                            {listBank.map((item, index) => {
                              return (
                                <option value={item} key={index}>
                                  {item}
                                </option>
                              );
                            })}
                          </Select>
                          <Box w={'100%'}>
                            <TitleTextInput
                              type={'number'}
                              value={bankNumber}
                              onChange={(v) => {
                                setBankNumber(v);
                              }}
                              placeholder={localeText(
                                LANGUAGES.ACC.SU.PH_ACCOUNT_NUMBER,
                              )}
                            />
                          </Box>
                        </VStack>
                      </Box>
                    )}
                  </VStack>
                </Box>

                {/* Passbook copies */}
                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <VStack
                        spacing={'1.25rem'}
                        justifyContent={'space-between'}
                        alignItems={'flex-end'}
                      >
                        <Box w={'100%'}>
                          <TitleTextInput
                            isDisabled
                            value={accImage?.name}
                            title={localeText(LANGUAGES.ACC.SU.PASSBOOK_COPIES)}
                            placeholder={localeText(
                              LANGUAGES.ACC.SU.PH_SELECT_FILE,
                            )}
                          />
                        </Box>
                        <Box w={'100%'} h={'3.5rem'}>
                          <input
                            onChange={(e) => {
                              saveImageFile(e, 'acc');
                            }}
                            style={{ display: 'none' }}
                            type="file"
                            accept="image/*"
                            ref={accInput}
                          />
                          <Button
                            onClick={() => {
                              if (accInput?.current) {
                                accInput.current.click();
                              }
                            }}
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
                              {localeText(LANGUAGES.ACC.SU.FILE_UPLOAD)}
                            </Text>
                          </Button>
                        </Box>
                      </VStack>
                    </Box>
                  </VStack>
                </Box>

                {/* Shipping Methods */}
                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <VStack spacing={'0.25rem'}>
                        <Box w={'100%'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.ACC.SU.SHIPPING_METHODS)}
                          </Text>
                        </Box>
                        <Select
                          value={shippingMethod}
                          onChange={(e) => {
                            setShippingMethod(Number(e.target.value));
                          }}
                          w={'100%'}
                          h={'3.5rem'}
                          bg={'#FFF'}
                          borderRadius={'0.25rem'}
                          border={'1px solid #9CADBE'}
                        >
                          <option value={0}>
                            {localeText(LANGUAGES.ACC.SU.PH_SHIPPING_METHODS)}
                          </option>
                          <option value={1}>
                            {localeText(
                              LANGUAGES.COMMON.SYSTEM_CONSIGNMENT_SHIPPING,
                            )}
                          </option>
                          <option value={2}>
                            {localeText(LANGUAGES.COMMON.DIRECT_DELIVERY)}
                          </option>
                        </Select>
                      </VStack>
                    </Box>
                  </VStack>
                </Box>

                {/* Purchase minimum */}
                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <VStack spacing={'0.25rem'}>
                        <Box w={'100%'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.ACC.SU.PURCHASE_MINIMUM)}
                          </Text>
                        </Box>
                        <Input
                          h="3.5rem"
                          value={minimumOrderAmount || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            const regex = /^\d*\.?\d{0,2}$/;
                            if (regex.test(value)) {
                              setMinimumOrderAmount(value);
                            }
                          }}
                          _readOnly={{
                            _placeholder: {
                              color: '#A7C3D2',
                            },
                          }}
                          minW={'auto'}
                          w={'100%'}
                          color={'#485766'}
                          border={'1px solid #9CADBE'}
                          px={'1rem'}
                          py={'0.75rem'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        />
                      </VStack>
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            </Box>

            <Divider borderTop={'1px solid #73829D'} boxSizing={'border-box'} />

            <Box w={'100%'}>
              <VStack spacing={'0.75rem'}>
                <Box w={'100%'}>
                  <HStack justifyContent={'space-between'}>
                    <Box>
                      <Text
                        color={'#485766'}
                        fontSize={'1.125rem'}
                        fontWeight={500}
                        lineHeight={'1.96875rem'}
                      >
                        {localeText(LANGUAGES.ACC.SU.BRAND_DESCRIPTION)}
                      </Text>
                    </Box>
                    {/*
                    <Box
                      w={'max-content'}
                      borderBottom={'1px solid #556A7E'}
                      cursor={'pointer'}
                      onClick={() => {
                        onOpenPreview();
                      }}
                    >
                      <Text
                        color={'#485766'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.ACC.SU.PREVIEW)}
                      </Text>
                    </Box>
                    */}
                  </HStack>
                </Box>
                <Box w={'100%'}>
                  <CustomEditor info={info} setInfo={setInfo} />
                </Box>
              </VStack>
            </Box>
          </VStack>

          <ContentBR h={'3.75rem'} />

          <Box w={'100%'}>
            <Button
              onClick={handleSignUp}
              // isDisabled={!isVerificationChecked}
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
                  <Text
                    color={'#485766'}
                    fontSize={'1.125rem'}
                    fontWeight={400}
                    lineHeight={'1.96875rem'}
                  >
                    {localeText(LANGUAGES.ACC.SU.ACCOUNT_INFOMATION)}
                  </Text>
                </Box>

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
              </VStack>
            </Box>

            <Divider borderTop={'1px solid #73829D'} boxSizing={'border-box'} />

            <Box w={'100%'}>
              <VStack spacing={'1.25rem'}>
                <Box w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'1.125rem'}
                    fontWeight={400}
                    lineHeight={'1.96875rem'}
                  >
                    {localeText(LANGUAGES.ACC.SU.SELLER_INFOMATION)}
                  </Text>
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
                    value={brandName}
                    onChange={(v) => {
                      setBrandName(v);
                    }}
                    title={localeText(LANGUAGES.ACC.SU.BRAND_NAME)}
                    placeholder={localeText(LANGUAGES.ACC.SU.PH_BRAND_NAME)}
                  />
                </Box>

                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <VStack spacing={'0.25rem'}>
                        <Box w={'100%'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.ACC.SU.BRAND_CATEGORY)}
                          </Text>
                        </Box>
                      </VStack>
                    </Box>

                    <Box w={'100%'}>
                      <VStack w="100%">
                        {listCategory.map((item, index) => {
                          const firstCategoryId = item.firstCategoryId;
                          const secondCategoryId = item.secondCategoryId;
                          const listSecondCategory =
                            item?.listSecondCategory || [];
                          return (
                            <HStack
                              w="100%"
                              key={index}
                              justifyContent={'space-between'}
                              spacing={'1.25rem'}
                            >
                              <Box w={'100%'}>
                                <VStack spacing={'0.5'} w="100%">
                                  <Select
                                    value={Number(firstCategoryId)}
                                    onChange={(e) => {
                                      updateListCategory(
                                        index,
                                        'firstCategoryId',
                                        Number(e.target.value),
                                      );
                                    }}
                                    w={'100%'}
                                    h={'3.5rem'}
                                    bg={'#FFF'}
                                    borderRadius={'0.25rem'}
                                    border={'1px solid #9CADBE'}
                                  >
                                    <option value={0}>
                                      {localeText(
                                        LANGUAGES.ACC.SU.PH_BRAND_CATEGORY,
                                      )}
                                    </option>
                                    {listFirstCategory.map((item, index) => {
                                      return (
                                        <option
                                          value={item.firstCategoryId}
                                          key={index}
                                        >
                                          {item.name}
                                        </option>
                                      );
                                    })}
                                  </Select>
                                  <Select
                                    value={Number(secondCategoryId)}
                                    onChange={(e) => {
                                      updateListCategory(
                                        index,
                                        'secondCategoryId',
                                        Number(e.target.value),
                                      );
                                    }}
                                    w={'100%'}
                                    h={'3.5rem'}
                                    bg={'#FFF'}
                                    borderRadius={'0.25rem'}
                                    border={'1px solid #9CADBE'}
                                  >
                                    <option value={0}>
                                      {localeText(
                                        LANGUAGES.ACC.SU
                                          .PH_BRAND_SECONDERY_CATEGORY,
                                      )}
                                    </option>
                                    {listSecondCategory.map((item, index) => {
                                      return (
                                        <option
                                          value={item.secondCategoryId}
                                          key={index}
                                        >
                                          {item.name}
                                        </option>
                                      );
                                    })}
                                  </Select>
                                </VStack>
                              </Box>
                              {index !== 0 && (
                                <Center
                                  w={'1.5rem'}
                                  h={'1.5rem'}
                                  cursor={'pointer'}
                                  onClick={() => {
                                    removeCategoryItem(index);
                                  }}
                                >
                                  <CustomIcon name="close" color={'#7895B2'} />
                                </Center>
                              )}
                            </HStack>
                          );
                        })}
                      </VStack>
                    </Box>

                    <Box
                      w={'100%'}
                      cursor={'pointer'}
                      onClick={() => {
                        addCategory();
                      }}
                    >
                      <Text
                        color={'#556A7E'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.ACC.SU.ADD)}
                      </Text>
                    </Box>

                    <Box w={'100%'}>
                      <Text
                        color={'#A87C4E'}
                        fontSize={'0.875rem'}
                        fontWeight={400}
                        lineHeight={'1.4rem'}
                      >
                        {localeText(LANGUAGES.INFO_MSG.SEE_THE_CATEGORY)}
                      </Text>
                    </Box>
                  </VStack>
                </Box>

                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <HStack
                        spacing={'1.25rem'}
                        justifyContent={'space-between'}
                        alignItems={'flex-end'}
                      >
                        <Box w={'30.375rem'}>
                          <TitleTextInput
                            isDisabled
                            value={brandLogoImage?.name}
                            title={localeText(LANGUAGES.ACC.SU.BRAND_LOGO)}
                            placeholder={localeText(
                              LANGUAGES.ACC.SU.PH_SELECT_FILE,
                            )}
                          />
                        </Box>
                        <Box w={'8.375rem'} minW={'8rem'} h={'3.5rem'}>
                          <input
                            onChange={(e) => {
                              saveImageFile(e, 'logo');
                            }}
                            style={{ display: 'none' }}
                            type="file"
                            accept="image/*"
                            ref={brandLogoInput}
                          />
                          <Button
                            onClick={() => {
                              if (brandLogoInput?.current) {
                                brandLogoInput.current.click();
                              }
                            }}
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
                              {localeText(LANGUAGES.ACC.SU.FILE_UPLOAD)}
                            </Text>
                          </Button>
                        </Box>
                      </HStack>
                    </Box>
                    <Box w={'100%'}>
                      <Text
                        color={'#A87C4E'}
                        fontSize={'0.875rem'}
                        fontWeight={400}
                        lineHeight={'1.4rem'}
                      >
                        {`${localeText(LANGUAGES.INFO_MSG.RECOMMENDED_IMAGE_SIZES)} : 250*250`}
                      </Text>
                    </Box>
                  </VStack>
                </Box>

                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <HStack
                        spacing={'1.25rem'}
                        justifyContent={'space-between'}
                        alignItems={'flex-end'}
                      >
                        <Box w={'30.375rem'}>
                          <TitleTextInput
                            isDisabled
                            value={brandBannerImage?.name}
                            title={localeText(LANGUAGES.ACC.SU.BRAND_BANNER)}
                            placeholder={localeText(
                              LANGUAGES.ACC.SU.PH_SELECT_FILE,
                            )}
                          />
                        </Box>
                        <Box w={'8.375rem'} minW={'8rem'} h={'3.5rem'}>
                          <input
                            onChange={(e) => {
                              saveImageFile(e, 'banner');
                            }}
                            style={{ display: 'none' }}
                            type="file"
                            accept="image/*"
                            ref={brandBannerInput}
                          />
                          <Button
                            onClick={() => {
                              if (brandBannerInput?.current) {
                                brandBannerInput.current.click();
                              }
                            }}
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
                              {localeText(LANGUAGES.ACC.SU.FILE_UPLOAD)}
                            </Text>
                          </Button>
                        </Box>
                      </HStack>
                    </Box>
                    <Box w={'100%'}>
                      <Text
                        color={'#A87C4E'}
                        fontSize={'0.875rem'}
                        fontWeight={400}
                        lineHeight={'1.4rem'}
                      >
                        {`${localeText(LANGUAGES.INFO_MSG.RECOMMENDED_IMAGE_SIZES)} : 1920*760`}
                      </Text>
                    </Box>
                  </VStack>
                </Box>

                <Box w={'100%'}>
                  <TitleTextInput
                    value={businessNum}
                    onChange={(v) => {
                      setBusinessNum(v);
                    }}
                    title={localeText(LANGUAGES.ACC.SU.BUSINESS_LICENSE_NUMBER)}
                    placeholder={localeText(
                      LANGUAGES.ACC.SU.BUSINESS_LICENSE_NUMBER,
                    )}
                  />
                </Box>

                <Box w={'100%'}>
                  <HStack
                    spacing={'1.25rem'}
                    justifyContent={'space-between'}
                    alignItems={'flex-end'}
                  >
                    <Box w={'30.375rem'}>
                      <TitleTextInput
                        isDisabled
                        value={companyCertificateImage?.name}
                        title={localeText(LANGUAGES.ACC.SU.BUSINESS_LICENSE)}
                        placeholder={localeText(
                          LANGUAGES.ACC.SU.PH_SELECT_FILE,
                        )}
                      />
                    </Box>
                    <Box w={'8.375rem'} minW={'8rem'} h={'3.5rem'}>
                      <input
                        onChange={(e) => {
                          saveImageFile(e, 'companyCert');
                        }}
                        style={{ display: 'none' }}
                        type="file"
                        accept="image/*"
                        ref={companyCertificateInput}
                      />
                      <Button
                        onClick={() => {
                          if (companyCertificateInput?.current) {
                            companyCertificateInput.current.click();
                          }
                        }}
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
                          {localeText(LANGUAGES.ACC.SU.FILE_UPLOAD)}
                        </Text>
                      </Button>
                    </Box>
                  </HStack>
                </Box>

                <Box w={'100%'}>
                  <TitleTextInput
                    value={phone}
                    onChange={(v) => {
                      setPhone(v);
                    }}
                    title={localeText(LANGUAGES.ACC.SU.BUSINESS_PHONE_NUMBER)}
                    placeholder={localeText(LANGUAGES.ACC.PH_PHONE_NUMBER)}
                  />
                </Box>

                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <TitleTextInput
                        value={address1}
                        title={localeText(LANGUAGES.ACC.SU.BUSINESS_ADDRESS)}
                        placeholder={localeText(LANGUAGES.PH_ADDR_1)}
                        isReadOnly
                        onClick={() => {
                          setIsOpenGoogleAddr(true);
                        }}
                      />
                    </Box>
                    <Box w={'100%'}>
                      <TitleTextInput
                        value={address2}
                        onChange={(v) => {
                          setAddress2(v);
                        }}
                        placeholder={`${localeText(LANGUAGES.PH_ADDR_2)} (${localeText(LANGUAGES.ACC.SU.OPTIONAL)})`}
                      />
                    </Box>
                    <Box w={'100%'}>
                      <HStack w={'100%'} spacing={'1.25rem'}>
                        <Box w={'50%'}>
                          <TitleTextInput
                            value={userAddress.city}
                            onChange={(v) => {
                              setUserAddress({
                                ...userAddress,
                                city: v,
                              });
                            }}
                            placeholder={localeText(LANGUAGES.CITY)}
                          />
                        </Box>
                        <Box w={'50%'}>
                          <TitleTextInput
                            value={userAddress.state}
                            onChange={(v) => {
                              setUserAddress({
                                ...userAddress,
                                state: v,
                              });
                            }}
                            placeholder={localeText(LANGUAGES.STATE)}
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
                            value={userAddress.zipCode}
                            onChange={(v) => {
                              setUserAddress({
                                ...userAddress,
                                zipCode: v,
                              });
                            }}
                            placeholder={localeText(LANGUAGES.POSCAL_CODE)}
                          />
                        </Box>
                        <Box w={'50%'}>
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
                        </Box>
                      </HStack>
                    </Box>
                  </VStack>
                </Box>

                <Box w={'100%'}>
                  <VStack spacing={'0.25rem'}>
                    <Box w={'100%'}>
                      <Text
                        color={'#7895B2'}
                        fontSize={'1rem'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.ACC.SU.SETTLEMENT_ACCOUNTS)}
                      </Text>
                    </Box>
                    {listBank.length > 0 && (
                      <Box w={'100%'}>
                        <HStack
                          spacing={'0.75rem'}
                          justifyContent={'space-between'}
                          alignItems={'flex-end'}
                        >
                          <Box w={'12.0625rem'} minW={'8rem'} h={'3.5rem'}>
                            <Select
                              value={bankName || ''}
                              onChange={(e) => {
                                setBankName(e.target.value);
                              }}
                              w={'100%'}
                              h={'3.5rem'}
                              bg={'#FFF'}
                              borderRadius={'0.25rem'}
                              border={'1px solid #9CADBE'}
                              fontSize={clampW(1, 1)}
                            >
                              <option value={''}>
                                {localeText(LANGUAGES.ACC.SU.SELECT_BANK)}
                              </option>

                              {listBank.map((item, index) => {
                                return (
                                  <option value={item} key={index}>
                                    {item}
                                  </option>
                                );
                              })}
                            </Select>
                          </Box>
                          <Box w={'30.375rem'}>
                            <TitleTextInput
                              type={'number'}
                              value={bankNumber}
                              onChange={(v) => {
                                setBankNumber(v);
                              }}
                              placeholder={localeText(
                                LANGUAGES.ACC.SU.PH_ACCOUNT_NUMBER,
                              )}
                            />
                          </Box>
                        </HStack>
                      </Box>
                    )}
                  </VStack>
                </Box>

                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <HStack
                        spacing={'1.25rem'}
                        justifyContent={'space-between'}
                        alignItems={'flex-end'}
                      >
                        <Box w={'30.375rem'}>
                          <TitleTextInput
                            isDisabled
                            value={accImage?.name}
                            title={localeText(LANGUAGES.ACC.SU.PASSBOOK_COPIES)}
                            placeholder={localeText(
                              LANGUAGES.ACC.SU.PH_SELECT_FILE,
                            )}
                          />
                        </Box>
                        <Box w={'8.375rem'} minW={'8rem'} h={'3.5rem'}>
                          <input
                            onChange={(e) => {
                              saveImageFile(e, 'acc');
                            }}
                            style={{ display: 'none' }}
                            type="file"
                            accept="image/*"
                            ref={accInput}
                          />
                          <Button
                            onClick={() => {
                              if (accInput?.current) {
                                accInput.current.click();
                              }
                            }}
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
                              {localeText(LANGUAGES.ACC.SU.FILE_UPLOAD)}
                            </Text>
                          </Button>
                        </Box>
                      </HStack>
                    </Box>
                  </VStack>
                </Box>

                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <VStack spacing={'0.25rem'}>
                        <Box w={'100%'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.ACC.SU.SHIPPING_METHODS)}
                          </Text>
                        </Box>
                        <Select
                          value={shippingMethod}
                          onChange={(e) => {
                            setShippingMethod(Number(e.target.value));
                          }}
                          w={'100%'}
                          h={'3.5rem'}
                          bg={'#FFF'}
                          borderRadius={'0.25rem'}
                          border={'1px solid #9CADBE'}
                        >
                          <option value={0}>
                            {localeText(LANGUAGES.ACC.SU.PH_SHIPPING_METHODS)}
                          </option>
                          <option value={1}>
                            {localeText(
                              LANGUAGES.COMMON.SYSTEM_CONSIGNMENT_SHIPPING,
                            )}
                          </option>
                          <option value={2}>
                            {localeText(LANGUAGES.COMMON.DIRECT_DELIVERY)}
                          </option>
                        </Select>
                      </VStack>
                    </Box>
                  </VStack>
                </Box>

                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <VStack spacing={'0.25rem'}>
                        <Box w={'100%'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.ACC.SU.PURCHASE_MINIMUM)}
                          </Text>
                        </Box>
                        <Input
                          h="3.5rem"
                          value={minimumOrderAmount || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            const regex = /^\d*\.?\d{0,2}$/;
                            if (regex.test(value)) {
                              setMinimumOrderAmount(value);
                            }
                          }}
                          _readOnly={{
                            _placeholder: {
                              color: '#A7C3D2',
                            },
                          }}
                          minW={'auto'}
                          w={'100%'}
                          color={'#485766'}
                          border={'1px solid #9CADBE'}
                          px={'1rem'}
                          py={'0.75rem'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        />
                      </VStack>
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            </Box>

            <Divider borderTop={'1px solid #73829D'} boxSizing={'border-box'} />

            <Box w={'100%'}>
              <VStack spacing={'0.75rem'}>
                <Box w={'100%'}>
                  <HStack justifyContent={'space-between'}>
                    <Box>
                      <Text
                        color={'#485766'}
                        fontSize={'1.125rem'}
                        fontWeight={500}
                        lineHeight={'1.96875rem'}
                      >
                        {localeText(LANGUAGES.ACC.SU.BRAND_DESCRIPTION)}
                      </Text>
                    </Box>

                    <Box
                      w={'max-content'}
                      borderBottom={'1px solid #556A7E'}
                      cursor={'pointer'}
                      onClick={() => {
                        onOpenPreview();
                      }}
                    >
                      <Text
                        color={'#485766'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.ACC.SU.PREVIEW)}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
                <Box w={'100%'}>
                  <CustomEditor info={info} setInfo={setInfo} />
                </Box>
              </VStack>
            </Box>
          </VStack>

          <ContentBR h={'3.75rem'} />

          <Box w={'100%'}>
            <Button
              onClick={handleSignUp}
              // isDisabled={!isVerificationChecked}
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
                  textAlign={'center'}
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
      ) : (
        <>
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

  const preveiwModal = () => {
    return (
      <Modal
        isOpen={isOpenPreview}
        onClose={onClosePreview}
        size="sx"
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          alignSelf="center"
          w={'60rem'}
          h={'52rem'}
          borderRadius={0}
          py={0}
          px={'2.5rem'}
        >
          <ModalHeader pt={'1.5rem'} pb={'1.5rem'} px={0}>
            <HStack justifyContent={'space-between'}>
              <Box>
                <Text>{localeText(LANGUAGES.ACC.SU.PREVIEW)}</Text>
              </Box>
              <Box>{/* <Img src={}> */}</Box>
            </HStack>
          </ModalHeader>

          <ModalBody
            className={'no-scroll'}
            w={'100%'}
            h={'100%'}
            position={'relative'}
            py={0}
            px={0}
            overflowY={'auto'}
          >
            <QuillViewer html={info} />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };
  return isMobile(true) ? (
    <Box w={'100%'}>
      {SignUpFormTitle()}
      <ContentBR h={'3.75rem'} />
      <Box w={'100%'} px={clampW(1, 5)}>
        {SignUpForm()}
      </Box>
      {preveiwModal()}
    </Box>
  ) : (
    <Box w={'40rem'}>
      {SignUpFormTitle()}
      <ContentBR h={'3.75rem'} />
      <Box w={'100%'}>{SignUpForm()}</Box>
      {preveiwModal()}
    </Box>
  );
};

export default SignUpPage;
