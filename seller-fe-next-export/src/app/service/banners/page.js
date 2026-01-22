'use client';

import MobileBannersPage from '@/components/custom/banner/MobileBanner';
import WebBannersPage from '@/components/custom/banner/WebBanner';
import useDevice from '@/hooks/useDevice';

const BannersPage = () => {
  const { isMobile } = useDevice();
  return isMobile(true) ? <MobileBannersPage /> : <WebBannersPage />;
};

export default BannersPage;
