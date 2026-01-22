'use client';

import { Box, Center, HStack, Img } from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';
import CategorySwiper from './CategorySwiper';
import IconRight from '@public/svgs/icon/right.svg';
import IconLeft from '@public/svgs/icon/left.svg';
import useDevice from '@/hooks/useDevice';

const CategorySwiperForm = (props) => {
  const { isMobile, clampW } = useDevice();
  const { data } = props;
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
    <Box w={'100%'} minW={'100%'}>
      <HStack w={'100%'} spacing={'0.62rem'} justifyContent={'space-between'}>
        <Center
          w={'1.5625rem'}
          cursor={handleIsBeginningActive() ? 'pointer' : null}
          onClick={handlePrev}
        >
          <Img src={IconLeft.src} w={'1.5rem'} h={'1.5rem'} />
        </Center>
        <Box
          // w={'32rem'}
          w={isMobile(true) ? '100%' : `${data.length * 6.4}rem`}
          // maxW={'16rem'}
          // maxW={clampW(16, 32)}
          maxW={'calc(100% - 3rem)'}
          // w={'calc(100% - 1.5625rem)'}
          // h={'6.25rem'}
          display={'block'}
        >
          <CategorySwiper
            ref={swiperRef}
            data={data}
            onSlideChange={(isBeginning, isEnd) => {
              setNav([isBeginning, isEnd]);
            }}
          />
        </Box>
        <Center
          w={'1.5625rem'}
          cursor={handleIsEndActive() ? 'pointer' : null}
          onClick={handleNext}
        >
          <Img src={IconRight.src} w={'1.5rem'} h={'1.5rem'} />
        </Center>
      </HStack>
    </Box>
  ) : (
    <Box w={'100%'} minW={'100%'}>
      <HStack w={'100%'} spacing={'0.62rem'} justifyContent={'space-between'}>
        <Center
          w={'1.5625rem'}
          cursor={handleIsBeginningActive() ? 'pointer' : null}
          onClick={handlePrev}
        >
          <Img src={IconLeft.src} w={'1.5rem'} h={'1.5rem'} />
        </Center>
        <Box
          // w={'32rem'}
          w={`${data.length * 6.4}rem`}
          maxW={'32rem'}
          // w={'calc(100% - 1.5625rem)'}
          // h={'6.25rem'}
          display={'block'}
        >
          <CategorySwiper
            ref={swiperRef}
            data={data}
            onSlideChange={(isBeginning, isEnd) => {
              setNav([isBeginning, isEnd]);
            }}
          />
        </Box>
        <Center
          w={'1.5625rem'}
          cursor={handleIsEndActive() ? 'pointer' : null}
          onClick={handleNext}
        >
          <Img src={IconRight.src} w={'1.5rem'} h={'1.5rem'} />
        </Center>
      </HStack>
    </Box>
  );
};

export default CategorySwiperForm;
