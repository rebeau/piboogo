import { atom } from 'recoil';

export const modalState = atom({
  key: 'modalState',
  default: {
    type: 'alert',
    isOpen: false,
    isClose: false,
    title: '',
    text: '',
    textOptions: [],
    onAgree: () => {},
    onAgreeText: '확인',
    onCancel: () => {},
    onCancelText: '취소',
    response: {},
    // custom
    status: 0,
    step: 0,
  },
});

export const modalOrderDetailState = atom({
  key: 'modalOrderDetailState',
  default: false,
});

export const modalOrderTrackState = atom({
  key: 'modalOrderTrackState',
  default: false,
});

export const modalOrderCancelState = atom({
  key: 'modalOrderCancelState',
  default: false,
});

export const modalOrderInquiriesState = atom({
  key: 'modalOrderInquiriesState',
  default: false,
});

export const modalOrderReturnState = atom({
  key: 'modalOrderReturnState',
  default: false,
});

export const modalOrderReviewsState = atom({
  key: 'modalOrderReviewsState',
  default: false,
});
