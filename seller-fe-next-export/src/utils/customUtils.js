'use client';

import { SYSTEM_LIST_PURCHASEMINIMUM } from '@/constants/common';

export const getAmountByIndex = (index) => {
  if (index >= 1 && index <= SYSTEM_LIST_PURCHASEMINIMUM.length) {
    const temp = SYSTEM_LIST_PURCHASEMINIMUM[index - 1].replace('$', '');
    // return Number(SYSTEM_LIST_PURCHASEMINIMUM[index - 1].replace('$', '')); // 1-based 인덱스를 사용
    return temp;
  }
  return 0; // 유효하지 않은 인덱스
};

// 숫자형 금액을 넣으면 해당 금액에 해당하는 인덱스를 반환
export const getIndexByAmount = (amount) => {
  // 숫자형 금액을 문자열로 변환하여 비교
  const amountString = `$${amount}`;
  const index = SYSTEM_LIST_PURCHASEMINIMUM.indexOf(amountString);
  return index !== -1 ? index + 1 : null; // 1-based 인덱스를 반환
};
