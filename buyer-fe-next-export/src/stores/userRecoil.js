import { atom } from 'recoil';
import { persistAtom } from './recoil-config';

export const userInfoState = atom({
  key: 'userInfoState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});
