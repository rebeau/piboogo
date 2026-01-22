'use client';

import { CustomIcon } from '@/components';
import CustomCheckbox from '@/components/common/checkbox/CustomCheckBox';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import StarRating from '@/components/common/StarRating';
import AutoImageSlider from '@/components/input/file/AutoImageSlider';
import { LANGUAGES } from '@/constants/lang';
import { SERVICE } from '@/constants/pageURL';
import useDevice from '@/hooks/useDevice';
import useLocale from '@/hooks/useLocale';
import useMove from '@/hooks/useMove';
import { checkedItemsState } from '@/stores/dataRecoil';
import utils from '@/utils';
import {
  Box,
  HStack,
  Image as ChakraImage,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

const WishListCard = (props) => {
  const { isMobile, clampW } = useDevice();
  const { moveProductDetail } = useMove();
  const router = useRouter();
  const { item, isDetail = false, isCheck = false, onClickFavorite } = props;
  const { localeText } = useLocale();

  const [listImage, setListImage] = useState([]);
  const [firstImage, setFirstImage] = useState(null);

  useEffect(() => {
    if (item?.productImages) {
      const tempListImage =
        item?.productImages.length > 0 ? item?.productImages[0] : [];
      setListImage(tempListImage);
      if (tempListImage?.imageS3Url) {
        setFirstImage(tempListImage?.imageS3Url);
      }
    }
  }, [item]);

  const [checkedItems, setCheckedItems] = useRecoilState(checkedItemsState);
  const [ableCheck, setAbleCheck] = useState(false);

  const handleRemoveFavorite = useCallback(async (productFavoritesId) => {
    if (onClickFavorite) {
      onClickFavorite(productFavoritesId);
    }
  });

  return isMobile(true) ? (
    <Box
      w={isDetail ? clampW(10, 19) : clampW(10, 16.5)}
      cursor={'pointer'}
      position={'relative'}
      onClick={(e) => {
        const target = e.target;
        if (target.closest('.custom-check')) {
          // console.log('Checkbox clicked');
        } else if (target.closest('.custom-favorite')) {
          handleRemoveFavorite(item.productFavoritesId);
        } else {
          moveProductDetail(item.productId);
        }
      }}
    >
      <VStack spacing={0} w={'100%'}>
        <Box
          w={'100%'}
          h={isDetail ? clampW(10, 19) : clampW(10, 16.5)}
          position={'relative'}
        >
          {isCheck && (
            <Box
              zIndex={4}
              borderRadius={'0.25rem'}
              position={'absolute'}
              top={clampW(0.5, 1.5)}
              left={clampW(0.5, 1.5)}
              bg={'#fff'}
            >
              <CustomCheckbox
                isChecked={
                  checkedItems.findIndex((id) => {
                    return id === item.productFavoritesId;
                  }) > -1
                }
                onClick={(e) => e.stopPropagation()}
                onChange={(v) => {
                  const index = checkedItems.findIndex((id) => {
                    return id === item.productFavoritesId;
                  });
                  if (index > -1) {
                    setCheckedItems([
                      ...checkedItems.slice(0, index),
                      ...checkedItems.slice(index + 1),
                    ]);
                  } else {
                    setCheckedItems([...checkedItems, item.productFavoritesId]);
                  }
                }}
              />
            </Box>
          )}
          <ChakraImage
            onLoad={() => {
              setAbleCheck(true);
            }}
            fallback={<DefaultSkeleton />}
            w={'100%'}
            h={'100%'}
            objectFit={'cover'}
            src={firstImage}
          />
        </Box>
        <Box w={'100%'} pt={'0.81rem'}>
          {isDetail ? (
            <VStack spacing={'0.54rem'}>
              <Box w={'100%'}>
                <VStack spacing={0}>
                  <Box w={'100%'}>
                    <Text
                      color={'#66809C'}
                      fontSize={clampW(0.6875, 0.9375)}
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
                      <Box>
                        <Text
                          color={'#485766'}
                          fontSize={clampW(0.75, 1.125)}
                          fontWeight={500}
                        >
                          {item.name}
                        </Text>
                      </Box>
                      <Box
                        position={'relative'}
                        cursor={'pointer'}
                        w={clampW(1, 2)}
                        h={clampW(1, 2)}
                        className={'custom-favorite'}
                      >
                        <CustomIcon
                          name={'heartFill'}
                          w={'100%'}
                          h={'100%'}
                          color={'#7895B2'}
                        />
                      </Box>
                    </HStack>
                  </Box>
                </VStack>
              </Box>

              <Box w={'100%'}>
                <Stat>
                  <StatLabel>
                    <HStack spacing={'0.25rem'}>
                      <Text
                        color={'#66809C'}
                        fontSize={clampW(0.625, 1)}
                        lineHeight={'160%'}
                        fontWeight={400}
                      >
                        {localeText(LANGUAGES.MSRP)}
                      </Text>
                      <Text
                        color={'#66809C'}
                        fontSize={clampW(0.625, 1)}
                        lineHeight={'160%'}
                        fontWeight={400}
                      >
                        {utils.parseDallar(item.msrp)}
                      </Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber>
                    <HStack spacing={'0.25rem'}>
                      <Text
                        color={'#485766'}
                        fontSize={clampW(0.875, 1.5)}
                        fontWeight={600}
                      >
                        {utils.parseDallar(item.wp)}
                      </Text>
                      <HStack spacing={'0.25rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={clampW(0.625, 0.9375)}
                          fontWeight={400}
                        >
                          {localeText(LANGUAGES.MINIMUM)}
                        </Text>
                        <Text
                          color={'#7895B2'}
                          fontSize={clampW(0.625, 0.9375)}
                          fontWeight={500}
                        >
                          {utils.parseDallar(item.minimumOrderAmount)}
                        </Text>
                      </HStack>
                    </HStack>
                  </StatNumber>
                </Stat>
              </Box>

              <Box w={'100%'}>
                <HStack alignContent={'center'}>
                  <StarRating
                    initialRating={item.rating}
                    w={'1.4rem'}
                    h={'1.4rem'}
                  />
                  <Text
                    color={'#7895B2'}
                    fontSize={clampW(0.8805, 0.9375)}
                    fontWeight={400}
                  >
                    ({item.rating})
                  </Text>
                </HStack>
              </Box>
            </VStack>
          ) : (
            <VStack spacing={'0.75rem'}>
              <Box w={'100%'}>
                <VStack spacing={0}>
                  <Box w={'100%'}>
                    <Text
                      color={'#66809C'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {item?.brandName || ''}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={500}
                      lineHeight={'1.96875rem'}
                    >
                      {item?.name || ''}
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  ) : (
    <Box
      w={isDetail ? '19rem' : '16.5rem'}
      cursor={'pointer'}
      position={'relative'}
      onClick={(e) => {
        const target = e.target;
        if (target.closest('.custom-check')) {
          // console.log('Checkbox clicked');
        } else if (target.closest('.custom-favorite')) {
          handleRemoveFavorite(item.productFavoritesId);
        } else {
          moveProductDetail(item.productId);
        }
      }}
    >
      <VStack spacing={0} w={'100%'}>
        <Box
          w={'100%'}
          h={isDetail ? '20rem' : '16.5rem'}
          position={'relative'}
        >
          {isDetail && (
            <Box
              zIndex={4}
              borderRadius={'0.25rem'}
              position={'absolute'}
              top={'1.25rem'}
              left={'1.25rem'}
              bg={'#fff'}
            >
              <CustomCheckbox
                isChecked={
                  checkedItems.findIndex((id) => {
                    return id === item.productFavoritesId;
                  }) > -1
                }
                onClick={(e) => e.stopPropagation()}
                onChange={(v) => {
                  const index = checkedItems.findIndex((id) => {
                    return id === item.productFavoritesId;
                  });
                  if (index > -1) {
                    setCheckedItems([
                      ...checkedItems.slice(0, index),
                      ...checkedItems.slice(index + 1),
                    ]);
                  } else {
                    setCheckedItems([...checkedItems, item.productFavoritesId]);
                  }
                }}
              />
            </Box>
          )}
          <ChakraImage
            onLoad={() => {
              setAbleCheck(true);
            }}
            fallback={<DefaultSkeleton />}
            w={'100%'}
            h={'100%'}
            objectFit={'cover'}
            src={firstImage}
          />
          {/*
          <Box w={'100%'} h={'265px'} position={'relative'}>
            <AutoImageSlider images={listImage} />
          </Box>
          */}
        </Box>
        <Box w={'100%'} py={'1rem'}>
          {isDetail ? (
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
                      <Box>
                        <Text
                          color={'#485766'}
                          fontSize={'1.125rem'}
                          lineHeight={'1.5rem'}
                          fontWeight={500}
                        >
                          {item.name}
                        </Text>
                      </Box>
                      <Box
                        position={'relative'}
                        cursor={'pointer'}
                        w={'2rem'}
                        h={'2rem'}
                        className={'custom-favorite'}
                      >
                        <CustomIcon
                          name={'heartFill'}
                          w={'100%'}
                          h={'100%'}
                          color={'#7895B2'}
                        />
                      </Box>
                    </HStack>
                  </Box>
                </VStack>
              </Box>
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
              <Box w={'100%'}>
                <HStack alignContent={'center'}>
                  <StarRating initialRating={item.rating} />
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
          ) : (
            <VStack spacing={'0.75rem'}>
              <Box w={'100%'}>
                <VStack spacing={0}>
                  <Box w={'100%'}>
                    <Text
                      color={'#66809C'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {item?.brandName || ''}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={500}
                      lineHeight={'1.96875rem'}
                    >
                      {item?.name || ''}
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default WishListCard;
