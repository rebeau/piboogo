'use client';

import useModal from '@/hooks/useModal';
import { deviceInfoState } from '@/stores/environmentRecoil';
import { Box, Center } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Interceptor } from './Interceptor';
import utils from '@/utils';
import { Loading, ModalAgent } from '@/components';
import { loadingState } from '@/stores/commonRecoil';
import SignUpHeader from '@/components/custom/header/SignUpHeader';
import useLocale from '@/hooks/useLocale';
import { usePathname } from 'next/navigation';
import { MY_CART, MY_PAGE, POLICY, SERVICE } from '@/constants/pageURL';
import { useBreakpoint } from '@chakra-ui/react';
import GooglePost from '@/components/common/thirdparty/GooglePost';
import { CustomIcon } from '@/components';
import { isOpenGoogleAddrState } from '@/stores/googleAddrRecoil';

const WarpPage = ({ children, language }) => {
  const chatPopupRef = useRef(null);

  const pathName = usePathname();
  const loading = useRecoilValue(loadingState);

  const { closeModal } = useModal();
  const { lang, setLang } = useLocale();
  const [deviceInfo, setDeviceInfo] = useRecoilState(deviceInfoState);
  const [isLogin, setIsLogin] = useState(false);
  const breakpoint = useBreakpoint();
  const [isOpenGoogleAddr, setIsOpenGoogleAddr] = useRecoilState(
    isOpenGoogleAddrState,
  );

  useEffect(() => {
    if (!lang) {
      setLang(language);
    }
  }, [language]);

  const [initPage, setInitPage] = useState(false);

  useEffect(() => {
    console.log(`### ${process.env.NEXT_PUBLIC_NODE_ENV} ###`);
    closeModal();
    utils.initBridge();
    const handleResize = () => {
      const osType = utils.OSInfo();
      const isMobile = utils.isMobile();
      const temp = {
        ...deviceInfo,
        h: window.innerHeight,
        w: window.innerWidth,
        isMobile: isMobile,
        osType: osType,
      };
      setDeviceInfo(temp);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    setInitPage(true);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (initPage) {
      if (
        pathName === POLICY.TERMS ||
        pathName === POLICY.PRIVACY ||
        pathName === POLICY.IP ||
        pathName === SERVICE.CHAT
      ) {
        setIsLogin(true);
      } else {
        const isLogin = utils.getIsLogin();
        setIsLogin(isLogin);
        handleSetApp();
      }
    }
  }, [initPage, pathName]);

  const handleSetApp = async () => {
    const listThrowPath = [
      MY_PAGE.ROOT,
      MY_PAGE.INFO,
      MY_PAGE.INFO_EDIT,
      MY_PAGE.ORDER_HISTORY,
      MY_PAGE.COUPON,
      MY_PAGE.REVIEWS_INQUIRIES,
      //
      MY_CART.WISH_LIST,
      MY_CART.CART,
    ];
    setIsOpenGoogleAddr(false);
    const throwRet = listThrowPath.includes(pathName);
    if (throwRet) {
      setInitPage(true);
    } else {
      console.log('pathName', pathName);
    }
  };

  return (
    <Box position={'relative'} h={'100%'} maxH={'100vh'}>
      <Interceptor />
      <ModalAgent />

      {loading && <Loading />}
      {/* {customLoading && <CustomLoading />} */}
      {initPage && (
        <>
          {!isLogin && <SignUpHeader />}
          {children}
        </>
      )}
      {isOpenGoogleAddr && <GooglePost />}
      {pathName !== POLICY.TERMS &&
        pathName !== POLICY.PRIVACY &&
        pathName !== POLICY.IP &&
        pathName !== SERVICE.CHAT && (
          <Center
            zIndex={10}
            cursor={'pointer'}
            onClick={() => {
              const url = SERVICE.CHAT;
              const name = 'chatPopup';
              const features = `width=${utils.isMobile(true) ? '100%' : 500},height=800`;

              if (!chatPopupRef.current || chatPopupRef.current.closed) {
                chatPopupRef.current = window.open(url, name, features);
              } else {
                chatPopupRef.current.focus();
              }
            }}
            position={'fixed'}
            w="80px"
            aspectRatio={1}
            right={'10px'}
            bottom={'30px'}
            borderRadius={'50%'}
            bg="#FFF"
          >
            <CustomIcon w="50%" h="50%" name="chatBot" color="#7895B2" />
          </Center>
        )}
    </Box>
  );
};

export default WarpPage;
