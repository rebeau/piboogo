'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Center,
  HStack,
  SimpleGrid,
  TabPanel,
  Text,
  VStack,
  Image as ChakraImage,
  Tabs,
  TabList,
  Tab,
  TabPanels,
} from '@chakra-ui/react';

import ProductItemCard from '@/components/custom/product/ProductItemCard';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import sellerApi from '@/services/sellerUserApi';
import { NO_DATA_ERROR, SUCCESS } from '@/constants/errorCode';
import utils from '@/utils';
import productApi from '@/services/productApi';
import useDevice from '@/hooks/useDevice';
import useMove from '@/hooks/useMove';
import { SERVICE } from '@/constants/pageURL';
import throttle from 'lodash/throttle';
import ContentBR from '@/components/custom/ContentBR';
import Footer from '@/components/common/custom/Footer';
import { DefaultPaginate } from '@/components';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import MainContainer from '@/components/layout/MainContainer';
import MainTopHeader from '@/components/custom/header/MainTopHeader';
import QuillViewer from '@/components/input/Quillviewer';

const BrandPage = () => {
  const isLogin = utils.getIsLogin();
  const { isMobile, clampW, clampHAvg } = useDevice();
  const { moveBack, moveProductDetail } = useMove();
  const { localeText } = useLocale();
  const { brand } = useParams();

  const [tabIndex, setTabIndex] = useState(0);
  const [initPage, setInitPage] = useState(true);

  const [sellerInfo, setSellerInfo] = useState({});
  const [selectedSort, setSelectedSort] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [contentNum, setContentNum] = useState(10);
  const [listProduct, setListProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const isLastPage = useRef(false);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    if (brand) {
      handleGetBrand();
      handleGetListSellerProduct(1, true);
    } else {
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_BRAND),
        onClick: () => moveBack(SERVICE.BRAND.ROOT),
      });
    }
  }, [brand]);

  useEffect(() => {
    if (isMobile(true)) {
      if (tabIndex === 1) window.addEventListener('scroll', throttledScroll);
      return () => window.removeEventListener('scroll', throttledScroll);
    }
  }, [tabIndex]);

  useEffect(() => {
    if (!initPage) {
      handleGetListSellerProduct(currentPage);
    }
  }, [currentPage]);

  const throttledScroll = useCallback(
    throttle(() => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollY > lastScrollTop.current) {
        if (scrollY + windowHeight >= documentHeight - 200) {
          if (!loading && !isLastPage.current) {
            setCurrentPage((prevPage) => {
              const nextPage = prevPage + 1;
              handleGetListSellerProduct(nextPage);
              return nextPage;
            });
          }
        }
      }
      lastScrollTop.current = scrollY;
    }, 300),
    [loading],
  );

  const handleGetBrand = useCallback(async () => {
    const param = { sellerUserId: Number(brand) };
    const result = await sellerApi.getSeller(param);

    if (result?.errorCode === SUCCESS) {
      setSellerInfo(result.data);
    } else if (result?.errorCode === NO_DATA_ERROR) {
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_SELLER),
        onClick: () => moveBack(SERVICE.BRAND.ROOT),
      });
    }
  });

  const handleGetListSellerProduct = async (pageNum = 1, isInit = false) => {
    if (loading) return;
    setLoading(true);

    const param = {
      pageNum,
      contentNum,
      sellerUserId: Number(brand),
      sortType: selectedSort,
      type: 1,
    };

    try {
      const result = await productApi.getListSellerProduct(param);
      if (result?.errorCode === SUCCESS) {
        const newData = result.datas;
        if (isInit || pageNum === 1 || !isMobile(true)) {
          setListProduct(newData);
        } else {
          // isMobile(true)
          setListProduct((prev) => [...prev, ...newData]);
        }
        setTotalCount(result.totalCount);
        if (newData.length < contentNum) {
          isLastPage.current = true;
        }
      } else {
        if (isInit || pageNum === 1 || !isMobile(true)) {
          setListProduct([]);
        }
        setTotalCount(0);
        isLastPage.current = true;
      }
    } finally {
      setInitPage(false);
      setLoading(false);
    }
  };

  const TextChecker = (text, targetIndex) => {
    const isCheck = selectedSort === targetIndex;

    const w = () => {
      if (targetIndex === 1) {
        return '7.5rem';
      } else if (targetIndex === 2) {
        return '3.5rem';
      } else {
        return '4rem';
      }
    };

    return (
      <Box
        minW={w()}
        _hover={{ cursor: 'pointer' }}
        onClick={() => {
          setSelectedSort(targetIndex);
        }}
      >
        <HStack justifyContent={'flex-end'}>
          <Box w={'0.7rem'}>
            <Text
              color={'#485766'}
              fontSize={'1rem'}
              fontWeight={500}
              lineHeight={'1.75rem'}
            >
              {isCheck && '✓'}
            </Text>
          </Box>
          <Text
            color={isCheck ? '#485766' : '#A7C3D2'}
            fontSize={'1rem'}
            fontWeight={500}
            lineHeight={'1.75rem'}
          >
            {text}
          </Text>
        </HStack>
      </Box>
    );
  };

  const listItems = useCallback(() => {
    return (
      <SimpleGrid
        columns={{
          '3xl': 5,
          '2xl': 4,
          xl: 3,
          lg: 2,
          md: 2,
          sm: 2,
          xs: 2,
        }}
        // spacingX={clampW(0.5, 1.25)}
        spacingX={clampW(0.5, 2.2)}
        spacingY={clampHAvg(1.25, 5)}
      >
        {listProduct.map((item, index) => (
          <ProductItemCard
            // isAbleFavorite={false}
            key={index}
            item={item}
            onClick={(item) => {
              moveProductDetail(item.productId);
            }}
            onChange={(returnItem) => {
              const tempListProduct = [...listProduct];
              tempListProduct[index] = returnItem;
              setListProduct(tempListProduct);
            }}
          />
        ))}
      </SimpleGrid>
    );
  });

  return isMobile(true) ? (
    <MainContainer>
      <Center w={'100%'}>
        <VStack w={'100%'} spacing={0}>
          <MainTopHeader />

          {/* content */}
          <Box w={'100%'}>
            <Box w={'100%'} mb={'1.5rem'}>
              <Center w={'100%'} aspectRatio={3.43} position={'relative'}>
                <ChakraImage
                  fallback={<DefaultSkeleton />}
                  w={'100%'}
                  h={'100%'}
                  objectFit={'cover'}
                  src={sellerInfo.brandBannerS3Url}
                />
                <Center
                  position={'absolute'}
                  w={clampW(6.25, 15)}
                  // h={'14.375rem'}
                  aspectRatio={15 / 14.375}
                  right={clampW(3, 9.44)}
                  bottom={0}
                  bg={'#F9F7F1'}
                >
                  <ChakraImage
                    fallback={<DefaultSkeleton />}
                    w={'100%'}
                    h={'100%'}
                    objectFit={'fill'}
                    src={sellerInfo.brandLogoS3Url}
                  />
                </Center>
              </Center>
            </Box>
            <Box px={clampW(1, 10)}>
              <VStack spacing={'0.62rem'} justifyContent={'flex-start'}>
                <Box w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={clampW(1.5, 3)}
                    fontWeight={400}
                    lineHeight={'170%'}
                  >
                    {sellerInfo.brandName}
                  </Text>
                </Box>
                <Box w={'100%'}>
                  <Tabs
                    p={0}
                    defaultIndex={tabIndex}
                    onChange={(index) => {
                      setTabIndex(index);
                    }}
                  >
                    <TabList px={0} py={'0.5rem'}>
                      <HStack spacing={'1.3rem'}>
                        <Tab
                          p={0}
                          w={'max-content'}
                          _selected={{ color: '#66809C', fontWeight: 600 }}
                          color={'#A7C3D2'}
                          fontSize={'1.25rem'}
                          fontWeight={400}
                          lineHeight={'2.25rem'}
                        >
                          {localeText(LANGUAGES.BRAND_INFO)}
                        </Tab>
                        <Tab
                          p={0}
                          w={'max-content'}
                          _selected={{ color: '#66809C', fontWeight: 600 }}
                          color={'#A7C3D2'}
                          fontSize={'1.25rem'}
                          fontWeight={400}
                          lineHeight={'2.25rem'}
                        >
                          {localeText(LANGUAGES.BRAND_PRODUCT)}
                        </Tab>
                      </HStack>
                    </TabList>

                    <ContentBR h={'0.62rem'} />

                    <Box w={'100%'}>
                      <TabPanels p={0}>
                        <TabPanel p={0}>
                          <Box w={'100%'}>
                            <QuillViewer html={sellerInfo.info} />
                          </Box>

                          <ContentBR h={'2.5rem'} />

                          <Box>
                            <ChakraImage
                              fallback={<DefaultSkeleton />}
                              w={'100%'}
                              h={'100%'}
                              objectFit={'cover'}
                              src={sellerInfo.brandBannerS3Url}
                            />
                          </Box>
                        </TabPanel>

                        <TabPanel p={0}>
                          <Box py={'0.2rem'} w={'100%'}>
                            <HStack justifyContent={'space-between'}>
                              <Text
                                color={'#485766'}
                                fontSize={clampW(1, 1.125)}
                                fontWeight={400}
                                lineHeight={'1.96875rem'}
                              >
                                {`${utils.parseAmount(totalCount)} ${localeText(LANGUAGES.ITEMS)}`}
                              </Text>
                              <Box>
                                <HStack spacing={clampW(0.7, 1.3)}>
                                  {TextChecker(
                                    localeText(LANGUAGES.COMMON.MOST_POPULAR),
                                    1,
                                  )}
                                  {TextChecker(
                                    localeText(LANGUAGES.COMMON.NEW),
                                    2,
                                  )}
                                  {TextChecker(
                                    localeText(LANGUAGES.COMMON.PRICE),
                                    3,
                                  )}
                                </HStack>
                              </Box>
                            </HStack>
                          </Box>

                          <ContentBR h={'0.62rem'} />

                          <Box w={'100%'}>
                            {listProduct.length > 0 && listItems()}
                            {listProduct.length === 0 && (
                              <Center w={'100%'} h={'5rem'}>
                                <Text
                                  fontSize={'1.5rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {localeText(
                                    LANGUAGES.INFO_MSG.NO_ITEM_SEARCHED,
                                  )}
                                </Text>
                              </Center>
                            )}
                          </Box>
                        </TabPanel>
                      </TabPanels>
                    </Box>
                  </Tabs>
                </Box>
              </VStack>
            </Box>
          </Box>

          <ContentBR h={'5rem'} />

          {/* footer */}
          {tabIndex === 0 && <Footer />}
        </VStack>
      </Center>
    </MainContainer>
  ) : (
    <MainContainer>
      <Center w={'100%'}>
        <VStack w={'100%'} spacing={0}>
          <MainTopHeader />

          {/* content */}
          <Box w={'100%'} maxW={1920}>
            <Box w={'100%'} h="100%" mb={'3.75rem'} bg="red">
              <Center
                w={'100%'}
                h={'100%'}
                position={'relative'}
                overflow={'hidden'}
              >
                <ChakraImage
                  fallback={<DefaultSkeleton />}
                  w={'100%'}
                  h={'100%'}
                  maxH={'560px'}
                  objectFit={'cover'}
                  src={sellerInfo.brandBannerS3Url}
                />

                <Center
                  position={'absolute'}
                  w={'15rem'}
                  h={'14.375rem'}
                  right={'9.44rem'}
                  bottom={0}
                  bg={'#F9F7F1'}
                >
                  <ChakraImage
                    fallback={<DefaultSkeleton />}
                    w={'100%'}
                    h={'100%'}
                    objectFit={'fill'}
                    src={sellerInfo.brandLogoS3Url}
                  />
                </Center>
              </Center>
            </Box>
            <Box px={'10rem'}>
              <VStack spacing={'5rem'} justifyContent={'flex-start'}>
                <Box w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'3rem'}
                    fontWeight={400}
                    lineHeight={'4.5rem'}
                  >
                    {sellerInfo.brandName}
                  </Text>
                </Box>
                <Box w={'100%'}>
                  <Tabs
                    p={0}
                    defaultIndex={tabIndex}
                    onChange={(index) => {
                      setTabIndex(index);
                    }}
                  >
                    <TabList px={0} py={'0.5rem'}>
                      <HStack spacing={'1.3rem'}>
                        <Tab
                          p={0}
                          w={'max-content'}
                          _selected={{ color: '#66809C', fontWeight: 600 }}
                          color={'#A7C3D2'}
                          fontSize={'1.25rem'}
                          fontWeight={400}
                          lineHeight={'2.25rem'}
                        >
                          {localeText(LANGUAGES.BRAND_INFO)}
                        </Tab>
                        <Tab
                          p={0}
                          w={'max-content'}
                          _selected={{ color: '#66809C', fontWeight: 600 }}
                          color={'#A7C3D2'}
                          fontSize={'1.25rem'}
                          fontWeight={400}
                          lineHeight={'2.25rem'}
                        >
                          {localeText(LANGUAGES.BRAND_PRODUCT)}
                        </Tab>
                      </HStack>
                    </TabList>

                    <ContentBR h={'2.5rem'} />

                    <Box w={'100%'}>
                      <TabPanels p={0}>
                        <TabPanel p={0}>
                          <Box w={'100%'}>
                            <QuillViewer html={sellerInfo.info} />
                          </Box>

                          <ContentBR h={'2.5rem'} />

                          <Box>
                            <ChakraImage
                              fallback={<DefaultSkeleton />}
                              w={'100%'}
                              h={'100%'}
                              objectFit={'cover'}
                              src={sellerInfo.brandBannerS3Url}
                            />
                          </Box>
                        </TabPanel>

                        <TabPanel p={0}>
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
                              <Box>
                                <HStack spacing={'1.3rem'}>
                                  {TextChecker(
                                    localeText(LANGUAGES.COMMON.MOST_POPULAR),
                                    1,
                                  )}
                                  {TextChecker(
                                    localeText(LANGUAGES.COMMON.NEW),
                                    2,
                                  )}
                                  {TextChecker(
                                    localeText(LANGUAGES.COMMON.PRICE),
                                    3,
                                  )}
                                </HStack>
                              </Box>
                            </HStack>
                          </Box>

                          <ContentBR h={'2.5rem'} />

                          <Box w={'100%'}>
                            <VStack spacing={'5rem'} h={'100%'}>
                              <Box w={'100%'}>
                                {listProduct.length > 0 && listItems()}
                                {listProduct.length === 0 && (
                                  <Center w={'100%'} h={'10rem'}>
                                    <Text
                                      fontSize={'1.5rem'}
                                      fontWeight={500}
                                      lineHeight={'1.75rem'}
                                    >
                                      {localeText(
                                        LANGUAGES.INFO_MSG.NO_ITEM_SEARCHED,
                                      )}
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
                        </TabPanel>
                      </TabPanels>
                    </Box>
                  </Tabs>
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

export default BrandPage;
