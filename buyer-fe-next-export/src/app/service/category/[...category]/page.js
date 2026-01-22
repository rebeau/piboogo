'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
  HStack,
  Img,
  SimpleGrid,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';

import useMenu from '@/hooks/useMenu';
import ContentBR from '@/components/custom/ContentBR';
import MainTopHeader from '@/components/custom/header/MainTopHeader';
import CategorySideBar from '@/components/custom/category/CategorySideBar';
import { DefaultPaginate } from '@/components';
import Footer from '@/components/common/custom/Footer';
import ProductItemCard from '@/components/custom/product/ProductItemCard';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import CategorySwiperForm from '@/components/custom/category/CategorySwiperForm';
import { SUCCESS } from '@/constants/errorCode';
import utils from '@/utils';
import { useParams, useRouter } from 'next/navigation';
import sellerCategoryApi from '@/services/sellerCategoryApi';
import useModal from '@/hooks/useModal';
import { SERVICE } from '@/constants/pageURL';
import MainContainer from '@/components/layout/MainContainer';
import useDevice from '@/hooks/useDevice';
import FilterIcon from '@public/svgs/icon/filter.svg';
import useMove from '@/hooks/useMove';

const CategoryPage = () => {
  const { isMobile, clampW } = useDevice();
  const { openModal } = useModal();
  const { moveProductDetail } = useMove();
  const isLogin = utils.getIsLogin();
  const router = useRouter();

  const { category } = useParams();

  const [firstCategory, secondCategory, thirdCategory] = category || [];

  const [isSetCategory, setIsSetCategory] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    listAllCategory,
    handleGetCategoryByName,
    selectedFirstCategory,
    setSelectedFirstCategory,
    selectedSecondCategory,
    setSelectedSecondCategory,
    selectedThirdCategory,
    setSelectedThirdCategory,
  } = useMenu();

  useEffect(() => {
    if (listAllCategory.length > 0) {
      handleSetSelectedCategory(firstCategory, secondCategory, thirdCategory);
    }
  }, [listAllCategory, firstCategory, secondCategory, thirdCategory]);

  const handleSetSelectedCategory = async (
    firstCategory,
    secondCategory,
    thirdCategory,
  ) => {
    if (firstCategory && secondCategory && thirdCategory) {
      const firstCateInfo = await handleSetFirstCategory(firstCategory);
      const secondCateInfo = await handleSetSecondCategory(secondCategory);
      await handleSetThirdCategory(thirdCategory);
      if (firstCateInfo && secondCateInfo) {
        handleGetListProductSeller(
          firstCateInfo.firstCategoryId,
          secondCateInfo.secondCategoryId,
        );
      }
    } else if (firstCategory && secondCategory) {
      const firstCateInfo = await handleSetFirstCategory(firstCategory);
      const secondCateInfo = await handleSetSecondCategory(secondCategory);
      if (firstCateInfo && secondCateInfo) {
        handleGetListProductSeller(
          firstCateInfo.firstCategoryId,
          secondCateInfo.secondCategoryId,
        );
      }
      setSelectedThirdCategory(null);
    } else if (firstCategory) {
      const firstCateInfo = await handleSetFirstCategory(firstCategory);
      if (firstCateInfo) {
        handleGetListProductSeller(firstCateInfo.firstCategoryId);
      }
      setSelectedSecondCategory(null);
      setSelectedThirdCategory(null);
    }
  };

  const handleSetFirstCategory = async (firstCategory) => {
    const firstCateInfo = await handleGetCategoryByName(firstCategory);
    if (firstCateInfo) {
      setSelectedFirstCategory(firstCateInfo);
      return firstCateInfo;
    } else {
      // 매칭되는 값이 없는경우 첫번째 카테고리로 이동
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_PRODUCT),
        onAgree: () => {
          router.push(
            `${SERVICE.CATEGORY.ROOT}/${listAllCategory[0].name.toLowerCase()}`,
          );
        },
      });
    }
  };
  const handleSetSecondCategory = async (secondCategory) => {
    const secondCateInfo = await handleGetCategoryByName(null, secondCategory);
    if (secondCateInfo) {
      setSelectedSecondCategory(secondCateInfo);
      return secondCateInfo;
    } else {
      setSelectedSecondCategory(null);
      console.log('not found second category');
      return null;
    }
  };
  const handleSetThirdCategory = async (thirdCategory) => {
    const thirdCateInfo = await handleGetCategoryByName(
      null,
      null,
      thirdCategory,
    );
    if (thirdCateInfo) {
      setSelectedThirdCategory(thirdCateInfo);
    } else {
      setSelectedThirdCategory(null);
      console.log('not found second category');
    }
  };

  const { localeText } = useLocale();
  const [selectedSort, setSelectedSort] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [contentNum, setContentNum] = useState(12);

  const [listProduct, setListProduct] = useState([]);
  const [listSellerCategory, setListSellerCategory] = useState([]);

  const handleGetListProductSeller = async (
    firstCategoryId,
    secondCategoryId,
  ) => {
    if (!firstCategoryId) return;
    const param = {
      firstCategoryId: firstCategoryId,
    };
    if (secondCategoryId) {
      param.secondCategoryId = secondCategoryId;
    }
    const result = await sellerCategoryApi.getListSellerCategory(param);
    if (result?.errorCode === SUCCESS) {
      setListSellerCategory(result.datas);
    } else {
      setListSellerCategory([]);
    }
  };

  const handleTitle = () => {
    const routerClick = (first, second, third) => {
      let url = SERVICE.CATEGORY.ROOT;
      if (utils.isNotEmpty(first)) {
        url = url + `/${first.toLowerCase()}`;
      }
      if (utils.isNotEmpty(second)) {
        url = url + `/${second.toLowerCase()}`;
      }
      if (utils.isNotEmpty(third)) {
        url = url + `/${third.toLowerCase()}`;
      }
      router.push(url);
    };

    if (isMobile(true)) {
      if (selectedThirdCategory) {
        return (
          <Text
            color={'#485766'}
            fontSize={clampW(1.5, 3)}
            fontWeight={400}
            lineHeight={'160%'}
          >
            {selectedThirdCategory.name}
          </Text>
        );
      } else if (selectedSecondCategory) {
        return (
          <Text
            color={'#485766'}
            fontSize={clampW(1.5, 3)}
            fontWeight={400}
            lineHeight={'160%'}
          >
            {selectedSecondCategory.name}
          </Text>
        );
      } else {
        return (
          <Text
            color={'#485766'}
            fontSize={clampW(1.5, 3)}
            fontWeight={400}
            lineHeight={'160%'}
          >
            {selectedFirstCategory.name}
          </Text>
        );
      }
    } else {
      if (selectedThirdCategory) {
        return (
          <Breadcrumb
            separator={
              <Text
                color={'#485766'}
                fontSize={clampW(1.5, 3)}
                fontWeight={400}
                lineHeight={'160%'}
              >
                {'/'}
              </Text>
            }
          >
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => {
                  routerClick(selectedFirstCategory.name);
                }}
              >
                <Text
                  color={'#485766'}
                  fontSize={clampW(1.5, 3)}
                  fontWeight={400}
                  lineHeight={'160%'}
                >
                  {selectedFirstCategory.name}
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => {
                  routerClick(
                    selectedFirstCategory.name,
                    selectedSecondCategory.name,
                  );
                }}
              >
                <Text
                  color={'#485766'}
                  fontSize={clampW(1.5, 3)}
                  fontWeight={400}
                  lineHeight={'160%'}
                >
                  {selectedSecondCategory.name}
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>
                <Text
                  color={'#7895B2'}
                  fontSize={clampW(1.5, 3)}
                  fontWeight={400}
                  lineHeight={'160%'}
                >
                  {selectedThirdCategory.name}
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        );
      } else if (selectedSecondCategory) {
        return (
          <Breadcrumb
            separator={
              <Text
                color={'#485766'}
                fontSize={clampW(1.5, 3)}
                fontWeight={400}
                lineHeight={'160%'}
              >
                {'/'}
              </Text>
            }
          >
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => {
                  routerClick(selectedFirstCategory.name);
                }}
              >
                <Text
                  color={'#485766'}
                  fontSize={clampW(1.5, 3)}
                  fontWeight={400}
                  lineHeight={'160%'}
                >
                  {selectedFirstCategory.name}
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>
                <Text
                  color={'#7895B2'}
                  fontSize={clampW(1.5, 3)}
                  fontWeight={400}
                  lineHeight={'160%'}
                >
                  {selectedSecondCategory.name}
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        );
      } else {
        return (
          <Text
            color={'#485766'}
            fontSize={clampW(1.5, 3)}
            fontWeight={400}
            lineHeight={'160%'}
          >
            {selectedFirstCategory.name}
          </Text>
        );
      }
    }
  };

  const listItems = useCallback(() => {
    return (
      <SimpleGrid
        columns={{
          '3xl': 4,
          '2xl': 4,
          xl: 3,
          lg: 2,
          md: 2,
          sm: 2,
          xs: 2,
        }}
        spacingX={'1.25rem'}
        spacingY={'5rem'}
      >
        {listProduct.map((item, index) => (
          <ProductItemCard
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
      <MainTopHeader />

      <Box w={'100%'}>
        <VStack spacing={'1.25rem'} justifyContent={'flex-start'}>
          <Box px={clampW(1, 2.5)} w={'100%'}>
            <VStack spacing={'0.75rem'}>
              <Box w={'100%'}>
                <HStack justifyContent={'space-between'}>
                  {handleTitle()}
                  <Box
                    onClick={() => {
                      onOpen();
                    }}
                  >
                    <HStack spacing={'0.5rem'}>
                      <Img src={FilterIcon.src} />
                      <Text
                        color={'#556A7E'}
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        lineHeight={'160%'}
                      >
                        {localeText(LANGUAGES.M_FILTER)}
                      </Text>
                    </HStack>
                  </Box>
                </HStack>
              </Box>
              <Box w={`${listSellerCategory.length * 6.4}rem`} maxW={'100%'}>
                <CategorySwiperForm data={listSellerCategory} />
              </Box>
            </VStack>
          </Box>
          <Box w={'100%'} px={clampW(1, 2.5)}>
            <HStack spacing={'2.5rem'} alignItems={'flex-start'}>
              <Box display={'none'}>
                <CategorySideBar
                  setListProduct={setListProduct}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalCount={totalCount}
                  setTotalCount={setTotalCount}
                  contentNum={contentNum}
                  isSetCategory={isSetCategory}
                  setIsSetCategory={setIsSetCategory}
                  isOpen={isOpen}
                  onOpen={onOpen}
                  onClose={onClose}
                />
              </Box>
              <Box w={'100%'}>
                <VStack spacing={0} h={'100%'}>
                  <Box py={'1rem'} w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={400}
                      lineHeight={'1.96875rem'}
                    >
                      {utils.parseAmount(totalCount)}{' '}
                      {localeText(LANGUAGES.ITEMS)}
                    </Text>
                  </Box>

                  <Box w={'100%'}>
                    {listProduct.length > 0 && listItems()}
                    {listProduct.length === 0 && (
                      <Center w={'100%'} h={'3rem'}>
                        <Text
                          fontSize={'1.5rem'}
                          fontWeight={500}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.INFO_MSG.NO_ITEM_SEARCHED)}
                        </Text>
                      </Center>
                    )}
                  </Box>
                </VStack>
              </Box>
            </HStack>
          </Box>
        </VStack>
      </Box>
    </MainContainer>
  ) : (
    <MainContainer>
      <Center w={'100%'}>
        <VStack w={'100%'} spacing={0}>
          <MainTopHeader />

          {/* content */}
          <Box w={'100%'} maxW={1920}>
            <VStack spacing={'1.25rem'} justifyContent={'flex-start'}>
              <Box px={'2.5rem'} w={'100%'}>
                <HStack justifyContent={'space-between'}>
                  <Box py={'2.5rem'}>{handleTitle()}</Box>
                  <Box>
                    <CategorySwiperForm data={listSellerCategory} />
                  </Box>
                </HStack>
              </Box>
              <Box w={'100%'} px={'2.5rem'}>
                <HStack spacing={'2.5rem'} alignItems={'flex-start'}>
                  <CategorySideBar
                    setListProduct={setListProduct}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalCount={totalCount}
                    setTotalCount={setTotalCount}
                    contentNum={contentNum}
                    isSetCategory={isSetCategory}
                    setIsSetCategory={setIsSetCategory}
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={onClose}
                  />
                  <Box w={'87.5rem'}>
                    <VStack spacing={0} h={'100%'}>
                      <Box py={'1rem'} w={'100%'}>
                        <Text
                          color={'#485766'}
                          fontSize={'1.125rem'}
                          fontWeight={400}
                          lineHeight={'1.96875rem'}
                        >
                          {utils.parseAmount(totalCount)}{' '}
                          {localeText(LANGUAGES.ITEMS)}
                        </Text>
                      </Box>

                      <Box w={'100%'}>
                        {listProduct.length > 0 && listItems()}
                        {listProduct.length === 0 && (
                          <Center w={'100%'} h={'10rem'}>
                            <Text
                              fontSize={'1.5rem'}
                              fontWeight={500}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(LANGUAGES.INFO_MSG.NO_ITEM_SEARCHED)}
                            </Text>
                          </Center>
                        )}
                      </Box>

                      <Center w={'100%'} pt={'5rem'}>
                        <DefaultPaginate
                          currentPage={currentPage}
                          setCurrentPage={setCurrentPage}
                          totalCount={totalCount}
                          contentNum={contentNum}
                        />
                      </Center>
                    </VStack>
                  </Box>
                </HStack>
              </Box>
            </VStack>
          </Box>

          <ContentBR h={'10rem'} />

          {/* footer */}
          <Footer />
        </VStack>
      </Center>
    </MainContainer>
  );
};

export default CategoryPage;
