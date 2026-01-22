'use client';

import { COUNTRY, LANGUAGES } from '@/constants/lang';
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
  RadioGroup,
  Radio,
  Input,
  Switch,
} from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CustomIcon } from '@/components';
import DragAndDrop from '@/components/input/file/DragAndDrop';

import dynamic from 'next/dynamic';
import useMove from '@/hooks/useMove';
import utils from '@/utils';
import useMenu from '@/hooks/useMenu';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import productApi from '@/services/productApi';
import { SUCCESS } from '@/constants/errorCode';
import useModal from '@/hooks/useModal';
import useDevice from '@/hooks/useDevice';
import { useRecoilValue } from 'recoil';
import { selectedProductState } from '@/stores/dataRecoil';
import MainContainer from '@/components/layout/MainContainer';
import ContentBR from '@/components/custom/ContentBR';
const CustomEditor = dynamic(() => import('@/components/input/CustomEditor'), {
  ssr: false,
});

const ProductsDetailActionPage = () => {
  const { isMobile, clampW } = useDevice();

  const { action } = useParams();
  const { moveBack } = useMove();
  const { openModal } = useModal();
  const { lang, localeText } = useLocale();

  const selectedProduct = useRecoilValue(selectedProductState);

  const [listImage, setListImages] = useState([]);
  const [listOption, setListOption] = useState([]);
  const [listCondition, setListCondition] = useState([]);
  const [listDeleteImage, setListDeleteImage] = useState([]);
  const [listDeleteOption, setListDeleteOption] = useState(new Set());
  const [listDeleteCondition, setListDeleteCondition] = useState(new Set());

  const [firstCategoryId, setFirstCategoryId] = useState(0);
  const [secondCategoryId, setSecondCategoryId] = useState(0);
  const [thirdCategoryId, setThirdCategoryId] = useState(0);
  const [status, setStatus] = useState(1);
  const [approvalStatus, setApprovalStatus] = useState(false);
  const [type, setType] = useState(1);
  const [name, setName] = useState(null);
  const [msrp, setMsrp] = useState(0);
  const [wp, setWp] = useState(0);
  const [stockFlag, setStockFlag] = useState(1);
  const [stockCnt, setStockCnt] = useState(0);
  const [minOrderCnt, setMinOrderCnt] = useState(0);
  const [info, setInfo] = useState('');

  const [files, setFiles] = useState([]);

  const originOptionListRef = useRef([]);
  const originDiscountListRef = useRef([]);

  const {
    listAllCategory,
    handleAllCategory,
    listFirstCategory,
    setListFirstCategory,
    listSecondCategory,
    setListSecondCategory,
    listThirdCategory,
    setListThirdCategory,
    handleGetFirstCategory,
    handleGetSecondCategory,
    handleGetThirdCategory,
    handleFindCategoryById,
    handleGetCategoryByName,
  } = useMenu();

  // 카테고리 처리
  useEffect(() => {
    if (listAllCategory.length > 0) {
      setListFirstCategory(listAllCategory);
    } else {
      handleAllCategory();
    }
  }, [listAllCategory]);

  useEffect(() => {
    const find = async () => {
      const result = await handleFindCategoryById(firstCategoryId);
      if (result?.secondCategoryDataList) {
        setListSecondCategory(result.secondCategoryDataList);
      } else {
        setListSecondCategory([]);
      }
    };
    if (utils.isNotEmpty(firstCategoryId)) {
      find();
    }
  }, [firstCategoryId]);

  useEffect(() => {
    const find = async () => {
      const result = await handleFindCategoryById(null, secondCategoryId);
      if (result?.thirdCategoryDataList) {
        setListThirdCategory(result.thirdCategoryDataList);
      } else {
        setListThirdCategory([]);
      }
    };
    if (utils.isNotEmpty(secondCategoryId)) {
      find();
    }
  }, [secondCategoryId]);

  useEffect(() => {
    if (action === 'modify') {
      if (selectedProduct?.productId) {
        handleGetProduct();
      }
    }
  }, [action]);

  const handleGetProduct = async () => {
    const param = {
      productId: selectedProduct.productId,
    };
    const result = await productApi.getProduct(param);
    if (result?.errorCode === SUCCESS) {
      handleSetModifyDetail(result.data);
    }
  };

  const handleSetModifyDetail = async (item) => {
    const name = item?.name;
    const type = item?.type;
    const content = item?.content;
    const status = item?.status;
    const brandName = item?.brandName;
    const approvalStatus = item?.approvalStatus;
    const msrp = item?.msrp;
    const wp = item?.wp;
    const firstCategoryId = item?.firstCategoryId || null;
    const secondCategoryId = item?.secondCategoryId || null;
    const thirdCategoryId = item?.thirdCategoryId || null;
    const orderCnt = item?.orderCnt;
    const stockCnt = item?.stockCnt;
    const stockFlag = item?.stockFlag || 1;
    const cartCnt = item?.cartCnt;
    const favoritesCnt = item?.favoritesCnt;
    const promotionList = item?.promotionList || [];
    const productImageList = item?.productImageList || [];
    const productOptionList = item?.productOptionList || [];
    const productDiscountList = item?.productDiscountList || [];
    const minOrderCnt = item?.minOrderCnt || 0;

    setName(name);
    setType(type);
    setInfo(content);
    setStatus(status);
    setApprovalStatus(approvalStatus === 1 ? true : false);
    setMsrp(msrp);
    setWp(wp);
    setMinOrderCnt(minOrderCnt);
    setStockFlag(stockFlag);
    setStockCnt(stockCnt);
    setFirstCategoryId(firstCategoryId);
    if (secondCategoryId) {
      setSecondCategoryId(secondCategoryId);
    }
    if (thirdCategoryId) {
      setThirdCategoryId(thirdCategoryId);
    }
    if (productImageList.length > 0) {
      /*
      const tempFiles = [];
      const listFiles = await Promise.all(
        productImageList.map(async (item) => {
          const image = item.imageS3Url;
          const file = await utils.parseUrlToFile(image);
          return file;
        }),
      );
      console.log('listFiles', listFiles);
      // setFiles(files);
      */
      productImageList.map(async (item) => {
        setListImages((prev) => {
          return [...prev, item];
        });
        const image = item.imageS3Url;
        setFiles((prev) => {
          return [...prev, image];
        });
      });
    }
    if (productOptionList.length > 0) {
      originOptionListRef.current = productOptionList;
      setListOption(productOptionList);
    }
    if (productDiscountList.length > 0) {
      originDiscountListRef.current = productDiscountList;
      setListCondition(productDiscountList);
    }
  };

  const handleAction = () => {
    if (action === 'modify') {
      handlePatchProduct();
    } else {
      handlePostProduct();
    }
  };

  const checkParam = () => {
    if (utils.isEmpty(firstCategoryId)) {
      openModal({ text: localeText(LANGUAGES.INFO_MSG.SELECT_AN_FIRST) });
      return false;
    }
    if (utils.isEmpty(secondCategoryId)) {
      openModal({ text: localeText(LANGUAGES.INFO_MSG.SELECT_AN_SECOND) });
      return false;
    }
    /*
    if (utils.isEmpty(status)) {
      console.log('status');
      return false;
    }
    if (utils.isEmpty(approvalStatus)) {
      console.log('approvalStatus');
      return false;
    }
    if (utils.isEmpty(type)) {
      console.log('type');
      return false;
    }
    */
    if (utils.isEmpty(name)) {
      openModal({ text: localeText(LANGUAGES.INFO_MSG.ENTER_RPODUCT_NAME) });
      return false;
    }
    if (utils.isEmpty(msrp)) {
      openModal({ text: localeText(LANGUAGES.INFO_MSG.ENTER_MSRP_AMOUNT) });
      return false;
    }
    if (utils.isEmpty(wp)) {
      openModal({ text: localeText(LANGUAGES.INFO_MSG.ENTER_SUPPLY_PRICE) });
      return false;
    }
    if (utils.isEmpty(info)) {
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.ENTER_PRODUCT_DESCRIPTION),
      });
      return false;
    }

    if (listOption.length > 0) {
      try {
        listOption.forEach((option) => {
          if (utils.isEmpty(option.name)) {
            throw new Error(localeText(LANGUAGES.INFO_MSG.ENTER_OPTION_NAME));
          }
        });
      } catch (e) {
        openModal({ text: e.message });
        return false;
      }
    }

    if (utils.isEmpty(minOrderCnt)) {
      openModal({
        text: localeText(LANGUAGES.PRODUCTS.PH_MINIMUM_PURCHASE_QUANTITY),
      });
      return false;
    }

    if (action !== 'modify') {
      if (files.length === 0) {
        openModal({
          text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_UPLOAD_FILE),
        });
        return false;
      }
    }
    return true;
  };

  const handlePostProduct = async () => {
    if (!checkParam()) return;

    const param = {
      firstCategoryId: firstCategoryId,
      secondCategoryId: secondCategoryId,
      status: status,
      approvalStatus: approvalStatus === true ? 1 : 2,
      type: type,
      name: name,
      msrp: msrp,
      wp: wp,
      content: info,
      stockFlag: stockFlag,
    };

    if (stockCnt > 0) {
      param.stockCnt = stockCnt;
    } else {
      param.stockCnt = 0;
    }

    if (thirdCategoryId) {
      param.thirdCategoryId = thirdCategoryId;
    }
    if (minOrderCnt) {
      param.minOrderCnt = minOrderCnt;
    }

    if (listOption.length > 0) {
      param.rqAddProductOptionDTOList = [...listOption];
    }
    if (listCondition.length > 0) {
      param.rqAddProductDiscountDTOList = [...listCondition];
    }

    const result = await productApi.postProduct(param, files);

    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result.message,
        onAgree: () => {
          moveBack();
        },
      });
    }
  };

  const handlePatchProduct = async () => {
    if (!checkParam()) return;

    const param = {
      productId: selectedProduct.productId,
      firstCategoryId: firstCategoryId,
      status: status,
      approvalStatus: approvalStatus === true ? 1 : 2,
      type: type,
      name: name,
      msrp: msrp,
      wp: wp,
      content: info,
      stockFlag: stockFlag,
    };

    // stockFlag가 1일 때만 stockCnt 포함
    if (stockCnt > 0) {
      param.stockCnt = stockCnt;
    } else {
      param.stockCnt = 0;
    }

    if (secondCategoryId) {
      param.secondCategoryId = secondCategoryId;
    }
    if (thirdCategoryId) {
      param.thirdCategoryId = thirdCategoryId;
    }
    if (minOrderCnt) {
      param.minOrderCnt = minOrderCnt;
    }
    // 옵션 비교 및 분기 처리
    const originOptionList = originOptionListRef.current;

    const rqModifyProductOptionDTOList = listOption.filter((opt) =>
      originOptionList.find(
        (o) =>
          o.productOptionId === opt.productOptionId &&
          (o.name !== opt.name || o.price !== opt.price),
      ),
    );

    const rqAddProductOptionDTOList = listOption.filter(
      (opt) => !opt.productOptionId,
    );

    const deleteProductOptionIdList = originOptionList
      .filter(
        (o) =>
          !listOption.find((opt) => opt.productOptionId === o.productOptionId),
      )
      .map((o) => o.productOptionId);

    if (rqModifyProductOptionDTOList.length > 0) {
      param.rqModifyProductOptionDTOList = rqModifyProductOptionDTOList;
    }
    if (rqAddProductOptionDTOList.length > 0) {
      param.rqAddProductOptionDTOList = rqAddProductOptionDTOList;
    }
    if (deleteProductOptionIdList.length > 0) {
      param.deleteProductOptionIdList = deleteProductOptionIdList;
    }

    // 할인 조건 비교 및 분기 처리
    const originDiscountList = originDiscountListRef.current;

    const rqModifyProductDiscountDTOList = listCondition.filter((item) =>
      originDiscountList.find(
        (o) =>
          o.productDiscountId === item.productDiscountId &&
          (o.type !== item.type ||
            o.amount !== item.amount ||
            o.startDate !== item.startDate ||
            o.endDate !== item.endDate),
      ),
    );

    const rqAddProductDiscountDTOList = listCondition.filter(
      (item) => !item.productDiscountId,
    );

    const deleteProductDiscountIdList = originDiscountList
      .filter(
        (o) =>
          !listCondition.find(
            (item) => item.productDiscountId === o.productDiscountId,
          ),
      )
      .map((o) => o.productDiscountId);

    if (rqModifyProductDiscountDTOList.length > 0) {
      param.rqModifyProductDiscountDTOList = rqModifyProductDiscountDTOList;
    }
    if (rqAddProductDiscountDTOList.length > 0) {
      param.rqAddProductDiscountDTOList = rqAddProductDiscountDTOList;
    }
    if (deleteProductDiscountIdList.length > 0) {
      param.deleteProductDiscountIdList = deleteProductDiscountIdList;
    }

    const deleteProductImageIdList = Array.from(listDeleteImage);
    if (deleteProductImageIdList.length > 0) {
      param.deleteProductImageIdList = deleteProductImageIdList;
    }

    const fileObjectsOnly = files.filter((file) => file instanceof File);

    const result = await productApi.patchProduct(param, fileObjectsOnly);
    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result.message,
        onAgree: () => {
          moveBack();
        },
      });
    }
  };

  const handleRemoveImage = useCallback((index) => {
    let tempFiles = [...files];
    tempFiles.splice(index, 1);
    setFiles(tempFiles);
  });

  const handleDiscountText = (item) => {
    let text = null;
    const type = item.type;
    if (type === 1) {
      text = `% ${localeText(LANGUAGES.PRODUCTS.DISCOUNT)}`;
    } else {
      if (lang === COUNTRY.COUNTRY_INFO.KR.LANG) {
        text = `$ ${localeText(LANGUAGES.PRODUCTS.DISCOUNT)}`;
      } else {
        text = ` ${localeText(LANGUAGES.PRODUCTS.DISCOUNT)}`;
      }
    }
    return text;
  };

  return isMobile(true) ? (
    <MainContainer
      // title={name ? name : localeText(LANGUAGES.PRODUCTS.PRODUCT_NAME)}
      title={localeText(LANGUAGES.PRODUCTS.PRODUCT)}
      isDetailHeader
    >
      <Box
        w={'100%'}
        px={clampW(1, 5)}
        h={'calc(100%)'}
        overflowY={'auto'}
        mb={'6.5rem'}
      >
        <VStack spacing={0} w={'100%'} h={'100%'}>
          {/* 상품정보 */}
          <Box w={'100%'}>
            <VStack spacing={'1.25rem'}>
              <Box w={'100%'}>
                <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                  <Box w={'8.75rem'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.PRODUCTS.STATUS)}
                    </Text>
                  </Box>
                  <Box>
                    <RadioGroup
                      w={'100%'}
                      defaultValue="1"
                      value={status}
                      onChange={(value) => {
                        setStatus(Number(value));
                      }}
                    >
                      <VStack spacing={'0.75rem'} alignItems={'flex-start'}>
                        <Radio value={1}>
                          <Text
                            color={'#556A7E'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.ON_SALE)}
                          </Text>
                        </Radio>
                        <Radio value={2}>
                          <Text
                            color={'#556A7E'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.STOP_SELLING)}
                          </Text>
                        </Radio>
                        <Radio value={3}>
                          <Text
                            color={'#556A7E'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.OUT_OF_STOCK)}
                          </Text>
                        </Radio>
                      </VStack>
                    </RadioGroup>
                  </Box>
                </HStack>
              </Box>

              {/*
            <Box w={'100%'}>
              <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                <Box w={'12.5rem'}>
                  <Text
                    color={'#7895B2'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {localeText(
                      LANGUAGES.PRODUCTS.AFFILIATE_PROMOTIONS,
                    )}
                  </Text>
                </Box>
                <Box>
                  <Text
                    color={'#556A7E'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    Best seller
                  </Text>
                </Box>
              </HStack>
            </Box>
            */}

              <Box w={'100%'}>
                <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                  <Box w={'8.75rem'} minW={'8.75rem'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.PRODUCTS.PRODUCT_NAME)}
                    </Text>
                  </Box>
                  <Box h={'3rem'}>
                    <Input
                      h={'100%'}
                      placeholder={localeText(
                        LANGUAGES.PRODUCTS.PH_PRODUCT_NAME,
                      )}
                      _placeholder={{
                        fontWeight: 400,
                        fontSize: '0.9375rem',
                        color: '#7895B2',
                      }}
                      color={'#485766'}
                      border={'1px solid #9CADBE'}
                      px={'1rem'}
                      py={'0.75rem'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      value={name || ''}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                  </Box>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                  <Box w={'8.75rem'} minW={'8.75rem'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.PRODUCTS.MOCRA_FDA_APPROVED)}
                    </Text>
                  </Box>
                  <Box>
                    <Switch
                      isChecked={approvalStatus}
                      onChange={(e) => {
                        setApprovalStatus(e.target.checked);
                      }}
                    />
                  </Box>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <VStack spacing={'0.5rem'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.PRODUCTS.CATEGORY)}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <HStack
                      justifyContent={'space-between'}
                      spacing={'0.75rem'}
                    >
                      <Box w={'33%'}>
                        <Select
                          value={Number(firstCategoryId)}
                          onChange={(e) => {
                            setSecondCategoryId(0);
                            setThirdCategoryId(0);
                            setFirstCategoryId(Number(e.target.value));
                          }}
                          w={'100%'}
                          h={'3rem'}
                          bg={'#FFF'}
                          borderRadius={'0.25rem'}
                          boxSizing={'border-box'}
                          border={'1px solid #9CADBE'}
                        >
                          <option value={0}>1st</option>
                          {listFirstCategory.map((item, index) => {
                            return (
                              <option value={item.firstCategoryId} key={index}>
                                {item.name}
                              </option>
                            );
                          })}
                        </Select>
                      </Box>
                      <Box w={'33%'}>
                        <Select
                          value={Number(secondCategoryId)}
                          onChange={(e) => {
                            setThirdCategoryId(0);
                            setSecondCategoryId(Number(e.target.value));
                          }}
                          w={'100%'}
                          h={'3rem'}
                          bg={'#FFF'}
                          borderRadius={'0.25rem'}
                          boxSizing={'border-box'}
                          border={'1px solid #9CADBE'}
                        >
                          <option value={0}>2st</option>
                          {listSecondCategory.map((item, index) => {
                            return (
                              <option value={item.secondCategoryId} key={index}>
                                {item.name}
                              </option>
                            );
                          })}
                        </Select>
                      </Box>
                      <Box w={'33%'}>
                        <Select
                          value={Number(thirdCategoryId)}
                          onChange={(e) => {
                            setThirdCategoryId(Number(e.target.value));
                          }}
                          w={'100%'}
                          h={'3rem'}
                          bg={'#FFF'}
                          borderRadius={'0.25rem'}
                          boxSizing={'border-box'}
                          border={'1px solid #9CADBE'}
                        >
                          <option value={0}>3st</option>
                          {listThirdCategory.map((item, index) => {
                            return (
                              <option value={item.thirdCategoryId} key={index}>
                                {item.name}
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
                <VStack
                  alignItems={'flex-start'}
                  justifyContent={'flex-start'}
                  spacing={'0.5rem'}
                >
                  <Box w={'100%'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.PRODUCTS.OPTION)}
                    </Text>
                  </Box>
                  <Box w="100%">
                    <VStack spacing={'0.75rem'}>
                      {listOption.map((item, index) => {
                        return (
                          <Box w={'100%'} key={index}>
                            <HStack
                              spacing={'0.5rem'}
                              alignItems={'center'}
                              justifyContent={'space-between'}
                            >
                              <Box w={'100%'} h={'3rem'}>
                                <Input
                                  h={'100%'}
                                  placeholder={localeText(
                                    LANGUAGES.PRODUCTS.PH_OPTION,
                                  )}
                                  _placeholder={{
                                    fontWeight: 400,
                                    fontSize: '0.9375rem',
                                    color: '#7895B2',
                                  }}
                                  color={'#66809C'}
                                  border={'1px solid #9CADBE'}
                                  px={'1rem'}
                                  py={'0.75rem'}
                                  fontSize={'0.9375rem'}
                                  fontWeight={400}
                                  value={item.name}
                                  onChange={(e) => {
                                    const newList = [...listOption];
                                    newList[index] = {
                                      ...newList[index],
                                      name: e.target.value,
                                    };
                                    setListOption(newList);
                                  }}
                                />
                              </Box>

                              <Center
                                w={'1.5rem'}
                                h={'1.5rem'}
                                cursor={'pointer'}
                                onClick={() => {
                                  const newList = [...listOption];
                                  // delete
                                  const deleteItem = newList[index];
                                  if (deleteItem?.productOptionId) {
                                    const newDeleteItems = new Set(
                                      listDeleteOption,
                                    );
                                    if (
                                      !newDeleteItems.has(
                                        deleteItem.productOptionId,
                                      )
                                    ) {
                                      newDeleteItems.add(
                                        deleteItem.productOptionId,
                                      );
                                    }
                                    setListDeleteOption(newDeleteItems);
                                  }
                                  //
                                  newList.splice(index, 1);
                                  setListOption(newList);
                                }}
                              >
                                <CustomIcon name="close" color={'#7895B2'} />
                              </Center>
                            </HStack>
                          </Box>
                        );
                      })}

                      <Box
                        w={'100%'}
                        h={listOption.length > 0 ? null : '3rem'}
                        alignContent={listOption.length > 0 ? null : 'center'}
                        onClick={() => {
                          const tempList = [...listOption];
                          tempList.push({
                            name: '',
                            price: 0,
                          });
                          setListOption(tempList);
                        }}
                      >
                        <Text
                          color={'#556A7E'}
                          fontSize={'1rem'}
                          fontWeight={500}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.ADD_OPTION)}
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                </VStack>
              </Box>

              <Box w={'100%'}>
                <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                  <Box w={'8.75rem'} minW={'8.75rem'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.PRODUCTS.TYPE)}
                    </Text>
                  </Box>
                  <Box w={'100%'} h={'3rem'}>
                    <Select
                      value={type}
                      onChange={(e) => {
                        setType(Number(e.target.value));
                      }}
                      w={'100%'}
                      h={'3rem'}
                      bg={'#FFF'}
                      borderRadius={'0.25rem'}
                      border={'1px solid #9CADBE'}
                    >
                      <option value={0}>
                        {localeText(LANGUAGES.PRODUCTS.ALL)}
                      </option>
                      <option value={1}>
                        {localeText(LANGUAGES.COMMON.NONE)}
                      </option>
                      <option value={2}>{localeText(LANGUAGES.DRY)}</option>
                      <option value={3}>{localeText(LANGUAGES.OILY)}</option>
                      <option value={4}>
                        {localeText(LANGUAGES.SENSITIVE)}
                      </option>
                      <option value={5}>{localeText(LANGUAGES.ACNE)}</option>
                      <option value={6}>{localeText(LANGUAGES.NORMAL)}</option>
                    </Select>
                  </Box>
                </HStack>
              </Box>
            </VStack>
          </Box>

          <ContentBR h={'1.25rem'} />

          <Divider borderTop={'1px solid #AEBDCA'} />

          <ContentBR h={'1.25rem'} />

          {/* 파일업로드 */}
          <Box w={'100%'}>
            <VStack spacing={'0.75rem'}>
              {files.length < 5 && (
                <Box w={'100%'}>
                  <DragAndDrop
                    files={files}
                    maxFiles={5}
                    onChange={(files) => {
                      setFiles(files);
                    }}
                  />
                </Box>
              )}

              <Box w={'100%'} minH={'6.25rem'}>
                <HStack spacing={'1.25rem'} overflowX={'auto'}>
                  {files.map((file, index) => {
                    const key = `img_${index}`;
                    return (
                      <Center
                        position={'relative'}
                        w={'6.25rem'}
                        h={'6.25rem'}
                        key={key}
                      >
                        <ChakraImage
                          fallback={<DefaultSkeleton />}
                          w={'100%'}
                          h={'100%'}
                          objectFit={'cover'}
                          src={
                            typeof file === 'string'
                              ? file
                              : URL.createObjectURL(file)
                          }
                        />
                        <Center
                          cursor={'pointer'}
                          onClick={() => {
                            const newList = [...listImage];
                            const deleteItem = newList[index];
                            if (deleteItem?.productImageId) {
                              const newDeleteItems = new Set(listDeleteImage);
                              if (
                                !newDeleteItems.has(deleteItem.productImageId)
                              ) {
                                newDeleteItems.add(deleteItem.productImageId);
                              }
                              setListDeleteImage(newDeleteItems);
                            }
                            //
                            handleRemoveImage(index);
                          }}
                          w={'1.5rem'}
                          h={'1.5rem'}
                          position={'absolute'}
                          top={'0.5rem'}
                          right={'0.5rem'}
                          transform="translate(30%, -30%)"
                          bg={'#FFF'}
                          border={'1px solid #7895B2'}
                          borderRadius={'50%'}
                        >
                          <CustomIcon name={'minus'} color={'#7895B2'} />
                        </Center>
                      </Center>
                    );
                  })}
                </HStack>
              </Box>
            </VStack>
          </Box>

          {/* 설명 */}
          <Box w={'100%'}>
            <VStack spacing={'0.75rem'}>
              <Box w={'100%'}>
                <Text
                  color={'#485766'}
                  fontSize={'1.125rem'}
                  fontWeight={500}
                  lineHeight={'1.96875rem'}
                >
                  {localeText(LANGUAGES.PRODUCTS.ENTER_PRODUCT_DESCRIPTION)}
                </Text>
              </Box>
              <Box w={'100%'} h={'100%'}>
                <CustomEditor info={info} setInfo={setInfo} isVideo />
              </Box>
            </VStack>
          </Box>

          <ContentBR h={'1.25rem'} />

          <Box
            w={'100%'}
            p={'1.25rem'}
            border={'1px solid #AEBDCA'}
            boxSizing={'border-box'}
          >
            <VStack spacing={'1.25rem'}>
              <Box w={'100%'}>
                <Text
                  color={'#485766'}
                  fontSize={'1.125rem'}
                  fontWeight={500}
                  lineHeight={'1.96875rem'}
                >
                  {localeText(LANGUAGES.PRODUCTS.SALES_INFORMATION)}
                </Text>
              </Box>

              <Divider borderTop={'1px solid #AEBDCA'} />

              <Box w={'100%'}>
                <VStack spacing={'0.75rem'}>
                  <Box w={'100%'}>
                    <HStack justifyContent={'space-between'}>
                      <Box w={'10rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.MSRP)}
                        </Text>
                      </Box>
                      <Box>
                        <HStack spacing={'0.25rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'1.125rem'}
                            fontWeight={400}
                            lineHeight={'1.96875rem'}
                          >
                            $
                          </Text>
                          <Box w={'12.75rem'} h={'3rem'}>
                            <Input
                              h={'100%'}
                              placeholder={localeText(
                                LANGUAGES.PRODUCTS.PH_AMOUNT,
                              )}
                              onFocus={(e) => {
                                if (Number(e.target.value) === 0) {
                                  e.target.value = '';
                                }
                              }}
                              onBlur={(e) => {
                                if (utils.isEmpty(e.target.value)) {
                                  e.target.value = 0;
                                }
                              }}
                              _placeholder={{
                                fontWeight: 400,
                                fontSize: '0.9375rem',
                                color: '#7895B2',
                              }}
                              border={'1px solid #9CADBE'}
                              px={'1rem'}
                              py={'0.75rem'}
                              type={'number'}
                              color={'#485766'}
                              fontSize={'0.9375rem'}
                              textAlign={'right'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                              value={msrp}
                              onChange={(e) => {
                                setMsrp(Number(e.target.value));
                              }}
                            />
                          </Box>
                        </HStack>
                      </Box>
                    </HStack>
                  </Box>
                  <Box w={'100%'}>
                    <HStack justifyContent={'space-between'}>
                      <Box w={'10rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.SUPPLY_PRICE)}
                        </Text>
                      </Box>
                      <Box>
                        <HStack spacing={'0.25rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'1.125rem'}
                            fontWeight={400}
                            lineHeight={'1.96875rem'}
                          >
                            $
                          </Text>
                          <Box w={'12.75rem'} h={'3rem'}>
                            <Input
                              h={'100%'}
                              placeholder={localeText(
                                LANGUAGES.PRODUCTS.PH_AMOUNT,
                              )}
                              _placeholder={{
                                fontWeight: 400,
                                fontSize: '0.9375rem',
                                color: '#7895B2',
                              }}
                              onFocus={(e) => {
                                if (Number(e.target.value) === 0) {
                                  e.target.value = '';
                                }
                              }}
                              onBlur={(e) => {
                                if (utils.isEmpty(e.target.value)) {
                                  e.target.value = 0;
                                }
                              }}
                              border={'1px solid #9CADBE'}
                              px={'1rem'}
                              py={'0.75rem'}
                              type={'number'}
                              color={'#485766'}
                              fontSize={'0.9375rem'}
                              textAlign={'right'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                              value={wp}
                              onChange={(e) => {
                                setWp(Number(e.target.value));
                              }}
                            />
                          </Box>
                        </HStack>
                      </Box>
                    </HStack>
                  </Box>
                  <Box w={'100%'}>
                    <HStack justifyContent={'space-between'}>
                      <Box w={'10rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.INVENTORY_MANAGEMENT)}
                        </Text>
                      </Box>
                      <Box w={'13.75rem'}>
                        <RadioGroup
                          w={'100%'}
                          value={stockFlag}
                          onChange={(value) => {
                            setStockFlag(Number(value));
                          }}
                        >
                          <HStack
                            spacing={'1rem'}
                            justifyContent={'space-between'}
                          >
                            <Radio value={1}>
                              <Text
                                color={'#556A7E'}
                                fontSize={'0.9375rem'}
                                fontWeight={400}
                                lineHeight={'1.5rem'}
                              >
                                {localeText(LANGUAGES.PRODUCTS.ENABLED)}
                              </Text>
                            </Radio>
                            <Radio value={2}>
                              <Text
                                color={'#556A7E'}
                                fontSize={'0.9375rem'}
                                fontWeight={400}
                                lineHeight={'1.5rem'}
                              >
                                {localeText(LANGUAGES.PRODUCTS.DISABLED)}
                              </Text>
                            </Radio>
                          </HStack>
                        </RadioGroup>
                      </Box>
                    </HStack>
                  </Box>
                  <Box w={'100%'}>
                    <HStack justifyContent={'space-between'}>
                      <Box w={'10rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.INVENTORY_QUANTITY)}
                        </Text>
                      </Box>
                      <Box w={'13.75rem'} h={'3rem'}>
                        <Input
                          h={'100%'}
                          placeholder={localeText(
                            LANGUAGES.PRODUCTS.INVENTORY_QUANTITY,
                          )}
                          isDisabled={stockFlag === 2}
                          _placeholder={{
                            fontWeight: 400,
                            fontSize: '0.9375rem',
                            color: '#7895B2',
                          }}
                          border={'1px solid #9CADBE'}
                          px={'1rem'}
                          py={'0.75rem'}
                          type={'number'}
                          onFocus={(e) => {
                            if (Number(e.target.value) === 0) {
                              e.target.value = '';
                            }
                          }}
                          onBlur={(e) => {
                            if (utils.isEmpty(e.target.value)) {
                              e.target.value = 0;
                            }
                          }}
                          color={'#556A7E'}
                          fontSize={'0.9375rem'}
                          textAlign={'right'}
                          fontWeight={400}
                          lineHeight={'1.75rem'}
                          value={stockCnt}
                          onChange={(e) => {
                            setStockCnt(Number(e.target.value));
                          }}
                        />
                      </Box>
                    </HStack>
                  </Box>
                  <Box w={'100%'}>
                    <HStack justifyContent={'space-between'}>
                      <Box w={'10rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(
                            LANGUAGES.PRODUCTS.MINIMUM_PURCHASE_QUANTITY,
                          )}
                        </Text>
                      </Box>
                      <Box w={'13.75rem'} h={'3rem'}>
                        <Input
                          h={'100%'}
                          placeholder={localeText(
                            LANGUAGES.PRODUCTS.PURCHASE_QUANTITY,
                          )}
                          _placeholder={{
                            fontWeight: 400,
                            fontSize: '0.9375rem',
                            color: '#7895B2',
                          }}
                          border={'1px solid #9CADBE'}
                          px={'1rem'}
                          py={'0.75rem'}
                          type={'text'}
                          onFocus={(e) => {
                            if (Number(e.target.value) === 0) {
                              e.target.value = '';
                            }
                          }}
                          onBlur={(e) => {
                            if (utils.isEmpty(e.target.value)) {
                              e.target.value = 0;
                            }
                          }}
                          color={'#556A7E'}
                          fontSize={'0.9375rem'}
                          textAlign={'right'}
                          fontWeight={400}
                          lineHeight={'1.75rem'}
                          value={minOrderCnt}
                          onChange={(e) => {
                            const value = e.target.value;
                            const regex = /^[0-9]*$/;
                            if (regex.test(value)) {
                              setMinOrderCnt(Number(value));
                            }
                          }}
                        />
                      </Box>
                    </HStack>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </Box>

          <ContentBR h={'1.25rem'} />

          <Box
            w={'100%'}
            p={'1.25rem'}
            border={'1px solid #AEBDCA'}
            boxSizing={'border-box'}
          >
            <VStack spacing={'1.25rem'}>
              <Box w={'100%'}>
                <Text
                  color={'#485766'}
                  fontSize={'1.125rem'}
                  fontWeight={500}
                  lineHeight={'1.96875rem'}
                >
                  {localeText(
                    LANGUAGES.PRODUCTS.DISCOUNT_PER_UNIT_PURCHASE_FEATURE,
                  )}
                </Text>
              </Box>

              <Box w={'100%'}>
                <HStack justifyContent={'flex-start'} spacing={'0.75rem'}>
                  <Box w={'7.5rem'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.PRODUCTS.ENABLED)}
                    </Text>
                  </Box>
                  <Box>
                    <Switch readOnly isChecked={listCondition.length > 0} />
                  </Box>
                </HStack>
              </Box>

              <Divider borderTop={'1px solid #AEBDCA'} />

              <Box w={'100%'}>
                <VStack spacing={'0.75rem'}>
                  <Box w={'100%'}>
                    <VStack
                      justifyContent={'flex-start'}
                      alignItems={'flex-start'}
                      spacing={'0.75rem'}
                    >
                      <Box w={'7.5rem'} h={'3rem'} alignContent={'center'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.CONDITIONS)}
                        </Text>
                      </Box>
                      <Box>
                        <VStack spacing={'0.75rem'}>
                          {listCondition.map((item, index) => {
                            return (
                              <Box w={'100%'} key={index}>
                                <VStack spacing={'0.75rem'}>
                                  <Box w={'100%'}>
                                    <HStack spacing={'0.75rem'}>
                                      {lang === COUNTRY.COUNTRY_INFO.KR.LANG ? (
                                        <>
                                          <Box w={'100%'}>
                                            <HStack spacing={'0.62rem'}>
                                              <Box w={'5rem'} h={'3rem'}>
                                                <Input
                                                  minW={'auto'}
                                                  w={'100%'}
                                                  h={'100%'}
                                                  color={'#485766'}
                                                  border={'1px solid #9CADBE'}
                                                  px={'1rem'}
                                                  py={'0.75rem'}
                                                  type={'number'}
                                                  textAlign={'right'}
                                                  fontSize={'0.9375rem'}
                                                  fontWeight={400}
                                                  lineHeight={'1.5rem'}
                                                  value={item.amount}
                                                  onChange={(e) => {
                                                    const newList = [
                                                      ...listCondition,
                                                    ];
                                                    newList[index] = {
                                                      ...newList[index],
                                                      amount: Number(
                                                        e.target.value,
                                                      ),
                                                    };
                                                    setListCondition(newList);
                                                  }}
                                                  onFocus={(e) => {
                                                    if (
                                                      Number(e.target.value) ===
                                                      0
                                                    ) {
                                                      e.target.value = '';
                                                    }
                                                  }}
                                                  onBlur={(e) => {
                                                    if (
                                                      utils.isEmpty(
                                                        e.target.value,
                                                      )
                                                    ) {
                                                      e.target.value = 0;
                                                    }
                                                  }}
                                                />
                                              </Box>
                                              <Box w={'3.75rem'}>
                                                <Text
                                                  color={'#556A7E'}
                                                  fontSize={'0.9375rem'}
                                                  fontWeight={400}
                                                  lineHeight={'1.5rem'}
                                                >
                                                  {localeText(
                                                    LANGUAGES.PRODUCTS.OR_MORE,
                                                  )}
                                                </Text>
                                              </Box>
                                            </HStack>
                                          </Box>
                                          <Box w={'100%'}>
                                            <Text
                                              color={'#556A7E'}
                                              fontSize={'0.9375rem'}
                                              fontWeight={400}
                                              lineHeight={'1.5rem'}
                                            >
                                              {localeText(
                                                LANGUAGES.PRODUCTS
                                                  .FOR_PURCHASES_OF,
                                              )}
                                            </Text>
                                          </Box>
                                        </>
                                      ) : (
                                        <>
                                          <Box w={'100%'}>
                                            <Text
                                              color={'#556A7E'}
                                              fontSize={'0.9375rem'}
                                              fontWeight={400}
                                              lineHeight={'1.5rem'}
                                            >
                                              {localeText(
                                                LANGUAGES.PRODUCTS
                                                  .FOR_PURCHASES_OF,
                                              )}
                                            </Text>
                                          </Box>
                                          <Box w={'100%'}>
                                            <HStack spacing={'0.62rem'}>
                                              <Box w={'5rem'} h={'3rem'}>
                                                <Input
                                                  minW={'auto'}
                                                  w={'100%'}
                                                  h={'100%'}
                                                  color={'#485766'}
                                                  border={'1px solid #9CADBE'}
                                                  // px={'1rem'}
                                                  px={'0.3rem'}
                                                  py={'0.75rem'}
                                                  type={'number'}
                                                  textAlign={'right'}
                                                  fontSize={'0.9375rem'}
                                                  fontWeight={400}
                                                  lineHeight={'1.5rem'}
                                                  value={item.amount}
                                                  onChange={(e) => {
                                                    const newList = [
                                                      ...listCondition,
                                                    ];
                                                    newList[index] = {
                                                      ...newList[index],
                                                      amount: Number(
                                                        e.target.value,
                                                      ),
                                                    };
                                                    setListCondition(newList);
                                                  }}
                                                  onFocus={(e) => {
                                                    if (
                                                      Number(e.target.value) ===
                                                      0
                                                    ) {
                                                      e.target.value = '';
                                                    }
                                                  }}
                                                  onBlur={(e) => {
                                                    if (
                                                      utils.isEmpty(
                                                        e.target.value,
                                                      )
                                                    ) {
                                                      e.target.value = 0;
                                                    }
                                                  }}
                                                />
                                              </Box>
                                              <Box w={'3.75rem'}>
                                                <Text
                                                  color={'#556A7E'}
                                                  fontSize={'0.9375rem'}
                                                  fontWeight={400}
                                                  lineHeight={'1.5rem'}
                                                >
                                                  {localeText(
                                                    LANGUAGES.PRODUCTS.OR_MORE,
                                                  )}
                                                </Text>
                                              </Box>
                                            </HStack>
                                          </Box>
                                        </>
                                      )}
                                    </HStack>
                                  </Box>

                                  <Box w={'100%'}>
                                    <HStack spacing={'0.75rem'}>
                                      {/* 조건 문의 */}
                                      <Box w={'8rem'}>
                                        <Select
                                          value={item.type}
                                          onChange={(e) => {
                                            const newList = [...listCondition];
                                            newList[index] = {
                                              ...newList[index],
                                              type: Number(e.target.value),
                                            };
                                            setListCondition(newList);
                                          }}
                                          w={'100%'}
                                          h={'3rem'}
                                          bg={'#FFF'}
                                          borderRadius={'0.25rem'}
                                          boxSizing={'border-box'}
                                          border={'1px solid #9CADBE'}
                                        >
                                          <option value={1}>
                                            {localeText(
                                              LANGUAGES.PRODUCTS.RATIO,
                                            )}
                                          </option>
                                          <option value={2}>
                                            {localeText(
                                              LANGUAGES.PRODUCTS.AMOUNT,
                                            )}
                                          </option>
                                        </Select>
                                      </Box>
                                      <Box>
                                        <HStack spacing={'0.25rem'}>
                                          <Box w={'5rem'} h={'3rem'}>
                                            <Input
                                              minW={'auto'}
                                              w={'100%'}
                                              h={'100%'}
                                              color={'#485766'}
                                              border={'1px solid #9CADBE'}
                                              // px={'1rem'}
                                              px={'0.3rem'}
                                              py={'0.75rem'}
                                              type={'number'}
                                              fontSize={'0.9375rem'}
                                              fontWeight={400}
                                              lineHeight={'1.5rem'}
                                              textAlign={'right'}
                                              value={item?.discountCnt}
                                              onChange={(e) => {
                                                const newList = [
                                                  ...listCondition,
                                                ];
                                                newList[index] = {
                                                  ...newList[index],
                                                  discountCnt: Number(
                                                    e.target.value,
                                                  ),
                                                };
                                                setListCondition(newList);
                                              }}
                                              onFocus={(e) => {
                                                if (
                                                  Number(e.target.value) === 0
                                                ) {
                                                  e.target.value = '';
                                                }
                                              }}
                                              onBlur={(e) => {
                                                if (
                                                  utils.isEmpty(e.target.value)
                                                ) {
                                                  e.target.value = 0;
                                                }
                                              }}
                                            />
                                          </Box>
                                          <Box w={'5.1rem'}>
                                            <Text
                                              color={'#556A7E'}
                                              fontSize={'0.9375rem'}
                                              fontWeight={400}
                                              lineHeight={'1.5rem'}
                                              whiteSpace={'pre-wrap'}
                                            >
                                              {handleDiscountText(item)}
                                            </Text>
                                          </Box>
                                        </HStack>
                                      </Box>
                                    </HStack>
                                  </Box>

                                  <Box w={'100%'}>
                                    <Center
                                      justifySelf={'flex-end'}
                                      w={'1.5rem'}
                                      h={'1.5rem'}
                                      cursor={'pointer'}
                                      onClick={() => {
                                        const newList = [...listCondition];
                                        // delete
                                        const deleteItem = newList[index];
                                        if (deleteItem?.productDiscountId) {
                                          const newDeleteItems = new Set(
                                            listDeleteCondition,
                                          );
                                          if (
                                            !newDeleteItems.has(
                                              deleteItem.productDiscountId,
                                            )
                                          ) {
                                            newDeleteItems.add(
                                              deleteItem.productDiscountId,
                                            );
                                          }
                                          setListDeleteCondition(
                                            newDeleteItems,
                                          );
                                        }
                                        //
                                        newList.splice(index, 1);
                                        setListCondition(newList);
                                      }}
                                    >
                                      <CustomIcon
                                        name="close"
                                        color={'#7895B2'}
                                      />
                                    </Center>
                                  </Box>
                                </VStack>
                              </Box>
                            );
                          })}
                          {listCondition.length === 0 && (
                            <Center w={'100%'} h={'3rem'}>
                              <Text
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'160%'}
                              >
                                {localeText(LANGUAGES.INFO_MSG.NOT_APPLICABLE)}
                              </Text>
                            </Center>
                          )}
                        </VStack>
                      </Box>
                    </VStack>
                  </Box>
                </VStack>
              </Box>

              <Divider borderTop={'1px solid #AEBDCA'} />

              <Box w={'100%'}>
                <Center
                  w={'100%'}
                  onClick={() => {
                    const tempList = [...listCondition];
                    tempList.push({
                      discountCnt: '',
                      amount: '',
                      type: 1,
                    });
                    setListCondition(tempList);
                  }}
                >
                  <Text
                    color={'#556A7E'}
                    fontSize={'1rem'}
                    fontWeight={500}
                    lineHeight={'1.75rem'}
                  >
                    {localeText(LANGUAGES.PRODUCTS.ADD_OPTION)}
                  </Text>
                </Center>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Box>
      <Box
        bg={'#FFF'}
        w={'100%'}
        h={'5rem'}
        position={'fixed'}
        bottom={0}
        p={'1rem'}
        borderTop={'1px solid #AEBDCA'}
      >
        <HStack>
          <Box w={'50%'} h={'3rem'}>
            <Button
              onClick={() => {
                moveBack();
              }}
              px={'1.25rem'}
              py={'0.63rem'}
              borderRadius={'0.25rem'}
              border={'1px solid #556A7E'}
              boxSizing={'border-box'}
              bg={'transparent'}
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
                color={'#556A7E'}
                fontSize={'1rem'}
                fontWeight={400}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.COMMON.CANCEL)}
              </Text>
            </Button>
          </Box>
          <Box w={'50%'} h={'3rem'}>
            <Button
              onClick={() => {
                handleAction();
              }}
              px={'1.25rem'}
              py={'0.63rem'}
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
    </MainContainer>
  ) : (
    <MainContainer
      // title={name ? name : localeText(LANGUAGES.PRODUCTS.PRODUCT_NAME)}
      title={localeText(LANGUAGES.PRODUCTS.PRODUCT)}
      isDetailHeader
    >
      <Box w={'100%'}>
        <HStack
          spacing={'1.25rem'}
          justifyContent={'space-between'}
          alignItems={'flex-start'}
        >
          {/* 좌측 */}
          <Box w={'100%'}>
            <VStack spacing={'2.5rem'}>
              {/* 상품정보 */}
              <Box w={'100%'}>
                <VStack spacing={'1.25rem'}>
                  <Box w={'100%'}>
                    <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                      <Box w={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.STATUS)}
                        </Text>
                      </Box>
                      <Box>
                        <RadioGroup
                          w={'100%'}
                          defaultValue="1"
                          value={status}
                          onChange={(value) => {
                            setStatus(Number(value));
                          }}
                        >
                          <HStack spacing={'3rem'}>
                            <Radio value={1}>
                              <Text
                                color={'#556A7E'}
                                fontSize={'0.9375rem'}
                                fontWeight={400}
                                lineHeight={'1.5rem'}
                              >
                                {localeText(LANGUAGES.PRODUCTS.ON_SALE)}
                              </Text>
                            </Radio>
                            <Radio value={2}>
                              <Text
                                color={'#556A7E'}
                                fontSize={'0.9375rem'}
                                fontWeight={400}
                                lineHeight={'1.5rem'}
                              >
                                {localeText(LANGUAGES.PRODUCTS.STOP_SELLING)}
                              </Text>
                            </Radio>
                            <Radio value={3}>
                              <Text
                                color={'#556A7E'}
                                fontSize={'0.9375rem'}
                                fontWeight={400}
                                lineHeight={'1.5rem'}
                              >
                                {localeText(LANGUAGES.PRODUCTS.OUT_OF_STOCK)}
                              </Text>
                            </Radio>
                          </HStack>
                        </RadioGroup>
                      </Box>
                    </HStack>
                  </Box>

                  {/*
                    <Box w={'100%'}>
                      <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                        <Box w={'12.5rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(
                              LANGUAGES.PRODUCTS.AFFILIATE_PROMOTIONS,
                            )}
                          </Text>
                        </Box>
                        <Box>
                          <Text
                            color={'#556A7E'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            Best seller
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                    */}

                  <Box w={'100%'}>
                    <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                      <Box w={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.PRODUCT_NAME)}
                        </Text>
                      </Box>
                      <Box w={'28.75rem'} h={'3rem'}>
                        <Input
                          h={'100%'}
                          placeholder={localeText(
                            LANGUAGES.PRODUCTS.PH_PRODUCT_NAME,
                          )}
                          _placeholder={{
                            fontWeight: 400,
                            fontSize: '0.9375rem',
                            color: '#7895B2',
                          }}
                          color={'#485766'}
                          border={'1px solid #9CADBE'}
                          px={'1rem'}
                          py={'0.75rem'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          value={name || ''}
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                        />
                      </Box>
                    </HStack>
                  </Box>

                  <Box w={'100%'}>
                    <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                      <Box w={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.MOCRA_FDA_APPROVED)}
                        </Text>
                      </Box>
                      <Box>
                        <Switch
                          isChecked={approvalStatus}
                          onChange={(e) => {
                            setApprovalStatus(e.target.checked);
                          }}
                        />
                      </Box>
                    </HStack>
                  </Box>

                  <Box w={'100%'}>
                    <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                      <Box w={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.CATEGORY)}
                        </Text>
                      </Box>
                      <Box w={'28.75rem'}>
                        <HStack
                          justifyContent={'space-between'}
                          spacing={'0.75rem'}
                        >
                          <Box w={'33%'}>
                            <Select
                              value={Number(firstCategoryId)}
                              onChange={(e) => {
                                setSecondCategoryId(0);
                                setThirdCategoryId(0);
                                setFirstCategoryId(Number(e.target.value));
                              }}
                              w={'100%'}
                              h={'3rem'}
                              bg={'#FFF'}
                              borderRadius={'0.25rem'}
                              boxSizing={'border-box'}
                              border={'1px solid #9CADBE'}
                            >
                              <option value={0}>1st</option>
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
                          </Box>
                          <Box w={'33%'}>
                            <Select
                              value={Number(secondCategoryId)}
                              onChange={(e) => {
                                setThirdCategoryId(0);
                                setSecondCategoryId(Number(e.target.value));
                              }}
                              w={'100%'}
                              h={'3rem'}
                              bg={'#FFF'}
                              borderRadius={'0.25rem'}
                              boxSizing={'border-box'}
                              border={'1px solid #9CADBE'}
                            >
                              <option value={0}>2st</option>
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
                          </Box>
                          <Box w={'33%'}>
                            <Select
                              value={Number(thirdCategoryId)}
                              onChange={(e) => {
                                setThirdCategoryId(Number(e.target.value));
                              }}
                              w={'100%'}
                              h={'3rem'}
                              bg={'#FFF'}
                              borderRadius={'0.25rem'}
                              boxSizing={'border-box'}
                              border={'1px solid #9CADBE'}
                            >
                              <option value={0}>3st</option>
                              {listThirdCategory.map((item, index) => {
                                return (
                                  <option
                                    value={item.thirdCategoryId}
                                    key={index}
                                  >
                                    {item.name}
                                  </option>
                                );
                              })}
                            </Select>
                          </Box>
                        </HStack>
                      </Box>
                    </HStack>
                  </Box>

                  <Box w={'100%'}>
                    <HStack
                      alignItems={'flex-start'}
                      justifyContent={'flex-start'}
                      spacing={'2rem'}
                    >
                      <Box w={'12.5rem'} h={'3rem'} alignContent={'center'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.OPTION)}
                        </Text>
                      </Box>
                      <Box w="28.75rem">
                        <VStack spacing={'0.75rem'}>
                          {listOption.map((item, index) => {
                            return (
                              <Box w={'100%'} key={index}>
                                <HStack
                                  spacing={'1.5rem'}
                                  alignItems={'center'}
                                  justifyContent={'space-between'}
                                >
                                  <Box w={'100%'} h={'3rem'}>
                                    <Input
                                      h={'100%'}
                                      placeholder={localeText(
                                        LANGUAGES.PRODUCTS.PH_OPTION,
                                      )}
                                      _placeholder={{
                                        fontWeight: 400,
                                        fontSize: '0.9375rem',
                                        color: '#7895B2',
                                      }}
                                      color={'#66809C'}
                                      border={'1px solid #9CADBE'}
                                      px={'1rem'}
                                      py={'0.75rem'}
                                      fontSize={'0.9375rem'}
                                      fontWeight={400}
                                      value={item.name}
                                      onChange={(e) => {
                                        const newList = [...listOption];
                                        newList[index] = {
                                          ...newList[index],
                                          name: e.target.value,
                                        };
                                        setListOption(newList);
                                      }}
                                    />
                                  </Box>
                                  <Center
                                    w={'1.5rem'}
                                    h={'1.5rem'}
                                    cursor={'pointer'}
                                    onClick={() => {
                                      const newList = [...listOption];
                                      // delete
                                      const deleteItem = newList[index];
                                      if (deleteItem?.productOptionId) {
                                        const newDeleteItems = new Set(
                                          listDeleteOption,
                                        );
                                        if (
                                          !newDeleteItems.has(
                                            deleteItem.productOptionId,
                                          )
                                        ) {
                                          newDeleteItems.add(
                                            deleteItem.productOptionId,
                                          );
                                        }
                                        setListDeleteOption(newDeleteItems);
                                      }
                                      //
                                      newList.splice(index, 1);
                                      setListOption(newList);
                                    }}
                                  >
                                    <CustomIcon
                                      name="close"
                                      color={'#7895B2'}
                                    />
                                  </Center>
                                </HStack>
                              </Box>
                            );
                          })}
                          <Box
                            w={'100%'}
                            h={listOption.length > 0 ? null : '3rem'}
                            alignContent={
                              listOption.length > 0 ? null : 'center'
                            }
                            onClick={() => {
                              const tempList = [...listOption];
                              tempList.push({
                                name: '',
                                price: 0,
                              });
                              setListOption(tempList);
                            }}
                          >
                            <Text
                              color={'#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={500}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(LANGUAGES.PRODUCTS.ADD_OPTION)}
                            </Text>
                          </Box>
                        </VStack>
                      </Box>
                    </HStack>
                  </Box>
                  <Box w={'100%'}>
                    <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                      <Box w={'12.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.TYPE)}
                        </Text>
                      </Box>
                      <Box w={'28.75rem'} h={'3rem'}>
                        <Select
                          value={type}
                          onChange={(e) => {
                            setType(Number(e.target.value));
                          }}
                          w={'100%'}
                          h={'3rem'}
                          bg={'#FFF'}
                          borderRadius={'0.25rem'}
                          border={'1px solid #9CADBE'}
                        >
                          <option value={0}>
                            {localeText(LANGUAGES.PRODUCTS.ALL)}
                          </option>
                          <option value={1}>
                            {localeText(LANGUAGES.COMMON.NONE)}
                          </option>
                          <option value={2}>{localeText(LANGUAGES.DRY)}</option>
                          <option value={3}>
                            {localeText(LANGUAGES.OILY)}
                          </option>
                          <option value={4}>
                            {localeText(LANGUAGES.SENSITIVE)}
                          </option>
                          <option value={5}>
                            {localeText(LANGUAGES.ACNE)}
                          </option>
                          <option value={6}>
                            {localeText(LANGUAGES.NORMAL)}
                          </option>
                        </Select>
                      </Box>
                    </HStack>
                  </Box>
                </VStack>
              </Box>

              <Divider borderTop={'1px solid #AEBDCA'} />

              {/* 파일업로드 */}
              <Box w={'100%'}>
                <VStack spacing={'0.75rem'} alignItems={'flex-start'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={500}
                      lineHeight={'1.96875rem'}
                    >
                      {localeText(LANGUAGES.PRODUCTS.UPLOAD_TITLE_IMAGE)}
                    </Text>
                  </Box>
                  {files.length < 5 && (
                    <Box w={'100%'}>
                      <DragAndDrop
                        files={files}
                        maxFiles={5}
                        onChange={(files) => {
                          setFiles(files);
                        }}
                      />
                    </Box>
                  )}
                  <Box w={'100%'} minH={'6.25rem'}>
                    <HStack spacing={'1.25rem'}>
                      {files.map((file, index) => {
                        const key = `img_${index}`;
                        return (
                          <Center
                            position={'relative'}
                            w={'6.25rem'}
                            minW={'6.25rem'}
                            h={'6.25rem'}
                            key={key}
                          >
                            <ChakraImage
                              fallback={<DefaultSkeleton />}
                              w={'100%'}
                              h={'100%'}
                              objectFit={'cover'}
                              src={
                                typeof file === 'string'
                                  ? file
                                  : URL.createObjectURL(file)
                              }
                            />
                            <Center
                              cursor={'pointer'}
                              onClick={() => {
                                const newList = [...listImage];
                                const deleteItem = newList[index];
                                if (deleteItem?.productImageId) {
                                  const newDeleteItems = new Set(
                                    listDeleteImage,
                                  );
                                  if (
                                    !newDeleteItems.has(
                                      deleteItem.productImageId,
                                    )
                                  ) {
                                    newDeleteItems.add(
                                      deleteItem.productImageId,
                                    );
                                  }
                                  setListDeleteImage(newDeleteItems);
                                }
                                //
                                handleRemoveImage(index);
                              }}
                              w={'1.5rem'}
                              h={'1.5rem'}
                              position={'absolute'}
                              top={0}
                              right={0}
                              transform="translate(30%, -30%)"
                              bg={'#FFF'}
                              border={'1px solid #7895B2'}
                              borderRadius={'50%'}
                            >
                              <CustomIcon name={'minus'} color={'#7895B2'} />
                            </Center>
                          </Center>
                        );
                      })}
                    </HStack>
                  </Box>
                </VStack>
              </Box>

              {/* 설명 */}
              <Box w={'100%'}>
                <VStack spacing={'0.75rem'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={500}
                      lineHeight={'1.96875rem'}
                    >
                      {localeText(LANGUAGES.PRODUCTS.ENTER_PRODUCT_DESCRIPTION)}
                    </Text>
                  </Box>
                  <Box w={'100%'} h={'100%'}>
                    <CustomEditor info={info} setInfo={setInfo} isVideo />
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </Box>

          {/* 우측 */}
          <Box w={'28.25rem'}>
            <VStack spacing={'1.25rem'}>
              <Box
                w={'100%'}
                p={'1.25rem'}
                border={'1px solid #AEBDCA'}
                boxSizing={'border-box'}
              >
                <VStack spacing={'1.25rem'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={500}
                      lineHeight={'1.96875rem'}
                    >
                      {localeText(LANGUAGES.PRODUCTS.SALES_INFORMATION)}
                    </Text>
                  </Box>

                  <Divider borderTop={'1px solid #AEBDCA'} />

                  <Box w={'100%'}>
                    <VStack spacing={'0.75rem'}>
                      <Box w={'100%'}>
                        <HStack justifyContent={'space-between'}>
                          <Box w={'10rem'}>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                            >
                              {localeText(LANGUAGES.PRODUCTS.MSRP)}
                            </Text>
                          </Box>
                          <Box>
                            <HStack spacing={'0.25rem'}>
                              <Text
                                color={'#7895B2'}
                                fontSize={'1.125rem'}
                                fontWeight={400}
                                lineHeight={'1.96875rem'}
                              >
                                $
                              </Text>
                              <Box w={'12.75rem'} h={'3rem'}>
                                <Input
                                  h={'100%'}
                                  placeholder={localeText(
                                    LANGUAGES.PRODUCTS.PH_AMOUNT,
                                  )}
                                  onFocus={(e) => {
                                    if (Number(e.target.value) === 0) {
                                      e.target.value = '';
                                    }
                                  }}
                                  onBlur={(e) => {
                                    if (utils.isEmpty(e.target.value)) {
                                      e.target.value = 0;
                                    }
                                  }}
                                  _placeholder={{
                                    fontWeight: 400,
                                    fontSize: '0.9375rem',
                                    color: '#7895B2',
                                  }}
                                  border={'1px solid #9CADBE'}
                                  px={'1rem'}
                                  py={'0.75rem'}
                                  type={'number'}
                                  color={'#485766'}
                                  fontSize={'0.9375rem'}
                                  textAlign={'right'}
                                  fontWeight={400}
                                  lineHeight={'1.5rem'}
                                  value={msrp}
                                  onChange={(e) => {
                                    setMsrp(Number(e.target.value));
                                  }}
                                />
                              </Box>
                            </HStack>
                          </Box>
                        </HStack>
                      </Box>
                      <Box w={'100%'}>
                        <HStack justifyContent={'space-between'}>
                          <Box w={'10rem'}>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                            >
                              {localeText(LANGUAGES.PRODUCTS.SUPPLY_PRICE)}
                            </Text>
                          </Box>
                          <Box>
                            <HStack spacing={'0.25rem'}>
                              <Text
                                color={'#7895B2'}
                                fontSize={'1.125rem'}
                                fontWeight={400}
                                lineHeight={'1.96875rem'}
                              >
                                $
                              </Text>
                              <Box w={'12.75rem'} h={'3rem'}>
                                <Input
                                  h={'100%'}
                                  placeholder={localeText(
                                    LANGUAGES.PRODUCTS.PH_AMOUNT,
                                  )}
                                  _placeholder={{
                                    fontWeight: 400,
                                    fontSize: '0.9375rem',
                                    color: '#7895B2',
                                  }}
                                  onFocus={(e) => {
                                    if (Number(e.target.value) === 0) {
                                      e.target.value = '';
                                    }
                                  }}
                                  onBlur={(e) => {
                                    if (utils.isEmpty(e.target.value)) {
                                      e.target.value = 0;
                                    }
                                  }}
                                  border={'1px solid #9CADBE'}
                                  px={'1rem'}
                                  py={'0.75rem'}
                                  type={'number'}
                                  color={'#485766'}
                                  fontSize={'0.9375rem'}
                                  textAlign={'right'}
                                  fontWeight={400}
                                  lineHeight={'1.5rem'}
                                  value={wp}
                                  onChange={(e) => {
                                    setWp(Number(e.target.value));
                                  }}
                                />
                              </Box>
                            </HStack>
                          </Box>
                        </HStack>
                      </Box>
                      <Box w={'100%'}>
                        <HStack justifyContent={'space-between'}>
                          <Box w={'10rem'}>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                            >
                              {localeText(
                                LANGUAGES.PRODUCTS.INVENTORY_MANAGEMENT,
                              )}
                            </Text>
                          </Box>
                          <Box w={'13.75rem'}>
                            <RadioGroup
                              w={'100%'}
                              value={stockFlag}
                              onChange={(value) => {
                                setStockFlag(Number(value));
                              }}
                            >
                              <HStack
                                spacing={'1rem'}
                                justifyContent={'space-between'}
                              >
                                <Radio value={1}>
                                  <Text
                                    color={'#556A7E'}
                                    fontSize={'0.9375rem'}
                                    fontWeight={400}
                                    lineHeight={'1.5rem'}
                                  >
                                    {localeText(LANGUAGES.PRODUCTS.ENABLED)}
                                  </Text>
                                </Radio>
                                <Radio value={2}>
                                  <Text
                                    color={'#556A7E'}
                                    fontSize={'0.9375rem'}
                                    fontWeight={400}
                                    lineHeight={'1.5rem'}
                                  >
                                    {localeText(LANGUAGES.PRODUCTS.DISABLED)}
                                  </Text>
                                </Radio>
                              </HStack>
                            </RadioGroup>
                          </Box>
                        </HStack>
                      </Box>
                      <Box w={'100%'}>
                        <HStack justifyContent={'space-between'}>
                          <Box w={'10rem'}>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                            >
                              {localeText(
                                LANGUAGES.PRODUCTS.INVENTORY_QUANTITY,
                              )}
                            </Text>
                          </Box>
                          <Box w={'13.75rem'} h={'3rem'}>
                            <Input
                              h={'100%'}
                              placeholder={localeText(
                                LANGUAGES.PRODUCTS.INVENTORY_QUANTITY,
                              )}
                              isDisabled={stockFlag === 2}
                              _placeholder={{
                                fontWeight: 400,
                                fontSize: '0.9375rem',
                                color: '#7895B2',
                              }}
                              border={'1px solid #9CADBE'}
                              px={'1rem'}
                              py={'0.75rem'}
                              type={'number'}
                              onFocus={(e) => {
                                if (Number(e.target.value) === 0) {
                                  e.target.value = '';
                                }
                              }}
                              onBlur={(e) => {
                                if (utils.isEmpty(e.target.value)) {
                                  e.target.value = 0;
                                }
                              }}
                              color={'#556A7E'}
                              fontSize={'0.9375rem'}
                              textAlign={'right'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                              value={stockCnt}
                              onChange={(e) => {
                                setStockCnt(Number(e.target.value));
                              }}
                            />
                          </Box>
                        </HStack>
                      </Box>
                      <Box w={'100%'}>
                        <HStack justifyContent={'space-between'}>
                          <Box w={'10rem'}>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                            >
                              {localeText(
                                LANGUAGES.PRODUCTS.MINIMUM_PURCHASE_QUANTITY,
                              )}
                            </Text>
                          </Box>
                          <Box w={'13.75rem'} h={'3rem'}>
                            <Input
                              h={'100%'}
                              placeholder={localeText(
                                LANGUAGES.PRODUCTS.PURCHASE_QUANTITY,
                              )}
                              _placeholder={{
                                fontWeight: 400,
                                fontSize: '0.9375rem',
                                color: '#7895B2',
                              }}
                              border={'1px solid #9CADBE'}
                              px={'1rem'}
                              py={'0.75rem'}
                              type={'text'}
                              onFocus={(e) => {
                                if (Number(e.target.value) === 0) {
                                  e.target.value = '';
                                }
                              }}
                              onBlur={(e) => {
                                if (utils.isEmpty(e.target.value)) {
                                  e.target.value = 0;
                                }
                              }}
                              color={'#556A7E'}
                              fontSize={'0.9375rem'}
                              textAlign={'right'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                              value={minOrderCnt}
                              onChange={(e) => {
                                const value = e.target.value;
                                const regex = /^[0-9]*$/;
                                if (regex.test(value)) {
                                  setMinOrderCnt(Number(value));
                                }
                              }}
                            />
                          </Box>
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>
                </VStack>
              </Box>

              <Box
                w={'100%'}
                p={'1.25rem'}
                border={'1px solid #AEBDCA'}
                boxSizing={'border-box'}
              >
                <VStack spacing={'1.25rem'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={500}
                      lineHeight={'1.96875rem'}
                    >
                      {localeText(
                        LANGUAGES.PRODUCTS.DISCOUNT_PER_UNIT_PURCHASE_FEATURE,
                      )}
                    </Text>
                  </Box>

                  <Box w={'100%'}>
                    <HStack justifyContent={'flex-start'} spacing={'0.75rem'}>
                      <Box w={'7.5rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.ENABLED)}
                        </Text>
                      </Box>
                      <Box>
                        <Switch readOnly isChecked={listCondition.length > 0} />
                      </Box>
                    </HStack>
                  </Box>

                  <Divider borderTop={'1px solid #AEBDCA'} />

                  <Box w={'100%'}>
                    <VStack spacing={'0.75rem'}>
                      <Box w={'100%'}>
                        <HStack
                          justifyContent={'flex-start'}
                          alignItems={'flex-start'}
                          spacing={'0.75rem'}
                        >
                          <Box w={'7.5rem'} h={'3rem'} alignContent={'center'}>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                            >
                              {localeText(LANGUAGES.PRODUCTS.CONDITIONS)}
                            </Text>
                          </Box>
                          <Box>
                            <VStack spacing={'0.75rem'}>
                              {listCondition.map((item, index) => {
                                return (
                                  <Box w={'100%'} key={index}>
                                    <VStack spacing={'0.75rem'}>
                                      <Box w={'100%'}>
                                        <HStack spacing={'0.75rem'}>
                                          {lang ===
                                          COUNTRY.COUNTRY_INFO.KR.LANG ? (
                                            <>
                                              <Box>
                                                <HStack spacing={'0.62rem'}>
                                                  <Box w={'3.25rem'} h={'3rem'}>
                                                    <Input
                                                      minW={'auto'}
                                                      w={'100%'}
                                                      h={'100%'}
                                                      color={'#485766'}
                                                      border={
                                                        '1px solid #9CADBE'
                                                      }
                                                      px={'1rem'}
                                                      py={'0.75rem'}
                                                      type={'number'}
                                                      textAlign={'right'}
                                                      fontSize={'0.9375rem'}
                                                      fontWeight={400}
                                                      lineHeight={'1.5rem'}
                                                      value={item.discountCnt}
                                                      onChange={(e) => {
                                                        const newList = [
                                                          ...listCondition,
                                                        ];
                                                        newList[index] = {
                                                          ...newList[index],
                                                          discountCnt: Number(
                                                            e.target.value,
                                                          ),
                                                        };
                                                        setListCondition(
                                                          newList,
                                                        );
                                                      }}
                                                      onFocus={(e) => {
                                                        if (
                                                          Number(
                                                            e.target.value,
                                                          ) === 0
                                                        ) {
                                                          e.target.value = '';
                                                        }
                                                      }}
                                                      onBlur={(e) => {
                                                        if (
                                                          utils.isEmpty(
                                                            e.target.value,
                                                          )
                                                        ) {
                                                          e.target.value = 0;
                                                        }
                                                      }}
                                                    />
                                                  </Box>
                                                  <Box w={'3.75rem'}>
                                                    <Text
                                                      color={'#556A7E'}
                                                      fontSize={'0.9375rem'}
                                                      fontWeight={400}
                                                      lineHeight={'1.5rem'}
                                                    >
                                                      {localeText(
                                                        LANGUAGES.PRODUCTS
                                                          .OR_MORE,
                                                      )}
                                                    </Text>
                                                  </Box>
                                                </HStack>
                                              </Box>
                                              <Box w={'8rem'}>
                                                <Text
                                                  color={'#556A7E'}
                                                  fontSize={'0.9375rem'}
                                                  fontWeight={400}
                                                  lineHeight={'1.5rem'}
                                                >
                                                  {localeText(
                                                    LANGUAGES.PRODUCTS
                                                      .FOR_PURCHASES_OF,
                                                  )}
                                                </Text>
                                              </Box>
                                            </>
                                          ) : (
                                            <>
                                              <Box w={'8rem'}>
                                                <Text
                                                  color={'#556A7E'}
                                                  fontSize={'0.9375rem'}
                                                  fontWeight={400}
                                                  lineHeight={'1.5rem'}
                                                >
                                                  {localeText(
                                                    LANGUAGES.PRODUCTS
                                                      .FOR_PURCHASES_OF,
                                                  )}
                                                </Text>
                                              </Box>
                                              <Box>
                                                <HStack spacing={'0.62rem'}>
                                                  <Box w={'3.25rem'} h={'3rem'}>
                                                    <Input
                                                      minW={'auto'}
                                                      w={'100%'}
                                                      h={'100%'}
                                                      color={'#485766'}
                                                      border={
                                                        '1px solid #9CADBE'
                                                      }
                                                      // px={'1rem'}
                                                      px={'0.3rem'}
                                                      py={'0.75rem'}
                                                      type={'number'}
                                                      textAlign={'right'}
                                                      fontSize={'0.9375rem'}
                                                      fontWeight={400}
                                                      lineHeight={'1.5rem'}
                                                      value={item.discountCnt}
                                                      onChange={(e) => {
                                                        const newList = [
                                                          ...listCondition,
                                                        ];
                                                        newList[index] = {
                                                          ...newList[index],
                                                          discountCnt: Number(
                                                            e.target.value,
                                                          ),
                                                        };
                                                        setListCondition(
                                                          newList,
                                                        );
                                                      }}
                                                      onFocus={(e) => {
                                                        if (
                                                          Number(
                                                            e.target.value,
                                                          ) === 0
                                                        ) {
                                                          e.target.value = '';
                                                        }
                                                      }}
                                                      onBlur={(e) => {
                                                        if (
                                                          utils.isEmpty(
                                                            e.target.value,
                                                          )
                                                        ) {
                                                          e.target.value = 0;
                                                        }
                                                      }}
                                                    />
                                                  </Box>
                                                  <Box w={'3.75rem'}>
                                                    <Text
                                                      color={'#556A7E'}
                                                      fontSize={'0.9375rem'}
                                                      fontWeight={400}
                                                      lineHeight={'1.5rem'}
                                                    >
                                                      {localeText(
                                                        LANGUAGES.PRODUCTS
                                                          .OR_MORE,
                                                      )}
                                                    </Text>
                                                  </Box>
                                                </HStack>
                                              </Box>
                                            </>
                                          )}
                                        </HStack>
                                      </Box>

                                      <Box w={'100%'}>
                                        <HStack spacing={'0.75rem'}>
                                          {/* 조건 문의 */}
                                          <Box w={'8rem'}>
                                            <Select
                                              value={item.type}
                                              onChange={(e) => {
                                                const newList = [
                                                  ...listCondition,
                                                ];
                                                newList[index] = {
                                                  ...newList[index],
                                                  type: Number(e.target.value),
                                                };
                                                setListCondition(newList);
                                              }}
                                              w={'100%'}
                                              h={'3rem'}
                                              bg={'#FFF'}
                                              borderRadius={'0.25rem'}
                                              boxSizing={'border-box'}
                                              border={'1px solid #9CADBE'}
                                            >
                                              <option value={1}>
                                                {localeText(
                                                  LANGUAGES.PRODUCTS.RATIO,
                                                )}
                                              </option>
                                              <option value={2}>
                                                {localeText(
                                                  LANGUAGES.PRODUCTS.AMOUNT,
                                                )}
                                              </option>
                                            </Select>
                                          </Box>
                                          <Box>
                                            <HStack spacing={'0.25rem'}>
                                              <Box w={'3.25rem'} h={'3rem'}>
                                                <Input
                                                  minW={'auto'}
                                                  w={'100%'}
                                                  h={'100%'}
                                                  color={'#485766'}
                                                  border={'1px solid #9CADBE'}
                                                  // px={'1rem'}
                                                  px={'0.3rem'}
                                                  py={'0.75rem'}
                                                  type={'number'}
                                                  fontSize={'0.9375rem'}
                                                  fontWeight={400}
                                                  lineHeight={'1.5rem'}
                                                  textAlign={'right'}
                                                  value={item?.amount}
                                                  onChange={(e) => {
                                                    const newList = [
                                                      ...listCondition,
                                                    ];
                                                    newList[index] = {
                                                      ...newList[index],
                                                      amount: Number(
                                                        e.target.value,
                                                      ),
                                                    };
                                                    setListCondition(newList);
                                                  }}
                                                  onFocus={(e) => {
                                                    if (
                                                      Number(e.target.value) ===
                                                      0
                                                    ) {
                                                      e.target.value = '';
                                                    }
                                                  }}
                                                  onBlur={(e) => {
                                                    if (
                                                      utils.isEmpty(
                                                        e.target.value,
                                                      )
                                                    ) {
                                                      e.target.value = 0;
                                                    }
                                                  }}
                                                />
                                              </Box>
                                              <Box w={'5.1rem'}>
                                                <Text
                                                  color={'#556A7E'}
                                                  fontSize={'0.9375rem'}
                                                  fontWeight={400}
                                                  lineHeight={'1.5rem'}
                                                  whiteSpace={'pre-wrap'}
                                                >
                                                  {handleDiscountText(item)}
                                                </Text>
                                              </Box>
                                            </HStack>
                                          </Box>
                                        </HStack>
                                      </Box>

                                      <Box w={'100%'}>
                                        <Center
                                          justifySelf={'flex-end'}
                                          w={'1.5rem'}
                                          h={'1.5rem'}
                                          cursor={'pointer'}
                                          onClick={() => {
                                            const newList = [...listCondition];
                                            // delete
                                            const deleteItem = newList[index];
                                            if (deleteItem?.productDiscountId) {
                                              const newDeleteItems = new Set(
                                                listDeleteCondition,
                                              );
                                              if (
                                                !newDeleteItems.has(
                                                  deleteItem.productDiscountId,
                                                )
                                              ) {
                                                newDeleteItems.add(
                                                  deleteItem.productDiscountId,
                                                );
                                              }
                                              setListDeleteCondition(
                                                newDeleteItems,
                                              );
                                            }
                                            //
                                            newList.splice(index, 1);
                                            setListCondition(newList);
                                          }}
                                        >
                                          <CustomIcon
                                            name="close"
                                            color={'#7895B2'}
                                          />
                                        </Center>
                                      </Box>
                                    </VStack>
                                  </Box>
                                );
                              })}
                              {listCondition.length === 0 && (
                                <Center w={'100%'} h={'3rem'}>
                                  <Text
                                    fontSize={'1rem'}
                                    fontWeight={400}
                                    lineHeight={'160%'}
                                  >
                                    {localeText(
                                      LANGUAGES.INFO_MSG.NOT_APPLICABLE,
                                    )}
                                  </Text>
                                </Center>
                              )}
                            </VStack>
                          </Box>
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>
                  <Divider borderTop={'1px solid #AEBDCA'} />
                  <Box w={'100%'}>
                    <Center
                      w={'100%'}
                      onClick={() => {
                        const tempList = [...listCondition];
                        tempList.push({
                          discountCnt: '',
                          amount: '',
                          type: 1,
                        });
                        setListCondition(tempList);
                      }}
                    >
                      <Text
                        color={'#556A7E'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.PRODUCTS.ADD_OPTION)}
                      </Text>
                    </Center>
                  </Box>
                </VStack>
              </Box>

              <Box w="100%">
                <HStack spacing={'0.75rem'} justifyContent={'flex-end'}>
                  <Box w="50%" h={'3rem'}>
                    <Button
                      onClick={() => {
                        moveBack();
                      }}
                      px={'1.25rem'}
                      py={'0.63rem'}
                      borderRadius={'0.25rem'}
                      border={'1px solid #556A7E'}
                      boxSizing={'border-box'}
                      bg={'transparent'}
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
                        color={'#556A7E'}
                        fontSize={'1rem'}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.COMMON.CANCEL)}
                      </Text>
                    </Button>
                  </Box>
                  <Box w="50%" h={'3rem'}>
                    <Button
                      onClick={() => {
                        handleAction();
                      }}
                      px={'1.25rem'}
                      py={'0.63rem'}
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
            </VStack>
          </Box>
        </HStack>

        <ContentBR h={'1.25rem'} />
      </Box>
    </MainContainer>
  );
};

export default ProductsDetailActionPage;
