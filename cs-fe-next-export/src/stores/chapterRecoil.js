import { atom } from 'recoil';
import { persistAtom } from './recoil-config';

/*
챕터 조회 시 stepId 사용
조회된 data에 detailId 있음
*/

// 챕터 index
export const chapterIndexState = atom({
  key: 'chapterIndexState',
  default: 1,
  effects_UNSTABLE: [persistAtom],
});
export const chapterBranchInfoState = atom({
  key: 'chapterBranchInfoState',
  default: {
    branchId: 0,
    branchText: '',
  },
  effects_UNSTABLE: [persistAtom],
});
// 챕터 조회 stepId
export const chapterStepIdState = atom({
  key: 'chapterStepIdState',
  default: 0,
  effects_UNSTABLE: [persistAtom],
});
// 챕터 조회 detailId
export const chapterDetailIdState = atom({
  key: 'chapterDetailIdState',
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

// 하단 버튼 시작여부 (지속)
export const chapterStartState = atom({
  key: 'chapterStartState',
  default: false,
});

// 현재 step 카운팅
export const chapterStepState = atom({
  key: 'chapterStepState',
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

// 현재 step 에서 체크해야 할 카운트, 정답 여부
export const chapterCheckArrState = atom({
  key: 'chapterCheckArrState',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

// 현재 출력되는 text
export const chapterTextState = atom({
  key: 'chapterTextState',
  default: '',
  // effects_UNSTABLE: [persistAtom],
});

// 현재 step 에서 사용되어지는 데이터 (사용X)
export const chapterDataState = atom({
  key: 'chapterDataState',
  default: [],
  // effects_UNSTABLE: [persistAtom],
});

// 현재 step 에서 가이드 해야하는 text 항목, 항목들
export const chapterQuestionState = atom({
  key: 'chapterQuestionState',
  default: null,
  effects_UNSTABLE: [persistAtom],
});

// topic 8단계에서 사용될 내용들
export const chapterTopicQuestionState = atom({
  key: 'chapterTopicQuestionState',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const chapterTimerState = atom({
  key: 'chapterTimerState',
  default: false,
});

export const chapterSecondsState = atom({
  key: 'chapterSecondsState',
  default: 0,
});

export const chapterTotalSecondsState = atom({
  key: 'chapterTotalSecondsState',
  default: 0,
  effects_UNSTABLE: [persistAtom],
});
