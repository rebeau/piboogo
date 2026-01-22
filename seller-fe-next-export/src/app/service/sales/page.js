'use client';

import useDevice from '@/hooks/useDevice';
import MobileSalesPage from '@/components/custom/sales/MobileSales';
import WebSalesPage from '@/components/custom/sales/WebSales';

const SalesPage = () => {
  const { isMobile } = useDevice();
  return isMobile(true) ? <MobileSalesPage /> : <WebSalesPage />;
};

export default SalesPage;
