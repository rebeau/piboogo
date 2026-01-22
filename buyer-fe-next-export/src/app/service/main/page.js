'use client';

import {
  Box,
  Center,
  HStack,
  Text,
  VStack,
  Image as ChakraImage,
  SimpleGrid,
  Grid,
} from '@chakra-ui/react';

import ContentBR from '@/components/custom/ContentBR';
import MainTopHeader from '@/components/custom/header/MainTopHeader';
import BrandHeader from '@/components/custom/header/BrandHeader';
import useLocale from '@/hooks/useLocale';

import MainBanner from '@/components/custom/banner/MainBanner';
import BrandBanner from '@/components/custom/banner/BrandBanner';

import { LANGUAGES } from '@/constants/lang';
import useMenu from '@/hooks/useMenu';
import RightIconButton from '@/components/button/custom/RightIconButton';
import Footer from '@/components/common/custom/Footer';

import { useCallback, useEffect, useState } from 'react';
import bannerApi from '@/services/bannerApi';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import { SUCCESS } from '@/constants/errorCode';
import BrandBannerSwiperForm from '@/components/custom/banner/BrandBannerSwiperForm';
import partnerSellerApi from '@/services/partnerSellerApi';
import sellerApi from '@/services/sellerUserApi';
import bestSellerApi from '@/services/bestSellerApi';
import MainContainer from '@/components/layout/MainContainer';
import useDevice from '@/hooks/useDevice';
import useMove from '@/hooks/useMove';
import MainInfoForm from '@/components/custom/banner/MainInfoForm';

import MiddleBanner from '@public/svgs/banner/middle.svg';
import CustomBanner11 from '@public/svgs/banner/11.svg';
import CustomBanner12 from '@public/svgs/banner/12.svg';
import CustomBanner21 from '@public/svgs/banner/21.svg';
import CustomBanner22 from '@public/svgs/banner/22.svg';

const MainPage = () => {
  const { isMobile, clampW, clampH } = useDevice();
  const { moveBrand } = useMove();
  const { listFirstCategory } = useMenu();
  const { localeText } = useLocale();

  const [listTopBanner, setListTopBanner] = useState([]);
  const [listBottomBanner, setListBottomBanner] = useState([]);
  const [listBestSeller, setListBestSeller] = useState([]);
  const [listNewSeller, setListNewSeller] = useState([]);
  const [listPartnerSeller, setListPartnerSeller] = useState([]);

  useEffect(() => {
    getListBanner();
    handleGetListBestSeller();
    handleGetListSellerRecent();
    handleGetListPartnerSeller();
  }, []);

  const [selectBestSeller, setSelectBestSeller] = useState(0);
  const [selectNewSeller, setSelectNewSeller] = useState(0);

  useEffect(() => {
    if (listFirstCategory.length > 0) {
      setSelectBestSeller(listFirstCategory[0]);
      setSelectNewSeller(listFirstCategory[0]);
    }
  }, [listFirstCategory]);

  const getListBanner = useCallback(async () => {
    const result = await bannerApi.getListBanner();
    if (result?.errorCode === SUCCESS) {
      const datas = result.datas;
      const topBanner = datas
        .filter((data) => data.type === 1)
        .sort((a, b) => a.idx - b.idx);
      const bottomBanner = datas
        .filter((data) => data.type === 2)
        .sort((a, b) => a.idx - b.idx);

      setListTopBanner(topBanner);
      setListBottomBanner(bottomBanner);
    } else {
      setListTopBanner([]);
      setListBottomBanner([]);
    }
  });

  useEffect(() => {
    if (selectBestSeller) {
      handleGetListBestSeller(selectBestSeller.firstCategoryId);
    }
  }, [selectBestSeller]);

  const handleGetListBestSeller = async (firstCategoryId) => {
    if (!firstCategoryId) return;
    const param = {
      firstCategoryId: firstCategoryId,
    };
    const result = await bestSellerApi.getListBestSeller(param);

    if (result?.errorCode === SUCCESS) {
      setListBestSeller(result.datas);
    } else {
      setListBestSeller([]);
    }
  };

  const handleGetListSellerRecent = async () => {
    const result = await sellerApi.getListSellerRecent();

    if (result?.errorCode === SUCCESS) {
      setListNewSeller(result.datas);
    } else {
      setListNewSeller([]);
    }
  };

  const handleGetListPartnerSeller = async () => {
    const result = await partnerSellerApi.getListPartnerSeller();

    if (result?.errorCode === SUCCESS) {
      setListPartnerSeller(result.datas);
    } else {
      setListPartnerSeller([]);
    }
  };

  const handlePiboogoBanner = () => {
    return isMobile(true) ? (
      <Box
        w={'100%'}
        h={'100%'}
        bg={'#7895B2'}
        py={'clamp(1.5rem, 2vw, 3.25rem)'}
        px={'clamp(1.5rem, 2vw, 3.25rem)'}
      >
        <SimpleGrid
          h={'100%'}
          columns={{
            '3xl': 2,
            '2xl': 2,
            xl: 2,
            lg: 2,
            md: 2,
            sm: 2,
            xs: 2,
          }}
          spacingX={'clamp(0.44rem, 1vw, 1.5rem)'}
          spacingY={'clamp(0.44rem, 1vw, 1.5rem)'}
        >
          <Grid minW={'9.5rem'} minH={'8rem'} aspectRatio={9.5 / 8}>
            <ChakraImage
              fallback={<DefaultSkeleton />}
              objectFit={'cover'}
              w={'100%'}
              h={'100%'}
              src={CustomBanner11.src}
            />
          </Grid>
          <Grid minW={'9.5rem'} minH={'8rem'} aspectRatio={9.5 / 8}>
            <ChakraImage
              fallback={<DefaultSkeleton />}
              objectFit={'cover'}
              w={'100%'}
              h={'100%'}
              src={CustomBanner12.src}
            />
          </Grid>
          <Grid minW={'9.5rem'} minH={'8rem'} aspectRatio={9.5 / 8}>
            <ChakraImage
              fallback={<DefaultSkeleton />}
              objectFit={'cover'}
              w={'100%'}
              h={'100%'}
              src={CustomBanner21.src}
            />
          </Grid>
          <Grid minW={'9.5rem'} minH={'8rem'} aspectRatio={9.5 / 8}>
            <ChakraImage
              fallback={<DefaultSkeleton />}
              objectFit={'cover'}
              w={'100%'}
              h={'100%'}
              src={CustomBanner22.src}
            />
          </Grid>
        </SimpleGrid>
      </Box>
    ) : (
      <Box
        w={'100%'}
        h={'100%'}
        bg={'#7895B2'}
        py={{
          xl: '3.25rem',
          lg: '2.75rem',
          md: '2.25rem',
          sm: '1.75rem',
        }}
        pl={{
          xl: '3.25rem',
          lg: '2.75rem',
          md: '2.25rem',
          sm: '1.75rem',
        }}
        pr={'0rem'}
      >
        <SimpleGrid
          h={'100%'}
          columns={{
            '3xl': 2,
            '2xl': 2,
            xl: 2,
            lg: 2,
            md: 2,
            sm: 2,
            xs: 2,
          }}
          spacingX={'1.5rem'}
          spacingY={'1.5rem'}
        >
          <Grid minW={'9.5rem'} minH={'8rem'}>
            <ChakraImage
              fallback={<DefaultSkeleton />}
              objectFit={'cover'}
              w={'100%'}
              h={'100%'}
              src={CustomBanner11.src}
            />
          </Grid>
          <Grid minW={'9.5rem'} minH={'8rem'}>
            <ChakraImage
              fallback={<DefaultSkeleton />}
              objectFit={'cover'}
              w={'100%'}
              h={'100%'}
              src={CustomBanner12.src}
            />
          </Grid>
          <Grid minW={'9.5rem'} minH={'8rem'}>
            <ChakraImage
              fallback={<DefaultSkeleton />}
              objectFit={'cover'}
              w={'100%'}
              h={'100%'}
              src={CustomBanner21.src}
            />
          </Grid>
          <Grid>
            <ChakraImage
              fallback={<DefaultSkeleton />}
              objectFit={'cover'}
              w={'100%'}
              h={'100%'}
              src={CustomBanner22.src}
            />
          </Grid>
        </SimpleGrid>
      </Box>
    );
  };

  const partnerCard = (partner) => {
    return (
      <Center
        w={isMobile(true) ? '100%' : '25.3125rem'}
        aspectRatio={25.3125 / 8.75}
        // h={'8.75rem'}
        bg={'#D9E7EC'}
        borderRadius={isMobile(true) ? '0.19rem' : '0.5rem'}
      >
        <ChakraImage
          borderRadius={isMobile(true) ? '0.19rem' : '0.5rem'}
          fallback={
            <DefaultSkeleton
              borderRadius={isMobile(true) ? '0.19rem' : '0.5rem'}
            />
          }
          objectFit={'cover'}
          w={'100%'}
          h={'100%'}
          src={partner?.brandLogoS3Url}
        />
      </Center>
    );
  };

  return (
    <MainContainer>
      <Center w={'100%'}>
        <VStack w={'100%'} spacing={0}>
          <MainTopHeader />

          <MainBanner listBanner={listTopBanner} />

          {/* Best Seller */}
          <BrandHeader
            headerTitle={localeText(LANGUAGES.BEST_BRAND)}
            targetId={selectBestSeller?.firstCategoryId || 0}
            listMenu={listFirstCategory}
            onClick={(categoryItem) => {
              setSelectBestSeller(categoryItem);
            }}
          />

          <ContentBR h={isMobile(true) ? '0.5rem' : '2.5rem'} />

          {listBestSeller.length > 0 && (
            <BrandBannerSwiperForm
              onClickAllView={() => {
                console.log('listBestSeller click');
              }}
              listData={listBestSeller}
            />
          )}
          {listBestSeller.length === 0 && (
            <Center w={'100%'} h={'10rem'}>
              <Text
                fontSize={clampW(1.5, 2.5)}
                fontWeight={500}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.INFO_MSG.NO_BEST_BRAND)}
              </Text>
            </Center>
          )}

          <ContentBR />

          <Box
            w={'100%'}
            maxW={isMobile(true) ? '100%' : '1920px'}
            aspectRatio={2.66}
          >
            <HStack spacing={0} h="100%">
              <Center w={'100%'} h={'100%'}>
                <ChakraImage
                  fallback={<DefaultSkeleton />}
                  objectFit={'cover'}
                  w={'100%'}
                  h={'100%'}
                  src={MiddleBanner.src || ''}
                />
              </Center>
              <Center
                bg={'#D9E7EC'}
                p={'clamp(1rem, 5vw, 6.25rem)'}
                w={'100%'}
                h={'100%'}
              >
                <VStack
                  spacing={
                    isMobile(true)
                      ? 'clamp(1rem, 3vw, 3.5rem)'
                      : 'clamp(1rem, 5vw, 4.25rem)'
                  }
                  w={'100%'}
                >
                  <Box w={'100%'}>
                    <Text
                      fontSize={
                        isMobile(true)
                          ? 'clamp(0.7rem, 3vw, 1.8rem)'
                          : 'clamp(1.25rem, 4vw, 2.5rem)'
                      }
                      fontWeight={500}
                      color={'#576076'}
                      lineHeight={
                        isMobile(true)
                          ? 'clamp(1rem, 5vw, 2rem)'
                          : 'clamp(2rem, 5vw, 3.5rem)'
                      }
                    >
                      Shop Pro Beauty Products
                      <br />
                      with Ease — All in One Platform
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <VStack spacing={'clamp(1rem, 2vh, 2.5rem)'}>
                      <Box w={'100%'}>
                        <Text
                          fontSize={
                            isMobile(true)
                              ? 'clamp(0.5rem, 2vw, 1rem)'
                              : 'clamp(0.875rem, 3vw, 1.5rem)'
                          }
                          fontWeight={400}
                          color={'#66809C'}
                          lineHeight={
                            isMobile(true)
                              ? 'clamp(0.7rem, 3vw, 1.5rem)'
                              : 'clamp(1.4rem, 3vh, 2.1rem)'
                          }
                        >
                          Discover and purchase curated pro
                          <br />
                          beauty products — with easy ordering
                          <br />
                          and delivery for clinics, spas, and
                          <br />
                          aesthetic professionals.
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                </VStack>
              </Center>
            </HStack>
          </Box>

          <ContentBR />

          {/* New Brand */}
          <BrandHeader
            headerTitle={localeText(LANGUAGES.NEW_BRAND)}
            targetId={selectNewSeller?.firstCategoryId || 0}
            // listMenu={listFirstCategory}
            onClick={(categoryItem) => {
              setSelectNewSeller(categoryItem);
            }}
          />
          <ContentBR h={'2.5rem'} />
          <BrandBannerSwiperForm listData={listNewSeller} />

          <ContentBR />

          <MainBanner listBanner={listBottomBanner} />

          <ContentBR />

          <MainInfoForm
            left={handlePiboogoBanner()}
            right={
              <Center
                bg={'#7895B2'}
                px={'clamp(2rem, 5vw, 6.25rem)'}
                py={isMobile(true) && '2.5rem'}
                w={'100%'}
                h={'100%'}
              >
                <VStack spacing={'5rem'} w={'100%'}>
                  <Box w={'100%'}>
                    <VStack spacing={'2.5rem'}>
                      <Box w={'100%'}>
                        <Text
                          fontSize={clampW(1, 2.5)}
                          fontWeight={500}
                          color={'#FFF'}
                          lineHeight={'160%'}
                        >
                          Discover your next
                          <br />
                          bestseller
                        </Text>
                      </Box>
                      <Box w={'100%'}>
                        <Text
                          fontSize={clampW(1, 1.5)}
                          fontWeight={400}
                          color={'#F2EEE2'}
                          lineHeight={'160%'}
                        >
                          See what retailers from across
                          <br />
                          the globe are loving on Faire
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                  <Box w={'100%'}>
                    <RightIconButton
                      bg={'#FFF'}
                      color={'#485766'}
                      iconName={'arrowRight'}
                      // onClick
                      textTarget={LANGUAGES.VIEW_ALL}
                    />
                  </Box>
                </VStack>
              </Center>
            }
          />

          <ContentBR />

          <MainInfoForm
            spacingH={isMobile(true) && '4.25rem'}
            left={
              <Box
                pl={clampW(1.5, 7.5)}
                w={'100%'}
                h={'100%'}
                alignContent={'center'}
              >
                <VStack spacing={'clamp(1rem, 3vh, 4.25rem)'}>
                  <Box w={'100%'}>
                    <Text
                      fontSize={clampW(1.75, 2.5)}
                      fontWeight={500}
                      color={'#485766'}
                      lineHeight={'160%'}
                    >
                      Our high-level
                      <br />
                      partners
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <Text
                      fontSize={clampW(1, 1.5)}
                      fontWeight={400}
                      color={'#66809C'}
                      lineHeight={'160%'}
                    >
                      Faire is the one-stop-shop for
                      <br />
                      everything you need to stock your store.
                    </Text>
                  </Box>
                </VStack>
              </Box>
            }
            right={
              <Box h={'100%'} maxW={'100%'} px={clampW(1, 3.25)}>
                {listPartnerSeller.length > 0 && (
                  <Center w={'100%'} h={'100%'}>
                    <VStack w={'100%'} spacing={'3rem'}>
                      <HStack spacing={'1.75rem'}>
                        {listPartnerSeller[0] &&
                          partnerCard(listPartnerSeller[0])}
                        {listPartnerSeller[1] &&
                          partnerCard(listPartnerSeller[1])}
                      </HStack>
                      <HStack spacing={'1.75rem'}>
                        {listPartnerSeller[2] &&
                          partnerCard(listPartnerSeller[2])}
                        {listPartnerSeller[3] &&
                          partnerCard(listPartnerSeller[3])}
                      </HStack>
                      <HStack spacing={'1.75rem'}>
                        {listPartnerSeller[4] &&
                          partnerCard(listPartnerSeller[4])}
                        {listPartnerSeller[5] &&
                          partnerCard(listPartnerSeller[5])}
                      </HStack>
                    </VStack>
                  </Center>
                )}
                {listPartnerSeller.length === 0 && (
                  <Center w={'100%'} h={'100%'}>
                    <Center
                      w={'100%'}
                      // aspectRatio={25.3125 / 8.75}
                      bg={'#D9E7EC'}
                      borderRadius={'2rem'}
                    >
                      <Text
                        fontSize={clampW(1.5, 2)}
                        fontWeight={500}
                        lineHeight={'300%'}
                      >
                        {localeText(LANGUAGES.INFO_MSG.PREMIUM_SELLER)}
                      </Text>
                    </Center>
                  </Center>
                )}
              </Box>
            }
          />

          <ContentBR />

          <Footer />
        </VStack>
      </Center>
    </MainContainer>
  );
};

export default MainPage;
