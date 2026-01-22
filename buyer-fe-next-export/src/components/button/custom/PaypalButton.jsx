import { useEffect, useState } from 'react';
import Paypal from '@public/svgs/simbol/paypal.svg';
import {
  Center,
  Img,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import utils from '@/utils';
import useModal from '@/hooks/useModal';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';

const PayPalButton = (props) => {
  const { localeText } = useLocale();
  const { openModal } = useModal();

  const {
    isOpen: isOpenPaypal,
    onOpen: onOpenPaypal,
    onClose: onClosePaypal,
  } = useDisclosure();

  const isModal = true;

  const { price = 0 } = props;

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  useEffect(() => {
    // 클라이언트 측에서만 실행
    if (isOpenPaypal && typeof window !== 'undefined') {
      const script = document.createElement('script');
      console.log('clientId', clientId);
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=buttons`;
      script.async = true;
      script.onload = () => setPaypalLoaded(true);
      document.body.appendChild(script);
    } else setPaypalLoaded(false);
  }, [isOpenPaypal]);

  useEffect(() => {
    // PayPal SDK 로드 후 버튼 초기화
    if (isOpenPaypal && paypalLoaded && window.paypal) {
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            // const apiURL = "/api/paypal/order/create";
            // const res = await SERVER_POST(apiURL, { price });
            // return res.ok ? res.data.id : null;

            console.log('### createOrder');
            console.log('data', data);
            console.log('actions', actions);
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: '00.01',
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            console.log('### onApprove');
            // partner@test-paypal.com // 관리자 ID 1q2w3e4r!
            // user@test-paypal.com // 사용자 ID
            console.log(
              'Payment approved by: ' + details.payer.name.given_name,
            );
            /*
            const result = {
              id: '4CT63015HA933043U',
              intent: 'CAPTURE',
              status: 'COMPLETED',
              purchase_units: [
                {
                  reference_id: 'default',
                  amount: {
                    currency_code: 'USD',
                    value: '0.01',
                  },
                  payee: {
                    email_address: 'sb-w9ovu37932783@business.example.com',
                    merchant_id: 'M5N6K46SX58RN',
                  },
                  soft_descriptor: 'PAYPAL *TEST STORE TES',
                  shipping: {
                    name: {
                      full_name: 'John Doe',
                    },
                    address: {
                      address_line_1: 'Sajik-ro-3-gil 23',
                      admin_area_2: 'Jongno-gu',
                      admin_area_1: 'Seoul',
                      postal_code: '01001',
                      country_code: 'KR',
                    },
                  },
                  payments: {
                    captures: [
                      {
                        id: '98U12827AF297281W',
                        status: 'COMPLETED',
                        amount: {
                          currency_code: 'USD',
                          value: '0.01',
                        },
                        final_capture: true,
                        disbursement_mode: 'INSTANT',
                        seller_protection: {
                          status: 'ELIGIBLE',
                          dispute_categories: [
                            'ITEM_NOT_RECEIVED',
                            'UNAUTHORIZED_TRANSACTION',
                          ],
                        },
                        create_time: '2025-02-26T12:07:25Z',
                        update_time: '2025-02-26T12:07:25Z',
                      },
                    ],
                  },
                },
              ],
              payer: {
                name: {
                  given_name: 'John',
                  surname: 'Doe',
                },
                email_address: 'sb-pvsf4337930910@personal.example.com',
                payer_id: '98KPJ9X5XMFM4',
                address: {
                  country_code: 'KR',
                },
              },
              create_time: '2025-02-26T12:07:03Z',
              update_time: '2025-02-26T12:07:25Z',
              links: [
                {
                  href: 'https://api.sandbox.paypal.com/v2/checkout/orders/4CT63015HA933043U',
                  rel: 'self',
                  method: 'GET',
                },
              ],
            };
            */
            const orderID = data.orderID;

            try {
              // 결제 승인 후 서버에 결제 정보 전송
              const response = await fetch('/api/paymentApprove', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderID }),
              });

              const result = await response.json();
              if (response.ok) {
                setPaymentStatus('Payment approved successfully!');
              } else {
                setPaymentStatus('Payment approval failed: ' + result.message);
              }
            } catch (error) {
              setPaymentStatus('Error processing payment: ' + error.message);
            }
            /*
            // const { orderID } = data;
            // const apiURL = "/api/paypal/order/capture";
            // const res = await SERVER_POST(apiURL, { orderID });
            return actions.order.capture().then((details) => {
              console.log('details', details);

              // 서버로 결제 승인 요청 (서버에서 승인 처리)
              const orderID = data.orderID;
              handlePaymentApproval(orderID);
            });
            */
          },
          onError: (err) => {
            console.error('결제 오류:', err);
          },
        })
        .render('#paypal-button-container'); // PayPal 버튼을 렌더링할 DOM 요소
    }
  }, [paypalLoaded]);

  if (isModal) {
    return (
      <>
        <Center
          cursor={'pointer'}
          onClick={() => {
            if (price === 0) {
              openModal({ text: localeText(LANGUAGES.INFO_MSG.NO_PAYMENT) });
            } else {
              onOpenPaypal();
            }
          }}
          borderRadius={'0.25rem'}
          w={'8rem'}
          h={'3.5rem'}
          py={'0.75rem'}
          px={'1rem'}
          bg={'#7895B2'}
        >
          <Img src={Paypal.src} />
        </Center>
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
      </>
    );
  } else {
    return (
      <PayPalScriptProvider options={{ clientId, locale: 'en_US' }}>
        <PayPalButtons
          style={{
            color: 'gold',
            shape: 'pill',
            label: 'paypal',
            layout: 'vertical',
            height: 50,
            tagline: false,
          }}
          // createOrder 함수의 결과는 orderID를 반환. 이를 onApprove에 전달
          createOrder={async () => {
            const apiURL = '/api/paypal/order/create';
            const res = await utils.serverPost(apiURL, { price: 1000 });
            return res.ok ? res.data.id : null;
          }}
          onApprove={async (data) => {
            const { orderID } = data;
            const apiURL = '/api/paypal/order/capture';
            const res = await utils.serverPost(apiURL, { orderID });
            // 결제 결과를 DB에 저장하고, toast를 띄우고, 결과 페이지로 redirect
          }}
        />
      </PayPalScriptProvider>
    );
  }
};

export default PayPalButton;
