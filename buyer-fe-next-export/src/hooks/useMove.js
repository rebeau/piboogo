'use client';

import {
  LOUNGE_TYPE_COMMUNITY,
  LOUNGE_TYPE_JOB_HUNTING,
  LOUNGE_TYPE_JOB_POSTING,
  LOUNGE_TYPE_LEGAL_SERVICE,
  LOUNGE_TYPE_MARKETPLACE,
} from '@/constants/common';
import {
  ACCOUNT,
  LOUNGE,
  MY_CART,
  MY_PAGE,
  SERVICE,
} from '@/constants/pageURL';
import { orderSellerUserIdState } from '@/stores/orderRecoil';
import utils from '@/utils';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';

const useMove = () => {
  const router = useRouter();
  // 추가 주문 때 해당 판매자의 리스트를 보여줘야 함
  const [orderSellerUserId, setOrderSellerUserId] = useRecoilState(
    orderSellerUserIdState,
  );

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

  const moveTo = (url) => {
    replace(url);
  };

  const moveSearch = (keyword) => {
    push(`${SERVICE.SEARCH.ROOT}?k=${keyword}`);
  };

  const moveMain = (isReplace = false) => {
    if (isReplace) {
      replace(SERVICE.MAIN.ROOT);
    } else {
      push(SERVICE.MAIN.ROOT);
    }
  };

  const moveOrders = (isReplace = false) => {
    if (isReplace) {
      replace(SERVICE.ORDER.ROOT);
    } else {
      push(SERVICE.ORDER.ROOT);
    }
  };

  const moveBrand = (sellerUserId) => {
    push(`${SERVICE.BRAND.ROOT}/${sellerUserId}`);
  };

  const moveOrdersHistory = () => {
    replace(MY_PAGE.ORDER_HISTORY);
  };

  const moveCart = () => {
    replace(MY_CART.CART);
  };

  const moveMyPage = () => {
    replace(MY_PAGE.INFO);
  };

  const moveSignUp = (email) => {
    if (email) {
      utils.setSessionItem('email', email);
    }
    push(ACCOUNT.SIGN_UP);
  };

  const moveFind = (email) => {
    if (email) {
      utils.setSessionItem('email', email);
    }
    push(ACCOUNT.FIND);
  };

  const moveLogin = (isReplace = false, email) => {
    if (email) {
      utils.setSessionItem('email', email);
    }
    if (isReplace) {
      replace(ACCOUNT.LOGIN);
    } else {
      push(ACCOUNT.LOGIN);
    }
  };

  const moveBrandProduct = (sellerUserId) => {
    push(SERVICE.BRAND.PRODUCT);
  };

  const moveProduct = () => {
    push(SERVICE.PRODUCT.ROOT);
  };

  const moveProductDetail = (productId) => {
    push(`${SERVICE.PRODUCT.DETAIL}/${productId}`);
  };

  const moveLounge = () => {
    push(LOUNGE.HOME);
  };

  const moveLoungeDetail = (loungeType, loungeId) => {
    if (loungeType === LOUNGE_TYPE_JOB_POSTING) {
      push(`${LOUNGE.JOB_POSTING_DETAIL}/${loungeId}`);
    } else if (loungeType === LOUNGE_TYPE_JOB_HUNTING) {
      push(`${LOUNGE.JOB_HUNTING_DETAIL}/${loungeId}`);
    } else if (loungeType === LOUNGE_TYPE_MARKETPLACE) {
      push(`${LOUNGE.MARKETPLACE_DETAIL}/${loungeId}`);
    } else if (loungeType === LOUNGE_TYPE_LEGAL_SERVICE) {
      push(`${LOUNGE.LEGAL_SERVICE_DETAIL}/${loungeId}`);
    } else if (loungeType === LOUNGE_TYPE_COMMUNITY) {
      push(`${LOUNGE.COMMUNITY_DETAIL}/${loungeId}`);
    }
  };

  const backLounge = (loungeType) => {
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
  };

  return {
    moveBack,
    moveTo,
    moveSearch,
    moveMain,
    moveLogin,
    moveSignUp,
    moveFind,
    moveBrand,
    moveBrandProduct,
    moveProduct,
    moveProductDetail,
    moveLoungeDetail,
    moveOrders,
    backLounge,
    moveOrdersHistory,
    moveCart,
    moveMyPage,
    moveLounge,
  };
};

export default useMove;
