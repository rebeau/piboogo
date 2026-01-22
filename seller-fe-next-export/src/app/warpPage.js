'use client';

import useModal from '@/hooks/useModal';
import { deviceInfoState } from '@/stores/environmentRecoil';
import { Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { Interceptor } from './Interceptor';
import utils from '@/utils';
import { Loading, ModalAgent } from '@/components';
import useMove from '@/hooks/useMove';
import useLocale from '@/hooks/useLocale';
import { loadingState } from '@/stores/commonRecoil';
import GooglePost from '@/components/common/thirdparty/GooglePost';
import { isOpenGoogleAddrState } from '@/stores/googleAddrRecoil';

const WarpPage = ({ language, children }) => {
  const loading = useRecoilValue(loadingState);
  const { closeModal } = useModal();
  const { moveLogin } = useMove();
  const { lang, setLang } = useLocale();
  const resetDeviceInfo = useResetRecoilState(deviceInfoState);
  const [deviceInfo, setDeviceInfo] = useRecoilState(deviceInfoState);
  const [isOpenGoogleAddr, setIsOpenGoogleAddr] = useRecoilState(
    isOpenGoogleAddrState,
  );

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

    hanldeSetApp();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hanldeSetApp = async () => {
    if (!lang) {
      setLang(language);
    }
    const isLogin = utils.getIsLogin();
    if (!isLogin) {
      moveLogin();
    }
    setIsOpenGoogleAddr(false);
    setInitPage(true);
  };

  return (
    <Box position={'relative'} h={'100%'} maxH={'100vh'}>
      <Interceptor />
      <ModalAgent />
      {loading && <Loading />}
      {initPage && children}
      {isOpenGoogleAddr && <GooglePost />}
    </Box>
  );
};

export default WarpPage;
