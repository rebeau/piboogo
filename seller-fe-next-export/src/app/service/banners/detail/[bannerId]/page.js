'use client';

import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import {
  Box,
  Button,
  HStack,
  Image as ChakraImage,
  Text,
  VStack,
  Divider,
  Img,
  Center,
} from '@chakra-ui/react';
import { view } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import utils from '@/utils';
import BannerPreview from '@/components/custom/banner/BannerPreview';
import bannerApi from '@/services/bannerApi';
import { SUCCESS } from '@/constants/errorCode';
import useStatus from '@/hooks/useStatus';
import { selectedBannerState } from '@/stores/dataRecoil';
import { useSetRecoilState } from 'recoil';
import useMove from '@/hooks/useMove';
import useModal from '@/hooks/useModal';
import MainContainer from '@/components/layout/MainContainer';
import ContentBR from '@/components/custom/ContentBR';
import useDevice from '@/hooks/useDevice';
import IconEdit from '@public/svgs/icon/lounge-pen.svg';
import IconDelete from '@public/svgs/icon/lounge-delete.svg';

const BannersDetailPage = () => {
  const { isMobile, clampW } = useDevice();
  const setSelectedBanner = useSetRecoilState(selectedBannerState);
  const { bannerId } = useParams();
  const { moveBannerModify, moveBack } = useMove();
  const { openModal } = useModal();
  const { lang, localeText } = useLocale();
  const { handleGetBannerLinkTarget, handleGetAuthStatus } = useStatus();
  const [bannerInfo, setBannerInfo] = useState({});
  const [period, setPeriod] = useState('');

  useEffect(() => {
    if (bannerId) {
      handleGetBanner();
    } else {
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_POST),
        onAgree: () => {
          moveBack();
        },
      });
    }
  }, [bannerId]);

  const handleGetBanner = async () => {
    const param = {
      bannerId: bannerId,
    };
    const result = await bannerApi.getBanner(param);
    if (result?.errorCode === SUCCESS) {
      const bannerInfo = result.data;
      setBannerInfo(bannerInfo);
      if (bannerInfo.startDate && bannerInfo.endDate) {
        setPeriod(
          `${utils.parseDateByCountryCode(bannerInfo.startDate, lang)} - ${utils.parseDateByCountryCode(bannerInfo.endDate, lang)}`,
        );
      } else {
        setPeriod(localeText(LANGUAGES.COMMON.UNLIMITED));
      }
    } else {
      openModal({
        text: result.message,
        onAgree: () => {
          moveBack();
        },
      });
    }
  };

  const handleDeleteBanner = async () => {
    const param = {
      bannerIds: [Number(bannerId)],
    };
    const result = await bannerApi.deleteBanner(param);
    setTimeout(() => {
      openModal({
        text: result.message,
        onAgree: () => {
          if (result?.errorCode === SUCCESS) {
            moveBack();
          }
        },
      });
    });
  };

  return isMobile(true) ? (
    <MainContainer
      isDetailHeader
      contentHeader={
        <Box>
          <HStack spacing={'0.44rem'}>
            <Center
              w={clampW(1.875, 2)}
              minW={clampW(1.875, 2)}
              h={clampW(1.875, 2)}
              onClick={() => {
                setSelectedBanner(bannerInfo);
                moveBannerModify();
              }}
            >
              <Img src={IconEdit.src} />
            </Center>
            <Center
              w={clampW(1.875, 2)}
              minW={clampW(1.875, 2)}
              h={clampW(1.875, 2)}
              onClick={() => {
                openModal({
                  type: 'confirm',
                  text: localeText(LANGUAGES.INFO_MSG.DELETE_BANNER_MSG),
                  onAgree: () => {
                    handleDeleteBanner();
                  },
                });
              }}
            >
              <Img src={IconDelete.src} />
            </Center>
          </HStack>
        </Box>
      }
    >
      <VStack spacing={0} px={clampW(1, 5)}>
        <Box w={'100%'}>
          <VStack spacing={'1rem'}>
            <Box w={'100%'}>
              <HStack
                justifyContent={'space-between'}
                alignItems={'flex-start'}
                spacing={'2rem'}
              >
                <Box w={'12.5rem'}>
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
                  <BannerPreview position={bannerInfo.type} />
                </Box>
              </HStack>
            </Box>
            <Box w={'100%'}>
              <VStack
                alignItems={'flex-start'}
                justifyContent={'flex-start'}
                spacing={'0.2rem'}
              >
                <Text
                  color={'#7895B2'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.BANNERS.AUTHORIZATION)}
                </Text>
                <Text
                  color={
                    bannerInfo.status === 1 || bannerInfo.status === 3
                      ? '#485766'
                      : '#B20000'
                  }
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {handleGetAuthStatus(bannerInfo.status)}
                </Text>
              </VStack>
            </Box>
            <Box w={'100%'}>
              <VStack
                alignItems={'flex-start'}
                justifyContent={'flex-start'}
                spacing={'0.2rem'}
              >
                <Text
                  color={'#7895B2'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.BANNERS.DATE_REQUEST)}
                </Text>
                <Text
                  color={'#485766'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {utils.parseDateByCountryCode(bannerInfo.createdAt, lang)}
                </Text>
              </VStack>
            </Box>
            <Box w={'100%'}>
              <VStack
                alignItems={'flex-start'}
                justifyContent={'flex-start'}
                spacing={'0.2rem'}
              >
                <Text
                  color={'#7895B2'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.BANNERS.NAME)}
                </Text>
                <Text
                  color={'#485766'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {bannerInfo.name}
                </Text>
              </VStack>
            </Box>
            <Box w={'100%'}>
              <VStack
                alignItems={'flex-start'}
                justifyContent={'flex-start'}
                spacing={'0.2rem'}
              >
                <Text
                  color={'#7895B2'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.BANNERS.PERIOD)}
                </Text>
                <Text
                  color={'#485766'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {period}
                </Text>
              </VStack>
            </Box>
            {bannerInfo?.link && (
              <Box w={'100%'}>
                <VStack
                  alignItems={'flex-start'}
                  justifyContent={'flex-start'}
                  spacing={'0.2rem'}
                >
                  <Text
                    color={'#7895B2'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {localeText(LANGUAGES.BANNERS.BANNER_LINK)}
                  </Text>
                  <Text
                    color={'#485766'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {bannerInfo.link}
                  </Text>
                </VStack>
              </Box>
            )}

            {bannerInfo?.linkType && (
              <Box w={'100%'}>
                <VStack
                  alignItems={'flex-start'}
                  justifyContent={'flex-start'}
                  spacing={'0.2rem'}
                >
                  <Text
                    color={'#7895B2'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {localeText(LANGUAGES.BANNERS.LINK_TARGET)}
                  </Text>
                  <Text
                    color={'#485766'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {handleGetBannerLinkTarget(bannerInfo.linkType)}
                  </Text>
                </VStack>
              </Box>
            )}
          </VStack>
        </Box>

        <ContentBR h={'1.25rem'} />

        <Divider borderTop={'1px solid #AEBDCA'} />

        <ContentBR h={'1.25rem'} />

        <Box w={'100%'}>
          <VStack spacing={'0.75rem'}>
            <Box w={'100%'}>
              <Text
                color={'#7895B2'}
                fontSize={'0.9375rem'}
                fontWeight={400}
                lineHeight={'1.5rem'}
              >
                {localeText(LANGUAGES.BANNERS.BANNER_IMAGE)}
              </Text>
            </Box>
            <Box w={'100%'} aspectRatio={19.1875 / 7.20356}>
              <ChakraImage
                fallback={<DefaultSkeleton />}
                w={'100%'}
                h={'100%'}
                objectFit={'cover'}
                src={bannerInfo?.imageS3Url}
              />
            </Box>
          </VStack>
        </Box>
      </VStack>

      <ContentBR h={'1.25rem'} />
    </MainContainer>
  ) : (
    <MainContainer
      isDetailHeader
      contentHeader={
        <Box>
          <HStack spacing={'0.75rem'}>
            <Box minW={'7rem'} h={'3rem'}>
              <Button
                onClick={() => {
                  setSelectedBanner(bannerInfo);
                  moveBannerModify();
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
                  {localeText(LANGUAGES.COMMON.MODIFY)}
                </Text>
              </Button>
            </Box>
            <Box minW={'7rem'} h={'3rem'}>
              <Button
                onClick={() => {
                  openModal({
                    type: 'confirm',
                    text: localeText(LANGUAGES.INFO_MSG.DELETE_BANNER_MSG),
                    onAgree: () => {
                      handleDeleteBanner();
                    },
                  });
                }}
                px={'1.25rem'}
                py={'0.63rem'}
                borderRadius={'0.25rem'}
                border={'1px solid #B20000'}
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
                  color={'#B20000'}
                  fontSize={'1rem'}
                  fontWeight={400}
                  lineHeight={'1.75rem'}
                >
                  {localeText(LANGUAGES.COMMON.DELETE)}
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
            <VStack spacing={'1rem'}>
              <Box w={'100%'}>
                <HStack
                  justifyContent={'flex-start'}
                  alignItems={'flex-start'}
                  spacing={'2rem'}
                >
                  <Box w={'12.5rem'}>
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
                    <BannerPreview position={bannerInfo.type} />
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
                      {localeText(LANGUAGES.BANNERS.AUTHORIZATION)}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      color={
                        bannerInfo.status === 1 || bannerInfo.status === 3
                          ? '#485766'
                          : '#B20000'
                      }
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {handleGetAuthStatus(bannerInfo.status)}
                    </Text>
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
                      {localeText(LANGUAGES.BANNERS.DATE_REQUEST)}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      color={'#485766'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {utils.parseDateByCountryCode(bannerInfo.createdAt, lang)}
                    </Text>
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
                      {localeText(LANGUAGES.BANNERS.NAME)}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      color={'#485766'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {bannerInfo.name}
                    </Text>
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
                      {localeText(LANGUAGES.BANNERS.PERIOD)}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      color={'#485766'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {period}
                    </Text>
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
                      {localeText(LANGUAGES.BANNERS.BANNER_LINK)}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      color={'#485766'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {bannerInfo.link}
                    </Text>
                  </Box>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <HStack
                  alignItems={'flex-start'}
                  justifyContent={'flex-start'}
                  spacing={'2rem'}
                >
                  <Box w={'12.5rem'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.BANNERS.LINK_TARGET)}
                    </Text>
                  </Box>
                  <Text
                    color={'#485766'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {handleGetBannerLinkTarget(bannerInfo.linkType)}
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </Box>

          <Divider borderTop={'1px solid #AEBDCA'} />

          <Box w={'100%'}>
            <VStack spacing={'0.75rem'}>
              <Box w={'100%'}>
                <Text
                  color={'#7895B2'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.BANNERS.BANNER_IMAGE)}
                </Text>
              </Box>
              <Box w={'100%'} h={'27.3125rem'} aspectRatio={19.1875 / 7.20356}>
                <ChakraImage
                  fallback={<DefaultSkeleton />}
                  w={'100%'}
                  h={'100%'}
                  objectFit={'cover'}
                  src={bannerInfo?.imageS3Url}
                />
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Box>

      <ContentBR h={'1.25rem'} />
    </MainContainer>
  );
};

export default BannersDetailPage;
