import { recoilPersist } from 'recoil-persist';
import { STROAGE_KEY } from '@/constants/common';

export const useSessionStorage = true;

const handleStorage = () => {
  if (useSessionStorage) {
    return typeof window !== 'undefined' ? window.sessionStorage : undefined;
  }
  return typeof window !== 'undefined' ? window.localStorage : undefined;
};

export const { persistAtom } = recoilPersist({
  key: STROAGE_KEY,
  storage: handleStorage(),
});
