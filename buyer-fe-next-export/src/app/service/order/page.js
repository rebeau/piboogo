'use client';

import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Img,
  Input,
  Radio,
  RadioGroup,
  Image as ChakraImage,
  Text,
  VStack,
  Select,
  Spinner,
  ModalBody,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  FormControl,
  FormLabel,
  ModalFooter,
} from '@chakra-ui/react';
import MainTopHeader from '@/components/custom/header/MainTopHeader';
import ContentBR from '@/components/custom/ContentBR';
import TitleTextInput from '@/components/input/custom/TitleTextInput';
import Footer from '@/components/common/custom/Footer';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useLocale from '@/hooks/useLocale';
import { COUNTRY, COUNTRY_LIST, LANGUAGES } from '@/constants/lang';
import RightBlueArrow from '@public/svgs/icon/right-blue.svg';
import { useRouter } from 'next/navigation';
import CustomCheckbox from '@/components/common/checkbox/CustomCheckBox';
import utils from '@/utils';
import buyerApi from '@/services/buyerUserApi';
import stripeApi from '@/services/stripeApi';
import { SUCCESS } from '@/constants/errorCode';
import holdingCouponApi from '@/services/holdingCouponApi';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import useModal from '@/hooks/useModal';
import PaypalLogo from '@public/svgs/simbol/paypal-logo.svg';
import AuthorizeDotNet from '@public/svgs/simbol/authorize-dot-net.svg';
import StripeLogo from '@public/images/stripe.png';
import useMove from '@/hooks/useMove';
import {
  isOrderAddFlagState,
  productOrderState,
  stripeOrdersIdState,
  stripeBeforeOrdersDataState,
} from '@/stores/orderRecoil';
import MainContainer from '@/components/layout/MainContainer';
import useDevice from '@/hooks/useDevice';
import { SERVICE } from '@/constants/pageURL';
import paymentTransactionApi from '@/services/paymentTransactionApi';
import usePaypal from '@/hooks/usePaypal';
import useAuthorize from '@/hooks/useAuthorize';
import ordersApi from '@/services/ordersApi';
import useOrders from '@/hooks/useOrders';
import {
  isOpenGoogleAddrState,
  selectedGoogleAddrState,
} from '@/stores/googleAddrRecoil';
import { openStripeModal, StripeModal } from '@/hooks/useStripePayment';

const OrderPage = () => {
  const {
    setPrice,
    orderData,
    setOrderData,
    paypalLoaded,
    isOpenPaypal,
    onOpenPaypal,
    onClosePaypal,
  } = usePaypal();

  const {
    isOpenAuthorize,
    onOpenAuthorize,
    onCloseAuthorize,
    //
    authorizeAmount,
    setAuthorizeAmount,
    setAuthorizeData,
    //
    cardNumber,
    setCardNumber,
    expirationDate,
    setExpirationDate,
    year,
    setyear,
    month,
    setMonth,
    cvv,
    setCvv,
    //
    handlePayment,
    handleUIPayment,
  } = useAuthorize();

  const [finalOrderData, setFinalOrderData] = useState({});

  const { isMobile, clampW } = useDevice();

  const router = useRouter();
  const { lang, localeText } = useLocale();
  const { moveBrand, moveBrandProduct, moveOrdersHistory } = useMove();
  const { openModal } = useModal();

  const { handleClearOrder } = useOrders();

  const [isOrderAddFlag, setIsOrderAddFlag] =
    useRecoilState(isOrderAddFlagState);

  const [productOrder, setProductOrder] = useRecoilState(productOrderState);
  const [stripeOrdersId, setStripeOrdersId] =
    useRecoilState(stripeOrdersIdState);
  const [stripeBeforeOrdersData, setStripeBeforeOrdersData] = useRecoilState(
    stripeBeforeOrdersDataState,
  );

  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentOrderData, setPaymentOrderData] = useState(null);

  const [selectedCouponId, setSelectedCouponId] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [userAddress, setUserAddress] = useState({});

  const [ordersProductList, setOrdersProductList] = useState([]);

  const [orgTotalPrice, setOrgTotalPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
  const [bundleDiscountPrice, setBundleDiscountPrice] = useState(0);

  const [listCoupon, setListCoupon] = useState([]);
  const [couponCount, setCouponCount] = useState(0);
  const [reward, setReward] = useState(0);
  const [rewardCoin, setRewardCoin] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(1);

  // 결제 가능여부
  const [isCheckOut, setIsCheckOut] = useState(false);

  // 주소 그대로 사용
  const [isSameUser, setIsSameUser] = useState(false);

  // 주소 관련
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');

  const [addressType, setAddressType] = useState(1);
  const [phone, setPhone] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [messages, setMessages] = useState('');

  const popupRef = useRef(null);

  const [token, setToken] = useState(null);

  const boxRef = useRef(null);
  const [topOffset, setTopOffset] = useState(0); // 320

  useEffect(() => {
    if (!isMobile(true)) {
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        // if (scrollTop < 320) return;
        // setTopOffset(scrollTop + 100); // 고정 위치 오프셋 (100px 아래로)
        if (scrollTop > 1900) {
          return;
        } else if (scrollTop > 100) {
          setTopOffset(scrollTop - 200);
        } else {
          setTopOffset(scrollTop);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const setIsOpenGoogleAddr = useSetRecoilState(isOpenGoogleAddrState);
  const selectedAddress = useRecoilValue(selectedGoogleAddrState);

  useEffect(() => {
    if (selectedAddress) {
      if (selectedAddress.countryAlpha2Code === COUNTRY.COUNTRY_INFO.KR.CODE) {
        setAddress1(selectedAddress.streetAddress);
        setAddress2(selectedAddress.detailAddress);
        setCountry(COUNTRY.COUNTRY_INFO.KR.CODE);
        setAddressType(1);
      } else {
        setAddress1(selectedAddress.pullAddress);
        setAddress2('');
        setCountry(COUNTRY.COUNTRY_INFO.US.CODE);
        setAddressType(2);
      }
      setState(selectedAddress.stateOrProvince);
      setCity(selectedAddress.city);
      setZipCode(selectedAddress.postalCode);
    }
  }, [selectedAddress]);

  // 토큰을 발급받는 함수 (예시: API 호출로 토큰 생성)
  const handleGetToken = async (actualAmount) => {
    const param = {
      amount: actualAmount,
    };
    const result = await paymentTransactionApi.getPaymentTransaction(param);
    if (result?.errorCode === SUCCESS) {
      const token = result.data.token;
      setToken(token);
    } else {
      console.error('결제 토큰을 생성하는 데 실패했습니다.', result);
    }
  };

  // 새 창을 띄우고, 폼을 통해 POST 요청을 보내는 함수
  const openPaymentPopup = () => {
    // 새 창을 띄운다.
    const popupWindow = window.open('', 'PaymentPopup', 'width=800,height=800');

    if (!popupWindow) {
      console.error('팝업이 차단되었습니다.');
      return;
    }

    // 결제 폼 생성
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://test.authorize.net/payment/payment';
    form.target = 'PaymentPopup'; // 팝업에서 폼 결과를 표시

    // 토큰을 폼에 추가
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'token';
    input.value = token;
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    // openModal({
    //   text: localeText(LANGUAGES.ORDER.PAYMENT_PROCESSING),
    //   onAgree: () => {
    //     // 폼을 DOM에 추가하고 전송

    //   },
    // });
  };

  useEffect(() => {
    const handleMessage = (event) => {
      // 메시지를 보낸 origin 검증 (보안을 위해 꼭 확인)
      if (event.origin !== 'https://piboogo.com') return;

      // 메시지 처리 (예: 결제 성공 여부)

      console.log('결제 결과:', event.data);

      // console.log('결제 상태:', status, data);
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    if (productOrder?.ordersProductList) {
      if (productOrder.ordersProductList.length > 0) {
        setOrdersProductList(productOrder.ordersProductList);
        if (productOrder.ordersProductList.length > 0) {
          const ordersProductList = productOrder.ordersProductList;
          let tempTotalPrice = 0;
          ordersProductList.map((item) => {
            tempTotalPrice += item.totalPrice;
          });
          setOrgTotalPrice(tempTotalPrice);

          let discountPrice = 0;
          ordersProductList.map((item) => {
            const productDiscountList = item?.productDiscountList || [];
            const count = item.count;
            const totalPrice = item.totalPrice;
            if (productDiscountList.length > 0) {
              const discount = utils.getDiscountData(
                productDiscountList,
                count,
              );
              if (discount) {
                if (count >= discount.discountCnt) {
                  if (discount.type === 1) {
                    discountPrice +=
                      Number(totalPrice) * (discount.amount / 100);
                  } else if (discount.type === 2) {
                    discountPrice += Number(discount.amount);
                  }
                }
              }
            }
          });
          setBundleDiscountPrice(discountPrice);

          setTotalPrice(Number(tempTotalPrice) - Number(discountPrice));
        }
      }
    } else {
      router.replace(SERVICE.MAIN.ROOT);
      return;
    }

    if (lang === COUNTRY.COUNTRY_INFO.KR.CODE) {
      setAddressType(1);
      setCountry(COUNTRY.COUNTRY_INFO.KR.CODE);
    } else {
      setAddressType(2);
      setCountry(COUNTRY.COUNTRY_INFO.US.CODE);
    }

    handleGetMyInfo();
    handleGetListCoupon();
    handleGetMyReward();
  }, []);

  useEffect(() => {
    if (country === 'KR') {
      setAddressType(1);
    } else {
      setAddressType(2);
    }
  }, [country]);

  useEffect(() => {
    if (orgTotalPrice > 0) {
      if (orgTotalPrice >= productOrder.minimumOrderAmount) {
        setIsCheckOut(true);
      } else {
        setIsCheckOut(false);
      }
    }
  }, [orgTotalPrice]);

  useEffect(() => {
    if (selectedCouponId) {
      const targetCoupon = listCoupon.find((coupon) => {
        return Number(coupon.couponId) === Number(selectedCouponId);
      });
      if (targetCoupon) {
        const type = targetCoupon.type;
        const tempCouponDiscountAmount = couponDiscountAmount || 0;
        let adjustedReward = reward;
        if (reward + tempCouponDiscountAmount > totalPrice) {
          adjustedReward = Math.max(0, totalPrice - tempCouponDiscountAmount);
          setReward(adjustedReward);
        }
      }
    }
  }, [selectedCouponId]);

  useEffect(() => {
    if (isSameUser) {
      const name = userInfo.name;
      if (name) {
        const nameSplit = name?.split(' ');
        if (nameSplit.length === 2) {
          setFirstName(nameSplit[1]);
          setLastName(nameSplit[0]);
        } else if (nameSplit.length > 2) {
          const first = nameSplit.pop();
          setFirstName(first);
          setLastName(nameSplit.join(' '));
        } else {
          setFirstName('');
          setLastName(nameSplit.join(' '));
        }
      }

      setPhone(userInfo.phone);

      if (userAddress.addressType === 1) {
        setAddressType(1);
        setCountry(COUNTRY.COUNTRY_INFO.KR.CODE);
        setAddress1(userAddress.roadNameMainAddr);
        setAddress2(userAddress?.subAddr || '');
      } else {
        setAddressType(2);
        setCountry(COUNTRY.COUNTRY_INFO.US.CODE);
        setAddress1(userAddress.addressLineOne);
        setAddress2(userAddress?.addressLineTwo || '');
      }
      setCity(userAddress?.city);
      setState(userAddress?.state);
      setZipCode(userAddress?.zipCode);
    }
  }, [isSameUser]);

  const handleGetMyInfo = useCallback(async () => {
    const result = await buyerApi.getBuyerMyInfo();
    if (result?.errorCode === SUCCESS) {
      setUserInfo(result.data);
      const tempAddress = { ...result.data.rsGetUserAddressDTO };
      setUserAddress(tempAddress);
    }
  });

  const handleGetListCoupon = useCallback(async () => {
    const param = {
      pageNum: 1,
      contentNum: 99999,
      status: 1,
    };
    const result = await holdingCouponApi.getListHoldingCoupon(param);

    if (result?.errorCode === SUCCESS) {
      setListCoupon(result.datas);
      setCouponCount(result.datas.length);
    } else {
      setListCoupon([]);
      setCouponCount(0);
    }
  });

  const handleGetMyReward = useCallback(async () => {
    const result = await buyerApi.getBuyerMyReward();
    if (result?.errorCode === SUCCESS) {
      setRewardCoin(result.data.rewardCoin);
    }
  });

  const handleFullUseReward = () => {
    if (totalPrice === 0) return;
    const targetTotalPrice = totalPrice - couponDiscountAmount || 0;
    if (Math.sign(targetTotalPrice) === -1) {
      setReward(0);
      return;
    }
    if (rewardCoin > targetTotalPrice) {
      setReward(targetTotalPrice);
    } else {
      setReward(rewardCoin);
    }
  };

  const handleInputReward = (e) => {
    let inputValue = Number(e.target.value);

    if (Number.isNaN(inputValue)) return;

    const targetTotalPrice = totalPrice - couponDiscountAmount || 0;

    if (Math.sign(targetTotalPrice) === -1) {
      setReward(0);
      return;
    }

    const validReward = Math.min(
      Math.max(0, inputValue),
      rewardCoin,
      targetTotalPrice,
    );

    setReward(validReward);
  };

  const finalAmount = useMemo(() => {
    let tempAmount =
      Number(orgTotalPrice) -
      (Number(couponDiscountAmount) +
        Number(reward) +
        Number(bundleDiscountPrice));
    return utils.parseDallar(Math.max(0, tempAmount));
  }, [orgTotalPrice, couponDiscountAmount, reward, bundleDiscountPrice]);

  const handleStripePayment = async (param, ordersId) => {
    if (ordersId) {
      // 기존 주문
      const stripeResult = await stripeApi.postStripe({
        ordersId,
        amount: param.paymentTransaction.amount,
      });
      if (stripeResult?.errorCode === SUCCESS) {
        //
        setFinalOrderData({ ...finalOrderData, ordersId });
        const clientSecret = stripeResult.data.clientSecret;
        // 결제 모달 열기
        openStripeModal({
          clientSecret,
        }).catch(() => {
          openModal({
            text: localeText(LANGUAGES.INFO_MSG.PAYMENT_PROCESSING_ERROR),
          });
        });
      } else {
        openModal({
          text: stripeResult.message,
        });
      }
    } else {
      // 새로운 주문
      const result = await ordersApi.postOrdersStripe(param);
      if (result?.errorCode === SUCCESS) {
        const ordersId = result.data.ordersId;
        setStripeOrdersId(ordersId);
        setStripeBeforeOrdersData(param);
        const stripeResult = await stripeApi.postStripe({
          ordersId,
          amount: param.paymentTransaction.amount,
        });
        if (stripeResult?.errorCode === SUCCESS) {
          //
          setFinalOrderData({ ...finalOrderData, ordersId });
          const clientSecret = stripeResult.data.clientSecret;
          // 결제 모달 열기
          openStripeModal({
            clientSecret,
          }).catch(() => {
            openModal({
              text: localeText(LANGUAGES.INFO_MSG.PAYMENT_PROCESSING_ERROR),
            });
          });
        } else {
          openModal({
            text: stripeResult.message,
          });
        }
      } else {
        openModal({
          text: stripeResult.message,
        });
      }
    }
  };

  const handleOrderButton = async () => {
    // setIsOrderAddFlag
    if (!isCheckOut) {
      setIsOrderAddFlag(true);
      moveBrandProduct();
      return;
    }

    // 유효성 체크
    if (!(lastName + firstName)) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_NAME),
      });
    }
    if (!phone) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_PHONE),
      });
    }
    if (!utils.checkPhoneNum(phone)) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_MATCH_PHONE),
      });
    }
    if (!address1) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_ADDRESS),
      });
    }
    if (!state) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_STATE),
      });
    }
    if (!city) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_CITY),
      });
    }
    if (!zipCode) {
      return openModal({
        text: localeText(LANGUAGES.ERR_MSG.ACC.NOT_FOUND_ZIP_CODE),
      });
    }

    const param = {
      totalAmount: totalPrice,
    };

    if (param.totalAmount === 0) {
      return openModal({
        text: localeText(LANGUAGES.INFO_MSG.MINIMUM_ORDER_AMOUNT, {
          key: '@COUNT@',
          value: utils.parseDallar(productOrder.minimumOrderAmount),
        }),
      });
    }

    let actualAmount = totalPrice;
    if (reward) {
      param.rewardDiscountAmount = reward;
    }
    if (couponDiscountAmount) {
      param.couponDiscountAmount = couponDiscountAmount;
    }

    const totalDiscount =
      (reward ? Math.max(0, reward) : 0) +
      (couponDiscountAmount ? Math.max(0, couponDiscountAmount) : 0);
    if (totalDiscount > 0) {
      param.discountAmount = totalDiscount;
    }

    actualAmount = Math.max(0, actualAmount - totalDiscount);
    param.actualAmount = actualAmount;

    if (messages) {
      param.ordersMemo = messages;
    }

    let paymentTransaction = {
      amount: actualAmount,
    };
    if (actualAmount === 0) {
      paymentTransaction.dataDescriptor = '';
      paymentTransaction.dataValue = '';
    } else {
      if (paymentMethod === 1) {
        //
      } else if (paymentMethod === 2) {
        //
      } else {
        //
      }
    }
    param.paymentTransaction = paymentTransaction;

    // ordersAddress
    const ordersAddress = {
      name: lastName + ' ' + firstName,
      phone: phone,
      addressType: addressType,
      zipCode: zipCode,
      state: state,
      city: city,
    };
    if (addressType === 1) {
      ordersAddress.roadNameMainAddr = address1;
      // ordersAddress.landNumberMainAddr = address1;
      if (address2) {
        ordersAddress.subAddr = address2;
      }
    } else {
      ordersAddress.addressLineOne = address1;
      if (address2) {
        ordersAddress.addressLineTwo = address2;
      }
    }
    param.ordersAddress = ordersAddress;

    // ordersProductList
    const ordersProductList = [];
    productOrder.ordersProductList.map((order) => {
      const temp = {
        productId: order.productId,
        count: order.count,
        unitPrice: order.unitPrice,
        totalPrice: order.totalPrice,
      };
      if (order.ordersProductOptionList) {
        const option = order.ordersProductOptionList[0];
        const tempProductOption = {
          productOptionId: option.productOptionId,
          count: option.count,
          unitPrice: option.unitPrice,
          totalPrice: option.totalPrice,
        };
        temp.ordersProductOptionList = [tempProductOption];
      }
      ordersProductList.push(temp);
    });
    param.ordersProductList = ordersProductList;

    setFinalOrderData(param);

    setTimeout(async () => {
      if (actualAmount !== 0) {
        if (paymentMethod === 1) {
          setPrice(actualAmount);
          setOrderData(param);
          onOpenPaypal();
        } else if (paymentMethod === 2) {
          setAuthorizeAmount(actualAmount);
          setAuthorizeData(param);
          onOpenAuthorize();
        } else if (paymentMethod === 3) {
          if (
            JSON.stringify(param) !== JSON.stringify(stripeBeforeOrdersData)
          ) {
            handleStripePayment(param);
          } else {
            handleStripePayment(stripeBeforeOrdersData, stripeOrdersId);
          }
        }
      } else {
        const result = await ordersApi.postOrders(param);
        if (result?.errorCode === SUCCESS) {
          openModal({
            text: result.message,
            onAgree: () => {
              handleClearOrder();
              moveOrdersHistory();
            },
          });
        } else {
          openModal({
            text: result.message,
            onAgree: () => {
              handleClearOrder();
              moveOrdersHistory();
            },
          });
        }
      }
    }, 10);
  };

  const handleSelectedCoupon = (couponId) => {
    const targetCoupon = listCoupon.find((coupon) => {
      return Number(coupon.couponId) === Number(couponId);
    });
    if (targetCoupon) {
      const type = targetCoupon.type;
      const tempCouponDiscountAmount = targetCoupon.discountAmount;
      console.log(totalPrice);
      let tempDiscountAmount = null;
      if (type === 1) {
        tempDiscountAmount = tempCouponDiscountAmount;
      } else if (type === 2) {
        tempDiscountAmount = (totalPrice * tempCouponDiscountAmount) / 100;
      }
      setCouponDiscountAmount(tempDiscountAmount);
    }
    setSelectedCouponId(Number(couponId));
  };

  const handleDisCountAmount = () => {
    const targetCoupon = listCoupon.find((coupon) => {
      return Number(coupon.couponId) === Number(selectedCouponId);
    });
    let tempDiscountAmount = 0;
    if (targetCoupon) {
      const type = targetCoupon.type;
      const discountAmount = targetCoupon.discountAmount;
      if (type === 1) {
        tempDiscountAmount = discountAmount;
      } else if (type === 2) {
        const discount = (totalPrice * discountAmount) / 100;
        tempDiscountAmount = discount;
      }
    }
    return (
      <Text
        color={'#940808'}
        fontSize={'1rem'}
        fontWeight={500}
        lineHeight={'1.75rem'}
      >
        {utils.parseDallar(tempDiscountAmount)}
      </Text>
    );
  };

  return isMobile(true) ? (
    <MainContainer>
      <Center w={'100%'} h={'100%'}>
        <Box w={'100%'} h={'calc(100% - 5.5rem)'} mb={'5.5rem'}>
          <VStack w={'100%'} h={'100%'} spacing={0}>
            <MainTopHeader />
            <Box w={'100%'} px={clampW(1, 10)} py={'1rem'}>
              <Text
                color={'#485766'}
                fontSize={clampW(1.5, 3)}
                fontStyle={'normal'}
                fontWeight={400}
                lineHeight={'170%'}
              >
                {localeText(LANGUAGES.ORDER.ORDER)}
              </Text>
            </Box>

            <ContentBR h={'1.3rem'} />

            <Box w={'100%'} px={clampW(1, 10)}>
              <VStack spacing={'2rem'}>
                {/* Product Information */}
                <Box w={'100%'}>
                  <VStack spacing={'1.25rem'}>
                    <Box w={'100%'}>
                      <Text
                        color={'#485766'}
                        fontSize={clampW(1.125, 1.5)}
                        fontWeight={500}
                        lineHeight={'160%'}
                      >
                        {localeText(LANGUAGES.ORDER.PRODUCT_INFORMATION)}
                      </Text>
                    </Box>
                    {/* Product Rows */}
                    <Box w={'100%'}>
                      <VStack spacing={0}>
                        {ordersProductList.map((orderProduct, index) => {
                          return <OrderCard key={index} item={orderProduct} />;
                        })}
                      </VStack>
                    </Box>
                  </VStack>
                </Box>

                {/* Orderer Information */}
                <Box w={'100%'}>
                  <VStack spacing={'2rem'}>
                    <Box w={'100%'}>
                      <Text
                        color={'#485766'}
                        fontSize={'1.5rem'}
                        fontWeight={500}
                        lineHeight={'2.475rem'}
                      >
                        {localeText(LANGUAGES.ORDER.ORDERER_INFORMATION)}
                      </Text>
                    </Box>
                    <Box w={'100%'}>
                      <VStack spacing={'1.25rem'}>
                        <Box w={'100%'}>
                          <HStack spacing={'2rem'}>
                            <Text
                              w={'7.5rem'}
                              color={'#7895B2'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(LANGUAGES.ORDER.ORDERER_NAME)}
                            </Text>
                            <Text
                              color={'#556A7E'}
                              fontSize={clampW(0.875, 1)}
                              fontWeight={500}
                              lineHeight={'160%'}
                            >
                              {userInfo.name}
                            </Text>
                          </HStack>
                        </Box>
                        <Box w={'100%'}>
                          <HStack spacing={'2rem'}>
                            <Text
                              w={'7.5rem'}
                              color={'#7895B2'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(LANGUAGES.ACC.PHONE_NUMBER)}
                            </Text>
                            <Text
                              color={'#556A7E'}
                              fontSize={clampW(0.875, 1)}
                              fontWeight={500}
                              lineHeight={'160%'}
                            >
                              {utils.parsePhoneNum(userInfo.phone)}
                            </Text>
                          </HStack>
                        </Box>
                        <Box w={'100%'}>
                          <HStack spacing={'2rem'}>
                            <Text
                              w={'7.5rem'}
                              color={'#7895B2'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(LANGUAGES.ACC.EMAIL)}
                            </Text>
                            <Text
                              color={'#556A7E'}
                              fontSize={clampW(0.875, 1)}
                              fontWeight={500}
                              lineHeight={'160%'}
                            >
                              {userInfo.id}
                            </Text>
                          </HStack>
                        </Box>
                      </VStack>
                    </Box>
                  </VStack>
                </Box>

                {/* Shipping Information */}
                <Box w={'100%'}>
                  <VStack spacing={'2rem'}>
                    <Box w={'100%'}>
                      <VStack spacing={'1rem'}>
                        <Box w={'100%'}>
                          <Text
                            color={'#485766'}
                            fontSize={clampW(1.25, 1.5)}
                            fontWeight={500}
                            lineHeight={'160%'}
                          >
                            {localeText(LANGUAGES.ORDER.SHIPPING_INFORMATION)}
                          </Text>
                        </Box>
                        <Box w={'100%'}>
                          <HStack spacing={'0.5rem'} alignItems={'center'}>
                            <Box w={'1.75rem'} h={'1.75rem'}>
                              <CustomCheckbox
                                isChecked={isSameUser}
                                onChange={(v) => {
                                  setIsSameUser(v);
                                }}
                              />
                            </Box>
                            <Text
                              color={'#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={500}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(
                                LANGUAGES.ORDER.SAME_AS_ORDERER_INFORMATION,
                              )}
                            </Text>
                          </HStack>
                        </Box>
                      </VStack>
                    </Box>

                    <Box w={'100%'}>
                      <VStack spacing={'1.25rem'}>
                        {/* First Row: Last name and First name */}
                        <Box w={'100%'}>
                          <HStack w={'100%'} spacing={'1.25rem'}>
                            <Box w={'50%'}>
                              <TitleTextInput
                                value={lastName}
                                onChange={(v) => {
                                  setLastName(v);
                                }}
                                title={localeText(LANGUAGES.ACC.LAST_NAME)}
                              />
                            </Box>
                            <Box w={'50%'}>
                              <TitleTextInput
                                value={firstName}
                                onChange={(v) => {
                                  setFirstName(v);
                                }}
                                title={localeText(LANGUAGES.ACC.FIRST_NAME)}
                              />
                            </Box>
                          </HStack>
                        </Box>

                        <Box w={'100%'}>
                          <TitleTextInput
                            value={phone}
                            type={'number'}
                            onChange={(v) => {
                              setPhone(v);
                            }}
                            max={12}
                            title={localeText(LANGUAGES.ACC.PHONE_NUMBER)}
                            placeholder={localeText(LANGUAGES.ACC.PHONE_NUMBER)}
                          />
                        </Box>

                        <Box w={'100%'}>
                          <TitleTextInput
                            value={address1}
                            title={localeText(LANGUAGES.ORDER_ADDR_1)}
                            placeholder={localeText(LANGUAGES.ORDER_ADDR_1)}
                            isReadOnly
                            onClick={() => {
                              setIsOpenGoogleAddr(true);
                            }}
                          />
                        </Box>

                        <Box w={'100%'}>
                          <TitleTextInput
                            value={address2}
                            onChange={(v) => {
                              setAddress2(v);
                            }}
                            title={`${localeText(LANGUAGES.ADDRESS.ADDRESS2)} (${localeText(LANGUAGES.ACC.SU.OPTIONAL)})`}
                          />
                        </Box>

                        <Box w={'100%'}>
                          <HStack w={'100%'} spacing={'1.25rem'}>
                            <Box w={'50%'}>
                              <TitleTextInput
                                title={localeText(LANGUAGES.ADDRESS.CITY)}
                                placeholder={localeText(LANGUAGES.ADDRESS.CITY)}
                                value={city}
                                onChange={(v) => {
                                  setCity(v);
                                }}
                              />
                            </Box>
                            <Box w={'50%'}>
                              <TitleTextInput
                                title={localeText(LANGUAGES.ADDRESS.STATE)}
                                placeholder={localeText(
                                  LANGUAGES.ADDRESS.STATE,
                                )}
                                value={state}
                                onChange={(v) => {
                                  setState(v);
                                }}
                              />
                            </Box>
                          </HStack>
                        </Box>

                        {/* Fifth Row: Apartment, suite, etc. and Postal code */}
                        <Box w={'100%'}>
                          <HStack w={'100%'} spacing={'1.25rem'}>
                            <Box w={'50%'}>
                              <TitleTextInput
                                type={'number'}
                                max={5}
                                title={localeText(
                                  LANGUAGES.ADDRESS.POSCAL_CODE,
                                )}
                                placeholder={localeText(
                                  LANGUAGES.ADDRESS.POSCAL_CODE,
                                )}
                                value={zipCode}
                                onChange={(v) => {
                                  setZipCode(v);
                                }}
                              />
                            </Box>
                            <Box w={'50%'}>
                              <Box h={'5.5rem'} maxW={null}>
                                <VStack
                                  alignItems={'flex-start'}
                                  spacing={'0.25rem'}
                                >
                                  <Text
                                    color={'#7895B2'}
                                    fontSize={'1rem'}
                                    fontWeight={400}
                                    lineHeight={'1.75rem'}
                                  >
                                    {localeText(LANGUAGES.ADDRESS.COUNTRY)}
                                  </Text>
                                  <Select
                                    value={country || ''}
                                    onChange={(e) => {
                                      setCountry(e.target.value);
                                    }}
                                    w={'100%'}
                                    h={'3.5rem'}
                                    bg={'#FFF'}
                                    borderRadius={'0.25rem'}
                                    border={'1px solid #9CADBE'}
                                  >
                                    <option value={''}>
                                      {localeText(LANGUAGES.ADDRESS.COUNTRY)}
                                    </option>
                                    {COUNTRY_LIST.map((item, index) => {
                                      return (
                                        <option key={index} value={item.CODE}>
                                          {item[lang.toUpperCase()]}
                                        </option>
                                      );
                                    })}
                                  </Select>
                                </VStack>
                              </Box>
                            </Box>
                          </HStack>
                        </Box>

                        <Box w={'100%'}>
                          <TitleTextInput
                            value={messages}
                            onChange={(v) => {
                              setMessages(v);
                            }}
                            title={localeText(LANGUAGES.ORDER.MESSAGES)}
                            placeholder={localeText(LANGUAGES.ORDER.MESSAGES)}
                          />
                        </Box>
                      </VStack>
                    </Box>
                  </VStack>
                </Box>

                {/* Coupon Discounts Section */}
                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <Text
                        color={'#485766'}
                        fontSize={clampW(1.25, 1.5)}
                        fontWeight={500}
                        lineHeight={'160%'}
                      >
                        {localeText(LANGUAGES.ORDER.COUPON_DISCOUNTS)}
                      </Text>
                    </Box>

                    <Divider
                      borderTop={'1px solid #73829D'}
                      boxSizing="border-box"
                    />

                    <Box w={'100%'}>
                      {listCoupon.length > 0 && (
                        <RadioGroup
                          value={selectedCouponId}
                          onChange={(couponId) => {
                            handleSelectedCoupon(couponId);
                          }}
                        >
                          <VStack spacing={'1.5rem'}>
                            {listCoupon.map((item, index) => (
                              <CouponCard key={index} item={item} />
                            ))}
                          </VStack>
                        </RadioGroup>
                      )}
                      {listCoupon.length === 0 && (
                        <Center w={'100%'} h={'10rem'}>
                          <Text
                            fontSize={'1.5rem'}
                            fontWeight={500}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.INFO_MSG.NO_COUPON)}
                          </Text>
                        </Center>
                      )}
                    </Box>
                  </VStack>
                </Box>

                {/* Reward Coin Section */}
                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <Text
                        color={'#485766'}
                        fontSize={clampW(1.25, 1.5)}
                        fontWeight={500}
                        lineHeight={'160%'}
                      >
                        {localeText(LANGUAGES.ORDER.REWARD_COINS)}
                      </Text>
                    </Box>

                    <Divider
                      borderTop={'1px solid #73829D'}
                      boxSizing="border-box"
                    />

                    <Box w={'100%'}>
                      <HStack justifyContent={'space-between'}>
                        <Box>
                          <HStack spacing={'0.75rem'}>
                            <Box>
                              <Input
                                w={clampW(5.6, 9.5)}
                                h={'3.25rem'}
                                type={'number'}
                                borderRadius={'0.25rem'}
                                border={'1px solid #9CADBE'}
                                py={'0.75rem'}
                                px={'1.5rem'}
                                bg={'#FFF'}
                                fontSize={'1rem'}
                                value={reward}
                                onChange={(e) => {
                                  handleInputReward(e);
                                }}
                              />
                            </Box>
                            <Box>
                              <VStack spacing={0}>
                                <Box>
                                  <Text
                                    color={'#66809C'}
                                    fontSize={'1rem'}
                                    fontWeight={500}
                                    lineHeight={'1.75rem'}
                                  >
                                    {localeText(LANGUAGES.ORDER.COIN_OF)}
                                  </Text>
                                </Box>
                                <Box>
                                  <Text
                                    color={'#FF5454'}
                                    fontSize={'1rem'}
                                    fontWeight={500}
                                    lineHeight={'1.75rem'}
                                  >
                                    {`${rewardCoin} ${localeText(LANGUAGES.ORDER.COIN)}`}
                                  </Text>
                                </Box>
                              </VStack>
                            </Box>
                          </HStack>
                        </Box>
                        <Box>
                          <Button
                            onClick={() => {
                              handleFullUseReward();
                            }}
                            minW={'7rem'}
                            h={'3.25rem'}
                            borderRadius={'0.25rem'}
                            border={'1px solid #73829D'}
                          >
                            <Text
                              color={'#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(LANGUAGES.ORDER.FULL_USE)}
                            </Text>
                          </Button>
                        </Box>
                      </HStack>
                    </Box>
                  </VStack>
                </Box>

                {/* Payment method Section */}
                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <Text
                        color={'#485766'}
                        fontSize={clampW(1.25, 1.5)}
                        fontWeight={500}
                        lineHeight={'160%'}
                      >
                        {localeText(LANGUAGES.ORDER.PAYMENT_METHOD)}
                      </Text>
                    </Box>

                    <Divider
                      borderTop={'1px solid #73829D'}
                      boxSizing="border-box"
                    />

                    <Box w={'100%'} h={'3rem'}>
                      <RadioGroup
                        value={paymentMethod}
                        onChange={(method) => {
                          setPaymentMethod(Number(method));
                        }}
                      >
                        <HStack
                          h={'100%'}
                          justifyContent={'flex-start'}
                          spacing={'2.62rem'}
                        >
                          <Box>
                            <HStack spacing={'0.75rem'} alignItems={'center'}>
                              <Center h={'1.657rem'}>
                                <Radio value={1} />
                              </Center>
                              <Box h={'1.657rem'}>
                                <Img src={PaypalLogo.src} h={'100%'} />
                              </Box>
                            </HStack>
                          </Box>
                          {/*
                          <Box>
                            <HStack spacing={'0.75rem'} alignItems={'center'}>
                              <Center h={'1.625rem'}>
                                <Radio value={2} />
                              </Center>
                              <Box h={'1.625rem'}>
                                <Img src={AuthorizeDotNet.src} h={'100%'} />
                              </Box>
                            </HStack>
                          </Box>
                          */}
                          <Box>
                            <HStack spacing={'0.75rem'} alignItems={'center'}>
                              <Center h={'1.625rem'}>
                                <Radio value={3} />
                              </Center>
                              <Box h={'1.625rem'}>
                                <Img src={StripeLogo.src} h={'100%'} />
                              </Box>
                            </HStack>
                          </Box>
                        </HStack>
                      </RadioGroup>
                    </Box>
                  </VStack>
                </Box>

                {/* summary */}
                <Box w={'100%'} p={'1.25rem'} border={'1px solid #9CADBE'}>
                  <VStack spacing={'3.5rem'}>
                    {/* Order Summary Section */}
                    <Box w={'100%'}>
                      <VStack spacing={'1.5rem'}>
                        <Box w={'100%'}>
                          <Text
                            color="#485766"
                            fontSize="1.25rem"
                            fontWeight="500"
                            lineHeight="2.25rem"
                          >
                            {localeText(LANGUAGES.ORDER.SUMMARY)}
                          </Text>
                        </Box>

                        <Divider
                          borderTop={'1px solid #73829D'}
                          boxSizing="border-box"
                        />

                        {/* Total Product Price */}
                        <Box w={'100%'}>
                          <VStack spacing={'1.25rem'}>
                            <Box w={'100%'}>
                              <HStack
                                w="full"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                gap="2rem"
                              >
                                <Text
                                  w="10rem"
                                  color="#7895B2"
                                  fontSize="1rem"
                                  fontWeight="400"
                                  lineHeight="1.75rem"
                                  wordBreak="break-word"
                                >
                                  {localeText(LANGUAGES.ORDER.TOTAL_PRODUCT)}
                                </Text>
                                <Text
                                  color="#556A7E"
                                  fontSize="1rem"
                                  fontWeight="500"
                                  lineHeight="1.75rem"
                                  wordBreak="break-word"
                                >
                                  {utils.parseDallar(totalPrice)}
                                </Text>
                              </HStack>
                            </Box>
                            <Box w={'100%'}>
                              <HStack
                                w="full"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                gap="2rem"
                              >
                                <Text
                                  w="10rem"
                                  color="#7895B2"
                                  fontSize="1rem"
                                  fontWeight="400"
                                  lineHeight="1.75rem"
                                  wordBreak="break-word"
                                >
                                  {localeText(LANGUAGES.ORDER.COUPON_DISCOUNT)}
                                </Text>
                                {handleDisCountAmount()}
                              </HStack>
                            </Box>
                            <Box w={'100%'}>
                              <HStack
                                w="full"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                gap="2rem"
                              >
                                <Text
                                  w={'10rem'}
                                  color={'#7895B2'}
                                  fontSize={'1rem'}
                                  fontWeight={400}
                                  lineHeight={'1.75rem'}
                                >
                                  {localeText(LANGUAGES.ORDER.REDEEMING_MILES)}
                                </Text>
                                <Text
                                  color={'#556A7E'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {`${reward} coin`}
                                </Text>
                              </HStack>
                            </Box>
                            <Box w={'100%'}>
                              <HStack
                                w="full"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                gap="2rem"
                              >
                                <Text
                                  w="10rem"
                                  color="#66809C"
                                  fontSize="1.125rem"
                                  fontWeight="500"
                                  lineHeight="1.96875rem"
                                  wordBreak="break-word"
                                >
                                  {localeText(LANGUAGES.ORDER.TOTAL)}
                                </Text>
                                <Text
                                  color="#485766"
                                  fontSize="1.125rem"
                                  fontWeight="600"
                                  lineHeight="1.96875rem"
                                  wordBreak="break-word"
                                >
                                  {finalAmount}
                                </Text>
                              </HStack>
                            </Box>
                          </VStack>
                        </Box>
                      </VStack>
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            </Box>

            <ContentBR h={'1.5rem'} />

            {isOpenPaypal && (
              <Modal isOpen={isOpenPaypal} onClose={onClosePaypal} size="md">
                <ModalOverlay />
                <ModalContent
                  borderRadius={'0.25rem'}
                  px={5}
                  alignSelf={'center'}
                  maxH={'80%'}
                  overflowY={'auto'}
                  className={'no-scroll'}
                >
                  <ModalBody
                    w={'100%'}
                    h={'100%'}
                    maxW={null}
                    position={'relative'}
                    pt={'5%'}
                    px={0}
                  >
                    {!paypalLoaded && (
                      <Center w={'100%'} h={'100%'}>
                        <Spinner />
                      </Center>
                    )}
                    <div id="paypal-button-container"></div>
                  </ModalBody>
                </ModalContent>
              </Modal>
            )}

            {/* StripeModal */}
            <StripeModal orderDataStripe={finalOrderData} />

            {/* <Footer /> */}
          </VStack>
        </Box>

        <Box
          w={'100%'}
          h={'5.5rem'}
          position={'fixed'}
          bottom={0}
          p={'1rem'}
          borderTop={'1px solid #AEBDCA'}
          bg={'#FFF'}
        >
          <Button
            onClick={() => {
              handleOrderButton();
            }}
            w={'100%'}
            h={'100%'}
            px={'2rem'}
            py={'0.88rem'}
            borderRadius={'0.25rem'}
            borderTop={'1px solid #73829D'}
            bg={'#66809C'}
          >
            <Text
              color={'#FFF'}
              fontSize={'1.25rem'}
              fontWeight={400}
              lineHeight={'2.25rem'}
            >
              {isCheckOut
                ? localeText(LANGUAGES.ORDER.CHECK_OUT)
                : localeText(LANGUAGES.ORDER.ORDER_ADDITIONAL)}
            </Text>
          </Button>
        </Box>
      </Center>
    </MainContainer>
  ) : (
    <MainContainer>
      <Center w={'100%'} overflowX={'auto'}>
        <VStack w={'100%'} maxW={1920} spacing={0}>
          <MainTopHeader />
          <Box w={'100%'} px={'10rem'} py={'2.5rem'}>
            <Text
              color={'#485766'}
              fontSize={'3rem'}
              fontStyle={'normal'}
              fontWeight={400}
              lineHeight={'4.5rem'}
            >
              {localeText(LANGUAGES.ORDER.ORDER)}
            </Text>
          </Box>

          <ContentBR h={'2.5rem'} />

          <Box
            w={'100%'}
            px={{
              base: '1.25rem',
              md: '2.5rem',
              lg: '1.5rem',
              xl: '2rem',
              '2xl': '4rem',
              '3xl': '10rem',
            }}
            h="100%"
          >
            <HStack
              spacing={'2.5rem'}
              justifyContent={'space-between'}
              alignItems={'flex-start'}
              h="100%"
            >
              <Box w={'60rem'} minW="35rem">
                <VStack spacing={'5rem'}>
                  {/* Product Information */}
                  <Box w={'100%'}>
                    <VStack spacing={'2rem'}>
                      <Box w={'100%'}>
                        <Text
                          color={'#485766'}
                          fontSize={'1.5rem'}
                          fontWeight={500}
                          lineHeight={'2.475rem'}
                        >
                          {localeText(LANGUAGES.ORDER.PRODUCT_INFORMATION)}
                        </Text>
                      </Box>
                      <Box w={'100%'}>
                        {/* Product Rows */}
                        <VStack>
                          {/* header */}
                          <Box
                            w={'100%'}
                            borderTop="1px solid #73829D"
                            borderBottom="1px solid #AEBDCA"
                            px={'1.25rem'}
                            py={'1rem'}
                          >
                            <HStack
                              spacing={'0.75rem'}
                              justifyContent={'space-between'}
                            >
                              <Box width={'35rem'}>
                                <Text
                                  textAlign={'left'}
                                  color={'#2A333C'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {localeText(LANGUAGES.ORDER.PRODUCT)}
                                </Text>
                              </Box>
                              <Box width={'8.8333rem'}>
                                <Text
                                  textAlign={'center'}
                                  color={'#2A333C'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {localeText(LANGUAGES.ORDER.QUANTITY)}
                                </Text>
                              </Box>
                              <Box width={'8.8333rem'}>
                                <Text
                                  textAlign={'center'}
                                  color={'#2A333C'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {localeText(LANGUAGES.ORDER.TOTAL_PRICE)}
                                </Text>
                              </Box>
                            </HStack>
                          </Box>
                          {/* body */}
                          <Box w={'100%'}>
                            <VStack spacing={0}>
                              {ordersProductList.map((orderProduct, index) => {
                                return (
                                  <OrderCard key={index} item={orderProduct} />
                                );
                              })}
                            </VStack>
                          </Box>
                        </VStack>
                      </Box>
                    </VStack>
                  </Box>

                  {/* Orderer Information */}
                  <Box w={'100%'}>
                    <VStack spacing={'2rem'}>
                      <Box w={'100%'}>
                        <Text
                          color={'#485766'}
                          fontSize={'1.5rem'}
                          fontWeight={500}
                          lineHeight={'2.475rem'}
                        >
                          {localeText(LANGUAGES.ORDER.ORDERER_INFORMATION)}
                        </Text>
                      </Box>
                      <Box w={'100%'}>
                        <VStack spacing={'1.25rem'}>
                          <Box w={'100%'}>
                            <HStack spacing={'2rem'}>
                              <Text
                                w={'10rem'}
                                color={'#7895B2'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                              >
                                {localeText(LANGUAGES.ORDER.ORDERER_NAME)}
                              </Text>
                              <Text
                                color={'#556A7E'}
                                fontSize={'1rem'}
                                fontWeight={500}
                                lineHeight={'1.75rem'}
                              >
                                {userInfo.name}
                              </Text>
                            </HStack>
                          </Box>
                          <Box w={'100%'}>
                            <HStack spacing={'2rem'}>
                              <Text
                                w={'10rem'}
                                color={'#7895B2'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                              >
                                {localeText(LANGUAGES.ACC.PHONE_NUMBER)}
                              </Text>
                              <Text
                                color={'#556A7E'}
                                fontSize={'1rem'}
                                fontWeight={500}
                                lineHeight={'1.75rem'}
                              >
                                {utils.parsePhoneNum(userInfo.phone)}
                              </Text>
                            </HStack>
                          </Box>
                          <Box w={'100%'}>
                            <HStack spacing={'2rem'}>
                              <Text
                                w={'10rem'}
                                color={'#7895B2'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                              >
                                {localeText(LANGUAGES.ACC.EMAIL)}
                              </Text>
                              <Text
                                color={'#556A7E'}
                                fontSize={'1rem'}
                                fontWeight={500}
                                lineHeight={'1.75rem'}
                              >
                                {userInfo.id}
                              </Text>
                            </HStack>
                          </Box>
                        </VStack>
                      </Box>
                    </VStack>
                  </Box>

                  {/* Shipping Information */}
                  <Box w={'100%'}>
                    <VStack spacing={'2rem'}>
                      <Box w={'100%'}>
                        <HStack justifyContent={'space-between'}>
                          <Text
                            textAlign={'center'}
                            color={'#485766'}
                            fontSize={'1.5rem'}
                            fontWeight={500}
                            lineHeight={'2.475rem'}
                          >
                            {localeText(LANGUAGES.ORDER.SHIPPING_INFORMATION)}
                          </Text>
                          <HStack spacing={'0.5rem'} alignItems={'center'}>
                            <Box w={'1.75rem'} h={'1.75rem'}>
                              <CustomCheckbox
                                isChecked={isSameUser}
                                onChange={(v) => {
                                  setIsSameUser(v);
                                }}
                              />
                            </Box>
                            <Text
                              color={'#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={500}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(
                                LANGUAGES.ORDER.SAME_AS_ORDERER_INFORMATION,
                              )}
                            </Text>
                          </HStack>
                        </HStack>
                      </Box>
                      <Box w={'100%'}>
                        <VStack spacing={'1rem'}>
                          {/* First Row: Last name and First name */}
                          <Box w={'100%'}>
                            <HStack w={'100%'} spacing={'1.25rem'}>
                              <Box w={'50%'}>
                                <TitleTextInput
                                  value={lastName}
                                  onChange={(v) => {
                                    setLastName(v);
                                  }}
                                  title={localeText(LANGUAGES.ACC.LAST_NAME)}
                                />
                              </Box>
                              <Box w={'50%'}>
                                <TitleTextInput
                                  value={firstName}
                                  onChange={(v) => {
                                    setFirstName(v);
                                  }}
                                  title={localeText(LANGUAGES.ACC.FIRST_NAME)}
                                />
                              </Box>
                            </HStack>
                          </Box>

                          <Box w={'100%'}>
                            <TitleTextInput
                              value={phone}
                              type={'number'}
                              onChange={(v) => {
                                setPhone(v);
                              }}
                              max={12}
                              title={localeText(LANGUAGES.ACC.PHONE_NUMBER)}
                              placeholder={localeText(
                                LANGUAGES.ACC.PHONE_NUMBER,
                              )}
                            />
                          </Box>

                          <Box w={'100%'}>
                            <TitleTextInput
                              value={address1}
                              title={localeText(LANGUAGES.ORDER_ADDR_1)}
                              placeholder={localeText(LANGUAGES.ORDER_ADDR_1)}
                              isReadOnly
                              onClick={() => {
                                setIsOpenGoogleAddr(true);
                              }}
                            />
                          </Box>

                          <Box w={'100%'}>
                            <TitleTextInput
                              value={address2}
                              onChange={(v) => {
                                setAddress2(v);
                              }}
                              title={`${localeText(LANGUAGES.ADDRESS.ADDRESS2)} (${localeText(LANGUAGES.ACC.SU.OPTIONAL)})`}
                            />
                          </Box>

                          <Box w={'100%'}>
                            <HStack w={'100%'} spacing={'1.25rem'}>
                              <Box w={'50%'}>
                                <TitleTextInput
                                  title={localeText(LANGUAGES.ADDRESS.CITY)}
                                  placeholder={localeText(
                                    LANGUAGES.ADDRESS.CITY,
                                  )}
                                  value={city}
                                  onChange={(v) => {
                                    setCity(v);
                                  }}
                                />
                              </Box>
                              <Box w={'50%'}>
                                <TitleTextInput
                                  title={localeText(LANGUAGES.ADDRESS.STATE)}
                                  placeholder={localeText(
                                    LANGUAGES.ADDRESS.STATE,
                                  )}
                                  value={state}
                                  onChange={(v) => {
                                    setState(v);
                                  }}
                                />
                              </Box>
                            </HStack>
                          </Box>

                          {/* Fifth Row: Apartment, suite, etc. and Postal code */}
                          <Box w={'100%'}>
                            <HStack w={'100%'} spacing={'1.25rem'}>
                              <Box w={'50%'}>
                                <TitleTextInput
                                  type={'number'}
                                  max={5}
                                  title={localeText(
                                    LANGUAGES.ADDRESS.POSCAL_CODE,
                                  )}
                                  placeholder={localeText(
                                    LANGUAGES.ADDRESS.POSCAL_CODE,
                                  )}
                                  value={zipCode}
                                  onChange={(v) => {
                                    setZipCode(v);
                                  }}
                                />
                              </Box>
                              <Box w={'50%'}>
                                <Box h={'5.5rem'} maxW={null}>
                                  <VStack
                                    alignItems={'flex-start'}
                                    spacing={'0.25rem'}
                                  >
                                    <Text
                                      color={'#7895B2'}
                                      fontSize={'1rem'}
                                      fontWeight={400}
                                      lineHeight={'1.75rem'}
                                    >
                                      {localeText(LANGUAGES.ADDRESS.COUNTRY)}
                                    </Text>
                                    <Select
                                      value={country || ''}
                                      onChange={(e) => {
                                        setCountry(e.target.value);
                                      }}
                                      w={'100%'}
                                      h={'3.5rem'}
                                      bg={'#FFF'}
                                      borderRadius={'0.25rem'}
                                      border={'1px solid #9CADBE'}
                                    >
                                      <option value={''}>
                                        {localeText(LANGUAGES.ADDRESS.COUNTRY)}
                                      </option>
                                      {COUNTRY_LIST.map((item, index) => {
                                        return (
                                          <option key={index} value={item.CODE}>
                                            {item[lang.toUpperCase()]}
                                          </option>
                                        );
                                      })}
                                    </Select>
                                  </VStack>
                                </Box>
                              </Box>
                            </HStack>
                          </Box>

                          <Box w={'100%'}>
                            <TitleTextInput
                              value={messages}
                              onChange={(v) => {
                                setMessages(v);
                              }}
                              title={localeText(LANGUAGES.ORDER.MESSAGES)}
                              placeholder={localeText(LANGUAGES.ORDER.MESSAGES)}
                            />
                          </Box>
                        </VStack>
                      </Box>
                    </VStack>
                  </Box>

                  {/* Coupon Discounts Section */}
                  <Box w={'100%'}>
                    <VStack spacing={'1.5rem'}>
                      <Box w={'100%'}>
                        <Text
                          color={'#485766'}
                          fontSize={'1.5rem'}
                          fontWeight={500}
                          lineHeight={'2.475rem'}
                        >
                          {localeText(LANGUAGES.ORDER.COUPON_DISCOUNTS)}
                        </Text>
                      </Box>

                      <Divider
                        borderTop={'1px solid #73829D'}
                        boxSizing="border-box"
                      />

                      <Box w={'100%'}>
                        {listCoupon.length > 0 && (
                          <RadioGroup
                            value={selectedCouponId}
                            onChange={(couponId) => {
                              handleSelectedCoupon(couponId);
                            }}
                          >
                            <VStack spacing={'1.5rem'}>
                              {listCoupon.map((item, index) => (
                                <CouponCard key={index} item={item} />
                              ))}
                            </VStack>
                          </RadioGroup>
                        )}
                        {listCoupon.length === 0 && (
                          <Center w={'100%'} h={'10rem'}>
                            <Text
                              fontSize={'1.5rem'}
                              fontWeight={500}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(LANGUAGES.INFO_MSG.NO_COUPON)}
                            </Text>
                          </Center>
                        )}
                      </Box>
                    </VStack>
                  </Box>

                  {/* Reward Coin Section */}
                  <Box w={'100%'}>
                    <VStack spacing={'1.5rem'}>
                      <Box w={'100%'}>
                        <Text
                          color={'#485766'}
                          fontSize={'1.5rem'}
                          fontWeight={500}
                          lineHeight={'2.475rem'}
                        >
                          {localeText(LANGUAGES.ORDER.REWARD_COINS)}
                        </Text>
                      </Box>

                      <Divider
                        borderTop={'1px solid #73829D'}
                        boxSizing="border-box"
                      />

                      <Box w={'100%'}>
                        <HStack spacing={'1.5rem'}>
                          <Box>
                            <HStack spacing={'0.75rem'}>
                              <Box>
                                <Input
                                  w={'9.5rem'}
                                  h={'3.25rem'}
                                  type={'number'}
                                  borderRadius={'0.25rem'}
                                  border={'1px solid #9CADBE'}
                                  py={'0.75rem'}
                                  px={'1.5rem'}
                                  bg={'#FFF'}
                                  fontSize={'1rem'}
                                  value={reward}
                                  onChange={(e) => {
                                    handleInputReward(e);
                                  }}
                                />
                              </Box>
                              <Box>
                                <Text
                                  color={'#66809C'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {localeText(LANGUAGES.ORDER.COIN_OF)}
                                </Text>
                              </Box>
                              <Box>
                                <Text
                                  color={'#FF5454'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {`${rewardCoin} ${localeText(LANGUAGES.ORDER.COIN)}`}
                                </Text>
                              </Box>
                            </HStack>
                          </Box>
                          <Box>
                            <Button
                              onClick={() => {
                                handleFullUseReward();
                              }}
                              minW={'7rem'}
                              h={'3.25rem'}
                              borderRadius={'0.25rem'}
                              border={'1px solid #73829D'}
                            >
                              <Text
                                color={'#556A7E'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                              >
                                {localeText(LANGUAGES.ORDER.FULL_USE)}
                              </Text>
                            </Button>
                          </Box>
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>

                  {/* Payment method Section */}
                  <Box w={'100%'}>
                    <VStack spacing={'1.5rem'}>
                      <Box w={'100%'}>
                        <Text
                          color={'#485766'}
                          fontSize={'1.5rem'}
                          fontWeight={500}
                          lineHeight={'2.475rem'}
                        >
                          {localeText(LANGUAGES.ORDER.PAYMENT_METHOD)}
                        </Text>
                      </Box>

                      <Divider
                        borderTop={'1px solid #73829D'}
                        boxSizing="border-box"
                      />

                      <Box w={'100%'}>
                        <VStack>
                          <Box w={'100%'}>
                            <RadioGroup
                              value={paymentMethod}
                              onChange={(method) => {
                                setPaymentMethod(Number(method));
                              }}
                            >
                              <HStack
                                justifyContent={'flex-start'}
                                spacing={'2.62rem'}
                              >
                                <Box>
                                  <HStack
                                    spacing={'0.75rem'}
                                    alignItems={'center'}
                                  >
                                    <Center h={'1.657rem'}>
                                      <Radio value={1} />
                                    </Center>
                                    <Box h={'1.657rem'}>
                                      <Img src={PaypalLogo.src} h={'100%'} />
                                    </Box>
                                  </HStack>
                                </Box>
                                {/*
                                <Box>
                                  <HStack
                                    spacing={'0.75rem'}
                                    alignItems={'center'}
                                  >
                                    <Center h={'1.625rem'}>
                                      <Radio value={2} />
                                    </Center>
                                    <Box h={'1.625rem'}>
                                      <Img
                                        src={AuthorizeDotNet.src}
                                        h={'100%'}
                                      />
                                    </Box>
                                  </HStack>
                                </Box>
                                */}
                                <Box>
                                  <HStack
                                    spacing={'0.75rem'}
                                    alignItems={'center'}
                                  >
                                    <Center h={'1.625rem'}>
                                      <Radio value={3} />
                                    </Center>
                                    <Box h={'1.625rem'}>
                                      <Img src={StripeLogo.src} h={'100%'} />
                                    </Box>
                                  </HStack>
                                </Box>
                              </HStack>
                            </RadioGroup>
                          </Box>
                        </VStack>
                      </Box>
                    </VStack>
                  </Box>
                </VStack>
              </Box>

              <Box minW={'37.5rem'} h="100%" position="relative">
                <Box
                  w={{
                    base: '100%',
                    md: '37.5rem',
                    lg: '37.5rem',
                    xl: '37.5rem',
                  }}
                  minW={{
                    base: '100%',
                    md: '37.5rem',
                    lg: '37.5rem',
                    xl: '37.5rem',
                  }}
                  ref={boxRef}
                  position="absolute"
                  top={`${topOffset}px`}
                  left="0%"
                  transition="top 0.2s ease"
                >
                  <Box w={'100%'} p={'2.5rem'} border={'1px solid #9CADBE'}>
                    <VStack spacing={'3.5rem'}>
                      {/* Order Summary Section */}
                      <Box w={'100%'}>
                        <VStack spacing={'1.5rem'}>
                          <Box w={'100%'}>
                            <Text
                              color="#485766"
                              fontSize="1.25rem"
                              fontWeight="500"
                              lineHeight="2.25rem"
                              wordBreak="break-word"
                            >
                              {localeText(LANGUAGES.ORDER.SUMMARY)}
                            </Text>
                          </Box>

                          <Divider
                            borderTop={'1px solid #73829D'}
                            boxSizing="border-box"
                          />

                          {/* Total Product Price */}
                          <Box w={'100%'}>
                            <VStack spacing={'1.25rem'}>
                              <Box w={'100%'}>
                                <HStack
                                  w="full"
                                  justifyContent="space-between"
                                  alignItems="flex-start"
                                  gap="2rem"
                                >
                                  <Text
                                    w="10rem"
                                    color="#7895B2"
                                    fontSize="1rem"
                                    fontWeight="400"
                                    lineHeight="1.75rem"
                                    wordBreak="break-word"
                                  >
                                    {localeText(LANGUAGES.ORDER.TOTAL_PRODUCT)}
                                  </Text>
                                  <Text
                                    color="#556A7E"
                                    fontSize="1rem"
                                    fontWeight="500"
                                    lineHeight="1.75rem"
                                    wordBreak="break-word"
                                  >
                                    {utils.parseDallar(totalPrice)}
                                  </Text>
                                </HStack>
                              </Box>
                              <Box w={'100%'}>
                                <HStack
                                  w="full"
                                  justifyContent="space-between"
                                  alignItems="flex-start"
                                  gap="2rem"
                                >
                                  <Text
                                    w="10rem"
                                    color="#7895B2"
                                    fontSize="1rem"
                                    fontWeight="400"
                                    lineHeight="1.75rem"
                                    wordBreak="break-word"
                                  >
                                    {localeText(
                                      LANGUAGES.ORDER.COUPON_DISCOUNT,
                                    )}
                                  </Text>
                                  {handleDisCountAmount()}
                                </HStack>
                              </Box>
                              <Box w={'100%'}>
                                <HStack
                                  w="full"
                                  justifyContent="space-between"
                                  alignItems="flex-start"
                                  gap="2rem"
                                >
                                  <Text
                                    w={'10rem'}
                                    color={'#7895B2'}
                                    fontSize={'1rem'}
                                    fontWeight={400}
                                    lineHeight={'1.75rem'}
                                  >
                                    {localeText(
                                      LANGUAGES.ORDER.REDEEMING_MILES,
                                    )}
                                  </Text>
                                  <Text
                                    color={'#556A7E'}
                                    fontSize={'1rem'}
                                    fontWeight={500}
                                    lineHeight={'1.75rem'}
                                  >
                                    {`${reward} coin`}
                                  </Text>
                                </HStack>
                              </Box>
                              <Box w={'100%'}>
                                <HStack
                                  w="full"
                                  justifyContent="space-between"
                                  alignItems="flex-start"
                                  gap="2rem"
                                >
                                  <Text
                                    w="10rem"
                                    color="#66809C"
                                    fontSize="1.125rem"
                                    fontWeight="500"
                                    lineHeight="1.96875rem"
                                    wordBreak="break-word"
                                  >
                                    {localeText(LANGUAGES.ORDER.TOTAL)}
                                  </Text>
                                  <Text
                                    color="#485766"
                                    fontSize="1.125rem"
                                    fontWeight="600"
                                    lineHeight="1.96875rem"
                                    wordBreak="break-word"
                                  >
                                    {finalAmount}
                                  </Text>
                                </HStack>
                              </Box>
                            </VStack>
                          </Box>
                        </VStack>
                      </Box>

                      <Box w={'100%'} h={'4rem'}>
                        <Button
                          onClick={() => {
                            handleOrderButton();
                          }}
                          w={'100%'}
                          h={'100%'}
                          minW={'8.5rem'}
                          px={'2rem'}
                          py={'0.88rem'}
                          borderRadius={'0.25rem'}
                          borderTop={'1px solid #73829D'}
                          bg={'#66809C'}
                        >
                          <Text
                            color={'#FFF'}
                            fontSize={'1.25rem'}
                            fontWeight={400}
                            lineHeight={'2.25rem'}
                          >
                            {isCheckOut
                              ? localeText(LANGUAGES.ORDER.CHECK_OUT)
                              : localeText(LANGUAGES.ORDER.ORDER_ADDITIONAL)}
                          </Text>
                        </Button>
                      </Box>
                    </VStack>
                  </Box>
                </Box>
              </Box>
            </HStack>
          </Box>

          <ContentBR h={'10rem'} />

          {isOpenPaypal && (
            <Modal isOpen={isOpenPaypal} onClose={onClosePaypal} size="md">
              <ModalOverlay />
              <ModalContent
                borderRadius={'0.25rem'}
                px={5}
                alignSelf={'center'}
                maxH={'80%'}
                overflowY={'auto'}
                className={'no-scroll'}
              >
                <ModalBody
                  w={'100%'}
                  h={'100%'}
                  maxW={null}
                  position={'relative'}
                  pt={'5%'}
                  px={0}
                >
                  {!paypalLoaded && (
                    <Center w={'100%'} h={'100%'}>
                      <Spinner />
                    </Center>
                  )}
                  <div id="paypal-button-container"></div>
                </ModalBody>
              </ModalContent>
            </Modal>
          )}

          <Footer />
        </VStack>
      </Center>

      <StripeModal orderDataStripe={finalOrderData} />
    </MainContainer>
  );
};

const OrderCard = ({ item }) => {
  const { openModal } = useModal();
  const { localeText } = useLocale();
  const { isMobile, clampW } = useDevice();

  const brandName = item?.brandName || '';
  const name = item.name || '';
  const firstImage =
    item?.productImageList.length > 0 ? item.productImageList[0] : {};

  let selectedOption = null;
  if (item?.ordersProductOptionList) {
    if (item.ordersProductOptionList.length > 0) {
      selectedOption = item.ordersProductOptionList[0];
    }
  }
  const sellerUserId = item?.sellerUserId || null;
  const count = selectedOption?.count || item?.count;

  return isMobile(true) ? (
    <Box w={'100%'} borderBottom={'1px solid #AEBDCA'} py={'1.25rem'}>
      <VStack spacing={'1.25rem'}>
        <Box
          w={'100%'}
          cursor={'pointer'}
          onClick={() => {
            openModal({
              type: 'confirm',
              text: localeText(LANGUAGES.INFO_MSG.MOVE_CANCEL_ORDER),
              onAgree: () => {
                if (sellerUserId) {
                  moveBrand(sellerUserId);
                }
              },
            });
          }}
        >
          <HStack>
            <Text
              fontSize={clampW(0.9375, 1)}
              fontWeight={400}
              color={'#556A7E'}
            >
              {brandName}
            </Text>
            <Img w={'1.25rem'} h={'1.25rem'} src={RightBlueArrow.src} />
          </HStack>
        </Box>

        <Box w={'100%'}>
          <VStack spacing={'0.75rem'}>
            <Box w={'100%'}>
              <Text
                color={'#485766'}
                fontSize={'1rem'}
                fontWeight={500}
                lineHeight={'1.75rem'}
              >
                {name}
              </Text>
            </Box>
            <Box w={'100%'}>
              <HStack>
                <Box w={'6.25rem'} h={'6.25rem'}>
                  <ChakraImage
                    fallback={<DefaultSkeleton />}
                    w={'100%'}
                    h={'100%'}
                    src={firstImage?.imageS3Url}
                  />
                </Box>
                <Box>
                  {selectedOption && (
                    <Box w={'100%'}>
                      <Text
                        color={'#66809C'}
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        lineHeight={'1.5rem'}
                        textAlign={'left'}
                      >
                        {`${localeText(LANGUAGES.COMMON.OPTION)} : ${selectedOption?.name}`}
                      </Text>
                    </Box>
                  )}
                </Box>
              </HStack>
            </Box>
            <Box w={'100%'}>
              <HStack spacing={clampW(1.25, 3)}>
                <Box w={'9rem'}>
                  <Text
                    color={'#485766'}
                    fontSize={'1rem'}
                    fontWeight={500}
                    lineHeight={'1.75rem'}
                  >
                    {localeText(LANGUAGES.ORDER.TOTAL_ORDER_PRICE)}
                  </Text>
                </Box>
                <Text
                  color={'#485766'}
                  fontSize={'1rem'}
                  fontWeight={500}
                  lineHeight={'1.75rem'}
                >
                  {utils.handleGetTotalPrice(item)}
                </Text>
              </HStack>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ) : (
    <Box w={'100%'} borderBottom="1px solid #AEBDCA" p={'1.25rem'}>
      <VStack spacing={'1.25rem'}>
        <Box
          w={'100%'}
          cursor={'pointer'}
          onClick={() => {
            openModal({
              type: 'confirm',
              text: localeText(LANGUAGES.INFO_MSG.MOVE_CANCEL_ORDER),
              onAgree: () => {
                if (sellerUserId) {
                  moveBrand(sellerUserId);
                }
              },
            });
          }}
        >
          <HStack>
            <Text fontSize={'1rem'} fontWeight={400} color={'#556A7E'}>
              {brandName}
            </Text>
            <Img w={'1.25rem'} h={'1.25rem'} src={RightBlueArrow.src} />
          </HStack>
        </Box>

        <Box w={'100%'}>
          <HStack spacing={'0.75rem'} justifyContent={'space-between'}>
            <Box width={'35rem'}>
              <HStack>
                <Box w={'6.25rem'} h={'6.25rem'}>
                  <ChakraImage
                    fallback={<DefaultSkeleton />}
                    w={'100%'}
                    h={'100%'}
                    src={firstImage?.imageS3Url}
                  />
                </Box>
                <Box>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <VStack spacing={0}>
                        <Box w={'100%'}>
                          <Text
                            color={'#485766'}
                            fontSize={'1rem'}
                            fontWeight={500}
                            lineHeight={'1.75rem'}
                          >
                            {name}
                          </Text>
                        </Box>
                        {selectedOption && (
                          <Box w={'100%'}>
                            <Text
                              color={'#66809C'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                              textAlign={'left'}
                            >
                              {`${localeText(LANGUAGES.COMMON.OPTION)} : ${selectedOption?.name}`}
                            </Text>
                          </Box>
                        )}
                      </VStack>
                    </Box>
                  </VStack>
                </Box>
              </HStack>
            </Box>
            <Box width={'8.8333rem'}>
              <Text
                textAlign={'center'}
                color={'#485766'}
                fontSize={'1rem'}
                fontWeight={500}
                lineHeight={'1.75rem'}
              >
                {utils.parseAmount(count)}
              </Text>
            </Box>
            <Box width={'8.8333rem'}>
              <Text
                textAlign={'center'}
                color={'#485766'}
                fontSize={'1rem'}
                fontWeight={500}
                lineHeight={'1.75rem'}
              >
                {utils.handleGetTotalPrice(item)}
              </Text>
            </Box>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

const CouponCard = ({ item }) => {
  const { localeText } = useLocale();

  const handleDiscount = useCallback((item) => {
    if (item.type === 1) {
      return `- ${utils.parseDallar(item.discountAmount)}`;
    } else if (item.type === 2) {
      return `${item.discountAmount}%`;
    }
  });

  return (
    <Box w={'100%'}>
      <VStack spacing={'0.25rem'} alignItems="flex-start">
        <Box w={'100%'}>
          <HStack justifyContent={'space-between'}>
            <Box>
              <HStack spacing={'0.75rem'} alignItems={'center'}>
                <Box>
                  <Radio value={item.couponId} />
                </Box>
                <Box>
                  <Text
                    color="#485766"
                    fontSize="1rem"
                    fontWeight="400"
                    lineHeight="1.75rem"
                    wordBreak="break-word"
                  >
                    {item.name}
                  </Text>
                </Box>
              </HStack>
            </Box>
            <Box>
              {item.discountAmount && (
                <Text
                  color="#556A7E"
                  fontSize="1rem"
                  fontWeight="500"
                  lineHeight="1.75rem"
                  wordBreak="break-word"
                >
                  {handleDiscount(item)}
                </Text>
              )}
            </Box>
          </HStack>
        </Box>

        <Box w={'100%'} px={'2.25rem'}>
          <Text
            flex="1"
            color="#7895B2"
            fontSize="1rem"
            fontWeight="400"
            lineHeight="1.75rem"
            wordBreak="break-word"
          >
            {`${localeText(LANGUAGES.MY_PAGE.COUPON.REDEMPTION_TERMS)}: ${utils.parseDallar(item.minimumPurchaseAmount)}${localeText(LANGUAGES.MY_PAGE.COUPON.MINIMUM_PURCHASE)}`}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default OrderPage;
