'use client';

import { CustomIcon } from '@/components';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import StarRating from '@/components/common/StarRating';
import { SUCCESS } from '@/constants/errorCode';
import { LANGUAGES } from '@/constants/lang';
import useDevice from '@/hooks/useDevice';
import useLocale from '@/hooks/useLocale';
import productFavoritesApi from '@/services/productFavoritesApi';
import utils from '@/utils';
import {
  Box,
  Center,
  HStack,
  Image as ChakraImage,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';

const ProductItemCard = (props) => {
  const { isMobile, clampW, clampHAvg } = useDevice();
  const { localeText } = useLocale();
  const { item, onChange, onClick, isAbleFavorite = true } = props;

  const isLogin = utils.getIsLogin();

  const [imageList, setImageList] = useState([]);
  const [firstImageSrc, setFirstImageSrc] = useState(null);

  useEffect(() => {
    if (item?.imageList) {
      setImageList(item.imageList);
      if (item.imageList?.length > 0) {
        setFirstImageSrc(item.imageList[0].imageS3Url);
      }
    }
    if (item?.productImagesData) {
      setImageList(item.productImagesData);
      if (item.productImagesData?.length > 0) {
        setFirstImageSrc(item.productImagesData[0].imageS3Url);
      }
    }
    if (item?.productImageList) {
      setImageList(item.productImageList);
      if (item.productImageList?.length > 0) {
        setFirstImageSrc(item.productImageList[0].imageS3Url);
      }
    }
    if (item?.productImages) {
      setImageList(item.productImages);
      if (item.productImages?.length > 0) {
        setFirstImageSrc(item.productImages[0].imageS3Url);
      }
    }
  }, [item]);

  const handleOnClick = useCallback((item) => {
    if (onClick) {
      onClick(item);
    }
  });

  const handleAddFavorite = useCallback(async (item) => {
    const param = {
      productId: item.productId,
    };
    const result = await productFavoritesApi.postProductFavorites(param);

    if (result?.errorCode === SUCCESS) {
      if (onChange) {
        const temp = { ...item, isFavorite: 2 };
        onChange(temp);
      }
    }
  });

  const handleRemoveFavorite = useCallback(async (item) => {
    const param = {
      productFavoritesIds: [item.productId],
    };
    const result = await productFavoritesApi.deleteProductFavorites(param);

    if (result?.errorCode === SUCCESS) {
      if (onChange) {
        const temp = { ...item, isFavorite: 1 };
        onChange(temp);
      }
    }
  });

  return isMobile(true) ? (
    <Box
      w={'100%'}
      cursor={'pointer'}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        handleOnClick(item);
      }}
    >
      <Center w={`100%`} h={'100%'}>
        <VStack spacing={0} w={'100%'}>
          <Box w={'100%'} position={'relative'}>
            <Box
            //w={clampW(19, 20.9375)}
            // aspectRatio={19 / 20}
            >
              <ChakraImage
                fallback={<DefaultSkeleton />}
                w={'100%'}
                h={'100%'}
                objectFit={'cover'}
                src={firstImageSrc}
              />
            </Box>
            {item?.promotionName && (
              <Center
                minW={'3.2rem'}
                position={'absolute'}
                left={'0.75rem'}
                bottom={'0.75rem'}
                borderRadius={'5rem'}
                p={'0.25rem'}
                bg={'#66809C'}
              >
                <Text
                  color={'#FFF'}
                  fontSize={'clamp(0.67163rem, 2vw, 0.9375rem)'}
                  lineHeight={'clamp(1.07463rem, 1vh, 1.5rem)'}
                  fontWeight={500}
                >
                  {item.promotionName}
                </Text>
              </Center>
            )}
          </Box>
          <Box w={'100%'} pt={'0.81rem'}>
            <VStack spacing={clampHAvg(0.54, 0.75)}>
              <Box w={'100%'}>
                <VStack spacing={0}>
                  <Box w={'100%'}>
                    <Text
                      color={'#66809C'}
                      // fontSize={'clamp(0.6875rem, 2vw, 0.9375rem)'}
                      fontSize={clampW(0.6875, 0.9375)}
                      lineHeight={clampHAvg(1.1, 1.5)}
                      fontWeight={400}
                    >
                      {item.brandName}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <HStack
                      justifyContent={'space-between'}
                      alignItems={'center'}
                    >
                      <Box w={`calc(100% - 2.2rem)`}>
                        <Text
                          color={'#485766'}
                          fontSize={clampW(0.75, 1.125)}
                          lineHeight={clampHAvg(1.2, 1.5)}
                          fontWeight={500}
                          whiteSpace={'nowrap'}
                          overflow={'hidden'}
                          textOverflow={'ellipsis'}
                        >
                          {item.name}
                        </Text>
                      </Box>

                      {isAbleFavorite && (
                        <Box
                          h={clampW(1, 2)}
                          cursor={isLogin && 'pointer'}
                          onClick={() => {
                            if (isLogin) {
                              if (item.isFavorite === 2) {
                                handleRemoveFavorite(item);
                              } else {
                                handleAddFavorite(item);
                              }
                            }
                          }}
                        >
                          {isLogin && (
                            <CustomIcon
                              name={
                                item.isFavorite === 2 ? 'heartFill' : 'heart'
                              }
                              w={clampW(1, 2)}
                              h={clampW(1, 2)}
                              color={'#7895B2'}
                            />
                          )}
                        </Box>
                      )}
                    </HStack>
                  </Box>
                </VStack>
              </Box>
              {isLogin && (
                <Box w={'100%'}>
                  <Stat>
                    <StatLabel>
                      <HStack spacing={'0.25rem'}>
                        <Text
                          color={'#66809C'}
                          fontSize={clampW(0.625, 1)}
                          lineHeight={clampHAvg(0.625, 1.75)}
                          fontWeight={400}
                        >
                          {localeText(LANGUAGES.MSRP)}
                        </Text>

                        <Text
                          color={'#66809C'}
                          fontSize={clampW(0.625, 1)}
                          lineHeight={clampHAvg(0.625, 1.75)}
                          fontWeight={400}
                        >
                          {utils.parseDallar(item.msrp)}
                        </Text>
                      </HStack>
                    </StatLabel>
                    <StatNumber>
                      <HStack spacing={clampW(0.2, 0.75)}>
                        <Text
                          color={'#485766'}
                          fontSize={clampW(0.875, 1.5)}
                          lineHeight={clampHAvg(1.575, 2.475)}
                          fontWeight={600}
                        >
                          {utils.parseDallar(item.wp)}
                        </Text>

                        <HStack spacing={'0.25rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={clampW(0.625, 0.9375)}
                            lineHeight={clampHAvg(1, 1.5)}
                            fontWeight={400}
                          >
                            {localeText(LANGUAGES.MINIMUM)}
                          </Text>
                          <Text
                            color={'#7895B2'}
                            fontSize={clampW(0.625, 0.9375)}
                            lineHeight={clampHAvg(1, 1.5)}
                            fontWeight={500}
                          >
                            {utils.parseDallar(item.minimumOrderAmount)}
                          </Text>
                        </HStack>
                      </HStack>
                    </StatNumber>
                  </Stat>
                </Box>
              )}
              <Box w={'100%'}>
                <HStack alignContent={'center'}>
                  <StarRating
                    w={clampW(1.4, 1.5)}
                    h={clampW(1.4, 1.5)}
                    initialRating={item.rating}
                  />
                  <Text
                    color={'#7895B2'}
                    fontSize={clampW(0.8805, 0.9375)}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    ({item.rating})
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Center>
    </Box>
  ) : (
    <Box
      w={'100%'}
      cursor={'pointer'}
      onClick={() => {
        handleOnClick(item);
      }}
    >
      <Center w={`100%`} h={'100%'}>
        <VStack spacing={0} w={'100%'}>
          <Box w={'100%'} position={'relative'}>
            <Box w={'100%'} aspectRatio={1}>
              <ChakraImage
                fallback={<DefaultSkeleton />}
                w={'100%'}
                h={'100%'}
                objectFit={'cover'}
                src={firstImageSrc}
              />
            </Box>
            {item?.promotionName && (
              <Center
                minW={'5rem'}
                position={'absolute'}
                left={'0.75rem'}
                bottom={'0.75rem'}
                borderRadius={'5rem'}
                p={'0.25rem'}
                bg={'#66809C'}
              >
                <Text
                  color={'#FFF'}
                  fontSize={'0.9375rem'}
                  lineHeight={'1.5rem'}
                  fontWeight={500}
                >
                  {item.promotionName}
                </Text>
              </Center>
            )}
          </Box>
          <Box w={'100%'} py={'1rem'}>
            <VStack spacing={'0.75rem'}>
              <Box w={'100%'}>
                <VStack spacing={0}>
                  <Box w={'100%'}>
                    <Text
                      color={'#66809C'}
                      fontSize={'0.9375rem'}
                      lineHeight={'1.5rem'}
                      fontWeight={400}
                    >
                      {item.brandName}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <HStack
                      justifyContent={'space-between'}
                      alignItems={'center'}
                    >
                      <Box w={`calc(100% - 2.5rem)`}>
                        <Text
                          color={'#485766'}
                          fontSize={'1.125rem'}
                          lineHeight={'1.5rem'}
                          fontWeight={500}
                          whiteSpace={'nowrap'}
                          overflow={'hidden'}
                          textOverflow={'ellipsis'}
                        >
                          {item.name}
                        </Text>
                      </Box>

                      {isAbleFavorite && (
                        <Box
                          h={'2rem'}
                          cursor={isLogin && 'pointer'}
                          onClick={() => {
                            if (isLogin) {
                              if (item.isFavorite === 2) {
                                handleRemoveFavorite(item);
                              } else {
                                handleAddFavorite(item);
                              }
                            }
                          }}
                        >
                          {isLogin && (
                            <CustomIcon
                              name={
                                item.isFavorite === 2 ? 'heartFill' : 'heart'
                              }
                              w={'2rem'}
                              h={'100%'}
                              color={'#7895B2'}
                            />
                          )}
                        </Box>
                      )}
                    </HStack>
                  </Box>
                </VStack>
              </Box>
              {isLogin && (
                <Box w={'100%'}>
                  <Stat>
                    <StatLabel>
                      <HStack spacing={'0.25rem'}>
                        <Text
                          color={'#66809C'}
                          fontSize={'1rem'}
                          lineHeight={'1.75rem'}
                          fontWeight={400}
                        >
                          {localeText(LANGUAGES.MSRP)}
                        </Text>

                        <Text
                          color={'#66809C'}
                          fontSize={'1rem'}
                          lineHeight={'1.75rem'}
                          fontWeight={400}
                        >
                          {utils.parseDallar(item.msrp)}
                        </Text>
                      </HStack>
                    </StatLabel>
                    <StatNumber>
                      <HStack spacing={'0.75rem'}>
                        <Text
                          color={'#485766'}
                          fontSize={'1.5rem'}
                          lineHeight={'2.475rem'}
                          fontWeight={600}
                        >
                          {utils.parseDallar(item.wp)}
                        </Text>

                        <HStack spacing={'0.25rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            lineHeight={'1.5rem'}
                            fontWeight={400}
                          >
                            {localeText(LANGUAGES.MINIMUM)}
                          </Text>
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            lineHeight={'1.5rem'}
                            fontWeight={500}
                          >
                            {utils.parseDallar(item.minimumOrderAmount)}
                          </Text>
                        </HStack>
                      </HStack>
                    </StatNumber>
                  </Stat>
                </Box>
              )}
              <Box w={'100%'}>
                <HStack alignContent={'center'}>
                  <StarRating
                    w={'1.5rem'}
                    h={'1.5rem'}
                    initialRating={item.rating}
                  />
                  <Text
                    color={'#7895B2'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    ({item.rating})
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Center>
    </Box>
  );
};

export default ProductItemCard;
