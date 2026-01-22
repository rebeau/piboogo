'use client';

import {
  Box,
  Center,
  HStack,
  SimpleGrid,
  Text,
  VStack,
  Image as ChakraImage,
} from '@chakra-ui/react';

import ContentBR from '@/components/custom/ContentBR';
import MainTopHeader from '@/components/custom/header/MainTopHeader';
import useLocale from '@/hooks/useLocale';
import MainBanner from '@/components/custom/banner/MainBanner';
import { LANGUAGES } from '@/constants/lang';
import Footer from '@/components/common/custom/Footer';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { DefaultPaginate } from '@/components';
import ProductItemCard from '@/components/custom/product/ProductItemCard';
import promotionApi from '@/services/promotionApi';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import utils from '@/utils';
import { SUCCESS } from '@/constants/errorCode';
import promotionProductApi from '@/services/promotionProductApi';
import { SERVICE } from '@/constants/pageURL';
import useModal from '@/hooks/useModal';
import MainContainer from '@/components/layout/MainContainer';
import useDevice from '@/hooks/useDevice';
import useMove from '@/hooks/useMove';

const PromotionDetailPage = () => {
  const { isMobile, clampW, clampH } = useDevice();
  const { openModal } = useModal();
  const isLogin = utils.getIsLogin();
  const { moveProductDetail } = useMove();
  const router = useRouter();
  const { promotionId } = useParams();
  const { lang, localeText } = useLocale();

  const [promotionInfo, setPromotionInfo] = useState({});
  const [listPromotionProduct, setListPromotionProduct] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [contentNum, setContentNum] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    handleGetPromotion();
  }, []);

  useEffect(() => {
    if (promotionInfo) {
      handleGetListPromotionProduct();
    }
  }, [promotionInfo]);

  const handleGetPromotion = async () => {
    const param = {
      promotionId: promotionId,
    };
    const result = await promotionApi.getPromotion(param);

    if (result?.errorCode === SUCCESS) {
      setPromotionInfo(result.data);
    } else {
      openModal({
        text: result.message,
        onAgree: () => {
          router.back();
        },
      });
    }
  };

  const handleGetListPromotionProduct = async () => {
    if (!promotionInfo?.promotionId) return;
    const param = {
      promotionId: promotionInfo.promotionId,
      pageNum: currentPage,
      contentNum: contentNum,
    };
    const result = await promotionProductApi.getListPromotionProduct(param);

    if (result?.errorCode === SUCCESS) {
      setListPromotionProduct(result.datas);
      setTotalCount(result.totalCount);
    } else {
      setListPromotionProduct([]);
      setTotalCount(0);
    }
  };

  const listItems = useCallback(() => {
    return (
      <SimpleGrid
        columns={{
          '3xl': 5,
          '2xl': 5,
          xl: 4,
          lg: 3,
          md: 2,
          sm: 2,
          xs: 2,
        }}
        spacingX={'1.25rem'}
        spacingY={'5rem'}
      >
        {listPromotionProduct.map((item, itemIndex) => (
          <ProductItemCard
            key={itemIndex}
            item={item}
            onClick={(item) => {
              moveProductDetail(item.productId);
            }}
          />
        ))}
      </SimpleGrid>
    );
  });

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

  return isMobile(true) ? (
    <MainContainer>
      <Center w={'100%'}>
        <VStack w={'100%'} spacing={0}>
          <MainTopHeader />

          <MainBanner
            left={
              <Center w={'100%'} h={'100%'}>
                <ChakraImage
                  fallback={<DefaultSkeleton />}
                  objectFit={'cover'}
                  w={'100%'}
                  h={'100%'}
                  src={promotionInfo?.imageS3Url || ''}
                />
              </Center>
            }
            right={
              <Center
                bg={'#D9E7EC'}
                p={'clamp(1rem, 5vw, 6.25rem)'}
                w={'100%'}
                h={'100%'}
              >
                <VStack spacing={'clamp(1rem, 5vw, 4.25rem)'} w={'100%'}>
                  <Box w={'100%'}>
                    <Text
                      fontSize={'clamp(1.25rem, 4vw, 2.5rem)'}
                      fontWeight={500}
                      color={'#576076'}
                      lineHeight={'clamp(2rem, 5vw, 3.5rem)'}
                    >
                      We make it simple.
                      <br />
                      You make it yours.
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <VStack spacing={'clamp(1rem, 2vh, 2.5rem)'}>
                      <Box w={'100%'}>
                        <Text
                          fontSize={'clamp(0.875rem, 3vw, 1.5rem)'}
                          fontWeight={400}
                          color={'#66809C'}
                          lineHeight={'clamp(1.4rem, 3vh, 2.1rem)'}
                        >
                          Faire is the one-stop-shop for everything you need to
                          stock your store.
                        </Text>
                      </Box>
                      <Box w={'100%'}>
                        <Text
                          fontSize={'clamp(0.875rem, 3vw, 1.5rem)'}
                          fontWeight={400}
                          color={'#66809C'}
                          lineHeight={'clamp(1.4rem, 3vh, 2.1rem)'}
                        >
                          Shop quality brands with low order minimums and free
                          shipping options.
                        </Text>
                      </Box>
                      <Box w={'100%'}>
                        <Text
                          // fontSize={'1.5rem'}
                          fontSize={'clamp(0.875rem, 3vw, 1.5rem)'}
                          fontWeight={400}
                          color={'#66809C'}
                          lineHeight={'clamp(1.4rem, 3vh, 2.1rem)'}
                        >
                          Buy new inventory for your shop now and pay invoices
                          60 days later, with zero fees
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                </VStack>
              </Center>
            }
          />

          <ContentBR h={'3.75rem'} />

          <Box w={'100%'} px={'clamp(1rem, 5vw, 10rem)'}>
            <Box w={'100%'}>
              <VStack spacing={'clamp(0.6rem, 2vh, 3.75rem)'}>
                <Box w={'100%'}>
                  <VStack
                    spacing={'clamp(0.6rem, 1vh, 1.25rem)'}
                    alignItems={'flex-start'}
                  >
                    {/*
                    <Box
                      px={'1rem'}
                      py={'0.5rem'}
                      borderRadius={'1.25rem'}
                      bg={'#D9E7EC'}
                    >
                      <Text
                        color={'#66809C'}
                        fontSize={'0.9375rem'}
                        fontWeight={500}
                        lineHeight={'1.5rem'}
                      >
                        Band Name
                      </Text>
                    </Box>
                    */}
                    <Box w={'100%'}>
                      <Text
                        color={'#485766'}
                        fontSize={'clamp(1.5rem, 3vw, 2.5rem)'}
                        fontWeight={500}
                        lineHeight={'clamp(2.475rem, 3vh, 4rem)'}
                      >
                        {promotionInfo.name}
                      </Text>
                    </Box>
                    <Box w={'100%'}>
                      <Text
                        color={'#485766'}
                        fontSize={'clamp(1.25rem, 2vw, 1.75rem)'}
                        fontWeight={400}
                        lineHeight={'2.7475rem'}
                      >
                        {`${parseDate(promotionInfo.startDate)} ~ ${parseDate(promotionInfo.endDate)}`}
                      </Text>
                    </Box>
                  </VStack>
                </Box>
                <Box w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'clamp(0.8125rem, 3vw, 1.125rem)'}
                    fontWeight={400}
                    lineHeight={'clamp(1.3rem, 3vh, 1.96875rem)'}
                    whiteSpace={'pre-wrap'}
                  >
                    {promotionInfo.content}
                  </Text>
                </Box>
              </VStack>
            </Box>

            <ContentBR h={'3.5rem'} />

            <Box w={'100%'}>
              <VStack spacing={'clamp(0.75rem, 1vh, 2.5rem)'}>
                <Box w={'100%'}>
                  <Text
                    color={'#66809C'}
                    fontSize={'1.25rem'}
                    fontWeight={600}
                    lineHeight={'2.25rem'}
                  >
                    {localeText(LANGUAGES.BRAND_PRODUCT)}
                  </Text>
                </Box>
                <Box w={'100%'}>
                  <Box py={'1rem'} w={'100%'}>
                    <HStack justifyContent={'space-between'}>
                      <Text
                        color={'#485766'}
                        fontSize={'1.125rem'}
                        fontWeight={400}
                        lineHeight={'1.96875rem'}
                      >
                        {`${utils.parseAmount(totalCount)} ${localeText(LANGUAGES.ITEMS)}`}
                      </Text>
                    </HStack>
                  </Box>
                  <Box w={'100%'}>
                    <VStack spacing={'5rem'} h={'100%'}>
                      <Box borderRadius={'0.06rem'} w={'100%'}>
                        {listPromotionProduct.length > 0 && listItems()}
                        {listPromotionProduct.length === 0 && (
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
                      <Center w={'100%'}>
                        <DefaultPaginate
                          currentPage={currentPage}
                          setCurrentPage={setCurrentPage}
                          totalCount={totalCount}
                          contentNum={contentNum}
                        />
                      </Center>
                    </VStack>
                  </Box>
                </Box>
              </VStack>
            </Box>
          </Box>

          <ContentBR h={'10rem'} />

          {/* footer */}
          <Footer />
        </VStack>
      </Center>
    </MainContainer>
  ) : (
    <MainContainer>
      <Center w={'100%'}>
        <VStack w={'100%'} spacing={0}>
          <MainTopHeader />

          <Box w="100%">
            <ChakraImage
              // aspectRatio={1440 / 540}
              aspectRatio={1920 / 720}
              fallback={<DefaultSkeleton />}
              objectFit={'cover'}
              w={'100%'}
              h={'100%'}
              src={promotionInfo?.imageS3Url || ''}
            />
          </Box>

          <ContentBR h={'3.75rem'} />

          <Box w={'100%'} px={'10rem'} maxW={1920}>
            <Box w={'100%'}>
              <VStack spacing={'3.75rem'}>
                <Box w={'100%'}>
                  <VStack spacing={'1.25rem'} alignItems={'flex-start'}>
                    {/*
                    <Box
                      px={'1rem'}
                      py={'0.5rem'}
                      borderRadius={'1.25rem'}
                      bg={'#D9E7EC'}
                    >
                      <Text
                        color={'#66809C'}
                        fontSize={'0.9375rem'}
                        fontWeight={500}
                        lineHeight={'1.5rem'}
                      >
                        Band Name
                      </Text>
                    </Box>
                    */}
                    <Box w={'100%'}>
                      <Text
                        color={'#485766'}
                        fontSize={'2.5rem'}
                        fontWeight={500}
                        lineHeight={'4rem'}
                      >
                        {promotionInfo.name}
                      </Text>
                    </Box>
                    <Box w={'100%'}>
                      <Text
                        color={'#485766'}
                        fontSize={'1.75rem'}
                        fontWeight={400}
                        lineHeight={'2.7475rem'}
                      >
                        {`${parseDate(promotionInfo.startDate)} ~ ${parseDate(promotionInfo.endDate)}`}
                      </Text>
                    </Box>
                  </VStack>
                </Box>
                <Box w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'1.125rem'}
                    fontWeight={400}
                    lineHeight={'1.96875rem'}
                    whiteSpace={'pre-wrap'}
                  >
                    {promotionInfo.content}
                  </Text>
                </Box>
              </VStack>
            </Box>

            <ContentBR h={'7.5rem'} />

            <Box w={'100%'}>
              <VStack spacing={'2.5rem'}>
                <Box w={'100%'}>
                  <Text
                    color={'#66809C'}
                    fontSize={'1.25rem'}
                    fontWeight={600}
                    lineHeight={'2.25rem'}
                  >
                    {localeText(LANGUAGES.BRAND_PRODUCT)}
                  </Text>
                </Box>
                <Box w={'100%'}>
                  <Box py={'1rem'} w={'100%'}>
                    <HStack justifyContent={'space-between'}>
                      <Text
                        color={'#485766'}
                        fontSize={'1.125rem'}
                        fontWeight={400}
                        lineHeight={'1.96875rem'}
                      >
                        {`${utils.parseAmount(totalCount)} ${localeText(LANGUAGES.ITEMS)}`}
                      </Text>
                    </HStack>
                  </Box>
                  <Box w={'100%'}>
                    <VStack spacing={'5rem'} h={'100%'}>
                      <Box borderRadius={'0.06rem'} w={'100%'}>
                        {listPromotionProduct.length > 0 && listItems()}
                        {listPromotionProduct.length === 0 && (
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
                      <Center w={'100%'}>
                        <DefaultPaginate
                          currentPage={currentPage}
                          setCurrentPage={setCurrentPage}
                          totalCount={totalCount}
                          contentNum={contentNum}
                        />
                      </Center>
                    </VStack>
                  </Box>
                </Box>
              </VStack>
            </Box>
          </Box>

          <ContentBR h={'10rem'} />

          {/* footer */}
          <Footer />
        </VStack>
      </Center>
    </MainContainer>
  );
};

export default PromotionDetailPage;
