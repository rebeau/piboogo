'use client';

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Box, Image as ChakraImage } from '@chakra-ui/react';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import useMove from '@/hooks/useMove';
import useDevice from '@/hooks/useDevice';

const CategorySwiper = forwardRef((props, ref) => {
  const { isMobile, clampW } = useDevice();
  const { moveBrand } = useMove();
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const isMove = true;

  const { data, onSlideChange } = props;

  useEffect(() => {
    // 화면 사이즈 변경 시 Swiper 인스턴스 업데이트
    const handleResize = () => {
      if (swiperRef.current) {
        swiperRef.current.swiper.update(); // Swiper 인스턴스 업데이트
      }
    };
    // 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', handleResize);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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

  const handleDetailSellerProdcut = (item) => {
    if (isMove) {
      moveBrand(item.sellerUserId);
    }
  };

  return isMobile(true) ? (
    <>
      <Swiper
        modules={[Autoplay]}
        ref={swiperRef}
        // slidesPerView={data.length > 5 ? 5 : data.length}
        // spaceBetween={10}
        // auto 옵션
        loop={true}
        autoplay={{
          delay: 2500, // Auto-slide delay in ms
          disableOnInteraction: true, // Keeps autoplay even after user interacts
        }}
        effect="fade"
        //
        spaceBetween={0}
        onSlideChange={(s) => {
          setIsBeginning(s.isBeginning);
          setIsEnd(s.isEnd);
        }}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          350: {
            slidesPerView: 5,
            spaceBetween: 0,
          },
          365: {
            slidesPerView: 5,
            spaceBetween: 0,
          },
          460: {
            slidesPerView: 5,
            spaceBetween: 0,
          },
          500: {
            slidesPerView: 6,
            spaceBetween: 0,
          },
          640: {
            slidesPerView: 6,
            spaceBetween: 0,
          },
          690: {
            slidesPerView: 7,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 8,
            spaceBetween: 0,
          },
          1100: {
            slidesPerView: 9,
            spaceBetween: 0,
          },
          1200: {
            slidesPerView: 10,
            spaceBetween: 0,
          },
        }}
        // modules={[Navigation]}
      >
        {data?.map((item, index) => {
          return (
            <SwiperSlide key={index} className={'items-center'}>
              <Box
                // w={'6.25rem'}
                // h={'6.25rem'}
                w={clampW(2.725, 6.25)}
                aspectRatio={1 / 1}
                cursor={isMove && 'pointer'}
                onClick={() => {
                  moveBrand(item.sellerUserId);
                }}
              >
                <ChakraImage
                  fallback={<DefaultSkeleton />}
                  w={'100%'}
                  h={'100%'}
                  objectFit={'cover'}
                  src={item?.brandLogoS3Url}
                />
              </Box>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  ) : (
    <>
      <Swiper
        modules={[Autoplay]}
        ref={swiperRef}
        slidesPerView={data.length > 5 ? 5 : data.length}
        // spaceBetween={10}
        // auto 옵션
        loop={true}
        autoplay={{
          delay: 2500, // Auto-slide delay in ms
          disableOnInteraction: true, // Keeps autoplay even after user interacts
        }}
        effect="fade"
        //
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
            slidesPerView: 5,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 5,
            spaceBetween: 0,
          },
          1450: {
            slidesPerView: 5,
            spaceBetween: 0,
          },
          1800: {
            slidesPerView: 5,
            spaceBetween: 0,
          },
        }}
        // modules={[Navigation]}
      >
        {data?.map((item, index) => {
          return (
            <SwiperSlide key={index} className={'items-center'}>
              <Box
                // w={'6.25rem'}
                // h={'6.25rem'}
                w={clampW(2.725, 6.25)}
                aspectRatio={1 / 1}
                cursor={isMove && 'pointer'}
                onClick={() => {
                  moveBrand(item.sellerUserId);
                }}
              >
                <ChakraImage
                  fallback={<DefaultSkeleton />}
                  w={'100%'}
                  h={'100%'}
                  objectFit={'cover'}
                  src={item?.brandLogoS3Url}
                />
              </Box>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
});

CategorySwiper.displayName = 'CategorySwiper';

export default CategorySwiper;
