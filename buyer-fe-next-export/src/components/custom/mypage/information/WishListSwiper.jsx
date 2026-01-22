'use client';

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import useLocale from '@/hooks/useLocale';
import WishListCard from './WishListCard';

const WishListSwiper = forwardRef((props, ref) => {
  const { localeText } = useLocale();
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const {
    data,
    onSlideChange,
    isDetail = false,
    isCheck = false,
    onClickFavorite,
  } = props;

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
    <>
      <Swiper
        ref={swiperRef}
        slidesPerView={1}
        spaceBetween={10}
        onSlideChange={(s) => {
          setIsBeginning(s.isBeginning);
          setIsEnd(s.isEnd);
        }}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1450: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
          1800: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
        }}
        // modules={[Navigation]}
      >
        {data?.map((item, index) => {
          return (
            <SwiperSlide className={'items-center'} key={index}>
              <WishListCard
                item={item}
                isDetail={isDetail}
                isCheck={isCheck}
                onClickFavorite={onClickFavorite}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
});

WishListSwiper.displayName = 'WishListSwiper';

export default WishListSwiper;
