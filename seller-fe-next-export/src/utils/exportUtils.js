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

const countryExtraMap = {
  KR: { alpha3: 'KOR', callingCode: '+82' },
  US: { alpha3: 'USA', callingCode: '+1' },
  JP: { alpha3: 'JPN', callingCode: '+81' },
  CN: { alpha3: 'CHN', callingCode: '+86' },
  DE: { alpha3: 'DEU', callingCode: '+49' },
  FR: { alpha3: 'FRA', callingCode: '+33' },
  // 필요한 국가 계속 추가
};

export const extractDeliveryAddress = (data) => {
  const components = data.address_components;

  const get = (type) =>
    components.find((c) => c.types.includes(type))?.long_name || '';

  const getShort = (type) =>
    components.find((c) => c.types.includes(type))?.short_name || '';

  const getAll = (...types) => {
    for (const type of types) {
      const found = get(type);
      if (found) return found;
    }
    return '';
  };

  const countryName = get('country');
  const countryAlpha2Code = getShort('country');
  const isKorea = countryAlpha2Code === 'KR';

  const postalCode = get('postal_code');
  const stateOrProvince = get('administrative_area_level_1');
  const latitude = data.geometry?.location?.lat ?? null;
  const longitude = data.geometry?.location?.lng ?? null;

  const countryInfo = countryExtraMap[countryAlpha2Code] || {
    alpha3: '',
    callingCode: '',
  };

  const locality = get('locality');
  const adminLevel2 = get('administrative_area_level_2');
  const adminLevel3 = get('administrative_area_level_3');
  const sublocality1 = get('sublocality_level_1');
  const streetNumber = get('street_number');
  const route = getAll('route', 'sublocality_level_4', 'sublocality_level_3');
  const detail = getAll('subpremise', 'sublocality_level_2', 'premise');

  let city = isKorea
    ? adminLevel3 || adminLevel2 || locality || ''
    : locality || adminLevel3 || adminLevel2 || '';
  city = city.trim();

  /*
  const streetAddress = isKorea
    ? [route, sublocality1].filter(Boolean).join(', ')
    : [sublocality1, route].filter(Boolean).join(', ');
  */

  const streetAddress = isKorea
    ? [route, sublocality1].filter(Boolean).join(', ')
    : route || '';

  const detailAddress = isKorea ? streetNumber || detail || '' : '';

  /*
  const streetNumber = get('street_number'); // 745
  const route = get('route'); // S Oxford Ave
  const postalCode = get('postal_code'); // 90005
  const city = get('locality'); // Los Angeles
  const state = get('administrative_area_level_1'); // California
  const country = get('country'); // United States
  
  const pullAddress = `${streetNumber} ${route}, ${postalCode} ${city}, ${state}, ${country}`;
  */

  const pullAddress = isKorea
    ? streetNumber
      ? `${streetNumber} ${streetAddress}${detail ? `, ${detail}` : ''}`
      : streetAddress
    : `${streetNumber} ${route}`;

  const addrData = {
    pullAddress: pullAddress.trim(),
    postalCode,
    stateOrProvince: stateOrProvince !== '' ? stateOrProvince : city,
    city: city !== '' ? city : stateOrProvince,
    streetAddress,
    detailAddress,
    country: countryName,
    countryName,
    countryAlpha2Code,
    countryAlpha3Code: countryInfo.alpha3,
    countryCallingCode: countryInfo.callingCode,
    latitude,
    longitude,
  };

  return addrData;
};
