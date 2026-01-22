'use client';

import useDevice from '@/hooks/useDevice';
import { Box } from '@chakra-ui/react';
import MainBannerSwiper from './MainBannerSwiper';

const MainBanner = (props) => {
  const { isMobile } = useDevice();
  const { listBanner } = props;
  return isMobile(true) ? (
    <Box w={'100%'}>
      <MainBannerSwiper listData={listBanner} />
    </Box>
  ) : (
    <Box w={'100%'} maxW={1920}>
      <MainBannerSwiper listData={listBanner} />
    </Box>
  );
};

export default MainBanner;
