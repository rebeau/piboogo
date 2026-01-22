'use client';

import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import LoungeSwiper from './LoungeSwiper';
import { useCallback, useRef, useState } from 'react';
import useDevice from '@/hooks/useDevice';

const LoungeSwiperForm = (props) => {
  const { isMobile, clampW } = useDevice();
  const { title, data, onClick } = props;

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
      <VStack spacing={'2rem'}>
        <Box w={'100%'}>
          <HStack justifyContent={'space-between'} alignItems={'center'}>
            <Box>
              <Text
                color={'#485766'}
                fontSize={'1.5rem'}
                fontWeight={500}
                lineHeight={'2.475rem'}
              >
                {title}
              </Text>
            </Box>
            <Box>
              <HStack spacing={'0.62rem'}>
                <Box
                  cursor={handleIsBeginningActive() ? 'pointer' : null}
                  onClick={handlePrev}
                >
                  <ChevronLeftIcon
                    color={handleIsBeginningActive() ? '#7895B2' : '#D9E7EC'}
                    w={'1.5rem'}
                    h={'1.5rem'}
                  />
                </Box>
                <Box
                  cursor={handleIsEndActive() ? 'pointer' : null}
                  onClick={handleNext}
                >
                  <ChevronRightIcon
                    color={handleIsEndActive() ? '#7895B2' : '#D9E7EC'}
                    w={'1.5rem'}
                    h={'1.5rem'}
                  />
                </Box>
              </HStack>
            </Box>
          </HStack>
        </Box>
        <Box w={'100%'} display={'block'}>
          <LoungeSwiper
            ref={swiperRef}
            data={data}
            onSlideChange={(isBeginning, isEnd) => {
              setNav([isBeginning, isEnd]);
            }}
            onSlideClick={(item) => {
              onClick(item);
            }}
          />
        </Box>
      </VStack>
    </Box>
  ) : (
    <Box w={'100%'}>
      <VStack spacing={'2rem'}>
        <Box w={'100%'}>
          <HStack justifyContent={'space-between'} alignItems={'center'}>
            <Box>
              <Text
                color={'#485766'}
                fontSize={'1.5rem'}
                fontWeight={500}
                lineHeight={'2.475rem'}
              >
                {title}
              </Text>
            </Box>
            <Box>
              <HStack spacing={'0.62rem'}>
                <Box
                  cursor={handleIsBeginningActive() ? 'pointer' : null}
                  onClick={handlePrev}
                >
                  <ChevronLeftIcon
                    color={handleIsBeginningActive() ? '#7895B2' : '#D9E7EC'}
                    w={'1.5rem'}
                    h={'1.5rem'}
                  />
                </Box>
                <Box
                  cursor={handleIsEndActive() ? 'pointer' : null}
                  onClick={handleNext}
                >
                  <ChevronRightIcon
                    color={handleIsEndActive() ? '#7895B2' : '#D9E7EC'}
                    w={'1.5rem'}
                    h={'1.5rem'}
                  />
                </Box>
              </HStack>
            </Box>
          </HStack>
        </Box>
        <Box w={'100%'} display={'block'}>
          <LoungeSwiper
            ref={swiperRef}
            data={data}
            onSlideChange={(isBeginning, isEnd) => {
              setNav([isBeginning, isEnd]);
            }}
            onSlideClick={(item) => {
              onClick(item);
            }}
          />
        </Box>
      </VStack>
    </Box>
  );
};

export default LoungeSwiperForm;
