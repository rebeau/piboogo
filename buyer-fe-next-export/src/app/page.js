'use client';

import { deviceInfoState } from '@/stores/environmentRecoil';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { useRouter } from 'next/navigation';
import { SERVICE } from '@/constants/pageURL';
import { Center, Text } from '@chakra-ui/react';
import MainContainer from '@/components/layout/MainContainer';
import utils from '@/utils';

const App = () => {
  const router = useRouter();
  const deviceInfo = useRecoilValue(deviceInfoState);

  /* 웹 체크 */
  useEffect(() => {
    const setPage = () => {
      if (utils.isMobile(true)) {
        console.log('## mobile');
        router.replace(SERVICE.MAIN.ROOT);
      } else {
        console.log('## web');
        router.replace(SERVICE.MAIN.ROOT);
      }
    };

    setPage();
  }, [deviceInfo]);

  return (
    <MainContainer>
      <Center h={'100vh'}>
        <Text fontSize={'2rem'} fontWeight={500}>
          Loading..
        </Text>
      </Center>
    </MainContainer>
  );
};

export default App;
