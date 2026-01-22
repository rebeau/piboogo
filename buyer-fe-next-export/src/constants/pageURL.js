const BASE = {
  MOBILE: '/mobile',
  //
  ADMIN: '/admin',
  POLICY: '/policy',
  CATEGORY: '/category',
  BRAND: '/brand',
  PRODUCT: '/product',
  ACCOUNT: '/account',
  MY_PAGE: '/mypage',
  MY_CART: '/mycart',
  ORDER: '/order',
  LOUNGE: '/lounge',
  SERVICE: '/service',
  CHAT: '/chat',
};

export const MOBILE = {
  mobileHome: `${BASE.MOBILE}/home`,
  mobileLogin: `${BASE.MOBILE}/login`,
  mobileMain: `${BASE.MOBILE}/main`,
  mobileMainDetail: `${BASE.MOBILE}/main/detail`,
};

export const ACCOUNT = {
  ROOT: '/',
  FIND: `${BASE.ACCOUNT}/find`,
  LOGIN: `${BASE.ACCOUNT}/login`,
  SIGN_UP: `${BASE.ACCOUNT}/signup`,
};

export const SERVICE = {
  ROOT: BASE.SERVICE,
  CHAT: BASE.CHAT,
  SEARCH: {
    ROOT: `${BASE.SERVICE}/search`,
  },
  MAIN: {
    ROOT: `${BASE.SERVICE}/main`,
  },
  PROMOTION: {
    ROOT: `${BASE.SERVICE}/promotion`,
    DETAIL: `${BASE.SERVICE}/promotion`,
  },
  CATEGORY: {
    ROOT: `${BASE.SERVICE}${BASE.CATEGORY}`,
    DEFAULT: `${BASE.SERVICE}${BASE.CATEGORY}/01`,
    DETAIL: `${BASE.SERVICE}${BASE.CATEGORY}/detail`,
  },
  BRAND: {
    ROOT: `${BASE.SERVICE}${BASE.BRAND}`,
    // DETAIL: `${BASE.SERVICE}${BASE.BRAND}/detail`,
    PRODUCT: `${BASE.SERVICE}${BASE.BRAND}/product`,
  },
  PRODUCT: {
    ROOT: `${BASE.SERVICE}${BASE.PRODUCT}`,
    DETAIL: `${BASE.SERVICE}${BASE.PRODUCT}/`,
  },
  ORDER: {
    ROOT: `${BASE.SERVICE}${BASE.ORDER}`,
    DETAIL: `${BASE.SERVICE}${BASE.ORDER}/`,
  },
};

export const POLICY = {
  ROOT: '/',
  PRIVACY: `${BASE.POLICY}/privacyPolicy`,
  TERMS: `${BASE.POLICY}/termsOfUse`,
  IP: `${BASE.POLICY}/ipPolicy`,
};

export const LOUNGE = {
  ROOT: '/',
  HOME: `${BASE.LOUNGE}/home`,
  JOB_POSTING: `${BASE.LOUNGE}/job-posting`,
  JOB_POSTING_DETAIL: `${BASE.LOUNGE}/job-posting/detail`,
  JOB_POSTING_WRITE: `${BASE.LOUNGE}/job-posting/write`,
  JOB_HUNTING: `${BASE.LOUNGE}/job-hunting`,
  JOB_HUNTING_DETAIL: `${BASE.LOUNGE}/job-hunting/detail`,
  JOB_HUNTING_WRITE: `${BASE.LOUNGE}/job-hunting/write`,
  MARKETPLACE: `${BASE.LOUNGE}/marketplace`,
  MARKETPLACE_DETAIL: `${BASE.LOUNGE}/marketplace/detail`,
  MARKETPLACE_WRITE: `${BASE.LOUNGE}/marketplace/write`,
  LEGAL_SERVICE: `${BASE.LOUNGE}/legal-service`,
  LEGAL_SERVICE_DETAIL: `${BASE.LOUNGE}/legal-service/detail`,
  LEGAL_SERVICE_WRITE: `${BASE.LOUNGE}/legal-service/write`,
  COMMUNITY: `${BASE.LOUNGE}/community`,
  COMMUNITY_DETAIL: `${BASE.LOUNGE}/community/detail`,
  COMMUNITY_WRITE: `${BASE.LOUNGE}/community/write`,
};

export const MY_PAGE = {
  ROOT: `${BASE.MY_PAGE}`,
  INFO: `${BASE.MY_PAGE}/information`,
  INFO_EDIT: `${BASE.MY_PAGE}/information/edit`,
  ORDER_HISTORY: `${BASE.MY_PAGE}/order-history`,
  COUPON: `${BASE.MY_PAGE}/coupon`,
  REVIEWS_INQUIRIES: `${BASE.MY_PAGE}/reviews-inquiries`,
  HELP: `${BASE.MY_PAGE}/help`,
  //
  terms: `${BASE.MY_PAGE}/terms`,
  personal: `${BASE.MY_PAGE}/personal`,
};

export const MY_CART = {
  // WISH_LIST: `${BASE.MY_CART}/wish-list`,
  WISH_LIST: `${BASE.MY_CART}`,
  CART: `${BASE.MY_CART}`,
};

export const ADMIN = {
  ROOT: '/',
  login: '/login',
};
