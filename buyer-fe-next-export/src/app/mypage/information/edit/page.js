'use client';

import {
  Box,
  Button,
  Divider,
  HStack,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react';
import TitleTextInput from '@/components/input/custom/TitleTextInput';
import useLocale from '@/hooks/useLocale';
import { COUNTRY, COUNTRY_LIST, LANGUAGES } from '@/constants/lang';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import buyerApi from '@/services/buyerUserApi';
import { SUCCESS } from '@/constants/errorCode';
import useModal from '@/hooks/useModal';
import utils from '@/utils';
import useDevice from '@/hooks/useDevice';
import ContentBR from '@/components/custom/ContentBR';
import TitlePasswordInput from '@/components/input/custom/TitlePasswordInput';
import {
  isOpenGoogleAddrState,
  selectedGoogleAddrState,
} from '@/stores/googleAddrRecoil';
import { useRecoilValue, useSetRecoilState } from 'recoil';

const MyPageAccountEditPage = () => {
  const { isMobile, clampW } = useDevice();
  const { openModal } = useModal();
  const router = useRouter();
  const { lang, localeText } = useLocale();

  const [initPage, setInitPage] = useState(true);

  const [userInfo, setUserInfo] = useState({});
  const [userAddress, setUserAddress] = useState({});

  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPwCheck, setNewPwCheck] = useState('');

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
    handleGetMyInfo();
  }, []);

  useEffect(() => {
    if (!initPage) {
      if (country === 'KR') {
        setAddressType(1);
      } else {
        setAddressType(2);
      }
    }
  }, [country]);

  const handleGetMyInfo = useCallback(async () => {
    const result = await buyerApi.getBuyerMyInfo();
    if (result?.errorCode === SUCCESS) {
      setUserInfo(result.data);
      const tempAddress = { ...result.data.rsGetUserAddressDTO };
      if (tempAddress.addressType === 1) {
        setAddress1(tempAddress.roadNameMainAddr);
        setAddress2(tempAddress.subAddr);
        setCountry(COUNTRY.COUNTRY_INFO.KR.CODE);
      } else {
        setAddress1(tempAddress.addressLineOne);
        setAddress2(tempAddress.addressLineTwo);
        setCountry(COUNTRY.COUNTRY_INFO.US.CODE);
      }

      /*
      if (lang === COUNTRY.COUNTRY_INFO.KR.CODE) {
        setAddressType(1);
        setCountry(COUNTRY.COUNTRY_INFO.KR.CODE);
      } else {
        setAddressType(2);
        setCountry(COUNTRY.COUNTRY_INFO.US.CODE);
      }
      */
      setUserAddress(tempAddress);
      setTimeout(() => {
        setInitPage(false);
      }, 50);
    }
  });

  const handleChangePassword = useCallback(async () => {
    if (!oldPw) {
      return setTimeout(() => {
        openModal({
          text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_OLD_PASSWORD),
        });
      });
    }
    if (!newPw) {
      return setTimeout(() => {
        openModal({
          text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_NEW_PASSWORD),
        });
      });
    }
    /*
    if (newPw.length < 7) {
      return setTimeout(() => {
        openModal({
          text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_MATCH_NEW_PASSWORD),
        });
      });
    }
    */
    if (newPw !== newPwCheck) {
      return setTimeout(() => {
        openModal({
          text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_MATCH_NEW_PASSWORD_CHECK),
        });
      });
    }
    const param = {
      oldPw: oldPw,
      newPw: newPw,
    };
    handlePatchBuyer(param);
  });

  const handleSaveAddress = useCallback(async () => {
    const phone = userInfo?.phone;
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
      phone: phone,
    };
    const rqModifyUserAddressDTO = {
      addressType: addressType,
      zipCode: userAddress.zipCode,
      state: userAddress.state,
      city: userAddress.city,
    };
    if (addressType === 1) {
      rqModifyUserAddressDTO.roadNameMainAddr = address1;
      rqModifyUserAddressDTO.landNumberMainAddr = address1;
      if (address2) {
        rqModifyUserAddressDTO.subAddr = address2;
      }
    } else {
      rqModifyUserAddressDTO.addressLineOne = address1;
      if (address2) {
        rqModifyUserAddressDTO.addressLineTwo = address2;
      }
    }
    param.rqModifyUserAddressDTO = rqModifyUserAddressDTO;
    handlePatchBuyer(param);
  });

  const handlePatchBuyer = async (param) => {
    let result = await buyerApi.patchBuyer(param);
    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result.message,
        onAgree: () => {
          setOldPw('');
          setNewPw('');
          setNewPwCheck('');
        },
      });
    } else {
      openModal({ text: result.message });
    }
  };

  const getBusinessType = (type) => {
    // 1:Medical spa, 2:Esthetics, 3:Retailer, 4:Other
    if (type === 1) {
      return localeText(LANGUAGES.ACC.SU.MEDICAL_SPA);
    } else if (type === 2) {
      return localeText(LANGUAGES.ACC.SU.ESTHETICS);
    } else if (type === 3) {
      return localeText(LANGUAGES.ACC.SU.RETAILER);
    } else {
      return localeText(LANGUAGES.ACC.SU.OTHER);
    }
  };

  return isMobile(true) ? (
    <Box w={'100%'}>
      <VStack w={'100%'} spacing={0}>
        <Box w={'100%'}>
          <Text
            color={'#485766'}
            fontSize={clampW(1.125, 1.5)}
            fontWeight={500}
            lineHeight={'2.475rem'}
          >
            {localeText(LANGUAGES.MY_PAGE.EDIT.TITLE_EDIT_ACCOUNT_INFO)}
          </Text>
        </Box>

        <ContentBR h={'1.25rem'} />

        <Box w={'100%'}>
          <VStack spacing={'1.5rem'} alignItems={'flex-start'}>
            <Box w={'100%'}>
              <VStack spacing={'1.25rem'}>
                <Box w={'100%'}>
                  <TitleTextInput
                    isReadOnly
                    value={userInfo.id || ''}
                    title={localeText(LANGUAGES.ACC.EMAIL)}
                    placeholder={localeText(LANGUAGES.ACC.SU.PH_EMAIL)}
                  />
                </Box>
                <Box w={'100%'}>
                  <TitlePasswordInput
                    value={oldPw}
                    onChange={(v) => {
                      setOldPw(v);
                    }}
                    title={localeText(LANGUAGES.MY_PAGE.EDIT.CURRENT_PASSWORD)}
                    placeholder={localeText(LANGUAGES.ACC.PH_PASSWORD)}
                  />
                </Box>
                <Box w={'100%'}>
                  <TitlePasswordInput
                    value={newPw}
                    onChange={(v) => {
                      setNewPw(v);
                    }}
                    title={localeText(LANGUAGES.MY_PAGE.EDIT.NEW_PASSWORD)}
                    placeholder={localeText(LANGUAGES.ACC.PH_PASSWORD)}
                  />
                </Box>
                <Box w={'100%'}>
                  <TitlePasswordInput
                    value={newPwCheck}
                    onChange={(v) => {
                      setNewPwCheck(v);
                    }}
                    title={localeText(
                      LANGUAGES.MY_PAGE.EDIT.NEW_PASSWORD_CONFIRM,
                    )}
                    placeholder={localeText(LANGUAGES.ACC.PH_PASSWORD)}
                  />
                </Box>
                <Box w={'100%'} h={'3rem'}>
                  <Button
                    onClick={() => {
                      handleChangePassword();
                    }}
                    py={'0.75rem'}
                    px={'1rem'}
                    borderRadius={'0.25rem'}
                    bg={'#7895B2'}
                    h={'100%'}
                    w={'100%'}
                  >
                    <Text
                      color={'#FFF'}
                      fontSize={'1rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(LANGUAGES.MY_PAGE.EDIT.CHANGE_PASSWORD)}
                    </Text>
                  </Button>
                </Box>
              </VStack>
            </Box>

            <Divider borderTop={'1px solid #73829D'} boxSizing="border-box" />

            <Box w={'100%'}>
              <VStack spacing={'1.25rem'}>
                <Box w={'100%'}>
                  <HStack w={'100%'} spacing={'1.25rem'}>
                    <Box w={'50%'}>
                      <TitleTextInput
                        isReadOnly
                        title={localeText(LANGUAGES.ACC.FIRST_NAME)}
                        placeholder={localeText(LANGUAGES.ACC.FIRST_NAME)}
                      />
                    </Box>
                    <Box w={'50%'}>
                      <TitleTextInput
                        isReadOnly
                        value={userInfo.name}
                        title={localeText(LANGUAGES.ACC.LAST_NAME)}
                        placeholder={localeText(LANGUAGES.ACC.LAST_NAME)}
                      />
                    </Box>
                  </HStack>
                </Box>
                <Box w={'100%'}>
                  <TitleTextInput
                    isReadOnly
                    value={userInfo.businessName}
                    title={localeText(LANGUAGES.ACC.SU.BUSINESS_NAME)}
                    placeholder={localeText(LANGUAGES.ACC.SU.PH_BUSINESS_NAME)}
                  />
                </Box>
                <Box w={'100%'}>
                  <TitleTextInput
                    isReadOnly
                    value={getBusinessType(userInfo.businessType)}
                    title={localeText(LANGUAGES.ACC.SU.BUSINESS_TYPE)}
                    placeholder={localeText(LANGUAGES.ACC.SU.BUSINESS_TYPE)}
                  />
                </Box>
                <Box w={'100%'}>
                  <TitleTextInput
                    isReadOnly
                    value={userInfo?.businessNumber || ''}
                    title={localeText(LANGUAGES.ACC.SU.BUSINESS_NUMBER)}
                    placeholder={localeText(
                      LANGUAGES.ACC.SU.PH_BUSINESS_NUMBER,
                    )}
                  />
                </Box>

                {/* address */}
                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
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

                <Box w={'100%'} h={'3rem'}>
                  <Button
                    onClick={() => {
                      handleSaveAddress();
                    }}
                    py={'0.75rem'}
                    px={'1rem'}
                    borderRadius={'0.25rem'}
                    bg={'#7895B2'}
                    h={'100%'}
                    w={'100%'}
                  >
                    <Text
                      color={'#FFF'}
                      fontSize={'1rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(LANGUAGES.MY_PAGE.EDIT.SAVE_YOUR_CHANGES)}
                    </Text>
                  </Button>
                </Box>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ) : (
    <Box w={'100%'}>
      <VStack w={'100%'} maxW={1920} spacing={0}>
        <Box w={'100%'} pt={'5rem'} pb={'3.75rem'}>
          <Text
            color={'#485766'}
            fontSize={'1.5rem'}
            fontWeight={500}
            lineHeight={'2.475rem'}
          >
            {localeText(LANGUAGES.MY_PAGE.EDIT.TITLE_EDIT_ACCOUNT_INFO)}
          </Text>
        </Box>

        <Box w={'100%'}>
          <VStack spacing={'2.5rem'} alignItems={'flex-start'}>
            <Box w={'60rem'}>
              <HStack spacing={'1.25rem'}>
                <Box w={'40rem'}>
                  <VStack spacing={'1.25rem'}>
                    <Box w={'40rem'}>
                      <TitleTextInput
                        isReadOnly
                        value={userInfo.id || ''}
                        title={localeText(LANGUAGES.ACC.EMAIL)}
                        placeholder={localeText(LANGUAGES.ACC.SU.PH_EMAIL)}
                      />
                    </Box>
                    <Box w={'40rem'}>
                      <TitlePasswordInput
                        value={oldPw}
                        onChange={(v) => {
                          setOldPw(v);
                        }}
                        title={localeText(
                          LANGUAGES.MY_PAGE.EDIT.CURRENT_PASSWORD,
                        )}
                        placeholder={localeText(LANGUAGES.ACC.PH_PASSWORD)}
                      />
                    </Box>
                    <Box w={'40rem'}>
                      <TitlePasswordInput
                        value={newPw}
                        onChange={(v) => {
                          setNewPw(v);
                        }}
                        title={localeText(LANGUAGES.MY_PAGE.EDIT.NEW_PASSWORD)}
                        placeholder={localeText(LANGUAGES.ACC.PH_PASSWORD)}
                      />
                    </Box>
                    <Box w={'40rem'}>
                      <TitlePasswordInput
                        value={newPwCheck}
                        onChange={(v) => {
                          setNewPwCheck(v);
                        }}
                        title={localeText(
                          LANGUAGES.MY_PAGE.EDIT.NEW_PASSWORD_CONFIRM,
                        )}
                        placeholder={localeText(LANGUAGES.ACC.PH_PASSWORD)}
                      />
                    </Box>
                  </VStack>
                </Box>
                <Box
                  minW={'8rem'}
                  w={'18.75rem'}
                  h={'3.5rem'}
                  alignSelf={'flex-end'}
                >
                  <Button
                    onClick={() => {
                      handleChangePassword();
                    }}
                    py={'0.75rem'}
                    px={'1rem'}
                    borderRadius={'0.25rem'}
                    bg={'#7895B2'}
                    h={'100%'}
                    w={'100%'}
                  >
                    <Text
                      color={'#FFF'}
                      fontSize={'1rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(LANGUAGES.MY_PAGE.EDIT.CHANGE_PASSWORD)}
                    </Text>
                  </Button>
                </Box>
              </HStack>
            </Box>

            <Divider borderTop={'1px solid #73829D'} boxSizing="border-box" />

            <Box w={'60rem'}>
              <HStack spacing={'1.25rem'}>
                <Box w={'40rem'}>
                  <VStack spacing={'1.25rem'}>
                    <Box w={'100%'}>
                      <HStack w={'100%'} spacing={'1.25rem'}>
                        <Box w={'50%'}>
                          <TitleTextInput
                            isReadOnly
                            value={userInfo.name}
                            title={localeText(LANGUAGES.ACC.LAST_NAME)}
                            placeholder={localeText(LANGUAGES.ACC.LAST_NAME)}
                          />
                        </Box>
                        <Box w={'50%'}>
                          <TitleTextInput
                            isReadOnly
                            title={localeText(LANGUAGES.ACC.FIRST_NAME)}
                            placeholder={localeText(LANGUAGES.ACC.FIRST_NAME)}
                          />
                        </Box>
                      </HStack>
                    </Box>
                    <Box w={'100%'}>
                      <TitleTextInput
                        isReadOnly
                        value={userInfo.businessName}
                        title={localeText(LANGUAGES.ACC.SU.BUSINESS_NAME)}
                        placeholder={localeText(
                          LANGUAGES.ACC.SU.PH_BUSINESS_NAME,
                        )}
                      />
                    </Box>
                    <Box w={'100%'}>
                      <TitleTextInput
                        isReadOnly
                        value={getBusinessType(userInfo.businessType)}
                        title={localeText(LANGUAGES.ACC.SU.BUSINESS_TYPE)}
                        placeholder={localeText(LANGUAGES.ACC.SU.BUSINESS_TYPE)}
                      />
                    </Box>
                    <Box w={'100%'}>
                      <TitleTextInput
                        value={userInfo?.phone || ''}
                        onChange={(v) => {
                          setUserInfo({
                            ...userInfo,
                            phone: v,
                          });
                        }}
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
                                placeholder={localeText(
                                  LANGUAGES.ADDRESS.STATE,
                                )}
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
                  </VStack>
                </Box>
                <Box
                  minW={'8rem'}
                  w={'18.75rem'}
                  h={'3.5rem'}
                  alignSelf={'flex-end'}
                >
                  <Button
                    onClick={() => {
                      handleSaveAddress();
                    }}
                    py={'0.75rem'}
                    px={'1rem'}
                    borderRadius={'0.25rem'}
                    bg={'#7895B2'}
                    h={'100%'}
                    w={'100%'}
                  >
                    <Text
                      color={'#FFF'}
                      fontSize={'1rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(LANGUAGES.MY_PAGE.EDIT.SAVE_YOUR_CHANGES)}
                    </Text>
                  </Button>
                </Box>
              </HStack>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default MyPageAccountEditPage;
