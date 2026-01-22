import { atom } from 'recoil';
import { persistAtom } from './recoil-config';

export const adminUserState = atom({
  key: 'adminUserState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const normalUserState = atom({
  key: 'normalUserState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const tempSnsInfoState = atom({
  key: 'tempSnsInfoState',
  default: {},
});

export const adminUserModalState = atom({
  key: 'adminUserModalState',
  default: {
    isOpen: false,
    type: 1, // 1: add, 2: modify, 3: delete
  },
});

export const adminTempUserState = atom({
  key: 'adminTempUserState',
  default: {
    testUserId: 0,
  },
});

export const adminActionState = atom({
  key: 'adminActionState',
  default: false,
});

export const adminSearchByState = atom({
  key: 'adminSearchByState',
  default: '',
});

export const adminSearchFlagState = atom({
  key: 'adminSearchFlagState',
  default: false,
});
