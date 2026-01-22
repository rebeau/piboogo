import { atom } from 'recoil';
import { persistAtom } from './recoil-config';

export const currentMenuState = atom({
  key: 'currentMenuState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const headerMenuState = atom({
  key: 'headerMenuState',
  default: 'PROMOTION',
});

export const brandMenuState = atom({
  key: 'brandMenuState',
  default: 'SKIN_CARE',
});

export const cartTabIndexState = atom({
  key: 'cartTabIndexState',
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const listAllCategoryState = atom({
  key: 'listAllCategoryState',
  default: [],
  effects_UNSTABLE: [persistAtom],
});
export const listFirstCategoryState = atom({
  key: 'listFirstCategoryState',
  default: [],
  // effects_UNSTABLE: [persistAtom],
});
export const listSecondCategoryState = atom({
  key: 'listSecondCategoryState',
  default: [],
  // effects_UNSTABLE: [persistAtom],
});
export const listThirdCategoryState = atom({
  key: 'listThirdCategoryState',
  default: [],
  // effects_UNSTABLE: [persistAtom],
});

export const selectedFirstCategoryState = atom({
  key: 'selectedFirstCategoryState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});
export const selectedSecondCategoryState = atom({
  key: 'selectedSecondCategoryState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});
export const selectedThirdCategoryState = atom({
  key: 'selectedThirdCategoryState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});
