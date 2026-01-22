'use client';

import { DefaultPaginate } from '@/components';
import Footer from '@/components/common/custom/Footer';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import ContentBR from '@/components/custom/ContentBR';
import MainTopHeader from '@/components/custom/header/MainTopHeader';
import ProductItemCard from '@/components/custom/product/ProductItemCard';
import MainContainer from '@/components/layout/MainContainer';
import { SUCCESS } from '@/constants/errorCode';
import { LANGUAGES } from '@/constants/lang';
import { PRODUCT, SERVICE } from '@/constants/pageURL';
import useDevice from '@/hooks/useDevice';
import useLocale from '@/hooks/useLocale';
import useMove from '@/hooks/useMove';
import searchApi from '@/services/searchApi';
import { headerSearchState } from '@/stores/dataRecoil';
import utils from '@/utils';
import {
  Box,
  Center,
  HStack,
  SimpleGrid,
  Text,
  VStack,
  Image as ChakraImage,
  Flex,
} from '@chakra-ui/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

const SearchPage = () => {
  const isLogin = utils.getIsLogin();
  const { isMobile, clampW } = useDevice();
  const { moveBrand, moveProductDetail } = useMove();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { localeText } = useLocale();
  const k = searchParams.get('k');

  const [initPage, setInitPage] = useState(true);
  const [searchBy, setSearchBy] = useRecoilState(headerSearchState);
  const [listBrand, setListBrand] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [contentNum, setContentNum] = useState(10);
  const [totalCount, setTotalCount] = useState(1);

  useEffect(() => {
    if (SERVICE.SEARCH.ROOT.indexOf(pathname) > -1) {
      if (!searchBy) {
        const url = `${pathname}`;
        router.replace(url);
      }
    }

    return () => {
      if (pathname.indexOf(SERVICE.SEARCH.ROOT) === -1) {
        setSearchBy('');
      }
    };
  }, [pathname, k]);

  useEffect(() => {
    /*
    if (k) {
      handleGetSearchAgent();
    }
    */
    handleGetSearchAgent();
  }, [k]);

  useEffect(() => {
    if (!initPage) {
      handleGetSearch();
    }
  }, [currentPage]);

  const handleGetSearchAgent = () => {
    setListBrand([]);
    setListProduct([]);
    if (currentPage === 1) {
      handleGetSearch();
    } else {
      setCurrentPage(1);
    }
  };

  const handleGetSearch = async () => {
    if (!k) return;

    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
      searchBy: k,
    };

    const result = await searchApi.getSearch(param);
    if (result?.errorCode === SUCCESS) {
      const { productList, sellerUserList, totalCount } = result;
      if (currentPage === 1) {
        if (sellerUserList?.length > 0) {
          setListBrand(sellerUserList);
        }
      } else if (sellerUserList?.length <= contentNum) {
        // 패스
      } else {
        if (sellerUserList?.length > 0) {
          setListBrand(sellerUserList);
        }
      }
      if (currentPage === 1) {
        if (productList?.length > 0) {
          setListProduct(productList);
        }
      } else if (productList?.length <= contentNum) {
        // 패스
        setListProduct(productList);
      } else {
        if (productList?.length > 0) {
          setListProduct(productList);
        }
      }

      setTotalCount(totalCount);
    } else {
      setListBrand([]);
      setListProduct([]);
      setTotalCount(1);
    }
    setInitPage(false);
  };

  const textHighlight = (message) => {
    console.log('message', message);
    if (typeof message !== 'string') {
      return null;
      /*
      return (
        <Text fontSize="2.5rem" fontWeight={300} color="#485766">
          {localeText(LANGUAGES.INFO_MSG.KEYWORD_NOT_FOUND)}
        </Text>
      );
      */
    }
    const parts = [];
    const regex = /"(.*?)"/g;
    let lastIndex = 0;

    for (const match of message.matchAll(regex)) {
      const [fullMatch, keyword] = match;
      const start = match.index;
      const end = start + fullMatch.length;

      if (lastIndex < start) {
        parts.push(message.slice(lastIndex, start));
      }

      parts.push(
        <Text
          as="span"
          key={start}
          fontSize={'2.5rem'}
          fontWeight={400}
          color="#485766"
        >
          {`”${keyword}”`}
        </Text>,
      );

      lastIndex = end;
    }

    if (lastIndex < message.length) {
      parts.push(message.slice(lastIndex));
    }

    return (
      <Text fontSize="2.5rem" fontWeight={300} color="#485766">
        {parts}
      </Text>
    );
  };

  const brandCardForm = () => {
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
        {listBrand.map((item, itemIndex) => {
          const sellerUserId = item?.sellerUserId;
          const brandName = item?.brandName;
          const brandLogoS3Url = item?.brandLogoS3Url;
          const info = item?.info;
          return (
            <Box
              key={itemIndex}
              w={'100%'}
              h={'100%'}
              cursor={'pointer'}
              onClick={() => {
                moveBrand(item.sellerUserId);
              }}
            >
              <HStack justifyContent={'center'}>
                <VStack spacing={0}>
                  <Box w={clampW(10, 22)} aspectRatio={1}>
                    <ChakraImage
                      fallback={<DefaultSkeleton />}
                      w={'100%'}
                      h={'100%'}
                      objectFit={'cover'}
                      src={brandLogoS3Url}
                    />
                  </Box>
                  <Box py={'1.5rem'} px={'2.5rem'} w={'100%'}>
                    <Box w={'100%'}>
                      <Text
                        textAlign={'left'}
                        fontSize={'1.25rem'}
                        fontWeight={500}
                        color={'#576076'}
                      >
                        {brandName}
                      </Text>
                    </Box>
                  </Box>
                </VStack>
              </HStack>
            </Box>
          );
        })}
      </SimpleGrid>
    );
  };

  const productCardForm = () => {
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
        {listProduct.map((item, itemIndex) => (
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
  };

  const getHeight = useCallback(() => {
    console.log('listBrand', listBrand);
    console.log('listProduct', listProduct);
    if (listBrand?.length === 0 && listProduct?.length === 0) {
      return 'calc(100vh - 8.6875rem - 18.875rem)';
    }
    return undefined;
  });

  return (
    <MainContainer>
      <Flex direction="column" minH="100vh">
        <MainTopHeader />

        <Box h={getHeight()}>
          {k && (
            <VStack spacing={0} h="100%">
              {listBrand.length > 0 && (
                <Box w="100%">
                  <Text fontSize={'1.5rem'} fontWeight={500}>
                    {textHighlight(
                      localeText(LANGUAGES.INFO_MSG.BRAND_RESULTS_FOR, {
                        key: '@KEYWORD@',
                        value: `"${k}"`,
                      }),
                    )}
                  </Text>

                  <ContentBR h="1.5rem" />

                  {brandCardForm()}

                  <ContentBR h="5rem" />
                </Box>
              )}

              {listProduct?.length > 0 && (
                <Box w="100%">
                  <Text fontSize={'1.5rem'} fontWeight={500}>
                    {textHighlight(
                      localeText(LANGUAGES.INFO_MSG.PRODUCT_RESULTS_FOR, {
                        key: '@KEYWORD@',
                        value: `"${k}"`,
                      }),
                    )}
                  </Text>

                  <ContentBR h="1.5rem" />

                  {productCardForm()}
                </Box>
              )}

              {listBrand?.length === 0 && listProduct?.length === 0 && (
                <Center w={'100%'} h="100%">
                  <Text fontSize={'2.5rem'} fontWeight={400} color="#485766">
                    {localeText(LANGUAGES.INFO_MSG.KEYWORD_NOT_FOUND)}
                  </Text>
                </Center>
              )}

              {(listBrand?.length > 0 || listProduct?.length > 0) && (
                <Box>
                  <ContentBR h="5rem" />
                  <DefaultPaginate
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalCount={totalCount}
                    contentNum={contentNum}
                  />
                </Box>
              )}
            </VStack>
          )}
          {!k && (
            <Center w={'100%'} h={'100%'}>
              {textHighlight(localeText(LANGUAGES.COMMON.SEARCH_KEYWORD))}
            </Center>
          )}
        </Box>

        <Footer />
      </Flex>
    </MainContainer>
  );
};

export default SearchPage;
