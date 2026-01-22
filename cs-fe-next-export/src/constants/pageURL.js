const BASE = {
  MOBILE: '/mobile',
  //
  ADMIN: '/admin',
  ACCOUNT: '/account',
  SELLER: '/seller',
  SERVICE: '/service',
  MGNT: '/manage',
  //
  CATEGORY: '/category',
  BRAND: '/brand',
  PRODUCT: '/product',
  MY_PAGE: '/my-page',
  ORDER: '/order',
  LOUNGE: '/lounge',
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
  ADMIN_SETTING: {
    ROOT: `${BASE.SERVICE}/admin-setting`,
  },
  //
  BANNERS: {
    ROOT: `${BASE.SERVICE}/banners`,
    DETAIL: `${BASE.SERVICE}/banners/detail`,
    ADD: `${BASE.SERVICE}/banners/add`,
    MODIFY: `${BASE.SERVICE}/banners/detail/modify`,
  },
  PROMOTIONS: {
    ROOT: `${BASE.SERVICE}/promotions`,
    DETAIL: `${BASE.SERVICE}/promotions/detail`,
    MODIFY: `${BASE.SERVICE}/promotions/detail/modify`,
  },
  SETTLEMENT: `${BASE.SERVICE}/settlement`,
  INQUIRIES: `${BASE.SERVICE}/inquiries`,
  REVIEWS: `${BASE.SERVICE}/reviews`,
  LOUNGE: {
    ROOT: `${BASE.SERVICE}/lounge`,
    DETAIL: `${BASE.SERVICE}/lounge/detail`,
  },
  MY_PAGE: {
    ROOT: `${BASE.SERVICE}/my-page`,
  },
};

export const MGNT = {
  ROOT: `${BASE.SERVICE}${BASE.MGNT}`,
  REVENUE: {
    ROOT: `${BASE.SERVICE}${BASE.MGNT}/revenue`,
    DETAIL: `${BASE.SERVICE}${BASE.MGNT}/revenue/detail`,
  },
  SELLER: {
    ROOT: `${BASE.SERVICE}${BASE.MGNT}/seller`,
    DETAIL: `${BASE.SERVICE}${BASE.MGNT}/seller/detail`,
    PRODCUT: `${BASE.SERVICE}${BASE.MGNT}/seller/detail/product`,
  },
  BEST_SELLER: {
    ROOT: `${BASE.SERVICE}${BASE.MGNT}/best-seller`,
  },
  BUYER: {
    ROOT: `${BASE.SERVICE}${BASE.MGNT}/buyer`,
    DETAIL: `${BASE.SERVICE}${BASE.MGNT}/buyer/detail`,
  },
  SETTLEMENT: {
    ROOT: `${BASE.SERVICE}${BASE.MGNT}/settlement`,
  },
  BANNER: {
    ROOT: `${BASE.SERVICE}${BASE.MGNT}/banner`,
    DETAIL: `${BASE.SERVICE}${BASE.MGNT}/banner/detail`,
    ADD: `${BASE.SERVICE}${BASE.MGNT}/banner/add`,
    MODIFY: `${BASE.SERVICE}${BASE.MGNT}/banner/detail/modify`,
  },
  PRODUCT: {
    ROOT: `${BASE.SERVICE}${BASE.MGNT}/product`,
    DETAIL: `${BASE.SERVICE}${BASE.MGNT}/product/detail`,
    MODIFY: `${BASE.SERVICE}${BASE.MGNT}/product/detail/modify`,
  },
  CATEGORY: {
    ROOT: `${BASE.SERVICE}${BASE.MGNT}/category`,
  },
  PROMOTION: {
    ROOT: `${BASE.SERVICE}${BASE.MGNT}/promotion`,
    DETAIL: `${BASE.SERVICE}${BASE.MGNT}/promotion/detail`,
  },
  COUPON: {
    ROOT: `${BASE.SERVICE}${BASE.MGNT}/coupon`,
    DETAIL: `${BASE.SERVICE}${BASE.MGNT}/coupon/detail`,
  },
  CREDIT: {
    ROOT: `${BASE.SERVICE}${BASE.MGNT}/credit`,
    DETAIL: `${BASE.SERVICE}${BASE.MGNT}/credit/detail`,
  },
  LOUNGE: {
    ROOT: `${BASE.SERVICE}${BASE.MGNT}/lounge`,
    DETAIL: `${BASE.SERVICE}${BASE.MGNT}/lounge/detail`,
  },
  HELP: {
    ROOT: `${BASE.SERVICE}${BASE.MGNT}/help`,
    DETAIL: `${BASE.SERVICE}${BASE.MGNT}/help/detail`,
  },
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

export const MY_PAGE = {
  ROOT: `${BASE.MY_PAGE}`,
  INFO: `${BASE.MY_PAGE}/information`,
  INFO_EDIT: `${BASE.MY_PAGE}/information/edit`,
  ORDER_HISTORY: `${BASE.MY_PAGE}/order-history`,
  COUPON: `${BASE.MY_PAGE}/coupon`,
  REVIEWS_INQUIRIES: `${BASE.MY_PAGE}/reviews-inquiries`,
  HELP: `${BASE.MY_PAGE}/help`,
  terms: `${BASE.MY_PAGE}/terms`,
  personal: `${BASE.MY_PAGE}/personal`,
};

export const ADMIN = {
  ROOT: '/',
  login: '/login',
};
