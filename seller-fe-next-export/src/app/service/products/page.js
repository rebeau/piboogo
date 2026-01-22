'use client';

import useDevice from '@/hooks/useDevice';
import MobileProductPage from '@/components/custom/product/MobileProduct';
import WebProductPage from '@/components/custom/product/WebProduct';

const ProductsPage = () => {
  const { isMobile } = useDevice();
  return isMobile(true) ? <MobileProductPage /> : <WebProductPage />;
};

export default ProductsPage;
