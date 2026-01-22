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
import { Box, Center, Text, VStack } from '@chakra-ui/react';
import AutoImageSlider from '@/components/input/file/AutoImageSlider';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import useDevice from '@/hooks/useDevice';

const LoungeSwiper = forwardRef((props, ref) => {
  const swiperRef = useRef(null);
  const { isMobile, clampW } = useDevice();
  const { localeText } = useLocale();
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const { data, onSlideChange, onSlideClick } = props;

  useEffect(() => {
    // 화면 사이즈 변경 시 Swiper 인스턴스 업데이트
    const handleResize = () => {
      if (swiperRef.current) {
        swiperRef.current.swiper.update(); // Swiper 인스턴스 업데이트
        if (onSlideChange) {
          setIsBeginning(swiperRef.current.swiper.isBeginning);
          setIsEnd(swiperRef.current.swiper.isEnd);
          onSlideChange(
            swiperRef.current.swiper.isBeginning,
            swiperRef.current.swiper.isEnd,
          );
        }
      }
    };
    // 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', handleResize);

    setTimeout(() => {
      handleResize();
    }, 200);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (swiperRef.current && data.length > 0) {
      setIsBeginning(swiperRef.current.swiper.isBeginning);
      setIsEnd(swiperRef.current.swiper.isEnd);
      if (onSlideChange) {
        onSlideChange(
          swiperRef.current.swiper.isBeginning,
          swiperRef.current.swiper.isEnd,
        );
      }
    }
  }, [swiperRef, data]);

  useEffect(() => {
    if (onSlideChange) {
      onSlideChange(isBeginning, isEnd);
    }
  }, [isBeginning, isEnd]);

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
          350: {
            slidesPerView: 2,
            spaceBetween: 2,
          },
          365: {
            slidesPerView: 2,
            spaceBetween: 2,
          },
          460: {
            slidesPerView: 2,
            spaceBetween: 2,
          },
          500: {
            slidesPerView: 2,
            spaceBetween: 2,
          },
          540: {
            slidesPerView: 2,
            spaceBetween: 2,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 2,
          },
          690: {
            slidesPerView: 3,
            spaceBetween: 2,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 2,
          },
          820: {
            slidesPerView: 4,
            spaceBetween: 2,
          },
          1100: {
            slidesPerView: 4,
            spaceBetween: 2,
          },
          1200: {
            slidesPerView: 5,
            spaceBetween: 2,
          },
          1920: {
            slidesPerView: 5,
            spaceBetween: 2,
          },
        }}
        // modules={[Navigation]}
      >
        {data.map((item, index) => {
          const listImage = item.loungeImageList || [];
          return isMobile(true) ? (
            <SwiperSlide key={index} className={'items-center'}>
              <Box
                cursor={'pointer'}
                w={clampW(10, 16)}
                minW={'10rem'}
                onClick={() => {
                  onSlideClick(item);
                }}
              >
                <VStack spacing={0} w={'100%'}>
                  <Box w={'100%'} h={clampW(10, 16)} position={'relative'}>
                    <AutoImageSlider images={listImage} />
                  </Box>
                  <Box w={'100%'} pt={'0.75rem'}>
                    <VStack spacing={'0.75rem'}>
                      <Box w={'100%'}>
                        <VStack spacing={0}>
                          <Box w={'100%'}>
                            <Text
                              color={'#66809C'}
                              fontSize={clampW(0.875, 0.9375)}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                            >
                              {item.id}
                            </Text>
                          </Box>
                          <Box w={'100%'}>
                            <Text
                              color={'#485766'}
                              fontSize={clampW(1, 1.125)}
                              fontWeight={500}
                              lineHeight={'1.96875rem'}
                            >
                              {item.title}
                            </Text>
                          </Box>
                        </VStack>
                      </Box>
                    </VStack>
                  </Box>
                </VStack>
              </Box>
            </SwiperSlide>
          ) : (
            <SwiperSlide key={index} className={'items-center'}>
              <Box
                cursor={'pointer'}
                w={clampW(10, 16)}
                onClick={() => {
                  onSlideClick(item);
                }}
              >
                <VStack spacing={0} w={'100%'}>
                  <Box w={'100%'} h={clampW(10, 16)} position={'relative'}>
                    <AutoImageSlider images={listImage} />
                  </Box>
                  <Box w={'100%'} pt={'1rem'}>
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
                              {item.id}
                            </Text>
                          </Box>
                          <Box w={'100%'}>
                            <Text
                              color={'#485766'}
                              fontSize={'1.125rem'}
                              fontWeight={500}
                              lineHeight={'1.96875rem'}
                            >
                              {item.title}
                            </Text>
                          </Box>
                        </VStack>
                      </Box>
                    </VStack>
                  </Box>
                </VStack>
              </Box>
            </SwiperSlide>
          );
        })}
        {data.length === 0 && (
          <Center w={'100%'} h={'21rem'}>
            <Text fontSize={'1.2rem'} fontWeight={400} lineHeight={'1.75rem'}>
              {localeText(LANGUAGES.INFO_MSG.NO_POST)}
            </Text>
          </Center>
        )}
      </Swiper>
    </>
  );
});

LoungeSwiper.displayName = 'LoungeSwiper';

export default LoungeSwiper;
