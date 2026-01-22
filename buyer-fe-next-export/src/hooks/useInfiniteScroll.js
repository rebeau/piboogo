import { useCallback, useEffect, useRef } from 'react';
import throttle from 'lodash/throttle';

const useInfiniteScroll = ({
  isActive = true,
  isMobileChecker = () => true,
  threshold = 200,
  onLoadMore = () => {},
  isLast = false,
  loading = false,
}) => {
  const lastScrollTop = useRef(0);
  const isCurrentMobile = useRef(isMobileChecker());

  const handleScroll = useCallback(
    throttle(() => {
      if (!isActive) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const isDownScroll = scrollY > lastScrollTop.current;
      lastScrollTop.current = scrollY;

      if (!isDownScroll) return;

      if (scrollY + windowHeight >= documentHeight - threshold) {
        if (!loading && !isLast) {
          onLoadMore();
        }
      }
    }, 300),
    [loading, isLast, isActive, onLoadMore, threshold],
  );

  const attachListener = useCallback(() => {
    console.log('scroll listener attached');
    window.addEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const detachListener = useCallback(() => {
    window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const checkDeviceOrActiveChange = useCallback(() => {
    const nowMobile = isMobileChecker();

    if (nowMobile !== isCurrentMobile.current || !isActive) {
      detachListener();
    }

    if (nowMobile && isActive) {
      attachListener();
    }

    isCurrentMobile.current = nowMobile;
  }, [isMobileChecker, isActive, attachListener, detachListener]);

  useEffect(() => {
    checkDeviceOrActiveChange();

    window.addEventListener('resize', checkDeviceOrActiveChange);
    return () => {
      detachListener();
      window.removeEventListener('resize', checkDeviceOrActiveChange);
    };
  }, [checkDeviceOrActiveChange, detachListener]);

  useEffect(() => {
    checkDeviceOrActiveChange();
  }, [isActive, checkDeviceOrActiveChange]);
};

export default useInfiniteScroll;
