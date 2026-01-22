'use client';

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import { Box, Image as ChakraImage } from '@chakra-ui/react';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import useMove from '@/hooks/useMove';
import useDevice from '@/hooks/useDevice';

const MainBannerSwiper = forwardRef((props, ref) => {
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

  return (
    <Box w={'100%'} aspectRatio={listData?.length > 0 ? 2.6667 : null}>
      <Swiper
        h="100%"
        modules={[Autoplay]}
        ref={swiperRef}
        loop={true}
        effect="fade"
        slidesPerView={1}
        spaceBetween={0}
        autoplay={{
          delay: 3000, // 3초마다 자동 슬라이드
          disableOnInteraction: false, // 사용자가 터치해도 계속 자동 진행
        }}
        onSlideChange={(s) => {
          setIsBeginning(s.isBeginning);
          setIsEnd(s.isEnd);
        }}
      >
        {listData?.map((item, index) => {
          return (
            <SwiperSlide key={index} className={'items-center'} h="100%">
              <ChakraImage
                fallback={<DefaultSkeleton />}
                w={'100%'}
                h={'100%'}
                maxH={clampW(11.3125, 45)}
                objectFit={'contain'}
                src={item.imageS3Url}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
});

MainBannerSwiper.displayName = 'MainBannerSwiper';

export default MainBannerSwiper;
