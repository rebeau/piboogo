'use client';

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
