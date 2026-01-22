import { atom } from 'recoil';
import { persistAtom } from './recoil-config';

// 추가 주문을 위한 flag
export const orderSellerUserIdState = atom({
  key: 'orderSellerUserIdState',
  default: 0,
  effects_UNSTABLE: [persistAtom],
});
export const isOrderAddFlagState = atom({
  key: 'isOrderAddFlagState',
  default: false,
  effects_UNSTABLE: [persistAtom],
});

// 처리 후 새조회를 위한 flag 값
export const initOrdersState = atom({
  key: 'initOrdersState',
  default: false,
});
// 선택 주문 리스트
export const selectedOrdersState = atom({
  key: 'selectedOrdersState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});
// 선택 주문 상세
export const selectedOrderState = atom({
  key: 'selectedOrderState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});
export const productOrderState = atom({
  key: 'productOrderState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});
export const orderProductState = atom({
  key: 'orderProductState',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const stripeOrdersIdState = atom({
  key: 'stripeOrdersIdState',
  default: null,
  effects_UNSTABLE: [persistAtom],
});
export const stripeBeforeOrdersDataState = atom({
  key: 'stripeBeforeOrdersDataState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});
