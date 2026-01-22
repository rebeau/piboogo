'use client';

import { Tooltip } from '@chakra-ui/react';
import {
  copyToClipboard,
  isEmpty,
  isNotEmpty,
  removeNullValues,
} from './commonUtils';

/**
 * ## date 타입 > string 포멧
 * @param {date} date: 대상 Array
 * @param {String} split: 구분으로 표현 될 값 (, -)
 * @param {Boolean} isTime: 시간까지 나올지 여부
 * @param {String} timeSplit: 시간 구분으로 표현될 값 (:, .)
 */
export const parseDateToStr = (
  date,
  split = '-',
  isTime = false,
  timeSplit = ':',
  isShowSecond = false,
) => {
  let tempDate = date;
  if (tempDate === null || tempDate === undefined) return '날짜입력';
  if (typeof tempDate === 'string') {
    tempDate = new Date(tempDate);
  }
  const year = tempDate.getFullYear();
  const month = leftPad(tempDate.getMonth() + 1);
  const day = leftPad(tempDate.getDate());

  const hour = leftPad(tempDate.getHours());
  const minute = leftPad(tempDate.getMinutes());
  const second = leftPad(tempDate.getSeconds());

  const firstArr = [year, month, day];
  const secondArr = [hour, minute];
  if (isShowSecond) {
    secondArr.push(second);
  }
  if (isTime) {
    return `${firstArr.join(split)} ${secondArr.join(timeSplit)}`;
  }
  return [year, month, day].join(split);
};

export const parseDateToYMD = (date) => {
  let tempDate = date;
  if (tempDate === null || tempDate === undefined) return '날짜입력';
  if (typeof tempDate === 'string') {
    tempDate = new Date(tempDate);
  }
  const year = tempDate.getFullYear();
  const month = leftPad(tempDate.getMonth() + 1);
  const day = leftPad(tempDate.getDate());

  return [year, month, day].join('');
};

export const parseUrlToFile = async (url) => {
  try {
    // POST 요청으로 URL을 API에 전달
    const response = await fetch('/api/fetch-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url }), // URL을 요청 본문에 포함
    });

    if (response.ok) {
      /// 응답받은 이미지를 Blob으로 변환
      const imageBlob = await response.blob();

      // Blob을 File 객체로 변환 (파일 이름과 파일 유형을 설정)
      const imageFile = new File([imageBlob], 'image.png', {
        type: imageBlob.type, // MIME 타입을 설정 (예: 'image/png')
      });
      return imageFile;
    } else {
      console.error('Failed to fetch image');
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const parseDateByCountryCode = (
  dateString,
  countryCode,
  isTime = false,
  isSecond = false,
  separator = '.',
) => {
  if (!dateString) return;

  const date = new Date(dateString);

  // 미국식 형식
  if (countryCode === 'en') {
    const options = {
      month: 'numeric', // long
      day: 'numeric',
      year: 'numeric',
    };

    if (isTime) {
      if (isSecond) {
        Object.assign(options, {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false, // AM/PM 표기
        });
      } else {
        Object.assign(options, {
          hour: 'numeric',
          minute: 'numeric',
          hour12: false, // AM/PM 표기
        });
      }
    }

    // 월과 일이 한 자릿수일 경우 0을 추가
    // const formattedMonth = month.padStart(2, '0');

    let formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    formattedDate = formattedDate.replace(',', ' ');
    formattedDate = formattedDate.replace(/\//g, '. ');
    return formattedDate;
  }

  // 한국식 형식
  // CountryCode === 'ko'
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };

  if (isTime) {
    if (isSecond) {
      Object.assign(options, {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      });
    } else {
      Object.assign(options, {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      });
    }
  }
  let formattedDate = new Intl.DateTimeFormat('ko-KR', options).format(date);
  formattedDate.replace(',', ' ');
  formattedDate.replace(/\//g, '.');
  // formattedDate = formattedDate.replace(' ', ` ${separator} `);
  return formattedDate;
};

export const parseWeightValue = (weight) => {
  if (isEmpty(weight)) return '';
  return DELIVERY_WEIGHT_LIST[Number(weight) - 1];
};

export const parseDateToArr = (date, isTime = false, isShowSecond = false) => {
  let tempDate = date;
  if (isEmpty(tempDate)) return [[], []];
  if (typeof tempDate === 'string') {
    tempDate = new Date(tempDate);
  }
  const year = tempDate.getFullYear();
  const month = leftPad(tempDate.getMonth() + 1);
  const day = leftPad(tempDate.getDate());

  const hour = leftPad(tempDate.getHours());
  const minute = leftPad(tempDate.getMinutes());
  const second = leftPad(tempDate.getSeconds());

  const firstArr = [year, month, day];
  const secondArr = [hour, minute];
  if (isShowSecond) {
    secondArr.push(second);
  }
  if (isTime) {
    return [firstArr, secondArr.concat(second)];
  }
  return firstArr;
};

export const parseDateFromSimpleStr = (time) => {
  if (time === null) {
    return;
  }

  let year = null;
  let month = null;
  let day = null;
  let hour = null;
  let minute = null;
  if (dateStr.length === 6) {
    year = time.slice(0, 2);
    month = time.slice(2, 4);
    day = time.slice(4, 6);
    return new Date(`${year}-${month}-${day}T00:00:00`);
  } else if (dateStr.length === 8) {
    year = time.slice(0, 4);
    month = time.slice(4, 6);
    day = time.slice(6, 8);
    return new Date(`${year}-${month}-${day}T00:00:00`);
  }
  // year = time.slice(0, 4);
  // month = time.slice(4, 6);
  // day = time.slice(6, 8);
  // hour = time.slice(8, 10);
  // minute = time.slice(10, 12);
};

const leftPad = (value) => {
  if (value >= 10) {
    return value;
  }
  return `0${value}`;
};

export const parseTextLine = (value) => {
  let tempValue = value;
  if (isEmpty(tempValue)) return tempValue;
  if (tempValue.indexOf('<br />') > -1) {
    tempValue = tempValue.replaceAll('<br />', '\n');
  }
  if (tempValue.indexOf('<br>') > -1) {
    tempValue = tempValue.replaceAll('<br>', '\n');
  }
  return tempValue.split('\n');
};

export const parseLongText = (value, length) => {
  if (isEmpty(value)) {
    return value;
  }
  let tempValue = value;
  let tempLength = length;
  if (isEmpty(tempLength)) {
    tempLength = 10;
  }
  if (tempValue.length > tempLength) {
    tempValue = `${tempValue.substr(0, tempLength)}...`;
    return <Tooltip label={value}>{tempValue}</Tooltip>;
  }
  return tempValue;
};

export const parsePhoneNum = (value) => {
  if (isEmpty(value)) return;
  const cleaned = `${value}`.replace(/\D/g, '');
  if (value.length === 10) {
    // const match = cleaned.match(/^(\d{2})(\d{3,4})(\d{4})$/);
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return value;
  }
  if (value.length === 11) {
    const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return value;
  }
  return value;
};

export const parseRemoveHyphen = (value) => {
  if (isEmpty(value)) {
    return value;
  }
  let strV = String(value).trim();
  if (strV) {
    strV = strV.replace(/-/g, '');
  }
  return strV;
};

/**
 * ## 일반적인 체크 get
 * @param {String} checkValue: 1: true, 2: false
 * @param {Boolean} isReverse: 반환 값 반대로
 * @returns
 */
export const parseGetFlag = (checkValue, isReverse) => {
  if (isReverse) {
    if (Number(checkValue) === 1) return false;
    return true;
  }
  return basicGetFlag(checkValue);
};
const basicGetFlag = (checkValue) => {
  if (Number(checkValue) === 1) return true;
  return false;
};

/**
 * ## 일반적인 체크 set
 * @param {String} checkValue: 1: true, 2: false
 * @param {Function} targetSetFunc: 셋팅 할 callback
 * @returns
 */
export const parseSetFlag = (checkValue, targetSetFunc) => {
  if (targetSetFunc) {
    if (Number(checkValue) === 2) return targetSetFunc(1);
    return targetSetFunc(2);
  }
  return basicSetFlag(checkValue);
};
const basicSetFlag = (checkValue) => {
  if (Number(checkValue) === 2) return 1;
  return 2;
};

export const parseAmount = (amount) => {
  if (isEmpty(amount)) {
    // console.log('## parseAmount amount', amount);
    return 0;
  }
  return Math.round(Number(amount))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const parseDallar = (value) => {
  const number = parseFloat(value);
  if (isNaN(number)) return '';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(number);
};

export const parseCeil = (amount) => {
  if (isEmpty(amount)) {
    return 0;
  }
  return Math.ceil(Number(amount) / 100) * 100;
};

export const parseClipBoardForExcel = async (userType, datas) => {
  try {
    const text = datas
      .map((targetData) => {
        const data = removeNullValues(targetData);
        Object.keys(data).forEach((key) => {
          if (typeof data[key] === 'string') {
            data[key] = data[key].replace(/\r?\n/g, '');
          }
        });
        const row = [];
        row.push('data');
        return row.join('\t');
      })
      .join('\n');

    const result = await copyToClipboard(text);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const ENG_KEY = 'rRseEfaqQtTdwWczxvgkoiOjpuPhynbml';
const KOR_KEY =
  'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎㅏㅐㅑㅒㅓㅔㅕㅖㅗㅛㅜㅠㅡㅣ';
const CHO_DATA = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
const JUNG_DATA = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
const JONG_DATA = 'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ';

const doConvert = (isReverse = false) => {
  if (isReverse) {
    console.log(engTypeToKor(e.target.value));
  } else {
    console.log(korTypeToEng(e.target.value));
  }
};

const engTypeToKor = (src) => {
  let res = '';
  if (src.length == 0) return res;

  let nCho = -1,
    nJung = -1,
    nJong = -1; // 초성, 중성, 종성

  for (let i = 0; i < src.length; i++) {
    let ch = src.charAt(i);
    let p = ENG_KEY.indexOf(ch);
    if (p == -1) {
      // 영자판이 아님
      // 남아있는 한글이 있으면 처리
      if (nCho != -1) {
        if (nJung != -1)
          // 초성+중성+(종성)
          res += makeHangul(nCho, nJung, nJong);
        // 초성만
        else res += CHO_DATA.charAt(nCho);
      } else {
        if (nJung != -1)
          // 중성만
          res += JUNG_DATA.charAt(nJung);
        else if (nJong != -1)
          // 복자음
          res += JONG_DATA.charAt(nJong);
      }
      nCho = -1;
      nJung = -1;
      nJong = -1;
      res += ch;
    } else if (p < 19) {
      // 자음
      if (nJung != -1) {
        if (nCho == -1) {
          // 중성만 입력됨, 초성으로
          res += JUNG_DATA.charAt(nJung);
          nJung = -1;
          nCho = CHO_DATA.indexOf(KOR_KEY.charAt(p));
        } else {
          // 종성이다
          if (nJong == -1) {
            // 종성 입력 중
            nJong = JONG_DATA.indexOf(KOR_KEY.charAt(p));
            if (nJong == -1) {
              // 종성이 아니라 초성이다
              res += makeHangul(nCho, nJung, nJong);
              nCho = CHO_DATA.indexOf(KOR_KEY.charAt(p));
              nJung = -1;
            }
          } else if (nJong == 0 && p == 9) {
            // ㄳ
            nJong = 2;
          } else if (nJong == 3 && p == 12) {
            // ㄵ
            nJong = 4;
          } else if (nJong == 3 && p == 18) {
            // ㄶ
            nJong = 5;
          } else if (nJong == 7 && p == 0) {
            // ㄺ
            nJong = 8;
          } else if (nJong == 7 && p == 6) {
            // ㄻ
            nJong = 9;
          } else if (nJong == 7 && p == 7) {
            // ㄼ
            nJong = 10;
          } else if (nJong == 7 && p == 9) {
            // ㄽ
            nJong = 11;
          } else if (nJong == 7 && p == 16) {
            // ㄾ
            nJong = 12;
          } else if (nJong == 7 && p == 17) {
            // ㄿ
            nJong = 13;
          } else if (nJong == 7 && p == 18) {
            // ㅀ
            nJong = 14;
          } else if (nJong == 16 && p == 9) {
            // ㅄ
            nJong = 17;
          } else {
            // 종성 입력 끝, 초성으로
            res += makeHangul(nCho, nJung, nJong);
            nCho = CHO_DATA.indexOf(KOR_KEY.charAt(p));
            nJung = -1;
            nJong = -1;
          }
        }
      } else {
        // 초성 또는 (단/복)자음이다
        if (nCho == -1) {
          // 초성 입력 시작
          if (nJong != -1) {
            // 복자음 후 초성
            res += JONG_DATA.charAt(nJong);
            nJong = -1;
          }
          nCho = CHO_DATA.indexOf(KOR_KEY.charAt(p));
        } else if (nCho == 0 && p == 9) {
          // ㄳ
          nCho = -1;
          nJong = 2;
        } else if (nCho == 2 && p == 12) {
          // ㄵ
          nCho = -1;
          nJong = 4;
        } else if (nCho == 2 && p == 18) {
          // ㄶ
          nCho = -1;
          nJong = 5;
        } else if (nCho == 5 && p == 0) {
          // ㄺ
          nCho = -1;
          nJong = 8;
        } else if (nCho == 5 && p == 6) {
          // ㄻ
          nCho = -1;
          nJong = 9;
        } else if (nCho == 5 && p == 7) {
          // ㄼ
          nCho = -1;
          nJong = 10;
        } else if (nCho == 5 && p == 9) {
          // ㄽ
          nCho = -1;
          nJong = 11;
        } else if (nCho == 5 && p == 16) {
          // ㄾ
          nCho = -1;
          nJong = 12;
        } else if (nCho == 5 && p == 17) {
          // ㄿ
          nCho = -1;
          nJong = 13;
        } else if (nCho == 5 && p == 18) {
          // ㅀ
          nCho = -1;
          nJong = 14;
        } else if (nCho == 7 && p == 9) {
          // ㅄ
          nCho = -1;
          nJong = 17;
        } else {
          // 단자음을 연타
          res += CHO_DATA.charAt(nCho);
          nCho = CHO_DATA.indexOf(KOR_KEY.charAt(p));
        }
      }
    } else {
      // 모음
      if (nJong != -1) {
        // (앞글자 종성), 초성+중성
        // 복자음 다시 분해
        let newCho; // (임시용) 초성
        if (nJong == 2) {
          // ㄱ, ㅅ
          nJong = 0;
          newCho = 9;
        } else if (nJong == 4) {
          // ㄴ, ㅈ
          nJong = 3;
          newCho = 12;
        } else if (nJong == 5) {
          // ㄴ, ㅎ
          nJong = 3;
          newCho = 18;
        } else if (nJong == 8) {
          // ㄹ, ㄱ
          nJong = 7;
          newCho = 0;
        } else if (nJong == 9) {
          // ㄹ, ㅁ
          nJong = 7;
          newCho = 6;
        } else if (nJong == 10) {
          // ㄹ, ㅂ
          nJong = 7;
          newCho = 7;
        } else if (nJong == 11) {
          // ㄹ, ㅅ
          nJong = 7;
          newCho = 9;
        } else if (nJong == 12) {
          // ㄹ, ㅌ
          nJong = 7;
          newCho = 16;
        } else if (nJong == 13) {
          // ㄹ, ㅍ
          nJong = 7;
          newCho = 17;
        } else if (nJong == 14) {
          // ㄹ, ㅎ
          nJong = 7;
          newCho = 18;
        } else if (nJong == 17) {
          // ㅂ, ㅅ
          nJong = 16;
          newCho = 9;
        } else {
          // 복자음 아님
          newCho = CHO_DATA.indexOf(JONG_DATA.charAt(nJong));
          nJong = -1;
        }
        if (nCho != -1)
          // 앞글자가 초성+중성+(종성)
          res += makeHangul(nCho, nJung, nJong);
        // 복자음만 있음
        else res += JONG_DATA.charAt(nJong);

        nCho = newCho;
        nJung = -1;
        nJong = -1;
      }
      if (nJung == -1) {
        // 중성 입력 중
        nJung = JUNG_DATA.indexOf(KOR_KEY.charAt(p));
      } else if (nJung == 8 && p == 19) {
        // ㅘ
        nJung = 9;
      } else if (nJung == 8 && p == 20) {
        // ㅙ
        nJung = 10;
      } else if (nJung == 8 && p == 32) {
        // ㅚ
        nJung = 11;
      } else if (nJung == 13 && p == 23) {
        // ㅝ
        nJung = 14;
      } else if (nJung == 13 && p == 24) {
        // ㅞ
        nJung = 15;
      } else if (nJung == 13 && p == 32) {
        // ㅟ
        nJung = 16;
      } else if (nJung == 18 && p == 32) {
        // ㅢ
        nJung = 19;
      } else {
        // 조합 안되는 모음 입력
        if (nCho != -1) {
          // 초성+중성 후 중성
          res += makeHangul(nCho, nJung, nJong);
          nCho = -1;
        } // 중성 후 중성
        else res += JUNG_DATA.charAt(nJung);
        nJung = -1;
        res += KOR_KEY.charAt(p);
      }
    }
  }

  // 마지막 한글이 있으면 처리
  if (nCho != -1) {
    if (nJung != -1)
      // 초성+중성+(종성)
      res += makeHangul(nCho, nJung, nJong);
    // 초성만
    else res += CHO_DATA.charAt(nCho);
  } else {
    if (nJung != -1)
      // 중성만
      res += JUNG_DATA.charAt(nJung);
    else {
      // 복자음
      if (nJong != -1) res += JONG_DATA.charAt(nJong);
    }
  }

  return res;
};

const makeHangul = (nCho, nJung, nJong) => {
  return String.fromCharCode(0xac00 + nCho * 21 * 28 + nJung * 28 + nJong + 1);
};

const korTypeToEng = (src) => {
  let res = '';
  if (src.length == 0) return res;

  for (let i = 0; i < src.length; i++) {
    let ch = src.charAt(i);
    let nCode = ch.charCodeAt(0);
    let nCho = CHO_DATA.indexOf(ch),
      nJung = JUNG_DATA.indexOf(ch),
      nJong = JONG_DATA.indexOf(ch);
    let arrKeyIndex = [-1, -1, -1, -1, -1];

    if (0xac00 <= nCode && nCode <= 0xd7a3) {
      nCode -= 0xac00;
      arrKeyIndex[0] = Math.floor(nCode / (21 * 28)); // 초성
      arrKeyIndex[1] = Math.floor(nCode / 28) % 21; // 중성
      arrKeyIndex[3] = (nCode % 28) - 1; // 종성
    } else if (nCho != -1)
      // 초성 자음
      arrKeyIndex[0] = nCho;
    else if (nJung != -1)
      // 중성
      arrKeyIndex[1] = nJung;
    else if (nJong != -1)
      // 종성 자음
      arrKeyIndex[3] = nJong;
    // 한글이 아님
    else res += ch;

    // 실제 Key Index로 변경. 초성은 순서 동일
    if (arrKeyIndex[1] != -1) {
      if (arrKeyIndex[1] == 9) {
        // ㅘ
        arrKeyIndex[1] = 27;
        arrKeyIndex[2] = 19;
      } else if (arrKeyIndex[1] == 10) {
        // ㅙ
        arrKeyIndex[1] = 27;
        arrKeyIndex[2] = 20;
      } else if (arrKeyIndex[1] == 11) {
        // ㅚ
        arrKeyIndex[1] = 27;
        arrKeyIndex[2] = 32;
      } else if (arrKeyIndex[1] == 14) {
        // ㅝ
        arrKeyIndex[1] = 29;
        arrKeyIndex[2] = 23;
      } else if (arrKeyIndex[1] == 15) {
        // ㅞ
        arrKeyIndex[1] = 29;
        arrKeyIndex[2] = 24;
      } else if (arrKeyIndex[1] == 16) {
        // ㅟ
        arrKeyIndex[1] = 29;
        arrKeyIndex[2] = 32;
      } else if (arrKeyIndex[1] == 19) {
        // ㅢ
        arrKeyIndex[1] = 31;
        arrKeyIndex[2] = 32;
      } else {
        arrKeyIndex[1] = KOR_KEY.indexOf(JUNG_DATA.charAt(arrKeyIndex[1]));
        arrKeyIndex[2] = -1;
      }
    }
    if (arrKeyIndex[3] != -1) {
      if (arrKeyIndex[3] == 2) {
        // ㄳ
        arrKeyIndex[3] = 0;
        arrKeyIndex[4] = 9;
      } else if (arrKeyIndex[3] == 4) {
        // ㄵ
        arrKeyIndex[3] = 2;
        arrKeyIndex[4] = 12;
      } else if (arrKeyIndex[3] == 5) {
        // ㄶ
        arrKeyIndex[3] = 2;
        arrKeyIndex[4] = 18;
      } else if (arrKeyIndex[3] == 8) {
        // ㄺ
        arrKeyIndex[3] = 5;
        arrKeyIndex[4] = 0;
      } else if (arrKeyIndex[3] == 9) {
        // ㄻ
        arrKeyIndex[3] = 5;
        arrKeyIndex[4] = 6;
      } else if (arrKeyIndex[3] == 10) {
        // ㄼ
        arrKeyIndex[3] = 5;
        arrKeyIndex[4] = 7;
      } else if (arrKeyIndex[3] == 11) {
        // ㄽ
        arrKeyIndex[3] = 5;
        arrKeyIndex[4] = 9;
      } else if (arrKeyIndex[3] == 12) {
        // ㄾ
        arrKeyIndex[3] = 5;
        arrKeyIndex[4] = 16;
      } else if (arrKeyIndex[3] == 13) {
        // ㄿ
        arrKeyIndex[3] = 5;
        arrKeyIndex[4] = 17;
      } else if (arrKeyIndex[3] == 14) {
        // ㅀ
        arrKeyIndex[3] = 5;
        arrKeyIndex[4] = 18;
      } else if (arrKeyIndex[3] == 17) {
        // ㅄ
        arrKeyIndex[3] = 7;
        arrKeyIndex[4] = 9;
      } else {
        arrKeyIndex[3] = KOR_KEY.indexOf(JONG_DATA.charAt(arrKeyIndex[3]));
        arrKeyIndex[4] = -1;
      }
    }

    for (let j = 0; j < 5; j++) {
      if (arrKeyIndex[j] != -1) res += ENG_KEY.charAt(arrKeyIndex[j]);
    }
  }

  return res;
};

export const getH = (height) => {
  if (window) {
    // const tempH = window.innerHeight * (height / 100);
    const H = window.innerHeight; // 1340;
    const tempH = (height / H) * 100;
    const result = `${tempH.toFixed(2)}%`;
    return result;
  }
};
