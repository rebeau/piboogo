import { atom } from 'recoil';
import { persistAtom } from './recoil-config';

// 언어
export const langState = atom({
  key: 'langState',
  default: 'EN',
  effects_UNSTABLE: [persistAtom],
});

// 디바이스 정보
export const deviceInfoState = atom({
  key: 'deviceInfoState',
  default: {
    h: 0,
    w: 0,
    isWide: false,
    isMobile: false,
    osType: 1,
  },
  effects_UNSTABLE: [persistAtom],
});
