'use client';

import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import {
  Box,
  Center,
  HStack,
  Image as ChakraImage,
  Text,
  VStack,
  RadioGroup,
  Radio,
  Select,
  Flex,
  Input,
  InputGroup,
} from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import IconRight from '@public/svgs/icon/right.svg';
import MainContainer from '@/components/layout/MainContainer';
import sellerUserApi from '@/services/sellerUserApi';
import { SUCCESS } from '@/constants/errorCode';
import utils from '@/utils';
import ContentBR from '@/components/common/ContentBR';
import useStatus from '@/hooks/useStatus';
import { DefaultPaginate } from '@/components';
import { LIST_CONTENT_NUM } from '@/constants/common';
import productApi from '@/services/productApi';
import SearchInput from '@/components/custom/input/SearchInput';
import useDevice from '@/hooks/useDevice';
import useModal from '@/hooks/useModal';
import useMove from '@/hooks/useMove';
import QuillViewer from '@/components/input/editor/QuillViewer';

const SellerDetailProductPage = () => {
  const { moveProductDetail } = useMove();
  const { openModal } = useModal();
  const { clampW } = useDevice();
  const { sellerUserId } = useParams();
  const { handleGetShippingMethod, handleGetProductSalesStatus } = useStatus();
  const { lang, localeText } = useLocale();
  const [approvalFlag, setApprovalFlag] = useState(1);
  const [feeRate, setFeeRate] = useState(null);

  const [initFlag, setInitFlag] = useState(true);
  const [searchBy, setSearchBy] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(LIST_CONTENT_NUM[0]);
  const [listProduct, setListProduct] = useState([]);

  const [sellerUserInfo, setSellerUserInfo] = useState(null);
  const [sellerUserAddressInfo, setSellerUserAddressInfo] = useState(null);

  const userInfo = utils.getUserInfoSession();

  useEffect(() => {
    if (sellerUserId) {
      handleGetSellerUser();
    }
  }, [sellerUserId]);

  useEffect(() => {
    handleGetListSellerProduct();
  }, [currentPage, contentNum]);

  const handleGetSellerUser = async () => {
    const param = {
      sellerUserId: sellerUserId,
    };
    const result = await sellerUserApi.getSeller(param);
    if (result?.errorCode === SUCCESS) {
      const resultData = result.data;
      setSellerUserInfo(resultData);
      setSellerUserAddressInfo(resultData.rsGetUserAddressDTO);
      setApprovalFlag(resultData?.approvalFlag || 1);
      setFeeRate(resultData?.feeRate || 0);
    }
    setInitFlag(false);
  };

  const handlePatchSellerUser = async (approvalFlag, feeRate) => {
    const param = {
      sellerUserId: sellerUserId,
    };
    if (approvalFlag) {
      param.approvalFlag = approvalFlag;
    }
    if (feeRate) {
      param.feeRate = feeRate;
    }
    const result = await sellerUserApi.patchSeller(param);
    openModal({ text: result.message });
    if (result?.errorCode === SUCCESS) {
      if (approvalFlag) {
        setApprovalFlag(Number(approvalFlag));
      }
    }
  };

  const handleGetListSellerProductAgent = () => {
    if (currentPage === 1) {
      handleGetListSellerProduct();
    } else {
      setCurrentPage(1);
    }
  };

  const handleGetListSellerProduct = async () => {
    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
      sellerUserId: sellerUserId,
    };
    if (searchBy) {
      param.searchBy = searchBy;
    }

    const result = await productApi.getListProductSeller(param);
    if (result?.errorCode === SUCCESS) {
      setListProduct(result.datas);
      setTotalCount(result.totalCount);
    } else {
      setListProduct([]);
      setTotalCount(0);
    }
  };

  const handleAddr = () => {
    const {
      addressType,
      zipCode,
      roadNameMainAddr,
      landNumberMainAddr,
      subAddr,
      state,
      city,
      addressLineOne,
      addressLineTwo,
    } = sellerUserAddressInfo;

    let addr = null;

    if (addressType === 1) {
      addr = roadNameMainAddr;
      if (subAddr) {
        addr += `, ${subAddr}`;
      }
    } else {
      addr = addressLineOne;
      if (addressLineTwo) {
        addr += `, ${addressLineTwo}`;
      }
    }
    return `${addr}, ${city}, ${zipCode}, ${state}`;
  };

  const productCard = (item, index) => {
    const name = item?.name;
    const status = item?.status;
    const createdAt = item?.createdAt;
    const modifiedAt = item?.modifiedAt;
    const firstCategoryName = item?.firstCategoryName;
    const secondCategoryName = item?.secondCategoryName;
    const thirdCategoryName = item?.thirdCategoryName;
    const productId = item?.productId;
    const stockCnt = item?.stockCnt;
    const productImageList = item?.productImageList;

    let firstImageSrc = null;
    if (productImageList.length > 0) {
      firstImageSrc = productImageList[0].imageS3Url;
    }

    const handleCategory = (first, second, third) => {
      if (third) {
        return `${first} > ${second} > ${third}`;
      } else if (second) {
        return `${first} > ${second}`;
      } else if (first) {
        return `${first}`;
      }
    };

    return (
      <Flex
        key={index}
        alignSelf="stretch"
        px={'1rem'}
        py={'0.75rem'}
        borderTop={'1px solid #73829D'}
        justifyContent={'flex-start'}
        alignItems={'center'}
        gap={'0.75rem'}
        display={'inline-flex'}
      >
        <Box
          flex={'1 1 0'}
          justifyContent={'center'}
          display={'flex'}
          flexDirection={'column'}
          cursor={'pointer'}
          onClick={() => {
            moveProductDetail(productId);
          }}
        >
          <Box>
            <HStack spacing={'0.75rem'}>
              <Box w={clampW(5, 8)}>
                <Center
                  w={clampW(3.75, 5)}
                  maxW={clampW(3.75, 5)}
                  h={clampW(3.75, 5)}
                >
                  <ChakraImage
                    fallback={<DefaultSkeleton />}
                    w={'100%'}
                    h={'100%'}
                    objectFit={'cover'}
                    src={firstImageSrc}
                  />
                </Center>
              </Box>

              <Box w={'100%'}>
                <Text
                  maxW={'160px'}
                  color={'#485766'}
                  fontSize={clampW(0.9357, 1)}
                  fontWeight={500}
                  whiteSpace={'nowrap'}
                  overflow={'hidden'}
                  textOverflow={'ellipsis'}
                >
                  {name}
                </Text>
              </Box>
            </HStack>
          </Box>
        </Box>

        <Box
          width={'8.75rem'}
          textAlign="center"
          display="flex"
          flexDirection="column"
        >
          <Text color={'#2A333C'} fontSize={'0.9375rem'} fontWeight={500}>
            {localeText(LANGUAGES.SELLER.SALES_AMOUNT)}
          </Text>
        </Box>

        <Box
          width={'10rem'}
          textAlign="center"
          display="flex"
          flexDirection="column"
        >
          <Box w={'100%'}>
            <Text
              maxW={'160px'}
              color={'#66809C'}
              fontSize={clampW(0.75, 0.9375)}
              fontWeight={400}
              opacity={'0.7'}
              whiteSpace={'nowrap'}
              overflow={'hidden'}
              textOverflow={'ellipsis'}
            >
              {handleCategory(
                firstCategoryName,
                secondCategoryName,
                thirdCategoryName,
              )}
            </Text>
          </Box>
        </Box>

        <Box
          width={'5rem'}
          textAlign="center"
          display="flex"
          flexDirection="column"
        >
          <Text color={'#2A333C'} fontSize={'0.9375rem'} fontWeight={400}>
            {handleGetProductSalesStatus(status)}
          </Text>
        </Box>

        <Box
          width={'5rem'}
          textAlign="center"
          display="flex"
          flexDirection="column"
        >
          <Text color={'#2A333C'} fontSize={'0.9375rem'} fontWeight={400}>
            {utils.parseAmount(stockCnt)}
          </Text>
        </Box>

        <Box
          width={'6.25rem'}
          textAlign="center"
          display="flex"
          flexDirection="column"
        >
          <Text color={'#2A333C'} fontSize={'0.9375rem'} fontWeight={400}>
            {utils.parseDateByCountryCode(createdAt, lang, true)}
          </Text>
        </Box>

        <Box
          width={'6.25rem'}
          textAlign="center"
          display="flex"
          flexDirection="column"
        >
          <Text color={'#2A333C'} fontSize={'0.9375rem'} fontWeight={400}>
            {utils.parseDateByCountryCode(modifiedAt, lang, true)}
          </Text>
        </Box>
      </Flex>
    );
  };

  return (
    <MainContainer
      isDetailHeader
      title={localeText(LANGUAGES.COMMON.BACK_PREVIOUS)}
      contentHeader={
        <Box>
          <HStack justifyContent={'flex-end'} spacing={'1.5rem'}>
            <Text
              w={'max-content'}
              minW={'max-content'}
              color={'#7895B2'}
              fontSize={'0.9375rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {localeText(LANGUAGES.SELLER.MEMBER_PERMISSIONS)}
            </Text>
            <RadioGroup
              w={'100%'}
              value={Number(approvalFlag)}
              onChange={(value) => {
                handlePatchSellerUser(Number(value));
              }}
            >
              <HStack spacing={'1.5rem'} alignItems={'center'}>
                <Box>
                  <HStack alignItems={'center'} spacing={'0.5rem'}>
                    <Radio value={2} />
                    <Box w={'5.375rem'}>
                      <Text
                        textAlign={'left'}
                        color={'#485766'}
                        fontSize={'1rem'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.STATUS.ALLOWED)}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
                <Box>
                  <HStack alignItems={'center'} spacing={'0.5rem'}>
                    <Radio value={1} />
                    <Box w={'6.6875rem'}>
                      <Text
                        textAlign={'left'}
                        color={'#485766'}
                        fontSize={'1rem'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.STATUS.NOT_ALLOWED)}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              </HStack>
            </RadioGroup>
          </HStack>
        </Box>
      }
    >
      {sellerUserInfo && (
        <Box w={'100%'}>
          <Box w={'100%'} borderBottom={'1px solid #AEBDCA'}>
            <VStack spacing={'1rem'}>
              <Box w={'100%'}>
                <HStack justifyContent={'space-between'} spacing={0}>
                  <Box w={'50%'}>
                    <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                      <Box w={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.SELLER.MEMBER_EMAIL)}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#556A7E'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {sellerUserInfo?.id}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box w={'50%'}>
                    <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                      <Box w={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.SELLER.COMMISSION_RATES)}
                        </Text>
                      </Box>
                      <Box w={'5rem'} h={'2rem'}>
                        <InputGroup h={'100%'}>
                          <Input
                            isDisabled={userInfo?.role !== 1}
                            placeholder={localeText(
                              localeText(LANGUAGES.SELLER.COMMISSION_RATES),
                            )}
                            _placeholder={{
                              color: '#A7C3D2',
                            }}
                            onBlur={() => {
                              handlePatchSellerUser(null, feeRate);
                            }}
                            onFocus={(e) => {
                              if (Number(e.target.value) === 0) {
                                e.target.value = '';
                              }
                            }}
                            minW={'auto'}
                            w={'100%'}
                            h={'100%'}
                            type={'number'}
                            autoComplete={'off'}
                            color={'#556A7E'}
                            border={'1px solid #9CADBE'}
                            px={'1rem'}
                            py={'0.75rem'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                            value={Number(feeRate)}
                            onChange={(e) => {
                              let value = Number(e.target.value);
                              if (value < 0) value = 0;
                              if (value > 100) value = 100;
                              setFeeRate(value);
                            }}
                          />
                          <Center w={'2rem'} h={'2rem'}>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                            >
                              {'%'}
                            </Text>
                          </Center>
                        </InputGroup>
                      </Box>
                    </HStack>
                  </Box>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <HStack justifyContent={'space-between'} spacing={0}>
                  <Box w={'50%'}>
                    <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                      <Box w={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.SELLER.PHONE_NUMBER)}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#556A7E'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {utils.parsePhoneNum(sellerUserInfo?.companyPhone)}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box w={'50%'}>
                    <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                      <Box w={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.SELLER.CUMULATIVE_SALES_AMOUNT)}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#556A7E'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {utils.parseDallar(sellerUserInfo?.totalSalesAmount)}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <HStack justifyContent={'space-between'} spacing={0}>
                  <Box w={'50%'}>
                    <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                      <Box w={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.SELLER.JOIN_DATE)}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#556A7E'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {utils.parseDateByCountryCode(
                            sellerUserInfo?.createdAt,
                            lang,
                          )}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box w={'50%'} />
                </HStack>
              </Box>
            </VStack>
            <ContentBR h={'2.5rem'} />
          </Box>

          <ContentBR h={'2.5rem'} />

          <Box w={'100%'} borderBottom={'1px solid #AEBDCA'}>
            <VStack spacing={'1rem'}>
              <Box w={'100%'}>
                <Text
                  color={'#485766'}
                  fontSize={'1.125rem'}
                  fontWeight={500}
                  lineHeight={'175%'}
                >
                  {localeText(LANGUAGES.PRODUCTS.REPRESENTATIVE_IMAGE)}
                </Text>
              </Box>

              <Box w={'100%'}>
                <HStack justifyContent={'space-between'} spacing={0}>
                  <Box w={'50%'}>
                    <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                      <Box w={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.SELLER.BUSINESS_NAME)}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#556A7E'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {sellerUserInfo?.companyName}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box w={'50%'}>
                    <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                      <Box w={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.SELLER.BRAND_NAME)}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#556A7E'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {sellerUserInfo?.brandName}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <HStack justifyContent={'space-between'} spacing={0}>
                  <Box w={'50%'}>
                    <HStack
                      justifyContent={'flex-start'}
                      spacing={'2rem'}
                      alignItems={'flex-start'}
                    >
                      <Box w={'12.5rem'} minW={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.SELLER.BUSINESS_BANNER)}
                        </Text>
                      </Box>
                      <Box>
                        <HStack
                          justifyContent={'flex-end'}
                          alignItems={'flex-end'}
                        >
                          <Center w={'5rem'} h={'5rem'}>
                            <ChakraImage
                              fallback={<DefaultSkeleton />}
                              w={'100%'}
                              h={'100%'}
                              src={sellerUserInfo?.brandBannerS3Url}
                            />
                          </Center>
                          <Text
                            color={'#556A7E'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {sellerUserInfo?.brandBannerOriginalName}
                          </Text>
                        </HStack>
                      </Box>
                    </HStack>
                  </Box>
                  <Box w={'50%'}>
                    <HStack
                      justifyContent={'flex-start'}
                      spacing={'2rem'}
                      alignItems={'flex-start'}
                    >
                      <Box w={'12.5rem'} minW={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.SELLER.BRAND_LOGO)}
                        </Text>
                      </Box>
                      <Box>
                        <HStack
                          justifyContent={'flex-end'}
                          alignItems={'flex-end'}
                        >
                          <Center w={'5rem'} h={'5rem'}>
                            <ChakraImage
                              fallback={<DefaultSkeleton />}
                              w={'100%'}
                              h={'100%'}
                              src={sellerUserInfo?.brandLogoS3Url}
                            />
                          </Center>
                          <Text
                            color={'#556A7E'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {sellerUserInfo?.brandLogoOriginalName}
                          </Text>
                        </HStack>
                      </Box>
                    </HStack>
                  </Box>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <HStack justifyContent={'space-between'} spacing={0}>
                  <Box w={'50%'}>
                    <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                      <Box w={'12.5rem'} minW={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.SELLER.BUSINESS_ADDRESS)}
                        </Text>
                      </Box>
                      <Box w={'100%'}>
                        <Text
                          color={'#556A7E'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                          whiteSpace={'pre-wrap'}
                        >
                          {handleAddr()}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box w={'50%'}>
                    <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                      <Box w={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.SELLER.BUSINESS_LICENSE_NUMBER)}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#556A7E'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {sellerUserInfo?.companyNumber}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <HStack justifyContent={'space-between'} spacing={0}>
                  <Box w={'50%'}>
                    <HStack
                      justifyContent={'flex-start'}
                      spacing={'2rem'}
                      alignItems={'flex-start'}
                    >
                      <Box w={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.SELLER.SETTLEMENT_ACCOUNTS)}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#556A7E'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {`${sellerUserInfo?.bankName || ''} ${sellerUserInfo?.bankNumber || ''}`}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box w={'50%'}>
                    <HStack
                      justifyContent={'flex-start'}
                      spacing={'2rem'}
                      alignItems={'flex-start'}
                    >
                      <Box w={'12.5rem'} minW={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.SELLER.BUSINESS_LICENSE)}
                        </Text>
                      </Box>
                      <Box>
                        <HStack
                          justifyContent={'flex-end'}
                          alignItems={'flex-end'}
                        >
                          <Center w={'5rem'} h={'5rem'}>
                            <ChakraImage
                              fallback={<DefaultSkeleton />}
                              w={'100%'}
                              h={'100%'}
                              src={sellerUserInfo?.companyCertificateS3Url}
                            />
                          </Center>
                          <Text
                            color={'#556A7E'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {sellerUserInfo?.companyCertificateOriginalName}
                          </Text>
                        </HStack>
                      </Box>
                    </HStack>
                  </Box>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <HStack justifyContent={'space-between'} spacing={0}>
                  <Box w={'50%'}>
                    <HStack
                      justifyContent={'flex-start'}
                      spacing={'2rem'}
                      alignItems={'flex-start'}
                    >
                      <Box w={'12.5rem'} minW={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.SELLER.PASSBOOK_COPIES)}
                        </Text>
                      </Box>
                      <Box>
                        <HStack
                          justifyContent={'flex-end'}
                          alignItems={'flex-end'}
                        >
                          <Center w={'5rem'} h={'5rem'}>
                            <ChakraImage
                              fallback={<DefaultSkeleton />}
                              w={'100%'}
                              h={'100%'}
                              src={sellerUserInfo?.accImageS3Url}
                            />
                          </Center>
                          <Text
                            color={'#556A7E'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {sellerUserInfo?.accImageOriginalName}
                          </Text>
                        </HStack>
                      </Box>
                    </HStack>
                  </Box>
                  <Box w={'50%'}>
                    <HStack
                      justifyContent={'flex-start'}
                      spacing={'2rem'}
                      alignItems={'flex-start'}
                    >
                      <Box w={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.SELLER.SHIPPING_METHODS)}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#556A7E'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {handleGetShippingMethod(
                            sellerUserInfo?.defaultShipping,
                          )}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <VStack spacing={'0.75rem'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.SELLER.DETAILED_DESCRIPTION)}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <QuillViewer html={sellerUserInfo?.info || ''} />
                  </Box>
                </VStack>
              </Box>
            </VStack>
            <ContentBR h={'2.5rem'} />
          </Box>

          <ContentBR h={'2.5rem'} />

          <Box>
            <Box w={'100%'}>
              <VStack spacing={'1.25rem'}>
                <Box w={'100%'}>
                  <HStack justifyContent={'space-between'}>
                    <Text
                      fontSize={'1.125rem'}
                      fontWeight={500}
                      lineHeight={'1.96875rem'}
                      color={'#485766'}
                      textAlign={'right'}
                    >
                      {localeText(LANGUAGES.SELLER.SALES_LIST)}
                    </Text>
                    <Box w={'25rem'}>
                      <SearchInput
                        value={searchBy}
                        onChange={(e) => {
                          setSearchBy(e.target.value);
                        }}
                        onClick={() => {
                          handleGetListSellerProductAgent();
                        }}
                        placeholder={localeText(
                          LANGUAGES.COMMON.PH_SEARCH_TERM,
                        )}
                        placeholderFontColor={'#A7C3D2'}
                      />
                    </Box>
                  </HStack>
                </Box>

                <Box w={'100%'}>
                  <VStack spacing={0}>
                    <Flex
                      alignSelf="stretch"
                      px={'1rem'}
                      py={'0.75rem'}
                      borderTop={'1px solid #73829D'}
                      justifyContent={'flex-start'}
                      alignItems={'center'}
                      gap={'0.75rem'}
                      display={'inline-flex'}
                    >
                      <Box
                        flex={'1 1 0'}
                        justifyContent={'center'}
                        display={'flex'}
                        flexDirection={'column'}
                      >
                        <Text
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                        >
                          {localeText(LANGUAGES.SELLER.PRODUCT)}
                        </Text>
                      </Box>

                      <Box
                        width={'8.75rem'}
                        textAlign="center"
                        display="flex"
                        flexDirection="column"
                      >
                        <Text
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                        >
                          {localeText(LANGUAGES.SELLER.SALES_AMOUNT)}
                        </Text>
                      </Box>

                      <Box
                        width={'10rem'}
                        textAlign="center"
                        display="flex"
                        flexDirection="column"
                      >
                        <Text
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                        >
                          {localeText(LANGUAGES.SELLER.CATEGORY)}
                        </Text>
                      </Box>

                      <Box
                        width={'5rem'}
                        textAlign="center"
                        display="flex"
                        flexDirection="column"
                      >
                        <Text
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                        >
                          {localeText(LANGUAGES.SELLER.STATE)}
                        </Text>
                      </Box>

                      <Box
                        width={'5rem'}
                        textAlign="center"
                        display="flex"
                        flexDirection="column"
                      >
                        <Text
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                        >
                          {localeText(LANGUAGES.SELLER.STOCK)}
                        </Text>
                      </Box>

                      <Box
                        width={'6.25rem'}
                        textAlign="center"
                        display="flex"
                        flexDirection="column"
                      >
                        <Text
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                        >
                          {localeText(LANGUAGES.SELLER.REGISTRATION)}
                        </Text>
                      </Box>

                      <Box
                        width={'6.25rem'}
                        textAlign="center"
                        display="flex"
                        flexDirection="column"
                      >
                        <Text
                          color={'#2A333C'}
                          fontSize={'0.9375rem'}
                          fontWeight={500}
                        >
                          {localeText(LANGUAGES.SELLER.MODIFIED)}
                        </Text>
                      </Box>
                    </Flex>

                    <Box w={'100%'}>
                      <VStack spacing={'0.75rem'}>
                        <Box
                          w={'100%'}
                          // h={'18rem'}
                          overflowY={'auto'}
                          className="no-scroll"
                          borderBottom={'1px solid #AEBDCA'}
                          boxSizing={'border-box'}
                        >
                          <VStack spacing={0}>
                            {listProduct.map((item, index) => {
                              return productCard(item, index);
                            })}
                            {listProduct.length === 0 && (
                              <Center w={'100%'} h={'10rem'}>
                                <Text
                                  fontSize={'1.5rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {localeText(LANGUAGES.INFO_MSG.NOT_SEARCHED)}
                                </Text>
                              </Center>
                            )}
                          </VStack>
                        </Box>
                        <Box w={'100%'}>
                          <HStack justifyContent={'space-between'}>
                            <Box w={'6.125rem'}>
                              <Select
                                value={contentNum}
                                onChange={(e) => {
                                  setContentNum(e.target.value);
                                }}
                                py={'0.75rem'}
                                pl={'1rem'}
                                p={0}
                                w={'100%'}
                                h={'3rem'}
                                bg={'#FFF'}
                                boxSizing={'border-box'}
                                borderRadius={'0.25rem'}
                                border={'1px solid #9CADBE'}
                              >
                                {LIST_CONTENT_NUM.map((value, index) => {
                                  return (
                                    <option value={value} key={index}>
                                      {value}
                                    </option>
                                  );
                                })}
                              </Select>
                            </Box>

                            <Box>
                              <DefaultPaginate
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalCount={totalCount}
                                contentNum={contentNum}
                              />
                            </Box>
                          </HStack>
                        </Box>
                      </VStack>
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </Box>

          <ContentBR h={'1.25rem'} />
        </Box>
      )}
    </MainContainer>
  );
};

export default SellerDetailProductPage;
