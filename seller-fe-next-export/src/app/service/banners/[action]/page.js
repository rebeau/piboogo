'use client';

import CustomCheckBox from '@/components/common/checkbox/CustomCheckBox';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Select,
  Divider,
  RadioGroup,
  Radio,
  Input,
  useDisclosure,
  Center,
  Image as ChakraImage,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import BannerPreview from '@/components/custom/banner/BannerPreview';
import RangeDatePicker from '@/components/date/RangeDatePicker';
import DragAndDrop from '@/components/input/file/DragAndDrop';
import utils from '@/utils';
import ContentBR from '@/components/custom/ContentBR';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import bannerApi from '@/services/bannerApi';
import useModal from '@/hooks/useModal';
import { useParams } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { selectedBannerState } from '@/stores/dataRecoil';
import { SUCCESS } from '@/constants/errorCode';
import useMove from '@/hooks/useMove';
import MainContainer from '@/components/layout/MainContainer';
import useDevice from '@/hooks/useDevice';
import { toZonedTime } from 'date-fns-tz';
import { TIME_ZONE } from '@/constants/common';

const BannersActionPage = () => {
  const { isMobile, clampW } = useDevice();
  const [selectedBanner, setSelectedBanner] =
    useRecoilState(selectedBannerState);
  const { moveBack } = useMove();
  const { action } = useParams();
  const { localeText } = useLocale();
  const { openModal } = useModal();

  useEffect(() => {
    if (action === 'modify' || action === 'add') {
      if (selectedBanner?.bannerId) {
        handleGetBanner();
      }
    } else {
      console.log('팅');
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_POST),
        onAgree: () => {
          moveBack();
        },
      });
    }
  }, [action]);

  const [name, setName] = useState(null);
  const [type, setType] = useState(1);
  const [link, setLink] = useState(null);
  const [linkType, setLinkType] = useState(1);
  const [isUnLimit, setIsUnLimit] = useState(false);
  const now = toZonedTime(new Date(), TIME_ZONE);
  // 7일 뒤 날짜 계산
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

  const [files, setFiles] = useState([]);
  const [srcs, setSrcs] = useState([]);

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

  const handleActionBanner = () => {
    if (action === 'modify') {
      handleModifyBanner();
    } else {
      handlePostBanner();
    }
  };

  const handleGetBanner = async () => {
    const param = {
      bannerId: selectedBanner.bannerId,
    };
    const result = await bannerApi.getBanner(param);
    if (result?.errorCode === SUCCESS) {
      const data = result.data;
      setName(data?.name);
      setType(data?.type);
      setLink(data?.link || '');
      setLinkType(data?.linkType || 1);
      if (data?.startDate && data?.endDate) {
        setIsUnLimit(false);
        setTimeout(() => {
          setStartDate(utils.parseDateFromSimpleStr(data.startDate));
          setEndDate(utils.parseDateFromSimpleStr(data.endDate));
        }, 200);
      } else {
        setIsUnLimit(true);
      }
      setFiles([data?.imageS3Url]);
    }
  };

  const handleModifyBanner = async () => {
    if (!name) {
      openModal({
        text: localeText(LANGUAGES.ERR_MSG.SERVICE.NOT_FOUND_BANNER_NAME),
      });
      return;
    }
    if (files.length === 0) {
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_UPLOAD_FILE),
      });
      return;
    }
    const param = {
      bannerId: selectedBanner.bannerId,
      name: name,
      type: type,
    };
    if (link) {
      param.link = link;
      param.linkType = linkType;
    }
    if (!isUnLimit) {
      param.startDate = utils.parseDateToYMD(startDate);
      param.endDate = utils.parseDateToYMD(endDate);
    }

    const fileObjectsOnly = files.filter((file) => file instanceof File);

    const result = await bannerApi.patchBanner(param, fileObjectsOnly);
    if (result?.message) {
      openModal({
        text: result.message,
        onAgree: () => {
          if (result?.errorCode === SUCCESS) {
            setSelectedBanner({});
            moveBack();
          }
        },
      });
    }
  };

  const handlePostBanner = async () => {
    if (!name) {
      openModal({
        text: localeText(LANGUAGES.ERR_MSG.SERVICE.NOT_FOUND_BANNER_NAME),
      });
      return;
    }
    if (files.length === 0) {
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_UPLOAD_FILE),
      });
      return;
    }
    const param = {
      name: name,
      type: type,
    };
    if (link) {
      param.link = link;
      param.linkType = linkType;
    }
    if (!isUnLimit) {
      param.startDate = utils.parseDateToYMD(startDate);
      param.endDate = utils.parseDateToYMD(endDate);
    }

    const result = await bannerApi.postBanner(param, files);
    if (result?.message) {
      openModal({
        text: result.message,
        onAgree: () => {
          if (result?.errorCode === SUCCESS) {
            setSelectedBanner({});
            moveBack();
          }
        },
      });
    }
  };

  return isMobile(true) ? (
    <MainContainer isDetailHeader>
      <Box w={'100%'} px={clampW(1, 5)} mb={'6.5rem'}>
        <Box w={'100%'}>
          <VStack spacing={clampW(0.7, 1.5)}>
            <Box w={'100%'}>
              <Wrap alignItems={'center'} spacingX={0} spacingY={'0.2rem'}>
                <WrapItem w={'12.5rem'} h={'3rem'} alignItems={'center'}>
                  <Box w={'12.5rem'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.BANNERS.PERIOD)}
                    </Text>
                  </Box>
                </WrapItem>
                <WrapItem w={clampW(30, 60)}>
                  <Wrap alignItems={'flex-start'} spacing={'0.5rem'}>
                    <WrapItem>
                      <HStack h={'100%'} alignItems={'center'}>
                        <CustomCheckBox
                          isChecked={isUnLimit}
                          onChange={(v) => {
                            setIsUnLimit(v);
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
                    </WrapItem>
                    <WrapItem>
                      <RangeDatePicker
                        isBefore={false}
                        dateStr={dateStr}
                        isOpen={isOpenDatePicker}
                        onOpen={onOpenDatePicker}
                        onClose={onCloseDatePicker}
                        onInitDate={initDate}
                        start={startDate}
                        end={endDate}
                        handleOnChangeDate={handleOnChangeDatePicker}
                      />
                    </WrapItem>
                  </Wrap>
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
                      {localeText(LANGUAGES.BANNERS.NAME)}
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
                      placeholder={localeText(LANGUAGES.BANNERS.NAME)}
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
                      {localeText(LANGUAGES.BANNERS.BANNER_LINK)}
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
                      placeholder={localeText(LANGUAGES.BANNERS.BANNER_LINK)}
                      _placeholder={{
                        color: '#A7C3D2',
                        fontSize: '0.9375rem',
                        fontWeight: 400,
                        lineHeight: '1.5rem',
                      }}
                      border={0}
                      value={link || ''}
                      onChange={(e) => {
                        setLink(e.target.value);
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
                      {localeText(LANGUAGES.BANNERS.LINK_TARGET)}
                    </Text>
                  </Box>
                </WrapItem>

                <WrapItem w={clampW(30, 60)}>
                  <Box w={'100%'} h={'3rem'}>
                    <Select
                      value={linkType}
                      onChange={(e) => {
                        setLinkType(Number(e.target.value));
                      }}
                      w={'100%'}
                      h={'3rem'}
                      bg={'#FFF'}
                      borderRadius={'0.25rem'}
                      boxSizing={'border-box'}
                      border={'1px solid #9CADBE'}
                    >
                      <option value={1}>
                        {localeText(LANGUAGES.BANNERS.NAVIGATE_TO_PAGE)}
                      </option>
                      <option value={2}>
                        {localeText(LANGUAGES.BANNERS.FLOATING_NEW_WINDOW)}
                      </option>
                    </Select>
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
                      {localeText(LANGUAGES.BANNERS.POSITION)}
                    </Text>
                  </Box>
                </WrapItem>

                <WrapItem w={clampW(30, 60)}>
                  <Box w={'100%'}>
                    <RadioGroup
                      value={type}
                      onChange={(value) => {
                        setType(Number(value));
                      }}
                    >
                      <HStack spacing={'1.25rem'}>
                        <Box>
                          <HStack alignItems={'flex-start'} spacing={'0.5rem'}>
                            <Radio value={1} />
                            <BannerPreview position={1} />
                          </HStack>
                        </Box>
                        <Box>
                          <HStack alignItems={'flex-start'} spacing={'0.5rem'}>
                            <Radio value={2} />
                            <BannerPreview position={2} />
                          </HStack>
                        </Box>
                      </HStack>
                    </RadioGroup>
                  </Box>
                </WrapItem>
              </Wrap>
            </Box>
          </VStack>
        </Box>

        <ContentBR h={'2.5rem'} />

        <Divider borderTop={'1px solid #AEBDCA'} />

        <ContentBR h={'2.5rem'} />

        <Box w={'100%'}>
          <Text
            color={'#485766'}
            fontSize={'1.125rem'}
            fontWeight={500}
            lineHeight={'1.96875rem'}
          >
            {localeText(LANGUAGES.BANNERS.UPLOAD_TITLE_IMAGE)}
          </Text>
        </Box>

        <ContentBR
          h={'0.25rem'}
          // 0.75
        />

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
            <Box position={'relative'} w={'100%'} h={'100%'}>
              <Center
                _hover={{
                  bg: '#00000066',
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
                    _hover={{
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

        <ContentBR h={'1.25rem'} />
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
          onClick={() => {
            handleActionBanner();
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
            {action === 'modify'
              ? localeText(LANGUAGES.BANNERS.MODIFY_REQUEST)
              : localeText(LANGUAGES.BANNERS.MAKE_REQUEST)}
          </Text>
        </Button>
      </Box>
    </MainContainer>
  ) : (
    <MainContainer
      isDetailHeader
      contentHeader={
        <Box minW={'13.5rem'} h={'3rem'}>
          <Button
            onClick={() => {
              handleActionBanner();
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
              {action === 'modify'
                ? localeText(LANGUAGES.BANNERS.MODIFY_REQUEST)
                : localeText(LANGUAGES.BANNERS.MAKE_REQUEST)}
            </Text>
          </Button>
        </Box>
      }
    >
      <Box w={'100%'} h={'calc(100% - 3rem)'}>
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
                    {localeText(LANGUAGES.BANNERS.PERIOD)}
                  </Text>
                </Box>
                <Box>
                  <HStack spacing={'2.5rem'}>
                    <Box>
                      <HStack spacing={'0.5rem'}>
                        <CustomCheckBox
                          isChecked={isUnLimit}
                          onChange={(v) => {
                            setIsUnLimit(v);
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
                        onInitDate={initDate}
                        start={startDate}
                        end={endDate}
                        handleOnChangeDate={handleOnChangeDatePicker}
                      />
                    </Box>
                  </HStack>
                </Box>
              </HStack>
            </Box>

            <Box w={'100%'}>
              <HStack justifyContent={'flex-start'} spacing={'2rem'}>
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
                    {localeText(LANGUAGES.BANNERS.NAME)}
                  </Text>
                </Box>
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
                    placeholder={localeText(LANGUAGES.BANNERS.NAME)}
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
              </HStack>
            </Box>

            <Box w={'100%'}>
              <HStack justifyContent={'flex-start'} spacing={'2rem'}>
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
                    {localeText(LANGUAGES.BANNERS.BANNER_LINK)}
                  </Text>
                </Box>
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
                    placeholder={localeText(LANGUAGES.BANNERS.BANNER_LINK)}
                    _placeholder={{
                      color: '#A7C3D2',
                      fontSize: '0.9375rem',
                      fontWeight: 400,
                      lineHeight: '1.5rem',
                    }}
                    border={0}
                    value={link || ''}
                    onChange={(e) => {
                      setLink(e.target.value);
                    }}
                    color={'#485766'}
                    fontSize={'0.9375rem'}
                    lineHeight={'1.5rem'}
                    bg={'#FFF'}
                  />
                </Box>
              </HStack>
            </Box>

            <Box w={'100%'}>
              <HStack
                alignItems={'flex-start'}
                justifyContent={'flex-start'}
                spacing={'2rem'}
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
                    {localeText(LANGUAGES.BANNERS.LINK_TARGET)}
                  </Text>
                </Box>
                <Box w={'100%'}>
                  <Select
                    value={linkType}
                    onChange={(e) => {
                      setLinkType(Number(e.target.value));
                    }}
                    w={'100%'}
                    h={'3rem'}
                    bg={'#FFF'}
                    borderRadius={'0.25rem'}
                    boxSizing={'border-box'}
                    border={'1px solid #9CADBE'}
                  >
                    <option value={1}>
                      {localeText(LANGUAGES.BANNERS.NAVIGATE_TO_PAGE)}
                    </option>
                    <option value={2}>
                      {localeText(LANGUAGES.BANNERS.FLOATING_NEW_WINDOW)}
                    </option>
                  </Select>
                </Box>
              </HStack>
            </Box>

            <Box w={'100%'}>
              <HStack
                justifyContent={'flex-start'}
                alignItems={'flex-start'}
                spacing={'2rem'}
              >
                <Box w={'12.5rem'} minW={'12.5rem'}>
                  <Text
                    color={'#7895B2'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {localeText(LANGUAGES.BANNERS.POSITION)}
                  </Text>
                </Box>
                <Box>
                  <RadioGroup
                    w={'100%'}
                    value={type}
                    onChange={(value) => {
                      setType(Number(value));
                    }}
                  >
                    <HStack spacing={'1.25rem'}>
                      <Box>
                        <HStack alignItems={'flex-start'} spacing={'0.5rem'}>
                          <Radio value={1} />
                          <BannerPreview position={1} />
                        </HStack>
                      </Box>
                      <Box>
                        <HStack alignItems={'flex-start'} spacing={'0.5rem'}>
                          <Radio value={2} />
                          <BannerPreview position={2} />
                        </HStack>
                      </Box>
                    </HStack>
                  </RadioGroup>
                </Box>
              </HStack>
            </Box>
          </VStack>
        </Box>

        <ContentBR h={'2.5rem'} />

        <Divider borderTop={'1px solid #AEBDCA'} />

        <ContentBR h={'2.5rem'} />

        <Box w={'100%'}>
          <Text
            color={'#485766'}
            fontSize={'1.125rem'}
            fontWeight={500}
            lineHeight={'1.96875rem'}
          >
            {localeText(LANGUAGES.BANNERS.UPLOAD_TITLE_IMAGE)}
          </Text>
        </Box>

        <ContentBR
          h={'0.25rem'}
          // 0.75
        />

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
            <Box position={'relative'} w={'100%'} h={'100%'}>
              <Center
                _hover={{
                  bg: '#00000066',
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
                    _hover={{
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

        <ContentBR h={'1.25rem'} />
      </Box>
    </MainContainer>
  );
};

export default BannersActionPage;
