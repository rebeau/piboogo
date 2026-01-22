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
  RadioGroup,
  Radio,
} from '@chakra-ui/react';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import BannerPreview from '@/components/custom/page/banner/BannerPreview';
import ContentBR from '@/components/common/ContentBR';
import MainContainer from '@/components/layout/MainContainer';
import bannerApi from '@/services/bannerApi';
import { SUCCESS } from '@/constants/errorCode';
import utils from '@/utils';
import useMove from '@/hooks/useMove';
import useModal from '@/hooks/useModal';

const BannersDetailPage = () => {
  const { bannerId } = useParams();
  const { moveBack } = useMove();
  const { openModal } = useModal();
  const { lang, localeText } = useLocale();
  const [bannerInfo, setBannerInfo] = useState({});
  const [period, setPeriod] = useState('');
  const [status, setStatus] = useState(0);

  useEffect(() => {
    if (bannerId) {
      handleGetBanner();
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
      setStatus(bannerInfo.status);
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

  const handlePatchBannerApproval = async (bannerIds, status) => {
    const param = bannerIds.map((id) => {
      return {
        bannerId: id,
        status: status,
      };
    });
    const result = await bannerApi.patchBannerApproval(param);
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

  const handleTargetLink = useCallback((targetLink) => {
    if (targetLink === 1) return localeText(LANGUAGES.BANNER.NAVIGATE_TO_PAGE);
  });

  const handleDeleteBanner = async () => {
    const param = {
      bannerIds: [Number(bannerInfo.bannerId)],
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

  return (
    <MainContainer
      isDetailHeader
      contentHeader={
        <Box>
          <HStack spacing={'2.5rem'} alignItems={'center'}>
            <Box>
              <HStack justifyContent={'flex-end'} spacing={'1.5rem'}>
                <Text
                  w={'8.8125rem'}
                  minW={'8.8125rem'}
                  color={'#7895B2'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.BANNER.BANNER_PERMISSION)}
                </Text>
                <RadioGroup
                  w={'100%'}
                  value={Number(status)}
                  onChange={(value) => {
                    setStatus(Number(value));
                  }}
                >
                  <HStack spacing={'1.5rem'} alignItems={'center'}>
                    <Box>
                      <HStack alignItems={'center'} spacing={'0.5rem'}>
                        <Radio value={3} />
                        <Box w={'5.375rem'}>
                          <Text
                            textAlign={'left'}
                            color={'#485766'}
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.STATUS.AUTHORIZED)}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                    <Box>
                      <HStack alignItems={'center'} spacing={'0.5rem'}>
                        <Radio value={2} />
                        <Box w={'6.6875rem'}>
                          <Text
                            textAlign={'left'}
                            color={'#485766'}
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.STATUS.UNAUTHORIZED)}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  </HStack>
                </RadioGroup>
              </HStack>
            </Box>

            <Box>
              <HStack spacing={'0.75rem'}>
                <Box minW={'7rem'} h={'3rem'}>
                  <Button
                    onClick={() => {
                      if (status !== bannerInfo.status) {
                        handlePatchBannerApproval(
                          [bannerInfo.bannerId],
                          status,
                        );
                      } else {
                        openModal({
                          text: localeText(LANGUAGES.INFO_MSG.NO_CHANGE),
                        });
                      }
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
          </HStack>
        </Box>
      }
    >
      <ContentBR h={'1.25rem'} />

      <Box w={'100%'}>
        <VStack spacing={'1.25rem'}>
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
                  {localeText(LANGUAGES.BANNER.POSITION)}
                </Text>
              </Box>
              <Box>
                <BannerPreview posotion={Number(bannerInfo.type)} />
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
                  {localeText(LANGUAGES.BANNER.SELLER_NAME)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#485766'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                  textDecoration={'underline'}
                >
                  {bannerInfo.brandName}
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
                  {localeText(LANGUAGES.BANNER.DATE_OF_REQUEST)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#485766'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {utils.parseDateByCountryCode(
                    bannerInfo.createdAt,
                    lang,
                    true,
                  )}
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
                  {localeText(LANGUAGES.BANNER.BANNER_NAME)}
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
                  {localeText(LANGUAGES.BANNER.PERIOD)}
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
                  {localeText(LANGUAGES.BANNER.BANNER_LINK)}
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
                {handleTargetLink(bannerInfo.linkType)}
              </Text>
            </HStack>
          </Box>
        </VStack>
      </Box>

      <ContentBR h={'2.5rem'} />

      <Divider borderTop={'1px solid #AEBDCA'} />

      <ContentBR h={'2.5rem'} />

      <Box w={'100%'}>
        <VStack spacing={'2.5rem'}>
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
              <Box w={'100%'} aspectRatio={72.75 / 27.3125}>
                <ChakraImage
                  fallback={<DefaultSkeleton />}
                  w={'100%'}
                  h={'100%'}
                  objectFit={'cover'}
                  src={bannerInfo.imageS3Url}
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
