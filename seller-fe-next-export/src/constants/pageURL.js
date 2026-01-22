const BASE = {
  MOBILE: '/mobile',
  //
  ADMIN: '/admin',
  ACCOUNT: '/account',
  SELLER: '/seller',
  //
  CATEGORY: '/category',
  BRAND: '/brand',
  PRODUCT: '/product',
  MY_PAGE: '/my-page',
  ORDER: '/order',
  LOUNGE: '/lounge',
  SERVICE: '/service',
};

export const MOBILE = {
  mobileHome: `${BASE.MOBILE}/home`,
  mobileLogin: `${BASE.MOBILE}/login`,
  mobileMain: `${BASE.MOBILE}/main`,
  mobileMainDetail: `${BASE.MOBILE}/main/detail`,
};

export const MAIN = {
  ROOT: '/main',
  PROMOTION: '/promotion',
};

export const SERVICE = {
  DASHBOARD: {
    ROOT: `${BASE.SERVICE}/dashboard`,
  },
  PRODUCTS: {
    ROOT: `${BASE.SERVICE}/products`,
    DETAIL: `${BASE.SERVICE}/products/detail`,
    ADD: `${BASE.SERVICE}/products/add`,
    MODIFY: `${BASE.SERVICE}/products/modify`,
  },
  SALES: {
    ROOT: `${BASE.SERVICE}/sales`,
    DETAIL: `${BASE.SERVICE}/sales/detail`,
  },
  BANNERS: {
    ROOT: `${BASE.SERVICE}/banners`,
    DETAIL: `${BASE.SERVICE}/banners/detail`,
    ADD: `${BASE.SERVICE}/banners/add`,
    MODIFY: `${BASE.SERVICE}/banners/modify`,
  },
  PROMOTIONS: {
    ROOT: `${BASE.SERVICE}/promotions`,
    DETAIL: `${BASE.SERVICE}/promotions/detail`,
    ADD: `${BASE.SERVICE}/promotions/add`,
    MODIFY: `${BASE.SERVICE}/promotions/modify`,
  },
  SETTLEMENT: {
    ROOT: `${BASE.SERVICE}/settlement`,
  },
  INQUIRIES: {
    ROOT: `${BASE.SERVICE}/inquiries`,
  },
  REVIEWS: {
    ROOT: `${BASE.SERVICE}/reviews`,
  },
  LOUNGE: {
    ROOT: `${BASE.SERVICE}${BASE.LOUNGE}`,
    DETAIL: `${BASE.SERVICE}${BASE.LOUNGE}/detail`,
    HOME: `${BASE.SERVICE}${BASE.LOUNGE}/home`,
    JOB_POSTING: `${BASE.SERVICE}${BASE.LOUNGE}/job-posting`,
    JOB_HUNTING: `${BASE.SERVICE}${BASE.LOUNGE}/job-hunting`,
    MARKET: `${BASE.SERVICE}${BASE.LOUNGE}/marketplace`,
    LEGAL_SERVICE: `${BASE.SERVICE}${BASE.LOUNGE}/legal-service`,
    COMMUNITY: `${BASE.SERVICE}${BASE.LOUNGE}/community`,
  },
  MY_PAGE: {
    ROOT: `${BASE.SERVICE}${BASE.MY_PAGE}`,
  },
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

export const ACCOUNT = {
  ROOT: '/',
  FIND: `${BASE.ACCOUNT}/find`,
  LOGIN: `${BASE.ACCOUNT}/login`,
  SIGN_UP: `${BASE.ACCOUNT}/signup`,
  MY_PAGE: `${BASE.ACCOUNT}/my-page`,
};

export const CATEGORY = {
  ROOT: `${BASE.CATEGORY}`,
  DEFAULT: `${BASE.CATEGORY}/01`,
  DETAIL: `${BASE.CATEGORY}/detail`,
};

export const BRAND = {
  ROOT: `${BASE.BRAND}`,
  detail: `${BASE.BRAND}/detail`,
};

export const PRODUCT = {
  ROOT: `${BASE.PRODUCT}`,
  detail: `${BASE.PRODUCT}/detail`,
};

export const LOUNGE = {
  ROOT: '/',
  HOME: `${BASE.LOUNGE}/home`,
  JOBS: `${BASE.LOUNGE}/jobs`,
  JOBS_DETAIL: `${BASE.LOUNGE}/jobs/detail`,
  JOBS_WRITE: `${BASE.LOUNGE}/jobs/write`,
  JOBS_SEARCH: `${BASE.LOUNGE}/jobs/search`,
  SECOND_HAND: `${BASE.LOUNGE}/second-hand`,
  ROUTINE: `${BASE.LOUNGE}/routine`,
};

export const ADMIN = {
  ROOT: '/',
  login: '/login',
};
