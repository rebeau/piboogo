'use clinet';

import { useCallback } from 'react';
import useLocale from './useLocale';
import { LANGUAGES } from '@/constants/lang';

const useStatus = () => {
  const { lang, localeText } = useLocale();

  const handleGetDeliveryStatus = useCallback((deliveryStatus) => {
    if (Number(deliveryStatus) === 1) {
      return localeText(LANGUAGES.STATUS.SHIPPING_PREPARATION);
    } else if (Number(deliveryStatus) === 2) {
      return localeText(LANGUAGES.STATUS.SHIPPING);
    } else if (Number(deliveryStatus) === 3) {
      return localeText(LANGUAGES.STATUS.ORDER_COMPLETED);
    } else if (Number(deliveryStatus) === 4) {
      return localeText(LANGUAGES.STATUS.REQUEST_ORDER_CANCELLATION);
    } else if (Number(deliveryStatus) === 5) {
      return localeText(LANGUAGES.STATUS.ORDER_CANCELLATION_COMPLETED);
    } else if (Number(deliveryStatus) === 6) {
      return localeText(LANGUAGES.STATUS.RETURN_REQUEST);
    } else if (Number(deliveryStatus) === 7) {
      return localeText(LANGUAGES.STATUS.RETURN_COMPLETED);
    } else if (Number(deliveryStatus) === 7) {
      return localeText(LANGUAGES.STATUS.SHIPPED);
    }
  });

  /*
   const handleGetDeliveryStatus = useCallback((deliveryStatus) => {
    // 1:국내배송중, 2:해외배송중, 3:배송완료
    if (Number(deliveryStatus) === 1) {
      return localeText(LANGUAGES.STATUS.DOMESTIC_SHIPPING);
    }
    if (Number(deliveryStatus) === 2) {
      return localeText(LANGUAGES.STATUS.OVERSEAS_SHIPPING);
    }
    if (Number(deliveryStatus) === 3) {
      return localeText(LANGUAGES.STATUS.DELIVERED);
    }
  });
  */

  const handleGetAnswerStatus = (status) => {
    if (Number(status) === 1) {
      return localeText(LANGUAGES.STATUS.WAITING);
    }
    if (Number(status) === 2) {
      return localeText(LANGUAGES.STATUS.DONE);
    }
  };

  const handleGetSellerPaymentStatus = useCallback((sellerPayStatus) => {
    if (Number(sellerPayStatus) === 1) {
      return localeText(LANGUAGES.SETTLEMENT.WAIT_FOR_SETTLEMENT);
    }
    if (Number(sellerPayStatus) === 2) {
      return localeText(LANGUAGES.SETTLEMENT.SETTLED);
    }
    if (Number(sellerPayStatus) === 3) {
      return localeText(LANGUAGES.SETTLEMENT.CANCEL_SETTLEMENT);
    }
  });

  const handleGetPaymentStatus = useCallback((payStatus) => {
    // 1:결제대기, 2:결제완료, 3:환불요청, 4:환불완료
    if (Number(payStatus) === 1) {
      return localeText(LANGUAGES.STATUS.UNPAID);
    }
    if (Number(payStatus) === 2) {
      return localeText(LANGUAGES.STATUS.PAID);
    }
    if (Number(payStatus) === 3) {
      return localeText(LANGUAGES.STATUS.REFUND_REQUESTED);
    }
    if (Number(payStatus) === 4) {
      return localeText(LANGUAGES.STATUS.REFUNDED);
    }
  });

  const handleGetSettlementStatus = useCallback((payStatus) => {
    // 1:결제대기, 2:결제완료, 3:환불요청, 4:환불완료
    if (Number(payStatus) === 1) {
      return localeText(LANGUAGES.SETTLEMENT.WAIT_FOR_SETTLEMENT);
    }
    if (Number(payStatus) === 2) {
      return localeText(LANGUAGES.STATUS.PAID);
    }
    if (Number(payStatus) === 3) {
      return localeText(LANGUAGES.STATUS.REFUND_REQUESTED);
    }
    if (Number(payStatus) === 4) {
      return localeText(LANGUAGES.STATUS.REFUNDED);
    }
  });

  const handleGetAuthStatus = useCallback((status) => {
    // 1:허가요청, 2:미허가, 3:허가, 4:기간만료
    if (Number(status) === 1) {
      return localeText(LANGUAGES.STATUS.AUTHORIZATION_REQUEST);
    }
    if (Number(status) === 2) {
      return localeText(LANGUAGES.STATUS.DENIED);
    }
    if (Number(status) === 3) {
      return localeText(LANGUAGES.STATUS.APPROVED);
    }
    if (Number(status) === 4) {
      return localeText(LANGUAGES.STATUS.EXPIRED);
    }
  });

  const handleGetBannerLinkTarget = useCallback((linkType) => {
    // 1:페이지 이동, 2:새창
    if (Number(linkType) === 1) {
      return localeText(LANGUAGES.BANNERS.NAVIGATE_TO_PAGE);
    }
    if (Number(linkType) === 2) {
      return localeText(LANGUAGES.BANNERS.FLOATING_NEW_WINDOW);
    }
  });

  const handleGetProductSalesStatus = (status) => {
    if (Number(status) === 1) {
      return localeText(LANGUAGES.PRODUCTS.ON_SALE);
    } else if (Number(status) === 2) {
      return localeText(LANGUAGES.PRODUCTS.STOP_SELLING);
    } else if (Number(status) === 3) {
      return localeText(LANGUAGES.PRODUCTS.OUT_OF_STOCK);
    }
  };

  const handleGetAccessStatus = (status) => {
    if (Number(status) === 2) {
      return localeText(LANGUAGES.COMMON.BRONZE);
    } else if (Number(status) === 3) {
      return localeText(LANGUAGES.COMMON.GOLD);
    } else if (Number(status) === 4) {
      return localeText(LANGUAGES.COMMON.PLATINUM);
    } else if (Number(status) === 5) {
      return `${localeText(LANGUAGES.COMMON.BRONZE)}&${localeText(LANGUAGES.COMMON.GOLD)}`;
    } else if (Number(status) === 6) {
      return `${localeText(LANGUAGES.COMMON.BRONZE)}&${localeText(LANGUAGES.COMMON.PLATINUM)}`;
    } else if (Number(status) === 7) {
      return `${localeText(LANGUAGES.COMMON.GOLD)}&${localeText(LANGUAGES.COMMON.PLATINUM)}`;
    }
  };

  return {
    handleGetDeliveryStatus,
    handleGetSellerPaymentStatus,
    handleGetPaymentStatus,
    handleGetAnswerStatus,
    handleGetAuthStatus,
    handleGetBannerLinkTarget,
    handleGetProductSalesStatus,
    handleGetAccessStatus,
  };
};

export default useStatus;
