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
export const selectedLoungeState = atom({
  key: 'selectedLoungeState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

// 선택 상품 게시글 상세
export const selectedProductState = atom({
  key: 'selectedProductState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

// 선택 배너 정보 상세
export const selectedBannerState = atom({
  key: 'selectedBannerState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

// 선택 배너 정보 상세
export const selectedPromotionState = atom({
  key: 'selectedPromotionState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});
