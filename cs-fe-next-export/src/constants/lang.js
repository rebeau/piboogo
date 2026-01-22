import { ERROR_NOT_FOUND_EMAIL, ERROR_NOT_MATCH_EMAIL } from './error';

// localeText({...})

const LANGUAGES = {
  COMMON: {
    LOGOUT: {
      KO: '로그아웃',
      EN: 'Logout',
    },
    ALL: {
      KO: '전체',
      EN: 'All',
    },
    PRICE: {
      KO: '금액',
      EN: 'Price',
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
    AVAILABLE: {
      KO: '이용가능',
      EN: 'Available',
    },
    PAYMENT_WATING: {
      KO: '결제대기',
      EN: 'Payment\nwating',
    },
    PAYMENT_COMPLETED: {
      KO: '결제완료',
      EN: 'Payment\ncompleted',
    },
    REFUND_REQUEST: {
      KO: '환불요청',
      EN: 'Refund request',
    },
    REFUND_COMPLETED: {
      KO: '환불완료',
      EN: 'Refund\ncompleted',
    },
    PREPARING_FOR_SHIPMENT: {
      KO: '배송준비',
      EN: 'Preparing for shipment',
    },
    AUTHORIZED: {
      KO: '허가',
      EN: 'Authorized',
    },
    UNAUTHORIZED: {
      KO: '허가안함',
      EN: 'Unauthorized',
    },
    ALLOWED: {
      KO: '허용',
      EN: 'Allowed',
    },
    NOT_ALLOWED: {
      KO: '허용안함',
      EN: 'Not Allowed',
    },
    PREPARING: {
      KO: '배송준비',
      EN: 'Preparing',
    },
    START_SHIPPING: {
      KO: '배송시작',
      EN: 'Start shipping',
    },
    DOMESTIC_SHIPPING: {
      KO: '국내배송',
      EN: 'Domestic shipping',
    },
    DELIVERED: {
      KO: '배송완료',
      EN: 'Delivered',
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
    DELIVERY_DATE: {
      KO: '배송일정',
      EN: 'Delivery date',
    },
  },

  INFO_MSG: {
    USER_NOT_LOGIN: {
      KO: '로그인이 필요합니다.\n로그인 화면으로 이동합니다.',
      EN: 'User account session expired.\nGo to the login screen.',
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
    UNDEFINED_ERROR: {
      KO: '정의되지 않은 오류입니다.\n관리자에게 문의하세요',
      EN: 'Undefined error. Contact your administrator',
    },
    DELETE_CATEGORY: {
      KO: '카테고리를 삭제하면 하위 카테고리도 삭제됩니다.\n삭제하시겠습니까?',
      EN: 'If you delete a category, the subcategories are also deleted.\nDo you want to delete it?',
    },
    // 로그인 페이지
    NOT_FOUND_EMAIL: {
      KO: '이메일을 입력해주세요.',
      EN: 'Please enter your email.',
    },
    NOT_MATCH_EMAIL: {
      KO: '이메일 형태를 확인해주세요.',
      EN: 'Please check the email.',
    },
    CHECK_USER_INFO: {
      CODE: 10003,
      KEY: 'CHECK_USER_INFO',
      KO: '아이디 또는 비밀번호를 확인해주세요.',
      EN: 'Please check your ID or password.',
    },

    NOT_FOUND_PASSWORD: {
      CODE: 10004,
      KEY: 'NOT_FOUND_PASSWORD',
      KO: '비밀번호를 입력해주세요.',
      EN: 'Please enter your password.',
    },
    NOT_MATCH_PASSWORD: {
      CODE: 10005,
      KEY: 'NOT_MATCH_PASSWORD',
      KO: '비밀번호를 확인해주세요.',
      EN: 'Please check the password.',
    },
    NOT_FOUND_OLD_PASSWORD: {
      CODE: 10006,
      KEY: 'NOT_FOUND_OLD_PASSWORD',
      KO: '기존 비밀번호를 입력해주세요.',
      EN: 'PPlease enter your old password.',
    },
    NOT_MATCH_OLD_PASSWORD: {
      CODE: 10007,
      KEY: 'NOT_MATCH_OLD_PASSWORD',
      KO: '기존 비밀번호를 확인해주세요.',
      EN: 'Please check your old password.',
    },
    NOT_FOUND_NEW_PASSWORD: {
      CODE: 10008,
      KEY: 'NOT_FOUND_NEW_PASSWORD',
      KO: '새로운 비밀번호를 입력해주세요.',
      EN: 'Please enter a new password.',
    },
    NOT_MATCH_NEW_PASSWORD: {
      CODE: 10009,
      KEY: 'NOT_MATCH_NEW_PASSWORD',
      KO: '새로운 비밀번호를 확인해주세요.',
      EN: 'Please check the new password.',
    },
    NOT_MATCH_NEW_PASSWORD_CHECK: {
      CODE: 10010,
      KEY: 'NOT_MATCH_NEW_PASSWORD_CHECK',
      KO: '새로운 비밀번호가 일치하지 않습니다.',
      EN: 'New password does not match.',
    },
    NOT_FOUND_NAME: {
      CODE: 10011,
      KEY: 'NOT_FOUND_NAME',
      KO: '이름을 입력해주세요.',
      EN: 'Please enter your name.',
    },
    NOT_FOUND_PHONE: {
      CODE: 10012,
      KEY: 'NOT_FOUND_PHONE',
      KO: '전화번호를 입력해주세요.',
      EN: 'Please enter your phone.',
    },

    NOT_MATCH_PHONE: {
      CODE: 10013,
      KEY: 'NOT_MATCH_PHONE',
      KO: '전화번호를 확인해주세요.',
      EN: 'Please check the phone.',
    },

    NOT_SELECT_BUSINESS_TYPE: {
      CODE: 10014,
      KEY: 'NOT_FOUND_BUSINESS_TYPE',
      KO: '사업자 업종을 선택해주세요.',
      EN: 'Please select your business type.',
    },
    NOT_FOUND_BUSINESS_NUMBER: {
      CODE: 10015,
      KEY: 'NOT_FOUND_BUSINESS_NUMBER',
      KO: '사업자번호를 입력해주세요.',
      EN: 'Please enter your business number.',
    },
    NOT_FOUND_VERIFICATION_CODE: {
      CODE: 10016,
      KEY: 'NOT_FOUND_VERIFICATION_CODE',
      KO: '인증번호를 입력해주세요.',
      EN: 'Please enter your verify code.',
    },
    NOT_FOUND_ZIP_CODE: {
      CODE: 10017,
      KEY: 'NOT_FOUND_ZIP_CODE',
      KO: '우편번호를 입력해주세요.',
      EN: 'Please enter your zip code.',
    },
    NOT_FOUND_CITY: {
      CODE: 10018,
      KEY: 'NOT_FOUND_CITY',
      KO: '도시를 입력해주세요.',
      EN: 'Please enter your city.',
    },
    NOT_FOUND_STATE: {
      CODE: 10019,
      KEY: 'NOT_FOUND_STATE',
      KO: '도시/군/구를 입력해주세요.',
      EN: 'Please enter your state.',
    },
    NOT_FOUND_ADDRESS: {
      CODE: 10020,
      KEY: 'NOT_FOUND_ADDRESS',
      KO: '주소를 입력해주세요.',
      EN: 'Please enter your address.',
    },
    SEE_THE_CATEGORY: {
      KO: '* 필요한 카테고리가 보이지 않으면 admin@gmail.com 으로 연락해 주세요',
      EN: "* If you don't see the category you need, please contact admin@gmail.com",
    },
    RECOMMENDED_IMAGE_SIZES: {
      KO: '* 권장 이미지 크기',
      EN: '* Recommended image sizes',
    },
    SELECT_COUPON_TARGET: {
      KO: '쿠폰 발급 대상자를 선택해주세요',
      EN: 'Please choose the person who will issue the coupon.',
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
    NO_QUESTION: {
      KO: '질문을 입력해주세요.',
      EN: 'Please enter the question.',
    },
    NO_ANSWER: {
      KO: '답변을 작성해주세요.',
      EN: 'Please enter the answer.',
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
    WOULD_MODIFY_SETTLEMENT: {
      KO: '정산 금액을 수정하시겠습니까?',
      EN: 'Would you like to modify the settlement amount?',
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
    NOT_APPLICABLE: {
      KO: '해당없음',
      EN: 'Not applicable',
    },
    NOT_APPLICABLE: {
      KO: '해당없음',
      EN: 'Not applicable',
    },
    NOT_FOUND_POST: {
      KO: '게시글을 찾을 수 없습니다.',
      EN: 'Post not found.',
    },
    NOT_FOUND_SETTLEMENT: {
      KO: '정산내역을 찾을 수 없습니다.',
      EN: 'Settlement history not found.',
    },
    NOT_DELETE_POST: {
      KO: '게시글 권한이 없습니다.',
      EN: 'You do not have permission to post.',
    },
    ISSUE_COUPON: {
      KO: '쿠폰을 발급하시겠습니까?',
      EN: 'Would you like to issue a coupon?',
    },
    DELETE_NOTICE: {
      KO: '선택 공지사항을 삭제하시겠습니까?',
      EN: 'Are you sure you want to delete the selection notice?',
    },
    DELETE_QUESTION: {
      KO: '선택 질문을 삭제하시겠습니까?',
      EN: 'Are you sure you want to delete the selection question?',
    },
    DELETE_COUPON: {
      KO: '쿠폰을 삭제하시겠습니까?',
      EN: 'Are you sure you want to\ndelete the coupon?',
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
    SELECT_AN_ONLY_ORDER: {
      KO: '하나의 주문건만 선택해 주세요',
      EN: 'Please select only one order',
    },
    SELECT_AN_ORDER: {
      KO: '하나의 주문을 선택해 주세요',
      EN: 'Please select order',
    },
    SELECT_AN_OPTION: {
      KO: '옵션을 선택해 주세요',
      EN: 'Please select an option',
    },
    ENTER_BRAND_NAME: {
      KO: '브랜드명을 입력해주세요',
      EN: 'Please enter an brand name',
    },
    ENTER_OPTION_NAME: {
      KO: '옵션명을 입력해주세요',
      EN: 'Please enter an option name',
    },
    SELECT_QUESTION: {
      KO: '질문을 선택해주세요.',
      EN: 'Please select a question.',
    },
    SELECT_NOTICE: {
      KO: '공지사항을 선택해주세요.',
      EN: 'Please select a notice.',
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
    NOT_SEARCHED: {
      KO: '검색결과가 없습니다.',
      EN: 'Search results not found.',
    },
    NO_CATEGORIES_FOUND: {
      KO: '조회된 카테고리가 없습니다.',
      EN: 'No categories found.',
    },
    NO_COUPON_FOUND: {
      KO: '등록된 쿠폰이 없습니다.',
      EN: 'No registered coupons found.',
    },
    NO_BUYER_FOUND: {
      KO: '조회된 바이어가 없습니다.',
      EN: 'There are no viewed buyers.',
    },
    NO_ITEM_SEARCHED: {
      KO: '조회된 상품이 없습니다.',
      EN: 'No item has been searched.',
    },
    NO_ORDER_DETAILS: {
      KO: '주문내역이 없습니다',
      EN: 'There is no order details.',
    },
    NO_SALES_DETAILS: {
      KO: '판매내역이 없습니다',
      EN: 'There is no sales details.',
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
    ENTER_THE_CONTENT: {
      KO: '내용을 입력해주세요',
      EN: 'Enter the content',
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
    MORE_THAN_ZERO_COINS: {
      KO: '0코인 이상이어야 합니다.',
      EN: 'It must be more than zero coins.',
    },
    MULTIPLE_USERS: {
      KO: '코인이 서로 다르기 때문에 주의가 필요합니다.',
      EN: 'Coin vary between users, so caution is required.',
    },
    SELECT_PRODUCT_MSG: {
      KO: '상품을 선택해 주세요',
      EN: 'Please select an product',
    },
    SELECT_POST: {
      KO: '게시글을 선택해 주세요',
      EN: 'Please select an post',
    },
    SELECT_PROMOTION_MSG: {
      KO: '프로모션을 선택해 주세요',
      EN: 'Please select an promotion',
    },
    DELETE_PRODUCT_MSG: {
      KO: '상품을 삭제하시겠습니까?',
      EN: 'Are you sure you want to delete the product?',
    },
    DELETE_BANNER_MSG: {
      KO: '배너를 삭제하시겠습니까?',
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
    DISCOUNT_MSG_TYPE1: {
      KO: '@EA@개 이상 구매시 @PRICE@% 할인',
      EN: '@PRICE@% off when you buy @EA@ or more',
    },
    COUPON_MSG_TYPE1: {
      KO: '전체 주문에서 @PRICE@ 할인 받기',
      EN: 'Get @PRICE@ off your entire order',
    },
    COUPON_MSG_TYPE2: {
      KO: '전체 주문에서 @PRICE@% 할인 받기',
      EN: 'Get @PRICE@% off your entire order',
    },
    CANCEL_SELLER: {
      KO: '파트너 셀러를 취소하시겠습니까?',
      EN: 'Are you sure you want to cancel your partner seller?',
    },
    SELECT_A_SELLER: {
      KO: '셀러를 선택해주세요',
      EN: 'Please select a seller',
    },
    SELECT_A_BEST_SELLER: {
      KO: '선정된 판매자를 베스트셀러로 지정하시겠습니까?',
      EN: 'Would you like to appoint the selected seller as a bestseller?',
    },
    SELECT_NO_BEST_SELLER: {
      KO: '베스트셀러로 선정된 판매자가 없습니다.',
      EN: 'No sellers have been selected as BestSellers.',
    },
    DELETE_A_BEST_SELLER: {
      KO: '선택한 베스트셀러를 취소하시겠습니까?',
      EN: 'Are you sure you want to cancel the selected bestseller?',
    },
    DELETE_USER: {
      KO: '선택한 계정을 삭제하시겠습니까?',
      EN: 'Are you sure you want to delete the selected account?',
    },
    SELECT_USER: {
      KO: '계정을 선택해 주세요',
      EN: 'Please select an account',
    },
    SELECT_BANNER_MSG: {
      KO: '배너를 선택해 주세요',
      EN: 'Please select an banner',
    },
    SELECT_PROMOTION_MSG: {
      KO: '프로모션을 선택해 주세요',
      EN: 'Please select an promotion',
    },
    UNAUTHORIZED_BANNER_MSG: {
      KO: '선택한 배너 권한을 취소하시겠습니까?',
      EN: 'Do you want to revoke the selected banner permission?',
    },
    UNAUTHORIZED_PROMOTION_MSG: {
      KO: '선택한 프로모션 권한을 취소하시겠습니까?',
      EN: 'Do you want to revoke the selected promotion permission?',
    },
  },
  SERVICE: {
    NOT_SERVICE: {
      CODE: 20000,
      KEY: 'NOT_SERVICE',
      KO: '현재 서비스를 지원하지 않습니다.',
      EN: 'This service is not supported.',
    },
    NOT_SERVICE_PAYMENT: {
      CODE: 20000,
      KEY: 'NOT_SERVICE_PAYMENT',
      KO: '현재 해당 결제서비스를 지원하지 않습니다.',
      EN: 'We do not currently support that payment service.',
    },
    NOT_SELECTED: {
      CODE: 20001,
      KEY: 'NOT_SELECTED',
      KO: '상품을 선택해주세요.',
      EN: 'Please select the product.',
    },
  },

  SERVICE_SIDE_MENU: {
    DASHBOARD: {
      KO: '대시보드',
      EN: 'Dashboard',
    },
    REVENUE_MGMT: {
      KO: '매출 관리',
      EN: 'Revenue Mgmt.',
    },
    SELLER_MGMT: {
      KO: 'Seller 관리',
      EN: 'Seller Mgmt.',
    },
    BEST_SELLER_MGMT: {
      KO: 'BestSeller 관리',
      EN: 'BestSeller Mgmt.',
    },
    BUYER_MGMT: {
      KO: 'Buyer 관리',
      EN: 'Buyer Mgmt.',
    },
    SETTLEMENT_MGMT: {
      KO: '정산 관리',
      EN: 'Settlement Mgmt.',
    },
    BANNER_MGMT: {
      KO: '배너 관리',
      EN: 'Banner Mgmt.',
    },
    PRODUCT_MGMT: {
      KO: '상품 관리',
      EN: 'Product Mgmt.',
    },
    CATEGORY_MGMT: {
      KO: '카테고리 관리',
      EN: 'Category Mgmt.',
    },
    PROMOTION_MGMT: {
      KO: '프로모션 관리',
      EN: 'Promotion Mgmt.',
    },
    COUPON_MGMT: {
      KO: '쿠폰 관리',
      EN: 'Coupon Mgmt.',
    },
    CREDIT_MGMT: {
      KO: '적립금 관리',
      EN: 'Credit Mgmt.',
    },
    LOUNGE_MGMT: {
      KO: '라운지 관리',
      EN: 'Lounge Mgmt.',
    },
    HELP_CENTER_MGMT: {
      KO: '고객센터 관리',
      EN: 'Help center Mgmt.',
    },
    ADMIN_SETTINGS: {
      KO: '관리자 설정',
      EN: 'Admin Settings',
    },
    //
    PRODUCTS: {
      KO: '상품',
      EN: 'Products',
    },
    SALES: {
      KO: '세일',
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

  CONTENT_HEADER_MENU: {
    DASHBOARD: {
      KO: '대시보드',
      EN: 'Dashboard',
    },
    REVENUE_MGMT: {
      KO: '매출 관리',
      EN: 'Revenue management',
    },
    SELLER_MGMT: {
      KO: 'Seller 관리',
      EN: 'Seller management',
    },
    BEST_SELLER_MGMT: {
      KO: 'BestSeller 관리',
      EN: 'BestSeller management',
    },
    BUYER_MGMT: {
      KO: 'Buyer 관리',
      EN: 'Buyer management',
    },
    SETTLEMENT_MGMT: {
      KO: '정산 관리',
      EN: 'Settlement management',
    },
    BANNER_MGMT: {
      KO: '배너 관리',
      EN: 'Banner management',
    },
    PRODUCT_MGMT: {
      KO: '상품 관리',
      EN: 'Product management',
    },
    CATEGORY_MGMT: {
      KO: '카테고리 관리',
      EN: 'Category management',
    },
    PROMOTION_MGMT: {
      KO: '프로모션 관리',
      EN: 'Promotion management',
    },
    COUPON_MGMT: {
      KO: '쿠폰 관리',
      EN: 'Coupon management',
    },
    CREDIT_MGMT: {
      KO: '적립금 관리',
      EN: 'Credit management',
    },
    LOUNGE_MGMT: {
      KO: '라운지 관리',
      EN: 'Lounge management',
    },
    HELP_CENTER_MGMT: {
      KO: '고객센터 관리',
      EN: 'Help center management',
    },
    ADMIN_SETTINGS: {
      KO: '관리자 설정',
      EN: 'Admin Settings',
    },
    //
    PRODUCTS: {
      KO: '상품',
      EN: 'Products',
    },
    SALES: {
      KO: '세일',
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
    NUMBER_OF_ORDERS: {
      KO: '주문 수',
      EN: 'Number of orders',
    },
    NUMBER_OF_VISITORS: {
      KO: '방문자 수',
      EN: 'Number of visitors',
    },
    NUMBER_OF_SELLER: {
      KO: 'Seller회원 수',
      EN: 'Number of seller\nsubscribers',
    },
    NUMBER_OF_BUYER: {
      KO: 'Buyer회원 수',
      EN: 'Number of buyer\nsubscribers',
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

  REVENUE: {
    REVENUE: {
      KO: '매출',
      EN: 'Revenue',
    },
    SALES: {
      KO: '판매',
      EN: 'Sales',
    },
    TOTAL_SALES: {
      KO: '총 매출',
      EN: 'Total sales',
    },
    NUMBER_OF_ORDERS: {
      KO: '주문 수',
      EN: 'Number of orders',
    },
    FEES: {
      KO: '수수료',
      EN: 'Fees',
    },
    COUPON_DISCOUNTS: {
      KO: '쿠폰 할인',
      EN: 'Coupon discounts',
    },
    TOTAL_SETTLEMENT: {
      KO: '정산금액',
      EN: 'Total settlement',
    },
    TOTAL_SETTLEMENT: {
      KO: '정산금액',
      EN: 'Total settlement',
    },
    TOTAL_SETTLEMENT: {
      KO: '정산금액',
      EN: 'Total settlement',
    },
    TOTAL_SETTLEMENT: {
      KO: '정산금액',
      EN: 'Total settlement',
    },
    TOTAL_SETTLEMENT: {
      KO: '정산금액',
      EN: 'Total settlement',
    },
    TOTAL_SETTLEMENT: {
      KO: '정산금액',
      EN: 'Total settlement',
    },
    BRAND: {
      KO: '브랜드명',
      EN: 'Brand',
    },
    PRODUCT: {
      KO: '상품',
      EN: 'Product',
    },
    PRICE: {
      KO: '상품금액',
      EN: 'Price',
    },
    QTY: {
      KO: '수량',
      EN: 'Qty',
    },
    SALES: {
      KO: '판매금액',
      EN: 'Sales',
    },
    FEE: {
      KO: '수수료',
      EN: 'Fee',
    },
    COUPON: {
      KO: '쿠폰할인',
      EN: 'Coupon',
    },
    COIN: {
      KO: '적립할인',
      EN: 'Coin',
    },
    SETTLEMENT: {
      KO: '정산 (구매자)',
      EN: 'Settlement (buyer)',
    },
    ORDER_STATUS: {
      KO: '주문 상태',
      EN: 'Order Status',
    },
    DATE_OF_SALE: {
      KO: '판매 날짜',
      EN: 'Date of sale',
    },
    ORDER: {
      KO: '순번',
      EN: 'Order',
    },
    ORDER_NUMBER: {
      KO: '주문번호',
      EN: 'Order\nnumber',
    },
    ORDER_DATE: {
      KO: '주문 날짜',
      EN: 'Order\ndate',
    },
    ORDERER: {
      KO: '주문자',
      EN: 'Orderer',
    },
    TOTAL_ORDER_AMOUNT: {
      KO: '총\n주문금액',
      EN: 'Total order\namount',
    },
    PAYMENT_STATUS: {
      KO: '결제상태',
      EN: 'Payment\nstatus',
    },
    ORDER_STATUS: {
      KO: '주문 상태',
      EN: 'Order status',
    },
  },

  SELLER: {
    SELLER: {
      KO: 'Seller',
      EN: 'Seller',
    },
    MEMBER_EMAIL: {
      KO: '회원 이메일',
      EN: 'Member email ',
    },
    //
    PARTNER_SELECTION: {
      KO: '파트너 선정',
      EN: 'Partner selection',
    },
    SELLER_MEMBERS: {
      KO: 'Seller 회원',
      EN: 'Seller members',
    },
    PARTNER: {
      KO: '파트너',
      EN: 'Partner',
    },
    MEMBER_PERMISSIONS: {
      KO: '회원권한',
      EN: 'Member permissions',
    },
    SELECT_MEMBER_PARTNER: {
      KO: '선택회원 파트너 선정',
      EN: 'Select Member Partner',
    },
    ORDER: {
      KO: '순번',
      EN: 'Order ',
    },
    BUSINESS: {
      KO: '사업자명',
      EN: 'Business',
    },
    BRAND: {
      KO: '브랜드명',
      EN: 'Brand',
    },
    NAME: {
      KO: '회원명',
      EN: 'Name',
    },
    PHONE_NUMBER: {
      KO: '전화번호',
      EN: 'Phone number',
    },
    JOIN_DATE: {
      KO: '가입일',
      EN: 'Join Date',
    },
    FEE_RATES: {
      KO: '수수료율',
      EN: 'Fee rates',
    },
    CUMULATIVE_SALES: {
      KO: '누적판매금액',
      EN: 'Cumulative sales',
    },
    LICENCE: {
      KO: '이용허가',
      EN: 'Licence',
    },
    REORDERING: {
      KO: '정렬',
      EN: 'Reordering',
    },
    MEMBER_PERMISSIONS: {
      KO: '회원 이용 허가',
      EN: 'Member permissions',
    },
    MEMBER_EMAIL: {
      KO: '회원 이메일',
      EN: 'Member email',
    },
    COMMISSION_RATES: {
      KO: '수수료율',
      EN: 'Commission rates',
    },
    CUMULATIVE_SALES_AMOUNT: {
      KO: '누적 매출액',
      EN: 'Cumulative sales amount',
    },
    SELLER_INFORMATION: {
      KO: 'Seller 정보',
      EN: 'Seller Information',
    },
    BUSINESS_NAME: {
      KO: '사업자명',
      EN: 'Business name',
    },
    BUSINESS_BANNER: {
      KO: '사업자 배너',
      EN: 'Business banners',
    },
    BUSINESS_ADDRESS: {
      KO: '주소',
      EN: 'Business Address',
    },
    SETTLEMENT_ACCOUNTS: {
      KO: '계좌정보',
      EN: 'Settlement accounts',
    },
    PASSBOOK_COPIES: {
      KO: '통장사본',
      EN: 'Passbook copies',
    },
    BRAND_NAME: {
      KO: '브랜드명',
      EN: 'Brand name',
    },
    BRAND_LOGO: {
      KO: '브랜드로고',
      EN: 'Brand logo',
    },
    BUSINESS_LICENSE_NUMBER: {
      KO: '사업자번호',
      EN: 'Business license number',
    },
    BUSINESS_LICENSE: {
      KO: '사업자등록증',
      EN: 'Business license',
    },
    SHIPPING_METHODS: {
      KO: '배송방식',
      EN: 'Shipping Methods',
    },
    SYSTEM_CONSIGNMENT_SHIPPING: {
      KO: '시스템 위탁 배송',
      EN: 'System Consignment Shipping',
    },
    DETAILED_DESCRIPTION: {
      KO: '설명',
      EN: 'Detailed description',
    },
    SALES_LIST: {
      KO: '판매목록',
      EN: 'Sales List',
    },
    PRODUCT: {
      KO: '상품명',
      EN: 'Product',
    },
    SALES_AMOUNT: {
      KO: '판매금액',
      EN: 'Sales amount',
    },
    CATEGORY: {
      KO: '카테고리',
      EN: 'Category',
    },
    STATE: {
      KO: '상태',
      EN: 'State',
    },
    STOCK: {
      KO: '수량',
      EN: 'Stock',
    },
    REGISTRATION: {
      KO: '등록일시',
      EN: 'Registration',
    },
    MODIFIED: {
      KO: '수정일시',
      EN: 'Modified',
    },
  },

  BEST_SELLER: {
    ADD: {
      KO: '추가',
      EN: 'Add',
    },
    ADD_SELLER: {
      KO: 'Seller 검색',
      EN: 'Add a seller',
    },
    SELECTING_BESTSELLER: {
      KO: 'BestSeller 선정',
      EN: 'Selecting a BestSeller',
    },
  },

  BUYER: {
    MEMBER_PERMISSIONS: {
      KO: '회원 이용 허가',
      EN: 'Member permissions',
    },
    ORDER: {
      KO: '순번',
      EN: 'Order ',
    },
    MEMBER_EMAIL: {
      KO: '회원 이메일',
      EN: 'Member email',
    },
    NAME: {
      KO: '회원명',
      EN: 'Name',
    },
    MEMBERSHIP: {
      KO: '등급',
      EN: 'Membership',
    },
    PHONE_NUMBER: {
      KO: '전화번호',
      EN: 'Phone number',
    },
    JOIN_DATE: {
      KO: '가입일',
      EN: 'Join Date',
    },
    COUPON: {
      KO: '쿠폰',
      EN: 'Coupon',
    },
    TOTAL_PURCHASE_PRICE: {
      KO: '총 구매금액',
      EN: 'Total purchase price',
    },
    LICENCE: {
      KO: '이용허가',
      EN: 'Licence',
    },
    PURCHASE_LIST: {
      KO: '구매목록',
      EN: 'Purchase list',
    },
    TOTAL_PURCHASE: {
      KO: '총 구매금액',
      EN: 'Total purchase',
    },
    PRODUCT: {
      KO: '상품명',
      EN: 'Product',
    },
    SALES_AMOUNT: {
      KO: '판매금액',
      EN: 'Sales amount',
    },
    CATEGORY: {
      KO: '카테고리',
      EN: 'Category',
    },
    STATE: {
      KO: '주문상태',
      EN: 'State',
    },
    QTY: {
      KO: '수량',
      EN: 'Qty',
    },
    BRAND: {
      KO: '브랜드명',
      EN: 'Brand',
    },
    PURCHASE_DATE: {
      KO: '구매일시',
      EN: 'Purchase Date',
    },
    COUPON_LIST: {
      KO: '구매일시',
      EN: 'Coupon list',
    },
    TITLE: {
      KO: '쿠폰명',
      EN: 'Title',
    },
    CONTENTS: {
      KO: '혜택내용',
      EN: 'Contents',
    },
    REDEMPTION_TERMS: {
      KO: '사용조건',
      EN: 'Redemption Terms',
    },
    USAGE_PERIOD: {
      KO: '사용기간',
      EN: 'Usage period',
    },
    GET_YOUR_ENTIRE_ORDER: {
      KO: '구매금액 할인 @@',
      EN: 'Get @@ off your entire order',
    },
    MINIMUM_PURCHASE: {
      KO: '최소 구매금액',
      EN: 'minimum purchase',
    },
    ISSUE_DATE: {
      KO: '발급일시',
      EN: 'Issue date',
    },
    REWARD_COIN_HISTORY: {
      KO: '적립금 내역',
      EN: 'Reward coin history',
    },
    TOTAL_REWARD_COINS: {
      KO: '총 보유 적립금',
      EN: 'Total Reward coins',
    },
    MODIFY_REWARD_COINS: {
      KO: '적립금 수정',
      EN: 'Modify Reward coins',
    },
    COINS: {
      KO: '코인',
      EN: 'coins',
    },
    TYPE: {
      KO: '타입',
      EN: 'Type',
    },
    REWARD_COIN: {
      KO: '적립금',
      EN: 'Reward coin',
    },
    PH_ENTER_REWARD_COINS: {
      KO: '숫자를 입력해주세요',
      EN: 'Enter a number',
    },
    REASON: {
      KO: '사유',
      EN: 'Reason',
    },
    PH_ENTER_REASON: {
      KO: '사유를 입력해주세요',
      EN: 'Enter a reason',
    },
    PUBLICATION_DATE: {
      KO: '발생일시',
      EN: 'Publication Date',
    },
    DEBITS: {
      KO: '차감',
      EN: 'Debits',
    },
    CREDITS: {
      KO: '지급',
      EN: 'Credits',
    },
    OWNED_COINS: {
      KO: '보유 적립금',
      EN: 'Owned Coins',
    },
    EXPECTED_COINS: {
      KO: '예상 적립금',
      EN: 'Expected coins',
    },
  },

  SETTLEMENT: {
    RETURN_AMOUNT: {
      KO: '리턴비용',
      EN: 'Return amount',
    },
    PERIOD: {
      KO: '기간',
      EN: 'Period',
    },
    TOTAL_SETTLEMENT_AMOUNT: {
      KO: '총 정산금액',
      EN: 'Total settlement amount',
    },
    PENDING_SETTLEMENT: {
      KO: '정산대기',
      EN: 'Pending settlement',
    },
    SETTLEMENT_COMPLETED: {
      KO: '정산완료',
      EN: 'Settlement completed',
    },
    TOTAL_SETTLEMENT: {
      KO: '총 정산금액',
      EN: 'Total settlement',
    },
    ALL: {
      KO: '전체',
      EN: 'All',
    },
    WAIT_FOR_SETTLEMENT: {
      KO: '정산대기',
      EN: 'Wait for settlement',
    },
    SETTLED: {
      KO: '정산완료',
      EN: 'Settled',
    },
    CANCELED: {
      KO: '정산취소',
      EN: 'Canceled',
    },
    INFO_TOTAL_SETTLEMENT: {
      KO: '총 정산금액 = 상품금액 + 쿠폰할인 - 임점수수료\n* 리턴비용은 반품에 해당하는 비용',
      EN: 'Total settlement amount = product value + coupon discount - store fee\n* Return cost is the cost of returning the item',
    },
    MODIFY_STATUS: {
      KO: '상태수정',
      EN: 'Modify status',
    },
    BUSINESS: {
      KO: '사업자명',
      EN: 'Business',
    },
    PRODUCT: {
      KO: '상품명',
      EN: 'Product',
    },
    PRICE: {
      // KO: '상품금액',
      KO: '상품\n금액',
      EN: 'Price',
    },
    QTY: {
      KO: '수량',
      EN: 'Qty',
    },
    SALES: {
      // KO: '판매금액',
      KO: '판매\n금액',
      EN: 'Sales',
    },
    FEE: {
      // KO: '판매 수수료',
      KO: '판매\n수수료',
      EN: 'Fee',
    },
    COUPON: {
      // KO: '쿠폰할인',
      KO: '쿠폰\n할인',
      EN: 'Coupon',
    },
    COIN: {
      // KO: '적립할인',
      KO: '적립\n할인',
      EN: 'Coin',
    },
    SETTLEMENT: {
      // KO: '정산금액',
      KO: '정산\n금액',
      EN: 'Settlement',
    },
    BUYER: {
      KO: 'Buyer',
      EN: 'Buyer',
    },
    SETTLEMENT_STATUS: {
      KO: '정산 상태',
      EN: 'Settlement Status',
    },
    DATE_OF_SALE: {
      KO: '판매 날짜',
      EN: 'Date of sale',
    },
    TOTAL_SETTLEMENT_AMOUNT: {
      KO: '총 정산금액',
      EN: 'Total Settlement Amount',
    },
    SETTLEMENT_ACCOUNT: {
      KO: '정산 계좌',
      EN: 'Settlement account',
    },
    PH_ENTER_RETURN_COST: {
      KO: '리턴비용 입력',
      EN: 'Enter a return cost',
    },
    MODIFY_STATUS: {
      KO: '상태변경',
      EN: 'Modify status',
    },
  },

  BANNER: {
    SELLER_REQUEST_BANNER: {
      KO: '추가',
      EN: 'Seller request banner',
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
      KO: '배너이미지',
      EN: 'Image',
    },
    LINK: {
      // KO: '배너링크',
      KO: '링크',
      EN: 'Link',
    },
    TARGET: {
      KO: '링크타겟',
      EN: 'Target',
    },
    SELLER: {
      KO: 'Seller명',
      EN: 'Seller',
    },
    REQUEST: {
      KO: '요청일시',
      EN: 'Request',
    },
    STATE: {
      KO: '상태',
      EN: 'State',
    },
    AUTHORIZATION: {
      KO: '허가여부',
      EN: 'Authorization',
    },
    REORDERING: {
      KO: '정렬',
      EN: 'Reordering',
    },
    AUTHORIZED_BANNER: {
      KO: '허가된 배너',
      EN: 'Authorized banner',
    },
    CHANGE_STATUS_TO_UNAUTHORIZED: {
      KO: '일괄 미허가',
      EN: 'Change status to Unauthorized',
    },
    NAVIGATE_TO_PAGE: {
      KO: '페이지 이동',
      EN: 'Navigate\nto a page',
    },
    REQUEST_PERMISSION: {
      KO: '권한요청',
      EN: 'Request\npermission',
    },
    SELLER_NAME: {
      KO: 'Seller명',
      EN: 'Seller name',
    },
    DATE_OF_REQUEST: {
      KO: '요청일시',
      EN: 'Date of request',
    },
    BANNER_NAME: {
      KO: '배너명',
      EN: 'Banner name',
    },
    BANNER_LINK: {
      KO: '배너링크',
      EN: 'Banner link',
    },
    LINK_TARGET: {
      KO: '링크타겟',
      EN: 'Link target',
    },
    BANNER_IMAGE: {
      KO: '배너 이미지',
      EN: 'Link target',
    },
    POSITION: {
      KO: '배너위치',
      EN: 'Position',
    },
    BANNER_PERMISSION: {
      KO: '배너 허가여부',
      EN: 'Banner permission',
    },
  },

  PROMOTION: {
    DELETE: {
      KO: '선택삭제',
      EN: 'Delete',
    },
    SELLER_REQUEST_PROMOTION: {
      KO: '배너 허가여부',
      EN: 'Seller request promotion',
    },
    NUMBER: {
      KO: '순번',
      EN: 'Number',
    },
    TITLE: {
      KO: '프로모션 제목',
      EN: 'Title',
    },
    PERIOD: {
      KO: '진행기간',
      EN: 'Period',
    },
    REQUEST: {
      KO: '요청일시',
      EN: 'Request',
    },
    SELLER: {
      KO: 'Seller명',
      EN: 'Seller',
    },
    STATE: {
      KO: '상태',
      EN: 'State',
    },
    AUTHORIZATION: {
      KO: '허가여부',
      EN: 'Authorization',
    },
    AUTHORIZED_PROMOTION: {
      KO: '허가된 프로모션',
      EN: 'Authorized promotion',
    },
    CHANGE_STATUS_TO_UNAUTHORIZED: {
      KO: '선택 미허가',
      EN: 'Change status to Unauthorized',
    },
    USE: {
      KO: '사용',
      EN: 'Use',
    },
    NOT_USED: {
      KO: '사용안함',
      EN: 'Not used',
    },
    PROMOTION_PERMISSION: {
      KO: '프로모션 허가여부',
      EN: 'Promotion permission',
    },
    PERIOD: {
      KO: '기간',
      EN: 'Period',
    },
    SELLER: {
      KO: 'Seller명',
      EN: 'Seller',
    },
    PROMOTION_TITLE: {
      KO: '프로모션명',
      EN: 'Promotion title',
    },
    DATE_OF_REQUEST: {
      KO: '요청 날짜',
      EN: 'Date of request',
    },
    SHOW_MAIN_SCREEN_OR_NOT: {
      KO: '메인 화면 표시 여부',
      EN: 'Show main screen or not',
    },
    NO_ACCESS_RESTRICTIONS: {
      KO: '제한 없음',
      EN: 'No access restrictions',
    },
    RESTRICT_ACCESS: {
      KO: '접근 제한',
      EN: 'Restrict access',
    },
    RESTRICTED_ACCESS: {
      KO: '접근 제한',
      EN: 'Restricted Access',
    },
    REPRESENTATIVE_IMAGE: {
      KO: '대표 이미지',
      EN: 'Representative image',
    },
    RESTRICT_ACCESS: {
      KO: '접근 제한 여부',
      EN: 'Restrict access ',
    },
    EXPOSURE: {
      KO: '노출됨',
      EN: 'Exposure',
    },
    PLATINUM_MEMBERS: {
      KO: '플레티넘 회원',
      EN: 'Platinum members',
    },
    GOLD_MEMBERS: {
      KO: '골드 회원',
      EN: 'Gold members',
    },
    BRONZE_MEMBERS: {
      KO: '브론즈 회원',
      EN: 'Bronze members',
    },
    EMBED_ON_MAIN_SCREEN: {
      KO: '메인화면에 포함',
      EN: 'Embed on main screen',
    },
    CHOOSE_THE_ORDER: {
      KO: '순번을 선택해 주세요',
      EN: 'Please choose the order',
    },
  },

  CATEGORY: {
    CATEGORY: {
      KO: '카테고리',
      EN: 'Category ',
    },
    ADD_A_CATEGORY: {
      KO: '카테고리 추가',
      EN: 'Add a category',
    },
    ADD_A_SUB_CATEGORY: {
      KO: '@ADD@에 새로운 카테고리 추가',
      EN: 'Add a new category to @ADD@',
    },
    ADD_SUB_CATEGORY: {
      KO: 'ㄴ 서브 카테고리 추가',
      EN: 'ㄴ Add sub category',
    },
    ADD_CATEGORY: {
      KO: '+ 카테고리 추가',
      EN: '+ Add category',
    },
    PH_ENTER_CATEGORY: {
      KO: '카테고리를 입력해주세요',
      EN: 'Enter a category.',
    },
    PH_ENTER_SUBCATEGORY: {
      KO: '서브 카테고리를 입력해주세요',
      EN: 'Please enter a name for the subcategory.',
    },
  },

  COUPON: {
    ALL: {
      KO: '전체',
      EN: 'All',
    },
    ORDER: {
      KO: '순번',
      EN: 'Order',
    },
    MEMBER_EMAIL: {
      KO: '회원이메일',
      EN: 'Member email',
    },
    NAME: {
      KO: '회원명',
      EN: 'Name',
    },
    PHONE_NUMBER: {
      KO: '전화번호',
      EN: 'Phone number',
    },
    JOIN_DATE: {
      KO: '가입일',
      EN: 'Join Date',
    },
    COUPON: {
      KO: '쿠폰',
      EN: 'Coupon',
    },
    TOTAL_PURCHASE_PRICE: {
      KO: '구매금액',
      EN: 'Total purchase price',
    },
    ISSUE_COUPON: {
      KO: '쿠폰지급',
      EN: 'Issue coupon',
    },
    MODIFY_COUPON: {
      KO: '쿠폰수정',
      EN: 'Modify coupon',
    },
    ADD_COUPON: {
      KO: '쿠폰추가',
      EN: 'Add coupon',
    },
    TITLE: {
      KO: '쿠폰명',
      EN: 'Title',
    },
    CONTENTS: {
      KO: '혜택내용',
      EN: 'Contents',
    },
    REDEMPTION_TERMS: {
      KO: '사용조건',
      EN: 'Redemption Terms',
    },
    USAGE_PERIOD: {
      KO: '사용기간',
      EN: 'Usage period',
    },
    PERIOD: {
      KO: '사용기간',
      EN: 'Period',
    },
    PURCHASE_DATE: {
      KO: '발급일시',
      EN: 'Purchase Date',
    },
    LATEST_ISSUE_DATE: {
      KO: '최근발급일시',
      EN: 'Latest issue date',
    },
    GET_YOUR_ENTIRE_ORDER: {
      KO: '구매금액 할인 @@',
      EN: 'Get @@ off your entire order',
    },
    MINIMUM_PURCHASE: {
      KO: '최소 구매금액',
      EN: 'minimum purchase',
    },
    COUPON_DETAILS: {
      KO: '쿠폰 상세',
      EN: 'Coupon details',
    },
    BENEFITS: {
      KO: '혜택',
      EN: 'Benefits',
    },
    REDEMPTION_CONDITIONS: {
      KO: '사용조건',
      EN: 'Redemption conditions',
    },
    COUPON_IMAGE: {
      KO: '쿠폰 이미지',
      EN: 'Coupon image',
    },
    PH_ISSUE_COUPON: {
      KO: '해당 쿠폰을 지급하려고 합니다 쿠폰 지급을 진행할까요?',
      EN: 'We are about to issue this coupon. Do you want to proceed?',
    },
    PH_ENTER_COUPON_TITLE: {
      KO: '쿠폰명을 입력해주세요',
      EN: 'Enter a coupon title',
    },
    PH_ENTER_THE_AMOUNT: {
      KO: '금액을 입력해주세요',
      EN: 'Enter the amount',
    },
  },

  CREDIT: {
    ALL_MEMBERS: {
      KO: '추가',
      EN: 'All members',
    },
    NUMBER: {
      KO: '순번',
      EN: 'Number',
    },
    JOIN_DATE: {
      KO: '가입일',
      EN: 'Join Date',
    },
    CREDIT: {
      KO: '적립금',
      EN: 'Credit',
    },
    BATCH_PAYOUTS: {
      KO: '적립금 일괄 지급',
      EN: 'Batch payouts',
    },
    PURCHASE_AMOUNT: {
      KO: '구매금액',
      EN: 'Purchase amount',
    },
  },

  LOUNGE: {
    TYPE: {
      KO: '회원타입',
      EN: 'Type',
    },
    MEMBER_EMAIL: {
      KO: '작성자 ID',
      EN: 'Member email',
    },
    TITLE: {
      KO: '제목',
      EN: 'Title',
    },
    CREATED_ON: {
      KO: '작성일',
      EN: 'Created on',
    },
    VIEWS: {
      KO: '조회수',
      EN: 'Views',
    },
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
    COMMNET: {
      KO: '댓글',
      EN: 'Commnet',
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
      KO: '구인',
      EN: 'Jobs',
    },
    AUTHOR: {
      KO: '작성자',
      EN: 'Author',
    },
    BUYER: {
      KO: '구매자',
      EN: 'Buyer',
    },
    SELLER: {
      KO: '판매자',
      EN: 'Seller',
    },
  },

  HELP: {
    FREQUENTLY_ASKED_QUESTIONS: {
      KO: '자주묻는질문',
      EN: 'Frequently asked questions',
    },
    NOTICES: {
      KO: '공지사항',
      EN: 'Notices',
    },
    DELETE_SELECTION: {
      KO: '선택삭제',
      EN: 'Delete selection',
    },
    MODIFY_CONTENTS: {
      KO: '내용수정',
      EN: 'Modify contents',
    },
    ADD_A_QUESTION: {
      KO: '질문추가',
      EN: 'Add a question',
    },
    WRITE_YOUR_ANSWER: {
      KO: '답변을 작성해주세요.',
      EN: 'Write your answer.',
    },
    WRITE_YOUR_CONTENTS: {
      KO: '내용을 작성해주세요.',
      EN: 'Write your contents.',
    },
    PH_ENTER_TITLE: {
      KO: '제목을 입력해주세요',
      EN: 'Enter a title',
    },
    QUESTION: {
      KO: '질문',
      EN: 'Question',
    },
    MODIFY_A_QUESTION: {
      KO: '질문수정',
      EN: 'Modify a question',
    },
    PH_ENTER_YOUR_CONTENT: {
      KO: '내용을 입력해주세요',
      EN: 'Enter the content',
    },
    ORDER: {
      KO: '순번',
      EN: 'Order',
    },
    MEMBER_EMAIL: {
      KO: '회원 이메일',
      EN: 'Member email',
    },
    TITLE: {
      KO: '제목',
      EN: 'Title',
    },
    CREADTED_ON: {
      KO: '작성일',
      EN: 'Creadted on',
    },
    VIEWS: {
      KO: '조회수',
      EN: 'Views',
    },
    ADD_AN_ANNOUNCEMENT: {
      KO: '작성일',
      EN: 'Add an announcement',
    },
    MODIFY_AN_ANNOUNCEMENT: {
      KO: '작성일',
      EN: 'Modify an announcement',
    },
    REGISTRATION_DATE: {
      KO: '작성일',
      EN: 'Registration Date',
    },
  },

  ADMIN_SETTING: {
    ORDER: {
      KO: '순번',
      EN: 'Order',
    },
    ADMIN_EMAIL: {
      KO: '관리자 이메일',
      EN: 'Admin email',
    },
    NAME: {
      KO: '이름',
      EN: 'Name',
    },
    PASSWORD: {
      KO: '비밀번호',
      EN: 'Password',
    },
    PERMISSION: {
      KO: '권한',
      EN: 'Permission',
    },
    SUPER_ADMIN: {
      KO: '대표 관리자',
      EN: 'Super admin',
    },
    ADMIN: {
      KO: '관리자',
      EN: 'Admin',
    },
    EMAIL: {
      KO: '관리자',
      EN: 'Admin',
    },
    PH_NAME: {
      KO: '이름을 입력해주세요',
      EN: 'Enter a name',
    },
    PH_EMAIL: {
      KO: '이메일을 입력해주세요',
      EN: 'Enter a email',
    },
    PH_PASSWORD: {
      KO: '비밀번호를 입력해주세요',
      EN: 'Enter a password',
    },
    SETTING: {
      KO: '설정',
      EN: 'Setting',
    },
    ADD_ADMIN: {
      KO: '관리자 추가',
      EN: 'Add admin',
    },
    ADD_AN_ADMIN: {
      KO: '관리자 추가',
      EN: 'Add an admin',
    },
    EDIT_ADMIN: {
      KO: '관리자 수정',
      EN: 'Edit admin',
    },
  },

  PRODUCTS: {
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
      KO: '옵션 입력',
      EN: 'Enter option',
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
    PH_PRODUCT_NAME: {
      KO: '상품명을 입력해주세요',
      EN: 'Enter a product name',
    },
    SALES_AMOUNT: {
      KO: '판매가',
      EN: 'Sales amount',
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
        KO: '서비스 동의 동의',
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
      SYSTEM_CONSIGNMENT_SHIPPING: {
        KO: '시스템 위탁 배송',
        EN: 'System Consignment Shipping',
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
    PH_ENTER_REWARD_COINS: {
      KO: '숫자를 입력해주세요',
      EN: 'Enter a number',
    },
    PH_ENTER_REASON: {
      KO: '사유를 입력해주세요',
      EN: 'Enter a reason',
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
      START_SHIPPING: {
        KO: '배송시작',
        EN: 'Start shipping',
      },
      DOMESTIC_SHIPPING: {
        KO: '국내배송',
        EN: 'Domestic shipping',
      },
      DELIVERED: {
        KO: '배송완료',
        EN: 'Delivered',
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
    DELIVERED: {
      KO: '배송완료',
      EN: 'Delivered',
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
      KO: '배너 링크',
      EN: 'Navigate to a page',
    },
    FLOATING_NEW_WINDOW: {
      KO: '배너 링크',
      EN: 'Floating New Window',
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
    PROMOTION_TITLE: {
      KO: '프로모션 제목',
      EN: 'Promotion title',
    },
    PH_PROMOTION_TITLE: {
      KO: '프로모션 제목을 입력해주세요',
      EN: 'Enter a promotion title',
    },
    RESTRICT_ACCESS: {
      KO: '접근 제한 여부',
      EN: 'Restrict access ',
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
      KO: '문의자',
      EN: 'Inquirer',
    },
    RATING: {
      KO: '별점',
      EN: 'Rating',
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

  // 주소관련
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
  ALL: {
    KO: '전체',
    EN: 'All',
  },
  OILY: {
    KO: '유분',
    EN: 'Oily',
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
  PAGE_NOT_FOUND: {
    KO: '페이지를 찾을수 없습니다.',
    EN: 'Page Not Found',
  },
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
