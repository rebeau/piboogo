import { atom } from 'recoil';
import { persistAtom } from './recoil-config';

// 로딩
export const loadingState = atom({
  key: 'loadingState',
  default: false,
  // effects_UNSTABLE: [persistAtom],
});

export const customLoadingState = atom({
  key: 'customLoadingState',
  default: false,
  effects_UNSTABLE: [persistAtom],
});
export const loadingNoShadeState = atom({
  key: 'loadingNoShadeState',
  default: true,
});
