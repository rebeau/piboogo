'use client';

import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import { COUNTRY, COUNTRY_LIST, LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import {
  Box,
  Button,
  Center,
  HStack,
  Image as ChakraImage,
  Text,
  VStack,
  Select,
  Divider,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import { CustomIcon } from '@/components';
import PasswordModal from '@/components/alert/custom/PasswordModal';
import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import MainContainer from '@/components/layout/MainContainer';
import sellerUserApi from '@/services/sellerUserApi';
import { SUCCESS } from '@/constants/errorCode';
import utils from '@/utils';
import { BANK_LIST_KR, BANK_LIST_US } from '@/constants/common';
import useDevice from '@/hooks/useDevice';
import ContentBR from '@/components/custom/ContentBR';
import useModal from '@/hooks/useModal';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  isOpenGoogleAddrState,
  selectedGoogleAddrState,
} from '@/stores/googleAddrRecoil';
const CustomEditor = dynamic(() => import('@/components/input/CustomEditor'), {
  ssr: false,
});

const MyInfoPage = () => {
  const { isMobile, clampW } = useDevice();
  const { openModal } = useModal();

  const brandLogoInput = useRef(null);
  const brandBannerInput = useRef(null);
  const companyCertificateInput = useRef(null);
  const accInput = useRef(null);

  const [brandLogoImage, setBrandLogoImage] = useState(null);
  const [brandBannerImage, setBrandBannerImage] = useState(null);
  const [companyCertificateImage, setCompanyCertificateImage] = useState(null);
  const [accImage, setAccImage] = useState(null);

  const { lang, localeText } = useLocale();

  const [prevUserInfo, setPrevUserInfo] = useState({});
  const [prevUserAddress, setPrevUserAddress] = useState({});

  const [userInfo, setUserInfo] = useState({});
  const [userAddress, setUserAddress] = useState({});

  const [addressType, setAddressType] = useState(1); // 국내, 해외
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [country, setCountry] = useState('');

  const [listBank, setListBank] = useState([]);

  const setIsOpenGoogleAddr = useSetRecoilState(isOpenGoogleAddrState);
  const selectedAddress = useRecoilValue(selectedGoogleAddrState);

  const {
    isOpen: isOpenPassword,
    onOpen: onOpenPassword,
    onClose: onClosePassword,
  } = useDisclosure();

  useEffect(() => {
    console.log('selectedAddress', selectedAddress);
    if (selectedAddress) {
      setUserInfo({
        ...userInfo,
        bankName: '',
      });
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

  useEffect(() => {
    setUserInfo({
      ...userInfo,
      bankName: '',
    });
    if (country === COUNTRY.COUNTRY_INFO.KR.CODE) {
      setAddressType(1);
      setListBank(BANK_LIST_KR);
    } else {
      setAddressType(2);
      setListBank(BANK_LIST_US);
    }
  }, [country]);

  useEffect(() => {
    handleGetMyInfo();
  }, []);

  const handleGetMyInfo = async () => {
    const result = await sellerUserApi.getSellerMyInfo();
    if (result?.errorCode === SUCCESS) {
      let userInfo = { ...result.data };
      userInfo.purchaseMinimum =
        utils.getIndexByAmount(userInfo.minimumOrderAmount) || 1;
      const userAddr = result.data.rsGetUserAddressDTO;
      delete userInfo.rsGetUserAddressDTO;

      setUserInfo(userInfo);
      setPrevUserInfo(userInfo);
      setUserAddress(userAddr);
      setPrevUserAddress(userAddr);
      if (userAddr?.roadNameMainAddr) {
        setCountry(COUNTRY.COUNTRY_INFO.KR.CODE);
        setAddress1(userAddr?.roadNameMainAddr);
        if (userAddr?.subAddr) {
          setAddress2(userAddr.subAddr);
        }
      } else {
        setCountry(COUNTRY.COUNTRY_INFO.US.CODE);
        setAddress1(userAddr?.addressLineOne);
        if (userAddr?.addressLineTwo) {
          setAddress2(userAddr.addressLineTwo);
        }
      }
    }
  };

  const saveImageFile = (e, target) => {
    const file = e.target.files[0];
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = (data) => {
        if (typeof data.target?.result === 'string') {
          const srcData = data.target.result;
          if (target === 'logo') {
            setBrandLogoImage(file);
            setUserInfo({
              ...userInfo,
              brandLogoS3Url: srcData,
              brandLogoOriginalName: file.name,
            });
          } else if (target === 'banner') {
            setBrandBannerImage(file);
            setUserInfo({
              ...userInfo,
              brandBannerS3Url: srcData,
              brandBannerOriginalName: file.name,
            });
          } else if (target === 'companyCert') {
            setCompanyCertificateImage(file);
            setUserInfo({
              ...userInfo,
              companyCertificateS3Url: srcData,
              companyCertificateOriginalName: file.name,
            });
          } else if (target === 'acc') {
            setAccImage(file);
            setUserInfo({
              ...userInfo,
              accImageS3Url: srcData,
              accImageOriginalName: file.name,
            });
          }
        } else {
          console.log('## image upload Failed');
        }
      };
    } catch (e) {
      console.log('## image upload Failed', e);
    }
  };

  const handleSave = useCallback(async () => {
    if (!userInfo.companyPhone) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_PHONE),
      });
    }
    if (!utils.checkPhoneNum(userInfo.companyPhone)) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_MATCH_PHONE),
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

    if (Number(userInfo.shippingMethod) === 0) {
      return openModal({
        text: localeText(LANGUAGES.INFO_MSG.SELECT_SHIPPING_METHOD),
      });
    }
    if (Number(userInfo.purchaseMinimum) === 0) {
      return openModal({
        text: localeText(LANGUAGES.INFO_MSG.SELECT_MINIMUM_PURCHASE),
      });
    }

    // 이미지 체크
    if (!userInfo?.brandBannerS3Url) {
      return openModal({
        text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_BRAND_BANNER),
      });
    }
    if (!userInfo?.brandLogoS3Url) {
      return openModal({
        text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_BRAND_LOGO),
      });
    }
    if (!userInfo?.companyCertificateS3Url) {
      return openModal({
        text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_COMPANY_CERT),
      });
    }
    if (!userInfo?.accImageS3Url) {
      return openModal({
        text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_BANK_ACCOUNT),
      });
    }

    const temp = { ...userAddress };
    temp.addressType = addressType;
    if (temp.addressType === 1) {
      temp.roadNameMainAddr = address1;
      if (address2) {
        temp.subAddr = address2;
      }
      temp.addressLineOne = null;
      temp.addressLineTwo = null;
    } else {
      temp.addressLineOne = address1;
      if (address2) {
        temp.addressLineTwo = address2;
      }
      temp.roadNameMainAddr = null;
      temp.landNumberMainAddr = null;
      temp.subAddr = null;
    }
    let diffInfo = utils.diffObjects(prevUserInfo, userInfo);
    let diifAddr = utils.diffObjects(prevUserAddress, temp);

    // 순수 데이터 체크
    if (utils.isEmpty(diffInfo) && utils.isEmpty(diifAddr)) {
      openModal({ text: localeText(LANGUAGES.INFO_MSG.NO_CHANGE) });
      return;
    }

    const param = {};
    if (diffInfo?.companyPhone) {
      param.companyPhone = diffInfo.companyPhone;
    }
    if (diffInfo?.bankName) {
      param.bankName = diffInfo.bankName;
    }
    if (diffInfo?.bankNumber) {
      param.bankNumber = diffInfo.bankNumber;
    }
    if (diffInfo?.defaultShipping) {
      param.defaultShipping = diffInfo.defaultShipping;
    }
    if (diffInfo?.minimumOrderAmount) {
      param.minimumOrderAmount = diffInfo.minimumOrderAmount;
    }
    if (diffInfo?.info) {
      param.info = diffInfo.info;
    }
    param.rqModifyUserAddressDTO = {};
    if (diifAddr?.addressType) {
      param.rqModifyUserAddressDTO.addressType = diifAddr.addressType;
    }
    if (diifAddr?.zipCode) {
      param.rqModifyUserAddressDTO.zipCode = diifAddr.zipCode;
    }
    if (diifAddr?.roadNameMainAddr) {
      param.rqModifyUserAddressDTO.roadNameMainAddr = diifAddr.roadNameMainAddr;
    }
    if (diifAddr?.landNumberMainAddr) {
      param.rqModifyUserAddressDTO.landNumberMainAddr =
        diifAddr.landNumberMainAddr;
    }
    if (diifAddr?.subAddr) {
      param.rqModifyUserAddressDTO.subAddr = diifAddr.subAddr;
    }
    if (diifAddr?.state) {
      param.rqModifyUserAddressDTO.state = diifAddr.state;
    }
    if (diifAddr?.city) {
      param.rqModifyUserAddressDTO.city = diifAddr.city;
    }
    if (diifAddr?.addressLineOne) {
      param.rqModifyUserAddressDTO.addressLineOne = diifAddr.addressLineOne;
    }
    if (diifAddr?.addressLineTwo) {
      param.rqModifyUserAddressDTO.addressLineTwo = diifAddr.addressLineTwo;
    }

    const result = await sellerUserApi.patchSeller(
      param,
      brandLogoImage,
      brandBannerImage,
      companyCertificateImage,
      accImage,
    );
    if (result?.errorCode === SUCCESS) {
      handleGetMyInfo();
      setTimeout(() => {
        openModal({ text: result.message });
      });
    }
  });

  return isMobile(true) ? (
    <MainContainer>
      <Box w={'100%'}>
        <VStack spacing={'2.5rem'} px={clampW(1, 5)}>
          <Box w={'100%'}>
            <VStack spacing={'1.25rem'} justifyContent={'flex-start'}>
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-end'}
                >
                  <Box h={'1.5rem'} alignContent={'center'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.EMAIL)}
                    </Text>
                  </Box>
                  <Box h={'1.5rem'}>
                    <Text
                      color={'#556A7E'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {userInfo.id}
                    </Text>
                  </Box>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-end'}
                >
                  <Box h={'1.5rem'} alignContent={'center'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.PASSWORD)}
                    </Text>
                  </Box>
                  <Box h={'1.5rem'}>
                    <HStack>
                      <Box
                        borderBottom={'1px solid #66809C'}
                        cursor={'pointer'}
                        onClick={() => {
                          onOpenPassword();
                        }}
                      >
                        <Text
                          color={'#556A7E'}
                          fontSize={'1rem'}
                          fontWeight={500}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.MY_PAGE.CHANGE_PASSWORD)}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                </HStack>
              </Box>
            </VStack>
          </Box>

          <Divider borderTop={'1px solid #73829D'} boxSizing={'border-box'} />

          <Box w={'100%'}>
            <VStack spacing={'2rem'}>
              {/* Business name */}
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-end'}
                >
                  <Box h={'1.5rem'} alignContent={'center'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.BUSINESS_NAME)}
                    </Text>
                  </Box>
                  <Box h={'1.5rem'} alignContent={'center'}>
                    <Text
                      color={'#556A7E'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {userInfo.companyName}
                    </Text>
                  </Box>
                </HStack>
              </Box>

              {/* Business logo */}
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-start'}
                >
                  <Box h={'1.5rem'} alignContent={'center'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.BRAND_BANNER)}
                    </Text>
                  </Box>
                  <Box>
                    <HStack
                      spacing={'0.75rem'}
                      justifyContent={'space-between'}
                      alignItems={'flex-end'}
                    >
                      <Box w={'100%'}>
                        <VStack>
                          {userInfo?.brandBannerOriginalName && (
                            <Box w={'100%'} alignItems={'flex-end'}>
                              <Center w={'5rem'} h={'5rem'}>
                                <ChakraImage
                                  fallback={<DefaultSkeleton />}
                                  w={'100%'}
                                  h={'100%'}
                                  src={userInfo?.brandBannerS3Url}
                                />
                              </Center>
                              <Box>
                                <HStack
                                  justifyContent={'flex-start'}
                                  alignItems={'flex-end'}
                                >
                                  <Text
                                    color={'#556A7E'}
                                    fontSize={'0.9375rem'}
                                    fontWeight={400}
                                    lineHeight={'1.5rem'}
                                  >
                                    {userInfo?.brandBannerOriginalName}
                                  </Text>
                                  <Box
                                    w={'1.25rem'}
                                    h={'1.25rem'}
                                    cursor={'pointer'}
                                    onClick={() => {
                                      setUserInfo({
                                        ...userInfo,
                                        brandBannerS3Url: null,
                                        brandBannerOriginalName: null,
                                      });
                                      setBrandBannerImage(null);
                                      if (brandBannerInput?.current) {
                                        brandBannerInput.current.value = null;
                                      }
                                    }}
                                  >
                                    <CustomIcon
                                      w={'100%'}
                                      h={'100%'}
                                      name={'close'}
                                      color={'#7895B2'}
                                    />
                                  </Box>
                                </HStack>
                              </Box>
                            </Box>
                          )}
                        </VStack>
                      </Box>
                    </HStack>
                  </Box>
                </HStack>

                <ContentBR h={'0.75rem'} />

                <HStack>
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
                    <Input
                      readOnly
                      placeholder={localeText(LANGUAGES.ACC.SU.PH_SELECT_FILE)}
                      _readOnly={{
                        _placeholder: {
                          color: '#A7C3D2',
                        },
                      }}
                      onClick={() => {
                        if (brandBannerInput?.current) {
                          brandBannerInput.current.click();
                        }
                      }}
                      minW={'auto'}
                      w={'100%'}
                      h={'100%'}
                      color={'#485766'}
                      border={'1px solid #9CADBE'}
                      px={'1rem'}
                      py={'0.75rem'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                      value={''}
                    />
                  </Box>
                  <Box w={'8rem'} minW={'8rem'} h={'3rem'}>
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

              {/* Brand name */}
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-end'}
                >
                  <Box h={'1.5rem'} alignContent={'center'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.BRAND_NAME)}
                    </Text>
                  </Box>
                  <Box h={'1.5rem'} alignContent={'center'}>
                    <Text
                      color={'#556A7E'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {userInfo?.brandName || ''}
                    </Text>
                  </Box>
                </HStack>
              </Box>

              {/* Brand logo */}
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-start'}
                >
                  <Box h={'1.5rem'} alignContent={'center'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.BRAND_LOGO)}
                    </Text>
                  </Box>
                  <Box>
                    {userInfo?.brandLogoOriginalName && (
                      <VStack
                        w={'100%'}
                        alignItems={'flex-end'}
                        spacing={'0.25rem'}
                      >
                        <Center w={'5rem'} h={'5rem'}>
                          <ChakraImage
                            fallback={<DefaultSkeleton />}
                            w={'100%'}
                            h={'100%'}
                            src={userInfo?.brandLogoS3Url}
                            objectFit={'cover'}
                          />
                        </Center>

                        <Box>
                          <HStack
                            justifyContent={'flex-start'}
                            alignItems={'flex-end'}
                          >
                            <Text
                              color={'#556A7E'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                            >
                              {userInfo?.brandLogoOriginalName}
                            </Text>
                            <Box
                              w={'1.25rem'}
                              h={'1.25rem'}
                              cursor={'pointer'}
                              onClick={() => {
                                setUserInfo({
                                  ...userInfo,
                                  brandLogoS3Url: null,
                                  brandLogoOriginalName: null,
                                });
                                setBrandLogoImage(null);
                                if (brandLogoInput?.current) {
                                  brandLogoInput.current.value = null;
                                }
                              }}
                            >
                              <CustomIcon
                                w={'100%'}
                                h={'100%'}
                                name={'close'}
                                color={'#7895B2'}
                              />
                            </Box>
                          </HStack>
                        </Box>
                      </VStack>
                    )}
                  </Box>
                </HStack>

                <ContentBR h={'0.75rem'} />

                <HStack>
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
                    <Input
                      readOnly
                      onClick={() => {
                        if (brandLogoInput?.current) {
                          brandLogoInput.current.click();
                        }
                      }}
                      _readOnly={{
                        _placeholder: {
                          color: '#A7C3D2',
                        },
                      }}
                      minW={'auto'}
                      w={'100%'}
                      h={'100%'}
                      color={'#485766'}
                      border={'1px solid #9CADBE'}
                      px={'1rem'}
                      py={'0.75rem'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                      value={''}
                    />
                  </Box>
                  <Box w={'8rem'} minW={'8rem'} h={'3rem'}>
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

              {/* Business license number */}
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-start'}
                >
                  <Box
                    w={'12.5rem'}
                    minW={'12.5rem'}
                    h={'1.5rem'}
                    alignContent={'center'}
                  >
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.BUSINESS_LICENSE_NUMBER)}
                    </Text>
                  </Box>
                  <Box h={'1.5rem'} alignContent={'center'}>
                    <Text
                      color={'#556A7E'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {utils.parseBusinessNum(userInfo?.companyNumber)}
                    </Text>
                  </Box>
                </HStack>
              </Box>

              {/* Business license */}
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-start'}
                >
                  <Box h={'1.5rem'} alignContent={'center'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.BUSINESS_LICENSE)}
                    </Text>
                  </Box>
                  <Box>
                    {userInfo?.companyCertificateOriginalName && (
                      <Box w={'100%'}>
                        <HStack
                          justifyContent={'flex-start'}
                          alignItems={'flex-end'}
                        >
                          <Text
                            color={'#556A7E'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {userInfo?.companyCertificateOriginalName}
                          </Text>
                          <Box
                            w={'1.25rem'}
                            h={'1.25rem'}
                            cursor={'pointer'}
                            onClick={() => {
                              setUserInfo({
                                ...userInfo,
                                companyCertificateS3Url: null,
                                companyCertificateOriginalName: null,
                              });
                              setCompanyCertificateImage(null);
                              if (companyCertificateInput?.current) {
                                companyCertificateInput.current.value = null;
                              }
                            }}
                          >
                            <CustomIcon
                              w={'100%'}
                              h={'100%'}
                              name={'close'}
                              color={'#7895B2'}
                            />
                          </Box>
                        </HStack>
                      </Box>
                    )}
                  </Box>
                </HStack>

                <ContentBR h={'0.75rem'} />

                <HStack>
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
                    <Input
                      readOnly
                      onClick={() => {
                        if (companyCertificateInput?.current) {
                          companyCertificateInput.current.click();
                        }
                      }}
                      placeholder={localeText(LANGUAGES.ACC.SU.PH_SELECT_FILE)}
                      _readOnly={{
                        _placeholder: {
                          color: '#A7C3D2',
                        },
                      }}
                      minW={'auto'}
                      w={'100%'}
                      h={'100%'}
                      color={'#485766'}
                      border={'1px solid #9CADBE'}
                      px={'1rem'}
                      py={'0.75rem'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                      value={userInfo?.companyCertificateOriginalName}
                    />
                  </Box>
                  <Box w={'8rem'} minW={'8rem'} h={'3rem'}>
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

              {/* Business phone number */}
              <Box w={'100%'}>
                <VStack
                  spacing={'0.25rem'}
                  justifyContent={'flex-start'}
                  alignItems={'flex-start'}
                >
                  <Box>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.BUSINESS_PHONE_NUMBER)}
                    </Text>
                  </Box>
                  <Box w={'100%'} h={'3rem'}>
                    <Input
                      placeholder={localeText(
                        LANGUAGES.ACC.SU.BUSINESS_PHONE_NUMBER,
                      )}
                      _placeholder={{
                        color: '#A7C3D2',
                      }}
                      minW={'auto'}
                      w={'100%'}
                      h={'100%'}
                      type={'number'}
                      color={'#485766'}
                      border={'1px solid #9CADBE'}
                      px={'1rem'}
                      py={'0.75rem'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                      value={userInfo?.companyPhone}
                      onChange={(e) => {
                        setUserInfo({
                          ...userInfo,
                          companyPhone: e.target.value,
                        });
                      }}
                    />
                  </Box>
                </VStack>
              </Box>

              {/* address */}
              <Box w={'100%'}>
                <VStack
                  spacing={'0.25rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-start'}
                >
                  <Box alignContent={'center'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.BUSINESS_ADDRESS)}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <VStack spacing={'0.75rem'}>
                      <Box w={'100%'} h={'3rem'}>
                        <Input
                          placeholder={localeText(LANGUAGES.PH_ADDR_1)}
                          _placeholder={{
                            color: '#A7C3D2',
                          }}
                          minW={'auto'}
                          w={'100%'}
                          h={'100%'}
                          color={'#485766'}
                          border={'1px solid #9CADBE'}
                          px={'1rem'}
                          py={'0.75rem'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                          cursor={'pointer'}
                          value={address1}
                          isReadOnly
                          onClick={() => {
                            setIsOpenGoogleAddr(true);
                          }}
                        />
                      </Box>
                      <Box w={'100%'} h={'3rem'}>
                        <Input
                          placeholder={`${localeText(LANGUAGES.PH_ADDR_2)} (${localeText(LANGUAGES.ACC.SU.OPTIONAL)})`}
                          _placeholder={{
                            color: '#A7C3D2',
                          }}
                          minW={'auto'}
                          w={'100%'}
                          h={'100%'}
                          color={'#485766'}
                          border={'1px solid #9CADBE'}
                          px={'1rem'}
                          py={'0.75rem'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                          value={address2}
                          onChange={(e) => {
                            setAddress2(e.target.value);
                          }}
                        />
                      </Box>
                      <Box w={'100%'} h={'3rem'}>
                        <HStack w={'100%'} spacing={'0.75rem'}>
                          <Box w={'50%'}>
                            <Input
                              placeholder={localeText(LANGUAGES.CITY)}
                              _placeholder={{
                                color: '#A7C3D2',
                              }}
                              minW={'auto'}
                              w={'100%'}
                              h={'100%'}
                              color={'#485766'}
                              border={'1px solid #9CADBE'}
                              px={'1rem'}
                              py={'0.75rem'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                              value={userAddress.city}
                              onChange={(e) => {
                                setUserAddress({
                                  ...userAddress,
                                  city: e.target.value,
                                });
                              }}
                            />
                          </Box>
                          <Box w={'50%'}>
                            <Input
                              placeholder={localeText(LANGUAGES.STATE)}
                              _placeholder={{
                                color: '#A7C3D2',
                              }}
                              minW={'auto'}
                              w={'100%'}
                              h={'100%'}
                              color={'#485766'}
                              border={'1px solid #9CADBE'}
                              px={'1rem'}
                              py={'0.75rem'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                              value={userAddress.state}
                              onChange={(e) => {
                                setUserAddress({
                                  ...userAddress,
                                  state: e.target.value,
                                });
                              }}
                            />
                          </Box>
                        </HStack>
                      </Box>
                      <Box w={'100%'} h={'3rem'}>
                        <HStack w={'100%'} spacing={'0.75rem'}>
                          <Box w={'50%'}>
                            <Input
                              placeholder={localeText(LANGUAGES.POSCAL_CODE)}
                              _placeholder={{
                                color: '#A7C3D2',
                              }}
                              minW={'auto'}
                              type={'number'}
                              w={'100%'}
                              h={'100%'}
                              color={'#485766'}
                              border={'1px solid #9CADBE'}
                              px={'1rem'}
                              py={'0.75rem'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                              value={userAddress.zipCode}
                              onChange={(e) => {
                                setUserAddress({
                                  ...userAddress,
                                  zipCode: e.target.value,
                                });
                              }}
                            />
                          </Box>
                          <Box w={'50%'}>
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
                            >
                              <option value={''}>
                                {localeText(LANGUAGES.COUNTRY)}
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
                </VStack>
              </Box>

              {/* Settlement account info */}
              <Box w={'100%'}>
                <VStack
                  spacing={'0.25rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-start'}
                >
                  <Box>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
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
                        <Box w={'100%'} h={'3rem'}>
                          <Select
                            value={userInfo?.bankName || ''}
                            onChange={(e) => {
                              setUserInfo({
                                ...userInfo,
                                bankName: e.target.value,
                              });
                            }}
                            w={'100%'}
                            h={'3rem'}
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
                        <Box w={'100%'}>
                          <Input
                            placeholder={localeText(
                              LANGUAGES.ACC.SU.PH_ACCOUNT_NUMBER,
                            )}
                            _placeholder={{
                              color: '#A7C3D2',
                            }}
                            type={'number'}
                            minW={'auto'}
                            w={'100%'}
                            h={'100%'}
                            color={'#485766'}
                            border={'1px solid #9CADBE'}
                            px={'1rem'}
                            py={'0.75rem'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                            value={userInfo?.bankNumber || ''}
                            onChange={(e) => {
                              setUserInfo({
                                ...userInfo,
                                bankNumber: e.target.value,
                              });
                            }}
                          />
                        </Box>
                      </VStack>
                    </Box>
                  )}
                </VStack>
              </Box>

              {/* Passbook copies */}
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-start'}
                >
                  <Box h={'1.5rem'} alignContent={'center'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.PASSBOOK_COPIES)}
                    </Text>
                  </Box>
                  <Box>
                    <HStack
                      spacing={'0.75rem'}
                      justifyContent={'space-between'}
                      alignItems={'flex-end'}
                    >
                      <Box w={'100%'}>
                        <VStack>
                          {userInfo?.accImageOriginalName && (
                            <Box w={'100%'}>
                              <HStack
                                justifyContent={'flex-end'}
                                alignItems={'flex-end'}
                              >
                                <Text
                                  color={'#556A7E'}
                                  fontSize={'0.9375rem'}
                                  fontWeight={400}
                                  lineHeight={'1.5rem'}
                                >
                                  {userInfo?.accImageOriginalName || ''}
                                </Text>
                                <Box
                                  w={'1.25rem'}
                                  h={'1.25rem'}
                                  cursor={'pointer'}
                                  onClick={() => {
                                    setUserInfo({
                                      ...userInfo,
                                      accImageS3Url: null,
                                      accImageOriginalName: null,
                                    });
                                    setAccImage(null);
                                    if (accInput?.current) {
                                      accInput.current.value = null;
                                    }
                                  }}
                                >
                                  <CustomIcon
                                    w={'100%'}
                                    h={'100%'}
                                    name={'close'}
                                    color={'#7895B2'}
                                  />
                                </Box>
                              </HStack>
                            </Box>
                          )}
                        </VStack>
                      </Box>
                    </HStack>
                  </Box>
                </HStack>

                <ContentBR h={'0.75rem'} />

                <HStack>
                  <Box w={'100%'} h={'3rem'}>
                    <input
                      onChange={(e) => {
                        saveImageFile(e, 'acc');
                      }}
                      style={{ display: 'none' }}
                      type="file"
                      accept="image/*"
                      ref={accInput}
                    />
                    <Input
                      readOnly
                      placeholder={localeText(LANGUAGES.ACC.SU.PH_SELECT_FILE)}
                      _readOnly={{
                        _placeholder: {
                          color: '#A7C3D2',
                        },
                      }}
                      onClick={() => {
                        if (accInput?.current) {
                          accInput.current.click();
                        }
                      }}
                      minW={'auto'}
                      w={'100%'}
                      h={'100%'}
                      color={'#485766'}
                      border={'1px solid #9CADBE'}
                      px={'1rem'}
                      py={'0.75rem'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                      value={''}
                    />
                  </Box>
                  <Box w={'8rem'} minW={'8rem'} h={'3rem'}>
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

              {/* Shipping Methods */}
              <Box w={'100%'}>
                <VStack
                  spacing={'0.75rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-start'}
                >
                  <Box alignContent={'center'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.SHIPPING_METHODS)}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <Select
                      value={userInfo.defaultShipping}
                      onChange={(e) => {
                        setUserInfo({
                          ...userInfo,
                          defaultShipping: Number(e.target.value),
                        });
                      }}
                      w={'100%'}
                      h={'3rem'}
                      bg={'#FFF'}
                      color={'#485766'}
                      borderRadius={'0.25rem'}
                      border={'1px solid #9CADBE'}
                    >
                      {/*
                      <option value={0}>
                        {localeText(LANGUAGES.ACC.SU.PH_SHIPPING_METHODS)}
                      </option>
                      */}
                      <option value={1}>
                        {localeText(
                          LANGUAGES.COMMON.SYSTEM_CONSIGNMENT_SHIPPING,
                        )}
                      </option>
                      {/*
                      <option value={2}>
                        {localeText(LANGUAGES.COMMON.DIRECT_DELIVERY)}
                      </option>
                      */}
                    </Select>
                  </Box>
                </VStack>
              </Box>

              {/* Merchant fees */}
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-end'}
                >
                  <Box
                    w={'12.5rem'}
                    minW={'12.5rem'}
                    h={'1.5rem'}
                    alignContent={'center'}
                  >
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.MERCHANT_FEES)}
                    </Text>
                  </Box>
                  <Box minW={'8rem'} h={'1.5rem'}>
                    <Text
                      color={'#556A7E'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {`${userInfo.feeRate}%`}
                    </Text>
                  </Box>
                </HStack>
              </Box>

              {/* Purchase minimum */}
              <Box w={'100%'}>
                <VStack
                  spacing={'0.75rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-start'}
                >
                  <Box
                    w={'12.5rem'}
                    minW={'12.5rem'}
                    h={'3rem'}
                    alignContent={'center'}
                  >
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.PURCHASE_MINIMUM)}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    {/*
                    <Select
                      value={userInfo?.purchaseMinimum || 0}
                      onChange={(e) => {
                        const index = Number(e.target.value);
                        const purchaseMinimum = index;

                        const minimumOrderAmount =
                          utils.getAmountByIndex(index);
                        setUserInfo({
                          ...userInfo,
                          purchaseMinimum: purchaseMinimum,
                          minimumOrderAmount: minimumOrderAmount,
                        });
                      }}
                      w={'100%'}
                      h={'3rem'}
                      bg={'#FFF'}
                      borderRadius={'0.25rem'}
                      border={'1px solid #9CADBE'}
                    >
                      <option value={0}>
                        {localeText(LANGUAGES.ACC.SU.PH_PURCHASE_MINIMUM)}
                      </option>
                      {SYSTEM_LIST_PURCHASEMINIMUM.map((value, index) => {
                        return (
                          <option value={Number(index + 1)} key={index}>
                            {value}
                          </option>
                        );
                      })}
                    </Select>
                    */}
                    <Input
                      value={userInfo?.minimumOrderAmount || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        const regex = /^\d*\.?\d{0,2}$/;
                        if (regex.test(value)) {
                          setUserInfo({
                            ...userInfo,
                            minimumOrderAmount: value,
                          });
                        }
                      }}
                      _readOnly={{
                        _placeholder: {
                          color: '#A7C3D2',
                        },
                      }}
                      minW={'auto'}
                      w={'100%'}
                      h={'100%'}
                      color={'#485766'}
                      border={'1px solid #9CADBE'}
                      px={'1rem'}
                      py={'0.75rem'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    />
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </Box>

          <Divider borderTop={'1px solid #73829D'} boxSizing={'border-box'} />

          <Box w={'100%'}>
            <VStack spacing={'0.75rem'}>
              <Box w={'100%'}>
                <Text
                  color={'#485766'}
                  fontSize={'1.125rem'}
                  fontWeight={500}
                  lineHeight={'1.96875rem'}
                >
                  {localeText(LANGUAGES.ACC.SU.ENTER_PRODUCT_DESCRIPTION)}
                </Text>
              </Box>
              <Box w={'100%'}>
                <CustomEditor
                  info={userInfo?.info}
                  setInfo={(e) => {
                    setUserInfo({
                      ...userInfo,
                      info: e,
                    });
                  }}
                />
              </Box>
            </VStack>
          </Box>

          <ContentBR h={'6.25rem'} />
        </VStack>
      </Box>

      <Box
        minW={'100%'}
        h={'5rem'}
        position={'fixed'}
        bottom={0}
        p={'1rem'}
        bg={'#FFF'}
        borderTop={'1px solid #AEBDCA'}
      >
        <Button
          // disabled
          onClick={() => {
            handleSave();
          }}
          px={'1.25rem'}
          py={'0.63rem'}
          borderRadius={'0.25rem'}
          bg={'#7895B2'}
          h={'100%'}
          w={'100%'}
          _disabled={{
            bg: '#D9E7EC',
            _hover: {
              opacity: 1,
              cursor: 'not-allowed',
            },
          }}
          _hover={{
            opacity: 0.8,
          }}
        >
          <Text
            color={'#FFF'}
            fontSize={'1rem'}
            fontWeight={400}
            lineHeight={'1.75rem'}
          >
            {localeText(LANGUAGES.COMMON.SAVE)}
          </Text>
        </Button>
      </Box>

      {isOpenPassword && (
        <PasswordModal
          isOpen={isOpenPassword}
          onClose={(ret) => {
            if (ret) {
              handleGetMyInfo();
            }
            onClosePassword();
          }}
        />
      )}
    </MainContainer>
  ) : (
    <MainContainer>
      <Box w={'100%'}>
        <VStack spacing={'2.5rem'}>
          <Box w={'100%'}>
            <VStack spacing={'1.25rem'} justifyContent={'flex-start'}>
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-end'}
                >
                  <Box h={'1.5rem'} alignContent={'center'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.EMAIL)}
                    </Text>
                  </Box>
                  <Box h={'1.5rem'}>
                    <Text
                      color={'#556A7E'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {userInfo.id}
                    </Text>
                  </Box>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-end'}
                >
                  <Box
                    w={'12.5rem'}
                    minW={'12.5rem'}
                    h={'1.5rem'}
                    alignContent={'center'}
                  >
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.PASSWORD)}
                    </Text>
                  </Box>
                  <Box w={'70.25rem'} minW={'8rem'} h={'1.5rem'}>
                    <HStack>
                      <Box
                        borderBottom={'1px solid #66809C'}
                        cursor={'pointer'}
                        onClick={() => {
                          onOpenPassword();
                        }}
                      >
                        <Text
                          color={'#556A7E'}
                          fontSize={'1rem'}
                          fontWeight={500}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.MY_PAGE.CHANGE_PASSWORD)}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                </HStack>
              </Box>
            </VStack>
          </Box>

          <Divider borderTop={'1px solid #73829D'} boxSizing={'border-box'} />

          <Box w={'100%'}>
            <VStack spacing={'2rem'}>
              {/* Business name */}
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-end'}
                >
                  <Box
                    w={'12.5rem'}
                    minW={'12.5rem'}
                    h={'1.5rem'}
                    alignContent={'center'}
                  >
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.BUSINESS_NAME)}
                    </Text>
                  </Box>
                  <Box
                    w={'70.25rem'}
                    minW={'8rem'}
                    h={'1.5rem'}
                    alignContent={'center'}
                  >
                    <Text
                      color={'#556A7E'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {userInfo.companyName}
                    </Text>
                  </Box>
                </HStack>
              </Box>

              {/* Business logo */}
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'flex-start'}
                  alignItems={'flex-start'}
                >
                  <Box
                    w={'12.5rem'}
                    minW={'12.5rem'}
                    h={'1.5rem'}
                    alignContent={'center'}
                  >
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.BRAND_BANNER)}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <HStack
                      spacing={'0.75rem'}
                      justifyContent={'space-between'}
                      alignItems={'flex-end'}
                    >
                      <Box w={'100%'}>
                        <VStack>
                          {userInfo?.brandBannerOriginalName && (
                            <Box w={'100%'}>
                              <HStack
                                justifyContent={'flex-start'}
                                alignItems={'flex-end'}
                              >
                                <Center w={'5rem'} h={'5rem'}>
                                  <ChakraImage
                                    fallback={<DefaultSkeleton />}
                                    w={'100%'}
                                    h={'100%'}
                                    src={userInfo?.brandBannerS3Url}
                                  />
                                </Center>
                                <Text
                                  color={'#556A7E'}
                                  fontSize={'0.9375rem'}
                                  fontWeight={400}
                                  lineHeight={'1.5rem'}
                                >
                                  {userInfo?.brandBannerOriginalName}
                                </Text>
                                <Box
                                  w={'1.25rem'}
                                  h={'1.25rem'}
                                  cursor={'pointer'}
                                  onClick={() => {
                                    setUserInfo({
                                      ...userInfo,
                                      brandBannerS3Url: null,
                                      brandBannerOriginalName: null,
                                    });
                                    setBrandBannerImage(null);
                                    if (brandBannerInput?.current) {
                                      brandBannerInput.current.value = null;
                                    }
                                  }}
                                >
                                  <CustomIcon
                                    w={'100%'}
                                    h={'100%'}
                                    name={'close'}
                                    color={'#7895B2'}
                                  />
                                </Box>
                              </HStack>
                            </Box>
                          )}
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
                            <Input
                              readOnly
                              placeholder={localeText(
                                LANGUAGES.ACC.SU.PH_SELECT_FILE,
                              )}
                              _readOnly={{
                                _placeholder: {
                                  color: '#A7C3D2',
                                },
                              }}
                              onClick={() => {
                                if (brandBannerInput?.current) {
                                  brandBannerInput.current.click();
                                }
                              }}
                              minW={'auto'}
                              w={'100%'}
                              h={'100%'}
                              color={'#485766'}
                              border={'1px solid #9CADBE'}
                              px={'1rem'}
                              py={'0.75rem'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                              value={''}
                            />
                          </Box>
                        </VStack>
                      </Box>
                      <Box w={'8rem'} minW={'8rem'} h={'3rem'}>
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
                </HStack>
              </Box>

              {/* Brand name */}
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-end'}
                >
                  <Box
                    w={'12.5rem'}
                    minW={'12.5rem'}
                    h={'1.5rem'}
                    alignContent={'center'}
                  >
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.BRAND_NAME)}
                    </Text>
                  </Box>
                  <Box
                    w={'70.25rem'}
                    minW={'8rem'}
                    h={'1.5rem'}
                    alignContent={'center'}
                  >
                    <Text
                      color={'#556A7E'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {userInfo?.brandName || ''}
                    </Text>
                  </Box>
                </HStack>
              </Box>

              {/* Brand logo */}
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'flex-start'}
                  alignItems={'flex-start'}
                >
                  <Box
                    w={'12.5rem'}
                    minW={'12.5rem'}
                    h={'1.5rem'}
                    alignContent={'center'}
                  >
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.BRAND_LOGO)}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <HStack
                      spacing={'0.75rem'}
                      justifyContent={'space-between'}
                      alignItems={'flex-end'}
                    >
                      <Box w={'100%'}>
                        <VStack>
                          {userInfo?.brandLogoOriginalName && (
                            <Box w={'100%'}>
                              <HStack
                                justifyContent={'flex-start'}
                                alignItems={'flex-end'}
                              >
                                <Center w={'5rem'} h={'5rem'}>
                                  <ChakraImage
                                    fallback={<DefaultSkeleton />}
                                    w={'100%'}
                                    h={'100%'}
                                    src={userInfo?.brandLogoS3Url}
                                    objectFit={'cover'}
                                  />
                                </Center>
                                <Text
                                  color={'#556A7E'}
                                  fontSize={'0.9375rem'}
                                  fontWeight={400}
                                  lineHeight={'1.5rem'}
                                >
                                  {userInfo?.brandLogoOriginalName}
                                </Text>
                                <Box
                                  w={'1.25rem'}
                                  h={'1.25rem'}
                                  cursor={'pointer'}
                                  onClick={() => {
                                    setUserInfo({
                                      ...userInfo,
                                      brandLogoS3Url: null,
                                      brandLogoOriginalName: null,
                                    });
                                    setBrandLogoImage(null);
                                    if (brandLogoInput?.current) {
                                      brandLogoInput.current.value = null;
                                    }
                                  }}
                                >
                                  <CustomIcon
                                    w={'100%'}
                                    h={'100%'}
                                    name={'close'}
                                    color={'#7895B2'}
                                  />
                                </Box>
                              </HStack>
                            </Box>
                          )}
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
                            <Input
                              readOnly
                              onClick={() => {
                                if (brandLogoInput?.current) {
                                  brandLogoInput.current.click();
                                }
                              }}
                              _readOnly={{
                                _placeholder: {
                                  color: '#A7C3D2',
                                },
                              }}
                              minW={'auto'}
                              w={'100%'}
                              h={'100%'}
                              color={'#485766'}
                              border={'1px solid #9CADBE'}
                              px={'1rem'}
                              py={'0.75rem'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                              value={''}
                            />
                          </Box>
                        </VStack>
                      </Box>
                      <Box w={'8rem'} minW={'8rem'} h={'3rem'}>
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
                </HStack>
              </Box>

              {/* Business license number */}
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'flex-start'}
                  alignItems={'flex-start'}
                >
                  <Box
                    w={'12.5rem'}
                    minW={'12.5rem'}
                    h={'1.5rem'}
                    alignContent={'center'}
                  >
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.BUSINESS_LICENSE_NUMBER)}
                    </Text>
                  </Box>
                  <Box h={'1.5rem'} alignContent={'center'}>
                    <Text
                      color={'#556A7E'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {utils.parseBusinessNum(userInfo?.companyNumber)}
                    </Text>
                  </Box>
                </HStack>
              </Box>

              {/* Business license */}
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'flex-start'}
                  alignItems={'flex-start'}
                >
                  <Box
                    w={'12.5rem'}
                    minW={'12.5rem'}
                    h={'1.5rem'}
                    alignContent={'center'}
                  >
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.BUSINESS_LICENSE)}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <HStack
                      spacing={'0.75rem'}
                      justifyContent={'space-between'}
                      alignItems={'flex-end'}
                    >
                      <Box w={'100%'}>
                        <VStack>
                          {userInfo?.companyCertificateOriginalName && (
                            <Box w={'100%'}>
                              <HStack
                                justifyContent={'flex-start'}
                                alignItems={'flex-end'}
                              >
                                <Text
                                  color={'#556A7E'}
                                  fontSize={'0.9375rem'}
                                  fontWeight={400}
                                  lineHeight={'1.5rem'}
                                >
                                  {userInfo?.companyCertificateOriginalName}
                                </Text>
                                <Box
                                  w={'1.25rem'}
                                  h={'1.25rem'}
                                  cursor={'pointer'}
                                  onClick={() => {
                                    setUserInfo({
                                      ...userInfo,
                                      companyCertificateS3Url: null,
                                      companyCertificateOriginalName: null,
                                    });
                                    setCompanyCertificateImage(null);
                                    if (companyCertificateInput?.current) {
                                      companyCertificateInput.current.value =
                                        null;
                                    }
                                  }}
                                >
                                  <CustomIcon
                                    w={'100%'}
                                    h={'100%'}
                                    name={'close'}
                                    color={'#7895B2'}
                                  />
                                </Box>
                              </HStack>
                            </Box>
                          )}
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
                            <Input
                              readOnly
                              placeholder={localeText(
                                LANGUAGES.ACC.SU.PH_SELECT_FILE,
                              )}
                              _readOnly={{
                                _placeholder: {
                                  color: '#A7C3D2',
                                },
                              }}
                              onClick={() => {
                                if (companyCertificateInput?.current) {
                                  companyCertificateInput.current.click();
                                }
                              }}
                              minW={'auto'}
                              w={'100%'}
                              h={'100%'}
                              color={'#485766'}
                              border={'1px solid #9CADBE'}
                              px={'1rem'}
                              py={'0.75rem'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                              value={userInfo?.companyCertificateOriginalName}
                            />
                          </Box>
                        </VStack>
                      </Box>

                      <Box w={'8rem'} minW={'8rem'} h={'3rem'}>
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
                </HStack>
              </Box>

              {/* Business phone number */}
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-end'}
                >
                  <Box
                    w={'12.5rem'}
                    minW={'12.5rem'}
                    h={'3rem'}
                    alignContent={'center'}
                  >
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.BUSINESS_PHONE_NUMBER)}
                    </Text>
                  </Box>
                  <Box w={'100%'} h={'3rem'}>
                    <Input
                      placeholder={localeText(
                        LANGUAGES.ACC.SU.BUSINESS_PHONE_NUMBER,
                      )}
                      _placeholder={{
                        color: '#A7C3D2',
                      }}
                      minW={'auto'}
                      w={'100%'}
                      h={'100%'}
                      type={'number'}
                      color={'#485766'}
                      border={'1px solid #9CADBE'}
                      px={'1rem'}
                      py={'0.75rem'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                      value={userInfo?.companyPhone}
                      onChange={(e) => {
                        setUserInfo({
                          ...userInfo,
                          companyPhone: e.target.value,
                        });
                      }}
                    />
                  </Box>
                </HStack>
              </Box>

              {/* address */}
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-start'}
                >
                  <Box
                    w={'12.5rem'}
                    minW={'12.5rem'}
                    h={'1.5rem'}
                    alignContent={'center'}
                  >
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.BUSINESS_ADDRESS)}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <VStack spacing={'0.75rem'}>
                      <Box w={'100%'} h={'3rem'}>
                        <Input
                          placeholder={localeText(LANGUAGES.PH_ADDR_1)}
                          _placeholder={{
                            color: '#A7C3D2',
                          }}
                          minW={'auto'}
                          w={'100%'}
                          h={'100%'}
                          color={'#485766'}
                          border={'1px solid #9CADBE'}
                          px={'1rem'}
                          py={'0.75rem'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                          cursor={'pointer'}
                          value={address1}
                          isReadOnly
                          onClick={() => {
                            setIsOpenGoogleAddr(true);
                          }}
                        />
                      </Box>
                      <Box w={'100%'} h={'3rem'}>
                        <Input
                          placeholder={`${localeText(LANGUAGES.PH_ADDR_2)} (${localeText(LANGUAGES.ACC.SU.OPTIONAL)})`}
                          _placeholder={{
                            color: '#A7C3D2',
                          }}
                          minW={'auto'}
                          w={'100%'}
                          h={'100%'}
                          color={'#485766'}
                          border={'1px solid #9CADBE'}
                          px={'1rem'}
                          py={'0.75rem'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                          value={address2}
                          onChange={(e) => {
                            setAddress2(e.target.value);
                          }}
                        />
                      </Box>
                      <Box w={'100%'} h={'3rem'}>
                        <HStack w={'100%'} spacing={'0.75rem'}>
                          <Box w={'50%'}>
                            <Input
                              placeholder={localeText(LANGUAGES.CITY)}
                              _placeholder={{
                                color: '#A7C3D2',
                              }}
                              minW={'auto'}
                              w={'100%'}
                              h={'100%'}
                              color={'#485766'}
                              border={'1px solid #9CADBE'}
                              px={'1rem'}
                              py={'0.75rem'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                              value={userAddress.city}
                              onChange={(e) => {
                                setUserAddress({
                                  ...userAddress,
                                  city: e.target.value,
                                });
                              }}
                            />
                          </Box>
                          <Box w={'50%'}>
                            <Input
                              placeholder={localeText(LANGUAGES.STATE)}
                              _placeholder={{
                                color: '#A7C3D2',
                              }}
                              minW={'auto'}
                              w={'100%'}
                              h={'100%'}
                              color={'#485766'}
                              border={'1px solid #9CADBE'}
                              px={'1rem'}
                              py={'0.75rem'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                              value={userAddress.state}
                              onChange={(e) => {
                                setUserAddress({
                                  ...userAddress,
                                  state: e.target.value,
                                });
                              }}
                            />
                          </Box>
                        </HStack>
                      </Box>
                      <Box w={'100%'} h={'3rem'}>
                        <HStack w={'100%'} spacing={'0.75rem'}>
                          <Box w={'50%'}>
                            <Input
                              placeholder={localeText(LANGUAGES.POSCAL_CODE)}
                              _placeholder={{
                                color: '#A7C3D2',
                              }}
                              minW={'auto'}
                              type={'number'}
                              w={'100%'}
                              h={'100%'}
                              color={'#485766'}
                              border={'1px solid #9CADBE'}
                              px={'1rem'}
                              py={'0.75rem'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                              value={userAddress.zipCode}
                              onChange={(e) => {
                                setUserAddress({
                                  ...userAddress,
                                  zipCode: e.target.value,
                                });
                              }}
                            />
                          </Box>
                          <Box w={'50%'}>
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
                            >
                              <option value={''}>
                                {localeText(LANGUAGES.COUNTRY)}
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
                </HStack>
              </Box>

              {/* Settlement account info */}
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-start'}
                >
                  <Box
                    w={'12.5rem'}
                    minW={'12.5rem'}
                    h={'3rem'}
                    alignContent={'center'}
                  >
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
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
                        <Box w={'50%'} h={'3rem'}>
                          <Select
                            value={userInfo?.bankName || ''}
                            onChange={(e) => {
                              setUserInfo({
                                ...userInfo,
                                bankName: e.target.value,
                              });
                            }}
                            w={'100%'}
                            h={'3rem'}
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
                        <Box w={'50%'}>
                          <Input
                            placeholder={localeText(
                              LANGUAGES.ACC.SU.PH_ACCOUNT_NUMBER,
                            )}
                            _placeholder={{
                              color: '#A7C3D2',
                            }}
                            type={'number'}
                            minW={'auto'}
                            w={'100%'}
                            h={'100%'}
                            color={'#485766'}
                            border={'1px solid #9CADBE'}
                            px={'1rem'}
                            py={'0.75rem'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                            value={userInfo?.bankNumber || ''}
                            onChange={(e) => {
                              setUserInfo({
                                ...userInfo,
                                bankNumber: e.target.value,
                              });
                            }}
                          />
                        </Box>
                      </HStack>
                    </Box>
                  )}
                </HStack>
              </Box>

              {/* Passbook copies */}
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'flex-start'}
                  alignItems={'flex-start'}
                >
                  <Box
                    w={'12.5rem'}
                    minW={'12.5rem'}
                    h={'1.5rem'}
                    alignContent={'center'}
                  >
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.PASSBOOK_COPIES)}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <HStack
                      spacing={'0.75rem'}
                      justifyContent={'space-between'}
                      alignItems={'flex-end'}
                    >
                      <Box w={'100%'}>
                        <VStack>
                          {userInfo?.accImageOriginalName && (
                            <Box w={'100%'}>
                              <HStack
                                justifyContent={'flex-start'}
                                alignItems={'flex-end'}
                              >
                                <Text
                                  color={'#556A7E'}
                                  fontSize={'0.9375rem'}
                                  fontWeight={400}
                                  lineHeight={'1.5rem'}
                                >
                                  {userInfo?.accImageOriginalName || ''}
                                </Text>
                                <Box
                                  w={'1.25rem'}
                                  h={'1.25rem'}
                                  cursor={'pointer'}
                                  onClick={() => {
                                    setUserInfo({
                                      ...userInfo,
                                      accImageS3Url: null,
                                      accImageOriginalName: null,
                                    });
                                    setAccImage(null);
                                    if (accInput?.current) {
                                      accInput.current.value = null;
                                    }
                                  }}
                                >
                                  <CustomIcon
                                    w={'100%'}
                                    h={'100%'}
                                    name={'close'}
                                    color={'#7895B2'}
                                  />
                                </Box>
                              </HStack>
                            </Box>
                          )}
                          <Box w={'100%'} h={'3rem'}>
                            <input
                              onChange={(e) => {
                                saveImageFile(e, 'acc');
                              }}
                              style={{ display: 'none' }}
                              type="file"
                              accept="image/*"
                              ref={accInput}
                            />
                            <Input
                              readOnly
                              placeholder={localeText(
                                LANGUAGES.ACC.SU.PH_SELECT_FILE,
                              )}
                              _readOnly={{
                                _placeholder: {
                                  color: '#A7C3D2',
                                },
                              }}
                              onClick={() => {
                                if (accInput?.current) {
                                  accInput.current.click();
                                }
                              }}
                              minW={'auto'}
                              w={'100%'}
                              h={'100%'}
                              color={'#485766'}
                              border={'1px solid #9CADBE'}
                              px={'1rem'}
                              py={'0.75rem'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                              value={''}
                            />
                          </Box>
                        </VStack>
                      </Box>
                      <Box w={'8rem'} minW={'8rem'} h={'3rem'}>
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
                </HStack>
              </Box>

              {/* Shipping Methods */}
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-start'}
                >
                  <Box
                    w={'12.5rem'}
                    minW={'12.5rem'}
                    h={'3rem'}
                    alignContent={'center'}
                  >
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.SHIPPING_METHODS)}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <HStack w={'100%'} spacing={'0.75rem'}>
                      <Box w={'50%'}>
                        <Select
                          value={userInfo.defaultShipping}
                          onChange={(e) => {
                            setUserInfo({
                              ...userInfo,
                              defaultShipping: Number(e.target.value),
                            });
                          }}
                          w={'100%'}
                          h={'3rem'}
                          bg={'#FFF'}
                          color={'#485766'}
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
                          {/*
                          <option value={2}>
                            {localeText(LANGUAGES.COMMON.DIRECT_DELIVERY)}
                          </option>
                          */}
                        </Select>
                      </Box>
                      <Box w={'50%'} />
                    </HStack>
                  </Box>
                </HStack>
              </Box>

              {/* Merchant fees */}
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-end'}
                >
                  <Box
                    w={'12.5rem'}
                    minW={'12.5rem'}
                    h={'1.5rem'}
                    alignContent={'center'}
                  >
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.MERCHANT_FEES)}
                    </Text>
                  </Box>
                  <Box w={'70.25rem'} minW={'8rem'} h={'1.5rem'}>
                    <Text
                      color={'#556A7E'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {`${userInfo.feeRate}%`}
                    </Text>
                  </Box>
                </HStack>
              </Box>

              {/* Purchase minimum */}
              <Box w={'100%'}>
                <HStack
                  spacing={'2rem'}
                  justifyContent={'space-between'}
                  alignItems={'flex-start'}
                >
                  <Box
                    w={'12.5rem'}
                    minW={'12.5rem'}
                    h={'3rem'}
                    alignContent={'center'}
                  >
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.ACC.SU.PURCHASE_MINIMUM)}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <HStack w={'100%'} spacing={'1.25rem'}>
                      <Box w={'50%'}>
                        <Input
                          value={userInfo?.minimumOrderAmount || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            const regex = /^\d*\.?\d{0,2}$/;
                            if (regex.test(value)) {
                              setUserInfo({
                                ...userInfo,
                                minimumOrderAmount: value,
                              });
                            }
                          }}
                          _readOnly={{
                            _placeholder: {
                              color: '#A7C3D2',
                            },
                          }}
                          minW={'auto'}
                          w={'100%'}
                          h={'100%'}
                          color={'#485766'}
                          border={'1px solid #9CADBE'}
                          px={'1rem'}
                          py={'0.75rem'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        />
                      </Box>
                      <Box w={'50%'} />
                    </HStack>
                  </Box>
                </HStack>
              </Box>
            </VStack>
          </Box>

          <Divider borderTop={'1px solid #73829D'} boxSizing={'border-box'} />

          <Box w={'100%'}>
            <VStack spacing={'0.75rem'}>
              <Box w={'100%'}>
                <Text
                  color={'#485766'}
                  fontSize={'1.125rem'}
                  fontWeight={500}
                  lineHeight={'1.96875rem'}
                >
                  {localeText(LANGUAGES.ACC.SU.ENTER_PRODUCT_DESCRIPTION)}
                </Text>
              </Box>
              <Box w={'100%'} h={'22.5rem'}>
                <CustomEditor
                  info={userInfo?.info}
                  setInfo={(e) => {
                    setUserInfo({
                      ...userInfo,
                      info: e,
                    });
                  }}
                />
              </Box>
            </VStack>
          </Box>

          <ContentBR h={'1.25rem'} />
        </VStack>
      </Box>
      <Box py={'1rem'}>
        <HStack justifyContent={'flex-end'}>
          <Box minW={'7rem'} h={'3rem'}>
            <Button
              // disabled
              onClick={() => {
                handleSave();
              }}
              px={'1.25rem'}
              py={'0.63rem'}
              borderRadius={'0.25rem'}
              bg={'#7895B2'}
              h={'100%'}
              w={'100%'}
              _disabled={{
                bg: '#D9E7EC',
                _hover: {
                  opacity: 1,
                  cursor: 'not-allowed',
                },
              }}
              _hover={{
                opacity: 0.8,
              }}
            >
              <Text
                color={'#FFF'}
                fontSize={'1rem'}
                fontWeight={400}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.COMMON.SAVE)}
              </Text>
            </Button>
          </Box>
        </HStack>
      </Box>
      {isOpenPassword && (
        <PasswordModal
          isOpen={isOpenPassword}
          onClose={(ret) => {
            if (ret) {
              handleGetMyInfo();
            }
            onClosePassword();
          }}
        />
      )}
    </MainContainer>
  );
};

export default MyInfoPage;
