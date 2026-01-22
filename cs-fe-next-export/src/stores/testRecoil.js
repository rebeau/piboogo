import { atom } from 'recoil';
import { persistAtom } from './recoil-config';

export const testUserIdState = atom({
  key: 'testUserIdState',
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const testStartState = atom({
  key: 'testStartState',
  default: false,
});

export const testTypeState = atom({
  key: 'testTypeState',
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const testStepState = atom({
  key: 'testStepState',
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const testDataState = atom({
  key: 'testDataState',
  default: [],
  // effects_UNSTABLE: [persistAtom],
});

export const testResultObjectState = atom({
  key: 'testResultObjectState',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

//
export const testStepIdState = atom({
  key: 'testStepIdState',
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const currentStepState = atom({
  key: 'currentStepState',
  default: {
    isCorrect: null,
    answer: '',
    question: null,
    step: 0,
    detailId: 0,
    chapter: 1,
  },
  effects_UNSTABLE: [persistAtom],
});
