'use client';

import { isClient } from './deviceUtils';

/**
 * ## 체크된 항목 확인 (전체 체크 여부)
 * @param {Array} targetDatas: 대상 Array
 * @param {String} targetKey: 대상의 key 값
 * @param {Array} checkedIds: 체크된 Ids Array
 * @param {Function} setCheckedAll: callBack
 */
export const checkedProcess = (
  targetDatas,
  targetKey,
  checkedIds,
  setCheckedAll,
) => {
  let tempCount = 0;
  if (targetDatas.length !== 0) {
    targetDatas.map((targetData) => {
      checkedIds.map((checkedId) => {
        if (targetData[targetKey] === checkedId) {
          ++tempCount;
        }
      });
    });
  }
  if (targetDatas.length !== 0 && targetDatas.length === tempCount) {
    setCheckedAll(true);
  } else {
    setCheckedAll(false);
  }
};

export const checkedItemsProcess = (
  targetDatas,
  targetKey,
  checkItems,
  setCheckedAll,
) => {
  let tempCount = 0;
  if (targetDatas.length !== 0) {
    targetDatas.map((targetData) => {
      checkItems.map((item) => {
        if (targetData[targetKey] === item[targetKey]) {
          ++tempCount;
        }
      });
    });
  }
  if (targetDatas.length !== 0 && targetDatas.length === tempCount) {
    setCheckedAll(true);
  } else {
    setCheckedAll(false);
  }
};

/**
 * 오브젝트 배열 내 중복 오브젝트 변경
 * @param {Array} targetArr: 변경 하는 Array
 * @param {Array} setTargetArr: 변경 하는 Array Set
 * @param {Object} changeTarget: 변경 Object
 * @param {String} key: 변경 key 값
 */
export const changeObjectArray = (
  targetArr,
  setTargetArr,
  changeTarget,
  key,
) => {
  const match = targetArr.filter((data) => {
    return data[key] === changeTarget[key];
  });
  if (isEmpty(match) && isNotEmpty(changeTarget)) {
    setTargetArr([...targetArr, changeTarget]);
  } else if (isNotEmpty(changeTarget)) {
    const unMatch = targetArr.filter((data) => {
      return data[key] !== changeTarget[key];
    });
    setTargetArr([...unMatch, changeTarget]);
  }
};

/**
 * ## 전체 체크 클릭 처리 (target id 값만 저장)
 * @param {Array} targetDatas: 대상 Array
 * @param {String} targetKey: 대상의 key 값
 * @param {Array} checkedIds: 체크된 Ids Array
 * @param {Function} setCheckedIds: callBack
 */
export const handleOnClickAllCheck = (
  targetDatas,
  targetKey,
  checkedIds,
  setCheckedIds,
) => {
  const targetIds = targetDatas.map((data) => {
    return data[targetKey];
  });

  const matchIds = targetIds.filter((targetId) => {
    return checkedIds.some((checkedId) => {
      return checkedId === targetId;
    });
  });

  if (targetIds.length !== matchIds.length) {
    Array.from(checkedIds).concat(targetIds);
    const tempCheckedIds = checkedIds.concat(
      targetIds.filter((targetId) => {
        return !checkedIds.includes(targetId);
      }),
    );
    setCheckedIds(tempCheckedIds);
  } else {
    const unMatchIds = checkedIds.filter((checkedId) => {
      return matchIds.every((matchId) => {
        return matchId !== checkedId;
      });
    });
    setCheckedIds(unMatchIds);
  }
};

export const handleOnClickAllCheckItem = (
  targetDatas,
  targetKey,
  checkedItems,
  setCheckedItems,
) => {
  const targetItems = targetDatas.map((data) => {
    return data;
  });

  const matchItems = targetItems.filter((item) => {
    return checkedItems.some((checkedItem) => {
      return checkedItem[targetKey] === item[targetKey];
    });
  });

  if (targetItems.length !== matchItems.length) {
    Array.from(checkedItems).concat(targetItems);
    const tempCheckedIds = checkedItems.concat(
      targetItems.filter((item) => {
        return !checkedItems.includes(item);
      }),
    );
    setCheckedItems(tempCheckedIds);
  } else {
    const unMatchItems = checkedItems.filter((checkedItem) => {
      return matchItems.every((matchItem) => {
        return matchItem !== checkedItem;
      });
    });
    setCheckedItems(unMatchItems);
  }
};

/**
 * ## 오브젝트 비교 및 추출
 * @param {Object} org: 비교 전 오브젝트
 * @param {Object} target: 비교 할 오브젝트
 * @returns: 비교 전 값 대상으로 비교 후 변경된 값만 추출
 */
export const diffObjects = (org, target) => {
  if (target === org) return {};
  if (
    typeof target !== 'object' ||
    target === null ||
    typeof org !== 'object' ||
    org === null
  )
    return target;
  const keys1 = Object.keys(target);
  const keys2 = Object.keys(org);
  const allKeys = Array.from(new Set([...keys1, ...keys2]));
  const diff = {};
  allKeys.forEach((key) => {
    if (!deepEqual(target[key], org[key])) {
      if (typeof target[key] === 'object' && typeof org[key] === 'object') {
        const nestedDiff = diffObjects(org[key], target[key]);
        if (Object.keys(nestedDiff).length > 0) {
          diff[key] = nestedDiff;
        }
      } else {
        diff[key] = target[key];
      }
    }
  });
  return diff;
};
const deepEqual = (obj1, obj2) => {
  const stringifiedObj1 = JSON.stringify(obj1);
  const stringifiedObj2 = JSON.stringify(obj2);
  return stringifiedObj1 === stringifiedObj2;
};

/**
 *
 * @param {Number} index
 * @param {Number} currentPage
 * @param {Number} totalCount
 * @param {Number} contentNum
 * @returns
 */
export const getPageContentNum = (
  index,
  currentPage,
  totalCount,
  contentNum,
) => {
  return totalCount - index - (currentPage - 1) * contentNum;
};

export const getNumberStr = (value) => {
  if (!isClient()) {
    return;
  }
  if (isEmpty(value)) return value;
  const tempValue = value.match(/\d+/g).map(Number);
  return tempValue.join().replace(/,/g, '');
};

export const handleClickEvent = (event, target, data) => {
  if (!isClient()) {
    return;
  }
  // e.stopPropagation();
  if (target === 'check') {
    console.log('check');
    return 1;
  }

  if (target === 'onClickIcon') {
    return onClickIcon(data);
  }
  if (target === 'onClickCalc') {
    return onClickCalc(data);
  }
  if (target === 'onClickSearch') {
    return onClickSearch(data);
  }
  if (target === 'onClickRow' && onClickRow !== undefined) {
    return onClickRow(data);
  }
};

/**
 * Object의 빈 값 제거
 * @param {*} obj: 빈값 제거 대상 OBJ
 * @returns
 */
export const removeNullValues = (obj) => {
  if (!isClient()) {
    return;
  }
  const tempObj = { ...obj };
  Object.keys(tempObj).forEach((key) => {
    if (isEmpty(tempObj[key]) || tempObj[key] === 0) {
      delete tempObj[key];
    } else if (typeof tempObj[key] === 'object') {
      removeNullValues(tempObj[key]);
      if (Object.keys(tempObj[key]).length === 0) {
        delete tempObj[key];
      }
    }
  });
  if (Object.keys(tempObj).length === 0) {
    return null;
  }
  return tempObj;
};

export const isNotEmpty = (value) => {
  if (!isClient()) {
    return;
  }
  if (value === null) return false;
  if (value === undefined) return false;
  if (typeof value === 'undefined') return false;
  if (typeof value === 'string' && value.replace(/\s+/g, '').length < 1)
    return false;
  if (Array.isArray(value) && value.length < 1) return false;
  // if (typeof value === 'object' && value.constructor.name === 'Object' && Object.keys(value).length < 1 && Object.getOwnPropertyNames(value) < 1) return false
  if (typeof value === 'object' && Object.keys(value).length < 1) {
    return false;
  }
  if (
    typeof value === 'object' &&
    value.constructor.name === 'String' &&
    Object.keys(value).length < 1
  )
    return false;
  return true;
};

export const isEmpty = (value) => {
  if (!isClient()) {
    return;
  }
  return !isNotEmpty(value);
};

export const copyObject = (obj) => {
  if (!isClient()) {
    return;
  }
  let copiedObj = null;
  if (obj.length > 1) {
    copiedObj = JSON.parse(JSON.stringify(obj));
  } else {
    copiedObj = {};
    Object.keys(obj).forEach((key) => {
      copiedObj[key] = typeof obj[key] === 'string' ? '' : 0;
    });
  }
  return copiedObj;
};

export const changeObject = (obj, key, value) => {
  if (!isClient()) {
    return;
  }
  const copiedObj = copyObject(obj);
  copiedObj[key] = value;
  return copiedObj;
};

export const copyToClipboard = async (text) => {
  if (!isClient()) {
    return;
  }
  const result = await clipboardCopy(text)
    .then(() => {
      return true;
    })
    .catch((error) => {
      // console.error('클립보드 복사 실패:', error);
      return false;
    });
  return result;
};

export const makeDaysOptionComp = () => {
  if (!isClient()) {
    return;
  }
  const numbers = Array.from({ length: 31 }, (_, index) => {
    return index + 1;
  });
  return (
    <>
      {numbers.map((number) => {
        return (
          <option key={number} value={String(number)}>
            {number}일
          </option>
        );
      })}
    </>
  );
};

export const downloadUrlFile = async (url, filename) => {
  if (!isClient()) {
    return;
  }
  const result = await fetch(url)
    .then((response) => {
      return response.blob();
    })
    .then((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = isEmpty(filename) ? 'temp' : filename;
      a.click();
      URL.revokeObjectURL(blobUrl);
      return true;
    })
    .catch((error) => {
      console.error('Error fetching the URL:', error);
      return false;
    });
  return result;
};

export const serverPost = async (url, body = {}) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());

  return res;
};

export const fetchIp = async () => {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  return data.ip;
};

export const uploadExcelToExportData = () => {};
