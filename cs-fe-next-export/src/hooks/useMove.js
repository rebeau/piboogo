'use client';

import {
  LOUNGE_TYPE_COMMUNITY,
  LOUNGE_TYPE_JOB_HUNTING,
  LOUNGE_TYPE_JOB_POSTING,
  LOUNGE_TYPE_LEGAL_SERVICE,
  LOUNGE_TYPE_MARKETPLACE,
} from '@/constants/common';
import { ACCOUNT, MGNT, MY_PAGE, SERVICE } from '@/constants/pageURL';
import utils from '@/utils';
import { useRouter } from 'next/navigation';

const useMove = () => {
  const router = useRouter();
  // 추가 주문 때 해당 판매자의 리스트를 보여줘야 함
  /*
  const [orderSellerUserId, setOrderSellerUserId] = useRecoilState(
    orderSellerUserIdState,
  );
  */

  // COMMON
  const push = (url) => {
    router.push(url);
  };
  const replace = (url) => {
    router.replace(url);
  };
  const back = () => {
    router.back();
  };

  const moveBack = (url) => {
    if (url) {
      replace(url);
    } else {
      back();
    }
  };

  const moveMain = (isReplace = false) => {
    if (isReplace) {
      replace(SERVICE.DASHBOARD.ROOT);
    } else {
      push(SERVICE.DASHBOARD.ROOT);
    }
  };

  const moveBrand = (sellerUserId) => {
    if (sellerUserId) {
      push(`${SERVICE.BRAND.ROOT}/${sellerUserId}`);
    }
  };

  const moveSellerDetail = (sellerUserId) => {
    if (sellerUserId) {
      push(`${MGNT.SELLER.DETAIL}/${sellerUserId}`);
    }
  };

  const moveOrdersHistory = () => {
    replace(MY_PAGE.ORDER_HISTORY);
  };

  const moveMyPage = () => {
    replace(MY_PAGE.INFO);
  };

  // ACCOUNT
  const moveLogin = (email) => {
    if (email) {
      utils.setSessionItem('email', email);
    }
    replace(ACCOUNT.LOGIN);
  };
  const moveSignUp = (email) => {
    if (email) {
      utils.setSessionItem('email', email);
    }
    push(ACCOUNT.SIGN_UP);
  };

  const moveBrandProduct = (sellerUserId) => {
    push(SERVICE.BRAND.PRODUCT);
  };

  // products
  const moveProductDetail = (productId) => {
    if (productId) {
      push(`${MGNT.PRODUCT.DETAIL}/${productId}`);
    }
  };
  const moveProductModify = () => {
    push(MGNT.PRODUCT.MODIFY);
  };
  const moveProducts = (isReplace = false) => {
    if (isReplace) {
      replace(MGNT.PRODUCT.ROOT);
    } else {
      replace(MGNT.PRODUCT.ROOT);
    }
  };
  //

  // sales
  const moveOrdersDetail = (ordersId) => {
    if (ordersId) {
      push(`${SERVICE.SALES.DETAIL}/${ordersId}`);
    }
  };
  const moveOrders = (isReplace = false) => {
    if (isReplace) {
      replace(SERVICE.SALES.ROOT);
    } else {
      replace(SERVICE.SALES.ROOT);
    }
  };

  // banner
  const moveBannerDetail = (bannerId) => {
    if (bannerId) {
      push(`${MGNT.BANNER.DETAIL}/${bannerId}`);
    }
  };

  const moveBanner = (isReplace = false) => {
    if (isReplace) {
      replace(MGNT.BANNER.ROOT);
    } else {
      push(MGNT.BANNER.ROOT);
    }
  };
  //

  // promotion
  const movePromotionDetail = (promotionId) => {
    if (promotionId) {
      push(`${MGNT.PROMOTION.DETAIL}/${promotionId}`);
    }
  };
  const movePromotionModify = () => {
    push(SERVICE.PROMOTIONS.MODIFY);
  };
  const movePromotionAdd = () => {
    push(SERVICE.PROMOTIONS.ADD);
  };
  const movePromotion = (isReplace = false) => {
    if (isReplace) {
      replace(SERVICE.PROMOTIONS.ROOT);
    } else {
      replace(SERVICE.PROMOTIONS.ROOT);
    }
  };

  const moveLoungeDetail = (loungeType, loungeId) => {
    if (loungeType === LOUNGE_TYPE_JOB_POSTING) {
      push(`${SERVICE.LOUNGE.JOB_POSTING}/detail/${loungeId}`);
    } else if (loungeType === LOUNGE_TYPE_JOB_HUNTING) {
      push(`${SERVICE.LOUNGE.JOB_HUNTING}/detail/${loungeId}`);
    } else if (loungeType === LOUNGE_TYPE_MARKETPLACE) {
      push(`${SERVICE.LOUNGE.MARKET}/detail/${loungeId}`);
    } else if (loungeType === LOUNGE_TYPE_LEGAL_SERVICE) {
      push(`${SERVICE.LOUNGE.LEGAL_SERVICE}/detail/${loungeId}`);
    } else if (loungeType === LOUNGE_TYPE_COMMUNITY) {
      push(`${SERVICE.LOUNGE.COMMUNITY}/detail/${loungeId}`);
    }
  };

  // buyer
  const moveBuyerDetail = (buyerUserId) => {
    if (buyerUserId) {
      push(`${MGNT.BUYER.DETAIL}/${buyerUserId}`);
    }
  };

  const backLounge = (loungeType) => {
    /*
    if (loungeType === LOUNGE_TYPE_JOB_POSTING) {
      replace(LOUNGE.JOB_POSTING);
    } else if (loungeType === LOUNGE_TYPE_JOB_HUNTING) {
      replace(LOUNGE.JOB_HUNTING);
    } else if (loungeType === LOUNGE_TYPE_MARKETPLACE) {
      replace(LOUNGE.MARKETPLACE);
    } else if (loungeType === LOUNGE_TYPE_LEGAL_SERVICE) {
      replace(LOUNGE.LEGAL_SERVICE);
    } else if (loungeType === LOUNGE_TYPE_COMMUNITY) {
      replace(LOUNGE.COMMUNITY);
    }
    */
  };

  return {
    moveBack,
    moveMain,
    moveLogin,
    moveSignUp,
    moveBrand,
    moveBrandProduct,
    //
    moveSellerDetail,
    //
    moveProducts,
    moveProductDetail,
    moveProductModify,
    //
    moveOrders,
    moveOrdersDetail,
    moveOrdersHistory,
    //
    moveBanner,
    moveBannerDetail,
    //
    movePromotion,
    movePromotionDetail,
    movePromotionModify,
    movePromotionAdd,
    //
    moveBuyerDetail,
    //
    backLounge,
    moveLoungeDetail,
    moveMyPage,
  };
};

export default useMove;
