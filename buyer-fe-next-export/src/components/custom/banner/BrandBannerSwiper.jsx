'use client';

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {
  Box,
  Text,
  VStack,
  Image as ChakraImage,
  HStack,
} from '@chakra-ui/react';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import { useRouter } from 'next/navigation';
import useMove from '@/hooks/useMove';
import useDevice from '@/hooks/useDevice';

const BrandBannerSwiper = forwardRef((props, ref) => {
  const { isMobile, clampW } = useDevice();
  const { moveBrand } = useMove();
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const { listData, onSlideChange } = props;

  useEffect(() => {
    if (swiperRef.current) {
      setTimeout(() => {
        if (onSlideChange) {
          onSlideChange(
            swiperRef.current.swiper.isBeginning,
            swiperRef.current.swiper.isEnd,
          );
        }
      }, 200);
    }
  }, []);

  useEffect(() => {
    if (onSlideChange) {
      onSlideChange(isBeginning, isEnd);
    }
  }, [isBeginning, isEnd]);

  const swiperRef = useRef(null);

  useImperativeHandle(ref, () => ({
    handlePrev: () => {
      if (!swiperRef.current) return;
      swiperRef.current.swiper.slidePrev();
    },
    handleNext: () => {
      if (!swiperRef.current) return;
      swiperRef.current.swiper.slideNext();
    },
  }));

  return isMobile(true) ? (
    <Box w={'100%'}>
      <Swiper
        ref={swiperRef}
        slidesPerView={1}
        // spaceBetween={10}
        spaceBetween={0}
        onSlideChange={(s) => {
          setIsBeginning(s.isBeginning);
          setIsEnd(s.isEnd);
        }}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          360: {
            slidesPerView: 2,
            spaceBetween: 0,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 0,
          },
          980: {
            slidesPerView: 4,
            spaceBetween: 0,
          },
        }}
        // modules={[Navigation]}
      >
        {listData?.map((item, index) => {
          const imageList = item?.imageList || [];
          return (
            <SwiperSlide key={index} className={'items-center'}>
              <Box
                w={'100%'}
                h={'100%'}
                cursor={'pointer'}
                onClick={() => {
                  moveBrand(item.sellerUserId);
                }}
              >
                <HStack justifyContent={'center'}>
                  <VStack spacing={0}>
                    <Box
                      // w={clampW(10.54688, 28)} h={clampW(10.54688, 28)}
                      // w={clampW(11.25, 30)} h={clampW(10.54688, 28.125)}
                      // w={clampW(0.25, 24)}
                      // h={clampW(7.54688, 23.125)}
                      w={clampW(10, 18)}
                      h={clampW(10, 18)}
                      // aspectRatio={180 / 168}
                    >
                      <ChakraImage
                        fallback={<DefaultSkeleton />}
                        w={'100%'}
                        h={'100%'}
                        objectFit={'cover'}
                        src={item.brandLogoS3Url}
                      />
                    </Box>
                    <Box py={'1.5rem'} px={'2.5rem'} w={'100%'}>
                      <Box w={'100%'}>
                        <Text
                          textAlign={'center'}
                          fontSize={'1.25rem'}
                          fontWeight={500}
                          color={'#576076'}
                        >
                          {item.brandName}
                        </Text>
                      </Box>
                      {item?.content && (
                        <Text
                          fontSize={'1rem'}
                          fontWeight={400}
                          color={'#66809C'}
                        >
                          {item.content}
                        </Text>
                      )}
                    </Box>
                  </VStack>
                </HStack>
              </Box>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  ) : (
    <Box w={'100%'}>
      <Swiper
        ref={swiperRef}
        slidesPerView={1}
        // spaceBetween={10}
        spaceBetween={0}
        onSlideChange={(s) => {
          setIsBeginning(s.isBeginning);
          setIsEnd(s.isEnd);
        }}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 3,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 0,
          },
          980: {
            slidesPerView: 3,
            spaceBetween: 0,
          },
          1000: {
            slidesPerView: 3,
            spaceBetween: 0,
          },
          1110: {
            slidesPerView: 3,
            spaceBetween: 0,
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 0,
          },
          1350: {
            slidesPerView: 4,
            spaceBetween: 0,
          },
          1380: {
            slidesPerView: 5,
            spaceBetween: 0,
          },
          1480: {
            slidesPerView: 5,
            spaceBetween: 0,
          },
          1680: {
            slidesPerView: 6,
            spaceBetween: 0,
          },
          1880: {
            slidesPerView: 6,
            spaceBetween: 0,
          },
          1920: {
            slidesPerView: 6,
            spaceBetween: 0,
          },
        }}
        // modules={[Navigation]}
      >
        {listData?.map((item, index) => {
          const imageList = item?.imageList || [];
          return (
            <SwiperSlide key={index} className={'items-center'}>
              <Box
                w={'100%'}
                h={'100%'}
                cursor={'pointer'}
                onClick={() => {
                  moveBrand(item.sellerUserId);
                }}
              >
                <HStack justifyContent={'center'}>
                  <VStack spacing={0} w={'30rem'}>
                    <Box
                      // w={clampW(11.25, 30)} h={clampW(10.54688, 28.125)}
                      // w={clampW(0.25, 24)}
                      // h={clampW(7.54688, 23.125)}
                      w={clampW(10, 18)}
                      h={clampW(10, 18)}
                      // aspectRatio={180 / 168}
                    >
                      <ChakraImage
                        fallback={<DefaultSkeleton />}
                        w={'100%'}
                        h={'100%'}
                        objectFit={'contain'}
                        src={item.brandLogoS3Url}
                      />
                    </Box>
                    <Box py={'1.5rem'} px={'2.5rem'} w={'100%'}>
                      <Box w={'100%'}>
                        <Text
                          textAlign={'center'}
                          fontSize={clampW(0.9375, 1.25)}
                          fontWeight={500}
                          color={'#576076'}
                        >
                          {item.brandName}
                        </Text>
                      </Box>
                      {item?.content && (
                        <Text
                          fontSize={clampW(0.75, 1)}
                          fontWeight={400}
                          color={'#66809C'}
                        >
                          {item.content}
                        </Text>
                      )}
                    </Box>
                  </VStack>
                </HStack>
              </Box>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
});

BrandBannerSwiper.displayName = 'BrandBannerSwiper';

export default BrandBannerSwiper;
