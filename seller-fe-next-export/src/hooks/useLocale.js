'use client';

import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { langState } from '@/stores/environmentRecoil';
import utils from '@/utils';
import { STROAGE_LANG } from '@/constants/common';
import axios from 'axios';
import { COUNTRY, COUNTRY_LIST, LANGUAGES } from '@/constants/lang';

const useLocale = () => {
  const [lang, setLang] = useRecoilState(langState);

  useEffect(() => {
    if (lang) {
      utils.setLang(lang);
    }
  }, [lang]);

  useEffect(() => {
    if (!lang) {
      const localLang = utils.getLocalItem(STROAGE_LANG);
      if (localLang) {
        setLang(localLang);
      } else {
        fetchLocation();
      }
    }
  }, []);

  const fetchLocation = async () => {
    const ret = await axios.get('/api/location');
    let retData = ret.data;
    if (retData.status === 'success') {
      if (COUNTRY.COUNTRY_INFO[retData.countryCode]) {
        retData.lang = COUNTRY.COUNTRY_INFO[retData.countryCode].LANG;
        retData.location = retData.countryCode;
      } else {
        retData.lang = COUNTRY.COUNTRY_INFO.US.LANG;
        retData.location = COUNTRY.COUNTRY_INFO.US.CODE;
      }
    } else {
      console.log('## 위치 정보가 정상적으로 확인되지 않습니다. ##');
      retData.lang = COUNTRY.COUNTRY_INFO.US.LANG;
      retData.location = COUNTRY.COUNTRY_INFO.US.CODE;
    }
    setLang(retData.lang);
    utils.setLang(retData.lang);
    /*
    {
      "ip": "58.78.162.1",
      "status": "success",
      "country": "South Korea",
      "countryCode": "KR",
      "region": "41",
      "regionName": "Gyeonggi-do",
      "city": "Suwon",
      "zip": "163",
      "lat": 37.2905,
      "lon": 126.9877,
      "timezone": "Asia/Seoul",
      "isp": "LG DACOM Corporation",
      "org": "LG POWERCOMM",
      "as": "AS3786 LG DACOM Corporation",
      "query": "58.78.162.1"
    }
    */
    return retData;
  };

  const getCountryCodeByLang = (lang) => {
    for (const countryCode in COUNTRY_LIST) {
      if (COUNTRY_LIST[countryCode].LANG === lang) {
        return COUNTRY_LIST[countryCode].CODE;
      }
    }
    return null;
  };

  const getCountryCodeByCountry = (countryCode) => {
    for (const countryCode in COUNTRY_LIST) {
      if (COUNTRY_LIST[countryCode].CODE === countryCode) {
        return COUNTRY_LIST[countryCode];
      }
    }
    return null;
  };

  const getLangByCountryCode = (countryCode) => {
    for (const countryCode in COUNTRY_LIST) {
      if (COUNTRY_LIST[countryCode].LANG === lang) {
        return COUNTRY_LIST[countryCode].LANG;
      }
    }
    return null;
  };

  const localeText = useCallback(
    (target, ...replace) => {
      if (target) {
        // const tempLang = lang ? lang.toUpperCase() : 'EN';
        let tempLang = COUNTRY.COUNTRY_INFO.US.LANG;
        if (lang) {
          tempLang = lang.toUpperCase();
          if (utils.isEmpty(tempLang)) {
            tempLang = COUNTRY.COUNTRY_INFO.US.LANG;
          }
        }
        if (target[tempLang]) {
          if (replace.length > 0) {
            let temp = target[tempLang];
            replace.map((replaceItem) => {
              temp = temp.replace(replaceItem.key, replaceItem.value);
            });
            return temp;
          } else {
            return target[tempLang];
          }
        } else {
          console.log(
            `# useLocale > undefined lang: ${lang} , target: ${JSON.stringify(target)}`,
          );
          // fetchLocation();
        }
      }
    },
    [lang],
  );

  const localeCategoryText = useCallback(
    (categoryName) => {
      if (categoryName) {
        const CATEGORY = LANGUAGES.CATEGORY;
        for (const key in CATEGORY) {
          if (CATEGORY[key].EN === categoryName) {
            return CATEGORY[key][lang.toUpperCase()];
          }
        }
      } else {
        console.log('# useLocale > Key is required');
        return;
      }
    },
    [lang],
  );

  return {
    lang,
    setLang,
    fetchLocation,
    localeText,
    localeCategoryText,
  };
};

export default useLocale;
