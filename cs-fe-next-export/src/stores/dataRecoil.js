import { atom } from 'recoil';
import { persistAtom } from './recoil-config';

// 리스트 체크 관련
export const allCheckedState = atom({
  key: 'allCheckedState',
  default: false,
});
export const checkedIdsState = atom({
  key: 'checkedIdsState',
  default: [],
});
export const checkedItemsState = atom({
  key: 'checkedItemsState',
  default: [],
});

// 자동로그인
export const tempAutoLoginState = atom({
  key: 'tempAutoLoginState',
  default: false,
});

export const initFlagState = atom({
  key: 'initFlagState',
  default: false,
});

// 선택 라운지 게시글 상세
export const selectdLoungeState = atom({
  key: 'selectdLoungeState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

// 선택 상품 게시글 상세
export const selectdProductState = atom({
  key: 'selectdProductState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

// 선택 배너 정보 상세
export const selectdBannerState = atom({
  key: 'selectdBannerState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

// 선택 배너 정보 상세
export const selectdPromotionState = atom({
  key: 'selectdPromotionState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});
