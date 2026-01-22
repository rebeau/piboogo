import { atom, atomFamily, selector, selectorFamily } from 'recoil';
import { persistAtom } from './recoil-config';

export const headerSearchState = atom({
  key: 'headerSearchState',
  default: '',
});

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

// 선택 라운지 게시글 상세
export const selectedLoungeState = atom({
  key: 'selectedLoungeState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});
