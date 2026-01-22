'use client';

import { isEmpty } from './commonUtils';

/**
 * ## data 에서 String 형변환 후 number 값 추출
 * @param {String} value: data
 * @returns {Number}
 */
export const exportNum = (value, isJoin = false) => {
  if (isEmpty(value)) {
    return null;
  }
  const str = String(value);
  const numbers = str.match(/\d+/g);
  if (isJoin) {
    return numbers.join('');
  }
  return numbers;
};

export const exportRandomItem = (arr) => {
  if (arr.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};
