import { atom } from 'recoil';

export const isLoadingState = atom({
  key: 'chatModal/isLoading',
  default: false,
});

export const hasMoreState = atom({
  key: 'chatModal/hasMore',
  default: true,
});

export const isOpenState = atom({
  key: 'chatModal/isOpen',
  default: false,
});

export const isMinimizedState = atom({
  key: 'chatModal/isMinimized',
  default: false,
});

export const isFullscreenState = atom({
  key: 'chatModal/isFullscreen',
  default: false,
});
