import { useRecoilCallback } from 'recoil';
import {
  isLoadingState,
  hasMoreState,
  isOpenState,
  isMinimizedState,
  isFullscreenState,
} from '../stores/chat/chat.store.js';

const useChatModal = () => {
  const setLoading = useRecoilCallback(
    ({ set }) =>
      (loading) => {
        set(isLoadingState, loading);
      },
    [],
  );

  const setHasMore = useRecoilCallback(
    ({ set }) =>
      (hasMore) => {
        set(hasMoreState, hasMore);
      },
    [],
  );

  const openChat = useRecoilCallback(
    ({ set }) =>
      () => {
        set(isOpenState, true);
        set(isMinimizedState, false);
        set(isFullscreenState, false);
      },
    [],
  );

  const closeChat = useRecoilCallback(
    ({ set }) =>
      () => {
        set(isOpenState, false);
        set(isMinimizedState, false);
        set(isFullscreenState, false);
      },
    [],
  );

  const toggleMinimize = useRecoilCallback(
    ({ set }) =>
      () => {
        set(isMinimizedState, (prev) => !prev);
      },
    [],
  );

  const toggleFullscreen = useRecoilCallback(
    ({ set }) =>
      () => {
        set(isFullscreenState, (prev) => !prev);
      },
    [],
  );

  return {
    setLoading,
    setHasMore,
    openChat,
    closeChat,
    toggleMinimize,
    toggleFullscreen,
  };
};

export default useChatModal;
