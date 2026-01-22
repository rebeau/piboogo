'use client';

export const getBusinessType = (type) => {
  // 1:Medical spa, 2:Esthetics, 3:Retailer, 4:Other
  if (type === 1) {
    return 'Medical spa';
  } else if (type === 2) {
    return 'Esthetics';
  } else if (type === 3) {
    return 'Retailer';
  } else {
    return 'Other';
  }
};
