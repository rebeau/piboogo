'use client';

import { Box, HStack } from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';
import BrandBannerSwiper from './BrandBannerSwiper';
import useDevice from '@/hooks/useDevice';

const BrandBannerSwiperForm = (props) => {
  const { isMobile } = useDevice();
  const { listData } = props;
  const swiperRef = useRef(null);

  const [nav, setNav] = useState([true, true]);

  // 이전 슬라이드
  const handlePrev = useCallback(() => {
    if (swiperRef.current) {
      swiperRef.current.handlePrev();
    }
  });

  // 다음 슬라이드
  const handleNext = useCallback(() => {
    if (swiperRef.current) {
      swiperRef.current.handleNext();
    }
  });

  const handleIsBeginningActive = useCallback(() => {
    if (nav[0] === true && nav[1] === true) {
      return false;
    } else if (nav[0] === true) {
      return false;
    } else {
      return true;
    }
  });

  const handleIsEndActive = useCallback(() => {
    if (nav[0] === true && nav[1] === true) {
      return false;
    } else if (nav[1] === true) {
      return false;
    } else {
      return true;
    }
  });

  return isMobile(true) ? (
    <Box w={'100%'}>
      <HStack w={'100%'} spacing={'0.62rem'} justifyContent={'center'}>
        <Box w={'100%'} display={'block'}>
          <BrandBannerSwiper
            ref={swiperRef}
            listData={listData}
            onSlideChange={(isBeginning, isEnd) => {
              setNav([isBeginning, isEnd]);
            }}
          />
        </Box>
      </HStack>
    </Box>
  ) : (
    <Box w={'100%'} maxW={1920}>
      <HStack w={'100%'} spacing={'0.62rem'} justifyContent={'center'}>
        {/*
        <Center
          w={'1.5625rem'}
          cursor={handleIsBeginningActive() ? 'pointer' : null}
          // onClick={handleNext}
        >
          <Img src={IconLeft.src} w={'1.5rem'} h={'1.5rem'} />
        </Center>
        */}
        <Box
          w={'100%'}
          // w={'calc(100% - 1.5625rem)'}
          // h={'6.25rem'}
          display={'block'}
        >
          <BrandBannerSwiper
            ref={swiperRef}
            listData={listData}
            onSlideChange={(isBeginning, isEnd) => {
              setNav([isBeginning, isEnd]);
            }}
          />
        </Box>
        {/*
        <Center
          w={'1.5625rem'}
          cursor={handleIsEndActive() ? 'pointer' : null}
          // onClick={handleNext}
        >
          <Img src={IconRight.src} w={'1.5rem'} h={'1.5rem'} />
        </Center>
        */}
      </HStack>
    </Box>
  );
};

export default BrandBannerSwiperForm;
