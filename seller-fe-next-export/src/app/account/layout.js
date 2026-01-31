'use client';

import { Box, Center, Text, VStack } from '@chakra-ui/react';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import { usePathname, useRouter } from 'next/navigation';
import { ACCOUNT } from '@/constants/pageURL';
import { useEffect, useState } from 'react';
import MainHeader from '@/components/custom/header/MainHeader';
import useDevice from '@/hooks/useDevice';

const AccountLayout = ({ children }) => {
  const { isMobile, clampW } = useDevice();
  const pathName = usePathname();
  const router = useRouter();
  const { lang, localeText } = useLocale();

  const [title, setTitle] = useState('');

  useEffect(() => {

  // --- [추가 시작] 브라우저 저장소 강제 청소 로직 ---
    if (typeof window !== 'undefined') {
      // 세션 스토리지를 사용하여 페이지를 닫기 전까지 '딱 한 번'만 실행되도록 함
      const isCleaned = sessionStorage.getItem('account_storage_fixed');
      
      if (!isCleaned) {
        localStorage.clear(); // 꼬여있는 언어/텍스트 설정 삭제
        sessionStorage.setItem('account_storage_fixed', 'true');
        window.location.reload(); // 깨끗한 상태로 새로고침
        return; // 새로고침이 일어날 것이므로 아래 로직은 실행하지 않음
      }
    }
    // --- [추가 끝] ---

    
    console.log(pathName);
    if (pathName === ACCOUNT.LOGIN) {
      setTitle(localeText(LANGUAGES.ACC.LOGIN.LOGIN));
    } else if (pathName === ACCOUNT.FIND) {
      setTitle(localeText(LANGUAGES.ACC.FIND.FIND_ACCOUNT));
    } else if (pathName === ACCOUNT.SIGN_UP) {
      setTitle(localeText(LANGUAGES.ACC.SU.SIGN_UP));
    } else {
      console.log('페이지 못찾음');
    }
  }, [pathName, lang]);

  return isMobile(true) ? (
    <main>
      <Center w={'100%'}>
        <VStack w={'100%'} spacing={0}>
          <MainHeader />

          {/* content */}
          <Box w={'100%'} py={clampW(1.5, 3.5)}>
            <VStack spacing={clampW(1.5, 4)}>
              <Box w={'100%'}>
                <Center w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={clampW(2, 3)}
                    fontStyle={'normal'}
                    fontWeight={400}
                    lineHeight={'4.5rem'}
                  >
                    {title}
                  </Text>
                </Center>
              </Box>

              {children}
            </VStack>
          </Box>
        </VStack>
      </Center>
    </main>
  ) : (
    <main>
      <Center w={'100%'}>
        <VStack w={'100%'} spacing={0}>
          <MainHeader />

          {/* content */}
          <Box w={'100%'} py={'7.5rem'}>
            <VStack spacing={'4rem'}>
              <Box w={'100%'}>
                <Center w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'3rem'}
                    fontStyle={'normal'}
                    fontWeight={400}
                    lineHeight={'4.5rem'}
                  >
                    {title}
                  </Text>
                </Center>
              </Box>

              {children}
            </VStack>
          </Box>
        </VStack>
      </Center>
    </main>
  );
};

export default AccountLayout;
