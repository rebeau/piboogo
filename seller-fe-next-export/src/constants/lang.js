import { ERR_INFO } from './error';

// localeText({...})
const ERR_MSG = {
  ACC: {
    // id, email
    NOT_FOUND_EMAIL: {
      KO: ERR_INFO.ACC.NOT_FOUND_EMAIL.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_EMAIL.EN,
    },
    NOT_MATCH_EMAIL: {
      KO: ERR_INFO.ACC.NOT_MATCH_EMAIL.KR,
      EN: ERR_INFO.ACC.NOT_MATCH_EMAIL.EN,
    },
    CHECK_USER_INFO: {
      KO: ERR_INFO.ACC.CHECK_USER_INFO.KR,
      EN: ERR_INFO.ACC.CHECK_USER_INFO.EN,
    },

    // pw
    NOT_MATCH_PASSWORD: {
      KO: ERR_INFO.ACC.NOT_MATCH_PASSWORD.KR,
      EN: ERR_INFO.ACC.NOT_MATCH_PASSWORD.EN,
    },
    NOT_FOUND_PASSWORD: {
      KO: ERR_INFO.ACC.NOT_FOUND_PASSWORD.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_PASSWORD.EN,
    },
    NOT_MATCH_OLD_PASSWORD: {
      KO: ERR_INFO.ACC.NOT_MATCH_OLD_PASSWORD.KR,
      EN: ERR_INFO.ACC.NOT_MATCH_OLD_PASSWORD.EN,
    },
    NOT_FOUND_OLD_PASSWORD: {
      KO: ERR_INFO.ACC.NOT_FOUND_OLD_PASSWORD.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_OLD_PASSWORD.EN,
    },
    NOT_MATCH_NEW_PASSWORD: {
      KO: ERR_INFO.ACC.NOT_MATCH_NEW_PASSWORD.KR,
      EN: ERR_INFO.ACC.NOT_MATCH_NEW_PASSWORD.EN,
    },
    NOT_FOUND_NEW_PASSWORD: {
      KO: ERR_INFO.ACC.NOT_FOUND_NEW_PASSWORD.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_NEW_PASSWORD.EN,
    },
    NOT_MATCH_NEW_PASSWORD_CHECK: {
      KO: ERR_INFO.ACC.NOT_MATCH_NEW_PASSWORD_CHECK.KR,
      EN: ERR_INFO.ACC.NOT_MATCH_NEW_PASSWORD_CHECK.EN,
    },

    // name
    NOT_FOUND_NAME: {
      KO: ERR_INFO.ACC.NOT_FOUND_NAME.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_NAME.EN,
    },

    // phone
    NOT_FOUND_PHONE: {
      KO: ERR_INFO.ACC.NOT_FOUND_PHONE.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_PHONE.EN,
    },
    NOT_MATCH_PHONE: {
      KO: ERR_INFO.ACC.NOT_MATCH_PHONE.KR,
      EN: ERR_INFO.ACC.NOT_MATCH_PHONE.EN,
    },

    // business
    NOT_SELECT_BUSINESS_TYPE: {
      KO: ERR_INFO.ACC.NOT_SELECT_BUSINESS_TYPE.KR,
      EN: ERR_INFO.ACC.NOT_SELECT_BUSINESS_TYPE.EN,
    },
    NOT_FOUND_BUSINESS_NUMBER: {
      KO: ERR_INFO.ACC.NOT_FOUND_BUSINESS_NUMBER.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_BUSINESS_NUMBER.EN,
    },

    // verification
    NOT_FOUND_VERIFICATION_CODE: {
      KO: ERR_INFO.ACC.NOT_FOUND_VERIFICATION_CODE.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_VERIFICATION_CODE.EN,
    },

    // address
    NOT_FOUND_ZIP_CODE: {
      KO: ERR_INFO.ACC.NOT_FOUND_ZIP_CODE.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_ZIP_CODE.EN,
    },
    NOT_FOUND_STATE: {
      KO: ERR_INFO.ACC.NOT_FOUND_STATE.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_STATE.EN,
    },
    NOT_FOUND_CITY: {
      KO: ERR_INFO.ACC.NOT_FOUND_CITY.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_CITY.EN,
    },
    NOT_FOUND_ADDRESS: {
      KO: ERR_INFO.ACC.NOT_FOUND_ADDRESS.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_ADDRESS.EN,
    },
  },
  SERVICE: {
    NOT_SELECTED: {
      KO: ERR_INFO.SERVICE.NOT_SELECTED.KR,
      EN: ERR_INFO.SERVICE.NOT_SELECTED.EN,
    },
    NOT_SERVICE: {
      KO: ERR_INFO.SERVICE.NOT_SERVICE.KR,
      EN: ERR_INFO.SERVICE.NOT_SERVICE.EN,
    },
    NOT_SERVICE_PAYMENT: {
      KO: ERR_INFO.SERVICE.NOT_SERVICE_PAYMENT.KR,
      EN: ERR_INFO.SERVICE.NOT_SERVICE_PAYMENT.EN,
    },
    NOT_FOUND_BANNER_NAME: {
      KO: '배너 이름을 입력해 주세요',
      EN: 'Please enter the banner name',
    },
  },
};

const CATEGORY = {
  SKINCARE: {
    KO: '스킨케어',
    EN: 'Skincare',
  },
  EQUIPMENT: {
    KO: '장비',
    EN: 'Equipment',
  },
  SUPPLIES: {
    KO: '저장품',
    EN: 'Supplies',
  },
  EDUCATION: {
    KO: '교육',
    EN: 'Education',
  },
  FACE: {
    KO: 'Face',
    EN: 'Face',
  },
  BODY: {
    KO: 'Body',
    EN: 'Body',
  },
  HAIR: {
    KO: 'Hair',
    EN: 'Hair',
  },
  FACIAL_N_BODY: {
    KO: 'Facial & Body',
    EN: 'Facial & Body',
  },
  ETC: {
    KO: 'ETC',
    EN: 'ETC',
  },
  TOOL: {
    KO: 'Tool',
    EN: 'Tool',
  },
  FURNITURE: {
    KO: 'Furniture',
    EN: 'Furniture',
  },
  CERTIFICATION: {
    KO: 'Certification',
    EN: 'Certification',
  },
  SEMINAR: {
    KO: 'Seminar',
    EN: 'Seminar',
  },
  CLEANSER: {
    KO: 'Cleanser',
    EN: 'Cleanser',
  },
  BODY_CLEANSER: {
    KO: 'Body Cleanser',
    EN: 'Body Cleanser',
  },
  SHAMPOO: {
    KO: 'Shampoo',
    EN: 'Shampoo',
  },
  OXYGEN: {
    KO: 'Oxygen',
    EN: 'Oxygen',
  },
  STERILIZATION: {
    KO: 'Sterilization',
    EN: 'Sterilization',
  },
  TOWELS: {
    KO: 'Towels',
    EN: 'Towels',
  },
  CHAIRS: {
    KO: 'Chairs',
    EN: 'Chairs',
  },
  ESTHETICIAN: {
    KO: 'Esthetician',
    EN: 'Esthetician',
  },
  TARGETCCOL: {
    KO: 'Targetccol',
    EN: 'Targetccol',
  },
  TONER_N_MIST: {
    KO: 'Toner & Mist',
    EN: 'Toner & Mist',
  },
  BODY_LOTION: {
    KO: 'Body Lotion',
    EN: 'Body Lotion',
  },
  TREATMENT: {
    KO: 'Treatment',
    EN: 'Treatment',
  },
  RF: {
    KO: 'RF',
    EN: 'RF',
  },
  STEAMER: {
    KO: 'Steamer',
    EN: 'Steamer',
  },
  HAIR_BAND: {
    KO: 'Hair band',
    EN: 'Hair band',
  },
  MASSAGE_TABLES: {
    KO: 'Massage Tables',
    EN: 'Massage Tables',
  },
  SKINIUP: {
    KO: 'SKINIUP',
    EN: 'SKINIUP',
  },
  SERUM: {
    KO: 'Serum',
    EN: 'Serum',
  },
  BODY_OIL: {
    KO: 'Body Oil',
    EN: 'Body Oil',
  },
  HAIR_MASK: {
    KO: 'Hair MASK',
    EN: 'Hair MASK',
  },
  ULTRASONIC: {
    KO: 'Ultrasonic',
    EN: 'Ultrasonic',
  },
  MAGNIFYING_GLASS: {
    KO: 'Magnifying Glass',
    EN: 'Magnifying Glass',
  },
  SPA_ROBES: {
    KO: 'Spa Robes',
    EN: 'Spa Robes',
  },
  TROLLEYS: {
    KO: 'Trolleys',
    EN: 'Trolleys',
  },
  SUPER_JECTION: {
    KO: 'Super-jection',
    EN: 'Super-jection',
  },
  AMPOULE: {
    KO: 'Ampoule',
    EN: 'Ampoule',
  },
  BODY_SCRUB: {
    KO: 'Body Scrub',
    EN: 'Body Scrub',
  },
  HAIR_ESSENCE: {
    KO: 'Hair Essence',
    EN: 'Hair Essence',
  },
  MICRODERMA: {
    KO: 'Microderma',
    EN: 'Microderma',
  },
  UNIFORM: {
    KO: 'Uniform',
    EN: 'Uniform',
  },
  Oil: {
    KO: 'Oil',
    EN: 'Oil',
  },
  MASSAGE_CREAM: {
    KO: 'Massage Cream',
    EN: 'Massage Cream',
  },
  SCALP_ESSENCE: {
    KO: 'Scalp Essence',
    EN: 'Scalp Essence',
  },
  LED_THERAPY: {
    KO: 'LED Therapy',
    EN: 'LED Therapy',
  },
  WAXING: {
    KO: 'Waxing',
    EN: 'Waxing',
  },
  CREAM: {
    KO: 'Cream',
    EN: 'Cream',
  },
  COOLING: {
    KO: 'Cooling',
    EN: 'Cooling',
  },
  NAIL: {
    KO: 'Nail',
    EN: 'Nail',
  },
  MASK: {
    KO: 'Mask',
    EN: 'Mask',
  },
  CONTOURING: {
    KO: 'Contouring',
    EN: 'Contouring',
  },
  TATTOO: {
    KO: 'Tattoo',
    EN: 'Tattoo',
  },
  SUN_CARE: {
    KO: 'Sun Care',
    EN: 'Sun Care',
  },
  MTS_DEVICE: {
    KO: 'MTS Device',
    EN: 'MTS Device',
  },
  BB_CREAM: {
    KO: 'BB Cream',
    EN: 'BB Cream',
  },
  CUSHION: {
    KO: 'Cushion',
    EN: 'Cushion',
  },
  PEELING: {
    KO: 'Peeling',
    EN: 'Peeling',
  },
  LIP: {
    KO: 'LIP',
    EN: 'LIP',
  },
  KIT_N_Set: {
    KO: 'KIT & Set',
    EN: 'KIT & Set',
  },
};

const LANGUAGES = {
  COMMON: {
    LOGOUT: {
      KO: '로그아웃',
      EN: 'Logout',
    },
    OVERALL_SELECTION: {
      KO: '전체 선택',
      EN: 'overall selection',
    },
    PRODUCTS_ARE_SELECTED: {
      KO: '개의 제품이 선택되었습니다',
      EN: 'products are selected',
    },
    DELETE_SELECTION: {
      KO: '선택 삭제',
      EN: 'Delete selection',
    },
    CONTENT: {
      KO: '내용',
      EN: 'Content',
    },
    INFO: {
      KO: '안내',
      EN: 'Info',
    },
    AGREE: {
      KO: '확인',
      EN: 'Agree',
    },
    CANCEL: {
      KO: '취소',
      EN: 'Cancel',
    },
    NONE: {
      KO: 'None',
      EN: 'None',
    },
    MOVE: {
      KO: '이동',
      EN: 'Move',
    },
    MOST_POPULAR: {
      KO: '인기순',
      EN: 'Most Popular',
    },
    NEW: {
      KO: '신상품순',
      EN: 'New',
    },
    PRICE: {
      KO: '가격순',
      EN: 'Price',
    },
    OPTION: {
      KO: '옵션',
      EN: 'Option',
    },
    USER_SESSION_EXPIRED: {
      KO: '사용자 계정 세션이 만료 되었습니다.\n로그인 화면으로 이동합니다.',
      EN: 'User account session expired.\nGo to the login screen.',
    },
    JOB_REQUEST_FAILED: {
      KO: '작업 요청이 실패 하였습니다.',
      EN: 'Job request failed.',
    },
    REQUEST_FAILED: {
      KO: '요청이 실패 하였습니다.\n관리자에게 문의하시기 바랍니다.',
      EN: 'Request failed.\nPlease contact your administrator.',
    },
    OTHERS: {
      KO: '기타',
      EN: 'Others',
    },
    ALL: {
      KO: '전체',
      EN: 'All',
    },
    PERCENTAGE: {
      KO: '퍼센트',
      EN: 'Percentage',
    },
    CONFIRM: {
      KO: '확인',
      EN: 'Confirm',
    },
    COSMETICS: {
      KO: '화장품',
      EN: 'Cosmetics',
    },
    HEALTH_FOOD: {
      KO: '건강식품',
      EN: 'Health food',
    },
    BEAUTY_CARE: {
      KO: '뷰티케어',
      EN: 'Beauty care',
    },
    ANSWER: {
      KO: '답변',
      EN: 'Answer',
    },
    MODIFY: {
      KO: '수정',
      EN: 'Modify',
    },
    DELETE: {
      KO: '삭제',
      EN: 'Delete',
    },
    UNLIMITED: {
      KO: '무기한',
      EN: 'Unlimited',
    },
    ADD: {
      KO: '추가',
      EN: 'Add',
    },
    CANCEL: {
      KO: '취소',
      EN: 'Cancel',
    },
    SAVE: {
      KO: '저장',
      EN: 'Save',
    },
    BACK_LIST: {
      KO: '리스트로 돌아가기',
      EN: 'Back to list',
    },
    BACK_PREVIOUS: {
      KO: '이전으로 돌아가기',
      EN: 'Back to previous',
    },
    PH_SEARCH_TERM: {
      KO: '검색어를 입력하세요',
      EN: 'Enter your search term',
    },
    CARD: {
      KO: '카드',
      EN: 'Card',
    },
    DOWNLOAD_EXCEL: {
      KO: '액셀 다운로드',
      EN: 'Download to Excel ',
    },
    PLATINUM: {
      KO: '플레티넘',
      EN: 'Platinum',
    },
    GOLD: {
      KO: '골드',
      EN: 'Gold',
    },
    BRONZE: {
      KO: '브론즈',
      EN: 'Bronze',
    },
    DELIVERY_RECEIVED: {
      KO: '배송 접수',
      EN: 'Delivery received',
    },
    SYSTEM_CONSIGNMENT_SHIPPING: {
      KO: '시스템 위탁 배송',
      EN: 'System Consignment Shipping',
    },
    DIRECT_DELIVERY: {
      KO: '직접 배송',
      EN: 'Direct Delivery',
    },
  },
  STATUS: {
    WAITING: {
      KO: '답변대기',
      EN: 'Waiting',
    },
    DONE: {
      KO: '답변완료',
      EN: 'Done',
    },
    AUTHORIZATION_REQUEST: {
      KO: '승인요청',
      EN: 'Authorization Request',
    },
    APPROVED: {
      KO: '승인',
      EN: 'Approved',
    },
    DENIED: {
      KO: '거부',
      EN: 'Denied',
    },
    EXPIRED: {
      KO: '기간 만료',
      EN: 'Expired',
    },
    // 배송
    START_SHIPPING: {
      KO: '배송시작',
      EN: 'Start shipping',
    },
    DOMESTIC_SHIPPING: {
      KO: '국내배송',
      EN: 'Domestic shipping',
    },
    OVERSEAS_SHIPPING: {
      KO: '해외배송',
      EN: 'Overseas shipping',
    },
    DELIVERED: {
      KO: '배송완료',
      EN: 'Delivered',
    },
    // 1:배송준비, 2:배송중, 3:주문완료, 4:주문취소요청, 5:주문취소완료, 6:반품요청, 7:반품완료
    WAITING: {
      KO: '대기중',
      EN: 'Waiting',
    },
    SHIPPING_PREPARATION: {
      KO: '배송준비',
      EN: 'Shipping preparation',
    },
    SHIPPING: {
      KO: '배송중',
      EN: 'Shipping',
    },
    ORDER_COMPLETED: {
      KO: '주문완료',
      EN: 'Order completed',
    },
    REQUEST_ORDER_CANCELLATION: {
      KO: '주문취소요청',
      EN: 'Request for cancellation of order',
    },
    ORDER_CANCELLATION_COMPLETED: {
      KO: '주문취소완료',
      EN: 'Order cancellation completed',
    },
    RETURN_REQUEST: {
      KO: '반품요청',
      EN: 'Return request',
    },
    RETURN_COMPLETED: {
      KO: '반품완료',
      EN: 'Return completed',
    },
    SHIPPED: {
      KO: '배송완료',
      EN: 'Shipped',
    },
    SHIPPING_DOMESTICALLY: {
      KO: '국내 배송',
      EN: 'Shipping Domestically',
    },
    SHIPPING_INTERNATIONALLY: {
      KO: '국제 배송',
      EN: 'Shipping internationally',
    },
    PROCESSING_QUEUE: {
      KO: '답변 대기',
      EN: 'Processing queue',
    },
    ANSWER_COMPLETED: {
      KO: '답변 완료',
      EN: 'Answer completed',
    },
    AVAILABLE: {
      KO: '사용가능',
      EN: 'Available',
    },
    USED: {
      KO: '사용완료',
      EN: 'Used',
    },
    EXPIRED: {
      KO: '만료됨',
      EN: 'Expired',
    },
    // 1:결제대기, 2:결제완료, 3:환불요청, 4:환불완료
    UNPAID: {
      KO: '결제대기',
      EN: 'Unpaid',
    },
    PAID: {
      KO: '결제완료',
      EN: 'Paid',
    },
    REFUND_REQUESTED: {
      KO: '환불요청',
      EN: 'Refund Requested',
    },
    REFUNDED: {
      KO: '환불완료',
      EN: 'Refunded',
    },
  },
  INFO_MSG: {
    ENTER_URL: {
      KO: '추가할 embed URL을 입력하세요',
      EN: 'Please enter the embed URL to add',
    },
    SEE_THE_CATEGORY: {
      KO: '* 필요한 카테고리가 보이지 않으면 admin@gmail.com 으로 연락해 주세요',
      EN: "* If you don't see the category you need, please contact admin@gmail.com",
    },
    RECOMMENDED_IMAGE_SIZES: {
      KO: '* 권장 이미지 크기',
      EN: '* Recommended image sizes',
    },
    SELECT_SHIPPING_METHOD: {
      KO: '배송방법을 선택해주세요.',
      EN: 'Please choose the shipping method.',
    },
    SELECT_MINIMUM_PURCHASE: {
      KO: '최소구매금액을 선택해주세요',
      EN: 'Please select the minimum purchase.',
    },
    NOT_FOUND_BRAND_LOGO: {
      KO: '브랜드 로고를 업로드해 주세요.',
      EN: 'Please upload the brand logo.',
    },
    NOT_FOUND_BRAND_LOGO: {
      KO: '브랜드 로고를 업로드해 주세요.',
      EN: 'Please upload the brand logo.',
    },
    NOT_FOUND_BRAND_BANNER: {
      KO: '브랜드 배너를 업로드해 주세요.',
      EN: 'Please upload the brand banner.',
    },
    NOT_FOUND_COMPANY_CERT: {
      KO: '사업자 등록증을 업로드해 주세요.',
      EN: 'Please upload your company certificate.',
    },
    NOT_FOUND_BANK_ACCOUNT: {
      KO: '통장 사본을 업로드해 주세요.',
      EN: 'Please upload a copy of your bank account.',
    },

    NO_CHANGE: {
      KO: '변경 사항이 없습니다.',
      EN: 'No changes have been made.',
    },
    ENTER_ANSWER: {
      KO: '답변을 입력해 주세요.',
      EN: 'Please enter your answer.',
    },
    NOT_FOUND_UPLOAD_FILE: {
      KO: '이미지를 업로드 해주세요.',
      EN: 'Please upload the image.',
    },
    UPLOAD_FILE_MAX: {
      KO: '최대 @COUNT@개의 파일을 업로드할 수 있습니다',
      EN: 'You can upload up to @COUNT@ files',
    },
    WOULD_MEMBERSHIP: {
      KO: '회원 가입을 하시겠습니까?',
      EN: 'Would you like to sign up for membership?',
    },
    ORDER_CANCEL_AND_MOVE: {
      KO: '진행 중인 주문이 있습니다.\n취소하고 이동하시겠습니까?',
      EN: 'There is an order in progress.\nDo you want to cancel and move?',
    },
    ORDER_CANCEL_AND_ADD: {
      KO: '진행 중인 주문이 있습니다.\n취소하고 새로 주문하시겠습니까?',
      EN: 'There are orders in progress.\nWould you like to cancel the new order?',
    },
    NOT_APPLICABLE: {
      KO: '해당없음',
      EN: 'Not applicable',
    },
    NOT_FOUND_POST: {
      KO: '게시글을 찾을 수 없습니다.',
      EN: 'Post not found.',
    },
    NOT_DELETE_POST: {
      KO: '게시글 권한이 없습니다.',
      EN: 'You do not have permission to post.',
    },
    DELETE_POST: {
      KO: '게시글을 삭제하시겠습니까?',
      EN: 'Are you sure you want to\ndelete the comments?',
    },
    DELETE_COMMENT: {
      KO: '댓글을 삭제하시겠습니까?',
      EN: 'Are you sure you want to\ndelete the comments?',
    },
    MOVE_CANCEL_ORDER: {
      KO: '주문을 취소하고 이동하시겠습니까?',
      EN: 'Do you want to cancel\nand move your order?',
    },
    MOVE_CART: {
      KO: '장바구니로 이동하시겠습니까?',
      EN: 'Would you like to go to\nyour shopping cart?',
    },
    ADD_OTHER_PRODUCTS: {
      KO: '@PRICE@달러가 부족합니다.\n다른 제품을 추가하세요!',
      EN: "You're @PRICE@ short.\nAdd other products!",
    },
    NO_PAYMENT: {
      KO: '결제 대상이 없습니다.',
      EN: 'There is no payment destination',
    },
    EXPIRED_LOGIN: {
      KO: '로그인이 만료되어\n로그인 화면으로 이동합니다.',
      EN: 'Your login has expired\nand will be moved to the login screen.',
    },
    SELECT_AN_OPTION: {
      KO: '옵션을 선택해 주세요',
      EN: 'Please select an option',
    },
    ENTER_BRAND_INFO: {
      KO: '브랜드 설명을 입력해주세요',
      EN: 'Please enter an brand info',
    },
    ENTER_BRAND_NAME: {
      KO: '브랜드명을 입력해주세요',
      EN: 'Please enter an brand name',
    },
    ENTER_OPTION_NAME: {
      KO: '옵션명을 입력해주세요',
      EN: 'Please enter an option name',
    },
    SELECT_AN_FIRST: {
      KO: '1차 카테고리를 선택해주세요',
      EN: 'Please choose the 1st category',
    },
    SELECT_AN_SECOND: {
      KO: '2차 카테고리를 선택해주세요',
      EN: 'Please choose the 2st category',
    },
    ENTER_RPODUCT_NAME: {
      KO: '상품명을 입력해주세요',
      EN: 'Please enter the product name',
    },
    ENTER_MSRP_AMOUNT: {
      KO: 'MSRP를 입력해주세요',
      EN: 'Please enter MSRP',
    },
    ENTER_SUPPLY_PRICE: {
      KO: '공급가를 입력해주세요',
      EN: 'Please enter the supply price',
    },
    ENTER_PRODUCT_DESCRIPTION: {
      KO: '상품 설명을 입력해주세요',
      EN: 'Please enter your description',
    },
    NO_PROMOTION: {
      KO: '진행 중인 프로모션이 없습니다.',
      EN: 'There are no promotions in progress.',
    },
    NO_ITEM_SEARCHED: {
      KO: '조회된 상품이 없습니다.',
      EN: 'No item has been searched.',
    },
    NO_ORDER_DETAILS: {
      KO: '주문내역이 없습니다',
      EN: 'There is no order details.',
    },
    NO_POST: {
      KO: '게시글이 없습니다',
      EN: 'There is no post.',
    },
    LOCK_WHOLESALE_PRICES: {
      KO: '도매가격 잠금해제',
      EN: 'Lock wholesale prices',
    },
    ENTER_THE_TITLE: {
      KO: '제목을 입력해주세요.',
      EN: 'Please enter the title.',
    },
    REGISTER_YOUR_PRODUCTS: {
      KO: '상품을 등록해주시기 바랍니다.',
      EN: 'Please register your products.',
    },
    SERVICE_ONLY: {
      KO: '로그인 사용자에게\n제공하는 서비스입니다.',
      EN: 'This is a service that only\nprovides login users.',
    },
    UNIQUE_BEAUTY_BRAND: {
      KO: '유니크한 뷰티 브랜드가 입점 되었습니다.\n무료로 회원가입 하세요!',
      EN: 'We ve got a unique beauty brand on board\nSign up for free!',
    },
    M_UNIQUE_BEAUTY_BRAND: {
      KO: '유니크한 뷰티 브랜드가 입점 되었습니다.\n무료로 회원가입 하세요!',
      EN: 'We ve got a unique beauty brand on\nboard Sign up for free!',
    },
    MEMBERSHIP_CONTENT1: {
      KO: '$10000.00 이상 구매 - 플래티넘\n1000.00에서 $10000.00 - 골드\n$999.00 이하 구매 - 브론즈',
      EN: 'Purchases over $10000.00 - Platinum\n1000.00 to $10000.00 - Gold Purchases\n$999.00 or less - Bronze',
    },
    MEMBERSHIP_CONTENT2: {
      KO: '* 멤버십 평가가 수행됩니다\n분기별 (1월/4월/7월/10월).',
      EN: '* Membership evaluations are conducted\nquarterly (January/April/July/October).',
    },
    NOT_FOUND_PRODUCT: {
      KO: '상품을 찾을 수 없습니다.',
      EN: 'The product was not found.',
    },
    SELECT_PRODUCT_MSG: {
      KO: '상품을 선택해 주세요',
      EN: 'Please select an product',
    },
    SELECT_PROMOTION_MSG: {
      KO: '프로모션을 선택해 주세요',
      EN: 'Please select an promotion',
    },
    MODIFY_PROMOTION_MSG: {
      KO: '허가된 프로모션은 임의로 수정이 불가 합니다.(관리자에 문의 바랍니다)',
      EN: 'Approved promotions cannot be modified arbitrarily. (Please contact administrator)',
    },
    DELETE_PRODUCT_MSG: {
      KO: '상품을 삭제하시겠습니까?',
      EN: 'Are you sure you want to delete the product?',
    },
    DELETE_BANNER_MSG: {
      KO: '배너을 삭제하시겠습니까?',
      EN: 'Are you sure you want to delete the banner?',
    },
    DELETE_PROMOTION_MSG: {
      KO: '프로모션을 삭제하시겠습니까?',
      EN: 'Are you sure you want to delete the promotion?',
    },
    DELETE_MSG: {
      KO: '@개의 상품을 삭제하시겠습니까?',
      EN: 'Are you sure you want to delete the @ items?',
    },
    DISCOUNT_MSG_TYPE: {
      KO: '@EA@개 이상 구매시 @PRICE@ 할인',
      EN: '@PRICE@ off when you buy @EA@ or more',
    },
    COUPON_MSG_TYPE1: {
      KO: '전체 주문에서 @PRICE@% 할인 받기',
      EN: 'Get @PRICE@% off your entire order',
    },
    COUPON_MSG_TYPE2: {
      KO: '전체 주문에서 @PRICE@ 할인 받기',
      EN: 'Get @PRICE@ off your entire order',
    },
  },

  HEADER_MENU: {
    PH_HEADER_INPUT: {
      KO: '제품명 또는 브랜드 검색',
      EN: 'Search for a product name or brand',
    },
    MY_PAGE: {
      KO: '내 정보',
      EN: 'My page',
    },
    MY_CART: {
      KO: '장바구니',
      EN: 'My Cart',
    },
    LOUNGE: {
      KO: '라운지',
      EN: 'Lounge',
    },
    SIGN_UP_TO_SELLER: {
      KO: '판매자 가입',
      EN: 'Sign up to Seller',
    },
    PROMOTION: {
      KO: '프로모션',
      EN: 'Promotion',
    },
    SKIN_CARE: {
      KO: '스킨케어',
      EN: 'Skincare',
    },
    MAKE_UP: {
      KO: '메이크업',
      EN: 'Makeup',
    },
    HAIR_CARE: {
      KO: '헤어케어',
      EN: 'Haircare',
    },
    BODY_CARE: {
      KO: '바디케어',
      EN: 'Bodycare',
    },
    FRAGRANCE: {
      KO: '향수',
      EN: 'Fragrance',
    },
    MENS_GROOMING: {
      KO: '남성관리',
      EN: 'Men’s grooming',
    },
  },
  SELLER_SIDE_MENU: {
    DASHBOARD: {
      KO: '대시보드',
      EN: 'Dashboard',
    },
    PRODUCTS: {
      KO: '상품',
      EN: 'Products',
    },
    SALES: {
      KO: '판매',
      EN: 'Sales',
    },
    BANNERS: {
      KO: '배너',
      EN: 'Banners',
    },
    PROMOTIONS: {
      KO: '프로모션',
      EN: 'Promotions',
    },
    SETTLEMENT: {
      KO: '정산',
      EN: 'Settlement',
    },
    INQUIRIES: {
      KO: '문의',
      EN: 'Inquiries',
    },
    REVIEWS: {
      KO: '리뷰',
      EN: 'Reviews',
    },
    LOUNGE: {
      KO: '라운지',
      EN: 'Lounge',
    },
    MY_PAGE: {
      KO: '마이페이지',
      EN: 'My page',
    },
  },

  DASHBOARD: {
    TOTAL_SALES: {
      KO: '총 매출',
      EN: 'Total sales',
    },
    NUMBER_ORDERS: {
      KO: '주문 수',
      EN: 'Number of orders',
    },
    NUMBER_REFUNDS: {
      KO: '환불 수',
      EN: 'Number of refunds',
    },
    SALES_STATUS: {
      KO: '판매 현황',
      EN: 'Sales Status',
    },
    RANKING_PRODUCTS_SALE: {
      KO: '상품판매 순위',
      EN: 'Ranking products for sale',
    },
    RANKING: {
      KO: '순위',
      EN: 'Ranking',
    },
    PRODUCT: {
      KO: '상품',
      EN: 'Product',
    },
    SALES_AMOUNT: {
      KO: '판매금액',
      EN: 'Sales amount',
    },
    SALES: {
      KO: '판매갯수',
      EN: 'Sales',
    },
  },

  PRODUCTS: {
    BEST_SELLER: {
      KO: '베스트셀러',
      EN: 'Best seller',
    },
    DISCOUNT: {
      KO: '할인',
      EN: 'Discount',
    },
    ADD: {
      KO: '추가',
      EN: 'Add',
    },
    ADD_OPTION: {
      KO: '+옵션 추가',
      EN: '+Add option',
    },
    ADD_CONDITIONS: {
      KO: '+조건 추가',
      EN: '+Add Conditions',
    },
    PH_OPTION: {
      KO: '향, 컬러 입력',
      EN: 'Enter fragrance, color',
    },
    RESET: {
      KO: '초기화',
      EN: 'Reset',
    },
    APPLY: {
      KO: '적용',
      EN: 'Apply',
    },
    ENABLED: {
      KO: '활성화',
      EN: 'Enabled',
    },
    DISABLED: {
      KO: '비활성화',
      EN: 'Disabled',
    },
    CATEGORY: {
      KO: '카테고리',
      EN: 'Category',
    },
    PROMOTION: {
      KO: '프로모션',
      EN: 'Promotion',
    },
    AFFILIATE_PROMOTIONS: {
      KO: '제휴 프로모션',
      EN: 'Affiliate promotions',
    },
    STATUS: {
      KO: '상태',
      EN: 'Status',
    },
    SUPPLY_PRICE: {
      KO: '공급 가격',
      EN: 'Supply price',
    },
    PH_AMOUNT: {
      KO: '금액 입력',
      EN: 'Enter amount',
    },
    INVENTORY_MANAGEMENT: {
      KO: '재고 관리',
      EN: 'Inventory management',
    },
    INVENTORY_QUANTITY: {
      KO: '재고 수량',
      EN: 'Inventory quantity',
    },
    SALES_QUANTITY: {
      KO: '판매 수량',
      EN: 'Sales quantity',
    },
    INTEREST: {
      KO: '관심수',
      EN: 'Interest',
    },
    SALES_INFORMATION: {
      KO: '판매 정보',
      EN: 'Sales information',
    },
    ABOUT_VENDORS: {
      KO: '업체 정보',
      EN: 'About the vendors',
    },
    MERCHANT_BRANDS: {
      KO: '판매 브랜드',
      EN: 'Merchant brands',
    },
    FEES: {
      KO: '수수료',
      EN: 'Fees',
    },
    SHIPPING_METHOD: {
      KO: '배송 방법',
      EN: 'Shipping Method',
    },
    SYSTEM_OUTSOURING: {
      KO: '시스템 아웃소싱',
      EN: 'System outsouring',
    },
    DISCOUNT_PER_UNIT_PURCHASE_FEATURE: {
      KO: '구매 단위당 할인 기능',
      EN: 'Discount per unit of purchase feature',
    },
    CONDITIONS: {
      KO: '조건',
      EN: 'Conditions',
    },
    PRODUCT_NAME: {
      KO: '상품명',
      EN: 'Product name ',
    },
    MOCRA_FDA_APPROVED: {
      KO: '모크라/FDA 승인 여부',
      EN: 'Mohcra/FDA approved',
    },
    REGISTER: {
      KO: '등록',
      EN: 'Register',
    },
    NOT_APPROVED: {
      KO: '미등록',
      EN: 'Not approved',
    },
    OPTION: {
      KO: '옵션',
      EN: 'Option',
    },
    REGISTRATION_DATE: {
      KO: '등록일',
      EN: 'Registration Date',
    },
    BRAND_NAME: {
      KO: '브랜드명',
      EN: 'Brand name',
    },
    PH_BRAND_NAME: {
      KO: '브랜드명을 입력해주세요',
      EN: 'Enter a brand name',
    },
    KEYWORD: {
      KO: '검색어',
      EN: 'Enter a keyword',
    },
    PH_KEYWORD: {
      KO: '키워드를 입력해주세요',
      EN: 'Enter a keyword',
    },
    SEARCH_FILTER: {
      KO: '조건검색',
      EN: 'Search filter',
    },
    DELETE_SELECTION: {
      KO: '선택 삭제',
      EN: 'Delete selection',
    },
    ALL: {
      KO: '전체',
      EN: 'All',
    },
    TYPE: {
      KO: '타입',
      EN: 'Type',
    },
    ALL_PERIODS: {
      KO: '전체',
      EN: 'All periods',
    },
    ON_SALE: {
      KO: '판매중',
      EN: 'On sale',
    },
    STOP_SELLING: {
      KO: '판매중단',
      EN: 'Stop selling',
    },
    OUT_OF_STOCK: {
      KO: '품절',
      EN: 'Out of stock',
    },
    NUMBER: {
      KO: '번호',
      EN: 'Number',
    },
    PRODUCT: {
      KO: '상품',
      EN: 'Product',
    },
    FOR_PURCHASES_OF: {
      KO: '구매 시',
      EN: 'For purchases of',
    },
    OR_MORE: {
      KO: '개 이상',
      EN: 'or more',
    },
    RATIO: {
      KO: '비율',
      EN: 'Ratio',
    },
    AMOUNT: {
      KO: '금액',
      EN: 'Amount',
    },
    PH_PRODUCT_NAME: {
      KO: '상품명은 영어로 입력하세요.', // 영어 입력시에만 검색 됩니다.
      EN: 'Please enter the name in English.', // It will only be searched when entering English.
    },
    PH_STOCK_CNT: {
      KO: '재고를 입력해주세요',
      EN: 'Enter a stock count',
    },
    PH_MINIMUM_PURCHASE_QUANTITY: {
      KO: '최소구매수량을 입력해주세요',
      EN: 'Enter a Minimum purchase quantity',
    },
    SALES_AMOUNT: {
      KO: '매출액',
      EN: 'Sales amount',
    },
    SUPPLY_PRICE: {
      KO: '공급가',
      EN: 'Supply price',
    },
    MSRP: {
      KO: '소비자가',
      EN: 'MSRP',
    },
    STATE: {
      KO: '상태',
      EN: 'State',
    },
    STOCK: {
      KO: '재고',
      EN: 'Stock',
    },
    VIEW: {
      KO: '조회',
      EN: 'View',
    },
    WISH: {
      KO: '찜하기',
      EN: 'Wish',
    },
    CART: {
      KO: '장바구니',
      EN: 'Cart',
    },
    REPRESENTATIVE_IMAGE: {
      KO: '대표 이미지',
      EN: 'Representative image',
    },
    UPLOAD_TITLE_IMAGE: {
      KO: '업로드 대표 이미지',
      EN: 'Upload a title image',
    },
    DETAILED_DESCRIPTION: {
      KO: '상세설명',
      EN: 'Detailed description',
    },
    ENTER_PRODUCT_DESCRIPTION: {
      KO: '상세설명',
      EN: 'Enter a product description',
    },
    MINIMUM_PURCHASE_QUANTITY: {
      KO: '최소 구매 수량',
      EN: 'Minimum purchase quantity',
    },
    PURCHASE_QUANTITY: {
      KO: '구매 수량',
      EN: 'purchase quantity',
    },
  },

  SALES: {
    ORDER_DATE: {
      KO: '주문일',
      EN: 'Order Date',
    },
    ORDER_NUMBER: {
      KO: '주문번호',
      EN: 'Order Number',
    },
    PRODUCT: {
      KO: '상품',
      EN: 'Product',
    },
    ORDERERS: {
      KO: '주문자',
      EN: 'Orderers',
    },
    PAYMENT_STATUS: {
      KO: '결제상태',
      EN: 'Payment\nstatus',
    },
    ORDER_STATUS: {
      KO: '주문상태',
      EN: 'Order\nstatus',
    },
    DONE: {
      KO: '결제완료',
      EN: 'Done',
    },
    SHIPPED: {
      KO: '배달완료',
      EN: 'Shipped',
    },
    COMPLETED_PAYMENT: {
      KO: '결제완료',
      EN: 'Completed payment',
    },
    PH_ENTER_NOTE: {
      KO: '메모를 작성해주세요',
      EN: 'Enter a note',
    },
    NOTES: {
      KO: '메모',
      EN: 'Notes',
    },
    PAYMENT_INFO: {
      KO: '결제정보',
      EN: 'Payment info',
    },
    PRODUCT_PRICE: {
      KO: '상품가격',
      EN: 'Product price',
    },
    FINAL_PAYMENT_AMOUNT: {
      KO: '최종 결제 금액',
      EN: 'Final Payment Amount',
    },
  },
  // SIGN_UP

  // ACOUNT
  ACC: {
    // 계정관련
    PH_EMAIL_USE: {
      KO: '이메일 입력',
      EN: 'Please enter an email to use',
    },
    EMAIL: {
      KO: '이메일',
      EN: 'Email',
    },
    PH_EMAIL: {
      KO: '이메일 찾기',
      EN: 'Enter a email',
    },
    PH_PASSWORD: {
      KO: '이메일 찾기',
      EN: 'Enter a password',
    },
    PASSWORD: {
      KO: '비밀번호',
      EN: 'Password',
    },
    PASSWORD_CONFIRM: {
      KO: '비밀번호 확인',
      EN: 'Password confirm',
    },
    PH_PASSWORD: {
      KO: '비밀번호 최소 8자리',
      EN: 'Enter at least 8 characters',
    },
    NAME: {
      KO: '이름',
      EN: 'Name',
    },
    FIRST_NAME: {
      KO: '성',
      EN: 'First name',
    },
    LAST_NAME: {
      KO: '이름',
      EN: 'Last name',
    },
    PHONE_NUMBER: {
      KO: '전화번호',
      EN: 'Phone number',
    },
    PH_PHONE_NUMBER: {
      KO: '전화번호 입력',
      EN: 'Enter your phone number',
    },
    // 로그인관련
    LOGIN: {
      LOGIN: {
        KO: '로그인',
        EN: 'Login',
      },
      SIGN_UP: {
        KO: '회원가입',
        EN: 'Sign up',
      },
      KEEP_ME_LOGGED_IN: {
        KO: '로그인 유지',
        EN: 'Keep me logged in',
      },
      FORGOT_ACCOUNT: {
        KO: '이메일 · 비밀번호 찾기',
        EN: 'Forgot account?',
      },
      DONTS_HAVE_AN_ACCOUNT: {
        KO: '회원이 아니신가요?',
        EN: 'Dont’s have an account?',
      },
      GO_TO_SIGN_UP: {
        KO: '회원이 아닙니다.\n가입 페이지로 이동하시겠습니까?',
        EN: 'You are not a member.\nDo you want to go to the sign-up page?',
      },
      CREATE_AN_ACCOUNT: {
        KO: '회원가입',
        EN: 'Create an account',
      },
      HEADER_SIGN_MSG: {
        KO: '10만 개 이상의 브랜드에서 온라인으로 도매 쇼핑하기',
        EN: 'Shop wholesale online from over 100,000 brands.',
      },
      HEADER_SIGN_UP: {
        KO: '회원가입',
        EN: 'Sign up',
      },
    },
    // 회원찾기
    FIND: {
      FIND_EMAIL_ADDRESS: {
        KO: '@NAME@님의 이메일',
        EN: "@NAME@'s email address is",
      },
      FIND_ACCOUNT: {
        KO: '회원찾기',
        EN: 'Find account',
      },
      FORGOT_EMAIL: {
        KO: '이메일 찾기',
        EN: 'Forgot email',
      },
      FIND_A_EMAIL: {
        KO: '이메일 찾기',
        EN: 'Find a email',
      },
      SUB_TITLE_EMAIL: {
        KO: '이메일 찾기',
        EN: 'Enter the name and password you used to find your email',
      },
      FORGOT_PASSWORD: {
        KO: '비밀번호 찾기',
        EN: 'Forgot password',
      },
      SUB_TITLE_PASSWORD: {
        KO: '이메일 찾기',
        EN: 'Enter the email you signed up with',
      },
      PH_EMAIL_FOR_PASSWORD: {
        KO: '이메일 찾기',
        EN: 'Enter the email you signed up with',
      },
      PH_PASSWORD_FOR_EMAIL: {
        KO: '비밀번호 입력',
        EN: 'Enter a password',
      },
      ISSUE_TEMP_PASSWORD: {
        KO: '임시 비밀번호 발급',
        EN: 'Issue temporary passwords',
      },
      COMPLETE_FIND_PASSWORD: {
        KO: '임시 비밀번호 발급 성공',
        EN: `We've issued a temporary password roll to the email you entered.`,
      },
      CONFIRM: {
        KO: '확인',
        EN: `Confirm`,
      },
      GO_TO_LOG_IN: {
        KO: '로그인 하기',
        EN: 'Go to Log in',
      },
    },
    SU: {
      SIGN_UP: {
        KO: '가입하기',
        EN: 'Sign up',
      },
      SIGN_UP_IS_COMPLETE: {
        KO: '회원가입 완료',
        EN: 'Your signup is complete.',
      },
      SERVICES_AND_BENEFITS: {
        KO: '로그인하면 더 많은 서비스와 혜택을 받을 수 있습니다.',
        EN: 'Sign in to get more services and benefits.',
      },
      GO_TO_SIGN_IN: {
        KO: '로그인 하기',
        EN: 'Go to sign in',
      },
      FULL_AGREEMENT: {
        KO: '전체동의',
        EN: 'Full agreement',
      },
      PH_EMAIL: {
        KO: '사용할 이메일',
        EN: 'Enter your email',
      },
      SEND_EMAIL: {
        KO: '이메일 발송',
        EN: 'Send email',
      },
      TERMS_OF_USE: {
        KO: '사용자 동의',
        EN: 'Terms of Use',
      },
      PRIVACY_POLICY: {
        KO: '개인정보 동의',
        EN: 'Privacy Policy',
      },
      BRAND_TERMS_OF_SERVICE: {
        KO: '서비스 동의',
        EN: 'Brand Terms of Service',
      },
      AGREEMENT: {
        KO: '동의',
        EN: 'Agreement',
      },
      AGREE: {
        KO: '이용약관',
        EN: 'Agree',
      },
      ENTER_INFORMATION: {
        KO: '정보입력',
        EN: 'Enter Information',
      },
      COMPLETE_SIGN_UP: {
        KO: '회원가입 완료',
        EN: 'Complete Signup',
      },
      VERIFICATION: {
        KO: '인증',
        EN: 'Verification',
      },
      CODE: {
        KO: '번호',
        EN: 'code',
      },
      PH_VERIFICATION_CODE: {
        KO: '이메일에 발송된 인증번호 입력',
        EN: 'Send an email and get a verification code',
      },
      REFERRER_ID: {
        KO: '추천 아이디',
        EN: 'Referrer ID',
      },
      PH_REFERRER_ID: {
        KO: '추천인 입력하고 $10 받기 (작성자, 추천인 모두 포함)',
        EN: 'Enter a referral and get $10.00 (includes both you and the referral)',
      },
      OPTIONAL: {
        KO: '선택사항',
        EN: 'Optional',
      },
      PREVIEW: {
        KO: '미리보기',
        EN: 'Preview',
      },
      BUSINESS_NAME: {
        KO: '사업명',
        EN: 'Business name',
      },
      PH_BUSINESS_NAME: {
        KO: '사업명을 입력해주세요',
        EN: 'Enter your business name',
      },
      BUSINESS_TYPE: {
        KO: '업종',
        EN: 'Business type',
      },
      PH_BUSINESS_TYPE_SELECT: {
        KO: '업종을 선택해주세요',
        EN: 'Select your busniess type',
      },
      ACCOUNT_INFOMATION: {
        KO: '회원 정보',
        EN: 'Account infomation',
      },
      SELLER_INFOMATION: {
        KO: '판매자 정보',
        EN: 'Seller infomation',
      },
      BRAND_NAME: {
        KO: '브랜드 명',
        EN: 'Brand name',
      },
      PH_BRAND_NAME: {
        KO: '브랜드 명을 입력해주세요.',
        EN: 'Enter your brand name',
      },
      BRAND_CATEGORY: {
        KO: '브랜드 카테고리',
        EN: 'Brand Category',
      },
      PH_BRAND_CATEGORY: {
        KO: '1차 카테고리를 선택하세요',
        EN: 'Select your brand category',
      },
      PH_BRAND_SECONDERY_CATEGORY: {
        KO: '2차 카테고리를 선택하세요',
        EN: 'Select a secondary brand category',
      },
      PH_BRAND_SUB_CATEGORY: {
        KO: '서브 카테고리를 선택하세요',
        EN: 'Please select a sub-brand category',
      },
      ADD: {
        KO: '+추가',
        EN: '+Add',
      },
      BRAND_LOGO: {
        KO: '브랜드 로고',
        EN: 'Brand logo',
      },
      BRAND_BANNER: {
        KO: '브랜드 배너',
        EN: 'Brand banner',
      },
      PH_SELECT_FILE: {
        KO: '파일 선택',
        EN: 'Select a file',
      },
      FILE_UPLOAD: {
        KO: '파일 업로드',
        EN: 'File Upload',
      },
      BUSINESS_LICENSE_NUMBER: {
        KO: '사업자 번호',
        EN: 'Business license number',
      },
      PH_BUSINESS_LICENSE_NUMBER: {
        KO: '사업자번호를 입력해주세요',
        EN: 'Enter your license number',
      },
      BUSINESS_LICENSE: {
        KO: '사업자 등록증',
        EN: 'Business license',
      },
      BUSINESS_PHONE_NUMBER: {
        KO: '사업자 전화번호',
        EN: 'Business phone number',
      },
      BUSINESS_LICENSE: {
        KO: '사업자등록증',
        EN: 'Business license',
      },
      BUSINESS_LOGO: {
        KO: '사업자 로고',
        EN: 'Business logo',
      },
      BUSINESS_ADDRESS: {
        KO: '사업자 주소',
        EN: 'Business address',
      },
      SETTLEMENT_ACCOUNTS: {
        KO: '정산 계좌',
        EN: 'Settlement accounts',
      },
      SETTLEMENT_ACCOUNT_INFO: {
        KO: '계좌 정보',
        EN: 'Settlement account info',
      },
      PH_ACCOUNT_NUMBER: {
        KO: '계좌번호를 입력해주세요',
        EN: 'Please enter your account number',
      },
      SELECT_BANK: {
        KO: '은행',
        EN: 'Select a bank',
      },
      SELECT_YOUR_BANK: {
        KO: '은행',
        EN: 'Select your bank',
      },
      SHIPPING_METHODS: {
        KO: '배송 방법',
        EN: 'Shipping Methods',
      },
      PH_SHIPPING_METHODS: {
        KO: '배송 방법 선택',
        EN: 'Select your Shipping Methods',
      },
      MERCHANT_FEES: {
        KO: '판매자 수수료',
        EN: 'Merchant fees',
      },
      PASSBOOK_COPIES: {
        KO: '통장 사본',
        EN: 'Passbook copies',
      },
      PURCHASE_MINIMUM: {
        KO: '구매 최소값',
        EN: 'Purchase minimum',
      },
      PH_PURCHASE_MINIMUM: {
        KO: '구매 최소값 선택',
        EN: 'Select your purchase minimum',
      },
      BRAND_DESCRIPTION: {
        KO: '브랜드 설명',
        EN: 'Brand description',
      },
      ENTER_PRODUCT_DESCRIPTION: {
        KO: '상품 설명',
        EN: 'Enter a product description',
      },
      MODIFY_YOUR_PASSWORD: {
        KO: '비밀번호 변경',
        EN: 'Modify your password',
      },
      EXISTING_PASSWORD: {
        KO: '기존 비밀번호',
        EN: 'Existing password',
      },
      PH_EXISTING_PASSWORD: {
        KO: '기존 비밀번호를 입력하세요',
        EN: 'Enter your existing password ',
      },
      NEW_PASSWORD: {
        KO: '새로운 비밀번호',
        EN: 'New password',
      },
      PH_NEW_PASSWORD: {
        KO: '새로운 비밀번호를 입력하세요',
        EN: 'Enter a new password.',
      },
      CONFIRM_NEW_PASSWORD: {
        KO: '새로운 비밀번호 확인',
        EN: 'Confirm new password',
      },
      PH_CONFIRM_NEW_PASSWORD: {
        KO: '새로운 비밀번호를 확인하세요.',
        EN: 'Confirm new password',
      },
      NO_PATCH_CONFIRM_NEW_PASSWORD: {
        KO: '새로운 비밀번호가 일치하지 않습니다.',
        EN: 'New password does not match.',
      },
    },
  },
  LOUNGE: {
    HOME: {
      KO: '홈',
      EN: 'Home',
    },
    JOB_SEARCH: {
      KO: '구직',
      EN: 'Job earch',
    },
    JOB_POSTING: {
      KO: '채용 공고',
      EN: 'Job Posting',
    },
    JOB_HUNTING: {
      KO: '구직 활동',
      EN: 'Job Hunting',
    },
    MARKETPLACE: {
      KO: '장터',
      EN: 'Marketplace',
    },
    LEGAL_SERVICES: {
      KO: '법률 서비스',
      EN: 'Legal Services',
    },
    COMMUNITY: {
      KO: '커뮤니티',
      EN: 'Community',
    },
    SECOND_HAND: {
      KO: '중고거래',
      EN: 'Second-hand',
    },
    SECOND_HAND_2: {
      KO: '중고거래',
      EN: 'Secondhand',
    },
    DAILY: {
      KO: '데일리',
      EN: 'Daliy',
    },
    ROUTINE: {
      KO: '일상',
      EN: 'Routine',
    },
    SEARCH_FOR_POSTS: {
      KO: '포스트 검색',
      EN: 'Search for posts',
    },
    WRITE_A_NEW_POST: {
      KO: '포스트 작성',
      EN: 'Write a new post',
    },
    TITLE: {
      KO: '제목',
      EN: 'Title',
    },
    AUTHOR: {
      KO: '작성자',
      EN: 'Author',
    },
    CREATED_ON: {
      KO: '작성일',
      EN: 'Created on',
    },
    VIEW: {
      KO: '읽음',
      EN: 'View',
    },
    PH_ENTER_YOUR_CONTENT: {
      KO: '내용을 입력해주세요',
      EN: 'Enter your content',
    },
    PUBLISH: {
      KO: '게시하기',
      EN: 'Publish',
    },
    PH_ENTER_TITLE: {
      KO: '제목을 입력해주세요',
      EN: 'Enter a title',
    },
    PH_RELATED_LINKS: {
      KO: '연결할 링크를 입력해주세요',
      EN: 'Enter a related link',
    },
    RELATED_LINK: {
      KO: '링크 연결',
      EN: 'Related link',
    },
    WRITE_YOUR_CONTENT: {
      KO: '내용 입력',
      EN: 'Write your content',
    },
    COMMENT: {
      KO: '댓글',
      EN: 'Comment',
    },
    WRITE_COMMENT: {
      KO: '작성',
      EN: 'Write',
    },
    AUTHOR_ID: {
      KO: '작성자 ID',
      EN: 'Author ID ',
    },
    REGISTRATION_DATE: {
      KO: '등록일',
      EN: 'Registration Date',
    },
    RELATED_LINK: {
      KO: '연결 링크',
      EN: 'Related Link',
    },
    VIEWS: {
      KO: '읽음',
      EN: 'Views',
    },
    JOBS: {
      JOBS: {
        KO: '구인',
        EN: 'Jobs',
      },
      SEARCH_FOR_POSTS: {
        KO: '포스트 검색',
        EN: 'Search for posts',
      },
      WRITE_A_NEW_POST: {
        KO: '포스트 작성',
        EN: 'Write a new post',
      },
      TITLE: {
        KO: '제목',
        EN: 'Title',
      },
      AUTHOR: {
        KO: '작성자',
        EN: 'Author',
      },
      CREATED_ON: {
        KO: '작성일',
        EN: 'Created on',
      },
      VIEWS: {
        KO: '읽음',
        EN: 'Views',
      },
      VIEWS_LOW: {
        KO: '읽음',
        EN: 'views',
      },
      SAVE: {
        KO: '작성',
        EN: 'Save',
      },
      PH_TITLE: {
        KO: '제목 작성',
        EN: 'Enter a title.',
      },
      RELATED_LINKS: {
        KO: '링크 연결',
        EN: 'Related links',
      },
      OPTIONAL: {
        KO: '선택',
        EN: 'Optional',
      },
      PH_RELATED_LINKS: {
        KO: 'http://, https://',
        EN: 'http://, https://',
      },
      IMAGE: {
        KO: '이미지',
        EN: 'Image',
      },
      PH_IMAGE: {
        KO: 'Up to 5 photos',
        EN: 'Up to 5 photos',
      },
      CONTENTS: {
        KO: '내용',
        EN: 'Contents',
      },
      PH_CONTENTS: {
        KO: '내용을 작성해주세요.',
        EN: 'Please enter your content',
      },

      MODIFY: {
        KO: '수정',
        EN: 'Modify',
      },
      DELETE: {
        KO: '삭제',
        EN: 'Delete',
      },
    },
  },
  MY_PAGE: {
    CHANGE_PASSWORD: {
      KO: '비밀번호 변경',
      EN: 'Change password',
    },
    MY_PAGE: {
      KO: '마이페이지',
      EN: 'My page',
    },
    MY_INFO: {
      KO: '내 정보',
      EN: 'My information',
    },
    ORDER_HISTORY: {
      KO: '주문내역',
      EN: 'Order history',
    },
    REVIEWS_INQUIRIES: {
      REVIEWS_INQUIRIES: {
        KO: '리뷰/문의',
        EN: 'Reviews/Inquiries',
      },
      REVIEWS: {
        KO: '리뷰',
        EN: 'Reviews',
      },
      INQUIRIES: {
        KO: '문의',
        EN: 'Inquiries',
      },
      STATUS: {
        KO: '상태',
        EN: 'Status',
      },
      AUTHOR: {
        KO: '작성자',
        EN: 'Author',
      },
      REGISTRATION_DATE: {
        KO: '작성일',
        EN: 'Registration Date',
      },
    },
    HELP: {
      HELP: {
        KO: '헬프데스크',
        EN: 'Help',
      },
      FAQ: {
        KO: 'FAQ',
        EN: 'FAQ',
      },
      NOTICE: {
        KO: '안내',
        EN: 'Notice',
      },
      NUMBER: {
        KO: '번호',
        EN: 'Number',
      },
      TITLE: {
        KO: '제목',
        EN: 'Title',
      },
    },
    MEMBERSHIP: {
      KO: '멤버십',
      EN: 'Membership',
    },
    MEMBERSHIP_INFO: {
      KO: '멤버십 안내 예정',
      EN: 'Membership Info',
    },
    REWARD_COINS: {
      KO: '코인',
      EN: 'Reward coins',
    },
    EDIT_ACCOUNT_INFO: {
      KO: '회원정보수정',
      EN: 'Edit account info',
    },
    EDIT: {
      TITLE_EDIT_ACCOUNT_INFO: {
        KO: '회원정보수정',
        EN: 'Edit your account information',
      },
      PH_PASSWORD: {
        KO: '현재 비밀번호',
        EN: 'Current password',
      },
      CURRENT_PASSWORD: {
        KO: '현재 비밀번호',
        EN: 'Current password',
      },
      NEW_PASSWORD: {
        KO: '변경 비밀번호',
        EN: 'New password',
      },
      NEW_PASSWORD_CONFIRM: {
        KO: '변경 비밀번호 확인',
        EN: 'New password confirm',
      },
      CHANGE_PASSWORD: {
        KO: '비밀번호 변경',
        EN: 'Change a password',
      },
      SAVE_YOUR_CHANGES: {
        KO: '저장 및 변경',
        EN: 'Save your changes',
      },
    },
    ORDER: {
      UNPAID: {
        KO: '상세',
        EN: 'Unpaid',
      },
      COMPLETED_PAYMENT: {
        KO: '결제완료',
        EN: 'Completed payment',
      },
      // 헤더
      ORDER_DETE: {
        KO: '주문일',
        EN: 'Order Date',
      },
      ORDER_NUMBER: {
        KO: '주문번호',
        EN: 'Order Number',
      },
      DETAILS: {
        KO: '주문/배송 상세',
        EN: 'Details',
      },
      MESSAGES: {
        KO: '메모',
        EN: 'Messages',
      },
      PAYMENT_INFO: {
        KO: '결제정보',
        EN: 'Payment info',
      },
      PRODUCT_PRICE: {
        KO: '상품가격',
        EN: 'Product price',
      },
      SHIPPING_COST: {
        KO: '배송비',
        EN: 'Shipping cost',
      },
      SHIPPING_CARRIERS: {
        KO: '운송업체',
        EN: 'Shipping carriers',
      },
      TRACKING_NUMBER: {
        KO: '운송번호',
        EN: 'Tracking Number',
      },
      PREPARING: {
        KO: '배송준비',
        EN: 'Preparing',
      },
      WRITE_PRODUCT_INQUIRY: {
        KO: '상품 문의 작성',
        EN: 'Write a product inquiry',
      },
      PH_WRITE_PRODUCT_INQUIRY: {
        KO: '문의내용을 작성해주세요',
        EN: 'Please enter inquiry',
      },
      WRITE_IN_SECRET: {
        KO: '비공개',
        EN: 'Write in secret',
      },
      REGISTER_REVIEW: {
        KO: '리뷰등록',
        EN: 'Register a review',
      },
      REGISTER_INQUIRIES: {
        KO: '문의등록',
        EN: 'Register a inquiries',
      },
      REQUEST_CANCELLATION: {
        KO: '취소요청',
        EN: 'Request a cancellation',
      },
      REQUEST_RETURN: {
        KO: '반품요청',
        EN: 'Request a return',
      },

      REASONS_FOR_RETURN: {
        KO: '반품 사유',
        EN: 'Reasons for return',
      },
      REASONS_FOR_CANCELLATION: {
        KO: '취소 사유',
        EN: 'Reasons for cancellation',
      },
      PH_REASONS_FOR_RETURN: {
        KO: '자세한 이유를 작성해주세요',
        EN: 'Please provide a detailed reason',
      },
      ORDER_MISTAKE: {
        KO: '주문실수',
        EN: 'Order mistake',
      },
      DAMAGED_OR_DEFECTIVE: {
        KO: '손상 및 결함',
        EN: 'Damaged or Defective',
      },
      WRONG_ITEM_DELIVERED: {
        KO: '잘못된 상품 배송',
        EN: 'Wrong Item Delivered',
      },
      ESTIMATED_REFUND_AMOUNT: {
        KO: '예상 환불 금액',
        EN: 'Estimated refund amount',
      },

      CHECK_THE_FOLLOWING: {
        KO: '다음을 확인해 주세요:',
        EN: 'Please check the following',
      },
      CHECK_THE_FOLLOWING_1: {
        KO: '샘플 주문의 경우 반품, 주문 취소, 환불이 허용되지 않습니다.',
        EN: 'Returns, order cancellations, and refunds are not allowed for sample orders.',
      },
      CHECK_THE_FOLLOWING_2: {
        KO: '단순 변심으로 인한 취소, 환불, 반품은 허용되지 않습니다.',
        EN: 'Cancellations, refunds, and returns due to a simple change of mind are not permitted.',
      },
      CHECK_THE_FOLLOWING_3: {
        KO: '반품을 요청하기 전에 다음 사항을 확인해 주시기 바랍니다. 반품 자격 확인 관리자.',
        EN: 'Before requesting a return, please ensure to confirm the return eligibility with the administrator.',
      },
      CHECK_THE_FOLLOWING_4: {
        KO: '상황에 따라 반품 요청 수는 제한될 수 있습니다.',
        EN: 'The number of return requests may be limited depending on the circumstances.',
      },

      PRODUCT_AMOUNT: {
        KO: '상품가격',
        EN: 'Product amount',
      },
      REFUND_SHIPPING_COST: {
        KO: '환불 배송비',
        EN: 'Refund shipping cost',
      },
      DISCOUNT: {
        KO: '할인',
        EN: 'Discount',
      },
      DISCOUNT_AMOUNT: {
        KO: '할인가격',
        EN: 'Discount amount',
      },
      FINAL_REFUND_ESTIMATE: {
        KO: '최종 환불 금액',
        EN: 'Final refund estimate',
      },

      // 상태버튼
      PRODUCT_INQUIRIES: {
        KO: '상품문의',
        EN: 'Product inquiries',
      },
      TRACK_SHIPMENT: {
        KO: '배송추적',
        EN: 'Track a shipment',
      },
      RETURNING_PRODUCT: {
        KO: '주문 반품',
        EN: 'Returning a product',
      },
      SHIPPING_INFO: {
        KO: '배송정보',
        EN: 'Shipping info',
      },
      CANCEL_ORDER: {
        KO: '주문취소',
        EN: 'Cancel an order',
      },
    },
    COUPON: {
      COUPON: {
        KO: '쿠폰',
        EN: 'Coupon',
      },
    },
  },

  ORDER: {
    ORDER: {
      KO: '주문',
      EN: 'Order',
    },
    WISHLIST: {
      KO: '위시리스트',
      EN: 'Wishlist',
    },
    RECENT_ORDERS: {
      KO: '주문내역',
      EN: 'Recent orders',
    },
    PRODUCT: {
      KO: '상품명',
      EN: 'Product',
    },
    ORDER_NUMBER: {
      KO: '주문번호',
      EN: 'Order number',
    },
    QUANTITY: {
      KO: '수량',
      EN: 'Quantity',
    },
    DATE: {
      KO: '주문일',
      EN: 'Date',
    },
    MESSAGES: {
      KO: '메모',
      EN: 'Messages',
    },
    TOTAL_PRICE: {
      KO: '총 주문금액',
      EN: 'Total order price',
    },
    PRODUCT_INFORMATION: {
      KO: '상품 정보',
      EN: 'Product information',
    },
    ORDERER_INFO: {
      KO: '주문자 정보',
      EN: 'Orderer info',
    },
    ORDERER_INFORMATION: {
      KO: '주문자 정보',
      EN: 'Orderer information',
    },
    ORDERER_NAME: {
      KO: '주문자명',
      EN: 'Orderer name',
    },
    SHIPPING_INFORMATION: {
      KO: '배송정보',
      EN: 'Shipping information',
    },
    SHIPPING_INFO: {
      KO: '배송정보',
      EN: 'Shipping info',
    },
    SAME_AS_ORDERER_INFORMATION: {
      KO: '주문자 정보와 동일',
      EN: 'Same as orderer information',
    },
    SUMMARY: {
      KO: '주문요약',
      EN: 'Order summary',
    },
    TOTAL: {
      KO: '총 결제비',
      EN: 'Total',
    },
    PRODUCT: {
      KO: '상품명',
      EN: 'Product',
    },
    QUANTITY: {
      KO: '수량',
      EN: 'Quantity',
    },
    ORDER_TOTAL: {
      KO: '주문 종합',
      EN: 'Order Total',
    },
    TOTAL_PRICE: {
      KO: '총 주문금액',
      EN: 'Total order price',
    },
    SHIPPING_COST: {
      KO: '배송비',
      EN: 'Shipping cost',
    },
    TOTAL_PRODUCT: {
      KO: '총 상품가격',
      EN: 'Total product price',
    },
    TOTAL_SHIPPING: {
      KO: '총 배송비',
      EN: 'Total shipping cost',
    },
    COUPON_DISCOUNT: {
      KO: '쿠폰 할인',
      EN: 'Coupon Discount Amount',
    },
    REDEEMING_MILES: {
      KO: '적립금 사용',
      EN: 'Redeeming Miles',
    },
    CHECK_OUT: {
      KO: '결제하기',
      EN: 'Check Out',
    },
    PAYMENT_METHOD: {
      KO: '결제방법',
      EN: 'Payment method',
    },
    COUPON_DISCOUNTS: {
      KO: '쿠폰할인',
      EN: 'Coupon discounts',
    },
    REWARD_COINS: {
      KO: '적립금 사용',
      EN: 'Reward coins',
    },
    COIN: {
      KO: '코인',
      EN: 'coin',
    },
    FULL_USE: {
      KO: '전체사용',
      EN: 'Full use',
    },
  },
  BANNERS: {
    UPLOAD_TITLE_IMAGE: {
      KO: '업로드 대표 이미지',
      EN: 'Upload a title image',
    },
    REQUEST_BANNER: {
      KO: '배너 요청',
      EN: 'Request a banner',
    },
    POSITION: {
      KO: '배너 위치',
      EN: 'Position',
    },
    NAME: {
      KO: '배너명',
      EN: 'Name',
    },
    PERIOD: {
      KO: '기간',
      EN: 'Period',
    },
    IMAGE: {
      KO: '이미지',
      EN: 'Image',
    },
    BANNER_IMAGE: {
      KO: '배너 이미지',
      EN: 'Banner image',
    },
    BANNER_LINK: {
      KO: '배너 링크',
      EN: 'Banner link',
    },
    NAVIGATE_TO_PAGE: {
      KO: '페이지 이동',
      EN: 'Navigate to a page',
    },
    FLOATING_NEW_WINDOW: {
      KO: '새창 열기',
      EN: 'floating a new window',
    },
    LINK_TARGET: {
      KO: '배너 타겟',
      EN: 'Link target',
    },
    AUTHORIZATION: {
      KO: '허가 여부',
      EN: 'Authorization',
    },
    AUTHORIZED: {
      KO: '허가',
      EN: 'Authorized',
    },
    UNAPPROVED: {
      KO: '불허가',
      EN: 'Unapproved',
    },
    DATE_REQUEST: {
      KO: '요청 날짜',
      EN: 'Date of request',
    },
    ACTION: {
      KO: '액션',
      EN: 'Action',
    },
    PREVIEW: {
      KO: '미리보기',
      EN: 'Preview',
    },
    BANNER_PREVIEW: {
      KO: '배너 미리보기',
      EN: 'Banner preview',
    },
    MAKE_REQUEST: {
      KO: '생성 요청',
      EN: 'Make a request',
    },
    MODIFY_REQUEST: {
      KO: '수정 요청',
      EN: 'Modify a request',
    },
  },

  PROMOTIONS: {
    REQUEST_PROMOTION: {
      KO: '프로모션 요청',
      EN: 'Request a promotion',
    },
    MAKE_REQUEST: {
      KO: '생성 요청',
      EN: 'Make a request',
    },
    MODIFY_REQUEST: {
      KO: '수정 요청',
      EN: 'Modify a request',
    },
    NUMBER: {
      KO: '번호',
      EN: 'Number',
    },
    TITLE: {
      KO: '제목',
      EN: 'Title',
    },
    PERIOD: {
      KO: '기간',
      EN: 'Period',
    },
    AUTHORIZATION: {
      KO: '승인 여부',
      EN: 'Authorization',
    },
    DATE_REQUEST: {
      KO: '요청 날짜',
      EN: 'Date of request',
    },
    AUTHORIZED: {
      KO: '허가',
      EN: 'Authorized',
    },
    UNAPPROVED: {
      KO: '불허가',
      EN: 'Unapproved',
    },
    SHOW_MAIN_SCREEN_OR_NOT: {
      KO: '메인 화면 표시 여부',
      EN: 'Show main screen or not',
    },
    EXPOSURE: {
      KO: '노출',
      EN: 'Exposure',
    },
    UNEXPOSED: {
      KO: '숨김',
      EN: 'Unexposed',
    },
    PROMOTION_TITLE: {
      KO: '프로모션 제목',
      EN: 'Promotion title',
    },
    PH_PROMOTION_TITLE: {
      KO: '프로모션 제목을 입력해주세요',
      EN: 'Enter a promotion title',
    },
    PROMOTION_CONTENTS: {
      KO: '프로모션 내용',
      EN: 'Promotion contents',
    },
    RESTRICT_ACCESS: {
      KO: '접근 제한 여부',
      EN: 'Restrict access ',
    },
    RESTRICTED_ACCESS: {
      KO: '접근 제한',
      EN: 'Restricted Access',
    },
    NO_RESTRICTIONS: {
      KO: '제한 없음',
      EN: 'No restrictions',
    },
    RESTRICTED_ACCESS: {
      KO: '접근 제한',
      EN: 'Restricted Access',
    },
    REPRESENTATIVE_IMAGE: {
      KO: '대표 이미지',
      EN: 'Representative image',
    },
    RELATED_PRODUCT: {
      KO: '관련 제품',
      EN: 'Related product',
    },
    SELECT_RELATED_PRODUCT: {
      KO: '관련 제품을 선택해주세요',
      EN: 'Select a related product',
    },
    UPLOAD_TITLE_IMAGE: {
      KO: '업로드 대표 이미지',
      EN: 'Upload a title image',
    },
    ORDER: {
      KO: '주문',
      EN: 'Order',
    },
    BRAND: {
      KO: '브랜드',
      EN: 'Brand',
    },
    INVENTORY: {
      KO: '장바구니',
      EN: 'Inventory',
    },
    DECISION_ADMIN_SCREEN: {
      KO: '* 배너 허용 여부는 관리자 화면에서 결정됩니다.',
      EN: '* The decision to allow banners is made on the admin screen.',
    },
    REGISTERED_PRODUCTS: {
      KO: '등록된 상품',
      EN: 'Registered products',
    },
  },

  SETTLEMENT: {
    PERIOD: {
      KO: '기간',
      EN: 'Period',
    },
    TOTAL_SETTLEMENT: {
      KO: '총 정산',
      EN: 'Total settlement',
    },
    WAIT_FOR_SETTLEMENT: {
      KO: '정산 대기',
      EN: 'Wait for settlement',
    },
    CANCEL_SETTLEMENT: {
      KO: '정산 취소',
      EN: 'Canceled settlement',
    },
    SALES_AMOUNT: {
      KO: '매출액',
      EN: 'Sales amount',
    },
    SETTLED: {
      KO: '정산 완료',
      EN: 'Settled',
    },
    BRAND: {
      KO: '브랜드',
      EN: 'Brand',
    },
    INVENTORY: {
      KO: '장바구니',
      EN: 'Inventory',
    },
    TOTAL_PRODUCT_AMOUNT: {
      KO: '상품금액',
      EN: 'Product Amount',
    },
    TOTAL_DISCOUNT_AMOUNT: {
      KO: '총 할인금액',
      EN: 'Discount amount',
    },
    QUANTITY: {
      KO: '수량',
      EN: 'Quantity',
    },
    SETTLEMENT_MONEY: {
      KO: '정산금액',
      EN: 'Settlement Amount',
    },
    COMMISSION_FEE: {
      KO: '수수료',
      EN: 'Commission Fee',
    },
    COUPON_DISCOUNT: {
      KO: '쿠폰할인',
      EN: 'Coupon discount',
    },
    REWARD_AMOUNT: {
      KO: '적립할인',
      EN: 'Reward discount',
    },
    BUNDLE_DISCOUNT: {
      KO: '묶음할인',
      EN: 'Bundle discount',
    },
    BUYER: {
      KO: '구매자',
      EN: 'Buyer',
    },
    SETTLEMENT_STATUS: {
      KO: '정산상태',
      EN: 'Settlement status',
    },
    SALES_DATE: {
      KO: '판매일시',
      EN: 'Sales date',
    },
  },

  INQUIRIES: {
    WAIT_ANSWER: {
      KO: '답변대기',
      EN: 'Wait for an answer',
    },
    ANSWERED: {
      KO: '답변완료',
      EN: 'Answered',
    },
    INQUIRER: {
      KO: '문의자',
      EN: 'Inquirer',
    },
    INQUIRIES: {
      KO: '문의 내용',
      EN: 'Inquiries',
    },
    STATUS: {
      KO: '문의 상태',
      EN: 'Status',
    },
    CONTACT_LOG: {
      KO: '문의 기록',
      EN: 'Contact log',
    },
    WAITING: {
      KO: '대기중',
      EN: 'Waiting',
    },
    DONE: {
      KO: '완료',
      EN: 'Done',
    },
  },
  REVIEWS: {
    WAIT_ANSWER: {
      KO: '답변대기',
      EN: 'Wait for an answer',
    },
    ANSWERED: {
      KO: '답변완료',
      EN: 'Answered',
    },
    INQUIRER: {
      KO: '작성자',
      EN: 'Author',
    },
    RATING: {
      KO: '별점',
      EN: 'Rating',
    },
    STATUS: {
      KO: '답변 상태',
      EN: 'Status',
    },
    CONTACT_LOG: {
      KO: '작성 일시',
      EN: 'Contact log',
    },
    WAITING: {
      KO: '대기중',
      EN: 'Waiting',
    },
    DONE: {
      KO: '완료',
      EN: 'Done',
    },
    DONE: {
      KO: '평가내용',
      EN: 'Done',
    },
  },

  // 주소관련
  ADDRESS_SEARCH: {
    KO: '주소 검색',
    EN: 'Address Search',
  },
  ADDRESS: {
    KO: '주소',
    EN: 'Address',
  },
  PH_ADDR_1: {
    KO: '주소 1',
    EN: 'Address 1',
  },
  PH_ADDR_2: {
    KO: '주소 2',
    EN: 'Address 2',
  },
  CITY: {
    KO: '도시/군/구',
    EN: 'City',
  },
  STATE: {
    KO: '동/면/읍',
    EN: 'State',
  },
  POSCAL_CODE: {
    KO: '우편번호',
    EN: 'Poscal Code',
  },
  COUNTRY: {
    KO: '국가',
    EN: 'Country',
  },
  PH_STREET_ADDRESS: {
    KO: '도로명 주소',
    EN: 'Street address',
  },
  PH_ETC_ADDRESS: {
    KO: '상세주소',
    EN: 'Apartment, suite, etc.',
  },
  PH_ZIP_CODE: {
    KO: '우편번호',
    EN: 'Zip code',
  },

  // 배너 버튼
  VIEW_ALL: {
    KO: '전체보기',
    EN: 'View All',
  },
  GO_TO_BRAND_HOME: {
    KO: '브랜드 보기',
    EN: 'Go to Brand Home',
  },
  // 주문 페이지

  ORDER_ADDR_1: {
    KO: '주소 1',
    EN: 'Address 1',
  },
  ORDER_ADDR_2: {
    KO: '주소 2',
    EN: 'Address 2',
  },
  ORDER_STREET_ADDRESS: {
    KO: '도로명 주소',
    EN: 'Street address',
  },
  ORDER_ETC_ADDRESS: {
    KO: '상세주소',
    EN: 'Apartment, suite, etc.',
  },
  ORDER_ZIP_CODE: {
    KO: '우편번호',
    EN: 'Zip code',
  },
  // 브랜드
  BEST_BRAND: {
    KO: '베스트 브랜드',
    EN: 'Best Brand',
  },
  NEW_BRAND: {
    KO: '새로운 브랜드',
    EN: 'New Brand',
  },
  BRAND_INFO: {
    KO: '브랜드 정보',
    EN: 'Brand info',
  },
  BRAND_PRODUCT: {
    KO: '브랜드 상품',
    EN: 'Brand product',
  },
  SEE_OTHER_BRANDED_PRODUCTS: {
    KO: '다른 브랜드 제품 보기',
    EN: 'See other branded products',
  },
  PRODUCT_INFO: {
    KO: '상품 정보',
    EN: 'Product info',
  },
  PRODUCT_INQUIRY: {
    KO: '상품 문의',
    EN: 'Product inquiry',
  },
  // 브랜드 상품 추가
  RETURN_TO_CART: {
    KO: '장바구니로 돌아가기',
    EN: 'Return to cart',
  },
  PURCHASE_MINIMUM: {
    KO: '구매 최소금액',
    EN: 'Purchase minimum',
  },
  MINIMUM: {
    KO: '최소금액',
    EN: 'Minimum',
  },
  MSRP: {
    KO: '권장소비자가격',
    EN: 'MSRP',
  },
  SHIPPING: {
    KO: '배송',
    EN: 'Shipping',
  },
  EXCHANGES: {
    KO: '교환',
    EN: 'Exchanges',
  },
  RETURNS: {
    KO: '반품',
    EN: 'Returns',
  },
  // 기본
  ITEMS: {
    KO: '개의 상품',
    EN: 'items',
  },
  NEXT: {
    KO: '다음',
    EN: 'Next',
  },
  FILTER: {
    KO: '필터',
    EN: 'Filters',
  },
  RESET: {
    KO: '초기화',
    EN: 'Reset',
  },
  MOCRA_FDA_REGISTERED: {
    KO: '모크라 / FDA 등록 여부',
    EN: 'MoCRA FDA Registered',
  },
  TYPE: {
    KO: '타입',
    EN: 'Type',
  },
  ALL: {
    KO: '전체',
    EN: 'All',
  },
  DRY: {
    KO: 'Dry',
    EN: 'Dry',
  },
  OILY: {
    KO: 'Oily',
    EN: 'Oily',
  },
  SENSITIVE: {
    KO: 'Sensitive',
    EN: 'Sensitive',
  },
  ACNE: {
    KO: 'Acne',
    EN: 'Acne',
  },
  NORMAL: {
    KO: 'Normal',
    EN: 'Normal',
  },
  PAGE_NOT_FOUND: {
    KO: '페이지를 찾을수 없습니다.',
    EN: 'Page Not Found',
  },

  CATEGORY: { ...CATEGORY },
  ERR_MSG: { ...ERR_MSG },
};

const COUNTRY = {
  COUNTRY_INFO: {
    KR: {
      // 대한민국
      KO: '대한민국',
      EN: 'South Korea',
      CODE: 'KR', // 나라 코드 값
      TYPE: 1,
      LANG: 'ko', // 주 언어 (한국어)
    },
    US: {
      // 미국
      KO: '미국',
      EN: 'United States',
      CODE: 'US', // 나라 코드 값
      TYPE: 2,
      LANG: 'en', // 주 언어 (영어)
    },
    /*
    JP: {
      // 일본
      KO: '일본',
      EN: 'Japan',
      CODE: 'JP', // 나라 코드 값
      LANG: 'ja', // 주 언어 (일본어)
    },
    CN: {
      // 중국
      KO: '중국',
      EN: 'China',
      CODE: 'CN', // 나라 코드 값
      LANG: 'zh', // 주 언어 (중국어)
    },
    GB: {
      // 영국
      KO: '영국',
      EN: 'United Kingdom',
      CODE: 'GB', // 나라 코드 값
      LANG: 'en', // 주 언어 (영어)
    },
    FR: {
      // 프랑스
      KO: '프랑스',
      EN: 'France',
      CODE: 'FR', // 나라 코드 값
      LANG: 'fr', // 주 언어 (프랑스어)
    },
    DE: {
      // 독일
      KO: '독일',
      EN: 'Germany',
      CODE: 'DE', // 나라 코드 값
      LANG: 'de', // 주 언어 (독일어)
    },
    CA: {
      // 캐나다
      KO: '캐나다',
      EN: 'Canada',
      CODE: 'CA', // 나라 코드 값
      LANG: 'en', // 주 언어 (영어)
    },
    AU: {
      // 호주
      KO: '호주',
      EN: 'Australia',
      CODE: 'AU', // 나라 코드 값
      LANG: 'en', // 주 언어 (영어)
    },
    IN: {
      // 인도
      KO: '인도',
      EN: 'India',
      CODE: 'IN', // 나라 코드 값
      LANG: 'hi', // 주 언어 (힌디어)
    },
    RU: {
      // 러시아
      KO: '러시아',
      EN: 'Russia',
      CODE: 'RU', // 나라 코드 값
      LANG: 'ru', // 주 언어 (러시아어)
    },
    ES: {
      // 스페인
      KO: '스페인',
      EN: 'Spain',
      CODE: 'ES', // 나라 코드 값
      LANG: 'es', // 주 언어 (스페인어)
    },
    IT: {
      // 이탈리아
      KO: '이탈리아',
      EN: 'Italy',
      CODE: 'IT', // 나라 코드 값
      LANG: 'it', // 주 언어 (이탈리아어)
    },
    MX: {
      // 멕시코
      KO: '멕시코',
      EN: 'Mexico',
      CODE: 'MX', // 나라 코드 값
      LANG: 'es', // 주 언어 (스페인어)
    },
    BR: {
      // 브라질
      KO: '브라질',
      EN: 'Brazil',
      CODE: 'BR', // 나라 코드 값
      LANG: 'pt', // 주 언어 (포르투갈어)
    },
    */
  },
};

const COUNTRY_LIST = Object.values(COUNTRY.COUNTRY_INFO);

export { LANGUAGES, COUNTRY, COUNTRY_LIST };
