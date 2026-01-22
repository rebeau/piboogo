'use client';

import Footer from '@/components/common/custom/Footer';
import ContentBR from '@/components/custom/ContentBR';
import MainTopHeader from '@/components/custom/header/MainTopHeader';
import LoginMain from '@public/svgs/login/login-main.svg';
import {
  Box,
  Center,
  Flex,
  Img,
  SimpleGrid,
  Text,
  VStack,
  Image as ChakraImage,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import { useRouter } from 'next/navigation';
import { ACCOUNT, SERVICE } from '@/constants/pageURL';
import { useCallback, useEffect, useState } from 'react';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import { NO_DATA_ERROR, SUCCESS } from '@/constants/errorCode';
import promotionApi from '@/services/promotionApi';
import utils from '@/utils';
import MainContainer from '@/components/layout/MainContainer';
import useDevice from '@/hooks/useDevice';

const PromotionPage = () => {
  const { isMobile, clampW, clampH } = useDevice();
  const router = useRouter();
  const { lang, localeText } = useLocale();
  const [currentPage, setCurrentPage] = useState(1);
  const [contentNum, setContentNum] = useState(5);
  const [totalCount, setTotalCount] = useState(1);

  const [listPromotion, setListPromotion] = useState([]);

  useEffect(() => {
    handleGetListPromotion();
  }, []);

  const handleGetListPromotion = async () => {
    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
    };
    const result = await promotionApi.getListPromotion(param);
    if (result?.errorCode === SUCCESS) {
      setListPromotion(result.datas);
      setTotalCount(result.totalCount);
    } else if (result?.errorCode === NO_DATA_ERROR) {
      setListPromotion([]);
      setTotalCount(0);
    }
  };

  const parseDate = (paramDate) => {
    if (!paramDate) return;
    const dateString = paramDate;

    // 날짜 문자열을 Date 객체로 변환 (년, 월, 일로 나누어 처리)
    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10) - 1; // 월은 0부터 시작
    const day = parseInt(dateString.substring(6, 8), 10);

    // Date 객체 생성 (그날의 마지막 시간으로 설정)
    const date = new Date(year, month, day, 23, 59, 59, 999);

    return utils.parseDateByCountryCode(date, lang);
  };

  return (
    <MainContainer>
      <Center w={'100%'}>
        <VStack w={'100%'} spacing={0}>
          <MainTopHeader />

          {/* content */}
          {isMobile(true) ? (
            <Box w={'100%'}>
              <VStack spacing={'1.25rem'} justifyContent={'flex-start'}>
                <Box py={0} px={'1rem'} w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'clamp(1.25rem, 3vw, 3rem)'}
                    fontWeight={400}
                    lineHeight={'clamp(2.25rem, 3vh, 4.5rem)'}
                  >
                    {localeText(LANGUAGES.PROMOTION.PROMOTION)}
                  </Text>
                </Box>

                <Box w={'100%'} px={'1rem'}>
                  {listPromotion.map((item, index) => {
                    const name = item?.name;
                    const startDate = item?.startDate;
                    const endDate = item?.endDate;

                    let period = null;
                    if (startDate && endDate) {
                      period = `${parseDate(startDate)} - ${parseDate(endDate)}`;
                    } else {
                      period = localeText(LANGUAGES.COMMON.UNLIMITED);
                    }

                    return (
                      <Box
                        key={index}
                        w={'100%'}
                        cursor={'pointer'}
                        onClick={() => {
                          router.push(
                            `${SERVICE.PROMOTION.ROOT}/${item.promotionId}`,
                          );
                        }}
                      >
                        <VStack spacing={'1.25rem'}>
                          <Box w={'100%'} aspectRatio={20.5 / 7.6875}>
                            <ChakraImage
                              fallback={<DefaultSkeleton />}
                              objectFit={'cover'}
                              w={'100%'}
                              h={'100%'}
                              src={item?.imageS3Url || ''}
                            />
                          </Box>
                          <Box w={'100%'}>
                            <VStack
                              spacing={'0.25rem'}
                              alignItems={'flex-start'}
                            >
                              <Text
                                color={'#485766'}
                                fontSize={'clamp(1rem, 3vw, 2.25rem)'}
                                fontWeight={500}
                                lineHeight={'clamp(1.75rem, 3vh, 3.2625rem)'}
                              >
                                {name}
                              </Text>
                              <Text
                                color={'#485766'}
                                fontSize={'clamp(0.875rem, 3vw, 1.5rem)'}
                                fontWeight={400}
                                lineHeight={'clamp(1,4rem, 3vh, 2.475rem)'}
                              >
                                {period}
                              </Text>
                            </VStack>
                          </Box>
                        </VStack>
                      </Box>
                    );
                  })}
                  {listPromotion.length === 0 && (
                    <Center w={'100%'} h={'10rem'}>
                      <Text
                        fontSize={'1.5rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.INFO_MSG.NO_PROMOTION)}
                      </Text>
                    </Center>
                  )}
                </Box>
              </VStack>
            </Box>
          ) : (
            <Box
              w={'100%'}
              maxW={1920}
              //
            >
              <VStack
                pt={'1.25rem'}
                spacing={'1.25rem'}
                justifyContent={'flex-start'}
              >
                <Box py={'2.5rem'} px={'10rem'} w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'3rem'}
                    fontWeight={400}
                    lineHeight={'4.5rem'}
                  >
                    {localeText(LANGUAGES.PROMOTION.PROMOTION)}
                  </Text>
                </Box>

                <Box w={'100%'} px={'10rem'}>
                  <SimpleGrid
                    columns={{
                      '3xl': 3,
                      '2xl': 3,
                      xl: 3,
                      lg: 2,
                      md: 2,
                      sm: 2,
                      xs: 2,
                    }}
                    spacingX={clampW(0.5, 2.25)}
                    spacingY={clampW(1.25, 5)}
                  >
                    {listPromotion.map((item, index) => {
                      const name = item?.name;
                      const startDate = item?.startDate;
                      const endDate = item?.endDate;

                      let period = null;
                      if (startDate && endDate) {
                        period = `${parseDate(startDate)} - ${parseDate(endDate)}`;
                      } else {
                        period = localeText(LANGUAGES.COMMON.UNLIMITED);
                      }

                      return (
                        <Box
                          key={index}
                          w={'100%'}
                          cursor={'pointer'}
                          onClick={() => {
                            router.push(
                              `${SERVICE.PROMOTION.ROOT}/${item.promotionId}`,
                            );
                          }}
                        >
                          <VStack spacing={'1.25rem'}>
                            {/*
                            1440 / 540 75%
                            1248 / 468 65%
                            960 / 360 50%
                            */}
                            <Box w="100%">
                              <ChakraImage
                                // aspectRatio={1440 / 540}
                                aspectRatio={1200 / 800}
                                fallback={<DefaultSkeleton />}
                                objectFit={'cover'}
                                w={'100%'}
                                h={'100%'}
                                src={item?.imageS3Url || ''}
                              />
                            </Box>
                            <Box w="100%">
                              <VStack
                                spacing={'0.25rem'}
                                alignItems={'flex-start'}
                              >
                                <Text
                                  color={'#485766'}
                                  fontSize={clampW(1.8, 2)}
                                  fontWeight={500}
                                  lineHeight={'3.2625rem'}
                                  textAlign={'left'}
                                >
                                  {name}
                                </Text>
                                <Text
                                  color={'#485766'}
                                  fontSize={clampW(1.2, 1.5)}
                                  fontWeight={400}
                                  lineHeight={'2.475rem'}
                                >
                                  {period}
                                </Text>
                              </VStack>
                            </Box>
                          </VStack>
                        </Box>
                      );
                    })}
                  </SimpleGrid>
                </Box>
              </VStack>
            </Box>
          )}

          <ContentBR h={'10rem'} />

          {!isMobile(true) && <Footer />}
        </VStack>
      </Center>
    </MainContainer>
  );
};

export default PromotionPage;
