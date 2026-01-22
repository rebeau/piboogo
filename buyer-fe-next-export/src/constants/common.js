export const PROJECT_NAME = process.env.NEXT_PUBLIC_PROJECT_NAME;
// SNS 관련
export const SNS_TYPE_KAKAO = 1;
export const SNS_TYPE_NAVER = 2;
export const SNS_TYPE_GOOGLE = 3;
export const SNS_TYPE_APPLE = 4;

// lounge 타입
export const LOUNGE_TYPE_JOB_POSTING = 1;
export const LOUNGE_TYPE_JOB_HUNTING = 2;
export const LOUNGE_TYPE_MARKETPLACE = 3;
export const LOUNGE_TYPE_LEGAL_SERVICE = 4;
export const LOUNGE_TYPE_COMMUNITY = 5;

export const PAYMENT_METHOD_PAYPAL = 'PAYPAL';
export const PAYMENT_METHOD_AUTHORIZE = 'AUTHORIZE';

export const FORM_MIN_WIDTH_PX = '1048px';

// 중요 모달(입력 내용 있는) 오버레이 클릭시 종료 값
// null 또는 false: 닫기 버튼으로만 닫힘, true: 오버레이 클릭으로 닫기 가능
export const MODAL_CLOSE_ON_OVERLAY_CLICK = false;

// Storage Key
export const STROAGE_KEY = `${PROJECT_NAME}-persist`;
export const STROAGE_LANG = `${PROJECT_NAME}-lang`;
export const STROAGE_LOADING = `${PROJECT_NAME}-loading`;
export const STROAGE_FCM_TOKEN_ID = `${PROJECT_NAME}-fcm-token`;
export const STROAGE_TOKEN_ID = `${PROJECT_NAME}-token`;
export const STROAGE_REF_TOKEN_ID = `${PROJECT_NAME}-refresh-token`;
export const STROAGE_SNS_INFO = `${PROJECT_NAME}-sns-info`;
export const STROAGE_USER_INFO = `${PROJECT_NAME}-user`;
export const STROAGE_AUTO_LOGIN_KEY = `${PROJECT_NAME}-auto-login`;
export const STROAGE_INIT_POP_FLAG = `${PROJECT_NAME}-init-pop-flag`;
export const STROAGE_ADMIN_TOKEN_ID = `${PROJECT_NAME}-token`;
export const STROAGE_ADMIN_REF_TOKEN_ID = `${PROJECT_NAME}-admin-refresh-token`;
export const STROAGE_ADMIN_USER_INFO = `${PROJECT_NAME}-admin-user`;
export const STROAGE_ADMIN_AUTO_LOGIN_KEY = `${PROJECT_NAME}-admin-auto-login`;

// 보여지는 페이지 수
export const DEFAULT_PAGE_BLOCK = 5;

export const DEFAULT_CONTENT_NUM = 10;

export const LONG_CONTENT_NUM = 16;

export const NOTIFICATION_FLAG = 2;

// 은행 목록
export const BANK_LIST = [
  '기업은행',
  '국민은행',
  '우리은행',
  '신한은행',
  'KEB하나은행',
  '농협은행',
  '지역농축협',
  'SC은행',
  '한국씨티은행',
  '우체국',
  '경남은행',
  '광주은행',
  '대구은행',
  '도이치',
  '부산은행',
  '산림조합',
  '산업은행',
  '상호저축은행',
  '새마을금고',
  '수협',
  '신협',
  '전북은행',
  '제주은행',
  'BOA',
  'HSBC',
  'JP모간',
  '중국공상은행',
  '비엔피파리바은행',
  '중국선설은행',
  '카카오뱅크',
  '케이뱅크',
];
