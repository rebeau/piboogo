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
// import SwiperForm from '@/components/lib/swiper/SwiperForm';

const CategorySwiper = forwardRef((props, ref) => {
  const { moveBrand } = useMove();
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const isMove = true;

  const { data, onSlideChange } = props;

  useEffect(() => {
    if (onSlideChange) {
      onSlideChange(isBeginning, isEnd);
    }
  }, [isBeginning, isEnd]);

  const handleDetailSellerProdcut = (item) => {
    if (isMove) {
      moveBrand(item.sellerUserId);
    }
  };

  /*
  return (
    <>
      <SwiperForm
        modules={[Autoplay]}
        ref={ref}
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
                w={'6.25rem'}
                h={'6.25rem'}
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
      </SwiperForm>
    </>
  );
  */
});

CategorySwiper.displayName = 'CategorySwiper';

export default CategorySwiper;
