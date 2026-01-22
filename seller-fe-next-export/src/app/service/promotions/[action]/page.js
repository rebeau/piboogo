'use client';

import CustomCheckBox from '@/components/common/checkbox/CustomCheckBox';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import {
  Box,
  Button,
  Center,
  HStack,
  Image as ChakraImage,
  Text,
  VStack,
  Img,
  Divider,
  Input,
  Spacer,
  useDisclosure,
  Textarea,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import IconLeft from '@public/svgs/icon/left.svg';
import IconRight from '@public/svgs/icon/right.svg';
import IconDown from '@public/svgs/icon/down.svg';
import IconUp from '@public/svgs/icon/up.svg';
import utils from '@/utils';
import { CustomIcon, DefaultPaginate } from '@/components';
import ContentDetailHeader from '@/components/custom/header/ContentDetailHeader';
import RangeDatePicker from '@/components/date/RangeDatePicker';
import DragAndDrop from '@/components/input/file/DragAndDrop';

import SearchInput from '@/components/input/custom/SearchInput';
import { useRecoilState } from 'recoil';
import { selectedPromotionState } from '@/stores/dataRecoil';
import { SUCCESS } from '@/constants/errorCode';
import promotionApi from '@/services/promotionApi';
import useMove from '@/hooks/useMove';
import useModal from '@/hooks/useModal';
import productApi from '@/services/productApi';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import promotionProductApi from '@/services/promotionProductApi';
import useDevice from '@/hooks/useDevice';
import MainContainer from '@/components/layout/MainContainer';
import ContentBR from '@/components/custom/ContentBR';
import { toZonedTime } from 'date-fns-tz';
import { TIME_ZONE } from '@/constants/common';

const PromotionsDetailActionPage = () => {
  const { isMobile, clampW } = useDevice();
  const { action } = useParams();
  const { moveBack } = useMove();
  const { openModal } = useModal();

  const productRowHeight = '6.5rem';

  const [selectedPromotion, setSelectedPromotion] = useRecoilState(
    selectedPromotionState,
  );

  useEffect(() => {
    if (action === 'add') {
      handleGetListProduct();
    } else if (action === 'modify' && selectedPromotion?.promotionId) {
      handleSetDetail();
    } else {
      console.log('팅');
    }
  }, [action]);

  const { lang, localeText } = useLocale();

  const [searchBy, setSearchBy] = useState('');

  const [leftList, setLeftList] = useState([]);
  const [rightList, setRightList] = useState([]);

  const [isInitList, setIsInitList] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(5);

  const handleSetDetail = async () => {
    await handleGetPromotion();
    await handleGetListPromotionProduct();
    await handleGetListProduct();
  };

  // 프로모션 관련 상품
  useEffect(() => {
    if (!isInitList) {
      handleGetListProductAgent();
    }
  }, [currentPage, isInitList]);

  const handleGetListProductAgent = () => {
    if (currentPage === 1) {
      handleGetListProduct();
    } else {
      setCurrentPage(1);
    }
  };

  const getNewDatas = (resultDatas, existingDatas) => {
    const existingProductIds = existingDatas.map((item) => item.productId);
    const newDatas = resultDatas.filter(
      (item) => !existingProductIds.includes(item.productId),
    );
    return newDatas;
  };

  const handleGetListProduct = useCallback(async () => {
    let result = null;
    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
      status: 1,
    };
    if (searchBy) {
      param.searchBy = searchBy;
    }
    result = await productApi.getListProduct(param);
    if (result?.errorCode === SUCCESS) {
      const rightProductIds = new Set(rightList.map((item) => item.productId));

      // 겹치지 않는 상품만 leftList로 설정
      const filteredLeftList = result.datas.filter(
        (item) => !rightProductIds.has(item.productId),
      );
      if (isMobile(true)) {
        setLeftList((prev) => [...prev, ...filteredLeftList]);
      } else {
        setLeftList(filteredLeftList);
      }
      setTotalCount(result.totalCount);
    } else {
      if (isMobile(true)) {
        setLeftList((prev) => [...prev, ...[]]);
      } else {
        setLeftList([]);
      }
      setTotalCount(result.totalCount);
    }
    setIsInitList(false);
  });

  const handleGetListPromotionProduct = useCallback(async () => {
    const param = {
      promotionId: Number(selectedPromotion.promotionId),
    };
    let result = await promotionProductApi.getListPromotionProduct(param);
    if (result?.errorCode === SUCCESS) {
      // leftList의 productId 목록을 Set으로 생성
      const leftProductIds = new Set(leftList.map((item) => item.productId));

      // 겹치지 않는 상품만 rightList로 설정
      const filteredRightList = result.datas.filter(
        (item) => !leftProductIds.has(item.productId),
      );

      setRightList(filteredRightList);
      setTotalCount(result.totalCount);
    } else {
      if (isMobile(true)) {
        setRightList((prev) => [...prev, ...[]]);
      } else {
        setRightList([]);
      }
      setTotalCount(result.totalCount);
    }
    setIsInitList(false);
  });

  const [files, setFiles] = useState([]);

  const [name, setName] = useState(null);
  const [isUnLimit, setIsUnLimit] = useState(false);
  const [content, setContent] = useState('');

  const now = toZonedTime(new Date(), TIME_ZONE);
  const sevenDaysLater = new Date(now);
  sevenDaysLater.setDate(now.getDate() + 7);
  const [startDate, setStartDate] = useState(now);
  const [endDate, setEndDate] = useState(sevenDaysLater);

  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    if (startDate && endDate) {
      setDateStr(
        `${utils.parseDateToStr(startDate, '.')} - ${utils.parseDateToStr(
          endDate,
          '.',
        )}`,
      );
    }
  }, [startDate, endDate]);

  const {
    isOpen: isOpenDatePicker,
    onOpen: onOpenDatePicker,
    onClose: onCloseDatePicker,
  } = useDisclosure();

  const initDate = () => {
    setStartDate(now);
    setEndDate(sevenDaysLater);
    onCloseDatePicker();
  };

  const handleOnChangeDatePicker = async (dates) => {
    setStartDate(dates.startDate);
    setEndDate(dates.endDate);
    if (dates.startDate && dates.endDate) {
      onCloseDatePicker();
    }
  };

  const handleRemoveImage = useCallback((index) => {
    let tempFiles = [...files];
    tempFiles.splice(index, 1);
    setFiles(tempFiles);
  });

  const handleActionPromotion = () => {
    if (action === 'modify') {
      handleModifyPromotion();
    } else {
      handlePostPromotion();
    }
  };

  const handleGetPromotion = async () => {
    const param = {
      promotionId: selectedPromotion.promotionId,
    };
    const result = await promotionApi.getPromotion(param);
    if (result?.errorCode === SUCCESS) {
      const data = result.data;
      setName(data?.name);
      setContent(data?.content);
      if (data?.startDate && data?.endDate) {
        setIsUnLimit(false);
        setTimeout(() => {
          setStartDate(utils.parseDateFromSimpleStr(data.startDate));
          setEndDate(utils.parseDateFromSimpleStr(data.endDate));
        }, 200);
      } else {
        setIsUnLimit(true);
      }

      if (data?.imageS3Url) {
        setFiles([data?.imageS3Url]);
      }
    }
  };

  const checkParam = () => {
    if (utils.isEmpty(name)) {
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.ENTER_THE_TITLE),
      });
      return false;
    }
    if (rightList.length === 0) {
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.REGISTER_YOUR_PRODUCTS),
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

  const handleModifyPromotion = async () => {
    if (!checkParam()) return;

    const param = {
      promotionId: selectedPromotion.promotionId,
      name: name,
      content: content,
    };
    if (!isUnLimit) {
      param.startDate = utils.parseDateToYMD(startDate);
      param.endDate = utils.parseDateToYMD(endDate);
    } else {
      param.startDate = '';
      param.endDate = '';
    }

    const fileObjectsOnly = files.filter((file) => file instanceof File);

    console.log('fileObjectsOnly', fileObjectsOnly);
    const result = await promotionApi.patchPromotion(param, fileObjectsOnly);
    if (result?.errorCode === SUCCESS) {
      let productParam = null;
      if (rightList.length > 0) {
        productParam = {
          promotionId: selectedPromotion.promotionId,
          productIds: rightList
            .filter((item) => item.productId)
            .map((item) => item.productId),
        };
        const productResult =
          await promotionProductApi.postPromotionProduct(productParam);
        if (productResult?.errorCode === SUCCESS) {
          openModal({
            text: result.message || productResult.message,
            onAgree: () => {
              setSelectedPromotion({});
              moveBack();
            },
          });
        } else {
          openModal({ text: productResult.message });
        }
      }
    } else {
      openModal({ text: result.message });
    }
  };

  const handlePostPromotion = async () => {
    if (!checkParam()) return;

    const param = {
      name: name,
    };
    if (content) {
      param.content = content;
    }
    if (!isUnLimit) {
      param.startDate = utils.parseDateToYMD(startDate);
      param.endDate = utils.parseDateToYMD(endDate);
    } else {
      param.startDate = '';
      param.endDate = '';
    }
    let productIds = [];
    rightList.map((item) => {
      productIds.push(item.productId);
    });
    param.productIds = productIds;

    const result = await promotionApi.postPromotion(param, files);
    openModal({
      text: result.message,
      onAgree: () => {
        if (result?.errorCode === SUCCESS) {
          setSelectedPromotion({});
          moveBack();
        }
      },
    });
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return; // 드래그가 끝나도 이동하지 않은 경우 처리

    // source와 destination이 같은 리스트에 있을 경우
    const sourceList = source.droppableId === 'left' ? leftList : rightList;
    const destList = destination.droppableId === 'left' ? leftList : rightList;

    // 아이템 이동
    const [movedItem] = sourceList.splice(source.index, 1);
    destList.splice(destination.index, 0, movedItem);

    if (source.droppableId === 'left') {
      setLeftList([...sourceList]);
    } else {
      setRightList([...sourceList]);
    }

    if (destination.droppableId === 'left') {
      setLeftList([...destList]);
    } else {
      setRightList([...destList]);
    }
  };

  const productCard = useCallback((provided, item) => {
    const productId = item?.productId || 1;
    const name = item?.name || '';
    const thirdCategoryName = item?.thirdCategoryName || '';
    const firstCategoryName = item?.firstCategoryName || '';
    const secondCategoryName = item?.secondCategoryName || '';
    const msrp = item?.msrp;
    const wp = item?.wp;

    const productImageList = item?.productImageList || [];

    let firstImageSrc = null;
    if (productImageList.length > 0) {
      firstImageSrc = productImageList[0].imageS3Url;
    }

    return (
      <Box
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        w={'100%'}
        h={productRowHeight}
        px={'1rem'}
        py={'0.75rem'}
        bg={'#90aec412'}
        borderBottom={'1px solid #73829D'}
        boxSizing={'border-box'}
      >
        <HStack spacing={'0.75rem'}>
          <Box w={'22rem'} cursor={'pointer'}>
            <HStack spacing={'0.75rem'}>
              <Center w={'5rem'} h={'5rem'}>
                <ChakraImage
                  fallback={<DefaultSkeleton />}
                  w={'100%'}
                  h={'100%'}
                  objectFit={'cover'}
                  src={firstImageSrc}
                />
              </Center>
              <Box>
                <VStack spacing={'0.5rem'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={'0.9357rem'}
                      fontWeight={500}
                      lineHeight={'1.5rem'}
                    >
                      {name}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <HStack spacing={'0.25rem'} alignItems={'center'}>
                      <Text
                        color={'#66809C'}
                        fontSize={'0.875rem'}
                        fontWeight={400}
                        lineHeight={'1.4rem'}
                        opacity={'0.7'}
                      >
                        {firstCategoryName}
                      </Text>
                      {secondCategoryName && (
                        <>
                          <Center w={'1rem'} h={'1rem'}>
                            <Img h={'100%'} src={IconRight.src} />
                          </Center>
                          <Text
                            color={'#485766'}
                            fontSize={'0.875rem'}
                            fontWeight={400}
                            lineHeight={'1.4rem'}
                            opacity={'0.7'}
                          >
                            {secondCategoryName}
                          </Text>
                        </>
                      )}
                      {thirdCategoryName && (
                        <>
                          <Center w={'1rem'} h={'1rem'}>
                            <Img h={'100%'} src={IconRight.src} />
                          </Center>
                          <Text
                            color={'#485766'}
                            fontSize={'0.875rem'}
                            fontWeight={400}
                            lineHeight={'1.4rem'}
                            opacity={'0.7'}
                          >
                            {thirdCategoryName}
                          </Text>
                        </>
                      )}
                    </HStack>
                  </Box>
                </VStack>
              </Box>
            </HStack>
          </Box>
          <Box w={'6.5625rem'}>
            <Text
              textAlign={'center'}
              color={'#485766'}
              fontSize={'0.9357rem'}
              fontWeight={400}
              lineHeight={'1.5rem'}
            >
              {utils.parseDallar(wp)}
            </Text>
          </Box>
        </HStack>
      </Box>
    );
  });

  return isMobile(true) ? (
    <MainContainer
      isDetailHeader
      contentHeader={
        <Box>
          <HStack spacing={'0.75rem'}>
            <Box minW={'13.5rem'} h={'3rem'}>
              <Button
                // isDisabled
                onClick={() => {
                  handleActionPromotion();
                }}
                px={'1.25rem'}
                py={'0.63rem'}
                borderRadius={'0.25rem'}
                bg={'#7895B2'}
                h={'100%'}
                w={'100%'}
                _disabled={{
                  bg: '#D9E7EC',
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
                  {action === 'modify'
                    ? localeText(LANGUAGES.PROMOTIONS.MODIFY_REQUEST)
                    : localeText(LANGUAGES.PROMOTIONS.MAKE_REQUEST)}
                </Text>
              </Button>
            </Box>
          </HStack>
        </Box>
      }
    >
      <Box w={'100%'} px={clampW(1, 5)}>
        <VStack spacing={'2.5rem'}>
          <Box w={'100%'}>
            <VStack spacing={'1.25rem'}>
              <Box w={'100%'}>
                <Wrap alignItems={'center'} spacingX={0} spacingY={'0.2rem'}>
                  <WrapItem w={'12.5rem'} h={'3rem'} alignItems={'center'}>
                    <Box w={'100%'} h={'100%'} alignContent={'center'}>
                      <Text
                        color={'#7895B2'}
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        lineHeight={'1.5rem'}
                      >
                        {localeText(LANGUAGES.PROMOTIONS.PERIOD)}
                      </Text>
                    </Box>
                  </WrapItem>

                  <WrapItem w={clampW(30, 60)}>
                    <HStack spacing={'2.5rem'}>
                      <Box>
                        <HStack spacing={'0.5rem'}>
                          <CustomCheckBox
                            isChecked={isUnLimit}
                            onChange={(value) => {
                              setIsUnLimit(value);
                            }}
                          />
                          <Text
                            color={'#485766'}
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.COMMON.UNLIMITED)}
                          </Text>
                        </HStack>
                      </Box>
                      <Box>
                        <RangeDatePicker
                          isBefore={false}
                          dateStr={dateStr}
                          isOpen={isOpenDatePicker}
                          onOpen={onOpenDatePicker}
                          onClose={onCloseDatePicker}
                          onInitDate={() => {
                            initDate('');
                          }}
                          start={startDate}
                          end={endDate}
                          handleOnChangeDate={(dates) => {
                            handleOnChangeDatePicker(dates);
                          }}
                        />
                      </Box>
                    </HStack>
                  </WrapItem>
                </Wrap>
              </Box>

              <Box w={'100%'}>
                <Wrap alignItems={'center'} spacingX={0} spacingY={'0.2rem'}>
                  <WrapItem w={'12.5rem'} h={'3rem'} alignItems={'center'}>
                    <Box w={'100%'} h={'100%'} alignContent={'center'}>
                      <Text
                        color={'#7895B2'}
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        lineHeight={'1.5rem'}
                      >
                        {localeText(LANGUAGES.PROMOTIONS.PROMOTION_TITLE)}
                      </Text>
                    </Box>
                  </WrapItem>

                  <WrapItem w={clampW(30, 60)}>
                    <Box
                      w={'100%'}
                      h={'3rem'}
                      border={'1px solid #9CADBE'}
                      borderRadius={'0.25rem'}
                      boxSizing={'border-box'}
                    >
                      <Input
                        w={'100%'}
                        h={'100%'}
                        placeholder={localeText(
                          LANGUAGES.PROMOTIONS.PH_PROMOTION_TITLE,
                        )}
                        _placeholder={{
                          color: '#A7C3D2',
                          fontSize: '0.9375rem',
                          fontWeight: 400,
                          lineHeight: '1.5rem',
                        }}
                        border={0}
                        value={name || ''}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        color={'#485766'}
                        fontSize={'0.9375rem'}
                        lineHeight={'1.5rem'}
                        bg={'#FFF'}
                      />
                    </Box>
                  </WrapItem>
                </Wrap>
              </Box>

              <Box w={'100%'}>
                <Wrap alignItems={'center'} spacingX={0} spacingY={'0.2rem'}>
                  <WrapItem w={'12.5rem'} h={'3rem'} alignItems={'center'}>
                    <Box w={'100%'} h={'100%'} alignContent={'center'}>
                      <Text
                        color={'#7895B2'}
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        lineHeight={'1.5rem'}
                      >
                        {localeText(LANGUAGES.PROMOTIONS.PROMOTION_CONTENTS)}
                      </Text>
                    </Box>
                  </WrapItem>

                  <Box w={clampW(30, 60)}>
                    <Box
                      w={'100%'}
                      h={'13.5rem'}
                      border={'1px solid #9CADBE'}
                      borderRadius={'0.25rem'}
                      boxSizing={'border-box'}
                    >
                      <Textarea
                        resize={'none'}
                        w={'100%'}
                        h={'100%'}
                        placeholder={localeText(
                          LANGUAGES.PROMOTIONS.PROMOTION_CONTENTS,
                        )}
                        _placeholder={{
                          color: '#A7C3D2',
                          fontSize: '0.9375rem',
                          fontWeight: 400,
                          lineHeight: '1.5rem',
                        }}
                        border={0}
                        value={content || ''}
                        onChange={(e) => {
                          setContent(e.target.value);
                        }}
                        color={'#485766'}
                        fontSize={'0.9375rem'}
                        lineHeight={'1.5rem'}
                        bg={'#FFF'}
                      />
                    </Box>
                  </Box>
                </Wrap>
              </Box>
            </VStack>
          </Box>

          <Divider borderTop={'1px solid #AEBDCA'} />

          <Box w={'100%'}>
            <VStack spacing={'0.75rem'}>
              <Box w={'100%'}>
                <Text
                  color={'#485766'}
                  fontSize={'1.125rem'}
                  fontWeight={500}
                  lineHeight={'1.96875rem'}
                >
                  {localeText(LANGUAGES.PROMOTIONS.UPLOAD_TITLE_IMAGE)}
                </Text>
              </Box>
              <Box w={'100%'} aspectRatio={2.6667}>
                {files.length === 0 && (
                  <DragAndDrop
                    w={'100%'}
                    h={'100%'}
                    limitSize={'1920*720'}
                    files={files}
                    maxFiles={1}
                    onChange={(files) => {
                      setFiles(files);
                    }}
                  />
                )}
                {files.length > 0 && (
                  <Box
                    position={'relative'}
                    w={'100%'}
                    // h={'27.3125rem'}
                    aspectRatio={2.6667}
                  >
                    <Center
                      _hover={{
                        bg: '#00000066',
                        opacity: 0.8,
                      }}
                      cursor={'pointer'}
                      onClick={() => {
                        handleRemoveImage(0);
                      }}
                      w={'100%'}
                      h={'100%'}
                      position={'absolute'}
                      top={0}
                      right={0}
                      opacity={0}
                    >
                      <Box w={'13.5rem'} h={'3rem'}>
                        <Box
                          px={'1.25rem'}
                          py={'0.62rem'}
                          borderRadius={'0.25rem'}
                          border={'1px solid #FFF'}
                          bg={'transparent'}
                          h={'100%'}
                          w={'100%'}
                          _groupHover={{
                            opacity: 0.8,
                          }}
                        >
                          <Text
                            color={'#FFF'}
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                            textAlign={'center'}
                          >
                            {localeText(LANGUAGES.COMMON.DELETE)}
                          </Text>
                        </Box>
                      </Box>
                    </Center>

                    <ChakraImage
                      fallback={<DefaultSkeleton />}
                      w={'100%'}
                      h={'100%'}
                      objectFit={'cover'}
                      src={
                        typeof files[0] === 'string'
                          ? files[0]
                          : URL.createObjectURL(files[0])
                      }
                    />
                  </Box>
                )}
              </Box>
            </VStack>
          </Box>

          <Box w={'100%'}>
            <VStack spacing={'0.75rem'}>
              <Box w={'100%'}>
                <Text
                  color={'#485766'}
                  fontSize={'1.125rem'}
                  fontWeight={500}
                  lineHeight={'1.96875rem'}
                >
                  {localeText(LANGUAGES.PROMOTIONS.SELECT_RELATED_PRODUCT)}
                </Text>
              </Box>

              {!isInitList && (
                <Box w={'100%'}>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <VStack
                      spacing={'1.25rem'}
                      justifyContent={'space-between'}
                      alignItems={'flex-start'}
                    >
                      <Box w={'100%'} bg={'#90aec412'} p={'1.25rem'}>
                        <VStack spacing={'1.25rem'}>
                          <Box w={'100%'}>
                            <SearchInput
                              value={searchBy}
                              onChange={(e) => {
                                setSearchBy(e.target.value);
                              }}
                              onClick={() => {
                                handleGetListProductAgent();
                              }}
                              placeholder={localeText(
                                LANGUAGES.COMMON.PH_SEARCH_TERM,
                              )}
                              placeholderFontColor={'#A7C3D2'}
                            />
                          </Box>

                          <Box w={'100%'}>
                            <Box
                              w={'100%'}
                              borderTop={'1px solid #73829D'}
                              borderBottom={'1px solid #73829D'}
                              px={'1rem'}
                              py={'0.75rem'}
                              boxSizing={'border-box'}
                            >
                              <HStack spacing={'0.75rem'}>
                                <Box w={'23rem'}>
                                  <Text
                                    textAlign={'center'}
                                    color={'#2A333C'}
                                    fontSize={'0.9375rem'}
                                    fontWeight={500}
                                    lineHeight={'1.5rem'}
                                  >
                                    {localeText(LANGUAGES.PRODUCTS.PRODUCT)}
                                  </Text>
                                </Box>
                                <Box w={'7rem'}>
                                  <Text
                                    textAlign={'center'}
                                    color={'#2A333C'}
                                    fontSize={'0.9375rem'}
                                    fontWeight={500}
                                    lineHeight={'1.5rem'}
                                  >
                                    {localeText(
                                      LANGUAGES.PRODUCTS.SALES_AMOUNT,
                                    )}
                                  </Text>
                                </Box>
                              </HStack>
                            </Box>
                            <Box w={'100%'}>
                              <VStack spacing={'0.75rem'}>
                                <Box
                                  w={'100%'}
                                  borderBottom={'1px solid #AEBDCA'}
                                >
                                  <Droppable droppableId="left">
                                    {(provided) => (
                                      <Box
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        w={'100%'}
                                        h={'32.5rem'}
                                        overflowY={'auto'}
                                        className={'no-scroll'}
                                      >
                                        {/* 왼쪽 리스트에서 오른쪽에 포함된 항목을 제외 */}
                                        {leftList.length === 0 ? (
                                          <Center w={'100%'} h={'10rem'}>
                                            <Text
                                              fontSize={'1.25rem'}
                                              fontWeight={400}
                                              lineHeight={'1.75rem'}
                                            >
                                              {localeText(
                                                LANGUAGES.INFO_MSG
                                                  .NO_ITEM_SEARCHED,
                                              )}
                                            </Text>
                                          </Center>
                                        ) : (
                                          leftList
                                            .filter(
                                              (item) =>
                                                item?.productId && // productId가 있는 항목만 필터링
                                                !rightList.some(
                                                  (rightItem) =>
                                                    rightItem.productId ===
                                                    item.productId,
                                                ), // 오른쪽 리스트에 있는 항목 제외
                                            )
                                            .filter(
                                              (item, index, self) =>
                                                index ===
                                                self.findIndex(
                                                  (t) =>
                                                    t.productId ===
                                                    item.productId,
                                                ), // 왼쪽 리스트에서 중복된 항목 제외
                                            )
                                            .map((item, index) => (
                                              <Draggable
                                                key={item.productId}
                                                draggableId={String(
                                                  item.productId,
                                                )}
                                                index={index}
                                              >
                                                {(provided) =>
                                                  productCard(provided, item)
                                                }
                                              </Draggable>
                                            ))
                                        )}
                                        {provided.placeholder}
                                      </Box>
                                    )}
                                  </Droppable>
                                </Box>
                                <Box w={'100%'} h={'1.5rem'}>
                                  <HStack justifyContent={'flex-end'}>
                                    <DefaultPaginate
                                      isSmall
                                      currentPage={currentPage}
                                      setCurrentPage={setCurrentPage}
                                      totalCount={totalCount}
                                      contentNum={contentNum}
                                    />
                                  </HStack>
                                </Box>
                              </VStack>
                            </Box>
                          </Box>
                        </VStack>
                      </Box>
                      <Center h={'100%'} alignSelf={'center'}>
                        <HStack>
                          <Center w={'1.25rem'} h={'1.25rem'}>
                            <Img src={IconUp.src} />
                          </Center>
                          <Center w={'1.25rem'} h={'1.25rem'}>
                            <Img src={IconDown.src} />
                          </Center>
                        </HStack>
                      </Center>
                      <Box w={'100%'} bg={'#90aec412'} p={'1.25rem'}>
                        <VStack spacing={'1.25rem'}>
                          <Box w={'100%'} h={'3rem'} alignContent={'center'}>
                            <Text
                              fontSize={'1rem'}
                              lineHeight={'1.75rem'}
                              color={'#556A7E'}
                            >
                              {`${localeText(
                                LANGUAGES.PROMOTIONS.REGISTERED_PRODUCTS,
                              )} (${rightList.length})`}
                            </Text>
                          </Box>

                          <Box w={'100%'}>
                            {/* header */}
                            <Box
                              w={'100%'}
                              borderTop={'1px solid #73829D'}
                              borderBottom={'1px solid #73829D'}
                              px={'1rem'}
                              py={'0.75rem'}
                              boxSizing={'border-box'}
                            >
                              <HStack spacing={'0.75rem'}>
                                <Box w={'23rem'}>
                                  <Text
                                    textAlign={'center'}
                                    color={'#2A333C'}
                                    fontSize={'0.9375rem'}
                                    fontWeight={500}
                                    lineHeight={'1.5rem'}
                                  >
                                    {localeText(LANGUAGES.PRODUCTS.PRODUCT)}
                                  </Text>
                                </Box>
                                <Box w={'7rem'}>
                                  <Text
                                    textAlign={'center'}
                                    color={'#2A333C'}
                                    fontSize={'0.9375rem'}
                                    fontWeight={500}
                                    lineHeight={'1.5rem'}
                                  >
                                    {localeText(
                                      LANGUAGES.PRODUCTS.SALES_AMOUNT,
                                    )}
                                  </Text>
                                </Box>
                              </HStack>
                            </Box>
                            <Box w={'100%'}>
                              <VStack spacing={'0.75rem'}>
                                <Box
                                  w={'100%'}
                                  borderBottom={'1px solid #AEBDCA'}
                                >
                                  <Droppable droppableId="right">
                                    {(provided) => (
                                      <Box
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        w={'100%'}
                                        h={'32.5rem'}
                                        overflowY={'auto'}
                                        className={'no-scroll'}
                                      >
                                        {/* 오른쪽 리스트 */}
                                        {rightList.length === 0 ? (
                                          <Spacer />
                                        ) : (
                                          rightList.map((item, index) => {
                                            if (item?.productId) {
                                              return (
                                                <Draggable
                                                  key={item.productId}
                                                  draggableId={String(
                                                    item.productId,
                                                  )}
                                                  index={index}
                                                >
                                                  {(provided) =>
                                                    productCard(provided, item)
                                                  }
                                                </Draggable>
                                              );
                                            }
                                          })
                                        )}
                                        {provided.placeholder}
                                      </Box>
                                    )}
                                  </Droppable>
                                </Box>
                                <Box w={'100%'} h={'1.5rem'} />
                              </VStack>
                            </Box>
                          </Box>
                        </VStack>
                      </Box>
                    </VStack>
                  </DragDropContext>
                </Box>
              )}
            </VStack>
          </Box>
        </VStack>
        <ContentBR h={'1.25rem'} />
      </Box>
    </MainContainer>
  ) : (
    <MainContainer
      isDetailHeader
      contentHeader={
        <Box>
          <HStack spacing={'0.75rem'}>
            <Text
              color={'#A87C4E'}
              fontSize={'1rem'}
              fontWeight={400}
              lineHeight={'1.75rem'}
            >
              {localeText(LANGUAGES.PROMOTIONS.DECISION_ADMIN_SCREEN)}
            </Text>
            <Box minW={'13.5rem'} h={'3rem'}>
              <Button
                // isDisabled
                onClick={() => {
                  handleActionPromotion();
                }}
                px={'1.25rem'}
                py={'0.63rem'}
                borderRadius={'0.25rem'}
                bg={'#7895B2'}
                h={'100%'}
                w={'100%'}
                _disabled={{
                  bg: '#D9E7EC',
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
                  {action === 'modify'
                    ? localeText(LANGUAGES.PROMOTIONS.MODIFY_REQUEST)
                    : localeText(LANGUAGES.PROMOTIONS.MAKE_REQUEST)}
                </Text>
              </Button>
            </Box>
          </HStack>
        </Box>
      }
    >
      <Box w={'100%'}>
        <VStack spacing={'2.5rem'}>
          <Box w={'100%'}>
            <VStack spacing={'1.25rem'}>
              <Box w={'100%'}>
                <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                  <Box w={'12.5rem'} h={'3rem'} alignContent={'center'}>
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
                    <HStack spacing={'2.5rem'}>
                      <Box>
                        <HStack spacing={'0.5rem'}>
                          <CustomCheckBox
                            isChecked={isUnLimit}
                            onChange={(value) => {
                              setIsUnLimit(value);
                            }}
                          />
                          <Text
                            color={'#485766'}
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.COMMON.UNLIMITED)}
                          </Text>
                        </HStack>
                      </Box>
                      <Box>
                        <RangeDatePicker
                          isBefore={false}
                          dateStr={dateStr}
                          isOpen={isOpenDatePicker}
                          onOpen={onOpenDatePicker}
                          onClose={onCloseDatePicker}
                          onInitDate={() => {
                            initDate('');
                          }}
                          start={startDate}
                          end={endDate}
                          handleOnChangeDate={(dates) => {
                            handleOnChangeDatePicker(dates);
                          }}
                        />
                      </Box>
                    </HStack>
                  </Box>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                  <Box w={'12.5rem'} h={'3rem'} alignContent={'center'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.PROMOTIONS.PROMOTION_TITLE)}
                    </Text>
                  </Box>
                  <Box w={'58.25rem'}>
                    <Box
                      w={'100%'}
                      h={'3rem'}
                      border={'1px solid #9CADBE'}
                      borderRadius={'0.25rem'}
                      boxSizing={'border-box'}
                    >
                      <Input
                        w={'100%'}
                        h={'100%'}
                        placeholder={localeText(
                          LANGUAGES.PROMOTIONS.PH_PROMOTION_TITLE,
                        )}
                        _placeholder={{
                          color: '#A7C3D2',
                          fontSize: '0.9375rem',
                          fontWeight: 400,
                          lineHeight: '1.5rem',
                        }}
                        border={0}
                        value={name || ''}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        color={'#485766'}
                        fontSize={'0.9375rem'}
                        lineHeight={'1.5rem'}
                        bg={'#FFF'}
                      />
                    </Box>
                  </Box>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <HStack
                  justifyContent={'flex-start'}
                  spacing={'2rem'}
                  alignItems={'flex-start'}
                >
                  <Box w={'12.5rem'} alignContent={'center'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.PROMOTIONS.PROMOTION_CONTENTS)}
                    </Text>
                  </Box>
                  <Box w={'58.25rem'} h={'13.5rem'}>
                    <Box
                      w={'100%'}
                      h={'100%'}
                      border={'1px solid #9CADBE'}
                      borderRadius={'0.25rem'}
                      boxSizing={'border-box'}
                    >
                      <Textarea
                        resize={'none'}
                        w={'100%'}
                        h={'100%'}
                        placeholder={localeText(
                          LANGUAGES.PROMOTIONS.PROMOTION_CONTENTS,
                        )}
                        _placeholder={{
                          color: '#A7C3D2',
                          fontSize: '0.9375rem',
                          fontWeight: 400,
                          lineHeight: '1.5rem',
                        }}
                        border={0}
                        value={content || ''}
                        onChange={(e) => {
                          setContent(e.target.value);
                        }}
                        color={'#485766'}
                        fontSize={'0.9375rem'}
                        lineHeight={'1.5rem'}
                        bg={'#FFF'}
                      />
                    </Box>
                  </Box>
                </HStack>
              </Box>
            </VStack>
          </Box>

          <Divider borderTop={'1px solid #AEBDCA'} />

          <Box w={'100%'}>
            <VStack spacing={'0.75rem'}>
              <Box w={'100%'}>
                <Text
                  color={'#485766'}
                  fontSize={'1.125rem'}
                  fontWeight={500}
                  lineHeight={'1.96875rem'}
                >
                  {localeText(LANGUAGES.PROMOTIONS.UPLOAD_TITLE_IMAGE)}
                </Text>
              </Box>
              <Box w={'100%'} aspectRatio={2.6667}>
                {files.length === 0 && (
                  <DragAndDrop
                    w={'100%'}
                    h={'100%'}
                    limitSize={'1920*720'}
                    files={files}
                    maxFiles={1}
                    onChange={(files) => {
                      setFiles(files);
                    }}
                  />
                )}
                {files.length > 0 && (
                  <Box
                    position={'relative'}
                    w={'100%'}
                    h={'27.3125rem'}
                    aspectRatio={2.6667}
                  >
                    <Center
                      _hover={{
                        bg: '#00000066',
                        opacity: 0.8,
                      }}
                      cursor={'pointer'}
                      onClick={() => {
                        handleRemoveImage(0);
                      }}
                      w={'100%'}
                      h={'100%'}
                      position={'absolute'}
                      top={0}
                      right={0}
                      opacity={0}
                    >
                      <Box w={'13.5rem'} h={'3rem'}>
                        <Box
                          px={'1.25rem'}
                          py={'0.62rem'}
                          borderRadius={'0.25rem'}
                          border={'1px solid #FFF'}
                          bg={'transparent'}
                          h={'100%'}
                          w={'100%'}
                          _groupHover={{
                            opacity: 0.8,
                          }}
                        >
                          <Text
                            color={'#FFF'}
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                            textAlign={'center'}
                          >
                            {localeText(LANGUAGES.COMMON.DELETE)}
                          </Text>
                        </Box>
                      </Box>
                    </Center>

                    <ChakraImage
                      fallback={<DefaultSkeleton />}
                      w={'100%'}
                      h={'100%'}
                      objectFit={'cover'}
                      src={
                        typeof files[0] === 'string'
                          ? files[0]
                          : URL.createObjectURL(files[0])
                      }
                    />
                  </Box>
                )}
              </Box>
            </VStack>
          </Box>

          <Box w={'100%'}>
            <VStack spacing={'0.75rem'}>
              <Box w={'100%'}>
                <Text
                  color={'#485766'}
                  fontSize={'1.125rem'}
                  fontWeight={500}
                  lineHeight={'1.96875rem'}
                >
                  {localeText(LANGUAGES.PROMOTIONS.SELECT_RELATED_PRODUCT)}
                </Text>
              </Box>

              {!isInitList && (
                <Box w={'100%'}>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <HStack
                      spacing={'1.25rem'}
                      justifyContent={'space-between'}
                      alignItems={'flex-start'}
                    >
                      <Box w={'50%'} bg={'#90aec412'} p={'1.25rem'}>
                        <VStack spacing={'1.25rem'}>
                          <Box w={'100%'}>
                            <SearchInput
                              value={searchBy}
                              onChange={(e) => {
                                setSearchBy(e.target.value);
                              }}
                              onClick={() => {
                                handleGetListProductAgent();
                              }}
                              placeholder={localeText(
                                LANGUAGES.COMMON.PH_SEARCH_TERM,
                              )}
                              placeholderFontColor={'#A7C3D2'}
                            />
                          </Box>

                          <Box w={'100%'}>
                            <Box
                              w={'100%'}
                              borderTop={'1px solid #73829D'}
                              borderBottom={'1px solid #73829D'}
                              px={'1rem'}
                              py={'0.75rem'}
                              boxSizing={'border-box'}
                            >
                              <HStack spacing={'0.75rem'}>
                                <Box w={'23rem'}>
                                  <Text
                                    textAlign={'center'}
                                    color={'#2A333C'}
                                    fontSize={'0.9375rem'}
                                    fontWeight={500}
                                    lineHeight={'1.5rem'}
                                  >
                                    {localeText(LANGUAGES.PRODUCTS.PRODUCT)}
                                  </Text>
                                </Box>
                                <Box w={'7rem'}>
                                  <Text
                                    textAlign={'center'}
                                    color={'#2A333C'}
                                    fontSize={'0.9375rem'}
                                    fontWeight={500}
                                    lineHeight={'1.5rem'}
                                  >
                                    {localeText(
                                      LANGUAGES.PRODUCTS.SALES_AMOUNT,
                                    )}
                                  </Text>
                                </Box>
                              </HStack>
                            </Box>
                            <Box w={'100%'}>
                              <VStack spacing={'0.75rem'}>
                                <Box
                                  w={'100%'}
                                  borderBottom={'1px solid #AEBDCA'}
                                >
                                  <Droppable droppableId="left">
                                    {(provided) => (
                                      <Box
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        w={'100%'}
                                        h={'32.5rem'}
                                        overflowY={'auto'}
                                        className={'no-scroll'}
                                      >
                                        {/* 왼쪽 리스트에서 오른쪽에 포함된 항목을 제외 */}
                                        {leftList.length === 0 ? (
                                          <Center w={'100%'} h={'10rem'}>
                                            <Text
                                              fontSize={'1.25rem'}
                                              fontWeight={400}
                                              lineHeight={'1.75rem'}
                                            >
                                              {localeText(
                                                LANGUAGES.INFO_MSG
                                                  .NO_ITEM_SEARCHED,
                                              )}
                                            </Text>
                                          </Center>
                                        ) : (
                                          leftList
                                            .filter(
                                              (item) =>
                                                item?.productId && // productId가 있는 항목만 필터링
                                                !rightList.some(
                                                  (rightItem) =>
                                                    rightItem.productId ===
                                                    item.productId,
                                                ), // 오른쪽 리스트에 있는 항목 제외
                                            )
                                            .filter(
                                              (item, index, self) =>
                                                index ===
                                                self.findIndex(
                                                  (t) =>
                                                    t.productId ===
                                                    item.productId,
                                                ), // 왼쪽 리스트에서 중복된 항목 제외
                                            )
                                            .map((item, index) => (
                                              <Draggable
                                                key={item.productId}
                                                draggableId={String(
                                                  item.productId,
                                                )}
                                                index={index}
                                              >
                                                {(provided) =>
                                                  productCard(provided, item)
                                                }
                                              </Draggable>
                                            ))
                                        )}
                                        {provided.placeholder}
                                      </Box>
                                    )}
                                  </Droppable>
                                </Box>
                                <Box w={'100%'} h={'1.5rem'}>
                                  <HStack justifyContent={'flex-end'}>
                                    <DefaultPaginate
                                      isSmall
                                      currentPage={currentPage}
                                      setCurrentPage={setCurrentPage}
                                      totalCount={totalCount}
                                      contentNum={contentNum}
                                    />
                                  </HStack>
                                </Box>
                              </VStack>
                            </Box>
                          </Box>
                        </VStack>
                      </Box>
                      <Center h={'100%'} alignSelf={'center'}>
                        <VStack>
                          <Center w={'1.25rem'} h={'1.25rem'}>
                            <Img src={IconRight.src} />
                          </Center>
                          <Center w={'1.25rem'} h={'1.25rem'}>
                            <Img src={IconLeft.src} />
                          </Center>
                        </VStack>
                      </Center>
                      <Box w={'50%'} bg={'#90aec412'} p={'1.25rem'}>
                        <VStack spacing={'1.25rem'}>
                          <Box w={'100%'} h={'3rem'} alignContent={'center'}>
                            <Text
                              fontSize={'1rem'}
                              lineHeight={'1.75rem'}
                              color={'#556A7E'}
                            >
                              {`${localeText(
                                LANGUAGES.PROMOTIONS.REGISTERED_PRODUCTS,
                              )} (${rightList.length})`}
                            </Text>
                          </Box>

                          <Box w={'100%'}>
                            {/* header */}
                            <Box
                              w={'100%'}
                              borderTop={'1px solid #73829D'}
                              borderBottom={'1px solid #73829D'}
                              px={'1rem'}
                              py={'0.75rem'}
                              boxSizing={'border-box'}
                            >
                              <HStack spacing={'0.75rem'}>
                                <Box w={'23rem'}>
                                  <Text
                                    textAlign={'center'}
                                    color={'#2A333C'}
                                    fontSize={'0.9375rem'}
                                    fontWeight={500}
                                    lineHeight={'1.5rem'}
                                  >
                                    {localeText(LANGUAGES.PRODUCTS.PRODUCT)}
                                  </Text>
                                </Box>
                                <Box w={'7rem'}>
                                  <Text
                                    textAlign={'center'}
                                    color={'#2A333C'}
                                    fontSize={'0.9375rem'}
                                    fontWeight={500}
                                    lineHeight={'1.5rem'}
                                  >
                                    {localeText(
                                      LANGUAGES.PRODUCTS.SALES_AMOUNT,
                                    )}
                                  </Text>
                                </Box>
                              </HStack>
                            </Box>
                            <Box w={'100%'}>
                              <VStack spacing={'0.75rem'}>
                                <Box
                                  w={'100%'}
                                  borderBottom={'1px solid #AEBDCA'}
                                >
                                  <Droppable droppableId="right">
                                    {(provided) => (
                                      <Box
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        w={'100%'}
                                        h={'32.5rem'}
                                        overflowY={'auto'}
                                        className={'no-scroll'}
                                      >
                                        {/* 오른쪽 리스트 */}
                                        {rightList.length === 0 ? (
                                          <Spacer />
                                        ) : (
                                          rightList.map((item, index) => {
                                            if (item?.productId) {
                                              return (
                                                <Draggable
                                                  key={item.productId}
                                                  draggableId={String(
                                                    item.productId,
                                                  )}
                                                  index={index}
                                                >
                                                  {(provided) =>
                                                    productCard(provided, item)
                                                  }
                                                </Draggable>
                                              );
                                            }
                                          })
                                        )}
                                        {provided.placeholder}
                                      </Box>
                                    )}
                                  </Droppable>
                                </Box>
                                <Box w={'100%'} h={'1.5rem'} />
                              </VStack>
                            </Box>
                          </Box>
                        </VStack>
                      </Box>
                    </HStack>
                  </DragDropContext>
                </Box>
              )}
            </VStack>
          </Box>
        </VStack>
        <ContentBR h={'1.25rem'} />
      </Box>
    </MainContainer>
  );
};

export default PromotionsDetailActionPage;
