import { ERR_INFO } from './error';

// localeText({...})
const ERR_MSG = {
  ACC: {
    // id, email
    NOT_FOUND_EMAIL: {
      KO: ERR_INFO.ACC.NOT_FOUND_EMAIL.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_EMAIL.EN,
      ZH: ERR_INFO.ACC.NOT_FOUND_EMAIL.ZH,
      ES: ERR_INFO.ACC.NOT_FOUND_EMAIL.ES,
    },
    NOT_MATCH_EMAIL: {
      KO: ERR_INFO.ACC.NOT_MATCH_EMAIL.KR,
      EN: ERR_INFO.ACC.NOT_MATCH_EMAIL.EN,
      ZH: ERR_INFO.ACC.NOT_MATCH_EMAIL.ZH,
      ES: ERR_INFO.ACC.NOT_MATCH_EMAIL.ES,
    },
    CHECK_USER_INFO: {
      KO: ERR_INFO.ACC.CHECK_USER_INFO.KR,
      EN: ERR_INFO.ACC.CHECK_USER_INFO.EN,
      ZH: ERR_INFO.ACC.CHECK_USER_INFO.ZH,
      ES: ERR_INFO.ACC.CHECK_USER_INFO.ES,
    },

    // pw
    NOT_MATCH_PASSWORD: {
      KO: ERR_INFO.ACC.NOT_MATCH_PASSWORD.KR,
      EN: ERR_INFO.ACC.NOT_MATCH_PASSWORD.EN,
      ZH: ERR_INFO.ACC.NOT_MATCH_PASSWORD.ZH,
      ES: ERR_INFO.ACC.NOT_MATCH_PASSWORD.ES,
    },
    NOT_FOUND_PASSWORD: {
      KO: ERR_INFO.ACC.NOT_FOUND_PASSWORD.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_PASSWORD.EN,
      ZH: ERR_INFO.ACC.NOT_FOUND_PASSWORD.ZH,
      ES: ERR_INFO.ACC.NOT_FOUND_PASSWORD.ES,
    },
    NOT_MATCH_OLD_PASSWORD: {
      KO: ERR_INFO.ACC.NOT_MATCH_OLD_PASSWORD.KR,
      EN: ERR_INFO.ACC.NOT_MATCH_OLD_PASSWORD.EN,
      ZH: ERR_INFO.ACC.NOT_MATCH_OLD_PASSWORD.ZH,
      ES: ERR_INFO.ACC.NOT_MATCH_OLD_PASSWORD.ES,
    },
    NOT_FOUND_OLD_PASSWORD: {
      KO: ERR_INFO.ACC.NOT_FOUND_OLD_PASSWORD.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_OLD_PASSWORD.EN,
      ZH: ERR_INFO.ACC.NOT_FOUND_OLD_PASSWORD.ZH,
      ES: ERR_INFO.ACC.NOT_FOUND_OLD_PASSWORD.ES,
    },
    NOT_MATCH_NEW_PASSWORD: {
      KO: ERR_INFO.ACC.NOT_MATCH_NEW_PASSWORD.KR,
      EN: ERR_INFO.ACC.NOT_MATCH_NEW_PASSWORD.EN,
      ZH: ERR_INFO.ACC.NOT_MATCH_NEW_PASSWORD.ZH,
      ES: ERR_INFO.ACC.NOT_MATCH_NEW_PASSWORD.ES,
    },
    NOT_FOUND_NEW_PASSWORD: {
      KO: ERR_INFO.ACC.NOT_FOUND_NEW_PASSWORD.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_NEW_PASSWORD.EN,
      ZH: ERR_INFO.ACC.NOT_FOUND_NEW_PASSWORD.ZH,
      ES: ERR_INFO.ACC.NOT_FOUND_NEW_PASSWORD.ES,
    },
    NOT_MATCH_NEW_PASSWORD_CHECK: {
      KO: ERR_INFO.ACC.NOT_MATCH_NEW_PASSWORD_CHECK.KR,
      EN: ERR_INFO.ACC.NOT_MATCH_NEW_PASSWORD_CHECK.EN,
      ZH: ERR_INFO.ACC.NOT_MATCH_NEW_PASSWORD_CHECK.ZH,
      ES: ERR_INFO.ACC.NOT_MATCH_NEW_PASSWORD_CHECK.ES,
    },

    // name
    NOT_FOUND_NAME: {
      KO: ERR_INFO.ACC.NOT_FOUND_NAME.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_NAME.EN,
      ZH: ERR_INFO.ACC.NOT_FOUND_NAME.ZH,
      ES: ERR_INFO.ACC.NOT_FOUND_NAME.ES,
    },

    // phone
    NOT_FOUND_PHONE: {
      KO: ERR_INFO.ACC.NOT_FOUND_PHONE.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_PHONE.EN,
      ZH: ERR_INFO.ACC.NOT_FOUND_PHONE.ZH,
      ES: ERR_INFO.ACC.NOT_FOUND_PHONE.ES,
    },
    NOT_MATCH_PHONE: {
      KO: ERR_INFO.ACC.NOT_MATCH_PHONE.KR,
      EN: ERR_INFO.ACC.NOT_MATCH_PHONE.EN,
      ZH: ERR_INFO.ACC.NOT_MATCH_PHONE.ZH,
      ES: ERR_INFO.ACC.NOT_MATCH_PHONE.ES,
    },

    // business
    NOT_SELECT_BUSINESS_TYPE: {
      KO: ERR_INFO.ACC.NOT_SELECT_BUSINESS_TYPE.KR,
      EN: ERR_INFO.ACC.NOT_SELECT_BUSINESS_TYPE.EN,
      ZH: ERR_INFO.ACC.NOT_SELECT_BUSINESS_TYPE.ZH,
      ES: ERR_INFO.ACC.NOT_SELECT_BUSINESS_TYPE.ES,
    },
    NOT_FOUND_BUSINESS_NUMBER: {
      KO: ERR_INFO.ACC.NOT_FOUND_BUSINESS_NUMBER.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_BUSINESS_NUMBER.EN,
      ZH: ERR_INFO.ACC.NOT_FOUND_BUSINESS_NUMBER.ZH,
      ES: ERR_INFO.ACC.NOT_FOUND_BUSINESS_NUMBER.ES,
    },

    // verification
    NOT_FOUND_VERIFICATION_CODE: {
      KO: ERR_INFO.ACC.NOT_FOUND_VERIFICATION_CODE.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_VERIFICATION_CODE.EN,
      ZH: ERR_INFO.ACC.NOT_FOUND_VERIFICATION_CODE.ZH,
      ES: ERR_INFO.ACC.NOT_FOUND_VERIFICATION_CODE.ES,
    },

    // address
    NOT_FOUND_ZIP_CODE: {
      KO: ERR_INFO.ACC.NOT_FOUND_ZIP_CODE.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_ZIP_CODE.EN,
      ZH: ERR_INFO.ACC.NOT_FOUND_ZIP_CODE.ZH,
      ES: ERR_INFO.ACC.NOT_FOUND_ZIP_CODE.ES,
    },
    NOT_FOUND_STATE: {
      KO: ERR_INFO.ACC.NOT_FOUND_STATE.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_STATE.EN,
      ZH: ERR_INFO.ACC.NOT_FOUND_STATE.ZH,
      ES: ERR_INFO.ACC.NOT_FOUND_STATE.ES,
    },
    NOT_FOUND_CITY: {
      KO: ERR_INFO.ACC.NOT_FOUND_CITY.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_CITY.EN,
      ZH: ERR_INFO.ACC.NOT_FOUND_CITY.ZH,
      ES: ERR_INFO.ACC.NOT_FOUND_CITY.ES,
    },
    NOT_FOUND_ADDRESS: {
      KO: ERR_INFO.ACC.NOT_FOUND_ADDRESS.KR,
      EN: ERR_INFO.ACC.NOT_FOUND_ADDRESS.EN,
      ZH: ERR_INFO.ACC.NOT_FOUND_ADDRESS.ZH,
      ES: ERR_INFO.ACC.NOT_FOUND_ADDRESS.ES,
    },
  },
  SERVICE: {
    NOT_SELECTED: {
      KO: ERR_INFO.SERVICE.NOT_SELECTED.KR,
      EN: ERR_INFO.SERVICE.NOT_SELECTED.EN,
      ZH: ERR_INFO.SERVICE.NOT_SELECTED.ZH,
      ES: ERR_INFO.SERVICE.NOT_SELECTED.ES,
    },
    NOT_SERVICE: {
      KO: ERR_INFO.SERVICE.NOT_SERVICE.KR,
      EN: ERR_INFO.SERVICE.NOT_SERVICE.EN,
      ZH: ERR_INFO.SERVICE.NOT_SERVICE.ZH,
      ES: ERR_INFO.SERVICE.NOT_SERVICE.ES,
    },
    NOT_SERVICE_PAYMENT: {
      KO: ERR_INFO.SERVICE.NOT_SERVICE_PAYMENT.KR,
      EN: ERR_INFO.SERVICE.NOT_SERVICE_PAYMENT.EN,
      ZH: ERR_INFO.SERVICE.NOT_SERVICE_PAYMENT.ZH,
      ES: ERR_INFO.SERVICE.NOT_SERVICE_PAYMENT.ES,
    },
  },
};

const CATEGORY = {
  SKINCARE: {
    KO: '스킨케어',
    EN: 'Skincare',
    ZH: '护肤',
    ES: 'Cuidado de la piel',
  },
  EQUIPMENT: {
    KO: '장비',
    EN: 'Equipment',
    ZH: '设备',
    ES: 'Equipo',
  },
  SUPPLIES: {
    KO: '저장품',
    EN: 'Supplies',
    ZH: '用品',
    ES: 'Suministros',
  },
  EDUCATION: {
    KO: '교육',
    EN: 'Education',
    ZH: '教育',
    ES: 'Educación',
  },
  FACE: {
    KO: 'Face',
    EN: 'Face',
    ZH: '面部',
    ES: 'Cara',
  },
  BODY: {
    KO: 'Body',
    EN: 'Body',
    ZH: '身体',
    ES: 'Cuerpo',
  },
  HAIR: {
    KO: 'Hair',
    EN: 'Hair',
    ZH: '头发',
    ES: 'Cabello',
  },
  FACIAL_N_BODY: {
    KO: 'Facial & Body',
    EN: 'Facial & Body',
    ZH: '面部和身体',
    ES: 'Facial y Corporal',
  },
  ETC: {
    KO: 'ETC',
    EN: 'ETC',
    ZH: '其他',
    ES: 'ETC',
  },
  TOOL: {
    KO: 'Tool',
    EN: 'Tool',
    ZH: '工具',
    ES: 'Herramienta',
  },
  FURNITURE: {
    KO: 'Furniture',
    EN: 'Furniture',
    ZH: '家具',
    ES: 'Muebles',
  },
  CERTIFICATION: {
    KO: 'Certification',
    EN: 'Certification',
    ZH: '认证',
    ES: 'Certificación',
  },
  SEMINAR: {
    KO: 'Seminar',
    EN: 'Seminar',
    ZH: '研讨会',
    ES: 'Seminario',
  },
  CLEANSER: {
    KO: 'Cleanser',
    EN: 'Cleanser',
    ZH: '清洁剂',
    ES: 'Limpiador',
  },
  BODY_CLEANSER: {
    KO: 'Body Cleanser',
    EN: 'Body Cleanser',
    ZH: '身体清洁剂',
    ES: 'Limpiador Corporal',
  },
  SHAMPOO: {
    KO: 'Shampoo',
    EN: 'Shampoo',
    ZH: '洗发水',
    ES: 'Champú',
  },
  OXYGEN: {
    KO: 'Oxygen',
    EN: 'Oxygen',
    ZH: '氧气',
    ES: 'Oxígeno',
  },
  STERILIZATION: {
    KO: 'Sterilization',
    EN: 'Sterilization',
    ZH: '消毒',
    ES: 'Esterilización',
  },
  TOWELS: {
    KO: 'Towels',
    EN: 'Towels',
    ZH: '毛巾',
    ES: 'Toallas',
  },
  CHAIRS: {
    KO: 'Chairs',
    EN: 'Chairs',
    ZH: '椅子',
    ES: 'Sillas',
  },
  ESTHETICIAN: {
    KO: 'Esthetician',
    EN: 'Esthetician',
    ZH: '美容师',
    ES: 'Esteticista',
  },
  TARGETCCOL: {
    KO: 'Targetccol',
    EN: 'Targetccol',
    ZH: '目标色',
    ES: 'Targetccol',
  },
  TONER_N_MIST: {
    KO: 'Toner & Mist',
    EN: 'Toner & Mist',
    ZH: '爽肤水和喷雾',
    ES: 'Toner y Mist',
  },
  BODY_LOTION: {
    KO: 'Body Lotion',
    EN: 'Body Lotion',
    ZH: '身体乳液',
    ES: 'Loción Corporal',
  },
  TREATMENT: {
    KO: 'Treatment',
    EN: 'Treatment',
    ZH: '治疗',
    ES: 'Tratamiento',
  },
  RF: {
    KO: 'RF',
    EN: 'RF',
    ZH: 'RF',
    ES: 'RF',
  },
  STEAMER: {
    KO: 'Steamer',
    EN: 'Steamer',
    ZH: '蒸汽机',
    ES: 'Vaporizador',
  },
  HAIR_BAND: {
    KO: 'Hair band',
    EN: 'Hair band',
    ZH: '发带',
    ES: 'Diadema',
  },
  MASSAGE_TABLES: {
    KO: 'Massage Tables',
    EN: 'Massage Tables',
    ZH: '按摩桌',
    ES: 'Mesas de Masaje',
  },
  SKINIUP: {
    KO: 'SKINIUP',
    EN: 'SKINIUP',
    ZH: 'SKINIUP',
    ES: 'SKINIUP',
  },
  SERUM: {
    KO: 'Serum',
    EN: 'Serum',
    ZH: '精华',
    ES: 'Suero',
  },
  BODY_OIL: {
    KO: 'Body Oil',
    EN: 'Body Oil',
    ZH: '身体油',
    ES: 'Aceite Corporal',
  },
  HAIR_MASK: {
    KO: 'Hair MASK',
    EN: 'Hair MASK',
    ZH: '发膜',
    ES: 'Mascarilla Capilar',
  },
  ULTRASONIC: {
    KO: 'Ultrasonic',
    EN: 'Ultrasonic',
    ZH: '超声波',
    ES: 'Ultrasonido',
  },
  MAGNIFYING_GLASS: {
    KO: 'Magnifying Glass',
    EN: 'Magnifying Glass',
    ZH: '放大镜',
    ES: 'Lupa',
  },
  SPA_ROBES: {
    KO: 'Spa Robes',
    EN: 'Spa Robes',
    ZH: '水疗袍',
    ES: 'Batas de Spa',
  },
  TROLLEYS: {
    KO: 'Trolleys',
    EN: 'Trolleys',
    ZH: '推车',
    ES: 'Carros',
  },
  SUPER_JECTION: {
    KO: 'Super-jection',
    EN: 'Super-jection',
    ZH: '超级注射',
    ES: 'Super-jection',
  },
  AMPOULE: {
    KO: 'Ampoule',
    EN: 'Ampoule',
    ZH: '安瓶',
    ES: 'Ampoule',
  },
  BODY_SCRUB: {
    KO: 'Body Scrub',
    EN: 'Body Scrub',
    ZH: '身体磨砂',
    ES: 'Exfoliante Corporal',
  },
  HAIR_ESSENCE: {
    KO: 'Hair Essence',
    EN: 'Hair Essence',
    ZH: '发丝精华',
    ES: 'Esencia para el Cabello',
  },
  MICRODERMA: {
    KO: 'Microderma',
    EN: 'Microderma',
    ZH: '微晶',
    ES: 'Microderma',
  },
  UNIFORM: {
    KO: 'Uniform',
    EN: 'Uniform',
    ZH: '制服',
    ES: 'Uniforme',
  },
  Oil: {
    KO: 'Oil',
    EN: 'Oil',
    ZH: '油',
    ES: 'Aceite',
  },
  MASSAGE_CREAM: {
    KO: 'Massage Cream',
    EN: 'Massage Cream',
    ZH: '按摩霜',
    ES: 'Crema de Masaje',
  },
  SCALP_ESSENCE: {
    KO: 'Scalp Essence',
    EN: 'Scalp Essence',
    ZH: '头皮精华',
    ES: 'Esencia para el Cuero Cabelludo',
  },
  LED_THERAPY: {
    KO: 'LED Therapy',
    EN: 'LED Therapy',
    ZH: 'LED治疗',
    ES: 'Terapia LED',
  },
  WAXING: {
    KO: 'Waxing',
    EN: 'Waxing',
    ZH: '脱毛',
    ES: 'Depilación',
  },
  CREAM: {
    KO: 'Cream',
    EN: 'Cream',
    ZH: '面霜',
    ES: 'Crema',
  },
  COOLING: {
    KO: 'Cooling',
    EN: 'Cooling',
    ZH: '冷却',
    ES: 'Enfriamiento',
  },
  NAIL: {
    KO: 'Nail',
    EN: 'Nail',
    ZH: '指甲',
    ES: 'Uña',
  },
  MASK: {
    KO: 'Mask',
    EN: 'Mask',
    ZH: '面膜',
    ES: 'Mascarilla',
  },
  CONTOURING: {
    KO: 'Contouring',
    EN: 'Contouring',
    ZH: '轮廓',
    ES: 'Contorno',
  },
  TATTOO: {
    KO: 'Tattoo',
    EN: 'Tattoo',
    ZH: '纹身',
    ES: 'Tatuaje',
  },
  SUN_CARE: {
    KO: 'Sun Care',
    EN: 'Sun Care',
    ZH: '防晒',
    ES: 'Protección Solar',
  },
  MTS_DEVICE: {
    KO: 'MTS Device',
    EN: 'MTS Device',
    ZH: 'MTS设备',
    ES: 'Dispositivo MTS',
  },
  BB_CREAM: {
    KO: 'BB Cream',
    EN: 'BB Cream',
    ZH: 'BB霜',
    ES: 'Crema BB',
  },
  CUSHION: {
    KO: 'Cushion',
    EN: 'Cushion',
    ZH: '气垫',
    ES: 'Cojín',
  },
  PEELING: {
    KO: 'Peeling',
    EN: 'Peeling',
    ZH: '去角质',
    ES: 'Peeling',
  },
  LIP: {
    KO: 'LIP',
    EN: 'LIP',
    ZH: '唇部',
    ES: 'Lábios',
  },
  KIT_N_Set: {
    KO: 'KIT & Set',
    EN: 'KIT & Set',
    ZH: '套件',
    ES: 'KIT & Set',
  },
};

const LANGUAGES = {
  COMMON: {
    LOGOUT: {
      KO: '로그아웃',
      EN: 'Logout',
      ZH: '登出',
      ES: 'Cerrar sesión',
    },
    INFO: {
      KO: '안내',
      EN: 'Info',
      ZH: '信息',
      ES: 'Información',
    },
    AGREE: {
      KO: '확인',
      EN: 'Agree',
      ZH: '同意',
      ES: 'Aceptar',
    },
    CANCEL: {
      KO: '취소',
      EN: 'Cancel',
      ZH: '取消',
      ES: 'Cancelar',
    },
    NONE: {
      KO: 'None',
      EN: 'None',
      ZH: '无',
      ES: 'Ninguno',
    },
    MOVE: {
      KO: '이동',
      EN: 'Move',
      ZH: '移动',
      ES: 'Mover',
    },
    MOST_POPULAR: {
      KO: '인기순',
      EN: 'Most Popular',
      ZH: '最受欢迎',
      ES: 'Más popular',
    },
    NEW: {
      KO: '신상품순',
      EN: 'New',
      ZH: '新品',
      ES: 'Nuevo',
    },
    PRICE: {
      KO: '가격순',
      EN: 'Price',
      ZH: '价格',
      ES: 'Precio',
    },
    OPTION: {
      KO: '옵션',
      EN: 'Option',
      ZH: '选项',
      ES: 'Opción',
    },
    USER_SESSION_EXPIRED: {
      KO: '사용자 계정 세션이 만료 되었습니다.\n로그인 화면으로 이동합니다.',
      EN: 'User account session expired.\nGo to the login screen.',
      ZH: '用户会话已过期。\n跳转到登录页面。',
      ES: 'La sesión del usuario ha expirado.\nIr a la pantalla de inicio de sesión.',
    },
    JOB_REQUEST_FAILED: {
      KO: '작업 요청이 실패 하였습니다.',
      EN: 'Job request failed.',
      ZH: '工作请求失败。',
      ES: 'La solicitud de trabajo falló.',
    },
    REQUEST_FAILED: {
      KO: '요청이 실패 하였습니다.\n관리자에게 문의하시기 바랍니다.',
      EN: 'Request failed.\nPlease contact your administrator.',
      ZH: '请求失败。\n请联系管理员。',
      ES: 'La solicitud falló.\nPor favor contacte a su administrador.',
    },
    OTHERS: {
      KO: '기타',
      EN: 'Others',
      ZH: '其他',
      ES: 'Otros',
    },
    ALL: {
      KO: '전체',
      EN: 'All',
      ZH: '全部',
      ES: 'Todos',
    },
    PERCENTAGE: {
      KO: '퍼센트',
      EN: 'Percentage',
      ZH: '百分比',
      ES: 'Porcentaje',
    },
    CONFIRM: {
      KO: '확인',
      EN: 'Confirm',
      ZH: '确认',
      ES: 'Confirmar',
    },
    COSMETICS: {
      KO: '화장품',
      EN: 'Cosmetics',
      ZH: '化妆品',
      ES: 'Cosméticos',
    },
    HEALTH_FOOD: {
      KO: '건강식품',
      EN: 'Health food',
      ZH: '保健食品',
      ES: 'Alimentos saludables',
    },
    BEAUTY_CARE: {
      KO: '뷰티케어',
      EN: 'Beauty care',
      ZH: '美容护理',
      ES: 'Cuidado de belleza',
    },
    ANSWER: {
      KO: '답변',
      EN: 'Answer',
      ZH: '回答',
      ES: 'Respuesta',
    },
    MODIFY: {
      KO: '수정',
      EN: 'Modify',
      ZH: '修改',
      ES: 'Modificar',
    },
    DELETE: {
      KO: '삭제',
      EN: 'Delete',
      ZH: '删除',
      ES: 'Eliminar',
    },
    UNLIMITED: {
      KO: '무기한',
      EN: 'Unlimited',
      ZH: '无限期',
      ES: 'Ilimitado',
    },
    ADD: {
      KO: '추가',
      EN: 'Add',
      ZH: '添加',
      ES: 'Agregar',
    },
    SAVE: {
      KO: '저장',
      EN: 'Save',
      ZH: '保存',
      ES: 'Guardar',
    },
    BACK_LIST: {
      KO: '리스트로 돌아가기',
      EN: 'Back to list',
      ZH: '返回列表',
      ES: 'Volver a la lista',
    },
    BACK_PREVIOUS: {
      KO: '이전으로 돌아가기',
      EN: 'Back to previous',
      ZH: '返回上一页',
      ES: 'Volver a la anterior',
    },
    SEARCH_KEYWORD: {
      KO: '"키워드" 를 입력하세요.',
      EN: 'Please enter a "keyword".',
      ZH: '请输入“关键字”。',
      ES: 'Por favor, ingrese una "palabra clave".',
    },
    PH_SEARCH_TERM: {
      KO: '검색어를 입력하세요',
      EN: 'Enter your search term',
      ZH: '请输入搜索词',
      ES: 'Ingrese su término de búsqueda',
    },
    CARD_NUMBER: {
      KO: '카드번호',
      EN: 'Card Number',
      ZH: '卡号',
      ES: 'Número de tarjeta',
    },
    EXPIRATION_DATE: {
      KO: '카드만료기간',
      EN: 'Expiration Date',
      ZH: '卡有效期',
      ES: 'Fecha de expiración',
    },
    CVV: {
      KO: 'CVV',
      EN: 'CVV',
      ZH: 'CVV码',
      ES: 'CVV',
    },
    CARD: {
      KO: '카드',
      EN: 'Card',
      ZH: '卡',
      ES: 'Tarjeta',
    },
    AMOUNT: {
      KO: '금액',
      EN: 'Amount',
      ZH: '金额',
      ES: 'Cantidad',
    },
    DOWNLOAD_EXCEL: {
      KO: '액셀 다운로드',
      EN: 'Download to Excel ',
      ZH: '下载Excel',
      ES: 'Descargar Excel',
    },
    PLATINUM: {
      KO: '플레티넘',
      EN: 'Platinum',
      ZH: '白金',
      ES: 'Platino',
    },
    GOLD: {
      KO: '골드',
      EN: 'Gold',
      ZH: '黄金',
      ES: 'Oro',
    },
    BRONZE: {
      KO: '브론즈',
      EN: 'Bronze',
      ZH: '青铜',
      ES: 'Bronce',
    },
  },

  STATUS: {
    // 1:배송준비, 2:배송중, 3:주문완료, 4:주문취소요청, 5:주문취소완료, 6:반품요청, 7:반품완료
    WAITING: {
      KO: '대기중',
      EN: 'Waiting',
      ZH: '等待中',
      ES: 'En espera',
    },
    SHIPPING_PREPARATION: {
      KO: '배송준비',
      EN: 'Shipping preparation',
      ZH: '准备发货',
      ES: 'Preparando envío',
    },
    SHIPPING: {
      KO: '배송중',
      EN: 'Shipping',
      ZH: '运输中',
      ES: 'En envío',
    },
    ORDER_COMPLETED: {
      KO: '주문완료',
      EN: 'Order completed',
      ZH: '订单完成',
      ES: 'Pedido completado',
    },
    REQUEST_ORDER_CANCELLATION: {
      KO: '주문취소요청',
      EN: 'Request for cancellation of order',
      ZH: '请求取消订单',
      ES: 'Solicitud de cancelación del pedido',
    },
    ORDER_CANCELLATION_COMPLETED: {
      KO: '주문취소완료',
      EN: 'Order cancellation completed',
      ZH: '订单取消完成',
      ES: 'Cancelación del pedido completada',
    },
    RETURN_REQUEST: {
      KO: '반품요청',
      EN: 'Return request',
      ZH: '退货请求',
      ES: 'Solicitud de devolución',
    },
    RETURN_COMPLETED: {
      KO: '반품완료',
      EN: 'Return completed',
      ZH: '退货完成',
      ES: 'Devolución completada',
    },
    SHIPPED: {
      KO: '배송완료',
      EN: 'Shipped',
      ZH: '已发货',
      ES: 'Enviado',
    },
    SHIPPING_DOMESTICALLY: {
      KO: '국내 배송',
      EN: 'Shipping Domestically',
      ZH: '国内配送',
      ES: 'Envío nacional',
    },
    SHIPPING_INTERNATIONALLY: {
      KO: '국제 배송',
      EN: 'Shipping internationally',
      ZH: '国际配送',
      ES: 'Envío internacional',
    },
    PROCESSING_QUEUE: {
      KO: '답변 대기',
      EN: 'Processing queue',
      ZH: '等待回复',
      ES: 'En cola de procesamiento',
    },
    ANSWER_COMPLETED: {
      KO: '답변 완료',
      EN: 'Answer completed',
      ZH: '回复完成',
      ES: 'Respuesta completada',
    },
    AVAILABLE: {
      KO: '사용가능',
      EN: 'Available',
      ZH: '可用',
      ES: 'Disponible',
    },
    USED: {
      KO: '사용완료',
      EN: 'Used',
      ZH: '已使用',
      ES: 'Usado',
    },
    EXPIRED: {
      KO: '만료됨',
      EN: 'Expired',
      ZH: '已过期',
      ES: 'Expirado',
    },
    // 1:결제대기, 2:결제완료, 3:환불요청, 4:환불완료
    UNPAID: {
      KO: '결제대기',
      EN: 'Unpaid',
      ZH: '待付款',
      ES: 'No pagado',
    },
    PAID: {
      KO: '결제완료',
      EN: 'Paid',
      ZH: '已付款',
      ES: 'Pagado',
    },
    COMPLETED_PAYMENT: {
      KO: '결제완료',
      EN: 'Completed payment',
      ZH: '付款完成',
      ES: 'Pago completado',
    },
    REFUND_REQUESTED: {
      KO: '환불요청',
      EN: 'Refund Requested',
      ZH: '请求退款',
      ES: 'Solicitud de reembolso',
    },
    REFUNDED: {
      KO: '환불완료',
      EN: 'Refunded',
      ZH: '退款完成',
      ES: 'Reembolsado',
    },
  },

  CHAT: {
    AI_WELCOME_MESSAGE: {
      KO: '안녕하세요! 무엇을 도와드릴까요?',
      EN: 'Hello! How can I assist you today?',
      ZH: '您好！我能帮您什么吗？',
      ES: '¡Hola! ¿En qué puedo ayudarte hoy?',
    },
    AI_LOADING_MESSAGE: {
      KO: '챗봇이 생각 중입니다...',
      EN: 'Chatbot is thinking...',
      ZH: '聊天机器人正在思考...',
      ES: 'El chatbot está pensando...',
    },
    AI_EMPTY_MESSAGE: {
      KO: '질문에 알맞은 답변을 찾지 못하였습니다.\n다시 질문해주세요.',
      EN: 'No appropriate answer could be found for the question.\nPlease ask again.',
      ZH: '未能找到适合的问题的答案。\n请再问一次。',
      ES: 'No se pudo encontrar una respuesta adecuada para la pregunta.\nPor favor, pregunte de nuevo.',
    },
    AI_FAIL_MESSAGE: {
      KO: '현재 데이터량이 많아 분석이 원활하지 않습니다.\n잠시 후 다시 시도해 주세요.',
      EN: 'Currently, the data volume is high, making analysis difficult.\nPlease try again later.',
      ZH: '当前数据量过大，分析暂时无法顺利进行。\n请稍后再试。',
      ES: 'Actualmente, el volumen de datos es alto, lo que dificulta el análisis.\nPor favor, inténtalo de nuevo más tarde.',
    },
    AI_FAIL_SERVER: {
      KO: '서버와 연결할 수 없습니다.\n잠시 후 다시 시도해 주세요.',
      EN: 'Unable to connect to the server.\nPlease try again later.',
      ZH: '无法连接到服务器。\n请稍后再试。',
      ES: 'No se puede conectar al servidor.\nPor favor, inténtalo más tarde.',
    },
    AI_FAIL_NETWORK: {
      KO: '네트워크 연결이 확인되지 않습니다.\n확인 후 다시 시도해 주세요.',
      EN: 'Network connection could not be confirmed.\nPlease check and try again later.',
      ZH: '无法确认网络连接。\n请检查后再试。',
      ES: 'No se pudo confirmar la conexión de red.\nPor favor, revisa e inténtalo de nuevo.',
    },
    AI_FAIL_TIMEOUT: {
      KO: '요청 시간이 초과되었습니다.\n다시 질문해주세요.',
      EN: 'The request timed out.\nPlease ask your question again.',
      ZH: '请求超时。\n请重新提问。',
      ES: 'La solicitud ha caducado.\nPor favor, vuelve a hacer tu pregunta.',
    },
    AI_CHAT_PLACEHOLDER: {
      KO: '채팅 내용을 입력하세요.',
      EN: 'Please enter your chat message.',
      ZH: '请输入聊天内容。',
      ES: 'Por favor, escribe tu mensaje de chat.',
    },
  },

  INFO_MSG: {
    KEYWORD_NOT_FOUND: {
      KO: '키워드로 검색된 내용이 없습니다.',
      EN: 'No results found for the keyword.',
      ZH: '未找到与关键字相关的内容。',
      ES: 'No se encontraron resultados para la palabra clave.',
    },
    PAYMENT_PROCESSING_ERROR: {
      KO: '결제 처리 오류.',
      EN: 'Payment processing error.',
      ZH: '支付处理错误。',
      ES: 'Error en el procesamiento del pago.',
    },
    PAYMENT_STRIPE_PROCESSING_ERROR: {
      KO: '결제 처리중입니다.\n주문내역에서 결제 상태를 확인하세요.',
      EN: 'Payment processing.\nPlease check the payment status in your order history.',
      ZH: '支付处理中。\n请在订单记录中查看支付状态。',
      ES: 'Procesando pago.\nPor favor, revisa el estado del pago en tu historial de pedidos.',
    },
    PAYMENT_STRIPE_NOT_FOUND_ORDER_ID_ERROR: {
      KO: '주문 요청이 실패 하였습니다.\n다시 시도하세요.',
      EN: 'Order request failed.\nPlease try again.',
      ZH: '订单请求失败。\n请再试一次。',
      ES: 'La solicitud del pedido falló.\nPor favor, inténtalo de nuevo.',
    },
    ISSUE_TOKEN_FAIL: {
      KO: '토큰 발급에 실패하였습니다.',
      EN: 'Token issuance failed.',
      ZH: '令牌发放失败。',
      ES: 'Falló la emisión del token.',
    },
    ENTER_CARD_NUMBER: {
      KO: '카드 번호를 올바르게 입력해주세요',
      EN: 'Please enter a valid card number.',
      ZH: '请输入有效的卡号。',
      ES: 'Por favor, introduce un número de tarjeta válido.',
    },
    ENTER_MONTH: {
      KO: '유효한 월을 입력해주세요',
      EN: 'Please enter a valid month.',
      ZH: '请输入有效的月份。',
      ES: 'Por favor, introduce un mes válido.',
    },
    ENTER_YEAR: {
      KO: '유효한 연도를 입력해주세요',
      EN: 'Please enter a valid year.',
      ZH: '请输入有效的年份。',
      ES: 'Por favor, introduce un año válido.',
    },
    ENTER_CVV: {
      KO: 'CVV를 올바르게 입력해주세요.',
      EN: 'Please enter a valid CVV.',
      ZH: '请输入有效的CVV。',
      ES: 'Por favor, introduce un CVV válido.',
    },
    WOULD_MEMBERSHIP: {
      KO: '회원 가입을 하시겠습니까?',
      EN: 'Would you like to sign up for membership?',
      ZH: '您想注册会员吗？',
      ES: '¿Deseas registrarte como miembro?',
    },
    NOT_FOUND_KEYWORD: {
      KO: '"키워드" 로 검색된 내용이 없습니다.',
      EN: 'No content has been searched for "keyword".',
      ZH: '未找到与“关键字”相关的内容。',
      ES: 'No se encontró contenido para "palabra clave".',
    },
    BRAND_RESULTS_FOR: {
      KO: '@KEYWORD@ 의 브랜드 검색결과',
      EN: 'Brand results for @KEYWORD@',
      ZH: '@KEYWORD@ 的品牌搜索结果',
      ES: 'Resultados de marcas para @KEYWORD@',
    },
    PRODUCT_RESULTS_FOR: {
      KO: '@KEYWORD@ 의 상품 검색결과',
      EN: 'Product results for @KEYWORD@',
      ZH: '@KEYWORD@ 的商品搜索结果',
      ES: 'Resultados de productos para @KEYWORD@',
    },
    ORDER_CANCEL_AND_MOVE: {
      KO: '진행 중인 주문이 있습니다.\n취소하고 이동하시겠습니까?',
      EN: 'There is an order in progress.\nDo you want to cancel and move?',
      ZH: '存在进行中的订单。\n是否取消并移动？',
      ES: 'Hay un pedido en curso.\n¿Deseas cancelar y continuar?',
    },
    ORDER_CANCEL_AND_ADD: {
      KO: '진행 중인 주문이 있습니다.\n취소하고 새로 주문하시겠습니까?',
      EN: 'There are orders in progress.\nWould you like to cancel the new order?',
      ZH: '存在进行中的订单。\n是否取消并重新下单？',
      ES: 'Hay pedidos en curso.\n¿Deseas cancelar y hacer un nuevo pedido?',
    },
    NOT_FOUND_POST: {
      KO: '게시글을 찾을 수 없습니다.',
      EN: 'Post not found.',
      ZH: '未找到帖子。',
      ES: 'No se encontró la publicación.',
    },
    NOT_FOUND_BRAND: {
      KO: '브랜드를 찾을 수 없습니다.',
      EN: 'Brand not found.',
      ZH: '未找到品牌。',
      ES: 'No se encontró la marca.',
    },
    DELETE_POST: {
      KO: '게시글을 삭제하시겠습니까?',
      EN: 'Are you sure you want to\ndelete the comments?',
      ZH: '确定要删除帖子吗？',
      ES: '¿Estás seguro de que deseas eliminar la publicación?',
    },
    DELETE_COMMENT: {
      KO: '댓글을 삭제하시겠습니까?',
      EN: 'Are you sure you want to\ndelete the comments?',
      ZH: '确定要删除评论吗？',
      ES: '¿Estás seguro de que deseas eliminar el comentario?',
    },
    MOVE_CANCEL_ORDER: {
      KO: '주문을 취소하고 이동하시겠습니까?',
      EN: 'Do you want to cancel\nand move your order?',
      ZH: '是否取消订单并移动？',
      ES: '¿Deseas cancelar y mover tu pedido?',
    },
    MOVE_CART: {
      KO: '장바구니로 이동하시겠습니까?',
      EN: 'Would you like to go to\nyour shopping cart?',
      ZH: '是否前往购物车？',
      ES: '¿Deseas ir a tu carrito de compras?',
    },
    ADD_OTHER_PRODUCTS: {
      KO: '@PRICE@달러가 부족합니다.\n다른 제품을 추가하세요!',
      EN: "You're @PRICE@ short.\nAdd other products!",
      ZH: '缺少 @PRICE@ 美元。\n请添加其他产品！',
      ES: 'Faltan @PRICE@ dólares.\n¡Agrega otros productos!',
    },
    NO_PAYMENT: {
      KO: '결제 대상이 없습니다.',
      EN: 'There is no payment destination',
      ZH: '没有付款目标。',
      ES: 'No hay destino de pago',
    },
    NO_COUPON: {
      KO: '쿠폰이 없습니다.',
      EN: 'There is no coupon',
      ZH: '没有优惠券。',
      ES: 'No hay cupón',
    },
    EXPIRED_LOGIN: {
      KO: '로그인이 만료되어\n로그인 화면으로 이동합니다.',
      EN: 'Your login has expired\nand will be moved to the login screen.',
      ZH: '登录已过期\n将跳转到登录页面。',
      ES: 'Tu sesión ha expirado\ny serás redirigido a la pantalla de inicio de sesión.',
    },
    SELECT_AN_PURCHASE_OPTION: {
      KO: '구매할 옵션을 선택해 주세요',
      EN: 'Please select the option you want to purchase',
      ZH: '请选择要购买的选项。',
      ES: 'Por favor selecciona la opción que deseas comprar',
    },
    SELECT_AN_OPTION: {
      KO: '옵션을 선택해 주세요',
      EN: 'Please select an option',
      ZH: '请选择一个选项。',
      ES: 'Por favor selecciona una opción',
    },
    NO_PROMOTION: {
      KO: '진행 중인 프로모션이 없습니다.',
      EN: 'There are no promotions in progress.',
      ZH: '当前没有进行中的促销活动。',
      ES: 'No hay promociones en curso.',
    },
    NO_ITEM_SEARCHED: {
      KO: '조회된 상품이 없습니다.',
      EN: 'No item has been searched.',
      ZH: '未找到查询的商品。',
      ES: 'No se encontraron artículos.',
    },
    NO_ORDER_DETAILS: {
      KO: '주문내역이 없습니다',
      EN: 'There is no order details.',
      ZH: '没有订单详情。',
      ES: 'No hay detalles del pedido.',
    },
    PREMIUM_SELLER: {
      KO: '피부고의 Premium seller를 요청하세요',
      EN: 'Ask for a premium seller of Piboogo.',
      ZH: '请申请皮肤高的优质卖家。',
      ES: 'Solicita un vendedor premium de Piboogo.',
    },
    NO_BEST_BRAND: {
      KO: 'Best brand가 선정되지 않았습니다.',
      EN: 'The best brand has not been selected.',
      ZH: '未选出最佳品牌。',
      ES: 'No se ha seleccionado la mejor marca.',
    },
    NO_POST: {
      KO: '게시글이 없습니다',
      EN: 'There is no post.',
      ZH: '没有帖子。',
      ES: 'No hay publicaciones.',
    },
    NO_REVIEW: {
      KO: '작성된 리뷰가 없습니다',
      EN: 'There is no review.',
      ZH: '没有已撰写的评论。',
      ES: 'No hay reseñas.',
    },
    LOCK_WHOLESALE_PRICES: {
      KO: '도매가격 잠금해제',
      EN: 'Lock wholesale prices',
      ZH: '锁定批发价格',
      ES: 'Bloquear precios mayoristas',
    },
    SERVICE_ONLY: {
      KO: '로그인 사용자에게\n제공하는 서비스입니다.',
      EN: 'This is a service that only\nprovides login users.',
      ZH: '此服务仅提供给登录用户。',
      ES: 'Este es un servicio que solo\nofrece a los usuarios con sesión iniciada.',
    },
    UNIQUE_BEAUTY_BRAND: {
      KO: '유니크한 뷰티 브랜드가 입점 되었습니다.\n무료로 회원가입 하세요!',
      EN: 'We ve got a unique beauty brand on board\nSign up for free!',
      ZH: '独特的美妆品牌已入驻。\n免费注册会员！',
      ES: 'Tenemos una marca de belleza única\n¡Regístrate gratis!',
    },
    M_UNIQUE_BEAUTY_BRAND: {
      KO: '유니크한 뷰티 브랜드가 입점 되었습니다.\n무료로 회원가입 하세요!',
      EN: 'We ve got a unique beauty brand on\nboard Sign up for free!',
      ZH: '独特的美妆品牌已入驻。\n免费注册会员！',
      ES: 'Tenemos una marca de belleza única\n¡Regístrate gratis!',
    },
    MEMBERSHIP_CONTENT1: {
      KO: '$10000.00 이상 구매 - 플래티넘\n1000.00에서 $10000.00 - 골드\n$999.00 이하 구매 - 브론즈',
      EN: 'Purchases over $10000.00 - Platinum\n1000.00 to $10000.00 - Gold Purchases\n$999.00 or less - Bronze',
      ZH: '购买超过 $10000.00 - 白金\n$1000.00 到 $10000.00 - 黄金\n$999.00 以下购买 - 铜',
      ES: 'Compras superiores a $10000.00 - Platino\nDe $1000.00 a $10000.00 - Oro\nCompras de $999.00 o menos - Bronce',
    },
    MEMBERSHIP_CONTENT2: {
      KO: '* 멤버십 평가가 수행됩니다\n분기별 (1월/4월/7월/10월).',
      EN: '* Membership evaluations are conducted\nquarterly (January/April/July/October).',
      ZH: '* 会员评估每季度进行（1月/4月/7月/10月）。',
      ES: '* Las evaluaciones de membresía se realizan\ntrimestralmente (enero/abril/julio/octubre).',
    },
    NOT_FOUND_SELLER: {
      KO: '셀러를 찾을 수 없습니다.',
      EN: 'The seller was not found.',
      ZH: '未找到卖家。',
      ES: 'No se encontró el vendedor.',
    },
    NOT_FOUND_PRODUCT: {
      KO: '상품을 찾을 수 없습니다.',
      EN: 'The product was not found.',
      ZH: '未找到商品。',
      ES: 'No se encontró el producto.',
    },
    DELETE_PRODUCT_MSG: {
      KO: '상품을 삭제하시겠습니까?',
      EN: 'Are you sure you want to delete the product?',
      ZH: '确定要删除商品吗？',
      ES: '¿Estás seguro de que deseas eliminar el producto?',
    },
    DELETE_MSG: {
      KO: '@개의 상품을 삭제하시겠습니까?',
      EN: 'Are you sure you want to delete the @ items?',
      ZH: '确定要删除 @ 件商品吗？',
      ES: '¿Estás seguro de que deseas eliminar @ artículos?',
    },
    MINIMUM_ORDER_COUNT: {
      KO: '최소 주문 수량은 @COUNT@개 이상입니다.',
      EN: 'The minimum order count is @COUNT@ ea or more.',
      ZH: '最低订购数量为 @COUNT@ 件。',
      ES: 'La cantidad mínima de pedido es de @COUNT@ unidades o más.',
    },
    MINIMUM_ORDER_AMOUNT: {
      KO: '최소 주문 금액은 @COUNT@ 이상입니다.',
      EN: 'The minimum order amount is @COUNT@ or higher.',
      ZH: '最低订单金额为 @COUNT@ 或以上。',
      ES: 'El monto mínimo del pedido es de @COUNT@ o más.',
    },
    DISCOUNT_MSG_TYPE: {
      KO: '@EA@개 이상 구매시 @PRICE@ 할인',
      EN: '@PRICE@ off when you buy @EA@ or more',
      ZH: '购买 @EA@ 件或以上，享受 @PRICE@ 折扣',
      ES: 'Descuento de @PRICE@ al comprar @EA@ o más',
    },
    COUPON_MSG_TYPE1: {
      KO: '전체 주문에서 @PRICE@% 할인 받기',
      EN: 'Get @PRICE@% off your entire order',
      ZH: '整单享受 @PRICE@% 折扣',
      ES: 'Obtén @PRICE@% de descuento en todo tu pedido',
    },
    COUPON_MSG_TYPE2: {
      KO: '전체 주문에서 @PRICE@ 할인 받기',
      EN: 'Get @PRICE@ off your entire order',
      ZH: '整单享受 @PRICE@ 折扣',
      ES: 'Obtén @PRICE@ de descuento en todo tu pedido',
    },
    PAYMENT_PROCESSING: {
      KO: '결제가 정상적으로 완료되면 창이 자동으로 닫힙니다.',
      EN: 'The window will automatically close once the payment is completed normally.',
      ZH: '支付完成后窗口将自动关闭。',
      ES: 'La ventana se cerrará automáticamente una vez que el pago se complete correctamente.',
    },
  },

  HEADER_MENU: {
    PH_HEADER_INPUT: {
      KO: '제품명 또는 브랜드 검색',
      EN: 'Search for a product name or brand',
      ZH: '搜索产品名称或品牌',
      ES: 'Buscar por nombre de producto o marca',
    },
    SEARCH: {
      KO: '검색',
      EN: 'Search',
      ZH: '搜索',
      ES: 'Buscar',
    },
    LOGIN: {
      KO: '로그인',
      EN: 'Login',
      ZH: '登录',
      ES: 'Iniciar sesión',
    },
    MY_PAGE: {
      KO: '내 정보',
      EN: 'My page',
      ZH: '我的页面',
      ES: 'Mi página',
    },
    MY_CART: {
      KO: '장바구니',
      EN: 'My Cart',
      ZH: '购物车',
      ES: 'Mi carrito',
    },
    LOUNGE: {
      KO: '라운지',
      EN: 'Lounge',
      ZH: '休闲区',
      ES: 'Lounge',
    },
    SIGN_UP_TO_SELLER: {
      KO: '판매자 가입',
      EN: 'Sell on Piboogo',
      ZH: '在 Piboogo 销售',
      ES: 'Vender en Piboogo',
    },
    PROMOTION: {
      KO: '프로모션',
      EN: 'Promotion',
      ZH: '促销',
      ES: 'Promoción',
    },
    SKIN_CARE: {
      KO: '스킨케어',
      EN: 'Skincare',
      ZH: '护肤',
      ES: 'Cuidado de la piel',
    },
    MAKE_UP: {
      KO: '메이크업',
      EN: 'Makeup',
      ZH: '彩妆',
      ES: 'Maquillaje',
    },
    HAIR_CARE: {
      KO: '헤어케어',
      EN: 'Haircare',
      ZH: '护发',
      ES: 'Cuidado del cabello',
    },
    BODY_CARE: {
      KO: '바디케어',
      EN: 'Bodycare',
      ZH: '身体护理',
      ES: 'Cuidado corporal',
    },
    FRAGRANCE: {
      KO: '향수',
      EN: 'Fragrance',
      ZH: '香水',
      ES: 'Fragancia',
    },
    MENS_GROOMING: {
      KO: '남성관리',
      EN: "Men's grooming",
      ZH: '男士护理',
      ES: 'Cuidado masculino',
    },
  },

  // SIGN_UP
  SIDE_BAR: {
    DIRECT_SHIPPING: {
      KO: '직접 배송',
      EN: 'Direct shipping',
      ZH: '直接配送',
      ES: 'Envío directo',
    },
    CONSIGNMENT_SHIPPING: {
      KO: '위탁 배송',
      EN: 'Consignment shipping',
      ZH: '委托配送',
      ES: 'Envío en consignación',
    },
  },

  // ACCOUNT
  ACC: {
    PH_EMAIL_USE: {
      KO: '이메일 입력',
      EN: 'Please enter an email to use',
      ZH: '请输入电子邮件',
      ES: 'Por favor ingrese un correo electrónico',
    },
    EMAIL: {
      KO: '이메일',
      EN: 'Email',
      ZH: '电子邮件',
      ES: 'Correo electrónico',
    },
    PH_EMAIL: {
      KO: '이메일 찾기',
      EN: 'Enter a email',
      ZH: '输入电子邮件',
      ES: 'Ingrese un correo electrónico',
    },
    PH_PASSWORD: {
      KO: '이메일 찾기',
      EN: 'Enter a password',
      ZH: '输入密码',
      ES: 'Ingrese una contraseña',
    },
    PASSWORD: {
      KO: '비밀번호',
      EN: 'Password',
      ZH: '密码',
      ES: 'Contraseña',
    },
    PASSWORD_CONFIRM: {
      KO: '비밀번호 확인',
      EN: 'Password confirm',
      ZH: '确认密码',
      ES: 'Confirmar contraseña',
    },
    PH_PASSWORD: {
      KO: '비밀번호 최소 8자리',
      EN: 'Enter at least 8 characters',
      ZH: '请输入至少8个字符',
      ES: 'Ingrese al menos 8 caracteres',
    },
    NAME: {
      KO: '이름',
      EN: 'Name',
      ZH: '姓名',
      ES: 'Nombre',
    },
    FIRST_NAME: {
      KO: '성',
      EN: 'First name',
      ZH: '名',
      ES: 'Nombre',
    },
    LAST_NAME: {
      KO: '이름',
      EN: 'Last name',
      ZH: '姓',
      ES: 'Apellido',
    },
    PH_NAME: {
      KO: '이름을 입력해주세요',
      EN: 'Enter a name',
      ZH: '请输入姓名',
      ES: 'Ingrese un nombre',
    },
    PHONE_NUMBER: {
      KO: '전화번호',
      EN: 'Phone number',
      ZH: '电话号码',
      ES: 'Número de teléfono',
    },
    PH_PHONE_NUMBER: {
      KO: '전화번호 입력',
      EN: 'Enter your phone number',
      ZH: '输入电话号码',
      ES: 'Ingrese su número de teléfono',
    },

    // 로그인 관련
    LOGIN: {
      LOGIN: {
        KO: '로그인',
        EN: 'Login',
        ZH: '登录',
        ES: 'Iniciar sesión',
      },
      SIGN_UP: {
        KO: '회원가입',
        EN: 'Sign up',
        ZH: '注册',
        ES: 'Registrarse',
      },
      KEEP_ME_LOGGED_IN: {
        KO: '로그인 유지',
        EN: 'Keep me logged in',
        ZH: '保持登录状态',
        ES: 'Mantener sesión iniciada',
      },
      FORGOT_ACCOUNT: {
        KO: '이메일 · 비밀번호 찾기',
        EN: 'Forgot account?',
        ZH: '忘记账户？',
        ES: '¿Olvidó su cuenta?',
      },
      DONTS_HAVE_AN_ACCOUNT: {
        KO: '회원이 아니신가요?',
        EN: "Don't have an account?",
        ZH: '还不是会员？',
        ES: '¿No tiene una cuenta?',
      },
      GO_TO_SIGN_UP: {
        KO: '회원이 아닙니다.\n가입 페이지로 이동하시겠습니까?',
        EN: 'You are not a member.\nDo you want to go to the sign-up page?',
        ZH: '您还不是会员。\n是否要跳转到注册页面？',
        ES: 'No es miembro.\n¿Desea ir a la página de registro?',
      },
      CREATE_AN_ACCOUNT: {
        KO: '회원가입',
        EN: 'Create an account',
        ZH: '创建账户',
        ES: 'Crear una cuenta',
      },
      HEADER_SIGN_MSG: {
        KO: '10만 개 이상의 브랜드에서 온라인으로 도매 쇼핑하기',
        EN: 'Shop wholesale online from over 100,000 brands.',
        ZH: '从超过100,000个品牌在线批发购物',
        ES: 'Compre al por mayor en línea de más de 100,000 marcas.',
      },
      HEADER_SIGN_UP: {
        KO: '회원가입',
        EN: 'Sign up',
        ZH: '注册',
        ES: 'Registrarse',
      },
    },

    // 회원찾기
    FIND: {
      FIND_ACCOUNT: {
        KO: '계정정보 찾기',
        EN: 'Find account',
        ZH: '查找账户信息',
        ES: 'Buscar cuenta',
      },
      FORGOT_EMAIL: {
        KO: '가입 이메일 찾기',
        EN: 'Forgot email',
        ZH: '找回注册邮箱',
        ES: 'Olvidé el correo electrónico',
      },
      FIND_EMAIL_ADDRESS: {
        KO: '@NAME@님의 이메일',
        EN: "@NAME@'s email address is",
        ZH: '@NAME@的邮箱',
        ES: 'Correo electrónico de @NAME@',
      },
      FIND_A_EMAIL: {
        KO: '이메일 찾기',
        EN: 'Find a email',
        ZH: '找回电子邮件',
        ES: 'Buscar un correo electrónico',
      },
      SUB_TITLE_EMAIL: {
        KO: '가입 이메일을 찾기 위해 사용한 이름과 비밀번호를 입력해 주세요',
        EN: 'Enter the name and password you used to find your email',
        ZH: '请输入用于查找邮箱的姓名和密码',
        ES: 'Ingrese el nombre y la contraseña que utilizó para encontrar su correo electrónico',
      },
      FORGOT_PASSWORD: {
        KO: '비밀번호 찾기',
        EN: 'Forgot password',
        ZH: '找回密码',
        ES: 'Olvidé la contraseña',
      },
      SUB_TITLE_PASSWORD: {
        KO: '계정(이메일)을 입력하세요',
        EN: 'Enter the email you signed up with',
        ZH: '请输入注册邮箱',
        ES: 'Ingrese el correo electrónico con el que se registró',
      },
      PH_EMAIL_FOR_PASSWORD: {
        KO: '이메일을 입력하세요',
        EN: 'Enter the email you signed up with',
        ZH: '请输入邮箱',
        ES: 'Ingrese el correo electrónico',
      },
      PH_PASSWORD_FOR_EMAIL: {
        KO: '비밀번호를 입력하세요',
        EN: 'Enter a password',
        ZH: '请输入密码',
        ES: 'Ingrese la contraseña',
      },
      ISSUE_TEMP_PASSWORD: {
        KO: '임시 비밀번호 발급',
        EN: 'Issue temporary passwords',
        ZH: '发放临时密码',
        ES: 'Emitir contraseña temporal',
      },
      COMPLETE_FIND_PASSWORD: {
        KO: '임시 비밀번호 발급 성공',
        EN: `We've issued a temporary password roll to the email you entered.`,
        ZH: '临时密码已发送到您输入的邮箱',
        ES: 'Hemos enviado una contraseña temporal al correo electrónico que ingresó.',
      },
      CONFIRM: {
        KO: '확인',
        EN: `Confirm`,
        ZH: '确认',
        ES: 'Confirmar',
      },
      GO_TO_LOG_IN: {
        KO: '로그인 하기',
        EN: 'Go to Log in',
        ZH: '前往登录',
        ES: 'Ir a iniciar sesión',
      },
    },

    SU: {
      SIGN_UP: {
        KO: '가입하기',
        EN: 'Sign up',
        ZH: '注册',
        ES: 'Registrarse',
      },
      SIGN_UP_IS_COMPLETE: {
        KO: '회원가입 완료',
        EN: 'Your signup is complete.',
        ZH: '注册完成',
        ES: 'Su registro está completo.',
      },
      SERVICES_AND_BENEFITS: {
        KO: '로그인하면 더 많은 서비스와 혜택을 받을 수 있습니다.',
        EN: 'Sign in to get more services and benefits.',
        ZH: '登录后可获得更多服务和优惠',
        ES: 'Inicie sesión para obtener más servicios y beneficios.',
      },
      GO_TO_SIGN_IN: {
        KO: '로그인 하기',
        EN: 'Go to sign in',
        ZH: '前往登录',
        ES: 'Ir a iniciar sesión',
      },
      PH_EMAIL: {
        KO: '사용할 이메일',
        EN: 'Enter your email',
        ZH: '输入邮箱',
        ES: 'Ingrese su correo electrónico',
      },
      SEND_EMAIL: {
        KO: '이메일 발송',
        EN: 'Send email',
        ZH: '发送邮件',
        ES: 'Enviar correo electrónico',
      },
      FULL_AGREEMENT: {
        KO: '전체동의',
        EN: 'Full agreement',
        ZH: '全部同意',
        ES: 'Aceptación total',
      },
      AGREEMENT: {
        KO: '동의',
        EN: 'Agreement',
        ZH: '同意',
        ES: 'Acuerdo',
      },
      AGREE: {
        KO: '이용약관',
        EN: 'Agree',
        ZH: '使用条款',
        ES: 'Aceptar',
      },
      PRIVACY_POLICY: {
        KO: '개인정보 동의',
        EN: 'Privacy Policy',
        ZH: '隐私政策',
        ES: 'Política de privacidad',
      },
      BRAND_TERMS_OF_SERVICE: {
        KO: '서비스 동의 동의',
        EN: 'Brand Terms of Service',
        ZH: '品牌服务条款',
        ES: 'Términos de servicio de la marca',
      },
      TERMS_AGREEMENT: {
        KO: '이용약관 동의',
        EN: 'Terms Agreement',
        ZH: '使用条款同意',
        ES: 'Acuerdo de términos',
      },
      PRIVACY_CONSENT: {
        KO: '개인정보 수집 동의',
        EN: 'Privacy Consent',
        ZH: '同意收集个人信息',
        ES: 'Consentimiento de privacidad',
      },
      SERVICE_AGREEMENT: {
        KO: '서비스 이용 동의',
        EN: 'Service Agreement',
        ZH: '服务使用同意',
        ES: 'Acuerdo de servicio',
      },
      POLICY_TERMS_SERVICE: {
        KO: '이용약관 정책',
        EN: 'Terms of Service Policy',
        ZH: '服务条款政策',
        ES: 'Política de términos de servicio',
      },
      POLICY_PRIVACY_COLLECTION: {
        KO: '개인정보 수집 정책',
        EN: 'Privacy Collection Policy',
        ZH: '隐私收集政策',
        ES: 'Política de recolección de privacidad',
      },
      POLICY_SERVICE_USE: {
        KO: '서비스 이용 정책',
        EN: 'Service Use Policy',
        ZH: '服务使用政策',
        ES: 'Política de uso del servicio',
      },
      ENTER_INFORMATION: {
        KO: '정보입력',
        EN: 'Enter Information',
        ZH: '输入信息',
        ES: 'Ingresar información',
      },
      COMPLETE_SIGN_UP: {
        KO: '회원가입 완료',
        EN: 'Complete Signup',
        ZH: '注册完成',
        ES: 'Registro completado',
      },
      VERIFICATION: {
        KO: '인증',
        EN: 'Verification',
        ZH: '验证',
        ES: 'Verificación',
      },
      CODE: {
        KO: '번호',
        EN: 'code',
        ZH: '代码',
        ES: 'Código',
      },
      PH_VERIFICATION_CODE: {
        KO: '이메일에 발송된 인증번호 입력',
        EN: 'Send an email and get a verification code',
        ZH: '输入发送到邮箱的验证码',
        ES: 'Ingrese el código de verificación enviado a su correo electrónico',
      },
      M_PH_VERIFICATION_CODE: {
        KO: '이메일에 발송된\n인증번호 입력',
        EN: 'Send an email and get a\nverification code',
        ZH: '输入发送到邮箱的验证码',
        ES: 'Ingrese el código de verificación enviado a su correo electrónico',
      },
      REFERRER_ID: {
        KO: '추천 아이디 (이메일)',
        EN: 'Referral ID ( E-MAIL )',
        ZH: '推荐人ID（邮箱）',
        ES: 'ID de referido (correo electrónico)',
      },
      PH_REFERRER_ID: {
        KO: '추천인 이메일을 입력하시면 추천인에게 적립 혜택이 제공됩니다.',
        EN: 'Enter the referral’s email to give them a reward.',
        ZH: '输入推荐人邮箱以给予其奖励。',
        ES: 'Ingrese el correo electrónico del referido para otorgarle una recompensa.',
      },
      OPTIONAL: {
        KO: '선택사항',
        EN: 'Optional',
        ZH: '可选',
        ES: 'Opcional',
      },
      BUSINESS_NAME: {
        KO: '사업자명',
        EN: 'Business name',
        ZH: '公司名称',
        ES: 'Nombre comercial',
      },
      PH_BUSINESS_NAME: {
        KO: '사업자명 입력',
        EN: 'Enter your business name',
        ZH: '输入公司名称',
        ES: 'Ingrese el nombre de su empresa',
      },
      BUSINESS_TYPE: {
        KO: '업종',
        EN: 'Business type',
        ZH: '行业类型',
        ES: 'Tipo de negocio',
      },
      PH_BUSINESS_TYPE_SELECT: {
        KO: '업종 선택',
        EN: 'Select your busniess type',
        ZH: '选择行业类型',
        ES: 'Seleccione el tipo de negocio',
      },
      BUSINESS_NUMBER: {
        KO: '사업자 번호',
        EN: 'Business Number',
        ZH: '营业执照号',
        ES: 'Número de negocio',
      },
      PH_BUSINESS_NUMBER: {
        KO: '사업자 번호 입력',
        EN: 'Sellter Permit Number of Esthetics License Number',
        ZH: '输入营业执照号',
        ES: 'Ingrese el número de licencia comercial',
      },
      MEDICAL_SPA: {
        KO: 'Medical spa',
        EN: 'Medical spa',
        ZH: '医疗水疗',
        ES: 'Spa médico',
      },
      ESTHETICS: {
        KO: 'Esthetics',
        EN: 'Esthetics',
        ZH: '美容',
        ES: 'Estética',
      },
      RETAILER: {
        KO: '소매',
        EN: 'Retailer',
        ZH: '零售商',
        ES: 'Minorista',
      },
      OTHER: {
        KO: '기타',
        EN: 'Other',
        ZH: '其他',
        ES: 'Otro',
      },
    },
  },

  PROMOTION: {
    PROMOTION: {
      KO: '프로모션',
      EN: 'Promotion',
      ZH: '促销',
      ES: 'Promoción',
    },
  },

  LOUNGE: {
    HOME: {
      KO: '홈',
      EN: 'Home',
      ZH: '首页',
      ES: 'Inicio',
    },
    JOBS_SEARCH: {
      KO: '구직',
      EN: 'Job search',
      ZH: '求职',
      ES: 'Búsqueda de empleo',
    },
    SECOND_HAND: {
      KO: '중고거래',
      EN: 'Second-hand',
      ZH: '二手交易',
      ES: 'Segunda mano',
    },
    SECOND_HAND_2: {
      KO: '중고거래',
      EN: 'Secondhand',
      ZH: '二手交易',
      ES: 'Segunda mano',
    },
    DAILY: {
      KO: '데일리',
      EN: 'Daliy',
      ZH: '每日',
      ES: 'Diario',
    },
    ROUTINE: {
      KO: '일상',
      EN: 'Routine',
      ZH: '日常',
      ES: 'Rutina',
    },
    JOB_POSTING: {
      KO: '구인',
      EN: 'Job Posting',
      ZH: '招聘',
      ES: 'Oferta de empleo',
    },
    JOB_HUNTING: {
      KO: '구직',
      EN: 'Job Hunting',
      ZH: '求职',
      ES: 'Búsqueda de empleo',
    },
    MARKETPLACE: {
      KO: '중고나라',
      EN: 'Marketplace',
      ZH: '跳蚤市场',
      ES: 'Mercado',
    },
    LEGAL_SERVICES: {
      KO: '서류서비스',
      EN: 'Legal Services',
      ZH: '法律服务',
      ES: 'Servicios legales',
    },
    COMMUNITY: {
      KO: '자유게시판',
      EN: 'Community',
      ZH: '社区',
      ES: 'Comunidad',
    },
    JOBS: {
      COMMENT: {
        KO: '댓글',
        EN: 'Comment',
        ZH: '评论',
        ES: 'Comentario',
      },
      WRITE_COMMENT: {
        KO: '작성',
        EN: 'Write',
        ZH: '撰写',
        ES: 'Escribir',
      },
      JOBS: {
        KO: '구인',
        EN: 'Jobs',
        ZH: '招聘信息',
        ES: 'Empleos',
      },
      SEARCH_FOR_POSTS: {
        KO: '포스트 검색',
        EN: 'Search for posts',
        ZH: '搜索帖子',
        ES: 'Buscar publicaciones',
      },
      WRITE_A_NEW_POST: {
        KO: '포스트 작성',
        EN: 'Write a new post',
        ZH: '撰写新帖子',
        ES: 'Escribir una nueva publicación',
      },
      MODIFY_A_POST: {
        KO: '포스트 수정',
        EN: 'modify a post',
        ZH: '修改帖子',
        ES: 'Modificar publicación',
      },
      TITLE: {
        KO: '제목',
        EN: 'Title',
        ZH: '标题',
        ES: 'Título',
      },
      AUTHOR: {
        KO: '작성자',
        EN: 'Author',
        ZH: '作者',
        ES: 'Autor',
      },
      CREATED_ON: {
        KO: '작성일',
        EN: 'Created on',
        ZH: '创建日期',
        ES: 'Fecha de creación',
      },
      VIEWS: {
        KO: '읽음',
        EN: 'Views',
        ZH: '阅读',
        ES: 'Vistas',
      },
      VIEWS_LOW: {
        KO: '읽음',
        EN: 'views',
        ZH: '阅读量',
        ES: 'vistas',
      },
      SAVE: {
        KO: '작성',
        EN: 'Save',
        ZH: '保存',
        ES: 'Guardar',
      },
      PH_TITLE: {
        KO: '제목 작성',
        EN: 'Enter a title.',
        ZH: '输入标题',
        ES: 'Ingrese un título',
      },
      RELATED_LINKS: {
        KO: '링크 연결',
        EN: 'Related links',
        ZH: '相关链接',
        ES: 'Enlaces relacionados',
      },
      OPTIONAL: {
        KO: '선택',
        EN: 'Optional',
        ZH: '可选',
        ES: 'Opcional',
      },
      PH_RELATED_LINKS: {
        KO: 'http://, https://',
        EN: 'http://, https://',
        ZH: 'http://, https://',
        ES: 'http://, https://',
      },
      IMAGE: {
        KO: '이미지',
        EN: 'Image',
        ZH: '图片',
        ES: 'Imagen',
      },
      PH_IMAGE: {
        KO: 'Up to 5 photos',
        EN: 'Up to 5 photos',
        ZH: '最多5张照片',
        ES: 'Hasta 5 fotos',
      },
      CONTENTS: {
        KO: '내용',
        EN: 'Contents',
        ZH: '内容',
        ES: 'Contenido',
      },
      PH_CONTENTS: {
        KO: '내용을 작성해주세요.',
        EN: 'Please enter your content',
        ZH: '请输入内容',
        ES: 'Por favor ingrese su contenido',
      },
      REGISTRATION_DATE: {
        KO: '등록일',
        EN: 'Registration Date',
        ZH: '注册日期',
        ES: 'Fecha de registro',
      },
      MODIFY: {
        KO: '수정',
        EN: 'Modify',
        ZH: '修改',
        ES: 'Modificar',
      },
      DELETE: {
        KO: '삭제',
        EN: 'Delete',
        ZH: '删除',
        ES: 'Eliminar',
      },
    },
  },

  MY_PAGE: {
    MY_PAGE: {
      KO: '마이페이지',
      EN: 'My page',
      ZH: '我的页面',
      ES: 'Mi página',
    },
    MY_INFO: {
      KO: '내 정보',
      EN: 'My information',
      ZH: '我的信息',
      ES: 'Mi información',
    },
    ORDER_HISTORY: {
      KO: '주문내역',
      EN: 'Order history',
      ZH: '订单历史',
      ES: 'Historial de pedidos',
    },
    REVIEWS_INQUIRIES: {
      REVIEWS_INQUIRIES: {
        KO: '리뷰/문의',
        EN: 'Reviews/Inquiries',
        ZH: '评论/咨询',
        ES: 'Reseñas/Consultas',
      },
      SECRET_POST: {
        KO: '비밀글 입니다',
        EN: "It's a secret",
        ZH: '这是秘密',
        ES: 'Es secreto',
      },
      REVIEWS: {
        KO: '리뷰',
        EN: 'Reviews',
        ZH: '评论',
        ES: 'Reseñas',
      },
      INQUIRIES: {
        KO: '문의',
        EN: 'Inquiries',
        ZH: '咨询',
        ES: 'Consultas',
      },
      STATUS: {
        KO: '상태',
        EN: 'Status',
        ZH: '状态',
        ES: 'Estado',
      },
      AUTHOR: {
        KO: '작성자',
        EN: 'Author',
        ZH: '作者',
        ES: 'Autor',
      },
      REGISTRATION_DATE: {
        KO: '작성일',
        EN: 'Registration Date',
        ZH: '注册日期',
        ES: 'Fecha de registro',
      },
    },
    HELP: {
      HELP: {
        KO: '도움말',
        EN: 'Help',
        ZH: '帮助',
        ES: 'Ayuda',
      },
      FAQ: {
        KO: 'FAQ',
        EN: 'FAQ',
        ZH: '常见问题',
        ES: 'FAQ',
      },
      NOTICE: {
        KO: '안내',
        EN: 'Notice',
        ZH: '通知',
        ES: 'Aviso',
      },
      PH_NOTICE: {
        KO: '내용을 입력해 주세요.',
        EN: 'Please enter the content',
        ZH: '请输入内容',
        ES: 'Por favor ingrese el contenido',
      },
      NUMBER: {
        KO: '번호',
        EN: 'Number',
        ZH: '编号',
        ES: 'Número',
      },
      TITLE: {
        KO: '제목',
        EN: 'Title',
        ZH: '标题',
        ES: 'Título',
      },
    },
    MEMBERSHIP: {
      KO: '멤버십',
      EN: 'Membership',
      ZH: '会员',
      ES: 'Membresía',
    },
    MEMBERSHIP_INFO: {
      KO: '멤버십 안내 예정',
      EN: 'Membership Info',
      ZH: '会员信息',
      ES: 'Información de membresía',
    },
    REWARD_COINS: {
      KO: '코인',
      EN: 'Reward coins',
      ZH: '奖励币',
      ES: 'Monedas de recompensa',
    },
    EDIT_ACCOUNT_INFO: {
      KO: '회원정보수정',
      EN: 'Edit account info',
      ZH: '编辑账户信息',
      ES: 'Editar información de la cuenta',
    },
    EDIT: {
      TITLE_EDIT_ACCOUNT_INFO: {
        KO: '회원정보수정',
        EN: 'Edit your account information',
        ZH: '编辑账户信息',
        ES: 'Editar la información de la cuenta',
      },
      PH_PASSWORD: {
        KO: '현재 비밀번호',
        EN: 'Current password',
        ZH: '当前密码',
        ES: 'Contraseña actual',
      },
      CURRENT_PASSWORD: {
        KO: '현재 비밀번호',
        EN: 'Current password',
        ZH: '当前密码',
        ES: 'Contraseña actual',
      },
      NEW_PASSWORD: {
        KO: '변경 비밀번호',
        EN: 'New password',
        ZH: '新密码',
        ES: 'Nueva contraseña',
      },
      NEW_PASSWORD_CONFIRM: {
        KO: '변경 비밀번호 확인',
        EN: 'New password confirm',
        ZH: '确认新密码',
        ES: 'Confirmar nueva contraseña',
      },
      CHANGE_PASSWORD: {
        KO: '비밀번호 변경',
        EN: 'Change a password',
        ZH: '更改密码',
        ES: 'Cambiar contraseña',
      },
      SAVE_YOUR_CHANGES: {
        KO: '저장 및 변경',
        EN: 'Save your changes',
        ZH: '保存更改',
        ES: 'Guardar cambios',
      },
    },
    ORDER: {
      ENTER_PAYMENT_INFORMATION: {
        KO: '결제정보 입력하기',
        EN: 'Enter Payment Information',
        ZH: '输入支付信息',
        ES: 'Ingresar información de pago',
      },
      PAY_NOW: {
        KO: '결제하기',
        EN: 'Pay Now',
        ZH: '立即支付',
        ES: 'Pagar ahora',
      },
      PRODUCT_INFO: {
        KO: '상품 정보',
        EN: 'Product info',
        ZH: '商品信息',
        ES: 'Información del producto',
      },
      ORDER_DETAILS: {
        KO: '주문 상세',
        EN: 'Order Details',
        ZH: '订单详情',
        ES: 'Detalles del pedido',
      },
      UNPAID: {
        KO: '상세',
        EN: 'Unpaid',
        ZH: '未支付',
        ES: 'No pagado',
      },
      ORDER_DATE: {
        KO: '주문일',
        EN: 'Order Date',
        ZH: '订购日期',
        ES: 'Fecha de pedido',
      },
      ORDER_NUMBER: {
        KO: '주문번호',
        EN: 'Order Number',
        ZH: '订单编号',
        ES: 'Número de pedido',
      },
      DETAILS: {
        KO: '주문/배송 상세',
        EN: 'Details',
        ZH: '订单/运输详情',
        ES: 'Detalles',
      },
      MESSAGES: {
        KO: '메모',
        EN: 'Messages',
        ZH: '留言',
        ES: 'Mensajes',
      },
      PAYMENT_INFO: {
        KO: '결제정보',
        EN: 'Payment info',
        ZH: '支付信息',
        ES: 'Información de pago',
      },
      PRODUCT_PRICE: {
        KO: '상품가격',
        EN: 'Product price',
        ZH: '商品价格',
        ES: 'Precio del producto',
      },
      SHIPPING_COST: {
        KO: '배송비',
        EN: 'Shipping cost',
        ZH: '运费',
        ES: 'Costo de envío',
      },
      SHIPPING_CARRIERS: {
        KO: '운송업체',
        EN: 'Shipping carriers',
        ZH: '运输公司',
        ES: 'Transportistas',
      },
      TRACKING_NUMBER: {
        KO: '운송번호',
        EN: 'Tracking Number',
        ZH: '运单号码',
        ES: 'Número de seguimiento',
      },
      PREPARING: {
        KO: '배송준비',
        EN: 'Preparing',
        ZH: '准备中',
        ES: 'Preparando',
      },
      START_SHIPPING: {
        KO: '배송시작',
        EN: 'Start shipping',
        ZH: '开始配送',
        ES: 'Iniciar envío',
      },
      DOMESTIC_SHIPPING: {
        KO: '국내배송',
        EN: 'Domestic shipping',
        ZH: '国内配送',
        ES: 'Envío nacional',
      },
      DELIVERED: {
        KO: '배송완료',
        EN: 'Delivered',
        ZH: '已送达',
        ES: 'Entregado',
      },
      WRITE_PRODUCT_INQUIRY: {
        KO: '상품 문의 작성',
        EN: 'Write a product inquiry',
        ZH: '撰写商品咨询',
        ES: 'Escribir consulta del producto',
      },
      PH_WRITE_PRODUCT_INQUIRY: {
        KO: '문의내용을 작성해주세요',
        EN: 'Please enter inquiry',
        ZH: '请输入咨询内容',
        ES: 'Ingrese su consulta',
      },
      WRITE_REVIEW_DETAILS: {
        KO: '상품 리뷰 작성',
        EN: 'Write review details',
        ZH: '撰写商品评论',
        ES: 'Escribir reseña del producto',
      },
      PH_WRITE_PRODUCT_REVIEW: {
        KO: '리뷰를 작성해주세요',
        EN: 'Please enter your review',
        ZH: '请输入评论',
        ES: 'Ingrese su reseña',
      },
      WRITE_IN_SECRET: {
        KO: '비공개',
        EN: 'Write in secret',
        ZH: '秘密写作',
        ES: 'Escribir en secreto',
      },
      REGISTER_REVIEW: {
        KO: '리뷰등록',
        EN: 'Register a review',
        ZH: '注册评论',
        ES: 'Registrar reseña',
      },
      REGISTER_INQUIRIES: {
        KO: '문의등록',
        EN: 'Register a inquiries',
        ZH: '注册咨询',
        ES: 'Registrar consultas',
      },
      REQUEST_CANCELLATION: {
        KO: '취소요청',
        EN: 'Request a cancellation',
        ZH: '请求取消',
        ES: 'Solicitar cancelación',
      },
      REQUEST_RETURN: {
        KO: '반품요청',
        EN: 'Request a return',
        ZH: '请求退货',
        ES: 'Solicitar devolución',
      },
      REASONS_FOR_RETURN: {
        KO: '반품 사유',
        EN: 'Reasons for return',
        ZH: '退货原因',
        ES: 'Razones de devolución',
      },
      REASONS_FOR_CANCELLATION: {
        KO: '취소 사유',
        EN: 'Reasons for cancellation',
        ZH: '取消原因',
        ES: 'Razones de cancelación',
      },
      PH_REASONS_FOR_RETURN: {
        KO: '자세한 이유를 작성해주세요',
        EN: 'Please provide a detailed reason',
        ZH: '请输入详细原因',
        ES: 'Proporcione una razón detallada',
      },
      ORDER_MISTAKE: {
        KO: '주문실수',
        EN: 'Order mistake',
        ZH: '订单错误',
        ES: 'Error de pedido',
      },
      DAMAGED_OR_DEFECTIVE: {
        KO: '손상 및 결함',
        EN: 'Damaged or Defective',
        ZH: '损坏或缺陷',
        ES: 'Dañado o defectuoso',
      },
      WRONG_ITEM_DELIVERED: {
        KO: '잘못된 상품 배송',
        EN: 'Wrong Item Delivered',
        ZH: '错误商品配送',
        ES: 'Artículo entregado incorrecto',
      },
      ESTIMATED_REFUND_AMOUNT: {
        KO: '예상 환불 금액',
        EN: 'Estimated refund amount',
        ZH: '预计退款金额',
        ES: 'Cantidad estimada de reembolso',
      },
      CHECK_THE_FOLLOWING: {
        KO: '다음을 확인해 주세요:',
        EN: 'Please check the following',
        ZH: '请检查以下内容：',
        ES: 'Por favor, verifique lo siguiente',
      },
      CHECK_THE_FOLLOWING_1: {
        KO: '샘플 주문의 경우 반품, 주문 취소, 환불이 허용되지 않습니다.',
        EN: 'Returns, order cancellations, and refunds are not allowed for sample orders.',
        ZH: '样品订单不允许退货、取消订单或退款。',
        ES: 'No se permiten devoluciones, cancelaciones ni reembolsos para pedidos de muestra.',
      },
      CHECK_THE_FOLLOWING_2: {
        KO: '단순 변심으로 인한 취소, 환불, 반품은 허용되지 않습니다.',
        EN: 'Cancellations, refunds, and returns due to a simple change of mind are not permitted.',
        ZH: '因个人原因取消、退款或退货是不允许的。',
        ES: 'No se permiten cancelaciones, devoluciones ni reembolsos por cambio de opinión.',
      },
      CHECK_THE_FOLLOWING_3: {
        KO: '반품을 요청하기 전에 다음 사항을 확인해 주시기 바랍니다. 반품 자격 확인 관리자.',
        EN: 'Before requesting a return, please ensure to confirm the return eligibility with the administrator.',
        ZH: '在申请退货之前，请确认管理员批准退货资格。',
        ES: 'Antes de solicitar una devolución, confirme la elegibilidad de devolución con el administrador.',
      },
      CHECK_THE_FOLLOWING_4: {
        KO: '상황에 따라 반품 요청 수는 제한될 수 있습니다.',
        EN: 'The number of return requests may be limited depending on the circumstances.',
        ZH: '根据情况，退货请求数量可能有限制。',
        ES: 'El número de solicitudes de devolución puede estar limitado según las circunstancias.',
      },
      PRODUCT_AMOUNT: {
        KO: '상품가격',
        EN: 'Product amount',
        ZH: '商品金额',
        ES: 'Monto del producto',
      },
      REFUND_SHIPPING_COST: {
        KO: '환불 배송비',
        EN: 'Refund shipping cost',
        ZH: '退款运费',
        ES: 'Costo de envío reembolsado',
      },
      DISCOUNT_AMOUNT: {
        KO: '할인가격',
        EN: 'Discount amount',
        ZH: '折扣金额',
        ES: 'Monto de descuento',
      },
      FINAL_REFUND_ESTIMATE: {
        KO: '최종 환불 금액',
        EN: 'Final refund estimate',
        ZH: '最终退款金额',
        ES: 'Estimación final de reembolso',
      },
      PRODUCT_INQUIRIES: {
        KO: '상품문의',
        EN: 'Product inquiries',
        ZH: '商品咨询',
        ES: 'Consultas de productos',
      },
      TRACK_SHIPMENT: {
        KO: '배송조회',
        EN: 'Track a shipment',
        ZH: '查询运输',
        ES: 'Rastrear envío',
      },
      RETURNING_PRODUCT: {
        KO: '주문 반품',
        EN: 'Returning a product',
        ZH: '退货',
        ES: 'Devolviendo un producto',
      },
      RETURNING_PRODUCT_ERROR: {
        KO: '반품 요청은 배송이 완료된 후 가능합니다.',
        EN: 'Return request can be made after delivery is completed',
        ZH: '退货请求可在配送完成后进行',
        ES: 'La solicitud de devolución se puede realizar después de la entrega',
      },
      SHIPPING_INFO: {
        KO: '배송정보',
        EN: 'Shipping info',
        ZH: '配送信息',
        ES: 'Información de envío',
      },
      CANCEL_ORDER: {
        KO: '주문취소',
        EN: 'Cancel an order',
        ZH: '取消订单',
        ES: 'Cancelar pedido',
      },
    },
    COUPON: {
      COUPON: {
        KO: '쿠폰',
        EN: 'Coupon',
        ZH: '优惠券',
        ES: 'Cupón',
      },
      REDEMPTION_TERMS: {
        KO: '사용 조건',
        EN: 'Redemption Terms',
        ZH: '兑换条款',
        ES: 'Términos de canje',
      },
      MINIMUM_PURCHASE: {
        KO: '최소 구매금액',
        EN: 'minimum purchase',
        ZH: '最低购买额',
        ES: 'Compra mínima',
      },
    },
  },

  MY_CART: {
    MY_CART: {
      KO: '장바구니',
      EN: 'My cart',
      ZH: '购物车',
      ES: 'Mi carrito',
    },
    WISH_LIST: {
      KO: '위시리스트',
      EN: 'Wishlist',
      ZH: '愿望清单',
      ES: 'Lista de deseos',
    },
    DELETE_SELECTION: {
      KO: '선택 삭제',
      EN: 'Delete selection',
      ZH: '删除所选',
      ES: 'Eliminar selección',
    },
    ADD_SELECTED_CART: {
      KO: '장바구니에 선택한 항목 추가',
      EN: 'Add selected items to cart',
      ZH: '将选定的商品加入购物车',
      ES: 'Agregar artículos seleccionados al carrito',
    },
    PRODUCTS_ARE_SELECTED: {
      KO: '개의 제품이 선택되었습니다',
      EN: 'products are selected',
      ZH: '个商品已选择',
      ES: 'productos seleccionados',
    },
  },

  ORDER: {
    TOTAL_PRICE_LABEL: {
      KO: '총 가격 라벨',
      EN: 'Total Price Label',
      ZH: '总价格标签',
      ES: 'Etiqueta de precio total',
    },
    COIN_OF: {
      KO: '가능 코인',
      EN: 'coin of',
      ZH: '可用金币',
      ES: 'moneda de',
    },
    ORDER_TOTAL: {
      KO: '주문 합계',
      EN: 'Order Total',
      ZH: '订单总额',
      ES: 'Total del pedido',
    },
    DISCOUNT: {
      KO: '할인',
      EN: 'Discount',
      ZH: '折扣',
      ES: 'Descuento',
    },
    EA: {
      KO: '개',
      EN: 'ea',
      ZH: '个',
      ES: 'ud',
    },
    ORDER: {
      KO: '주문',
      EN: 'Order',
      ZH: '订单',
      ES: 'Pedido',
    },
    WISH_LIST: {
      KO: '위시리스트',
      EN: 'Wishlist',
      ZH: '愿望清单',
      ES: 'Lista de deseos',
    },
    RECENT_ORDERS: {
      KO: '주문내역',
      EN: 'Recent orders',
      ZH: '最近订单',
      ES: 'Pedidos recientes',
    },
    PRODUCT: {
      KO: '상품명',
      EN: 'Product',
      ZH: '商品名',
      ES: 'Producto',
    },
    ORDER_NUMBER: {
      KO: '주문번호',
      EN: 'Order number',
      ZH: '订单号',
      ES: 'Número de pedido',
    },
    QUANTITY: {
      KO: '수량',
      EN: 'Quantity',
      ZH: '数量',
      ES: 'Cantidad',
    },
    DATE: {
      KO: '주문일',
      EN: 'Date',
      ZH: '订购日期',
      ES: 'Fecha',
    },
    TOTAL_PRICE: {
      KO: '총 주문금액',
      EN: 'Total order price',
      ZH: '订单总额',
      ES: 'Precio total del pedido',
    },
    TOTAL_ORDER_PRICE: {
      KO: '총 주문금액',
      EN: 'Total Order Price',
      ZH: '订单总额',
      ES: 'Total del pedido',
    },
    M_TOTAL_ORDER_PRICE: {
      KO: '총 주문금액',
      EN: 'Total Order\nPrice',
      ZH: '订单总额',
      ES: 'Total del pedido',
    },
    DISCOUNT_PRICE: {
      KO: '할인금액',
      EN: 'Discount Price',
      ZH: '折扣金额',
      ES: 'Monto de descuento',
    },
    FINAL_ORDER_PRICE: {
      KO: '최종 주문금액',
      EN: 'Final Order Price',
      ZH: '最终订单金额',
      ES: 'Precio final del pedido',
    },
    CANCEL_ORDER: {
      KO: '결제 요청을 취소했습니다.',
      EN: 'Cancellation of payment request.',
      ZH: '已取消支付请求。',
      ES: 'Cancelación de la solicitud de pago.',
    },
    PRODUCT_INFORMATION: {
      KO: '상품 정보',
      EN: 'Product information',
      ZH: '商品信息',
      ES: 'Información del producto',
    },
    ORDERER_INFORMATION: {
      KO: '주문자 정보',
      EN: 'Orderer information',
      ZH: '订购者信息',
      ES: 'Información del solicitante',
    },
    ORDERER_NAME: {
      KO: '주문자명',
      EN: 'Orderer name',
      ZH: '订购者姓名',
      ES: 'Nombre del solicitante',
    },
    SHIPPING_INFORMATION: {
      KO: '배송정보',
      EN: 'Shipping information',
      ZH: '配送信息',
      ES: 'Información de envío',
    },
    SAME_AS_ORDERER_INFORMATION: {
      KO: '주문자 정보와 동일',
      EN: 'Same as orderer information',
      ZH: '与订购者信息相同',
      ES: 'Igual que la información del solicitante',
    },
    SUMMARY: {
      KO: '주문요약',
      EN: 'Order summary',
      ZH: '订单摘要',
      ES: 'Resumen del pedido',
    },
    TOTAL: {
      KO: '총 결제비',
      EN: 'Total',
      ZH: '总计',
      ES: 'Total',
    },
    SHIPPING_COST: {
      KO: '배송비',
      EN: 'Shipping cost',
      ZH: '运费',
      ES: 'Costo de envío',
    },
    TOTAL_PRODUCT: {
      KO: '총 상품가격',
      EN: 'Total product price',
      ZH: '商品总价',
      ES: 'Precio total del producto',
    },
    TOTAL_SHIPPING: {
      KO: '총 배송비',
      EN: 'Total shipping cost',
      ZH: '总运费',
      ES: 'Costo total de envío',
    },
    COUPON_DISCOUNT: {
      KO: '쿠폰 할인',
      EN: 'Coupon Discount Amount',
      ZH: '优惠券折扣',
      ES: 'Descuento de cupón',
    },
    REDEEMING_MILES: {
      KO: '적립금 사용',
      EN: 'Redeeming Miles',
      ZH: '使用积分',
      ES: 'Uso de puntos',
    },
    CHECK_OUT: {
      KO: '결제하기',
      EN: 'Check Out',
      ZH: '结算',
      ES: 'Pagar',
    },
    ORDER_ADDITIONAL: {
      KO: '추가 주문',
      EN: 'Order additional',
      ZH: '附加订单',
      ES: 'Pedido adicional',
    },
    PAYMENT_METHOD: {
      KO: '결제방법',
      EN: 'Payment method',
      ZH: '支付方式',
      ES: 'Método de pago',
    },
    FINAL_PAYMENT_AMOUNT: {
      KO: '결제방법',
      EN: 'Final Payment Amount',
      ZH: '最终支付金额',
      ES: 'Monto final a pagar',
    },
    COUPON_DISCOUNTS: {
      KO: '쿠폰할인',
      EN: 'Coupon discounts',
      ZH: '优惠券折扣',
      ES: 'Descuentos de cupón',
    },
    REWARD_COINS: {
      KO: '적립금 사용',
      EN: 'Reward coins',
      ZH: '使用积分',
      ES: 'Monedas de recompensa',
    },
    MESSAGES: {
      KO: '요청사항',
      EN: 'Messages',
      ZH: '请求事项',
      ES: 'Mensajes',
    },
    COIN: {
      KO: '코인',
      EN: 'coin',
      ZH: '金币',
      ES: 'Moneda',
    },
    FULL_USE: {
      KO: '전체사용',
      EN: 'Full use',
      ZH: '全部使用',
      ES: 'Uso total',
    },
    DISCOUNT_EVENTS: {
      KO: '할인 이벤트',
      EN: 'Discount events',
      ZH: '折扣活动',
      ES: 'Eventos de descuento',
    },
    SELECT_AN_OPTION: {
      KO: '옵션 선택',
      EN: 'Select an option',
      ZH: '选择选项',
      ES: 'Seleccionar opción',
    },
    SELECT_QUANTITY: {
      KO: '수량 선택',
      EN: 'Select quantity',
      ZH: '选择数量',
      ES: 'Seleccionar cantidad',
    },
    ESTIMATED_REFUND_AMOUNT: {
      KO: '예상 환불 금액',
      EN: 'Estimated refund amount',
      ZH: '预计退款金额',
      ES: 'Cantidad estimada de reembolso',
    },
    ESTIMATED_ORDER_AMOUNT: {
      KO: '예상 주문 금액',
      EN: 'Estimated order amount',
      ZH: '预计订单金额',
      ES: 'Cantidad estimada del pedido',
    },
    SHOPPING_CART: {
      KO: '장바구니 추가',
      EN: 'Shopping Cart',
      ZH: '加入购物车',
      ES: 'Agregar al carrito',
    },
    BUY_NOW: {
      KO: '바로 구매',
      EN: 'Buy Now',
      ZH: '立即购买',
      ES: 'Comprar ahora',
    },
    ADD_ORDER: {
      KO: '주문에 상품 추가',
      EN: 'Add Product to Order',
      ZH: '将商品添加到订单',
      ES: 'Agregar producto al pedido',
    },
  },

  ADDRESS: {
    ADDRESS_SEARCH: {
      KO: '주소 검색',
      EN: 'Address Search',
      ZH: '地址搜索',
      ES: 'Buscar dirección',
    },
    ADDRESS: {
      KO: '주소',
      EN: 'Address',
      ZH: '地址',
      ES: 'Dirección',
    },
    ADDRESS1: {
      KO: '주소 1',
      EN: 'Address 1',
      ZH: '地址1',
      ES: 'Dirección 1',
    },
    ADDRESS2: {
      KO: '주소 2',
      EN: 'Address 2',
      ZH: '地址2',
      ES: 'Dirección 2',
    },
    CITY: {
      KO: '도시',
      EN: 'City',
      ZH: '城市',
      ES: 'Ciudad',
    },
    STATE: {
      KO: '도/주',
      EN: 'State',
      ZH: '州/省',
      ES: 'Estado/Provincia',
    },
    COUNTRY: {
      KO: '국가',
      EN: 'Country',
      ZH: '国家',
      ES: 'País',
    },
    PH_ETC_ADDRESS: {
      KO: '상세주소',
      EN: 'Apartment, suite, etc.',
      ZH: '公寓, 单元等',
      ES: 'Apartamento, suite, etc.',
    },
    ZIP_CODE: {
      KO: '우편번호',
      EN: 'Zip code',
      ZH: '邮政编码',
      ES: 'Código postal',
    },
    POSCAL_CODE: {
      KO: '우편번호',
      EN: 'Poscal Code',
      ZH: '邮政编码',
      ES: 'Código postal',
    },
  },

  // 배너 버튼
  VIEW_ALL: {
    KO: '전체보기',
    EN: 'View All',
    ZH: '查看全部',
    ES: 'Ver todo',
  },
  GO_TO_BRAND_HOME: {
    KO: '브랜드 보기',
    EN: 'Go to Brand Home',
    ZH: '前往品牌主页',
    ES: 'Ir a la página de la marca',
  },
  ORDER_ADDR_1: {
    KO: '주소 1',
    EN: 'Address 1',
    ZH: '地址1',
    ES: 'Dirección 1',
  },
  ORDER_ADDR_2: {
    KO: '주소 2',
    EN: 'Address 2',
    ZH: '地址2',
    ES: 'Dirección 2',
  },
  ORDER_STREET_ADDRESS: {
    KO: '도로명 주소',
    EN: 'Street address',
    ZH: '街道地址',
    ES: 'Dirección',
  },
  ORDER_ETC_ADDRESS: {
    KO: '상세주소',
    EN: 'Apartment, suite, etc.',
    ZH: '详细地址',
    ES: 'Apartamento, suite, etc.',
  },
  ORDER_ZIP_CODE: {
    KO: '우편번호',
    EN: 'Zip code',
    ZH: '邮政编码',
    ES: 'Código postal',
  },
  BEST_BRAND: {
    KO: '베스트 브랜드',
    EN: 'Best Brand',
    ZH: '最佳品牌',
    ES: 'Mejor marca',
  },
  NEW_BRAND: {
    KO: '새로운 브랜드',
    EN: 'New Brand',
    ZH: '新品牌',
    ES: 'Nueva marca',
  },
  BRAND_INFO: {
    KO: '브랜드 정보',
    EN: 'Brand info',
    ZH: '品牌信息',
    ES: 'Información de la marca',
  },
  BRAND_PRODUCT: {
    KO: '브랜드 상품',
    EN: 'Brand product',
    ZH: '品牌产品',
    ES: 'Producto de la marca',
  },
  SEE_OTHER_BRANDED_PRODUCTS: {
    KO: '다른 브랜드 제품 보기',
    EN: 'See other branded products',
    ZH: '查看其他品牌产品',
    ES: 'Ver otros productos de la marca',
  },
  PRODUCT_INFO: {
    KO: '상품 정보',
    EN: 'Product info',
    ZH: '产品信息',
    ES: 'Información del producto',
  },
  PRODUCT_INQUIRY: {
    KO: '상품 문의',
    EN: 'Product inquiry',
    ZH: '产品咨询',
    ES: 'Consulta del producto',
  },
  WRITE_INQUIRY: {
    KO: '문의 작성',
    EN: 'Write an inquiry',
    ZH: '撰写咨询',
    ES: 'Escribir una consulta',
  },
  RETURN_TO_CART: {
    KO: '장바구니로 돌아가기',
    EN: 'Return to cart',
    ZH: '返回购物车',
    ES: 'Volver al carrito',
  },
  PURCHASE_MINIMUM: {
    KO: '구매 최소금액',
    EN: 'Purchase minimum',
    ZH: '最低购买金额',
    ES: 'Compra mínima',
  },
  PURCHASE_MINIMUM_COUNT: {
    KO: '구매 최소수량',
    EN: 'Purchase minimum quantity',
    ZH: '最低购买数量',
    ES: 'Cantidad mínima de compra',
  },
  MINIMUM: {
    KO: '최소금액',
    EN: 'Minimum',
    ZH: '最小金额',
    ES: 'Mínimo',
  },
  MSRP: {
    KO: '권장소비자가격',
    EN: 'MSRP',
    ZH: '建议零售价',
    ES: 'Precio de venta sugerido',
  },
  SHIPPING: {
    KO: '배송',
    EN: 'Shipping',
    ZH: '运输',
    ES: 'Envío',
  },
  EXCHANGES: {
    KO: '교환',
    EN: 'Exchanges',
    ZH: '换货',
    ES: 'Intercambios',
  },
  RETURNS: {
    KO: '반품',
    EN: 'Returns',
    ZH: '退货',
    ES: 'Devoluciones',
  },
  ITEMS: {
    KO: '개의 상품',
    EN: 'items',
    ZH: '件商品',
    ES: 'artículos',
  },
  NEXT: {
    KO: '다음',
    EN: 'Next',
    ZH: '下一个',
    ES: 'Siguiente',
  },
  REVIEWS: {
    KO: '리뷰',
    EN: 'reviews',
    ZH: '评论',
    ES: 'Reseñas',
  },
  BASED_REVIEWS: {
    KO: '@COUNT@개의 리뷰 별점',
    EN: 'Based on @COUNT@ reviews',
    ZH: '基于@COUNT@条评论评分',
    ES: 'Basado en @COUNT@ reseñas',
  },
  UPPER_REVIEWS: {
    KO: '리뷰',
    EN: 'Reviews',
    ZH: '评论',
    ES: 'Reseñas',
  },
  FILTER: {
    KO: '필터',
    EN: 'Filters',
    ZH: '筛选',
    ES: 'Filtros',
  },
  M_FILTER: {
    KO: '필터',
    EN: 'filter',
    ZH: '筛选',
    ES: 'filtro',
  },
  APPLY: {
    KO: '필터적용',
    EN: 'Apply',
    ZH: '应用筛选',
    ES: 'Aplicar',
  },
  RESET: {
    KO: '초기화',
    EN: 'Reset',
    ZH: '重置',
    ES: 'Restablecer',
  },
  MOCRA_FDA_REGISTERED: {
    KO: '모크라 / FDA 등록 여부',
    EN: 'MoCRA FDA Registered',
    ZH: 'MoCRA / FDA 注册情况',
    ES: 'Registrado en MoCRA/FDA',
  },
  TYPE: {
    KO: '타입',
    EN: 'Type',
    ZH: '类型',
    ES: 'Tipo',
  },
  ALL: {
    KO: '전체',
    EN: 'All',
    ZH: '全部',
    ES: 'Todo',
  },
  DRY: {
    KO: 'Dry',
    EN: 'Dry',
    ZH: '干性',
    ES: 'Seco',
  },
  OILY: {
    KO: 'Oily',
    EN: 'Oily',
    ZH: '油性',
    ES: 'Graso',
  },
  SENSITIVE: {
    KO: 'Sensitive',
    EN: 'Sensitive',
    ZH: '敏感',
    ES: 'Sensitivo',
  },
  ACNE: {
    KO: 'Acne',
    EN: 'Acne',
    ZH: '痤疮',
    ES: 'Acné',
  },
  NORMAL: {
    KO: 'Normal',
    EN: 'Normal',
    ZH: '正常',
    ES: 'Normal',
  },
  PAGE_NOT_FOUND: {
    KO: '페이지를 찾을수 없습니다.',
    EN: 'Page Not Found',
    ZH: '页面未找到',
    ES: 'Página no encontrada',
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
    ZH: {
      // 중국
      KO: '중국',
      EN: 'China',
      CODE: 'CN', // 나라 코드 값
      LANG: 'zh', // 주 언어 (중국어)
    },
    ES: {
      // 스페인
      KO: '스페인',
      EN: 'Spain',
      CODE: 'ES', // 나라 코드 값
      LANG: 'es', // 주 언어 (스페인어)
    },
    /*
    JP: {
      // 일본
      KO: '일본',
      EN: 'Japan',
      CODE: 'JP', // 나라 코드 값
      LANG: 'ja', // 주 언어 (일본어)
    },
    ZH:{
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
