'use client';

import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import {
  Box,
  Center,
  Image as ChakraImage,
  HStack,
  Img,
} from '@chakra-ui/react';
import IconEmpty from '@public/svgs/icon/empty-image.svg';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import useDevice from '@/hooks/useDevice';

const AutoImageSlider = (props) => {
  const { clampW } = useDevice();
  const { images } = props;

  const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    /*
    return (
      <div
        className={className}
        style={{ ...style, display: 'block', background: 'red' }}
        onClick={onClick}
      />
    );
    */
  };

  const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    /*
    return (
      <div
        className={className}
        style={{ ...style, display: 'block', background: 'green' }}
        onClick={onClick}
      />
    );
    */
  };

  const settings = {
    dots: false, // 하단 점 표시
    infinite: images.length > 1, // 무한 루프
    speed: 500, // 슬라이드 전환 속도
    slidesToShow: 1, // 한 번에 보여줄 슬라이드 수
    autoplay: true, // 자동 슬라이드
    autoplaySpeed: 3000, // 자동 슬라이드 속도 (3초)
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <Box
      className="slider-container"
      w={'100%'}
      h={'100%'}
      border={images.length === 0 && '1px solid #E8DFCA'}
    >
      <Slider {...settings}>
        {images.map((image, index) => {
          return (
            <ChakraImage
              key={index}
              aspectRatio={1}
              fallback={<DefaultSkeleton />}
              w={'100%'}
              h={'100%'}
              objectFit={'cover'}
              src={image?.imageS3Url || ''}
              alt={`Slide ${index + 1}`}
            />
          );
        })}
        {images.length === 0 && (
          <Box w={'100%'} h={'100%'}>
            <ChakraImage
              fallback={<DefaultSkeleton />}
              w={'100%'}
              h={'100%'}
              objectFit={'cover'}
              src={IconEmpty.src}
              alt={`Slide 0`}
            />
          </Box>
        )}
      </Slider>
    </Box>
  );
};

export default AutoImageSlider;
