'use client';

import { useRecoilState } from 'recoil';
import { deviceInfoState } from '@/stores/environmentRecoil';
import utils from '@/utils';
import { isClient } from '@/utils/deviceUtils';
import { useEffect, useRef, useState } from 'react';

const baseRem = 16; // 1rem = 16px

const useDevice = () => {
  const [deviceInfo, setDeviceInfo] = useRecoilState(deviceInfoState);

  const bodyRef = useRef();
  const [bodyWidth, setBodyWidth] = useState(0);

  const handleGetBodyWidth = () => {
    if (bodyRef.current) {
      setTimeout(() => {
        console.log('bodyRef.current.offsetWidth', bodyRef.current.offsetWidth);
        setBodyWidth(bodyRef.current.offsetWidth);
      }, 20);
    }
  };

  useEffect(() => {
    if (bodyRef.current) {
      handleGetBodyWidth();
    }
  }, [bodyRef.current]);

  useEffect(() => {
    // 초기 로드 시에도 한번 너비를 가져오고
    handleGetBodyWidth();

    // 윈도우 크기 변경 시에도 너비를 업데이트
    window.addEventListener('resize', handleGetBodyWidth);

    // cleanup: 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleGetBodyWidth);
    };
  }, []);

  const isMobile = (isCustom = false, w) => {
    let isMobile = utils.isMobile();
    if (isCustom) {
      if (deviceInfo.w <= (w ? w : 1100)) {
        isMobile = true;
      } else {
        isMobile = false;
      }
    }
    return isMobile;
  };

  const clampW = (min, max, minWidth = 360, maxWidth = 1920) => {
    if (!isClient()) return;

    const isVw = false;
    /*
    비율 = (0.9375rem - 0.6875rem) / (1920px - 360px)
     = 0.25rem / 1560px
     = 0.000160256rem/px
    */
    /*
    1rem = (16px / 1920px) * 100vw
     = 0.00833 * 100vw
     = 0.8333vw
    
    0.8033rem * 0.8333vw/rem = 0.6694vw
    */

    // min과 max를 rem에서 px로 변환
    const minPx = min * baseRem;
    const maxPx = max * baseRem;

    // 화면 가로 너비 (window.innerWidth) 사용
    const w = window.innerWidth; // 현재 화면의 가로 너비

    if (isVw) {
      /* vw 방식 */
      // 중간값을 vw로 변환: 현재 화면 너비에 따라 동적으로 계산
      const midVW =
        ((w - minWidth) / (maxWidth - minWidth)) * (maxPx - minPx) + minPx;
      // 중간값을 vw 단위로 계산한 값을 비율로 변환
      const midVWPercentage = (midVW / maxWidth) * 100;
      return `clamp(${min}rem, ${midVWPercentage}vw, ${max}rem)`;
    }
    /* rem 방식 */
    // 중간값을 rem 단위로 계산: 화면 너비에 따라 동적으로 계산
    const midRem =
      ((w - minWidth) / (maxWidth - minWidth)) * (maxPx - minPx) + minPx;

    // 중간값을 rem 단위로 반환
    const midRemValue = midRem / baseRem;
    return `clamp(${min}rem, ${midRemValue}rem, ${max}rem)`;
  };

  const clampH = (min, max) => {
    if (!isClient()) return;

    // 화면 높이 (window.innerHeight) 사용
    const h = window.innerHeight; // 현재 화면의 높이

    // 중간값을 rem 단위로 계산: 화면 높이에 따라 동적으로 계산
    const midRem = (h / 100) * baseRem;

    // deviceFont에서 clamp 사용해서 반환
    return `clamp(${min}rem, ${midRem}rem, ${max}rem)`;
  };

  const clampHAvg = (min, max) => {
    if (!isClient()) return;

    // 최소값과 최대값의 중간값을 계산
    const midValue = (min + max) / 2;

    // deviceFont에서 clamp 사용해서 반환
    return `clamp(${min}rem, ${midValue}rem, ${max}rem)`;
  };

  return {
    bodyRef,
    bodyWidth,
    handleGetBodyWidth,
    deviceInfo,
    setDeviceInfo,
    isMobile,
    clampW,
    clampH,
    clampHAvg,
  };
};

export default useDevice;
