import { atom } from 'recoil';

export const isOpenGoogleAddrState = atom({
  key: 'isOpenGoogleAddrState',
  default: false,
});

export const selectedGoogleAddrState = atom({
  key: 'selectedGoogleAddrState',
  default: null,
});
