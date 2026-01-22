'use client';

import { isEmpty } from './commonUtils';
import { isClient } from './deviceUtils';

/**
 *
 * @param {*} email
 * @returns 결과 반환
 */
export const checkEmail = (email) => {
  if (!isClient()) {
    return;
  }
  if (!email) {
    return null;
  }
  if (!regexEmail(email)) {
    return false;
  }
  return true;
};
const regexEmail = (value) => {
  const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return regex.test(value);
};

export const checkPhoneNum = (value) => {
  if (!isClient()) {
    return;
  }
  if (isEmpty(value)) return;
  const cleaned = `${value}`.replace(/\D/g, '');
  // const regex1 = /^(\d{3,4})(\d{3,4})(\d{4})$/;
  // const regex1 = /^(\d{3})(\d{3,4})(\d{4})$/;
  const regex2 = /^(\d{2,3})(\d{3,4})(\d{4})$/;
  // const regex3 = /^(\d{4})(\d{4})$/;
  /*
  if (regex1.test(cleaned)) {
    return true;
  }
  */
  if (regex2.test(cleaned)) {
    return true;
  }
  /*
  if (regex3.test(cleaned)) {
    return true;
  }
  */
  return false;
};

export const checkPassword = (pw) => {
  // 영문, 숫자, 특수문자 포함하여 6자~20자
  const reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/;
  return reg.test(pw);
};
